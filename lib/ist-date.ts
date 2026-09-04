export const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;
export const IST_TIMEZONE = 'Asia/Kolkata';

export interface ISTDateParts {
	year: number;
	month: number;
	date: number;
	day: number;
	hours: number;
	minutes: number;
	seconds: number;
	milliseconds: number;
}

export function getISTParts(date: Date = new Date()): ISTDateParts {
	const istTime = new Date(date.getTime() + IST_OFFSET_MS);
	return {
		year: istTime.getUTCFullYear(),
		month: istTime.getUTCMonth(),
		date: istTime.getUTCDate(),
		day: istTime.getUTCDay(),
		hours: istTime.getUTCHours(),
		minutes: istTime.getUTCMinutes(),
		seconds: istTime.getUTCSeconds(),
		milliseconds: istTime.getUTCMilliseconds(),
	};
}

export function createISTDate(
	year: number,
	month: number,
	date: number,
	hours = 0,
	minutes = 0,
	seconds = 0,
	ms = 0,
): Date {
	return new Date(
		Date.UTC(year, month, date, hours, minutes, seconds, ms) - IST_OFFSET_MS,
	);
}

export function getStartOfISTDay(date: Date = new Date()): Date {
	const p = getISTParts(date);
	return createISTDate(p.year, p.month, p.date, 0, 0, 0, 0);
}

export function getEndOfISTDay(date: Date = new Date()): Date {
	const p = getISTParts(date);
	return createISTDate(p.year, p.month, p.date, 23, 59, 59, 999);
}

export function getNextISTMidnight(date: Date = new Date()): Date {
	const p = getISTParts(date);
	return createISTDate(p.year, p.month, p.date + 1, 0, 0, 0, 0);
}

export function getNextWeeklyISTReset(date: Date = new Date()): Date {
	const p = getISTParts(date);
	const daysUntilNextMonday = (8 - p.day) % 7 || 7;
	return createISTDate(
		p.year,
		p.month,
		p.date + daysUntilNextMonday,
		0,
		0,
		0,
		0,
	);
}

export function getNextMonthlyISTReset(date: Date = new Date()): Date {
	const p = getISTParts(date);
	return createISTDate(p.year, p.month + 1, 1, 0, 0, 0, 0);
}

export function formatISTDateString(date: Date = new Date()): string {
	const p = getISTParts(date);
	const m = String(p.month + 1).padStart(2, '0');
	const d = String(p.date).padStart(2, '0');
	return `${p.year}-${m}-${d}`;
}

export function getDaysAgoInIST(
	days: number,
	fromDate: Date = new Date(),
): Date {
	const p = getISTParts(fromDate);
	return createISTDate(p.year, p.month, p.date - days, 0, 0, 0, 0);
}
