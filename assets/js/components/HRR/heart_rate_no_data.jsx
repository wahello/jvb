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
        Button,Popover,PopoverBody,Form,FormGroup,
        FormText,Label,Input, Modal, ModalHeader,
         ModalBody, ModalFooter} from 'reactstrap';
import {updateHeartData} from '../../network/heart_cal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import {renderHrrSelectedDateFetchOverlay} from '../dashboard_healpers';
import HeartRateCal from './heart_rate_calculation';


class No_Hrr_Data extends Component{

	getInitialState(props){
		
		let end_time = this.renderTime(props.hrr.end_time_activity);
		let end_time_split = null;
		let end_time_am_pm = null;
		let end_time_hour = null;
		let end_time_min = null;
		let end_time_activity_sec = null;
		let end_time_activity_am_pm = null;

		if(end_time != null && end_time != "" && end_time != undefined) {
			end_time_split = end_time.split(":");
			end_time_am_pm = end_time_split[2].split(" ");
			end_time_hour = end_time_split[0];
			end_time_min = end_time_split[1];
			end_time_activity_sec = end_time_am_pm[0];
			end_time_activity_am_pm = end_time_am_pm[1];
		}
		
		let Did_you_measure_HRR = props.hrr.Did_you_measure_HRR;
		let no_fitfile_hrr_reach_99 = props.hrr.no_fitfile_hrr_reach_99;
		let no_fitfile_hrr_time_reach_99 = this.renderSecToMin(props.hrr.no_fitfile_hrr_time_reach_99);
		let no_fitfile_hrr_time_reach_99_splite = null;
		let no_fitfile_hrr_time_reach_99_min = null;
		let no_fitfile_hrr_time_reach_99_sec = null;

		if(no_fitfile_hrr_time_reach_99 != null && no_fitfile_hrr_time_reach_99 != "" && no_fitfile_hrr_time_reach_99 != undefined) {
			
			no_fitfile_hrr_time_reach_99_splite = no_fitfile_hrr_time_reach_99.split(":");
			no_fitfile_hrr_time_reach_99_min = no_fitfile_hrr_time_reach_99[0];
			no_fitfile_hrr_time_reach_99_sec = no_fitfile_hrr_time_reach_99[1];
		}
		let time_heart_rate_reached_99 = this.renderTime(props.hrr.time_heart_rate_reached_99);
		let time_heart_rate_reached_99_split = null;
		let time_heart_rate_reached_99_am_pm_split = null;
		let time_heart_rate_reached_99_am_pm = null;
		let time_heart_rate_reached_99_hour = null;
		let time_heart_rate_reached_99_min = null;
		let time_heart_rate_reached_99_sec = null;

		if(time_heart_rate_reached_99 != null && time_heart_rate_reached_99 != "" && time_heart_rate_reached_99 != undefined) {
			time_heart_rate_reached_99_split = time_heart_rate_reached_99.split(":");
			time_heart_rate_reached_99_am_pm_split = time_heart_rate_reached_99_split[2].split(" ");
			time_heart_rate_reached_99_hour = time_heart_rate_reached_99_split[0];
			time_heart_rate_reached_99_min = time_heart_rate_reached_99_split[1];
			time_heart_rate_reached_99_am_pm = time_heart_rate_reached_99_am_pm_split[1];
			time_heart_rate_reached_99_sec = time_heart_rate_reached_99_am_pm_split[0];
		}
		
		let end_heartrate_activity = props.hrr.end_heartrate_activity;
		let lowest_hrr_no_fitfile = props.hrr.lowest_hrr_no_fitfile;
		let no_file_beats_recovered = props.hrr.no_file_beats_recovered;

			
			
      	const initialState = {
		 	editable:false,
		 	editable_did_you_measure_HRR:false,
		 	editable_end_time_activity:false,
		 	editable_no_fitfile_hrr_reach_99:false,
		 	editable_no_fitfile_hrr_time_reach_99:false,
		 	editable_time_heart_rate_reached_99:false,
		 	editable_lowest_hrr_no_fitfile:false,
		 	editable_no_file_beats_recovered:false,
		 	end_time_activity_hour:end_time_hour,
			end_time_activity_min:end_time_min,
			end_time_activity_sec:end_time_activity_sec,
			end_time_activity_am_pm:end_time_activity_am_pm,
			Did_you_measure_HRR:Did_you_measure_HRR,
			no_fitfile_hrr_reach_99:no_fitfile_hrr_reach_99,
			no_fitfile_hrr_time_reach_99_min:no_fitfile_hrr_time_reach_99_min,
			no_fitfile_hrr_time_reach_99_sec:no_fitfile_hrr_time_reach_99_sec,
			time_heart_rate_reached_99_hour:time_heart_rate_reached_99_hour,
			time_heart_rate_reached_99_min:time_heart_rate_reached_99_hour,
			time_heart_rate_reached_99_sec:time_heart_rate_reached_99_sec,
			time_heart_rate_reached_99_am_pm:time_heart_rate_reached_99_am_pm,
			end_heartrate_activity:props.hrr.end_heartrate_activity,
			lowest_hrr_no_fitfile:props.hrr.lowest_hrr_no_fitfile,
			no_file_beats_recovered:props.hrr.no_file_beats_recovered,
			end_time_activity:props.hrr.end_time_activity,
			no_fitfile_hrr_time_reach_99:props.hrr.no_fitfile_hrr_time_reach_99,
		 }
		 return initialState;
    }

