import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';
import FontAwesome from "react-fontawesome";
import { Collapse, Navbar, NavbarToggler, 
         NavbarBrand, Nav, NavItem, NavLink,
        Button,Popover,PopoverBody,Form,FormGroup,FormText,Label,Input} from 'reactstrap';
import NavbarMenu from './navbar';
import fetchWeeklyWorkoutData from '../network/weekly_workout';
import {renderWeeklySummaryOverlay} from './dashboard_healpers';

axiosRetry(axios, { retries: 3});
var CalendarWidget = require('react-calendar-widget');
var ReactDOM = require('react-dom');

class WorkoutDashboard extends Component{
	constructor(props) {
    super(props);
	    this.state = {
	    	calendarOpen:false,
	    	fetching_weekly:false,
		   	selectedDate:new Date(),
		   	weekly_data:{},
		   	avg_dist_desc:" "
	    }
	    this.toggleCalendar = this.toggleCalendar.bind(this);
	    this.renderAddDate = this.renderAddDate.bind(this);
		this.renderRemoveDate = this.renderRemoveDate.bind(this);
		this.toggleCalendar = this.toggleCalendar.bind(this);
		this.successWeeklyWorkoutData = this.successWeeklyWorkoutData.bind(this);
		this.errorWeeklyWorkoutData = this.errorWeeklyWorkoutData.bind(this);
		this.processDate = this.processDate.bind(this);
		this.renderTable = this.renderTable.bind(this);
		this.gpascoreDecimal = this.gpascoreDecimal.bind(this);
		this.renderTime = this.renderTime.bind(this);
		this.renderLastSunday = this.renderLastSunday.bind(this);
		this.renderWeeklySummaryOverlay = renderWeeklySummaryOverlay.bind(this);
		this.renderTableActivityHeader = this.renderTableActivityHeader.bind(this);
		this.renderTableActivityHeaderDescription = this.renderTableActivityHeaderDescription.bind(this);
		this.renderMetersToYards = this.renderMetersToYards.bind(this);
		this.renderMetersToMiles = this.renderMetersToMiles.bind(this);
	}
	successWeeklyWorkoutData(data){
		this.setState({
			weekly_data:data.data,
			fetching_weekly:false,
		});
  	}
  	errorWeeklyWorkoutData(error){
		console.log(error.message);
		this.setState({
			fetching_weekly:false,
		});
		
  	}
  	renderMetersToYards(value){
  		return parseFloat(value * 1.09361).toFixed(2);
  	}
  	renderMetersToMiles(value){
  		return parseFloat(value*0.000621371).toFixed(2);
  	}
	renderAddDate(){
		/*It is forward arrow button for the calender getting the next day date*/
		var today = this.state.selectedDate;
		var tomorrow = moment(today).add(7, 'days');
		this.setState({
			selectedDate:tomorrow.toDate(),
			fetching_weekly:true,
		},()=>{
			fetchWeeklyWorkoutData(this.successWeeklyWorkoutData,this.errorWeeklyWorkoutData,this.state.selectedDate);
		});
	}
	renderTableActivityHeader(header_data){
		let td_header = [];
		let ind = 1;
		if(header_data){
			for(let key of header_data){
				let patt = /_distance/i;
				let pattern = new RegExp(patt);
				let res = pattern.exec(key);
				let sliceIndex = res.index;
				let activity_name = key.slice(0,sliceIndex).split("_");
				activity_name.forEach((x,i,arr) => {
					arr[i] = x[0].toUpperCase()+x.slice(1);
				})
				activity_name = activity_name.join(" ")
				if(activity_name.toLowerCase().search("swimming") >= 0){
					key = " (In Yards)";
				}else{
					key = " (In Miles)";
				}
 				td_header.push(<th>{"AD"}{ind}<br />{key}</th>);
 				ind++;
			}
		}
		return td_header;
	}

