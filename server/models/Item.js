const mongoose = require('mongoose');

/* 
Item Schema
*/
const ItemSchema = new mongoose.Schema({
  portfolio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'portfolio',
  },
  pageid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'page',
  },
  row: {
    type: Number,
  },
  column: {
    type: Number,
  },
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  paragraph: {
    type: String,
  },
  mediaLink: {
    type: String,
  },
  mediaType: {
    type: String,
  },
  linkText: {
    type: String,
  },
  linkAddress: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  private: {
    type: Boolean,
    default: false,
  },
  theme: {
    primaryFontFamily: {
      type: String,
    },
    secondaryFontFamily: {
      type: String,
    },
    primaryColor: {
      type: String,
    },
    secondaryColor: {
      type: String,
    }
  }
});

module.exports = Item = mongoose.model('item', ItemSchema);
