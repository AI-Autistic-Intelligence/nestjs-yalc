export class DateHelper {
    static getWeekEdgeDates() {
        const currentDate = Date.now();
        const weekInMs = 1000 * 60 * 60 * 24 * 7;
        const startDate = new Date(new Date(currentDate).getTime() - weekInMs);
        const endDate = new Date(currentDate);
        const startDateMonth = DateHelper.formatMonth(startDate.getMonth());
        const startDateDay = DateHelper.formatDay(startDate.getDate());
        const endDateMonth = DateHelper.formatMonth(endDate.getMonth());
        const endDateDay = DateHelper.formatDay(endDate.getDate());
        const queryStartDate = `${startDate.getFullYear()}-${startDateMonth}-${startDateDay}`;
        const queryEndDate = `${endDate.getFullYear()}-${endDateMonth}-${endDateDay}`;
        return { startDate: queryStartDate, endDate: queryEndDate };
    }
    static formatMonth(month) {
        const fixedMonth = month + 1;
        return fixedMonth < 10 ? `0${fixedMonth}` : `${fixedMonth}`;
    }
    static formatDay(day) {
        return day < 10 ? `0${day}` : `${day}`;
    }
    static subsMinutes(date, minutes) {
        const result = new Date(date.getTime());
        result.setMinutes(result.getMinutes() - minutes);
        return result;
    }
    static addMinutes(date, minutes) {
        const result = new Date(date.getTime());
        result.setMinutes(result.getMinutes() + minutes);
        return result;
    }
    static dateToSQLDateTime(date) {
        return date.toISOString().slice(0, 19).replace('T', ' ');
    }
}
//# sourceMappingURL=date.helper.js.map