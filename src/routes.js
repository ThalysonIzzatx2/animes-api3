const express = require('express');

const AnimeController = require('./controllers/AnimeController');
const EpisodeController = require('./controllers/EpisodeController');
const BestController = require('./controllers/BestController');

const routes = express.Router();

routes.get('/animes/:page?', AnimeController.index);
routes.get('/best-animes/', BestController.index);

routes.get('/anime/:slug', AnimeController.show);

routes.get('/episode/:slug', EpisodeController.index);
routes.get('/video/:slug/', EpisodeController.show);

module.exports = routes;