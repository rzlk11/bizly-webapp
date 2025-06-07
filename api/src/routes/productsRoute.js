import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct, getProductById } from '../controllers/products.js';
import { verifyUser } from '../middlewares/authUser.js';

const router = express.Router();

router.get('/', verifyUser, getProducts);
router.post('/', verifyUser, createProduct);
router.put('/:id', verifyUser, updateProduct);
router.delete('/:id', verifyUser, deleteProduct);
router.get('/:id', verifyUser, getProductById);

export default router;