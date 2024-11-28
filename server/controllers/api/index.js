const router = require('express').Router();
const userRoutes = require('./userRoutes');
const spotifyRoutes = require('./spotifyRoutes');
const jamBaseRoutes = require('./jamBaseRoutes');

router.use('/user', userRoutes);
router.use('/spotify', spotifyRoutes);
router.use('/jamBase', jamBaseRoutes);

module.exports = router;