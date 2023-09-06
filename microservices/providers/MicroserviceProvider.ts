import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import path from 'path'
import fs from 'fs'
import MicroserviceTransports from '../transports'

export default class MicroserviceProvider {
  constructor(protected app: ApplicationContract) {}

  public register(): void {
    this.app.container.singleton('Microservice/Transports', () => {
      return new MicroserviceTransports(['kafka'])
    })
  }

  public async boot(): Promise<void> {
    const controllersPath = path.join(this.app.appRoot, 'app/Controllers')
    let files = fs.readdirSync(controllersPath, { withFileTypes: true })
    files = files.filter((file) => file.isFile() && file.name.endsWith('.ts'))
    for (const file of files) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Controller = require(`${file.name}`).default
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
