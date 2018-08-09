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
import fetchHeartData from '../network/heart_cal';
import {fetchHeartRefreshData} from '../network/heart_cal';
import {renderHrrSelectedDateFetchOverlay} from './dashboard_healpers';

axiosRetry(axios, { retries: 3});
var CalendarWidget = require('react-calendar-widget');
var ReactDOM = require('react-dom');

class HeartRateCal extends Component{
	constructor(props) {
		    super(props);
		    this.state = {
					    	calendarOpen:false,
						    isOpen:false,
						    fetching_hrr:false,
						    selectedDate:new Date(),
				   			"Did_you_measure_HRR":"",
							"Did_heartrate_reach_99":"",
							"time_99":"",
							"HRR_start_beat":"",
							"lowest_hrr_1min":"",
							"No_beats_recovered":"",

							"end_time_activity":"",
							"diff_actity_hrr":"",
							"HRR_activity_start_time":"",
							"end_heartrate_activity":"",
							"heart_rate_down_up":"",
							"pure_1min_heart_beats":"",
							"pure_time_99":"",

							"no_fitfile_hrr_reach_99":"",
							"no_fitfile_hrr_time_reach_99":"",
							"time_heart_rate_reached_99":"",
							"lowest_hrr_no_fitfile":"",
							"no_file_beats_recovered":"",

							"offset":"",
		   				}
		    this.toggleCalendar = this.toggleCalendar.bind(this);
			this.toggle = this.toggle.bind(this);
			this.successHeart = this.successHeart.bind(this);
			this.errorHeart = this.errorHeart.bind(this);
			this.processDate = this.processDate.bind(this);
			this.renderTime = this.renderTime.bind(this);
			this.renderHrrSelectedDateFetchOverlay = renderHrrSelectedDateFetchOverlay.bind(this);
			this.renderSecToMin = this.renderSecToMin.bind(this);
			this.renderNoworkout = this.renderNoworkout.bind(this);
			this.captilizeYes = this.captilizeYes.bind(this);
			this.hrrRefreshData = this.hrrRefreshData.bind(this);
			this.renderAddDate = this.renderAddDate.bind(this);
			this.renderRemoveDate = this.renderRemoveDate.bind(this);
  	}

	successHeart(data){
	  	this.setState({
	  	    		fetching_hrr:false,
	  	   			Did_you_measure_HRR:data.data.Did_you_measure_HRR,
					Did_heartrate_reach_99:data.data.Did_heartrate_reach_99,
					time_99:data.data.time_99,
					HRR_start_beat:data.data.HRR_start_beat,
					lowest_hrr_1min:data.data.lowest_hrr_1min,
					No_beats_recovered:data.data.No_beats_recovered,

					end_time_activity:data.data.end_time_activity,
					diff_actity_hrr:data.data.diff_actity_hrr,
					HRR_activity_start_time:data.data.HRR_activity_start_time,
					end_heartrate_activity:data.data.end_heartrate_activity,
					heart_rate_down_up:data.data.heart_rate_down_up,
					pure_1min_heart_beats:data.data.pure_1min_heart_beats,
					pure_time_99:data.data.pure_time_99,

					"no_fitfile_hrr_time_reach_99":data.data.no_fitfile_hrr_time_reach_99,
					no_fitfile_hrr_reach_99:data.data.no_fitfile_hrr_reach_99,
					time_heart_rate_reached_99:data.data.time_heart_rate_reached_99,
					lowest_hrr_no_fitfile:data.data.lowest_hrr_no_fitfile,
					no_file_beats_recovered:data.data.no_file_beats_recovered,

					offset:data.data.offset,
	  	});
	}

