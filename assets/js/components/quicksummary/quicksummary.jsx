import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Table,Button,Form, FormGroup, Label, Input, FormText,Popover,PopoverBody,Nav, 
	     NavItem, NavLink, Collapse, Navbar, NavbarToggler,   
         NavbarBrand,Container,Dropdown, DropdownToggle, DropdownMenu, DropdownItem  } from "reactstrap";
import axios from 'axios';
import FontAwesome from "react-fontawesome";
import CalendarWidget from 'react-calendar-widget';
import axiosRetry from 'axios-retry';
import moment from 'moment';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getGarminToken,logoutUser} from '../../network/auth';

import {getInitialState} from './initialState';
import {getInitialStateUserInput} from './initialStateUser';
import {renderQlFetchOverlay,renderQlCreateOverlay} from './helpers';
import {quicksummaryDate,userInputDate,createQuicklook}  from '../../network/quick';


import NavbarMenu from '../navbar';
import { Alert } from 'reactstrap';
import Grades from './quicksummary_grades';  
import Swim from './quicksummary_swim';
import Bike from './quicksummary_bike';
import Steps from './quicksummary_steps';
import Sleep from './quicksummary_sleep';
import Food from './quicksummary_food';
import Alcohol from './quicksummary_alocohol';
import Exercise from './quicksummary_exercise';
import User from './user_inputs';
import AllStats1 from './quicksummary_allstats1';
import Movementquick from './movement-consistency';
import MovementHistorical from './movement_consistency_historical_data';



axiosRetry(axios, { retries: 3});


var ReactDOM = require('react-dom'); 


let hashComponentMapping = {
	"movementconsistency":"movement",
	"allstats":"allstats1",
	"grades":"grade",
	"swimstats":"swim",
	"bikestats":"bike",
	"steps":"steps",
	"sleep":"sleep",
	"food":"food",
	"alcohol":"alcohol",
	"exercisereporting":"exercise",
	"userinputs":"user",
	"mchistorical":""


} 

class Quicklook extends Component{

	constructor(props){
		super(props);

		this.successquick = this.successquick.bind(this);
		this.errorquick = this.errorquick.bind(this);
		this.userInputFetchSuccess = this.userInputFetchSuccess.bind(this);
		this.userInputFetchFailure = this.userInputFetchFailure.bind(this);
		this.processDate = this.processDate.bind(this);
		this.onDismiss = this.onDismiss.bind(this);
		this.updateDateState=this.updateDateState.bind(this);
		this.onSubmitDate=this.onSubmitDate.bind(this);
		this.handleChange=this.handleChange.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.toggleCalendar=this.toggleCalendar.bind(this);
		this.toggle = this.toggle.bind(this);
		this.handleCreateQuicklook = this.handleCreateQuicklook.bind(this);
		this.onQuicklookSuccess = this.onQuicklookSuccess.bind(this);
		this.onQuicklookFailure = this.onQuicklookFailure.bind(this);
		this.renderQlFetchOverlay = renderQlFetchOverlay.bind(this);
		this.renderQlCreateOverlay = renderQlCreateOverlay.bind(this);


		this.toggleDate=this.toggleDate.bind(this);
	    this.toggleNav = this.toggleNav.bind(this);
	    this.toggleDropdown = this.toggleDropdown.bind(this);
	    this.handleLogout = this.handleLogout.bind(this);
	    this.onLogoutSuccess = this.onLogoutSuccess.bind(this);

		let initial_state = getInitialState(moment().subtract(7,'days'),
											moment());
		this.state = {
			today_date:moment(),
			start_date:moment().subtract(7,'days').toDate(),
			end_date:moment().toDate(),
			selected_date:new Date(),
			visible: true,
			error:false,
			calendarOpen:false,
			scrollingLock: false,
			isOpen: false,
			isOpen1:false,
			activeTab : 'grade',
			fetching_ql:false,
			creating_ql:false,
			dateRange:false,
			dropdownOpen: false,
			userInputData:{},
			data:initial_state
		};
	}

