const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const config = require('config');

const Portfolio = require('../../models/Portfolio');
const User = require('../../models/User');
const { parseDate } = require('tough-cookie');

/*
The calls to create/edit/delete blog posts,
temporarily deprecated
*/

/******************BLOG STUFF******************/

// @route   POST api/blog/:id
// @desc    Create a blog post on a portfolio
// @access  Private
router.post(
  '/:id',
  [
    auth,
    [
      check('title', 'A Title is required').not().isEmpty(),
      check('text', 'Text is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const portfolio = await Portfolio.findById(req.params.id);

      // Check portfolio exists
      if (!portfolio) {
        return res.status(404).json({ msg: 'Portfolio not found' });
      }

      // Check user
      if (portfolio.user.toString() !== req.user.uid) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
      const newBlog = {
        title: req.body.title,
        text: req.body.text,
      };

      portfolio.blog.unshift(newBlog);
      await portfolio.save();

      res.json(portfolio);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Portfolio not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/blog/:id/:blog_id
// @desc    Delete a blog post
// @access  Private
router.delete('/:id/:blog_id', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    // Pull out the blog post
    const blog = portfolio.blog.find((blog) => blog.id === req.params.blog_id);

    // Make sure portfolio exists
    if (!portfolio) {
      return res.status(404).json({ msg: 'Portfolio does not exist' });
    }

    // Make sure blog post exists
    if (!blog) {
      return res.status(404).json({ msg: 'Blog does not exist' });
    }

    // Check user
    if (portfolio.user.toString() !== req.user.uid) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Find remove index
    const removeIndex = portfolio.blog
      .map((blog) => blog.id.toString())
      .indexOf(req.params.blog_id);

    portfolio.blog.splice(removeIndex, 1);

    await portfolio.save();
    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Portfolio or Blog post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/blog/:id/:sort/:page
// @desc    Get blog posts in a portfolio ordered by date
// @access  Public
// :id = portfolio_id, :sort = (1 is old-new otherwise new-old), :page = page number
router.get('/:id/:sort/:page', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    if (portfolio.private) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const sortByOld = req.params.sort;
    const pageRequest = req.params.page;
    const numPosts = portfolio.blog.length;
    const postPerPage = config.get('postPerPage');
    const maxPage = Math.ceil(numPosts / postPerPage);

    let page;

    if (pageRequest <= 0) {
      page = 1;
    } else if (pageRequest >= maxPage) {
      page = maxPage;
    } else {
      page = pageRequest;
    }

    // Find the post indexes that need to be returned
    const startIndex = postPerPage * (page - 1);
    const endIndex = Math.min(postPerPage * page, numPosts + 1);

    // Return the blog posts depending on sort order
    if (sortByOld == 1) {
      res.json(
        portfolio.blog
          .sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          })
          .slice(startIndex, endIndex)
      );
    } else {
      res.json(
        portfolio.blog
          .sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          })
          .slice(startIndex, endIndex)
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

// @route   POST api/blog/:id/:blog_id
// @desc    Edit a blog post
// @access  Private
router.post('/:id/:blog_id', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    // Pull out the blog post
    const blog = portfolio.blog.find((blog) => blog.id === req.params.blog_id);

    // Make sure portfolio exists
    if (!portfolio) {
      return res.status(404).json({ msg: 'Portfolio does not exist' });
    }

    // Make sure blog post exists
    if (!blog) {
      return res.status(404).json({ msg: 'Blog does not exist' });
    }

    // Check user
    if (portfolio.user.toString() !== req.user.uid) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Find remove index
    const removeIndex = portfolio.blog
      .map((blog) => blog.id.toString())
      .indexOf(req.params.blog_id);

    let newTitle;
    let newText;

    // Check which fields are being updated
    if ('title' in req.body) {
      newTitle = req.body.title;
    } else {
      newTitle = blog.title;
    }

    if ('text' in req.body) {
      newText = req.body.text;
    } else {
      newText = blog.text;
    }

    // Create new post
    const newBlog = {
      _id: blog._id,
      title: newTitle,
      text: newText,
      date: blog.date,
    };

    // Remove old post
    portfolio.blog.splice(removeIndex, 1);

    // Add new post to the correct index
    portfolio.blog.splice(removeIndex, 0, newBlog);

    // Save portfolio
    await portfolio.save();
    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Portfolio or Blog post not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
