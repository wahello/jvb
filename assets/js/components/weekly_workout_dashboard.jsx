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

	renderTable(weekly_data){
		if (!_.isEmpty(weekly_data)){
			let tr_values = [];
			let td_totals = [];
			let td_extra = [];
			let td_keys = ["workout_type","days_with_activity","percent_of_days","duration","workout_duration_percent","average_heart_rate","duration_in_aerobic_range",
			"percent_aerobic","duration_in_anaerobic_range","percent_anaerobic","duration_below_aerobic_range","percent_below_aerobic",
			"duration_hrr_not_recorded","percent_hrr_not_recorded"];
			let activity_distance_keys = Object.keys(weekly_data['Totals']).filter(x => !td_keys.includes(x));
			td_keys = td_keys.concat(activity_distance_keys);
			let td_keys1 = ["no_activity","days_no_activity","percent_days_no_activity"];
			for(let [key,value] of Object.entries(weekly_data)){
				let td_values = [];
				if(key != "extra" && key != "Totals"){
					for(let key1 of td_keys){
						if(key1 == "percent_of_days" || key1 == "workout_duration_percent" ||
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
						}
					}
				}
				else if(key == "Totals"){
					for(let key1 of td_keys){
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
				tr_values.push(<tr>{td_values}</tr>);
			}

			let td_valuesTotal = [];
			for(let total of td_totals){
				td_valuesTotal.push(<td>{total}</td>)
			}
			tr_values.push(<tr>{td_valuesTotal}</tr>);

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
 				td_header.push(key);
			}
			th_row.push(<th>{td_header}</th>);
		}
		return th_row;
	}
	render(){
		let rendered_data = this.renderTable(this.state.weekly_data)
		let activities_keys = rendered_data[0];
		let rendered_rows = rendered_data[1];
		return(
				<div className = "container-fluid">
					<NavbarMenu title = {<span style = {{fontSize:"22px"}}>
					Weekly Workout Summary Report
					</span>} />

					<div className = "cla_center">
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
					 <div className = "row justify-content-center hr_table_padd">
							<div className = "table table-responsive">
				          	    <table className = "table table-striped table-bordered ">
									<tr>
										<th>Workout Type</th>
										<th>Avg # Of Days With Activity</th>
										<th>% of Days</th>
										<th>Avg. Workout Duration (hh:mm)</th>
										<th>% of Total Duration</th>
										<th>Avg Heart Rate</th>
										<th>Avg Aerobic Duration (hh:mm)</th>
										<th>Avg % Aerobic</th>
										<th>Avg Anaerobic Duration (hh:mm)</th>
										<th>Avg % Anaerobic</th>
										<th>Avg Below Aerobic Duration (hh:mm)</th>
										<th>Avg % Below Aerobic</th>
										<th>Avg HR Not Recorded Duration (hh:mm)</th>
										<th>Avg % HR Not Recorded</th>
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