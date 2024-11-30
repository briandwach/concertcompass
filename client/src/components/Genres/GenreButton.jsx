import { useState, useEffect } from 'react';

const GenreButton = ({ genre, handleGenreSelection, buttonSelected, buttonUnSelected }) => {
    const [buttonState, setButtonState] = useState('btn-neutral');

    useEffect(() => {
        if (buttonSelected) {
            setButtonState('btn-neutral');
        }

        if (buttonUnSelected) {
            setButtonState('btn-outline');
        } 
    }, [buttonSelected, buttonUnSelected]);

    // EVENT HANDLERS
    /////////////////
    const handleGenreSelect = (genre) => {
        setButtonState((prevState) =>
            prevState === 'btn-neutral' ? 'btn-outline' : 'btn-neutral'
        );

        handleGenreSelection(genre);
    };

    // RENDER
    /////////
    return (
        <button
            className={`btn btn-sm m-1 ${buttonState}`}
            onClick={() => handleGenreSelect(genre)}
        >
            {genre.name}
        </button>
    )
};

export default GenreButton;