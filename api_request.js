/**
 * Created by shengyun-zhou on 17-3-4.
 */

var config = require('./config').config;
exports.start_request = function (url, method, token, json_data, callback) {
  var req = require('request');

  var opt = {
    method: method,
    url: config.http_api_base_url_v1 + url,
    json: true,
    timeout: 10000
  };

  if (json_data) {
    opt.body = json_data;
  }
  if (token) {
    opt.headers = {};
    opt.headers['Auth-Token'] = token;
  }
  req(opt, callback);
};