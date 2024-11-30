import { useState, useEffect, useRef } from 'react';
import { getGenres } from '../../utils/jamBaseRequests.js';
import GenreButton from './GenreButton.jsx';

const Genres = ({ genreSelections, handleGenreChange, selectAllGenres, clearAllGenres, getTotalGenres }) => {
    const [buttonSelected, setButtonSelected] = useState(true);
    const [buttonUnSelected, setButtonUnSelected] = useState(false);
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
            getTotalGenres(formattedGenres.length);
            handleGenreChange(formattedGenres);
        };

        callGenres();
    }, []);

    useEffect(() => {
        if (selectAllGenres) {
            handleGenreChange(genreDataRef.current);
            setButtonSelected(true);
            setButtonUnSelected(false);
        }

        if (clearAllGenres) {
            handleGenreChange([]);
            setButtonSelected(false);
            setButtonUnSelected(true);
        } 
    }, [selectAllGenres, clearAllGenres]);

    // EVENT HANDLERS
    /////////////////
    const handleGenreSelection = (genre) => {
        // Resets select all and clear all booleans with individual selection
        setButtonSelected(false);
        setButtonUnSelected(false);

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
                <GenreButton key={genre.identifier} genre={genre} handleGenreSelection={handleGenreSelection} buttonSelected={buttonSelected} buttonUnSelected={buttonUnSelected} />
            ))}
        </div>
    )
};

export default Genres;