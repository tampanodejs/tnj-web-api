'use strict';
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
var swagger_node_express = require('swagger-node-express');
var controller = require('./runkeeper.controller.js');
var paramTypes = swagger_node_express.paramTypes;
var errors = swagger_node_express.errors;

exports.get = {
  'spec': {
    path : '/runkeeper',
    notes : 'GET request to TNJ for A RunKeeper profile',
    method: 'GET',
    summary : 'GET request to RunKeeper',
    parameters : [
      paramTypes.query('query_params', 'Optional query params', 'string')
    ],
    responseMessages : [],
    nickname : 'get'
  },
  'action': controller.get
};

exports.get = {
  'spec': {
    path : '/runkeeper/fitness_activities',
    notes : 'GET request to TNJ for A RunKeeper profile',
    method: 'GET',
    summary : 'GET request to RunKeeper',
    parameters : [
      paramTypes.query('query_params', 'Optional query params', 'string')
    ],
    responseMessages : [],
    nickname : 'get'
  },
  'action': controller.get
};