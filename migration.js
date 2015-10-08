/**
 * @module migration
 */
'use strict';
let mysql = require('./lib/mysql');
let co = require('co');

exports.up = function () {
  return co(function *() {
    yield mysql.schema.createTable('player_stats', function (table) {
      table.increments('id').primary();
      table.uuid('game_uid');
      table.uuid('player_uid');
      table.float('rebound');
      table.float('assist');
      table.integer('fieldgoal3');
      table.integer('fieldgoal2');
      table.integer('freethrow');
      table.integer('block');
      table.integer('steal');
      table.integer('turnover');
      table.float('all');
    });

    yield mysql.schema.createTable('period_stats', function (table) {
      table.increments('id').primary();
      table.integer('player_stats_id', 10).unsigned().references('player_stats.id');
      table.integer('period_num');
      table.float('points');
    });
  });
};

exports.down = function () {
  return co(function *() {
    yield mysql.schema.dropTableIfExists('period_stats');
    yield mysql.schema.dropTableIfExists('player_stats');
  });
};

switch (process.argv[2]) {
  case 'up':
    exports.up().then(process.exit).catch(function (e) {
      console.error(e);
      exports.down().then(function () {
        process.exit(1);
      });
    });
    break;
  case 'down':
    exports.down().then(process.exit).catch(function (e) {
      console.error(e);
      process.exit(1);
    });
}