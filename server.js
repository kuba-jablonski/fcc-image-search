require('./config/config');

const express = require('express');
const moment = require('moment');

const {searchBing} = require('./config/axiosConfig');
const {mongoose} = require('./db/mongoose');
const {Search} = require('./models/search')

const port = process.env.PORT;

let app = express();

app.use(express.static(__dirname + '/public'));

app.get('/imagesearch/:searchquery', (req, res) => {
    let searchQuery = req.params.searchquery;
    let offset = req.query.offset || '0';

    searchBing.get(`/images/search?q=${searchQuery}&offset=${offset}&count=10`).then((response) => {
        let customRes = [];
        response.data.value.forEach((value) => {
            customRes.push({
                name: value.name,
                url: value.webSearchUrl,
                thumbnail: value.thumbnailUrl,
                host: value.hostPageDisplayUrl
            });
        });

        res.send(customRes);
    }).then(() => {
        let search = new Search({
            term: searchQuery,
            when: moment().utc().format('MMMM Do YYYY, h:mm:ss a')
        });

        search.save()
    }).catch((e) => res.send(e));
});

app.listen(port, () => {
    console.log(`Server up on port ${port}`);
});