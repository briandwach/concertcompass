export const getDisplayName = async () => {
    try {
        const res = await fetch('/api/spotify/displayName', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(`HTTP error! Status: ${res.status} - ${errorData.message || errorData}`);
        }

        const data = await res.json();
        const displayName = data.display_name;
        return displayName; // Return the data for further use
    } catch (error) {
        console.error('Error retrieving display name.', error);
    }
}


export const getPlaylist = async () => {
    try {
        const res = await fetch('/api/spotify/playlist', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!res.ok) {
            const errorData = await res.json();
            alert(`There was a problem generating a playlist: ${res.status} - ${errorData.message || errorData}`)
        }

        const data = await res.json();

        alert(`${data}`);
    } catch (error) {
        alert('Request failed to send.')
    }
}