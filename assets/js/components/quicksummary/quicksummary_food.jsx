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


const Food =(props)=>{
	return(
 						 <div className="quick3">
				         <Table className="table table-responsive quick4">
				      
				         <tr className="quick8">
				         <th >
						  Food
						  </th>
			           	  {renderTableRows(props.data,"food_ql","created_at")}
						  </tr>
						 
						 <tr >
					        <td>percentage Non Processed Food</td>
					         {renderTableRows(props.data,"food_ql","prcnt_non_processed_food")}				            
				         </tr>
				         <tr className="quick9">
					        <td>Percentage Non Processed Food Grade</td>
					         {renderTableRows(props.data,"food_ql","prcnt_non_processed_food_grade")}				            
				         </tr>
				          <tr >
					        <td>Non Processed Food</td>
					         {renderTableRows(props.data,"food_ql","non_processed_food")}				            
				         </tr>
				         <tr className="quick9">
					        <td>Diet Type</td>
					         {renderTableRows(props.data,"food_ql","diet_type")}				           
				         </tr>
				         </Table>
                          </div>

		);
}
export default Food;