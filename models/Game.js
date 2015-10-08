/**
 * @module Game
 */
'use strict';

let _ = require('lodash');
let mysql = require('../lib/mysql');

let points = {
  fieldgoal3: 3,
  fieldgoal2: 2,
  freethrow: 1,
  rebound: 1.2,
  assist: 1.5,
  block: 2,
  steal: 2,
  turnover: -1
};

/* eslint-disable camelcase */
let emptyPeriod = {
  period1: {
    period_num: 1,
    points: 0
  },
  period2: {
    period_num: 2,
    points: 0
  },
  period3: {
    period_num: 3,
    points: 0
  },
  period4: {
    period_num: 4,
    points: 0
  }
};
/* eslint-enable camelcase */


function createEmptyStatObject() {
  let obj = _.mapValues(points, function () {
    return 0;
  });

  return _.extend(obj, {
    all: 0,
    periods: {}
  });
}

class Game {
  constructor(id) {
    this.id = id;
    this.data = {};
  }

  setState(period, stat) {
    if (!stat.player) {
      return;
    }

    let playerId = stat.player.id;
    if (!this.data[playerId]) {
      this.data[playerId] = createEmptyStatObject();
    }
    let type = `${stat.type}${stat.points || ''}`;
    let point = points[type];
    if (point) {
      let periodKey = `period${period}`;

      if (!this.data[playerId].periods[periodKey]) {
        /* eslint-disable camelcase */
        this.data[playerId].periods[periodKey] = {
          period_num: period,
          points: 0
        };
        /* eslint-enable camelcase */
      }

      this.data[playerId][type] += point;
      this.data[playerId].periods[periodKey].points += point;
      this.data[playerId].all += point;
    }
  }

  setEvent(period, event) {
    if (!event.statistics || !event.statistics.length) {
      return;
    }

    for (let stat of event.statistics) {
      this.setState(period, stat);
    }
  }

  *save() {
    for (let key in this.data) {
      let stat = this.data[key];
      let periods = _.defaults(stat.periods, emptyPeriod);

      delete stat.periods;

      /* eslint-disable camelcase */
      let id = yield mysql('player_stats').insert(_.extend(stat, {
        player_uid: key,
        game_uid: this.id
      }), 'id');
      let periodInsert = _.map(_.values(periods), function (val) {
        val.player_stats_id = id;
        return val;
      });
      /* eslint-enable camelcase */


      yield mysql('period_stats').insert(periodInsert);
    }
  }
}

module.exports = Game;
