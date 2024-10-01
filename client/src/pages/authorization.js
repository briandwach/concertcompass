const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = 'http://localhost:3005';

const storeTokens = async (tokenObj) => {
    try {
        const res = await fetch('/api/tokens', {
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
        console.log('Tokens successfully saved in the dB:', data);
        return data;
    } catch (error) {
        console.error('Error saving tokens in dB.', error);
    }
};


// Spotify Authentification
//---------------------------------------------------------------------------------------------------------------
export const authorize = async function () {

    localStorage.removeItem('code_verifier');

    // From Spotify Web API Documentation ----------------------------------------
    const generateRandomString = (length) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    };

    const codeVerifier = generateRandomString(64);
    // ---------------------------------------------------------------------------


    // From Spotify Web API Documentation ----------------------------------------
    const sha256 = async (plain) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(plain);
        return window.crypto.subtle.digest('SHA-256', data);
    };
    // ---------------------------------------------------------------------------


    // From Spotify Web API Documentation ----------------------------------------
    const base64encode = (input) => {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    };
    // ---------------------------------------------------------------------------  


    // From Spotify Web API Documentation ----------------------------------------
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);
    // ---------------------------------------------------------------------------



    const scope = 'playlist-modify-public playlist-modify-private';
    const authUrl = new URL("https://accounts.spotify.com/authorize");

    // generated in the previous step
    window.localStorage.setItem('code_verifier', codeVerifier);

    const params = {
        response_type: 'code',
        client_id: clientId,
        scope,
        state: 'concertcompass',
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectUri
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
    // ---------------------------------------------------------------------------
};




// From Spotify Web API Documentation ----------------------------------------
export const getTokens = async token => {


    const url = "https://accounts.spotify.com/api/token";

    // From Spotify Web API Documentation ----------------------------------------
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');
    // ---------------------------------------------------------------------------


    // stored in the previous step
    let codeVerifier = localStorage.getItem('code_verifier');

    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier
        }),
    };

    const body = await fetch(url, payload);
    const tokenObj = await body.json();

    localStorage.setItem('access_token', tokenObj.access_token);
    localStorage.setItem('refresh_token', tokenObj.refresh_token);
    // ---------------------------------------------------------------------------


    // ------  Store display name
    const getDisplayName = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token')
        }
    });

    const data = await getDisplayName.json();
    localStorage.setItem('display_name', data.display_name);

    // API request to store tokens in dB
    storeTokens(tokenObj);
};