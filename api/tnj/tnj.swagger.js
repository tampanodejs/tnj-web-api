'use strict';
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
var swagger_node_express = require('swagger-node-express');
var controller = require('./tnj.controller.js');
var paramTypes = swagger_node_express.paramTypes;
var errors = swagger_node_express.errors;

exports.get = {
  'spec': {
    path : '/users',
    notes : 'GET request to TNJ for Users.',
    method: 'GET',
    summary : 'GET request to Twitter',
    parameters : [
      paramTypes.query('query_params', 'Optional query params', 'string')
    ],
    responseMessages : [],
    nickname : 'get'
  },
  'action': controller.get
};

exports.post = {
  'spec': {
    path : '/users/',
    notes : 'POST to TNJ for Users.',
    method: 'POST',
    summary : 'POST to Twitter',
    parameters : [
      paramTypes.form('data', 'Data to post to TNJ Users', 'json')
    ],
    responseMessages : [],
    nickname : 'post'
  },
  'action': controller.post
};
