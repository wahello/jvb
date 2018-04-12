import React, { Component } from 'react';
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



axiosRetry(axios, { retries: 3});


var CalendarWidget = require('react-calendar-widget');
var ReactDOM = require('react-dom');

export default class HeartRate extends Component{
	constructor(props){
		super(props);
	    this.processDate = this.processDate.bind(this);
	    this.successHeartRate = this.successHeartRate.bind(this);
	    this.errorHeartRate = this.errorHeartRate.bind(this);
	    this.renderTime = this.renderTime.bind(this);
	    this.toggleCalendar = this.toggleCalendar.bind(this);
	    this.renderpercentage = this.renderpercentage.bind(this);
	    this.state = {
	    	selectedDate:new Date(),
	    	calendarOpen:false,
	    	aerobic_zone:"",
            anaerobic_range:"",
            below_aerobic_zone:"",
			total_time:"",
			percent_aerobic:"",
			percent_below_aerobic:"",
			percent_anaerobic:"",
			total_percent:"",

	    };
	}
	successHeartRate(data){
		this.setState({
	    	aerobic_zone:data.data.aerobic_zone,
            anaerobic_range:data.data.anaerobic_range,
            below_aerobic_zone:data.data.below_aerobic_zone,
			total_time:data.data.total_time,
			percent_aerobic:data.data.percent_aerobic,
			percent_below_aerobic:data.data.percent_below_aerobic,
			percent_anaerobic:data.data.percent_anaerobic,
			total_percent:data.data.total_percent,
		});
	}
	toggleCalendar(){
	    this.setState({
	      calendarOpen:!this.state.calendarOpen
	    });
    }
	errorHeartRate(error){
		console.log(error.message)
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
			time = value;
		}
		
		    return time;
	}
	renderpercentage(value){
		if(value){
			let percentage = value +"%";
		}
		return percentage;
	}
	processDate(selectedDate){
		this.setState({
			selectedDate:selectedDate,
			calendarOpen:!this.state.calendarOpen
		},()=>{
			fetchHeartRateData(this.successHeartRate,this.errorHeartRate,this.state.selectedDate);
		});
		
	}
	componentDidMount(){
		fetchHeartRateData(this.successHeartRate,this.errorHeartRate,this.state.selectedDate);
	}
	render(){
		return(
			<div className = "container-fluid">
			 <NavbarMenu/>
			 <div className="col-md-12,col-sm-12,col-lg-12">
	            <div className="row" style = {{marginTop:"10px"}}>
	            	<span id="navlink" onClick={this.toggleCalendar} id="progress">
	                    <FontAwesome
	                        name = "calendar"
	                        size = "2x"
	                    />
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
	          	    <thead className = "hr_table_style_rows">
		          	    <th className = "hr_table_style_rows">Ranges</th>
		          	    <th className = "hr_table_style_rows">Time in Zone (hours:minutes:seconds)</th>
		          	    <th className = "hr_table_style_rows">% of Time in Zone</th>
	          	    </thead>
	          	    <tbody>
	          	    <tr className = "hr_table_style_rows">
	          	    <td className = "hr_table_style_rows">Aerobic Range</td>
	          	    <td className = "hr_table_style_rows">{this.renderTime(this.state.aerobic_zone)}</td>
	          	    <td className = "hr_table_style_rows">{this.renderpercentage(this.state.percent_aerobic)}</td>
	          	    </tr>
	          	    <tr className = "hr_table_style_rows">
	          	    <td className = "hr_table_style_rows">Anaerobic Range</td>
	          	    <td className = "hr_table_style_rows">{this.renderTime(this.state.anaerobic_range)}</td>
	          	    <td className = "hr_table_style_rows">{this.renderpercentage(this.state.percent_anaerobic)}</td>
	          	    </tr>
	          	    <tr className = "hr_table_style_rows">
	          	    <td className = "hr_table_style_rows">Below Aerobic Range</td>
	          	    <td className = "hr_table_style_rows">{this.renderTime(this.state.below_aerobic_zone)}</td>
	          	    <td className = "hr_table_style_rows">{this.renderpercentage(this.state.percent_below_aerobic)}</td>
	          	    </tr>
	          	    <tr className = "hr_table_style_rows">
	          	    <td className = "hr_table_style_rows">Total Workout Duration (hours:minutes:seconds)</td>
	          	    <td className = "hr_table_style_rows">{this.renderTime(this.state.total_time)}</td>
	          	    <td className = "hr_table_style_rows">{this.renderpercentage(this.state.total_percent)}</td>
	          	    </tr>
	          	    </tbody>
          	    </table>   
          	   </div>
          	  </div>
          	  </div>
			</div>

		)
	}
}