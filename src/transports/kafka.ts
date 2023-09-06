import { Consumer, Producer, Kafka, Admin, Logger, Partitioners } from 'kafkajs'
import { KafkaTransportConfig } from '../config/kafka'
import { TransportListener, TransportMethods } from '@ioc:Microservice/Transports'
import MicroserviceTransportBase from './base'

export interface KafkaPayload {
  message: string
  topic: string
  partition: number
  offset: string
}

export default class KafkaTransport implements MicroserviceTransportBase {
  public readonly type: TransportMethods = 'kafka'
  public readonly instance: Kafka
  public readonly consumer: Consumer
  public readonly producer: Producer
  public readonly admin: Admin
  public readonly logger: Logger

  private listeners: TransportListener[] = []

  constructor(config: KafkaTransportConfig) {
    this.instance = new Kafka(config)

    this.consumer = this.instance.consumer({
      groupId: config.groupId,
      allowAutoTopicCreation: true,
    })

    this.producer = this.instance.producer({
      allowAutoTopicCreation: true,
      createPartitioner: Partitioners.LegacyPartitioner,
    })

    this.admin = this.instance.admin()
    this.logger = this.instance.logger()

    this.consumer.on('consumer.crash', (err) => {
      console.log('Kafka consumer crashed: ', err)
    })

    this.consumer.on('consumer.disconnect', (err) => {
      console.log('Kafka consumer disconnected: ', err)
    })

    this.consumer.on('consumer.connect', () => {
      console.log('Kafka consumer connected')
    })

    this.producer.on('producer.connect', () => {
      console.log('Kafka producer connected')
    })
  }
  
  private async createInitialTopics() {
    await this.admin.connect()
    const topics = await this.admin.listTopics()
    const topicsToCreate = this.listeners.filter((listener) => !topics.includes(listener.topic))

    await this.admin.createTopics({
      topics: topicsToCreate.map((listener) => ({ topic: listener.topic })),
      waitForLeaders: true,
    })
  }

  public async connect(): Promise<void> {
    await this.createInitialTopics();
    await this.consumer.connect()
    await this.producer.connect()
    await this.listen()
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
            })
          }
        })
        heartbeat()
      },
    })
  }

  public async disconnect(): Promise<void> {
    await this.consumer.disconnect()
    await this.producer.disconnect()
  }

  private async listen() {
    console.log(this.listeners.map((l) => l.topic))
    await this.consumer.subscribe({
      topics: this.listeners.map((l) => l.topic),
      fromBeginning: true,
    })
  }

  public async addListener(topic: string, callback: any): Promise<void> {
    const exist = this.listeners.find(
      (listener) => listener.topic === topic && listener.callback === callback
    )
    if (exist) return
    this.listeners.push({ topic, callback })
  }
}
