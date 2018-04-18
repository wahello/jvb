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
	    this.handleLogout = this.handleLogout.bind(this);
		this.toggle = this.toggle.bind(this);
	    this.state = {
	    	selectedDate:new Date(),
	    	calendarOpen:false,
	    	isOpen:false,
	    	aerobic_zone:"",
            anaerobic_zone:"",
            below_aerobic_zone:"",
            aerobic_range:"",
            anaerobic_range:"",
            below_aerobic_range:"",
			total_time:"",
			percent_aerobic:"",
			percent_below_aerobic:"",
			percent_anaerobic:"",
			total_percent:"",
			empty:"",

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
			total_time:data.data.total_time,
			percent_aerobic:data.data.percent_aerobic,
			percent_below_aerobic:data.data.percent_below_aerobic,
			percent_anaerobic:data.data.percent_anaerobic,
			total_percent:data.data.total_percent,
		});
	}
	toggleCalendar(){
	    this.setState({
	      calendarOpen:!this.state.calendarOpen
	    });
    }
	errorHeartRate(error){
		console.log(error.message)
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
			calendarOpen:!this.state.calendarOpen
		},()=>{
			fetchHeartRateData(this.successHeartRate,this.errorHeartRate,this.state.selectedDate);
		});
		
	}
	componentDidMount(){
		fetchHeartRateData(this.successHeartRate,this.errorHeartRate,this.state.selectedDate);
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
		            <h4 className="head" id="head" style = {{fontSize:"22px"}}>Heartrate Aerobic/Anaerobic Ranges
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
			 <div className="col-md-12,col-sm-12,col-lg-12">
	            <div className="row" style = {{marginTop:"10px"}}>
	            	<span id="navlink" onClick={this.toggleCalendar} id="progress">
	                    <FontAwesome
	                        name = "calendar"
	                        size = "2x"
	                    />
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
	                <span style = {{marginLeft:"20px",fontWeight:"bold",paddingTop:"7px"}}>{moment(this.state.selectedDate).format('MMM DD, YYYY')}</span>  
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

	          	    <td className = "hr_table_style_rows">Total Workout Duration</td>
					<td className = "hr_table_style_rows">{(this.state.empty)}</td>
	          	    <td className = "hr_table_style_rows">{this.renderTime(this.state.total_time)}</td>
	          	    <td className = "hr_table_style_rows">{this.renderpercentage(this.state.total_percent)}</td>
	          	    </tr>
	          	    </tbody>
          	    </table>   
          	   </div>
          	  </div>
          	  </div>
			</div>

		)
	}
}
function mapStateToProps(state){
  return {
    errorMessage: state.garmin_auth.error,
    message : state.garmin_auth.message
  };
}
export default connect(mapStateToProps,{getGarminToken,logoutUser})(withRouter(HeartRate));
Navbar.propTypes={
    fixed: PropTypes.string,
    color: PropTypes.string,
} 