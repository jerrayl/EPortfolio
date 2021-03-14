const NodeEnvironment = require('../../server/node_modules/jest-environment-node');
const request = require('supertest');
const firebase = require('../../client/node_modules/firebase');
const firebaseConfig = require('../../client/src/utils/firebaseConfig').firebaseConfig;
const path = require('path');

class ServerEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    this.testPath = context.testPath;
    this.docblockPragmas = context.docblockPragmas;
    this.global.app = request(require('../../server/server'));
    this.global.appDir = path.resolve(__dirname);
  }

  async setup() {
    await super.setup();
    //await someSetupTasks(this.testPath);
    //this.global.server = require('../../server/server').server;

    // Will trigger if docblock contains @my-custom-pragma my-pragma-value
    if (this.docblockPragmas['my-custom-pragma'] === 'my-pragma-value') {
      // ...
    }
  }

  async teardown() {
    //await someTeardownTasks();
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }

  async handleTestEvent(event, state) {
    if (event.name === 'test_start') {
      // ...
    }
  }
}

module.exports = ServerEnvironment;