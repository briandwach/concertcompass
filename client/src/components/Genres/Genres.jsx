import { useEffect, useRef } from 'react';
import { getGenres } from '../../utils/jamBaseRequests.js';
import GenreButton from './GenreButton.jsx';

const Genres = ({ genreSelections, handleGenreChange }) => {
    const genreDataRef = useRef([]);

    useEffect(() => {
        const callGenres = async () => {
            const data = await getGenres();

            const formattedGenres = data.map((genre) => {
                const { identifier, name } = genre;

                const genreObj = {
                    identifier: identifier,
                    name: name
                };

                return genreObj;
            });

            genreDataRef.current = formattedGenres;
        };

        callGenres();
    }, []);

    // EVENT HANDLERS
    /////////////////
    const handleGenreSelection = (genre) => {
        if (genreSelections.some(g => g.identifier === genre.identifier)) {
            const newGenres = genreSelections.filter(checkGenre => checkGenre.identifier !== genre.identifier);
            handleGenreChange(newGenres);
        } else {
            const newGenres = [...genreSelections, genre];
            handleGenreChange(newGenres);
        }
    };


    // RENDER
    /////////
    return (
        <div>
            {genreDataRef.current.map((genre) => (
                <GenreButton key={genre.identifier} genre={genre} handleGenreSelection={handleGenreSelection} />
            ))}
        </div>
    )
};

export default Genres;