const express = require('express');
const router = express.Router();
const supabaseAdmin = require('../utils/supabase');

// ==========================================
// PERSON 1: REGISTRATION ENDPOINTS
// ==========================================

// 1. Email/Password Registration
router.post('/register/email', async (req, res) => {
  const { email, password, metadata } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // We use the admin API to create users directly from the backend
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: metadata,
      email_confirm: true // Assuming auto-confirm for B2B simplicity, or false if you want them to verify
    });

    if (error) throw error;
    res.status(200).json({ message: 'User registered successfully', data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 2. Mobile OTP Send (Works for Registration & Login)
router.post('/register/otp/send', async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    const { data, error } = await supabaseAdmin.auth.signInWithOtp({
      phone: phone,
    });

    if (error) throw error;
    res.status(200).json({ message: 'OTP sent successfully', data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 3. Mobile OTP Verify
router.post('/register/otp/verify', async (req, res) => {
  const { phone, token } = req.body;

  if (!phone || !token) {
    return res.status(400).json({ error: 'Phone number and OTP token are required' });
  }

  try {
    const { data, error } = await supabaseAdmin.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });

    if (error) throw error;
    res.status(200).json({ message: 'OTP verified successfully', data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==========================================
// PERSON 2: LOGIN ENDPOINTS
// ==========================================

// 4. Email/Password Login
router.post('/login/email', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    // We send back the session so the frontend can securely store the JWT token
    res.status(200).json({ message: 'Login successful', session: data.session, user: data.user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
