import { describe, expect, it, jest } from '@jest/globals';
import 'reflect-metadata';
import { OmniKernelQueryService } from '../omnikernel.query.service.js';


import * as OmniNamedBackend from '../omni-named.backend.js';
import * as OmniRecordBackend from '../omni-record.backend.js';
import * as OmniRelationBackend from '../omni-relation.backend.js';
import * as OmniCollectionBackend from '../omni-collection.backend.js';
import * as OmniDocumentBackend from '../omni-document.backend.js';
import * as OmniExternalRefBackend from '../omni-external-ref.backend.js';

const omniNamedBackendProvidersFactory = OmniNamedBackend.omniNamedBackendProvidersFactory as jest.Mock;
const omniRecordBackendProvidersFactory = OmniRecordBackend.omniRecordBackendProvidersFactory as jest.Mock;
const omniRelationBackendProvidersFactory = OmniRelationBackend.omniRelationBackendProvidersFactory as jest.Mock;
const omniCollectionBackendProvidersFactory = OmniCollectionBackend.omniCollectionBackendProvidersFactory as jest.Mock;
const omniDocumentBackendProvidersFactory = OmniDocumentBackend.omniDocumentBackendProvidersFactory as jest.Mock;
const omniExternalRefBackendProvidersFactory = OmniExternalRefBackend.omniExternalRefBackendProvidersFactory as jest.Mock;

import { OmniKernelModule } from '../omnikernel.module.js';

describe('OmniKernelModule', () => {
  it('registers only backend substrate providers', () => {
    const module = OmniKernelModule.register('test');

    expect(module).toBeDefined();
    
    expect(module.providers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ provide: 'OmniNamedEntityGenericService' }),
        expect.objectContaining({ provide: 'OmniRecordEntityGenericService' }),
        expect.objectContaining({ provide: 'OmniRelationEntityGenericService' }),
        expect.objectContaining({ provide: OmniKernelQueryService }),
      ]),
    );
    expect(module.controllers).toBeUndefined();
  });
});
