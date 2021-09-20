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
  return db.createTable('products_tags', {
    'id': {
      'type':'int',
      'unsigned': true,
      'primaryKey': true,
      'notNull': true,
      'autoIncrement': true
    },
    // foreign key to the products table
    'product_id': {
      'type':'int',
      'unsigned': true,
      'notNull': true,
      'foreignKey':{
        'name':'products_tags_product_fk', // just have to be unique
        'table':'products',
        'mapping':'id',
        'rules':{
          'onDelete':'CASCADE' // if a product is ever deleted, then the corrosponding row in products_tags will be deleted as well
        }
      }
    },
    'tag_id':{
      'type':'int',
      'unsigned': true,
      'notNull': true,
      'foreignKey':{
        'name':'products_tags_tag_fk',
        'table':'tags',
        'mapping':'id',
        'rules':{
          'onDelete':'CASCADE'
        }
      }
    }
  })
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
