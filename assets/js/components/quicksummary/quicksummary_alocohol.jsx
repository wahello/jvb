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


export class Alcohol extends Component{

				constructor(props){
	super(props);
	this.alchoholScroll=this.alchoholScroll.bind(this);

}
componentDidMount() {
	document.getElementById('tBodyAlchohol').addEventListener('scroll', this.alchoholScroll);
}


  alchoholScroll(e) { 
        var tbody = document.getElementById("tBodyAlchohol");
        document.getElementById("tHeadAlchohol").style.left = '-'+tbody.scrollLeft+'px';
        document.querySelector('#tHeadAlchohol th:nth-child(1)').style.left = tbody.scrollLeft+'px';
        var trLength = document.querySelector('#tBodyAlchohol').children;
        for (var i = 0; i < trLength.length; i++) {
        	trLength[i].querySelector('#tBodyAlchohol td:nth-child(1)').style.left = tbody.scrollLeft+'px';
        }

    };
			render(){


			return(
                       
					<div className="quick3">
			        <table className="table table-responsive quick4" >
			       	<thead id="tHeadAlchohol">
			      			<tr className="quick8" >
			                <th>  
							 Alcohol
							</th>
						    {renderTableRows(this.props.data,"alcohol_ql","created_at")}			
						</tr>
						</thead>

						   <tbody id="tBodyAlchohol" onScroll={this.alchoholScroll}>
							 <tr>
						        <td>Alcohol Per Day</td>
						        {renderTableRows(this.props.data,"alcohol_ql","alcohol_day")}
					         </tr>
					         <tr className="quick9">
						        <td >Alcohol Per Week</td>
						         {renderTableRows(this.props.data,"alcohol_ql","alcohol_week")}
					         </tr>
					         </tbody>
				      </table>
                         </div>
				  );
			}
}
export default Alcohol;
