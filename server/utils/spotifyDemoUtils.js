export default function createAllTracksPlaylist(artists) {

    artistsArr = removeDuplicates(artists);

    for (i = 0; i < artists.length; ++i) {
        if (i == artists.length - 1 || i == 49) {
            searchForSpotifyArtist(artists[i], true);
            break;
        } else {
            searchForSpotifyArtist(artists[i], false);
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

async function searchForSpotifyArtist(artist, createPlaylist) {
    let accessToken = localStorage.getItem('access_token');

    const response = await fetch('https://api.spotify.com/v1/search?q=' + artist + '&type=artist&market=US&limit=5', {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + accessToken
        }
    });

    const data = await response.json();

    if (createPlaylist) {
        if (data.artists.items[0].name != artist) {
            getSpotifyUserID(allTracksArr, accessToken);
        } else {
            var spotifyArtistId = (data.artists.items[0].id);
            getSpotifyArtistTopTracks(spotifyArtistId, accessToken, createPlaylist);
        }
    } else if (data.artists.items[0].name != artist) {
        return;
    } else {
        var spotifyArtistId = (data.artists.items[0].id);
        getSpotifyArtistTopTracks(spotifyArtistId, accessToken, createPlaylist);
    }
};


async function getSpotifyArtistTopTracks(artistID, accessToken, createPlaylist) {
    let container = document.getElementById("results-container");

    container.textContent = "";

    const response = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/top-tracks?market=US', {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + accessToken
        }
    });

    const data = await response.json();

    var trackIdsArray = [];

    for (var t = 0; t < 2; t++) {
        if (data.tracks[t] != 'undefined' && data.tracks[t] != null) {
            trackIdsArray[t] = data.tracks[t].id;
            allTracksArr.push(data.tracks[t].id);
        };
    };

    if (createPlaylist) {
        getSpotifyUserID(allTracksArr, accessToken);
    }
};

async function getSpotifyUserID(trackIdsArray, accessToken) {

    document.getElementById("calendar").style.display = "none";
    radioTrackerEl.style.display = "none";

    let container = document.getElementById("results-container");

    const response = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + accessToken
        }
    });

    const data = await response.json();

    var userId = data.id;

    createSpotifyPlaylist(userId, trackIdsArray, accessToken);
};

async function createSpotifyPlaylist(userId, trackIdsArray, accessToken) {

    var dateRange = "";

    if (localStorage.getItem('Start Date') === localStorage.getItem('End Date')) {
        dateRange = localStorage.getItem('Start Date');
    } else {
        dateRange = (localStorage.getItem('Start Date') + ' - ' + localStorage.getItem('End Date'));
    }

    const response = await fetch('https://api.spotify.com/v1/users/' + userId + '/playlists', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + accessToken,
        }, body: JSON.stringify({
            "name": localStorage.getItem('Metro Name') + " " + dateRange + " from Concert Sampler",
            "description": "Created by Concert Sampler web application",
            "public": true
        })
    });

    const data = await response.json();

    var playlistId = data.id;

    addItemsToPlaylist(playlistId, trackIdsArray, accessToken);


}

async function addItemsToPlaylist(playlistId, trackIdsArray, accessToken) {

    var trackIdsUris = [];

    for (var i = 0; i < trackIdsArray.length; i++) {
        trackIdsUris[i] = ("spotify:track:" + trackIdsArray[i]);
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

    let container = document.getElementById("results-container");
    container.innerHTML += ('<li>Good news!  Your playlist has been created.  It has been added to your Spotify library and you can listen now below.</li>');

    iframePlaylist(playlistId, accessToken);
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