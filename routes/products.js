const express = require('express');
const router = express.Router();

// import in the Product model from models/index.js
const { Product } = require('../models');

router.get('/', async function(req,res){
    // eqv. to "select * from products"
    let products = await Product.collection().fetch();
    res.render('products/index',{
        'products': products.toJSON()
    })
})

module.exports = router;