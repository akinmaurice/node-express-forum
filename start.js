const mongoose = require('mongoose');

// import environmental variables from our variables.env file
require('dotenv').config();

// Connect to our Database and handle an bad connections
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

// Import all of our models
require('./models/User');
require('./models/Post');
require('./models/Comment');


// Start our app!
const app = require('./app');

app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log('##########################################################');
  console.log('#####               STARTING SERVER                  #####');
  console.log('##########################################################\n');
  console.log(`Express running → PORT ${server.address().port}`);
});
