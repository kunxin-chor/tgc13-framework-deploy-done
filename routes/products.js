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
            res.redirect('/products')
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

router.get('/:product_id/update', async function(req,res){
    // fetch the details of the product that we want to edit
    let productId = req.params.product_id;

    // fetch the product details using the bookshelf orm
    // use the Product model's where function
    // first arg - an object of settings
    // analgous to db.collection('products').find({'_id':SOMEID})
    let product = await Product.where({
        'id': productId
    }).fetch({
        required: true
    })

    // create the product form
    let productForm = createProductForm();
    // retrieve the value of the name column from the product
    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');

    res.render('products/update',{
        'form': productForm.toHTML(bootstrapField),
        'product': product.toJSON()
    })
})

router.post('/:product_id/update', async function(req,res){
    // fetch the product that we want to  update
    let product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        required: true
    });

    // process the form
    const productForm = createProductForm();
    productForm.handle(req, {
        'success': async function(form) {
            // form.data MUST HAVE EXACTLY THE SAME KEYS
            // AS THE COLUMNS IN THE PRODUCTS TABLE
            // with the exception of id
            product.set(form.data);
            // i.e
            // product.set("name", form.data.name);
            // product.set("cost", form.data.cost);
            // product.set('description', form.data.description');
            await product.save();
            res.redirect('/products');
        }
    })
})

module.exports = router;