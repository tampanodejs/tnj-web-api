/**
 * Main application routes
 */
(function() {
  'use strict';

  module.exports = function(app, swagger, passport) {

    // Insert routes below
    app.use('/api/tnj', require('../api/tnj/tnj.index')(swagger));
    // End Routes  - DO NOT REMOVE COMMENT
  };
})();
