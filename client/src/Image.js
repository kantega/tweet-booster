import React from "react";

class Image extends React.Component {
    render() {
        const style = {
            backgroundImage: this.props.src
        };
        return (
            <div className='tweetimg' style={style}/>
        )
    }
}

export default Image;