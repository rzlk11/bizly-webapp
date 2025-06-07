import Categories from "../models/categoriesModel.js";
import Users from "../models/userModel.js";

export const getCategories = async (req, res) => {
    try{
        const where = { user_id: req.userId };
        if (req.query.type) {
            const validTypes = ["Pemasukan", "Pengeluaran"];
            if (!validTypes.includes(req.query.type)) {
                return res.status(400).json({ message: "Tipe kategori tidak valid" });
            }
            where.type = req.query.type;
        }
        const categories = await Categories.findAll({ 
            where,
            attributes: ["id","name", "description" ],
            include: [
                {
                    model: Users,
                    attributes: [
                        "id", "username"
                    ]
                }
            ],
            raw: true,
         });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getIncomeCategories = async (req, res) => {
    try{
        const categories = await Categories.findAll({
            where: {
                user_id: req.userId,
                type: "Pemasukan"
            },
            attributes: ["id", "name", "description"],
            raw: true,
        });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getExpenseCategories = async (req, res) => {
    try{
        const categories = await Categories.findAll({
            where: {
                user_id: req.userId,
                type: "Pengeluaran"
            },
            attributes: ["id", "name", "description"],
            raw: true,
        });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createCategory = async (req, res) => {
    const { name, type, description } = req.body;
    try{
        await Categories.create({
            name,
            type,
            description,
            user_id: req.userId,
        });
        res.status(201).json({ message: "Kategori berhasil ditambahkan" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateCategory = async (req, res) => {
    const { name, type, description } = req.body;
    const id = req.params.id;
    try{
        await Categories.update(
            { name, type, description },
            {
                where: {
                    id,
                    user_id: req.userId,
                }
            }
        );
        res.status(200).json({ message: "Kategori berhasil diupdate" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteCategory = async (req, res) => {
    const id = req.params.id;
    try{
        await Categories.destroy({
            where: {
                id,
                user_id: req.userId,
            }
        });
        res.status(200).json({ message: "Kategori berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}