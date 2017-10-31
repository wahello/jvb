import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Table,Button} from "reactstrap";

const User=(props)=>{
	return(

						<div className="quick3">
						<Table className="quick4">
						<tr className="quick8">
						<th >
						  <h5 >User Inputs</h5>
						</th>
						 	<th ><h5>17-09-2017</h5></th>
							 <th ><h5>18-09-2017</h5></th>
							 <th ><h5>19-09-2017</h5></th>
							 <th ><h5>20-09-2017</h5></th>
							 <th ><h5>21-09-2017</h5></th>
							 <th ><h5>22-09-2017</h5></th>
							 <th ><h5>23-09-2017</h5></th>
							 </tr>
						
						<tbody>
								<tr>
								<td>Did You Workout Today?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>Was Your Workout Easy or Hard?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>Was Your Workout Today Enjoyable?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>Your Workout Effort Level? (with 1 being the easiest and 10 the hardest)</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>Was Any Portion Of Your Workout Hard?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>What Was Your Average Effort Level For The Hard Part Of Your Workout?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>Did You Have Any Pain or Twinges During or After Your Workout?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td> Where Did You Have Pain/Twinges?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>Please Write Where You Have Pain/Twinges</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>Water Consumed During Workout (Ounces)</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>Tablespoons of Chia Seeds Consumed During Workout?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td> What % of Your Workout Did you breathe in and out through Your nose?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>Were You Fasted During Your Workout?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>What Food Did You Eat Before Your Workout?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>General Workout Comments</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td> Approximately How Many Calories Did You Consume During Your Workout?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>What Specifically Did You Consume During Your Workout?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>How Much Time Did You Sleep Last Night (Excluding Awake Time)?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>Sleep Comments</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>Did You Take Any Prescription or Non Prescription Sleep Aids Last Night?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>What Did You Take?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>What % of The Food You Consumed Yesterday Was Unprocessed?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>What Unrocessed Food Were Consumed?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>Processed Food List</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>Unprocessed Food List</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>Number of Alcohol Drinks Consumed Yesterday?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>What Did You Drink (Optional)?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>Did You Smoke Any Substances Yesterday?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>What Did You Smoke Yesterday?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>
								<tr>

								<td>How Many Cigarettes You Have Smoked?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>Other</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>


								<tr>
								<td>Did You Take Any Prescription or Non Prescription Medications or Supplements Yesterday?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>What Did You Take?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>Yesterday's Stress Level</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>Are You Sick Today?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>Please Tell Us Your Illness</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>Weight (Pounds)</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>Waist Size (Male)</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td> What Type Of Diet Do You Eat?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>What Did You Take?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>Did You Stand For 3 Hours or More Yesterday?</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>

								<tr>
								<td>General Comments</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>								
						</tbody>
						</Table>
						</div>

		);
}
export default User;