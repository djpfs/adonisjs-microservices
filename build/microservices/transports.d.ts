import { TransportMethods, TransportsContract } from '@ioc:Microservice/Transports';
import MicroserviceTransportBase from './transports/base';
export default class MicroserviceTransports implements TransportsContract {
    readonly transports: MicroserviceTransportBase[];
    isConnected: boolean;
    constructor(transports: TransportMethods[]);
    addListener(method: TransportMethods, topic: string, callback: any): Promise<void>;
    getTransport<T>(method: TransportMethods): T;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}
