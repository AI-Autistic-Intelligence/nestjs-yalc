interface SqsConfig {
    endpoint: string;
    region: string;
    queueName: string;
}
export declare const pushToAwsSQS: (config: SqsConfig, message: any) => Promise<void>;
export {};
