import Users from "../models/userModel.js";
import argon2 from "argon2";
import Sequelize from "sequelize";
import Categories from "../models/categoriesModel.js";

export const createUser = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Password tidak sama" });
  }

  try {
    const existingUser = await Users.findOne({
      where: {
        [Sequelize.Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res
        .status(403)
        .json({ message: "Username atau email telah digunakan" });
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = await Users.create({
      username,
      email,
      password: hashedPassword,
    });

    const defaultCategories = [
      { name: "Penjualan Produk", type: "Pemasukan", description: "Pendapatan dari penjualan produk" },
      { name: "Pendapatan Jasa", type: "Pemasukan", description: "Pendapatan dari layanan" },
      { name: "Pendapatan Online", type: "Pemasukan", description: "Pendapatan dari platform online" },
      { name: "Pendapatan Reseller", type: "Pemasukan", description: "Pendapatan dari reseller" },
      { name: "Pendapatan Lainnya", type: "Pemasukan", description: "Pendapatan lain yang tidak tercategorikan" },
      { name: "Pembelian Bahan Baku", type: "Pengeluaran", description: "Biaya untuk bahan baku" },
      { name: "Biaya Produksi", type: "Pengeluaran", description: "Biaya produksi barang" },
      { name: "Gaji Karyawan", type: "Pengeluaran", description: "Gaji yang dibayarkan kepada karyawan" },
      { name: "Sewa Tempat", type: "Pengeluaran", description: "Biaya sewa tempat usaha" },
      { name: "Listrik & Air", type: "Pengeluaran", description: "Biaya utilitas seperti listrik dan air" },
      { name: "Biaya Transportasi", type: "Pengeluaran", description: "Biaya transportasi untuk operasional" },
      { name: "Biaya Promosi", type: "Pengeluaran", description: "Biaya untuk promosi dan iklan" },
      { name: "Peralatan & Inventaris", type: "Pengeluaran", description: "Pembelian peralatan dan inventaris" },
      { name: "Biaya Internet & Komunikasi", type: "Pengeluaran", description: "Biaya internet dan komunikasi bisnis" },
      { name: "Pajak & Iuran", type: "Pengeluaran", description: "Pembayaran pajak dan iuran lainnya" },
      { name: "Lain-lain", type: "Pengeluaran", description: "Pengeluaran lain yang tidak tercategorikan" },
    ];

    const categoriesWithUser = defaultCategories.map((cat) => ({
      ...cat,
      user_id: newUser.id,
    }));
    await Categories.bulkCreate(categoriesWithUser);

    res.status(201).json({ message: "Registrasi berhasil" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await Users.findOne({
      attributes: ["id", "username", "email"],
      where: {
        id: req.params.id,
      },
    });
    if (!user) {
      res.status(404).json({ error: `User dengan id: ${req.params.id} tidak ditemukan` });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { username } = req.body;

  if (!username || username.trim() === "") {
    return res.status(400).json({ error: "Username tidak boleh kosong" });
  }

  try {
    const user = await Users.findOne({
      where: { id: req.params.id },
    });

    if (!user) {
      return res
        .status(404)
        .json({ error: `User dengan id: ${req.params.id} tidak ditemukan` });
    }

    await Users.update({ username }, { where: { id: req.params.id } });

    res.status(200).json({ message: "Username berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await Users.findOne({
    where: { id: req.params.id },
  });
  if (!user) {
    return res
      .status(404)
      .json({ error: `User with id: ${req.params.id} not found` });
  }
  try {
    await Users.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json("User deleted");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};