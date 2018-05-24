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
import {renderAerobicSelectedDateFetchOverlay} from './dashboard_healpers';
import fetchWorkoutData from '../network/workout';

axiosRetry(axios, { retries: 3});


var CalendarWidget = require('react-calendar-widget');
var ReactDOM = require('react-dom');
class Workout extends Component{
	constructor(props){
		super(props);
		this.state = {
			selectedDate:new Date(),
			calendarOpen:false,
			data1:{
				"2551701200":{"duration": 3786,
					 "avg_hrr": 129.0,
					 "date": "12-Mar-18",
					 "workout_type": "RUNNING",
					 "total_time": 3786,
					 "average_heart_rate": 129},
				"2551706480": {"duration": 61,
					  "avg_hrr": 117.0,
					  "date": "12-Mar-18", 
					  "workout_type": "HEART_RATE_RECOVERY", 
					  "total_time": 3847, 
					  "average_heart_rate": 105}}
		}
		this.renderTable = this.renderTable.bind(this);
		this.successWorkout =this.successWorkout.bind(this);
		this.toggleCalendar = this.toggleCalendar.bind(this);
		this.errorWorkout =this.errorWorkout.bind(this);
		this.processDate = this.processDate.bind(this);

	}
	successWorkout(data){
		this.setState({
			data1:data.data
		});
	}
	errorWorkout(error){
		console.log(error.message);
	}
	processDate(selectedDate){
		this.setState({
			selectedDate:selectedDate,
			calendarOpen:!this.state.calendarOpen,
		},()=>{
			fetchWorkoutData(this.successWorkout,this.errorWorkout,this.state.selectedDate);
		});
		
	}
	// componentDidMount(){
	// 	fetchWorkoutData(this.successWorkout,this.errorWorkout,this.state.selectedDate);
	// }
	toggleCalendar(){
	    this.setState({
	      calendarOpen:!this.state.calendarOpen
	    });
    }
	renderTable(data){
		var td_rows = [];
		let keys = ["date","workout_type","duration","average_heart_rate"];
		for(let[key1,value] of Object.entries(data)){
			let td_values = [];
			for(let key of keys){
				 let keyvalue = value[key];
				 td_values.push(<td>{keyvalue}</td>);
			}
			td_rows.push(<tr>{td_values}</tr>);
		}
		return td_rows;
	}
	render(){
		return(
			<div className = "container_fluid">
				<NavbarMenu title = {"Workout Stats"}/>
				<div className="col-md-12,col-sm-12,col-lg-12">
				 <div className="row" style = {{marginTop:"10px"}}>
	            	<span id="navlink" onClick={this.toggleCalendar} id="progress">
	                    <FontAwesome
	                        name = "calendar"
	                        size = "2x"
	                    />
	                    <span style = {{marginLeft:"20px",fontWeight:"bold",paddingTop:"7px"}}>{moment(this.state.selectedDate).format('MMM DD, YYYY')}</span>  

                	</span> 
	            	<Popover
			            placement="bottom"
			            isOpen={this.state.calendarOpen}
			            target="progress"
			            toggle={this.toggleCalendar}>
		                <PopoverBody className="calendar2">
		                <CalendarWidget  onDaySelect={this.processDate}/>
		                </PopoverBody>
	                </Popover>
	            </div>
	            <div className = "row">
					<div className= "col-md-4">
		          	    <table className = "table table-striped table-bordered ">
							<tr>
							<th>Date</th>
							<th>Workout Type</th>
							<th>Duration</th>
							<th>Average Heartrate</th>
							</tr>
								{this.renderTable(this.state.data1)}
						</table>
					</div>
				
				</div>
				
				</div>
			</div>
		);
	}
}
export default Workout;