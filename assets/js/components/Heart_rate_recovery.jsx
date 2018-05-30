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
import {renderAerobicSelectedDateFetchOverlay} from './dashboard_healpers'; 
import Workout from './workout_stats';
import {fetchWorkoutData,fetchAaWorkoutData} from '../network/workout';





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
		this.renderTable1 = this.renderTable1.bind(this);
		this.successWorkout =this.successWorkout.bind(this);
		this.errorWorkout =this.errorWorkout.bind(this);
		this.successWorkout1 = this.successWorkout1.bind(this);
		this.renderAerobicSelectedDateFetchOverlay = renderAerobicSelectedDateFetchOverlay.bind(this);
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
			data1:{},
			data:{},
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
	errorHeartRate(error){
		console.log(error.message);
		this.setState({
			fetching_aerobic:false,
		})
	}
	successWorkout(data){
	
		this.setState({
			data1:data.data,
		});
	}
	successWorkout1(data){	
		
		this.setState({
			data:data.data
		});
	}
	
	errorWorkout(error){
		console.log(error.message);
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
			time = value;
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
			fetching_aerobic:true,
		},()=>{
			fetchHeartRateData(this.successHeartRate,this.errorHeartRate,this.state.selectedDate);
			fetchWorkoutData(this.successWorkout,this.errorWorkout,this.state.selectedDate);
			fetchAaWorkoutData(this.successWorkout1,this.errorWorkout,this.state.selectedDate);
		});
		
	}
	renderTable(data){
		
		var td_rows = [];
		let keys = ["date","workout_type","duration","average_heart_rate","max_heart_rate","steps"];
		for(let[key1,value] of Object.entries(data)){
			let td_values = [];
			for(let key of keys){
				if(key == "duration"){
					let keyvalue = this.renderTime(value[key]);
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
	renderTable1(data){
		var td_rows = [];
		let keys = ["aerobic_zone","percent_aerobic","anaerobic_zone","percent_anaerobic","below_aerobic_zone","percent_below_aerobic"];
		for(let[key1,value] of Object.entries(data)){
			let td_values = [];
			for(let key of keys){
				if(key == "aerobic_zone"){
					let keyvalue = this.renderTime(value[key]);
					 td_values.push(<td>{keyvalue}</td>);	
				}
				else if(key == "anaerobic_zone"){
				let keyvalue = this.renderTime(value[key]);
				td_values.push(<td>{keyvalue}</td>);
				}
				else if(key == "below_aerobic_zone"){
				let keyvalue = this.renderTime(value[key]);
				td_values.push(<td>{keyvalue}</td>);
				}
				else{
					 let keyvalue = this.renderpercentage(value[key]);
					 td_values.push(<td>{keyvalue}</td>);
				}
			}
			td_rows.push(<tr>{td_values}</tr>);
		}
		return td_rows;
	}
	componentDidMount(){
		this.setState({
			fetching_aerobic:false,
		});
		fetchHeartRateData(this.successHeartRate,this.errorHeartRate,this.state.selectedDate);
		// fetchWorkoutData(this.successWorkout,this.errorWorkout,this.state.selectedDate);
		// fetchAaWorkoutData(this.successWorkout1,this.errorWorkout,this.state.selectedDate);
	}
	render(){
		const {fix} = this.props;
		return(
			<div className = "container-fluid">
		    <NavbarMenu title = {<span style = {{fontSize:"22px"}}>Heartrate Aerobic/Anaerobic Ranges</span>} />
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
          	  
          	   <div className = "row">
					<div className= "col-md-6" style = {{paddingLeft:"50px"}}>
					 <div className = "table table-responsive">
		          	    <table className = "table table-striped table-bordered ">
							<tr>
							<th>Date</th>
							<th>Workout Type</th>
							<th>Duration</th>
							<th>Average Heartrate</th>
							<th>Max Heartrate</th>
							<th>Steps</th>
							</tr>
							<tbody>
								{this.renderTable(this.state.data1)}
								</tbody>
						</table>
					</div>
					</div>
					
					<div className= "col-md-6" style = {{paddingRight:"50px"}}>
					 <div className = "table table-responsive">
		          	    <table className = "table table-striped table-bordered ">
							<tr>
							<th>Duration in Aerobic Range (hh:mm:ss)</th>
							<th>% Aerobic</th>
							<th>Duration in Anaerobic Range (hh:mm:ss)</th>
							<th>% Anaerobic</th>
							<th>Duration Below Aerobic Range (hh:mm:ss)</th>
							<th>% Below Aerobic</th>
							</tr>
							<tbody>
								{this.renderTable1(this.state.data)}
								</tbody>
						</table>
					</div>
					</div>
				
					</div>
          	  {this.renderAerobicSelectedDateFetchOverlay()}
          	  </div>
			</div>
		)
	}
}

export default HeartRate;
