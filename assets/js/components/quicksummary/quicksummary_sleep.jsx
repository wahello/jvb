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


export class Sleep extends Component{
	constructor(props){
	super(props);
	this.sleepScroll=this.sleepScroll.bind(this);

}
componentDidMount() {
	document.getElementById('tBodySleep').addEventListener('scroll', this.sleepScroll);
}


  sleepScroll(e) { 
        var tbody = document.getElementById("tBodySleep");
        document.getElementById("tHeadSleep").style.left = '-'+tbody.scrollLeft+'px';
        document.querySelector('#tHeadSleep th:nth-child(1)').style.left = tbody.scrollLeft+'px';
        var trLength = document.querySelector('#tBodySleep').children;
        for (var i = 0; i < trLength.length; i++) {
        	trLength[i].querySelector('#tBodySleep td:nth-child(1)').style.left = tbody.scrollLeft+'px';
        }

    };
	render(){


	        return(
						  <div className="quick3">
                          <Table className="table table-responsive quick4">

                         <thead id="tHeadSleep">
				         <tr className="quick8">
				         <th >
						  Sleep
						  </th>
						   {renderTableRows(this.props.data,"sleep_ql","created_at")}
						</tr>
						</thead>
					<tbody id="tBodySleep" onScroll={this.sleepScroll}>
						 <tr>
					        <td>Sleep Per Wearable</td>
					        {renderTableRows(this.props.data,"sleep_ql","sleep_per_wearable")}				          
				         </tr>
				         <tr className="quick9">
					        <td>Sleep Per User Input</td>
					        {renderTableRows(this.props.data,"sleep_ql","sleep_per_wearable")}				          
				         </tr>
				         <tr>
					        <td>Sleep Aid</td>
					        {renderTableRows(this.props.data,"sleep_ql","sleep_aid")}				         
				         </tr>
				         <tr className="quick9">
					        <td>Sleep Bed Time</td>
					        {renderTableRows(this.props.data,"sleep_ql","sleep_bed_time")}				            
				         </tr>
				         <tr>
					        <td>Sleep Awake Time</td>
					        {renderTableRows(this.props.data,"sleep_ql","sleep_awake_time")}				            
				         </tr>
				         
				         <tr className="quick9">
					        <td>Deep Sleep</td>
					        {renderTableRows(this.props.data,"sleep_ql","deep_sleep")}
				           </tr>
				          <tr>
					        <td>Light Sleep</td>
					        {renderTableRows(this.props.data,"sleep_ql","light_sleep")}				            
				         </tr>
				          <tr className="quick9">
					        <td>Awake Time</td>
					        {renderTableRows(this.props.data,"sleep_ql","awake_time")}				           
				         </tr>
				         </tbody>
                          </Table>
                          </div>

		);

	 }
}
export default Sleep;