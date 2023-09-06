"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kafka_1 = __importDefault(require("./config/kafka"));
const kafka_2 = __importDefault(require("./transports/kafka"));
class MicroserviceTransports {
    constructor(transports) {
        this.transports = [];
        this.isConnected = false;
        transports.forEach((transport) => {
            switch (transport) {
                case 'kafka':
                    this.transports.push(new kafka_2.default(kafka_1.default));
                    break;
                default:
                    throw new Error(`Transport ${transport} not implemented`);
            }
        });
    }
    async addListener(method, topic, callback) {
        const transport = this.transports.find((transport) => transport.type === method);
        if (!transport)
            throw new Error('Transport not found');
        transport.addListener(topic, callback);
    }
    getTransport(method) {
        const found = this.transports.find((t) => t.type === method);
        if (!found)
            throw new Error(`Transport not found`);
        switch (method) {
            case 'kafka':
                return found;
            default:
                throw new Error(`Transport ${method} not implemented`);
        }
    }
    async connect() {
        for (const transport of this.transports) {
            await transport.connect();
        }
    }
    async disconnect() {
        for (const transport of this.transports) {
            await transport.disconnect();
        }
    }
}
exports.default = MicroserviceTransports;
