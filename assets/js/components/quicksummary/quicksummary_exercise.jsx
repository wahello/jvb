import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Table,Button} from "reactstrap";


function renderTableRows(dateWiseData,category,field,classes=""){
	let elements = [];
	for(let [date,data] of Object.entries(dateWiseData)){
		if(field === "created_at"){
			elements.push(
				<th key={date} className={classes}>{date}</th>
			);	
		}else{
			elements.push(
				<td key={date} className={classes}>{data[category][field]}</td> 
			);
		}
	}
	return elements;
}

export class Exercise extends Component {

	constructor(props){
	super(props);
	this.ExerScroll=this.ExerScroll.bind(this);

}
componentDidMount() {
	document.getElementById('tBodyExer').addEventListener('scroll', this.ExerScroll);
}


  ExerScroll(e) { 
        var tbody = document.getElementById("tBodyExer");
        document.getElementById("tHeadExer").style.left = '-'+tbody.scrollLeft+'px';
        document.querySelector('#tHeadExer th:nth-child(1)').style.left = tbody.scrollLeft+'px';
        var trLength = document.querySelector('#tBodyExer').children;
        for (var i = 0; i < trLength.length; i++) {
        	trLength[i].querySelector('#tBodyExer td:nth-child(1)').style.left = tbody.scrollLeft+'px';
        }

    };

