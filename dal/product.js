const {
    Product,
    Category,
    Tag
} = require('../models');

async function getProductById(productId) {
    let product = await Product.where({
        'id': productId
    }).fetch({
        'require': true,
        'withRelated':['tags', 'category']
    })

    return product;
}

async function getAllCategories() {
    let allCategories = await Category.fetchAll().map(function (category) {
        return [category.get('id'), category.get('name')]
    })
    return allCategories;
}

async function getAllTags() {
    let allTags = await (await Tag.fetchAll()).map(function (tag) {
        return [tag.get('id'), tag.get('name')]
    })
    return allTags;
}

module.exports = {
    getProductById,
    getAllCategories,
    getAllTags
}

