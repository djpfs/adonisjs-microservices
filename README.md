# Adonis Microservices Communication Package

This package is designed to simplify communication between microservices in your Adonis application. Currently, it supports integration with Apache Kafka and plans to add support for other messaging systems such as RabbitMQ and gRPC in the future.

## Installation

You can install this package via npm with the following command:

```bash
npm i @djpfs/adonisjs-microservices
```

After installation, execute the following command to configure the package:

```bash
node ace configure @djpfs/adonisjs-microservices
```

This command will set up the necessary files for the package to function in your project.

## Configuration

To use Kafka as the transport system, you must first install the `kafkajs` package:

```bash
npm i kafkajs
```

Next, add the following configurations to your `.env` file, replacing the values according to your environment:

```bash
KAFKA_CLIENT_ID='service-gateway'
KAFKA_GROUP_ID='gateway'
KAFKA_BROKERS='kafka1:9092,kafka2:9093,kafka3:9094'
KAFKA_SSL=false
KAFKA_SASL=false
KAFKA_SASL_MECHANISM='scram-sha-512'
KAFKA_SASL_USERNAME='username'
KAFKA_SASL_PASSWORD='password'
KAFKA_LOG_LEVEL=4
```

## Usage

### Receiving Messages

To use the package, import the `MsMessage` and `KafkaPayload` classes into your controller file. Then, use the `MsMessage` decorator to specify the topic you want to listen to:

```typescript
import { MsMessage } from "App/Decorators/MsMessage";
import { KafkaPayload } from "App/Helpers/Types/Microservice";

export default class AuthController {

  @MsMessage('kafka.auth.login')
  public async login(message: KafkaPayload) {
    console.log(message.message)
  }
}
```

The decorator expects a string as a parameter, which should contain at least one dot (.) to separate the transport name from the topic name. The transport name should match what you defined in the package configuration file.

For example, `kafka.auth.login`, where "kafka" is the transport name, and "auth.login" is the topic name.

### Sending Messages

To send messages, import the `Transports` and `KafkaTransport` classes into your controller file. Then, use the `send` method of the transport to send the message:

```typescript
import Transports from "@ioc:Microservice/Transports";
import KafkaTransport from '@djpfs/adonisjs-microservices/build/src/transports/kafka'

export default class AuthController {

  public async sendMessage() {
    const transport: KafkaTransport = Transports.getTransport('kafka')
    await transport.producer.send({
      topic: 'auth.login',
      messages: [
        { value: 'Hello KafkaJS user!' },
      ],
    })
  }
}
```

## Advanced Configuration

You can configure Kafka with all available options from the `kafkajs` package by editing the settings in the `config/microservices.ts` file.