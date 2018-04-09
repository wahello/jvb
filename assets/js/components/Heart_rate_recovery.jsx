import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import fetchHeartRateData  from '../network/heratrateOperations';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';


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
	    this.state = {
	    	selectedDate:new Date(),
	    	aerobic_zone:"",
            anaerobic_range:"",
            below_aerobic_zone:"",
			total_time:"",
	    };
	}
	successHeartRate(data){
		this.setState({
	    	aerobic_zone:data.data.aerobic_zone,
            anaerobic_range:data.data.anaerobic_range,
            below_aerobic_zone:data.data.below_aerobic_zone,
			total_time:data.data.total_time,
		});
	}
	errorHeartRate(error){
		console.log(error.message)
	}
	renderTime(value){

			var sec_num = parseInt(value); 
			console.log("*********",sec_num);// don't forget the second param
		    var hours   = Math.floor(sec_num / 3600);
		    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		    var seconds = sec_num - (hours * 3600) - (minutes * 60);

		    if (hours   < 10) {hours   = "0"+hours;}
		    if (minutes < 10) {minutes = "0"+minutes;}
		    if (seconds < 10) {seconds = "0"+seconds;}
		    let time = hours+':'+minutes+':'+seconds;
		    console.log("+++++++++",time);
		    return time;
	}
	processDate(selectedDate){
		this.setState({
			selectedDate:selectedDate,
		},()=>{
			// console.log("********",this.state.selectedDate);
			fetchHeartRateData(this.successHeartRate,this.errorHeartRate,this.state.selectedDate);
		});
		
	}
	componentDidMount(){
		fetchHeartRateData(this.successHeartRate,this.errorHeartRate,this.state.selectedDate);
	}
	render(){
		return(
			<div>
			 <div className="col-sm-4 col-sm-offset-4">
	            <div className="row">
	            	<CalendarWidget onDaySelect={this.processDate}/>
	            </div>
          	    <div className = "row">
          	    <table className = "table table-striped table-responsive">
	          	    <thead>
		          	    <th>Ranges</th>
		          	    <th>Time in Zone (hours:minutes:seconds)</th>
		          	    <th>% of Time in Zone</th>
	          	    </thead>
	          	    <tbody>
	          	    <tr>
	          	    <td>Aerobic Range</td>
	          	    <td>{this.renderTime(this.state.aerobic_zone)}</td>
	          	    <td></td>
	          	    </tr>
	          	    <tr>
	          	    <td>Anaerobic Range</td>
	          	    <td>{this.renderTime(this.state.anaerobic_range)}</td>
	          	    <td></td>
	          	    </tr>
	          	    <tr>
	          	    <td>Below Aerobic Range</td>
	          	    <td>{this.renderTime(this.state.below_aerobic_zone)}</td>
	          	    <td></td>
	          	    </tr>
	          	    <tr>
	          	    <td>Total Workout Duration (hours:minutes:seconds)</td>
	          	    <td>{this.renderTime(this.state.total_time)}</td>
	          	    <td></td>
	          	    </tr>
	          	    </tbody>
          	    </table>   
          	   </div>
          	  </div>
			</div>

		)
	}
}