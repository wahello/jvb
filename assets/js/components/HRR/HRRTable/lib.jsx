import React from 'react';
import moment from 'moment';

export const SELECT_FIELD = "SELECT_FIELD";
export const TIME_FIELD = "TIME_FIELD";
export const DURATION_FIELD = "DURATION_FIELD";

export const convertSecToString = (duration) => {
	let time = "";
	if(duration !== null && !isNaN(duration)){
		let min = parseInt(duration/60);
		let sec = (duration % 60);
		if(sec < 10){
			time = min + ":0" + sec;
		}
		else{
			time = min + ":" + sec;
		}
	}
	return time;
}

export const renderTimestampToString = (utcTimeStamp) => {
	let timeString = "";
	let timestring1 = "";
	if(utcTimeStamp != null && !isNaN(utcTimeStamp)){
		// moment by default render utc timestamp it in local time
		timestring1 =moment.unix(utcTimeStamp);
		timeString = moment.parseZone(timestring1).format("hh:mm:ss a");
	}
	return timeString;
}

export const createSelectOptions = (options) => {
	options = [{label:"Select", value:""}, ...options];
	options = options.map(
		option => <option value={option.value}> {option.label} </option>
	);
	return options;
}

export const createDurationOptions = (start_num , end_num, zeroPaddedMins=false, step=1) => {
	let elements = [<option key={"select"} value={""}>{"Select"}</option>];
	let i = start_num;
	while(i<=end_num){
		let j = (zeroPaddedMins && i < 10) ? "0"+i : i;
		elements.push(<option key={j} value={j}>{j}</option>);
		i=i+step;
	}
	return elements;
}

export const getDTMomentObj = (date,hour,min,sec,meridian) => {
	let day = date.date()
	let month = date.month()
	let year = date.year()
	hour = hour ? parseInt(hour) : 0;
	min = min ? parseInt(min) : 0;
	sec = sec ? parseInt(sec): 0;
	if(meridian == 'am' && hour && hour == 12){
		hour = 0
	}
	if (meridian == 'pm' && hour && hour != 12){
		hour = hour + 12;
	}

	let dt = moment({
		year: year,
		month: month,
		day: day,
		hour :hour,
		minute :min,
		second :sec,
		millisecond:0
	});
	return dt;
}

export const getCurrentOffset = () => {
	let timezone = moment.tz.guess();
    let tzOffsetFromUTCInSeconds = (moment.tz(moment.utc(),timezone).utcOffset())*60;
    return tzOffsetFromUTCInSeconds;
}

export const captilize = (value) => {
	let cpatilized;
	if(value){
		cpatilized = value[0].toUpperCase()+value.slice(1);
	}
	return cpatilized;
}