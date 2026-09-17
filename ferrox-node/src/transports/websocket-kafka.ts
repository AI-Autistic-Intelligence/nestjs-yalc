export interface WebSocketMessage {
  event: string;
  payload: any;
}

export class WebSocketTransportAdapter {
  private handlers: Map<string, (payload: any, socket: any) => void> = new Map();

  public on(event: string, handler: (payload: any, socket: any) => void): void {
    this.handlers.set(event, handler);
  }

  public emit(socket: any, event: string, payload: any): void {
    const frame = JSON.stringify({ event, payload });
    if (socket && typeof socket.send === 'function') {
      socket.send(frame);
    }
  }

  public handleIncomingMessage(rawMessage: string, socket: any): void {
    try {
      const msg: WebSocketMessage = JSON.parse(rawMessage);
      const handler = this.handlers.get(msg.event);
      if (handler) {
        handler(msg.payload, socket);
      }
    } catch (err: any) {
      console.error('WebSocket parse error:', err.message);
    }
  }
}

export class KafkaEventBusAdapter {
  private topicHandlers: Map<string, (event: any) => Promise<void>> = new Map();

  public subscribe(topic: string, handler: (event: any) => Promise<void>): void {
    this.topicHandlers.set(topic, handler);
  }

  public async publish(topic: string, event: any): Promise<void> {
    const handler = this.topicHandlers.get(topic);
    if (handler) {
      await handler(event);
    }
  }
}
