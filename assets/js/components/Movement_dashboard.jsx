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

class Movement_Dashboard extends Component{
	constructor(props) {
		super(props);
		this.state = {
			steps_this_hour:1000,
			today_mc_score:"10.1",
			today_nonexercise_steps:9000,
			todays_exercise_steps:12000,
			today_total_steps:37000
		}
		this.renderHourStepsColor = this.renderHourStepsColor.bind(this);
		this.renderHourNonExerciseStepsColor = this.renderHourNonExerciseStepsColor.bind(this);
		this.renderMcsColors = this.renderMcsColors.bind(this);
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
	render(){
		return(
			<div>
				<NavbarMenu title={"Movement Dashboard"} />
				<div className = "row">
					<div className = "col-md-4 col-md-offset-1 table_margin ">
						<Card className = "card_style" id = "my-card">
					        <CardBody>
					          	<CardTitle className = "header_style">Steps This Hour</CardTitle>
					          	<hr className = "hr_style" id = "hr-style"/>
					          	<CardText className = "value_style">{this.renderHourStepsColor(this.state.steps_this_hour)}</CardText>
					        </CardBody>
					    </Card>
				    </div>
					<div className = "col-md-4 col-md-offset-2 table_margin ">
			      		<Card className = "card_style" id = "my-card-nonexercise">
				        	<CardBody>
					          	<CardTitle className = "header_style">Today's Non Exercise Steps</CardTitle>
					          	<hr className = "hr_style" id = "hr-style-nonexercise"/>
					          	<CardText className = "value_style">{this.renderHourNonExerciseStepsColor(this.state.today_nonexercise_steps)}</CardText>
				        	</CardBody>
				      	</Card>
			      	</div>
				</div>
				<div className = "row">
					<div className = "col-md-4 col-md-offset-1 table_margin ">
						<Card className = "card_style" id = "my-card-mcs">
				        	<CardBody>
				          		<CardTitle className = "header_style">Today’s Movement Consistency Score (MCS)</CardTitle>
				          		<hr className = "hr_style" id = "hr-style-mcs"/>
				          		<CardText className = "value_style">{this.renderMcsColors(this.state.today_mc_score)}</CardText>
				        	</CardBody>
			      		</Card>
				    </div>
					<div className = "col-md-4 col-md-offset-2 table_margin ">
						<Card className = "card_style">
					        <CardBody>
					          	<CardTitle className = "header_style">Today's Exercise/Activity Steps (MCS)</CardTitle>
					          	<hr className = "hr_style"/>
					          	<CardText className = "value_style">{this.renderCommaInSteps(this.state.todays_exercise_steps)}</CardText>
					        </CardBody>
					    </Card>
				    </div>
				</div>
				<div className = "row">
					<div className = "col-md-4 col-md-offset-4 table_margin ">
						<Card className = "card_style">
				        	<CardBody>
				          		<CardTitle className = "header_style">Total Steps Today</CardTitle>
				          		<hr className = "hr_style"/>
				          		<CardText className = "value_style">{this.renderCommaInSteps(this.state.today_total_steps)}</CardText>
				        	</CardBody>
				      	</Card>
				    </div>
				</div>
			</div>
		);
	}
}
export default Movement_Dashboard;