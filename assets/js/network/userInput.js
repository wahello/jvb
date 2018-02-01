import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';
import 'moment-timezone';

axiosRetry(axios, { retries: 3}); 

function formatJSON(data){   
	/* This function will format the form
		 data into JSON acceptable by API.
		 example - 
		 {
		    "user": 1,
		    "created_at": "2017-10-04",
		    "updated_at": "2017-10-04T18:25:23.129221Z",
		    "timezone": "America/New_York",
		    "strong_input": {
		        "id": 1,
		        "user_input": 18,
		        "workout":"yes",
		        "no_exercise_reason":"sick",
		        "no_exercise_comment":"sick of cold",
		        "workout_type":"cardio",
		        "workout_input_type":"strength",
		        "work_out_easy_or_hard": "easy",
		        "workout_effort_level": 5,
		        "hard_portion_workout_effort_level": 8,
		        "prcnt_unprocessed_food_consumed_yesterday": 20,
		        "list_of_unprocessed_food_consumed_yesterday": "some unprocessed food",
		        "list_of_processed_food_consumed_yesterday": "some processed food",
		        "number_of_alcohol_consumed_yesterday": 2.5,
		        "alcohol_drink_consumed_list":"beer",
		        "sleep_time_excluding_awake_time": "7:10",
		        "sleep_bedtime": 2017-12-01T010:30, 
			    "sleep_awake_time": 2017-12-02T06:30,
			    "awake_time":0:30, 
		        "sleep_comment":"Some sleep comment",
		        "prescription_or_non_prescription_sleep_aids_last_night": "yes",
		        "sleep_aid_taken": "some prescription",
		        "smoke_any_substances_whatsoever": "yes",
		        "smoked_substance": "cigarettes(7)",
		        "prescription_or_non_prescription_medication_yesterday": "yes",
		        "prescription_or_non_prescription_medication_taken": "some prescription",
		        "controlled_uncontrolled_substance":"yes",
		        "indoor_temperature":"80",
		        "outdoor_temperature":"85",
		        "temperature_feels_like":"82",
		        "wind":"6",
		        "dewpoint":"18",
		        "humidity":"61",
		        "weather_comment":"Awesome weather"
		    },	
		    "encouraged_input": {
		        "id": 1,
		        "user_input": 18,
		        "stress_level_yesterday": "medium",
		        "pains_twings_during_or_after_your_workout": "yes", 
		        "water_consumed_during_workout": 58,
		        "workout_that_user_breathed_through_nose": 90,
		        "pain_area": "right shins",
		        "measured_hr":"yes",
				"hr_down_99":"yes",
				"time_to_99":"1:06",
				"hr_level":"90",
				"lowest_hr_first_minute":"80",
				"lowest_hr_during_hrr":"76",
				"time_to_lowest_point":"0:52"
		    },
		    "optional_input": {
		        "id": 1,
		        "user_input": 18,
		        "list_of_processed_food_consumed_yesterday": "some processed food",
		        "chia_seeds_consumed_during_workout": 3,
		        "fasted_during_workout": "yes",
		        "food_ate_before_workout": "apple, riceball",
		        "calories_consumed_during_workout": 5,
		        "food_ate_during_workout": "some item consumed",
		        "workout_enjoyable": "yes",
		        "general_Workout_Comments": "workout comment",
		        "weight": 70,
		        "waist_size": 30,
		        "clothes_size": 6,
		        "heart_rate_variability": 60,
		        "sick": "yes",
		        "sickness": "cold, since one week",
		        "stand_for_three_hours": "yes",
		        "percent_breath_nose_last_night": 90,
		        "percent_breath_nose_all_day_not_exercising": 90,
		        "type_of_diet_eaten": "paleo",
		        "general_comment":"Some comment"
		    }
	}
	*/
	const d = data.selected_date.getDate();
    const m = data.selected_date.getMonth()+1;
    const y = data.selected_date.getFullYear();
    const created_at = y+"-"+m+"-"+d;

	let json_data = {
		"created_at":created_at,
		"timezone":moment.tz.guess(),
		"strong_input":{},   
		"encouraged_input":{},
		"optional_input":{}
	};
	json_data.strong_input['workout'] = data.workout;
	json_data.strong_input['no_exercise_reason'] = data.no_exercise_reason,
	json_data.strong_input['no_exercise_comment'] = data.no_exercise_comment,
	json_data.strong_input['workout_type'] = data.workout_type;
	json_data.strong_input['workout_input_type'] = data.workout_input_type;
	json_data.strong_input['work_out_easy_or_hard'] = data.workout_easy; 
	json_data.strong_input['workout_effort_level'] = data.workout_effort; 
	json_data.strong_input['hard_portion_workout_effort_level'] = data.workout_effort_hard_portion;
	json_data.strong_input['prcnt_unprocessed_food_consumed_yesterday'] = data.prcnt_processed_food;
	json_data.strong_input['list_of_unprocessed_food_consumed_yesterday'] = data.unprocessed_food_list; 
	json_data.strong_input['list_of_processed_food_consumed_yesterday'] =data.processed_food_list;
	json_data.strong_input['number_of_alcohol_consumed_yesterday'] = data.alchol_consumed; 
	json_data.strong_input['alcohol_drink_consumed_list'] = data.alcohol_drink_consumed_list;
	json_data.strong_input['sleep_time_excluding_awake_time'] = data.sleep_hours_last_night+":"+data.sleep_mins_last_night;
	json_data.strong_input['sleep_bedtime'] = data.sleep_bedtime;
	json_data.strong_input['sleep_awake_time'] = data.sleep_awake_time;
	json_data.strong_input['awake_time'] = data.awake_hours+":"+data.awake_mins;
	json_data.strong_input['sleep_comment'] = data.sleep_comment;
	json_data.strong_input['sleep_aid_taken'] = data.sleep_aid_taken;
	json_data.strong_input['prescription_or_non_prescription_sleep_aids_last_night'] = data.prescription_sleep_aids; 
	json_data.strong_input['smoke_any_substances_whatsoever'] = data.smoke_substances;
	json_data.strong_input['smoked_substance'] = data.smoked_substance_list;
	json_data.strong_input['prescription_or_non_prescription_medication_yesterday'] = data.medications; 
	json_data.strong_input['prescription_or_non_prescription_medication_taken'] = data.medications_taken_list; 
	json_data.strong_input['controlled_uncontrolled_substance'] = data.controlled_uncontrolled_substance;
	json_data.strong_input['indoor_temperature'] = data.indoor_temperature,
	json_data.strong_input['outdoor_temperature'] = data.outdoor_temperature,
	json_data.strong_input['temperature_feels_like'] = data.temperature_feels_like,
	json_data.strong_input['wind'] = data.wind,
	json_data.strong_input['dewpoint'] = data.dewpoint,
	json_data.strong_input['humidity'] = data.humidity,
	json_data.strong_input['weather_comment'] = data.weather_comment

	json_data.encouraged_input['stress_level_yesterday'] = data.stress; 
	json_data.encouraged_input['pains_twings_during_or_after_your_workout'] = data.pain; 
	json_data.encouraged_input['water_consumed_during_workout'] = data.water_consumed; 
	json_data.encouraged_input['workout_that_user_breathed_through_nose'] = data.breath_nose; 
	json_data.encouraged_input['pain_area'] = data.pain_area; 
	json_data.encouraged_input['measured_hr'] = data.measured_hr;
	json_data.encouraged_input['hr_down_99'] = data.hr_down_99;
	json_data.encouraged_input['time_to_99'] = data.time_to_99_min+":"+data.time_to_99_sec;
	json_data.encouraged_input['hr_level'] = data.hr_level;
	json_data.encouraged_input['lowest_hr_first_minute'] = data.lowest_hr_first_minute;
	json_data.encouraged_input['lowest_hr_during_hrr'] = data.lowest_hr_during_hrr;
	json_data.encouraged_input['time_to_lowest_point'] = data.time_to_lowest_point_min+":"+data.time_to_lowest_point_sec;

	json_data.optional_input['list_of_processed_food_consumed_yesterday'] = data.food_consumed; 
	json_data.optional_input['chia_seeds_consumed_during_workout'] = data.chia_seeds; 
	json_data.optional_input['fasted_during_workout'] = data.fasted; 
	json_data.optional_input['food_ate_before_workout'] = data.food_ate_before_workout; 
	json_data.optional_input['calories_consumed_during_workout'] = data.calories;
	json_data.optional_input['food_ate_during_workout'] = data.calories_item;
	json_data.optional_input['workout_enjoyable'] = data.workout_enjoyable;
	json_data.optional_input['general_Workout_Comments'] = data.workout_comment;
	json_data.optional_input['weight'] = data.weight; 
	json_data.optional_input['waist_size'] = data.waist; 
	json_data.optional_input['clothes_size'] = data.clothes_size; 
	json_data.optional_input['heart_rate_variability'] = data.heart_variability; 
	json_data.optional_input['sick'] = data.sick;
	json_data.optional_input['sickness'] = data.sickness; 
	json_data.optional_input['stand_for_three_hours'] = data.stand;
	json_data.optional_input['percent_breath_nose_last_night'] = data.breath_sleep; 
	json_data.optional_input['percent_breath_nose_all_day_not_exercising'] = data.breath_day;
	json_data.optional_input['type_of_diet_eaten'] = data.diet_type;
	json_data.optional_input['general_comment'] = data.general_comment;
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
		//alert("User Input submitted successfully!");
		if(callback != undefined){
			callback();
		}
	}.bind(this)).catch((error) => {
		console.log(error.message);
	});
}

