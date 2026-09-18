"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaAvroDeserializer = void 0;
const confluent_schema_registry_1 = require("@kafkajs/confluent-schema-registry");
class KafkaAvroDeserializer {
    constructor(config, options) {
        this.registry = new confluent_schema_registry_1.SchemaRegistry(config, options);
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
exports.KafkaAvroDeserializer = KafkaAvroDeserializer;
//# sourceMappingURL=avro-deserializer.js.map