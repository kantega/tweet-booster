const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Twit = require('twit');
const port = process.env.PORT || 3001;

import fetch from 'node-fetch';
const version = Date.now();

app.use(express.static('./client/build'));

app.get('/version', function (req, res) {
    res.json({version: version});
});

let program = {};
app.get('/program', function (req, res) {
    res.json(program);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(port, function () {
    console.log('listening on *:' + port);
});

const twit = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
});

let initialTweets = [];

const getInitialTweets = function () {
    twit.get('search/tweets', {
        q: 'boosterconf OR booster2018 since:2018-01-01',
        count: 30
    }, function (err, data, response) {
        initialTweets = data.statuses;
    });
};

const stream = twit.stream('statuses/filter', {track: 'boosterconf,booster2018'});
stream.on('tweet', function (tweet) {
    io.emit('tweet', tweet);
});

getInitialTweets();
setInterval(getInitialTweets, 20000);

io.on('connection', function (socket) {
    console.log('a user connected');
    for (let i = 0; i < initialTweets.length; i++) {
        const tweet = initialTweets[i];
        socket.emit('tweet', tweet);
    }
});

// program json
const endpoint = 'https://2018.boosterconf.no/api/program';
console.log(endpoint);

function fetchProgram() {
    fetch(endpoint)
        .then(response => response.json())
        .then(json => program = json)
}

fetchProgram();
setInterval(fetchProgram, 5000);

export default app;
