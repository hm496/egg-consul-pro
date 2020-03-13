# egg-consul-pro
[consul](https://github.com/silas/node-consul) plugin for egg.      
## Install

```sh
$ npm i egg-consul-pro
```

## Configuration

`egg-consul-pro` support all configurations in [consul](https://github.com/silas/node-consul).

- promisify: `true` => Cannot Modify

```js
// {app_root}/config/config.default.js

// Single Consul
exports.consul = {
  client: {
    host: "127.0.0.1",
    port: 7888,
    promisify: true,
  }
};

// Multi Consul
exports.consul = {
  clients: {
    instance1: {
      host: "127.0.0.1",
      port: 7888,
      promisify: true,
    },
    instance2: {
      host: "127.0.0.1",
      port: 7888,
      promisify: true,
    },
  }
};
```

## Usage

```js
// {app_root}/app.js

class AppBootHook {
  constructor (app) {
    this.app = app;
  }

  async didLoad () {
    // Single Consul
    if (this.app.consul) {
      this.app.consul.client; // consul client
      this.app.consul.getNodes("serviceName","tag").then(nodes => {
        console.log(nodes);
      });
      this.app.consul.on("serviceChange", ({serviceName,tag,nodes}) => {
        console.log(serviceName,tag,nodes);
      });
    }
  }
}

module.exports = AppBootHook;
```

## Questions & Suggestions

Please open an issue [here](https://github.com/hm496/egg-consul-pro/issues).

## License

[MIT](https://github.com/hm496/egg-consul-pro/blob/master/LICENSE)
