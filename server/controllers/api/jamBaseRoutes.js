const router = require('express').Router();
const { concatEp, createOptions, updateMetroAreas, updateGenres } = require('../../utils/jamBaseUtils');
const { Metros, Genres } = require('../../models');

// Gets array of JamBase metro data and delivers to client
router.get('/metros', async (req, res) => {
    try {
        // Await the database query
        const metros = await Metros.find({});

        if (metros.length === 0) {
            console.error('Requested metros not found in the database.');
            return res.status(404).json({ error: 'Metro data not found' });
        }
        
        // Return the list of metros with 200 OK status
        return res.status(200).json(metros);
    } catch (err) {
        // Catch any error during the query
        console.error('Error retrieving metros data from db', err);
        
        // Return a 500 internal server error response
        res.status(500).json({ error: 'Something went wrong, please refresh and try again.' });
    }
});

// Gets array of JamBase genre data and delivers to client
router.get('/genres', async (req, res) => {
    try {
        // Await the database query
        const genres = await Genres.find({});

        if (genres.length === 0) {
            console.error('Requested genres not found in the database.');
            return res.status(404).json({ error: 'Genre data not found' });
        }
        
        // Return the list of metros with 200 OK status
        return res.status(200).json(genres);
    } catch (err) {
        // Catch any error during the query
        console.error('Error retrieving genre data from db', err);
        
        // Return a 500 internal server error response
        res.status(500).json({ error: 'Something went wrong, please refresh and try again.' });
    }
});


// ADMINISTRATION
// Updates metro areas in database to match that of JamBases
router.put('/metros', async (req, res) => {
    try {
        const updateMetros = await updateMetroAreas();

        if (updateMetros && updateMetros > 0) {
            return res.status(200).json(`${updateMetros} metros saved to the db successfully!`);
        } else {
            return res.status(500).json('Error updating metros in db.')
        }
    } catch (err) {
        console.error('Error updating metros in database:', err);
        res.status(500).json({ error: 'Something went wrong, please try again.' });
    }  
});

// Updates genres in database to match that of JamBases
router.put('/genres', async (req, res) => {
    try {
        const genres = await updateGenres();

        if (genres && genres > 0) {
            return res.status(200).json(`${genres} genres saved to the db successfully!`);
        } else {
            return res.status(500).json('Error updating genres in db.')
        }
    } catch (err) {
        console.error('Error updating genres in database:', err);
        res.status(500).json({ error: 'Something went wrong, please try again.' });
    }  
});

module.exports = router;