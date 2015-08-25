'use strict';

// Development specific configuration
// ==================================
module.exports = {
  environment: process.env.NODE_ENV,
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://127.0.0.1:27017/SND'
  },
  seedDB: false,
  // Express Configuration
  express: {
    port: process.env.PORT || 7200
  }
};