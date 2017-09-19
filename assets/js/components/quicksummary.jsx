import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Table} from "reactstrap";
import {fetchQuickLook}  from '../network/quick';
import {quicksummaryDate}  from '../network/quick';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import NavbarMenu from './navbar';
   

axiosRetry(axios, { retries: 3});

var CalendarWidget = require('react-calendar-widget');
var ReactDOM = require('react-dom');


class Quicklook extends Component{
	constructor(props){
		super(props);
		this.successquick = this.successquick.bind(this);
		this.state = {
			grades_ql: {
		        id: '',
		        user_ql: '',
		        overall_truth_grade: '',
		        overall_truth_health_gpa: '',
		        movement_non_exercise_grade: '',
		        movement_consistency_grade: '',
		        avg_sleep_per_night_grade: '',
		        exercise_consistency_grade: '',
		        overall_workout_grade: '',
		        prcnt_non_processed_food_consumed_grade: '',
		        alcoholic_drink_per_week_grade: '',
		        penalty: ''
    		},


    		exercise_reporting_ql: {
		        id: '',
		        user_ql: '',
		        workout_easy_hard: '',
		        workout_type: '',
		        workout_time: '',
		        workout_location: '',
		        workout_duration: '',
		        maximum_elevation_workout: '',
		        minutes_walked_before_workout: '',
		        distance: '',
		        pace: '',
		        avg_heartrate: '',
		        elevation_gain: '',
		        elevation_loss: '',
		        effort_level: '',
		        dew_point: '',
		        temperature: '',
		        humidity: '',
		        temperature_feels_like: '',
		        wind: '',
		        hrr: '',
		        hrr_start_point: '',
		        hrr_beats_lowered: '',
		        sleep_resting_hr_last_night: '',
		        vo2_max: '',
		        running_cadence: '',
		        nose_breath_prcnt_workout: '',
		        water_consumed_workout: '',
		        chia_seeds_consumed_workout: '',
		        fast_before_workout: '',
		        pain: '',
		        pain_area: '',
		        stress_level:'',
		        sick: '',
		        drug_consumed: '',
		        drug: '',
		        medication: '',
		        smoke_substance: '',
		        exercise_fifteen_more: '',
		        workout_elapsed_time: '',
		        timewatch_paused_workout: '',
		        exercise_consistency:'',
		        workout_duration_grade: '',
		        workout_effortlvl_grade: '',
		        avg_heartrate_grade: '',
		        overall_workout_grade: '',
		        heartrate_variability_grade: '',
		        workout_comment: ''
		    },
		    swim_stats_ql: {
		        id: '',
		        user_ql: '',
		        pace_per_100_yard: '',
		        total_strokes: ''
		    },
		     "bike_stats_ql": {
		        id: '',
		        user_ql: '',
		        avg_speed: '',
		        avg_power: '',
		        avg_speed_per_mile: '',
		        avg_cadence: '',
		    },
		    "steps_ql": {
		        "id": '',
		        "user_ql": '',
		        "non_exercise_steps": '',
		        "exercise_steps": '',
		        "total_steps": '',
		        "floor_climed": '',
		        "floor_decended": '',
		        "movement_consistency": '',
		    },

		    sleep_ql: {
		        id: '',
		        user_ql: '',
		        sleep_per_wearable: '',
		        sleep_per_user_input: '',
		        sleep_aid: '',
		        sleep_bed_time: '',
		        sleep_awake_time: '',
		        deep_sleep: '',
		        light_sleep: '',
		        awake_time: ''
		    },
		    food_ql: {
		        id: '',
		        user_ql: '',
		        prcnt_non_processed_food: '',
		        prcnt_non_processed_food_grade: '',
		        non_processed_food: '',
		        diet_type: ''
		    },
		    alcohol_ql: {
		        id: '',
		        user_ql: '',
		        alcohol_day: '',
		        alcohol_week: ''
		    }


		};
	}

