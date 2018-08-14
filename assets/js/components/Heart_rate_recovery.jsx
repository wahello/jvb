import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import fetchHeartRateData  from '../network/heratrateOperations';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';
import _ from 'lodash';
import FontAwesome from "react-fontawesome";
import { Collapse, Navbar, NavbarToggler, 
         NavbarBrand, Nav, NavItem, NavLink,
        Button,Popover,PopoverBody,Form,FormGroup,FormText,Label,Input} from 'reactstrap';
import NavbarMenu from './navbar';
import { getGarminToken,logoutUser} from '../network/auth';
import {renderAerobicSelectedDateFetchOverlay} from './dashboard_healpers'; 
import Workout from './workout_stats';
import {fetchWorkoutData,fetchAaWorkoutData} from '../network/workout';
import {renderTimeTohrrZoneSelectedDateFetchOverlay} from './dashboard_healpers';
import fetchHeartrateZoneData  from '../network/heartRate_zone';


axiosRetry(axios, { retries: 3});
var CalendarWidget = require('react-calendar-widget');
var ReactDOM = require('react-dom');

class HeartRate extends Component{
	constructor(props){
		super(props);
	    this.processDate = this.processDate.bind(this);
	    this.successHeartRate = this.successHeartRate.bind(this);
	    this.errorHeartRate = this.errorHeartRate.bind(this);
	    this.renderTime = this.renderTime.bind(this);
	    this.toggleCalendar = this.toggleCalendar.bind(this);
	    this.renderpercentage = this.renderpercentage.bind(this);
		this.toggle = this.toggle.bind(this);
		this.renderTable = this.renderTable.bind(this);
		this.successWorkout =this.successWorkout.bind(this);
		this.errorWorkout =this.errorWorkout.bind(this);
		this.renderAerobicSelectedDateFetchOverlay = renderAerobicSelectedDateFetchOverlay.bind(this);
		this.stepsValue = this.stepsValue.bind(this);
		this.renderNullValue = this.renderNullValue.bind(this);
		this.renderHrrZoneTable = this.renderHrrZoneTable.bind(this);
		this.successHeartrateZone = this.successHeartrateZone.bind(this);
	 	this.errorHeartrateZone = this.errorHeartrateZone.bind(this);
	 	this.renderAddDate = this.renderAddDate.bind(this);
		this.renderRemoveDate = this.renderRemoveDate.bind(this);
	    this.state = {
	    	selectedDate:new Date(),
	    	calendarOpen:false,
	    	isOpen:false,
	    	fetching_aerobic:false,
	    	aerobic_zone:"",
            anaerobic_zone:"",
            below_aerobic_zone:"",
            aerobic_range:"",
            anaerobic_range:"",
            below_aerobic_range:"",
            hrr_not_recorded:"",
            percent_hrr_not_recorded:"",
			total_time:"",
			percent_aerobic:"",
			percent_below_aerobic:"",
			percent_anaerobic:"",
			total_percent:"",
			empty:"",
			aa_data:{},
			hr_zone:{},
	    };
	}
	successHeartRate(data){
		this.setState({
	    	aerobic_zone:data.data.aerobic_zone,
            anaerobic_zone:data.data.anaerobic_zone,
            below_aerobic_zone:data.data.below_aerobic_zone,
            aerobic_range:data.data.aerobic_range,
            anaerobic_range:data.data.anaerobic_range,
            below_aerobic_range:data.data.below_aerobic_range,
            hrr_not_recorded:data.data.hrr_not_recorded,
            percent_hrr_not_recorded:data.data.percent_hrr_not_recorded,
			total_time:data.data.total_time,
			percent_aerobic:data.data.percent_aerobic,
			percent_below_aerobic:data.data.percent_below_aerobic,
			percent_anaerobic:data.data.percent_anaerobic,
			total_percent:data.data.total_percent,
			fetching_aerobic:false,
		});
	}

