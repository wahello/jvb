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
        FormText,Label,Input,Card, CardImg, CardText, 
        CardBody,CardTitle, CardSubtitle} from 'reactstrap';
import NavbarMenu from './navbar';
import {fetchLastSync} from '../network/quick';
import fetchGradesData from '../network/gradesDashboard';
axiosRetry(axios, { retries: 3});


var CalendarWidget = require('react-calendar-widget');
var ReactDOM = require('react-dom');

class Grades_Dashboard extends Component{
	constructor(props) {
		super(props);
		this.state = {
			calendarOpen:false,
			overall_health_gpa:"2.80",
			non_exercise_steps:5000,
			movement_consistency_score:"7",
			sleep_per_night:"8:00",
			exercise_consistency_score:"5.10",
			prcnt_unprocessed_food_grade:20,
			alcoholic_drinks_week_grade:"Not Reported",
			inputs:"Yes",
			sleep_aid:"Yes",
			controlled_substance:"No",
			smoking:"No",
			last_synced:null,
			selectedDate:new Date(),
		}
		this.renderHourStepsColor = this.renderHourStepsColor.bind(this);
		this.renderHourNonExerciseStepsColor = this.renderHourNonExerciseStepsColor.bind(this);
		this.renderMcsColors = this.renderMcsColors.bind(this);
		this.renderMcsColors1 = this.renderMcsColors1.bind(this);
		this.successLastSync = this.successLastSync.bind(this);
		this.errorquick = this.errorquick.bind(this);
		this.renderLastSync = this.renderLastSync.bind(this);
		this.renderAddDate = this.renderAddDate.bind(this);
		this.renderRemoveDate = this.renderRemoveDate.bind(this);
		this.processDate = this.processDate.bind(this);
		this.toggleCalendar = this.toggleCalendar.bind(this);
		this.successGradesData = this.successGradesData.bind(this);
		this.errorGradesData = this.errorGradesData.bind(this);
	}
	successGradesData(data){
	  
  	}

