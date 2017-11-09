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

export class Steps extends Component{
	constructor(props){
	super(props);
	this.stepsScroll=this.stepsScroll.bind(this);

}
componentDidMount() {
	document.getElementById('tBodySteps').addEventListener('scroll', this.stepsScroll);
}


  stepsScroll(e) { 
        var tbody = document.getElementById("tBodySteps");
        document.getElementById("tHeadSteps").style.left = '-'+tbody.scrollLeft+'px';
        document.querySelector('#tHeadSteps th:nth-child(1)').style.left = tbody.scrollLeft+'px';
        var trLength = document.querySelector('#tBodySteps').children;
        for (var i = 0; i < trLength.length; i++) {
        	trLength[i].querySelector('#tBodySteps td:nth-child(1)').style.left = tbody.scrollLeft+'px';
        }

    };
	render(){
		
	return(
           
            			  <div className="quick3">
				         <table className="table table-responsive quick4">
				        <thead id="tHeadSteps">
				         <tr className="quick8">
				         <th >
						  Steps
						  </th>
						    {renderTableRows(this.props.data,"steps_ql","created_at")}							
						  </tr>
						  </thead>
						 
						 <tbody id="tBodySteps" onScroll={this.stepsScroll}>
						 <tr>
					        <td>Non Exercise Steps</td>
					         {renderTableRows(this.props.data,"steps_ql","non_exercise_steps")}					           
				         </tr>
				         <tr className="quick9">
					        <td >Exercise Steps</td>
					         {renderTableRows(this.props.data,"steps_ql","exercise_steps")}					           
				         </tr>
				         <tr>
					        <td>Total Steps</td>
					         {renderTableRows(this.props.data,"steps_ql","total_steps")}					           
				         </tr>
				         <tr className="quick9">
					        <td>Floor Climed</td>
					         {renderTableRows(this.props.data,"steps_ql","floor_climed")}					            
				         </tr>
				         <tr>
					        <td>Floor Decended</td>
					         {renderTableRows(this.props.data,"steps_ql","floor_decended")}					           
				         </tr>
				         
				         <tr className="quick9">
					        <td>Movement Consistency</td>
					         {renderTableRows(this.props.data,"steps_ql","movement_consistency")}					           
				         </tr>
				         </tbody>
                          </table>
                         </div>
		);
}

}
export default Steps;