    errorHeart(error){
		console.log(error.message);
		this.setState({
			fetching_hrr:false,
		})
    }
    renderAddDate(){
		var today = this.state.selectedDate;
		var tomorrow = moment(today).add(1, 'days');
		this.setState({
			selectedDate:tomorrow.toDate(),
			fetching_hrr:true,
			"Did_you_measure_HRR":"",
			"Did_heartrate_reach_99":"",
			"time_99":"",
			"HRR_start_beat":"",
			"lowest_hrr_1min":"",
			"No_beats_recovered":"",

			"end_time_activity":"",
			"diff_actity_hrr":"",
			"HRR_activity_start_time":"",
			"end_heartrate_activity":"",
			"heart_rate_down_up":"",
			"pure_1min_heart_beats":"",
			"pure_time_99":"",

			"no_fitfile_hrr_reach_99":"",
			"no_fitfile_hrr_time_reach_99":"",
			"time_heart_rate_reached_99":"",
			"lowest_hrr_no_fitfile":"",
			"no_file_beats_recovered":"",

			"offset":"",
		},()=>{
			fetchHeartData(this.successHeart,this.errorHeart,this.state.selectedDate);
		});
	}
	renderRemoveDate(){
		var today = this.state.selectedDate;
		var tomorrow = moment(today).subtract(1, 'days');
		this.setState({
			selectedDate:tomorrow.toDate(),
			fetching_hrr:true,
			"Did_you_measure_HRR":"",
			"Did_heartrate_reach_99":"",
			"time_99":"",
			"HRR_start_beat":"",
			"lowest_hrr_1min":"",
			"No_beats_recovered":"",

			"end_time_activity":"",
			"diff_actity_hrr":"",
			"HRR_activity_start_time":"",
			"end_heartrate_activity":"",
			"heart_rate_down_up":"",
			"pure_1min_heart_beats":"",
			"pure_time_99":"",

			"no_fitfile_hrr_reach_99":"",
			"no_fitfile_hrr_time_reach_99":"",
			"time_heart_rate_reached_99":"",
			"lowest_hrr_no_fitfile":"",
			"no_file_beats_recovered":"",

			"offset":"",
		},()=>{
			fetchHeartData(this.successHeart,this.errorHeart,this.state.selectedDate);
		});
	}
    processDate(selectedDate){
		this.setState({
			selectedDate:selectedDate,
			calendarOpen:!this.state.calendarOpen,
			fetching_hrr:true,
			"Did_you_measure_HRR":"",
			"Did_heartrate_reach_99":"",
			"time_99":"",
			"HRR_start_beat":"",
			"lowest_hrr_1min":"",
			"No_beats_recovered":"",

			"end_time_activity":"",
			"diff_actity_hrr":"",
			"HRR_activity_start_time":"",
			"end_heartrate_activity":"",
			"heart_rate_down_up":"",
			"pure_1min_heart_beats":"",
			"pure_time_99":"",

			"no_fitfile_hrr_reach_99":"",
			"no_fitfile_hrr_time_reach_99":"",
			"time_heart_rate_reached_99":"",
			"lowest_hrr_no_fitfile":"",
			"no_file_beats_recovered":"",

			"offset":"",
		},()=>{
			fetchHeartData(this.successHeart,this.errorHeart,this.state.selectedDate);
		});
		
	}
	hrrRefreshData(){
		this.setState({
			fetching_hrr:true,
		});
		fetchHeartRefreshData(this.successHeart,this.errorHeart,this.state.selectedDate);
	}
	componentDidMount(){
		this.setState({
			fetching_hrr:true,
		});
		fetchHeartData(this.successHeart,this.errorHeart,this.state.selectedDate);
	}

	captilizeYes(value){
		let cpatilize;
		if(value){
			cpatilize = value[0].toUpperCase()+value.slice(1);
	    }
		return cpatilize;
	}

	renderNoworkout(value){
		if(value == null || value == undefined || value == ""){
			value = "No Workout";
			value = value[0].toUpperCase()+value.slice(1);
		}
		else{
			value = value[0].toUpperCase()+value.slice(1);
		}
		return value;
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
  		var z;
  		if(value != null && value != "00:00:00"){
  			 z = moment.unix(value).format("hh:mm:ss a");
  		}
  		else if(value == "00:00:00"){
  			 z = "-";
  		}
  		return z
  	}

