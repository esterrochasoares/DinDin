const { pool } = require('../connection');

const getAllCategories = async (req, res) => {
    try {
        const query = 'SELECT * FROM categorias';
        const { rowCount, rows } = await pool.query(query);

        if (rowCount <= 0) {
            return res.status(400).json({ "mensagem": "Registros não encotrado." })
        }

        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).jsom(error.message);
    }
}

module.exports = {
    getAllCategories
}