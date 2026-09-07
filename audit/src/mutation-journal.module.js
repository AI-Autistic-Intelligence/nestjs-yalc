"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MutationJournalModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationJournalModule = void 0;
const common_1 = require("@nestjs/common");
const mutation_journal_def_js_1 = require("./mutation-journal.def.js");
const mutation_journal_cleanup_service_js_1 = require("./mutation-journal-cleanup.service.js");
const mutation_journal_query_service_js_1 = require("./mutation-journal-query.service.js");
const mutation_journal_service_js_1 = require("./mutation-journal.service.js");
const sqlite_trigger_journal_driver_js_1 = require("./sqlite/sqlite-trigger-journal.driver.js");
let MutationJournalModule = MutationJournalModule_1 = class MutationJournalModule {
    static forRoot(options) {
        return this.createDynamicModule({
            provide: mutation_journal_def_js_1.MUTATION_JOURNAL_OPTIONS,
            useValue: this.normalizeOptions(options),
        });
    }
    static forRootAsync(options) {
        return this.createDynamicModule({
            provide: mutation_journal_def_js_1.MUTATION_JOURNAL_OPTIONS,
            useFactory: async (...args) => this.normalizeOptions(await options.useFactory(...args)),
            inject: options.inject,
        }, options.imports);
    }
    static createDynamicModule(optionsProvider, imports = []) {
        const providers = [
            optionsProvider,
            {
                provide: mutation_journal_def_js_1.MUTATION_JOURNAL_DRIVERS,
                useFactory: (options) => options.drivers ?? [new sqlite_trigger_journal_driver_js_1.SqliteTriggerJournalDriver()],
                inject: [mutation_journal_def_js_1.MUTATION_JOURNAL_OPTIONS],
            },
            mutation_journal_service_js_1.MutationJournalService,
            mutation_journal_cleanup_service_js_1.MutationJournalCleanupService,
            mutation_journal_query_service_js_1.MutationJournalQueryService,
        ];
        return {
            module: MutationJournalModule_1,
            imports,
            providers,
            exports: [
                mutation_journal_def_js_1.MUTATION_JOURNAL_OPTIONS,
                mutation_journal_def_js_1.MUTATION_JOURNAL_DRIVERS,
                mutation_journal_service_js_1.MutationJournalService,
                mutation_journal_cleanup_service_js_1.MutationJournalCleanupService,
                mutation_journal_query_service_js_1.MutationJournalQueryService,
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
                    ...mutation_journal_def_js_1.BUILTIN_EXCLUDED_TABLES,
                    ...(options.excludedTables ?? []),
                ]),
            ],
            journalTableName: options.journalTableName ?? mutation_journal_def_js_1.DEFAULT_JOURNAL_TABLE,
        };
    }
};
exports.MutationJournalModule = MutationJournalModule;
exports.MutationJournalModule = MutationJournalModule = MutationJournalModule_1 = __decorate([
    (0, common_1.Module)({})
], MutationJournalModule);
//# sourceMappingURL=mutation-journal.module.js.map