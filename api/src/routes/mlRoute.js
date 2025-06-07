import express from 'express';
import { analyzeBusiness, predictSales } from '../controllers/ml.js';
import { verifyUser } from '../middlewares/authUser.js';

const router = express.Router();

router.get('/analyze', verifyUser, analyzeBusiness);
router.get('/predict', verifyUser, predictSales);

export default router;