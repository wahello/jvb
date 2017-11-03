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
				<td key={date} className={classes}>{data[category][field]}</td>
			);
		}
	}
	return elements;
}

const Bike = (props) => {
	return(
                          <div className="quick3">
                          <Table className="table table-responsive quick4">
                           
				        <tr className="quick8">
				         <th >
						  Bike Stats
						  </th>
						    {renderTableRows(props.data,"bike_stats_ql","created_at")}
						    </tr>
						
					
						 <tr>
					        <td>Avg Speed</td>
				            {renderTableRows(props.data,"bike_stats_ql","avg_speed")}
				         </tr>

				         <tr className="quick9">
					        <td >Avg Power</td>
				           {renderTableRows(props.data,"bike_stats_ql","avg_power")}
				         </tr>
				         <tr>
					        <td>Asvg Speed Per Mile</td>
				            {renderTableRows(props.data,"bike_stats_ql","avg_speed_per_mile")}
				         </tr>
				         <tr className="quick9">
					        <td >Avg Cadence</td>
					        {renderTableRows(props.data,"bike_stats_ql","avg_cadence")}
				         </tr>
				         </Table>
                         </div>

		);
}
export default Bike;