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

 class User extends Component{

	constructor(props){
	super(props);
	console.log("Constructor props:",this.props)
	this.renderTableColumns = this.renderTableColumns.bind(this);

	let initial_state = getInitialStateUserInput(this.props.start_date,
												 this.props.end_date);

	if(this.props.data !== {}){
		const dates = [];
		let data = this.props.data;
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

	     console.log("initial_state -----------------", initial_state)
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
	                    workout:data.strong_input.workout,
	                    workout_easy:data.strong_input.work_out_easy_or_hard,
	                    workout_effort:data.strong_input.workout_effort_level,
	                    workout_effort_hard_portion:data.strong_input.hard_portion_workout_effort_level,
	                    prcnt_unprocessed_food:data.strong_input.prcnt_unprocessed_food_consumed_yesterday,
	                    unprocessed_food_list:data.strong_input.list_of_unprocessed_food_consumed_yesterday,
	                    processed_food_list:data.strong_input.list_of_processed_food_consumed_yesterday,
	                    alchol_consumed:data.strong_input.number_of_alcohol_consumed_yesterday,
	                    alcohol_drink_consumed_list:data.strong_input.alcohol_drink_consumed_list,
	                    sleep_time_excluding_awake_time:data.strong_input.sleep_time_excluding_awake_time,
	                    sleep_comment:data.strong_input.sleep_comment,
	                    prescription_sleep_aids:data.strong_input.prescription_or_non_prescription_sleep_aids_last_night,
	                    sleep_aid_taken:data.strong_input.sleep_aid_taken,
	                    smoke_substances:data.strong_input.smoke_any_substances_whatsoever,
	                    smoked_substance_list:data.strong_input.smoked_substance,
	                    medications:data.strong_input.prescription_or_non_prescription_medication_yesterday,
	                    medications_taken_list:data.strong_input.prescription_or_non_prescription_sleep_aids_last_night
	                },
	                encouraged_input:{
	                     stress:data.encouraged_input.stress,
	                     pain:data.encouraged_input.pain,
	                     pain_area:data.encouraged_input.pain_area,
	                     water_consumed:data.encouraged_input.water_consumed,
	                     breath_nose:data.encouraged_input.breath_nose
	                },
	                optional_input:{
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

	componentWillReceiveProps(nextProps){
		console.log("This is next props",nextProps);
		if(nextProps.start_date !== this.state.start_date &&
		   nextProps.end_date !== this.state.end_date) {
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
			console.log("Inside the hell, state is",initial_state);
			this.setState = ({
				start_date:nextProps.start_date,
				end_date:nextProps.end_date,
				data:initial_state
			},function(){
				console.log("Altered state",this.state);
			});
		}
	}
renderTableColumns(dateWiseData,category,classes=""){
		let columns = [];
		for(let [date,data] of Object.entries(dateWiseData)){

			let all_data = [];
            for(let [key,value] of Object.entries(data[category])){
                if(key !== 'id' && key !== 'user_ql'){
                    all_data.push(value);
                }
            }

			columns.push(
				<Column 
					header={<Cell>{date}</Cell>}
			        cell={props => (
				            <Cell {...props}>
				              {all_data[props.rowIndex]}
				            </Cell>
				          )}
			        width={132}
				/>
			)
		}
		return columns;
}
	render(){
		const {height, width, containerHeight, containerWidth, ...props} = this.props;
		let rowsCount = this.state.myTableData.length;
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
    return window.innerHeight - 334;
  },
  getWidth: function(element) {
    var widthOffset = window.innerWidth < 1024 ? 30 : 400;
    return window.innerWidth - widthOffset;
  }
})(User);

