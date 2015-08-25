/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Hello = require('../api/hello/hello.model.js');

Hello.find({}).remove(function() {
  Hello.create({
      firstName: 'Brad',
      lastName: 'Prymicz'
  }, {
      firstName: 'Evol',
      lastName: 'Greaves'
  }, {
      firstName: 'Rich',
      lastName: 'Brookfield'
    }, function() {
      console.log('finished populating Hellos');
    }
  );
});
