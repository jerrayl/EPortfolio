const express = require('express');
const {connectDB} = require('./config/db');
const path = require('path');
const methodOverride = require('method-override');

const app = express();
//add this bc i receive network error from front end
var cors = require('cors');
app.use(cors());

// Connect Database
connectDB();

// Init Middleware
// Allows parsing of req body
app.use(express.json({ extended: false }));
app.use(methodOverride('_method'));

// Define Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/portfolio', require('./routes/api/portfolio'));
app.use('/api/blog', require('./routes/api/blog'));
app.use('/api/page', require('./routes/api/page'));
app.use('/api/item', require('./routes/api/item'));
app.use('/api/comment', require('./routes/api/comment'));
app.use('/api/media', require('./routes/api/media'));
app.use('/api/user', require('./routes/api/user'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('../../client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;