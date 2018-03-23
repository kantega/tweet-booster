import React from "react";
import {ReactInterval} from "react-interval";
import Tweet from "./Tweet";
import PictureTweet from "./PictureTweet";
import EventScheduleDisplay from "./EventScheduleDisplay"
import './index.css';

class TweetController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            maxListSize: 200,
            normalTweetUpdateInterval: 4,
            pictureTweetUpdateInterval: 6,
            maxTweets: 4,       //the number of tweets to display at one time
            tweets: [null, null, null, null],         //tweets currently being displayed
            pictureTweet: null,
            backupTweets: [],  //tweets that have been shown, available to recycle if tweet backlog is emmpty
            tweetBackLog: [],   //backlog of tweets to be displayed
            pictureTweetBacklog: [],    //backlog of tweets to be displayed
            backuppictureTweets: [],    //backlog of tweets to be displayed
            replaceQueue: [0, 2, 1, 3],
        };
    }

    checkForNewTweets() {
            window.tweets = this.addTweetsToAppropriateBackLogs(window.tweets);
    }

    addTweetsToAppropriateBackLogs(tweetList) {
        if (tweetList && tweetList.length > 0) {
            console.log();
            let oldBackLog = this.state.tweetBackLog.slice();
            let oldPictureBackLog = this.state.pictureTweetBacklog.slice();
            let newBackLog = [];
            let newPictureBackLog = [];

            tweetList.map((tweet) => {
                this.isPictureTweet(tweet) ? newPictureBackLog.push(tweet) : newBackLog.push(tweet);
                return tweet;
            });

            newBackLog = oldBackLog.concat(newBackLog);
            newPictureBackLog = oldPictureBackLog.concat(newPictureBackLog);
            while(newBackLog.length > this.state.maxListSize) {
                newBackLog.shift();
            }
            while(newPictureBackLog.length > this.state.maxListSize) {
                newPictureBackLog.shift();
            }

            this.setState({
                pictureTweetBacklog: newPictureBackLog,
                tweetBackLog: newBackLog
            });
        }
        return [];
    }


    isPictureTweet(tweet) { // belongs in Util class?
        if (tweet.extended_tweet && tweet.extended_tweet.extended_entities && tweet.extended_tweet.extended_entities.media) {
            return true;
        }
        return !!(tweet.extended_entities && tweet.extended_entities.media);
    }

    getTweetElementsForLeftColumn() {
        let tweetElements = [];
        for (let i = 0; i < this.state.tweets.length - 1; i++) {
            let key = 'tweetKey' + i;
            tweetElements.push(
                <Tweet leftColumn={true} key={key} tweet={this.state.tweets[i]}/>
            )
        }
        return tweetElements;
    }

    handleTweetBackup(tweet, backupList){
        backupList.push(tweet);
        while(backupList.length > this.state.maxListSize) {
            backupList.shift();
        }
    }

    showNewTweet() {
        let backLog = this.state.tweetBackLog.slice();
        let backupTweets = this.state.backupTweets.slice();
        let gotFreshTweet = backLog.length > 0;

        if (!gotFreshTweet && backupTweets.length === 0) return;

        let tweets = this.state.tweets.slice();
        let replaceQueue = this.state.replaceQueue.slice();
        let newTweet = gotFreshTweet ? backLog.shift() : backupTweets.shift();
        let oldTweet = tweets[replaceQueue[0]];
        if (oldTweet) { this.handleTweetBackup(oldTweet, backupTweets) }
        tweets[replaceQueue[0]] = newTweet;
        replaceQueue.push(replaceQueue.shift());

        this.setState({
            backupTweets: backupTweets,
            tweetBackLog: backLog,
            tweets: tweets,
            replaceQueue: replaceQueue,
        });
    }

    showNewPictureTweet() {
        let backLog = this.state.pictureTweetBacklog.slice();
        let backupTweets = this.state.backuppictureTweets.slice();
        let gotFreshTweet = backLog.length > 0;

        if (!gotFreshTweet && backupTweets.length === 0) { return; }
        let newTweet = gotFreshTweet ? backLog.shift() : backupTweets.shift();
        let oldTweet = this.state.pictureTweet;
        if (oldTweet) { this.handleTweetBackup(oldTweet, backupTweets) }
        this.setState({
            backuppictureTweets: backupTweets,
            pictureTweetBacklog: backLog,
            pictureTweet: newTweet,
        });
    }

    render() {
        let leftColumnTweets = this.getTweetElementsForLeftColumn();
        return (
            <div className="flexContainer">
                <ReactInterval timeout={1000} enabled={true} callback={() => this.checkForNewTweets()}/>
                <ReactInterval timeout={this.state.normalTweetUpdateInterval * 1000} enabled={true} callback={() => this.showNewTweet()}/>
                <ReactInterval timeout={this.state.pictureTweetUpdateInterval * 1000} enabled={true} callback={() => this.showNewPictureTweet()}/>
                    <div className="flexCol">
                        <div className="flexColCon">
                            <div className="grid-container">
                                {leftColumnTweets}
                            </div>
                        </div>
                    </div>
                    <div className="flexCol">
                        <div className="flexColCon">
                            <div className="grid-container">
                                <PictureTweet tweet={this.state.pictureTweet}></PictureTweet>
                                <Tweet key='tweet4' tweet={this.state.tweets[this.state.tweets.length - 1]}/>
                            </div>
                        </div>
                    </div>
                    <div className="flexCol">
                        <div className="flexColCon">
                            <div className="infoSideBar">
                                <EventScheduleDisplay></EventScheduleDisplay>
                            </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TweetController;