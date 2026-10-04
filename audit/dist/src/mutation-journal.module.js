var MutationJournalModule_1;
import { __decorate } from "tslib";
import { Module, } from '@nestjs/common';
import { BUILTIN_EXCLUDED_TABLES, DEFAULT_JOURNAL_TABLE, MUTATION_JOURNAL_DRIVERS, MUTATION_JOURNAL_OPTIONS, } from './mutation-journal.def.js';
import { MutationJournalCleanupService } from './mutation-journal-cleanup.service.js';
import { MutationJournalQueryService } from './mutation-journal-query.service.js';
import { MutationJournalService } from './mutation-journal.service.js';
import { SqliteTriggerJournalDriver } from './sqlite/sqlite-trigger-journal.driver.js';
let MutationJournalModule = MutationJournalModule_1 = class MutationJournalModule {
    static forRoot(options) {
        return this.createDynamicModule({
            provide: MUTATION_JOURNAL_OPTIONS,
            useValue: this.normalizeOptions(options),
        });
    }
    static forRootAsync(options) {
        return this.createDynamicModule({
            provide: MUTATION_JOURNAL_OPTIONS,
            useFactory: async (...args) => this.normalizeOptions(await options.useFactory(...args)),
            inject: options.inject,
        }, options.imports);
    }
    static createDynamicModule(optionsProvider, imports = []) {
        const providers = [
            optionsProvider,
            {
                provide: MUTATION_JOURNAL_DRIVERS,
                useFactory: (options) => options.drivers ?? [new SqliteTriggerJournalDriver()],
                inject: [MUTATION_JOURNAL_OPTIONS],
            },
            MutationJournalService,
            MutationJournalCleanupService,
            MutationJournalQueryService,
        ];
        return {
            module: MutationJournalModule_1,
            imports,
            providers,
            exports: [
                MUTATION_JOURNAL_OPTIONS,
                MUTATION_JOURNAL_DRIVERS,
                MutationJournalService,
                MutationJournalCleanupService,
                MutationJournalQueryService,
            ],
        };
    }
    static normalizeOptions(options) {
        if (options.cleanupIntervalMs !== undefined &&
            options.retentionDays === undefined) {
            throw new Error('cleanupIntervalMs requires retentionDays.');
        }
        return {
            ...options,
            targets: options.targets ?? [{}],
            excludedTables: [
                ...new Set([
                    ...BUILTIN_EXCLUDED_TABLES,
                    ...(options.excludedTables ?? []),
                ]),
            ],
            journalTableName: options.journalTableName ?? DEFAULT_JOURNAL_TABLE,
        };
    }
};
MutationJournalModule = MutationJournalModule_1 = __decorate([
    Module({})
], MutationJournalModule);
export { MutationJournalModule };
//# sourceMappingURL=mutation-journal.module.js.map