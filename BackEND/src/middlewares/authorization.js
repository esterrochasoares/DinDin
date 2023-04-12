const { pool } = require('../connection');
const jwt = require('jsonwebtoken');
const secret = require('../jwtSecret');

const auth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado."
        });
    }
    const token = authorization.split(' ')[1];

    try {

        const { id } = jwt.verify(token, secret);

        const loginQuery = "SELECT * FROM usuarios WHERE id = $1"
        const { rowCount, rows } = await pool.query(loginQuery, [id]);

        if (rowCount <= 0) {
            return res.status(401).json({
                "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado."
            });
        }

        const { senha: _, ...userData } = rows[0];

        req.user = userData

        next()

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

module.exports = {
    auth
}