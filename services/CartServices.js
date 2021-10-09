const {
    createCartItem,
    getCartItemByUserAndProduct,
    removeFromCart,
    updateQuantity,
    getCart
} = require('../dal/cartItems');
const {
    CartItem
} = require('../models')

class CartServices {
    constructor(user_id) {
        this.user_id = user_id;
    }

    async addToCart(productId, quantity) {
        // check if uuser has added the product to the shopping cart before
        let cartItem = await getCartItemByUserAndProduct(this.user_id, productId);

        if (cartItem) {
            cartItem.set('quantity', cartItem.get('quantity') + 1);
            cartItem.save();
            return cartItem;
        } else {
            let newCartItem = createCartItem(this.user_id, productId, quantity);
            return newCartItem;
        }
    }

    async removeFromCart(productId) {
        return await removeFromCart(this.user_id, productId);
    }

    async updateQuantity(productId, quantity) {
        return await updateQuantity(this.user_id, productId, quantity);
    }

    async getCart() {
        return await getCart(this.user_id);
    }
}

module.exports = CartServices;