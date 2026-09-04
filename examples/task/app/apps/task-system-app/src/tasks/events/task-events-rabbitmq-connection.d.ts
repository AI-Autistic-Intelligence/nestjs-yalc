export declare function closeRabbitResource(resource?: {
    close: () => Promise<void>;
    connection?: unknown;
    stream?: {
        destroy: () => void;
    };
    heartbeater?: {
        clear: () => void;
    };
}): Promise<void>;
