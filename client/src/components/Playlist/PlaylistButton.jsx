import { getPlaylist } from '../../utils/spotifyRequests.js';

// EVENT HANDLERS
/////////////////
const handlePlaylistGeneration = (artists) => {
    getPlaylist(artists);
};


// RENDER
/////////
const PlaylistButton = ({ artists }) => {



    return (
        <button 
            className={`btn btn-sm m-1`}
            onClick={() => handlePlaylistGeneration(artists)}
        >
            Generate Playlist
        </button>
    )
};

export default PlaylistButton;