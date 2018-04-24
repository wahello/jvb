export function handleChange(event){
  const target = event.target;
  const value = target.value;
  const name = target.name;
  this.setState({
	[name]: value
  }); 
}


export function handleChangeWorkoutType(event){
  const name = event.target.name;
  const value = event.target.value;
  if(value != "strength" && value != "both"){
    this.setState({
      [name]:value,
      strength_workout_start_hour:'',
      strength_workout_start_min:'',
      strength_workout_start_am_pm:'',
      strength_workout_end_hour:'',
      strength_workout_end_min:'',        
      strength_workout_end_am_pm:'',
    })
  }
  else{
    this.setState({
      [name]:value
    })
  }
}

export function handleChangeSleepLast(event){
 const target = event.target;
  const value = target.value;
  const name = target.name;
  this.setState({
  [name]: value
  },()=>{
    let duration = this.getTotalSleep();
     if(duration)
    {  
      let hours = duration.split(":")[0];
      let mins = duration.split(":")[1];
      this.setState({
        sleep_hours_last_night:hours,
        sleep_mins_last_night:mins
      })
    }
  });
}

export function handleChangeSleepBedTime(date){
  this.setState({
    sleep_bedtime_date:date
    },()=>{
    let duration = this.getTotalSleep();
     if(duration)
    {  
      let hours = duration.split(":")[0];
      let mins = duration.split(":")[1];

      this.setState({
        sleep_hours_last_night:hours,
        sleep_mins_last_night:mins
      })
    }
  });

}

export function handleChangeSleepHoursMin(event){
  const value = event.target.value;
  const name = event.target.name;
  this.setState({
  [name]: value
  },()=>{
    let duration = this.getTotalSleep();
     if(duration)
    {  
      let hours = duration.split(":")[0];
      let mins = duration.split(":")[1];
      this.setState({
        sleep_hours_last_night:hours,
        sleep_mins_last_night:mins
      })
    }
  });
}

export function handleChangeSleepAwakeTime(date){
  const name = event.target.name;
  this.setState({
      sleep_awake_time_date: date,
    },()=>{
    let duration = this.getTotalSleep();
    if(duration)
    {  
      let hours = duration.split(":")[0];
      let mins = duration.split(":")[1];
      this.setState({
        sleep_hours_last_night:hours, 
        sleep_mins_last_night:mins
      })
    }
  });
}

export function handleChangeWorkoutDone(event){
  const value = event.target.value;
  if(value === 'no' || value === 'not yet'){
      this.setState({
        workout:value,
        no_exercise_reason:'',
        no_exercise_comment:'',
        workout_type:'',
        strength_workout_start_hour:'',
        strength_workout_start_min:'',
        strength_workout_start_am_pm:'',
        strength_workout_end_hour:'',
        strength_workout_end_min:'',        
        strength_workout_end_am_pm:'',
        workout_input_type:'',
        workout_easy:'',
        workout_effort:'',
        workout_effort_hard_portion:'',
        workout_enjoyable:'',
        pain:'',
        pain_area:'',
        water_consumed:'',
        breath_nose:'',
        chia_seeds:'',
        calories:'',
        calories_item:'',
        fasted:'', 
        food_ate_before_workout:'',         
        workout_comment:'',
        measured_hr:'',
        hr_down_99:'',
        time_to_99_min:'',
        time_to_99_sec:'',
        hr_level:'',
        lowest_hr_first_minute:'',
        lowest_hr_during_hrr:'',
        time_to_lowest_point_min:'',
        time_to_lowest_point_sec:'',
        indoor_temperature:'',
        outdoor_temperature:'',
        temperature_feels_like:'',
        wind:'',
        dewpoint:'',
        humidity:'',
        weather_comment:''
    });
  }else{
    this.setState({
      workout:value
    });
  }
}

export function handleChangeWorkout(event){
  const target = event.target;
  const value = target.value;
  const name = target.name;

  this.setState({
	  workout_easy:value
	});
}

export function handleChangeWorkoutEffort(event){
  const target = event.target;
  const value = target.value;
  const name = target.name;

  this.setState({
	workout_effort:value,
  });
}

export function handleChangePain(event){
  const target = event.target;
  const value = target.value;
  if (value === 'no'){
    this.setState({
    	pain:value,
      pain_area:''
    });
  }else{
    this.setState({
      pain:value
    });
  }
}

export function handleChangeProcessedFood(event){
  const target = event.target;
  const value = target.value;
  const name = target.name;

  if(value > 0){
    this.setState({
    	prcnt_processed_food:value
    });
  }else{
    this.setState({
      prcnt_processed_food:value,
      unprocessed_food_list:'',
      processed_food_list:''
    });
  }
}


export function handleChangeSick(event){
  const target = event.target;
  const value = target.value;
  const name = target.name;

  if(value === 'yes'){
    this.setState({
  	sick:value
    });
  }else{
    this.setState({
      sick:value,
      sickness:''
    })
  }
}
export function handleChangeHrr(event){
  const target = event.target;
  const value = target.value;
  const name = target.name;

  if(value === 'yes'){
    this.setState({
    measured_hr:value
    });
  }else{
    this.setState({
      measured_hr:value,
      hr_down_99:'',
      time_to_99_min:'',
      time_to_99_sec:'',
      hr_level:'',
      lowest_hr_first_minute:'',
      lowest_hr_during_hrr:'',
      time_to_lowest_point_min:'',
      time_to_lowest_point_sec:'',
          })
  }
}
export function handleChangeSleepAids(event){
  const target = event.target;
  const value = target.value;
  const name = target.name;
  if(value === 'yes'){
    this.setState({
  	prescription_sleep_aids:value
    });
  }else{
    this.setState({
      prescription_sleep_aids:value,
      sleep_aid_taken:''
    });
  }
}

