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
      name: 'exchange-to-publish'
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
        logger.debug(" [x] Received '%s'", msg.content.toString());
        exchangeCh.publish(config.amqp.exchange.name, fields.routingKey, content, properties);
      }, {
        noAck: config.amqp.noAck
      });
    })
    .then(_consumeOk => logger.debug(' [*] Waiting for messages. To exit press CTRL+C'))
    .otherwise(err => {
      logger.error('error', err);
      exit();
    });
}).then(null, console.warn);
//
// var argv = require('yargs').usage('Usage: $0 <command> [options]').option('J', {
//   alias: 'jscs',
//   default: './.jscsrc',
//   description: 'jscsrc file path',
//   type: 'string'
// }).option('O', {
//   alias: 'output',
//   default: './README.html',
//   description: 'HTML output file path',
//   type: 'string'
// }).help('h').alias('h', 'help').version().argv;
//
// var resolve = function resolve(path) {
//   return p.resolve(process.cwd(), path);
// };
