const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;

import storeTokens from '../components/Admin/demoAuthorization.js';

// Function to get state value stored in Express session
const getState = async () => {
    try {
        const response = await fetch('/api/user/session', {
            method: 'GET',
            credentials: 'include', // Include cookies for session management
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.state; // Use the state as needed
    } catch (error) {
        console.error('Error retrieving state from session:', error);
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


    const state = generateRandomString(16);
    const scope = 'playlist-modify-public playlist-modify-private';
    const authUrl = new URL("https://accounts.spotify.com/authorize");

    // generated in the previous step
    window.localStorage.setItem('code_verifier', codeVerifier);

    const params = {
        response_type: 'code',
        client_id: clientId,
        scope,
        state: state,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectUri
    };

    // Stores unique state value in Expression and redirects to Spotify auth url
    const redirect = async () => {
        const response = await fetch('/api/user/store-state', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ state }),
        });

        if (response.ok) {
            authUrl.search = new URLSearchParams(params).toString();
            window.location.href = authUrl.toString();
        } else {
            console.error('Failed to store state on server.');
        }
    };

    redirect();
};

// From Spotify Web API Documentation ----------------------------------------
export const getTokens = async token => {

    const url = "https://accounts.spotify.com/api/token";

    // From Spotify Web API Documentation ----------------------------------------
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    // ---------------------------------------------------------------------------

    // Retrieves state from Express session
    const sessionState = await getState();

    if (sessionState !== state) {
        console.log('There was a state mismatch');
        return;
    }

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

    // API request to store tokens in dB
    storeTokens(tokenObj);
};