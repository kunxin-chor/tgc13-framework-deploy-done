const express = require('express');
const CartServices = require('../services/CartServices');

const router = express.Router();

router.get('/:product_id/add', async function(req,res){
    let cart = new CartServices(req.session.user.id);
    cart.addToCart(req.params.product_id, 1);
    req.flash("success_messages", "Yay successfully added to cart");
    res.redirect('/cart');
})

router.get('/:product_id/remove', async function(req,res){
    let cart = new CartServices(req.session.user.id);
    let removed =cart.removeFromCart(req.params.product_id);
    if (removed) {
        req.flash('success_messages', "Product removed from shopping cart");
    } else {
        req.flash("error_messages", "The product does not exist in the cart");
    }
    res.redirect('/cart')
})

router.post('/:product_id/quantity', async function(req,res){
    let newQuantity = req.body.newQuantity;
    let cart = new CartServices(req.session.user.id);
    let status = await cart.updateQuantity(req.params.product_id, newQuantity);
    if (status) {
        req.flash("success_messages", "Quantity updated");
        res.redirect('/cart');
    } else {
        res.flash('error_messages', "Error encountered");
        res.redirect('/cart');
    }
   
})

router.get('/', async function(req,res){
    let cart = new CartServices(req.session.user.id);
    let cartContent = await cart.getCart();
    res.render('cart/index',{
        'shoppingCart': cartContent.toJSON()
    })
})

module.exports = router;