import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Table,Button} from "reactstrap";
import {fetchQuickLook}  from '../network/quick';
import {quicksummaryDate}  from '../network/quick';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import NavbarMenu from './navbar';
import { Alert } from 'reactstrap';
import Grades from './quicksummary_grades';
import Swim from './quicksummary_swim';
import Bike from './quicksummary_bike';
import Steps from './quicksummary_steps';
import Sleep from './quicksummary_sleep';
import Food from './quicksummary_food';  
import Alcohol from './quicksummary_alocohol';
import Exercise from './quicksummary_exercise';
import Movement from './movement_summary';  


axiosRetry(axios, { retries: 3});

var CalendarWidget = require('react-calendar-widget');  
var ReactDOM = require('react-dom');


class Quicklook extends Component{

	getInitialState(){
		 let initial_state={
				"sunday":{},
				"monday":{},
				"tuesday":{},
				"wednesday":{},
				"thursday":{},
				"friday":{},
				"saturday":{}
			};

		let blank_properties={
			"created_at":'',
			"grades_ql":{
				    "overall_truth_grade": '-',
			        "overall_truth_health_gpa": '-',
			        "movement_non_exercise_grade": '-',
			        "movement_consistency_grade": '-',
			        "avg_sleep_per_night_grade": '-',
			        "exercise_consistency_grade": '-',
			        "overall_workout_grade": '-',
			        "prcnt_non_processed_food_consumed_grade": '-',
			        "alcoholic_drink_per_week_grade": '-',
			        "penalty": '-'

			},
			"exercise_reporting_ql": {
		        "workout_easy_hard": '-',
		        "workout_type": '-',
		        "workout_time": '-',
		        "workout_location": '-',
		        "workout_duration": '-',
		        "maximum_elevation_workout": '-',
		        "minutes_walked_before_workout": '-',
		        "distance": '-',
		        "pace": '-',
		        "avg_heartrate": '-',
		        "elevation_gain": '-',
		        "elevation_loss": '-',
		        "effort_level": '-',
		        "dew_point": '-',
		        "temperature": '-',
		        "humidity": '-',
		        "temperature_feels_like": '-',
		        "wind": '-',
		        "hrr": '-',
		        "hrr_start_point": '-',
		        "hrr_beats_lowered": '-',
		        "sleep_resting_hr_last_night": '-',
		        "vo2_max": '-',
		        "running_cadence": '-',
		        "nose_breath_prcnt_workout": '-',
		        "water_consumed_workout": '-',
		        "chia_seeds_consumed_workout": '-',
		        "fast_before_workout": '-',
		        "pain": '-',
		        "pain_area": '-',
		        "stress_level":'-',
		        "sick": '-',
		        "drug_consumed": '-',
		        "drug": '-',
		        "medication": '-',
		        "smoke_substance": '-',
		        "exercise_fifteen_more": '-',
		        "workout_elapsed_time": '-',
		        "timewatch_paused_workout": '-',
		        "exercise_consistency":'-',
		        "workout_duration_grade": '-',
		        "workout_effortlvl_grade": '-',
		        "avg_heartrate_grade": '-',
		        "overall_workout_grade": '-',
		        "heartrate_variability_grade": '-',
		        "workout_comment": '-'
		    },
		    "swim_stats_ql": {    
		        "pace_per_100_yard": '-',
		        "total_strokes": '-'
		    },
		     "bike_stats_ql": {
		        "avg_speed": '-',
		        "avg_power": '-',
		        "avg_speed_per_mile": '-',
		        "avg_cadence": '-',
		    },
		    "steps_ql": {
		        "non_exercise_steps": '-',
		        "exercise_steps": '-',
		        "total_steps": '-',
		        "floor_climed": '-',
		        "floor_decended": '-',
		        "movement_consistency": '-',
		    },

		    "sleep_ql": {
		        "sleep_per_wearable": '-',
		        "sleep_per_user_input": '-',
		        "sleep_aid": '-',
		        "sleep_bed_time": '-',
		        "sleep_awake_time": '-',
		        "deep_sleep": '-',
		        "light_sleep": '-',
		        "awake_time": '-'
		    },
		    "food_ql": {
		        "prcnt_non_processed_food": '-',
		        "prcnt_non_processed_food_grade": '-',
		        "non_processed_food": '-',
		        "diet_type": '-'
		    },
		    "alcohol_ql": {
		        "alcohol_day": '-',
		        "alcohol_week": '-'
		    }
		};
		for(const day of Object.keys(initial_state)){
				initial_state[day] = blank_properties
       		}
       	return initial_state;
	}
	constructor(props){
		super(props);
		this.successquick = this.successquick.bind(this);
		this.errorquick = this.errorquick.bind(this);
		this.processDate = this.processDate.bind(this);
		this.onDismiss = this.onDismiss.bind(this);
		this.updateDayState=this.updateDayState.bind(this);
		// this.activateTab=this.activateTab.bind(this);
		let initial_state = this.getInitialState()
		this.state = {
			visible: true,
			error:false,
			data:initial_state,
			activeTab : 'grade'
			
		};
	}

