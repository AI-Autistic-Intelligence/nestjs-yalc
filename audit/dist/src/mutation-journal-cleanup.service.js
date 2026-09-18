"use strict";
var MutationJournalCleanupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationJournalCleanupService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const mutation_journal_def_js_1 = require("./mutation-journal.def.js");
const mutation_journal_service_js_1 = require("./mutation-journal.service.js");
const MILLISECONDS_PER_DAY = 86_400_000;
let MutationJournalCleanupService = MutationJournalCleanupService_1 = class MutationJournalCleanupService {
    constructor(mutationJournalService, options) {
        this.mutationJournalService = mutationJournalService;
        this.options = options;
        this.logger = new common_1.Logger(MutationJournalCleanupService_1.name);
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
exports.MutationJournalCleanupService = MutationJournalCleanupService;
exports.MutationJournalCleanupService = MutationJournalCleanupService = MutationJournalCleanupService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(mutation_journal_service_js_1.MutationJournalService)),
    tslib_1.__param(1, (0, common_1.Inject)(mutation_journal_def_js_1.MUTATION_JOURNAL_OPTIONS)),
    tslib_1.__metadata("design:paramtypes", [Object, Object])
], MutationJournalCleanupService);
//# sourceMappingURL=mutation-journal-cleanup.service.js.map