/**
 * Created by shengyun-zhou on 17-3-4.
 */

var MQTT_TOPIC_TYPE_CONS= {
  TOPIC_TYPE_ALL_PUBLIC: 0,
  TOPIC_TYPE_MOBILE_CLEANING_PUBLIC: 10000,
  TOPIC_TYPE_MOBILE_CLEANING_WEB_PUBLIC: 10001,
  TOPIC_TYPE_MOBILE_CLEANING_GROUP: 10002,
  TOPIC_TYPE_MOBILE_CLEANING_PRIVATE: 10003,
};

var config = {
  mosca: {
    port: 23883
  },

  redis_store: {
    host: "localhost",
    port: 6379,
    db: 6,
    ttl: {
      subscriptions: 15 * 24 * 60 * 60 * 1000,       //15 days
      packets: 10 * 24 * 60 * 60 * 1000              //10 days
    }
  },

  mysql_db: {
    connectionLimit : 15,
    host            : 'localhost',
    user            : 'TrashNetwork',
    password        : '4f5100635dc64621aa4ae256daae80046833ce8f',
    database        : 'TrashNetwork'
  },

  http_api_base_url_v1: 'http://localhost:23000/trashnetwork/v1/',

  mqtt_topic_type: {
    chatting_private: MQTT_TOPIC_TYPE_CONS.TOPIC_TYPE_MOBILE_CLEANING_PRIVATE,
    chatting_group: MQTT_TOPIC_TYPE_CONS.TOPIC_TYPE_MOBILE_CLEANING_GROUP,
    cleaner_location: MQTT_TOPIC_TYPE_CONS.TOPIC_TYPE_MOBILE_CLEANING_PUBLIC,
    latest_work_record: MQTT_TOPIC_TYPE_CONS.TOPIC_TYPE_MOBILE_CLEANING_PUBLIC,
    cleaning_reminder: MQTT_TOPIC_TYPE_CONS.TOPIC_TYPE_MOBILE_CLEANING_WEB_PUBLIC,
  }
};

module.exports={
  config: config,
  MQTT_TOPIC_TYPE: MQTT_TOPIC_TYPE_CONS,
};