  	errorGradesData(error){
		console.log(error.message);
    }
	 successLastSync(data){
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
	toggleCalendar(){
	    this.setState({
	      calendarOpen:!this.state.calendarOpen
	    });
    }
	renderAddDate(){
		var today = this.state.selectedDate;
		var tomorrow = moment(today).add(1, 'days');
		this.setState({
			selectedDate:tomorrow.toDate()
		});
	}
	renderRemoveDate(){
		var today = this.state.selectedDate;
		var tomorrow = moment(today).subtract(1, 'days');
		this.setState({
			selectedDate:tomorrow.toDate()
		});
	}
	processDate(selectedDate){
		this.setState({
			selectedDate:selectedDate,
			calendarOpen:!this.state.calendarOpen,
		},()=>{
			fetchGradesData(this.successGradesData,this.errorGradesData,this.state.selectedDate);
		});
	}
	renderCommaInSteps(value){
		/* Adding comma (,) to steps when we get steps greater then 999
		 this function will work and will add (,)*/
		value += '';
     	var x = value.split('.');
    	var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
        	x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        let score = x1+x2;
        return score;
	}
	renderHourStepsColor(score){
		/* adding background color to card depends upon their steps ranges*/
		setTimeout(function () {
            if(score >= 300){
               	document.getElementById('my-card').style.background = 'green';
               	document.getElementById('my-card').style.color = 'white';
               	document.getElementById('hr-style').style.background = 'white';
            }
            else{
                document.getElementById('my-card').style.background = '#FF0101';
                document.getElementById('my-card').style.color = 'black';
                document.getElementById('hr-style').style.background = 'black';
            }
        }, 100);
		let score1 = this.renderCommaInSteps(score);
		return score1;
	}
	renderHourNonExerciseStepsColor(score){
		/* adding background color to card depends upon their Non-Exercise steps ranges*/
		setTimeout(function () {
            if(score >= 10000){
           		document.getElementById('my-card-nonexercise').style.background = 'green';
               	document.getElementById('my-card-nonexercise').style.color = 'white';
               	document.getElementById('hr-style-nonexercise').style.background = 'white';
            }
            else if(score >= 7500 && score < 10000){
                document.getElementById('my-card-nonexercise').style.background = '#32CD32';
                document.getElementById('my-card-nonexercise').style.color = 'white';
                document.getElementById('hr-style-nonexercise').style.background = 'white';
            }
            else if(score >= 5000 && score < 7500){
                document.getElementById('my-card-nonexercise').style.background = '#FFFF01';
                document.getElementById('my-card-nonexercise').style.color = 'black';
                document.getElementById('hr-style-nonexercise').style.background = 'black';
            }
            else if(score >= 3500 && score < 5000){
                document.getElementById('my-card-nonexercise').style.background = '#E26B0A';
                document.getElementById('my-card-nonexercise').style.color = 'black';
                document.getElementById('hr-style-nonexercise').style.background = 'black';
            }
            else if(score < 3500){
                document.getElementById('my-card-nonexercise').style.background = '#FF0101';
                document.getElementById('my-card-nonexercise').style.color = 'black';
                document.getElementById('hr-style-nonexercise').style.background = 'black';
            }
        }, 100);

		let score1 = this.renderCommaInSteps(score);
		return score1;
	}
	renderMcsColors(score){
		/* adding background color to card depends upon their Movement Consistency Score ranges*/
		var score = parseFloat(score); 
		setTimeout(function () {
            if(score <= "4.5"){
               	document.getElementById('my-card-mcs').style.background = 'green';
               	document.getElementById('my-card-mcs').style.color = 'white';
               	document.getElementById('hr-style-mcs').style.background = 'white';
            }
            else if(score > "4.5" && score <= "6"){
                document.getElementById('my-card-mcs').style.background = '#32CD32';
                document.getElementById('my-card-mcs').style.color = 'white';
                document.getElementById('hr-style-mcs').style.background = 'white';
            }
            else if(score > "6" && score <= "7"){
                document.getElementById('my-card-mcs').style.background = '#FFFF01';
                document.getElementById('my-card-mcs').style.color = 'black';
                document.getElementById('hr-style-mcs').style.background = 'black';
            }
            else if(score > "7" && score <= "10"){
                document.getElementById('my-card-mcs').style.background = '#E26B0A';
                document.getElementById('my-card-mcs').style.color = 'black';
                document.getElementById('hr-style-mcs').style.background = 'black';
            }
            else if(score > "10"){
                document.getElementById('my-card-mcs').style.background = '#FF0101';
                document.getElementById('my-card-mcs').style.color = 'black';
                document.getElementById('hr-style-mcs').style.background = 'black';
            }
          }, 100);
		return score;
	}
	renderMcsColors1(score){
		/* adding background color to card depends upon their Movement Consistency Score ranges*/
		var score = parseFloat(score); 
		setTimeout(function () {
            if(score <= "4.5"){
               	document.getElementById('my-card-mcs1').style.background = 'green';
               	document.getElementById('my-card-mcs1').style.color = 'white';
               	document.getElementById('hr-style-mcs1').style.background = 'white';
            }
            else if(score > "4.5" && score <= "6"){
                document.getElementById('my-card-mcs1').style.background = '#32CD32';
                document.getElementById('my-card-mcs1').style.color = 'white';
                document.getElementById('hr-style-mcs1').style.background = 'white';
            }
            else if(score > "6" && score <= "7"){
                document.getElementById('my-card-mcs1').style.background = '#FFFF01';
                document.getElementById('my-card-mcs1').style.color = 'black';
                document.getElementById('hr-style-mcs1').style.background = 'black';
            }
            else if(score > "7" && score <= "10"){
                document.getElementById('my-card-mcs1').style.background = '#E26B0A';
                document.getElementById('my-card-mcs1').style.color = 'black';
                document.getElementById('hr-style-mcs1').style.background = 'black';
            }
            else if(score > "10"){
                document.getElementById('my-card-mcs1').style.background = '#FF0101';
                document.getElementById('my-card-mcs1').style.color = 'black';
                document.getElementById('hr-style-mcs1').style.background = 'black';
            }
          }, 100);
		return score;
	}
	componentDidMount(){
		 fetchLastSync(this.successLastSync,this.errorquick);
	}
	render(){
		return(
			<div>
				<NavbarMenu title={"Grades Dashboard"} />
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
				<div className = "row">
					<div className = "col-md-4 gd_table_margin ">
						<Card className = "gd_card_style" id = "my-card-mcs">
					        <CardBody>
					          	<CardTitle className = "gd_header_style">Overall Health GPA</CardTitle>
					          	<hr className = "hr_style" id = "hr-style-mcs"/>
					          	<CardText className = "gd_value_style">{this.renderMcsColors(this.state.overall_health_gpa)}</CardText>
					        </CardBody>
					    </Card>
				    </div>
					<div className = "col-md-4 gd_table_margin ">
			      		<Card className = "gd_card_style" id = "my-card-nonexercise">
				        	<CardBody>
					          	<CardTitle className = "gd_header_style">Non Exercise Steps</CardTitle>
					          	<hr className = "hr_style" id = "hr-style-nonexercise"/>
					          	<CardText className = "gd_value_style">{this.renderHourNonExerciseStepsColor(this.state.non_exercise_steps)}</CardText>
				        	</CardBody>
				      	</Card>
			      	</div>
			      	<div className = "col-md-4 gd_table_margin ">
			      		<Card className = "gd_card_style" id = "my-card-mcs1">
				        	<CardBody>
					          	<CardTitle className = "gd_header_style">Movement Consistency Score</CardTitle>
					          	<hr className = "hr_style" id = "hr-style-mcs1"/>
					          	<CardText className = "gd_value_style">{this.renderMcsColors1(this.state.movement_consistency_score)}</CardText>
				        	</CardBody>
				      	</Card>
			      	</div>
				</div>
				<div className = "row">
					<div className = "col-md-4 gd_table_margin ">
						<Card className = "gd_card_style">
				        	<CardBody>
				          		<CardTitle className = "gd_header_style">Sleep Per Night</CardTitle>
				          		<hr className = "hr_style" />
				          		<CardText className = "gd_value_style">{this.state.sleep_per_night}</CardText>
				        	</CardBody>
			      		</Card>
				    </div>
					<div className = "col-md-4 gd_table_margin ">
						<Card className = "gd_card_style" id = "my-card-mcs">
					        <CardBody>
					          	<CardTitle className = "gd_header_style">Exercise Consistency Score</CardTitle>
					          	<hr className = "hr_style" id = "hr-style-mcs"/>
					          	<CardText className = "gd_value_style">{this.renderMcsColors(this.state.exercise_consistency_score)}</CardText>
					        </CardBody>
					    </Card>
				    </div>
				    <div className = "col-md-4 gd_table_margin ">
						<Card className = "gd_card_style">
					        <CardBody>
					          	<CardTitle className = "gd_header_style">% Unprocessed Food Grade</CardTitle>
					          	<hr className = "hr_style"/>
					          	<CardText className = "gd_value_style">{this.state.prcnt_unprocessed_food_grade}</CardText>
					        </CardBody>
					    </Card>
				    </div>
				</div>
				<div className = "row">
					<div className = "col-md-4 gd_table_margin ">
						<Card className = "gd_card_style">
				        	<CardBody>
				          		<CardTitle className = "gd_header_style">Alcoholic Drinks Per Week Grade</CardTitle>
				          		<hr className = "hr_style"/>
				          		<CardText className = "gd_value_style">{this.state.alcoholic_drinks_week_grade}</CardText>
				        	</CardBody>
				      	</Card>
				    </div>
				    <div className = "col-md-4 gd_table_margin ">
						<Card className = "gd_card_style">
				        	<CardBody>
				          		<CardTitle className = "gd_header_style">Did you Report your Inputs Today?</CardTitle>
				          		<hr className = "hr_style"/>
				          		<CardText className = "gd_value_style">{this.state.inputs}</CardText>
				        	</CardBody>
				      	</Card>
				    </div>
				    <div className = "col-md-4 gd_table_margin ">
						<Card className = "gd_card_style">
				        	<CardBody>
				          		<CardTitle className = "gd_header_style">Penalties</CardTitle>
				          		<hr className = "hr_style"/>
				          		<CardText >
					          		<div>
					          			<span>Sleep Aids:- </span><span className = "gd_value_style">{this.state.sleep_aid}</span>
					          		</div>
					          		<hr className = "hr_style"/>
					          		<div>
					          			<span>Controlled Subtances:- </span><span className = "gd_value_style">{this.state.controlled_substance}</span>
					          		</div>
					          		<hr className = "hr_style"/>
					          		<div>
					          			<span>Smoking:- </span><span className = "gd_value_style">{this.state.smoking}</span>
					          		</div>
				          		</CardText>
				        	</CardBody>
				      	</Card>
				    </div>
				</div>
			</div>
		);
	}
}
export default Grades_Dashboard;