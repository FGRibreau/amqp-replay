# amqp-replay

Replay messages from (RabbitMQ) AMQP dead-letter queue


## Philosophy

When you use AMQP dead-letter queue, you need to pass a...
(todo, insert a screenshot from replay lecture here)

## Getting Started

```
npm i amqp-replay -g

AMQP_URI="amqp://user:password@rabbitmq.ndd.com:5672/%2F" AMQP_QUEUE_NAME="social.test" AMQP_EXCHANGE_NAME="fgtest" amqp-replay
```

## Donate

I maintain this project in my free time, if it helped you please support my work [via paypal](https://paypal.me/FGRibreau), thanks a lot!

## License

See [LICENSE](/LICENSE).