	toggleCalendar(){
	    this.setState({
	    	calendarOpen:!this.state.calendarOpen
	    });
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

	errorHeartRate(error){
		console.log(error.message);
		this.setState({
			fetching_aerobic:false,
		});
	}

	getEmptyActivityFieldsForAA(){
	    let val = {
					"date":"",
					"workout_type":"",
					"duration":"",
					"average_heart_rate":"",
					"max_heart_rate":"",
					"total_time":"",
					"avg_hrr":"",
					"max_hrr":"",
					"steps":"",
					"total_time":"",
					"aerobic_zone":"",
					"anaerobic_zone":"",
					"below_aerobic_zone":"",
					"aerobic_range":"",
					"anaerobic_range":"",
					"below_aerobic_range":"",
					"percent_aerobic":"",
					"percent_below_aerobic":"",
					"percent_anaerobic":"",
					"total_percent":"",
					"total_aerobic_range":"",
					"total_anaerobic_range":"",
					"total_below_aerobic_range":"",
					"total_prcnt_aerobic":"",
					"total_prcnt_anaerobic":"",
					"hrr_not_recorded":"",
					"prcnt_hrr_not_recorded":"",
					
			      };
	    return val;
	} 

	successWorkout(data){
		if(!_.isEmpty(data.data)){
			for(let[key,value] of Object.entries(data.data)){
				if(this.state.aa_data[key]){
					// if activity is already present in aa_data state
					let updated_value= {...this.state.aa_data[key]}
					for(let[field,field_data] of Object.entries(value)){
						updated_value[field] = field_data;
					}
					this.setState({
						aa_data:{
							...this.state.aa_data,
							[key]:updated_value
						}
					});
				}
				else{
					let empty_data = this.getEmptyActivityFieldsForAA()
					for(let[field,field_data] of Object.entries(value)){
						empty_data[field] = field_data;
					}
					this.setState({
						aa_data:{
							...this.state.aa_data,
							[key]:empty_data
						}
					});
				}
			}
		}
	}
	
	errorWorkout(error){
		console.log(error.message);
	}

  	toggle() {
	    this.setState({
	      	isOpen: !this.state.isOpen,
	    });
  	}
  	renderNullValue(value){
  		// This function will add the (-) for when the values get null
  		let values;
  		if(value){
  			values = value;
  		}
  		else if(value == null || value == undefined){
  			values = "-"
  		}
  		return values;
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
			    time = hours+':'+minutes+':'+seconds;
			}
		}
		else if(value == 0 || value == null){
			time = "00:00:00";
		}
		return time;
	}

	stepsValue(value){
		// This function will add the (,) for the steps values
		if(value){
			value += '';
	     	var x = value.split('.');
	    	var x1 = x[0];
	        var x2 = x.length > 1 ? '.' + x[1] : '';
	        var rgx = /(\d+)(\d{3})/;
	        while (rgx.test(x1)) {
	        x1 = x1.replace(rgx, '$1' + ',' + '$2');
	        }
	        return x1 + x2;
	    }
	    else if(value == 0){
	    	return "0";
	    }
	    else{
	    	return "-";
	    }
	}

	renderpercentage(value){
		// This function will add the "%" symbol for the persentage values. 
		let percentage;
		if(value){
			percentage = value +"%";
		}
		else if(value == 0){
			percentage = "0%";
		}
		else if(value == null || value == undefined){
			percentage = "-";
		}
		return percentage;
	}
	renderAddDate(){
		var today = this.state.selectedDate;
		var tomorrow = moment(today).add(1, 'days');
		this.setState({
			selectedDate:tomorrow.toDate(),
			fetching_aerobic:true,
			aerobic_zone:"",
            anaerobic_zone:"",
            below_aerobic_zone:"",
            aerobic_range:"",
            anaerobic_range:"",
            below_aerobic_range:"",
            hrr_not_recorded:"",
            percent_hrr_not_recorded:"",
			total_time:"",
			percent_aerobic:"",
			percent_below_aerobic:"",
			percent_anaerobic:"",
			total_percent:"",
			empty:"",
			aa_data:{},
			hr_zone:{},
		},()=>{
			fetchHeartRateData(this.successHeartRate,this.errorHeartRate,this.state.selectedDate);
			fetchWorkoutData(this.successWorkout,this.errorWorkout,this.state.selectedDate);
			fetchAaWorkoutData(this.successWorkout,this.errorWorkout,this.state.selectedDate);
			fetchHeartrateZoneData(this.successHeartrateZone,this.errorHeartrateZone,this.state.selectedDate);
		});
	}
	renderRemoveDate(){
		var today = this.state.selectedDate;
		var tomorrow = moment(today).subtract(1, 'days');
		this.setState({
			selectedDate:tomorrow.toDate(),
			fetching_aerobic:true,
			aerobic_zone:"",
            anaerobic_zone:"",
            below_aerobic_zone:"",
            aerobic_range:"",
            anaerobic_range:"",
            below_aerobic_range:"",
            hrr_not_recorded:"",
            percent_hrr_not_recorded:"",
			total_time:"",
			percent_aerobic:"",
			percent_below_aerobic:"",
			percent_anaerobic:"",
			total_percent:"",
			empty:"",
			aa_data:{},
			hr_zone:{},
		},()=>{
			fetchHeartRateData(this.successHeartRate,this.errorHeartRate,this.state.selectedDate);
			fetchWorkoutData(this.successWorkout,this.errorWorkout,this.state.selectedDate);
			fetchAaWorkoutData(this.successWorkout,this.errorWorkout,this.state.selectedDate);
			fetchHeartrateZoneData(this.successHeartrateZone,this.errorHeartrateZone,this.state.selectedDate);
		});
	}
	processDate(selectedDate){
		this.setState({
			selectedDate:selectedDate,
			calendarOpen:!this.state.calendarOpen,
			fetching_aerobic:true,
			aerobic_zone:"",
            anaerobic_zone:"",
            below_aerobic_zone:"",
            aerobic_range:"",
            anaerobic_range:"",
            below_aerobic_range:"",
            hrr_not_recorded:"",
            percent_hrr_not_recorded:"",
			total_time:"",
			percent_aerobic:"",
			percent_below_aerobic:"",
			percent_anaerobic:"",
			total_percent:"",
			empty:"",
			aa_data:{},
			hr_zone:{},
		},()=>{
			fetchHeartRateData(this.successHeartRate,this.errorHeartRate,this.state.selectedDate);
			fetchWorkoutData(this.successWorkout,this.errorWorkout,this.state.selectedDate);
			fetchAaWorkoutData(this.successWorkout,this.errorWorkout,this.state.selectedDate);
			fetchHeartrateZoneData(this.successHeartrateZone,this.errorHeartrateZone,this.state.selectedDate);
		});
		
	}
	renderHrrZoneTable(data){
		// This function create the dynamic table data
		// and table rows for the Time of heart rate zone 
		let td_rows = [];
		let total = null;
		if(!_.isEmpty(data)){
			total = data.total;
		}
		let keys = ["heart_rate_zone_low_end","heart_rate_zone_high_end","classificaton", 
		"time_in_zone","prcnt_total_duration_in_zone"];
		for(let[key1,value] of Object.entries(data)){
			if(key1 !== "total"){
				let td_values = [];
				for(let key of keys){
					if(key == "time_in_zone"){
						let keyvalue = this.renderTime(value[key]);
					    td_values.push(<td>{keyvalue}</td>);
					}
					else if(key == "classificaton"){
						let keyvalue = value[key];
						if(keyvalue == "below_aerobic_zone"){
							 td_values.push(<td>Below Aerobic Zone</td>);
						}
						else if(keyvalue == "aerobic_zone"){
							 td_values.push(<td>Aerobic Zone</td>);
						}
						else{
							td_values.push(<td>Anaerobic Zone</td>);
						}
					   
					}
					else if(key == "prcnt_total_duration_in_zone"){
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
		}
		if(total){
			let td_values = [
				<td colSpan="3">{"Total"}</td>,
				<td>{this.renderTime(total.total_duration)}</td>,
				<td>{total.total_percent}</td>
			];
			td_rows.push(<tr>{td_values}</tr>);
		}
		return td_rows;
	}

	renderTable(data){
		let td_rows = [];
		let keys = ["date","workout_type","duration","average_heart_rate","max_heart_rate","steps",
		"duration_in_aerobic_range","percent_aerobic","duration_in_anaerobic_range","percent_anaerobic","duration_below_aerobic_range","percent_below_aerobic","hrr_not_recorded","prcnt_hrr_not_recorded"];
		for(let[key1,value] of Object.entries(data)){
			let td_values = [];
			for(let key of keys){
				if(key == "duration"){
					let keyvalue = this.renderTime(value[key]);
				    td_values.push(<td>{keyvalue}</td>);
				}
				else if(key == "hrr_not_recorded"){
					let keyvalue =  this.renderTime(value[key]);
				    td_values.push(<td>{keyvalue}</td>);
				}
				else if(key == "prcnt_hrr_not_recorded"){
					let keyvalue = this.renderpercentage(value[key]);
				    td_values.push(<td>{keyvalue}</td>);
				}
				else if(key == "duration_in_aerobic_range"){
					let keyvalue = this.renderTime(value[key]);
				    td_values.push(<td>{keyvalue}</td>);
				}
				else if(key == "duration_in_anaerobic_range"){
					let keyvalue = this.renderTime(value[key]);
				    td_values.push(<td>{keyvalue}</td>);
				}
				else if(key == "duration_below_aerobic_range"){
					let keyvalue = this.renderTime(value[key]);
				    td_values.push(<td>{keyvalue}</td>);
				}
				else if(key == "percent_aerobic"){
					let keyvalue = this.renderpercentage(value[key]);
				    td_values.push(<td>{keyvalue}</td>);
				}
				else if(key == "percent_anaerobic"){
					let keyvalue = this.renderpercentage(value[key]);
				    td_values.push(<td>{keyvalue}</td>);
				}
				else if(key == "percent_below_aerobic"){
					let keyvalue = this.renderpercentage(value[key]);
				    td_values.push(<td>{keyvalue}</td>);
				}
				else if(key == "steps"){
						let keyvalue = this.stepsValue(value[key]);
	            		td_values.push(<td>{keyvalue}</td>);
	            	}
				else{
					let keyvalue = this.renderNullValue(value[key]);
					td_values.push(<td>{keyvalue}</td>);
				}
				 
			}
			td_rows.push(<tr>{td_values}</tr>);
		}
		return td_rows;
	}

	componentDidMount(){
		this.setState({
			fetching_aerobic:true,
		});
		fetchHeartRateData(this.successHeartRate,this.errorHeartRate,this.state.selectedDate);
		fetchWorkoutData(this.successWorkout,this.errorWorkout,this.state.selectedDate);
		fetchAaWorkoutData(this.successWorkout,this.errorWorkout,this.state.selectedDate);
		fetchHeartrateZoneData(this.successHeartrateZone,this.errorHeartrateZone,this.state.selectedDate);
	}

	render(){
		const {fix} = this.props;
		return(
				<div className = "container-fluid">
			    	<NavbarMenu title = {<span style = {{fontSize:"22px"}}>Heartrate Aerobic/Anaerobic Ranges</span>} />
					<div className="col-md-12,col-sm-12,col-lg-12">
			           <div>
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
		          	    <div className = "row justify-content-center hr_table_padd">
			          	    <div className = "table table-responsive">
				          	    <table className = "table table-striped table-bordered ">
					          	    <thead className = "hr_table_style_rows">
						          	    <th className = "hr_table_style_rows">Ranges</th>
						          	    <th className = "hr_table_style_rows">Heart Rate Range</th>
						          	    <th className = "hr_table_style_rows">Time in Zone (hh:mm:ss)</th>
						          	    <th className = "hr_table_style_rows">% of Time in Zone</th>
					          	    </thead>  
					          	    <tbody>   
						          	    <tr className = "hr_table_style_rows">   
							          	    <td className = "hr_table_style_rows">Aerobic Range</td>    
							          	    <td className = "hr_table_style_rows">{(this.state.aerobic_range)}</td>
							          	    <td className = "hr_table_style_rows">{this.renderTime(this.state.aerobic_zone)}</td>
							          	    <td className = "hr_table_style_rows">{this.renderpercentage(this.state.percent_aerobic)}</td>
						          	    </tr>
						          	    <tr className = "hr_table_style_rows">
							          	    <td className = "hr_table_style_rows">Anaerobic Range</td>
							          	    <td className = "hr_table_style_rows">{(this.state.anaerobic_range)}</td>
							          	    <td className = "hr_table_style_rows">{this.renderTime(this.state.anaerobic_zone)}</td>
							          	    <td className = "hr_table_style_rows">{this.renderpercentage(this.state.percent_anaerobic)}</td>
						          	    </tr>
						          	    <tr className = "hr_table_style_rows">
							          	    <td className = "hr_table_style_rows">Below Aerobic Range</td>
							          	    <td className = "hr_table_style_rows">{(this.state.below_aerobic_range)}</td>
							          	    <td className = "hr_table_style_rows">{this.renderTime(this.state.below_aerobic_zone)}</td>
							          	    <td className = "hr_table_style_rows">{this.renderpercentage(this.state.percent_below_aerobic)}</td>
						          	    </tr>
						          	    <tr className = "hr_table_style_rows">
							          	    <td className = "hr_table_style_rows">Heart Rate Not Recorded</td>
							          	    <td className = "hr_table_style_rows">{(this.state.empty)}</td>
							          	    <td className = "hr_table_style_rows">{this.renderTime(this.state.hrr_not_recorded)}</td>
							          	    <td className = "hr_table_style_rows">{this.renderpercentage(this.state.percent_hrr_not_recorded)}</td>
						          	    </tr>
						          	    <tr className = "hr_table_style_rows">
							          	    <td className = "hr_table_style_rows">Total Workout Duration</td>
											<td className = "hr_table_style_rows">{(this.state.empty)}</td>
							          	    <td className = "hr_table_style_rows">{this.renderTime(this.state.total_time)}</td>
							          	    <td className = "hr_table_style_rows">{this.renderpercentage(this.state.total_percent)}</td>
						          	    </tr>
					          	    </tbody>
				          	    </table>   
			          	    </div>
		          	    </div>
		          	  
			      	    <div className = "row justify-content-center hr_table_padd">
							<div className = "table table-responsive">
				          	    <table className = "table table-striped table-bordered ">
									<tr>
										<th>Date</th>
										<th>Workout Type</th>
										<th>Duration</th>
										<th>Average Heartrate</th>
										<th>Max Heartrate</th>
										<th>Exercise Steps</th>
										<th>Duration in Aerobic Range (hh:mm:ss)</th>
										<th>% Aerobic</th>
										<th>Duration in Anaerobic Range (hh:mm:ss)</th>
										<th>% Anaerobic</th>
										<th>Duration Below Aerobic Range (hh:mm:ss)</th>
										<th>% Below Aerobic</th>
										<th>Heart Rate Not recorded (hh:mm:ss)</th>
										<th>% Heart Rate Not recorded</th>
										
									</tr>
									<tbody>
										{this.renderTable(this.state.aa_data)}
									</tbody>
								</table>
							</div>
						</div>
						<div className = "row justify-content-center hr_table_padd">
		          	    	<div className = "table table-responsive">
			          	    	<table className = "table table-striped table-bordered ">
				          	    	<thead>
					          	    	<th>Heart Rate Zone Low End</th>
					          	    	<th>Heart Rate Zone High End</th>
					          	    	<th>Classification</th>
					          	    	<th>Time in Zone(hh:mm:ss)</th>
					          	    	<th>% of Total Duration in Zone</th>
				          	    	</thead>
				          	    	<tbody>
				          	    	{this.renderHrrZoneTable(this.state.hr_zone)}
				          	    	<tr></tr>
				          	    	</tbody>
			          	    	</table>
		          	    	</div>
          	    		</div>
		          	  	{this.renderAerobicSelectedDateFetchOverlay()}
		          	</div>
				</div>
		)
	}
}

export default HeartRate;
