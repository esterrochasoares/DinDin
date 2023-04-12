const express = require('express');
const { getAllCategories } = require('../controllers/category');
const { listLoggedUserTransactions, detailLoggedUserTransaction, registerLoggedUserTransaction, updateLoggedUserTransaction, deleteLoggedUserTransaction } = require('../controllers/transaction');
const { registerUser, loginUser, getUser, updateUser } = require('../controllers/user');
const { auth } = require('../middlewares/authorization');

const router = express();

router.post('/usuario', registerUser);
router.post('/login', loginUser);

router.use(auth);

router.get('/usuario', getUser);
router.put('/usuario', updateUser);
router.get('/categoria', getAllCategories);
router.get('/transacao', listLoggedUserTransactions);
router.get('/transacao/:id', detailLoggedUserTransaction);
router.post('/transacao', registerLoggedUserTransaction);
router.put('/transacao/:id', updateLoggedUserTransaction);
router.delete('/transacao/:id', deleteLoggedUserTransaction);

module.exports = {
    router
}