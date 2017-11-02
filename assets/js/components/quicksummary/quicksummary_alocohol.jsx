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


const Alcohol=(props)=>{
	return(
                        <div className="quick3">
				         <Table className="table table-responsive quick4">
				         
				         <tr className="quick8">
				         <th >
						  Alcohol
						  </th>
						      {renderTableRows(props.data,"alcohol_ql","created_at")}
						      </tr>
					<tbody>
						 <tr>
					        <td>Alcohol Per Day</td>
					        {renderTableRows(props.data,"alcohol_ql","alcohol_day")}
				         </tr>
				         <tr className="quick9">
					        <td >Alcohol Per Week</td>
					         {renderTableRows(props.data,"alcohol_ql","alcohol_week")}
				         </tr>
				         </tbody>
				      </Table>
                         </div>
		);

}
export default Alcohol;
