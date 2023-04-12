const { pool } = require('../connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = require('../jwtSecret');

const registerUser = async (req, res) => {
    const { nome: name, email, senha: password } = req.body;

    const validUser = validateUserInformation(name, email, password);
    if (!validUser) {
        return res.status(400).json({ "mensagem": "Todos os campos são obrigatórios!" })
    }
    try {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const { rowCount } = await pool.query(query, [email]);

        if (rowCount > 0) {
            return res.status(400).json({ "mensagem": "Já existe usuário cadastrado com o e-mail informado." });
        }

        const hashPassword = await bcrypt.hash(password.toString(), 10);

        const insertQuery = `
        INSERT INTO usuarios (nome, email, senha)
        VALUES ($1, $2, $3) RETURNING *
        `;
        const registeredUser = await pool.query(insertQuery, [name, email, hashPassword]);

        const { senha: _, ...user } = registeredUser.rows[0];

        return res.status(201).json(user)
    } catch (error) {
        return res.status(500).jsom(error.message);
    }

}

const loginUser = async (req, res) => {
    const { email, senha: password } = req.body;

    if (!email && !password) {
        return res.status(400).json({ "mensagem": "Email e senha são obrigatorios." });
    }

    try {
        const loginQuery = 'SELECT * FROM usuarios WHERE email = $1';
        const user = await pool.query(loginQuery, [email]);

        if (user.rowCount === 0) {
            return res.status(400).json({
                "mensagem": "Usuário e/ou senha inválido(s)."
            })
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].senha);

        if (!validPassword) {
            return res.status(400).json({ "mensagem": "Email ou senha invalidos" });
        }

        const token = jwt.sign({ id: user.rows[0].id }, secret);

        const { senha: _, ...restUser } = user.rows[0];

        return res.status(200).json({
            usuario: restUser,
            token
        })
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const getUser = async (req, res) => {
    return res.status(200).json(req.user)
}

const updateUser = async (req, res) => {
    const { nome: name, email, senha: password } = req.body;

    const validUser = validateUserInformation(name, email, password);
    if (!validUser) {
        return res.status(400).json({ "mensagem": "Todos os campos são obrigatórios!" })
    }

    try {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const { rowCount } = await pool.query(query, [req.body.email]);
        if (rowCount < 0) {  
            return res.status(400).json({ "mensagem": "O e-mail informado já está sendo utilizado por outro usuário." });
        }

        const hashPassword = await bcrypt.hash(password.toString(), 10);

        const updateQuery = `
        UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4
        `
        const { rowCount: updatedRows } = await pool.query(updateQuery, [name, email, hashPassword, req.user.id]);

        return res.status(204).json(updatedRows);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const validateUserInformation = (name, email, password) => {
    if (!name || !email || !password) {
        return false
    }

    return true;
}

module.exports = {
    registerUser,
    loginUser,
    getUser,
    updateUser
}