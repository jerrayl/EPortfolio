const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const config = require('config');

const Portfolio = require('../../models/Portfolio');
const User = require('../../models/User');
const Item = require('../../models/Item');

/*
 Janky helper functions, to remove when populate is working
*/
const getItems = async (item) => {
  const result = await Item.findById(item._id);
  return result;
};

const getData = async (list) => {
  return Promise.all(list.map((item) => getItems(item)));
};

/*
The calls to create/edit/delete pages in a portfolio
*/

// @route   GET api/item
// @desc    Test route
// @access  Public
router.get('/', (req, res) => res.send('pages route'));

// @route   POST api/page
// @desc    Create an new page on a portfolio
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.body.portfolio);
    // check if portfolio exists
    if (!portfolio) return res.status(404).json({ msg: 'Portfolio not found' });
    // check if user is authorized
    if (portfolio.user.toString() !== req.user.uid)
      return res.status(401).json({ msg: 'User not authorized' });
    // make page name urlsafe
    const url = encodeURI(req.body.pagename);
    if (portfolio.pages.filter((page) => page.url === url).length > 0) {
      res.status(409).json({ msg: 'Page with this name already exists' });
    } else {
      const makeMain =
        portfolio.pages.filter((page) => page.main === true).length === 0;
      res.json(
        await Portfolio.findByIdAndUpdate(
          req.body.portfolio,
          {
            $push: {
              pages: { name: req.body.pagename, url: url, main: makeMain },
            },
          },
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

// @route   DELETE api/page
// @desc    Remove a page from a portfolio
// @access  Private
router.delete('/:portfolio/:url', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.portfolio);
    // check if portfolio exists
    if (!portfolio) return res.status(404).json({ msg: 'Portfolio not found' });
    // check if user is authorized
    if (portfolio.user.toString() !== req.user.uid)
      return res.status(401).json({ msg: 'User not authorized' });
    // retrieve id, assume no duplicate page
    const page = portfolio.pages.filter(page => page.url === encodeURI(req.params.url));
    if (page.main){
      res.status(500).send('Cannot delete main page');
    }
    // TODO : remove associated items
    res.json(await Portfolio.findByIdAndUpdate(req.params.portfolio, { $pull: { pages: {_id : page[0]._id}}}, {new : true}));
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   post api/page/editname
// @desc    Edits the name of a page on a portfolio 
// @access  Private
router.post('/editname', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.body.portfolio);
    // check if portfolio exists
    if (!portfolio) return res.status(404).json({ msg: 'Portfolio not found' });
    // check if user is authorized
    if (portfolio.user.toString() !== req.user.uid)
      return res.status(401).json({ msg: 'User not authorized' });
    // make page name urlsafe
    const url = encodeURI(req.body.oldname);
    // retrieve id, assume no duplicate page
    const page = portfolio.pages.filter((page) => page.url === url);
    // check new name does not clash
    if (
      portfolio.pages.filter((page) => page.url === encodeURI(req.body.newname))
        .length > 0
    ) {
      res.status(409).json({ msg: 'Page with this name already exists' });
    } else if (page.length === 0) {
      res.status(404).json({ msg: 'Page not found' });
    } else {
      const update = {
        $set: {
          'pages.$[elem].name': req.body.newname,
          'pages.$[elem].url': encodeURI(req.body.newname),
        },
      };
      const options = {
        new: true,
        arrayFilters: [{ 'elem._id': page[0]._id }],
      };
      res.json(
        await Portfolio.findByIdAndUpdate(req.body.portfolio, update, options)
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

// @route   put api/page/makemain
// @desc    Makes a page the main page
// @access  Private
router.put('/makemain', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.body.portfolio);
    // check if portfolio exists
    if (!portfolio) return res.status(404).json({ msg: 'Portfolio not found' });
    // check if user is authorized
    if (portfolio.user.toString() !== req.user.uid)
      return res.status(401).json({ msg: 'User not authorized' });
    // make page name urlsafe
    const url = encodeURI(req.body.pagename);
    // retrieve id, assume no duplicate page
    const page = portfolio.pages.filter((page) => page.url === url);
    if (page.length === 0) res.status(404).json({ msg: 'Page not found' });
    else {
      await Portfolio.findByIdAndUpdate(
        req.body.portfolio,
        { $set: { 'pages.$[elem].main': false } },
        { multi: true, arrayFilters: [{ 'elem.main': true }] }
      );
      const addnewMain = { $set: { 'pages.$[elem].main': true } };
      const options = {
        new: true,
        arrayFilters: [{ 'elem._id': page[0]._id }],
      };
      res.json(
        await Portfolio.findByIdAndUpdate(
          req.body.portfolio,
          addnewMain,
          options
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

// @route   gets api/page/:id/:url
// @desc    Get page by portfolio and url
// @access  Private
router.get('/single/:id/:url?', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    // check if portfolio exists
    if (!portfolio) return res.status(404).json({ msg: 'Portfolio not found' });
    // check if user is authorized

    const isAllowed = portfolio.allowedUsers.some(function(user){
      return user.equals(user.id);
    });
    
    if (
      portfolio.private &&
      (portfolio.user.toString() !== req.user.uid &&
      !(isAllowed))
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    // retrieve page
    const pageIndex = req.params.url
      ? portfolio.pages.findIndex(
          (page) => page.url === encodeURI(req.params.url)
        )
      : portfolio.pages.findIndex((page) => page.main === true);
    if (pageIndex === -1) res.status(404).json({ msg: 'Page not found' });
    else {
      // TODO somehow get populate to work
      let page = portfolio.pages[pageIndex].toObject();
      const result = await getData(page.items);
      page.items = result;
      res.json(page);
    }
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   gets api/page/guest/:id/:url
// @desc    Get page by portfolio and url
// @access  Public
router.get('/guest/:id/:url?', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    // check if portfolio exists
    if (!portfolio) {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    if (portfolio.private) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    // retrieve page
    const pageIndex = req.params.url
      ? portfolio.pages.findIndex(
          (page) => page.url === encodeURI(req.params.url)
        )
      : portfolio.pages.findIndex((page) => page.main === true);
    if (pageIndex === -1) res.status(404).json({ msg: 'Page not found' });
    else {
      // TODO somehow get populate to work
      let page = portfolio.pages[pageIndex].toObject();
      const result = await getData(page.items);
      page.items = result;
      res.json(page);
    }
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
