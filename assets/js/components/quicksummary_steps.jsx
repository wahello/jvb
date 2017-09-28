import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Table,Button} from "reactstrap";

const Steps = (props) =>{
	return(
           
            			  <div className="quick3">
				         <Table className="quick4">
				       
				         <tr>
				         <th className="quick8">
						  <h4>Steps</h4>
						  </th>
						    <th className="quick8"><h4>{props.data.sunday.created_at}</h4></th>
							<th className="quick8"><h4>{props.data.monday.created_at}</h4></th>
							<th className="quick8"><h4>{props.data.tuesday.created_at}</h4></th>
							<th className="quick8"><h4>{props.data.wednesday.created_at}</h4></th>
							<th className="quick8"><h4>{props.data.thursday.created_at}</h4></th>
							<th className="quick8"><h4>{props.data.friday.created_at}</h4></th>
							<th className="quick8"><h4>{props.data.saturday.created_at}</h4></th>
						  </tr>
						 
						 <tr>
					        <td>Non Exercise Steps : </td>
				            <td>{props.data.sunday.steps_ql.non_exercise_steps}</td>
				            <td>{props.data.monday.steps_ql.non_exercise_steps}</td>
				            <td>{props.data.tuesday.steps_ql.non_exercise_steps}</td>
				            <td>{props.data.wednesday.steps_ql.non_exercise_steps}</td>
				            <td>{props.data.thursday.steps_ql.non_exercise_steps}</td>
				            <td>{props.data.friday.steps_ql.non_exercise_steps}</td>
				            <td>{props.data.saturday.steps_ql.non_exercise_steps}</td>
				         </tr>
				         <tr>
					        <td>Exercise Steps : </td>
				            <td>{props.data.sunday.steps_ql.exercise_steps}</td>
				            <td>{props.data.monday.steps_ql.exercise_steps}</td>
				            <td>{props.data.tuesday.steps_ql.exercise_steps}</td>
				            <td>{props.data.wednesday.steps_ql.exercise_steps}</td>
				            <td>{props.data.thursday.steps_ql.exercise_steps}</td>
				            <td>{props.data.friday.steps_ql.exercise_steps}</td>
				            <td>{props.data.saturday.steps_ql.exercise_steps}</td>
				         </tr>
				         <tr>
					        <td>Total Steps :</td>
				            <td>{props.data.sunday.steps_ql.total_steps}</td>
				            <td>{props.data.monday.steps_ql.total_steps}</td>
				            <td>{props.data.tuesday.steps_ql.total_steps}</td>
				            <td>{props.data.wednesday.steps_ql.total_steps}</td>
				            <td>{props.data.thursday.steps_ql.total_steps}</td>
				            <td>{props.data.friday.steps_ql.total_steps}</td>
				            <td>{props.data.saturday.steps_ql.total_steps}</td>
				         </tr>
				         <tr>
					        <td>Floor Climed : </td>
				            <td>{props.data.sunday.steps_ql.floor_climed}</td>
				            <td>{props.data.monday.steps_ql.floor_climed}</td>
				            <td>{props.data.tuesday.steps_ql.floor_climed}</td>
				            <td>{props.data.wednesday.steps_ql.floor_climed}</td>
				            <td>{props.data.thursday.steps_ql.floor_climed}</td>
				            <td>{props.data.friday.steps_ql.floor_climed}</td>
				            <td>{props.data.saturday.steps_ql.floor_climed}</td>
				         </tr>
				         <tr>
					        <td>Floor Decended : </td>
				            <td>{props.data.sunday.steps_ql.floor_decended}</td>
				            <td>{props.data.monday.steps_ql.floor_decended}</td>
				            <td>{props.data.tuesday.steps_ql.floor_decended}</td>
				            <td>{props.data.wednesday.steps_ql.floor_decended}</td>
				            <td>{props.data.thursday.steps_ql.floor_decended}</td>
				            <td>{props.data.friday.steps_ql.floor_decended}</td>
				            <td>{props.data.saturday.steps_ql.floor_decended}</td>
				         </tr>
				         
				         <tr>
					        <td>Movement Consistency : </td>
				            <td>{props.data.sunday.steps_ql.movement_consistency}</td>
				            <td>{props.data.monday.steps_ql.movement_consistency}</td>
				            <td>{props.data.tuesday.steps_ql.movement_consistency}</td>
				            <td>{props.data.wednesday.steps_ql.movement_consistency}</td>
				            <td>{props.data.thursday.steps_ql.movement_consistency}</td>
				            <td>{props.data.friday.steps_ql.movement_consistency}</td>
				            <td>{props.data.saturday.steps_ql.movement_consistency}</td>
				         </tr>
                          </Table>
                         </div>
		);

}
export default Steps;