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
import fetchProgress,{fetchUserRank,progressAnalyzerUpdateTime} from '../network/progress';
import AllRank_Data1 from "./leader_all_exp";
import Dimensions from 'react-dimensions';
import { StyleSheet, css } from 'aphrodite';
import html2canvas from 'html2canvas';
import {renderProgressFetchOverlay,renderProgress2FetchOverlay,renderProgress3FetchOverlay,renderProgressSelectedDateFetchOverlay} from './dashboard_healpers';
import { getGarminToken,logoutUser} from '../network/auth';
axiosRetry(axios, { retries: 3});


//const category = ["oh_gpa","alcohol","avg_sleep","prcnt_uf","nes","mc","ec","resting_hr",
//"beat_lowered","pure_beat_lowered","pure_time_99","time_99","active_min_exclude_sleep","active_min_exclude_sleep_exercise","active_min_total",];
const duration = ["week","today","yesterday","year","month","custom_range"];
const category=['oh_gpa','nes','mc','avg_sleep','ec','prcnt_uf',
                                 'alcohol','total_steps','floor_climbed','resting_hr',
                                 'deep_sleep','awake_time','time_99',"pure_time_99",
                                 'beat_lowered','pure_beat_lowered','overall_hrr',
                                 'active_min_total','active_min_exclude_sleep',
                                 'active_min_exclude_sleep_exercise'];


var CalendarWidget = require('react-calendar-widget');
var ReactDOM = require('react-dom');

class Aadashboard extends Component{
	constructor(props) {
		super(props);
		let rankInitialState = {}
    for (let catg of category){
        let catInitialState = {}
        for(let dur of duration){
          let userRank = {
            'user_rank':{
              category:'',
              rank:'Getting Ranks...',
              username:'',
              score:''
            },
            "all_rank":[
              ]
        };
         catInitialState[dur] = userRank;
        }
        rankInitialState[catg] = catInitialState;
       };
		this.state = {
			 selectedDate: new Date(),
			 cr1_start_date:'',
        	 cr1_end_date:'',
        	 cr2_start_date:'',
        	 cr2_end_date:'',
        	 cr3_start_date:'',
        	 cr3_end_date:'',
			 calendarOpen:false,
			 isOpen1:false,
			 dateRange1:false,
			 dateRange2:false,
			 dateRange3:false,
             fetching_ql1:false,
             fetching_ql2:false,
             fetching_ql3:false,
			 fetching_ql4:false,
			 scrollingLock:false,
			 dropdownOpen1:false,
			 active_view:true,
			 btnView:false,
			 rankData:rankInitialState,
			 summary:{
            "overall_health":{
               "overall_health_gpa":this.getInitialDur(),
                 "overall_health_gpa_grade":this.getInitialDur(),
                 "total_gpa_point":this.getInitialDur()
                },

            "ec":{
                 "avg_no_of_days_exercises_per_week":this.getInitialDur(),
                  "exercise_consistency_grade":this.getInitialDur(),
                   "exercise_consistency_gpa":this.getInitialDur()
                 },
                "nutrition":{
                   "prcnt_unprocessed_food_gpa":this.getInitialDur(),
                 "prcnt_unprocessed_food_grade":this.getInitialDur(),
                  "prcnt_unprocessed_volume_of_food":this.getInitialDur()

                  },
            "mc":{
                    "movement_consistency_gpa":this.getInitialDur(),
                    "movement_consistency_grade":this.getInitialDur(),
                    "movement_consistency_score":this.getInitialDur(),
                    "total_active_minutes":this.getInitialDur(),
                    "total_active_minutes_prcnt":this.getInitialDur(),
                    "active_minutes_without_sleep":this.getInitialDur(),
                    "active_minutes_without_sleep_prcnt":this.getInitialDur(),
                    "active_minutes_without_sleep_exercise":this.getInitialDur(),
                    "active_minutes_without_sleep_exercise_prcnt":this.getInitialDur()
                  },
            "non_exercise":{
                 "non_exericse_steps_gpa":this.getInitialDur(),
                 "movement_non_exercise_step_grade":this.getInitialDur(),
                 "non_exercise_steps":this.getInitialDur(),
                 "total_steps":this.getInitialDur(),     
            },
        "exercise":{                
            "workout_duration_hours_min":this.getInitialDur(), 
                "avg_exercise_heart_rate":this.getInitialDur(),
                "avg_non_strength_exercise_heart_rate": this.getInitialDur(),                                      
                "workout_effort_level":this.getInitialDur(),
                "vo2_max":this.getInitialDur()              
                },
         "sleep": {
             "prcnt_days_sleep_aid_taken_in_period": this.getInitialDur(),
            "average_sleep_grade": this.getInitialDur(),
            "total_sleep_in_hours_min": this.getInitialDur(),
            "overall_sleep_gpa": this.getInitialDur(),
             "num_days_sleep_aid_taken_in_period": this.getInitialDur()
        },
         "alcohol": {
            "alcoholic_drinks_per_week_grade": this.getInitialDur(),
            "avg_drink_per_week": this.getInitialDur(),
            "alcoholic_drinks_per_week_gpa": this.getInitialDur(),
            "prcnt_alcohol_consumption_reported":this.getInitialDur()
        },
         "other": {
            "hrr_beats_lowered_in_first_min":this.getInitialDur(),
            "hrr_highest_hr_in_first_min":this.getInitialDur(),
            "hrr_lowest_hr_point": this.getInitialDur(),
            "floors_climbed": this.getInitialDur(),
            "resting_hr": this.getInitialDur(),
            "hrr_time_to_99":this.getInitialDur(),
            "hrr_pure_1_minute_beat_lowered":this.getInitialDur(),
             "hrr_pure_time_to_99": this.getInitialDur()
        },
        "sick":{
          "days_sick_not_sick_reported":this.getInitialDur(),
          "number_of_days_not_sick":this.getInitialDur(),
          "number_of_days_sick":this.getInitialDur(),
          "prcnt_of_days_not_sick":this.getInitialDur(),
          "prcnt_of_days_sick":this.getInitialDur()
      },
        "stress":{
          "days_stress_level_reported":this.getInitialDur(),
          "number_of_days_high_stress_reported":this.getInitialDur(),
          "number_of_days_low_stress_reported":this.getInitialDur(),
          "number_of_days_medium_stress_reported":this.getInitialDur(),
          "prcnt_of_days_high_stress":this.getInitialDur(),
          "prcnt_of_days_low_stress":this.getInitialDur(),
          "prcnt_of_days_medium_stress":this.getInitialDur(),
          "garmin_stress_lvl":this.getInitialDur()
        },
        "standing":{
          "number_days_reported_stood_not_stood_three_hours":this.getInitialDur(),
          "number_days_stood_three_hours":this.getInitialDur(),
          "prcnt_days_stood_three_hours":this.getInitialDur()
        },
        "travel":{
          "number_days_travel_away_from_home":this.getInitialDur(),
          "prcnt_days_travel_away_from_home":this.getInitialDur()
        },
 	 	},
		"duration_date": this.getInitialDur(),
	  selected_range:"today",
	  date:"",
		capt:"",
		active_category:"",
    active_username:"",
    active_category_name:"",
    all_verbose_name:"",
    dateRange4:false,
    isStressInfoModelOpen:false
		};


		this.successProgress = this.successProgress.bind(this);
		this.successRank = this.successRank.bind(this);
		this.headerDates = this.headerDates.bind(this);
  	this.errorProgress = this.errorProgress.bind(this);
  	this.toggleCalendar=this.toggleCalendar.bind(this);
  	this.toggleDate1 = this.toggleDate1.bind(this);
 		this.toggleDate2 = this.toggleDate2.bind(this);
 		this.toggleDate3 = this.toggleDate3.bind(this);
    this.toggleDate4 = this.toggleDate4.bind(this);
 		this.handleChange = this.handleChange.bind(this);
 		this.createExcelPrintURL = this.createExcelPrintURL.bind(this);
 		this.toggleDropdown = this.toggleDropdown.bind(this);
 		this.onSubmitDate1 = this.onSubmitDate1.bind(this);
 		this.onSubmitDate2 = this.onSubmitDate2.bind(this);
 		this.onSubmitDate3 = this.onSubmitDate3.bind(this);
 		this.processDate = this.processDate.bind(this);
 		this.strToSecond = this.strToSecond.bind(this);
 		this.handleScroll = this.handleScroll.bind(this);
 		this.renderDateRangeDropdown = this.renderDateRangeDropdown.bind(this);
    this.renderProgressFetchOverlay = renderProgressFetchOverlay.bind(this);
    this.renderProgress2FetchOverlay = renderProgress2FetchOverlay.bind(this);
    this.renderProgress3FetchOverlay = renderProgress3FetchOverlay.bind(this);
    this.renderProgressSelectedDateFetchOverlay = renderProgressSelectedDateFetchOverlay.bind(this);
 		this.toggle = this.toggle.bind(this);
 		this.renderOverallHealth = this.renderOverallHealth.bind(this);
 		this.renderMcs = this.renderMcs.bind(this);
 		this.renderNonExerciseSteps = this.renderNonExerciseSteps.bind(this);
 		this.renderNutrition = this.renderNutrition.bind(this);
 		this.renderAlcohol = this.renderAlcohol.bind(this);
 		this.renderEc = this.renderEc.bind(this);
 		this.renderExerciseStats = this.renderExerciseStats.bind(this);
 		this.renderOther = this.renderOther.bind(this);
 		this.renderSleep = this.renderSleep.bind(this);
 		this.renderSick = this.renderSick.bind(this);
 		this.renderStress = this.renderStress.bind(this);
 		this.renderStanding = this.renderStanding.bind(this);
 		this.renderTravel = this.renderTravel.bind(this);
 		this.gpascoreDecimal = this.gpascoreDecimal.bind(this);
 		this.renderComma = this.renderComma.bind(this);
 		this.exerciseStatsNoWorkOut = this.exerciseStatsNoWorkOut.bind(this);
 		this.vo2MaxNotReported = this.vo2MaxNotReported.bind(this);
 		this.renderPercent = this.renderPercent.bind(this);
 		this.renderRank = this.renderRank.bind(this);
 		this.handleBackButton = this.handleBackButton.bind(this);
 		this.getStylesForGrades = this.getStylesForGrades.bind(this);
 		this.getStylesForGpa = this.getStylesForGpa.bind(this);
 		this.getStylesForsteps = this.getStylesForsteps.bind(this);
 		this.getStylesForSleep = this.getStylesForSleep.bind(this);
 		this.getStylesForBeats = this.getStylesForBeats.bind(this);
 		this.getStylesForRhr = this.getStylesForRhr.bind(this);
 		this.getStylesForFood = this.getStylesForFood.bind(this);
 		this.getInitialDur = this.getInitialDur.bind(this);
 		this.renderValue = this.renderValue.bind(this);
    this.toggle1 = this.toggle1.bind(this);
    this.renderMcsLink = this.renderMcsLink.bind(this);
    this.reanderAllHrr = this.reanderAllHrr.bind(this);
    this.onSubmitDate4 = this.onSubmitDate4.bind(this);
    this.toggleStressInfo = this.toggleStressInfo.bind(this);
    this.MinToHours = this.MinToHours.bind(this);
    this.renderActiveMinsValue = this.renderActiveMinsValue.bind(this);
       
	}

