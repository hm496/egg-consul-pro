const createConsul = require('./lib/consul');

module.exports = app => {
  app.addSingleton('consul', createConsul);
}
