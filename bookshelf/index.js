const knexSetupFunction = require('knex');
const knex = knexSetupFunction({
    'client': process.env.DB_DRIVER,
    'connection':{
        'user':process.env.DB_USER,
        'password':process.env.DB_PASSWORD,
        'database':process.env.DB_DATABASE
    }
})

const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;