	vo2MaxNotReported(value){
      	if(value == undefined || value == 0 || value == "" || value == "00:00"){
        	value = "Not Provided"
      	}
      	else{
        	value = value
      	}
    	return value;
	}

renderExerciseStats(value,dur){
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style" style = {{fontWeight:"bold"}}>Exercise Stats</CardTitle>
			          		<hr  
			          			
			          			/>
			          		<CardText>
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-7 col-sm-7 col-lg-7 text_center1">
						          		Workout Duration (hours:minutes)
		          					</div>
		          					<div className = "col-md-5 col-sm-5 col-lg-5 text_center">
						          		{ this.exerciseStatsNoWorkOut(this.renderValue(value.workout_duration_hours_min,dur)) }
		          					</div>
		          				</div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-7 col-sm-7 col-lg-7 text_center1">
						         		Workout Effort Level
						         	</div>
						         	<div className = "col-md-5 col-sm-5 col-lg-5 text_center">
						         		{ this.exerciseStatsNoWorkOut(this.renderValue(value.workout_effort_level,dur)) }
						         	</div>
						        </div>
				          		<hr  
	          						
          						/>
          						<div className = "row justify-content-center">
					          		<div className = "col-md-7 col-sm-7 col-lg-7 text_center1">
					          			Average Exercise Heart Rate
					          		</div>
					          		<div className = "col-md-5 col-sm-5 col-lg-5 text_center">
					          			{ this.exerciseStatsNoWorkOut(this.renderValue(value.avg_exercise_heart_rate,dur)) }
					          		</div>
					          	</div>
					          	<hr  
	          						
          						/>
                      <div className = "row justify-content-center">
                        <div className = "col-md-7 col-sm-7 col-lg-7 text_center1">
                          AVG Non Strength Activities Heart Rate
                        </div>
                        <div className = "col-md-5 col-sm-5 col-lg-5 text_center">
                          { this.exerciseStatsNoWorkOut(this.renderValue(value.avg_non_strength_exercise_heart_rate,dur)) }
                        </div>
                      </div>
                      <hr  
                        
                      />
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-7 col-sm-7 col-lg-7 text_center1">
					          			VO2 Max
					          		</div>
					          		<div className = "col-md-5 col-sm-5 col-lg-5 text_center">
					          			{ this.vo2MaxNotReported(this.renderValue(value.vo2_max,dur)) }
					          		</div>
					          	</div>
			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
  	}

