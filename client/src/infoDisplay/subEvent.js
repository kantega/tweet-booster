import React from "react";

class SubEvent extends React.Component {

    render() {

        if (this.props.lightning) {
            return(
                <div >
                    <p>{this.props.location}</p>
                </div>);
        }

        return (
            <div className="subEvent">
                <div className="subEventHeader clearfix">
                    <p className="locationPara">{this.props.location}</p>
                    <p className="speakerPara">{this.props.talk.speaker}</p>
                </div>
                <p className="titlePara">{this.props.talk.title}</p>
            </div>
        )
    }
}
export default SubEvent;


