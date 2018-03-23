import React from 'react';
import TweetController from "./tweetController";

class App extends React.Component {
    render() {
        return (
            <div className='App'>
                <div className='ui container'>
                    <TweetController></TweetController>
                </div>
            </div>
        );
    }
}

export default App;
