import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import _ from 'lodash';
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
import {fetchActiveData} from '../network/momentDashboard';

axiosRetry(axios, { retries: 3});
var CalendarWidget = require('react-calendar-widget');
var ReactDOM = require('react-dom');

class ActiveDashboard extends Component{
	constructor(props) {
    super(props);
	    this.state = {
	    	calendarOpen:false,
	    	fetching_active_data:false,
		   	selectedDate:new Date(),
		   	active_data:{}
	    }
	    this.toggleCalendar = this.toggleCalendar.bind(this);
	    this.renderAddDate = this.renderAddDate.bind(this);
		this.renderRemoveDate = this.renderRemoveDate.bind(this);
		this.processDate = this.processDate.bind(this);
		this.successActiveData = this.successActiveData.bind(this);
		this.errorActiveData = this.errorActiveData.bind(this);
	}
	successActiveData(data){
		this.setState({
			active_data:data.data,
			fetching_active_data:false
		});
  	}
  	errorActiveData(error){
		console.log(error.message);
		this.setState({
			fetching_active_data:false,
		});
		
  	}
	renderAddDate(){
		/*It is forward arrow button for the calender getting the next day date*/
		var today = this.state.selectedDate;
		var tomorrow = moment(today).add(1, 'days');
		this.setState({
			selectedDate:tomorrow.toDate(),
			fetching_active_data:true,
			active_data:{}
		
		},()=>{
			fetchActiveData(this.successActiveData,this.errorActiveData,this.state.selectedDate);
		});
	}
	renderRemoveDate(){
		/*It is backward arrow button for the calender getting the last day date*/
		var today = this.state.selectedDate;
		var tomorrow = moment(today).subtract(1, 'days');
		this.setState({
			selectedDate:tomorrow.toDate(),
			fetching_active_data:true,
			active_data:{}
			
	},()=>{
			fetchActiveData(this.successActiveData,this.errorActiveData,this.state.selectedDate);
		})
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
			fetching_active_data:true,
			active_data:{}
			
		},()=>{
			fetchActiveData(this.successActiveData,this.errorActiveData,this.state.selectedDate);
		});
	}
	componentDidMount(){
		this.setState({
			fetching_active_data:true,
		});
		fetchActiveData(this.successActiveData,this.errorActiveData,this.state.selectedDate);
	}
	renderTable(active_data){
		if (!_.isEmpty(active_data)){
			let td_keys = ["total_active_time", "sleeping_active_time", "excluded_sleep", "exercise_active_time", "excluded_sleep_exercise",
				"total_hours", "total_sleeping_hours", "excluded_sleep_hours", 
				"total_exercise_hours", "excluded_sleep_exercise_hours", 
				"total_active_prcnt", "sleep_hour_prcnt", "excluded_sleep_prcnt", 
				"exercise_hour_prcnt", "excluded_sleep_exercise_prcnt"];
			let tr_values = [];
			let td_values1 = [];
			let td_values2 = [];
			let td_values3 = [];
			
			td_values1.push(<td>Time Moving / Active (hh:mm)</td>);
			for(let key=0;key<5;key++){
				td_values1.push(<td>{active_data[td_keys[key]]}</td>);
			}
			
			td_values2.push(<td>Time in Period (hh:mm)</td>);
			for(let key=5;key<10;key++){
				td_values2.push(<td>{active_data[td_keys[key]]}</td>);
			}
			
			td_values3.push(<td>%Active</td>);
			for(let key=10;key<15;key++){
				td_values3.push(<td>{active_data[td_keys[key]]}</td>);
			}

			tr_values.push(<tr>{td_values1}</tr>);
			tr_values.push(<tr>{td_values2}</tr>);
			tr_values.push(<tr>{td_values3}</tr>);

			return [tr_values];
		}
	return [null];
	}

	render(){
		let rendered_data = this.renderTable(this.state.active_data);
		let rendered_rows = rendered_data[0];
		return(
			<div className = "container-fluid mnh-mobile-view">
				<NavbarMenu title = {<span style = {{fontSize:"18px"}}>
				Time Moving / Active Dashboard
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
                	
	        	</div>

				 <div style = {{fontSize:"12px"}}>
				 <div className="" style = {{fontWeight:"bold","textAlign":"center"}}>Time Moving / Active (hh:mm)
                	</div>
						<div className = "table table-responsive new_style1">
			          	    <table className = "weeklyWorkoutTable new_style table table-striped table-bordered">
								<tr>
									<th></th>
									<th>Entire 24<br />Hour <br />Day</th>
									<th>Sleep<br />Hours</th>
									<th>Entire 24<br />Hour Day<br />Excluding<br />Sleep</th>
									<th>Exercise<br />Hours</th>
									<th>Entire 24<br />Hour Day<br />Excluding<br />Sleep and<br />Exercise</th>
								</tr>
								<tbody>
									{rendered_rows}
								</tbody>
							</table>
						</div>
					</div>
			</div>
		);			
	}
}
export default ActiveDashboard;