import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Table,Button} from "reactstrap";

class Exercise extends Component {
	render(){
	console.log(this.props.data);
	return(

						<div className="quick3">
						<Table className="quick4" striped>
						
						<tr>
						<th >
						  <h4>Exercise Reporting</h4>
						</th>
							 <th><h4>19-09-2017</h4></th>
							 <th><h4>20-09-2017</h4></th>
							 <th><h4>21-09-2017</h4></th>
							 <th><h4>22-09-2017</h4></th>
							 <th><h4>23-09-2017</h4></th>
							 <th><h4>24-09-2017</h4></th>
							 <th><h4>25-09-2017</h4></th>
						</tr>
						
						<tr>
					        <td>WorkOut Easy Hard : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.workout_easy_hard}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.workout_easy_hard}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.workout_easy_hard}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.workout_easy_hard}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.workout_easy_hard}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.workout_easy_hard}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.workout_easy_hard}</td>
				         </tr>
				         <tr>
					        <td>Workout Type : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.workout_type}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.workout_type}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.workout_type}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.workout_type}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.workout_type}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.workout_type}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.workout_type}</td>
				         </tr>
				         <tr>
					        <td>WorkOut Time : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.workout_time}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.workout_time}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.workout_time}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.workout_time}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.workout_time}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.workout_time}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.workout_time}</td>
				         </tr>
				         <tr>
					        <td>WorkOut Location : </td>
				           <td> {this.props.data.sunday.exercise_reporting_ql.workout_location}</td>
				           <td> {this.props.data.monday.exercise_reporting_ql.workout_location}</td>
				           <td> {this.props.data.tuesday.exercise_reporting_ql.workout_location}</td>
				           <td> {this.props.data.wednesday.exercise_reporting_ql.workout_location}</td>
				           <td> {this.props.data.thursday.exercise_reporting_ql.workout_location}</td>
				           <td> {this.props.data.friday.exercise_reporting_ql.workout_location}</td>
				           <td> {this.props.data.saturday.exercise_reporting_ql.workout_location}</td>
				         </tr>
				         <tr>
					        <td>WorkOut Duration : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.workout_duration}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.workout_duration}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.workout_duration}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.workout_duration}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.workout_duration}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.workout_duration}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.workout_duration}</td>
				         </tr>
				         <tr>
					        <td>Maximum Elevation Workout : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.maximum_elevation_workout}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.maximum_elevation_workout}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.maximum_elevation_workout}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.maximum_elevation_workout}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.maximum_elevation_workout}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.maximum_elevation_workout}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.maximum_elevation_workout}</td>
				         </tr>
				         <tr>
					        <td>Minutes Walked Before Workout : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.minutes_walked_before_workout}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.minutes_walked_before_workout}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.minutes_walked_before_workout}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.minutes_walked_before_workout}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.minutes_walked_before_workout}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.minutes_walked_before_workout}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.minutes_walked_before_workout}</td>
				         </tr>
				         <tr>
					        <td>Distance : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.distance}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.distance}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.distance}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.distance}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.distance}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.distance}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.distance}</td>
				         </tr>
				         <tr>
					        <td>Pace : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.pace}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.pace}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.pace}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.pace}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.pace}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.pace}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.pace}</td>
				         </tr>
				         <tr>
					        <td>Asvg Heartrate : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.avg_heartrate}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.avg_heartrate}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.avg_heartrate}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.avg_heartrate}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.avg_heartrate}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.avg_heartrate}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.avg_heartrate}</td>
				         </tr>
				         <tr>
					        <td>Elevation Gain : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.elevation_gain}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.elevation_gain}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.elevation_gain}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.elevation_gain}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.elevation_gain}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.elevation_gain}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.elevation_gain}</td>
				         </tr>
				         <tr>
					        <td>Elevation Loss : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.elevation_loss}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.elevation_loss}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.elevation_loss}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.elevation_loss}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.elevation_loss}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.elevation_loss}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.elevation_loss}</td>
				         </tr>
				         <tr>
					        <td>Effort Level : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.effort_level}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.effort_level}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.effort_level}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.effort_level}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.effort_level}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.effort_level}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.effort_level}</td>
				         </tr>
				         <tr>
					        <td>Dsew Point : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.dew_point}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.dew_point}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.dew_point}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.dew_point}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.dew_point}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.dew_point}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.dew_point}</td>
				         </tr>
				         <tr>
					        <td>Temperature : </td>
				           <td> {this.props.data.sunday.exercise_reporting_ql.temperature}</td>
				           <td> {this.props.data.monday.exercise_reporting_ql.temperature}</td>
				           <td> {this.props.data.tuesday.exercise_reporting_ql.temperature}</td>
				           <td> {this.props.data.wednesday.exercise_reporting_ql.temperature}</td>
				           <td> {this.props.data.thursday.exercise_reporting_ql.temperature}</td>
				           <td> {this.props.data.friday.exercise_reporting_ql.temperature}</td>
				           <td> {this.props.data.saturday.exercise_reporting_ql.temperature}</td>
				         </tr>
				         <tr>
					        <td>Humidity : </td>
				           <td>{this.props.data.sunday.exercise_reporting_ql.humidity}</td>
				           <td>{this.props.data.monday.exercise_reporting_ql.humidity}</td>
				           <td>{this.props.data.tuesday.exercise_reporting_ql.humidity}</td>
				           <td>{this.props.data.wednesday.exercise_reporting_ql.humidity}</td>
				           <td>{this.props.data.thursday.exercise_reporting_ql.humidity}</td>
				           <td>{this.props.data.friday.exercise_reporting_ql.humidity}</td>
				           <td>{this.props.data.saturday.exercise_reporting_ql.humidity}</td>
				         </tr>
				         <tr>
					        <td>Tsemperature Feels Like : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.temperature_feels_like}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.temperature_feels_like}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.temperature_feels_like}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.temperature_feels_like}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.temperature_feels_like}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.temperature_feels_like}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.temperature_feels_like}</td>
				         </tr>
				         <tr>
					        <td>wind : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.wind}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.wind}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.wind}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.wind}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.wind}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.wind}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.wind}</td>
				         </tr>
				         <tr>
					        <td>HRR : </td>
				           <td> {this.props.data.sunday.exercise_reporting_ql.hrr}</td>
				           <td> {this.props.data.monday.exercise_reporting_ql.hrr}</td>
				           <td> {this.props.data.tuesday.exercise_reporting_ql.hrr}</td>
				           <td> {this.props.data.wednesday.exercise_reporting_ql.hrr}</td>
				           <td> {this.props.data.thursday.exercise_reporting_ql.hrr}</td>
				           <td> {this.props.data.friday.exercise_reporting_ql.hrr}</td>
				           <td> {this.props.data.saturday.exercise_reporting_ql.hrr}</td>
				         </tr>
				         <tr>
					        <td>HRR Start Point : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.hrr_start_point}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.hrr_start_point}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.hrr_start_point}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.hrr_start_point}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.hrr_start_point}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.hrr_start_point}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.hrr_start_point}</td>
				         </tr>

				         <tr>
					        <td>HRR Beats Lowered : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.hrr_beats_lowered}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.hrr_beats_lowered}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.hrr_beats_lowered}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.hrr_beats_lowered}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.hrr_beats_lowered}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.hrr_beats_lowered}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.hrr_beats_lowered}</td>
				         </tr>
				         <tr>
					        <td>Sleep Resting Hr Last Nigh : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.sleep_resting_hr_last_nigh}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.sleep_resting_hr_last_nigh}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.sleep_resting_hr_last_nigh}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.sleep_resting_hr_last_nigh}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.sleep_resting_hr_last_nigh}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.sleep_resting_hr_last_nigh}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.sleep_resting_hr_last_nigh}</td>
				         </tr>
				         <tr>
					        <td>Vo2 Max : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.vo2_max}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.vo2_max}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.vo2_max}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.vo2_max}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.vo2_max}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.vo2_max}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.vo2_max}</td>
				         </tr>
				         <tr>
					        <td>Rsunning Cadence : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.running_cadence}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.running_cadence}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.running_cadence}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.running_cadence}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.running_cadence}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.running_cadence}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.running_cadence}</td>
				         </tr>
				         <tr>
					        <td>Nose Breath Prcnt Workout : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.nose_breath_prcnt_workout}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.nose_breath_prcnt_workout}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.nose_breath_prcnt_workout}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.nose_breath_prcnt_workout}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.nose_breath_prcnt_workout}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.nose_breath_prcnt_workout}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.nose_breath_prcnt_workout}</td>
				         </tr>
				         <tr>
					        <td>Water Consumed WorkOut : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.water_consumed_workout}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.water_consumed_workout}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.water_consumed_workout}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.water_consumed_workout}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.water_consumed_workout}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.water_consumed_workout}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.water_consumed_workout}</td>
				         </tr>
				         <tr>
					        <td>Chia Seeds consumed WorkOut : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.chia_seeds_consumed_workout}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.chia_seeds_consumed_workout}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.chia_seeds_consumed_workout}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.chia_seeds_consumed_workout}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.chia_seeds_consumed_workout}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.chia_seeds_consumed_workout}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.chia_seeds_consumed_workout}</td>
				         </tr>
				         <tr>
					        <td>Fast Before WorkOut : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.fast_before_workout}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.fast_before_workout}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.fast_before_workout}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.fast_before_workout}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.fast_before_workout}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.fast_before_workout}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.fast_before_workout}</td>
				         </tr>
				         <tr>
					        <td>Pain : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.pain}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.pain}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.pain}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.pain}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.pain}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.pain}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.pain}</td>
				         </tr>
				         <tr>
					        <td>Pain Area : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.pain_area}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.pain_area}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.pain_area}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.pain_area}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.pain_area}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.pain_area}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.pain_area}</td>
				         </tr>
				         <tr>
					        <td>Stress Level : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.stress_level}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.stress_level}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.stress_level}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.stress_level}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.stress_level}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.stress_level}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.stress_level}</td>
				         </tr>
				         <tr>
					        <td>Sicks : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.sick}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.sick}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.sick}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.sick}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.sick}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.sick}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.sick}</td>
				         </tr>
				         <tr>
					        <td>Drug Consumed : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.drug_consumed}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.drug_consumed}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.drug_consumed}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.drug_consumed}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.drug_consumed}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.drug_consumed}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.drug_consumed}</td>
				         </tr>
				         <tr>
					        <td>Drug : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.drug}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.drug}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.drug}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.drug}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.drug}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.drug}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.drug}</td>
				         </tr>
				         <tr>
					        <td>Medication : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.medication}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.medication}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.medication}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.medication}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.medication}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.medication}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.medication}</td>
				         </tr>
				         <tr>
					        <td>Smoke Substance : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.smoke_substance}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.smoke_substance}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.smoke_substance}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.smoke_substance}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.smoke_substance}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.smoke_substance}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.smoke_substance}</td>
				         </tr>
				         <tr>
					        <td>Exercise Fifteen More : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.exercise_fifteen_more}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.exercise_fifteen_more}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.exercise_fifteen_more}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.exercise_fifteen_more}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.exercise_fifteen_more}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.exercise_fifteen_more}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.exercise_fifteen_more}</td>
				         </tr>
				         <tr>
					        <td>WorkOut Elapsed Time : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.workout_elapsed_time}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.workout_elapsed_time}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.workout_elapsed_time}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.workout_elapsed_time}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.workout_elapsed_time}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.workout_elapsed_time}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.workout_elapsed_time}</td>
				         </tr>
				         <tr>
					        <td>TimeWatch Paused WorkOut : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.timewatch_paused_workout}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.timewatch_paused_workout}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.timewatch_paused_workout}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.timewatch_paused_workout}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.timewatch_paused_workout}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.timewatch_paused_workout}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.timewatch_paused_workout}</td>
				         </tr>
				         <tr>
					        <td>Exercise Consistency : </td>
				            <td>{this.props.data.sunday.exercise_reporting_ql.exercise_consistency}</td>
				            <td>{this.props.data.monday.exercise_reporting_ql.exercise_consistency}</td>
				            <td>{this.props.data.tuesday.exercise_reporting_ql.exercise_consistency}</td>
				            <td>{this.props.data.wednesday.exercise_reporting_ql.exercise_consistency}</td>
				            <td>{this.props.data.thursday.exercise_reporting_ql.exercise_consistency}</td>
				            <td>{this.props.data.friday.exercise_reporting_ql.exercise_consistency}</td>
				            <td>{this.props.data.saturday.exercise_reporting_ql.exercise_consistency}</td>
				         </tr>
				         <tr>
					        <td>WorkOut Duration Grade : </td>
				             <td>{this.props.data.sunday.exercise_reporting_ql.workout_duration_grade}</td>
				             <td>{this.props.data.monday.exercise_reporting_ql.workout_duration_grade}</td>
				             <td>{this.props.data.tuesday.exercise_reporting_ql.workout_duration_grade}</td>
				             <td>{this.props.data.wednesday.exercise_reporting_ql.workout_duration_grade}</td>
				             <td>{this.props.data.thursday.exercise_reporting_ql.workout_duration_grade}</td>
				             <td>{this.props.data.friday.exercise_reporting_ql.workout_duration_grade}</td>
				             <td>{this.props.data.saturday.exercise_reporting_ql.workout_duration_grade}</td>
				         </tr>
				         <tr>
					        <td>WorkOut Effort Level Grade : </td>
				             <td>{this.props.data.sunday.exercise_reporting_ql.workout_effortlvl_grade}</td>
				             <td>{this.props.data.monday.exercise_reporting_ql.workout_effortlvl_grade}</td>
				             <td>{this.props.data.tuesday.exercise_reporting_ql.workout_effortlvl_grade}</td>
				             <td>{this.props.data.wednesday.exercise_reporting_ql.workout_effortlvl_grade}</td>
				             <td>{this.props.data.thursday.exercise_reporting_ql.workout_effortlvl_grade}</td>
				             <td>{this.props.data.friday.exercise_reporting_ql.workout_effortlvl_grade}</td>
				             <td>{this.props.data.saturday.exercise_reporting_ql.workout_effortlvl_grade}</td>
				         </tr>
				         <tr>
					        <td>Avg Heart Rate Grade : </td>
				             <td>{this.props.data.sunday.exercise_reporting_ql.avg_heartrate_grade}</td>
				             <td>{this.props.data.monday.exercise_reporting_ql.avg_heartrate_grade}</td>
				             <td>{this.props.data.tuesday.exercise_reporting_ql.avg_heartrate_grade}</td>
				             <td>{this.props.data.wednesday.exercise_reporting_ql.avg_heartrate_grade}</td>
				             <td>{this.props.data.thursday.exercise_reporting_ql.avg_heartrate_grade}</td>
				             <td>{this.props.data.friday.exercise_reporting_ql.avg_heartrate_grade}</td>
				             <td>{this.props.data.saturday.exercise_reporting_ql.avg_heartrate_grade}</td>
				         </tr>

				          <tr>
					        <td>OverAll WorkOut Grade : </td>
				             <td>{this.props.data.sunday.exercise_reporting_ql.overall_workout_grade}</td>
				             <td>{this.props.data.monday.exercise_reporting_ql.overall_workout_grade}</td>
				             <td>{this.props.data.tuesday.exercise_reporting_ql.overall_workout_grade}</td>
				             <td>{this.props.data.wednesday.exercise_reporting_ql.overall_workout_grade}</td>
				             <td>{this.props.data.thursday.exercise_reporting_ql.overall_workout_grade}</td>
				             <td>{this.props.data.friday.exercise_reporting_ql.overall_workout_grade}</td>
				             <td>{this.props.data.saturday.exercise_reporting_ql.overall_workout_grade}</td>
				         </tr>
				         <tr>
					        <td>Heart Rate Variability Grade : </td>
				             <td>{this.props.data.sunday.exercise_reporting_ql.heartrate_variability_grade}</td>
				             <td>{this.props.data.monday.exercise_reporting_ql.heartrate_variability_grade}</td>
				             <td>{this.props.data.tuesday.exercise_reporting_ql.heartrate_variability_grade}</td>
				             <td>{this.props.data.wednesday.exercise_reporting_ql.heartrate_variability_grade}</td>
				             <td>{this.props.data.thursday.exercise_reporting_ql.heartrate_variability_grade}</td>
				             <td>{this.props.data.friday.exercise_reporting_ql.heartrate_variability_grade}</td>
				             <td>{this.props.data.saturday.exercise_reporting_ql.heartrate_variability_grade}</td>
				         </tr>
				         <tr>
					        <td>WorkOut Comment : </td>
				             <td>{this.props.data.sunday.exercise_reporting_ql.workout_comment}</td>
				             <td>{this.props.data.monday.exercise_reporting_ql.workout_comment}</td>
				             <td>{this.props.data.tuesday.exercise_reporting_ql.workout_comment}</td>
				             <td>{this.props.data.wednesday.exercise_reporting_ql.workout_comment}</td>
				             <td>{this.props.data.thursday.exercise_reporting_ql.workout_comment}</td>
				             <td>{this.props.data.friday.exercise_reporting_ql.workout_comment}</td>
				             <td>{this.props.data.saturday.exercise_reporting_ql.workout_comment}</td>
				         </tr>
				         </Table>
					</div>
					
		);
	}
}
export default Exercise;