import type { ApplicationContract } from '@ioc:Adonis/Core/Application';
export default class MicroserviceProvider {
    protected app: ApplicationContract;
    constructor(app: ApplicationContract);
    register(): void;
    boot(): Promise<void>;
    ready(): Promise<void>;
    shutdown(): Promise<void>;
}
