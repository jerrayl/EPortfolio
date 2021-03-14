const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const config = require('config');
const Portfolio = require('../../models/Portfolio');
const User = require('../../models/User');
const { parseDate } = require('tough-cookie');
const { Redirect } = require('react-router-dom');

/*
 Janky helper functions, to remove when populate is working
*/
const getPortfolios = async (portfolio) => {
  const result = await Portfolio.findById(portfolio._id);
  return result;
};

const getData = async (list) => {
  return Promise.all(list.map((portfolio) => getPortfolios(portfolio)));
};

/*
The calls to edit a user's information
*/
// @route   GET api/user/saved
// @desc    View all saved portfolios of a user
// @access  Private
router.get('/saved', auth, async (req, res) => {
  try {
    // Make sure user exists
    const user = await User.findOne({ googleId: req.user.uid });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const data = await getData(user.saved_portfolios);
    if (data.includes(null)){
      const notNull = data.reduce((a, e, i)=>{if (e !== null){ a.push(i);}return a;}, []);   
      user.saved_portfolios = user.saved_portfolios.reduce((a, e, i) => {if (notNull.includes(i)){ a.push(e);}return a;}, []);
      await user.save();
    }
    // return portfolios
    res.json(["dummy item", ...data.filter((e)=>e!==null)]);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   put api/user/save
// @desc    Saves a portfolio
// @access  Private
router.put('/save', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.body.portfolio);
    // check if portfolio exists
    if (!portfolio) return res.status(404).json({ msg: 'Portfolio not found' });
    // check if user is authorized
    const isAllowed = portfolio.allowedUsers.some(function(user){
      return user.equals(user.id);
    });
    if (portfolio.private && portfolio.user.toString() !== req.user.uid && !(isAllowed)) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    // Make sure user exists
    const user = await User.findOne({ googleId: req.user.uid });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const userUpdated = (user.saved_portfolios.some((e) => String(e._id) === req.body.portfolio)) ?
      await User.findOneAndUpdate(
        { googleId: req.user.uid },
        { $pull: { saved_portfolios:{"_id": mongoose.Types.ObjectId(req.body.portfolio)} } },  { new: true }
        
      )
      :
      await User.findOneAndUpdate(
        { googleId: req.user.uid },
        { $push: { saved_portfolios: portfolio } },  { new: true }
      );
    res.json(userUpdated.saved_portfolios);    
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
