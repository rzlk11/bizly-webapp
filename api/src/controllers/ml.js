import Transactions from '../models/transactionsModel.js';
import axios from 'axios';
import { Op } from 'sequelize';
// import { format, subDays } from 'date-fns'; //

// Helper: Format date to YYYY-MM-DD
const formatDate = (date) => date.toISOString().slice(0, 10);

export const analyzeBusiness = async (req, res) => {
    try {
        if (!req.userId) return res.status(400).json({ error: 'User not authenticated' });

        const transactions = await Transactions.findAll({
            where: { user_id: req.userId },
            attributes: ['amount', 'type', 'transaction_date'],
            raw: true
        });
        // Hitung total pemasukan dan pengeluaran
        let pemasukan = 0;
        let pengeluaran = 0;
        let jumlah_transaksi = transactions.length;
        // Hitung hari rugi
        const daily = {};
        transactions.forEach(trx => {
            const date = formatDate(new Date(trx.transaction_date));
            if (!daily[date]) daily[date] = { pemasukan: 0, pengeluaran: 0 };
            if (trx.type === 'Pemasukan') {
                pemasukan += Number(trx.amount);
                daily[date].pemasukan += Number(trx.amount);
            } else if (trx.type === 'Pengeluaran') {
                pengeluaran += Number(trx.amount);
                daily[date].pengeluaran += Number(trx.amount);
            }
        });
        let jumlah_hari_rugi = 0;
        Object.values(daily).forEach(day => {
            if (day.pemasukan < day.pengeluaran) jumlah_hari_rugi++;
        });
        // Kirim ke API ML
        const response = await axios.post(
            'https://bizly.rafess.my.id/analyze',
            { pemasukan, pengeluaran, jumlah_transaksi, jumlah_hari_rugi },
            { headers: { 'Content-Type': 'application/json' } }
        );
        res.json(response.data);
    } catch (err) {
        console.error('analyzeBusiness error:', err);
        res.status(err.response?.status || 500).json(err.response?.data || { error: 'Terjadi kesalahan pada server' });
    }
};

export const predictSales = async (req, res) => {
    try {
        if (!req.userId) return res.status(400).json({ error: 'User not authenticated' });

        const n_days = 7;
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - n_days + 1);

        const transactions = await Transactions.findAll({
            where: {
                user_id: req.userId,
                type: 'Pemasukan',
                transaction_date: { [Op.between]: [startDate, today] }
            },
            attributes: ['amount', 'transaction_date'],
            raw: true
        });

        // Kelompokkan dan jumlahkan total_sales per hari
        const salesByDate = {};
        for (const trx of transactions) {
            const date = formatDate(new Date(trx.transaction_date));
            if (!salesByDate[date]) salesByDate[date] = 0;
            salesByDate[date] += Number(trx.amount);
        }
        // Buat array 7 hari terakhir (urut tanggal naik)
        const salesData = [];
        for (let i = 0; i < n_days; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            const dateStr = formatDate(d);
            salesData.push({
                date: dateStr,
                total_sales: salesByDate[dateStr] || 0
            });
        }

        // Kirim ke API ML eksternal
        const response = await axios.post(
            `https://bizly.rafess.my.id/predict?n_days=${n_days}`,
            salesData,
            { headers: { 'Content-Type': 'application/json' } }
        );
        res.json(response.data);
    } catch (err) {
        console.error('predictSales error:', err);
        res.status(err.response?.status || 500).json(err.response?.data || { error: 'Terjadi kesalahan pada server' });
    }
};
