import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {fetchQuickLook}  from '../network/quick';
import axios from 'axios';
import axiosRetry from 'axios-retry';

class Quicklook extends Component{	
	constructor(props){
		super(props);
		this.successquick = this.successquick.bind(this);
		this.state = {
			quicklook_raw:"fetching",
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
		console.log("data");
		this.setState({
			quicklook_raw : data,
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

	componentDidMount(){
		this.props.fetchQuickLook(this.successquick, this.errorquick);
	}

	render(){
	return(
		<div class="container-fluid">
			<div className="col-sm-12">
						 <div className="row">
			                 <h3>Quick Summary</h3>
			             </div>
			    <div className="row">

			        <div className="col-sm-6">
							<div className="row">
							  <h4>Grades</h4>
							</div>
							  <div className="row">
					        <label>Overall Truth Grade : </label>
				            {this.state.grades_ql.overall_truth_grade}
				         </div>
				         <div className="row">
					        <label>Overall Truth Health Gpa : </label>
				            {this.state.grades_ql.overall_truth_health_gpa}
				         </div>
				         <div className="row">
					        <label>Movement Non Exercise Grade : </label>
				            {this.state.grades_ql.movement_non_exercise_grade}
				         </div>

				         <div className="row">
					        <label>Avg Sleep Per Night Grade : </label>
				            {this.state.grades_ql.avg_sleep_per_night_grade}
				         </div>
				         <div className="row">
					        <label>Exercise Consistency Grade : </label>
				            {this.state.grades_ql.exercise_consistency_grade}
				         </div>
				         <div className="row">
					        <label>Overall Workout Grade : </label>
				            {this.state.grades_ql.overall_workout_grade}
				         </div>
				         <div className="row">
					        <label>percent NonProcessed Food Consumed Grade : </label>
				            {this.state.grades_ql.prcnt_non_processed_food_consumed_grade}
				         </div>
				          <div className="row">
					        <label>Alcoholic Drink Per Week Grade : </label>
				            {this.state.grades_ql.alcoholic_drink_per_week_grade}
				         </div>
				         <div className="row">
					        <label>Penalty : </label>
				            {this.state.grades_ql.penalty}
				         </div>


				         {/*---swimming--------*/}


				         <div className="row">
						  <h4>Swim Stats</h4>
						</div>
						  <div className="row">
					        <label>Overall Truth Grade : </label>
				            {this.state.swim_stats_ql.pace_per_100_yard}
				         </div>
				        <div className="row">
					        <label>Total Strokes : </label>
				            {this.state.swim_stats_ql.total_strokes}
				         </div>


				           {/*---bike_stats--------*/}


				         <div className="row">
						  <h4>Bike Stats</h4>
						</div>
						 <div className="row">
					        <label>Avg Speed : </label>
				            {this.state.bike_stats_ql.avg_speed}
				         </div>

				         <div className="row">
					        <label>Avg Power : </label>
				            {this.state.bike_stats_ql.avg_power}
				         </div>
				         <div className="row">
					        <label>Asvg Speed Per Mile : </label>
				            {this.state.bike_stats_ql.avg_speed_per_mile}
				         </div>
				         <div className="row">
					        <label>Avg Cadence : </label>
				            {this.state.bike_stats_ql.avg_cadence}
				         </div>


				          {/*---steps_ql--------*/}


				         <div className="row">
						  <h4>Steps</h4>
						</div>
						 <div className="row">
					        <label>Non Exercise Steps : </label>
				            {this.state.steps_ql.non_exercise_steps}
				         </div>
				         <div className="row">
					        <label>Exercise Steps : </label>
				            {this.state.steps_ql.exercise_steps}
				         </div>
				         <div className="row">
					        <label>Total Steps :</label>
				            {this.state.steps_ql.total_steps}
				         </div>
				         <div className="row">
					        <label>Floor Climed : </label>
				            {this.state.steps_ql.floor_climed}
				         </div>
				         <div className="row">
					        <label>Floor Decended : </label>
				            {this.state.steps_ql.floor_decended}
				         </div>
				         
				         <div className="row">
					        <label>Movement Consistency : </label>
				            {this.state.steps_ql.movement_consistency}
				         </div>


				           {/*---sleep_ql--------*/}


				         <div className="row">
						  <h4>Sleep</h4>
						</div>
						 <div className="row">
					        <label>Sleep Per Wearable : </label>
				            {this.state.sleep_ql.sleep_per_wearable}
				         </div>
				         <div className="row">
					        <label>Sleep Per User Input : </label>
				            {this.state.sleep_ql.sleep_per_user_input}
				         </div>
				         <div className="row">
					        <label>Sleep Aid : </label>
				            {this.state.sleep_ql.sleep_aid}
				         </div>
				         <div className="row">
					        <label>Sleep Bed Time : </label>
				            {this.state.sleep_ql.sleep_bed_time}
				         </div>
				         <div className="row">
					        <label>Sleep Awake Time : </label>
				            {this.state.sleep_ql.sleep_awake_time}
				         </div>
				         
				         <div className="row">
					        <label>Deep Sleep : </label>
				            {this.state.sleep_ql.deep_sleep}
				         </div>
				          <div className="row">
					        <label>Light Sleep : </label>
				            {this.state.sleep_ql.light_sleep}
				         </div>
				          <div className="row">
					        <label>Awake Time : </label>
				            {this.state.sleep_ql.awake_time}
				         </div>


				         {/*---food_ql--------*/}


				         <div className="row">
						  <h4>Food</h4>
						</div>
						 <div className="row">
					        <label>percentage Non Processed Food : </label>
				            {this.state.food_ql.prcnt_non_processed_food}
				         </div>
				         <div className="row">
					        <label>Percentage Non Processed Food Grade : </label>
				            {this.state.food_ql.prcnt_non_processed_food_grade}
				         </div>
				          <div className="row">
					        <label>Non Processed Food : </label>
				            {this.state.food_ql.non_processed_food}
				         </div>
				         <div className="row">
					        <label>Diet Type : </label>
				            {this.state.food_ql.diet_type}
				         </div>

				          {/*---alcohol_ql--------*/}


				         <div className="row">
						  <h4>Alcohol</h4>
						</div>
						 <div className="row">
					        <label>Alcohol Per Day : </label>
				            {this.state.alcohol_ql.alcohol_day}
				         </div>
				         <div className="row">
					        <label>Alcohol Per Week : </label>
				            {this.state.alcohol_ql.alcohol_week}
				         </div>
				    </div>

					         
				 

				 {/*---Exercise Reporting--------*/}


				 <div className="col-sm-6">
						<div className="row">
						  <h4>Exercise Reporting</h4>
						</div>
						<div className="row">
					        <label>WorkOut Easy Hard : </label>
				            {this.state.exercise_reporting_ql.workout_easy_hard}
				         </div>
				         <div className="row">
					        <label>Workout Type : </label>
				            {this.state.exercise_reporting_ql.workout_type}
				         </div>
				         <div className="row">
					        <label>WorkOut Time : </label>
				            {this.state.exercise_reporting_ql.workout_time}
				         </div>
				         <div className="row">
					        <label>WorkOut Location : </label>
				            {this.state.exercise_reporting_ql.workout_location}
				         </div>
				         <div className="row">
					        <label>WorkOut Duration : </label>
				            {this.state.exercise_reporting_ql.workout_duration}
				         </div>
				         <div className="row">
					        <label>Maximum Elevation Workout : </label>
				            {this.state.exercise_reporting_ql.maximum_elevation_workout}
				         </div>
				         <div className="row">
					        <label>Minutes Walked Before Workout : </label>
				            {this.state.exercise_reporting_ql.minutes_walked_before_workout}
				         </div>
				         <div className="row">
					        <label>Distance : </label>
				            {this.state.exercise_reporting_ql.distance}
				         </div>
				         <div className="row">
					        <label>Pace : </label>
				            {this.state.exercise_reporting_ql.pace}
				         </div>
				         <div className="row">
					        <label>Asvg Heartrate : </label>
				            {this.state.exercise_reporting_ql.avg_heartrate}
				         </div>
				         <div className="row">
					        <label>Elevation Gain : </label>
				            {this.state.exercise_reporting_ql.elevation_gain}
				         </div>
				         <div className="row">
					        <label>Elevation Loss : </label>
				            {this.state.exercise_reporting_ql.elevation_loss}
				         </div>
				         <div className="row">
					        <label>Effort Level : </label>
				            {this.state.exercise_reporting_ql.effort_level}
				         </div>
				         <div className="row">
					        <label>Dsew Point : </label>
				            {this.state.exercise_reporting_ql.dew_point}
				         </div>
				         <div className="row">
					        <label>Temperature : </label>
				            {this.state.exercise_reporting_ql.temperature}
				         </div>
				         <div className="row">
					        <label>Humidity : </label>
				            {this.state.exercise_reporting_ql.humidity}
				         </div>
				         <div className="row">
					        <label>Tsemperature Feels Like : </label>
				            {this.state.exercise_reporting_ql.temperature_feels_like}
				         </div>
				         <div className="row">
					        <label>wind : </label>
				            {this.state.exercise_reporting_ql.wind}
				         </div>
				         <div className="row">
					        <label>HRR : </label>
				            {this.state.exercise_reporting_ql.hrr}
				         </div>
				         <div className="row">
					        <label>HRR Start Point : </label>
				            {this.state.exercise_reporting_ql.hrr_start_point}
				         </div>

				         <div className="row">
					        <label>HRR Beats Lowered : </label>
				            {this.state.exercise_reporting_ql.hrr_beats_lowered}
				         </div>
				         <div className="row">
					        <label>Sleep Resting Hr Last Nigh : </label>
				            {this.state.exercise_reporting_ql.sleep_resting_hr_last_nigh}
				         </div>
				         <div className="row">
					        <label>Vo2 Max : </label>
				            {this.state.exercise_reporting_ql.vo2_max}
				         </div>
				         <div className="row">
					        <label>Rsunning Cadence : </label>
				            {this.state.exercise_reporting_ql.running_cadence}
				         </div>
				         <div className="row">
					        <label>Nose Breath Prcnt Workout : </label>
				            {this.state.exercise_reporting_ql.nose_breath_prcnt_workout}
				         </div>
				         <div className="row">
					        <label>Water Consumed WorkOut : </label>
				            {this.state.exercise_reporting_ql.water_consumed_workout}
				         </div>
				         <div className="row">
					        <label>Chia Seeds consumed WorkOut : </label>
				            {this.state.exercise_reporting_ql.chia_seeds_consumed_workout}
				         </div>
				         <div className="row">
					        <label>Fast Before WorkOut : </label>
				            {this.state.exercise_reporting_ql.fast_before_workout}
				         </div>
				         <div className="row">
					        <label>Pain : </label>
				            {this.state.exercise_reporting_ql.pain}
				         </div>
				         <div className="row">
					        <label>Pain Area : </label>
				            {this.state.exercise_reporting_ql.pain_area}
				         </div>
				         <div className="row">
					        <label>Stress Level : </label>
				            {this.state.exercise_reporting_ql.stress_level}
				         </div>
				         <div className="row">
					        <label>Sicks : </label>
				            {this.state.exercise_reporting_ql.sick}
				         </div>
				         <div className="row">
					        <label>Drug Consumed : </label>
				            {this.state.exercise_reporting_ql.drug_consumed}
				         </div>
				         <div className="row">
					        <label>Drug : </label>
				            {this.state.exercise_reporting_ql.drug}
				         </div>
				         <div className="row">
					        <label>Medication : </label>
				            {this.state.exercise_reporting_ql.medication}
				         </div>
				         <div className="row">
					        <label>Smoke Substance : </label>
				            {this.state.exercise_reporting_ql.smoke_substance}
				         </div>
				         <div className="row">
					        <label>Exercise Fifteen More : </label>
				            {this.state.exercise_reporting_ql.exercise_fifteen_more}
				         </div>
				         <div className="row">
					        <label>WorkOut Elapsed Time : </label>
				            {this.state.exercise_reporting_ql.workout_elapsed_time}
				         </div>
				         <div className="row">
					        <label>TimeWatch Paused WorkOut : </label>
				            {this.state.exercise_reporting_ql.timewatch_paused_workout}
				         </div>
				         <div className="row">
					        <label>Exercise Consistency : </label>
				            {this.state.exercise_reporting_ql.exercise_consistency}
				         </div>
				         <div className="row">
					        <label>WorkOut Duration Grade : </label>
				            {this.state.exercise_reporting_ql.workout_duration_grade}
				         </div>
				         <div className="row">
					        <label>WorkOut Effort Level Grade : </label>
				            {this.state.exercise_reporting_ql.workout_effortlvl_grade}
				         </div>
				         <div className="row">
					        <label>Avg Heart Rate Grade : </label>
				            {this.state.exercise_reporting_ql.avg_heartrate_grade}
				         </div>

				          <div className="row">
					        <label>OverAll WorkOut Grade : </label>
				            {this.state.exercise_reporting_ql.overall_workout_grade}
				         </div>
				         <div className="row">
					        <label>Heart Rate Variability Grade : </label>
				            {this.state.exercise_reporting_ql.heartrate_variability_grade}
				         </div>
				         <div className="row">
					        <label>WorkOut Comment : </label>
				            {this.state.exercise_reporting_ql.workout_comment}
				         </div>

					</div>

					</div>
					



			</div>			
			<p><pre>{JSON.stringify(this.state, null, 2)}</pre></p>
		</div>
	);
	}
}
export default connect(null,{fetchQuickLook})(Quicklook);