	updateDateState(data,user_input_data){
			let grade_point = {"A":4,"B":3,"C":2,"D":1,"F":0,"":0}
			let overall_health_gpa_before_panalty = (
				data.grades_ql.movement_non_exercise_steps_gpa + 
				grade_point[data.grades_ql.movement_consistency_grade] +
				data.grades_ql.avg_sleep_per_night_gpa + Math.abs(data.grades_ql.sleep_aid_penalty) +
				grade_point[data.grades_ql.exercise_consistency_grade]+
				data.grades_ql.prcnt_unprocessed_food_consumed_gpa+
				data.grades_ql.alcoholic_drink_per_week_gpa)/6

			let movement_consistency_points = (
				grade_point[data.grades_ql.movement_consistency_grade]);

			let avg_sleep_per_night = data.sleep_ql.sleep_per_wearable;
			let avg_sleep_per_night_gpa = data.grades_ql.avg_sleep_per_night_gpa;
			let total_penalty = data.grades_ql.ctrl_subs_penalty + data.grades_ql.smoke_penalty;
			if (avg_sleep_per_night_gpa){
				avg_sleep_per_night_gpa = avg_sleep_per_night_gpa + Math.abs(data.grades_ql.sleep_aid_penalty);
			}else{
				total_penalty +=data.grades_ql.sleep_aid_penalty
			}

			let exercise_consistency_points = (
				grade_point[data.grades_ql.exercise_consistency_grade]);
			let total_points = (
					data.grades_ql.movement_non_exercise_steps_gpa + movement_consistency_points + 
					data.grades_ql.avg_sleep_per_night_gpa + exercise_consistency_points +
					 data.grades_ql.prcnt_unprocessed_food_consumed_gpa + data.grades_ql.alcoholic_drink_per_week_gpa +
					 total_penalty
				)
			if(user_input_data){
				let ui_sleep_duration = user_input_data.strong_input.sleep_time_excluding_awake_time;
				avg_sleep_per_night = (ui_sleep_duration && ui_sleep_duration != ":"
					&& ui_sleep_duration != "-") ? ui_sleep_duration : data.sleep_ql.sleep_per_wearable;
			}

   			var properties={
   			created_at:data.created_at, 
			grades_ql: {
		        overall_health_grade: data.grades_ql.overall_health_grade,
		        overall_health_gpa: data.grades_ql.overall_health_gpa,
		        movement_non_exercise_steps_grade: data.grades_ql.movement_non_exercise_steps_grade,
		        movement_non_exercise_steps:data.steps_ql.non_exercise_steps,
		        movement_consistency_grade: data.grades_ql.movement_consistency_grade,
		        movement_consistency_score:data.steps_ql.movement_consistency,
		        avg_sleep_per_night_grade: data.grades_ql.avg_sleep_per_night_grade,
		        avg_sleep_per_night:avg_sleep_per_night,
		        exercise_consistency_grade: data.grades_ql.exercise_consistency_grade,
		        workout_today: data.exercise_reporting_ql.did_workout,
		        exercise_consistency_score:data.grades_ql.exercise_consistency_score,
		        prcnt_unprocessed_food_consumed_grade: data.grades_ql.prcnt_unprocessed_food_consumed_grade,
		        prcnt_unprocessed_food_consumed:data.food_ql.prcnt_non_processed_food,
		        alcoholic_drink_per_week_grade: data.grades_ql.alcoholic_drink_per_week_grade,
		        alcoholic_drink_per_week:data.alcohol_ql.alcohol_week,
		        sleep_aid_penalty:data.grades_ql.sleep_aid_penalty,
		        ctrl_subs_penalty:data.grades_ql.ctrl_subs_penalty,
		        smoke_penalty:data.grades_ql.smoke_penalty,
		        overall_health_gpa_before_panalty:overall_health_gpa_before_panalty,
		        submitted_user_input:user_input_data.have_data?"Yes":"No",		      
		        movement_non_exercise_steps_gpa:parseFloat(data.grades_ql.movement_non_exercise_steps_gpa).toFixed(2),
		        movement_consistency_points:parseFloat(movement_consistency_points).toFixed(2),		       
		        avg_sleep_per_night_gpa:parseFloat(avg_sleep_per_night_gpa).toFixed(2),
		        exercise_consistency_points:parseFloat(exercise_consistency_points).toFixed(2),
		        prcnt_unprocessed_food_consumed_gpa:parseFloat(data.grades_ql.prcnt_unprocessed_food_consumed_gpa).toFixed(2),
		        alcoholic_drink_per_week_gpa:parseFloat(data.grades_ql.alcoholic_drink_per_week_gpa).toFixed(2),
		        sleep_aid_penalty_points:parseFloat(data.grades_ql.sleep_aid_penalty).toFixed(2),
		        ctrl_subs_penalty_points:parseFloat(data.grades_ql.ctrl_subs_penalty).toFixed(2),
		        smoke_penalty_points:parseFloat(data.grades_ql.smoke_penalty).toFixed(2),
		        total_points:parseFloat(total_points).toFixed(2), 

        
		     //    resting_hr:data.exercise_reporting_ql.sleep_resting_hr_last_night,
		     //    stress_level:data.exercise_reporting_ql.stress_level,
		     //    stand_three_hours:user_input_data.optional_input.stand_for_three_hours, 

		     //    overall_workout_grade:data.grades_ql.overall_workout_grade,
		     //    overall_workout_score:data.grades_ql.overall_workout_gpa,
			    // workout_duration_grade:data.grades_ql.workout_duration_grade,
			    // workout_duration:data.exercise_reporting_ql.workout_duration,
			    // workout_effortlvl_grade:data.grades_ql.workout_effortlvl_grade,
			    // workout_effortlvl:user_input_data.strong_input.workout_effort_level,
			    // avg_exercise_hr_grade:data.grades_ql.avg_exercise_hr_grade,
			    // avg_exercise_hr:data.exercise_reporting_ql.avg_exercise_heartrate,
			    // time_to_99:user_input_data.encouraged_input.time_to_99,
			    // lowest_hr_first_minute:user_input_data.encouraged_input.lowest_hr_first_minute,
			    // vo2_max:data.exercise_reporting_ql.vo2_max,
			    // floor_climed:data.steps_ql.floor_climed,
    		},

		    exercise_reporting_ql: {
		        workout_easy_hard: data.exercise_reporting_ql.workout_easy_hard,
		        workout_type:data.exercise_reporting_ql.workout_type,
		        workout_time: data.exercise_reporting_ql.workout_time,
		        workout_location:data.exercise_reporting_ql.workout_location,
		        workout_duration: data.exercise_reporting_ql.workout_duration,
		        maximum_elevation_workout:data.exercise_reporting_ql.maximum_elevation_workout,
		        minutes_walked_before_workout:data.exercise_reporting_ql.minutes_walked_before_workout,
		        distance_run:data.exercise_reporting_ql.distance_run,
		        distance_bike:data.exercise_reporting_ql.distance_bike,
		        distance_swim:data.exercise_reporting_ql.distance_swim,
		        distance_other:data.exercise_reporting_ql.distance_other,
		        pace: data.exercise_reporting_ql.pace,
		        avg_heartrate: data.exercise_reporting_ql.avg_heartrate,
		        avg_exercise_heartrate:data.exercise_reporting_ql.avg_exercise_heartrate,
		        elevation_gain: data.exercise_reporting_ql.elevation_gain,
		        elevation_loss: data.exercise_reporting_ql.elevation_loss,
		        effort_level: data.exercise_reporting_ql.effort_level,
		        dew_point: data.exercise_reporting_ql.dew_point,
		        temperature: data.exercise_reporting_ql.temperature,
		        humidity: data.exercise_reporting_ql.humidity,
		        temperature_feels_like: data.exercise_reporting_ql.temperature_feels_like,
		        wind:data.exercise_reporting_ql.wind,
		        hrr_time_to_99: data.exercise_reporting_ql.hrr_time_to_99,
		        hrr_starting_point: data.exercise_reporting_ql.hrr_starting_point,
		        hrr_beats_lowered_first_minute:data.exercise_reporting_ql.hrr_beats_lowered_first_minute,
		        resting_hr_last_night:data.exercise_reporting_ql.resting_hr_last_night,
		        vo2_max:data.exercise_reporting_ql.vo2_max,
		        running_cadence: data.exercise_reporting_ql.running_cadence,
		        nose_breath_prcnt_workout: data.exercise_reporting_ql.nose_breath_prcnt_workout,
		        water_consumed_workout: data.exercise_reporting_ql.water_consumed_workout,
		        chia_seeds_consumed_workout: data.exercise_reporting_ql. chia_seeds_consumed_workout,
		        fast_before_workout: data.exercise_reporting_ql.fast_before_workout,
		        pain: data.exercise_reporting_ql.pain,
		        pain_area: data.exercise_reporting_ql.pain_area,
		        stress_level: data.exercise_reporting_ql.stress_level,
		        sick: data.exercise_reporting_ql.sick,
		        drug_consumed: data.exercise_reporting_ql.drug_consumed,
		        drug: data.exercise_reporting_ql.drug,
		        medication: data.exercise_reporting_ql.medication,
		        smoke_substance: data.exercise_reporting_ql.smoke_substance,
		        exercise_fifteen_more: data.exercise_reporting_ql.exercise_fifteen_more,
		        workout_elapsed_time: data.exercise_reporting_ql.workout_elapsed_time,
		        timewatch_paused_workout: data.exercise_reporting_ql.timewatch_paused_workout,
		        exercise_consistency:data.exercise_reporting_ql.exercise_consistency,
		        heartrate_variability_stress: data.exercise_reporting_ql.heartrate_variability_stress,
		        fitness_age:data.exercise_reporting_ql.fitness_age,
		        workout_comment:data.exercise_reporting_ql.workout_comment 
		    },
		    swim_stats_ql: {
		        pace_per_100_yard: data.swim_stats_ql.pace_per_100_yard,
		        total_strokes: data.swim_stats_ql.total_strokes
		    },
		     "bike_stats_ql": {
		        avg_speed: data.bike_stats_ql.avg_speed,
		        avg_power: data.bike_stats_ql.avg_power,
		        avg_speed_per_mile: data.bike_stats_ql.avg_speed_per_mile,
		        avg_cadence: data.bike_stats_ql.avg_cadence
		    },
		    "steps_ql": {
		    	"movement_consistency": data.steps_ql.movement_consistency,
		        "non_exercise_steps": data.steps_ql.non_exercise_steps,
		        "exercise_steps": data.steps_ql.exercise_steps,
		        "total_steps": data.steps_ql.total_steps,
		        "floor_climed": data.steps_ql.floor_climed,
		        "weight":user_input_data.optional_input.weight,
		    },
		    sleep_ql: {

		    	sleep_per_user_input: data.sleep_ql.sleep_per_user_input, 
		    	sleep_comments: data.sleep_ql.sleep_comments,
		    	sleep_aid: data.sleep_ql.sleep_aid,
		        resting_heart_rate: data.exercise_reporting_ql.resting_hr_last_night,
                sleep_per_wearable: data.sleep_ql.sleep_per_wearable, 		       
		        sleep_bed_time: data.sleep_ql.sleep_bed_time,
		        sleep_awake_time: data.sleep_ql.sleep_awake_time,
		        deep_sleep: data.sleep_ql.deep_sleep,
		        light_sleep: data.sleep_ql.light_sleep,
		        awake_time: data.sleep_ql.awake_time
		       
		    },
		    food_ql: {
		        prcnt_non_processed_food: data.food_ql.prcnt_non_processed_food,
		        processed_food_consumed: data.food_ql.processed_food ,
		        non_processed_food: data.food_ql.non_processed_food,
		        diet_type: data.food_ql.diet_type
		    },
		    alcohol_ql: {
		        alcohol_day: data.alcohol_ql.alcohol_day,
		        alcohol_week: data.alcohol_ql.alcohol_week
		    }
         };
         return properties;
    }

