import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import fetchFitBitData  from '../network/fitbitOperations';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';


axiosRetry(axios, { retries: 3});


var CalendarWidget = require('react-calendar-widget');
var ReactDOM = require('react-dom');

export default class FitBit extends Component{
	constructor(props){
		super(props);
	    this.processDate = this.processDate.bind(this);
	    this.successFitBit = this.successFitBit.bind(this);
	    this.errorFitBit = this.errorFitBit.bind(this);
	    this.state = {
	    	selectedDate:new Date(),
	    	fitbit_data:{}
	    };
	}
	successFitBit(data){
		this.setState({
			fitbit_data:data.data
		});
	}
	errorFitBit(error){
		console.log(error.message)
	}
	processDate(selectedDate){
		this.setState({
			selectedDate:selectedDate,
		},()=>{
			fetchFitBitData(this.successFitBit,this.errorFitBit,this.state.selectedDate);
		});
		
	}
	componentDidMount(){
		fetchFitBitData(this.successFitBit,this.errorFitBit,this.state.selectedDate);
	}
	render(){
		return(
			<div>
			 <div className="col-sm-4 col-sm-offset-4">
	            <div className="row">
	            	<CalendarWidget onDaySelect={this.processDate}/>,
	            </div>
          	    <div className = "row">
          	 	    <pre>{JSON.stringify(this.state.fitbit_data, null, 2)}</pre>
          	   </div>
          	  </div>
			</div>

		)
	}
}