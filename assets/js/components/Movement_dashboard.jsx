import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import _ from 'lodash';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';
import FontAwesome from "react-fontawesome";
import { Collapse, Navbar, NavbarToggler, 
        NavbarBrand, Nav, NavItem, NavLink,
        Button,Popover,PopoverBody,Form,FormGroup,
        FormText,Label,Input,Card, CardImg, CardText, 
        CardBody,CardTitle, CardSubtitle} from 'reactstrap';
import NavbarMenu from './navbar';
import {fetchLastSync} from '../network/quick';
import fetchMovementData from '../network/momentDashboard';

axiosRetry(axios, { retries: 3});


var CalendarWidget = require('react-calendar-widget');
var ReactDOM = require('react-dom');

class Movement_Dashboard extends Component{
	constructor(props) {
		super(props);
		this.state = {
			calendarOpen:false,
			exercise_steps:"",
			mcs_score:"",
			non_exercise_steps:"",
			steps_this_hour:"",
			total_steps:"",
			last_synced:null,
			selectedDate:new Date(),

		}
		this.renderHourStepsColor = this.renderHourStepsColor.bind(this);
		this.renderHourNonExerciseStepsColor = this.renderHourNonExerciseStepsColor.bind(this);
		this.renderMcsColors = this.renderMcsColors.bind(this);
		this.toggleCalendar = this.toggleCalendar.bind(this);
		this.successMovementData = this.successMovementData.bind(this);
		this.errorMovementData = this.errorMovementData.bind(this);
		this.processDate = this.processDate.bind(this);
		this.successLastSync = this.successLastSync.bind(this);
		this.errorquick = this.errorquick.bind(this);
		this.renderLastSync = this.renderLastSync.bind(this);
		this.renderAddDate = this.renderAddDate.bind(this);
		this.renderRemoveDate = this.renderRemoveDate.bind(this);
	}
	successMovementData(data){
		if(!_.isEmpty(data.data)){
			this.setState({
		  		exercise_steps:data.data.exercise_steps,
				mcs_score:data.data.mcs_score,
				non_exercise_steps:data.data.non_exercise_steps,
				steps_this_hour:data.data.steps_this_hour,
				total_steps:data.data.total_steps,
			});
		}else{
			this.setState({
		  		exercise_steps:null,
				mcs_score:null,
				non_exercise_steps:null,
				steps_this_hour:null,
				total_steps:null,
			});
		}
  	}

