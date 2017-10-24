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
		errors.first_name = "Name must be atleast 2 character";
	}

	if(!values.last_name || values.last_name.length < 2){
		errors.last_name = "Name must be atleast 2 character";
	}

	if(values.first_name && values.first_name.length > 20){
		errors.first_name = "Name must be less than 20 character";
	}

	if(values.last_name && values.last_name.length > 20){
		errors.last_name = "Name must be less than 20 character";
	}

	if(!values.date_of_birth){
		errors.date_of_birth = "Birthday is required";
	}

	if(!values.height){
		errors.height = "Height is required";
	}

	if(values.height){
		//Restricting height from 3-9 ft only
		const patt = /^(:?[3-9])'(:?\s*(?:(:?1[01])|[0-9])(?:'|")?)?$/;
		if(!patt.test(values.height)){
			errors.height = "Enter valid height eg. 5'11 or 5'";
		}
	}

	if(!values.weight){
		errors.weight = "Weight is required";
	}

	if(!values.gender){
		errors.gender = "Gender is required";
	}

	return errors;
}

export function goals_validate(values){
	const errors = {};

	if(!values.sleep_goal){
		errors.sleep_goal = "Sleep goal is required";
	}

	if(values.sleep_goal && values.sleep_goals > 24){
		errors.sleep_goal = "Sleep goal should be less than 24";
	}

	return errors;
}
