import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Table,Button} from "reactstrap";



function renderTableRows(dateWiseData,category,field,classes=""){
	let elements = [];
	for(let [date,data] of Object.entries(dateWiseData)){
		if(field === "created_at"){
			elements.push(
				<th key={date} className={classes}><h5>{date}</h5></th>
			);	
		}else{
			elements.push(
				<th key={date} className={classes}><h5>{data[category][field]}</h5></th>
			);
		}
	}
	return elements;
}


const User=(props)=>{
	return(

						<div className="quick3">
						<Table className="quick4">
						<tr className="quick8">
						<th >
						  <h5 >User Inputs</h5>
						</th>
						 	 {renderTableRows(props.data,"strong_input","created_at")}
						</tr>
						
						<tbody>
								<tr>
								<td>Did You Workout Today?</td>
								 {renderTableRows(props.data,"strong_input","workout")}
								</tr>

								<tr>
								<td>Was Your Workout Easy or Hard?</td>
								 {renderTableRows(props.data,"strong_input","workout_easy")}
								</tr>

								<tr>
								<td>Was Your Workout Today Enjoyable?</td>
								{renderTableRows(props.data,"optional_input","workout_enjoyable")}
								</tr>

								<tr>
								<td>Your Workout Effort Level? (with 1 being the easiest and 10 the hardest)</td>
								 {renderTableRows(props.data,"strong_input","workout_effort")}
								</tr>



								<tr>
								<td>Was Any Portion Of Your Workout Hard?</td>
								{renderTableRows(props.data,"strong_input","is_workout_hard")}
								</tr>

								<tr>
								<td>What Was Your Average Effort Level For The Hard Part Of Your Workout?</td>
								 {renderTableRows(props.data,"strong_input","workout_effort_hard_portion")}
								</tr>

								
								<tr>
								<td>Did You Have Any Pain or Twinges During or After Your Workout?</td>
								{renderTableRows(props.data,"encouraged_input","pain")}
								</tr>

								<tr>
								<td> Where Did You Have Pain/Twinges?</td>
								{renderTableRows(props.data,"encouraged_input","pain_area")}
								</tr>								

								<tr>
								<td>Water Consumed During Workout (Ounces)</td>
								{renderTableRows(props.data,"encouraged_input","water_consumed")}
								</tr>

								<tr>
								<td>Tablespoons of Chia Seeds Consumed During Workout?</td>
								{renderTableRows(props.data,"optional_input","chia_seeds")}
								</tr>

								<tr>
								<td> What % of Your Workout Did you breathe in and out through Your nose?</td>
								{renderTableRows(props.data,"encouraged_input","breath_nose")}
								</tr>

								<tr>
								<td>Were You Fasted During Your Workout?</td>
								{renderTableRows(props.data,"optional_input","fasted")}
								</tr>

								<tr>
								<td>What Food Did You Eat Before Your Workout?</td>
								{renderTableRows(props.data,"optional_input","food_ate_before_workout")}
								</tr>

								<tr>
								<td>General Workout Comments</td>
								{renderTableRows(props.data,"optional_input","workout_comment")}
								</tr>

								<tr>
								<td> Approximately How Many Calories Did You Consume During Your Workout?</td>
								{renderTableRows(props.data,"optional_input","calories")}
								</tr>

								<tr>
								<td>What Specifically Did You Consume During Your Workout?</td>
								{renderTableRows(props.data,"optional_input","calories_item")}
								</tr>

								<tr>
								<td>How Much Time Did You Sleep Last Night (Excluding Awake Time)?</td>
								{renderTableRows(props.data,"strong_input","sleep_hours_last_night")}
								</tr>

								<tr>
								<td>Sleep Comments</td>
								{renderTableRows(props.data,"strong_input","sleep_comment")}
								</tr>

								<tr>
								<td>Did You Take Any Prescription or Non Prescription Sleep Aids Last Night?</td>
								{renderTableRows(props.data,"strong_input","prescription_sleep_aids")}
								</tr>

								<tr>
								<td>What Did You Take?</td>
								{renderTableRows(props.data,"strong_input","sleep_aid_taken")}
								</tr>

								<tr>
								<td>What % of The Food You Consumed Yesterday Was Unprocessed?</td>
								{renderTableRows(props.data,"strong_input","prcnt_processed_food")}
								</tr>

								<tr>
								<td>What Unrocessed Food Were Consumed?</td>
								{renderTableRows(props.data,"strong_input","unprocessed_food_list")}
								</tr>

								<tr>
								<td>Processed Food List</td>
								{renderTableRows(props.data,"strong_input","processed_food_list")}
								</tr>
								

								<tr>
								<td>Number of Alcohol Drinks Consumed Yesterday?</td>
								{renderTableRows(props.data,"strong_input","alchol_consumed")}
								</tr>

								<tr>
								<td>What Did You Drink (Optional)?</td>
								{renderTableRows(props.data,"strong_input","alcohol_drink_consumed_list")}
								</tr>

								<tr>
								<td>Did You Smoke Any Substances Yesterday?</td>
								{renderTableRows(props.data,"strong_input","smoke_substances")}
								</tr>

								<tr>
								<td>What Did You Smoke Yesterday?</td>
								{renderTableRows(props.data,"strong_input","smoked_substance_list")}
								</tr>
								<tr>

								<td>How Many Cigarettes You Have Smoked?</td>
								{renderTableRows(props.data,"strong_input","smoked_substance_list")}
								</tr>

								<tr>
								<td>Other</td>
								{renderTableRows(props.data,"strong_input","smoked_substance_list")}
								</tr>


								<tr>
								<td>Did You Take Any Prescription or Non Prescription Medications or Supplements Yesterday?</td>
								{renderTableRows(props.data,"strong_input","medications")}
								</tr>

								<tr>
								<td>What Did You Take?</td>
								{renderTableRows(props.data,"strong_input","medications_taken_list")}
								</tr>

								<tr>
								<td>Yesterday's Stress Level</td>
								{renderTableRows(props.data,"encouraged_input","stress")}
								</tr>

								<tr>
								<td>Are You Sick Today?</td>
								{renderTableRows(props.data,"optional_input","sick")}
								</tr>

								<tr>
								<td>Please Tell Us Your Illness</td>
								{renderTableRows(props.data,"optional_input","sickness")}
								</tr>

								<tr>
								<td>Weight (Pounds)</td>
								{renderTableRows(props.data,"optional_input","weight")}
								</tr>

								<tr>
								<td>Waist Size (Male)</td>
								{renderTableRows(props.data,"optional_input","waist")}
								</tr>

								<tr>
								<td> What Type Of Diet Do You Eat?</td>
								{renderTableRows(props.data,"optional_input","diet_type")}
								</tr>

								<tr>
								<td>What Did You Take?</td>
								{renderTableRows(props.data,"optional_input","diet_type")}
								</tr>

								<tr>
								<td>Did You Stand For 3 Hours or More Yesterday?</td>
								{renderTableRows(props.data,"optional_input","stand")}
								</tr>

								<tr>
								<td>General Comments</td>
								{renderTableRows(props.data,"optional_input","general_comment")}
								</tr>								
						</tbody>
						</Table>
						</div>

		);
}
export default User;