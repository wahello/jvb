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
import {getUserProfile} from '../network/auth';
axiosRetry(axios, { retries: 3});


var CalendarWidget = require('react-calendar-widget');
var ReactDOM = require('react-dom');

class Grades_Dashboard extends Component{
	constructor(props) {
		super(props);
		this.state = {
			calendarOpen:false,
			"smoking_penalty": "-",
			"non_exercise_steps": "-",
			"unprocessed_food_grade": "-",
			"mcs_score": "-",
			"sleep_aids_penalty": "-",
			"exercise_consistency_score": "-",
			"overall_health_gpa": "-",
			"sleep_per_night": "-",
			"alcoholic_drinks_per_week_grade": "-",
			"report_inputs_today": "-",
			"controlled_subtances_penalty": "-",
			"did_you_workout":"",
			"alcohol_drinks_yesterday":"",
			last_synced:null,
			"gender":"",
			"date_of_birth":"",
			selectedDate:new Date(),
		}
		this.renderHourNonExerciseStepsColor = this.renderHourNonExerciseStepsColor.bind(this);
		this.renderMcsColors = this.renderMcsColors.bind(this);
		this.renderOverallHealthColors = this.renderOverallHealthColors.bind(this);
		this.successLastSync = this.successLastSync.bind(this);
		this.errorquick = this.errorquick.bind(this);
		this.renderLastSync = this.renderLastSync.bind(this);
		this.renderAddDate = this.renderAddDate.bind(this);
		this.renderRemoveDate = this.renderRemoveDate.bind(this);
		this.processDate = this.processDate.bind(this);
		this.toggleCalendar = this.toggleCalendar.bind(this);
		this.successGradesData = this.successGradesData.bind(this);
		this.errorGradesData = this.errorGradesData.bind(this);
		this.getStylesForUserinputSleep = this.getStylesForUserinputSleep.bind(this);
	 	this.strToSecond = this.strToSecond.bind(this);
	 	this.getStylesPrcntUnprocessedFood = this.getStylesPrcntUnprocessedFood.bind(this);
	 	this.successProfile = this.successProfile.bind(this);
	 	this.getStylesAlcohol = this.getStylesAlcohol.bind(this);
	 	this.getStylesUserinput = this.getStylesUserinput.bind(this);
	 	this.renderPanalitiesColor = this.renderPanalitiesColor.bind(this);
	 	this.renderControlledColor = this.renderControlledColor.bind(this);
	 	this.renderAge = this.renderAge.bind(this);
	 	this.renderEcsColors = this.renderEcsColors.bind(this);
	 	this.gpascoreDecimal = this.gpascoreDecimal.bind(this);
	 	this.renderSmokeColor = this.renderSmokeColor.bind(this);
	 	this.renderWorkoutCard = this.renderWorkoutCard.bind(this);
	 	this.renderAlocoholYesterdayCard = this.renderAlocoholYesterdayCard.bind(this);
	}
	successGradesData(data){
		this.setState({
  			"smoking_penalty": data.data.smoking_penalty,
			"non_exercise_steps":data.data.non_exercise_steps,
			"unprocessed_food_grade": data.data.unprocessed_food_grade,
			"mcs_score": data.data.mcs_score,
			"sleep_aids_penalty": data.data.sleep_aids_penalty,
			"exercise_consistency_score": data.data.exercise_consistency_score,
			"overall_health_gpa": data.data.overall_health_gpa,
			"sleep_per_night": data.data.sleep_per_night,
			"alcoholic_drinks_per_week_grade": data.data.alcoholic_drinks_per_week_grade,
			"report_inputs_today": data.data.report_inputs_today,
			"controlled_subtances_penalty": data.data.controlled_subtances_penalty,
			"did_you_workout":data.data.did_you_workout,
			"alcohol_drinks_yesterday":data.data.alcohol_drinks_yesterday,
		});
  	}
  	successProfile(data){
  		this.setState({
  			gender:data.data.gender,
  			date_of_birth:data.data.date_of_birth,
  		})
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
		},()=>{
			fetchGradesData(this.successGradesData,this.errorGradesData,this.state.selectedDate);
		});
	}
	renderRemoveDate(){
		var today = this.state.selectedDate;
		var tomorrow = moment(today).subtract(1, 'days');
		this.setState({
			selectedDate:tomorrow.toDate()
		},()=>{
			fetchGradesData(this.successGradesData,this.errorGradesData,this.state.selectedDate);
		});
	}
	processDate(selectedDate){
		this.setState({
			selectedDate:selectedDate,
			calendarOpen:!this.state.calendarOpen,
		},()=>{
			fetchGradesData(this.successGradesData,this.errorGradesData,this.state.selectedDate);
			getUserProfile(this.successProfile);
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
	gpascoreDecimal(gpa){
		let value;
		let x = gpa;
		if( x !=  null && x != undefined && x != "No Data Yet"){
		    value =parseFloat(x).toFixed(2);
		}
		else{
			value = "No Data Yet";
		} 
		return value;
	}
	getStylesAlcohol(score){
		let background = "";
		let color = "";
		let hr_background = "";
		var score = parseFloat(score); 
		if(this.state.gender == "M"){
			if(score || score == "0"){
			 	if(score <= "5" && score >= "0"){
	               	background = 'green';
	               	color = 'white';
	               	hr_background = 'white';
	            }
	            else if(score > "5" && score < "12"){
	                background = '#32CD32';
	                color = 'white';
	                hr_background = 'white';
	            }
	            else if(score >= "12" && score < "15"){
	                background = '#FFFF01';
	                color = 'black';
	                hr_background = 'black';
	            }
	            else if(score >= "15" && score < "16"){
	                background = '#E26B0A';
	                color = 'black';
	                hr_background = 'black';
	            }
	            else if(score >= "16" && score <= "21"){
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
		}
		else if(this.state.gender == "F"){
			if(score || score == "0"){
			 	if(score <= "3" && score >= "0"){
	               	background = 'green';
	               	color = 'white';
	               	hr_background = 'white';
	            }
	            else if(score > "3" && score <= "5"){
	                background = '#32CD32';
	                color = 'white';
	                hr_background = 'white';
	            }
	            else if(score > "5" && score <= "7"){
	                background = '#FFFF01';
	                color = 'black';
	                hr_background = 'black';
	            }
	            else if(score > "7" && score <= "9"){
	                background = '#E26B0A';
	                color = 'black';
	                hr_background = 'black';
	            }
	            else if(score >= "9" && score <= "14"){
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
		}

		var model = <Card className = "card_style"
						 id = "my-card"
						 style = {{background:background, color:color}}>
					        <CardBody>
					          	<CardTitle className = "gd_header_style">Alcoholic Drinks Per Week</CardTitle>
					          	<hr className = "hr_style"
					          		id = "hr-style" 
					          		style = {{background:hr_background}}/>
					          	<CardText className = "gd_value_style">{this.gpascoreDecimal(score)}</CardText>
					        </CardBody>
					    </Card>
		return model;

	}
	getStylesUserinput(score){
		let background = "";
		let color = "";
		let hr_background = "";
		if(score == "yes"){
			score = "Yes";
			background = 'green';
	        color = 'white';
	        hr_background = 'white';
		}
		else{
			score = "No";
			background = '#FF0101';
            color = 'black';
            hr_background = 'black';
		}
		var model = <Card className = "card_style"
						 id = "my-card"
						 style = {{background:background, color:color}}>
					        <CardBody>
					          	<CardTitle className = "gd_header_style">Did you Report your Inputs Today?</CardTitle>
					          	<hr className = "hr_style"
					          		id = "hr-style" 
					          		style = {{background:hr_background}}/>
					          	<CardText className = "gd_value_style">{score}</CardText>
					        </CardBody>
					    </Card>
		return model;
	}
	renderWorkoutCard(score){
		if(score == "yes"){
			score = "Yes";
		}
		else if(score == "no"){
			score = "No";
		}
		else{
			score = "No";
		}
		var model = <Card className = "card_style"
						 id = "my-card"
						>
					        <CardBody>
					          	<CardTitle className = "gd_header_style">Did I Workout Today?</CardTitle>
					          	<hr className = "hr_style"
					          		id = "hr-style" 
					          	/>
					          	<CardText className = "gd_value_style">{score}</CardText>
					        </CardBody>
					    </Card>
		return model;
	}
	renderAlocoholYesterdayCard(score){
		if(!score){
			score = "No Data Yet";
		}
		var model = <Card className = "card_style"
						 id = "my-card"
						>
					        <CardBody>
					          	<CardTitle className = "gd_header_style"># of Alcholic Drinks Consumed Yesterday?</CardTitle>
					          	<hr className = "hr_style"
					          		id = "hr-style" 
					          	/>
					          	<CardText className = "gd_value_style">{score}</CardText>
					        </CardBody>
					    </Card>
		return model;
	}
	renderPersentageSymbol(value){
		if(value != "Not Reported" ){
			value = value + "%";
		}
		else{
			value = "Not Reported";
		}
		return value;
	}
	getStylesPrcntUnprocessedFood(score){
		let background = "";
		let color = "";
		let hr_background = "";
		if(score){
			if (score >= 80 && score <= 100){
	        	background = 'green';
	           	color = 'white';
	           	hr_background = 'white';
	      	}
	      	 else if(score >= 70 && score < 80){
                background = '#32CD32';
                color = 'white';
                hr_background = 'white';
            }
	      	else if (score >= 60 && score < 70){
	    	 	background = '#FFFF01';
	            color = 'black';
	            hr_background = 'black';
	  		}
	  		else if(score >= 50 && score < 60){
                background = '#E26B0A';
                color = 'black';
                hr_background = 'black';
            }
	      	else if (score<50){
	        	background = '#FF0101';
	            color = 'black';
	            hr_background = 'black';
	      	}  	
	    }
	   	else{
	        	score = "Not Reported"
	            background = 'white';
	            color = '#5e5e5e';
	            hr_background = '#e5e5e5';
        }
		var model = <Card className = "card_style"
						 id = "my-card"
						 style = {{background:background, color:color}}>
					        <CardBody>
					          	<CardTitle className = "gd_header_style">% Unprocessed Food</CardTitle>
					          	<hr className = "hr_style"
					          		id = "hr-style" 
					          		style = {{background:hr_background}}/>
					          	<CardText className = "gd_value_style">{this.renderPersentageSymbol(score)}</CardText>
					        </CardBody>
					    </Card>
		return model;
      
    }
	renderHourNonExerciseStepsColor(score){
		/* adding background color to card depends upon their Non-Exercise steps ranges*/
		let background = "";
		let color = "";
		let hr_background = "";
		if(score || score == 0){
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
					          	<CardTitle className = "gd_header_style">Today's Non Exercise Steps</CardTitle>
					          	<hr className = "hr_style"
					          		id = "hr-style" 
					          		style = {{background:hr_background}}/>
					          	<CardText className = "gd_value_style">{score1}</CardText>
					        </CardBody>
					    </Card>
		return model;
	}
	renderOverallHealthColors(score){
		/* adding background color to card depends upon their Movement Consistency Score ranges*/
		let background = "";
		let color = "";
		let hr_background = "";
		if(score || score == 0){
		var score = parseFloat(score); 
	            if(score >= "3.4"){
	               	background = 'green';
	               	color = 'white';
	               	hr_background = 'white';
	            }
	            else if(score >= "3" && score < "3.4"){
	                background = '#32CD32';
	                color = 'white';
	                hr_background = 'white';
	            }
	            else if(score >= "2" && score < "3"){
	                background = '#FFFF01';
	                color = 'black';
	                hr_background = 'black';
	            }
	            else if(score >= "1" && score < "2"){
	                background = '#E26B0A';
	                color = 'black';
	                hr_background = 'black';
	            }
	            else if(score < "1"){
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
				          		<CardTitle className = "gd_header_style">Overall Health GPA</CardTitle>
				          		<hr className = "hr_style" 
				          			id = "hr-style-mcs"
				          			style = {{background:hr_background}}/>
				          		<CardText className = "gd_value_style">{this.gpascoreDecimal(score)}</CardText>
				        	</CardBody>
			      		</Card>
		return model;
	}
	renderEcsColors(score){
		/* adding background color to card depends upon their Movement Consistency Score ranges*/
		let background = "";
		let color = "";
		let hr_background = "";
		if(score || score == 0){
		var score = parseFloat(score); 
            if(score >= 5){
               	background = 'green';
               	color = 'white';
               	hr_background = 'white';
            }
            else if(score == 4){
                background = '#32CD32';
                color = 'white';
                hr_background = 'white';
            }
            else if(score == 3){
                background = '#FFFF01';
                color = 'black';
                hr_background = 'black';
            }
            else if(score == 2){
                background = '#E26B0A';
                color = 'black';
                hr_background = 'black';
            }
            else if(score <= 1){
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
				          		<CardTitle className = "gd_header_style">Exercise Consistency Score</CardTitle>
				          		<hr className = "hr_style" 
				          			id = "hr-style-mcs"
				          			style = {{background:hr_background}}/>
				          		<CardText className = "gd_value_style">{this.gpascoreDecimal(score)}</CardText>
				        	</CardBody>
			      		</Card>
		return model;
	}
	 strToSecond(value){
    	let time = value.split(':');
    	let hours = parseInt(time[0])*3600;
    	let min = parseInt(time[1])*60;
    	let s_time = hours + min;
    	return s_time;
	}
	renderAge(){
		let today_date = new Date();
		let date_of_birth = moment(this.state.date_of_birth);
		let today_date1 = moment(moment(today_date).format('YYYY-MM-DD'));
		let age = Math.abs(today_date1.diff(date_of_birth, 'years'));
		return age;
	}
	getStylesForUserinputSleep(value){
		let background = "";
		let color = "";
		let hr_background = "";
		let score;
		let age = this.renderAge();
		if(value){
		 score = value;
		}
		else{
			score = "No Data Yet";
            background = 'white';
            color = '#5e5e5e';
            hr_background = '#E5E5E5';
        }
			if(value){
				value = this.strToSecond(value);
				if(value < this.strToSecond("6:00") || value > this.strToSecond("12:00")){
					 	background = '#FF0101';
		                color = 'black';
		                hr_background = 'black';
		        }
				else if(this.strToSecond("7:30") <= value && value <= this.strToSecond("10:00")){
						background = 'green';
			            color = 'white';
			            hr_background = 'white';
			    }
		    	else if((this.strToSecond("7:00")<=value && value<= this.strToSecond("7:29"))
		    	 || (this.strToSecond("10:01")<=value && value<=this.strToSecond("10:30"))){
		    		 	background = '#32CD32';
		                color = 'white';
		                hr_background = 'white';
		    	}	
		    	else if((this.strToSecond("6:30")<=value && value<=this.strToSecond("6:59"))
		    	 || (this.strToSecond("10:31")<= value && value<=this.strToSecond("11:00"))){
		    		 	background = '#FFFF01';
		                color = 'black';
		                hr_background = 'black';
		        }
		    	else if((this.strToSecond("06:00")<=value && value<= this.strToSecond("6:29"))
		    	 || (this.strToSecond("11:00")<=value && value<= this.strToSecond("12:00"))){
		    		 	background = '#E26B0A';
		                color = 'black';
		                hr_background = 'black';
		    	}
	    	}
 
   //  	else if(age >= 6 && age <= 17){
			// if(value){
			// 	value = this.strToSecond(value);
			// 	if(value < this.strToSecond("6:00") || value > this.strToSecond("12:00")){
			// 		 	background = '#FF0101';
		 //                color = 'black';
		 //                hr_background = 'black';
		 //        }
			// 	else if(this.strToSecond("8:00") <= value && value <= this.strToSecond("12:00")){
			// 			background = 'green';
			//             color = 'white';
			//             hr_background = 'white';
			//     }
		 //    	else if((this.strToSecond("7:31")<=value && value<= this.strToSecond("8:00"))
		 //    	 || (this.strToSecond("12:01")<=value && value<=this.strToSecond("12:30"))){
		 //    		 	background = '#32CD32';
		 //                color = 'white';
		 //                hr_background = 'white';
		 //    	}	
		 //    	else if((this.strToSecond("7:00")<=value && value<=this.strToSecond("7:29"))
		 //    	 || (this.strToSecond("10:31")<= value && value<=this.strToSecond("11:00"))){
		 //    		 	background = '#FFFF01';
		 //                color = 'black';
		 //                hr_background = 'black';
		 //        }
		 //    	else if((this.strToSecond("06:00")<=value && value<= this.strToSecond("6:29"))
		 //    	 || (this.strToSecond("11:00")<=value && value<= this.strToSecond("12:00"))){
		 //    		 	background = '#E26B0A';
		 //                color = 'black';
		 //                hr_background = 'black';
		 //    	}
	  //   	}
   //  	}
    	
		else{
			value = "No Data Yet";
            background = 'white';
            color = '#5e5e5e';
            hr_background = '#E5E5E5';
        }
        var model = <Card className = "card_style" 
							id = "my-card-mcs"
							 style = {{background:background, color:color}}>
				        	<CardBody>
				          		<CardTitle className = "gd_header_style">Sleep Per Night</CardTitle>
				          		<hr className = "hr_style" 
				          			id = "hr-style-mcs"
				          			style = {{background:hr_background}}/>
				          		<CardText className = "gd_value_style">{score}</CardText>
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
				          		<CardTitle className = "gd_header_style">Today’s Movement Consistency Score (MCS)</CardTitle>
				          		<hr className = "hr_style" 
				          			id = "hr-style-mcs"
				          			style = {{background:hr_background}}/>
				          		<CardText className = "gd_value_style">{score}
                                   <Link to={`/mcs_dashboard?date=${moment(this.state.selectedDate).format('MM-DD-YYYY')}`}>
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
	renderControlledColor(value){
		let background1 = "";
		let color1 = "";
		let hr_background1 = "";
			if(value){
				value = "Yes";
				background1 = 'red';
	           	color1 = 'black';
	           	hr_background1 = 'black';
			}
			else if(value == "0"){
				value = "No";
	           	background1 = 'green';
	           	color1 = 'white';
	           	hr_background1 = 'white';
			}
			else{
				value = "Not Reported"
	            background1 = 'white';
	            color1 = '#5e5e5e';
	            hr_background1 = '#E5E5E5';
			}
		let modal = <CardText className = "gd_value_style" style = {{background:background1, color:color1}}>
					          		
	          			<span>Controlled Subtances: </span><span className = "gd_value_style">{value}</span>
					          		
	          		</CardText>
	    return modal;
	}
	renderSmokeColor(value){
		let background1 = "";
		let color1 = "";
		let hr_background1 = "";
			if(value){
				value = "Yes";
				background1 = 'red';
	           	color1 = 'black';
	           	hr_background1 = 'black';
			}
			else if(value == "0"){
				value = "No";
	           	background1 = 'green';
	           	color1 = 'white';
	           	hr_background1 = 'white';
			}
			else{
				value = "Not Reported"
	            background1 = 'white';
	            color1 = '#5e5e5e';
	            hr_background1 = '#E5E5E5';
			}
		let modal = <CardText className = "gd_value_style" style = {{background:background1, color:color1}}>
					          		
	          			<span>Smoking: </span><span className = "gd_value_style">{value}</span>
					          		
	          		</CardText>
	    return modal;
	}
	renderPanalitiesColor(sleep,controlled,smoke){
		let background = "";
		let color = "";
		let hr_background = "";
			if(sleep){
				sleep = "Yes";
				background = 'red';
	           	color = 'black';
	           	hr_background = 'black';
			}
			else if(sleep == "0"){
				sleep = "No";
	           	background = 'green';
	           	color = 'white';
	           	hr_background = 'white';
			}
			else{
				sleep = "Not Reported"
	            background = 'white';
	            color = '#5e5e5e';
	            hr_background = '#E5E5E5';
			}
		var model = <Card className = "card_style" 
							id = "my-card-mcs"
							 >
				        	<CardBody>
				          		<CardTitle className = "gd_header_style">Penalties</CardTitle>
				          		<hr className = "hr_style" 
				          			id = "hr-style-mcs"
				          			style = {{background:hr_background}}/>
				          		<CardText className = "gd_value_style" style = {{background:background, color:color}}>
					          			<span>Sleep Aids: </span><span className = "gd_value_style">{sleep}</span>
					          		</CardText>
					          		<hr className = "hr_style"/>
					          		{this.renderControlledColor(controlled)}
					          		<hr className = "hr_style"/>
					          		{this.renderSmokeColor(smoke)}
				        	</CardBody>
			      		</Card>
		return model;
	}
	componentDidMount(){
		 fetchLastSync(this.successLastSync,this.errorquick);
		 fetchGradesData(this.successGradesData,this.errorGradesData,this.state.selectedDate);
		 getUserProfile(this.successProfile);
	}
	render(){
		return(
			<div className = "container-fluid">
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
				<div className = "row gd_padding">
					<div className = "col-md-4 gd_table_margin ">
						{this.renderOverallHealthColors(this.state.overall_health_gpa)}
				    </div>
					<div className = "col-md-4 gd_table_margin ">
			      		{this.renderHourNonExerciseStepsColor(this.state.non_exercise_steps)}
			      	</div>
			      	<div className = "col-md-4 gd_table_margin ">
			      		{this.renderMcsColors(this.state.mcs_score)}
			      	</div>
				</div>
				<div className = "row gd_padding">
					<div className = "col-md-4 gd_table_margin ">
						{this.getStylesForUserinputSleep(this.state.sleep_per_night)}
				    </div>
				    <div className = "col-md-4 gd_table_margin ">
						{this.renderWorkoutCard(this.state.did_you_workout)}
				    </div>
					<div className = "col-md-4 gd_table_margin ">
						{this.renderEcsColors(this.state.exercise_consistency_score)}
				    </div>
				    
				</div>
				<div className = "row gd_padding">
					<div className = "col-md-4 gd_table_margin ">
						{this.getStylesPrcntUnprocessedFood(this.state.unprocessed_food_grade)}
				    </div>
				    <div className = "col-md-4 gd_table_margin ">
						{this.renderAlocoholYesterdayCard(this.state.alcohol_drinks_yesterday)}
				    </div>
					<div className = "col-md-4 gd_table_margin ">
						{this.getStylesAlcohol(this.state.alcoholic_drinks_per_week_grade)}
				    </div>   
				</div>
				<div className = "row gd_padding">
					<div className = "col-md-4 gd_table_margin ">
						{this.getStylesUserinput(this.state.report_inputs_today)}
				    </div>
				    <div className = "col-md-4 gd_table_margin ">
						{this.renderPanalitiesColor(this.state.sleep_aids_penalty,this.state.controlled_subtances_penalty,this.state.smoking_penalty)}    		
				    </div>
				</div>
				<div className = "row justify-content-center" style = {{marginTop:"25px",marginBottom:"25px"}}>
					<div className="gd_mch_color_legend color_legend_A">A</div>	            
		            <div className="gd_mch_color_legend color_legend_B">B</div>	             
		            <div className="gd_mch_color_legend color_legend_C">C</div>	            
		            <div className="gd_mch_color_legend color_legend_D">D</div>	       
		            <div className="gd_mch_color_legend color_legend_F">F</div>
	            </div>	      
			</div>
		);
	}
}
export default Grades_Dashboard;