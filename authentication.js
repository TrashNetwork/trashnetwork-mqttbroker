/**
 * Created by shengyun-zhou on 17-3-4.
 */

var USER_TYPE_WEBSERVER = 'trashnetwork_webserver_user';
var USER_TYPE_MOBILE = 'trashnetwork_mobile_user';

var logger = require('./log').logger;
logger.setLevel('INFO');
var request = require('./api_request');

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
      case USER_TYPE_MOBILE:
        url = 'mobile/account/check_login/' + user_id;
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

module.exports={
  authenticate: authenticate_connection,
};