export function userDailyInputFetch(date, successCallback=undefined, errorCallback=undefined,clone){
	const URL = 'users/daily_input/item/';
	const d = date.getDate();
    const m = date.getMonth()+1;
    const y = date.getFullYear();
    const created_at = y+"-"+m+"-"+d;
	const config = {
		url : URL,
		params:{
   			created_at:created_at
  		},
		method: 'get',
		withCredentials: true
	};
	axios(config).then(function(response){
		if(successCallback != undefined){
			successCallback(response,clone);
		}
	}).catch((error) => {
		if(errorCallback != undefined){
			errorCallback(error);
		}
	});
}

export function userDailyInputUpdate(data,successCallback=undefined, errorCallback=undefined){
	const URL = 'users/daily_input/item/';
	let date = data.fetched_user_input_created_at;
	data = formatJSON(data);
	data['created_at'] = date;
	const config = {
		url : URL,
		data:data,
		method: 'put',
		withCredentials: true
	};
	axios(config).then(function(response){
		if(successCallback != undefined){
			successCallback(response);
		}
	}).catch((error) => {
		console.log(error.message);
		if(errorCallback != undefined){
			errorCallback(error);
		}
	});
}

export function userDailyInputRecentFetch(successCallback=undefined, errorCallback=undefined){
	const URL = 'users/daily_input/item/recent/';
	const config = {
		url : URL,
		method: 'get',
		withCredentials: true
	};
	axios(config).then(function(response){
		if(successCallback != undefined){
			successCallback(response);
		}
	}).catch((error) => {
		if(errorCallback != undefined){
			errorCallback(error);
		}
	});
}

export function fetchGarminData(date, successCallback=undefined, errorCallback=undefined){
	date = moment(date)
	const URL = 'users/daily_input/garmin_data/';
	const config = {
		url : URL,
		method: 'get',
		params:{
			"date":date.format('YYYY-MM-DD')
		},
		withCredentials: true
	};
	axios(config).then(function(response){
		if(successCallback != undefined){
			successCallback(response);
		}
	}).catch((error) => {
		if(errorCallback != undefined){
			errorCallback(error);
		}
	});
}