  	errorMovementData(error){
		console.log(error.message);
    }
    successLastSync(data){
    	/* Getting Wearable Device Last Sync date and time*/
    	let last_synced;
    	if(_.isEmpty(data.data))
    		last_synced = null
    	else
    		 last_synced = data.data.last_synced;
    	this.setState({
    		last_synced:last_synced,
    	})
    }
    errorquick(error){
		console.log(error.message);
	}
	 renderLastSync(value){
	    let time;
	    var sync = "";
	    if(value){
	      	time = moment(value).format("MMM DD, YYYY @ hh:mm a");
	      	sync = <div style = {{fontSize:"15px",fontWeight:"bold",fontFamily:'Proxima-Nova',color:"black"}}>Wearable Device Last Synced on {time}</div>;
	    }
	    return sync;
	}
	renderAddDate(){
		/*It is forward arrow button for the calender getting the next day date*/
		var today = this.state.selectedDate;
		var tomorrow = moment(today).add(1, 'days');
		this.setState({
			selectedDate:tomorrow.toDate()
		},()=>{
			fetchMovementData(this.successMovementData,this.errorMovementData,this.state.selectedDate);
		});
	}
	renderRemoveDate(){
		/*It is backward arrow button for the calender getting the last day date*/
		var today = this.state.selectedDate;
		var tomorrow = moment(today).subtract(1, 'days');
		this.setState({
			selectedDate:tomorrow.toDate()
		},()=>{
			fetchMovementData(this.successMovementData,this.errorMovementData,this.state.selectedDate);
		});
	}
    processDate(selectedDate){
		this.setState({
			selectedDate:selectedDate,
			calendarOpen:!this.state.calendarOpen,
		},()=>{
			fetchMovementData(this.successMovementData,this.errorMovementData,this.state.selectedDate);
		});
	}
	renderCommaInSteps(value){
		/* Adding comma (,) to steps when we get steps greater then 999
		 this function will work and will add (,)*/
		if(value){
			value += '';
	     	var x = value.split('.');
	    	var x1 = x[0];
	        var x2 = x.length > 1 ? '.' + x[1] : '';
	        var rgx = /(\d+)(\d{3})/;
	        while (rgx.test(x1)) {
	        	x1 = x1.replace(rgx, '$1' + ',' + '$2');
	        }
	        value = x1+x2;
    	}
    	else if(value == 0){
        	value = "0";
        }
        else{
        	value = "No Data Yet"
        }
        return value;
	}
	renderHourStepsColor(score){
		/* adding background color to card depends upon their steps ranges*/
		let background = "";
		let color = "";
		let hr_background = "";
		if(score){
	            if(score >= 300){
                	 background = "green";
                	 color = "white";
                	 hr_background = "white" 
	            }
	            else if(score >= 0 && score < 300){
	            	 background = "#FF0101";
	            	 color = "black";
	            	 hr_background = "#e5e5e5" 
	            }
		}
        else{
        	score = "No Data Yet"
        	background = "white";
        	color = "#5e5e5e";
        	hr_background = "#e5e5e5" 
        }

		let score1 = this.renderCommaInSteps(score);
		var model = <Card className = "card_style"
						 id = "my-card"
						 style = {{background:background, color:color}}>
					        <CardBody>
					          	<CardTitle className = "header_style">Steps This Hour</CardTitle>
					          	<hr className = "hr_style"
					          		id = "hr-style" 
					          		style = {{background:hr_background}}/>
					          	<CardText className = "value_style">{score1}</CardText>
					        </CardBody>
					    </Card>
		return model;
	}
	renderHourNonExerciseStepsColor(score){
		/* adding background color to card depends upon their Non-Exercise steps ranges*/
		let background = "";
		let color = "";
		let hr_background = "";
		if(score){
	            if(score >= 10000){
	           		background = 'green';
	               	color = 'white';
	               	hr_background = 'white';
	            }
	            else if(score >= 7500 && score < 10000){
	                background = '#32CD32';
	                color = 'white';
	                hr_background = 'white';
	            }
	            else if(score >= 5000 && score < 7500){
	                background = '#FFFF01';
	                color = 'black';
	                hr_background = 'black';
	            }
	            else if(score >= 3500 && score < 5000){
	                background = '#E26B0A';
	                color = 'black';
	                hr_background = 'black';
	            }
	            else if(score >= 0 && score < 3500){
	                background = '#FF0101';
	                color = 'black';
	                hr_background = 'black';
	            }
        }
       else{
	        	score = "No Data Yet"
	            background = 'white';
	            color = '#5e5e5e';
	            hr_background = '#e5e5e5';
        }
		let score1 = this.renderCommaInSteps(score);
		var model = <Card className = "card_style"
						 id = "my-card"
						 style = {{background:background, color:color}}>
					        <CardBody>
					          	<CardTitle className = "header_style">Today's Non Exercise Steps</CardTitle>
					          	<hr className = "hr_style"
					          		id = "hr-style" 
					          		style = {{background:hr_background}}/>
					          	<CardText className = "value_style">{score1}</CardText>
					        </CardBody>
					    </Card>
		return model;
	}
	renderMcsColors(score){
		/* adding background color to card depends upon their Movement Consistency Score ranges*/
		let background = "";
		let color = "";
		let hr_background = "";
		if(score || score == 0){
		var score = parseFloat(score); 
	            if(score <= "4.5"){
	               	background = 'green';
	               	color = 'white';
	               	hr_background = 'white';
	            }
	            else if(score > "4.5" && score <= "6"){
	                background = '#32CD32';
	                color = 'white';
	                hr_background = 'white';
	            }
	            else if(score > "6" && score <= "7"){
	                background = '#FFFF01';
	                color = 'black';
	                hr_background = 'black';
	            }
	            else if(score > "7" && score <= "10"){
	                background = '#E26B0A';
	                color = 'black';
	                hr_background = 'black';
	            }
	            else if(score > "10"){
	                background = '#FF0101';
	                color = 'black';
	                hr_background = 'black';
	            }
        	
		}
		else{
				score = "No Data Yet"
	            background = 'white';
	            color = '#5e5e5e';
	            hr_background = '#E5E5E5';
        }
		var model = <Card className = "card_style" 
							id = "my-card-mcs"
							 style = {{background:background, color:color}}>
				        	<CardBody>
				          		<CardTitle className = "header_style">Today’s Movement Consistency Score (MCS)</CardTitle>
				          		<hr className = "hr_style" 
				          			id = "hr-style-mcs"
				          			style = {{background:hr_background}}/>
				          		<CardText className = "value_style">{score}
				          	    <Link to={`/mcs_dashboard?date=${moment(this.state.selectedDate).format('YYYY-MM-DD')}`}>
                                   <span id="lbfontawesome">
			                           <FontAwesome
			                    	     className = "fantawesome_style"
			                             name = "external-link"
			                             size = "1x"
			                           />
			                        </span> 
			                    </Link> 
				          		</CardText>
				        	</CardBody>
			      		</Card>
		return model;
	}
	toggleCalendar(){
		//Toggle of calander icon.
	    this.setState({
	      calendarOpen:!this.state.calendarOpen
	    });
    }
    componentDidMount(){
		 fetchLastSync(this.successLastSync,this.errorquick);
		 fetchMovementData(this.successMovementData,this.errorMovementData,this.state.selectedDate);
	}
	render(){
		return(
			<div>
				<NavbarMenu title={"Movement Dashboard"} />
				<div className = "cla_center">
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
						<span style = {{textAlign:"center"}}>{this.renderLastSync(this.state.last_synced)}</span>
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
				<div className = "row justify-content-center md_padding">
					<div className = "col-md-6 table_margin ">
						{this.renderHourStepsColor(this.state.steps_this_hour)}
				    </div>
					<div className = "col-md-6  table_margin ">
			      		{this.renderHourNonExerciseStepsColor(this.state.non_exercise_steps)}
			      	</div>
				</div>
				<div className = "row justify-content-center md_padding">
					<div className = "col-md-6 table_margin ">
						{this.renderMcsColors(this.state.mcs_score)}
				    </div>
					<div className = "col-md-6  table_margin ">
						<Card className = "card_style">
					        <CardBody>
					          	<CardTitle className = "header_style">Today's Exercise/Activity Steps</CardTitle>
					          	<hr className = "hr_style"/>
					          	<CardText className = "value_style">{this.renderCommaInSteps(this.state.exercise_steps)}</CardText>
					        </CardBody>
					    </Card>
				    </div>
				</div>
				<div className = "row justify-content-center md_padding">
					<div className = "col-md-6  table_margin ">
						<Card className = "card_style">
				        	<CardBody>
				          		<CardTitle className = "header_style">Total Steps Today</CardTitle>
				          		<hr className = "hr_style"/>
				          		<CardText className = "value_style">{this.renderCommaInSteps(this.state.total_steps)}</CardText>
				        	</CardBody>
				      	</Card>
				    </div>
				</div>
			</div>
		);
	}
}
export default Movement_Dashboard;