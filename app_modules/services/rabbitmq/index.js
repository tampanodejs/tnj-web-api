'use strict';
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
global.rabbit = require('352-wascally');
var rabbit = global.rabbit;
var logger = global.logger;

module.exports = {
  init: init
};

function init() {

  var config = {
    connection: {
      user: process.env.AMQP_USER || null,
      pass: process.env.AMQP_PASSWORD || null,
      server: process.env.AMQP_HOST || '127.0.0.1',
      port: process.env.AMQP_PORT || 5672,
      vhost: process.env.AMQP_VHOST || null
    },
    exchanges: [
      {
        name: 'tnj.' + process.env.NODE_ENV,
        type: 'topic',
        persistent: true
      }
    ],
    queues: [
      {
        name: 'tnj.api',
        limit: 100,
        queueLimit: 100000,
        subscribe: true,
        durable: true,
        deadLetterExchange: 'tnj-deadLetter.' + process.env.NODE_ENV,
        deadLetterRoutingKey: 'tnj.api.rejected'
      },
      {
        name: 'tnj.api.rejected',
        subscribe: false,
        messageTtl: 3600000
      }
    ],
    bindings: [
      {
        exchange: 'tnj.' + process.env.NODE_ENV, target: 'tnj.api',
        keys: [
          'tnj.api.#'
        ]
      },
      {
        exchange: 'tnj-deadLetter.' + process.env.NODE_ENV, target: 'tnj.api.rejected',
        keys: ['api.rejected']
      }
    ]
  };

  rabbit.configure(config).done(function() {
    logger.info('Connection to RabbitMQ established');
  });
}