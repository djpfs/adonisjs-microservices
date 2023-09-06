"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
function getStub(path) {
    return (0, path_1.join)(__dirname, 'templates', path);
}
function makeConfig(projectRoot, app, sink) {
    const configPath = app.makePath('config/microservices.ts');
    const kafkaConfig = new sink.files.MustacheFile(projectRoot, configPath, getStub('config.txt'));
    if (kafkaConfig.exists()) {
        sink.logger.action('skip').succeeded(configPath);
        return;
    }
    kafkaConfig.commit();
    sink.logger.action('create').succeeded(configPath);
}
function makeContract(projectRoot, app, sink) {
    const contractsPath = app.makePath('contracts/microservices.ts');
    const kafkaContract = new sink.files.MustacheFile(projectRoot, contractsPath, getStub('contract.txt'));
    if (kafkaContract.exists()) {
        sink.logger.action('skip').succeeded('contracts/microservices.ts');
        return;
    }
    kafkaContract.commit();
    sink.logger.action('create').succeeded('contracts/microservices.ts');
}
function makeProvider(projectRoot, app, sink) {
    const providerPath = app.makePath('providers/MicroserviceProvider.ts');
    const kafkaStart = new sink.files.MustacheFile(projectRoot, providerPath, getStub('provider.txt'));
    if (kafkaStart.exists()) {
        sink.logger.action('skip').succeeded('providers/MicroserviceProvider.ts');
        return;
    }
    kafkaStart.commit();
    sink.logger.action('create').succeeded('providers/MicroserviceProvider.ts');
}
async function instructions(projectRoot, app, sink) {
    makeConfig(projectRoot, app, sink);
    makeContract(projectRoot, app, sink);
    makeProvider(projectRoot, app, sink);
}
exports.default = instructions;
