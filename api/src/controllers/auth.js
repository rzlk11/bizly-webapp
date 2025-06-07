import Users from "../models/userModel.js";
import argon2 from "argon2";
import { sendOTP, verifyOTP as validateOTP } from '../service/otpService.js';

export const login = async (req, res) => {
    const user = await Users.findOne({
        where: {
            email: req.body.email
        }
    });
    if(!user) return res.status(404).json({error: "User not found"});

    const match = await argon2.verify(user.password, req.body.password);
    if(!match) return res.status(400).json({error: "Wrong Password"});

    console.log('User object retrieved:', user.toJSON());
    console.log('Value of user.id BEFORE session set:', user.id);

    console.log('Before setting req.session.userId:', req.session);
    req.session.userId = user.id;
    console.log('After setting req.session.userId:', req.session);

    // Explicitly check the headers before sending
    console.log('Headers before sending response (from inside req.session.save):', res.getHeaders());
    console.log('Are headers already sent?', res.headersSent);


    req.session.save((err) => {
        if (err) {
            console.error('Error saving session:', err);
            return res.status(500).json({ error: "Session save failed" });
        }
        console.log('Session saved successfully. About to send response...');

        // Final check on headers just before res.status().json()
        console.log('Headers just before res.status().json():', res.getHeaders());
        console.log('Are headers already sent (final check)?', res.headersSent);


        const id = user.id;
        const username = user.username;
        const email = user.email;
        res.status(200).json({id, username, email});
    });
};

export const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(400).json({ error: "Logout gagal" });
    }
    res.status(200).json({ message: "Logout berhasil" });
  });
};

export const me = async (req, res) => {
    if(!req.session.userId){
        return res.status(401).json({ error: 'Login ke akun anda terlebih dahulu'})
    }
    const user = await Users.findOne({
        attributes: ['id', 'username', 'email'],
        where: {
            id: req.session.userId
        }
    })
    if (!user) {
    return res.status(404).json({ error: "User tidak ditemukan " });
    }
    return res.status(200). json({ message: "Login berhasil"})
}

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Users.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Email tidak ditemukan' });

    const otpInfo = await sendOTP(email);
    res.status(200).json({ message: 'OTP telah dikirim', ...otpInfo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, code } = req.body;
  try {
    validateOTP(email, code);
    res.status(200).json({ message: 'OTP valid' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    // validateOTP(email, code);

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'Password minimal 8 karakter' });
    }

    const hash = await argon2.hash(newPassword);
    await Users.update({ password: hash }, { where: { email } });

    res.status(200).json({ message: 'Password berhasil direset' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};