	updateDayState(day,data){
       			var properties={
       			"created_at":data.created_at,
				grades_ql: {
			        id: data.grades_ql.id,
			        user_ql: data.grades_ql.user_ql,
			        overall_truth_grade: data.grades_ql.overall_truth_grade,
			        overall_truth_health_gpa: data.grades_ql.overall_truth_health_gpa,
			        movement_non_exercise_grade: data.grades_ql.movement_non_exercise_grade,
			        movement_consistency_grade: data.grades_ql.movement_consistency_grade,
			        avg_sleep_per_night_grade: data.grades_ql.avg_sleep_per_night_grade,
			        exercise_consistency_grade: data.grades_ql.exercise_consistency_grade,
			        overall_workout_grade: data.grades_ql.overall_workout_grade,
			        prcnt_non_processed_food_consumed_grade: data.grades_ql.prcnt_non_processed_food_consumed_grade,
			        alcoholic_drink_per_week_grade: data.grades_ql.alcoholic_drink_per_week_grade,
			        penalty:data.grades_ql.penalty		
	    		},

			    exercise_reporting_ql: {
			        id:data.exercise_reporting_ql.id,
			        user_ql: data.exercise_reporting_ql.user_ql,
			        workout_easy_hard: data.exercise_reporting_ql.workout_easy_hard,
			        workout_type:data.exercise_reporting_ql.workout_type,
			        workout_time: data.exercise_reporting_ql.workout_time,
			        workout_location:data.exercise_reporting_ql.workout_location,
			        workout_duration: data.exercise_reporting_ql.workout_duration,
			        maximum_elevation_workout:data.exercise_reporting_ql.maximum_elevation_workout,
			        minutes_walked_before_workout:data.exercise_reporting_ql.minutes_walked_before_workout,
			        distance:data.exercise_reporting_ql.distance,
			        pace: data.exercise_reporting_ql.pace,
			        avg_heartrate: data.exercise_reporting_ql.avg_heartrate,
			        elevation_gain: data.exercise_reporting_ql.elevation_gain,
			        elevation_loss: data.exercise_reporting_ql.elevation_loss,
			        effort_level: data.exercise_reporting_ql.effort_level,
			        dew_point: data.exercise_reporting_ql.dew_point,
			        temperature: data.exercise_reporting_ql.temperature,
			        humidity: data.exercise_reporting_ql.humidity,
			        temperature_feels_like: data.exercise_reporting_ql.temperature_feels_like,
			        wind:data.exercise_reporting_ql.wind,
			        hrr: data.exercise_reporting_ql.hrr,
			        hrr_start_point: data.exercise_reporting_ql.hrr_start_point,
			        hrr_beats_lowered:data.exercise_reporting_ql.hrr_beats_lowered,
			        sleep_resting_hr_last_night:data.exercise_reporting_ql.sleep_resting_hr_last_night,
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
			        workout_duration_grade: data.exercise_reporting_ql.workout_duration_grade,
			        workout_effortlvl_grade: data.exercise_reporting_ql.workout_effortlvl_grade,
			        avg_heartrate_grade: data.exercise_reporting_ql.avg_heartrate_grade,
			        overall_workout_grade: data.exercise_reporting_ql.overall_workout_grade,
			        heartrate_variability_grade: data.exercise_reporting_ql.heartrate_variability_grade,
			        workout_comment:data.exercise_reporting_ql.workout_comment
			    },
			    swim_stats_ql: {
			        id: data.swim_stats_ql.id,
			        user_ql: data.swim_stats_ql.user_ql,
			        pace_per_100_yard: data.swim_stats_ql.pace_per_100_yard,
			        total_strokes: data.swim_stats_ql.total_strokes
			    },
			     "bike_stats_ql": {
			        id: data.bike_stats_ql.id,
			        user_ql: data.bike_stats_ql.user_ql,
			        avg_speed: data.bike_stats_ql.avg_speed,
			        avg_power: data.bike_stats_ql.avg_power,
			        avg_speed_per_mile: data.bike_stats_ql.avg_speed_per_mile,
			        avg_cadence: data.bike_stats_ql.avg_cadence
			    },
			    "steps_ql": {
			        "id": data.steps_ql.id,
			        "user_ql": data.steps_ql.user_ql,
			        "non_exercise_steps": data.steps_ql.non_exercise_steps,
			        "exercise_steps": data.steps_ql.exercise_steps,
			        "total_steps": data.steps_ql.total_steps,
			        "floor_climed": data.steps_ql.floor_climed,
			        "floor_decended": data.steps_ql.floor_decended,
			        "movement_consistency": data.steps_ql.movement_consistency
			    },

			    sleep_ql: {
			        id: data.sleep_ql.id,
			        user_ql: data.sleep_ql.user_ql,
			        sleep_per_wearable: data.sleep_ql.sleep_per_wearable,
			        sleep_per_user_input: data.sleep_ql.sleep_per_user_input,
			        sleep_aid: data.sleep_ql.sleep_aid,
			        sleep_bed_time: data.sleep_ql.sleep_bed_time,
			        sleep_awake_time: data.sleep_ql.sleep_awake_time,
			        deep_sleep: data.sleep_ql.deep_sleep,
			        light_sleep: data.sleep_ql.light_sleep,
			        awake_time: data.sleep_ql.awake_time
			    },
			    food_ql: {
			        id: data.food_ql.id,
			        user_ql: data.food_ql.user_ql,
			        prcnt_non_processed_food: data.food_ql.prcnt_non_processed_food,
			        prcnt_non_processed_food_grade: data.food_ql.prcnt_non_processed_food_grade,
			        non_processed_food: data.food_ql.non_processed_food,
			        diet_type: data.food_ql.diet_type
			    },
			    alcohol_ql: {
			        id: data.alcohol_ql.id,
			        user_ql: data.alcohol_ql.user_ql,
			        alcohol_day: data.alcohol_ql.alcohol_day,
			        alcohol_week: data.alcohol_ql.alcohol_week
			    }
             };
             return properties;
       		}

