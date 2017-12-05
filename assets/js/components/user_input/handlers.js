export function handleChange(event){
  const target = event.target;
  const value = target.value;
  const name = target.name;
  this.setState({
	[name]: value
  });
}

export function handleChangeSleepBedTime(date){
  const name = event.target.name;
  this.setState({
      sleep_bedtime: date
    });
}

export function handleChangeSleepAwakeTime(date){
  const name = event.target.name;
  this.setState({
      sleep_awake_time: date
    });
}

export function handleChangeWorkoutDone(event){
  const value = event.target.value;
  if(value === 'no' || value === 'not yet'){
      this.setState({
        workout:value,
        workout_type:'',
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
        workout_comment:''
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
      food_ate_before_workout:''
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
                     'high carb','ketogenic diet','whole foods/mostly unprocessed'];
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