import React from 'react';
import ReactDOM from 'react-dom';
import FontAwesome from "react-fontawesome";
import moment from 'moment';
import _ from 'lodash'


import WorkoutEffortModal from './workoutEffortModal';
import PainModal from './painModal';
import UnprocesedFoodModal from './unprocessedFoodModal';
import SickModal from './sickModal';
import PrescriptionSleepAids from './prescriptionsleepaids';
import PrescriptionMedication from './pres-nonprescriptionmedication';
import FastedModal from './fastedModal';
import DietType from './diettype';
import SmokedSubstance from './smokedSubstance';
import AlcoholModal from './alcoholModal';
import Hrr from './HRR';
import ActivityGrid from './activity_grid';

export function renderWorkoutEffortModal(){
  if(this.state.workout_effort !== "no workout today" &&  
	 this.state.workout_effort !== "" &&
  	 (this.state.workout_easy === "easy" ||
     this.state.workout_easy === "medium")){
	const updateState = function(val){
						  this.setState({
							workout_effort_hard_portion:val
						  })}.bind(this);

	return(
	  <WorkoutEffortModal
		workout_effort_hard_portion={this.state.workout_effort_hard_portion}
		editable = {this.state.editable}
		updateState={updateState}
	  />
	);
}
  }

export function renderPainModal(){
  if(this.state.pain === 'yes'){
	const updateState = function(val){
						  this.setState({
							pain_area: val
						  })}.bind(this);
	return(
	  <PainModal
		pain_area={this.state.pain_area}
		updateState={updateState}
		editable = {this.state.editable}
	  />
	);
  }
}

export function renderDietType(){
	if(this.state.diet_to_show === 'other'){
	   const updateState = function(val){
						  this.setState({
							diet_type: val
						  })}.bind(this);
	   return(           
		<DietType
		  diet_type={this.state.diet_type}
		  updateState={updateState}
		  editable = {this.state.editable}
		/>
		);
	}
}

export function renderProcessedFoodModal(){
	if((this.state.prcnt_processed_food > 0)){
	  const updateState = function(val,name){
						  this.setState({
						  [name]: val
						  })}.bind(this);

		  return(
		<UnprocesedFoodModal
		processed_food_list={this.state.processed_food_list}
		unprocessed_food_list={this.state.unprocessed_food_list}
		updateState={updateState}
		editable = {this.state.editable}
		report_type = {this.state.report_type}
	  />
	  );
	}
}

export function renderFasted(){ 
 if(this.state. fasted === 'no'){
   const updateState = function(val){
						  this.setState({
					   food_ate_before_workout: val
						  })}.bind(this);
	   return(
			<FastedModal
			  food_ate_before_workout={this.state.food_ate_before_workout}
			  updateState={updateState}
			  editable = {this.state.editable}
			/>
  );
 }  
}


export function renderPrescriptionMedication(){
	if((this.state.medications === 'yes') || (this.state.report_type == 'quick')){
	 const updateStateMedication = function(val){
							  this.setState({
						   medications_taken_list: val
							  })}.bind(this);

	 const updateStateCtrlSubs = function(val){
							  this.setState({
						   controlled_uncontrolled_substance: val
							  })}.bind(this);        
	  return(
		  <PrescriptionMedication
		  medications_taken_list={this.state.medications_taken_list}
		  controlled_uncontrolled_substance = {this.state.controlled_uncontrolled_substance}
		  updateStateMedication={updateStateMedication}
		  updateStateCtrlSubs={updateStateCtrlSubs}
		  editable = {this.state.editable}
		  report_type = {this.state.report_type}
		  />
		);
	  }
}

export function renderPrescriptionSleepAids(){
	if(this.state.prescription_sleep_aids === 'yes'){
	 const updateState = function(val){
							  this.setState({
						  sleep_aid_taken: val
							  })}.bind(this); 
		 return(
			<PrescriptionSleepAids
			sleep_aid_taken={this.state.sleep_aid_taken}
			updateState={updateState}
			editable = {this.state.editable}
			/>
		);
	  }
 
}

