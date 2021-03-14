const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const config = require('config');
const puppeteer = require('puppeteer');

const Portfolio = require('../../models/Portfolio');
const User = require('../../models/User');
const { parseDate } = require('tough-cookie');
const { Redirect } = require('react-router-dom');
const { cloneElement } = require('react');

/*
The calls to create/edit/delete portfolio 
need to be added here, the following is
temporary for implementing blog and comments
*/

/*
 Janky helper functions, to remove when populate is working
*/
const cloneItem = async (item, portfolioID, pageID) => {
  const templateItem = await Item.findById(item._id);
  const newItem = new Item({
    portfolio: portfolioID,
    pageid: pageID,
    private: templateItem.private,
    title: templateItem.title,
    subtitle: templateItem.subtitle,
    paragraph: templateItem.paragraph,
    mediaLink: templateItem.mediaLink,
    mediaType: templateItem.mediaType,
    linkText: templateItem.linkText,
    linkAddress: templateItem.linkAddress,
    row: templateItem.row,
    column: templateItem.column,
  });
  return await newItem.save();
};

const cloneItems = async (page, portfolioID, pageID) => {
  page.items = await Promise.all(page.items.map((item) => cloneItem(item, portfolioID, pageID)));
  return page;
}

// @route   GET api/portfolio
// @desc    Test route
// @access  Public
router.get('/', async (req, res) => {
  try {
    const portfolio = await Portfolio.find();
    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/portfolio
// @desc    Create a portfolio
// @access  Private
router.post(
  '/',
  [auth, [check('name', 'Portfolios must have a name').not().isEmpty()]],
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
    
    try {
      let newPortfolio = new Portfolio({
        name: req.body.name,
        user: req.user.uid,
        private: req.body.private,
      });
      if (req.body.template === "blank"){
        newPortfolio.pages = [{
          name: 'Home',
          url: 'Home',
          main: true
        }]
      }
      else {
        const template = await Portfolio.find({ user: config.get('templateAccount'), _id: req.body.template}).exec();
        newPortfolio.pages = template[0].pages.map(page => {return {main:page.main, items:page.items, name:page.name, url:page.url}});
        newPortfolio.pages = await Promise.all(newPortfolio.pages.map(async(page) => {return await cloneItems(page, newPortfolio._id, page._id)}));
      }
      const portfolio = await newPortfolio.save();
      Portfolio.findOne({_id: portfolio._id})
        .exec(function (err, portfolio) {
          if (err) return res.status(500).send('Server Error');
        });
      res.json(portfolio);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/portfolio/single/:id
// @desc    Get portfolio by Portfolio ID
// @access  Private
router.get('/single/:id', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ msg: 'Portfolio not found' });
    const user = await User.findOne({ googleId: req.user.uid });
    // check that user is authorized
    const isAllowed = portfolio.allowedUsers.some(function(allowedUser){
      return allowedUser.email.trim() === user.email.trim();
    });
    if (
      portfolio.private &&
      portfolio.user.toString() !== req.user.uid &&
      !(isAllowed)
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/portfolio/guest/:id
// @desc    Get portfolio by Portfolio ID for non signed in users
// @access  Public
router.get('/guest/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    if (portfolio.private === true) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/portfolio/user
// @desc    View all portfolios of a user
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    // Make sure user exists
    const user = await User.findOne({ googleId: req.user.uid });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const user_portfolios = await Portfolio.find()
      .where('user')
      .in(req.user.uid.toString())
      .sort({ date: -1 })
      .exec();
    
     // return portfolios
    res.json(user_portfolios);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/portfolio/thumbnail/:id
// @desc    Get thumbnail of portfolio by Portfolio ID
// @access  Private
router.get('/thumbnail/:id', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    const user = await User.findOne({ googleId: req.user.uid });
    if (portfolio.private && portfolio.user.toString() !== req.user.uid) {
      if (!(user.id in portfolio.allowedUsers)) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
    }
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
    });
    //TODO: replace with link to site
    await page.goto('http://localhost:3000/view/' + req.params.id);
    const image = await page.screenshot();
    await browser.close();
    res.set('Content-Type', 'image/png');
    res.send(image);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/portfolio
// @desc    Remove a portfolio
// @access  Private
router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    // check if portfolio exists
    if (!portfolio) return res.status(404).json({ msg: 'Portfolio not found' });
    // check if user is authorized
    if (portfolio.user.toString() !== req.user.uid)
      return res.status(401).json({ msg: 'User not authorized' });
    // perform delete
    await Portfolio.findByIdAndDelete(req.params.id);
    return res.status(202).json({ msg: 'Portfolio deleted successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/portfolio/edit
// @desc    Edit the name or privacy of a portfolio
// @access  Private
router.put('/edit', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.body.portfolio);
    // check if portfolio exists
    if (!portfolio) return res.status(404).json({ msg: 'Portfolio not found' });
    // check if user is authorized
    if (portfolio.user.toString() !== req.user.uid)
      return res.status(401).json({ msg: 'User not authorized' });
    if (req.body.field === 'name') {
      res.json(
        await Portfolio.findByIdAndUpdate(
          req.body.portfolio,
          { $set: { name: req.body.value } },
          { new: true }
        )
      );
    } else if (req.body.field === 'privacy') {
      res.json(
        await Portfolio.findByIdAndUpdate(
          req.body.portfolio,
          { $set: { private: req.body.value } },
          { new: true }
        )
      );
    } else {
      return res.status(422).json({ msg: 'Invalid field parameter' });
    }
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/portfolio/permission
// @desc    Give or remove permission to users to view private portfolio
// @access  Private
router.put('/permission', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.body.portfolio);
    // check if portfolio exists
    if (!portfolio) return res.status(404).json({ msg: 'Portfolio not found' });
    // check if user is authorized
    if (portfolio.user.toString() !== req.user.uid)
      return res.status(401).json({ msg: 'User not authorized' });
    if (req.body.add === true) {
      res.json(
        await Portfolio.findByIdAndUpdate(
          req.body.portfolio,
          { $push: { allowedUsers: { email: req.body.email } } },
          { new: true }
        )
      );
    } else {
      res.json(
        await Portfolio.findByIdAndUpdate(
          req.body.portfolio,
          { $pull: { allowedUsers: { email: req.body.email } } },
          { new: true }
        )
      );
    }
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    res.status(500).send('Server Error');
  }
});


// @route   put api/portfolio/socialmedia
// @desc    Adds/Updates a social media link
// @access  Private
router.put('/socialmedia', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.body.portfolio);
    // check if portfolio exists
    if (!portfolio) return res.status(404).json({ msg: 'Portfolio not found' });
    // check if user is authorized
    if (portfolio.user.toString() !== req.user.uid) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    socialMedia = { ...req.body};
    delete socialMedia["portfolio"];
    res.json(await Portfolio.findByIdAndUpdate(
        req.body.portfolio,
        { $set: { 'socialmedia': socialMedia } },  { new: true }
      ));    
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/portfolio/templates
// @desc    Get all templates
// @access  Private
router.get('/templates', async (req, res) => {
  try {
    // Make sure user exists
    const user = await User.findOne({ googleId: config.get('templateAccount') });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const portfolios = await Portfolio.find()
      .where('user')
      .in(config.get('templateAccount'))
      .sort({ date: -1 })
      .exec();

    // return portfolios
    res.json(portfolios);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/portfolio/theme
// @desc    Post theme of portfolio
// @access  Private
router.put('/theme', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.body.id);
    // check if portfolio exists
    if (!portfolio) return res.status(404).json({ msg: 'Portfolio not found' });
    // check if user is authorized
    if (portfolio.user.toString() !== req.user.uid)
      return res.status(401).json({ msg: 'User not authorized' });
    res.json(
      await Portfolio.findByIdAndUpdate(
        req.body.id,
        { $set: { theme: req.body.theme } },
        { new: true }
      )
    );
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
