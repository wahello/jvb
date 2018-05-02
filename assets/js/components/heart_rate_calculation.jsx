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

axiosRetry(axios, { retries: 3});


var CalendarWidget = require('react-calendar-widget');
var ReactDOM = require('react-dom');

class HeartRateCal extends Component{
	constructor(props) {
    super(props);
    this.state = {
    	calendarOpen:false,
	    isOpen:false,
	    selectedDate:new Date(),
	    "hrr_start_time":'01:02',
	    'hrr_start_rate':148,
	    'lowest_heart_rate':96,
	    'time_99':'00:48',
	    'end_time_activity':'01:15:23',
	    'heart_rate_end_activity':149,
	    'diff_activityend_hrrstart':'00:10',
    }
     this.toggleCalendar = this.toggleCalendar.bind(this);
	 this.handleLogout = this.handleLogout.bind(this);
	 this.toggle = this.toggle.bind(this);
	 this.successHeart = this.successHeart.bind(this);
	 this.errorHeart = this.errorHeart.bind(this);
	 this.processDate = this.processDate.bind(this);
  }
  successHeart(data){
  	this.setState({

  	});
  }
  errorHeart(error){
		console.log(error.message);
	}
  processDate(selectedDate){
		this.setState({
			selectedDate:selectedDate,
			calendarOpen:!this.state.calendarOpen,
		},()=>{
			fetchHeartData(this.successHeart,this.errorHeart,this.state.selectedDate);
		});
		
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

	             <div className = "row justify-content-center hr_table_padd">
          	    <div className = "table table-responsive">
          	    <table className = "table table-striped table-bordered ">
	          	    <thead className = "hr_table_style_rows">
		          	    <th className = "hr_table_style_rows">Category</th>
		          	    <th className = "hr_table_style_rows">{moment(this.state.selectedDate).format("MMM DD, YYYY")}</th>
	          	    </thead>  
	          	    <tbody>  

	          	    <tr className = "hr_table_style_rows">   
		          	    <td className = "hr_table_style_rows">Hrr Start Time(hh:mm)</td>    
		          	    <td className = "hr_table_style_rows">{this.state.hrr_start_time}</td>
	          	    </tr>

	          	    <tr className = "hr_table_style_rows">
		          	    <td className = "hr_table_style_rows">Hrr Start Rate</td>
		          	    <td className = "hr_table_style_rows">{this.state.hrr_start_rate}</td>
	          	    </tr>

	          	    <tr className = "hr_table_style_rows">
		          	    <td className = "hr_table_style_rows">Lowest Heart Rate</td>
		          	    <td className = "hr_table_style_rows">{this.state.lowest_heart_rate}</td>
	          	    </tr>

	          	    <tr className = "hr_table_style_rows">
		          	    <td className = "hr_table_style_rows">Time to 99</td>
						<td className = "hr_table_style_rows">{this.state.time_99}</td>
	          	    </tr>

	          	     <tr className = "hr_table_style_rows">
		          	    <td className = "hr_table_style_rows">End Time Activity(hh:mm:ss)</td>
		          	    <td className = "hr_table_style_rows">{this.state.end_time_activity}</td>
	          	    </tr>

	          	    <tr className = "hr_table_style_rows">
		          	    <td className = "hr_table_style_rows">Heart Rate End Activity</td>
						<td className = "hr_table_style_rows">{this.state.heart_rate_end_activity}</td>
	          	    </tr>
	          	    <tr className = "hr_table_style_rows">
		          	    <td className = "hr_table_style_rows">Difference Between Activity End time and Hrr Start time(mm:ss)</td>
		          	    <td className = "hr_table_style_rows">{this.state.diff_activityend_hrrstart}</td>
	          	    </tr>

	          	    </tbody>
          	    </table>   
          	   </div>
          	  </div>
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