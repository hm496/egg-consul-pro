const consul = require('consul');
const { EventEmitter } = require('events');
const assert = require("assert");

const cacheServiceWatch = {};

function createConsul (config, app) {
  const client = consul(Object.assign(config, { promisify: true }));

  return Object.assign(Object.create(new EventEmitter), {
    client, // consul client实例
    // 添加监听Service变化
    addServiceWatch (serviceName, tag = "") {
      assert(serviceName && typeof serviceName === "string", '[egg-consul-pro] [addServiceWatch] serviceName is required and must be string');
      const serviceName_tag = `[service:${serviceName},tag:${tag}]`;
      if (!cacheServiceWatch[serviceName_tag]) {
        const consulIns = this.client;
        cacheServiceWatch[serviceName_tag] = consulIns.watch({
          method: consulIns.health.service,
          options: {
            passing: true,
            service: serviceName,
            tag,
          }
        });

        cacheServiceWatch[serviceName_tag].on('error', error => {
          app.logger.error('[egg-consul-pro] [watch]', error);
        });

        cacheServiceWatch[serviceName_tag].on('change', nodes => {
          nodes.forEach((item) => {
            item.peer = item.Service.Address + ':' + item.Service.Port;
          });
          this.emit('serviceChange', {
            serviceName,
            tag,
            nodes
          });
        });
      }
    },
    getNodes (serviceName, tag = "") {
      assert(serviceName && typeof serviceName === "string", '[egg-consul-pro] [getNodesByService] serviceName is required and must be string');
      const consulIns = this.client;
      // 添加监听
      return consulIns.health.service({
        passing: true,
        service: serviceName,
        tag,
      }).then(nodes => {
        nodes.forEach((item) => {
          item.peer = item.Service.Address + ":" + item.Service.Port;
        });
        if (nodes.length > 0) {
          this.addServiceWatch(serviceName, tag = '');
        }
        return nodes;
      }).catch(() => []);
    },
  });
}

module.exports = createConsul;
