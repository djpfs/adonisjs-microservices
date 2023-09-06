## Instructions

add the following code to your `env.ts` file:

```typescript
  KAFKA_CLIENT_ID: Env.schema.string(),
  KAFKA_GROUP_ID: Env.schema.string(),
  KAFKA_BROKERS: Env.schema.string(),
  KAFKA_SSL: Env.schema.boolean(),
  KAFKA_SASL: Env.schema.boolean(),
  KAFKA_SASL_MECHANISM: Env.schema.string(),
  KAFKA_SASL_USERNAME: Env.schema.string(),
  KAFKA_SASL_PASSWORD: Env.schema.string(),
  KAFKA_LOG_LEVEL: Env.schema.number() || undefined,
```

in the end the code should be similar to this:

```typescript

import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  DRIVE_DISK: Env.schema.enum(['local'] as const),
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  KAFKA_CLIENT_ID: Env.schema.string(),
  KAFKA_GROUP_ID: Env.schema.string(),
  KAFKA_BROKERS: Env.schema.string(),
  KAFKA_SSL: Env.schema.boolean(),
  KAFKA_SASL: Env.schema.boolean(),
  KAFKA_SASL_MECHANISM: Env.schema.string(),
  KAFKA_SASL_USERNAME: Env.schema.string(),
  KAFKA_SASL_PASSWORD: Env.schema.string(),
  KAFKA_LOG_LEVEL: Env.schema.number() || undefined,
})

```

inside your `.env` file, you can add the following configuration by editing with your information:

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

if you kafka is running and the configurations in `.env` are correctly, everything should work fine.
