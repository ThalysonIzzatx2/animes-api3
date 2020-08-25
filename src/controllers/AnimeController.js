const axios = require('axios');
const cheerio = require('cheerio');

const config = require('../config.json');

module.exports = {
    async index(req, res) {
        const page = req.params.page || 1;
        const url = config.url + 'anime/page/' + page
        const html = await axios.get(url);
        const $ = cheerio.load(html.data);
        
        let lastAnimeList = [];
        $('.tvshows').each((i, element) => {
            const ch = $(element);
            const body = {
                'id': (parseInt(i)+1) + (20 * (page - 1)),
                'title': ch.find('h3').text(),
                'img': ch.find('img').attr('src'),
                'url': ch.find('a').attr('href'),
                'slug': ch.find('a').attr('href').split('/')[4]

            };

            lastAnimeList.push(body);
        });

        res.json(lastAnimeList)
    },
    async show(req, res) {
        const slug = req.params.slug;
        const url = config.url + '/anime/' + slug;
        const html = await axios.get(url);
        const $ = cheerio.load(html.data);

        let animeDetails = {
            nome:"",
            img: "",
            descricao: "",
            categorias: [],
            ano: "",
            stars: "",
        };

        //nome
        animeDetails['nome'] = $('h1').text();
        //img
        $('.poster').each((i, element) => {
            const ch = $(element);
            animeDetails['img'] = ch.find('img').attr('src');
        });

        //descricao
        $('.wp-content').each((i, element) => {
            const ch = $(element);
            animeDetails['descricao'] = ch.find('p').text()
        });
        //ano
        animeDetails['ano'] = $('.extra').text();
        //stars
        animeDetails['stars'] = $('.dt_rating_vgs').text();
        //categorias
        $('.sgeneros a').each((i, element) => {
            const ch = $(element);
            const categorias = ch.text();
            animeDetails['categorias'].push(categorias)
        });

         res.json(animeDetails);

        
    }
}