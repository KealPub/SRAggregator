/**
 * @module mysql
 */
'use strict';

let config = require('../config');

module.exports = require('knex')({
  client: 'mysql',
  connection: {
    host: config.get('mysql.host'),
    user: config.get('mysql.user'),
    password: config.get('mysql.password'),
    database: config.get('mysql.database')
  },
  debug: true
});