	successquick(data){
		console.log(data);
		const days=['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
		let initial_state = this.getInitialState();
         if (data.data.length > 0){
		 	 for(var dataitem of data.data){
		      	const date=new Date(dataitem.created_at);
		      	const day=days[date.getDay()];
		      	let obj = this.updateDayState(day,dataitem);
		      	initial_state[day] = obj;
		      }
		      this.setState({
				data:initial_state,
				visible:true,
				error:false
			});
	     }
	     else{
	     		this.setState({
				data:initial_state,
				visible:true,
				error:false
			});
	     }
	}

	errorquick(error){
		console.log(error.message);
		this.setState({
			error:true
		});
	}

	renderAlert(){

		if (this.state.error){
			
			return(
				 <Alert color="danger" isOpen={this.state.error} toggle={this.onDismiss}>
					No Quicklook data is found!		       
				</Alert>
			);
		}
	}

	processDate(date){
		quicksummaryDate(date,this.successquick,this.errorquick);
	}

	componentDidMount(){
		var today = new Date();
		quicksummaryDate(today,this.successquick,this.errorquick);
		// this.props.fetchQuickLook(this.successquick, this.errorquick);
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

	render(){
		const {activeTab}=this.state;
		const class_grade=`nav-link ${activeTab === "grade" ? 'active':''}`;
		const class_swim=`nav-link ${activeTab === "swim" ? 'active':''}`;
		const class_bike=`nav-link ${activeTab === "bike" ? 'active':''}`;
		const class_steps=`nav-link ${activeTab === "steps" ? 'active':''}`;
		const class_sleep=`nav-link ${activeTab === "sleep" ? 'active':''}`;
		const class_food=`nav-link ${activeTab === "food" ? 'active':''}`;
        const class_alcohol=`nav-link ${activeTab === "alcohol" ? 'active':''}`;
        const class_exercise=`nav-link ${activeTab === "exercise" ? 'active':''}`;
        const class_movement=`nav-link ${activeTab === "movement" ? 'active':''}`;
	return(
		<div className="container-fluid">
		<NavbarMenu/>
	
		           	
					
			<div className="col-lg-12 col-md-6 col-sm-3">  
			<div className="quick">
			        <div className="col-md-12 col-md-offset-2">
                         <div className="row justify-content-center">
						<div className="alert">
							{this.renderAlert()}
						</div>
					 </div>
                     </div>
						 <div id="quick1" className="row">
			                 <h2>Quick Summary</h2>			                
			             </div>

			             <div className="row">
			             <div className="col-sm-10 col-sm-offset-1">
			             <div className="quick7">
			             <ul className="nav nav-tabs" id="quick6">
                              
						    <li className="nav-item">
						    		<div>
						    		<a href="#" className={class_grade} value="grade"
						    		 onClick={this.activateTab.bind(this,"grade")}>
						    		Grade
						    		</a>
						    		</div>
						    </li>
						   
						    <li className="nav-item">
						    		<div >
						    		<a href="#" className={class_swim}  value="swim"
						    		 onClick={this.activateTab.bind(this,"swim")}>
						    		 Swim Stats
						    		 </a>
						    		 </div>
						     </li>
						    <li className="nav-item">
						    		<div >
						    		<a href="#" className={class_bike} value="bike"
						    		 onClick={this.activateTab.bind(this,"bike")}>
						    		 Bike Stats
						    		</a>
						    		</div>
						    </li>
						    <li className="nav-item">
						    		<div>
						    		<a href="#" className={class_steps}  value="steps"
						    		 onClick={this.activateTab.bind(this,"steps")}>
						    		 Steps
						    		</a>
						    		</div>
						    </li>
						    <li className="nav-item">
						    		<div>
						    		<a href="#" className={class_sleep}  value="sleep"
						    		 onClick={this.activateTab.bind(this,"sleep")}>
						    		 Sleep
						    		</a>
						    		</div>
						    </li>
						    <li className="nav-item">
						    		<div>
						    		<a href="#" className={class_food}  value="food"
						    		 onClick={this.activateTab.bind(this,"food")}>
						    		 Food
						    		</a>
						    		</div>
						    </li>
						    <li className="nav-item">
						    		<div>
						    		<a href="#" className={class_alcohol} value="alcohol"
						    		 onClick={this.activateTab.bind(this,"alcohol")}>
						    		 Alcohol
						    		 </a>
						    		 </div>
						    </li>
						    <li className="nav-item">
						    		<div>
						    		<a href="#" className={class_exercise} value="exercise"
						    		 onClick={this.activateTab.bind(this,"exercise")}>
						    		 Exercise Reporting
						    		 </a>
						    		 </div>
						    </li>
						      <li className="nav-item">
						    		<div>
						    		<a href="#" className={class_movement} value="exercise"
						    		 onClick={this.activateTab.bind(this,"movement")}>
						    		 Movement summary
						    		 </a>
						    		 </div>
						    </li>
						 </ul>
			      		</div>
			             </div>
			             </div>
                        
			   <div id="quick2" className="row">
			    <div className="col-sm-2 quick5">
		            <CalendarWidget onDaySelect={this.processDate}/>,
                    </div>
                    <div className="col-sm-10">
                   
			      		{this.state.activeTab === "grade" && <Grades data={this.state.data}/> }
			       

				         

                         {this.state.activeTab === "swim" && <Swim data={this.state.data}/>}
				         
                          {this.state.activeTab === "bike" && <Bike data={this.state.data}/>}

				         

                       {this.state.activeTab === "steps" && <Steps data={this.state.data}/>}
				          

                        {this.state.activeTab === "sleep" && <Sleep data={this.state.data}/>}
				        

                         {this.state.activeTab === "food" && <Food data={this.state.data}/>}
				         

                        {this.state.activeTab === "alcohol" && <Alcohol data={this.state.data}/>}
                      

				         {this.state.activeTab === "exercise" && <Exercise data={this.state.data}/>}

				         {this.state.activeTab === "movement" && <Movement/>}
                    </div>
					</div>
					</div>
                 
				
				</div>
				  </div>
					
		
	);
	}
}
export default connect(null,{fetchQuickLook})(Quicklook);