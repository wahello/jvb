import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Table,Button} from "reactstrap";

const Food =(props)=>{
	return(
 						 <div className="quick3">
				         <Table className="quick4">
				      
				         <tr >
				         <th className="quick8">
						  <h5>Food</h5>
						  </th>
						  <th className="quick8"><h5>{props.data.sunday.created_at}</h5></th>
						  <th className="quick8"><h5>{props.data.monday.created_at}</h5></th>
						  <th className="quick8"><h5>{props.data.tuesday.created_at}</h5></th>
						  <th className="quick8"><h5>{props.data.wednesday.created_at}</h5></th>
						  <th className="quick8"><h5>{props.data.thursday.created_at}</h5></th>
						  <th className="quick8"><h5>{props.data.friday.created_at}</h5></th>
						  <th className="quick8"><h5>{props.data.saturday.created_at}</h5></th>
						  </tr>
						 
						 <tr >
					        <td>percentage Non Processed Food</td>
				            <td>{props.data.sunday.food_ql.prcnt_non_processed_food}</td>
				            <td>{props.data.monday.food_ql.prcnt_non_processed_food}</td>
				            <td>{props.data.tuesday.food_ql.prcnt_non_processed_food}</td>
				            <td>{props.data.wednesday.food_ql.prcnt_non_processed_food}</td>
				            <td>{props.data.thursday.food_ql.prcnt_non_processed_food}</td>
				            <td>{props.data.friday.food_ql.prcnt_non_processed_food}</td>
				            <td>{props.data.saturday.food_ql.prcnt_non_processed_food}</td>
				         </tr>
				         <tr className="quick9">
					        <td>Percentage Non Processed Food Grade</td>
				            <td>{props.data.sunday.food_ql.prcnt_non_processed_food_grade}</td>
				            <td>{props.data.monday.food_ql.prcnt_non_processed_food_grade}</td>
				            <td>{props.data.tuesday.food_ql.prcnt_non_processed_food_grade}</td>
				            <td>{props.data.wednesday.food_ql.prcnt_non_processed_food_grade}</td>
				            <td>{props.data.thursday.food_ql.prcnt_non_processed_food_grade}</td>
				            <td>{props.data.friday.food_ql.prcnt_non_processed_food_grade}</td>
				            <td>{props.data.saturday.food_ql.prcnt_non_processed_food_grade}</td>
				         </tr>
				          <tr >
					        <td>Non Processed Food</td>
				            <td>{props.data.sunday.food_ql.non_processed_food}</td>
				            <td>{props.data.monday.food_ql.non_processed_food}</td>
				            <td>{props.data.tuesday.food_ql.non_processed_food}</td>
				            <td>{props.data.wednesday.food_ql.non_processed_food}</td>
				            <td>{props.data.thursday.food_ql.non_processed_food}</td>
				            <td>{props.data.friday.food_ql.non_processed_food}</td>
				            <td>{props.data.saturday.food_ql.non_processed_food}</td>
				         </tr>
				         <tr className="quick9">
					        <td>Diet Type</td>
				            <td>{props.data.sunday.food_ql.diet_type}</td>
				            <td>{props.data.monday.food_ql.diet_type}</td>
				            <td>{props.data.tuesday.food_ql.diet_type}</td>
				            <td>{props.data.wednesday.food_ql.diet_type}</td>
				            <td>{props.data.thursday.food_ql.diet_type}</td>
				            <td>{props.data.friday.food_ql.diet_type}</td>
				            <td>{props.data.saturday.food_ql.diet_type}</td>
				         </tr>
				         </Table>
                          </div>

		);
}
export default Food;