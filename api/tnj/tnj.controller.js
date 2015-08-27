'use strict';
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
var _ = require('lodash');
var rabbit = global.rabbit;
var config = require('../../app_modules/config/environment');
var logger = global.logger;

module.exports = {
  get: get,
  post: post,
  destroy: destroy,
  put: put
};

function formatRequest(params) {
  if (params) {
    var paramsArray = '';
    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        paramsArray += params[key];
      }
    }
    return paramsArray;
  } else {
    return '';
  }
}

function get(req, res) {
  var metaData = req.query.tnj_meta_data;
  var params = formatRequest(req.params);
  delete req.query.tnj_meta_data;
  var data = {
    payload: {
      query_params: req.query,
      resource: params,
      meta_data: metaData
    },
    transaction_id: req.transactionId,
    client_request_id: req.clientRequestId,
    from_api_name: process.env.APP_NAME
  };
  logger.debug(JSON.stringify(data));
  rabbit.request(config.mainExchange, {
    routingKey: 'tnj.main.get',
    type: 'tnj.main.get',
    body: data
  }).then(function(final) {
    logger.debug(JSON.stringify(final.body));
    final.ack();
    res.setHeader('x-transaction-id', final.body.transaction_id);
    res.setHeader('x-client-request-id', final.body.client_request_id);
    return res.status(200).json(final.body.payload);
  });
}

// POST request to Main
function post(req, res) {
  var metaData = req.body.tnj_meta_data;
  var dataParams = req.body.data;

  if (typeof dataParams === 'string') {
    try {
      dataParams = JSON.parse(req.body.data);
    } catch (e) {
      return res.status(500).json({error: 'Invalid data element'});
    }
  }
  delete req.body.tnj_meta_data;
  var params = formatRequest(req.params);
  var data = {
    payload: {
      resource: params,
      data_params: dataParams,
      meta_data: metaData
    },
    transaction_id: req.transactionId,
    client_request_id: req.clientRequestId,
    from_api_name: process.env.APP_NAME
  };
  logger.debug(JSON.stringify(data));
  rabbit.request(config.mainExchange, {
    routingKey: 'tnj.main.post',
    type: 'tnj.main.post',
    body: data
  }).then(function(final) {
    logger.debug(JSON.stringify(final.body));
    final.ack();
    res.setHeader('x-transaction-id', final.body.transaction_id);
    res.setHeader('x-client-request-id', final.body.client_request_id);
    return res.status(200).json(final.body.payload);
  });
}

// PUT request to Main
function put(req, res) {
  var metaData = req.body.tnj_meta_data;
  var dataParams = req.body.data;

  if (typeof dataParams === 'string') {
    try {
      dataParams = JSON.parse(req.body.data);
    } catch (e) {
      return res.status(500).json({error: 'Invalid data element'});
    }
  }
  delete req.body.tnj_meta_data;
  var params = formatRequest(req.params);
  var data = {
    payload: {
      resource: params,
      data_params: dataParams,
      meta_data: metaData
    },
    transaction_id: req.transactionId,
    client_request_id: req.clientRequestId,
    from_api_name: process.env.APP_NAME
  };
  logger.debug(JSON.stringify(data));
  rabbit.request(config.mainExchange, {
    routingKey: 'tnj.main.put',
    type: 'tnj.main.put',
    body: data
  }).then(function(final) {
    logger.debug(JSON.stringify(final.body));
    final.ack();
    res.setHeader('x-transaction-id', final.body.transaction_id);
    res.setHeader('x-client-request-id', final.body.client_request_id);
    return res.status(200).json(final.body.payload);
  });
}

function destroy(req, res) {
  var params = formatRequest(req.params);
  var data = {
    payload: {
      resource: params,
      query_params: req.query
    },
    transaction_id: req.transactionId,
    client_request_id: req.clientRequestId,
    from_api_name: process.env.APP_NAME
  };
  logger.debug(JSON.stringify(data));
  rabbit.request(config.mainExchange, {
    routingKey: 'tnj.main.destroy',
    type: 'tnj.main.destroy',
    body: data
  }).then(function(final) {
    logger.debug(JSON.stringify(final.body));
    final.ack();
    res.setHeader('x-transaction-id', final.body.transaction_id);
    res.setHeader('x-client-request-id', final.body.client_request_id);
    return res.status(200).json(final.body.payload);
  });
}