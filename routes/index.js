var express = require('express');
var router = express.Router();
var Product = require('../models/product');


router.get('/', function(req, res, next) {
  Product.find(function (err, docs) {
      res.render('shop/index', {
          title: 'Card',
          products: docs
      });
  });
});

module.exports = router;
