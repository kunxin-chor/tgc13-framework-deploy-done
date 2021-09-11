const knexSetupFunction = require('knex');
const knex = knexSetupFunction({
    'client': 'mysql',
    'connection':{
        'user':'foo',
        'password':'bar',
        'database':'organic'
    }
})

const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;