import { TransportMethods } from '@ioc:Microservice/Transports';
export default interface MicroserviceTransportBase {
    type: TransportMethods;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    addListener(topic: string, callback: any): Promise<void>;
}