	renderTableActivityHeaderDescription(header_data){
		let th_header_desc = [];
		let th_row = [];
		let ind = 1;
		if(header_data){
			for(let key of header_data){
				let patt = /_distance/i;
				let pattern = new RegExp(patt);
				let res = pattern.exec(key);
				let sliceIndex = res.index;
				let activity_name = key.slice(0,sliceIndex).split("_");
				activity_name.forEach((x,i,arr) => {
					arr[i] = x[0].toUpperCase()+x.slice(1);
				})
				activity_name = activity_name.join(" ")
 				th_header_desc.push(<span>&nbsp;&nbsp;<b className="boldText">{"AD"}{ind}{": "}</b>{"Avg "}{activity_name}{" Distance "}</span>);
 				ind++;
			}
		}

		return th_header_desc;
	}
	renderRemoveDate(){
		/*It is backward arrow button for the calender getting the last day date*/
		var today = this.state.selectedDate;
		var tomorrow = moment(today).subtract(7, 'days');
		this.setState({
			selectedDate:tomorrow.toDate(),
			fetching_weekly:true,
		},()=>{
			fetchWeeklyWorkoutData(this.successWeeklyWorkoutData,this.errorWeeklyWorkoutData,this.state.selectedDate);
		});
	}
	renderLastSunday(d){
		let date;
		let diff;
  		var day = d.getDay();
  		if(day == 0){
  			diff = d.getDate() - day + (day == 0 ? -7:0);
  			date = moment(new Date(d.setDate(diff))).format('MMM DD, YYYY');
  		}
  		else{
	      	diff = d.getDate() - day + (day == 0 ? -6:0); // adjust when day is sunday
	      	date = moment(new Date(d.setDate(diff))).format('MMM DD, YYYY');
      	}
  		return date;
	}
	toggleCalendar(){
		//Toggle of calander icon.
	    this.setState({
	      calendarOpen:!this.state.calendarOpen
	    });
    }
     processDate(selectedDate){
		this.setState({
			selectedDate:selectedDate,
			calendarOpen:!this.state.calendarOpen,
			fetching_weekly:true,
		},()=>{
			fetchWeeklyWorkoutData(this.successWeeklyWorkoutData,this.errorWeeklyWorkoutData,this.state.selectedDate);
		});
	}
	componentDidMount(){
		this.setState({
			fetching_weekly:true,
		});
		fetchWeeklyWorkoutData(this.successWeeklyWorkoutData,this.errorWeeklyWorkoutData,this.state.selectedDate);
	}
	componentDidMount(){
		this.setState({
			fetching_weekly:true,
		});
		fetchWeeklyWorkoutData(this.successWeeklyWorkoutData,this.errorWeeklyWorkoutData,this.state.selectedDate);
	}
	gpascoreDecimal(gpa){
		let value;
		let x = gpa;
		if( x !=  null && x != undefined){
		    value =Math.floor(parseFloat(x).toFixed(2)) + "%";
		 }
		 else{
		  value = "";
		 }
		return value;
	}
	renderTime(value){
		// This function will devide the seconds to hh:mm:ss format.
		var time;
		if(value){
			if(value>0){
				var sec_num = parseInt(value); 
			    var hours   = Math.floor(sec_num / 3600);
			    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
			    var seconds = sec_num - (hours * 3600) - (minutes * 60);

			    if (hours   < 10) {hours   = "0"+hours;}
			    if (minutes < 10) {minutes = "0"+minutes;}
			    if (seconds < 10) {seconds = "0"+seconds;}
			    time = hours+':'+minutes;
			}
		}
		else if(value == 0 || value == null){
			time = "00:00";
		}
		return time;
	}

/*============================================================================================*/
/***** CREATING MATRIX FOR Aerobic/Anaerobic Duration: (% of total time) TABLE DATA CELL*****/
aeroAnaerobicMatrix(value, td_keys, td_values){
	let duration_below_aerobic_range = "";
	let percent_below_aerobic  = "";
	let percent_aerobic  = "";
	let duration_in_aerobic_range  = "";
	let duration_hrr_not_recorded = "";
	let percent_hrr_not_recorded = "";
	let percent_anaerobic = "";
	let duration_in_anaerobic_range = "";
	let isUndefindValueFound = false;

	for(let dataKey of td_keys) {
		
		if((dataKey.indexOf("aerobic") >=0) || (dataKey == "duration_hrr_not_recorded") || (dataKey == "percent_hrr_not_recorded")) {
					let tempDuration = null;
					let tempPercentage = null;
					if(dataKey.indexOf("duration")>=0) {
						tempDuration = this.renderTime(value[dataKey]);
						if(value[dataKey] === null || value[dataKey] === undefined || value[dataKey] === "") {
							tempDuration = "-";
						}
						if(dataKey == "duration_below_aerobic_range") {
							duration_below_aerobic_range = tempDuration;
						} else if(dataKey == "duration_hrr_not_recorded") {
							duration_hrr_not_recorded = tempDuration;
						} else if(dataKey == "duration_in_anaerobic_range") {
							duration_in_anaerobic_range = tempDuration;
						} else {
							duration_in_aerobic_range = tempDuration;
						}
					} else {
						tempPercentage = this.gpascoreDecimal(value[dataKey]);
						if(value[dataKey] === null || value[dataKey] === undefined || value[dataKey] === " ") {
							tempPercentage = "-";
						}
						if(dataKey == "percent_below_aerobic") {
							percent_below_aerobic = tempPercentage;
						} else if(dataKey == "percent_hrr_not_recorded") {
							percent_hrr_not_recorded = tempPercentage;
						} else if(dataKey == "percent_anaerobic") {
							percent_anaerobic = tempPercentage;
						} else {
							percent_aerobic = tempPercentage;
						}
					}
					if(duration_below_aerobic_range != "" &&
						percent_below_aerobic != "" &&
						percent_aerobic != "" &&
						duration_in_aerobic_range != "" &&
						duration_hrr_not_recorded != "" &&
						percent_hrr_not_recorded != "" &&
						percent_anaerobic != ""&&
						duration_in_anaerobic_range != "") {
							
						/*td_values.push(<div>
							<tr><td>{"Ae"}<br />{duration_in_aerobic_range + " (" + percent_aerobic + ")"}</td>
							<td>{"AN"}<br />{duration_in_anaerobic_range + " (" + percent_anaerobic + ")"}</td>
							</tr>
							<tr><td>{"BA"}<br />{duration_below_aerobic_range + " (" + percent_below_aerobic + ")"}</td>
							<td>{"NR"}<br />{duration_hrr_not_recorded + " (" + percent_hrr_not_recorded + ")"}</td>
							</tr>
							</div>);*/
							td_values.push(<div className="weeklyWorkoutTDMatrix">
							<tr><td>{duration_in_aerobic_range + " (" + percent_aerobic + ")"}</td>
							<td>{duration_in_anaerobic_range + " (" + percent_anaerobic + ")"}</td>
							</tr>
							<tr><td>{duration_below_aerobic_range + " (" + percent_below_aerobic + ")"}</td>
							<td>{duration_hrr_not_recorded + " (" + percent_hrr_not_recorded + ")"}</td>
							</tr>
							</div>);
					} 
		}
	}
	if(duration_below_aerobic_range == "" &&
				percent_below_aerobic == "" &&
				percent_aerobic == "" &&
				duration_in_aerobic_range == "" &&
				duration_hrr_not_recorded == "" &&
				percent_hrr_not_recorded == "" &&
				percent_anaerobic == ""&&
				duration_in_anaerobic_range == "" && !isUndefindValueFound) 
	{
		td_values.push(<td> {" - "} </td>);
	}
}

/*============================================================================================*/

/*************** CHECK FOR UNDEFINED VALUE IF KEY EXISTS IN td_keys **************/
/*************** RETURNS 'TRUE' IF VALUE IS UNDEFINED OR ELSE 'FALSE **************/
checkForUndefinedValue(value) {
	if(value === undefined || value === null || value === "") {
		return true;
	} else {
		return false;
	}
}
/*================================================================================*/
	renderTable(weekly_data){
		
		if (!_.isEmpty(weekly_data)){
			let tr_values = [];
			let td_totals = [];
			let td_extra = [];	
			
			let td_keys = ["workout_type","no_activity_in_week","duration","workout_duration_percent","duration_in_aerobic_range", "percent_aerobic", "duration_in_anaerobic_range", "percent_anaerobic", "duration_below_aerobic_range", "percent_below_aerobic", "duration_hrr_not_recorded", "percent_hrr_not_recorded","days_with_activity"];
			let mon = moment(this.state.selectedDate).weekday(-6).format('DD-MMM-YY');
			let tue = moment(this.state.selectedDate).weekday(-5).format('DD-MMM-YY');
			let wed = moment(this.state.selectedDate).weekday(-4).format('DD-MMM-YY');
			let thu = moment(this.state.selectedDate).weekday(-3).format('DD-MMM-YY');
			let fri = moment(this.state.selectedDate).weekday(-2).format('DD-MMM-YY');
			let sat = moment(this.state.selectedDate).weekday(-1).format('DD-MMM-YY');
			let sun = moment(this.state.selectedDate).weekday(0).format('DD-MMM-YY');
			td_keys = td_keys.concat(mon, tue, wed, thu, fri, sat, sun);

			let activity_distance_keys = Object.keys(weekly_data['Totals']).filter(x => (x.indexOf("_distance")>=0));
			td_keys = td_keys.concat(activity_distance_keys);
			
			let td_keys1 = ["no_activity","days_no_activity","no_activity_in_week","percent_days_no_activity"];
			for(let [key,value] of Object.entries(weekly_data)){
				
				console.log(key+ " and value = " +value);
				let flag = 0;
				let td_values = [];

				if(key != "extra" && key != "Totals"){
					let tempDate = Object.keys(value["dates"])
						.map(dt => moment(dt)).sort((a,b)=>a-b)
						.map(momentDate => momentDate.format("DD-MMM-YY"));
					let tempIndex = 0;
					let tempWorkoutType = null;
					let tempNoOfActivityInWeek = null;
					let tempDuration = null;
					let tempDurationInPercentage = null;

					for(let key1 of td_keys){
						if(key1== "workout_type" || key1 == "no_activity_in_week") {
							if(key1== "workout_type" && !this.checkForUndefinedValue(value[key1])) {
								tempWorkoutType = value[key1];
							} else if(key1 == "no_activity_in_week" ){
								if(this.checkForUndefinedValue(value[key1])) {
									tempNoOfActivityInWeek = "";
								} else{
									tempNoOfActivityInWeek = " (" + value[key1] + ")";
								}
							}
							if(tempWorkoutType != null && tempWorkoutType != undefined && tempNoOfActivityInWeek != null && tempNoOfActivityInWeek != undefined) {
									td_values.push(<td>{tempWorkoutType + tempNoOfActivityInWeek }</td>);
								}
							}
							else if((key1=="duration" && !this.checkForUndefinedValue(value[key1])) || (key1=="workout_duration_percent" && !this.checkForUndefinedValue(value[key1]))) {
								if(key1== "duration") {
									tempDuration = this.renderTime(value[key1]);
								} else if(key1 == "workout_duration_percent"){
								if(this.checkForUndefinedValue(value[key1])) {
									tempDurationInPercentage = "";
								} else{
									tempDurationInPercentage = " (" + this.gpascoreDecimal(value[key1]) + ")";
								}
							}
							if(tempDuration != null && tempDuration != undefined && tempDurationInPercentage != null && tempDurationInPercentage != undefined) {
									td_values.push(<td>{tempDuration} <br />{tempDurationInPercentage }</td>);
								}

							}
							else if(key1 == "duration_in_aerobic_range" || key1 == "duration_in_anaerobic_range" ||
							 key1 == "percent_aerobic" || key1 == "percent_anaerobic" || key1 == "duration_below_aerobic_range" ||
							  key1 == "percent_below_aerobic" || key1 == "percent_hrr_not_recorded" || key1 == "duration_hrr_not_recorded") {
								
								if(flag == 0) {
									this.aeroAnaerobicMatrix(value, td_keys, td_values);
									flag++;
								}
							}
							else if(key1 == "days_with_activity" && !this.checkForUndefinedValue(value[key1])) {
								td_values.push(<td>{value[key1]}</td>);
							}
							else if(tempDate[tempIndex] != null && tempDate[tempIndex] != "" && tempDate[tempIndex] != undefined && key1 === tempDate[tempIndex]) {
								let sortedDate = Object.keys(value["dates"]).map(dt => moment(dt)).sort((a,b)=>a-b)
								let tempDayDuration = "";
								let tempDayRepeated = "";
								let currentDate = sortedDate[tempIndex];
								let strDate = currentDate.format('DD-MMM-YY');
								let tmpData = value["dates"][strDate];
								for(let [finalDateKey,finalDateValue] of Object.entries(tmpData)){
									if(finalDateKey == "repeated") {
										tempDayRepeated = finalDateValue;
									} else if(finalDateKey == "duration") {
										tempDayDuration = this.renderTime(finalDateValue);
									}
								}
								td_values.push(<td>{tempDayDuration + " ("+tempDayRepeated+")"}</td>);
								tempIndex ++;
							}
							else if(activity_distance_keys.includes(key1) && !this.checkForUndefinedValue(value[key1])){
								if(key1 == "swimming_distance" || key1 == "lap_swimming_distance"){
									td_values.push(<td>{this.renderMetersToYards(value[key1].value)}</td>);
								}
								else{
									td_values.push(<td>{this.renderMetersToMiles(value[key1].value)}</td>);
								}
							}

							else {
								td_values.push(<td>{"-"}</td>);
							}
						}
						tr_values.push(<tr>{td_values}</tr>);
					}
					else if(key == "Totals"){
					
					let tempDate = Object.keys(value["dates"])
						.map(dt => moment(dt)).sort((a,b)=>a-b)
						.map(momentDate => momentDate.format("DD-MMM-YY"));
					let tempIndex = 0;
					let tempWorkoutType = null;
					let tempNoOfActivityInWeek = null;
					let tempDuration = null;
					let tempDurationInPercentage = null;

					for(let key1 of td_keys){
						
						if(key1== "workout_type" || key1 == "no_activity_in_week") {
							if(key1== "workout_type" && !this.checkForUndefinedValue(value[key1])) {
								tempWorkoutType = value[key1];
							} else if(key1 == "no_activity_in_week") {

								if(this.checkForUndefinedValue(value[key1])) {
									tempNoOfActivityInWeek = "";
								} else {
									tempNoOfActivityInWeek = + "(" + value[key1] + ")";
								}
							}
							if(tempWorkoutType != null && tempWorkoutType != undefined && tempNoOfActivityInWeek != null && tempNoOfActivityInWeek != undefined) {
								td_totals.push(<td>{tempWorkoutType + tempNoOfActivityInWeek}</td>);
							}
						}	
						else if((key1=="duration" && !this.checkForUndefinedValue(value[key1])) || (key1=="workout_duration_percent" && !this.checkForUndefinedValue(value[key1]))) {
								if(key1== "duration") {
									tempDuration = this.renderTime(value[key1]);
								} else if(key1 == "workout_duration_percent"){
								if(this.checkForUndefinedValue(value[key1])) {
									tempDurationInPercentage = "";
								} else{
									tempDurationInPercentage = " (" + this.gpascoreDecimal(value[key1]) + ")";
								}
							}
							if(tempDuration != null && tempDuration != undefined && tempDurationInPercentage != null && tempDurationInPercentage != undefined) {
									td_totals.push(<td>{tempDuration} <br />{tempDurationInPercentage }</td>);
								}

							}
						else if(key1 == "duration_in_aerobic_range" || key1 == "duration_in_anaerobic_range" ||
						 key1 == "percent_aerobic" || key1 == "percent_anaerobic" || key1 == "duration_below_aerobic_range" ||
						  key1 == "percent_below_aerobic" || key1 == "percent_hrr_not_recorded" || key1 == "duration_hrr_not_recorded") {
							
							if(flag == 0) {
								this.aeroAnaerobicMatrix(value, td_keys, td_totals);
								flag++;
							}
						}
						else if(key1 == "days_with_activity" && !this.checkForUndefinedValue(value[key1])) {
							td_totals.push(<td>{value[key1]}</td>);
						}
						else if(tempDate[tempIndex] != null && tempDate[tempIndex] != "" && tempDate[tempIndex] != undefined && key1 === tempDate[tempIndex]) {

							let sortedDate = Object.keys(value["dates"]).map(dt => moment(dt)).sort((a,b)=>a-b)
							let tempDayDuration = "";
							let tempDayRepeated = "";
							let currentDate = sortedDate[tempIndex];
							let strDate = currentDate.format('DD-MMM-YY');
							let tmpData = value["dates"][strDate];

							for(let [finalDateKey,finalDateValue] of Object.entries(tmpData)){
								if(finalDateKey == "repeated") {
									tempDayRepeated = finalDateValue;
								} else if(finalDateKey == "duration") {
									tempDayDuration = this.renderTime(finalDateValue);
								}
							}

							td_totals.push(<td>{tempDayDuration + " ("+tempDayRepeated+")"}</td>);
							tempIndex ++;
							
						}
						
						else if(activity_distance_keys.includes(key1) && !this.checkForUndefinedValue(value[key1])){
							if(key1 == "swimming_distance" || key1 == "lap_swimming_distance"){
								td_totals.push(<td>{this.renderMetersToYards(value[key1].value)}</td>);
							}
							else{
								td_totals.push(<td>{this.renderMetersToMiles(value[key1].value)}</td>);
							}
						}
						else {
							td_totals.push(<td>{"-"}</td>);
						}
					}
				}
				else{
					let tempNoActivity = null;
					let tempDaysNoActivity = null;
					let td_keys1 = ["no_activity","days_no_activity","percent_days_no_activity"];

					for(let key2 of td_keys1){
						if(key2 == "percent_days_no_activity"){
							td_extra.push(this.gpascoreDecimal(value[key2]));
						}
						else if(key2 == "no_activity" || key2 == "days_no_activity"){
							
							if(key2== "no_activity") {
								tempNoActivity = "No Activity";
							} else if(key2 == "days_no_activity") {
								
								if(this.checkForUndefinedValue(value[key2])) {
									tempDaysNoActivity = "";
								} else {
									tempDaysNoActivity = " (" + value[key2] + ")";
								}
							}
							
							if(tempNoActivity != null && tempNoActivity != undefined && tempDaysNoActivity != null && tempDaysNoActivity != undefined) {
								
								td_extra.push(tempNoActivity + tempDaysNoActivity);
							}
						} 
						else {
							td_extra.push(value[key2]);
						}
					}
				}
				//tr_values.push(<tr>{td_values}</tr>);
			}

			tr_values.push(<tr>{td_totals}</tr>);

			let td_valuesExtra = [];
			for(let extra of td_extra){
				td_valuesExtra.push(<td>{extra}</td>)
			}
			tr_values.push(<tr>{td_valuesExtra}</tr>);

			return [activity_distance_keys,tr_values];
		}
		return [null,null];
	}
	
