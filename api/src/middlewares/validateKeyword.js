export const validateSearchInput = (req, res, next) => {
    const { keyword } = req.query;

    if (keyword && keyword.length > 100) {
        return res.status(400).json({ message: "Keyword terlalu panjang. Maksimal 100 karakter." });
    }

    next();
};