	constructor(props){
		super(props);
		this.state = this.getInitialState(props);
	 	this.renderTime = this.renderTime.bind(this);
		this.renderSecToMin = this.renderSecToMin.bind(this);
		this.renderNoworkout = this.renderNoworkout.bind(this);
		this.captilizeYes = this.captilizeYes.bind(this);
		this.createSleepDropdown = this.createSleepDropdown.bind(this);
		this.editEndTimeActivity = this.editEndTimeActivity.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.renderEndTimeActivity = this.renderEndTimeActivity.bind(this);
	 	this.editToggleDidyouWorkout = this.editToggleDidyouWorkout.bind(this);
	 	this.editNoFitfileHrrReach99 = this.editNoFitfileHrrReach99.bind(this);
	 	this.editNoFitfileHrrTimeReach99 = this.editNoFitfileHrrTimeReach99.bind(this);
	 	this.renderNoFitfileHrrTimeReach99 = this.renderNoFitfileHrrTimeReach99.bind(this);
	 	this.editTimeHeartRateReached99 = this.editTimeHeartRateReached99.bind(this);
	 	this.renderTimeHeartRateReached99 = this.renderTimeHeartRateReached99.bind(this);
	 	this.editEndHeartrateActivity = this.editEndHeartrateActivity.bind(this);
	 	this.editLowestHrrNoFitfile = this.editLowestHrrNoFitfile.bind(this);
	 	this.editNoFileBeatsRecovered = this.editNoFileBeatsRecovered.bind(this);
	 	this.updateData = this.updateData.bind(this);
	 	this.getDTMomentObj = this.getDTMomentObj.bind(this);
	 	this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
	 	this.successHeart = this.successHeart.bind(this);
		this.errorHeart = this.errorHeart.bind(this);
		this.renderHrrSelectedDateFetchOverlay = renderHrrSelectedDateFetchOverlay.bind(this);
	    //this.update_toggle = this.update_toggle.bind(this); 
	}
	
