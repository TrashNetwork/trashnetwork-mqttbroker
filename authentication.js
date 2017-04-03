/**
 * Created by shengyun-zhou on 17-3-4.
 */

var USER_TYPE_WEBSERVER = 'trashnetwork_webserver_user';
var USER_TYPE_MOBILE_CLEANING = 'trashnetwork_mobile_cleaning_user';

var logger = require('./log').logger;
logger.setLevel('INFO');
var request = require('./api_request');
var config = require('./config').config;
var MQTT_TOPIC_TYPE = require('./config').MQTT_TOPIC_TYPE;
var db_util = require('./database_utils');

var authenticate_connection = function(client, username, password, callback) {
  var authorized = false;
  var url = undefined;
  if(client.id != username) {
    logger.error('Failed to authenticate user <' + username + '>');
    callback(null, false);
    return;
  }
  try{
    var user_type = username.split(':')[0];
    var user_id = username.split(':')[1];
    switch (user_type){
      case USER_TYPE_WEBSERVER:
        //Hard code to simply checking
        if(user_id == 'admin' && password.toString() == '123456')
          authorized = true;
        break;
      case USER_TYPE_MOBILE_CLEANING:
        url = 'mobile/cleaning/account/check_login/' + user_id;
        break;
    }
  }catch (err){
    logger.error(err)
  }
  if(url){
    request.start_request(url, 'GET', password.toString(), undefined, function (error, res, data) {
      if(!error){
        if(res.statusCode == 200 && data.result_code == 0)
          authorized = true;
      }else{
        logger.error(error);
      }
      on_authenticate_connection_finished(authorized, username, user_id, user_type, client, callback);
    });
  }else {
    on_authenticate_connection_finished(authorized, username, user_id, user_type, client, callback);
  }
};

function on_authenticate_connection_finished(authorized, username, user_id, user_type, client, callback) {
  if (authorized) {
    //User ID and type will be used for subscribing and publishing later
    client.user_id = user_id;
    client.user_type = user_type;
    logger.info('Succeed to authenticate user <' + username+ '>');
  } else
    logger.error('Failed to authenticate user <' + username + '>');
  callback(null, authorized);
}

var SPECIAL_WORK_GROUP_ID = 1;

function parse_topic(full_topic) {
  var topic_split = full_topic.split('/');
  var result = {
    topic: topic_split[0]
  };
  if(topic_split[1])
    result.owner = topic_split[1];
  return result;
}

function check_permission(client, topic, wr_perm, callback) {
  var parsed_topic = parse_topic(topic);
  var topic_type = config.mqtt_topic_type[parsed_topic.topic];
  if(topic_type == undefined) {
    on_authorize_finished(false, client, topic, wr_perm, callback);
    return;
  }
  if(client.user_type == USER_TYPE_WEBSERVER){
    on_authorize_finished(true, client, topic, wr_perm, callback);
    return;
  }
  switch (topic_type){
    case MQTT_TOPIC_TYPE.TOPIC_TYPE_ALL_PUBLIC:
      on_authorize_finished(true, client, topic, wr_perm, callback);
      break;
    case MQTT_TOPIC_TYPE.TOPIC_TYPE_MOBILE_CLEANING_PUBLIC:
      if(client.user_type == USER_TYPE_MOBILE_CLEANING)
        on_authorize_finished(true, client, topic, wr_perm, callback);
      else
        on_authorize_finished(false, client, topic, wr_perm, callback);
      break;
    case MQTT_TOPIC_TYPE.TOPIC_TYPE_MOBILE_CLEANING_WEB_PUBLIC:
      if(wr_perm == 'r')
        on_authorize_finished(true, client, topic, wr_perm, callback);
      else
        on_authorize_finished(false, client, topic, wr_perm, callback);
      break;
    case MQTT_TOPIC_TYPE.TOPIC_TYPE_MOBILE_CLEANING_PRIVATE:
      if(parsed_topic.owner == undefined || client.user_type != USER_TYPE_MOBILE_CLEANING)
        on_authorize_finished(false, client, topic, wr_perm, callback);
      else if(wr_perm == 'w')
        on_authorize_finished(true, client, topic, wr_perm, callback);
      else if(client.user_id == parsed_topic.owner)
        on_authorize_finished(true, client, topic, wr_perm, callback);
      else
        on_authorize_finished(false, client, topic, wr_perm, callback);
      break;
    case MQTT_TOPIC_TYPE.TOPIC_TYPE_MOBILE_CLEANING_GROUP:
      if(parsed_topic.owner == undefined)
        on_authorize_finished(false, client, topic, wr_perm, callback);
      else if(client.user_type == USER_TYPE_MOBILE_CLEANING){
        if(parseInt(parsed_topic.owner) == SPECIAL_WORK_GROUP_ID){
          on_authorize_finished(true, client, topic, wr_perm, callback);
        }else{
          db_util.query_cleaning_group_member(parsed_topic.owner, client.user_id, function (err, rows, fields) {
            if(err || rows.length <= 0){
              if(err)
                logger.error(err);
              on_authorize_finished(false, client, topic, wr_perm, callback);
            }else {
              on_authorize_finished(true, client, topic, wr_perm, callback);
            }
          });
        }
      }else
        on_authorize_finished(false, client, topic, wr_perm, callback);
      break;
    default:
      on_authorize_finished(false, client, topic, wr_perm, callback);
  }
}

function on_authorize_finished(authorized, client, topic, wr_perm, callback) {
  switch (wr_perm){
    case 'w':
      if(authorized)
        logger.info('User <' + client.user_type + ':' + client.user_id + '> can publish on topic <' + topic + '>');
      else
        logger.error('User <' + client.user_type + ':' + client.user_id + '> have no permission to publish on topic <' + topic + '>');
      break;
    case 'r':
      if(authorized)
        logger.info('User <' + client.user_type + ':' + client.user + '> can receive messages on topic <' + topic + '>');
      else
        logger.error('User <' + client.user_type + ':' + client.user + '> have no permission to receive messages on topic <' + topic + '>');
  }
  callback(null, authorized);
}

var authorize_publish = function(client, topic, payload, callback) {
  check_permission(client, topic, 'w', callback);
};

var authorize_subscribe = function(client, topic, callback) {
  check_permission(client, topic, 'r', callback);
};

module.exports={
  authenticate: authenticate_connection,
  authorize_publish: authorize_publish,
  authorize_subscribe: authorize_subscribe,
};