	successquick(data){
		console.log(data);
		this.setState({
			grades_ql: {
		        id: data.data[0].grades_ql.id,
		        user_ql: data.data[0].grades_ql.user_ql,
		        overall_truth_grade: data.data[0].grades_ql.overall_truth_grade,
		        overall_truth_health_gpa: data.data[0].grades_ql.overall_truth_health_gpa,
		        movement_non_exercise_grade: data.data[0].grades_ql.movement_non_exercise_grade,
		        movement_consistency_grade: data.data[0].grades_ql.movement_consistency_grade,
		        avg_sleep_per_night_grade: data.data[0].grades_ql.avg_sleep_per_night_grade,
		        exercise_consistency_grade: data.data[0].grades_ql.exercise_consistency_grade,
		        overall_workout_grade: data.data[0].grades_ql.overall_workout_grade,
		        prcnt_non_processed_food_consumed_grade: data.data[0].grades_ql.prcnt_non_processed_food_consumed_grade,
		        alcoholic_drink_per_week_grade: data.data[0].grades_ql.alcoholic_drink_per_week_grade,
		        penalty: data.data[0].grades_ql.penalty
    		},

		    exercise_reporting_ql: {
		        id: data.data[0].exercise_reporting_ql.id,
		        user_ql: data.data[0].exercise_reporting_ql.user_ql,
		        workout_easy_hard: data.data[0].exercise_reporting_ql.workout_easy_hard,
		        workout_type: data.data[0].exercise_reporting_ql.workout_type,
		        workout_time: data.data[0].exercise_reporting_ql.workout_time,
		        workout_location: data.data[0].exercise_reporting_ql.workout_location,
		        workout_duration: data.data[0].exercise_reporting_ql.workout_duration,
		        maximum_elevation_workout: data.data[0].exercise_reporting_ql.maximum_elevation_workout,
		        minutes_walked_before_workout: data.data[0].exercise_reporting_ql.minutes_walked_before_workout,
		        distance: data.data[0].exercise_reporting_ql.distance,
		        pace: data.data[0].exercise_reporting_ql.pace,
		        avg_heartrate: data.data[0].exercise_reporting_ql.avg_heartrate,
		        elevation_gain: data.data[0].exercise_reporting_ql.elevation_gain,
		        elevation_loss: data.data[0].exercise_reporting_ql.elevation_loss,
		        effort_level: data.data[0].exercise_reporting_ql.effort_level,
		        dew_point: data.data[0].exercise_reporting_ql.dew_point,
		        temperature: data.data[0].exercise_reporting_ql.temperature,
		        humidity: data.data[0].exercise_reporting_ql.humidity,
		        temperature_feels_like: data.data[0].exercise_reporting_ql.temperature_feels_like,
		        wind: data.data[0].exercise_reporting_ql.wind,
		        hrr: data.data[0].exercise_reporting_ql.hrr,
		        hrr_start_point: data.data[0].exercise_reporting_ql.hrr_start_point,
		        hrr_beats_lowered: data.data[0].exercise_reporting_ql.hrr_beats_lowered,
		        sleep_resting_hr_last_night: data.data[0].exercise_reporting_ql.sleep_resting_hr_last_night,
		        vo2_max: data.data[0].exercise_reporting_ql.vo2_max,
		        running_cadence: data.data[0].exercise_reporting_ql.running_cadence,
		        nose_breath_prcnt_workout: data.data[0].exercise_reporting_ql.nose_breath_prcnt_workout,
		        water_consumed_workout: data.data[0].exercise_reporting_ql.water_consumed_workout,
		        chia_seeds_consumed_workout: data.data[0].exercise_reporting_ql. chia_seeds_consumed_workout,
		        fast_before_workout: data.data[0].exercise_reporting_ql.fast_before_workout,
		        pain: data.data[0].exercise_reporting_ql.pain,
		        pain_area: data.data[0].exercise_reporting_ql.pain_area,
		        stress_level: data.data[0].exercise_reporting_ql.stress_level,
		        sick: data.data[0].exercise_reporting_ql.sick,
		        drug_consumed: data.data[0].exercise_reporting_ql.drug_consumed,
		        drug: data.data[0].exercise_reporting_ql.drug,
		        medication: data.data[0].exercise_reporting_ql.medication,
		        smoke_substance: data.data[0].exercise_reporting_ql.smoke_substance,
		        exercise_fifteen_more: data.data[0].exercise_reporting_ql.exercise_fifteen_more,
		        workout_elapsed_time: data.data[0].exercise_reporting_ql.workout_elapsed_time,
		        timewatch_paused_workout: data.data[0].exercise_reporting_ql.timewatch_paused_workout,
		        exercise_consistency:data.data[0].exercise_reporting_ql.exercise_consistency,
		        workout_duration_grade: data.data[0].exercise_reporting_ql.workout_duration_grade,
		        workout_effortlvl_grade: data.data[0].exercise_reporting_ql.workout_effortlvl_grade,
		        avg_heartrate_grade: data.data[0].exercise_reporting_ql.avg_heartrate_grade,
		        overall_workout_grade: data.data[0].exercise_reporting_ql.overall_workout_grade,
		        heartrate_variability_grade: data.data[0].exercise_reporting_ql.heartrate_variability_grade,
		        workout_comment: data.data[0].exercise_reporting_ql.workout_comment
		    },
		    swim_stats_ql: {
		        id: data.data[0].swim_stats_ql.id,
		        user_ql: data.data[0].swim_stats_ql.user_ql,
		        pace_per_100_yard: data.data[0].swim_stats_ql.pace_per_100_yard,
		        total_strokes: data.data[0].swim_stats_ql.total_strokes
		    },
		     "bike_stats_ql": {
		        id: data.data[0].bike_stats_ql.id,
		        user_ql: data.data[0].bike_stats_ql.user_ql,
		        avg_speed: data.data[0].bike_stats_ql.avg_speed,
		        avg_power: data.data[0].bike_stats_ql.avg_power,
		        avg_speed_per_mile: data.data[0].bike_stats_ql.avg_speed_per_mile,
		        avg_cadence: data.data[0].bike_stats_ql.avg_cadence
		    },
		    "steps_ql": {
		        "id": data.data[0].steps_ql.id,
		        "user_ql": data.data[0].steps_ql.user_ql,
		        "non_exercise_steps": data.data[0].steps_ql.non_exercise_steps,
		        "exercise_steps": data.data[0].steps_ql.exercise_steps,
		        "total_steps": data.data[0].steps_ql.total_steps,
		        "floor_climed": data.data[0].steps_ql.floor_climed,
		        "floor_decended": data.data[0].steps_ql.floor_decended,
		        "movement_consistency": data.data[0].steps_ql.movement_consistency
		    },

		    sleep_ql: {
		        id: data.data[0].sleep_ql.id,
		        user_ql: data.data[0].sleep_ql.user_ql,
		        sleep_per_wearable: data.data[0].sleep_ql.sleep_per_wearable,
		        sleep_per_user_input: data.data[0].sleep_ql.sleep_per_user_input,
		        sleep_aid: data.data[0].sleep_ql.sleep_aid,
		        sleep_bed_time: data.data[0].sleep_ql.sleep_bed_time,
		        sleep_awake_time: data.data[0].sleep_ql.sleep_awake_time,
		        deep_sleep: data.data[0].sleep_ql.deep_sleep,
		        light_sleep: data.data[0].sleep_ql.light_sleep,
		        awake_time: data.data[0].sleep_ql.awake_time
		    },
		    food_ql: {
		        id: data.data[0].food_ql.id,
		        user_ql: data.data[0].food_ql.user_ql,
		        prcnt_non_processed_food: data.data[0].food_ql.prcnt_non_processed_food,
		        prcnt_non_processed_food_grade: data.data[0].food_ql.prcnt_non_processed_food_grade,
		        non_processed_food: data.data[0].food_ql.non_processed_food,
		        diet_type: data.data[0].food_ql.diet_type
		    },
		    alcohol_ql: {
		        id: data.data[0].alcohol_ql.id,
		        user_ql: data.data[0].alcohol_ql.user_ql,
		        alcohol_day: data.data[0].alcohol_ql.alcohol_day,
		        alcohol_week: data.data[0].alcohol_ql.alcohol_week
		    }
		});
	}

