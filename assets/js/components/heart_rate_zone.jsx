import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import fetchHeartRateData  from '../network/heratrateOperations';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';
import FontAwesome from "react-fontawesome";
import { Collapse, Navbar, NavbarToggler, 
         NavbarBrand, Nav, NavItem, NavLink,
        Button,Popover,PopoverBody,Form,FormGroup,FormText,Label,Input} from 'reactstrap';
import NavbarMenu from './navbar';
import { getGarminToken,logoutUser} from '../network/auth';
import fetchHeartrateZoneData  from '../network/heartRate_zone';
import {renderTimeTohrrZoneSelectedDateFetchOverlay} from './dashboard_healpers';

axiosRetry(axios, { retries: 3});


var CalendarWidget = require('react-calendar-widget');
var ReactDOM = require('react-dom');

class HeartrateZone extends Component{
	constructor(props) {
    super(props);
	    this.state = {
			    	calendarOpen:false,
				    isOpen:false,
				    fetching_hrr_zone:false,
				    selectedDate:new Date(),
				    hr_zone:{},
	    }
	    this.toggleCalendar = this.toggleCalendar.bind(this);
	 	this.toggle = this.toggle.bind(this);
	 	this.processDate = this.processDate.bind(this);
	 	this.successHeartrateZone = this.successHeartrateZone.bind(this);
	 	this.errorHeartrateZone = this.errorHeartrateZone.bind(this);
	 	this.renderTable = this.renderTable.bind(this);
	 	this.renderTime = this.renderTime.bind(this);
	 	this.renderpercentage = this.renderpercentage.bind(this);
	 	this.renderTimeTohrrZoneSelectedDateFetchOverlay = renderTimeTohrrZoneSelectedDateFetchOverlay.bind(this);
	}

	successHeartrateZone(data){
	  	this.setState({
	  		hr_zone:data.data,
	  		fetching_hrr_zone:false
	  	});
  	}

  	errorHeartrateZone(error){
		console.log(error.message);
		this.setState({
	  		fetching_hrr_zone:false
	  	});
    }

	toggleCalendar(){
	    this.setState({
	      calendarOpen:!this.state.calendarOpen
	    });
    }

    toggle() {
	    this.setState({
	      isOpen: !this.state.isOpen,
	    });
  	}

  	renderTime(value){
		if(value>0){
			var sec_num = parseInt(value); 
		    var hours   = Math.floor(sec_num / 3600);
		    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		    var seconds = sec_num - (hours * 3600) - (minutes * 60);

		    if (hours   < 10) {hours   = "0"+hours;}
		    if (minutes < 10) {minutes = "0"+minutes;}
		    if (seconds < 10) {seconds = "0"+seconds;}
		    var time = hours+':'+minutes+':'+seconds;
		}
		else{
			time = "00:00:00";
		}
		
		    return time;
	}
	renderpercentage(value){
		let percentage
		if(value){
			percentage = value +"%";
		}
		else if(value == 0 || value == null || value == undefined){
			percentage = "0%";
		}
		return percentage;
	}
  	processDate(selectedDate){
		this.setState({
			selectedDate:selectedDate,
			calendarOpen:!this.state.calendarOpen,
			fetching_hrr_zone:true,
			hr_zone:{},
		},()=>{
			fetchHeartrateZoneData(this.successHeartrateZone,this.errorHeartrateZone,this.state.selectedDate);
		});
	}
	componentDidMount(){
		this.setState({
			fetching_hrr_zone:true,
		});
		fetchHeartrateZoneData(this.successHeartrateZone,this.errorHeartrateZone,this.state.selectedDate);
	}
	renderTable(data){
		var td_rows = [];
		let keys = ["low_end","high_end","classificaton","time_in_zone","prcnt_in_zone"];
		for(let[key1,value] of Object.entries(data)){
			let td_values = [];
			for(let key of keys){
				if(key == "time_in_zone"){
					let keyvalue = this.renderTime(value[key]);
				    td_values.push(<td>{keyvalue}</td>);
				}
				else if(key == "prcnt_in_zone"){
					let keyvalue = this.renderpercentage(value[key]);
				    td_values.push(<td>{keyvalue}</td>);
				}
				else{
					let keyvalue = value[key];
					td_values.push(<td>{keyvalue}</td>);
				}
				 
			}
			td_rows.push(<tr>{td_values}</tr>);
				
		}
		return td_rows;
	}

	render(){
		return(
			<div>

				<NavbarMenu/>

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

		            <div className = "row justify-content-center hr_table_padd">
	          	    	<div className = "table table-responsive">
		          	    	<table className = "table table-striped table-bordered ">
			          	    	<thead>
				          	    	<th>Heart Rate Zone Low End</th>
				          	    	<th>Heart Rate Zone Heigh End</th>
				          	    	<th>Classification</th>
				          	    	<th>Time in Zone(hh:mm:ss) for thr Last 7 Days</th>
				          	    	<th>% of Total Duration in Zone</th>
			          	    	</thead>
			          	    	<tbody>
			          	    	{this.renderTable(this.state.hr_zone)}
			          	    	</tbody>
		          	    	</table>
	          	    	</div>
          	    	</div>
          	    	{this.renderTimeTohrrZoneSelectedDateFetchOverlay()}
			</div>
			);
	}
}
export default HeartrateZone;