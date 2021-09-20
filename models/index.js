const bookshelf = require('../bookshelf');

// creating the Product model
// one model is for one table in the database
// first argument is the name of the model
// convention: use the singular form of the table name, first letter uppercase
const Product = bookshelf.model('Product',{
    'tableName':'products',
    category() {
        return this.belongsTo('Category')
    }
})

const Category = bookshelf.model('Category', {
    'tableName':'categories', // <-- the name of the table inside the MYSQL database
    products() {
        return this.hasMany('Product')
    }
})

module.exports = { 
    'Product': Product,
    'Category': Category
}

// short form
// module.exports = {
//     Product
// }