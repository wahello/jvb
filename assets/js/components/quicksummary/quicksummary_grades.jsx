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
				<th key={date} className={classes}>{data[category][field]}</th>
			);
		}
	}
	return elements;
}


const Grades = (props) => {
		return(
			
			        <div className="quick3">
			        <Table className="table table-responsive quick4">
			       
			           <tr className="quick8">
			                <th >  
							 Grades
							</th>
							{renderTableRows(props.data,"grades_ql","created_at")}							
							</tr>
							<tbody>
							<tr>
					        <td>Overall Truth Grade</td>
					        {renderTableRows(props.data,"grades_ql","overall_truth_grade")}				             
				         </tr>
				         <tr className="quick9">
					        <td>Overall Truth Health Gpa</td>
					        {renderTableRows(props.data,"grades_ql","overall_truth_health_gpa")}				            
				         </tr>
				         <tr>
					        <td>Movement Non Exercise Grade</td>
					        {renderTableRows(props.data,"grades_ql","movement_non_exercise_grade")}				           
				         </tr>

				         <tr className="quick9">
					        <td>Avg Sleep Per Night Grade</td>
					        {renderTableRows(props.data,"grades_ql","avg_sleep_per_night_grade")}				           
				         </tr>
				         <tr>
					        <td>Exercise Consistency Grade</td>
					        {renderTableRows(props.data,"grades_ql","exercise_consistency_grade")}				           
				         </tr>
				         <tr className="quick9">
					        <td>Overall Workout Grade</td>
					        {renderTableRows(props.data,"grades_ql","overall_workout_grade")}				           
				         </tr>
				         <tr>
					        <td>percent NonProcessed Food Consumed Grade</td>
					        {renderTableRows(props.data,"grades_ql","prcnt_non_processed_food_consumed_grade")}		            
				         </tr>
				          <tr className="quick9">
					        <td>Alcoholic Drink Per Week Grade</td>
					        {renderTableRows(props.data,"grades_ql","alcoholic_drink_per_week_grade")}				           
				         </tr>
				         <tr>
					        <td>Penalty</td>
					        {renderTableRows(props.data,"grades_ql","penalty")}				           
				         </tr>
				         </tbody>
                          </Table>
                         </div>
                         

			);
}
export default Grades;