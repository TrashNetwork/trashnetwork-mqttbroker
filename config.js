/**
 * Created by shengyun-zhou on 17-3-4.
 */

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
  http_api_base_url_v1: 'http://localhost:23000/trashnetwork/v1/',
};

module.exports={
  config: config
};