	forceUpdateHandler(){
	    this.forceUpdate();
	};
	componentWillReceiveProps(nextProps) {
		let dateSeleted_nextProps = moment(nextProps.hrr.created_at).format("DD-MM-YYYY");
		let dateSelected_thisProps = moment(this.props.hrr.created_at).format("DD-MM-YYYY");

		if( dateSeleted_nextProps!=dateSelected_thisProps){
            
			let end_time = this.renderTime(nextProps.hrr.end_time_activity);
			let end_time_split = null;
			let end_time_am_pm = null;
			let end_time_hour = null;
			let end_time_min = null;
			let end_time_activity_sec = null;
			let end_time_activity_am_pm = null;
			if(end_time != null && end_time != "" && end_time != undefined) {
				end_time_split = end_time.split(":");
				end_time_am_pm = end_time_split[2].split(" ");
				end_time_hour = end_time_split[0];
				end_time_min = end_time_split[1];
				end_time_activity_sec = end_time_am_pm[0];
				end_time_activity_am_pm = end_time_am_pm[1];
			}
			
			let Did_you_measure_HRR = nextProps.hrr.Did_you_measure_HRR;
			let no_fitfile_hrr_reach_99 = nextProps.hrr.no_fitfile_hrr_reach_99;
			let no_fitfile_hrr_time_reach_99 = this.renderSecToMin(nextProps.hrr.no_fitfile_hrr_time_reach_99);
			let no_fitfile_hrr_time_reach_99_splite = null;
			let no_fitfile_hrr_time_reach_99_min = null;
			let no_fitfile_hrr_time_reach_99_sec = null;

			if(no_fitfile_hrr_time_reach_99 != null && no_fitfile_hrr_time_reach_99 != "" && no_fitfile_hrr_time_reach_99 != undefined) {
				
				no_fitfile_hrr_time_reach_99_splite = no_fitfile_hrr_time_reach_99.split(":");
				no_fitfile_hrr_time_reach_99_min = no_fitfile_hrr_time_reach_99_splite[0];
				no_fitfile_hrr_time_reach_99_sec = no_fitfile_hrr_time_reach_99_splite[1];
			}
			let time_heart_rate_reached_99 = this.renderTime(nextProps.hrr.time_heart_rate_reached_99);
			let time_heart_rate_reached_99_split = null;
			let time_heart_rate_reached_99_am_pm_split = null;
			let time_heart_rate_reached_99_am_pm = null;
			let time_heart_rate_reached_99_hour = null;
			let time_heart_rate_reached_99_min = null;
			let time_heart_rate_reached_99_sec = null;

			if(time_heart_rate_reached_99 != null && time_heart_rate_reached_99 != "" && time_heart_rate_reached_99 != undefined) {
				time_heart_rate_reached_99_split = time_heart_rate_reached_99.split(":");
				time_heart_rate_reached_99_am_pm_split = time_heart_rate_reached_99_split[2].split(" ");
				time_heart_rate_reached_99_hour = time_heart_rate_reached_99_split[0];
				time_heart_rate_reached_99_min = time_heart_rate_reached_99_split[1];
				time_heart_rate_reached_99_am_pm = time_heart_rate_reached_99_am_pm_split[1];
				time_heart_rate_reached_99_sec = time_heart_rate_reached_99_am_pm_split[0];
			}
			
			let end_heartrate_activity = nextProps.hrr.end_heartrate_activity;
			let lowest_hrr_no_fitfile = nextProps.hrr.lowest_hrr_no_fitfile;
			let no_file_beats_recovered = nextProps.hrr.no_file_beats_recovered;
			this.setState({
					editable:nextProps.hrr.editable,
					editable_did_you_measure_HRR:false,
					editable_end_time_activity:false,
					editable_no_fitfile_hrr_reach_99:false,
					editable_no_fitfile_hrr_time_reach_99:false,
					editable_time_heart_rate_reached_99:false,
					editable_lowest_hrr_no_fitfile:false,
					editable_no_file_beats_recovered:false,
					end_time_activity_hour:end_time_hour,
					end_time_activity_min:end_time_min,
					end_time_activity_sec:end_time_activity_sec,
					end_time_activity_am_pm:end_time_activity_am_pm,
					Did_you_measure_HRR:Did_you_measure_HRR,
					no_fitfile_hrr_reach_99:no_fitfile_hrr_reach_99,
					no_fitfile_hrr_time_reach_99_min:no_fitfile_hrr_time_reach_99_min,
					no_fitfile_hrr_time_reach_99_sec:no_fitfile_hrr_time_reach_99_sec,
					time_heart_rate_reached_99_hour:time_heart_rate_reached_99_hour,
					time_heart_rate_reached_99_min:time_heart_rate_reached_99_min,
					time_heart_rate_reached_99_sec:time_heart_rate_reached_99_sec,
					time_heart_rate_reached_99_am_pm:time_heart_rate_reached_99_am_pm,
					end_heartrate_activity:end_heartrate_activity,
					lowest_hrr_no_fitfile:lowest_hrr_no_fitfile,
					no_file_beats_recovered:no_file_beats_recovered,
					end_time_activity:nextProps.hrr.end_time_activity,
					no_fitfile_hrr_time_reach_99:nextProps.hrr.no_fitfile_hrr_time_reach_99,
			       
				});
        }  
	  }
	  
