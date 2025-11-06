/*
 * Connect all of your endpoints together here.
 */
// module.exports = function (app, router) {
//     app.use('/api', require('./home.js')(router));
// };














// routes/index.js
const express = require('express');

module.exports = function (app) {
  app.use('/api', require('./home')(express.Router()));
  app.use('/api/users', require('./users')(express.Router()));
  app.use('/api/tasks', require('./tasks')(express.Router()));
};