    updateUserInputDateState(data){
       			var properties={
       				have_data:true,
					strong_input:{
	                    workout:data.strong_input.workout,
	                    workout_type:data.strong_input.workout_type,
	                    work_out_easy_or_hard:data.strong_input.work_out_easy_or_hard,
	                    workout_effort_level:data.strong_input.workout_effort_level,
	                    hard_portion_workout_effort_level:data.strong_input.hard_portion_workout_effort_level,
	                    prcnt_unprocessed_food_consumed_yesterday:data.strong_input.prcnt_unprocessed_food_consumed_yesterday,
	                    list_of_unprocessed_food_consumed_yesterday:data.strong_input.list_of_unprocessed_food_consumed_yesterday,
	                    list_of_processed_food_consumed_yesterday:data.strong_input.list_of_processed_food_consumed_yesterday,
	                    number_of_alcohol_consumed_yesterday:data.strong_input.number_of_alcohol_consumed_yesterday,
	                    alcohol_drink_consumed_list:data.strong_input.alcohol_drink_consumed_list,
	                    sleep_time_excluding_awake_time:data.strong_input.sleep_time_excluding_awake_time,
	                    sleep_comment:data.strong_input.sleep_comment,
	                    prescription_or_non_prescription_sleep_aids_last_night:data.strong_input.prescription_or_non_prescription_sleep_aids_last_night,
	                    sleep_aid_taken:data.strong_input.sleep_aid_taken,
	                    smoke_any_substances_whatsoever:data.strong_input.smoke_any_substances_whatsoever,
	                    smoked_substance:data.strong_input.smoked_substance,
	                    prescription_or_non_prescription_medication_yesterday:data.strong_input.prescription_or_non_prescription_medication_yesterday,
	                    prescription_or_non_prescription_medication_taken:data.strong_input.prescription_or_non_prescription_medication_taken,
	                    controlled_uncontrolled_substance:data.strong_input.controlled_uncontrolled_substance,
	                	indoor_temperature:data.strong_input.indoor_temperature,
				        outdoor_temperature:data.strong_input.outdoor_temperature,
				        temperature_feels_like:data.strong_input.temperature_feels_like,
				        wind:data.strong_input.wind,
				        dewpoint:data.strong_input.dewpoint,
				        humidity:data.strong_input.humidity,
				        weather_comment:data.strong_input.weather_comment
	                },
	                encouraged_input:{
	                      "stress_level_yesterday":data.encouraged_input.stress_level_yesterday,
				    	  "pains_twings_during_or_after_your_workout":data.encouraged_input.pains_twings_during_or_after_your_workout,
			        	  "pain_area":data.encouraged_input.pain_area,
			        	  "water_consumed_during_workout":data.encouraged_input.water_consumed_during_workout,
			        	  "workout_that_user_breathed_through_nose":data.encouraged_input.workout_that_user_breathed_through_nose,
	                	  "measured_hr":data.encouraged_input.measured_hr,
			        	  "hr_down_99":data.encouraged_input.hr_down_99,
			        	  "time_to_99":data.encouraged_input.time_to_99,
			       		  "hr_level":data.encouraged_input.hr_level,
			       		  "lowest_hr_first_minute":data.encouraged_input.lowest_hr_first_minute,
			       		  "lowest_hr_during_hrr":data.encouraged_input.lowest_hr_during_hrr,
			       		  "time_to_lowest_point":data.encouraged_input.time_to_lowest_point
	                },
	                optional_input:{
				          "chia_seeds_consumed_during_workout":data.optional_input.chia_seeds_consumed_during_workout,
				    	  "fasted_during_workout":data.optional_input.fasted_during_workout,
			              "food_ate_before_workout":data.optional_input.food_ate_before_workout,
			              "calories_consumed_during_workout":data.optional_input.calories_consumed_during_workout,
			              "food_ate_during_workout":data.optional_input.food_ate_during_workout,
			              "workout_enjoyable":data.optional_input.workout_enjoyable,
			              "general_Workout_Comments":data.optional_input.general_Workout_Comments,
			              "weight":data.optional_input.weight,
			       		  "waist_size":data.optional_input.waist_size,
			       		  "clothes_size":data.optional_input.clothes_size,
			       		  "sick":data.optional_input.sick,
			              "sickness":data.optional_input.sickness,
			              "stand_for_three_hours":data.optional_input.stand_for_three_hours,
			              "type_of_diet_eaten":data.optional_input.type_of_diet_eaten,
			       		  "general_comment":data.optional_input.general_comment
	                }
             };
             return properties;
       		}

