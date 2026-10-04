import { describe, expect, it, jest } from '@jest/globals';

import { OmniDocumentService } from '../omni-document.service.js';
import { OmniDocumentEntity } from '../omni-document.entity.js';
import { OmniDocumentKind } from '../omni-document-kind.enum.js';

const createRepositoryPair = () => {
  const readRepository = {
    target: OmniDocumentEntity,
    findOneOrFail: jest.fn(),
    getId: jest.fn((entity: OmniDocumentEntity) => ({ guid: entity.guid })),
  };
  const writeRepository = {
    target: OmniDocumentEntity,
    create: jest.fn((input: unknown) => input),
    insert: jest.fn(async () => ({
      identifiers: [{ guid: '11111111-1111-1111-1111-111111111111' }],
    })),
    update: jest.fn(async () => ({ affected: 1 })),
  };

  return { readRepository, writeRepository };
};

describe('OmniDocumentService', () => {
  it('forces the base record kind during createEntity', async () => {
    const { readRepository, writeRepository } = createRepositoryPair();
    const service = new OmniDocumentService(
      readRepository as never,
      writeRepository as never,
    );

    await service.createEntity(
      {
        guid: '11111111-1111-1111-1111-111111111111',
        title: 'Document',
        kind: 'unexpected-kind',
        documentKind: OmniDocumentKind.Note,
      },
      undefined,
      false,
    );

    expect(writeRepository.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: OmniDocumentKind.Document,
        documentKind: OmniDocumentKind.Note,
      }),
    );
  });

  it('forces the base record kind during updateEntity', async () => {
    const { readRepository, writeRepository } = createRepositoryPair();
    const service = new OmniDocumentService(
      readRepository as never,
      writeRepository as never,
    );
    (service as any).validateConditions = jest.fn(async () => ({
      guid: '11111111-1111-1111-1111-111111111111',
    }));

    await service.updateEntity(
      { guid: '11111111-1111-1111-1111-111111111111' },
      {
        kind: 'unexpected-kind',
        documentKind: OmniDocumentKind.Article,
      },
      undefined,
      false,
    );

    expect(writeRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        guid: '11111111-1111-1111-1111-111111111111',
        kind: OmniDocumentKind.Document,
      }),
      expect.objectContaining({
        kind: OmniDocumentKind.Document,
        documentKind: OmniDocumentKind.Article,
      }),
    );
  });
});
