const router = require('express').Router();

// Endpoint to store the state in session
router.post('/store-state', (req, res) => {
    const { state } = req.body;
    if (!state) {
        return res.status(400).json({ error: 'State is required.' });
    }
    
    req.session.state = state; // Store state in session
    res.status(200).json({ message: 'State stored successfully.' });
});


// Route to check session state
router.get('/session', (req, res) => {
    if (req.session.state) {
        res.json({ state: req.session.state });
    } else {
        res.status(404).json({ error: 'No state found in session.' });
    }
});

module.exports = router;