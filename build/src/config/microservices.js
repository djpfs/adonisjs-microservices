"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kafkaConfig = void 0;
const kafkajs_1 = require("kafkajs");
const Env_1 = __importDefault(require("@ioc:Adonis/Core/Env"));
exports.kafkaConfig = {
    clientId: Env_1.default.get('KAFKA_CLIENT_ID'),
    groupId: Env_1.default.get('KAFKA_GROUP_ID'),
    brokers: Env_1.default.get('KAFKA_BROKERS')?.split(',') || ['localhost:9092'],
    ssl: Env_1.default.get('KAFKA_SSL') === true,
    sasl: Env_1.default.get('KAFKA_SASL') === true
        ? {
            mechanism: Env_1.default.get('KAFKA_SASL_MECHANISM') || 'plain',
            username: Env_1.default.get('KAFKA_SASL_USERNAME') || '',
            password: Env_1.default.get('KAFKA_SASL_PASSWORD') || '',
        }
        : undefined,
    logLevel: Env_1.default.get('KAFKA_LOG_LEVEL') || kafkajs_1.logLevel.ERROR,
};
