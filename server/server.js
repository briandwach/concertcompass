require('dotenv').config();

const express = require('express');
const session = require('express-session');
const routes = require('./controllers');
const cors = require('cors');
const db = require('./config/connection');

const { trusted } = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3006;

// Configure cross-origin resource sharing
const corsOptions = {
    origin:'http://localhost:3005',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' } 
}));

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
    });
});