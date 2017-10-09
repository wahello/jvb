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

const Steps = (props) =>{
	return(
           
            			  <div className="quick3">
				         <Table className="table table-responsive quick4">
				       
				         <tr className="quick8">
				         <th >
						  <h5>Steps</h5>
						  </th>
						    {renderTableRows(props.data,"steps_ql","created_at")}							
						  </tr>
						 
						 <tr>
					        <td>Non Exercise Steps</td>
					         {renderTableRows(props.data,"steps_ql","non_exercise_steps")}					           
				         </tr>
				         <tr className="quick9">
					        <td >Exercise Steps</td>
					         {renderTableRows(props.data,"steps_ql","exercise_steps")}					           
				         </tr>
				         <tr>
					        <td>Total Steps</td>
					         {renderTableRows(props.data,"steps_ql","total_steps")}					           
				         </tr>
				         <tr className="quick9">
					        <td>Floor Climed</td>
					         {renderTableRows(props.data,"steps_ql","floor_climed")}					            
				         </tr>
				         <tr>
					        <td>Floor Decended</td>
					         {renderTableRows(props.data,"steps_ql","floor_decended")}					           
				         </tr>
				         
				         <tr className="quick9">
					        <td>Movement Consistency</td>
					         {renderTableRows(props.data,"steps_ql","movement_consistency")}					           
				         </tr>
                          </Table>
                         </div>
		);

}
export default Steps;