import moment from 'moment';

export function getInitialStateUserInput(start_dt, end_dt){
	var initial_state = {};
	start_dt = moment(start_dt);
	end_dt = moment(end_dt);
	initial_state[end_dt.format('YYYY-MM-DD')] = {};

	var diff = end_dt.diff(start_dt, 'days');

	let tmp_end_date = moment(end_dt);
	for(var i=0; i<diff; i++){
		var dt = tmp_end_date.subtract(1,'days');
		var current_dt = dt.format('YYYY-MM-DD');
		initial_state[current_dt]={};
 	}

 	let blank_properties={
	    "strong_input":{    	
	    	"workout":'-',
	    	"workout_type":"-",
	    	"work_out_easy_or_hard":'-',
	    	"workout_effort_level":'-',
	    	"hard_portion_workout_effort_level":'-',
            "prcnt_unprocessed_food_consumed_yesterday":'-',
	        "list_of_unprocessed_food_consumed_yesterday":'-',
	        "list_of_processed_food_consumed_yesterday":'-',
	        "number_of_alcohol_consumed_yesterday":'-',
        	"alcohol_drink_consumed_list":'-',
        	"sleep_time_excluding_awake_time":'-',
	        "sleep_comment":'-',
	        "prescription_or_non_prescription_sleep_aids_last_night":'-',
	        "sleep_aid_taken":'-',
	        "smoke_any_substances_whatsoever":'-',
	        "smoked_substance":'-',
	        "prescription_or_non_prescription_medication_yesterday":'-',
	        "prescription_or_non_prescription_medication_taken":'-',
	        "controlled_uncontrolled_substance":"-"

	    },
	    "encouraged_input":{
	    	 "stress_level_yesterday":'-',
	    	 "pains_twings_during_or_after_your_workout":'-',
        	 "pain_area":'-',
        	 "water_consumed_during_workout":'-',
        	 "workout_that_user_breathed_through_nose":'-'
	    },
	    "optional_input":{
	    	  "chia_seeds_consumed_during_workout":'-',
	    	  "fasted_during_workout":'-',
              "food_ate_before_workout":'-',
              "calories_consumed_during_workout":'-',
              "food_ate_during_workout":'-',
              "workout_enjoyable":'-',
              "general_Workout_Comments":'-',
              "weight":'-',
       		  "waist_size":'-',
       		  "clothes_size":"-",
       		  "sick":'-',
              "sickness":'-',
              "stand_for_three_hours":'-',
              "type_of_diet_eaten":'-',
       		  "general_comment":'-'
	    }

	};
	for(const day of Object.keys(initial_state)){
			initial_state[day] = blank_properties
	}
	return initial_state;
}