const passport = require('passport');
/*
Function to get the Login Page
*/
exports.getLoginPage = (req, res) => {
  res.render('login', { title: 'Login' });
};

/*
Login Controller
*/
exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Email/Password Invalid!',
  successRedirect: '/',
});

/*
Logout Controller
*/
exports.logout = (req, res) => {
  req.logout();
  res.redirect('/login');
};

/*
Middle ware to restrict page access
to logged in users
*/
exports.isLoggedIn = (req, res, next) => {
  // Check if user is authenticated
  if (req.isAuthenticated()) {
    next();
    return;
  }
  res.redirect('/login');
};

/*
Middle ware to restrict Login and Register
Pages to Users not Logged In
*/
exports.notLoggedIn = (req, res, next) => {
  // Check if user is authenticated
  if (!req.isAuthenticated()) {
    next();
    return;
  }
  res.redirect('/profile');
};

