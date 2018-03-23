Twitter wall for the Booster conference
=======
This project contains a Node API server and a React app generated with create-react-app under `client/`.

Twitter keys
============

This application connects to the Twitter Streaming API. You must create an application 
on [https://apps.twitter.com/], and generate an access token for it. The application expects 
the following environment variables: 

```bash
export TWITTER_CONSUMER_KEY="..."
export TWITTER_CONSUMER_SECRET="..."
export TWITTER_ACCESS_TOKEN="..."
export TWITTER_ACCESS_TOKEN_SECRET="..."
```

To run, first install dependencies for both:

```
$ npm i && cd client && npm i && cd ..
```

Then boot both the server and the client:

```
$ npm run start-dev
``` 

Running on Heroku
=================

```bash
heroku config:set TWITTER_CONSUMER_KEY="..." TWITTER_CONSUMER_SECRET="..." \
                  TWITTER_ACCESS_TOKEN="..." TWITTER_ACCESS_TOKEN_SECRET="..."
```
 
 
