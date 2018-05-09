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
import fetchHeartData  from '../network/heart_cal';
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
				"lowest_hrr_no_fitfile":"",
				"no_file_beats_recovered":"",

				"offset":"",
    }
     this.toggleCalendar = this.toggleCalendar.bind(this);
	 this.handleLogout = this.handleLogout.bind(this);
	 this.toggle = this.toggle.bind(this);
	 this.successHeart = this.successHeart.bind(this);
	 this.errorHeart = this.errorHeart.bind(this);
	 this.processDate = this.processDate.bind(this);
	 this.renderTime = this.renderTime.bind(this);
	 this.renderHrrSelectedDateFetchOverlay = renderHrrSelectedDateFetchOverlay.bind(this);
	 this.renderSecToMin = this.renderSecToMin.bind(this);
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
    processDate(selectedDate){
		this.setState({
			selectedDate:selectedDate,
			calendarOpen:!this.state.calendarOpen,
			fetching_hrr:true,
		},()=>{
			fetchHeartData(this.successHeart,this.errorHeart,this.state.selectedDate);
		});
		
	}

	componentDidMount(){
		this.setState({
			fetching_hrr:true,
		});
		fetchHeartData(this.successHeart,this.errorHeart,this.state.selectedDate);
	}

    toggleCalendar(){
	    this.setState({
	      calendarOpen:!this.state.calendarOpen
	    });
    }

    handleLogout(){
    	this.props.logoutUser(this.onLogoutSuccess);
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
  render(){
  	const {fix} = this.props;
  	return(
  		<div className = "container-fluid">
			<Navbar toggleable
		         fixed={fix ? 'top' : ''}
		          className="navbar navbar-expand-sm navbar-inverse nav6">
		          <NavbarToggler className="navbar-toggler hidden-sm-up" onClick={this.toggle}>
		            <FontAwesome
		                name = "bars"
		                size = "1x"
		            />
		          </NavbarToggler>
		          <Link to='/' >
		            <NavbarBrand
		              className="navbar-brand float-sm-left"
		              id="navbarTogglerDemo" style={{fontSize:"16px",marginLeft:"-4px"}}>
		              <img className="img-fluid"
		               style={{maxWidth:"200px"}}
		               src="//static1.squarespace.com/static/535dc0f7e4b0ab57db48c65c/t/5942be8b893fc0b88882a5fb/1504135828049/?format=1500w"/>
		            </NavbarBrand>
		          </Link>
		            <span id="header">
		            <h4 className="head" id="head" style = {{fontSize:"22px"}}>
		            </h4>
		            </span>
		          <Collapse className="navbar-toggleable-xs" isOpen={this.state.isOpen} navbar>
		            <Nav className="nav navbar-nav float-xs-right ml-auto" navbar>
		              <NavItem className="float-sm-right">
		                <Link id="logout"className="nav-link" to='/'>Home</Link>
		              </NavItem>
		               <NavItem className="float-sm-right">
		                   <NavLink
		                   className="nav-link"
		                   id="logout"
		                   onClick={this.handleLogout}>Log Out
		                    </NavLink>
		              </NavItem>
		            </Nav>
		          </Collapse>
		        </Navbar>

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

	             {this.state.Did_you_measure_HRR == "Yes" || this.state.Did_you_measure_HRR == "" &&
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
		          	    <td className = "hr_table_style_rows">{this.state.Did_you_measure_HRR}</td>
	          	    </tr>

	          	    <tr className = "hr_table_style_rows">
		          	    <td className = "hr_table_style_rows">Did your heart rate go down to 99 beats per minute or lower?</td>
		          	    <td className = "hr_table_style_rows">{this.state.Did_heartrate_reach_99}</td>
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
          	   {this.state.Did_you_measure_HRR == "Yes" || this.state.Did_you_measure_HRR == "" &&
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
		          	    <td className = "hr_table_style_rows">Heart Rate End Time Activity</td>
						<td className = "hr_table_style_rows">{this.state.end_heartrate_activity}</td>
	          	    </tr>

	          	     <tr className = "hr_table_style_rows">
		          	    <td className = "hr_table_style_rows">Heart rate beats your heart rate went down/(up) from end of workout file to start of HRR file</td>
		          	    <td className = "hr_table_style_rows">{this.state.heart_rate_down_up}</td>
	          	    </tr>

	          	    <tr className = "hr_table_style_rows">
		          	    <td className = "hr_table_style_rows">Pure 1 Minute HRR Beats Lowered</td>
						<td className = "hr_table_style_rows">{this.state.pure_1min_heart_beats}</td>
	          	    </tr>

	          	    <tr className = "hr_table_style_rows">
		          	    <td className = "hr_table_style_rows">Pure 1 Minute time to 99</td>
						<td className = "hr_table_style_rows">{this.state.pure_time_99}</td>
	          	    </tr>
	          	    </tbody>
          	    </table>   
          	   </div>
          	  </div>
          	}
          	  {this.state.Did_you_measure_HRR == "No" &&
          	   <div className = "row justify-content-center hr_table_padd">
          	    <div className = "table table-responsive">
          	    <table className = "table table-striped table-bordered ">
	          	    <thead className = "hr_table_style_rows">
		          	    <th className = "hr_table_style_rows">Hrr Automation When User Didn't Create HRR File</th>
		          	    <th className = "hr_table_style_rows">{moment(this.state.selectedDate).format("MMM DD, YYYY")}</th>
	          	    </thead>  
	          	    <tbody>  

	          	    <tr className = "hr_table_style_rows">
		          	    <td className = "hr_table_style_rows">Did you measure your heart rate recovery (HRR) after today’s aerobic workout?</td>
						<td className = "hr_table_style_rows">{this.state.Did_you_measure_HRR}</td>
	          	    </tr>

	          	      <tr className = "hr_table_style_rows">
		          	    <td className = "hr_table_style_rows">Did your heart rate go down to 99 beats per minute or lower?</td>
						<td className = "hr_table_style_rows">{this.state.no_fitfile_hrr_reach_99}</td>
	          	    </tr>

	          	     <tr className = "hr_table_style_rows">
		          	    <td className = "hr_table_style_rows">Duration (mm:ss) for Heart Rate Time to Reach 99</td>
		          	    <td className = "hr_table_style_rows">{this.renderSecToMin(this.state.no_fitfile_hrr_time_reach_99)}</td>
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
function mapStateToProps(state){
  return {
    errorMessage: state.garmin_auth.error,
    message : state.garmin_auth.message
  };
}
export default connect(mapStateToProps,{getGarminToken,logoutUser})(withRouter(HeartRateCal));
Navbar.propTypes={
    fixed: PropTypes.string,
    color: PropTypes.string,
};