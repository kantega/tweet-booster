import React from "react";
import Tweet from "./Tweet"

class PictureTweet extends React.Component {

    render() {
        let tweet = this.props.tweet;
        if (!tweet) return <div className="pictureTweetPlaceholder pictureTweetSize"> </div>

        let style = {};
        if (this.props.tweet.extended_tweet && this.props.tweet.extended_tweet.extended_entities && this.props.tweet.extended_tweet.extended_entities.media) {
            let pic = this.props.tweet.extended_tweet.extended_entities.media[0];
            style = {
                backgroundImage: 'url(' + pic.media_url + ')',
            };
        } else if (tweet.extended_entities && tweet.extended_entities.media) {
            let pic = this.props.tweet.extended_entities.media[0];
            style = {
                backgroundImage: 'url(' + pic.media_url_https + ')',
            };
        } else {return;}
        let image = <div className='tweetimg' style={style}/>;


        return (
            <div className="pictureTweet pictureTweetSize animatef">
                    {image}
                <Tweet tweet={this.props.tweet}></Tweet>
            </div>
        )
    }
}
export default PictureTweet;







