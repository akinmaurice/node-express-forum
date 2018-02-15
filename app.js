const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const promisify = require('es6-promisify');
const csrf = require('csurf');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const routes = require('./routes/index');
const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');
require('./handlers/passport');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Helmet to secure App
app.use(helmet());

/* serves up static files from the public folder.
Anything in public/ will just be served up as the file it is
*/
app.use(express.static(path.join(__dirname, 'public')));


app.use(favicon(path.join(__dirname, 'public/images', 'doughnut.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Exposes a bunch of methods for validating data
app.use(expressValidator());

// populates req.cookies with any cookies that came along with the request
app.use(cookieParser());


// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and allows us to send flash messages
app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));

// Passport JS is what we use to handle our logins
app.use(passport.initialize());
app.use(passport.session());

/*
 The flash middleware let's us use req.flash('error', 'Shit!'),
which will then pass that message to the next page the user requests
*/
app.use(flash());


app.use(csrf());


// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.csrftoken = req.csrfToken();
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});

// promisify some callback based APIs
app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

// SECURITY HELMET SET UP
app.use(helmet.noCache());
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
// app.use(helmet.contentSecurityPolicy({
// directives: {
// defaultSrc: ["'self'"],
// styleSrc: ["'self'", 'fonts.googleapis.com']
// }
// }));
const ninetyDaysInSeconds = 7776000;
app.use(helmet.hpkp({
  maxAge: ninetyDaysInSeconds,
  sha256s: ['AbCdEf123=', 'ZyXwVu456='],
  includeSubdomains: true,
}));
// Route Handling
app.use('/', routes);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;
