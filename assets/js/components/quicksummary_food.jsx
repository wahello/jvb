import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Table,Button} from "reactstrap";

const Food =(props)=>{
	return(
 						 <div className="quick3">
				         <Table className="quick4">
				      
				         <tr>
				         <th>
						  <h4>Food</h4>
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
					        <td>percentage Non Processed Food : </td>
				            <td>{props.data.sunday.food_ql.prcnt_non_processed_food}</td>
				            <td>{props.data.monday.food_ql.prcnt_non_processed_food}</td>
				            <td>{props.data.tuesday.food_ql.prcnt_non_processed_food}</td>
				            <td>{props.data.wednesday.food_ql.prcnt_non_processed_food}</td>
				            <td>{props.data.thursday.food_ql.prcnt_non_processed_food}</td>
				            <td>{props.data.friday.food_ql.prcnt_non_processed_food}</td>
				            <td>{props.data.saturday.food_ql.prcnt_non_processed_food}</td>
				         </tr>
				         <tr>
					        <td>Percentage Non Processed Food Grade : </td>
				            <td>{props.data.sunday.food_ql.prcnt_non_processed_food_grade}</td>
				            <td>{props.data.monday.food_ql.prcnt_non_processed_food_grade}</td>
				            <td>{props.data.tuesday.food_ql.prcnt_non_processed_food_grade}</td>
				            <td>{props.data.wednesday.food_ql.prcnt_non_processed_food_grade}</td>
				            <td>{props.data.thursday.food_ql.prcnt_non_processed_food_grade}</td>
				            <td>{props.data.friday.food_ql.prcnt_non_processed_food_grade}</td>
				            <td>{props.data.saturday.food_ql.prcnt_non_processed_food_grade}</td>
				         </tr>
				          <tr>
					        <td>Non Processed Food : </td>
				            <td>{props.data.sunday.food_ql.non_processed_food}</td>
				            <td>{props.data.monday.food_ql.non_processed_food}</td>
				            <td>{props.data.tuesday.food_ql.non_processed_food}</td>
				            <td>{props.data.wednesday.food_ql.non_processed_food}</td>
				            <td>{props.data.thursday.food_ql.non_processed_food}</td>
				            <td>{props.data.friday.food_ql.non_processed_food}</td>
				            <td>{props.data.saturday.food_ql.non_processed_food}</td>
				         </tr>
				         <tr>
					        <td>Diet Type : </td>
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