const express = require('express');
const axios = require('axios');

const {searchBing} = require('./config/axiosConfig');

const port = process.env.PORT || 3000;

let app = express();

app.use(express.static(__dirname + '/public'));

app.get('/imagesearch/:searchquery', (req, res) => {
    let searchQuery = req.params.searchquery;
    let offset = req.query.offset;

    searchBing.get(`/images/search?q=${searchQuery}&offset=${offset || '0'}&count=10`).then((response) => {
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
    }).catch((e) => res.send(e));
});

app.listen(port, () => {
    console.log(`Server up on port ${port}`);
});