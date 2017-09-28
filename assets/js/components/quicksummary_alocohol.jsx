import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Table,Button} from "reactstrap";

const Alcohol=(props)=>{
	return(
                        <div className="quick3">
				         <Table className="quick4">
				         
				         <tr>
				         <th className="quick8">
						  <h4>Alcohol</h4>
						  </th>
						      <th className="quick8"><h4>{props.data.sunday.created_at}</h4></th>
							  <th className="quick8"><h4>{props.data.monday.created_at}</h4></th>
							  <th className="quick8"><h4>{props.data.tuesday.created_at}</h4></th>
							  <th className="quick8"><h4>{props.data.wednesday.created_at}</h4></th>
							  <th className="quick8"><h4>{props.data.thursday.created_at}</h4></th>
							  <th className="quick8"><h4>{props.data.friday.created_at}</h4></th>
							  <th className="quick8"><h4>{props.data.saturday.created_at}</h4></th>
						  </tr>
						 
					<tbody>
						 <tr>
					        <td>Alcohol Per Day : </td>
				           <td> {props.data.sunday.alcohol_ql.alcohol_day}</td>
				           <td> {props.data.monday.alcohol_ql.alcohol_day}</td>
				           <td> {props.data.tuesday.alcohol_ql.alcohol_day}</td>
				           <td> {props.data.wednesday.alcohol_ql.alcohol_day}</td>
				           <td> {props.data.thursday.alcohol_ql.alcohol_day}</td>
				           <td> {props.data.friday.alcohol_ql.alcohol_day}</td>
				           <td> {props.data.saturday.alcohol_ql.alcohol_day}</td>
				         </tr>
				         <tr>
					        <td>Alcohol Per Week : </td>
					        <td>{props.data.sunday.alcohol_ql.alcohol_week}</td>
				            <td>{props.data.monday.alcohol_ql.alcohol_week}</td>
				            <td>{props.data.tuesday.alcohol_ql.alcohol_week}</td>        
				            <td>{props.data.wednesday.alcohol_ql.alcohol_week}</td>
				            <td>{props.data.thursday.alcohol_ql.alcohol_week}</td>
				            <td>{props.data.friday.alcohol_ql.alcohol_week}</td>
				            <td>{props.data.saturday.alcohol_ql.alcohol_week}</td>
				         </tr>
				         </tbody>
				      </Table>
                         </div>
		);

}
export default Alcohol;
