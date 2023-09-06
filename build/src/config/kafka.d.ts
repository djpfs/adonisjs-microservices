import { KafkaConfig } from 'kafkajs';
export interface KafkaTransportConfig extends KafkaConfig {
    groupId: string;
}
declare const kafkaConfig: KafkaTransportConfig;
export default kafkaConfig;
export type { kafkaConfig };
