"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transports_1 = __importDefault(require("../transports"));
const path_1 = __importDefault(require("path"));
const promises_1 = require("fs/promises");
class MicroserviceProvider {
    constructor(app) {
        this.app = app;
    }
    register() {
        this.app.container.singleton('Microservice/Transports', () => {
            const { kafkaConfig } = require('../config/kafka');
            return new transports_1.default(['kafka'], kafkaConfig);
        });
    }
    async boot() {
        const walk = async (dirPath) => Promise.all(await (0, promises_1.readdir)(dirPath, { withFileTypes: true }).then((entries) => entries.map((entry) => {
            const childPath = path_1.default.join(dirPath, entry.name);
            return entry.isDirectory() ? walk(childPath) : childPath;
        })));
        const files = await walk(path_1.default.join(this.app.appRoot, 'app/Controllers'));
        for (const file of files) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const Controller = require(`${file}`).default;
            new Controller();
        }
    }
    async ready() {
        await this.app.container.use('Microservice/Transports').connect();
    }
    async shutdown() {
        this.app.container.use('Microservice/Transports').disconnect();
    }
}
exports.default = MicroserviceProvider;
