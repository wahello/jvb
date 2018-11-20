export function account_validate(values){
	const errors = {};

	if(!values.username){
		errors.username = "Username is required";
	}

	if(!values.email){
		errors.email = "Email is Required";
	}

	if(!values.password){
		errors.password = "Password is required";
	}

	if(values.password && values.password.length < 6){
		errors.password = "Password is too weak";
	}

	
	return errors;
}

export function personal_validate(values){
	const errors = {};

	if(!values.first_name || values.first_name.length < 2){
		errors.first_name = "First name must be atleast 2 character";
	}

	if(!values.last_name || values.last_name.length < 2){
		errors.last_name = "Last name must be atleast 2 character";
	}

	if(!values.dob_month || values.dob_month === 'Month'){
		errors.dob_month = "month  required";
	}

	if(!values.dob_day || values.dob_day === 'Date'){
		errors.dob_day = "date required";
	}

	if(!values.dob_year || values.dob_year === 'Year'){
		errors.dob_year = "year  required";
	}

	// if(!values.feet || values.feet === 'Feet'){
	// 	errors.feet = "Feet is required";
	// }

	// if(values.inches == null || values.inches == undefined || values.inches === 'Inches'){
	// 	errors.inches = "Inches is required";
	// }

	// if(!values.weight || values.weight === 'Weight'){
	// 	errors.weight = "weight is required";
	// }

	

	if(!values.gender){
		errors.gender = "Gender is required";
	}

	return errors;
}

// export function goals_validate(values){
// 	const errors = {};

// 	if(!values.terms_conditions){
// 		errors.terms_conditions = "Please accept terms and conditions";
// 	}

// 	if(!values.sleep_goal){
// 		errors.sleep_goal = "Sleep goal is required";
// 	}

// 	if(!values.sleep_hours || values.sleep_hours === 'Hours'){
// 		errors.sleep_hours = "Hours is required";
// 	}

// 	if(!values.sleep_minutes || values.sleep_minutes === 'Minutes'){
// 		errors.sleep_minutes = "Minutes is required";
// 	}

	

// 	return errors;
// }
