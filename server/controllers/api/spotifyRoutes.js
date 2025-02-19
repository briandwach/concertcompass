const router = require('express').Router();
const { saveNewTokens, getAccessToken } = require('../../utils/tokenUtils');

// Creates new token document after deleting previous token document
router.post('/tokens', async (req, res) => {
    try {
        const { access_token, refresh_token } = req.body;

        // Validate request body
        if (!access_token || !refresh_token) {
            return res.status(400).json({ error: 'Access token and refresh token are required.' });
        }

        const savedTokens = await saveNewTokens(access_token, refresh_token);

        if (!savedTokens) {
            console.error('saveNewTokens utility function did not work.');
            return res.status(500).json({ error: 'Something went wrong, please try again.' });
        }

        res.status(201).json(savedTokens);       
    } catch (err) {
        console.error('Error saving tokens to database:', err);
        res.status(500).json({ error: 'Something went wrong, please try again.' });
    }
});

// Fetches demo display name from Spotify and sends to application client
router.get('/displayName', async (req, res) => {
    try {
    const accessToken = await getAccessToken();

    // Validate request body
    if (!accessToken) {
        return res.status(500).json({ error: 'Access token not available.' });
    }

    const response = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + accessToken
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Spotify API error:', errorData);
        return res.status(response.status).json({ error: errorData.error.message });
    }

    const data = await response.json();

    res.status(200).json(data);

    } catch (err) {
        console.error('Error retrieving demo display name:', err);
        res.status(500).json({ error: 'Something went wrong, please try again.' });
    }
});

module.exports = router;

//  Triggers Spotify API calls to generate playlist for demo account and return link to playlist
router.get('/playlist', async (req, res) => {
    try {
        if (1 === 1) {
            console.log('Successfully sent request to get playlist')
            return res.status(200).json(`Successfully sent request to get playlist`);
        } else {
            return res.status(500).json('Error updating metros in db.')
        }
    } catch (err) {
        console.error('Error receiving Spotify playlist request', err);
        res.status(500).json({ error: 'Error trying to retrieve playlist, please try again.' });
    }
});