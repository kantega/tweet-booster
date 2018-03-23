import React from "react";
import SubEvent from "./subEvent";

class MultiTrackEvent extends React.Component {

    assureTwoDigitString(number) {
        let numberString = '' + number;
        return (numberString.length > 1) ? numberString : '0' + numberString;
    }

    render() {
        let lightning = this.props.event.type === 'lightning';
        let talks = this.props.event.talks;

        let keys = Object.keys(talks);
        let subEvents = [];

        let headerString = this.props.header;

        let timeString = this.props.startTime + ' - ' + this.props.endTime;

        for (let i = 0; i < keys.length; i++){
            let loc = keys[i];
            subEvents.push(<SubEvent location={loc} talk={talks[loc]} lightning={lightning} key={loc}/>);
        }

        return (
            <div className={'multiTrackEvent event'}>
            <h2><span className="headerSpan">{headerString}</span><span className="eventTimeSpan">{timeString}</span></h2>
                {subEvents}
            </div>
        )
    }
}
export default MultiTrackEvent;




