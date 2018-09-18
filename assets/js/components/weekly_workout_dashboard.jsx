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
	gpascoreDecimal(gpa){
		let value;
		let x = gpa;
		if( x !=  null && x != undefined){
		    value =parseFloat(x).toFixed(2) + " %";
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
	//console.log("Inside aeroAnaerobicMatrix function");
	let duration_below_aerobic_range = "";
	let percent_below_aerobic  = "";
	let percent_aerobic  = "";
	let duration_in_aerobic_range  = "";
	let duration_hrr_not_recorded = "";
	let percent_hrr_not_recorded = "";
	let percent_anaerobic = "";
	let duration_in_anaerobic_range = "";

	for(let dataKey of td_keys) {
		//console.log("dataKey: "+dataKey);

		if((dataKey.indexOf("aerobic") >=0) || (dataKey == "duration_hrr_not_recorded") || (dataKey == "percent_hrr_not_recorded")) {
			let tempDuration = "";
			let tempPercentage = "";
			//console.log("dataKey: "+dataKey);
			if(dataKey.indexOf("duration")>=0) {
				//console.log("tempDuration: "+tempDuration);
				//console.log("tempPercentage: "+tempPercentage);
				tempDuration = this.renderTime(value[dataKey]);
				console.log("tempDuration: "+tempDuration);
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
				//console.log("tempPercentage: "+tempPercentage);
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
				/*return (<td>
					<tr><td>{"Aerobic"}<br />{duration_in_aerobic_range + " (" + percent_aerobic + ")"}</td>
					<td>{"Anaerobic"}<br />{duration_in_anaerobic_range + " (" + percent_anaerobic + ")"}</td>
					</tr>
					<tr><td>{"Below Aerobic"}<br />{duration_below_aerobic_range + " (" + percent_below_aerobic + ")"}</td>
					<td>{"HR Not Recorded"}<br />{duration_hrr_not_recorded + " (" + percent_hrr_not_recorded + ")"}</td>
					</tr>
					</td>);*/
				td_values.push(<div>
					<tr><td>{"Aerobic"}<br />{duration_in_aerobic_range + " (" + percent_aerobic + ")"}</td>
					<td>{"Anaerobic"}<br />{duration_in_anaerobic_range + " (" + percent_anaerobic + ")"}</td>
					</tr>
					<tr><td>{"Below Aerobic"}<br />{duration_below_aerobic_range + " (" + percent_below_aerobic + ")"}</td>
					<td>{"HR Not Recorded"}<br />{duration_hrr_not_recorded + " (" + percent_hrr_not_recorded + ")"}</td>
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
				duration_in_anaerobic_range == "") 
	{
		td_values.push(<td> {" - "} </td>);
	}
}

/*============================================================================================*/


	renderTable(weekly_data){
		//console.log(moment(this.state.selectedDate).startOf('week').format('MMM DD'));
		//console.log(moment(this.state.selectedDate).startOf('week').add(1, 'days').format('MMM DD'));

		if (!_.isEmpty(weekly_data)){
			let tr_values = [];
			let td_totals = [];
			let td_extra = [];	
			/*let td_keys = ["workout_type","days_with_activity","percent_of_days","duration","workout_duration_percent","average_heart_rate","duration_in_aerobic_range",
			"percent_aerobic","duration_in_anaerobic_	range","percent_anaerobic","duration_below_aerobic_range","percent_below_aerobic",
			"duration_hrr_not_recorded","percent_hrr_not_recorded"];*/
			let td_keys = ["workout_type","duration","workout_duration_percent","duration_in_aerobic_range", "percent_aerobic", "duration_in_anaerobic_range", "percent_anaerobic", "duration_below_aerobic_range", "percent_below_aerobic", "duration_hrr_not_recorded", "percent_hrr_not_recorded","days_with_activity"];

			/*if(Object.keys(weekly_data['Totals']).indexOf("_distance") >0) {

			}*/
			let mon = moment(this.state.selectedDate).weekday(-6).format('DD-MMM-YY');
			let tue = moment(this.state.selectedDate).weekday(-5).format('DD-MMM-YY');
			let wed = moment(this.state.selectedDate).weekday(-4).format('DD-MMM-YY');
			let thu = moment(this.state.selectedDate).weekday(-3).format('DD-MMM-YY');
			let fri = moment(this.state.selectedDate).weekday(-2).format('DD-MMM-YY');
			let sat = moment(this.state.selectedDate).weekday(-1).format('DD-MMM-YY');
			let sun = moment(this.state.selectedDate).weekday(0).format('DD-MMM-YY');
			td_keys = td_keys.concat(mon, tue, wed, thu, fri, sat, sun);
			console.log("Object.keys(weekly_data['Totals']): "+Object.keys(weekly_data['Totals']));	
			let activity_distance_keys = Object.keys(weekly_data['Totals']).filter(x => (x.indexOf("_distance")>=0));
			td_keys = td_keys.concat(activity_distance_keys);
			
			console.log("activity_distance_keys: "+activity_distance_keys);
			
			let td_keys1 = ["no_activity","days_no_activity","percent_days_no_activity"];
			for(let [key,value] of Object.entries(weekly_data)){
				/*for(let [dateKey,dateValue] of Object.entries(value["dates"])) {
					td_keys = td_keys.concat(dateKey);
				}*/
				
				console.log(key+ " and value = " +value);
				let flag = 0;
				let td_values = [];
				/*let tempDate = Object.keys(value['dates']);
				console.log("tempDate: "+tempDate[0]);*/
				if(key != "extra" && key != "Totals"){
					/*Workout Type (# Workouts)	DONE
									Total duration	DONE 
									% of Total Duration DONE
									Aerobic/Anaerobic Duration: (% of total time)	
									   => Aerobic       Anaerobic
									    1:16 (89%)	    0:06 (7%)
										Below Aerobic   HR Not Recorded:
										0:03 (4%)	    0:00 (0%)

									# of Days With Activity	
									Mon Aug 20	
									Tues Aug 21	
									Wed Aug 22	
									Thurs Aug 23	
									Fri Aug 24	
									Sat Aug 25	
									Sun Aug 26
									*/

					let tempDate = Object.keys(value['dates']);
					console.log("tempDate: "+tempDate[0]);
					let tempIndex = 0;

					for(let key1 of td_keys){
						//console.log("Object.keys.filter(x => x=== key1): "+Object.keys(value['dates']).filter(a => key1 == a) + "key1"+key1);
						if(key1== "workout_type") {
							td_values.push(<td>{value[key1]}</td>);
						}
						else if(key1=="duration") {
							td_values.push(<td>{this.renderTime(value[key1])}</td>);
						}
						else if(key1=="workout_duration_percent") {
							td_values.push(<td>{this.gpascoreDecimal(value[key1])}</td>);
						}
						else if(key1 == "duration_in_aerobic_range" || key1 == "duration_in_anaerobic_range" ||
						 key1 == "percent_aerobic" || key1 == "percent_anaerobic" || key1 == "duration_below_aerobic_range" ||
						  key1 == "percent_below_aerobic" || key1 == "percent_hrr_not_recorded" || key1 == "duration_hrr_not_recorded") {
							
							if(flag == 0) {
								this.aeroAnaerobicMatrix(value, td_keys, td_values);
								flag++;
							}
						}
						else if(key1 == "days_with_activity") {
							td_values.push(<td>{value[key1]}</td>);
						}
						else if(tempDate[tempIndex] != null && tempDate[tempIndex] != "" && tempDate[tempIndex] != undefined && key1 === tempDate[tempIndex]) {
							console.log("key1 in else if block: "+ key1);
							let [dateKey,dateValue] = Object.entries(value["dates"])[tempIndex]; 
								let tempDayDuration = "";
								let tempDayRepeated = "";
								console.log("dateKey: "+dateKey);
								for(let [finalDateKey, finalDateValue] of Object.entries(dateValue)){
									console.log("Workedout_dates key: "+finalDateKey+ " Values= "+finalDateValue);

									if(finalDateKey == "repeated") {
										tempDayRepeated = finalDateValue;
									} else if(finalDateKey == "duration") {
										tempDayDuration = this.renderTime(finalDateValue);
									}
								}	
								td_values.push(<td>{tempDayDuration + "("+tempDayRepeated+")"}</td>);
							
							tempIndex ++;
						}
						/*else if(key1 == sun || key1==mon || key1 == tue || key1 == wed || key1 == thu || key1 == fri || key1 == sat) {
							for(let [dateKey,dateValue] of Object.entries(value["dates"])) {
								let tempDayDuration = "";
								let tempDayRepeated = "";
								console.log("dateKey: "+dateKey);
								for(let [finalDateKey, finalDateValue] of Object.entries(dateValue)){
									console.log("Workedout_dates key: "+finalDateKey+ " Values= "+finalDateValue);

									if(finalDateKey == "repeated") {
										tempDayRepeated = finalDateValue;
									} else if(finalDateKey == "duration") {
										tempDayDuration = this.renderTime(finalDateValue);
									}
								}
								td_values.push(<td>{tempDayDuration + "("+tempDayRepeated+")"}</td>);
							}
							
						}*/
						else if(activity_distance_keys.includes(key1)){
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
						/*if(key1 == "percent_of_days" || key1 == "workout_duration_percent" ||
						 key1 == "percent_aerobic" || key1 == "percent_anaerobic" ||
						  key1 == "percent_below_aerobic" || key1 == "percent_hrr_not_recorded"){

							td_values.push(<td>{this.gpascoreDecimal(value[key1])}</td>);
						}
						else if(key1 == "average_heart_rate"){
							td_values.push(<td>{Math.round(value[key1])}</td>);
						}
						else if(key1 == "duration" || key1 == "duration_in_aerobic_range" ||
						 key1 == "duration_in_anaerobic_range" || key1 == "duration_below_aerobic_range" ||
						  key1 == "duration_hrr_not_recorded"){
							td_values.push(<td>{this.renderTime(value[key1])}</td>);
						}
						else if(activity_distance_keys.includes(key1)){
							if(key1 == "swimming_distance" || key1 == "lap_swimming_distance"){
								td_values.push(<td>{this.renderMetersToYards(value[key1].value)}</td>);
							}
							else{
								td_values.push(<td>{this.renderMetersToMiles(value[key1].value)}</td>);
							}
						}
						else{
							td_values.push(<td>{value[key1]}</td>);
						}*/
					}
					tr_values.push(<tr>{td_values}</tr>);
				}
				else if(key == "Totals"){
					/*for(let key1 of td_keys){
						if(key1 == "percent_of_days" || key1 == "workout_duration_percent" ||
						 key1 == "percent_aerobic" || key1 == "percent_anaerobic" ||
						  key1 == "percent_below_aerobic" || key1 == "percent_hrr_not_recorded"){
							td_totals.push(this.gpascoreDecimal(value[key1]))
						}
						else if(key1 == "average_heart_rate"){
							td_totals.push(Math.round(value[key1]));
						}
						else if(key1 == "duration" || key1 == "duration_in_aerobic_range" ||
						 key1 == "duration_in_anaerobic_range" || key1 == "duration_below_aerobic_range" ||
						  key1 == "duration_hrr_not_recorded"){
							td_totals.push(this.renderTime(value[key1]))
						}
						else if(activity_distance_keys.includes(key1)){
							if(key1 == "swimming_distance" || key1 == "lap_swimming_distance"){
								td_totals.push(this.renderMetersToYards(value[key1].value));
							}
							else{
								td_totals.push(this.renderMetersToMiles(value[key1].value));
							}
						}
						else{
							td_totals.push(value[key1])
						}
					}*/
					let tempDate = Object.keys(value['dates']);
					console.log("tempDate: "+tempDate[0]);
					let tempIndex = 0;
					for(let key1 of td_keys){
						
						if(key1== "workout_type") {
							td_totals.push(<td>{value[key1]}</td>);
						}
						else if(key1=="duration") {
							td_totals.push(<td>{this.renderTime(value[key1])}</td>);
						}
						else if(key1=="workout_duration_percent") {
							td_totals.push(<td>{this.gpascoreDecimal(value[key1])}</td>);
						}
						else if(key1 == "duration_in_aerobic_range" || key1 == "duration_in_anaerobic_range" ||
						 key1 == "percent_aerobic" || key1 == "percent_anaerobic" || key1 == "duration_below_aerobic_range" ||
						  key1 == "percent_below_aerobic" || key1 == "percent_hrr_not_recorded" || key1 == "duration_hrr_not_recorded") {
							
							if(flag == 0) {
								this.aeroAnaerobicMatrix(value, td_keys, td_totals);
								flag++;
							}
						}
						else if(key1 == "days_with_activity") {
							td_totals.push(<td>{value[key1]}</td>);
						}
						else if(tempDate[tempIndex] != null && tempDate[tempIndex] != "" && tempDate[tempIndex] != undefined && tempDate.includes(key1)) {
							console.log("key1 in else total block: "+ key1);
							console.log("key1 in else total block: "+ tempIndex);
							let [dateKey,dateValue] = Object.entries(value["dates"])[tempIndex];
								let tempDayDuration = "";
								let tempDayRepeated = "";
								console.log("dateKey: "+dateKey);

								for(let [finalDateKey, finalDateValue] of Object.entries(dateValue)){
									console.log("Workedout_dates key: "+finalDateKey+ " Values= "+finalDateValue);

									if(finalDateKey == "repeated") {
										tempDayRepeated = finalDateValue;
									} else if(finalDateKey == "duration") {
										tempDayDuration = this.renderTime(finalDateValue);
									}
								}
								
								td_totals.push(<td>{tempDayDuration + "("+tempDayRepeated+")"}</td>);
							
							tempIndex ++;	
						}
						else if(activity_distance_keys.includes(key1)){
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
					for(let key2 of td_keys1){
						if(key2 == "percent_days_no_activity"){
							td_extra.push(this.gpascoreDecimal(value[key2]))
						}
						else if(key2 == "no_activity"){
							td_extra.push("No Activity")
						}
						else{
							td_extra.push(value[key2])
						}
					}
				}
				//tr_values.push(<tr>{td_values}</tr>);
			}

			/*let td_valuesTotal = [];
			for(let total of td_totals){
				console.log("td_totals: "+total);
				td_valuesTotal.push(<td>{total}</td>)
			}*/
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
	renderTableActivityHeader(header_data){
		let td_header = [];
		let th_row = [];
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
					key = "Avg" + " " + activity_name + " Distance (In Yards)";
				}else{
					key = "Avg" + " " + activity_name + " Distance (In Miles)";
				}
 				td_header.push(<th>{key}</th>);
			}
		}
		return td_header;
	}
	render(){
		let rendered_data = this.renderTable(this.state.weekly_data)
		let activities_keys = rendered_data[0];
		let rendered_rows = rendered_data[1];
		return(
				<div className = "container-fluid">
					<NavbarMenu title = {<span style = {{fontSize:"18px"}}>
					Weekly Workout Summary Report
					</span>} />

					<div className = "cla_center" style = {{fontSize:"12px"}}>
						<span>
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
	                	 <div style = {{textAlign:"center",fontWeight:"bold"}}>Weekly Workout Summary Report For The Week Ended: <span style = {{textDecoration:"underline"}}>{this.renderLastSunday(new Date(this.state.selectedDate))}</span></div> 
		        	</div>
					 <div className = "row justify-content-center hr_table_padd" style = {{fontSize:"12px"}}>
							<div className = "table table-responsive">
				          	    <table className = "table table-striped table-bordered ">
									<tr>
									{/*Workout Type (# Workouts)	
									Total Duration	
									% of Total Duration
									Aerobic/Anaerobic Duration: (% of total time)	
									# of Days With Activity	
									Mon Aug 20	
									Tues Aug 21	
									Wed Aug 22	
									Thurs Aug 23	
									Fri Aug 24	
									Sat Aug 25	
									Sun Aug 26
									*/}
										<th>Workout Type (# Workouts)</th>
										<th>Total Duration</th>
										<th>% of Total Duration</th>
										<th>Aerobic/Anaerobic Duration: (% of total time)</th>
										<th># of Days With Activity</th>
										<th>Mon <br />{moment(this.state.selectedDate).weekday(-6).format('MMM DD')}</th>
										<th>Tue <br /> {moment(this.state.selectedDate).weekday(-5).format('MMM DD')}</th>
										<th>Wed <br /> {moment(this.state.selectedDate).weekday(-4).format('MMM DD')}</th>
										<th>Thu <br /> {moment(this.state.selectedDate).weekday(-3).format('MMM DD')}</th>
										<th>Fri <br /> {moment(this.state.selectedDate).weekday(-2).format('MMM DD')}</th>
										<th>Sat <br /> {moment(this.state.selectedDate).weekday(-1).format('MMM DD')}</th>
										<th>Sun <br /> {moment(this.state.selectedDate).weekday(0).format('MMM DD')}</th>
										{/*<th>Avg HR Not Recorded Duration (hh:mm)</th>
										<th>Avg % HR Not Recorded</th>*/}
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