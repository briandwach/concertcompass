const router = require('express').Router();
const { concatEp, createOptions, updateMetroAreas } = require('../../utils/jamBaseUtils');

router.post('/metros', async (req, res) => {

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

module.exports = router;