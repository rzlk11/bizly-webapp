import express from 'express';
import { topSellingProducts } from '../controllers/transactionsProduct.js';

const router = express.Router();

router.get('/top-selling-products', topSellingProducts);

export default router;