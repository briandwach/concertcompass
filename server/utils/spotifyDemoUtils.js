const { getAccessToken } = require('./tokenUtils');

async function generatePlaylist(artists, metro, dates) {
    const tracksArr = [];
    const accessToken = await getAccessToken();

    const artistsArr = removeDuplicates(artists);

    // Avoids playlist being larger than 100 songs (50 artists).  You can only add 100 songs at a time to a playlist in an API call.
    for (i = 0; i < artistsArr.length && tracksArr.length < 100; i++) {

        const artistId = await searchForSpotifyArtist(artistsArr[i], accessToken);

        if (artistId) {
            const topTracks = await getSpotifyArtistTopTracks(artistId, accessToken);

            if (topTracks) {
                for (let track of topTracks) {
                    tracksArr.push(track);
                }
            }
        }
    }

    console.log('Tracks Array');
    console.log(tracksArr);

    const userId = await getSpotifyUserID(accessToken);

    let playlistUrl = '';

    if (userId) {
        const playlist = await createSpotifyPlaylist(userId, metro, dates, accessToken)

        if (playlist) {
            playlistUrl = playlist.url;
            await addTracksToPlaylist(playlist.id, tracksArr, accessToken);
        }
    }

    return playlistUrl;
}


function removeDuplicates(arr) {
    return [...new Set(arr)]
}


async function searchForSpotifyArtist(artist, accessToken) {
    const response = await fetch('https://api.spotify.com/v1/search?q=' + artist + '&type=artist&market=US&limit=5', {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + accessToken
        }
    });

    const data = await response.json();

    const name = data.artists.items[0].name;
    const artistId = data.artists.items[0].id;

    console.log('Artist Name');
    console.log(name);


    if (name.toLowerCase() === artist.toLowerCase()) {
        console.log('Artist ID');
        console.log(artistId);
        return artistId;
    } else {
        console.log('******No artist match between JamBase and Spotify******');
    }

    return false;
};


async function getSpotifyArtistTopTracks(artistID, accessToken) {
    const response = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/top-tracks?market=US', {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + accessToken
        }
    });

    const data = await response.json();

    const trackIds = [];

    for (var t = 0; t < 2; t++) {
        if (data.tracks[t] != 'undefined' && data.tracks[t] != null) {
            trackIds.push(data.tracks[t].id);
        }
    }

    console.log('Track Ids');
    console.log(trackIds);

    if (trackIds.length > 0) {
        return trackIds;
    } else {
        return false;
    }
};

async function getSpotifyUserID(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + accessToken
        }
    });

    const data = await response.json();

    return data.id;
};

async function createSpotifyPlaylist(userId, metro, dates, accessToken) {

    if (dates.startDate === dates.endDate) {
        dateRange = dates.startDate;
    } else {
        dateRange = dates.startDate + ' - ' + dates.endDate;
    }

    const response = await fetch('https://api.spotify.com/v1/users/' + userId + '/playlists', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + accessToken,
        }, body: JSON.stringify({
            "name": metro + " " + dateRange + " from Concert Compass",
            "description": "Created by Concert Compass web application",
            "public": true
        })
    });

    const playlist = await response.json();

    return { id: playlist.id, url: playlist.external_urls.spotify };
}

async function addTracksToPlaylist(playlistId, tracksArr, accessToken) {
    try {
        const trackIdsUris = tracksArr.map(track => "spotify:track:" + track);

        const response = await fetch('https://api.spotify.com/v1/playlists/' + playlistId + '/tracks', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessToken,
            },
            body: JSON.stringify({
                "uris": trackIdsUris
            })
        });

        // Check if the response is successful (status code 2xx)
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error adding tracks: ${errorData.error.message}`);
        }

        // If response is successful, you can handle the response as needed
        const data = await response.json();
        // console.log('Tracks added successfully', data);

    } catch (error) {
        // Handle errors (network issues, invalid response, etc.)
        console.error('An error occurred:', error.message);
    }
}


function iframePlaylist(playlistId, accessToken) {
    let container = document.getElementById("playlistiframe");
    container.innerHTML += ("<button id='unfollow'>Click here to remove playlist from your library</button>" +
        "<iframe " +
        "style='border-radius:12px' " +
        "src=https://open.spotify.com/embed/playlist/" + playlistId + "?utm_source=generator&theme=0 " +
        "width='100%' " +
        "height='625' " +
        "frameBorder='0' " +
        "allowfullscreen='' " +
        "allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture' " +
        "loading='lazy'><br />");

    createTracksEl.textContent = ('Start New Search');
    createTracksEl.removeEventListener('click', createAllTracksPlaylist);
    createTracksEl.addEventListener('click', startNewSearch);

    unfollowEl = document.getElementById("unfollow");
    unfollowEl.addEventListener('click', function () { unfollowPlaylist(playlistId, accessToken); });
}

async function unfollowPlaylist(playlistId, accessToken) {

    const response = await fetch('https://api.spotify.com/v1/playlists/' + playlistId + '/followers', {
        method: 'DELETE',
        headers: {
            Authorization: 'Bearer ' + accessToken
        }
    });

    let container = document.getElementById("playlistiframe");
    var removePlaylistEl = document.createElement('p');
    removePlaylistEl.textContent = ("Playlist has been removed from your library");
    container.replaceChild(removePlaylistEl, unfollowEl);
}

function startNewSearch() {
    window.location.replace(redirectUri);
}

module.exports = { generatePlaylist };