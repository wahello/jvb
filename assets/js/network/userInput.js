/*
	Format of json data API is expecting
*/

import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3}); 

function formatJSON(data){
	/* This function will format the form
		 data into JSON acceptable by API.
		 example - 
		 
		 {
		 	"creatd_at":"2017-9-13",
			"strong_input":
			{
				"work_out_easy_or_hard":"Hard",
				"work_out_effort_level":8,
				"unprocessed_food_consumed_yesterday":50,
				"number_of_alcohol_consumed_yesterday":6.5,
				"sleep_aids_last_night":"Yes",
				"prescription_or_non_prescription_sleep_aids_last_night":"No",
				"smoke_any_substances_whatsoever":"Yes",
				"medications_or_controlled_substances_yesterday":"No"
			},

			"encouraged_input":
			{
				"stress_level_yesterday":"Medium",
				"pains_twings_during_or_after_your_workout":"Yes",
				"water_consumed_during_workout":100,
				"workout_that_user_breathed_through_nose":50,
				"pain_area":"leg"
			},

			"optional_input":
			{
				"list_of_processed_food_consumed_yesterday":"apple",
				"chia_seeds_consumed_during_workout":15,
				"fasted_during_workout":"Yes",
				"general_Workout_Comments":"I'm lovin' it!",
				"weight":60,
				"waist_size":30,
				"clothes_size":10,
				"heart_rate_variability":30,
				"sick":"Yes",
				"sick_comment":"I'm verrrrry sick!!",
				"stand_for_three_hours":"Yes",
				"percent_breath_nose_last_night":90,
				"percent_breath_nose_all_day_not_exercising":85
			}

		}

	*/
	const d = data.created_at.getDate();
    const m = data.created_at.getMonth()+1;
    const y = data.created_at.getFullYear();
    const created_at = y+"-"+m+"-"+d;

	let json_data = {
		"created_at":created_at,
		"strong_input":{},
		"encouraged_input":{},
		"optional_input":{}
	};
	
	json_data.strong_input['work_out_easy_or_hard'] = data.work_out_easy; 
	json_data.strong_input['work_out_effort_level'] = data.workout_effort; 
	json_data.strong_input['unprocessed_food_consumed_yesterday'] = data.unprocessed_food; 
	json_data.strong_input['number_of_alcohol_consumed_yesterday'] = data.alchol_consumed; 
	json_data.strong_input['sleep_aids_last_night'] = data.sleep_aids;
	json_data.strong_input['prescription_or_non_prescription_sleep_aids_last_night'] = data.prescription_sleep_aids; 
	json_data.strong_input['smoke_any_substances_whatsoever'] = data.substances; 
	json_data.strong_input['medications_or_controlled_substances_yesterday'] = data.medications; 

	json_data.encouraged_input['stress_level_yesterday'] = data.stress; 
	json_data.encouraged_input['pains_twings_during_or_after_your_workout'] = data.pain_select; 
	json_data.encouraged_input['water_consumed_during_workout'] = data.water_consumed; 
	json_data.encouraged_input['workout_that_user_breathed_through_nose'] = data.nose; 
	json_data.encouraged_input['pain_area'] = data.pain; 

	json_data.optional_input['list_of_processed_food_consumed_yesterday'] = data.food_consumed; 
	json_data.optional_input['chia_seeds_consumed_during_workout'] = data.chia_seeds; 
	json_data.optional_input['fasted_during_workout'] = data.fasted; 
	json_data.optional_input['general_Workout_Comments'] = data.comment; 
	json_data.optional_input['weight'] = data.weight; 
	json_data.optional_input['waist_size'] = data.waist; 
	json_data.optional_input['clothes_size'] = data.clothes; 
	json_data.optional_input['heart_rate_variability'] = data.heart; 
	json_data.optional_input['sick'] = data.sick;
	json_data.optional_input['sick_comment'] = data.sick_comment; 
	json_data.optional_input['stand_for_three_hours'] = data.stand;
	json_data.optional_input['percent_breath_nose_last_night'] = data.breath_sleep; 
	json_data.optional_input['percent_breath_nose_all_day_not_exercising'] = data.breath_day;

	return json_data;
}

export function userDailyInputSend(data, callback=undefined){
	// this function will send the data to the api 
	const URL = 'users/daily_input/';
	const config = {
		url : URL,
		data : formatJSON(data),
		method : 'post',
		withCredentials: true,
		headers:{
			'Content-Type': 'application/json'				
		}
	};
	axios(config).then(function(response){
		alert("User Input submitted successfully!");
		if(callback != undefined){
			callback();
		}
	}.bind(this)).catch((error) => {
		console.log(error);
		console.log(error.message);
	});
}