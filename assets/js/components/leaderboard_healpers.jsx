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

export function renderOverallMovement1FetchOverlay(){
	if(this.state.fetching_hrr1){
		let lb1_start_date = moment(this.state.lb1_start_date);
		let lb1_end_date = moment(this.state.lb1_end_date);
		return(bifurcationdashboard/modifications/fe
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
					<p>Fetching Movement Leaderboard Data from {lb1_start_date.format('MMMM D, YYYY')} to {lb1_end_date.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}

export function renderOverallMovement2FetchOverlay(){
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
					<p>Fetching Movement Leaderboard Data from {lb2_start_date.format('MMMM D, YYYY')} to {lb2_end_date.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}

export function renderOverallMovement3FetchOverlay(){
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
					<p>Fetching Movement Leaderboard Data from {lb3_start_date.format('MMMM D, YYYY')} to {lb3_end_date.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}
export function renderOverallMovementSelectedDateFetchOverlay(){
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
					<p>Fetching Movement Leaderboard Data For {selectedDate.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}
export function renderOverallLeaderBoard1FetchOverlay(){
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
					<p>Fetching Overall Leaderboard Data from {lb1_start_date.format('MMMM D, YYYY')} to {lb1_end_date.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}

export function renderOverallLeaderBoard2FetchOverlay(){
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
					<p>Fetching Overall Leaderboard Data from {lb2_start_date.format('MMMM D, YYYY')} to {lb2_end_date.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}

export function renderOverallLeaderBoard3FetchOverlay(){
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
					<p>Fetching Overall Leaderboard Data from {lb3_start_date.format('MMMM D, YYYY')} to {lb3_end_date.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}
export function renderOverallLeaderBoardSelectedDateFetchOverlay(){
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
					<p>Fetching Overall Leaderboard Data For {selectedDate.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}

//Bifurcation dashboard starts here

export function renderOverallBifurcationSelectedDateFetchOverlay(){
	if(this.state.fetching_bifurcation){
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
					<p>Fetching Bifurcation Dashboard Data For {selectedDate.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}
export function renderOverallBifurcation1FetchOverlay(){
	if(this.state.fetching_bifurcation1){
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
					<p>Fetching Bifurcation Dashboard Data For {selectedDate.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}
export function renderOverallBifurcationSelectedRangeFetchOverlay(){
	if(this.state.fetching_bifurcation5){
		let selectedDate =this.state.date;
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
					<p>Fetching Bifurcation Dashboard Data For {this.state.date}  </p>
				</div>
			</div>
		);
	}
}
export function renderOverallBifurcation2FetchOverlay(){
	if(this.state.fetching_bifurcation2){
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
					<p>Fetching Bifurcation Dashboard Data from {lb2_start_date.format('MMMM D, YYYY')} to {lb2_end_date.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}

export function renderOverallBifurcation3FetchOverlay(){
	if(this.state.fetching_bifurcation3){
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
					<p>Fetching Bifurcation Dashboard Data from {lb3_start_date.format('MMMM D, YYYY')} to {lb3_end_date.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}
export function renderOverallBifurcation4FetchOverlay(){
	if(this.state.fetching_bifurcation4){
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
					<p>Fetching Bifurcation Dashboard Data from {lb3_start_date.format('MMMM D, YYYY')} to {lb3_end_date.format('MMMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}