  		renderOther(value,dur,rank){
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style" style = {{fontWeight:"bold"}}>Other Stats</CardTitle>
			          		<hr  
			          			
			          			/>
			          		<CardText>
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						          		Resting Heart Rate (RHR)
		          					</div>
		          					<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						          		{this.getStylesForRhr(this.renderValue(value.resting_hr,dur)) }
		          					</div>
		          				</div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Rank against other users
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.renderRank(this.state.rankData.resting_hr,this.state.selected_range)}
						         	</div>
						        </div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		HRR (time to 99)
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{ this.renderValue(value.hrr_time_to_99,dur)}
						         	</div>
						        </div>
						        <hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Rank against other users
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.renderRank(this.state.rankData.time_99,this.state.selected_range)}
						         	</div>
						        </div>
				          		<hr  
	          						
          						/>
          						<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			HRR (heart beats lowered in 1st minute)
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{this.getStylesForBeats(this.renderValue(value.hrr_beats_lowered_in_first_min,dur)) }
					          		</div>
					          	</div>
					          	<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Rank against other users
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.renderRank(this.state.rankData.beat_lowered,this.state.selected_range)}
						         	</div>
						        </div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			HRR (highest heart rate in 1st minute)
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{this.renderValue(value.hrr_highest_hr_in_first_min,dur) }
					          		</div>
					          	</div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			HRR (lowest heart rate point in 1st Minute)
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{this.renderValue(value.hrr_lowest_hr_point,dur) }
					          		</div>
					          	</div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Pure 1 Minute HRR Beats Lowered
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ this.getStylesForBeats(this.renderValue(value.hrr_pure_1_minute_beat_lowered,dur)) }
					          		</div>
					          	</div>
					          	<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Rank against other users
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.renderRank(this.state.rankData.pure_beat_lowered,this.state.selected_range)}
						         	</div>
						        </div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Pure time to 99 (mm:ss)
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ this.renderValue(value.hrr_pure_time_to_99,dur) }
					          		</div>
					          	</div>
					          	<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Rank against other users
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.renderRank(this.state.rankData.pure_time_99,this.state.selected_range)}
						         	</div>
						        </div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Floors Climbed
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ this.renderValue(value.floors_climbed,dur) }
					          		</div>
					          	</div>
			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
  	}
  	renderSleep(value,dur,rank){
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style" style = {{fontWeight:"bold"}}>Sleep Per Night (excluding awake time)</CardTitle>
			          		<hr  
			          			
			          			/>
			          		<CardText>
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						          		Total Sleep in hours:minutes
		          					</div>
		          					<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						          		{ this.getStylesForSleep(this.renderValue(value.total_sleep_in_hours_min,dur)) }
		          					</div>
		          				</div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Rank against other users 
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.renderRank(this.state.rankData.avg_sleep,this.state.selected_range)}
						         	</div>
						        </div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Average Sleep Grade
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{ this.getStylesForGrades(this.renderValue(value.average_sleep_grade,dur)) }
						         	</div>
						        </div>
				          		<hr  
	          						
          						/>
          						<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			# of Days Sleep Aid Taken in Period
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{this.renderValue(value.num_days_sleep_aid_taken_in_period,dur) }
					          		</div>
					          	</div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			% of Days Sleep Aid Taken in Period
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ this.renderPercent(this.renderValue(value.prcnt_days_sleep_aid_taken_in_period,dur)) }
					          		</div>
					          	</div>
			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
  	}
  	renderSick(value,dur){
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style" style = {{fontWeight:"bold"}}>Sick</CardTitle>
			          		<hr  
			          			
			          			/>
			          		<CardText>
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						          		Number of Days Not Sick
		          					</div>
		          					<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						          		{ this.renderValue(value.number_of_days_not_sick,dur) }
		          					</div>
		          				</div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		% of Days Not Sick
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{ this.renderPercent(this.renderValue(value.prcnt_of_days_not_sick,dur)) }
						         	</div>
						        </div>
				          		<hr  
	          						
          						/>
          						<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Number of Days Sick
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ this.renderValue(value.number_of_days_sick,dur) }
					          		</div>
					          	</div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			% of Days Sick
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ this.renderPercent(this.renderValue(value.prcnt_of_days_sick,dur)) }
					          		</div>
					          	</div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Days Sick/Not Sick Reported
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ this.renderValue(value.days_sick_not_sick_reported,dur) }
					          		</div>
					          	</div>
			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
  	}
  	renderStress(value,dur){
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style" style = {{fontWeight:"bold"}}>Stress</CardTitle>
			          		<hr  
			          			
			          			/>
			          		<CardText>
                      <div className = "row justify-content-center">
                        <div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
                          Garmin Stress Level
                          <span id="garmin-stress-info"
                             onClick={this.toggleStressInfo} 
                             style={{paddingLeft:"15px",color:"gray"}}>
                             <FontAwesome 
                                style={{color:"#5E5E5E"}}
                                  name = "info-circle"
                                  size = "1.5x"                                                                              
                              />
                          </span>
                        </div>
                        <div className = "col-md-4 col-sm-4 col-lg-4 text_center">
                          {this.getGarminStressColors(this.renderValue(value.garmin_stress_lvl,dur))}
                        </div>
                      </div>
                      <hr  
                        
                      />
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						          		Number of Days Low Stress Reported
		          					</div>
		          					<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						          		{ this.renderValue(value.number_of_days_low_stress_reported,dur) }
		          					</div>
		          				</div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		% of Days Low Stress
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{ this.renderPercent(this.renderValue(value.prcnt_of_days_low_stress,dur)) }
						         	</div>
						        </div>
				          		<hr  
	          						
          						/>
          						<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Number of Days Medium Stress Reported
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ this.renderValue(value.number_of_days_medium_stress_reported,dur) }
					          		</div>
					          	</div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			% of Days Medium Stress
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ this.renderPercent(this.renderValue(value.prcnt_of_days_medium_stress,dur)) }
					          		</div>
					          	</div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Number of Days High Stress Reported
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ this.renderValue(value.number_of_days_high_stress_reported,dur) }
					          		</div>
					          	</div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			% of Days High Stress
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ this.renderPercent(this.renderValue(value.prcnt_of_days_high_stress,dur)) }
					          		</div>
					          	</div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Number of Days Stress Level Reported
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ this.renderValue(value.days_stress_level_reported,dur) }
					          		</div>
					          	</div>
			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
  	}
  	renderStanding(value,dur){
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style" style = {{fontWeight:"bold"}}>Standing</CardTitle>
			          		<hr  
			          			
			          			/>
			          		<CardText>
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						          		Number of Days Stood more than 3 hours
		          					</div>
		          					<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						          		{ this.renderValue(value.number_days_stood_three_hours,dur) }
		          					</div>
		          				</div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		% of Days Stood More Than 3 Hours
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{ this.renderPercent(this.renderValue(value.prcnt_days_stood_three_hours,dur)) }
						         	</div>
						        </div>
				          		<hr  
	          						
          						/>
          						<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Number of Days Reported Standing/Not Standing more than 3 hours
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ this.renderValue(value.number_days_reported_stood_not_stood_three_hours,dur) }
					          		</div>
					          	</div>					       
			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
  	}
  	renderTravel(value,dur){
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style" style = {{fontWeight:"bold"}}>Travel</CardTitle>
			          		<hr  
			          			
			          			/>
			          		<CardText>
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						          		Number of Days you Traveled/Stayed Away From Home?
		          					</div>
		          					<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						          		{ this.renderValue(value.number_days_travel_away_from_home,dur) }
		          					</div>
		          				</div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		% of Days you Traveled/Stayed Away From Home?
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{ this.renderPercent(this.renderValue(value.prcnt_days_travel_away_from_home,dur)) }
						         	</div>
						        </div>				       
			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
  	}

	exerciseStatsNoWorkOut(value){
      	if(value == undefined || value == 0 || value == "" || value == "00:00"){
        	value = "No Workout"
      	}
      	else{
        	value = value
      	}
    	return value;
	}
  	renderComma(value){
		let steps = '';
		if(value){
			value += '';
	     	var x = value.split('.');
	    	var x1 = x[0];
	        var x2 = x.length > 1 ? '.' + x[1] : '';
	        var rgx = /(\d+)(\d{3})/;
	        while (rgx.test(x1)) {
	        	x1 = x1.replace(rgx, '$1' + ',' + '$2');
	        }
	        steps = x1 + x2;
    	}
        return steps;
	}

  	gpascoreDecimal(gpa){
		let value;
		let x = gpa;
		if( x !=  null && x != undefined && x != "Not Reported"){
		    value =parseFloat(x).toFixed(2);
		 }
		 else if(x == "Not Reported"){
		  value = x;
		 }
		 else{
		  value = "";
		 }
		return value;
	}
  	getStylesForBeats(value){
  		let background = "";
		let color = "";
		let hr_background = "";
		if(value || value == 0){
	            if(value >= 20){
	           		background = 'green';
	               	color = 'white';
	               	hr_background = 'white';
	            }
	            else if(value >= 12 && value < 20){
	                background = '#FFFF01';
	                color = 'black';
	                hr_background = 'black';
	            }	      
	            else if(value > 0 && value < 12){
	                background = '#FF0101';
	                color = 'black';
	                hr_background = 'black';
	            }
        }
       else{
	        	value = "No Data Yet"
	            background = 'white';
	            color = '#5e5e5e';
	            hr_background = '#e5e5e5';
        }
		var model = <div  style = {{background:background, color:color}}>
						{value}
					</div>
		return model;
  	}
	  	renderNonExerciseSteps(value,dur,rank){
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style" style = {{fontWeight:"bold"}}>Non Exercise Steps</CardTitle>
			          		<hr  
			          			
			          			/>
			          		<CardText>
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						          		Non Exercise Steps
		          					</div>
		          					<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						          		{ this.getStylesForsteps(this.renderValue(value.non_exercise_steps,dur)) }
		          					</div>
		          				</div>
		          				 <hr  
	          						
          						/>
          						 <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Rank against other users
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.renderRank(this.state.rankData.nes,this.state.selected_range)}
						         	</div>
						        </div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-9 col-sm-9 col-lg-9 text_center1">
						         		Movement-Non Exercise Steps Grade
						         	</div>
						         	<div className = "col-md-3 col-sm-3 col-lg-3 text_center">
						         		{this.getStylesForGrades(this.renderValue(value.movement_non_exercise_step_grade,dur)) }
						         	</div>
						        </div>
				          		<hr  
	          						
          						/>
          						<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Non Exercise Steps GPA
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{this.getStylesForGpa(this.renderValue(value.non_exericse_steps_gpa,dur)) }
					          		</div>
					          	</div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Total Steps
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{this.renderComma(this.renderValue(value.total_steps,dur))}
					          		</div>
					          	</div>
			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
  	}

  		renderNutrition(value,dur,rank){
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style" style = {{fontWeight:"bold"}}>Nutrition</CardTitle>
			          		<hr  
			          			
			          			/>
			          		<CardText>
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						          		% of Unprocessed Food Consumed
		          					</div>
		          					<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						          		{ this.getStylesForFood(this.renderValue(value.prcnt_unprocessed_volume_of_food,dur)) }
		          					</div>
		          				</div>
		          				<hr  
	          						
          						/>
          						 <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Rank against other users
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.renderRank(this.state.rankData.prcnt_uf,this.state.selected_range)}
						         	</div>
						        </div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		% Non Processed Food Consumed Grade
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.getStylesForGrades(this.renderValue(value.prcnt_unprocessed_food_grade,dur)) }
						         	</div>
						        </div>
				          		<hr  
	          						
          						/>
          						<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			% Non Processed Food Consumed GPA
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{this.getStylesForGpa(this.renderValue(value.prcnt_unprocessed_food_gpa,dur)) }
					          		</div>
					          	</div>
			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
  	}

  	renderAlcohol(value,dur,rank){
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style" style = {{fontWeight:"bold"}}>Alcohol</CardTitle>
			          		<hr  
			          			
			          			/>
			          		<CardText>
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						          		Average Drinks Per Week (7 Days)
		          					</div>
		          					<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						          		{ this.renderValue(value.avg_drink_per_week,dur) }
		          					</div>
		          				</div>
		          				<hr  
	          						
          						/>
          						 <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Rank against other users
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.renderRank(this.state.rankData.alcohol,this.state.selected_range)}
						         	</div>
						        </div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Alcoholic drinks per week Grade
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{ this.getStylesForGrades(this.renderValue(value.alcoholic_drinks_per_week_grade,dur)) }
						         	</div>
						        </div>
				          		<hr  
	          						
          						/>
          						<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Alcoholic drinks per week GPA
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ this.getStylesForGpa(this.renderValue(value.alcoholic_drinks_per_week_gpa,dur)) }
					          		</div>
					          	</div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-9 col-sm-9 col-lg-9 text_center1">
					          			% of Days Alcohol Consumption Reported
					          		</div>
					          		<div className = "col-md-3 col-sm-3 col-lg-3 text_center">
					          			{this.renderPercent(this.renderValue(value.prcnt_alcohol_consumption_reported,dur)) }
					          		</div>
					          	</div>
			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
  	}


  	renderRank(value,dur){
  		let rank = '';
  		let all_rank_data = '';
  		let userName = '';
  		let category = '';
  		let verbose_name = '';
      let other_Scores = {};

  		if(dur && dur != "today" && dur != "month" &&
  			dur != "yesterday" && dur != "week" && dur != "year"){
            if(value && value['custom_range'] != undefined){
                if(value['custom_range'][dur] != undefined){
          			rank = value['custom_range'][dur].user_rank.rank;
          			all_rank_data = value['custom_range'][dur].all_rank;
          			userName = value['custom_range'][dur].user_rank.username;
          			category = value['custom_range'][dur].user_rank.category;

          			/*if(category == "Percent Unprocessed Food"){
                  verbose_name = value['custom_range'][dur].user_rank.other_scores.percent_unprocessed_food.verbose_name;
                }
                else if(category == "Average Sleep"){
                  verbose_name = value['custom_range'][dur].user_rank.other_scores.sleep_duration.verbose_name;
                }*/
                let otherScoreObject = value['custom_range'][dur].user_rank.other_scores;
                if(category != "Pure Time To 99" 
                    && category != "Time To 99"
                    && category != "Active Minute Per Day (24 hours)"
                    && category != "Alcohol"
                    && (otherScoreObject != null 
                    && otherScoreObject != undefined 
                    && otherScoreObject != "")){
                  for (let [key3,o_score] of Object.entries(otherScoreObject)){
                    if(o_score != null && o_score != undefined && o_score != "") {
                      if(!other_Scores[key3]){
                        other_Scores[key3] = {
                          verbose_name:o_score.verbose_name,
                          scores:[]
                        }
                      }
                      if(o_score.value != null && o_score.value != undefined && o_score.value != "") {
                        other_Scores[key3]["scores"].push(o_score.value);
                      }
                    }
                  }
                }

  		        }
            }
        }
  		else{
  			rank = value[dur].user_rank.rank;
  			all_rank_data = value[dur].all_rank;
  			userName = value[dur].user_rank.username;
  			category = value[dur].user_rank.category;
  			/*if(category == "Percent Unprocessed Food"){
          verbose_name = value[dur].user_rank.other_scores.percent_unprocessed_food.verbose_name;
        }
        else if(category == "Average Sleep"){
          verbose_name = value[dur].user_rank.other_scores.sleep_duration.verbose_name;
        }*/
        let otherScoreObject = value[dur].user_rank.other_scores;
        if(category != "Pure Time To 99" 
            && category != "Time To 99"
            && category != "Active Minute Per Day (24 hours)"
            && category != "Alcohol"
            && (otherScoreObject != null 
            && otherScoreObject != undefined 
            && otherScoreObject != "")){
          for (let [key3,o_score] of Object.entries(otherScoreObject)){
            if(o_score != null && o_score != undefined && o_score != "") {
              if(!other_Scores[key3]){
                other_Scores[key3] = {
                  verbose_name:o_score.verbose_name,
                  scores:[]
                }
              }
              if(o_score.value != null && o_score.value != undefined && o_score.value != "") {
                other_Scores[key3]["scores"].push(o_score.value);
              }
            }
          }
          }

  		}
  		let code = <a onClick = {this.renderAllRank.bind(this,all_rank_data,userName,category,other_Scores)}>
						         		<span style={{textDecoration:"underline"}}>{rank}</span>
					         			 	<span id="lbfontawesome">
					                          	<FontAwesome
					                            className = "fantawesome_style"
					                              name = "external-link"
					                              size = "1x"
					                          	/>
				                       		</span> 
						         		</a>
 		return code;
  	}

  	handleBackButton(){
      this.setState({
        active_view:!this.state.active_view,
        btnView:false
      })
    }


    	getStylesForGrades(score){
		let background = "";
		let color = "";
		let hr_background = "";
		if(score){
			if (score == "A"){
	        	background = 'green';
	           	color = 'white';
	           	hr_background = 'white';
	      	}
	      	 else if(score == "B"){
                background = '#32CD32';
                color = 'white';
                hr_background = 'white';
            }
	      	else if (score == "C"){
	    	 	background = '#FFFF01';
	            color = 'black';
	            hr_background = 'black';
	  		}
	  		else if(score == "D"){
                background = '#E26B0A';
                color = 'black';
                hr_background = 'black';
            }
	      	else if (score == "F"){
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
		var model = <div  style = {{background:background, color:color}}>
						{score}
					</div>
		return model;
      
    }

    getStylesForGpa(score){
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
				score = "Not Reported"
	            background = 'white';
	            color = '#5e5e5e';
	            hr_background = '#E5E5E5';
        }
		var model = <div  style = {{background:background, color:color}}>
						{this.gpascoreDecimal(score)}
					</div>
		return model;
      
    }


     getStylesForsteps(score){
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
0        }
		var model = <div  style = {{background:background, color:color}}>
						{this.renderComma(score)}
					</div>
		return model;
      
    }
     getStylesForSleep(value){
		let background = "";
		let color = "";
		let hr_background = "";
		let score;
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
 
       else{
	        	score = "No Data Yet"
	            background = 'white';
	            color = '#5e5e5e';
	            hr_background = '#e5e5e5';
        }
		var model = <div  style = {{background:background, color:color}}>
						{score}
					</div>
		return model;
      
    }


      getStylesForRhr(score){
    console.log("score:..."+score);
  	let background = "";
		let color = "";
		let hr_background = "";
		if(score || score == 0){
      if(score>=80){
     		background = 'red';
         	color = 'black';
         	hr_background = 'black';
      }
      /*
      return {background:'#ff8c00',color:'black'};//Orange
    else if (score >=69 && score <= 74)
        return {background:'#ffff00',color:'black'};//Yellow
    else if (score >=61 && score <= 68)
        return {background:'#32cd32',color:'white'};//Light Green
    else if (score >=30 && score <= 60)
        return {background:'#008000',color:'white'};//Green*/
      else if(score>=75 && score<=79){
          background = '#ff8c00'; //Orange
          color = 'black';
          hr_background = 'black';
      }
      else if(score>=69 && score<=74){
          background = '#ffff00' ; //Yellow
          color = 'black';
          hr_background = 'black';
      }
      else if(score >=61 && score <= 68){
          background = '#32cd32'; //Light getGarminToken
          color = 'white';
          hr_background = 'white';
      }
      else if(score >=30 && score <= 60){
          background = '#008000'; 
          color = 'white';
          hr_background = 'white';
      }
      else if(score<30){
          background = 'red';
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
		var model = <div  style = {{background:background, color:color}}>
						{this.renderComma(score)}
					</div>
		return model;
  	}

getStylesForFood(score){
  		let background = "";
		let color = "";
		let hr_background = "";
		if(score || score == 0){
	            if(score<50){
	           		 background = '#FF0101';
	                color = 'black';
	                hr_background = 'black';
	            }
	            else if(score>=50 && score<70){
	                background = '#FFFF01';
	                color = 'black';
	                hr_background = 'black';
	            }	      
	            else if(score >= 70){	       
	                background = 'green';
	               	color = 'white';
	               	hr_background = 'white';
	            }
        }
       
		var model = <div  style = {{background:background, color:color}}>
						{this.renderPercent(score)}
					</div>
		return model;
  	}
	renderPercent(value){
		let percent ='';
		if(value != null || value != undefined){
			percent = value +" "+ '%';
		}
		else{
			percent = value;
		}
		return percent;
	}
  	renderEc(value,dur,rank){
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style" style = {{fontWeight:"bold"}}>Exercise Consistency</CardTitle>
			          		<hr  
			          			
			          			/>
			          		<CardText>
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						          		Avg # of Days Exercised/Week
		          					</div>
		          					<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						          		{this.renderValue(value.avg_no_of_days_exercises_per_week,dur) }
		          					</div>
		          				</div>
		          				<hr  
	          						
          						/>
          						 <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Rank against other users
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.renderRank(this.state.rankData.ec,this.state.selected_range)}
						         	</div>
						        </div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Exercise Consistency Grade
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{ this.getStylesForGrades(this.renderValue(value.exercise_consistency_grade,dur)) }
						         	</div>
						        </div>
				          		<hr  
	          						
          						/>
          						<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Exercise Consistency GPA
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ this.getStylesForGpa(this.renderValue(value.exercise_consistency_gpa,dur)) }
					          		</div>
					          	</div>
			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
  	}

	renderMcs(value,dur,rank,dure_date){
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style"
			          		 style = {{fontWeight:"bold"}}>
			          		 	Movement Consistency
			          		 </CardTitle> 
			          		<hr  
			          			
			          			/>
			          		<CardText>
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						          		Movement Consistency Score
		          					</div>
		          					<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						          		{ this.renderValue(value.movement_consistency_score,dur)}
                                        {this.renderMcsLink(this.state.rankData.mc,this.state.selected_range,this.state.duration_date)} 
		          					</div>
		          				</div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Movement Consistency Grade
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.getStylesForGrades(this.renderValue(value.movement_consistency_grade,dur)) }
						         	</div>
						        </div>
						        <hr  
	          						
          						/>
          						 <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Rank against other users
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">						         		
						         		{this.renderRank(this.state.rankData.mc,this.state.selected_range)}
						         	</div>
						        </div>
				          		<hr  
	          						
          						/>
          						<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Movement Consistency GPA
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{this.getStylesForGpa(this.renderValue(value.movement_consistency_gpa,dur)) }
					          		</div>
					          	</div>
                      <hr  
                        
                      />
                      <div className = "row justify-content-center">
                        <div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
                          Time Moving / Active (hh:mm) (24 hours)
                        </div>
                        <div className = "col-md-4 col-sm-4 col-lg-4 text_center">
                          {this.renderActiveMinsValue(value.total_active_minutes,dur) == null?"Not Reported":this.renderActiveMinsValue(value.total_active_minutes,dur)}
                        </div>
                      </div>
                      <hr  
                        
                      />
                      <div className = "row justify-content-center">
                        <div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
                          % of Time Moving / Active (hh:mm) (24 hours)
                        </div>
                        <div className = "col-md-4 col-sm-4 col-lg-4 text_center">
                          {this.renderValue(value.total_active_minutes_prcnt,dur) == null?"Not Reported":this.renderValue(value.total_active_minutes_prcnt,dur) +"%"}
                        </div>
                      </div>
                      <hr  
                        
                      />
                      <div className = "row justify-content-center">
                        <div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
                           Rank against other users
                        </div>
                        <div className = "col-md-4 col-sm-4 col-lg-4 text_center">
                          {this.renderRank(this.state.rankData.active_min_total,this.state.selected_range) == null?"Not Reported":this.renderRank(this.state.rankData.active_min_total,this.state.selected_range)}
                        </div>
                      </div>
                      <hr  
                        
                      />
                      <div className = "row justify-content-center">
                        <div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
                           Time Moving / Active (when not sleeping) (hh:mm)

                        </div>
                        <div className = "col-md-4 col-sm-4 col-lg-4 text_center">
                          {this.renderActiveMinsValue(value.active_minutes_without_sleep,dur) == null?"Not Reported":this.renderActiveMinsValue(value.active_minutes_without_sleep,dur)}
                        </div>
                      </div>
                      <hr  
                        
                      />
                      <div className = "row justify-content-center">
                        <div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
                           % of Time Moving / Active (when not sleeping) (hh:mm)
                        </div>
                        <div className = "col-md-4 col-sm-4 col-lg-4 text_center">
                          {this.renderValue(value.active_minutes_without_sleep_prcnt,dur) == null?"Not Reported":this.renderValue(value.active_minutes_without_sleep_prcnt,dur) + "%"}
                        </div>
                      </div>
                      <hr  
                        
                      />
                      <div className = "row justify-content-center">
                        <div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
                         Rank against other users
                        </div>
                        <div className = "col-md-4 col-sm-4 col-lg-4 text_center">
                          {this.renderRank(this.state.rankData.active_min_exclude_sleep,this.state.selected_range) == null?"Not Reported":this.renderRank(this.state.rankData.active_min_exclude_sleep,this.state.selected_range)}
                        </div>
                      </div>
                      <hr  
                        
                      />
                      <div className = "row justify-content-center">
                        <div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
                          Time Moving / Active (when not sleeping and exercising) (hh:mm)

                        </div>
                        <div className = "col-md-4 col-sm-4 col-lg-4 text_center">
                          {this.renderActiveMinsValue(value.active_minutes_without_sleep_exercise,dur) == null?"Not Reported":this.renderActiveMinsValue(value.active_minutes_without_sleep_exercise,dur)}
                        </div>
                      </div>
                      <hr  
                        
                      />
                      <div className = "row justify-content-center">
                        <div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
                          % of Time Moving / Active (when not sleeping and exercising) (hh:mm)
                        </div>
                        <div className = "col-md-4 col-sm-4 col-lg-4 text_center">
                          {this.renderValue(value.active_minutes_without_sleep_exercise_prcnt,dur) == null?"Not Reported":this.renderValue(value.active_minutes_without_sleep_exercise_prcnt,dur) + "%"}
                        </div>
                      </div>
                      <hr  
                        
                      />
                      <div className = "row justify-content-center">
                        <div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
                          Rank against other users
                        </div>
                        <div className = "col-md-4 col-sm-4 col-lg-4 text_center">
                          {this.renderRank(this.state.rankData.active_min_exclude_sleep_exercise,this.state.selected_range) == null?"Not Reported":this.renderRank(this.state.rankData.active_min_exclude_sleep_exercise,this.state.selected_range)}
                        </div>
                      </div>

			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
  	}

  	   renderMcsLink(value,dur,dure_date){
      let rank = '';
      let all_rank_data = '';
      let userName = '';
      let category = '';
      let verbose_name = '';
      if(dur && dur != "today" && dur != "month" &&
        dur != "yesterday" && dur != "week" && dur != "year"){
        if(value && value['custom_range'] != undefined){
            if(value['custom_range'][dur] != undefined){
                rank = value['custom_range'][dur].user_rank.rank;
                all_rank_data = value['custom_range'][dur].all_rank;
                userName = value['custom_range'][dur].user_rank.username;
                category = value['custom_range'][dur].user_rank.category;
                if(category == "Percent Unprocessed Food" || category == "Average Sleep"){
                  verbose_name = value['custom_range'][dur].user_rank.score.verbose_name;
                }
              }
            }
        }
      else{
        rank = value[dur].user_rank.rank;
        all_rank_data = value[dur].all_rank;
        userName = value[dur].user_rank.username;
        category = value[dur].user_rank.category;
        if(category == "Percent Unprocessed Food" || category == "Average Sleep"){
          verbose_name = value[dur].user_rank.score.verbose_name;
        }
      }
      let code;
      if(dur == "today" || dur == "yesterday"){
            code = <Link to={`/mcs_dashboard?date=${moment(dure_date[dur]).format('YYYY-MM-DD')}`}>
                                        <span id="lbfontawesome">
                                       <FontAwesome
                                       className = "fantawesome_style"
                                         name = "external-link"
                                          size = "1x"
                                      />
                                  </span> 
                              </Link> 
      }
      else{
        code = <a onClick = {this.renderAllRank.bind(this,all_rank_data,userName,category,verbose_name)}>
                            <span id="lbfontawesome">
                                      <FontAwesome
                                      className = "fantawesome_style"
                                        name = "external-link"
                                        size = "1x"
                                      />
                            </span> 
        </a>
      }
    return code;
    }

    	reanderAllHrr(period,date,capt){
  		this.setState({
  			selected_range:period,
  			date:date,
  			capt:capt,
  		});
  	}

  	    renderValue(value,dur){

    	let score = "";
    	if(dur && dur != "today" && dur != "month" &&
  			dur != "yesterday" && dur != "week" && dur != "year"){
            if(value && value['custom_range'] != undefined){
                if(value['custom_range'][dur] != undefined){
    		  score = value['custom_range'][dur].data;
    	       }
            }
        }
    	else{
      		score = value[dur];
    	}
    	return score;
    }


  onSubmitDate4(event){
    event.preventDefault();
    this.setState({
      dateRange4:!this.state.dateRange4,
      fetching_ql1:true,

    },()=>{
        let custom_ranges = [];
        if(this.state.cr2_start_date && this.state.cr2_end_date){
            custom_ranges.push(this.state.cr2_start_date);
            custom_ranges.push(this.state.cr2_end_date);
        }
         if(this.state.cr3_start_date && this.state.cr3_end_date){
            custom_ranges.push(this.state.cr3_start_date);
            custom_ranges.push(this.state.cr3_end_date);
        }
        custom_ranges.push(this.state.cr1_start_date);
        custom_ranges.push(this.state.cr1_end_date);

      let crange1 = this.state.cr1_start_date + " " + "to" + " " + this.state.cr1_end_date 
      let selected_range = {
            range:crange1,
            duration:this.headerDates(crange1),
            caption:""
       }
      fetchProgress(this.successProgress,
                    this.errorProgress,
                    this.state.selectedDate,custom_ranges,
                    selected_range);
      fetchUserRank(
            this.successRank,
            this.errorProgress,
            this.state.selectedDate,custom_ranges,
            selected_range
        );
    });
  }

  MinToHours(score){
  let time;// undefined
      if(score != null && score != undefined && score != "" && score != "N/A"){
        if (score == -1){
          time = "Never"
        }
        else{
          let hours = parseInt(score/60);//3
          let minutes = (score % 60);//9
          if(hours < 10){// 3<10 
            hours = "0" + hours;  //time = 03
          }
          else{
            hours = hours; // time = 03 
          }
          if(minutes < 10){// 9<10 
            time = hours + ":0" + minutes; // time = 03:09
          }
          else{
            time = hours + ":" + minutes;// time = 3:9
          }
        }
      }
      else{
        time = "N/A"
      }
      if (score == null || score == 0){
        time = "N/A"
      }
      return time;
    }// time = 03:09


   renderActiveMinsValue(value,dur) {
      let score = "";
      if(dur && dur != "today" && dur != "month" &&
        dur != "yesterday" && dur != "week" && dur != "year"){
            if(value && value['custom_range'] != undefined){
                if(value['custom_range'][dur] != undefined){
          score = this.MinToHours(value['custom_range'][dur].data);
             }
            }
        }
      else{
          score = this.MinToHours(value[dur]);
      }
      return score;
    }

   toggleStressInfo(){
    this.setState({
      isStressInfoModelOpen: !this.state.isStressInfoModelOpen
    });
  }
		renderOverallHealth(value,dur,rank){ 		
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style" style = {{fontWeight:"bold"}}>Overall Health Grade</CardTitle>
			          		<hr 
			          			
			          			/>
			          		<CardText>
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						          		Total GPA Points
		          					</div>
		          					<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						          		{this.renderValue(value.total_gpa_point,dur)}
		          					</div>
		          				</div>
		          				<hr 
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Overall Health GPA
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{ this.getStylesForGpa(this.renderValue(value.overall_health_gpa,dur)) }
						         	</div>
						        </div>
				          		<hr 
	          						
          						/>
          						 <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Rank against other users
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.renderRank(this.state.rankData.oh_gpa,this.state.selected_range)}
						         	</div>
						        </div>
				          		<hr/>
          						<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Overall Health GPA Grade
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{this.getStylesForGrades(this.renderValue(value.overall_health_gpa_grade,dur)) }
					          		</div>
					          	</div>
			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
  	}

	 toggle(){
		this.setState({
			dropdownOpen1:!this.state.dropdownOpen1
		})
	}
	toggleCalendar(){
	    this.setState({
      		calendarOpen:!this.state.calendarOpen
	    });
  	}
  	toggle1() {
      this.setState({
        isOpen1: !this.state.isOpen1,
      });
    }
  	toggleDate1(){
	    this.setState({
	      dateRange1:!this.state.dateRange1
	    });
   	}
 	toggleDate2(){
	    this.setState({
	      dateRange2:!this.state.dateRange2
	    });
   	}
    toggleDate3(){
	    this.setState({
	      dateRange3:!this.state.dateRange3
	    });
   	}
    toggleDate4(){
        this.setState({
          dateRange4:!this.state.dateRange4
        });
    }
   	toggleDropdown() {
	    this.setState({
      		dropdownOpen: !this.state.dropdownOpen
	    });
	}

	renderDateRangeDropdown(value,value5){
  		let duration_type = ["today","yesterday","week","month","year","custom_range"];
  		let duration_type1 = ["today","yesterday","week","month","year",];
  		let durations = [];
  		for(let [key,value1] of Object.entries(value)){
  			if(key == "overall_health"){
	  			for(let [key1,value2] of Object.entries(value1)){
	  				if(key1 == "overall_health_gpa"){
		  				for(let duration of duration_type){
		  					let val = value2[duration];
		  					if(duration == "custom_range" && val){
		  						for(let [range,value3] of Object.entries(val)){
		  							duration_type1.push(range);
		  						}
		  					}
		  				}
		  			}
	  			}
	  		}
  		}
  
  		let date;
	  	let tableHeaders = [];
	  	for(let dur of duration_type1){
	  		let rank;
	  		let capt = dur[0].toUpperCase() + dur.slice(1)
	  		if(dur == "today"){
	  			date = moment(value5[dur]).format('MMM DD, YYYY');
	  			
	  		}
	  		else if(dur == "yesterday"){
	  			date = moment(value5[dur]).format('MMM DD, YYYY');
	  			
	  		}
	  		else if(dur == "week"){
		  		date = this.headerDates(value5[dur]);
		  		
	  		}
	  		else if(dur == "month"){
		  		date = this.headerDates(value5[dur]);
		  		
	  		}
	  		else if(dur == "year"){
		  		date = this.headerDates(value5[dur]);
		  		
	  		}
	  		else{
	  			date = this.headerDates(dur);
	  			capt = "";
	  		}

  			tableHeaders.push(
  			 <DropdownItem>
  			 <a className="dropdown-item" 
	  			onClick = {this.reanderAllHrr.bind(this,dur,date,capt)}
	  			style = {{fontSize:"13px"}}>
	  			{capt}<br/>{date}
  			</a></DropdownItem>);
	  	}
	  return tableHeaders;	
  	}
	handleScroll() {
      if (window.scrollY >= 150 && !this.state.scrollingLock) {
        this.setState({
          scrollingLock: true
        });
      } else if(window.scrollY < 100 && this.state.scrollingLock) {                                               
        this.setState({
          scrollingLock: false
        });
      }
  	}

	onSubmitDate2(event){
    event.preventDefault();
    this.setState({
      dateRange2:!this.state.dateRange2,
      fetching_ql2:true,

    },()=>{
         let custom_ranges = [];
        if(this.state.cr1_start_date && this.state.cr1_end_date){
            custom_ranges.push(this.state.cr1_start_date);
            custom_ranges.push(this.state.cr1_end_date);
        }
         if(this.state.cr3_start_date && this.state.cr3_end_date){
            custom_ranges.push(this.state.cr3_start_date);
            custom_ranges.push(this.state.cr3_end_date);
        }

        custom_ranges.push(this.state.cr2_start_date);
        custom_ranges.push(this.state.cr2_end_date);
      let crange1 = this.state.cr2_start_date + " " + "to" + " " + this.state.cr2_end_date 
      let selected_range = {
            range:crange1,
            duration:this.headerDates(crange1),
            caption:""
       }

      fetchProgress(this.successProgress,
                    this.errorProgress,
                    this.state.selectedDate,custom_ranges,
                    selected_range);
      fetchUserRank(
            this.successRank,
            this.errorProgress,
            this.state.selectedDate,custom_ranges,
            selected_range
        );
      // let date = this.state.cr2_start_date + " " + "to" + " " + this.state.cr2_end_date;
      // let c_date = this.headerDates(date);
      
      // this.reanderAllHrr(date,c_date,'');
    

    });
  }

   strToSecond(value){
    	let time = value.split(':');
    	let hours = parseInt(time[0])*3600;
    	let min = parseInt(time[1])*60;
    	let s_time = hours + min;
    	return s_time;
	}
 onSubmitDate3(event){
    event.preventDefault();
    this.setState({
      dateRange3:!this.state.dateRange3,
      fetching_ql3:true,
    },()=>{
         let custom_ranges = [];
         if(this.state.cr1_start_date && this.state.cr1_end_date){
            custom_ranges.push(this.state.cr1_start_date);
            custom_ranges.push(this.state.cr1_end_date);
        }
        if(this.state.cr2_start_date && this.state.cr2_end_date){
            custom_ranges.push(this.state.cr2_start_date);
            custom_ranges.push(this.state.cr2_end_date);
        }
        custom_ranges.push(this.state.cr3_start_date);
        custom_ranges.push(this.state.cr3_end_date);
      let crange1 = this.state.cr3_start_date + " " + "to" + " " + this.state.cr3_end_date 
      let selected_range = {
            range:crange1,
            duration:this.headerDates(crange1),
            caption:""
       }

     fetchProgress(this.successProgress,
                    this.errorProgress,
                    this.state.selectedDate,custom_ranges,
                    selected_range);
      fetchUserRank(
            this.successRank,
            this.errorProgress,
            this.state.selectedDate,custom_ranges,
            selected_range
        );
  
    });
  }

	onSubmitDate1(event){
    event.preventDefault();
    this.setState({
      dateRange1:!this.state.dateRange1,
      fetching_ql1:true,

    },()=>{
        let custom_ranges = [];
        if(this.state.cr2_start_date && this.state.cr2_end_date){
            custom_ranges.push(this.state.cr2_start_date);
            custom_ranges.push(this.state.cr2_end_date);
        }
         if(this.state.cr3_start_date && this.state.cr3_end_date){
            custom_ranges.push(this.state.cr3_start_date);
            custom_ranges.push(this.state.cr3_end_date);
        }
        custom_ranges.push(this.state.cr1_start_date);
        custom_ranges.push(this.state.cr1_end_date);

      let crange1 = this.state.cr1_start_date + " " + "to" + " " + this.state.cr1_end_date 
      let selected_range = {
            range:crange1,
            duration:this.headerDates(crange1),
            caption:""
       }
      fetchProgress(this.successProgress,
                    this.errorProgress,
                    this.state.selectedDate,custom_ranges,
                    selected_range);
      fetchUserRank(
            this.successRank,
            this.errorProgress,
            this.state.selectedDate,custom_ranges,
            selected_range
        );
      // 
      // let c_date = this.headerDates(date);
      
      // this.reanderAllHrr(date,c_date,'');
   
    });
  }
	toggleDropdown() {
	    this.setState({
      		dropdownOpen: !this.state.dropdownOpen
	    });
	}

	createExcelPrintURL(){
    	// code
	    let custom_ranges = [];
	    let selected_date = moment(this.state.selectedDate).format("YYYY-MM-DD");
	    if(this.state.cr1_start_date && this.state.cr1_end_date){
	        custom_ranges.push(this.state.cr1_start_date);
	        custom_ranges.push(this.state.cr1_end_date);
	    }

	    if(this.state.cr2_start_date && this.state.cr2_end_date){
	        custom_ranges.push(this.state.cr2_start_date);
	        custom_ranges.push(this.state.cr2_end_date);
	    }
	     if(this.state.cr3_start_date && this.state.cr3_end_date){
	        custom_ranges.push(this.state.cr3_start_date);
	        custom_ranges.push(this.state.cr3_end_date);
	    }
	    custom_ranges = (custom_ranges && custom_ranges.length) ? custom_ranges.toString():'';
	    let excelURL = `progress/print/progress/excel?date=${selected_date}&&custom_ranges=${custom_ranges}`;
	    return excelURL;
	}
	handleChange(event){
      	const target = event.target;
      	const value = target.value;
      	const name = target.name;
      	this.setState({
        	[name]: value
      	});
    }

	toggleDate1(){
	    this.setState({
	      dateRange1:!this.state.dateRange1
	    });
   	}
 	toggleDate2(){
	    this.setState({
	      dateRange2:!this.state.dateRange2
	    });
   	}
    toggleDate3(){
	    this.setState({
	      dateRange3:!this.state.dateRange3
	    });
   	}
    toggleDate4(){
        this.setState({
          dateRange4:!this.state.dateRange4
        });
    }
	headerDates(value){
   	   let str = value;
       let d = str.split(" ");
       let d1 = d[0];
       let date1 =moment(d1).format('MMM DD, YYYY');
       let d2 = d[2];
       let date2 =moment(d2).format('MMM DD, YYYY');
       let date = date1 + ' to ' + date2;
       return date;  
	}
	getInitialDur(){
		 let paDurationInitialState = {
 			"week":"-",
            "yesterday":"-",
            "month":"-",
           "custom_range":"-",
            "today":"-", 
            "year":"-"
       };
       return paDurationInitialState;
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
	      	sync = <div style={{fontSize:"15px",fontWeight:"bold",fontFamily:'Proxima-Nova',color:"black"}}>Wearable Device Last Synced on{time}</div>;
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
	      fetching_ql4:true,
	      selectedDate: selectedDate,
	      calendarOpen:!this.state.calendarOpen,
	      selected_range:"today",                              
	    },()=>{
	      fetchProgress(this.successProgress,this.errorProgress,this.state.selectedDate);
	      fetchUserRank(this.successRank,this.errorProgress,this.state.selectedDate);
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
        	//value = "0";
        }
        else{
        	//value = "No Data Yet"
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
        	//score = "";
        	background = "white";
        	color = "#5e5e5e";
        	hr_background = "#e5e5e5" 
        }

		let score1 = this.renderCommaInSteps(score);
		var model = <Card className = "card_style"
						 id = "my-card"
						 style = {{background:background, color:color}}>
					        <CardBody>
					          	<CardTitle className = "header_style">{/*Steps This Hour*/}</CardTitle>
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
	        	//score = "";
	            background = 'white';
	            color = '#5e5e5e';
	            hr_background = '#e5e5e5';
        }
		let score1 = this.renderCommaInSteps(score);
		var model = <Card className = "card_style"
						 id = "my-card"
						 style = {{background:background, color:color}}>
					        <CardBody>
					          	<CardTitle className = "header_style">{/*Today's Non Exercise Steps*/}</CardTitle>
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
				//score = " "
	            background = 'white';
	            color = '#5e5e5e';
	            hr_background = '#E5E5E5';
        }
		var model = <Card className = "card_style" 
							id = "my-card-mcs"
							 style = {{background:background, color:color}}>
				        	<CardBody>
				          		<CardTitle className = "header_style">{/*Today’s Movement Consistency Score (MCS)*/}</CardTitle>
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
    	this.setState({
         fetching_ql4:true,     
       },()=>{
       	fetchProgress(this.successProgress,this.errorProgress,this.state.selectedDate);
       	fetchUserRank(this.successRank,this.errorProgress,this.state.selectedDate,true);
       });
	}

	successRank(data,renderAfterSuccess=undefined){
	    this.setState({
	        fetching_ql1:false,
            fetching_ql2:false,
            fetching_ql3:false,
            fetching_ql4:false,
	        rankData:data.data,
	      //  duration_date:data.data.duration_date,
	    },()=>{
            if(renderAfterSuccess){
                this.reanderAllHrr(
                    renderAfterSuccess.range,
                    renderAfterSuccess.duration,
                    renderAfterSuccess.caption
                );
            }
        });
  	}


	successProgress(data,renderAfterSuccess=undefined){
		let date =moment(data.data.duration_date["today"]).format("MMM DD, YYYY"); 
	    this.setState({
	    	fetching_ql1:false,
            fetching_ql2:false,
            fetching_ql3:false,
            fetching_ql4:false,
	        report_date:data.data.report_date,
	        summary:data.data.summary,
	        duration_date:data.data.duration_date,
	        capt:"Today",
	        date:date,

	    },()=>{
            if(renderAfterSuccess){
                this.reanderAllHrr(
                    renderAfterSuccess.range,
                    renderAfterSuccess.duration,
                    renderAfterSuccess.caption
                );
            }
        });
  	}

	errorProgress(error){
       console.log(error.message);
       this.setState({
       		fetching_ql1:false,
            fetching_ql2:false,
            fetching_ql3:false,
            fetching_ql4:false,
       })
    }
	
	render(){
		return(
			<div>
				<NavbarMenu title={"AA Dashboard"} />
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
                		
                 <p style={{textAlign:"center", fontSize:"15px",fontWeight:"bold",fontFamily:'Proxima-Nova',color:"black"}}>Wearable Device Last Synced on
                       <span style={{marginLeft:"6px",fontWeight:"bold",paddingTop:"7px"}}>{moment(this.state.selectedDate).format('MMM DD, YYYY @ hh:mm a')}</span>  
							
						</p> 



                		
		        

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
					          	<CardTitle className = "header_style">{/*Today's Exercise/Activity Steps*/}</CardTitle>
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
				          		<CardTitle className = "header_style">{/*Total Steps Today*/}</CardTitle>
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
export default Aadashboard;