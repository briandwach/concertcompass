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