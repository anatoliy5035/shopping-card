var Product = require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/shopping');

var products = [
    new Product({
        imgPath: 'http://osxworld.me/wp-content/uploads/2016/02/gta-5-mass-murder.jpg',
        title: 'Gta 5',
        description: 'Good Game',
        price: 10
    }),

    new Product({
        imgPath: 'http://vignette1.wikia.nocookie.net/gtawiki/images/9/92/GTA_San_Andreas_Box_Art.jpg/revision/latest?cb=20090429021856',
        title: 'Gta Sa',
        description: 'Good GameMggg',
        price: 150
    }),

    new Product({
        imgPath: 'http://osxworld.me/wp-content/uploads/2016/02/gta-5-mass-murder.jpg',
        title: 'Gta 4',
        description: 'Good Game',
        price: 200
    })
]

var done = 0;
products.forEach(function (product, i) {
    product.save(function (err, result) {
        done++
        if (done === product.length) {
          exitDb();
        }
    });
});

function exitDb() {
    mongoose.disconnect();
}

module.exports = mongoose;