# amqp-replay

[![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/francois-guillaume-ribreau?utm_source=github&utm_medium=button&utm_term=francois-guillaume-ribreau&utm_campaign=github) [![Slack](https://img.shields.io/badge/Slack-Join%20our%20tech%20community-17202A?logo=slack)](https://join.slack.com/t/fgribreau/shared_invite/zt-edpjwt2t-Zh39mDUMNQ0QOr9qOj~jrg)

Replay messages from (RabbitMQ) AMQP dead-letter queue


## Philosophy

![amqp-replay](https://cloud.githubusercontent.com/assets/138050/15161286/dced5818-16fd-11e6-95db-9a657000ed52.gif)

## Getting Started


##### Setup with Docker

```
# add this to your [bash|zsh]rc and source it
function amqp-replay(){
  docker run -it -e AMQP_URI=$AMQP_URI -e AMQP_QUEUE_NAME=$AMQP_QUEUE_NAME -e AMQP_QUEUE_NOACK=$AMQP_QUEUE_NOACK -e AMQP_EXCHANGE_NAME=$AMQP_EXCHANGE_NAME --rm fgribreau/amqp-replay:v0.3.0
}
```


##### Setup with Node

```
npm i amqp-replay -g
```

##### Run it

```
AMQP_URI="amqp://user:password@rabbitmq.ndd.com:5672/%2F" AMQP_QUEUE_NAME="social.test" AMQP_EXCHANGE_NAME="fgtest" amqp-replay
```

Add `INFINITE=true` to replay the queue message infinitely.

## License

See [LICENSE](/LICENSE).
