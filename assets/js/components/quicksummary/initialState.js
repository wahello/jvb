import moment from 'moment';
	
export function getInitialState(start_dt, end_dt=undefined){
	// expect moment objects
	if (end_dt === undefined){
		end_dt = new moment(start_dt).add(6,'days'); 
	}
	var initial_state = {};

	initial_state[start_dt.format('YYYY-MM-DD')] = {}

	var diff = end_dt.diff(start_dt, 'days');
	for(var i=0; i<diff; i++){
		var dt = start_dt.add(1,'days');
		var current_dt = dt.format('YYYY-MM-DD');
		initial_state[current_dt]={};
 	}
	 	
	let blank_properties={
		"created_at":'',	
		"grades_ql":{
			    "overall_truth_grade": '-',
		        "overall_truth_health_gpa": '-',
		        "movement_non_exercise_grade": '-',
		        "movement_consistency_grade": '-',
		        "avg_sleep_per_night_grade": '-',
		        "exercise_consistency_grade": '-',
		        "overall_workout_grade": '-',
		        "prcnt_non_processed_food_consumed_grade": '-',
		        "alcoholic_drink_per_week_grade": '-',
		        "penalty": '-'

		},
		"exercise_reporting_ql": {
	        "workout_easy_hard": '-',
	        "workout_type": '-',
	        "workout_time": '-',
	        "workout_location": '-',
	        "workout_duration": '-',
	        "maximum_elevation_workout": '-',
	        "minutes_walked_before_workout": '-',
	        "distance": '-',
	        "pace": '-',
	        "avg_heartrate": '-',
	        "elevation_gain": '-',
	        "elevation_loss": '-',
	        "effort_level": '-',
	        "dew_point": '-',
	        "temperature": '-',
	        "humidity": '-',
	        "temperature_feels_like": '-',
	        "wind": '-',
	        "hrr": '-',
	        "hrr_start_point": '-',
	        "hrr_beats_lowered": '-',
	        "sleep_resting_hr_last_night": '-',
	        "vo2_max": '-',
	        "running_cadence": '-',
	        "nose_breath_prcnt_workout": '-',
	        "water_consumed_workout": '-',
	        "chia_seeds_consumed_workout": '-',
	        "fast_before_workout": '-',
	        "pain": '-',
	        "pain_area": '-',
	        "stress_level":'-',
	        "sick": '-',
	        "drug_consumed": '-',
	        "drug": '-',
	        "medication": '-',
	        "smoke_substance": '-',
	        "exercise_fifteen_more": '-',
	        "workout_elapsed_time": '-',
	        "timewatch_paused_workout": '-',
	        "exercise_consistency":'-',
	        "workout_duration_grade": '-',
	        "workout_effortlvl_grade": '-',
	        "avg_heartrate_grade": '-',
	        "overall_workout_grade": '-',
	        "heartrate_variability_grade": '-',
	        "workout_comment": '-'
	    },
	    "swim_stats_ql": {    
	        "pace_per_100_yard": '-',
	        "total_strokes": '-'
	    },
	     "bike_stats_ql": {
	        "avg_speed": '-',
	        "avg_power": '-',
	        "avg_speed_per_mile": '-',
	        "avg_cadence": '-',
	    },
	    "steps_ql": {
	        "non_exercise_steps": '-',
	        "exercise_steps": '-',
	        "total_steps": '-',
	        "floor_climed": '-',
	        "floor_decended": '-',
	        "movement_consistency": '-',
	    },

	    "sleep_ql": {
	        "sleep_per_wearable": '-',
	        "sleep_per_user_input": '-',
	        "sleep_aid": '-',
	        "sleep_bed_time": '-',
	        "sleep_awake_time": '-',
	        "deep_sleep": '-',
	        "light_sleep": '-',
	        "awake_time": '-'
	    },
	    "food_ql": {
	        "prcnt_non_processed_food": '-',
	        "prcnt_non_processed_food_grade": '-',
	        "non_processed_food": '-',
	        "diet_type": '-'
	    },
	    "alcohol_ql": {
	        "alcohol_day": '-',
	        "alcohol_week": '-' 
	    },
	    "strong_input":{	    	
	    	"workout":'-',
	    	"workout_easy":'-',
	    	"workout_effort":'-',
	    	"is_workout_hard":'-',
            "workout_effort_hard_portion":'-',
            "prcnt_processed_food":'-',
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
	    	 "stress":'-',
	    	 "pain":'-',
        	 "pain_area":'-',
        	 "water_consumed":'-',
        	 "breath_nose":'-'
	    },
	    "optional_input":{
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