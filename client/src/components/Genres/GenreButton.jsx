import { useState } from 'react';

const GenreButton = ({ genre, handleGenreSelection }) => {
    const [buttonState, setButtonState] = useState('btn-outline');

    // EVENT HANDLERS
    /////////////////
    const handleGenreSelect = (genre) => {
        setButtonState((prevState) =>
            prevState === 'btn-outline' ? 'btn-neutral' : 'btn-outline'
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