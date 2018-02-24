const express = require('express');

const router = express.Router();

const appController = require('../controllers/appController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const commentController = require('../controllers/commentController');
const { catchErrors } = require('../handlers/errorHandlers');

/*
GET home page.
*/
router.get(
  '/',
  catchErrors(appController.getIndexPage),
);

/*
Router to get all
posts paginated pages
*/
router.get(
  '/posts/page/:page',
  catchErrors(appController.getIndexPage),
);

/*
GET Login page.
*/
router.get(
  '/login',
  authController.notLoggedIn,
  authController.getLoginPage,
);

/*
GET Register page.
*/
router.get(
  '/register',
  authController.notLoggedIn,
  userController.getRegisterPage,
);

/*
GET Profile page.
*/
router.get(
  '/profile',
  authController.isLoggedIn,
  userController.getUserPosts,
);

/*
Post Login User
*/
router.post(
  '/login',
  authController.notLoggedIn,
  authController.login,
);

/*
Post Register User
*/
router.post(
  '/register',
  authController.notLoggedIn,
  userController.validateRegister,
  userController.checkUserExists,
  userController.registerUser,
  authController.login,
);

/*
Logout user.
*/
router.get(
  '/logout',
  authController.isLoggedIn,
  authController.logout,
);

/*
router to Get Add new Post Page
*/
router.get(
  '/add',
  authController.isLoggedIn,
  appController.getaddPostPage,
);

/*
router toAdd new Post
*/
router.post(
  '/add',
  authController.isLoggedIn,
  appController.newPost,
);

/*
router to Get Each Post
*/
router.get(
  '/post/:slug',
  appController.getPostBySlug,
);

/*
router to Get Posts for each tag
*/
router.get(
  '/category/:category',
  appController.getPostsByCategory,
);

/*
router to Post Comment
*/
router.post(
  '/comment',
  catchErrors(commentController.newComment),
);

/*
Route to get The Post To Edit
*/
router.get(
  '/post/:slug/edit',
  authController.isLoggedIn,
  catchErrors(appController.getPostToUpdate),
);


/*
Router to Update Post
*/
router.post(
  '/post/:slug/edit',
  authController.isLoggedIn,
  catchErrors(appController.verifyPost),
  catchErrors(appController.updatePost),
);

/*
route to search for post
*/
router.get(
  '/search',
  catchErrors(appController.searchPost),
);


module.exports = router;
