// Database queries to store access and refresh token for Spotify demo account
const storeTokens = async (tokenObj) => {
    try {
        const res = await fetch('/api/spotify/tokens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tokenObj)
        });

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        console.log('Tokens successfully saved in the dB.');
        return data;
    } catch (error) {
        console.error('Error saving tokens in dB.', error);
    }
};

export default storeTokens;