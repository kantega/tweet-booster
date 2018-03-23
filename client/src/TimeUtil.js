export function getEventDate(eventTime, eventDay) {
    let eventDate = new Date(eventTime);

    let dateArray = eventDay.split("-");
    eventDate.setFullYear(dateArray[0]);
    eventDate.setMonth(parseInt(dateArray[1], 10) - 1);
    eventDate.setDate(dateArray[2]);
    eventDate.setHours(eventDate.getHours() - 1);  // timezone correction

    if (eventDate.getHours() === 0) {
        eventDate.setDate(eventDate.getDate() + 1); // midnight correction
    }

    return eventDate;
}

export function getTimeFromDate(date) {
    let time = date.toLocaleTimeString("en-GB");
    time = time.split(":")[0] + ":" + time.split(":")[1];
    return (time);
}

export function formatDateString(dateStringToFormat) {
    let dObj = new Date(dateStringToFormat);
    return assureTwoDigitString(dObj.getDate()) + "." +
        assureTwoDigitString(dObj.getMonth()+1) + " - " +
        assureTwoDigitString(dObj.getHours()) + ":" +
        assureTwoDigitString(dObj.getMinutes()) + ":" +
        assureTwoDigitString(dObj.getSeconds());
}
function assureTwoDigitString(number) {
    let numberString = '' + number;
    return (numberString.length > 1) ? numberString : '0' + numberString;
}
