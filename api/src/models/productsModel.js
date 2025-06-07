import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Users from "./userModel.js";

const { DataTypes } = Sequelize;

const Products = db.define("products", {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    name: {
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
    price: {
        type: DataTypes.DECIMAL(14, 2),
        allowNull: false,
        validate: {
            notEmpty: true,
            isDecimal: true,
        },
    },
});

Products.belongsTo(Users, {
    foreignKey: "user_id",
    targetKey: "id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

export default Products;