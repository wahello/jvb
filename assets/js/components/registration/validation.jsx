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

	if(!values.re_password ||
		values.re_password !== values.password){
		errors.re_password = "Password doesn't match";
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

	if(!values.date_of_birth){
		errors.date_of_birth = "Date of birth is required";
	}

	if(!values.feet || values.feet === 'feet'){
		errors.feet = "Feet is required";
	}

	if(!values.inches || values.inches === 'inches'){
		errors.inches = "Inches is required";
	}

	if(!values.weight || values.weight === 'weight'){
		errors.weight = "weight is required";
	}

	

	if(!values.gender){
		errors.gender = "Gender is required";
	}

	return errors;
}

export function goals_validate(values){
	const errors = {};

	if(!values.terms_conditions){
		errors.terms_conditions = "Please accept terms and conditions";
	}

	if(!values.sleep_goal){
		errors.sleep_goal = "Sleep goal is required";
	}

	if(!values.sleep_hours || values.sleep_hours === 'Hours'){
		errors.sleep_hours = "Hours is required";
	}

	if(!values.sleep_minutes || values.sleep_minutes === 'Minutes'){
		errors.sleep_minutes = "Minutes is required";
	}

	

	return errors;
}
