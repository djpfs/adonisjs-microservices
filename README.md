<h2>A Kafka</a> provider for <a href="https://adonisjs.com/">AdonisJS v5</a>

</br>

<h2>
Adonis Kafka provides an easy way to start using Kafka.
</h2>

<br>
<h2><b>Installation</b></h2>

```bash
npm i @djpfs/adonisjs-microservices
```

<h2>Setup</h2>

```bash
node ace configure @djpfs/adonisjs-microservices
```
<br>
<h2>Configuration</h2>

Edit the `.env` file to match your Kafka configuration.

Edit the `config/kafka.ts` file to edit the default configuration.
<br>
<br>

<h2>Usage</h2>
Create a controller, ex: `app/Controllers/Http/KafkaController.ts`
  
```ts
import { MsMessage } from "App/Decorators/MsMessage";
import { KafkaPayload } from "App/Helpers/Types/Microservice";

export default class KafkaController {

  @MsMessage('kafka.users')
  public async user(message: KafkaPayload) {
    console.log(message.message)
  }
}
```ts

