import { useState } from 'react';
import { getPlaylist } from '../../utils/spotifyRequests.js';

const PlaylistButton = ({ artists, metro, dateRange }) => {
    const [playlistData, setPlaylistData] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // EVENT HANDLERS
    /////////////////
    const handlePlaylistGeneration = async () => {
        setLoading(true);
        try {
            const playlistUrl = await getPlaylist(artists, metro.name, dateRange);
            setPlaylistData(playlistUrl);
        } catch (err) {
            setError('Failed to generate playlist.');
        } finally {
            setLoading(false);
        }
    };

    // RENDER
    /////////
    return (
        <div>
            {!loading && !playlistData && (
                <button
                    className="btn btn-sm m-1"
                    onClick={() => handlePlaylistGeneration()}
                >
                    Generate Playlist
                </button>
            )}

            {loading && <p>Creating playlist...</p>}

            {!loading && playlistData && (
                <button className="btn btn-sm m-1">
                    <a
                        href={playlistData}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Open Playlist
                    </a>
                </button>
            )}

            {error && <p className="text-danger">{error}</p>}
        </div>
    );
};

export default PlaylistButton;