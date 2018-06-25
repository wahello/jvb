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
import {fetchHrrWeeklyData}  from '../network/heartRate_zone';
import {renderTimeTohrrZoneSelectedDateFetchOverlay} from './dashboard_healpers';

axiosRetry(axios, { retries: 3});


var CalendarWidget = require('react-calendar-widget');
var ReactDOM = require('react-dom');

class HeartrateZone extends Component{
	constructor(props) {
    super(props);
	    this.state = {
			    	calendarOpen:false,
				    isOpen:false,
				    fetching_hrr_zone:false,
				    selectedDate:new Date(),
				    start_date:moment().subtract(7,'days').toDate(),
					end_date:moment().toDate(),
				    hr_zone:{},
	    }
	    this.toggleCalendar = this.toggleCalendar.bind(this);
	 	this.toggle = this.toggle.bind(this);
	 	this.processDate = this.processDate.bind(this);
	 	this.successHeartrateZone = this.successHeartrateZone.bind(this);
	 	this.errorHeartrateZone = this.errorHeartrateZone.bind(this);
	 	this.renderTable = this.renderTable.bind(this);
	 	this.renderTime = this.renderTime.bind(this);
	 	this.renderpercentage = this.renderpercentage.bind(this);
	 	this.onSubmitDate = this.onSubmitDate.bind(this);
	 	this.renderTimeTohrrZoneSelectedDateFetchOverlay = renderTimeTohrrZoneSelectedDateFetchOverlay.bind(this);
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
			time = "00:00:00";
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
  		let end_dt = moment(selectedDate);
		let start_dt = moment(selectedDate).subtract(7,'days');
		this.setState({
			selectedDate:selectedDate,
			calendarOpen:!this.state.calendarOpen,
			start_date : start_dt.toDate(),
			end_date : end_dt.toDate(),
			fetching_hrr_zone:true,
			hr_zone:{},
		},()=>{
			fetchHrrWeeklyData(this.state.start_date, this.state.end_date,this.successHeartrateZone,this.errorHeartrateZone);
		});
	}

	onSubmitDate(event){
  	event.preventDefault();
  	let start_dt = moment(this.state.start_date);
  	let end_dt = moment(this.state.end_date);
  	this.setState({
			start_date : start_dt.toDate(),
			end_date : end_dt.toDate(),
			dateRange:!this.state.dateRange,
			fetching_ql:true
		},()=>{
			fetchHrrWeeklyData(this.state.start_date, this.state.end_date,
					this.successHeartrateZone,this.errorHeartrateZone);

		});
  }
	componentDidMount(){
		this.setState({
			fetching_hrr_zone:true,
		});
		fetchHrrWeeklyData(this.state.start_date, this.state.end_date,
				this.successHeartrateZone,this.errorHeartrateZone);
	}

	renderTable(data){
		var td_rows = [];
		let keys = ["heart_rate_zone_low_end","heart_rate_zone_high_end","classificaton", 
		"time_in_zone","prcnt_total_duration_in_zone"];
		for(let[key1,value] of Object.entries(data)){
			for (let [key2,value1] of Object.entries(value)){
				let td_values = [];
				for(let key of keys){
					if(key == "time_in_zone"){
						let keyvalue = this.renderTime(value[key]);
					    td_values.push(<td>{keyvalue}</td>);
					}
					else if(key == "prcnt_in_zone"){
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
		return td_rows;
	}

	render(){
		return(
			<div>

				<NavbarMenu/>

				 	<div className="row" style = {{marginTop:"10px"}}>
		            	<span id="navlink" onClick={this.toggleCalendar} id="progress">
		                    <FontAwesome
		                        name = "calendar"
		                        size = "2x"
		                    />
		                    <span style = {{marginLeft:"20px",fontWeight:"bold",paddingTop:"7px"}}>{moment(this.state.selectedDate).format('MMM DD, YYYY')}</span>  
	                	</span>
	                	 <span  onClick={this.toggleDate} id="daterange" style={{color:"white"}}>
									         {moment(this.state.start_date).format('MMM D, YYYY')} - {moment(this.state.end_date).format('MMM D, YYYY')}
									        </span>
									        <span className="date_range_btn">
									         <Button
		                                        className="daterange-btn btn"		                         
									            id="daterange"
									            
									            onClick={this.toggleDate} >Date Range
									        </Button>
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

		            <Popover
                            placement="bottom"
                            isOpen={this.state.dateRange}
                            target="daterange"
                            toggle={this.toggleDate}>
                              <PopoverBody>
                                <div >

				           <Form>
						        <div style={{paddingBottom:"12px"}} className="justify-content-center">
						          <Label>Start Date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
						          <Input type="date"
						           name="start_date"
						           value={moment(this.state.start_date).format('YYYY-MM-DD')}
						           onChange={this.handleChange} style={{height:"35px",borderRadius:"7px"}}/>

						        </div>
						        <div id="date" className="justify-content-center">

						          <Label>End date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
						          <Input type="date"
						           name="end_date"
						           value={moment(this.state.end_date).format('YYYY-MM-DD')}
						           onChange={this.handleChange} style={{height:"35px",borderRadius:"7px"}}/>

						        </div>
						        <div id="date" style={{marginTop:"12px"}} className="justify-content-center">

						        <button
						        id="nav-btn"
						         style={{backgroundColor:"#ed9507"}}
						         type="submit"
						         className="btn btn-block-lg"
						         onClick={this.onSubmitDate} style={{width:"175px"}}>SUBMIT</button>
						         </div>

						  		 </Form>
							</div>
                           </PopoverBody>
                           </Popover>
		            <div className = "row justify-content-center hr_table_padd">
	          	    	<div className = "table table-responsive">
		          	    	<table className = "table table-striped table-bordered ">
			          	    	<thead>
				          	    	<th>Heart Rate Zone Low End</th>
				          	    	<th>Heart Rate Zone Heigh End</th>
				          	    	<th>Classification</th>
				          	    	<th>Time in Zone(hh:mm:ss) for thr Last 7 Days</th>
				          	    	<th>% of Total Duration in Zone</th>
			          	    	</thead>
			          	    	<tbody>
			          	    	{this.renderTable(this.state.hr_zone)}
			          	    	</tbody>
		          	    	</table>
	          	    	</div>
          	    	</div>
          	    	{this.renderTimeTohrrZoneSelectedDateFetchOverlay()}
			</div>
			);
	}
}
export default HeartrateZone;