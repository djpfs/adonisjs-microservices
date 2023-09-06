import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import MicroserviceTransports from '../transports'
import { KafkaTransportConfig } from '../config/microservices'
import path from 'path'
import  { readdir } from 'fs/promises'
import { Dirent } from 'fs'

export default class MicroserviceProvider {
  constructor(protected app: ApplicationContract) {}

  public register(): void {
    this.app.container.singleton('Microservice/Transports', () => {
      const { kafkaConfig } =  require('../config/kafka')
      return new MicroserviceTransports(['kafka'], kafkaConfig as KafkaTransportConfig )
    })
  }

  public async boot(): Promise<void> {
   async function walk(dirPath: string): Promise<Dirent[]> {
    return await Promise.all(
      await readdir(dirPath, { withFileTypes: true }).then((entries) => entries.map((entry) => {
        const childPath = path.join(dirPath, entry.name)
        return entry.isDirectory() ? walk(childPath) : childPath
      })) as Dirent[]
    )
   }
    const files = await walk(path.join(this.app.appRoot, 'app/Controllers'))
    for (const file of files) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Controller = require(`${file}`).default
      new Controller()
    }
  }

  public async ready(): Promise<void> {
    await this.app.container.use('Microservice/Transports').connect()
  }

  public async shutdown(): Promise<void> {
    this.app.container.use('Microservice/Transports').disconnect()
  }
}
