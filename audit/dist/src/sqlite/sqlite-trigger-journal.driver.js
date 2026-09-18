"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqliteTriggerJournalDriver = void 0;
const mutation_journal_def_js_1 = require("../mutation-journal.def.js");
const sqlite_sql_helper_js_1 = require("./sqlite-sql.helper.js");
class SqliteTriggerJournalDriver {
    constructor() {
        this.engine = 'sqlite';
    }
    supports(dataSource) {
        return (dataSource.options.type === 'sqlite' ||
            dataSource.options.type === 'better-sqlite3');
    }
    async install(dataSource, options) {
        const queryRunner = dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            await this.dropJournalTriggers(queryRunner);
            await this.createJournalTable(queryRunner, options.journalTableName);
            const report = {
                dataSourceName: dataSource.name,
                engine: this.engine,
                journaledTables: [],
                skippedTables: [],
            };
            const tables = (await queryRunner.query("SELECT name, sql FROM sqlite_master WHERE type = 'table'"));
            for (const table of tables) {
                const skipReason = this.getTableSkipReason(table, options);
                if (skipReason) {
                    report.skippedTables.push({
                        tableName: table.name,
                        reason: skipReason,
                    });
                    continue;
                }
                const columns = (await queryRunner.query(`PRAGMA table_info(${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)(table.name)})`));
                const columnSkipReason = this.getColumnSkipReason(columns);
                if (columnSkipReason) {
                    report.skippedTables.push({
                        tableName: table.name,
                        reason: columnSkipReason,
                    });
                    continue;
                }
                await this.createJournalTriggers(queryRunner, table.name, columns.map((column) => column.name), options.journalTableName);
                report.journaledTables.push(table.name);
            }
            await queryRunner.commitTransaction();
            return report;
        }
        catch (error) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            throw error;
        }
        finally {
            if (!queryRunner.isReleased) {
                await queryRunner.release();
            }
        }
    }
    async uninstall(dataSource, _options) {
        const queryRunner = dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await this.dropJournalTriggers(queryRunner);
        }
        finally {
            await queryRunner.release();
        }
    }
    async cleanup(dataSource, options, olderThanMs) {
        const queryRunner = dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.query(`DELETE FROM ${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)(options.journalTableName)} WHERE ${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)('occurredAt')} < ?`, [olderThanMs]);
            const rows = (await queryRunner.query('SELECT changes() AS changes'));
            return rows[0]?.changes ?? 0;
        }
        finally {
            await queryRunner.release();
        }
    }
    async read(dataSource, options, filter) {
        const queryRunner = dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            const predicates = [];
            const parameters = [];
            if (filter.tableName !== undefined) {
                predicates.push(`${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)('tableName')} = ?`);
                parameters.push(filter.tableName);
            }
            if (filter.action !== undefined) {
                predicates.push(`${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)('action')} = ?`);
                parameters.push(filter.action);
            }
            if (filter.sinceMs !== undefined) {
                predicates.push(`${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)('occurredAt')} >= ?`);
                parameters.push(filter.sinceMs);
            }
            if (filter.untilMs !== undefined) {
                predicates.push(`${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)('occurredAt')} < ?`);
                parameters.push(filter.untilMs);
            }
            const limit = filter.limit ?? mutation_journal_def_js_1.DEFAULT_READ_LIMIT;
            const offset = filter.offset ?? 0;
            parameters.push(limit, offset);
            const whereClause = predicates.length > 0 ? ` WHERE ${predicates.join(' AND ')}` : '';
            return (await queryRunner.query(`SELECT ${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)('id')}, ${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)('occurredAt')}, ${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)('tableName')}, ${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)('action')}, ${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)('oldRow')}, ${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)('newRow')}, ${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)('actor')} FROM ${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)(options.journalTableName)}${whereClause} ORDER BY ${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)('id')} DESC LIMIT ? OFFSET ?`, parameters));
        }
        finally {
            await queryRunner.release();
        }
    }
    getTableSkipReason(table, options) {
        if (table.name.startsWith('sqlite_') ||
            table.name === options.journalTableName ||
            options.excludedTables.includes(table.name)) {
            return 'excluded';
        }
        if (/^CREATE VIRTUAL TABLE/i.test(table.sql ?? '')) {
            return 'virtual-table';
        }
        return undefined;
    }
    getColumnSkipReason(columns) {
        if (columns.length > 400) {
            return 'too-many-columns';
        }
        if (columns.some((column) => !column.type?.trim() || /BLOB/i.test(column.type))) {
            return 'blob-column';
        }
        return undefined;
    }
    async dropJournalTriggers(queryRunner) {
        const triggers = (await queryRunner.query("SELECT name FROM sqlite_master WHERE type = 'trigger' AND name LIKE '\\_mj\\_%' ESCAPE '\\'"));
        for (const trigger of triggers) {
            await queryRunner.query(`DROP TRIGGER IF EXISTS ${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)(trigger.name)}`);
        }
    }
    async createJournalTable(queryRunner, journalTableName) {
        const table = (0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)(journalTableName);
        const column = (name) => (0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)(name);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS ${table} (${column('id')} INTEGER PRIMARY KEY AUTOINCREMENT, ${column('occurredAt')} INTEGER NOT NULL, ${column('tableName')} TEXT NOT NULL, ${column('action')} TEXT NOT NULL, ${column('oldRow')} TEXT, ${column('newRow')} TEXT, ${column('actor')} TEXT)`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS ${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)(`idx_${journalTableName}_occurredAt`)} ON ${table} (${column('occurredAt')})`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS ${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)(`idx_${journalTableName}_table`)} ON ${table} (${column('tableName')}, ${column('occurredAt')})`);
    }
    async createJournalTriggers(queryRunner, tableName, columns, journalTableName) {
        for (const action of ['insert', 'update', 'delete']) {
            const oldRow = action === 'insert'
                ? 'NULL'
                : (0, sqlite_sql_helper_js_1.buildSqliteJsonObjectExpression)('OLD', columns);
            const newRow = action === 'delete'
                ? 'NULL'
                : (0, sqlite_sql_helper_js_1.buildSqliteJsonObjectExpression)('NEW', columns);
            const triggerName = (0, sqlite_sql_helper_js_1.getSqliteMutationJournalTriggerName)(action, tableName);
            await queryRunner.query(`CREATE TRIGGER ${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)(triggerName)} AFTER ${action.toUpperCase()} ON ${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)(tableName)} BEGIN INSERT INTO ${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)(journalTableName)} (${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)('occurredAt')}, ${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)('tableName')}, ${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)('action')}, ${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)('oldRow')}, ${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)('newRow')}, ${(0, sqlite_sql_helper_js_1.quoteSqliteIdentifier)('actor')}) VALUES (${sqlite_sql_helper_js_1.SQLITE_OCCURRED_AT_EXPRESSION}, ${(0, sqlite_sql_helper_js_1.quoteSqliteStringLiteral)(tableName)}, ${(0, sqlite_sql_helper_js_1.quoteSqliteStringLiteral)(action)}, ${oldRow}, ${newRow}, NULL); END`);
        }
    }
}
exports.SqliteTriggerJournalDriver = SqliteTriggerJournalDriver;
//# sourceMappingURL=sqlite-trigger-journal.driver.js.map