	// update_toggle(){
	// 	this.setState({
	// 		update_toggle:!this.state.update_toggle
	// 	})}
  	/*componentDidUpdate(nextProps) {
  		console.log( 'INSIDE ComponentDidUpdate ======> this.state ::: ' + JSON.stringify( this.state ) );
  		console.log( 'INSIDE ComponentDidUpdate ======> this.props ::: ' + JSON.stringify( this.props ) );
  		
	  }*/
	editEndTimeActivity(){
		this.setState({
			editable_end_time_activity:!this.state.editable_end_time_activity,
		})
	}
	editToggleDidyouWorkout(){
  		this.setState({
  			editable_did_you_measure_HRR:!this.state.editable_did_you_measure_HRR
  		});
	}
	editNoFitfileHrrReach99(){
		this.setState({
			editable_no_fitfile_hrr_reach_99:!this.state.editable_no_fitfile_hrr_reach_99
		})
	}
	editNoFitfileHrrTimeReach99(){
		this.setState({
			editable_no_fitfile_hrr_time_reach_99:!this.state.editable_no_fitfile_hrr_time_reach_99
		})
	}
	editTimeHeartRateReached99(){
		this.setState({
			editable_time_heart_rate_reached_99:!this.state.editable_time_heart_rate_reached_99
		})
	}
	editEndHeartrateActivity(){
		this.setState({
			editable_end_heartrate_activity:!this.state.editable_end_heartrate_activity
		})
	}
	editLowestHrrNoFitfile(){
		this.setState({
			editable_lowest_hrr_no_fitfile:!this.state.editable_lowest_hrr_no_fitfile
		})
	}
	editNoFileBeatsRecovered(){
		this.setState({
			editable_no_file_beats_recovered:!this.state.editable_no_file_beats_recovered
		})
	}
	renderTimeHeartRateReached99(){
		this.setState({
			editable_time_heart_rate_reached_99:!this.state.editable_time_heart_rate_reached_99
		})
	}
	renderNoFitfileHrrTimeReach99(){
		this.setState({
			editable_no_fitfile_hrr_time_reach_99:!this.state.editable_no_fitfile_hrr_time_reach_99
		})
	}
	renderEndTimeActivity(){
		this.setState({
			editable_end_time_activity:!this.state.editable_end_time_activity
		})
	}
	

