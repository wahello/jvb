import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Button} from "reactstrap";
import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import Dimensions from 'react-dimensions';

import {getInitialStateUserInput} from './initialStateUser';
import {userInputDate} from '../../network/quick';
import { Alert } from 'reactstrap';

// function renderTableRows(dateWiseData,category,field,classes=""){
// 	let elements = [];
// 	for(let [date,data] of Object.entries(dateWiseData)){
// 		if(field === "created_at"){
// 			elements.push(
// 				<th key={date} className={classes}>{date}</th>
// 			);	
// 		}else{
// 			elements.push(
// 				<td key={date} className={classes}>{data[category][field]}</td>
// 			);
// 		}
// 	}
// 	return elements;
// }


 class User extends Component{

	constructor(props){
	super(props);
	console.log("Constructor props:",this.props)
	//this.userScroll=this.userScroll.bind(this);
	this.renderTableColumns = this.renderTableColumns.bind(this);

	let initial_state = getInitialStateUserInput(moment(new Date()));

	if(this.props.data !== {}){
		const dates = [];
		let data = this.props.data;
		
		console.log("Temp initial state",initial_state);
		for(let date of Object.keys(initial_state)){
			dates.push(date);
		} 
	    if (data.data.length > 0){
		 	 for(var dataitem of data.data){
		      	const date = dataitem.created_at;
		      	let obj = this.updateDateState(dataitem);
		      	tmp_initial_state[date] = obj;
		      }
		      initial_state = initial_state;
	     }

	     console.log("tmp_initial_state -----------------", initial_state)
	}
	console.log("Initial State", initial_state);
	this.state = {
		start_date:this.props.start_date,
		end_date:this.props.end_date,
		data:initial_state,
		 myTableData: [
        {name: 'Did You Workout Today?'},
        {name: 'Was Your Workout Easy or Hard?'},
        {name: 'Your Workout Effort Level?'},
        {name: 'Was Any Portion Of Your Workout Hard?'}, 
        {name: 'What Was Your Average Effort Level For The Hard Part Of Your Workout?'},
        {name: 'How Much Time Did You Sleep Last Night '},
        {name: 'Sleep Comments'},
        {name: 'Did You Take Any Prescription or Non Prescription Sleep Aids Last Night?'}, 
        {name: 'What Did You Take?'},
        {name: 'What % of The Food You Consumed Yesterday Was Unprocessed?'},
        {name: 'What Unrocessed Food Were Consumed?'},
        {name: 'Processed Food List'},
        {name: 'Number of Alcohol Drinks Consumed Yesterday?'},
        {name: 'What Did You Drink (Optional)?'}, 
        {name: 'Did You Smoke Any Substances Yesterday?'},
        {name: 'What Did You Smoke Yesterday? '},
        {name: 'How Many Cigarettes You Have Smoked?'},
        {name: 'other'}, 
        {name: 'Did You Take Any Prescription or Non Prescription Medications or Supplements Yesterday?'},
        {name: 'What Did You Take?'},               
      ],
	};
	
}

updateDateState(data){
       			var properties={
       				created_at:data.created_at,
					strong_input:{
	                    id:data.strong_input.id,
	                    user_input:data.strong_input.user_input,
	                    workout:data.strong_input.workout,
	                    workout_easy:data.strong_input.workout_easy,
	                    workout_effort:data.strong_input.workout_effort,
	                    workout_effort_hard_portion:data.strong_input.workout_effort_hard_portion,
	                    prcnt_unprocessed_food:data.strong_input.prcnt_unprocessed_food,
	                    unprocessed_food_list:data.strong_input.unprocessed_food_list,
	                    processed_food_list:data.strong_input.processed_food_list,
	                    alchol_consumed:data.strong_input.alchol_consumed,
	                    alcohol_drink_consumed_list:data.strong_input.alcohol_drink_consumed_list,
	                    sleep_hours_last_night:data.strong_input.sleep_hours_last_night,
	                    sleep_mins_last_night:data.strong_input.sleep_mins_last_night,
	                    sleep_comment:data.strong_input.sleep_comment,
	                    prescription_sleep_aids:data.strong_input.prescription_sleep_aids,
	                    sleep_aid_taken:data.strong_input.sleep_aid_taken,
	                    smoke_substances:data.strong_input.smoke_substances,
	                    smoked_substance_list:data.strong_input.smoked_substance_list,
	                    medications:data.strong_input.medications,
	                    medications_taken_list:data.strong_input.medications_taken_list
	                },
	                encouraged_input:{
	                     id:data.encouraged_input.id,
	                     user_input:data.encouraged_input.user_input,
	                     stress:data.encouraged_input.stress,
	                     pain:data.encouraged_input.pain,
	                     pain_area:data.encouraged_input.pain_area,
	                     water_consumed:data.encouraged_input.water_consumed,
	                     breath_nose:data.encouraged_input.breath_nose
	                },
	                optional_input:{
	                      id:data.optional_input.id,
	                      user_input:data.optional_input.user_input,
	                      food_consumed:data.optional_input.food_consumed,
	                      chia_seeds:data.optional_input.chia_seeds,
	                      fasted:data.optional_input.fasted,
	                      food_ate_before_workout:data.optional_input.food_ate_before_workout,
	                      calories:data.optional_input.calories,
	                      calories_item:data.optional_input.calories_item,
	                      workout_enjoyable:data.optional_input.workout_enjoyable,
	                      workout_comment:data.optional_input.workout_comment,
	                      weight:data.optional_input.weight,
	                      waist:data.optional_input.waist,
	                      sick:data.optional_input.sick,
	                      sickness:data.optional_input.sickness,
	                      stand:data.optional_input.stand,
	                      diet_type:data.optional_input.diet_type,
	                      general_comment:data.optional_input.general_comment
	                }
             };
             return properties;
       		}

	// componentDidMount(){
	// 	document.getElementById('tBodyUser').addEventListener('scroll', this.userScroll);
	// }

	componentWillReceiveProps(nextProps){
		console.log("This is next props",nextProps);
		
		console.log(nextProps.start_date);
		console.log(nextProps.end_date);
		if(nextProps.start_date !== this.props.start_date ||
		   nextProps.end_date !== this.props.end_date ||
		   nextProps.data !== this.props.data) {
		   	let initial_state = getInitialStateUserInput(nextProps.start_date,nextProps.end_date);
			if(nextProps.data !== {}){
				const dates = [];
				let data = nextProps.data;
				for(let date of Object.keys(initial_state)){
					dates.push(date);
				} 
			    if (data.data.length > 0){
				 	 for(var dataitem of data.data){
				      	const date = dataitem.created_at;
				      	let obj = this.updateDateState(dataitem);
				      	initial_state[date] = obj;
				      }
			     }
			}
			this.setState = ({
				start_date:nextProps.start_date,
				end_date:nextProps.end_date,
				data:initial_state
			},function(){
				console.log(this.state)
			}.bind(this));
		}
	}
renderTableColumns(dateWiseData,category,classes=""){
		let columns = [];
		for(let [date,data] of Object.entries(dateWiseData)){
			columns.push(
				<Column 
					header={<Cell>{date}</Cell>}
			        cell={props => (
				            <Cell {...props}>
				              {data[category][Object.keys(data[category])[props.rowIndex+2]]}
				            </Cell>
				          )}
			        width={132}
				/>
			)
		}
		return columns;
	}
	// userScroll(e) { 
 //        var tbody = document.getElementById("tBodyUser");
 //        document.getElementById("tHeadUser").style.left = '-'+tbody.scrollLeft+'px';
 //        document.querySelector('#tHeadUser th:nth-child(1)').style.left = tbody.scrollLeft+'px';
 //        var trLength = document.querySelector('#tBodyUser').children;
 //        for (var i = 0; i < trLength.length; i++) {
 //        	trLength[i].querySelector('#tBodyUser td:nth-child(1)').style.left = tbody.scrollLeft+'px';
 //        }
	// };

	// render(){
	// 	return(
	// 			<div className="quick3">
	// 			<table className="quick4">
	// 			<thead id="tHeadUser">
	// 			<tr className="quick8">
	// 			<th >
	// 			  User Inputs
	// 			</th>
	// 			 	 {renderTableRows(this.state.data,"strong_input","created_at")}
	// 			</tr>
	// 			</thead>
				
	// 			<tbody id="tBodyUser" onScroll={this.userScroll}>
	// 					<tr>
	// 					<td>Did You Workout Today?</td>
	// 					 {renderTableRows(this.state.data,"strong_input","workout")}
	// 					</tr>

	// 					<tr>
	// 					<td>Was Your Workout Easy or Hard?</td>
	// 					 {renderTableRows(this.state.data,"strong_input","workout_easy")}
	// 					</tr>

	// 					<tr>
	// 					<td>Was Your Workout Today Enjoyable?</td>
	// 					{renderTableRows(this.state.data,"optional_input","workout_enjoyable")}
	// 					</tr>

	// 					<tr>
	// 					<td>Your Workout Effort Level? (with 1 being the easiest and 10 the hardest)</td>
	// 					 {renderTableRows(this.state.data,"strong_input","workout_effort")}
	// 					</tr>



	// 					<tr>
	// 					<td>Was Any Portion Of Your Workout Hard?</td>
	// 					{renderTableRows(this.state.data,"strong_input","is_workout_hard")}
	// 					</tr>

	// 					<tr>
	// 					<td>What Was Your Average Effort Level For The Hard Part Of Your Workout?</td>
	// 					 {renderTableRows(this.state.data,"strong_input","workout_effort_hard_portion")}
	// 					</tr>

						
	// 					<tr>
	// 					<td>Did You Have Any Pain or Twinges During or After Your Workout?</td>
	// 					{renderTableRows(this.state.data,"encouraged_input","pain")}
	// 					</tr>

	// 					<tr>
	// 					<td> Where Did You Have Pain/Twinges?</td>
	// 					{renderTableRows(this.state.data,"encouraged_input","pain_area")}
	// 					</tr>								

	// 					<tr>
	// 					<td>Water Consumed During Workout (Ounces)</td>
	// 					{renderTableRows(this.state.data,"encouraged_input","water_consumed")}
	// 					</tr>

	// 					<tr>
	// 					<td>Tablespoons of Chia Seeds Consumed During Workout?</td>
	// 					{renderTableRows(this.state.data,"optional_input","chia_seeds")}
	// 					</tr>

	// 					<tr>
	// 					<td> What % of Your Workout Did you breathe in and out through Your nose?</td>
	// 					{renderTableRows(this.state.data,"encouraged_input","breath_nose")}
	// 					</tr>

	// 					<tr>
	// 					<td>Were You Fasted During Your Workout?</td>
	// 					{renderTableRows(this.state.data,"optional_input","fasted")}
	// 					</tr>

	// 					<tr>
	// 					<td>What Food Did You Eat Before Your Workout?</td>
	// 					{renderTableRows(this.state.data,"optional_input","food_ate_before_workout")}
	// 					</tr>

	// 					<tr>
	// 					<td>General Workout Comments</td>
	// 					{renderTableRows(this.state.data,"optional_input","workout_comment")}
	// 					</tr>

	// 					<tr>
	// 					<td> Approximately How Many Calories Did You Consume During Your Workout?</td>
	// 					{renderTableRows(this.state.data,"optional_input","calories")}
	// 					</tr>

	// 					<tr>
	// 					<td>What Specifically Did You Consume During Your Workout?</td>
	// 					{renderTableRows(this.state.data,"optional_input","calories_item")}
	// 					</tr>

	// 					<tr>
	// 					<td>How Much Time Did You Sleep Last Night (Excluding Awake Time)?</td>
	// 					{renderTableRows(this.state.data,"strong_input","sleep_hours_last_night")}
	// 					</tr>

	// 					<tr>
	// 					<td>Sleep Comments</td>
	// 					{renderTableRows(this.state.data,"strong_input","sleep_comment")}
	// 					</tr>

	// 					<tr>
	// 					<td>Did You Take Any Prescription or Non Prescription Sleep Aids Last Night?</td>
	// 					{renderTableRows(this.state.data,"strong_input","prescription_sleep_aids")}
	// 					</tr>

	// 					<tr>
	// 					<td>What Did You Take?</td>
	// 					{renderTableRows(this.state.data,"strong_input","sleep_aid_taken")}
	// 					</tr>

	// 					<tr>
	// 					<td>What % of The Food You Consumed Yesterday Was Unprocessed?</td>
	// 					{renderTableRows(this.state.data,"strong_input","prcnt_processed_food")}
	// 					</tr>

	// 					<tr>
	// 					<td>What Unrocessed Food Were Consumed?</td>
	// 					{renderTableRows(this.state.data,"strong_input","unprocessed_food_list")}
	// 					</tr>

	// 					<tr>
	// 					<td>Processed Food List</td>
	// 					{renderTableRows(this.state.data,"strong_input","processed_food_list")}
	// 					</tr>
						

	// 					<tr>
	// 					<td>Number of Alcohol Drinks Consumed Yesterday?</td>
	// 					{renderTableRows(this.state.data,"strong_input","alchol_consumed")}
	// 					</tr>

	// 					<tr>
	// 					<td>What Did You Drink (Optional)?</td>
	// 					{renderTableRows(this.state.data,"strong_input","alcohol_drink_consumed_list")}
	// 					</tr>

	// 					<tr>
	// 					<td>Did You Smoke Any Substances Yesterday?</td>
	// 					{renderTableRows(this.state.data,"strong_input","smoke_substances")}
	// 					</tr>

	// 					<tr>
	// 					<td>What Did You Smoke Yesterday?</td>
	// 					{renderTableRows(this.state.data,"strong_input","smoked_substance_list")}
	// 					</tr>
	// 					<tr>

	// 					<td>How Many Cigarettes You Have Smoked?</td>
	// 					{renderTableRows(this.state.data,"strong_input","smoked_substance_list")}
	// 					</tr>

	// 					<tr>
	// 					<td>Other</td>
	// 					{renderTableRows(this.state.data,"strong_input","smoked_substance_list")}
	// 					</tr>


	// 					<tr>
	// 					<td>Did You Take Any Prescription or Non Prescription Medications or Supplements Yesterday?</td>
	// 					{renderTableRows(this.state.data,"strong_input","medications")}
	// 					</tr>

	// 					<tr>
	// 					<td>What Did You Take?</td>
	// 					{renderTableRows(this.state.data,"strong_input","medications_taken_list")}
	// 					</tr>

	// 					<tr>
	// 					<td>Yesterday's Stress Level</td>
	// 					{renderTableRows(this.state.data,"encouraged_input","stress")}
	// 					</tr>

	// 					<tr>
	// 					<td>Are You Sick Today?</td>
	// 					{renderTableRows(this.state.data,"optional_input","sick")}
	// 					</tr>

	// 					<tr>
	// 					<td>Please Tell Us Your Illness</td>
	// 					{renderTableRows(this.state.data,"optional_input","sickness")}
	// 					</tr>

	// 					<tr>
	// 					<td>Weight (Pounds)</td>
	// 					{renderTableRows(this.state.data,"optional_input","weight")}
	// 					</tr>

	// 					<tr>
	// 					<td>Waist Size (Male)</td>
	// 					{renderTableRows(this.state.data,"optional_input","waist")}
	// 					</tr>

	// 					<tr>
	// 					<td> What Type Of Diet Do You Eat?</td>
	// 					{renderTableRows(this.state.data,"optional_input","diet_type")}
	// 					</tr>

	// 					<tr>
	// 					<td>What Did You Take?</td>
	// 					{renderTableRows(this.state.data,"optional_input","diet_type")}
	// 					</tr>

	// 					<tr>
	// 					<td>Did You Stand For 3 Hours or More Yesterday?</td>
	// 					{renderTableRows(this.state.data,"optional_input","stand")}
	// 					</tr>

	// 					<tr>
	// 					<td>General Comments</td>
	// 					{renderTableRows(this.state.data,"optional_input","general_comment")}
	// 					</tr>								
	// 			</tbody>
	// 			</table>
	// 			</div>

	// );
	// }

	render(){
		const {height, width, containerHeight, containerWidth, ...props} = this.props;
		 // var {dataList} = this.state;
		let rowsCount = Object.keys(Object.entries(this.state.data)[0][1]["strong_input"]).length;
		return(
			<div className="quick3">
			 <Table
			 	className="responsive"
		        rowsCount={rowsCount}
		        rowHeight={50}
		        headerHeight={50}
		        width={containerWidth}
        		height={containerHeight}
        		{...props}>
		        {/*this.renderTableAttrColumn(this.props.data,"alcohol_ql","Alcohol")*/}
		        <Column
		          header={<Cell>User Input</Cell>}
		          cell={props => (
		            <Cell {...props}>
		              {this.state.myTableData[props.rowIndex].name}
		            </Cell>
		          )}
		          width={200}
		          fixed={true}
		        />
			    {this.renderTableColumns(this.state.data,"strong_input")}
      		</Table>
			</div>

			);
	}
}
export default Dimensions({
  getHeight: function(element) {
    return window.innerHeight - 200;
  },
  getWidth: function(element) {
    var widthOffset = window.innerWidth < 1024 ? 30 : 240;
    return window.innerWidth - widthOffset;
  }
})(User);

