const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const config = require('../config.json');
const { show } = require('./AnimeController');

module.exports = {
    async index(req, res) {
        const slug = req.params.slug;
        const url = config.url + '/anime/' + slug;
        const html = await axios.get(url);
        const $ = cheerio.load(html.data);

        let episodes = [];

        $('.episodios li').each((i, element) => {
            const ch = $(element);
            const body = {
                img: ch.find('img').attr('src'),
                name: ch.find('.numerando').text(),
                date: ch.find('.date').text(),
                url: ch.find('a').attr('href').split('/')[4],
            };
            
            episodes.push(body)
        });

        res.json(episodes);
    },
    async show(req, res) {
        const slug = req.params.slug;
        const url = config.url + '/episodio/' + slug;
        const browser = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        }) 
        const page = await browser.newPage()
        await page.goto(url);
        
        const el = await page.$('.metaframe')

        const frame = await el.contentFrame();
        const $ = cheerio.load(frame);
        const video = await frame.$eval('script', el => el.textContent.split('=')[1]);

        

        res.json(JSON.parse(video))
    }
};