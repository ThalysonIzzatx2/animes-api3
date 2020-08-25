const axios = require('axios');
const cheerio = require('cheerio');

const config = require('../config.json');

module.exports = {
    async index(req, res) {
        const url = config.url + 'animes-mais-vistos';
        const html = await axios.get(url);
        const $ = cheerio.load(html.data);
        
        let lastAnimeList = [];
        $('.tvshows').each((i, element) => {
            const ch = $(element);
            const body = {
                'id': (parseInt(i)+1),
                'title': ch.find('h3').text().split('Todos')[0],
                'img': ch.find('img').attr('src'),
                'url': ch.find('a').attr('href'),

            };

            lastAnimeList.push(body);
        });

        res.json(lastAnimeList)
    }
}