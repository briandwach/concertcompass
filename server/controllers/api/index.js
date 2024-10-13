const router = require('express').Router();
const userRoutes = require('./userRoutes');
const spotifyRoutes = require('./spotifyRoutes');

router.use('/user', userRoutes);
router.use('/spotify', spotifyRoutes);

module.exports = router;