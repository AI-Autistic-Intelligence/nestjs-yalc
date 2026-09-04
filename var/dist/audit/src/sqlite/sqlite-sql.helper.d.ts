import type { MutationJournalAction } from '../mutation-journal.interface.js';
export declare const SQLITE_OCCURRED_AT_EXPRESSION = "CAST(ROUND((julianday('now') - 2440587.5) * 86400000) AS INTEGER)";
export type SqliteTriggerRowReference = 'OLD' | 'NEW';
export declare function quoteSqliteIdentifier(value: string): string;
export declare function quoteSqliteStringLiteral(value: string): string;
export declare function buildSqliteJsonObjectExpression(rowReference: SqliteTriggerRowReference, columns: readonly string[]): string;
export declare function getSqliteMutationJournalTriggerName(action: MutationJournalAction, tableName: string): string;