export function handleChangePrescription(event){
  const target = event.target;
  const value = target.value;
  const name = target.name;

  if(value==='yes'){
    this.setState({
  	 medications:value
    });
  }else{
    this.setState({
      medications:value,
      medications_taken_list:'',
      controlled_uncontrolled_substance:''
    });
  }
}

export function handleChangeFasted(event){
  const target = event.target;
  const value = target.value;
  const name = target.name;

  if(value === 'yes'){
    this.setState({
  	  fasted:value,
      food_ate_before_workout:'Nothing'
    });
  }else{
    this.setState({
      fasted:value
    });
  }
}

export function handleChangeDietModel(event){
  const target = event.target;
  const value = target.value;
  const name = target.name;
  const DIET_TYPE = ['','vegan','vegetarian','paleo','low carb/high fat',
                     'high carb','ketogenic diet','whole foods/mostly unprocessed','pescetarian'];
  let other_diet = true;
  for(let diet of DIET_TYPE){
    if(value === diet)
      other_diet = false;
  }

  this.setState({
  diet_to_show:other_diet ? 'other' : value,
	diet_type:value
  });
}

export function handleChangeTravelPurpose(event){
  const target = event.target;
  const value = target.value;
  const name = target.name;
  const TRAVEL_PURPOSE = ['','work','vacation']
  let travel_purpose_other =true;
  for(let travel of TRAVEL_PURPOSE){
    if(value === travel)
      travel_purpose_other = false;
  }
if(value == 'other')
  this.setState({
  travel_purpose:'',
  travel_purpose_checked:travel_purpose_other?'other':value,
  });
else
  this.setState({
  [name]: value,
  travel_purpose_checked:value
  });
}


export function handleChangeSmokeSubstance(event){
  const target = event.target;
  const value = target.value;
  const name = target.name;

  if(value === 'yes'){
    this.setState({
  	smoke_substances:value
    });
  }else{
    this.setState({
      smoke_substances:value,
      smoked_substance_list:''
    });
  }
}

export function handleChangeAlcoholDrink(event){
  const value = event.target.value;

  if(value <= 0){
    this.setState({
      alchol_consumed:0,
      alcohol_drink_consumed_list:''
    });
  }else{
    this.setState({
      alchol_consumed:value
    });
  }
}

export function handleCaloriesItemCheck(){
  if(this.state.calories_item_check){
    this.setState({
      calories_item_check:!this.state.calories_item_check,
      calories:'',
      calories_item:''
    });
  }
  else{
    this.setState({
      calories_item_check:!this.state.calories_item_check
    });
  }
}

export function handleWeatherCheck(){
  if(this.state.weather_check){
    this.setState({
      weather_check:!this.state.weather_check,
      indoor_temperature:'',
      outdoor_temperature:'',
      temperature_feels_like:'',
      wind:'',
      dewpoint:'',
      humidity:'',
      weather_comment:''
    });
  }
  else{
    this.setState({
      weather_check:!this.state.weather_check
    })
  }
}
export function handleChangeNoExerciseReason(event){
  const target = event.target;
  const value = target.value;
  const name = target.name;
if(value === 'sick'){
  this.setState({
   sick:'yes',
   no_exercise_reason:value,
  });
}
else{
  this.setState({    
   no_exercise_reason:value,
  });
}
}

export function handleQuickReportPreSubmit(){
  if(this.state.report_type == 'quick'){
    this.setState({
      workout:'',
      no_exercise_reason:'',
      no_exercise_comment:'',
      workout_type:'',
      strength_workout_start_hour:'',
      strength_workout_start_min:'',
      strength_workout_start_am_pm:'',
      strength_workout_end_hour:'',
      strength_workout_end_min:'',
      strength_workout_end_am_pm:'',
      workout_input_type:'',
      workout_easy:'',
      workout_effort:'',
      workout_effort_hard_portion:'',
      unprocessed_food_list:'',
      processed_food_list:'',
      alcohol_drink_consumed_list:'',
      sleep_comment:'',
      sleep_aid_taken:'',
      smoked_substance_list:'',
      medications:'',
      medications_taken_list:'',
      indoor_temperature:'',
      outdoor_temperature:'',
      temperature_feels_like:'',
      wind:'',
      dewpoint:'',
      humidity:'',
      weather_comment:'',
      stress:'',
      pain:'',
      water_consumed:'',
      breath_nose:'',
      pain_area:'',
      measured_hr:'',
      hr_down_99:'',
      time_to_99_min:'',
      time_to_99_sec:'',
      hr_level:'',
      lowest_hr_first_minute:'',
      lowest_hr_during_hrr:'',
      time_to_lowest_point_sec:'',
      time_to_lowest_point_min:'',
      food_consumed:'',
      chia_seeds:'',
      fasted:'',
      food_ate_before_workout:'',
      calories:'',
      calories_item:'',
      workout_enjoyable:'',
      workout_comment:'',
      weight:'',
      waist:'',
      clothes_size:'',
      heart_variability:'',
      sick:'',
      sickness:'',
      stand:'',
      breath_sleep:'',
      breath_day:'',
      diet_type:'',
      travel:'',
      travel_destination:'',
      travel_purpose:'',
      general_comment:''
    });
  }
}

