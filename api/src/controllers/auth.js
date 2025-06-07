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

    // --- TEMPORARY TEST: DO NOT USE express-session HERE ---
    // Instead, try to set a simple cookie directly using res.cookie()
    // This bypasses express-session entirely.

    res.cookie(
        'test_cookie', // Name of the cookie
        'some_value_for_test', // Value of the cookie
        {
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            httpOnly: true,
            secure: true,      // Keep true as your frontend is HTTPS
            sameSite: 'none',  // Keep none as your frontend is cross-origin
            domain: '.up.railway.app' // IMPORTANT: Set domain to your backend's top-level domain
        }
    );

    // Also, try res.setHeader directly for debugging purposes to see if it shows up
    res.setHeader('X-Custom-Header', 'Hello-From-Server');

    console.log('--- TEST LOGS ---');
    console.log('User logged in, attempting to set test cookie.');
    console.log('Headers just before res.status().json() (Test):', res.getHeaders());
    console.log('Are headers already sent (Test)?', res.headersSent);
    console.log('--- END TEST LOGS ---');

    const id = user.id;
    const username = user.username;
    const email = user.email;
    res.status(200).json({id, username, email});

    // You can comment out req.session.save() for this test, as we are bypassing session
    // If you keep req.session.save(), the above res.cookie() might conflict or be overwritten
    // by express-session if it decides to finally send its own cookie.
    // For this test, it's best to comment out the entire app.use(session(...)) block in index.js
    // to ensure express-session is not interfering.
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