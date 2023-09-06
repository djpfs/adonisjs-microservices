import { join } from 'path'
import * as sinkStatic from '@adonisjs/sink'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

function getStub(path: string) {
  return join(__dirname, 'templates', path)
}

function makeConfig(projectRoot: string, app: ApplicationContract, sink: typeof sinkStatic) {
  const configPath = app.makePath('config/microservices.ts')
  const kafkaConfig = new sink.files.MustacheFile(projectRoot, configPath, getStub('config.txt'))

  if (kafkaConfig.exists()) {
    sink.logger.action('skip').succeeded(configPath)
    return
  }
  kafkaConfig.commit()
  sink.logger.action('create').succeeded(configPath)
}

function makeContract(projectRoot: string, app: ApplicationContract, sink: typeof sinkStatic) {
  const contractsPath = app.makePath('contracts/microservices.ts')
  const kafkaContract = new sink.files.MustacheFile(
    projectRoot,
    contractsPath,
    getStub('contract.txt')
  )

  if (kafkaContract.exists()) {
    sink.logger.action('skip').succeeded('contracts/microservices.ts')
    return
  }
  kafkaContract.commit()
  sink.logger.action('create').succeeded('contracts/microservices.ts')
}


function makeProvider(projectRoot: string, app: ApplicationContract, sink: typeof sinkStatic) {
  const providerPath = app.makePath('providers/MicroserviceProvider.ts')
  const kafkaStart = new sink.files.MustacheFile(projectRoot, providerPath, getStub('provider.txt'))

  if (kafkaStart.exists()) {
    sink.logger.action('skip').succeeded('providers/MicroserviceProvider.ts')
    return
  }
  kafkaStart.commit()
  sink.logger.action('create').succeeded('providers/MicroserviceProvider.ts')
}

export default async function instructions(
  projectRoot: string,
  app: ApplicationContract,
  sink: typeof sinkStatic
): Promise<void> {
  makeConfig(projectRoot, app, sink)
  makeContract(projectRoot, app, sink)
  makeProvider(projectRoot, app, sink)
}
