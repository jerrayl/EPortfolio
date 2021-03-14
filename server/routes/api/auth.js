const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route   GET api/auth
// @desc    Return user info (test)
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findOne({ googleId: req.user.uid });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth
// @desc    Register/login user
// @access  Public
router.post('/', auth, async (req, res, next) => {
  try {
    User.findOne({ googleId: req.user.uid }).then(function (user) {
      if (!user) {
        User = new User({
          name: req.user.name,
          email: req.user.email,
          googleId: req.user.uid,
          avatar: req.user.picture,
        }).save();
      }
      else {
        user.avatar = req.user.picture;
        user.save();
      }
    });
    const token = req.header('x-auth-token');
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
