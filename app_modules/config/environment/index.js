'use strict';
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

var path = require('path');
var _ = require('lodash');

// All configurations will extend these options
// ============================================
var all = {
  seedDB: false,
  init: init,
  mainExchange: 'tnj.' + process.env.NODE_ENV,
  oauth_callback_url: function(service) {
    if (process.env.NODE_ENV === 'dev') {
      return 'http://localhost:7200/api/' + service + '/oauth/callback'
    } else {
      return 'https://tnj-client-api-' + process.env.NODE_ENV + '.herokuapp.com/api/' + service + '/oauth/callback';
    }
  }
};

function init(services, cb) {
  if (services.indexOf('logger') > -1) {
    require('../../services/logger').init();
    services.forEach(function(service) {
      if (service !== 'logger') {
        require('../../services/' + service).init();
      }
    });
  } else {
    services.forEach(function(service) {
      require('../../services/' + service).init();
    });
  }
  var int = setInterval(function() {
    if (global.logger && global.rabbit) {
      initialized();
    }
  }, 100);
  function initialized() {
    clearInterval(int);
    cb();
  }
}

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
