const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult, body } = require('express-validator');
const config = require('config');

const Portfolio = require('../../models/Portfolio');
const User = require('../../models/User');
const Item = require('../../models/Item');
const Comment = require('../../models/Comment');
const { parseDate } = require('tough-cookie');
const { Mongoose } = require('mongoose');
const { resetWarningCache } = require('prop-types');

// @route   GET api/comment
// @desc    Test route
// @access  Public
router.get('/', (req, res) => res.send('Comment route'));

// @route   POST api/comment/:item_id
// @desc    Leave a comment on an item
// @access  Private
router.post(
  '/:item_id',
  [auth, [check('text', 'Cannot leave empty comment').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Pull out item and user
      const item = await Item.findById(req.params.item_id);
      const user = await User.findOne({ googleId: req.user.uid });
      // Make sure item exists
      if (!item) {
        return res.status(404).json({ msg: 'Item does not exist' });
      }

      const newComment = new Comment({
        from: req.user.uid,
        name: user.name,
        avatar: user.avatar,
        item: req.params.item_id,
        text: req.body.text,
      });

      const comment = await newComment.save();
      res.json(comment);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Item does not exist' });
      }
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/comment/:item_id
// @desc    View comments on an item
// @access  Public
router.get('/:item_id', async (req, res) => {
  try {
    // find the item
    const item = await Item.findById(req.params.item_id);

    // make sure item exists
    if (!item) {
      return res.status(404).json({ msg: 'Item does not exist' });
    }

    // find all comments with item_id
    const comments = await Comment.find()
      .where('item')
      .in(req.params.item_id.toString())
      .sort({ date: -1 })
      .exec();

    // return comments
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Item does not exist' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/comment/edit/:comment_id
// @desc    Remove a comment (commenter & receiver)
// @access  Private
router.delete('/:comment_id', auth, async (req, res) => {
  try {
    // find the comment, item, portfolio
    const comment = await Comment.findById(req.params.comment_id);
    const item = await Item.findById(comment.item);
    const portfolio = await Portfolio.findById(item.portfolio);
    // make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // make sure user is either comment sender or receiver
    if (comment.from.toString() !== req.user.uid) {
      if (portfolio.user.toString() !== req.user.uid) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
    }
    // remove comment
    await comment.remove();

    // find all comments with item_id
    const comments = await Comment.find()
      .where('item')
      .in(item._id.toString())
      .sort({ date: -1 })
      .exec();


    // return commend deleted message
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/comment/edit/:comment_id
// @desc    Edit a comment (only commenter) makes modified true
// @access  Private
router.post(
  '/edit/:comment_id',
  [auth, [check('text', 'Cannot leave empty comment').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // find the comment and the item
      const comment = await Comment.findById(req.params.comment_id);

      // make sure comment exists
      if (!comment) {
        return res.status(404).json({ msg: 'Comment not found' });
      }

      // make sure user is comment sender
      if (comment.from.toString() !== req.user.uid) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
      // copy comment info, update text
      const newComment = new Comment({
        _id: comment._id,
        from: comment.from,
        name: comment.name,
        avatar: comment.avatar,
        item: comment.item,
        text: req.body.text,
        date: comment.date,
        modified: true,
      });
      // remove old comment
      await comment.remove();
      // add new comment
      const updatedComment = await newComment.save();
      // return updated comment
      res.json(updatedComment);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Comment not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
