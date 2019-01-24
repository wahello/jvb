import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import fetchHeartRateData  from '../../network/heratrateOperations';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';
import FontAwesome from "react-fontawesome";
import { Collapse, Navbar, NavbarToggler, 
         NavbarBrand, Nav, NavItem, NavLink,
        Button,Popover,PopoverBody,Form,FormGroup,FormText,Label,Input} from 'reactstrap';
import NavbarMenu from '../navbar';
import { getGarminToken,logoutUser} from '../../network/auth';
import fetchHeartData from '../../network/heart_cal';
//import {fetchHeartRefreshData} from '../../network/heart_cal';
import {renderHrrSelectedDateFetchOverlay} from '../dashboard_healpers';
import Heartrate_Data from './heartrate_data_file';
import Other_Hrr_Data from './heart_rate_other_data_file';
import No_Hrr_Data from './heart_rate_no_data.jsx'; 


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
				editable : false,
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

			    "use_updated_hrr":false,
				"include_hrr": true,	

				edit_did_you_measure_HRR:"",
				created_at:new Date()
			}
		    this.toggleCalendar = this.toggleCalendar.bind(this);
		    this.toggleEditForm = this.toggleEditForm.bind(this);
		    this.renderAddDate = this.renderAddDate.bind(this);
			this.renderRemoveDate = this.renderRemoveDate.bind(this);
			this.toggle = this.toggle.bind(this);
			this.successHeart = this.successHeart.bind(this);
			this.errorHeart = this.errorHeart.bind(this);
			this.processDate = this.processDate.bind(this);
			this.renderTime = this.renderTime.bind(this);
			this.renderHrrSelectedDateFetchOverlay = renderHrrSelectedDateFetchOverlay.bind(this);
			this.renderSecToMin = this.renderSecToMin.bind(this);
			this.renderNoworkout = this.renderNoworkout.bind(this);
			this.captilizeYes = this.captilizeYes.bind(this);
			this.hrr_data_measured = this.hrr_data_measured.bind(this);

            this.IncludeExcludeHRRToggler = this.IncludeExcludeHRRToggler.bind(this);
			this.updateText = this.updateText.bind(this);
			
			/*changes made here */
			//this.hrrRefreshData = this.hrrRefreshData.bind(this);
			//this.handleChange=this.handleChange.bind(this);
			//this.renderText = this.renderText.bind(this);
  	}
  	
	successHeart(data){
		{this.renderHrrSelectedDateFetchOverlay()}
		console.log("Before updatding state:",this.state)

		let shouldIncludeHRR = this.state.include_hrr;
		if(data.data.include_hrr !== undefined && data.data.include_hrr !== null)
			shouldIncludeHRR = data.data.include_hrr

		let isHRRUpdated = this.state.use_updated_hrr;
		if(data.data.use_updated_hrr !== undefined && data.data.use_updated_hrr !== null)
			isHRRUpdated = data.data.use_updated_hrr

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
					
					include_hrr:shouldIncludeHRR,
		            use_updated_hrr:isHRRUpdated,

					no_fitfile_hrr_time_reach_99:data.data.no_fitfile_hrr_time_reach_99,
					no_fitfile_hrr_reach_99:data.data.no_fitfile_hrr_reach_99,
					time_heart_rate_reached_99:data.data.time_heart_rate_reached_99,
					lowest_hrr_no_fitfile:data.data.lowest_hrr_no_fitfile,
					no_file_beats_recovered:data.data.no_file_beats_recovered,

					offset:data.data.offset,
					created_at:data.data.created_at
	  	},()=>{
	  		console.log("After gtting data:", this.state)
	  	});
	}

    errorHeart(error){
		console.log(error.message); 
		this.setState({
			fetching_hrr:false,
		})
    }
    renderAddDate(){
		/*It is forward arrow button for the calender getting the next day date*/
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
			
			"include_hrr":true,
			"use_updated_hrr":false	

		},()=>{
			fetchHeartData(this.successHeart,this.errorHeart,this.state.selectedDate);
		});
	}
	renderRemoveDate(){
		/*It is backward arrow button for the calender getting the last day date*/
		var today = this.state.selectedDate;
		var yesterday = moment(today).subtract(1, 'days');
		this.setState({
			selectedDate:yesterday.toDate(),
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
			
			"include_hrr":true,
			"use_updated_hrr":false

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
			
			
			"include_hrr":true,
			"use_updated_hrr":false

		},()=>{
			fetchHeartData(this.successHeart,this.errorHeart,this.state.selectedDate);
		});
	}
	renderHrrData(data){
		if(data.Did_you_measure_HRR == "yes"){
			let shouldIncludeHRR = this.state.include_hrr
			if(data.data.include_hrr !== undefined && data.data.include_hrr !== null)
				shouldIncludeHRR = data.data.include_hrr

			let isHRRUpdated = this.state.use_updated_hrr
			if(data.data.use_updated_hrr !== undefined && data.data.use_updated_hrr !== null)
				isHRRUpdated = data.data.use_updated_hrr
			this.setState({
				"Did_you_measure_HRR":data.Did_you_measure_HRR,
				"Did_heartrate_reach_99":data.Did_heartrate_reach_99,
				"time_99":data.time_99,
				"HRR_start_beat":data.HRR_start_beat,
				"lowest_hrr_1min":data.lowest_hrr_1min,
				"No_beats_recovered":data.No_beats_recovered,
	
				include_hrr:shouldIncludeHRR,
		        use_updated_hrr:isHRRUpdated
	
			});
		}
		else{
			this.setState({
				"Did_you_measure_HRR":data.Did_you_measure_HRR,
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
				"include_hrr":true,
				"use_updated_hrr":false

			});
		}
	}
	renderHrrData1(data){
		let shouldIncludeHRR = this.state.include_hrr
		if(data.data.include_hrr !== undefined && data.data.include_hrr !== null)
			shouldIncludeHRR = data.data.include_hrr

		let isHRRUpdated = this.state.use_updated_hrr
		if(data.data.use_updated_hrr !== undefined && data.data.use_updated_hrr !== null)
			isHRRUpdated = data.data.use_updated_hrr

		this.setState({
				"end_time_activity":data.end_time_activity,
				"diff_actity_hrr":data.diff_actity_hrr,
				"HRR_activity_start_time":data.HRR_activity_start_time,
				"end_heartrate_activity":data.end_heartrate_activity,
				"heart_rate_down_up":data.heart_rate_down_up,
				"pure_1min_heart_beats":data.pure_1min_heart_beats,
				"pure_time_99":data.pure_time_99,
				include_hrr:shouldIncludeHRR,
		        use_updated_hrr:isHRRUpdated
		})
	}
	renderHrrNoData(data){
		let shouldIncludeHRR = this.state.include_hrr
		if(data.data.include_hrr !== undefined && data.data.include_hrr !== null)
			shouldIncludeHRR = data.data.include_hrr

		let isHRRUpdated = this.state.use_updated_hrr
		if(data.data.use_updated_hrr !== undefined && data.data.use_updated_hrr !== null)
			isHRRUpdated = data.data.use_updated_hrr

		this.setState({
			"end_time_activity":data.end_time_activity,
			"Did_you_measure_HRR":data.Did_you_measure_HRR,
			"no_fitfile_hrr_reach_99":data.no_fitfile_hrr_reach_99,
			"no_fitfile_hrr_time_reach_99":data.no_fitfile_hrr_time_reach_99,
			"time_heart_rate_reached_99":data.time_heart_rate_reached_99,
			"end_heartrate_activity":data.end_heartrate_activity,
			"lowest_hrr_no_fitfile":data.lowest_hrr_no_fitfile,
			"no_file_beats_recovered":data.no_file_beats_recovered,
			include_hrr:shouldIncludeHRR,
		    use_updated_hrr:isHRRUpdated
		});
	}

	/*hrrRefreshData(){
		this.setState({
			fetching_hrr:true,
		});
		fetchHeartRefreshData(this.successHeart,this.errorHeart,this.state.selectedDate);
	}*/
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
  	// toggleCalendar(){
	    // this.setState({
	    	// calendarOpen:!this.state.calendarOpen
	    // });
    // }
    toggleEditForm(){
       this.setState({
         editable:!this.state.editable
       });
    }
    hrr_data_measured(newVal) {
    	this.setState({
    		Did_you_measure_HRR:newVal
    	}, () => {
    		console.log("From parent");
    	})
	}

	IncludeExcludeHRRToggler(value){
		this.setState({
			include_hrr:!this.state.include_hrr
		})	
	}

	updateText(updating_hrr){
		this.setState({
			use_updated_hrr:updating_hrr
		})

	}


    
  render(){
	  const {fix} = this.props;
	     
  	return(
  		<div className = "container-fluid">
		        <NavbarMenu title = {"Heartrate Recovery"} />
		        <div style = {{marginTop:"10px"}}>
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
		        	</span>
		        	&nbsp;&nbsp;
		        	<span>
                    	<Button 
                           id="nav-btn"
                              size="sm"
                              onClick={this.toggleEditForm}
                              className="btn hidden-sm-up">
                              {this.state.editable ? 'View Hrr Data' : 'Edit Hrr Data'}
                        </Button>`
						</span>
                        <span>
						<label style={{marginLeft:"150px"}}><strong>Updated Hrr :&nbsp;</strong></label>
			                      <span>{this.state.use_updated_hrr? 'Yes': 'No'}</span>
				        </span>
			
                    	<span>
							<label style={{marginLeft:"150px"}}>
								<input type="radio" 
									name="hrr" 
									checked={this.state.include_hrr}
									onChange={this.IncludeExcludeHRRToggler}>
								</input>
								Include HRR
							</label>
							<label style={{marginLeft:"150px"}}>
								<input type="radio" 
									name="hrr"
									checked={!this.state.include_hrr}
									onChange={this.IncludeExcludeHRRToggler}>
								</input>
								Exclude HRR
							</label>
						</span>
				
                
	
                	{/*<span className = "button_padding">
                    	<Button id="nav-btn" className="btn" onClick = {this.hrrRefreshData}>Refresh Hrr Data</Button>			      
                	</span>*/}
	            	<Popover
			            placement="bottom"
			            isOpen={this.state.calendarOpen}
			            target="gd_progress"
			            toggle={this.toggleCalendar}>
		                <PopoverBody className="calendar2">
		                <CalendarWidget  onDaySelect={this.processDate}/>
		                </PopoverBody>
	                </Popover>
	            </div>

	            {this.state.Did_you_measure_HRR == "yes"  &&
	            	<Heartrate_Data  hrr={{
	            		"editable":this.state.editable,
            			"Did_you_measure_HRR":this.state.Did_you_measure_HRR,
						"Did_heartrate_reach_99":this.state.Did_heartrate_reach_99,
						"time_99":this.state.time_99,
						"HRR_start_beat":this.state.HRR_start_beat,
						"lowest_hrr_1min":this.state.lowest_hrr_1min,
						"No_beats_recovered":this.state.No_beats_recovered,
						"use_updated_hrr":this.state.use_updated_hrr

						}}
						selectedDate = {this.state.selectedDate}
						updateText={this.updateText}
						HRR_measured = {this.hrr_data_measured}
						renderHrrData = {this.renderHrrData.bind(this)}
						shouldIncludeHRR = {this.state.include_hrr}/>
          		}

          	{this.state.Did_you_measure_HRR == "yes" &&
          	 	<Other_Hrr_Data hrr = {{
      	 			"editable":this.state.editable,
      	 			"Did_you_measure_HRR":this.state.Did_you_measure_HRR,
      	 			"end_time_activity":this.state.end_time_activity,
					"diff_actity_hrr":this.state.diff_actity_hrr,
					"HRR_activity_start_time":this.state.HRR_activity_start_time,
					"end_heartrate_activity":this.state.end_heartrate_activity,
					"heart_rate_down_up":this.state.heart_rate_down_up,
					"pure_1min_heart_beats":this.state.pure_1min_heart_beats,
					"pure_time_99":this.state.pure_time_99,
					"use_updated_hrr":this.state.use_updated_hrr
				}}
					selectedDate = {this.state.selectedDate}
                
					updateText={this.updateText}
					HRR_measured = {this.hrr_data_measured}
					renderHrrData = {this.renderHrrData1.bind(this)}
					shouldIncludeHRR = {this.state.include_hrr}/>
          	}

          	{(this.state.Did_you_measure_HRR == "no" || this.state.Did_you_measure_HRR == "" || this.state.Did_you_measure_HRR == "Heart Rate Data Not Provided") &&
          		<No_Hrr_Data hrr = {{
          			"editable":this.state.editable,
          			"Did_you_measure_HRR":this.state.Did_you_measure_HRR,
          			"end_time_activity":this.state.end_time_activity,
          			"no_fitfile_hrr_reach_99":this.state.no_fitfile_hrr_reach_99,
					"no_fitfile_hrr_time_reach_99":this.state.no_fitfile_hrr_time_reach_99,
					"time_heart_rate_reached_99":this.state.time_heart_rate_reached_99,
					"lowest_hrr_no_fitfile":this.state.lowest_hrr_no_fitfile,
					"end_heartrate_activity":this.state.end_heartrate_activity,
					"created_at":this.state.created_at,
					"no_file_beats_recovered":this.state.no_file_beats_recovered,
					"use_updated_hrr":this.state.use_updated_hrr

				    }}
					selectedDate = {this.state.selectedDate}
					updateText={this.updateText}
          			HRR_measured = {this.hrr_data_measured}
          			renderHrrData = {this.renderHrrNoData.bind(this)}
          			shouldIncludeHRR = {this.state.include_hrr}
          			/>   
          	}
          	
          	{this.renderHrrSelectedDateFetchOverlay()}
  		</div>
  		);
    }
}
export default HeartRateCal;
