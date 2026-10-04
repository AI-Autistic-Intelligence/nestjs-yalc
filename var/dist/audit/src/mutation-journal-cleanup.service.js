var MutationJournalCleanupService_1;
import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injectable, Logger, } from '@nestjs/common';
import { MUTATION_JOURNAL_OPTIONS } from './mutation-journal.def.js';
import { MutationJournalService, } from './mutation-journal.service.js';
const MILLISECONDS_PER_DAY = 86_400_000;
let MutationJournalCleanupService = MutationJournalCleanupService_1 = class MutationJournalCleanupService {
    constructor(mutationJournalService, options) {
        this.mutationJournalService = mutationJournalService;
        this.options = options;
        this.logger = new Logger(MutationJournalCleanupService_1.name);
    }
    onApplicationBootstrap() {
        if (!this.options.enabled ||
            this.options.retentionDays === undefined ||
            this.options.cleanupIntervalMs === undefined) {
            return;
        }
        this.timer = setInterval(() => {
            void this.runOnce();
        }, this.options.cleanupIntervalMs);
        this.timer.unref();
    }
    onModuleDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }
    async runOnce() {
        if (!this.options.enabled || this.options.retentionDays === undefined) {
            return 0;
        }
        const olderThanMs = Date.now() - this.options.retentionDays * MILLISECONDS_PER_DAY;
        let deletedRows = 0;
        for (const target of this.mutationJournalService.getTargets()) {
            try {
                const resolvedTarget = await this.mutationJournalService.resolveTarget(target);
                if (!resolvedTarget) {
                    continue;
                }
                deletedRows += await resolvedTarget.driver.cleanup(resolvedTarget.dataSource, this.mutationJournalService.getDriverOptions(), olderThanMs);
            }
            catch (error) {
                this.logger.warn(`Unable to clean mutation journal for ${target.dataSourceName ?? 'default'}: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        return deletedRows;
    }
};
MutationJournalCleanupService = MutationJournalCleanupService_1 = __decorate([
    Injectable(),
    __param(0, Inject(MutationJournalService)),
    __param(1, Inject(MUTATION_JOURNAL_OPTIONS)),
    __metadata("design:paramtypes", [Object, Object])
], MutationJournalCleanupService);
export { MutationJournalCleanupService };
//# sourceMappingURL=mutation-journal-cleanup.service.js.map