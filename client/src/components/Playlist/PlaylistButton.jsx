import { getPlaylist } from '../../utils/spotifyRequests.js';

// EVENT HANDLERS
/////////////////
const handlePlaylistGeneration = (artists, metro, dateRange) => {
    getPlaylist(artists, metro, dateRange);
};


// RENDER
/////////
const PlaylistButton = ({ artists, metro, dateRange }) => {



    return (
        <button 
            className={`btn btn-sm m-1`}
            onClick={() => handlePlaylistGeneration(artists, metro.name, dateRange)}
        >
            Generate Playlist
        </button>
    )
};

export default PlaylistButton;