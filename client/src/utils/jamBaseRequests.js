export const getEvents = async (params) => {
    try {
        const res = await fetch(`/api/jamBase/events/${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(`HTTP error! Status: ${res.status} - ${errorData.message || errorData}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error retrieving event information from server or JamBase API', error);
    }
}

export const getMetros = async () => {
    try {
        const res = await fetch('/api/jamBase/metros', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(`HTTP error! Status: ${res.status} - ${errorData.message || errorData}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error retrieving metro areas from server', error);
    }
}

export const getGenres = async () => {
    try {
        const res = await fetch('/api/jamBase/genres', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(`HTTP error! Status: ${res.status} - ${errorData.message || errorData}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error retrieving genres from server', error);
    }
}


// ADMINISTRATION
// Updates metro areas in database to match that of JamBases
export const updateMetros = async () => {
    try {
        const res = await fetch('/api/jamBase/metros', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(`HTTP error! Status: ${res.status} - ${errorData.message || errorData}`);
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error updating metros in DB.', error);
    }
}

// Updates genres in database to match that of JamBases
export const updateGenres = async () => {
    try {
        const res = await fetch('/api/jamBase/genres', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(`HTTP error! Status: ${res.status} - ${errorData.message || errorData}`);
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error updating genres in DB.', error);
    }
}