	render(){
	
	return(

						<div className="quick3">
						<table className="table table-responsive quick4">
						<thead id="tHeadExer">
						<tr className="quick8">
						<th >
						  Exercise Reporting
						</th>
							 {renderTableRows(this.props.data,"exercise_reporting_ql","created_at")}
						</tr>
						</thead>
						
						<tbody id="tBodyExer" onScroll={this.ExerScroll}>
						<tr>
					        <td>Workout Easy Hard</td>
					         {renderTableRows(this.props.data,"exercise_reporting_ql","workout_easy_hard")}
				         </tr>
				         <tr className="quick9">
					        <td >Workout Type</td>
					         {renderTableRows(this.props.data,"exercise_reporting_ql","workout_type")}
				         </tr>
				         <tr>
					        <td>Workout Time</td>
					         {renderTableRows(this.props.data,"exercise_reporting_ql","workout_time")}
				         </tr>
				         <tr className="quick9">
					        <td>Workout Location</td>
					         {renderTableRows(this.props.data,"exercise_reporting_ql","workout_location")}
				         </tr>
				         <tr>
					        <td>Workout Duration</td>
					         {renderTableRows(this.props.data,"exercise_reporting_ql","workout_duration")}
				         </tr>
				         <tr className="quick9">
					        <td>Maximum Elevation Workout</td>
					         {renderTableRows(this.props.data,"exercise_reporting_ql","maximum_elevation_workout")}
				         </tr>
				         <tr>
					        <td>Minutes Walked Before Workout</td>
					         {renderTableRows(this.props.data,"exercise_reporting_ql","minutes_walked_before_workout")}
				         </tr>
				         <tr className="quick9">
					        <td>Distance</td>
					         {renderTableRows(this.props.data,"exercise_reporting_ql","distance")}
				         </tr>
				         <tr>
					        <td>Pace</td>
					         {renderTableRows(this.props.data,"exercise_reporting_ql","pace")}
				         </tr>
				         <tr className="quick9">
					        <td>Average Heartrate</td>
					         {renderTableRows(this.props.data,"exercise_reporting_ql","avg_heartrate")}		
				         </tr>
				         <tr>
					        <td>Elevation Gain</td>
					         {renderTableRows(this.props.data,"exercise_reporting_ql","elevation_gain")}			
				         </tr>
				         <tr className="quick9">
					        <td>Elevation Loss </td>
					         {renderTableRows(this.props.data,"exercise_reporting_ql","elevation_loss")}				       
				         </tr>
				         <tr>
					        <td>Effort Level  </td>
					         {renderTableRows(this.props.data,"exercise_reporting_ql","effort_level")}				            
				         </tr>
				         <tr className="quick9">
					        <td>Dew Point </td>
					         {renderTableRows(this.props.data,"exercise_reporting_ql","dew_point")}				           
				         </tr>
				         <tr>
					        <td>Temperature</td>
					         {renderTableRows(this.props.data,"exercise_reporting_ql","temperature")}				          
				         </tr>
				         <tr className="quick9">
					        <td>Humidity</td>
					         {renderTableRows(this.props.data,"exercise_reporting_ql","humidity")}				         
				         </tr>
				         <tr>
					        <td>Temperature Feels Like </td>
					         {renderTableRows(this.props.data,"exercise_reporting_ql","temperature_feels_like")}			           
				         </tr>
				         <tr className="quick9">
					        <td>Wind</td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","wind")}		            
				         </tr>
				         <tr>
					        <td>HRR</td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","hrr")}				          
				         </tr>
				         <tr className="quick9">
					        <td>HRR Start Point</td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","hrr_start_point")}				           
				         </tr>

				         <tr>
					        <td>HRR Beats Lowered</td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","hrr_beats_lowered")}				           
				         </tr>
				         <tr className="quick9">
					        <td>Sleep Resting Hr Last Nigh</td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","sleep_resting_hr_last_night")}		            
				         </tr>
				         <tr>
					        <td>Vo2 Max</td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","vo2_max")}	            
				         </tr>
				         <tr className="quick9">
					        <td>Running Cadence</td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","running_cadence")}				           
				         </tr>
				         <tr>
					        <td>Percent Breath through Nose During Workout </td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","nose_breath_prcnt_workout")}		            
				         </tr>
				         <tr className="quick9">
					        <td>Water Consumed during Workout </td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","water_consumed_workout")}		            
				         </tr>
				         <tr>
					        <td>Chia Seeds consumed during Workout</td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","chia_seeds_consumed_workout")}		           
				         </tr>
				         <tr className="quick9">
					        <td>Fast Before Workout</td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","fast_before_workout")}	            
				         </tr>
				         <tr>
					        <td>Pain </td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","pain")}			        
				         </tr>
				         <tr className="quick9">
					        <td>Pain Area  </td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","pain_area")}				            
				         </tr>
				         <tr>
					        <td>Stress Level </td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","stress_level")}				           
				         </tr>
				         <tr className="quick9">
					        <td>Sick </td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","sick")}				            
				         </tr>
				         <tr>
					        <td>Drug Consumed </td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","drug_consumed")}				           
				         </tr>
				         <tr className="quick9">
					        <td>Drug </td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","drug")}				           
				         </tr>
				         <tr>
					        <td>Medication </td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","medication")}				           
				         </tr>
				         <tr className="quick9">
					        <td>Smoke Substance </td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","smoke_substance")}				           
				         </tr>
				         <tr>
					        <td>Exercise Fifteen More </td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","exercise_fifteen_more")}			            
				         </tr>
				         <tr className="quick9">
					        <td>Workout Elapsed Time </td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","workout_elapsed_time")}			            
				         </tr>
				         <tr>
					        <td>TimeWatch Paused Workout </td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","timewatch_paused_workout")}			            
				         </tr>
				         <tr className="quick9">
					        <td>Exercise Consistency </td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","exercise_consistency")}		           
				         </tr>
				         <tr>
					        <td>Workout Duration Grade </td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","workout_duration_grade")}			             
				         </tr>
				         <tr className="quick9">
					        <td>Workout Effort Level Grade</td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","workout_effortlvl_grade")}				            
				         </tr>
				         <tr>
					        <td>Avg Heart Rate Grade</td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","avg_heartrate_grade")}		             
				         </tr>
				          <tr className="quick9">
					        <td>OverAll Workout Grade</td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","overall_workout_grade")}			             
				         </tr>
				         <tr>
					        <td>Heart Rate Variability Grade </td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","heartrate_variability_grade")}	             
				         </tr>
				         <tr className="quick9">
					        <td>Workout Comment </td>
					        {renderTableRows(this.props.data,"exercise_reporting_ql","workout_comment")}				            
				         </tr>
				         </tbody>
				         </table>
					</div>
					
		);
	}
}
export default Exercise;