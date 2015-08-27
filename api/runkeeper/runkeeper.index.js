'use strict';
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
var express = require('express');
var controller = require('./runkeeper.controller.js');
var swag = require('./runkeeper.swagger.js');

module.exports = function(swagger) {
  var router = express.Router();
  /*
   * Routes Config
   */
  router.get('/*?', controller.get);
  router.post('/*?', controller.post);
  router.delete('/*?', controller.destroy);
  router.put('/*?', controller.put);
  /*
   * Swagger Config
   */
  swagger.addGet(swag.get);
  return router;
};