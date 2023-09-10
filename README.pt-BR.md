<h1>Adonis Microservices Communication Package</h1>

Este pacote é projetado para simplificar a comunicação entre microserviços em sua aplicação Adonis. Atualmente, ele suporta a integração com o Apache Kafka e está planejado para adicionar suporte a outros sistemas de mensagens, como RabbitMQ e gRPC no futuro.

<h2>Instalação</h2>
Você pode instalar este pacote via npm:

```bash
npm i @djpfs/adonisjs-microservices
```

Após a instalação, execute o seguinte comando para configurar o pacote:
```bash
node ace configure @djpfs/adonisjs-microservices
```
Este comando irá configurar os arquivos necessários para o funcionamento do pacote no seu projeto.


<h2>Configurando</h2>
Para usar o Kafka como transporte, você deve instalar o pacote `kafkajs`:

```bash 
npm i kafkajs
```

Adicione as seguintes configurações ao seu arquivo `.env` substituindo os valores de acordo com o seu ambiente:
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

<h2>Uso</h2>
<h3>Recebendo mensagens</h3>
Para usar o pacote, você deve importar o `MsMessage` e o `KafkaPayload` no seu arquivo de controller e usar o decorator `MsMessage` para definir o tópico que você deseja ouvir:

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

O decorator espera um string como parametro, que deve ter pelo menos um . (ponto) para separar o nome transporte do tópico. O nome do transporte deve ser o mesmo que você definiu no arquivo de configuração do pacote.

> Ex: kafka.auth.login, onde "kakfa" é o nome do transporte e "auth.login" é o nome do tópico

<h3>Enviando mensagens</h3>

Para enviar mensagens, você deve importar o `Transports` e o `KafkaTransport` no seu arquivo de controller e usar o método `send` do transport para enviar a mensagem:
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

<h2>Configurações avançadas</h2>

Você pode configurar o kafka com todas as configurações disponíveis no pacote `kafkajs` editando as configurações no arquivo `config/microservices.ts`:
