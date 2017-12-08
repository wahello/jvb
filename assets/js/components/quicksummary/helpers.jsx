import React from 'react';
import FontAwesome from "react-fontawesome";
import moment from 'moment';

export function renderQlFetchOverlay(){
	if(this.state.fetching_ql){
		let start_date = moment(this.state.start_date);
		let end_date = moment(this.state.end_date);
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
					<p>Fetching Quicklooks from {start_date.format('MMM D, YYYY')} to {end_date.format('MMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}

export function renderQlCreateOverlay(){
	if(this.state.creating_ql){
		let start_date = moment(this.state.start_date);
		let end_date = moment(this.state.end_date);
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
					<p>Creating Quicklooks from {start_date.format('MMM D, YYYY')} to {end_date.format('MMM D, YYYY')}  </p>
				</div>
			</div>
		);
	}
}