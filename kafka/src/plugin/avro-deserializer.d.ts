import { Deserializer, ReadPacket } from '@nestjs/microservices';
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';
import type { SchemaRegistryAPIClientArgs } from '@kafkajs/confluent-schema-registry/dist/api/index.js';
import type { SchemaRegistryAPIClientOptions } from '@kafkajs/confluent-schema-registry/dist/@types.js';
import type { KafkaMessage } from '@nestjs/microservices/external/kafka.interface.js';
import type { DeserializedData } from '../interface/debezium.interface.js';
export declare class KafkaAvroDeserializer implements Deserializer<KafkaMessage, ReadPacket<DeserializedData<any, any>>> {
    protected registry: SchemaRegistry;
    constructor(config: SchemaRegistryAPIClientArgs, options?: SchemaRegistryAPIClientOptions);
    deserialize(message: any): Promise<ReadPacket>;
}
