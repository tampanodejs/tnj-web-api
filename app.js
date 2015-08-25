/*jshint node:true*/
'use strict';
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

var config = require('./app_modules/config/environment');
config.init(['logger', 'mongo', 'rabbitmq', 'express'], function() {
  var rabbit = global.rabbit;
  var logger = global.logger;

  /*
   * This handler is for messages that are sent to but not handled by this worker
   */

  var unhandledMessageHandler = rabbit.onUnhandled(function(message) {
    message.body.rejection_reason = 'No handler available for this message';
    if (message.reply) {
      message.reply(message.body);
    } else {
      message.reject();
    }
  });
});
