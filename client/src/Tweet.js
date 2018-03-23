import React from "react";
import { formatDateString } from "./TimeUtil"

class Tweet extends React.Component {

    render() {
        let tweet = this.props.tweet;
        let classString = this.props.leftColumn ? 'leftColumn ' : 'rightTweet ';
        if (!tweet) return <div className={classString + "tweetPlaceholder"}> </div>

        // console.log(tweet);

        let userIconUrl = tweet.user.profile_image_url_https.replace('normal', 'bigger');
        let userName = tweet.user.name;
        let userHandle = '@' + tweet.user.screen_name;
        let tweetText = tweet.text;
        let timestamp = formatDateString(tweet.created_at);


        let likes = tweet.favorite_count;
        let retweets = tweet.retweet_count;

        return (
            <div className={classString + "tweet animate"}>
                <div className="tweetBody">
                    <div className="userBox">
                        <img  className="userIcon" src={userIconUrl} alt=""/>
                        <div className="twitterLogo" />
                        <div className="userName">{userName}</div>
                        <div className="userHandle">{userHandle}</div>
                    </div>
                    <div className="tweetText">{tweetText}</div>
                    <div className="timeStamp">{timestamp}</div>
                    <div className="likesAndRetweets">
                        <div className="likeIcon fl"/>
                        <div className="likes fl"> {likes}</div>
                        <div className="talkingIcon fl"/>
                        <div className="retweets fl"> {retweets} people are talking about this</div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Tweet;




