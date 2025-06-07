import Users from "../models/userModel.js";
import Transactions from "../models/transactionsModel.js";
import Categories from "../models/categoriesModel.js";
import { Op } from "sequelize";
import TransactionsProducts from "../models/transactionsProductModel.js";
import Products from "../models/productsModel.js";
import sequelize from "sequelize";

export const getTransactions = async (req, res) => {
  try {
    const where = { user_id: req.userId };
    if (req.query.type) {
      const validTypes = ["Pemasukan", "Pengeluaran"];
      if (!validTypes.includes(req.query.type)) {
        return res.status(400).json({ message: "Tipe transaksi tidak valid" });
      }
      where.type = req.query.type;
    }
    const transactions = await Transactions.findAll({
      where,
      attributes: [
        "id",
        "user_id",
        "category_id",
        "transaction_name",
        "amount",
        "description",
        "type",
        "transaction_date",
      ],
      include: [
        {
          model: Users,
          attributes: ["username"],
        },
        {
          model: Categories,
          attributes: ["name"],
        },
        {
          model: TransactionsProducts,
          attributes: ["quantity", "price", "total_price"],
          include: [
            {
              model: Products,
              attributes: ["name"],
            },
          ],
        },
      ],
      raw: true,
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTransaction = async (req, res) => {
  const {
    transaction_name,
    amount,
    description,
    type,
    transaction_date,
    category_id,
    products,
  } = req.body;

  try {
    const transaction = await Transactions.create({
      transaction_name,
      amount,
      description,
      type,
      transaction_date,
      category_id,
      user_id: req.userId,
    });

    if (type === "Pemasukan" && products && products.length > 0) {
      const transactionProducts = products.map((product) => ({
        transaction_id: transaction.id,
        product_id: product.product_id,
        quantity: product.quantity,
        price: product.price,
        total_price: product.quantity * product.price,
      }));

      await TransactionsProducts.bulkCreate(transactionProducts);
    }

    res.status(201).json({ message: "Transaksi berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  const { transaction_name, amount, description, type, transaction_date, category_id } = req.body;
  const id = req.params.id;
  try {
    await Transactions.update(
      { transaction_name, amount, description, type, transaction_date, category_id },
      {
        where: {
          id,
          user_id: req.userId,
        },
      }
    );
    const updatedTransaction = await Transactions.findOne({
        where: { id, user_id: req.userId },
        attributes: [
        "id",
        "user_id",
        "category_id",
        "transaction_name",
        "amount",
        "description",
        "type",
        "transaction_date",
      ],
      })
    res.status(200).json({ message: "Transaksi berhasil diupdate", data: updatedTransaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  const id = req.params.id;
  try {
    await Transactions.destroy({
      where: {
        id,
        user_id: req.userId,
      },
    });
    res.status(200).json({ message: "Transaksi berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransactionById = async (req, res) => {
  const id = req.params.id;
  try {
    const transaction = await Transactions.findOne({
      where: {
        id,
        user_id: req.userId,
      },
      attributes: [
        "transaction_name",
        "amount",
        "description",
        "type",
        "transaction_date",
        "category_id",
      ],
      include: [
        {
          model: Users,
          attributes: ["username"],
        },
        {
          model: Categories,
          attributes: ["name"],
        },
      ],
      raw: true,
    });
    if (!transaction)
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const filterTransactions = async (req, res) => {
  const { startDate, endDate, categoryId, productId } = req.query;
  const where = { user_id: req.userId };

  if (startDate && endDate) {
    where.transaction_date = {
      [Op.between]: [new Date(startDate), new Date(endDate)],
    };
  }

  if (categoryId) {
    where.category_id = categoryId;
  }

  try {
    const transactions = await Transactions.findAll({
      where,
      include: [
        {
          model: Categories,
          attributes: ["name"],
        },
        {
          model: TransactionsProducts,
          attributes: ["quantity", "price", "total_price"],
          where: productId ? { product_id: productId } : undefined,
          include: [
            {
              model: Products,
              attributes: ["name"],
            },
          ],
        },
      ],
      attributes: [
        "transaction_name",
        "amount",
        "transaction_date",
        "description",
      ],
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchTransactions = async (req, res) => {
  const { keyword } = req.query;
  const where = { user_id: req.userId };
  if (keyword) {
    where.transaction_name = {
      [Op.like]: `%${keyword}%`,
    };
  }
  try {
    const transaction = await Transactions.findAll({
      where,
      attributes: [
        "transaction_name",
        "amount",
        "transaction_date",
        "description",
      ],
      include: [
        {
          model: Categories,
          attributes: ["name"],
        },
      ],
    });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const transactionSummary = async (req, res) => {
  const where = { user_id: req.userId };
  const { period } = req.query;
  try {
    let groupBy;
    if (period === "weekly") {
      groupBy = [
        sequelize.fn("date_part","YEAR", sequelize.col("transaction_date")),
        sequelize.fn("date_part","WEEK", sequelize.col("transaction_date")),
      ];
    } else if (period === "monthly") {
      groupBy = [
        sequelize.fn("date_part","YEAR", sequelize.col("transaction_date")),
        sequelize.fn("date_part","MONTH", sequelize.col("transaction_date")),
      ];
    } else {
      return res.status(400).json({ message: "Invalid period" });
    }
  ;
    const summary = await Transactions.findAll({
      where,
      attributes: [
         [
           sequelize.fn(
             "SUM",
             sequelize.literal(
               `CASE WHEN type = 'Pemasukan' THEN amount ELSE 0 END`
             )
           ),
           "total_income",
         ],
         [
           sequelize.fn(
             "SUM",
             sequelize.literal(
               `CASE WHEN type = 'Pengeluaran' THEN amount ELSE 0 END`
             )
           ),
           "total_expense",
         ],
          [
          sequelize.literal(
            `SUM(CASE WHEN type = 'Pemasukan' THEN amount ELSE 0 END) - SUM(CASE WHEN type = 'Pengeluaran' THEN amount ELSE 0 END)`
          ),
            "net_profit_loss"
          ],
         [sequelize.fn("date_part","YEAR", sequelize.col("transaction_date")), "year"],
         period === "weekly"
           ? [sequelize.fn("date_part","WEEK", sequelize.col("transaction_date")), "week"]
           : [sequelize.fn("date_part","MONTH", sequelize.col("transaction_date")), "month"],
      ],
      group: groupBy,
      raw: true,
    });
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const transactionsByDate = async (req, res) => {
  const { date } = req.params;
  const where = {
    user_id: req.userId,
    transaction_date: {
      [Op.eq]: new Date(date),
    },
  };

  try {
    const transactions = await Transactions.findAll({
      where,
      attributes: [
        "transaction_name",
        "amount",
        "description",
        "type",
        "transaction_date",
      ],
      include: [
        {
          model: Categories,
          attributes: ["name"],
        },
        {
          model: TransactionsProducts,
          attributes: ["quantity", "price", "total_price"],
          include: [
            {
              model: Products,
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    const income = transactions
      .filter((t) => t.type === "Pemasukan")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter((t) => t.type === "Pengeluaran")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    res.status(200).json({
      date,
      income,
      expense,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
