const express = require('express');
const router = express.Router();
const { createProductForm, bootstrapField } = require('../forms')

// import in the Product model from models/index.js
const { Product } = require('../models');

router.get('/', async function(req,res){
    // eqv. to "select * from products"
    // analogous to: db.collection('products').find({})
    let products = await Product.collection().fetch();
    res.render('products/index',{
        'products': products.toJSON()
    })
})

router.get('/create', function(req,res){
    // create an instance of the form
    const productForm = createProductForm();
    res.render('products/create', {
        'form': productForm.toHTML(bootstrapField)
    })
})

module.exports = router;