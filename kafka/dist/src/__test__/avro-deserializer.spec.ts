import { jest } from '@jest/globals';
import { createMock } from '@golevelup/ts-jest';
import * as confluent from '@kafkajs/confluent-schema-registry';
import { KafkaAvroDeserializer } from '../plugin.js';

// Using jest.spyOn in beforeEach instead of jest.mock

describe('KafkaAvroDeserializer', () => {
  let deserializer: KafkaAvroDeserializer;
  let decodeSpy: any;

  beforeEach(() => {
    decodeSpy = jest.spyOn(confluent.SchemaRegistry.prototype, 'decode' as never).mockResolvedValue('decoded' as never);
    deserializer = new KafkaAvroDeserializer({}, {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(deserializer).toBeDefined();
  });

  it('Should decode message', async () => {
    const result = await deserializer.deserialize({
      key: 'key',
      value: 'value',
      pattern: 'pettern',
    });

    expect(result.data.key).toEqual('decoded');
    expect(result.data.value).toEqual('decoded');
  });

  it('Should not decode message', async () => {
    const result = await deserializer.deserialize({
      key: undefined,
      value: undefined,
      pattern: 'pettern',
    });

    expect(result.data.key).toBeUndefined();
    expect(result.data.value).toBeUndefined();
  });
});
