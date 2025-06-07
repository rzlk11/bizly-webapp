import TransactionsProducts from "../models/transactionsProductModel.js";
import Products from "../models/productsModel.js";
import { Sequelize } from "sequelize";

export const topSellingProducts = async (req, res) => {
    try{
        const topProducts = await TransactionsProducts.findAll({
            attributes: [
                'product_id',
                [Sequelize.fn('SUM', Sequelize.col('quantity')), 'total_quantity'],
                [Sequelize.fn('SUM', Sequelize.col('total_price')), 'total_price'],
            ],
            include: [
                {
                    model: Products,
                    attributes: ['name'],
                },
            ],
            group: ['product.name'],
            order: [[Sequelize.col('total_quantity'), 'DESC']],
            limit: 3,
        });
        res.status(200).json(topProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};