	successquick(data,start_dt,end_dt){
		let targetTab = 'grade'
		if (location.hash)
			targetTab = hashComponentMapping[location.hash.split('#')[1]];
		
		if (!targetTab)
			targetTab = 'grade';

		const dates = [];
		let initial_state = getInitialState(start_dt,end_dt);
		for(let date of Object.keys(initial_state)){
			dates.push(date);
		}
         if (data.data.length > 0){
		 	 for(var dataitem of data.data){
		      	const date = moment(dataitem.created_at).format('M-D-YY');
		      	let obj = this.updateDateState(dataitem,this.state.userInputData[date]);
		      	initial_state[date] = obj;
		      }
		      this.setState({
		      	selected_date:this.state.selected_date,
				data:initial_state,
				visible:false,
				fetching_ql:false,
				error:true,
				activeTab:targetTab
			});
	     }
	     else{
	     		this.setState({
	     		selected_date:this.state.selected_date,
				data:initial_state,
				visible:true,
				fetching_ql:false,
				error:false,
				activeTab:targetTab
			});
	     }
	}

	errorquick(error){
		console.log(error.message);
		this.setState({
			error:true,
			fetching_ql:false
		});
	}

	userInputFetchSuccess(data){
		let initial_state = getInitialStateUserInput(this.state.start_date,
													 this.state.end_date);
		if(data.data.length){
			const dates = [];
			for(let date of Object.keys(initial_state)){
				dates.push(date);
			}
		    if (data.data.length > 0){
			 	 for(var dataitem of data.data){
			      	const date = moment(dataitem.created_at).format('M-D-YY');
			      	let obj = this.updateUserInputDateState(dataitem);
			      	initial_state[date] = obj;
			      }
		     }
		}
		this.setState({
			userInputData:initial_state,
			selected_date:this.state.selected_date,
		},()=>{
			quicksummaryDate(this.state.start_date, this.state.end_date, this.successquick,this.errorquick);
		});
	}

