const { getAccessToken } = require('./tokenUtils');

// This needs to be fixed to not have a global variable
let allTracksArr = [];
let accessToken = '';

async function createAllTracksPlaylist(artists, metro, dates) {
    allTracksArr = [];
    accessToken = await getAccessToken();

    const artistsArr = removeDuplicates(artists);

    for (i = 0; i < artistsArr.length; ++i) {
        if (i == artistsArr.length - 1 || i == 49) {
            searchForSpotifyArtist(artistsArr[i], metro, dates, true);
            break;
        } else {
            searchForSpotifyArtist(artistsArr[i], false);
        }
    }
}

function removeDuplicates(arr) {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        if (!newArr.includes(arr[i])) {
            newArr.push(arr[i]);
        }
    }
    return newArr;
}


// Spotify API Functions // Spotify API Functions // Spotify API Functions // Spotify API Functions // Spotify API Functions // Spotify API Functions

async function searchForSpotifyArtist(artist, metro, dates, createPlaylist) {
    const response = await fetch('https://api.spotify.com/v1/search?q=' + artist + '&type=artist&market=US&limit=5', {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + accessToken
        }
    });

    const data = await response.json();

    if (createPlaylist) {
        if (data.artists.items[0].name != artist) {
            getSpotifyUserID(metro, dates);
        } else {
            var spotifyArtistId = (data.artists.items[0].id);
            getSpotifyArtistTopTracks(spotifyArtistId, metro, dates, createPlaylist);
        }
    } else if (data.artists.items[0].name != artist) {
        return;
    } else {
        var spotifyArtistId = (data.artists.items[0].id);
        getSpotifyArtistTopTracks(spotifyArtistId);
    }
};


async function getSpotifyArtistTopTracks(artistID, metro, dates, createPlaylist) {
    const response = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/top-tracks?market=US', {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + accessToken
        }
    });

    const data = await response.json();

    for (var t = 0; t < 2; t++) {
        if (data.tracks[t] != 'undefined' && data.tracks[t] != null) {
            allTracksArr.push(data.tracks[t].id);
        };
    };

    if (createPlaylist) {
        getSpotifyUserID(metro, dates);
    }
};

async function getSpotifyUserID(metro, dates) {
    const response = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + accessToken
        }
    });

    const data = await response.json();

    var userId = data.id;

    createSpotifyPlaylist(userId, metro, dates);
};

async function createSpotifyPlaylist(userId, metro, dates) {

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

    const data = await response.json();

    var playlistId = data.id;

    addItemsToPlaylist(playlistId);
}

async function addItemsToPlaylist(playlistId) {

    var trackIdsUris = [];

    for (var i = 0; i < allTracksArr.length; i++) {
        trackIdsUris[i] = ("spotify:track:" + allTracksArr[i]);
    };

    const response = await fetch('https://api.spotify.com/v1/playlists/' + playlistId + '/tracks', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + accessToken,
        }, body: JSON.stringify({
            "uris": trackIdsUris
        })
    });

    const data = await response.json();

    // Continue this once ready for future iframes
    // iframePlaylist(playlistId, accessToken);
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

module.exports = { createAllTracksPlaylist };