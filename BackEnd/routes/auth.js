const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// User Registration
router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, mobile, password, role } = req.body;
  try {
      // Check if user exists
      let user = await User.findOne({ email });
      console.log("Already exist...............", user);
      if (user) {
          return res.status(400).json({ message: 'User already exists' });
      }

      // Create a new user
      user = new User({
          firstName,
          lastName,
          email,
          mobile,
          password: await bcrypt.hash(password, 10),
          role
      });

      console.log(user); // Debugging line to see the created user object

      await user.save();

      res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
      console.error('Server error:', err); // Log server errors for debugging
      res.status(500).json({ message: 'Server error' });
  }
});

// User Login
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
    // console.log("nk0");
    try {
        // Check if user exists
        const user = await User.findOne({ email, role });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id }, 'yourSecretKey', { expiresIn: '1h' });
        res.status(201).json({ message: 'Login successfully'  ,token: token});

        // res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// List All Users (Protected Route)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclude passwords
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

//check-email
// Check if email exists
router.get('/check-email', async (req, res) => {
    const { email } = req.query; // Get email from query params

    try {
        // Check if a user with the email exists
        const user = await User.findOne({ email });

        // If user exists, return true, otherwise false
        if (user) {
            return res.status(200).json(true); // Email is taken
        } else {
            return res.status(200).json(false); // Email is available
        }
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


// Check if mobile number exists
router.get('/check-mobile', async (req, res) => {
    const { mobile } = req.query; // Get mobile number from query params

    try {
        // Check if a user with the mobile number exists
        const user = await User.findOne({ mobile });

        // If user exists, return true, otherwise false
        if (user) {
            return res.status(200).json(true); // Mobile number is taken
        } else {
            return res.status(200).json(false); // Mobile number is available
        }
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
