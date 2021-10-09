const express = require('express');
const router = express.Router();
const {
    createProductForm,
    bootstrapField,
    createSearchForm
} = require('../forms');
const {
    checkIfAuthenticated
} = require('../middlewares');

// import in the Product model, Category model and the Tag model from models/index.js
const {
    Product,
    Category,
    Tag
} = require('../models');

// import from DAL the repository functions
// repository in this context does not refer to github
// rather it's a generic term to refer to a function
// that retrives data from the database
const {
    getProductById, getAllCategories, getAllTags
} = require('../dal/product.js')

// router.get('/', async function(req,res){
//     // eqv. to "select * from products"
//     // analogous to: db.collection('products').find({})
//     let products = await Product.collection().fetch({
//         withRelated:['category', 'tags'] // <-- indicate that we want to load in the category information for each product
//     });
//     res.render('products/index',{
//         'products': products.toJSON()
//     })
// })

router.get('/', async function (req, res) {
    // retrieve an array of all available categories
    const allCategories = await Category.fetchAll().map(function (category) {
        return [category.get('id'), category.get('name')]
    })

    // create a fake category that represents search all
    allCategories.unshift([0, '----'])

    // retrieve an array of all the tags
    const allTags = await getAllTags();

    let searchForm = createSearchForm(allCategories, allTags);

    // create a base query object which is deferred this is the eqv. of "select * from products"
    let q = Product.collection();  
   
    searchForm.handle(req,{
        'success': async function(form) {
            if (form.data.name) {
                q.where('name', 'like', '%' + form.data.name + '%')
            }

            if (form.data.min_cost) {
                q.where('cost', '>=', form.data.min_cost);
            }

            if (form.data.max_cost) {
                q.where('cost', '<=', form.data.max_cost);
            }

            if (form.data.category_id && form.data.category_id != "0") {
                q.where('category_id', '=', form.data.category_id)
            }

            if (form.data.tags) {
                q.query('join', 'products_tags', 'products.id', 'product_id')
                .where('tag_id', 'in', form.data.tags.split(','))
            }

            let products = await q.fetch({
                withRelated:['category', 'tags']
            })

            res.render('products/index',{
                'form': form.toHTML(bootstrapField),
                'products': products.toJSON()
            })
        },
        'error': async function() {
            let products = await q.fetch({
                withRelated:['category', 'tags']
            });
            res.render('products/index',{
                'products': products.toJSON(),
                'form': form.toHTML(bootstrapField)
            })
        },
        'empty': async function(form) {
            let products = await q.fetch({
                withRelated:['category', 'tags']
            });
            res.render('products/index',{
                'products': products.toJSON(),
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/create', checkIfAuthenticated, async function (req, res) {
    // retrieve an array of all available categories
    const allCategories = await getAllCategories();
    
    // retrieve an array of all the tags
    const allTags = await getAllTags();

    // create an instance of the form
    const productForm = createProductForm(allCategories, allTags);
    res.render('products/create', {
        'form': productForm.toHTML(bootstrapField),
        'cloudinaryName': process.env.CLOUDINARY_NAME,
        'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
        'cloudinaryPreset': process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/create', checkIfAuthenticated, async function (req, res) {

    const allCategories = await getAllCategories();
    const allTags = await getAllTags();

    const productForm = createProductForm(allCategories, allTags);
    // first arg of handle is the request
    // second arg is the setting objects
    productForm.handle(req, {
        // the form parameter is the processed form
        // from caolan-forms
        "success": async function (form) {
            // form is submitted successfully with no issue
            // so we can create a new product

            // 1. create an instance of the Product model
            // the Product model ==> a table (in this care, the products table)
            // one instance of the Product model==> a row in the products table
            let newProduct = new Product();
            newProduct.set('name', form.data.name);
            newProduct.set('cost', form.data.cost);
            newProduct.set('description', form.data.description)
            newProduct.set('category_id', form.data.category_id)
            newProduct.set('image_url', form.data.image_url)
            // check if the user select any tags

            // save the new row to the databse
            await newProduct.save();

            // can only save the relationship after the product is created
            if (form.data.tags) {
                // example of form.data.tags is '1,2' where 1 and 2 is the id of the tag
                await newProduct.tags().attach(form.data.tags.split(','))
            }
            // add a flash message to indicate that the 
            // adding of product is successful
            // first arg: the key to add to
            // second arg: what to display to the user
            req.flash("success_messages", "New product has been created successfully.")
            res.redirect('/products')
        },
        "empty": function (req) {
            res.send("None of the fields are filled in")
        },
        "error": function (form) {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:product_id/update', async function (req, res) {
    // retrieve an array of all available categories
    const allCategories = await getAllCategories();
    // get all the existing tags as an array
    const allTags = await getAllTags();

    // fetch the details of the product that we want to edit
    let productId = req.params.product_id;

    // fetch the product details using the bookshelf orm
    // use the Product model's where function
    // first arg - an object of settings
    // analgous to db.collection('products').find({'_id':SOMEID})
    // const product = await Product.where({
    //     'id': productId
    // }).fetch({
    //     'require': true,
    //     'withRelated': ['tags']
    // });

    const product = await getProductById(productId);
    // let product = await getProductById(req.params.product_id);

    // create the product form
    let productForm = createProductForm(allCategories, allTags);
    // retrieve the value of the name column from the product
    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');
    productForm.fields.category_id.value = product.get('category_id');
    productForm.fields.image_url.value = product.get('image_url');

    // fetch all the related tags of the product
    let selectedTags = await product.related('tags').pluck('id');
    productForm.fields.tags.value = selectedTags;

    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'product': product.toJSON(),
        'cloudinaryName': process.env.CLOUDINARY_NAME,
        'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
        'cloudinaryPreset': process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/:product_id/update', async function (req, res) {

    // retrieve an array of all available categories
    const allCategories = await getAllCategories();
    // fetch the product that we want to  update
    // let product = await Product.where({
    //     'id': req.params.product_id
    // }).fetch({
    //     required: true
    // });
    let product = await getProductById(req.params.product_id);

    // process the form
    const productForm = createProductForm(allCategories);
    productForm.handle(req, {
        'success': async function (form) {
            // form.data MUST HAVE EXACTLY THE SAME KEYS
            // AS THE COLUMNS IN THE PRODUCTS TABLE
            // with the exception of id
            let {
                tags,
                ...productData
            } = form.data; // <-- extract out the tags key into the tags variable
            // and place the other remaining keys into an object named productData
            // for more info, consutl JavaScript Object Destructuring
            // i.e, short form for:
            // let tags = form.data.tags;
            // let productData = {}
            // productData.name = form.data.name
            // productData.cost = form.data.cost
            // productData.description = form.data.description
            // productData.category_id = form.data.category_id
            // productData.image_url = form.data.image_url
            product.set(productData);
            await product.save();
            // i.e
            // product.set("name", form.data.name);
            // product.set("cost", form.data.cost);
            // product.set('description', form.data.description');
            // product.set('category_id', form.data.category_id)


            // update the relationship

            // currently selected tags
            let tagIds = tags.split(',')

            // get all the tags that are selected first
            let existingTagIds = await product.related('tags').pluck('id')

            // remove all the tags that are not selected any more
            let toRemove = existingTagIds.filter(function (id) {
                return tagIds.includes(id) === false
            })

            await product.tags().detach(toRemove);

            // add in all the tags that are selected
            await product.tags().attach(tagIds);
            res.redirect('/products');
        }
    })
})

router.get('/:product_id/delete', async function (req, res) {
    const product = await getProductById(req.params.product_id)

    res.render('products/delete', {
        'product': product.toJSON()
    })
})

router.post('/:product_id/delete', async function (req, res) {
    const product = await getProductById(req.params.product_id);

    // to delete a row from the table
    // call the destroy function on an instance of the model
    await product.destroy();
    res.redirect('/products')
})

module.exports = router;