var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var passport = require('passport');
var Product = require('../models/product');

var session = require('express-session');

router.use(csrfProtection);

router.get('/', function(req, res, next) {
  Product.find(function (err, docs) {
      res.render('shop/index', {
          title: 'Card',
          products: docs
      });
  });
});

router.get('/user/signup', function (req, res, next) {
   var messages = req.flash('error');
   res.render('user/signup', {
       csrfToken: req.csrfToken(),
       messages: messages,
       hasError: messages.length > 0
   });
});

router.post('/user/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}));

router.get('/user/profile', function (req, res, next) {
    res.render('user/profile');
});

module.exports = router;
