# amqp-replay

[![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/francois-guillaume-ribreau?utm_source=github&utm_medium=button&utm_term=francois-guillaume-ribreau&utm_campaign=github)

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

## Development sponsored by iAdvize

<p align="center">
<a target="_blank" href="https://vimeo.com/121470910"><img style="width:100%" src="https://i.vimeocdn.com/video/509763980.png?mw=638&mh=1080&q=70"></a>
</p>

I work at [iAdvize](http://iadvize.com) as a Lead Developer and Architect. iAdvize is the **leading real-time customer engagement platform in Europe** and is used in 40 different countries. We are one of the french startup with the [fastest growth](http://www.iadvize.com/fr/wp-content/uploads/sites/2/2014/11/CP-Fast-50.pdf) and one of [the **greatest place to work** in **France**](https://vimeo.com/122438055).

We are looking for a [**NodeJS backend developer**](http://smrtr.io/FqP79g), a [Scala backend developer](http://smrtr.io/FqP79g), a [**JavaScript frontend developer**](http://smrtr.io/wR-y4Q), a [Full-stack Developer](http://smrtr.io/SGhrew) and a [DevOps System Engineer](http://smrtr.io/OIFFMQ) in Paris or Nantes. **[Send me a tweet](https://twitter.com/FGRibreau) if you have any questions**!

## License

See [LICENSE](/LICENSE).
