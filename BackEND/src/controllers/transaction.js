const { pool } = require('../connection');

const listLoggedUserTransactions = async (req, res) => {
    try {
        const query = `
            SELECT transacoes.* , categorias.descricao AS categoria_nome FROM transacoes 
            LEFT JOIN categorias 
            ON transacoes.categoria_id = categorias.id
            WHERE transacoes.usuario_id = $1
        `;
        const { rowCount, rows } = await pool.query(query, [req.user.id]);

        if (rowCount === 0) {
            return res.status(200).json([])
        }

        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).jsom(error.message);
    }
}

const detailLoggedUserTransaction = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT transacoes.* , categorias.descricao AS categoria_nome FROM transacoes 
            LEFT JOIN categorias 
            ON transacoes.categoria_id = categorias.id
            WHERE transacoes.id = $1 AND transacoes.usuario_id = $2;
        `
        const { rowCount, rows } = await pool.query(query, [id, req.user.id]);

        if (rowCount <= 0) {
            return res.status(400).json({ "mensagem": "Transação não encontrada." })
        }

        return res.status(200).json(rows[0])
    } catch (error) {
        return res.status(500).jsom(error.message);
    }
}

const registerLoggedUserTransaction = async (req, res) => {
    const { descricao: description, valor: value, data: date, categoria_id: categoryId, tipo: type, usuario_id } = req.body;

    const validTransactionFields = validateTransactionInformation(description, value, date, categoryId, type);
    if (!validTransactionFields) {
        return res.status(400).json({ "mensagem": "Todos os campos obrigatórios devem ser informados." })
    }

    try {
        const categoryQuery = 'SELECT descricao FROM categorias WHERE id = $1';
        const category = await pool.query(categoryQuery, [categoryId]);

        if (category.rowCount === 0) {
            return res.status(400).json({
                "mensagem": "Categoria não encontrada."
            })
        }

        if (type !== 'entrada' && type !== 'saida') {
            return res.status(400).json({ "mensagem": "Tipo de transação não permitida" })
        }

        const insertTransactionQuery = `
        INSERT INTO transacoes (descricao, valor, data, categoria_id, tipo, usuario_id)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        `
        const registeredTransaction = await pool.query(insertTransactionQuery, [description, value, date, categoryId, type, usuario_id]);
        registeredTransaction.rows[0].categoria_nome = category.rows[0].descricao;

        return res.status(200).json(registeredTransaction.rows)
    } catch (error) {
        return console.log(error)
    }
}

const updateLoggedUserTransaction = async (req, res) => {
    const { descricao: description, valor: value, data: date, categoria_id: categoryId, tipo: type, usuario_id } = req.body;
    const { id } = req.params;
    const validTransactionFields = validateTransactionInformation(description, value, date, categoryId, type);
    if (!validTransactionFields) {
        return res.status(400).json({ "mensagem": "Todos os campos obrigatórios devem ser informados." })
    }

    try {
        const categoryQuery = 'SELECT descricao FROM categorias WHERE id = $1';
        const category = await pool.query(categoryQuery, [categoryId]);

        if (category.rowCount === 0) {
            return res.status(400).json({
                "mensagem": "Categoria não encontrada."
            })
        }

        if (type !== 'entrada' && type !== 'saida') {
            return res.status(400).json({ "mensagem": "Tipo de transação não permitida" })
        }

        const updateTransactionQuery = `
        UPDATE transacoes SET descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5
        WHERE id = $6
        RETURNING *
        `
        const registeredTransaction = await pool.query(updateTransactionQuery, [description, value, date, categoryId, type, id]);
        registeredTransaction.rows[0].categoria_nome = category.rows[0].descricao;

        return res.status(200).json(registeredTransaction.rows)
    } catch (error) {
        return console.log(error)
    }
}

const deleteLoggedUserTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            DELETE FROM transacoes
            WHERE id = $1
        `
        const { rowCount, rows } = await pool.query(query, [id]);

        if (rowCount <= 0) {
            return res.status(400).json({ "mensagem": "Transação não encontrada." })
        }

        return res.status(200).json(rows[0])
    } catch (error) {
        return res.status(500).jsom(error.message);
    }
}

const validateTransactionInformation = (description, value, date, categoryId, type) => {
    if (!description || !value || !date || !categoryId || !type) {
        return false;
    }

    return true;
}

module.exports = {
    listLoggedUserTransactions,
    detailLoggedUserTransaction,
    registerLoggedUserTransaction,
    updateLoggedUserTransaction,
    deleteLoggedUserTransaction
}