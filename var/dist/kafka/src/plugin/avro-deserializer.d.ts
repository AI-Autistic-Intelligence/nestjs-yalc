import { Deserializer, ReadPacket } from '@nestjs/microservices';
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';
import { SchemaRegistryAPIClientArgs } from '@kafkajs/confluent-schema-registry/dist/api';
import { SchemaRegistryAPIClientOptions } from '@kafkajs/confluent-schema-registry/dist/@types';
import { KafkaMessage } from '@nestjs/microservices/external/kafka.interface';
import { DeserializedData } from '../interface/debezium.interface';
export declare class KafkaAvroDeserializer implements Deserializer<KafkaMessage, ReadPacket<DeserializedData<any, any>>> {
    protected registry: SchemaRegistry;
    constructor(config: SchemaRegistryAPIClientArgs, options?: SchemaRegistryAPIClientOptions);
    deserialize(message: any): Promise<ReadPacket>;
}