	userInputFetchFailure(error){
		let initial_state = getInitialStateUserInput(this.state.start_date,
													 this.state.end_date);

		this.setState({
			userInputData:initial_state,
			selected_date:this.state.selected_date, 
		},()=>{
			quicksummaryDate(this.state.start_date, this.state.end_date, this.successquick,this.errorquick);
		});
	}



	processDate(date){
		let end_dt = moment(date);
		let start_dt = moment(date).subtract(7,'days');
		this.setState({
			selected_date:date,
			start_date : start_dt.toDate(),
			end_date : end_dt.toDate(),
			fetching_ql:true
		},()=>{
			userInputDate(this.state.start_date, this.state.end_date, this.userInputFetchSuccess,
						  this.userInputFetchFailure);
		});
	}

	 handleChange(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;
      this.setState({
        [name]: value
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
			userInputDate(this.state.start_date, this.state.end_date, this.userInputFetchSuccess,
						  this.userInputFetchFailure);
		});
  }

	componentDidMount(){
		userInputDate(this.state.start_date, this.state.end_date, this.userInputFetchSuccess,
					  this.userInputFetchFailure);
		 window.addEventListener('scroll', this.handleScroll);
	}
	onDismiss(){
		this.setState(
			{
				visible:false,
				error:false
		});
	}

	activateTab(tab,event){
		this.setState({
           activeTab:tab,
       });
	}

	componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
}
handleScroll() {

  if (window.scrollY >= 72 && !this.state.scrollingLock) {
    this.setState({
      scrollingLock: true
    });
  } else if(window.scrollY < 72 && this.state.scrollingLock) {
    this.setState({
      scrollingLock: false
    });
  }
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
  toggleNav() {
    this.setState({
      isOpen1: !this.state.isOpen1,

    });
  }
 toggleDate(){
    this.setState({
      dateRange:!this.state.dateRange
    });
   }
 toggleDropdown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }
  onQuicklookSuccess(data,start_date,end_date){
  	this.successquick(data,start_date,end_date);
  	this.setState({
  		creating_ql:false
  	});
  }

  onQuicklookFailure(error){
  	console.log(error.message);
  	this.setState({
  		creating_ql:false
  	});
  }

  handleCreateQuicklook(){
  	this.setState({
  		creating_ql:true
  	},function(){
  		createQuicklook(this.state.start_date, this.state.end_date,
  					this.onQuicklookSuccess, this.onQuicklookFailure);
  	}.bind(this));
  }
