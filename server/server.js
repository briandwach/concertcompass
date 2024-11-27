require('dotenv').config();

const express = require('express');
const path = require('path'); 
const routes = require('./controllers');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3006;

const db = require('./config/connection');

// Tools needed to scheduled server tasks
const cron = require('node-cron');
const { refreshTokens } = require('./utils/tokenUtils');
const { updateMetroAreas } = require('./utils/jamBaseUtils');

// Configure cross-origin resource sharing
const corsOptions = {
    origin: process.env.ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

cron.schedule('*/30 * * * *', refreshTokens);
cron.schedule('0 0 * * 0', updateMetroAreas);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);

        // Refreshes tokens at server start if previous token document exists
        refreshTokens();
    });
});