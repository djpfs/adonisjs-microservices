import { KafkaConfig as kakfkaOriginalConfig, SASLOptions, logLevel } from 'kafkajs'
import Env from '@ioc:Adonis/Core/Env'

export interface KafkaTransportConfig extends kakfkaOriginalConfig {
  groupId: string
}

export const kafkaConfig: KafkaTransportConfig = {
  clientId: Env.get('KAFKA_CLIENT_ID'),
  groupId: Env.get('KAFKA_GROUP_ID'),
  brokers: Env.get('KAFKA_BROKERS')?.split(',') || ['localhost:9092'],
  ssl: Env.get('KAFKA_SSL') === true,
  sasl:
    Env.get('KAFKA_SASL') === true
      ? ({
          mechanism: Env.get('KAFKA_SASL_MECHANISM') || 'plain',
          username: Env.get('KAFKA_SASL_USERNAME') || '',
          password: Env.get('KAFKA_SASL_PASSWORD') || '',
        } as SASLOptions)
      : undefined,
  logLevel: Env.get('KAFKA_LOG_LEVEL') || logLevel.ERROR,
}