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

    searchBing.get(`/images/search?q=${searchQuery}&offset=${offset}&count=10`)
        .then((response) => {
            let customRes = [];
            response.data.value.forEach((value) => {
                customRes.push({
                    name: value.name,
                    url: value.webSearchUrl,
                    thumbnail: value.thumbnailUrl,
                    host: value.hostPageDisplayUrl
                });
            });

            res.status(200).send(customRes);
        })
        .then(() => {
            let now = moment().utc();

            let search = new Search({
                createdAt: +now,
                term: searchQuery,
                when: now.format('MMMM Do YYYY, h:mm:ss a')
            });

            search.save((e) => {
                if (e) console.log(e);
            });
        })
        .catch((e) => {
            console.log(e);
            res.send();
        });
});

app.get('/latest/imagesearch', (req, res) => {
    Search
        .find({})
        .limit(10)
        .sort('-createdAt')
        .select({_id: 0, createdAt: 0, __v: 0})
        .exec()
        .then((docs) => res.send(docs))
        .catch((e) => {
            console.log(e);
            res.send();
        });
});

app.listen(port, () => {
    console.log(`Server up on port ${port}`);
});

module.exports = {app};