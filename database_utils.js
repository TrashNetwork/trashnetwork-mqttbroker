/**
 * Created by shengyun-zhou on 17-4-2.
 */


var mysql = require('mysql');
var config = require('./config').config;
var pool  = mysql.createPool(config.mysql_db);

var query_cleaning_group_member = function (group_id, user_id, callback) {
  pool.query('SELECT * FROM cleaning_group_member WHERE group_id=? AND user_id=?',
    [group_id, user_id], callback);
};

module.exports={
  close_db: function () {
    pool.end();
  },
  query_cleaning_group_member: query_cleaning_group_member,
};
