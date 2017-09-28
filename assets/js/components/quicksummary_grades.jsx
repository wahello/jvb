import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Table,Button} from "reactstrap";


// <Grade data = self.state.data['sunday'].grades_ql>
const Grades = (props) => {
		return(
			
			        <div className="quick3">
			        <Table className="quick4">
			       
			           <tr>
			                <th className="quick8">  
							 <h5> Grades</h5>
							</th>
							<th className="quick8"><h5>{props.data.sunday.created_at}</h5></th>
							<th className="quick8"><h5>{props.data.monday.created_at}</h5></th>
							<th className="quick8"><h5>{props.data.tuesday.created_at}</h5></th>
							<th className="quick8"><h5>{props.data.wednesday.created_at}</h5></th>
							<th className="quick8"><h5>{props.data.thursday.created_at}</h5></th>
							<th className="quick8"><h5>{props.data.friday.created_at}</h5></th>
							<th className="quick8"><h5>{props.data.saturday.created_at}</h5></th>
							</tr>
							<tbody>
							<tr>
					        <td>Overall Truth Grade</td>
				             <td>{props.data.sunday.grades_ql.overall_truth_grade}</td>
				             <td>{props.data.monday.grades_ql.overall_truth_grade}</td>
				             <td>{props.data.tuesday.grades_ql.overall_truth_grade}</td>
				             <td>{props.data.wednesday.grades_ql.overall_truth_grade}</td>
				             <td>{props.data.thursday.grades_ql.overall_truth_grade}</td>
				             <td>{props.data.friday.grades_ql.overall_truth_grade}</td>
				             <td>{props.data.saturday.grades_ql.overall_truth_grade}</td>
				         </tr>
				         <tr className="quick9">
					        <td>Overall Truth Health Gpa</td>
				            <td>{props.data.sunday.grades_ql.overall_truth_health_gpa}</td>
				             <td>{props.data.monday.grades_ql.overall_truth_health_gpa}</td>
				             <td>{props.data.tuesday.grades_ql.overall_truth_health_gpa}</td>
				             <td>{props.data.wednesday.grades_ql.overall_truth_health_gpa}</td>
				             <td>{props.data.thursday.grades_ql.overall_truth_health_gpa}</td>
				             <td>{props.data.friday.grades_ql.overall_truth_health_gpa}</td>
				             <td>{props.data.saturday.grades_ql.overall_truth_health_gpa}</td>
				         </tr>
				         <tr>
					        <td>Movement Non Exercise Grade</td>
				            <td>{props.data.sunday.grades_ql.movement_non_exercise_grade}</td>
				            <td>{props.data.monday.grades_ql.movement_non_exercise_grade}</td>
				            <td>{props.data.tuesday.grades_ql.movement_non_exercise_grade}</td>
				            <td>{props.data.wednesday.grades_ql.movement_non_exercise_grade}</td>
				            <td>{props.data.thursday.grades_ql.movement_non_exercise_grade}</td>
				            <td>{props.data.friday.grades_ql.movement_non_exercise_grade}</td>
				            <td>{props.data.saturday.grades_ql.movement_non_exercise_grade}</td>
				         </tr>

				         <tr className="quick9">
					        <td>Avg Sleep Per Night Grade</td>
				           <td>{props.data.sunday.grades_ql.avg_sleep_per_night_grade}</td>
				           <td>{props.data.monday.grades_ql.avg_sleep_per_night_grade}</td>
				           <td>{props.data.tuesday.grades_ql.avg_sleep_per_night_grade}</td>
				           <td>{props.data.wednesday.grades_ql.avg_sleep_per_night_grade}</td>
				           <td>{props.data.thursday.grades_ql.avg_sleep_per_night_grade}</td>
				           <td>{props.data.friday.grades_ql.avg_sleep_per_night_grade}</td>
				           <td>{props.data.saturday.grades_ql.avg_sleep_per_night_grade}</td>
				         </tr>
				         <tr>
					        <td>Exercise Consistency Grade</td>
				            <td>{props.data.sunday.grades_ql.exercise_consistency_grade}</td>
				            <td>{props.data.monday.grades_ql.exercise_consistency_grade}</td>
				            <td>{props.data.tuesday.grades_ql.exercise_consistency_grade}</td>
				            <td>{props.data.wednesday.grades_ql.exercise_consistency_grade}</td>
				            <td>{props.data.thursday.grades_ql.exercise_consistency_grade}</td>
				            <td>{props.data.friday.grades_ql.exercise_consistency_grade}</td>
				            <td>{props.data.saturday.grades_ql.exercise_consistency_grade}</td>
				         </tr>
				         <tr className="quick9">
					        <td>Overall Workout Grade</td>
				           <td> {props.data.sunday.grades_ql.overall_workout_grade}</td>
				           <td> {props.data.monday.grades_ql.overall_workout_grade}</td>
				           <td> {props.data.tuesday.grades_ql.overall_workout_grade}</td>
				           <td> {props.data.wednesday.grades_ql.overall_workout_grade}</td>
				           <td> {props.data.thursday.grades_ql.overall_workout_grade}</td>
				           <td> {props.data.friday.grades_ql.overall_workout_grade}</td>
				           <td> {props.data.saturday.grades_ql.overall_workout_grade}</td>
				         </tr>
				         <tr>
					        <td>percent NonProcessed Food Consumed Grade</td>
				            <td>{props.data.sunday.grades_ql.prcnt_non_processed_food_consumed_grade}</td>
				            <td>{props.data.monday.grades_ql.prcnt_non_processed_food_consumed_grade}</td>
				            <td>{props.data.tuesday.grades_ql.prcnt_non_processed_food_consumed_grade}</td>
				            <td>{props.data.wednesday.grades_ql.prcnt_non_processed_food_consumed_grade}</td>
				            <td>{props.data.thursday.grades_ql.prcnt_non_processed_food_consumed_grade}</td>
				            <td>{props.data.friday.grades_ql.prcnt_non_processed_food_consumed_grade}</td>
				            <td>{props.data.saturday.grades_ql.prcnt_non_processed_food_consumed_grade}</td>
				         </tr>
				          <tr className="quick9">
					        <td>Alcoholic Drink Per Week Grade</td>
				            <td>{props.data.sunday.grades_ql.alcoholic_drink_per_week_grade}</td>
				            <td>{props.data.monday.grades_ql.alcoholic_drink_per_week_grade}</td>
				            <td>{props.data.tuesday.grades_ql.alcoholic_drink_per_week_grade}</td>
				            <td>{props.data.wednesday.grades_ql.alcoholic_drink_per_week_grade}</td>
				            <td>{props.data.thursday.grades_ql.alcoholic_drink_per_week_grade}</td>
				            <td>{props.data.friday.grades_ql.alcoholic_drink_per_week_grade}</td>
				            <td>{props.data.saturday.grades_ql.alcoholic_drink_per_week_grade}</td>
				         </tr>
				         <tr>
					        <td>Penalty</td>
				            <td>{props.data.sunday.grades_ql.penalty}</td>
				            <td>{props.data.monday.grades_ql.penalty}</td>
				            <td>{props.data.tuesday.grades_ql.penalty}</td>
				            <td>{props.data.wednesday.grades_ql.penalty}</td>
				            <td>{props.data.thursday.grades_ql.penalty}</td>
				            <td>{props.data.friday.grades_ql.penalty}</td>
				            <td>{props.data.saturday.grades_ql.penalty}</td>
				         </tr>
				         </tbody>
                          </Table>
                         </div>
                         

			);
}
export default Grades;