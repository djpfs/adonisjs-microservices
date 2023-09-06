import { Consumer, Producer, Kafka, Admin, Logger } from 'kafkajs';
import { KafkaTransportConfig } from '../config/kafka';
import { TransportMethods } from '@ioc:Microservice/Transports';
import MicroserviceTransportBase from './base';
export interface KafkaPayload {
    message: string;
    topic: string;
    partition: number;
    offset: string;
}
export default class KafkaTransport implements MicroserviceTransportBase {
    readonly type: TransportMethods;
    readonly instance: Kafka;
    readonly consumer: Consumer;
    readonly producer: Producer;
    readonly admin: Admin;
    readonly logger: Logger;
    private listeners;
    constructor(config: KafkaTransportConfig);
    private createInitialTopics;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    private listen;
    addListener(topic: string, callback: any): Promise<void>;
}
