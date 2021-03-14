const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, unique: false },
  email: { type: String, unique: true },
  googleId: { type: String, unique: true },
  avatar: { type: String, unique: false},
  saved_portfolios: [
    {
      saved_portfolio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'item',
      },
    },
  ],
});

module.exports = User = mongoose.model('user', UserSchema);
