'use strict';

const logger = require('winston');
const when = require('when');
logger.setLevels(logger.config.syslog.levels);
const env = require('common-env/withLogger')(logger);
const config = env.getOrElseAll({
  amqp: {
    uri: 'amqp://guest:guest@localhost:5672/%2F',
    queue: {
      name: 'dead-letter-queue',
      noAck: false
    },
    exchange: {
      name: 'exchange-to-publish',
      overrideRoutingKey: '' //If empty, do not override
    }
  }
});

require('amqplib').connect(config.amqp.uri).then(function(conn) {
  const exit = () => conn.close();
  process.once('SIGINT', exit);

  const queueCh = conn.createChannel();
  const exchangeCh = conn.createChannel();

  const queueOk = queueCh.then(ch => ch.checkQueue(config.amqp.queue.name));
  const exchangeOk = exchangeCh.then(ch => ch.checkExchange(config.amqp.exchange.name));

  when.join(queueCh, queueOk, exchangeCh, exchangeOk)
    .spread(function(queueCh, queueOk, exchangeCh, exchangeOk) {
      return queueCh.consume(config.amqp.queue.name, function(msg) {
        const fields = msg.fields;
        const properties = msg.properties;
        const content = msg.content;
        const routingKey = config.amqp.exchange.overrideRoutingKey === '' ? fields.routingKey : config.amqp.exchange.overrideRoutingKey;
        logger.info(`Replaying message with rk ${routingKey}`, fields);
        if(exchangeCh.publish(config.amqp.exchange.name, routingKey, content, properties)){
          queueCh.ack(msg);
        }
      }, {
        noAck: config.amqp.noAck
      });
    })
    .then(_consumeOk => logger.debug('Waiting for messages. To exit press CTRL+C'))
    .otherwise(err => {
      logger.error('error', err);
      exit();
    });
}).then(null, console.warn);
