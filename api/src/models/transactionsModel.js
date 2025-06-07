import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Users from "./userModel.js";
import Categories from "./categoriesModel.js";
import TransactionsProducts from "./transactionsProductModel.js";

const { DataTypes } = Sequelize;

const Transactions = db.define("transactions", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  type: {
    type: DataTypes.ENUM("Pemasukan", "Pengeluaran"),
    allowNull: false,
    validate: {
      notEmpty: true,
      isIn: [["Pemasukan", "Pengeluaran"]],
    },
  },
  amount: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: false,
    validate: {
      notEmpty: true,
      isDecimal: true,
    },
  },
  transaction_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 100],
    },
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: true,
    },
  },
  transaction_date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: true,
      isDate: true,
    },
  },
});

Transactions.belongsTo(Users, {
  foreignKey: "user_id",
  targetKey: "id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Transactions.belongsTo(Categories, {
  foreignKey: "category_id",
  targetKey: "id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Transactions.hasMany(TransactionsProducts, {
  foreignKey: "transaction_id",
  sourceKey: "id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

if (typeof TransactionsProducts.associations.transaction === 'undefined') {
  TransactionsProducts.belongsTo(Transactions, {
    foreignKey: "transaction_id",
    targetKey: "id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
}

export default Transactions