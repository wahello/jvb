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


axiosRetry(axios, { retries: 3});
var CalendarWidget = require('react-calendar-widget');
var ReactDOM = require('react-dom');

class WorkoutDashboard extends Component{
	constructor(props) {
    super(props);
	    this.state = {
			    	calendarOpen:false,
				   	selectedDate:new Date(),
	    }
	    this.toggleCalendar = this.toggleCalendar.bind(this);
	    this.renderAddDate = this.renderAddDate.bind(this);
		this.renderRemoveDate = this.renderRemoveDate.bind(this);
		this.toggleCalendar = this.toggleCalendar.bind(this);
	   
	}

	renderAddDate(){
		/*It is forward arrow button for the calender getting the next day date*/
		var today = this.state.selectedDate;
		var tomorrow = moment(today).add(1, 'days');
		this.setState({
			selectedDate:tomorrow.toDate()
		},()=>{
			fetchMovementData(this.successMovementData,this.errorMovementData,this.state.selectedDate);
		});
	}
	renderRemoveDate(){
		/*It is backward arrow button for the calender getting the last day date*/
		var today = this.state.selectedDate;
		var tomorrow = moment(today).subtract(1, 'days');
		this.setState({
			selectedDate:tomorrow.toDate()
		},()=>{
			fetchMovementData(this.successMovementData,this.errorMovementData,this.state.selectedDate);
		});
	}
	toggleCalendar(){
		//Toggle of calander icon.
	    this.setState({
	      calendarOpen:!this.state.calendarOpen
	    });
    }
	render(){
		return(
				<div>
					<NavbarMenu title = {<span style = {{fontSize:"22px"}}>
					Weekly Workout Summary Report
					</span>} />

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
										<th>Avg Run Distance (In Miles)</th>
										<th>Avg Bike Distance (In Miles)</th>
										<th>Avg Swim Distance (In Yards)</th>
										
									</tr>
									<tbody>
										
									</tbody>
								</table>
							</div>
						</div>
					
				</div>
			);
	}
}
export default WorkoutDashboard;