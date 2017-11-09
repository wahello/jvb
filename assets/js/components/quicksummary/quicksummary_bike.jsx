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

export class Bike extends Component {


	constructor(props){
	super(props);
	this.bikeStatScroll=this.bikeStatScroll.bind(this);

}
componentDidMount() {
	document.getElementById('tBodyBike').addEventListener('scroll', this.bikeStatScroll);
}


  bikeStatScroll(e) { 
        var tbody = document.getElementById("tBodyBike");
        document.getElementById("tHeadBike").style.left = '-'+tbody.scrollLeft+'px';
        document.querySelector('#tHeadBike th:nth-child(1)').style.left = tbody.scrollLeft+'px';
        var trLength = document.querySelector('#tBodyBike').children;
        for (var i = 0; i < trLength.length; i++) {
        	trLength[i].querySelector('#tBodyBike td:nth-child(1)').style.left = tbody.scrollLeft+'px';
        }

    };
	render(){


	return(
                          <div className="quick3">
                          <table className="table table-responsive quick4">
                          <thead id="tHeadBike"> 
				        <tr className="quick8">
				         <th >
						  Bike Stats
						  </th>
						    {renderTableRows(this.props.data,"bike_stats_ql","created_at")}
						    </tr>
						</thead>
					<tbody id="tBodyBike" onScroll={this.bikeStatScroll}>
						 <tr>
					        <td>Avg Speed</td>
				            {renderTableRows(this.props.data,"bike_stats_ql","avg_speed")}
				         </tr>

				         <tr className="quick9">
					        <td >Avg Power</td>
				           {renderTableRows(this.props.data,"bike_stats_ql","avg_power")}
				         </tr>
				         <tr>
					        <td>Asvg Speed Per Mile</td>
				            {renderTableRows(this.props.data,"bike_stats_ql","avg_speed_per_mile")}
				         </tr>
				         <tr className="quick9">
					        <td >Avg Cadence</td>
					        {renderTableRows(this.props.data,"bike_stats_ql","avg_cadence")}
				         </tr>
				         </tbody>
				         </table>
                         </div>

		);
}
}
export default Bike;