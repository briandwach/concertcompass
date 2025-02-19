import { useState, useEffect } from 'react';
import { getEvents } from '../../utils/jamBaseRequests.js';
import { format } from 'date-fns';

const Events = ({ dateRange, metroSelection, genreSelections, totalGenres, handleEventsChange }) => {
    const [eventData, setEventData] = useState([]);
    const [loading, setLoading] = useState(false); // Track loading state
    const [error, setError] = useState(null); // Track error state

    // Triggers JamBase API event data call if parameters are selected
    useEffect(() => {
        if (
            dateRange[0] &&
            dateRange[1] &&
            Object.keys(metroSelection).length > 0 &&
            genreSelections.length > 0
        ) {
            triggerGetEvents();
        }
    }, [dateRange, metroSelection, genreSelections]);

    const triggerGetEvents = async () => {
        setLoading(true);
        setError(null); // Reset error state before making the API call
        setEventData([]); // Clear the previous event data while loading new data

        try {
            const formattedDates = dateRange.map((date) => format(new Date(date), 'yyyy-MM-dd'));

            let genreSlug = '';
            if (genreSelections.length !== totalGenres) {
                genreSlug = '&genreSlug=' + genreSelections.map((genre) => genre.identifier).join('|');
            }

            const params = `perPage=100&eventDateFrom=${formattedDates[0]}&eventDateTo=${formattedDates[1]}&geoMetroId=${metroSelection.identifier}`;
            const data = await getEvents(`${params}${genreSlug}`);
            
            if (data?.events) {
                const eventData = data.events.map((event) => {
                    const { identifier, name, startDate } = event;
                    return {
                        identifier,
                        name,
                        date: format(new Date(startDate), 'MM-dd'),
                    };
                });
                setEventData(eventData);
                handleEventsChange(eventData);
            } else {
                setError('No events found.');
            }
        } catch (err) {
            setError('Error fetching event data. Please try again.');
        } finally {
            setLoading(false); // Set loading to false after request completes
        }
    };

    return (
        <div>
            {loading && <p>Loading events...</p>} {/* Loading message */}

            {error && <p className="text-red-500">{error}</p>} {/* Error message */}

            {/* Show this message when no events are found */}
            {eventData.length === 0 && !loading && !error && (
                <p>No events available for the selected filters.</p>
            )}

            {/* Render the event data only when not loading */}
            {!loading && eventData.map((event) => (
                <div className='flex' key={event.identifier}>
                    <p>{event.date}
                        <span className='font-medium ml-3'>{event.name}</span>
                    </p>
                </div>
            ))}
        </div>
    );
};

export default Events;