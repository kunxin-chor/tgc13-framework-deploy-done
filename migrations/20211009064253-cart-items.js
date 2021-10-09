'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('cart_items',{
    'id': {
      'type': 'int',
      'unsigned': true,
      'primaryKey': true,
      'autoIncrement': true
    },
    'product_id': {
      'type': 'int',
      'unsigned': true,
      'notNull': true,
      'foreignKey':{
        'name': 'cart_items_product_fk',
        'table': 'products',
        'mapping': 'id',
        'rules':{
          'onDelete':'CASCADE',
          'onUpdate':'RESTRICT'
        }
      }
    },
    'user_id': {
      'type': 'int',
      'unsigned': true,
      'notNull': true,
      'foreignKey':{
        'name': 'cart_items_user_fk',
        'table': 'users', // which table the foreign key is referring to
        'mapping': 'id',  // which column in the table to map the foreign key to
        'rules':{
          'onDelete':'CASCADE',
          'onUpdate':'RESTRICT'
        }
      }
    },
    'quantity': {'type':'int', 'unsigned': true}
  });
};

exports.down = function(db) {
  return db.dropTable('cart_items');
};

exports._meta = {
  "version": 1
};
