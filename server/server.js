const express = require('express');
const cors = require('cors');
const db = require('./config/connection');
const { Tokens } = require('./models');

const app = express();
const PORT = process.env.PORT || 3006;

// Configure cross-origin resource sharing
const corsOptions = {
    origin:'http://localhost:3005',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Updates tokens after token refresh


// ADMIN Requests

// Creates new token document after deleting previous token document
app.post('/api/tokens', async (req, res) => {
    try {
        // First, delete previous token documents
        const deleteResult = await Tokens.deleteMany({});
        console.log(`All previous tokens deleted: ${deleteResult.deletedCount} documents removed.`);
        console.log(req.body);
        // Create new token document
        const newTokens = new Tokens({
            accessToken: req.body.access_token,
            refreshToken: req.body.refresh_token
        });
        
        // Save the new token document
        const savedTokens = await newTokens.save();
        res.status(201).json(savedTokens);
        
    } catch (err) {
        console.error('Something went wrong:', err);
        res.status(500).json({ error: 'Something went wrong, please try again.' });
    }
});


db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
    });
});