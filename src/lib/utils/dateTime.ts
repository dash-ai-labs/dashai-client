import { format, formatInTimeZone } from 'date-fns-tz';
import { isYesterday, isToday } from 'date-fns';
export const formatDate = (date: Date): string => {
	const now = new Date();
	const oneYearAgo = new Date();
	oneYearAgo.setFullYear(now.getFullYear() - 1);

	// Time zone configuration
	const timeZone = 'UTC';
	const dateInTimeZone = new Date(formatInTimeZone(date, timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX"));

	// Check if the date is today
	if (isToday(dateInTimeZone)) {
		return format(dateInTimeZone, 'h:mm a', { timeZone });
	}

	// Check if the date is yesterday
	if (isYesterday(dateInTimeZone)) {
		return 'Yesterday';
	}

	// Format date based on whether it's within the last year
	const withinLastYear = dateInTimeZone > oneYearAgo;
	return withinLastYear
		? format(dateInTimeZone, 'dd MMM', { timeZone }) // "23 Nov"
		: format(dateInTimeZone, 'dd MMM yyyy', { timeZone }); // "23 Nov 2023"
};