	errorquick(error){
		console.log(error.message);
	}

	processDate(date){
		quicksummaryDate(date,this.successquick,this.errorquick);
	}

	componentDidMount(){
		var today = new Date();
		quicksummaryDate(today,this.successquick,this.errorquick);
		this.props.fetchQuickLook(this.successquick, this.errorquick);
	}

	render(){
	return(
		<div className="container-fluid">
		<NavbarMenu/>
			<div className="col-lg-12 col-md-6 col-sm-3">
			<div className="quick">
			
						 <div id="quick1" className="row">
			                 <h2>Quick Summary</h2>			                
			             </div>

			   <div id="quick2" className="row">
			    <div className="col-sm-2 quick5">
		            <CalendarWidget onDaySelect={this.processDate} id="quick6"/>,
                    </div>
			        <div className="col-sm-5">
			        <div className="quick3">
			        <Table className="quick4">
			       
			           
			                <th>  
							 <h4> Grades</h4>
							</th>
							<th><h4>value</h4></th>
							
							
							
							<tbody>
							<tr>
					        <td>Overall Truth Grade : </td>
				            <td>{this.state.grades_ql.overall_truth_grade}</td>
				         </tr>
				         <tr>
					        <td>Overall Truth Health Gpa : </td>
				            <td>{this.state.grades_ql.overall_truth_health_gpa}</td>
				         </tr>
				         <tr>
					        <td>Movement Non Exercise Grade : </td>
				            <td>{this.state.grades_ql.movement_non_exercise_grade}</td>
				         </tr>

				         <tr>
					        <td>Avg Sleep Per Night Grade : </td>
				           <td>{this.state.grades_ql.avg_sleep_per_night_grade}</td>
				         </tr>
				         <tr>
					        <td>Exercise Consistency Grade : </td>
				            <td>{this.state.grades_ql.exercise_consistency_grade}</td>
				         </tr>
				         <tr>
					        <td>Overall Workout Grade : </td>
				           <td> {this.state.grades_ql.overall_workout_grade}</td>
				         </tr>
				         <tr>
					        <td>percent NonProcessed Food Consumed Grade : </td>
				            <td>{this.state.grades_ql.prcnt_non_processed_food_consumed_grade}</td>
				         </tr>
				          <tr>
					        <td>Alcoholic Drink Per Week Grade : </td>
				            <td>{this.state.grades_ql.alcoholic_drink_per_week_grade}</td>
				         </tr>
				         <tr>
					        <td>Penalty : </td>
				            <td>{this.state.grades_ql.penalty}</td>
				         </tr>
				         </tbody>
                          </Table>
                         </div>


				         {/*---swimming--------*/}

                           <div className="quick3">
                           <Table className="quick4">
                           
				         <th>
						  <h4>Swim Stats</h4>
						</th>
						 <th>
						  <h4>value</h4>
						</th>
						
						  <tr>
					        <td>Overall Truth Grade : </td>
				            <td>{this.state.swim_stats_ql.pace_per_100_yard}</td>
				         </tr>
				        <tr>
					        <td>Total Strokes : </td>
				            <td>{this.state.swim_stats_ql.total_strokes}</td>
				            </tr>
				         </Table>
                          </div>

				           {/*---bike_stats--------*/}

                           <div className="quick3">
                           <Table className="quick4">
                           
				         <tr>
				         <th>
						  <h4>Bike Stats</h4>
						  </th>
						   <th>
						  <h4>value</h4>
						</th>
						</tr>
					
						 <tr>
					        <td>Avg Speed : </td>
				            <td>{this.state.bike_stats_ql.avg_speed}</td>
				         </tr>

				         <tr>
					        <td>Avg Power : </td>
				            <td>{this.state.bike_stats_ql.avg_power}</td>
				         </tr>
				         <tr>
					        <td>Asvg Speed Per Mile : </td>
				            <td>{this.state.bike_stats_ql.avg_speed_per_mile}</td>
				         </tr>
				         <tr>
					        <td>Avg Cadence : </td>
				            <td>{this.state.bike_stats_ql.avg_cadence}</td>
				         </tr>
				         </Table>
                         </div>

				          {/*---steps_ql--------*/}

                         <div className="quick3">
				         <Table className="quick4">
				       
				         <tr>
				         <th>
						  <h4>Steps</h4>
						  </th>
						   <th>
						  <h4>value</h4>
						</th>
						  </tr>
						 
						 <tr>
					        <td>Non Exercise Steps : </td>
				            <td>{this.state.steps_ql.non_exercise_steps}</td>
				         </tr>
				         <tr>
					        <td>Exercise Steps : </td>
				            <td>{this.state.steps_ql.exercise_steps}</td>
				         </tr>
				         <tr>
					        <td>Total Steps :</td>
				            <td>{this.state.steps_ql.total_steps}</td>
				         </tr>
				         <tr>
					        <td>Floor Climed : </td>
				            <td>{this.state.steps_ql.floor_climed}</td>
				         </tr>
				         <tr>
					        <td>Floor Decended : </td>
				            <td>{this.state.steps_ql.floor_decended}</td>
				         </tr>
				         
				         <tr>
					        <td>Movement Consistency : </td>
				            <td>{this.state.steps_ql.movement_consistency}</td>
				         </tr>
                          </Table>
                         </div>
				           {/*---sleep_ql--------*/}

                          <div className="quick3">
                          <Table className="quick4">
                         
				         <tr>
				         <th>
						  <h4>Sleep</h4>
						  </th>
						   <th>
						  <h4>value</h4>
						</th>
						</tr>
					
						 <tr>
					        <td>Sleep Per Wearable : </td>
				           <td> {this.state.sleep_ql.sleep_per_wearable}</td>
				         </tr>
				         <tr>
					        <td>Sleep Per User Input : </td>
				           <td> {this.state.sleep_ql.sleep_per_user_input} </td>
				         </tr>
				         <tr>
					        <td>Sleep Aid : </td>
				           <td> {this.state.sleep_ql.sleep_aid}</td>
				         </tr>
				         <tr>
					        <td>Sleep Bed Time : </td>
				            <td>{this.state.sleep_ql.sleep_bed_time}</td>
				         </tr>
				         <tr>
					        <td>Sleep Awake Time : </td>
				            <td>{this.state.sleep_ql.sleep_awake_time}</td>
				         </tr>
				         
				         <tr>
					        <td>Deep Sleep : </td>
				            <td>{this.state.sleep_ql.deep_sleep}</td>
				         </tr>
				          <tr>
					        <td>Light Sleep : </td>
				            <td>{this.state.sleep_ql.light_sleep}</td>
				         </tr>
				          <tr>
					        <td>Awake Time : </td>
				            <td>{this.state.sleep_ql.awake_time}</td>
				         </tr>
                          </Table>
                        </div>
				         {/*---food_ql--------*/}

                           <div className="quick3">
				         <Table className="quick4">
				      
				         <tr>
				         <th>
						  <h4>Food</h4>
						  </th>
						   <th>
						  <h4>value</h4>
						</th>
						  </tr>
						 
						 <tr>
					        <td>percentage Non Processed Food : </td>
				            <td>{this.state.food_ql.prcnt_non_processed_food}</td>
				         </tr>
				         <tr>
					        <td>Percentage Non Processed Food Grade : </td>
				            <td>{this.state.food_ql.prcnt_non_processed_food_grade}</td>
				         </tr>
				          <tr>
					        <td>Non Processed Food : </td>
				            <td>{this.state.food_ql.non_processed_food}</td>
				         </tr>
				         <tr>
					        <td>Diet Type : </td>
				            <td>{this.state.food_ql.diet_type}</td>
				         </tr>
				         </Table>
                          </div>
				          {/*---alcohol_ql--------*/}

                          <div className="quick3">
				         <Table className="quick4">
				         
				         <tr>
				         <th>
						  <h4>Alcohol</h4>
						  </th>
						   <th>
						  <h4>value</h4>
						</th>
						  </tr>
						 
					<tbody>
						 <tr>
					        <td>Alcohol Per Day : </td>
				           <td> {this.state.alcohol_ql.alcohol_day}</td>
				         </tr>
				         <tr>
					        <td>Alcohol Per Week : </td>
				            <td>{this.state.alcohol_ql.alcohol_week}</td>
				         </tr>
				         </tbody>
				    </Table>
                         </div>
                         </div>
					         
				 

				 {/*---Exercise Reporting--------*/}


				 <div className="col-sm-5">
				  <div className="quick3">
						<Table className="quick4" striped>
						
						<tr>
						<th >
						  <h4>Exercise Reporting</h4>
						</th>
						 <th>
						  <h4>value</h4>
						</th>
						</tr>
						
						<tr>
					        <td>WorkOut Easy Hard : </td>
				            <td>{this.state.exercise_reporting_ql.workout_easy_hard}</td>
				         </tr>
				         <tr>
					        <td>Workout Type : </td>
				            <td>{this.state.exercise_reporting_ql.workout_type}</td>
				         </tr>
				         <tr>
					        <td>WorkOut Time : </td>
				            <td>{this.state.exercise_reporting_ql.workout_time}</td>
				         </tr>
				         <tr>
					        <td>WorkOut Location : </td>
				           <td> {this.state.exercise_reporting_ql.workout_location}</td>
				         </tr>
				         <tr>
					        <td>WorkOut Duration : </td>
				            <td>{this.state.exercise_reporting_ql.workout_duration}</td>
				         </tr>
				         <tr>
					        <td>Maximum Elevation Workout : </td>
				            <td>{this.state.exercise_reporting_ql.maximum_elevation_workout}</td>
				         </tr>
				         <tr>
					        <td>Minutes Walked Before Workout : </td>
				            <td>{this.state.exercise_reporting_ql.minutes_walked_before_workout}</td>
				         </tr>
				         <tr>
					        <td>Distance : </td>
				            <td>{this.state.exercise_reporting_ql.distance}</td>
				         </tr>
				         <tr>
					        <td>Pace : </td>
				            <td>{this.state.exercise_reporting_ql.pace}</td>
				         </tr>
				         <tr>
					        <td>Asvg Heartrate : </td>
				            <td>{this.state.exercise_reporting_ql.avg_heartrate}</td>
				         </tr>
				         <tr>
					        <td>Elevation Gain : </td>
				            <td>{this.state.exercise_reporting_ql.elevation_gain}</td>
				         </tr>
				         <tr>
					        <td>Elevation Loss : </td>
				            <td>{this.state.exercise_reporting_ql.elevation_loss}</td>
				         </tr>
				         <tr>
					        <td>Effort Level : </td>
				            <td>{this.state.exercise_reporting_ql.effort_level}</td>
				         </tr>
				         <tr>
					        <td>Dsew Point : </td>
				            <td>{this.state.exercise_reporting_ql.dew_point}</td>
				         </tr>
				         <tr>
					        <td>Temperature : </td>
				           <td> {this.state.exercise_reporting_ql.temperature}</td>
				         </tr>
				         <tr>
					        <td>Humidity : </td>
				           <td>{this.state.exercise_reporting_ql.humidity}</td>
				         </tr>
				         <tr>
					        <td>Tsemperature Feels Like : </td>
				            <td>{this.state.exercise_reporting_ql.temperature_feels_like}</td>
				         </tr>
				         <tr>
					        <td>wind : </td>
				            <td>{this.state.exercise_reporting_ql.wind}</td>
				         </tr>
				         <tr>
					        <td>HRR : </td>
				           <td> {this.state.exercise_reporting_ql.hrr}</td>
				         </tr>
				         <tr>
					        <td>HRR Start Point : </td>
				            <td>{this.state.exercise_reporting_ql.hrr_start_point}</td>
				         </tr>

				         <tr>
					        <td>HRR Beats Lowered : </td>
				            <td>{this.state.exercise_reporting_ql.hrr_beats_lowered}</td>
				         </tr>
				         <tr>
					        <td>Sleep Resting Hr Last Nigh : </td>
				            <td>{this.state.exercise_reporting_ql.sleep_resting_hr_last_nigh}</td>
				         </tr>
				         <tr>
					        <td>Vo2 Max : </td>
				            <td>{this.state.exercise_reporting_ql.vo2_max}</td>
				         </tr>
				         <tr>
					        <td>Rsunning Cadence : </td>
				            <td>{this.state.exercise_reporting_ql.running_cadence}</td>
				         </tr>
				         <tr>
					        <td>Nose Breath Prcnt Workout : </td>
				            <td>{this.state.exercise_reporting_ql.nose_breath_prcnt_workout}</td>
				         </tr>
				         <tr>
					        <td>Water Consumed WorkOut : </td>
				            <td>{this.state.exercise_reporting_ql.water_consumed_workout}</td>
				         </tr>
				         <tr>
					        <td>Chia Seeds consumed WorkOut : </td>
				            <td>{this.state.exercise_reporting_ql.chia_seeds_consumed_workout}</td>
				         </tr>
				         <tr>
					        <td>Fast Before WorkOut : </td>
				            <td>{this.state.exercise_reporting_ql.fast_before_workout}</td>
				         </tr>
				         <tr>
					        <td>Pain : </td>
				            <td>{this.state.exercise_reporting_ql.pain}</td>
				         </tr>
				         <tr>
					        <td>Pain Area : </td>
				            <td>{this.state.exercise_reporting_ql.pain_area}</td>
				         </tr>
				         <tr>
					        <td>Stress Level : </td>
				            <td>{this.state.exercise_reporting_ql.stress_level}</td>
				         </tr>
				         <tr>
					        <td>Sicks : </td>
				            <td>{this.state.exercise_reporting_ql.sick}</td>
				         </tr>
				         <tr>
					        <td>Drug Consumed : </td>
				            <td>{this.state.exercise_reporting_ql.drug_consumed}</td>
				         </tr>
				         <tr>
					        <td>Drug : </td>
				            <td>{this.state.exercise_reporting_ql.drug}</td>
				         </tr>
				         <tr>
					        <td>Medication : </td>
				            <td>{this.state.exercise_reporting_ql.medication}</td>
				         </tr>
				         <tr>
					        <td>Smoke Substance : </td>
				            <td>{this.state.exercise_reporting_ql.smoke_substance}</td>
				         </tr>
				         <tr>
					        <td>Exercise Fifteen More : </td>
				            <td>{this.state.exercise_reporting_ql.exercise_fifteen_more}</td>
				         </tr>
				         <tr>
					        <td>WorkOut Elapsed Time : </td>
				            <td>{this.state.exercise_reporting_ql.workout_elapsed_time}</td>
				         </tr>
				         <tr>
					        <td>TimeWatch Paused WorkOut : </td>
				            <td>{this.state.exercise_reporting_ql.timewatch_paused_workout}</td>
				         </tr>
				         <tr>
					        <td>Exercise Consistency : </td>
				            <td>{this.state.exercise_reporting_ql.exercise_consistency}</td>
				         </tr>
				         <tr>
					        <td>WorkOut Duration Grade : </td>
				             <td>{this.state.exercise_reporting_ql.workout_duration_grade}</td>
				         </tr>
				         <tr>
					        <td>WorkOut Effort Level Grade : </td>
				             <td>{this.state.exercise_reporting_ql.workout_effortlvl_grade}</td>
				         </tr>
				         <tr>
					        <td>Avg Heart Rate Grade : </td>
				             <td>{this.state.exercise_reporting_ql.avg_heartrate_grade}</td>
				         </tr>

				          <tr>
					        <td>OverAll WorkOut Grade : </td>
				             <td>{this.state.exercise_reporting_ql.overall_workout_grade}</td>
				         </tr>
				         <tr>
					        <td>Heart Rate Variability Grade : </td>
				             <td>{this.state.exercise_reporting_ql.heartrate_variability_grade}</td>
				         </tr>
				         <tr>
					        <td>WorkOut Comment : </td>
				             <td>{this.state.exercise_reporting_ql.workout_comment}</td>
				         </tr>
				         </Table>
					</div>
					</div>
					</div>
                 
					</div>
				</div>
			</div>			
		
	);
	}
}
export default connect(null,{fetchQuickLook})(Quicklook);