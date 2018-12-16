const express = require('express');
const app = express();
const mysql = require('mysql');
const fs = require('fs');
const bodyParser = require("body-parser");
const request = require('request-promise');
const {
    validateData,
    normalizeRow
} = require('./normalization')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


const dbConnection = mysql.createConnection({
    multipleStatements: true,
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'houseBelg'
});

dbConnection.connect();

let url = 'https://api.apify.com/v1/execs/GADc5njt8WRg8mh23/results?format=json&simplified=1'

async function normalize(data) {

    for (var i = 0; i < data.length; i++) {
        if (typeof data[i].location === 'undefined') {
            continue;
        }
        if (typeof data[i].images === 'undefined') {
            continue;
        }
        // if (typeof data[i].parcel === 'op aanvraag »') {
        //     continue;
        // }
        let extractedData = [{
            id: (Math.floor(Math.random() * 6667) + 1),
            url: data[i].url,
            title: data[i].title,
            images: data[i].images,
            country: data[i].location.country,
            city: data[i].location.city,
            address: data[i].location.address.trim(),
            lat: Number(data[i].coordinates.lat),
            lng: Number(data[i].coordinates.lng),
            parcel: Number(data[i].size.parcel_m2.replace(/\D/g, '')),
            living: Number(data[i].size.gross_m2.replace(/\D/g, '')),
            rooms: Number(data[i].size.rooms.replace(/\D/g, '')),
            price: Number(data[i].price.Amount.replace(/\D/g, '')),
            currency: data[i].price.Currency.trim(),
            added: data[i].added
        }]
        // console.log(extractedData);
        // connectAndInsert(extractedData);
        // return extractedData;
    }
};

connectAndInsert = (insert) => {

    let query = `INSERT INTO house_mouse SET ? `;
    dbConnection.query(query, insert, function (error, results, fields) {
        if (error) {
            throw error
        };
        console.log('done-banan')
    });
    // dbConnection.end();
}

async function fetchInformation() {
    try {
        let data = JSON.parse(await request(url));
        let filteredData = await normalize(data);
        fs.writeFile('./hous.json', JSON.stringify(filteredData), err => {
            if (err) throw err;
        });

    } catch (err) {
        console.log(err)
    }
}
fetchInformation();

//Front-end/////
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/searchCity', (req, res) => {
    let cityWhere = '';
    let cityParam = req.query.city || null;
    console.log(cityParam)
    if (cityWhere) {
        cityWhere = `where country '${cityParam}'`
    }
    try {
        dbConnection.query(
            `select * from house_mouse ${cityWhere};`,
            [],
            (err, results, fields) => {
                if (err) {
                    res.status(400).end();
                    return;
                }
                res.json({
                    results
                });
                console.log('status "ok" ')
            })
    } catch (e) {
        throw e;
    }

});


app.post('/upload', (req, res) => {
    try {
        const data = validateData(req.body);
        const validData = data.filter((d) => d.error === null);
        res.json({
            processed: data.length,
            valid: validData.length,
            failed: data.filter((d) => d.error !== null)
        }).end();

        const normalizeDtata = validData.map(normalizeRow);

        if (normalizeDtata.length) {
            //dont forget vhange 'antwerpen'!
            dbConnection.query('INSERT INTO house_mouse VALUES ?', [
                    normalizeDtata.map((data) => [

                        data['id'],
                        data['url'],
                        data['title'],
                        data['images'],
                        data['country'],
                        data['city'],
                        data['address'],
                        data['lat'],
                        data['lng'],
                        data['parcel'],
                        data['living'],
                        data['rooms'],
                        data['price'],
                        data['currency'],
                        data['added']
                    ])
                ],

                (err, values, fields) => {
                    if (err) {
                        throw err;
                    }
                    console.log('Is ok', values);
                })
        }
    } catch (e) {

        res.status(400).end();
    }
    res.end();
});

const port = process.env.PORT || 3311;
app.listen(port, () => {

    console.log(`app is running at localhost ${port}`)
});