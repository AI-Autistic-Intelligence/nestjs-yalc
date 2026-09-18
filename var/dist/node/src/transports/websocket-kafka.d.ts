export interface WebSocketMessage {
    event: string;
    payload: any;
}
export declare class WebSocketTransportAdapter {
    private handlers;
    on(event: string, handler: (payload: any, socket: any) => void): void;
    emit(socket: any, event: string, payload: any): void;
    handleIncomingMessage(rawMessage: string, socket: any): void;
}
export declare class KafkaEventBusAdapter {
    private topicHandlers;
    subscribe(topic: string, handler: (event: any) => Promise<void>): void;
    publish(topic: string, event: any): Promise<void>;
}
