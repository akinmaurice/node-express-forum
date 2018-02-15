const mongoose = require('mongoose');

const User = mongoose.model('User');
const promisify = require('es6-promisify');
/*
Function to get the Register Page
*/
exports.getRegisterPage = (req, res) => {
  res.render('register', { title: 'Create Account' });
};

/*
Function to get the Profile Page
*/
exports.getProfilePage = (req, res) => {
  res.render('profile', { title: 'My Account' });
};

/*
Function to validate user
data submitted to register User
*/
exports.validateRegister = (req, res, next) => {
  req.checkBody('name', 'Name field cannot be empty').notEmpty();
  req.checkBody('email', 'That Email is not valid').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  });
  req.checkBody('password', 'Password cannot be Blank!').notEmpty();
  req.checkBody('password-confirm', 'Confirm Password cannot be empty!').notEmpty();
  req.checkBody('password-confirm', 'Your Passwords do not match').equals(req.body.password);
  const errors = req.validationErrors();
  if (errors) {
    req.flash('danger', errors[0].msg);
    res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
    return;
  }
  next();
};

/*
Function to check if a user
 exists already with the mail
 */
exports.checkUserExists = async (req, res, next) => {
  const user = await User.find({ email: req.body.email });
  if (user.length) {
    req.flash('danger', 'A User with that Email Exists already!');
    res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
    return;
  }
  next();
};

/*
Function to regsiter user
*/
exports.registerUser = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const registerWithPromise = promisify(User.register, User);
  await registerWithPromise(user, req.body.password);
  next();
};
