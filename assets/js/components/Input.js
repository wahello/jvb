import moment from 'moment';

export function getInput(start_date, end_date){
	var initial_state = {};
	start_date = moment(start_date);
	end_date = moment(end_date);
	initial_state[end_date.format('M-D-YY')] = {};

	var diff = end_date.diff(start_date, 'days');
	let tmp_end_date = moment(end_date);
	for(var i=0; i<diff; i++){
		var date = tmp_end_date.subtract(1,'days');  
		var current_date = date.format('M-D-YY');
		initial_state[current_date]={};
 	}

 	let blank_properties={
 		'have_data':false,
	    "input":{    	
	    	"new_data":"-",
	    }
	};

	for(const day of Object.keys(initial_state)){
			initial_state[day] = blank_properties
	}

	return initial_state;
}