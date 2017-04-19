var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/card');
var Order = require('../models/order');

router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function (err, docs) {
      res.render('shop/index', {
          title: 'Card',
          products: docs,
          successMsg: successMsg,
          noMessage: !successMsg
      });
  });
});

router.get('/add-to-card/:id' , function (req, res, next) {
    var productId = req.params.id;
    // var cart = new Cart(productId);

    var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});
    Product.findById(productId, function (err, product) {
        if(err) {
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        res.redirect('/');
    });
});

router.get('/reduce/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});
    cart.reduceOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/remove/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});
    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function(req, res, next) {
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', {products: null});
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', isLoggedIn, function (req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {total: cart.totalPrice , errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, function (req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var stripe = require("stripe")("sk_test_3bop1jlrqIARi9OmmIlg9sDd");

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken,
        description: "Test Charge"
    }, function(err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentID: charge.id
        });
        order.save(function (err, result) {
            req.flash('success', 'Successfully bought');
            req.session.cart = null;
            res.redirect('/');
        });
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}

module.exports = router;

