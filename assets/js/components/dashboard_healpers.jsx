import React from 'react';
import FontAwesome from "react-fontawesome";
import moment from 'moment';

export function renderProgressFetchOverlay(){
	if(this.state.fetching_ql1){
		let cr1_start_date = moment(this.state.cr1_start_date);
		let cr1_end_date = moment(this.state.cr1_end_date);
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
					<p>Fetching Progress Data from {cr1_start_date.format('MMMM D, YYYY')} to {cr1_end_date.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}

export function renderProgress2FetchOverlay(){
	if(this.state.fetching_ql2){
		let cr2_start_date = moment(this.state.cr2_start_date);
		let cr2_end_date = moment(this.state.cr2_end_date);
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
					<p>Fetching Progress Data from {cr2_start_date.format('MMMM D, YYYY')} to {cr2_end_date.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}

export function renderProgress3FetchOverlay(){
	if(this.state.fetching_ql3){
		let cr3_start_date = moment(this.state.cr3_start_date);
		let cr3_end_date = moment(this.state.cr3_end_date);
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
					<p>Fetching Progress Data from {cr3_start_date.format('MMMM D, YYYY')} to {cr3_end_date.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}
export function renderProgressSelectedDateFetchOverlay(){
	if(this.state.fetching_ql4){
		let selectedDate = moment(this.state.selectedDate);
		
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
					<p>Fetching Progress Data For {selectedDate.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}

export function renderAerobicSelectedDateFetchOverlay(){
	if(this.state.fetching_aerobic){
		let selectedDate = moment(this.state.selectedDate);
		
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
					<p>Fetching Heartrate Aerobic/Anaerobic Ranges Data For {selectedDate.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}
export function renderHrrSelectedDateFetchOverlay(){
	if(this.state.fetching_hrr){
		let selectedDate = moment(this.state.selectedDate);

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
					<p>Fetching Heartrate Recovery Data For {selectedDate.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}

export function renderTimeTohrrZoneSelectedDateFetchOverlay(){
	if(this.state.fetching_hrr_zone){
		let selectedDate = moment(this.state.selectedDate);

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
					<p>Fetching Time to Heartrate Zone Data For {selectedDate.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}
export function renderHrrSummaryDashboardDataFetchOverlay(){
	if(this.state.fetching_hrr_dashboard){
		let selectedDate = moment(this.state.selectedDate);

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
					<p>Fetching Time to Hrr Summary Dashboard Data For {selectedDate.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}