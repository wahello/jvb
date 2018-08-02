import React from 'react';
import FontAwesome from "react-fontawesome";
import moment from 'moment';

export function renderLeaderBoardFetchOverlay(){
	if(this.state.fetching_lb1){
		let lb1_start_date = moment(this.state.lb1_start_date);
		let lb1_end_date = moment(this.state.lb1_end_date);
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
					<p>Fetching Rank Data from {lb1_start_date.format('MMMM D, YYYY')} to {lb1_end_date.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}

export function renderLeaderBoard2FetchOverlay(){
	if(this.state.fetching_lb2){
		let lb2_start_date = moment(this.state.lb2_start_date);
		let lb2_end_date = moment(this.state.lb2_end_date);
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
					<p>Fetching Rank Data from {lb2_start_date.format('MMMM D, YYYY')} to {lb2_end_date.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}

export function renderLeaderBoard3FetchOverlay(){
	if(this.state.fetching_lb3){
		let lb3_start_date = moment(this.state.lb3_start_date);
		let lb3_end_date = moment(this.state.lb3_end_date);
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
					<p>Fetching Rank Data from {lb3_start_date.format('MMMM D, YYYY')} to {lb3_end_date.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}
export function renderLeaderBoardSelectedDateFetchOverlay(){
	if(this.state.fetching_lb4){
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
					<p>Fetching Rank Data For {selectedDate.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}

export function renderOverallHrr1FetchOverlay(){
	if(this.state.fetching_hrr1){
		let lb1_start_date = moment(this.state.lb1_start_date);
		let lb1_end_date = moment(this.state.lb1_end_date);
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
					<p>Fetching HRR Leaderboard Data from {lb1_start_date.format('MMMM D, YYYY')} to {lb1_end_date.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}

export function renderOverallHrr2FetchOverlay(){
	if(this.state.fetching_hrr2){
		let lb2_start_date = moment(this.state.lb2_start_date);
		let lb2_end_date = moment(this.state.lb2_end_date);
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
					<p>Fetching HRR Leaderboard Data from {lb2_start_date.format('MMMM D, YYYY')} to {lb2_end_date.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}

export function renderOverallHrr3FetchOverlay(){
	if(this.state.fetching_hrr3){
		let lb3_start_date = moment(this.state.lb3_start_date);
		let lb3_end_date = moment(this.state.lb3_end_date);
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
					<p>Fetching HRR Leaderboard Data from {lb3_start_date.format('MMMM D, YYYY')} to {lb3_end_date.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}
export function renderOverallHrrSelectedDateFetchOverlay(){
	if(this.state.fetching_hrr4){
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
					<p>Fetching HRR Leaderboard Data For {selectedDate.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}