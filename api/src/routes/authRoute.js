import express from "express";
import { login, logout, me, requestPasswordReset, verifyOTP, resetPassword } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.delete("/logout", logout);
router.get("/me", me);
router.post('/request-reset', requestPasswordReset);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

export default router;
