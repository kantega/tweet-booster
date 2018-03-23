import React from "react";
import {getEventDate, getTimeFromDate} from "./../TimeUtil"

class SingleEvent extends React.Component {

    render() {

        let event = this.props.event;

        let location = "";
        let titleString = "";
        let speakerString = "";

        if (event.talks != null) {
            location = Object.keys(event.talks)[0];

            titleString = event.talks[location].title;
            speakerString = event.talks[location].speaker;
        }


        let eventStart = getTimeFromDate(getEventDate(event.start_time, event.day));
        let eventEnd   = getTimeFromDate(getEventDate(event.end_time, event.day));
        let timeString = eventStart + " - " + eventEnd;


        return (

            <div className="singleEvent event">
                <h2><span className="headerSpan">{this.props.header}</span><span className="eventTimeSpan">{timeString}</span></h2>
                <div className="singleEvent clearfix">

                    <p className="locationPara">{location}</p>
                    <p className="speakerPara">{speakerString}</p>
                </div>
                <p className="titlePara">{titleString}</p>


            </div>

        );
    }
}

export default SingleEvent;