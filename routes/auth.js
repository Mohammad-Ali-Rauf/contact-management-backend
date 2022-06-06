const express = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');

// Import Models
const User = require("../models/User");

// Import Middlewares
const auth = require('../middleware/auth');

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').select('-__v')
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth
// @desc    Authorize user and get the token
// @access  Public
router.post('/', [
    check('email', 'Please enter a vaild email').isEmail(),
    check('password', 'Password is Required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if(!user) {
        return res.status(400).json({ msg: 'User not found' })
      }

      const Matched = await bcrypt.compare(password, user.password);

      if(!Matched) {
        return res.status(400).json({ msg: 'Incorrect Password' })
      }

      const payload = {
          user: {
              id: user.id,
          }
      }

      jwt.sign(payload, config.get('jwtSecret'), {
        expiresIn: 9000000000
      }, (err, token) => {
          if(err) throw err;
          res.json({ token })
      })

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
  }
)

module.exports = router;