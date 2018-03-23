import React from "react";
import MultiTrackEvent from "./infoDisplay/multiTrackEvent";
import OpenSpaceEvent from "./infoDisplay/openSpaceEvent";
import SingleEvent from "./infoDisplay/singleEvent";
import {getEventDate, getTimeFromDate} from "./TimeUtil";

class EventScheduleDisplay extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            endpoint: '/program',
            schedule: [],
            events_queue: [],
            clock: "",
            day: 0,
            date: new Date(),
            current_event: "",
            next_event: "",
            check_schedule_interval: null,
            update_schedule_display_interval: null,
            timer: null,
        }

    }

    componentDidMount() {

        this.loadSchedule();

        // this.clockSetup();
        this.testClockSetup(); // use this for testing

        this.scheduleIntervalSetup();

        this.updateScheduleDisplay();

    }

    componentWillUnmount() {

        this.clearInterval(this.state.timer);
        this.clearInterval(this.state.check_schedule_interval);
        this.clearInterval(this.state.update_schedule_display_interval);

    }

    updateScheduleDisplay() {
        let updateInterval = setInterval(() => this.checkScheduleDisplay(), 1000);
        this.setState({update_schedule_display_interval: updateInterval});
    }


    scheduleIntervalSetup() {
        let scheduleInterval = setInterval(this.loadSchedule, 10000);
        this.setState({check_schedule_interval: scheduleInterval});
    }

    loadSchedule = () => {

        let events_queueBuffer = [];

        fetch(this.state.endpoint).then(function(response) {
            return response.json();
        }).then((obj_json) => {

            for (let event of Object.values(obj_json)) {
                events_queueBuffer.push(event);
            }
            this.setState({
                schedule: obj_json,
                events_queue: events_queueBuffer
            });
            return obj_json;
        });
    }

    /* -------- CLOCK --------  */

    testClockSetup() {


        let d = new Date('March 14, 2018 08:00:00'); // before the beginning
        // let d = new Date('March 14, 2018 08:45:00'); // opening keynote
        // let d = new Date('March 14, 2018 10:52:00'); // lightning
        // let d = new Date('March 15, 2018 01:45:00'); // night before second day
        // let d = new Date('March 15, 2018 09:45:00'); // workshop
        // let d = new Date('March 15, 2018 13:15:00'); // open spaces
        // let d = new Date('March 15, 2018 16:00:00'); // short talk
        // let d = new Date('March 16, 2018 16:00:00'); // before the end
        // let d = new Date('March 17, 2018 08:00:00'); // after end times

        this.setState({
            date:  d,
            clock: getTimeFromDate(d),
            day:   d.getDay()
        });


        let timer = setInterval(() => this.testClock(), 1000); // TODO: for testing

        this.setState({
            timer: timer
        });
    }

    testClock() {

        // console.log("tick");

        let updatedDate = new Date(this.state.date);
        updatedDate.setMinutes(updatedDate.getMinutes() + 1);
        // updatedDate.setSeconds(updatedDate.getSeconds() + 60);

        this.updateDateState(updatedDate);
    }

    clockSetup() {
        this.updateClock();

        let timer = setInterval(this.updateClock, 1000);
        this.setState({
            timer: timer
        });
    }

    updateClock() {
        let d = new Date();
        this.updateDateState(d);
    }

    updateDateState(date) {
        this.setState({
            date:  date,
            clock: getTimeFromDate(date),
            day:   date.getDay()
        });
    }

    /* -------- EVENTS -------- */

    getCurrentEvent() {
        return this.state.current_event;
    }

    getNextEvent() {
        return this.state.next_event;
    }

    checkScheduleDisplay() {

        let eventIndex = this.findCurrentEventIndex();

        // event was found at this time
        if (eventIndex >= 0) {
            this.updateCurrentNextEvent(eventIndex);
        }
        // event was not found at this time
        else {
            this.checkConferenceStartedEnded();
        }

    }

    findCurrentEventIndex() {
        let eventIndex = -1;

        for (let i = 0; i < this.state.events_queue.length; i++) {
            if (this.isCurrentEvent(i)) {
                eventIndex = i;
            }
        }

        return eventIndex;
    }

    isCurrentEvent(index) {
        let event = this.state.events_queue[index];
        let eventStartDate = getEventDate(event.start_time, event.day);
        let eventEndDate   = getEventDate(event.end_time, event.day);

        return (eventStartDate.getTime() <= this.state.date.getTime() &&
                  eventEndDate.getTime()  > this.state.date.getTime());
    }

    updateCurrentNextEvent(index) {

        let newStateObject = {
            current_event: this.defineEventHTML(index),
            next_event:    this.defineEventHTML(index + 1, true)
        };

        if (index === this.state.events_queue.length - 1) {
            newStateObject.next_event = this.defineEndNextHTML();
        }

        this.setState(newStateObject);

    }

    checkConferenceStartedEnded() {
        let firstEvent = this.state.events_queue[0];
        let  lastEvent = this.state.events_queue[this.state.events_queue.length - 1];
        let conferenceStartDate = getEventDate(firstEvent.start_time, firstEvent.day);
        let conferenceEndDate   = getEventDate(lastEvent.end_time, lastEvent.day);

        let newStateObject = {
            current_event: "",
            next_event:    ""
        };

        // conference not started yet
        if (conferenceStartDate.getTime() > this.state.date.getTime()) {
            newStateObject.current_event = this.defineStartHTML();
            newStateObject.next_event    = this.defineEventHTML(0, true);

            // conference ended
        } else if (conferenceEndDate.getTime() < this.state.date.getTime()) {
            newStateObject.current_event = this.defineEndHTML();
            newStateObject.next_event    = this.defineEndNextHTML();

            // conference between events
        } else {
            let relativeIndex = this.findRelativeIndex();
            newStateObject.current_event = this.defineNothingHappeningHTML();
            newStateObject.next_event = this.defineEventHTML(relativeIndex + 1, true);
        }

        this.setState(newStateObject);
    }

    findRelativeIndex() {

        let index = -1;

        for (let i = 0; i < this.state.events_queue.length - 1; i++) {
            if (this.isNowBetweenEvents(this.state.events_queue[i], this.state.events_queue[i + 1])) {
                return i;
            }
        }
        return index;
    }

    isNowBetweenEvents(eventBefore, eventAfter) {

        let dateBefore = getEventDate(eventBefore.end_time, eventBefore.day);
        let dateAfter  = getEventDate(eventAfter.start_time, eventAfter.day);

        return (dateBefore.getTime() < this.state.date.getTime() && dateAfter.getTime() > this.state.date.getTime());

    }

    /* -------- DEFINE HTML -------- */

    defineStartHTML() {
        return (<div className="event eventFlex">
            <p>Welcome to Booster 2018!</p>
            <p>Registration between 08:00 and 09:00 at the reception area.
                Followed by a short opening speech from the organizers before the opening keynote.</p>

        </div>);
    }

    defineNothingHappeningHTML() {
        return (<div className="event eventFlex">
            <p>Nothing is happening right now.</p>

        </div>);
    }

    defineEndHTML() {
        return (<div className="event eventFlex">
            <br/><br/>
            <b>Booster 2018 has ended!</b>
        </div>);
    }

    defineEndNextHTML() {
        return (<div className="event eventFlex">
            <br/><br/>
            <b>See you at Booster 2019!</b>
        </div>)
    }

    getMultiTrackEvent(event, eventType){
        return <MultiTrackEvent startTime={getTimeFromDate(getEventDate(event.start_time, event.day))}
                                endTime={getTimeFromDate(getEventDate(event.end_time, event.day))}
                                event={event} header={eventType}/>;
    }

    defineEventHTML(index, isNextEvent = false) {
        let event = this.state.events_queue[index];

        if (event == null) {
            return (<div>NO EVENT</div>);
        }

        let eventType = "";

        switch (event.type) {
            case "lightning" :
                eventType = "Lightning Talks";
                return this.getMultiTrackEvent(event, eventType);

            case "keynote" :
                eventType = "Keynote Talk";
                return <SingleEvent event={event} header={eventType}/>;

            case "Coffee Break" :
                eventType = "Coffee Break";
                return <SingleEvent event={event} header={eventType}/>;

            case "Lunch" :
                eventType = "Lunch";
                return <SingleEvent event={event} header={eventType}/>;

            case "workshop" :
                eventType = "Workshops";
                return this.getMultiTrackEvent(event, eventType);

            case "Conference dinner - Galleri Nygaten" :
                eventType = "Conference Dinner";
                break;

            case "Dragefjellet - Introduction to open spaces" :
                eventType = "Open Spaces";
                let eventOpen1 = this.state.events_queue[index + 1];
                let eventOpen2 = this.state.events_queue[index + 2];
                return <OpenSpaceEvent event={event} eventOpen1={eventOpen1} eventOpen2={eventOpen2} header={eventType}/>;

            case "Dragefjellet and more - Open spaces 1" :
                if (isNextEvent) {
                    return this.defineEventHTML(index + 2, true);
                } else {
                    return this.defineEventHTML(index - 1, false);
                }

            case "Dragefjellet and more - Open spaces 2" :
                if (isNextEvent) {
                    return this.defineEventHTML(index + 1, true);
                } else {
                    return this.defineEventHTML(index - 2, false);
                }

            case "short_talk" :
                eventType = "Short Talks";
                return this.getMultiTrackEvent(event, eventType);

            case "Speakers dinner - Nøsteboden" :
                eventType = "Speakers Dinner";
                return <SingleEvent event={event} header={eventType}/>;

            default:
                eventType = "Booster 2018";
                return <SingleEvent event={event} header={eventType}/>;
        }


        let eventStartDate = getEventDate(event.start_time, event.day);
        let eventEndDate   = getEventDate(event.end_time, event.day);
        let eventStartTime = getTimeFromDate(eventStartDate);
        let eventEndTime   = getTimeFromDate(eventEndDate);

        let eventTalks = (event.talks != null ? event.talks : [""]);
        let eventLocations = Object.keys(eventTalks);


        let eventList = this.getEventListHTML(eventTalks, eventLocations);

        return (
            <div>
                <h2 className="headerSpan">
                <span className="headerSpan">
                    {eventType}
                </span>
                    <span className="eventTimeSpan">
                    {eventStartTime} - {eventEndTime}
                </span>
                </h2>
                {eventList}
            </div>
        );
    }

    getEventListHTML(eventTalks, eventLocations) {

        if (eventLocations == null || eventLocations.length === 0 || eventLocations[0] === "0") {
            return "";
        }
        let htmlArray = [];

        for (let i = 0; i < eventLocations.length; i++) {

            htmlArray.push(
                <div>
                    <br/>
                    <b>Title: </b> {eventTalks[eventLocations[i]].title} <br/>
                    <b>Location: </b> {eventLocations[i]} <br/>
                </div>
            );

            if (eventTalks[eventLocations[i]].speaker !== "") {
                htmlArray.push(
                    <div>
                        <b>Speaker: </b> {eventTalks[eventLocations[i]].speaker} <br/>
                    </div>
                );
            }
        }

        return (<div> {htmlArray} </div>);
    }

    /* -------- RENDER -------- */

    render() {

        return (
            <div>
                <img src="/booster_logo.svg" className="boosterLogo" alt="boosterLogo"/>
                <div className="clockAndHashtags">
                    <div id="clock">
                        {this.state.clock}
                    </div>
                    <div id="hashtags">
                        <p>
                            #booster2018
                        </p>
                        <p>
                            @boosterconf
                        </p>
                        <p>
                            boosterconf.no
                        </p>

                    </div>
                </div>

                <div id="currentEvent">
                    <div id="currentText">Now</div>
                    {this.getCurrentEvent()}
                </div>

                <div id="nextEvent">
                    <div id="nextText">Up next</div>
                    {this.getNextEvent()}
                </div>
            </div>
        );
    }
}

export default EventScheduleDisplay;
