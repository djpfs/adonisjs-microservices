import { TransportMethods, TransportsContract } from '@ioc:Microservice/Transports'
import kafkaConfig from './config/kafka'
import MicroserviceTransportBase from './transports/base'
import KafkaTransport from './transports/kafka'

export default class MicroserviceTransports implements TransportsContract {
  public readonly transports: MicroserviceTransportBase[] = []
  public isConnected = false

  constructor(transports: TransportMethods[]) {
    transports.forEach((transport) => {
      switch (transport) {
        case 'kafka':
          this.transports.push(new KafkaTransport(kafkaConfig))
          break
        default:
          throw new Error(`Transport ${transport} not implemented`)
      }
    })
  }

  public async addListener(method: TransportMethods, topic: string, callback: any): Promise<void> {
    const transport = this.transports.find((transport) => transport.type === method)
    if (!transport) throw new Error('Transport not found')
    transport.addListener(topic, callback)
  }

  public getTransport<T>(method: TransportMethods) {
    const found = this.transports.find((t) => t.type === method)
    if (!found) throw new Error(`Transport not found`)
    switch (method) {
      case 'kafka':
        return found as T
      default:
        throw new Error(`Transport ${method} not implemented`)
    }
  }

  public async connect(): Promise<void> {
    for (const transport of this.transports) {
      await transport.connect()
    }
  }

  public async disconnect() {
    for (const transport of this.transports) {
      await transport.disconnect()
    }
  }
}