  	renderSecToMin(value){
  		let time;
  		if(value != null && value != "00:00" && value != undefined && value != "00:00:00"){
	  		let min = parseInt(value/60);
	  		let sec = (value % 60);
	  		if(sec < 10){
	  			time = min + ":0" + sec;
	  		}
	  		else{
	  			time = min + ":" + sec;
	  		}
	  	}
	  	else{
	  		time = "-"
	  	}
  		return time;
  	}
  	toggleCalendar(){
	    this.setState({
	    	calendarOpen:!this.state.calendarOpen
	    });
    }
  render(){
  	const {fix} = this.props;
  	return(
  		<div className = "container-fluid">
		        <NavbarMenu title = {"Heartrate Recovery"} />
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

	            {this.state.Did_you_measure_HRR == "yes"  &&
	            <div className = "row justify-content-center hr_table_padd">
	          	    <div className = "table table-responsive">
		          	    <table className = "table table-striped table-bordered ">
			          	    <thead className = "hr_table_style_rows">
				          	    <th className = "hr_table_style_rows">HRR Stats</th>
				          	    <th className = "hr_table_style_rows">{moment(this.state.selectedDate).format("MMM DD, YYYY")}</th>
			          	    </thead>  
			          	    <tbody>  
			          	    <tr className = "hr_table_style_rows">   
				          	    <td className = "hr_table_style_rows">Did you measure your heart rate recovery (HRR) after today’s aerobic workout?</td>    
				          	    <td className = "hr_table_style_rows">{this.captilizeYes(this.state.Did_you_measure_HRR)}</td>
			          	    </tr>

			          	    <tr className = "hr_table_style_rows">
				          	    <td className = "hr_table_style_rows">Did your heart rate go down to 99 beats per minute or lower?</td>
				          	    <td className = "hr_table_style_rows">{this.captilizeYes(this.state.Did_heartrate_reach_99)}</td>
			          	    </tr>

			          	    <tr className = "hr_table_style_rows">
				          	    <td className = "hr_table_style_rows">Duration (mm:ss) for Heart Rate Time to Reach 99</td>
				          	    <td className = "hr_table_style_rows">{this.renderSecToMin(this.state.time_99)}</td>
			          	    </tr>

			          	    <tr className = "hr_table_style_rows">
				          	    <td className = "hr_table_style_rows">HRR File Starting Heart Rate</td>
								<td className = "hr_table_style_rows">{this.state.HRR_start_beat}</td>
			          	    </tr>

			          	    <tr className = "hr_table_style_rows">
				          	    <td className = "hr_table_style_rows">Lowest Heart Rate Level in the 1st Minute</td>
				          	    <td className = "hr_table_style_rows">{this.state.lowest_hrr_1min}</td>
			          	    </tr>

			          	    <tr className = "hr_table_style_rows">
				          	    <td className = "hr_table_style_rows">Number of heart beats recovered in the first minute</td>
								<td className = "hr_table_style_rows">{this.state.No_beats_recovered}</td>
			          	    </tr>
			          	    </tbody>
		          	    </table>   
	          	   </div>
          	  </div>
          	}

          	{this.state.Did_you_measure_HRR == "yes" &&
          	  <div className = "row justify-content-center hr_table_padd">
	          	    <div className = "table table-responsive">
		          	    <table className = "table table-striped table-bordered ">
			          	    <thead className = "hr_table_style_rows">
				          	    <th className = "hr_table_style_rows">Other HRR Stats</th>
				          	    <th className = "hr_table_style_rows">{moment(this.state.selectedDate).format("MMM DD, YYYY")}</th>
			          	    </thead>  
			          	    <tbody>  
				          	    <tr className = "hr_table_style_rows">   
					          	    <td className = "hr_table_style_rows">End Time of Activity(hh:mm:ss)</td>    
					          	    <td className = "hr_table_style_rows">{this.renderTime(this.state.end_time_activity)}</td>
				          	    </tr>

				          	    <tr className = "hr_table_style_rows">
					          	    <td className = "hr_table_style_rows">Difference Between Activity End time and Hrr Start time(mm:ss)</td>
					          	    <td className = "hr_table_style_rows">{this.renderSecToMin(this.state.diff_actity_hrr)}</td>
				          	    </tr>

				          	    <tr className = "hr_table_style_rows">
					          	    <td className = "hr_table_style_rows">Hrr Start Time(hh:mm:ss)</td>
					          	    <td className = "hr_table_style_rows">{this.renderTime(this.state.HRR_activity_start_time)}</td>
				          	    </tr>

				          	    <tr className = "hr_table_style_rows">
					          	    <td className = "hr_table_style_rows">Heart Rate at End of Activity</td>
									<td className = "hr_table_style_rows">{this.state.end_heartrate_activity}</td>
				          	    </tr>

				          	     <tr className = "hr_table_style_rows">
					          	    <td className = "hr_table_style_rows">Heart rate beats your heart rate went down/(up) from end of workout file to start of HRR file</td>
					          	    <td className = "hr_table_style_rows">{"( " + this.state.heart_rate_down_up + " )"}</td>
				          	    </tr>

				          	    <tr className = "hr_table_style_rows">
					          	    <td className = "hr_table_style_rows">Pure 1 Minute HRR Beats Lowered</td>
									<td className = "hr_table_style_rows">{this.state.pure_1min_heart_beats}</td>
				          	    </tr>

				          	    <tr className = "hr_table_style_rows">
					          	    <td className = "hr_table_style_rows">Pure time to 99 (mm:ss)</td>
									<td className = "hr_table_style_rows">{this.renderSecToMin(this.state.pure_time_99)}</td>
				          	    </tr>
			          	    </tbody>
		          	    </table>   
	          	    </div>
          	  </div>
          	}

          	{(this.state.Did_you_measure_HRR == "no" || this.state.Did_you_measure_HRR == "" || this.state.Did_you_measure_HRR == "Heart Rate Data Not Provided") &&
          	    <div className = "row justify-content-center hr_table_padd">
	          	    <div className = "table table-responsive">
		          	    <table className = "table table-striped table-bordered ">
			          	    <thead className = "hr_table_style_rows">
				          	    <th className = "hr_table_style_rows">Hrr Automation When User Didn't Create HRR File</th>
				          	    <th className = "hr_table_style_rows">{moment(this.state.selectedDate).format("MMM DD, YYYY")}</th>
			          	    </thead>  
			          	    <tbody>  
				          	    <tr className = "hr_table_style_rows">
					          	    <td className = "hr_table_style_rows">End Time of Activity(hh:mm:ss)</td>
									<td className = "hr_table_style_rows">{this.renderTime(this.state.end_time_activity)}</td>
				          	    </tr>

				          	    <tr className = "hr_table_style_rows">
					          	    <td className = "hr_table_style_rows">Did you measure your heart rate recovery (HRR) after today’s aerobic workout?</td>
									<td className = "hr_table_style_rows">{this.renderNoworkout(this.state.Did_you_measure_HRR)}</td>
				          	    </tr>

				          	      <tr className = "hr_table_style_rows">
					          	    <td className = "hr_table_style_rows">Did your heart rate go down to 99 beats per minute or lower?</td>
									<td className = "hr_table_style_rows">{this.captilizeYes(this.state.no_fitfile_hrr_reach_99)}</td>
				          	    </tr>

				          	     <tr className = "hr_table_style_rows">
					          	    <td className = "hr_table_style_rows">Duration (mm:ss) for Heart Rate Time to Reach 99</td>
					          	    <td className = "hr_table_style_rows">{this.renderSecToMin(this.state.no_fitfile_hrr_time_reach_99)}</td>
				          	    </tr>

				          	    <tr className = "hr_table_style_rows">
					          	    <td className = "hr_table_style_rows">Time Heart Rate Reached 99 (hh:mm:ss)</td>
									<td className = "hr_table_style_rows">{this.renderTime(this.state.time_heart_rate_reached_99)}</td>
				          	    </tr>

				          	    <tr className = "hr_table_style_rows">
					          	    <td className = "hr_table_style_rows">HRR File Starting Heart Rate</td>
					          	    <td className = "hr_table_style_rows">{this.state.end_heartrate_activity}</td>
				          	    </tr>

				          	    <tr className = "hr_table_style_rows">
					          	    <td className = "hr_table_style_rows">Lowest Heart Rate Level in the 1st Minute</td>
									<td className = "hr_table_style_rows">{this.state.lowest_hrr_no_fitfile}</td>
				          	    </tr>

				          	    <tr className = "hr_table_style_rows">
					          	    <td className = "hr_table_style_rows">Number of heart beats recovered in the first minute</td>
									<td className = "hr_table_style_rows">{this.state.no_file_beats_recovered}</td>
				          	    </tr>
			          	    </tbody>
		          	    </table>   
	          	    </div>
          	    </div>
          	}
          	
          	{this.renderHrrSelectedDateFetchOverlay()}
  		</div>
  		);
    }
}
export default HeartRateCal;
