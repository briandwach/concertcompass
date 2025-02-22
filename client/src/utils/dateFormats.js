import { format } from 'date-fns';

export const playlistDates = (dateRange) => {
    const formattedDates = dateRange.map((date) => format(new Date(date), 'MM-dd-yyyy'));

    const dates = {
        startDate: formattedDates[0],
        endDate: formattedDates[1]
    };

    return dates;
};