'use strict';

// Development specific configuration
// ==================================
module.exports = {
  environment: process.env.NODE_ENV,
  // MongoDB connection options
  mongo: {
    uri: process.env.MONGOHQ_URL
  },
  seedDB: false,
  // Express Configuration
  express: {
    port: process.env.PORT || 7200
  }
};