export function renderPainSick(){
  if(this.state.sick === 'yes'){
	 const updateState = function(val){
						  this.setState({
						  	sickness: val
						  })}.bind(this); 

	 return(
		  <SickModal
			sickness={this.state.sickness}
			updateState={updateState}
			editable = {this.state.editable}
		  />
		 );
  }
}
export function renderHrr(){
  if(this.state.measured_hr === 'yes'){
	 const updateState = function(state_val_obj){
						  this.setState({...state_val_obj})
						}.bind(this);

	 return(
		  <Hrr
			hr_down_99 = {this.state.hr_down_99}
	        time_to_99_min =  {this.state.time_to_99_min}
	        time_to_99_sec = {this.state.time_to_99_sec}
	        hr_level = {this.state.hr_level}
	        lowest_hr_first_minute = {this.state.lowest_hr_first_minute}
	        lowest_hr_during_hrr = {this.state.lowest_hr_during_hrr}
	        time_to_lowest_point_min = {this.state.time_to_lowest_point_min}
	        time_to_lowest_point_sec = {this.state.time_to_lowest_point_sec}
			updateState={updateState}
			editable = {this.state.editable}
		  />
		 );
  }
}
export function renderSmokeSubstance(){
  if (this.state.smoke_substances === 'yes'){

	const updateState = function(val){
		this.setState({
		 smoked_substance_list: val
		});
	  }.bind(this);

	return(
	  <SmokedSubstance
		smoked_substance_list={this.state.smoked_substance_list}
		updateState={updateState}
		editable = {this.state.editable}
	  />
	);
  }
}

export function renderAlcoholModal(){
  
	if(this.state. alchol_consumed){
	  const updateState = function(val){
						  this.setState({
						  alcohol_drink_consumed_list: val
						  })}.bind(this);

		return(
		<AlcoholModal
		alcohol_drink_consumed_list={this.state.alcohol_drink_consumed_list}
		updateState={updateState}
		editable = {this.state.editable}
	  />
	  );
	}
}

export function renderCloneOverlay(){
	if(this.state.cloning_data){
		let yesterday = moment(this.state.selected_date).subtract(1,'days');
		return(
			<div className="overlay d-flex justify-content-center align-items-center">
				<div className="overlay-content">
					<div className="d-flex">
						<FontAwesome 
							name='spinner' 
							size='3x'
							pulse spin
							className="mx-auto"
						/>
					</div>
					<br/>
					<p>Copying yesterday data ({yesterday.format('MMM D, YYYY')})</p>
				</div>
			</div>
		);
	}
}

export function renderFetchOverlay(){
	if(this.state.fetching_data){
		let selected_date = moment(this.state.selected_date);
		return(
			<div className="overlay d-flex justify-content-center align-items-center">
				<div className="overlay-content">
					<div className="d-flex">
						<FontAwesome 
							name='spinner' 
							size='3x'
							pulse spin
							className="mx-auto"
						/>
					</div>
					<br/>
					<p>Checking data for {selected_date.format('MMM D, YYYY')}</p>
				</div>
			</div>
		);
	}
}

export function renderUpdateOverlay(){
	if(this.state.updating_form){
		let selected_date = moment(this.state.selected_date);
		return(
			<div className="overlay d-flex justify-content-center align-items-center">
				<div className="overlay-content">
					<div className="d-flex">
						<FontAwesome 
							name='spinner' 
							size='3x'
							pulse spin
							className="mx-auto"
						/>
					</div>
					<br/>
					<p>Updating data for {selected_date.format('MMM D, YYYY')}</p>
				</div>
			</div>
		);
	}
}

export function renderSubmitOverlay(){
	if(this.state.submitting_form){
		let selected_date = moment(this.state.selected_date);
		return(
			<div className="overlay d-flex justify-content-center align-items-center">
				<div className="overlay-content">
					<div className="d-flex">
						<FontAwesome 
							name='spinner' 
							size='3x'
							pulse spin
							className="mx-auto"
						/>
					</div>
					<br/>
					<p>Submitting data for {selected_date.format('MMM D, YYYY')}</p>
				</div>
			</div>
		);
	}
}

export function renderActivityGrid(){
	
	const updateParentActivities = function(activities){
		let workout = this.state.workout;
		if(!_.isEmpty(activities)){
			let have_exercise_activity = false;
			for(let [key,act] of Object.entries(activities)){
				if(!act.deleted && !act.duplicate && act.steps_type === 'exercise'){
					have_exercise_activity = true;
					break;
				}
			}
			workout = have_exercise_activity?'yes':'no';
		}

		this.setState({
			workout:workout,
			activities:activities
		
		});
	}.bind(this);
	return(
		<ActivityGrid
			updateParentActivities = {updateParentActivities}
			activities = {this.state.activities}
			selected_date = {this.state.selected_date}
			editable = {this.state.editable}
			dateTimeValidation = {this.dateTimeValidation}
			ref = "child"
			AutoPopulateActivities = {this.AutoPopulateActivities}
			//AutoPopulateActTimings = {this.AutoPopulateActTimings}
			//workout_type={this.state.workout_type}
		/>
	);
}