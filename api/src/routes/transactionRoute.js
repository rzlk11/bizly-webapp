import express from 'express';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction, filterTransactions, searchTransactions, transactionSummary, transactionsByDate, getTransactionById } from '../controllers/transactions.js';
import { validateDateRange } from '../middlewares/validateDate.js';
import { validateSearchInput } from '../middlewares/validateKeyword.js';
import { verifyUser } from '../middlewares/authUser.js';

const router = express.Router();

router.get('/', verifyUser, getTransactions);
router.post('/', verifyUser, createTransaction);
router.put('/:id', verifyUser, updateTransaction);
router.delete('/:id', verifyUser, deleteTransaction);
router.get('/filter', verifyUser, validateDateRange, filterTransactions)
router.get('/search', verifyUser, validateSearchInput, searchTransactions)
router.get('/summary', verifyUser, transactionSummary)
router.get('/calendar/:date', verifyUser, transactionsByDate)
router.get('/:id', verifyUser, getTransactionById);

export default router;