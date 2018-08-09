import moment from 'moment';
	
export function getInitialState(start_dt, end_dt){
	start_dt = moment(start_dt);
	end_dt = moment(end_dt);
	var initial_state = {};
	initial_state[end_dt.format('M-D-YY')] = {};

	var diff = end_dt.diff(start_dt, 'days');

	let tmp_end_date = moment(end_dt);
	for(var i=0; i<diff; i++){
		var dt = tmp_end_date.subtract(1,'days');
		var current_dt = dt.format('M-D-YY');
		initial_state[current_dt]={};
 	}
 		 	
	let blank_properties={
		"created_at":'', 	
		"grades_ql":{
		    "overall_health_grade": '-',
	        "overall_health_gpa": '-',
	        "movement_non_exercise_steps_grade": '-',
	        "movement_non_exercise_steps":'-',
	        "movement_consistency_grade": '-',
	        "movement_consistency_score":'-',
	        "avg_sleep_per_night_grade": '-',
	        "avg_sleep_per_night": '-',
	        "exercise_consistency_grade": '-',
	        "workout_today":"-",
	        "exercise_consistency_score":'-',
	        "prcnt_unprocessed_food_consumed_grade": '-',
	        "prcnt_unprocessed_food_consumed":'-',
	        "alcoholic_drink_per_week_grade": '-',
	        "alcoholic_drink_per_week": '-',
	        "sleep_aid_penalty":'-',
	        "ctrl_subs_penalty":'-',
	        "smoke_penalty":'-',
	        "overall_health_gpa_before_panalty":'-',
	        "submitted_user_input":"-",	        
	        "movement_non_exercise_steps_gpa":'-',
	        "movement_consistency_points":'-',
	        "avg_sleep_per_night_gpa":'-',
	        "exercise_consistency_points":'-',
			"prcnt_unprocessed_food_consumed_gpa":'-',
	        "alcoholic_drink_per_week_gpa":'-',
	        "sleep_aid_penalty_points":'-',
	        "ctrl_subs_penalty_points":'-',
	        "smoke_penalty_points":'-',
	        "total_points":'-',


	        
	     //    "resting_hr":'-',
	     //    "stress_level":'-',  
	     //    "stand_three_hours":'-',

	     //    "overall_workout_grade":"-",
	     //    "overall_workout_score":"-",
		    // "workout_duration_grade":"-",
		    // "workout_duration":"-",
		    // "workout_effortlvl_grade":"-",
		    // "workout_effortlvl":"-",
		    // "avg_exercise_hr_grade":"-",
		    // "avg_exercise_hr":"-",
		    // "time_to_99":"-",
		    // "lowest_hr_first_minute":"-",
		    // "vo2_max":"-",
		    // "floor_climed":"-",
		},
		"exercise_reporting_ql": {
	        "workout_easy_hard": '-',
	        "workout_type": '-',
	        "workout_time": '-',
	        "workout_location": '-',
	        "workout_duration": '-',
	        "maximum_elevation_workout": '-',
	        "minutes_walked_before_workout": '-',
	        "distance_run": '-',
	        "distance_bike":'-',
	        "distance_swim":'-',
	        "distance_other":'-',
	        "pace": '-',
	        "avg_heartrate": '{}',
	        "avg_exercise_heartrate":'',
	        "elevation_gain": '-',
	        "elevation_loss": '-',
	        "effort_level": '-',
	        "dew_point": '-',
	        "temperature": '-',
	        "humidity": '-',
	        "temperature_feels_like": '-',
	        "wind": '-',
	        "hrr_time_to_99": '-',
	        "hrr_starting_point": '-',
	        "lowest_hr_during_hrr":'-',
	        "hrr_beats_lowered_first_minute": '-',
	        "resting_hr_last_night": '-',
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
	        "heartrate_variability_stress": '-',
	        "fitness_age":'-',
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
	    	"movement_consistency": '-',
	        "non_exercise_steps": '-',
	        "exercise_steps": '-',
	        "total_steps": '-',
	        "floor_climed": '-',
	        "weight":'-'
	    },
	    "sleep_ql": {
	    	  "sleep_per_user_input": '-',
	    	   "sleep_comments": '-',
	           "sleep_aid": '-',
	    	   "resting_heart_rate":'-',
	           "sleep_per_wearable": '-',
	           "sleep_bed_time": '-',
	           "sleep_awake_time": '-',
	           "nap_duration":'-',
		       "nap_start_time":'-',
		       "nap_end_time":'-',
		       "nap_comment":'-',
	           "deep_sleep": '-',
	           "light_sleep": '-',
	           "awake_time": '-',
	           "rem_sleep": '-'
	       
	    },
	    "food_ql": {
	        "prcnt_non_processed_food": '-',
	        "processed_food_consumed":'-',
	        "non_processed_food": '-',
	        "diet_type": '-'
	    },
	    "alcohol_ql": {
	        "alcohol_day": '-',
	        "alcohol_week": '-' 
	    }


	};
	for(const day of Object.keys(initial_state)){
			initial_state[day] = blank_properties
	}
	return initial_state;
}