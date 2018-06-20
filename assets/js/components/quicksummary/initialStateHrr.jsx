import moment from 'moment';

export function getInitialStateHrr(start_dt, end_dt){
	var initial_state = {};
	start_dt = moment(start_dt);
	end_dt = moment(end_dt);
	initial_state[end_dt.format('M-D-YY')] = {};

	var diff = end_dt.diff(start_dt, 'days');
	let tmp_end_date = moment(end_dt);
	for(var i=0; i<diff; i++){
		var dt = tmp_end_date.subtract(1,'days');  
		var current_dt = dt.format('M-D-YY');
		initial_state[current_dt]={};
 	}

 	let blank_properties={
 		"Did_you_measure_HRR":'-',
		"Did_heartrate_reach_99":'-',
		"time_99":'-',
		"HRR_start_beat":'-',
		"lowest_hrr_1min":'-',
		"No_beats_recovered":'-',
		"end_time_activity":'-',
		"diff_actity_hrr":'-',
		"HRR_activity_start_time":'-',
		"end_heartrate_activity":'-',
		"heart_rate_down_up":'-',
		"pure_1min_heart_beats":'-',
		"pure_time_99":'-',
		"no_fitfile_hrr_reach_99":'-',
		"no_fitfile_hrr_time_reach_99":'-',
		"time_heart_rate_reached_99":'-',
		"end_heartrate_activity1":'-',
		"lowest_hrr_no_fitfile":'-',
		"no_file_beats_recovered":'-',
		"age":'-',
	};
	for(const day of Object.keys(initial_state)){
			initial_state[day] = blank_properties
	}
	return initial_state;
}