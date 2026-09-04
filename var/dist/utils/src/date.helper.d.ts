export declare class DateHelper {
    static getWeekEdgeDates(): {
        startDate: string;
        endDate: string;
    };
    static formatMonth(month: number): string;
    static formatDay(day: number): string;
    static subsMinutes(date: Date, minutes: number): Date;
    static addMinutes(date: Date, minutes: number): Date;
    static dateToSQLDateTime(date: Date): string;
}
