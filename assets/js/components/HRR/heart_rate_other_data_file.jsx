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
class Other_Hrr_Data extends Component{
	constructor(props){
		 super(props);
		 let start_time_split = "";
		 let start_time_am_pm = "";
		 let end_time = this.renderTime(this.props.hrr.end_time_activity);
		 let end_time_split = end_time.split(":");
		 let end_time_am_pm = end_time_split[2].split(" ");
		 let start_time = this.renderTime(this.props.hrr.HRR_activity_start_time);
		if(start_time){
		 	start_time_split = start_time.split(":");
		 	start_time_am_pm = start_time_split[2].split(" ");
		}
		 let diff_actity_hrr = this.renderSecToMin(this.props.hrr.diff_actity_hrr);
		 let diff_actity_hrr_split = diff_actity_hrr.split(":");
		 let pure_time_99 = this.renderSecToMin(this.props.hrr.pure_time_99);
		 let pure_time_99_split = pure_time_99.split(":");
		 let end_heartrate_activity = this.props.hrr.end_heartrate_activity;
		 let heart_rate_down_up = this.props.hrr.heart_rate_down_up;
		 let pure_1min_heart_beats = this.props.hrr.pure_1min_heart_beats
		this.state = {
			editable:this.props.hrr.editable,
			editable_end_time_activity:false,
			editable_start_time_activity:false,
			editable_diff_actity_hrr:false,
			editable_pure_time_99:false,
			editable_heart_rate_down_up:false,
			editable_end_heartrate_activity:false,
			editable_pure_1min_heart_beats:false,
			end_time_activity_hour:end_time_split[0],
			end_time_activity_min:end_time_split[1],
			end_time_activity_sec:end_time_am_pm[0],
			end_time_activity_am_pm:end_time_am_pm[1],
			start_time_activity_hour:start_time_split[0],
			start_time_activity_min:start_time_split[1],
			start_time_activity_sec:start_time_am_pm[0],
			start_time_activity_am_pm:start_time_am_pm[1],
			diff_actity_hrr_min:diff_actity_hrr_split[0],
			diff_actity_hrr_sec:diff_actity_hrr_split[1],
			pure_time_99_min:pure_time_99_split[0],
			pure_time_99_sec:pure_time_99_split[1],
			end_heartrate_activity:end_heartrate_activity,
			heart_rate_down_up:heart_rate_down_up,
			pure_1min_heart_beats:pure_1min_heart_beats,
			diff_actity_hrr:"",
			pure_time_99:"",
			end_time_activity:"",
			HRR_activity_start_time:""

		}
		this.renderTime = this.renderTime.bind(this);
		this.renderSecToMin = this.renderSecToMin.bind(this);
		this.createSleepDropdown = this.createSleepDropdown.bind(this);
		this.editEndTimeActivity = this.editEndTimeActivity.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.renderEndTimeActivity = this.renderEndTimeActivity.bind(this);
		this.editStartTimeActivity = this.editStartTimeActivity.bind(this);
		this.renderStartTimeActivity = this.renderStartTimeActivity.bind(this);
		this.editDiffActivityHrr = this.editDiffActivityHrr.bind(this);
		this.renderDiffActivityTime = this.renderDiffActivityTime.bind(this);
		this.editPureTime99 = this.editPureTime99.bind(this);
		this.renderPureTime99 = this.renderPureTime99.bind(this);
		this.editEndHeartrateActivity = this.editEndHeartrateActivity.bind(this);
		this.editHeartRateDownUp = this.editHeartRateDownUp.bind(this);
		this.editPure1minHeartBeats = this.editPure1minHeartBeats.bind(this);
		this.updateData = this.updateData.bind(this);
		this.getDTMomentObj = this.getDTMomentObj.bind(this);
		this.successHeart = this.successHeart.bind(this);
		this.errorHeart = this.errorHeart.bind(this);
		this.renderHrrSelectedDateFetchOverlay = renderHrrSelectedDateFetchOverlay.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		this.setState({ editable: nextProps.hrr.editable });  
  	}
	editEndTimeActivity(){
		this.setState({
			editable_end_time_activity:!this.state.editable_end_time_activity,
		})
	}
	editStartTimeActivity(){
		this.setState({
			editable_start_time_activity:!this.state.editable_start_time_activity,
		})
	}
	editDiffActivityHrr(){
		this.setState({
			editable_diff_actity_hrr:!this.state.editable_diff_actity_hrr,
		})
	}
	editPureTime99(){
		this.setState({
			editable_pure_time_99:!this.state.editable_pure_time_99,
		})
	}
	editEndHeartrateActivity(){
		this.setState({
			editable_end_heartrate_activity:!this.state.editable_end_heartrate_activity,
		})
	}
	editHeartRateDownUp(){
		this.setState({
			editable_heart_rate_down_up:!this.state.editable_heart_rate_down_up,
		})
	}
	editPure1minHeartBeats(){
		this.setState({
			editable_pure_1min_heart_beats:!this.state.editable_pure_1min_heart_beats,
		})
	}
	renderPureTime99(){
		this.setState({
			editable_pure_time_99:!this.state.editable_pure_time_99
		})
	}
	renderDiffActivityTime(){
		this.setState({
			editable_diff_actity_hrr:!this.state.editable_diff_actity_hrr
		})
	}
	renderEndTimeActivity(){
		this.setState({
			editable_end_time_activity:!this.state.editable_end_time_activity
		})
	}
	renderStartTimeActivity(){
		this.setState({
			editable_start_time_activity:!this.state.editable_start_time_activity
		})
	}
	handleChange(event){
	  	const target = event.target;
	  	const value = target.value;	
	  	const name = target.name;
	  	this.setState({
			[name]: value},
			()=>{
				if(target.name=='end_heartrate_activity'){
					this.setState({
						editable_end_heartrate_activity:!this.state.editable_end_heartrate_activity,
					})
				}
				else if(target.name=='heart_rate_down_up'){
					this.setState({
						editable_heart_rate_down_up:!this.state.editable_heart_rate_down_up,
					})
				}
				else if(target.name=='pure_1min_heart_beats'){
					this.setState({
						editable_pure_1min_heart_beats:!this.state.editable_pure_1min_heart_beats,
					})
				}
		});
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
		toast.info("Updated HRR successfully",{
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
  			let mins = parseInt(this.state.pure_time_99_min) * 60;
  			let sec = parseInt(this.state.pure_time_99_sec);
  			let pure_time_99 = mins + sec;
  			let diff_actity_hrr_min = parseInt(this.state.diff_actity_hrr_min) * 60;
			let diff_actity_hrr_sec = parseInt(this.state.diff_actity_hrr_sec);
			let diff_time = diff_actity_hrr_min + diff_actity_hrr_sec;
  			let endTimeActivity = this.getDTMomentObj(
  				this.state.end_time_activity_hour,
				this.state.end_time_activity_min,
				this.state.end_time_activity_sec,
				this.state.end_time_activity_am_pm,
  				)
  			let startTimeActivity = this.getDTMomentObj(
  				this.state.start_time_activity_hour,
				this.state.start_time_activity_min,
				this.state.start_time_activity_sec,
				this.state.start_time_activity_am_pm,
  				)
  			this.setState({
  				fetching_hrr:true,
  				"end_time_activity":endTimeActivity.utc().valueOf(),
				"diff_actity_hrr":diff_time,
				"HRR_activity_start_time":startTimeActivity.utc().valueOf(),
				"end_heartrate_activity":this.state.end_heartrate_activity,
				"heart_rate_down_up":this.state.heart_rate_down_up,
				"pure_1min_heart_beats":this.state.pure_1min_heart_beats,
				"pure_time_99":pure_time_99
			},() => {
				let data = {
	  				"end_time_activity":endTimeActivity.utc().valueOf(),
					"diff_actity_hrr":diff_time,
					"HRR_activity_start_time":startTimeActivity.utc().valueOf(),
					"end_heartrate_activity":parseInt(this.state.end_heartrate_activity),
					"heart_rate_down_up":parseInt(this.state.heart_rate_down_up),
					"pure_1min_heart_beats":parseInt(this.state.pure_1min_heart_beats),
					"pure_time_99":pure_time_99
				}

	  			updateHeartData(data, this.props.selectedDate, this.successHeart, this.errorHeart);
	  				  				  			
	  			//this.props.renderHrrData(data);
			});

	  			
  		}
	render(){
		return(
			<div>
				 <div className = "row justify-content-center hr_table_padd">
	          	    <div className = "table table-responsive">
		          	    <table className = "table table-striped table-bordered ">
			          	    <thead className = "hr_table_style_rows">
				          	    <th className = "hr_table_style_rows">Other HRR Stats</th>
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
						          	    	{this.state.editable && 
						          	    	<span  style = {{marginLeft:"30px"}}  onClick={this.editEndTimeActivity}
		                            			className="fa fa-pencil fa-1x"
		                            			>
		                        			</span>
		                        			}
					          	    </td>
				          	    </tr>

				          	    <tr className = "hr_table_style_rows">
					          	    <td className = "hr_table_style_rows">Difference Between Activity End time and Hrr Start time(mm:ss)</td>
					          	    <td className = "hr_table_style_rows">
					          	     	{this.state.editable_diff_actity_hrr ?
					  						<Modal isOpen={this.state.editable_diff_actity_hrr}  className={this.props.className}>
					      					<ModalHeader toggle={this.editDiffActivityHrr}>Difference Between Activity End time and Hrr Start time(mm:ss)</ModalHeader>
					          				<ModalBody>
					            				<div className = "row justify-content-center">
					            				<span>
								          	    	<Input
								          	    	style = {{minWidth:"130px"}}
					                                    type="select"
					                                    className="custom-select form-control" 
					                                    name="diff_actity_hrr_min"
					                                    value={this.state.diff_actity_hrr_min}                                       
					                                    onChange={this.handleChange}
					                                    >
					                                    {this.createSleepDropdown(0,59)}
					                            	</Input>
					                            </span>
					                            <span style = {{marginLeft:"30px"}}>
					                            	<Input
								          	    		style = {{minWidth:"130px"}}
							                            type="select"
							                            className="custom-select form-control" 
							                            name="diff_actity_hrr_sec"
							                            value={this.state.diff_actity_hrr_sec}                                       
							                            onChange={this.handleChange}
							                            >
							                            {this.createSleepDropdown(0,59,true)}
					                            	</Input>
					                            </span>
					                            </div>
					      					</ModalBody>
					      					<ModalFooter>
					        				<Button color="primary" onClick={this.renderDiffActivityTime}>Save</Button>
					            			<Button color="secondary" onClick={this.editDiffActivityHrr}>Cancel</Button>
					          				</ModalFooter>
					        				</Modal>              
					          	    		: (this.state.diff_actity_hrr_min + ":" +this.state.diff_actity_hrr_sec)
					          	    	}
					          	    	{this.state.editable && 
					          	    	<span  style = {{marginLeft:"30px"}}  onClick={this.editDiffActivityHrr}
	                            			className="fa fa-pencil fa-1x"
	                            			>
	                        			</span>
	                        			}
                        			</td>
				          	    </tr>

				          	    <tr className = "hr_table_style_rows">
					          	    <td className = "hr_table_style_rows">Hrr Start Time(hh:mm:ss)</td>
					          	    <td className = "hr_table_style_rows">
					          	    {this.state.editable_start_time_activity ?
					  						<Modal isOpen={this.state.editable_start_time_activity}  className={this.props.className}>
					      					<ModalHeader toggle={this.editStartTimeActivity}>Start Time Activity</ModalHeader>
					          				<ModalBody>
					            				<div className = "row justify-content-center">
					            				<span>
								          	    	<Input
								          	    	style = {{minWidth:"80px"}}
					                                    type="select"
					                                    className="custom-select form-control" 
					                                    name="start_time_activity_hour"
					                                    value={this.state.start_time_activity_hour}                                       
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
					                                    name="start_time_activity_min"
					                                    value={this.state.start_time_activity_min}                                       
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
							                            name="start_time_activity_sec"
							                            value={this.state.start_time_activity_sec}                                       
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
							                            name="start_time_activity_am_pm"
							                            value={this.state.start_time_activity_am_pm}                                       
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
					        				<Button color="primary" onClick={this.renderStartTimeActivity}>Save</Button>
					            			<Button color="secondary" onClick={this.editStartTimeActivity}>Cancel</Button>
					          				</ModalFooter>
					        				</Modal>              
						          	    	: (this.state.start_time_activity_hour + ":" +this.state.start_time_activity_min + ":" + this.state.start_time_activity_sec + " " + this.state.start_time_activity_am_pm )}
						          	    	{this.state.editable && 
						          	    	<span  style = {{marginLeft:"30px"}}  onClick={this.editStartTimeActivity}
		                            			className="fa fa-pencil fa-1x"
		                            			>
		                        			</span>
		                        			}
		                        			</td>
				          	    </tr>

				          	    <tr className = "hr_table_style_rows">
					          	    <td className = "hr_table_style_rows">Heart Rate at End of Activity</td>
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
					          	    	{this.state.editable && 
					          	    	<span  style = {{marginLeft:"30px"}}  onClick={this.editEndHeartrateActivity}
	                            			className="fa fa-pencil fa-1x"
	                            			>
	                        			</span>
	                        			}
									</td>
				          	    </tr>

				          	     <tr className = "hr_table_style_rows">
					          	    <td className = "hr_table_style_rows">Heart rate beats your heart rate went down/(up) from end of workout file to start of HRR file</td>
					          	    <td className = "hr_table_style_rows">
					          	    {this.state.editable_heart_rate_down_up ? 
					          	    	<Input
					          	    		style = {{maxWidth:"100px"}}
	                                        type="select"
	                                        className="custom-select form-control" 
	                                        name="heart_rate_down_up"
	                                        value={this.state.heart_rate_down_up}                                       
	                                        onChange={this.handleChange}
	                                        onBlur={this.editHeartRateDownUp}>
	                                        {this.createSleepDropdown(1,220)}
	                                    </Input> 
					          	    	: this.state.heart_rate_down_up}
					          	    	{this.state.editable && 
					          	    	<span  style = {{marginLeft:"30px"}}  onClick={this.editHeartRateDownUp}
	                            			className="fa fa-pencil fa-1x"
	                            			>
	                        			</span>
	                        			}
									</td>
				          	    </tr>

				          	    <tr className = "hr_table_style_rows">
					          	    <td className = "hr_table_style_rows">Pure 1 Minute HRR Beats Lowered</td>
									<td className = "hr_table_style_rows">
									{this.state.editable_pure_1min_heart_beats ? 
					          	    	<Input
					          	    		style = {{maxWidth:"100px"}}
	                                        type="select"
	                                        className="custom-select form-control" 
	                                        name="pure_1min_heart_beats"
	                                        value={this.state.pure_1min_heart_beats}                                       
	                                        onChange={this.handleChange}
	                                        onBlur={this.editPure1minHeartBeats}>
	                                        {this.createSleepDropdown(1,220)}
	                                    </Input> 
					          	    	: this.state.pure_1min_heart_beats}
					          	    	{this.state.editable && 
					          	    	<span  style = {{marginLeft:"30px"}}  onClick={this.editPure1minHeartBeats}
	                            			className="fa fa-pencil fa-1x"
	                            			>
	                        			</span>
	                        			}
	                        		</td>
				          	    </tr>

				          	    <tr className = "hr_table_style_rows">
					          	    <td className = "hr_table_style_rows">Pure time to 99 (mm:ss)</td>
									<td className = "hr_table_style_rows">
										{this.state.editable_pure_time_99 ?
					  						<Modal isOpen={this.state.editable_pure_time_99}  className={this.props.className}>
					      					<ModalHeader toggle={this.editPureTime99}>Pure Time to 99</ModalHeader>
					          				<ModalBody>
					            				<div className = "row justify-content-center">
					            				<span>
								          	    	<Input
								          	    	style = {{minWidth:"130px"}}
					                                    type="select"
					                                    className="custom-select form-control" 
					                                    name="pure_time_99_min"
					                                    value={this.state.pure_time_99_min}                                       
					                                    onChange={this.handleChange}
					                                    >
					                                    {this.createSleepDropdown(0,59)}
					                            	</Input>
					                            </span>
					                            <span style = {{marginLeft:"30px"}}>
					                            	<Input
								          	    		style = {{minWidth:"130px"}}
							                            type="select"
							                            className="custom-select form-control" 
							                            name="pure_time_99_sec"
							                            value={this.state.pure_time_99_sec}                                       
							                            onChange={this.handleChange}
							                            >
							                            {this.createSleepDropdown(0,59,true)}
					                            	</Input>
					                            </span>
					                            </div>
					      					</ModalBody>
					      					<ModalFooter>
					        				<Button color="primary" onClick={this.renderPureTime99}>Save</Button>
					            			<Button color="secondary" onClick={this.editPureTime99}>Cancel</Button>
					          				</ModalFooter>
					        				</Modal>              
					          	    		: (this.state.pure_time_99_min + ":" +this.state.pure_time_99_sec)
					          	    	}
					          	    	{this.state.editable && 
					          	    	<span  style = {{marginLeft:"30px"}}  onClick={this.editPureTime99}
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
			);
	}
}
export default Other_Hrr_Data;