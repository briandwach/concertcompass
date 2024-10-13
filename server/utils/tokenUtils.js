const { Tokens } = require('../models');

const saveNewTokens = async (access_token, refresh_token) => {
     // Validate receiving token data
     if (!access_token || !refresh_token) {
        console.error('Could not save tokens to database: token data not present.')
        return;
    }

    // First, delete previous token documents
    const deleteResult = await Tokens.deleteMany({});
    console.log(`All previous tokens deleted: ${deleteResult.deletedCount} documents removed.`);

    // Create new token document
    const newTokens = new Tokens({
        accessToken: access_token,
        refreshToken: refresh_token
    });

    // Save the new token document
    const savedTokens = await newTokens.save();
    return savedTokens;
}

// Retrieve access token from DB for use with Spotify Web API
const getAccessToken = async () => {
    try {
        const result = await Tokens.findOne({});
        return result.accessToken;
    } catch (err) {
        console.error('Error querying DB access token:', err);
    }
};

const getRefreshToken = async () => {
    try {
        const result = await Tokens.findOne({});
        return result.refreshToken;
    } catch (err) {
        console.error('Error querying DB refresh token:', err);
    }
};

const refreshTokens = async () => {

    const url = "https://accounts.spotify.com/api/token";
    const refreshToken = await getRefreshToken();

    // Validate request body
    if (!refreshToken) {
        console.error('Error refreshing access token. Maintenance required or first initialization of server.');
        return;
    }

    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: process.env.SPOTIFY_CLIENT_ID
        }),
    }
    const body = await fetch(url, payload);
    const response = await body.json();

    console.log(`Token refresh called at: [${new Date().toISOString()}]`);
    console.log('Spotify refresh token response:');
    console.log(response);

    const savedTokens = await saveNewTokens(response.access_token, response.refresh_token);
    
    if (!savedTokens) {
        console.error('saveNewTokens utility function did not work.');
    }

    console.log('Spotify demo tokens have been refreshed: ', savedTokens);
};

module.exports = { saveNewTokens, getAccessToken, refreshTokens };