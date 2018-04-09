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
	    this.state = {
	    	selectedDate:new Date(),
	    	fitbit_data:{}
	    };
	}
	successHeartRate(data){
		this.setState({
			fitbit_data:data.data
		});
	}
	errorHeartRate(error){
		console.log(error.message)
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
          	   </div>
          	  </div>
			</div>

		)
	}
}