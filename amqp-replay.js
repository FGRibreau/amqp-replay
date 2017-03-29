'use strict';

const logger = require('winston');
const when = require('when');
logger.setLevels(logger.config.syslog.levels);
const env = require('common-env/withLogger')(logger);
const config = env.getOrElseAll({
  infinite: false, // whether to replay queue infinitely, or only once
  maxBufferSize: 10000, // in case of finite execution, no more than this max number will be processed
  amqp: {
    uri: 'amqp://guest:guest@localhost:5672/%2F',
    queue: {
      name: { // dead letter queue to read from
        $type: env.types.String
      },
      noAck: false
    },
    exchange: {
      name: { // exchange to publish
        $type: env.types.String
      },
      routingKey: '' // if empty, do not override
    }
  }
});

require('amqplib').connect(config.amqp.uri).then(function(conn) {
  const exit = () => conn.close();
  process.once('SIGINT', exit);

  const queueCh = conn.createConfirmChannel();
  const exchangeCh = conn.createConfirmChannel();

  const queueOk = queueCh.then(ch => ch.checkQueue(config.amqp.queue.name));
  const exchangeOk = exchangeCh.then(ch => ch.checkExchange(config.amqp.exchange.name));

  when.join(queueCh, queueOk, exchangeCh, exchangeOk)
    .spread(function(queueCh, queueOk, exchangeCh, exchangeOk) {

      function handleMessage(msg) {
        const fields = msg.fields;
        const properties = msg.properties;
        const content = msg.content;
        const routingKey = config.amqp.exchange.routingKey === '' ? fields.routingKey : config.amqp.exchange.routingKey;
        logger.info(`Replaying message (routing-key=${routingKey})`, fields);
        if(exchangeCh.publish(config.amqp.exchange.name, routingKey, content, properties)){
          queueCh.ack(msg);
        }
      }

      function getAllMessagesInQueue(res = []) {
        return queueCh.get(config.amqp.queue.name, {noAck: config.amqp.noAck})
          .then(newVal => {
            // `get` return false when no messages are available in queue
            const shouldStop = newVal === false || res.length >= config.maxBufferSize;
            if (shouldStop) {
              return res;
            }

            return getAllMessagesInQueue(res.concat([newVal]));
          });
      }

      if (config.infinite) {
        // replay all messages in queue, infinitely
        return queueCh.consume(config.amqp.queue.name, handleMessage, {noAck: config.amqp.noAck})
          .then(_consumeOk => logger.debug('Waiting for messages. To exit press CTRL+C'))
      } else {
        // get all messages currently in queue, and exit once they are replay
        return getAllMessagesInQueue().then(messages => {
          messages.forEach(handleMessage);

          return when.join(queueCh.waitForConfirms(), exchangeCh.waitForConfirms());
        })
        .then(_consumeOk => {
          console.log('Replayed all messages once.');
          conn.close();
        })
      }
    })
    .otherwise(err => {
      console.error('error', err);
      exit(1);
    });
}).done(null, console.warn);
