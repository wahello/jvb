import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Button} from "reactstrap";


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



export class Grades extends Component{
constructor(props){
	super(props);
	this.myFunction=this.myFunction.bind(this);

}
componentDidMount() {
	document.getElementById('tBodyGrades').addEventListener('scroll', this.myFunction);
}


  myFunction(e) { 
  console.log('Scroll event detected!');//detect a scroll event on the tbody
        var tbody = document.getElementById("tBodyGrades");
        document.getElementById("tHeadGrades").style.left = '-'+tbody.scrollLeft+'px';
        document.querySelector('#tHeadGrades th:nth-child(1)').style.left = tbody.scrollLeft+'px';
        var trLength = document.querySelector('#tBodyGrades').children;
        for (var i = 0; i < trLength.length; i++) {
        	trLength[i].querySelector('#tBodyGrades td:nth-child(1)').style.left = tbody.scrollLeft+'px';
        }

    };

	render(){


		return(
			
			        <div className="quick3">
			        <table className="table table-responsive quick4" >
			       <thead id="tHeadGrades">
			      			<tr className="quick8" >
			                <th>  
							 Grades
							</th>
						    {renderTableRows(this.props.data,"grades_ql","created_at")}			
						</tr>
						</thead>

						<tbody id="tBodyGrades" onScroll={this.myFunction}>
							<tr>
							
					        <td>Overall Truth Grade</td>
					       
					       {renderTableRows(this.props.data,"grades_ql","overall_truth_grade")}		             
				         </tr>
				         <tr className="quick9">
					        <td>Overall Truth Health Gpa</td>
					        {renderTableRows(this.props.data,"grades_ql","overall_truth_health_gpa")}				            
				         </tr>
				         <tr>
					        <td>Movement Non Exercise Grade</td>
					        {renderTableRows(this.props.data,"grades_ql","movement_non_exercise_steps_grade")}				           
				         </tr>

				         <tr className="quick9">
					        <td>Avg Sleep Per Night Grade</td>
					        {renderTableRows(this.props.data,"grades_ql","avg_sleep_per_night_grade")}				           
				         </tr>
				         <tr>
					        <td>Exercise Consistency Grade</td>
					        {renderTableRows(this.props.data,"grades_ql","exercise_consistency_grade")}				           
				         </tr>
				         <tr className="quick9">
					        <td>Overall Workout Grade</td>
					        {renderTableRows(this.props.data,"grades_ql","overall_workout_grade")}				           
				         </tr>
				         <tr>
					        <td>percent NonProcessed Food Consumed Grade</td>
					        {renderTableRows(this.props.data,"grades_ql","prcnt_unprocessed_food_consumed_grade")}		            
				         </tr>
				          <tr className="quick9">
					        <td>Alcoholic Drink Per Week Grade</td>
					        {renderTableRows(this.props.data,"grades_ql","alcoholic_drink_per_week_grade")}				           
				         </tr>
				         <tr>
					        <td>Penalty</td>
					        {renderTableRows(this.props.data,"grades_ql","penalty")}				           
				         </tr>
				         </tbody>

                           </table>
                         </div>
                         

			);
	}
}
export default Grades;