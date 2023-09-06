"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const transports_1 = __importDefault(require("../transports"));
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
        const controllersPath = path_1.default.join(this.app.appRoot, 'app/Controllers');
        let files = fs_1.default.readdirSync(controllersPath, { withFileTypes: true });
        files = files.filter((file) => file.isFile() && file.name.endsWith('.ts'));
        for (const file of files) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const Controller = require(`${file.name}`).default;
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
