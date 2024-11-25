export const formatDate = (date: Date): string => {
	const now = new Date();
	const oneYearAgo = new Date();
	oneYearAgo.setFullYear(now.getFullYear() - 1);

	const dateObj = new Date(date);

	// Check if the date is within the last 24 hours
	if (dateObj.getTime() > Date.now() - 24 * 60 * 60 * 1000) {
		return dateObj.toLocaleTimeString(); // Show time if within 24 hours
	}

	// Check if the date is within the last year
	const optionsShort: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
	const optionsLong: Intl.DateTimeFormatOptions = {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	};

	// Force "23 Nov" by reordering day and month
	const formatShort = `${dateObj.getDate()} ${dateObj.toLocaleDateString('en-US', { month: 'short' })}`;

	return dateObj > oneYearAgo
		? formatShort // Show "23 Nov" for dates within a year
		: dateObj.toLocaleDateString('en-US', optionsLong); // Show "23 Nov 2023" for older dates
};
