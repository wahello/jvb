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


export class Food extends Component{
	constructor(props){
	super(props);
	this.foodScroll=this.foodScroll.bind(this);

}
componentDidMount() {
	document.getElementById('tBodyFood').addEventListener('scroll', this.bikeStatScroll);
}


  foodScroll(e) { 
        var tbody = document.getElementById("tBodyFood");
        document.getElementById("tHeadFood").style.left = '-'+tbody.scrollLeft+'px';
        document.querySelector('#tHeadFood th:nth-child(1)').style.left = tbody.scrollLeft+'px';
        var trLength = document.querySelector('#tBodyFood').children;
        for (var i = 0; i < trLength.length; i++) {
        	trLength[i].querySelector('#tBodyFood td:nth-child(1)').style.left = tbody.scrollLeft+'px';
        }

    };

    render(){
	return(
 						 <div className="quick3">
				         <table className="table table-responsive quick4">
				      <thead id="tHeadFood">
				         <tr className="quick8">
				         <th >
						  Food
						  </th>
			           	  {renderTableRows(this.props.data,"food_ql","created_at")}
						  </tr>
						  </thead>
						 
						 <tbody id="tBodyFood" onScroll={this.foodScroll}>
						 <tr >
					        <td>percentage Non Processed Food</td>
					         {renderTableRows(this.props.data,"food_ql","prcnt_non_processed_food")}				            
				         </tr>
				         <tr className="quick9">
					        <td>Percentage Non Processed Food Grade</td>
					         {renderTableRows(this.props.data,"food_ql","prcnt_non_processed_food_grade")}				            
				         </tr>
				          <tr >
					        <td>Non Processed Food</td>
					         {renderTableRows(this.props.data,"food_ql","non_processed_food")}				            
				         </tr>
				         <tr className="quick9">
					        <td>Diet Type</td>
					         {renderTableRows(this.props.data,"food_ql","diet_type")}				           
				         </tr>
				         </tbody>
				         </table>
                          </div>

		);
}

}
export default Food;