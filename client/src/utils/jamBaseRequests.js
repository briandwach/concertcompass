export const updateMetros = async () => {
    try {
        const res = await fetch('/api/jamBase/metros', {
            method: 'POST',
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