declare module '@ioc:Microservice/Transports' {
  import { Kafka } from 'kafkajs';


  export interface Transport {
      kafka?: Kafka;
  }
  export interface TransportListener {
      topic: string;
      callback: (message: any) => any;
  }
  export type TransportMethods = 'kafka';
  export interface TransportsContract {
      connect(): Promise<void>;
      disconnect(): Promise<void>;
      getTransport<T>(method: TransportMethods): T;
      addListener(method: TransportMethods, topic: string, callback: any): Promise<void>;
  }
  const Transports: TransportsContract;
  export default Transports;

}
