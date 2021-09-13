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

router.post('/create', function(req,res){
    const productForm = createProductForm();
    // first arg of handle is the request
    // second arg is the setting objects
    productForm.handle(req, {
        // the form parameter is the processed form
        // from caolan-forms
        "success": async function(form){
            // form is submitted successfully with no issue
            // so we can create a new product

            // 1. create an instance of the Product model
            // the Product model ==> a table (in this care, the products table)
            // one instance of the Product model==> a row in the products table
            let newProduct = new Product(); 
            newProduct.set('name', form.data.name);
            newProduct.set('cost', form.data.cost);
            newProduct.set('description', form.data.description)
            // save the new row to the databse
            await newProduct.save();
            res.send("Product created")
        },
        "empty": function(req) {
            res.send("None of the fields are filled in")
        },
        "error": function(form){
            res.render('products/create',{
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

module.exports = router;