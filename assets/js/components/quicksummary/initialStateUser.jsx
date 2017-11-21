import moment from 'moment';

export function getInitialStateUserInput(start_dt, end_dt){
	// expect moment objects
	var initial_state = {};

	initial_state[end_dt.format('YYYY-MM-DD')] = {};

	var diff = end_dt.diff(start_dt, 'days');

	let tmp_end_date = moment(end_dt);
	for(var i=0; i<diff; i++){
		var dt = tmp_end_date.subtract(1,'days');
		var current_dt = dt.format('YYYY-MM-DD');
		initial_state[current_dt]={};
 	}

 	let blank_properties={
		"created_at":'',			
	    "strong_input":{
	    	"id":'-',	    	
	    	"workout":'-',
	    	"workout_easy":'-',
	    	"workout_effort":'-',
	    	"is_workout_hard":'-',
            "workout_effort_hard_portion":'-',
            "prcnt_unprocessed_food":'-',
	        "unprocessed_food_list":'-',
	        "processed_food_list":'-',
	        "alchol_consumed":'-',
        	"alcohol_drink_consumed_list":'-',
        	"sleep_hours_last_night":'-',
	        "sleep_mins_last_night":'-',
	        "sleep_comment":'-',
	        "prescription_sleep_aids":'-',
	        "sleep_aid_taken":'-',
	        "smoke_substances":'-',
	        "smoked_substance_list":'-',
	        "medications":'-',
	        "medications_taken_list":'-'

	    },
	    "encouraged_input":{
	    	"id":'-',
	    	 "stress":'-',
	    	 "pain":'-',
        	 "pain_area":'-',
        	 "water_consumed":'-',
        	 "breath_nose":'-'
	    },
	    "optional_input":{
	    	  "id":'-',
	    	  "food_consumed":'-',
	    	  "chia_seeds":'-',
	    	  "fasted":'-',
              "food_ate_before_workout":'-',
              "calories":'-',
              "calories_item":'-',
              "workout_enjoyable":'-',
              "workout_comment":'-',
              "weight":'-',
       		  "waist":'-',
       		  "sick":'-',
              "sickness":'-',
              "stand":'-',
              "diet_type":'-',
       		  "general_comment":'-'
	    }

	};
	for(const day of Object.keys(initial_state)){
			initial_state[day] = blank_properties
	}
	return initial_state;
}