onLogoutSuccess(response){
    this.props.history.push("/#logout");
  }

  handleLogout(){
    this.props.logoutUser(this.onLogoutSuccess);
  }


	render(){
		const {fix} = this.props;
		const {activeTab}=this.state;
		const class_allstats1=`nav-link ${activeTab === "allstats1" ? 'active':''}`;
		const class_grade=`nav-link ${activeTab === "grade" ? 'active':''}`;
		const class_swim=`nav-link ${activeTab === "swim" ? 'active':''}`;
		const class_bike=`nav-link ${activeTab === "bike" ? 'active':''}`;
		const class_steps=`nav-link ${activeTab === "steps" ? 'active':''}`;
		const class_sleep=`nav-link ${activeTab === "sleep" ? 'active':''}`;
		const class_food=`nav-link ${activeTab === "food" ? 'active':''}`;
        const class_alcohol=`nav-link ${activeTab === "alcohol" ? 'active':''}`;
        const class_exercise=`nav-link ${activeTab === "exercise" ? 'active':''}`;
        const class_user=`nav-link ${activeTab === "user" ? 'active':''}`;
        const class_movement=`nav-link ${activeTab === "movement" ? 'active':''}`;
        const class_movementHistorical=`nav-link ${activeTab === "movementhistorical" ? 'active':''}`;
	return(
		<div className="hori">
		<div className="container-fluid">



		 <Navbar toggleable
         fixed={fix ? 'top' : ''}
          className="navbar navbar-expand-sm navbar-inverse ">
         
          <Link to='/'  className="position_abs">
            <NavbarBrand
              className="navbar-brand float-sm-left"
              id="navbarTogglerDemo" style={{fontSize:"16px"}}>
              <img className="img-fluid img_width"
               style={{maxWidth:"200px"}}
               src="//static1.squarespace.com/static/535dc0f7e4b0ab57db48c65c/t/5942be8b893fc0b88882a5fb/1504135828049/?format=1500w"/>
            </NavbarBrand>
          </Link>



            <span id="header">
            <h2 className="head" id="head">Raw Data
            
            </h2>
            </span>
             



          <NavbarToggler className="navbar-toggler hidden-sm-up" onClick={this.toggleNav} >
           <FontAwesome
                 name = "bars"
                 size = "1x"

             />

          </NavbarToggler>


          <Collapse className="navbar-toggleable-xs" isOpen={this.state.isOpen1} navbar>
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






			             <div id="nav3">
			            <div className="nav2" style={{position: this.state.scrollingLock ? "fixed" : "relative"}}>
						  <Navbar light toggleable className="navbar nav2 nav5 pad0">
                                <NavbarToggler className="navbar-toggler hidden-sm-up btn_tglr" onClick={this.toggle}>
                                    <div className="toggler">
                                    <FontAwesome
                                          name = "bars"
                                          size = "1x"

                                        />
                                    </div>
                               </NavbarToggler>
<div>
                                  <span id="calendar1"
                                  onClick={this.toggleCalendar}>
                                  <span id="spa" >
                                     <span id="navlink">
                                        <FontAwesome
                                          name = "calendar"
                                          size = "1x"

                                        />
                                        </span>
                                        {/*
                                       <span id="navlink">
                                      {moment(this.state.selected_date).format('MMMM D, YYYY')}
                                      </span> */}
                                  </span>

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
                                 		 <span id="spa">
                                          <abbr  id="abbri">
                                           <a href={`/quicklook/print/excel?from_date=${moment(this.state.start_date).format('MM-DD-YYYY')}&to_date=${moment(this.state.end_date).format('MM-DD-YYYY')}`}>
                                            <div className="btn3">
                                            <Button id="nav-btn" className="btn">Print</Button>
                                            </div>
                                           </a>
                                          </abbr>
                                          </span> 
</div>

                               <Collapse className="navbar-toggleable-xs"  isOpen={this.state.isOpen} navbar>


                                  <Nav className="nav navbar-nav" navbar className="fonts">                          
                                  			 <NavItem onClick={this.toggle}>
                                        <span id="spa">
                                          <abbr  id="abbri"  title="Grades">
                                            <NavLink id="headernames" href="#" className={class_grade} value="grade"
						    						 onClick={this.activateTab.bind(this,"grade")}>
                                             Grades
                                            </NavLink>
                                          </abbr>
                                          </span>
                                        </NavItem>

                                         <NavItem onClick={this.toggle} className="steps">
                                        <span id="spa">
                                          <abbr  id="abbri"  title="Steps">
                                            <NavLink id="headernames" href="#" className={class_steps}  value="steps"
						    		 				  onClick={this.activateTab.bind(this,"steps")}>
						    		 		Steps
                                            </NavLink>
                                          </abbr>
                                          </span>
                                       </NavItem>

                                       	

                                        <NavItem onClick={this.toggle} className="sleep">
                                        <span id="spa">
                                          <abbr  id="abbri"  title="Sleep">
                                            <NavLink id="headernames" href="#" className={class_sleep}  value="sleep"
						    		 				 onClick={this.activateTab.bind(this,"sleep")}>
						    				 Sleep
                                            </NavLink>
                                          </abbr>
                                          </span>
                                       </NavItem>

                                        <NavItem onClick={this.toggle} className="food">
                                        <span id="spa">
                                          <abbr  id="abbri"  title="Food">
                                            <NavLink id="headernames" href="#" className={class_food}  value="food"
						    		 				 onClick={this.activateTab.bind(this,"food")}>
						    		 		Food
                                            </NavLink>
                                          </abbr>
                                          </span>
                                       </NavItem>

                                        <NavItem onClick={this.toggle} className="alcohol">
                                        <span id="spa">
                                          <abbr  id="abbri"  title="Alcohol">
                                            <NavLink id="headernames" href="#" className={class_alcohol} value="alcohol"
						    		 				 onClick={this.activateTab.bind(this,"alcohol")}>
						    		 		 Alcohol
                                            </NavLink>
                                          </abbr>
                                          </span>
                                       </NavItem>

                                        <NavItem onClick={this.toggle} className="Movement">
                                        <span id="spa">
                                          <abbr  id="abbri"  title="Movement Consistency">
                                            <NavLink id="headernames" href="#" className={class_movement} value="movement"
						    		 				onClick={this.activateTab.bind(this,"movement")}>
						    		 		 Movement Consistency
                                            </NavLink>
                                          </abbr>
                                          </span>
                                       </NavItem>

                                    
                                     <NavItem onClick={this.toggle} className="mchistorical">
                                        <span id="spa">
                                          <abbr  id="abbri"  title="Movement Consistency Historical Data">
                                            <NavLink id="headernames" href="#" className={class_movementHistorical} value="movementhistorical"
						    		 				onClick={this.activateTab.bind(this,"movementhistorical")}>
						    		 		 Movement Consistency Historical Data
                                            </NavLink>
                                          </abbr>
                                          </span>
                                       </NavItem>

                                        <NavItem onClick={this.toggle} className="bikestats">
                                        <span id="spa">
                                          <abbr  id="abbri"  title="Bike">
                                            <NavLink id="headernames" href="#" className={class_bike} value="bike"
							    		 			onClick={this.activateTab.bind(this,"bike")}>
							    			 Bike Stats
                                            </NavLink>
                                          </abbr>
                                          </span>
                                        </NavItem> 

                                        <NavItem onClick={this.toggle} className="exercise">
                                        <span id="spa">
                                          <abbr  id="abbri"  title="Exercise Reporting">
                                            <NavLink id="headernames" href="#" className={class_exercise} value="exercise"
						    		 				  onClick={this.activateTab.bind(this,"exercise")}>
						    		 		Exercise Reporting
                                            </NavLink>
                                          </abbr>
                                          </span>
                                       </NavItem>

                                       	<NavItem onClick={this.toggle} className="userinputs">
                                        <span id="spa">
                                          <abbr  id="abbri"  title="User Inputs">
                                            <NavLink id="headernames" href="#" className={class_user} value="user"
						    		 				onClick={this.activateTab.bind(this,"user")}>
						    		 		 User Inputs
                                            </NavLink>
                                          </abbr>
                                          </span>
                                       </NavItem>

 										<NavItem onClick={this.toggle} className="swimstats">
                                        <span id="spa">
                                          <abbr  id="abbri"  title="Nutrition and Lifestyle Inputs">
                                            <NavLink id="headernames" href="#" className={class_swim}  value="swim"
						    						 onClick={this.activateTab.bind(this,"swim")}>
						    		 		Swim Stats
                                            </NavLink>
                                          </abbr>
                                          </span>
                                        </NavItem>

                                         <NavItem onClick={this.toggle} className="allstats">
                                          <span id="spa">
                                            <abbr id="abbri"  title="All Stats">
                                              <NavLink id="headernames" href="#" className={class_allstats1} value="allstats1"
						    								 onClick={this.activateTab.bind(this,"allstats1")}>
                                               All Stats
                                              </NavLink>
                                            </abbr>
                                            </span>
                                          </NavItem>
                                       

                                       <span className="dropbutton">
                                         
                                        <span id="spa">
                                        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>

									        <DropdownToggle caret style={{backgroundColor:"#777777",borderColor:"#777777",paddingTop:"10px"}}>
									          More
									        </DropdownToggle>
									        <DropdownMenu>
									        
									        <DropdownItem style={{paddingLeft:"30px"}} id="dropsteps"  className={class_steps}  value="steps"
						    		 				 onClick={this.activateTab.bind(this,"steps")}>Steps</DropdownItem>
						    		 		  <DropdownItem style={{paddingLeft:"30px"}} id="dropsleep"  className={class_sleep} value="sleep"
						    		 				 onClick={this.activateTab.bind(this,"sleep")}>Sleep</DropdownItem>									                                                     						    		 													         									         								         									         
									          <DropdownItem style={{paddingLeft:"30px"}} id="dropfood"  className={class_food}  value="food"
						    		 				 onClick={this.activateTab.bind(this,"food")}>Food</DropdownItem>
						    		 		  <DropdownItem style={{paddingLeft:"30px"}} id="dropalcohol"  className={class_alcohol} value="alcohol"
						    		 				 onClick={this.activateTab.bind(this,"alcohol")}>Alcohol</DropdownItem>
						    		 		  <DropdownItem style={{paddingLeft:"30px"}} id="dropmovement" className={class_movement} value="movement"
						    		 				onClick={this.activateTab.bind(this,"movement")}>Movement Consistency</DropdownItem>
					    		 		      <DropdownItem style={{paddingLeft:"30px"}} id="dropmchistorical"  className={class_movementHistorical} value="movementhistorical"
					    		 				onClick={this.activateTab.bind(this,"movementhistorical")}>Movement Consistency Historical Data</DropdownItem>
				    		 				 <DropdownItem style={{paddingLeft:"30px"}} id="drop_allstats" className={class_allstats1} value="allstats1"
				    								 onClick={this.activateTab.bind(this,"allstats1")}>All Stats</DropdownItem>
						    		 		 <DropdownItem style={{paddingLeft:"30px"}} id="dropexercise" className={class_exercise} value="exercise"
						    		 				  onClick={this.activateTab.bind(this,"exercise")}>Exercise Reporting</DropdownItem>
						    		 		  <DropdownItem style={{paddingLeft:"30px"}} id="dropbike"  className={class_bike} value="bike"
							    		 			onClick={this.activateTab.bind(this,"bike")}>Bike Stats</DropdownItem>
							    		 	  <DropdownItem style={{paddingLeft:"30px"}} id="dropswim" className={class_swim}  value="swim"
						    						 onClick={this.activateTab.bind(this,"swim")}>Swim Stats</DropdownItem>		 		  
						    		 		  <DropdownItem style={{paddingLeft:"30px"}} id="dropuser" className={class_user} value="user"
						    		 				onClick={this.activateTab.bind(this,"user")}>User Inputs</DropdownItem>
									        </DropdownMenu>
									    </Dropdown>
                                        </span>
                                        
                                        </span>
                                       
                                  </Nav>
                                </Collapse>

                                        <span className="btn2 btn4">
	                                  <Button
	                                   id="nav-btn"
	                                  style={{backgroundColor:"#ed9507"}}
						         	   type="submit"
						               className="btn btn-block-lg"
						               onClick = {this.handleCreateQuicklook}>
							               Create Raw Data Report
								      </Button>
                                   </span>
                           </Navbar>

						 </div>
			      		</div>

			      			<Popover
                            placement="bottom"
                            isOpen={this.state.calendarOpen}
                            target="calendar1"
                            toggle={this.toggleCalendar}>
                              <PopoverBody className="calendar2">
                                <CalendarWidget  onDaySelect={this.processDate}/>
                              </PopoverBody>
                           </Popover>

                    	<Container style={{maxWidth:"1600px"}}>
             		   <div className="row justify-content-center">
                    	{this.state.activeTab === "allstats1" && <AllStats1 data={this.state.data}/>}
                    	{this.state.activeTab === "swim" && <Swim data={this.state.data}/>}
                    	{this.state.activeTab === "bike" && <Bike data={this.state.data}/>}
                    	{this.state.activeTab === "alcohol" && <Alcohol data={this.state.data}/>}
                    	{this.state.activeTab === "exercise" && <Exercise data={this.state.data}/>}
                    	{this.state.activeTab === "grade" && <Grades data={this.state.data}/>}
                    	{this.state.activeTab === "steps" && <Steps data={this.state.data}/>}
                    	{this.state.activeTab === "sleep" && <Sleep data={this.state.data}/>}
                    	{this.state.activeTab === "food" && <Food data={this.state.data}/>}
                    	{this.state.activeTab === "user" &&
	                    	 <User  data={this.state.userInputData}/>
                    	}
                    	{this.state.activeTab === "movement" && <Movementquick data={this.state.data}/>}
                    	{this.state.activeTab === "movementhistorical" && <MovementHistorical data={this.state.data} start_date={this.state.start_date} end_date = {this.state.end_date}/>}


			</div>

					</Container>

					</div>
					{this.renderQlFetchOverlay()}
					{this.renderQlCreateOverlay()}
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
export default connect(mapStateToProps,{getGarminToken,logoutUser})(withRouter(Quicklook));
Navbar.propTypes={
    fixed: PropTypes.string,
    color: PropTypes.string,
}