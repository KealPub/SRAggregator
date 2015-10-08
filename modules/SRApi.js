/**
 * @module Sport Radar API
 */
'use strict';
let _ = require('lodash');
let request = require('request');

class SRApi {
  constructor(key, mod) {
    this.apiKey = key;
    this.mod = mod || 'nba-t3';
  }

  getGames(type, season) {
    let url = `games/${season || new Date().getFullYear() - 1}/${type || 'REG'}/schedule.json`;
    return this.request(url);
  }

  getStats(id) {
    let url = `games/${id}/pbp.json`;
    return this.request(url);
  }

  request(paramsUrl) {
    let url = `http://api.sportradar.us/${this.mod}/${paramsUrl}?api_key=${this.apiKey}`;
    return new Promise(function (res, rej) {
      request.get({url: url, json: true}, function (err, response, body) {
        if (err) {
          return rej(err);
        }
        res(body);
      });
    });
  }

}

module.exports = SRApi;
