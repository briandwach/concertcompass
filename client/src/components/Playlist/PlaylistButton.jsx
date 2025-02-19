import { getPlaylist } from '../../utils/spotifyRequests.js';

// EVENT HANDLERS
/////////////////
const handlePlaylistGeneration = () => {
    getPlaylist();
};


// RENDER
/////////
const PlaylistButton = () => {



    return (
        <button 
            className={`btn btn-sm m-1`}
            onClick={handlePlaylistGeneration}
        >
            Generate Playlist
        </button>
    )
};

export default PlaylistButton;