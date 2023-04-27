const express = require('express');
const router = express.Router();
const spotifyController = require('../controllers/spotifyController');

router.get('/search/:trackName', async function(req, res, next) {
  const trackName = req.params.trackName;
  const tracks = await spotifyController.searchSongs(trackName);
  res.json(tracks);
});

module.exports = router;
