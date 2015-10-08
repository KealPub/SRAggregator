/**
 * @module app
 */
'use strict';
let SRApi = require('./modules/SRApi');
let Game = require('./models/Game');
let co = require('co');
let _ = require('lodash');

const API_KEY = 'cfzwjpcqbnq58qbtj9sr77gv';


let api = new SRApi(API_KEY);

co(function *() {
  let gamesData = yield api.getGames();
  let games = gamesData.games.slice(0, 10);

  for (let game of games) {
    let stat = yield api.getStats(game.id);
    let gameModel = new Game(game.id);

    if (!stat.periods) {
      continue;
    }

    for (let periodNum in stat.periods) {
      let period = stat.periods[periodNum];
      if (!period.events) {
        continue;
      }

      for (let event of period.events) {
        gameModel.setEvent(parseInt(periodNum) + 1, event);
      }
    }

    yield gameModel.save();
  }
})
.then(function () {
  console.log('Ok niger, check mysql for your statistics');
  process.exit(0);
})
.catch(console.error);