	render(){
		let rendered_data = this.renderTable(this.state.weekly_data)
		let activities_keys = rendered_data[0];
		let rendered_rows = rendered_data[1];
		return(
				<div className = "container-fluid mnh-mobile-view">
					<NavbarMenu title = {<span style = {{fontSize:"18px"}}>
					Weekly Workout Summary Report
					</span>} />

					<div className = "cla_center" style = {{fontSize:"12px"}}>
						<span className = "col-md-4 col-sm-4">
							<span onClick = {this.renderRemoveDate} style = {{marginLeft:"30px",marginRight:"14px"}}>
								<FontAwesome
			                        name = "angle-left"
			                        size = "2x"
				                />
							</span> 
			            	<span id="navlink" onClick={this.toggleCalendar} id="gd_progress">
			                    <FontAwesome
			                        name = "calendar"
			                        size = "2x"
			                    />
			                    <span style = {{marginLeft:"20px",fontWeight:"bold",paddingTop:"7px"}}>{moment(this.state.selectedDate).format('MMM DD, YYYY')}</span>
			                   
		                	</span>
		                	<span onClick = {this.renderAddDate} style = {{marginLeft:"14px"}}>
								<FontAwesome
			                        name = "angle-right"
			                        size = "2x"
				                />
							</span> 
			            	<Popover
					            placement="bottom"
					            isOpen={this.state.calendarOpen}
					            target="gd_progress"
					            toggle={this.toggleCalendar}>
				                <PopoverBody className="calendar2">
				                <CalendarWidget  onDaySelect={this.processDate}/>
				                </PopoverBody>
			                </Popover>
	                	</span>
	                	<span className="col-md-8 col-sm-8" style = {{fontWeight:"bold"}}>Weekly Workout Summary Report For The Week Ended: <span style = {{textDecoration:"underline"}}>{this.renderLastSunday(new Date(this.state.selectedDate))}</span>
	                	</span>
		        	</div>

					 {/*<div className = "hr_table_padd" style = {{fontSize:"12px"}}>*/}
					 <div style = {{fontSize:"12px"}}>
							<div className = "table table-responsive">
								<div className="mnh-mobile-view" style = {{textAlign: "center"}}>
								<br />
						 			<b className = "boldText">AE:</b> Aerobic Duration (% of total time) &nbsp;&nbsp;
						 			<b className = "boldText">AN:</b> Anaerobic Duration (% of total time) &nbsp;&nbsp;
						 			<b className = "boldText">BA:</b> Below Aerobic (% of total time) &nbsp;&nbsp;
						 			<b className = "boldText">NR:</b> HR Not Recorded (% of total time &nbsp;&nbsp;)
						 			{this.renderTableActivityHeaderDescription(activities_keys)}
					 			</div>
				          	    <table className = "weeklyWorkoutTable table table-striped table-bordered">
									<tr>
										<th>Workout Type <br />(# Workouts)</th>
										<th>Total<br />Duration<br />(%)</th>
										{/*<th>% of Total <br /> Duration</th>*/}
										{/*<th>Aerobic/Anaerobic Duration: (% of total time)</th>*/}
										<th className="weeklyWorkoutTHMatrix">
											<tr>
												<td>
													AE
												</td>
												<td>
													AN
												</td>
											</tr>
											<tr>
												<td>
													BA
												</td>
												<td>
													NR
												</td>
											</tr>
										</th>
										<th># of Days<br />With<br />Activity</th>
										<th>Mon<br />{moment(this.state.selectedDate).weekday(-6).format('MMM DD')}</th>
										<th>Tue<br />{moment(this.state.selectedDate).weekday(-5).format('MMM DD')}</th>
										<th>Wed<br />{moment(this.state.selectedDate).weekday(-4).format('MMM DD')}</th>
										<th>Thu<br />{moment(this.state.selectedDate).weekday(-3).format('MMM DD')}</th>
										<th>Fri<br />{moment(this.state.selectedDate).weekday(-2).format('MMM DD')}</th>
										<th>Sat<br />{moment(this.state.selectedDate).weekday(-1).format('MMM DD')}</th>
										<th>Sun<br />{moment(this.state.selectedDate).weekday(0).format('MMM DD')}</th>

										{this.renderTableActivityHeader(activities_keys)}
									</tr>
									<tbody>
									{rendered_rows}	
									</tbody>
								</table>
							</div>
						</div>
						{this.renderWeeklySummaryOverlay()}
				</div>
			);
	}
}
export default WorkoutDashboard;