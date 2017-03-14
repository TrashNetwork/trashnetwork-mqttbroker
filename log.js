/**
 * Created by shengyun-zhou on 17-3-4.
 */

var log4js = require('log4js');
log4js.configure({
  appenders: [
    {
      type: 'console',
      category: 'Mosca Broker'
    }, {
      type: 'file',
      filename: 'mosca-broker.log',
      maxLogSize: 5 * 1024 * 1024,
      category: 'Mosca Broker'
    }
  ]
});

module.exports={
  logger: log4js.getLogger('Mosca Broker')
};