	createSleepDropdown(start_num , end_num, mins=false, step=1){
	    let elements = [];
	    let i = start_num;
	    while(i<=end_num){
	      let j = (mins && i < 10) ? "0"+i : i;
	      elements.push(<option key={j} value={j}>{j}</option>);
	      i=i+step;
	    }
	    return elements;
	}
	handleChange(event){
	  	const target = event.target;
	  	const value = target.value;	
	  	const name = target.name;
	  	this.setState({
			[name]: value},
			()=>{
				if(target.name=='Did_you_measure_HRR'){
					this.setState({
						editable_did_you_measure_HRR:!this.state.editable_did_you_measure_HRR
  					});
				}
				else if(target.name=='no_fitfile_hrr_reach_99'){
					this.setState({
						editable_no_fitfile_hrr_reach_99:!this.state.editable_no_fitfile_hrr_reach_99
					})
				}
				else if(target.name=='end_heartrate_activity'){
					this.setState({
						editable_end_heartrate_activity:!this.state.editable_end_heartrate_activity
					})
				}
				else if(target.name=='lowest_hrr_no_fitfile'){
					this.setState({
						editable_lowest_hrr_no_fitfile:!this.state.editable_lowest_hrr_no_fitfile
					})
				}
				else if(target.name=='no_file_beats_recovered'){
					this.setState({
						editable_no_file_beats_recovered:!this.state.editable_no_file_beats_recovered
					})
				}
		});
	}
	renderTime(value){
  		var z;
  		if(value != null && value != "00:00:00" && value != ""){
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
	captilizeYes(value){
		let cpatilize;
		if(value){
			cpatilize = value[0].toUpperCase()+value.slice(1);
	    }
		return cpatilize;
	}
	getDTMomentObj(hour,min,sec,am_pm){
	  hour = hour ? parseInt(hour) : 0;
	  min = min ? parseInt(min) : 0;
	  sec = sec ? parseInt(sec): 0;

	  if(am_pm == 'am' && hour && hour == 12){
	    hour = 0
	  }
	  if (am_pm == 'pm' && hour && hour != 12){
	    hour = hour + 12;
	  }

	  let sleep_bedtime_dt = moment({ 
	    hour :hour,
	    minute :min,
	    second :sec
	  });
	  return sleep_bedtime_dt;
}
	successHeart(data){
		toast.info("Your HRR stats have been updated successfully",{
	          className:"dark"
	    });
	  	this.setState({
	  	    		fetching_hrr:false,
	  	    		editable:false,
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
			
	                use_updated_hrr:data.data.use_updated_hrr,

					no_fitfile_hrr_time_reach_99:data.data.no_fitfile_hrr_time_reach_99,
					no_fitfile_hrr_reach_99:data.data.no_fitfile_hrr_reach_99,
					time_heart_rate_reached_99:data.data.time_heart_rate_reached_99,
					lowest_hrr_no_fitfile:data.data.lowest_hrr_no_fitfile,
					no_file_beats_recovered:data.data.no_file_beats_recovered,

					offset:data.data.offset,
					created_at:data.data.created_at
	  	});
	  	this.props.HRR_measured(data.data.Did_you_measure_HRR);
	}
	errorHeart(error){
		console.log(error.message); 
		this.setState({
			fetching_hrr:false,
		})
    }

	updateData(){
		let endTimeActivity = this.getDTMomentObj(
  				this.state.end_time_activity_hour,
				this.state.end_time_activity_min,
				this.state.end_time_activity_sec,
				this.state.end_time_activity_am_pm,
  				);
		let timeHeartRateReach99 = this.getDTMomentObj(
  				this.state.time_heart_rate_reached_99_hour,
				this.state.time_heart_rate_reached_99_min,
				this.state.time_heart_rate_reached_99_sec,
				this.state.time_heart_rate_reached_99_am_pm,
  				)
		let no_fitfile_hrr_time_reach_99_min = parseInt(this.state.no_fitfile_hrr_time_reach_99_min) * 60;
		let no_fitfile_hrr_time_reach_99_sec = parseInt(this.state.no_fitfile_hrr_time_reach_99_sec);
		let no_fitfile_hrr_time_reach_99 = no_fitfile_hrr_time_reach_99_min + no_fitfile_hrr_time_reach_99_sec;
		this.setState({
			fetching_hrr:true,
			"end_time_activity":endTimeActivity.utc().valueOf(),
			"Did_you_measure_HRR":this.state.Did_you_measure_HRR,
			"no_fitfile_hrr_reach_99":this.state.no_fitfile_hrr_reach_99,
			"no_fitfile_hrr_time_reach_99":no_fitfile_hrr_time_reach_99,
			"time_heart_rate_reached_99":timeHeartRateReach99.utc().valueOf(),
			"end_heartrate_activity":this.state.end_heartrate_activity,
			"lowest_hrr_no_fitfile":this.state.lowest_hrr_no_fitfile,
			"no_file_beats_recovered":this.state.no_file_beats_recovered,			
			"use_updated_hrr":true
		},() => {
  			this.props.updateText(this.state.use_updated_hrr);
			let data = {
				"end_time_activity":endTimeActivity.utc().valueOf(),
				"Did_you_measure_HRR":this.state.Did_you_measure_HRR,
				"no_fitfile_hrr_reach_99":this.state.no_fitfile_hrr_reach_99,
				"no_fitfile_hrr_time_reach_99":no_fitfile_hrr_time_reach_99,
				"time_heart_rate_reached_99":timeHeartRateReach99.utc().valueOf(),
				"end_heartrate_activity": parseInt(this.state.end_heartrate_activity),
				"lowest_hrr_no_fitfile": parseInt(this.state.lowest_hrr_no_fitfile),
				"no_file_beats_recovered": parseInt(this.state.no_file_beats_recovered),
				"use_updated_hrr":this.state.use_updated_hrr,
				"include_hrr":this.props.shouldIncludeHRR,
				
			}
		    console.log(data,"data")
			updateHeartData(data, this.props.selectedDate, this.successHeart, this.errorHeart);
			
		   
		});
			
	}
	render(){
		return(
				<div>
				 	<div className = "row justify-content-center hr_table_padd">
		          	    <div className = "table table-responsive">
			          	    <table className = "table table-striped table-bordered ">
				          	    <thead className = "hr_table_style_rows">
					          	    <th className = "hr_table_style_rows">Hrr Automation When User Didn't Create HRR File</th>
					          	    <th className = "hr_table_style_rows">{moment(this.props.selectedDate).format("MMM DD, YYYY")}</th>
				          	    </thead>  
				          	    <tbody>  
					          	    <tr className = "hr_table_style_rows">
						          	    <td className = "hr_table_style_rows">End Time of Activity(hh:mm:ss)</td>
										<td className = "hr_table_style_rows">
											 {this.state.editable_end_time_activity ?
					  						<Modal isOpen={this.state.editable_end_time_activity}  className={this.props.className}>
					      					<ModalHeader toggle={this.editEndTimeActivity}>End Time Activity</ModalHeader>
					          				<ModalBody>
					            				<div className = "row justify-content-center">
					            				<span>
								          	    	<Input
								          	    	style = {{minWidth:"80px"}}
					                                    type="select"
					                                    className="custom-select form-control" 
					                                    name="end_time_activity_hour"
					                                    value={this.state.end_time_activity_hour}                                       
					                                    onChange={this.handleChange}
					                                    >
					                                    {this.createSleepDropdown(0,12,true)}
					                            	</Input>
					                            </span>
					            				<span style = {{marginLeft:"30px"}}>
								          	    	<Input
								          	    	style = {{minWidth:"80px"}}
					                                    type="select"
					                                    className="custom-select form-control" 
					                                    name="end_time_activity_min"
					                                    value={this.state.end_time_activity_min}                                       
					                                    onChange={this.handleChange}
					                                    >
					                                    {this.createSleepDropdown(0,59,true)}
					                            	</Input>
					                            </span>
					                            <span style = {{marginLeft:"30px"}}>
					                            	<Input
								          	    		style = {{minWidth:"80px"}}
							                            type="select"
							                            className="custom-select form-control" 
							                            name="end_time_activity_sec"
							                            value={this.state.end_time_activity_sec}                                       
							                            onChange={this.handleChange}
							                            >
							                            {this.createSleepDropdown(0,59,true)}
					                            	</Input>
					                            </span>
					                             <span style = {{marginLeft:"30px"}}>
					                            	<Input
								          	    		style = {{minWidth:"80px"}}
							                            type="select"
							                            className="custom-select form-control" 
							                            name="end_time_activity_am_pm"
							                            value={this.state.end_time_activity_am_pm}                                       
							                            onChange={this.handleChange}
							                            >
							                            <option value="">AM/PM</option>                                 
				                                    	<option value="am">AM</option>
				                                        <option value="pm">PM</option>
					                            	</Input>
					                            </span>
					                            </div>
					      					</ModalBody>
					      					<ModalFooter>
					        				<Button color="primary" onClick={this.renderEndTimeActivity}>Save</Button>
					            			<Button color="secondary" onClick={this.editEndTimeActivity}>Cancel</Button>
					          				</ModalFooter>
					        				</Modal>              
						          	    	: (this.state.end_time_activity_hour + ":" +this.state.end_time_activity_min + ":" + this.state.end_time_activity_sec + " " + this.state.end_time_activity_am_pm )}
						          	    	{this.props.hrr.editable &&            
					                            <span  style = {{marginLeft:"30px"}}  onClick={this.editEndTimeActivity}
		                            			className="fa fa-pencil fa-1x"
		                            			>
		                        			</span>
					                        }
										</td>
					          	    </tr>

					          	    <tr className = "hr_table_style_rows">
						          	    <td className = "hr_table_style_rows">Did you measure your heart rate recovery (HRR) after today’s aerobic workout?</td>
										<td className = "hr_table_style_rows">
										{this.state.editable_did_you_measure_HRR ? 
				          	    	<Input
				          	    		style = {{maxWidth:"100px"}}
                                        type="select"
                                        className="custom-select form-control" 
                                        name="Did_you_measure_HRR"
                                        value={this.state.Did_you_measure_HRR}                                       
                                        onChange={this.handleChange}
                                        onBlur={this.editToggleDidyouWorkout}>
                                        <option value="">No Workout</option>                                 
                                    	<option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </Input> 
				          	    	:this.renderNoworkout(this.state.Did_you_measure_HRR)}
				          	    	{this.props.hrr.editable &&
				          	    	<span  style = {{marginLeft:"30px"}}  onClick={this.editToggleDidyouWorkout}
                            			className="fa fa-pencil fa-1x"
                            			>
                        			</span>
                        			}
									</td>
					          	    </tr>

					          	      <tr className = "hr_table_style_rows">
						          	    <td className = "hr_table_style_rows">Did your heart rate go down to 99 beats per minute or lower?</td>
										<td className = "hr_table_style_rows">
										{this.state.editable_no_fitfile_hrr_reach_99 ? 
						          	    	<Input
						          	    		style = {{maxWidth:"100px"}}
		                                        type="select"
		                                        className="custom-select form-control" 
		                                        name="no_fitfile_hrr_reach_99"
		                                        value={this.state.no_fitfile_hrr_reach_99}                                       
		                                        onChange={this.handleChange}
		                                        onBlur={this.editNoFitfileHrrReach99}>
		                                        <option value="">select</option>                                 
		                                    	<option value="yes">Yes</option>
		                                        <option value="no">No</option>
		                                    </Input> 
				          	    		: this.captilizeYes(this.state.no_fitfile_hrr_reach_99)}
					          	    	{this.props.hrr.editable &&
					          	    	<span  style = {{marginLeft:"30px"}}  onClick={this.editNoFitfileHrrReach99}
	                            			className="fa fa-pencil fa-1x"
	                            			>
	                        			</span>
	                        			}
										</td>
					          	    </tr>

					          	     <tr className = "hr_table_style_rows">
						          	    <td className = "hr_table_style_rows">Duration (mm:ss) for Heart Rate Time to Reach 99</td>
						          	    <td className = "hr_table_style_rows">
						          	     {this.state.editable_no_fitfile_hrr_time_reach_99?
					  						<Modal isOpen={this.state.editable_no_fitfile_hrr_time_reach_99}  className={this.props.className}>
					      					<ModalHeader toggle={this.editNoFitfileHrrTimeReach99}>Tme to 99</ModalHeader>
					          				<ModalBody>
					            				<div className = "row justify-content-center">
					            				<span>
								          	    	<Input
								          	    	style = {{minWidth:"130px"}}
					                                    type="select"
					                                    className="custom-select form-control" 
					                                    name="no_fitfile_hrr_time_reach_99_min"
					                                    value={this.state.no_fitfile_hrr_time_reach_99_min}                                       
					                                    onChange={this.handleChange}
					                                    >
					                                    {this.createSleepDropdown(0,59,true)}
					                            	</Input>
					                            </span>
					                            <span style = {{marginLeft:"30px"}}>
					                            	<Input
								          	    		style = {{minWidth:"130px"}}
							                            type="select"
							                            className="custom-select form-control" 
							                            name="no_fitfile_hrr_time_reach_99_sec"
							                            value={this.state.no_fitfile_hrr_time_reach_99_sec}                                       
							                            onChange={this.handleChange}
							                            >
							                            {this.createSleepDropdown(0,59,true)}
					                            	</Input>
					                            </span>
					                            </div>
					      					</ModalBody>
					      					<ModalFooter>
					        				<Button color="primary" onClick={this.renderNoFitfileHrrTimeReach99}>Save</Button>
					            			<Button color="secondary" onClick={this.editNoFitfileHrrTimeReach99}>Cancel</Button>
					          				</ModalFooter>
					        				</Modal>              
				          	    		: (this.state.no_fitfile_hrr_time_reach_99_min + ":" +this.state.no_fitfile_hrr_time_reach_99_sec)}
				          	    		{this.props.hrr.editable &&
					          	    	<span  style = {{marginLeft:"30px"}}  onClick={this.editNoFitfileHrrTimeReach99}
	                            			className="fa fa-pencil fa-1x"
	                            			>
	                        			</span>
	                        			}
						          	   </td>
					          	    </tr>

					          	    <tr className = "hr_table_style_rows">
						          	    <td className = "hr_table_style_rows">Time Heart Rate Reached 99 (hh:mm:ss)</td>
										<td className = "hr_table_style_rows">

										{this.state.editable_time_heart_rate_reached_99 ?
					  						<Modal isOpen={this.state.editable_time_heart_rate_reached_99}  className={this.props.className}>
					      					<ModalHeader toggle={this.editTimeHeartRateReached99}>End Time Activity</ModalHeader>
					          				<ModalBody>
					            				<div className = "row justify-content-center">
					            				<span>
								          	    	<Input
								          	    	style = {{minWidth:"80px"}}
					                                    type="select"
					                                    className="custom-select form-control" 
					                                    name="time_heart_rate_reached_99_hour"
					                                    value={this.state.time_heart_rate_reached_99_hour}                                       
					                                    onChange={this.handleChange}
					                                    >
					                                    {this.createSleepDropdown(0,12,true)}
					                            	</Input>
					                            </span>
					            				<span style = {{marginLeft:"30px"}}>
								          	    	<Input
								          	    	style = {{minWidth:"80px"}}
					                                    type="select"
					                                    className="custom-select form-control" 
					                                    name="time_heart_rate_reached_99_min"
					                                    value={this.state.time_heart_rate_reached_99_min}                                       
					                                    onChange={this.handleChange}
					                                    >
					                                    {this.createSleepDropdown(0,59,true)}
					                            	</Input>
					                            </span>
					                            <span style = {{marginLeft:"30px"}}>
					                            	<Input
								          	    		style = {{minWidth:"80px"}}
							                            type="select"
							                            className="custom-select form-control" 
							                            name="time_heart_rate_reached_99_sec"
							                            value={this.state.time_heart_rate_reached_99_sec}                                       
							                            onChange={this.handleChange}
							                            >
							                            {this.createSleepDropdown(0,59,true)}
					                            	</Input>
					                            </span>
					                             <span style = {{marginLeft:"30px"}}>
					                            	<Input
								          	    		style = {{minWidth:"80px"}}
							                            type="select"
							                            className="custom-select form-control" 
							                            name="time_heart_rate_reached_99_am_pm"
							                            value={this.state.time_heart_rate_reached_99_am_pm}                                       
							                            onChange={this.handleChange}
							                            >
							                            <option value="">AM/PM</option>                                 
				                                    	<option value="am">AM</option>
				                                        <option value="pm">PM</option>
					                            	</Input>
					                            </span>
					                            </div>
					      					</ModalBody>
					      					<ModalFooter>
					        				<Button color="primary" onClick={this.renderTimeHeartRateReached99}>Save</Button>
					            			<Button color="secondary" onClick={this.editTimeHeartRateReached99}>Cancel</Button>
					          				</ModalFooter>
					        				</Modal>              
						          	    	: (this.state.time_heart_rate_reached_99_hour + ":" +this.state.time_heart_rate_reached_99_min + ":" + this.state.time_heart_rate_reached_99_sec + " " + this.state.time_heart_rate_reached_99_am_pm )}
						          	    	{this.props.hrr.editable &&
						          	    	<span  style = {{marginLeft:"30px"}}  onClick={this.editTimeHeartRateReached99}
		                            			className="fa fa-pencil fa-1x"
		                            			>
		                        			</span>
		                        			}
										</td>
					          	    </tr>

					          	    <tr className = "hr_table_style_rows">
						          	    <td className = "hr_table_style_rows">HRR File Starting Heart Rate</td>
						          	    <td className = "hr_table_style_rows">
						          	    {this.state.editable_end_heartrate_activity ? 
						          	    	<Input
						          	    		style = {{maxWidth:"100px"}}
		                                        type="select"
		                                        className="custom-select form-control" 
		                                        name="end_heartrate_activity"
		                                        value={this.state.end_heartrate_activity}                                       
		                                        onChange={this.handleChange}
		                                        onBlur={this.editEndHeartrateActivity}>
		                                        {this.createSleepDropdown(70,220)}
		                                    </Input> 
				          	    		: this.state.end_heartrate_activity}
				          	    		{this.props.hrr.editable &&
					          	    	<span  style = {{marginLeft:"30px"}}  onClick={this.editEndHeartrateActivity}
	                            			className="fa fa-pencil fa-1x"
	                            			>
	                        			</span>
	                        			}

						          	    </td>
					          	    </tr>

					          	    <tr className = "hr_table_style_rows">
						          	    <td className = "hr_table_style_rows">Lowest Heart Rate Level in the 1st Minute</td>
										<td className = "hr_table_style_rows">
										 {this.state.editable_lowest_hrr_no_fitfile ? 
						          	    	<Input
						          	    		style = {{maxWidth:"100px"}}
		                                        type="select"
		                                        className="custom-select form-control" 
		                                        name="lowest_hrr_no_fitfile"
		                                        value={this.state.lowest_hrr_no_fitfile}                                       
		                                        onChange={this.handleChange}
		                                        onBlur={this.editLowestHrrNoFitfile}>
		                                        {this.createSleepDropdown(70,220)}
		                                    </Input> 
				          	    		: this.state.lowest_hrr_no_fitfile}
				          	    		{this.props.hrr.editable &&
					          	    	<span  style = {{marginLeft:"30px"}}  onClick={this.editLowestHrrNoFitfile}
	                            			className="fa fa-pencil fa-1x"
	                            			>
	                        			</span>
	                        			}
										</td>
					          	    </tr>

					          	    <tr className = "hr_table_style_rows">
						          	    <td className = "hr_table_style_rows">Number of heart beats recovered in the first minute</td>
										<td className = "hr_table_style_rows">
										{this.state.editable_no_file_beats_recovered ? 
						          	    	<Input
						          	    		style = {{maxWidth:"100px"}}
		                                        type="select"
		                                        className="custom-select form-control" 
		                                        name="no_file_beats_recovered"
		                                        value={this.state.no_file_beats_recovered}                                       
		                                        onChange={this.handleChange}
		                                        onBlur={this.editNoFileBeatsRecovered}>
		                                        {this.createSleepDropdown(70,220)}
		                                    </Input> 
				          	    		: this.state.no_file_beats_recovered}
				          	    		{this.props.hrr.editable &&
					          	    	<span  style = {{marginLeft:"30px"}}  onClick={this.editNoFileBeatsRecovered}
	                            			className="fa fa-pencil fa-1x"
	                            			>
	                        			</span>
	                        			}
									</td>
					          	    </tr>
				          	    </tbody>
			          	    </table>   
			          	    <ToastContainer 
			                    position="top-center"
			                    type="success"
			                    autoClose={5000}
			                    hideProgressBar={true}
			                    newestOnTop={false}
			                    closeOnClick
			                    className="toast-popup"
			                />
		          	    </div>
	          	    </div>
          	    	<div className = "row justify-content-center">
          	    		<Button onClick = {this.updateData}>Update</Button>
          	    	</div>
          	    </div>
			)
	}
}
export default No_Hrr_Data;