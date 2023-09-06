"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
class KafkaTransport {
    constructor(config) {
        this.type = 'kafka';
        this.listeners = [];
        this.instance = new kafkajs_1.Kafka(config);
        this.consumer = this.instance.consumer({
            groupId: config.groupId,
            allowAutoTopicCreation: true,
        });
        this.producer = this.instance.producer({
            allowAutoTopicCreation: true,
            createPartitioner: kafkajs_1.Partitioners.LegacyPartitioner,
        });
        this.admin = this.instance.admin();
        this.logger = this.instance.logger();
        this.consumer.on('consumer.crash', (err) => {
            console.log('Kafka consumer crashed: ', err);
        });
        this.consumer.on('consumer.disconnect', (err) => {
            console.log('Kafka consumer disconnected: ', err);
        });
        this.consumer.on('consumer.connect', () => {
            console.log('Kafka consumer connected');
        });
        this.producer.on('producer.connect', () => {
            console.log('Kafka producer connected');
        });
    }
    async createInitialTopics() {
        await this.admin.connect();
        const topics = await this.admin.listTopics();
        const topicsToCreate = this.listeners.filter((listener) => !topics.includes(listener.topic));
        await this.admin.createTopics({
            topics: topicsToCreate.map((listener) => ({ topic: listener.topic })),
            waitForLeaders: true,
        });
    }
    async connect() {
        await this.createInitialTopics();
        await this.consumer.connect();
        await this.producer.connect();
        await this.listen();
        await this.consumer.run({
            autoCommit: false,
            eachMessage: async ({ topic, message, partition, heartbeat }) => {
                this.listeners.forEach((listener) => {
                    if (listener.topic === topic) {
                        listener.callback({
                            message: message.value?.toString(),
                            topic: topic,
                            partition,
                            offset: message.offset,
                        });
                    }
                });
                heartbeat();
            },
        });
    }
    async disconnect() {
        await this.consumer.disconnect();
        await this.producer.disconnect();
    }
    async listen() {
        console.log(this.listeners.map((l) => l.topic));
        await this.consumer.subscribe({
            topics: this.listeners.map((l) => l.topic),
            fromBeginning: true,
        });
    }
    async addListener(topic, callback) {
        const exist = this.listeners.find((listener) => listener.topic === topic && listener.callback === callback);
        if (exist)
            return;
        this.listeners.push({ topic, callback });
    }
}
exports.default = KafkaTransport;
