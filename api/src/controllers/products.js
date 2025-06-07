import Products from "../models/productsModel.js";

export const createProduct = async (req, res) => {
    const { name, description, price } = req.body;
    try {
        await Products.create({
            name,
            description,
            price,
            user_id: req.userId,
        });
        res.status(201).json({ message: "Produk berhasil ditambahkan" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getProducts = async (req, res) => {
    try {
        const products = await Products.findAll({
            attributes: [
                "id",
                "name",
                "description",
                "price",
                "createdAt",
                "updatedAt"
            ],
            where: {
                user_id: req.userId,
            },
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateProduct = async (req, res) => {
    const { name, description, price } = req.body;
    const id = req.params.id;
    try {
        await Products.update(
            { name, description, price },
            {
                where: {
                    id,
                    user_id: req.userId,
                }
            }
        );
        res.status(200).json({ message: "Produk berhasil diupdate" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        await Products.destroy({
            where: {
                id,
                user_id: req.userId,
            }
        });
        res.status(200).json({ message: "Produk berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getProductById = async (req, res) => {
    const id = req.params.id;
    try {
        const product = await Products.findOne({
            where: {
                id,
                user_id: req.userId,
            },
            attributes: [
                "id",
                "name",
                "description",
                "price",
                "createdAt",
                "updatedAt"
            ],
        });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}