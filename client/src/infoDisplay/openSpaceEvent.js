import React from "react";
import {getEventDate, getTimeFromDate} from "./../TimeUtil"

class OpenSpaceEvent extends React.Component {

    render() {

        let location = this.props.event.type.split(" ")[0];

        let event = this.props.event;
        let eventOpen1 = this.props.eventOpen1;
        let eventOpen2 = this.props.eventOpen2;

        let eventStart = getTimeFromDate(getEventDate(event.start_time, event.day));
        let eventEnd   = getTimeFromDate(getEventDate(eventOpen2.end_time, event.day));
        let timeString = eventStart + " - " + eventEnd;


        return (

            <div className={'openSpaceEvent event'}>
                <h2><span className="headerSpan">Open Spaces</span><span className="eventTimeSpan">{timeString}</span></h2>
                <h3>{location}</h3>
                <div className="openSpaceContent">

                    <p className="openSpaceSubEvent event">
                        <span className="fl">
                            Introduction:
                        </span>
                        <span className="fr">

                        {getTimeFromDate(getEventDate(event.start_time, event.day))} -
                            {getTimeFromDate(getEventDate(event.end_time, event.day))}
                        </span>
                    </p>
                    <p className="openSpaceSubEvent event">
                        <span className="fl">
                            Open Spaces 1:
                    </span>
                        <span className="fr">

                        {getTimeFromDate(getEventDate(eventOpen1.start_time, eventOpen1.day))} -
                            {getTimeFromDate(getEventDate(eventOpen1.end_time, eventOpen1.day))}
                        </span>
                        </p>
                    <p className="openSpaceSubEvent event">
                        <span className="fl">
                            Open Spaces 2:
                        </span>
                        <span className="fr">
                        {getTimeFromDate(getEventDate(eventOpen2.start_time, eventOpen2.day))} -
                            {getTimeFromDate(getEventDate(eventOpen2.end_time, eventOpen2.day))}
                        </span>
                        </p>
                </div>
            </div>

        );
    }
}

export default OpenSpaceEvent;