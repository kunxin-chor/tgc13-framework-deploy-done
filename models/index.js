const bookshelf = require('../bookshelf');

// creating the Product model
// one model is for one table in the database
// first argument is the name of the model
// convention: use the singular form of the table name, first letter uppercase
const Product = bookshelf.model('Product',{
    'tableName':'products'
})

module.exports = { 
    'Product': Product
}

// short form
// module.exports = {
//     Product
// }