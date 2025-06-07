export const validateDateRange = (req, res, next) => {
    const { startDate, endDate } = req.query
    if(startDate&&endDate){
        const start = new Date(startDate)
        const end = new Date(endDate)

        if(end < start){
            return res.status(400).json({ message: "Tanggal selesai tidak boleh lebih awal dari tanggal mulai"})
        }
    }
    next()
}