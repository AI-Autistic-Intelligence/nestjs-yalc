import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';
export class KafkaAvroDeserializer {
    constructor(config, options) {
        this.registry = new SchemaRegistry(config, options);
    }
    async deserialize(message) {
        try {
            message.key = message.key
                ? await this.registry.decode(message.key)
                : message.key;
            message.value = message.value
                ? await this.registry.decode(message.value)
                : message.value;
        }
        catch (e) {
            console.error('Deserialization error', e);
        }
        return {
            pattern: message.topic,
            data: {
                value: message.value,
                key: message.key,
            },
        };
    }
}
//# sourceMappingURL=avro-deserializer.js.map