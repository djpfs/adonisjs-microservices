import { KafkaConfig as kakfkaOriginalConfig } from 'kafkajs';
export interface KafkaTransportConfig extends kakfkaOriginalConfig {
    groupId: string;
}
export declare const kafkaConfig: KafkaTransportConfig;
