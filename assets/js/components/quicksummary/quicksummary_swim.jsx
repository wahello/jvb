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

const Swim = (props) =>{
	return(
	 <div className="quick3">
	     <Table className="quick4">
	          <tr > 
	         	<th className="quick8"><h5>Swim Stats</h5></th>
			    {renderTableRows(props.data,"swim_stats_ql","created_at","quick8")}
			  </tr>

			  <tr>
		       	<td>Overall Truth Grade</td>
		        {renderTableRows(props.data,"swim_stats_ql","pace_per_100_yard")}
	          </tr>

	          <tr className="quick9">
		        <td>Total Strokes</td>
		        {renderTableRows(props.data,"swim_stats_ql","total_strokes")}
	          </tr>
         </Table>
      </div>

	);
}
export default Swim;