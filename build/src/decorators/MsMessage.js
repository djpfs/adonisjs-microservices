"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Transports_1 = __importDefault(require("@ioc:Microservice/Transports"));
function MsMessage(topic) {
    return function (_target, _propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const splitedTopic = topic.split('.');
        if (splitedTopic.length < 2)
            throw new Error('Invalid topic, must be like: kafka.topic');
        const method = splitedTopic[0];
        const topicListener = splitedTopic.slice(1).join('.');
        Transports_1.default.addListener(method, topicListener, originalMethod);
        return descriptor;
    };
}
exports.default = MsMessage;
