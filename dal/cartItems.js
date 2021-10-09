const { CartItem } = require ('../models');

async function getCartItemByUserAndProduct(userId, productId){
    let cartItem = await CartItem.where({
        'user_id': userId,
        'product_id': productId
    }).fetch({
        'require': false
    })
    return cartItem;
}

async function createCartItem(userId, productId, quantity) {

    let cartItem = new CartItem({
        'user_id': userId,
        'product_id': productId,
        'quantity': quantity
    })
    await cartItem.save();
    return cartItem;
}

async function getCart(userId) {
    // to get more > 1 result, .collection
    let allCartItems = await CartItem.collection()
        .where({
            'user_id': userId
        }).fetch({
            'require': false,
            withRelated:['product', 'product.category']
        })
    return allCartItems;
}

async function removeFromCart(userId, productId) {
    let cartItem = await getCartItemByUserAndProduct(userId, productId);
    if (cartItem) {
        await cartItem.destroy();
        return true;
    }
    return false;
}

async function updateQuantity(userId, productId, newQuantity) {
    let cartItem = await getCartItemByUserAndProduct(userId, productId);
    if (cartItem) {
        cartItem.set('quantity', newQuantity);
        cartItem.save();
        return true;
    }
    return false;
}

module.exports = {
    createCartItem,
    getCartItemByUserAndProduct,
    getCart,
    removeFromCart,
    updateQuantity
}