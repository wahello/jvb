export function handleChange(event){
  const target = event.target;
  const value = target.value;
  const name = target.name;
  this.setState({
	[name]: value
  });
}

export function handleChangeWorkout(event){
  const target = event.target;
  const value = target.value;
  const name = target.name;
  if (value === "no workout today"){
	this.setState({
	  workout_easy:value,
	  workout_effort:value,
	  workout_effort_hard_portion:value,
	  workout_enjoyable:value,
	  pain:value,
	  water_consumed:value,
	  breath_nose:value,
	  chia_seeds:value,
	  calories:'No Workout Today',
	  fasted:value,          
	  calories_item:'No Workout Today',
	  workout_comment:'No Workout Today'
	});
  }else{
	  this.setState({
	  workout_easy:value
	});
  }
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
  const name = target.name;

  this.setState({
	pain:value
  });
}

export function handleChangeUnprocessedFood(event){
  const target = event.target;
  const value = target.value;
  const name = target.name;

  if(value > 0){
    this.setState({
    	prcnt_unprocessed_food:value
    });
  }else{
    this.setState({
      prcnt_unprocessed_food:value,
      unprocessed_food_list:''
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
      medications_taken_list:''
    })
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