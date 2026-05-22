const express = require('express');
const router = express.Router();
const supabaseAdmin = require('../utils/supabase');

// ==========================================
// REGISTRATION ENDPOINTS
// ==========================================

// Email/Password Registration
router.post('/register/email', async (req, res) => {

  const { name, email, password } = req.body;

  if (!email || !password) {

    return res.status(400).json({
      error: 'Email and password are required'
    });

  }

  try {

    // ADMIN CREATE USER
    const { data, error } =
      await supabaseAdmin.auth.admin.createUser({

        email: email,

        password: password,

        user_metadata: {
          name: name
        },

        // AUTO VERIFY
        email_confirm: true

      });

    if (error) throw error;

    res.status(200).json({

      message: 'User registered successfully',

      data

    });

  } catch (error) {

    res.status(400).json({

      error: error.message

    });

  }

});

// ==========================================
// MOBILE OTP SEND
// ==========================================

router.post('/register/otp/send', async (req, res) => {

  const { phone } = req.body;

  if (!phone) {

    return res.status(400).json({
      error: 'Phone number is required'
    });

  }

  try {

    const { data, error } =
      await supabaseAdmin.auth.signInWithOtp({

        phone: phone,

      });

    if (error) throw error;

    res.status(200).json({

      message: 'OTP sent successfully',

      data

    });

  } catch (error) {

    res.status(400).json({

      error: error.message

    });

  }

});

// ==========================================
// OTP VERIFY
// ==========================================

router.post('/register/otp/verify', async (req, res) => {

  const { phone, token } = req.body;

  if (!phone || !token) {

    return res.status(400).json({

      error:
        'Phone number and OTP token are required'

    });

  }

  try {

    const { data, error } =
      await supabaseAdmin.auth.verifyOtp({

        phone,

        token,

        type: 'sms',

      });

    if (error) throw error;

    res.status(200).json({

      message: 'OTP verified successfully',

      data

    });

  } catch (error) {

    res.status(400).json({

      error: error.message

    });

  }

});

// ==========================================
// LOGIN
// ==========================================

router.post('/login/email', async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {

    return res.status(400).json({

      error: 'Email and password are required'

    });

  }

  try {

    const { data, error } =
      await supabaseAdmin.auth.signInWithPassword({

        email,

        password,

      });

    if (error) throw error;

    res.status(200).json({

      message: 'Login successful',

      session: data.session,

      user: data.user

    });

  } catch (error) {

    res.status(400).json({

      error: error.message

    });

  }

});

module.exports = router;