const moment = require('moment');

const seedSearch = [];

for (let i = 1; i <= 100; i++) {
    let now = 100000 + i;

    seedSearch.push({
        createdAt: now,
        term: `test term ${i}`,
        when: moment(now).format('MMMM Do YYYY, h:mm:ss a')
    });
}

module.exports = {seedSearch};