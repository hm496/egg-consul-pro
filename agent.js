const createConsul = require('./lib/consul');

module.exports = agent => {
  agent.addSingleton('consul', createConsul);
}
