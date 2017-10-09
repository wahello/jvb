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


const Sleep = (props) =>{

	        return(
						  <div className="quick3">
                          <Table className="table table-responsive quick4">
                         
				         <tr className="quick8">
				         <th >
						  <h5>Sleep</h5>
						  </th>
						   {renderTableRows(props.data,"sleep_ql","created_at")}
						</tr>
					
						 <tr>
					        <td>Sleep Per Wearable</td>
					        {renderTableRows(props.data,"sleep_ql","sleep_per_wearable")}				          
				         </tr>
				         <tr className="quick9">
					        <td>Sleep Per User Input</td>
					        {renderTableRows(props.data,"sleep_ql","sleep_per_wearable")}				          
				         </tr>
				         <tr>
					        <td>Sleep Aid</td>
					        {renderTableRows(props.data,"sleep_ql","sleep_aid")}				         
				         </tr>
				         <tr className="quick9">
					        <td>Sleep Bed Time</td>
					        {renderTableRows(props.data,"sleep_ql","sleep_bed_time")}				            
				         </tr>
				         <tr>
					        <td>Sleep Awake Time</td>
					        {renderTableRows(props.data,"sleep_ql","sleep_awake_time")}				            
				         </tr>
				         
				         <tr className="quick9">
					        <td>Deep Sleep</td>
					        {renderTableRows(props.data,"sleep_ql","deep_sleep")}
				           </tr>
				          <tr>
					        <td>Light Sleep</td>
					        {renderTableRows(props.data,"sleep_ql","light_sleep")}				            
				         </tr>
				          <tr className="quick9">
					        <td>Awake Time</td>
					        {renderTableRows(props.data,"sleep_ql","awake_time")}				           
				         </tr>
                          </Table>
                          </div>

		);
}
export default Sleep;