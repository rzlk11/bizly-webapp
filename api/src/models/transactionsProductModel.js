import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Products from "./productsModel.js";

const { DataTypes } = Sequelize;

const TransactionsProducts = db.define("transaction_products", {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    transaction_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
            isInt: true,
            min: 1
        },
    },
    price: {
        type: DataTypes.DECIMAL(14, 2),
        allowNull: false,
        validate: {
            notEmpty: true,
            isDecimal: true,
        },
    },
    total_price: {
        type: DataTypes.DECIMAL(14, 2),
        allowNull: false,
        validate: {
            notEmpty: true,
            isDecimal: true,
        },
    },
});

TransactionsProducts.belongsTo(Products, {
    foreignKey: "product_id",
    targetKey: "id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

export default TransactionsProducts;