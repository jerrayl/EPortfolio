const mongoose = require('mongoose');

/* 
Portfolio Schema
*/
const PortfolioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    ref: 'user',
  },
  socialmedia : {
    type: Map,
    of: String
  },
  blog: [
    {
      title: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  pages: [
    {
      name: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      main: {
        type: Boolean,
        default: false,
      },
      items: [
        {
          item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'item',
          },
        },
      ],
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  private: {
    type: Boolean,
    default: false,
  },
  allowedUsers: [
    {
      email: {
        type: String,
      },
    },
  ],
  theme: {
    primaryFontFamily: {
      type: String,
      default: 'Roboto'
    },
    secondaryFontFamily: {
      type: String,
      default: 'Source Sans Pro'
    },
    primaryColor: {
      type: String,
      default: '#FFF'
    },
    secondaryColor: {
      type: String,
      default: '#FFF'
    },
    headerBackgroundColor: {
      type: String,
      default: '#FFF'
    }
  }
});

module.exports = Portfolio = mongoose.model('portfolio', PortfolioSchema);
