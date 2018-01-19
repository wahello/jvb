import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { getTermsConditionStatus } from '../../network/dashboard';
import { Link } from 'react-router-dom';
import NavbarMenu from '../navbar';
import TCPopup from './dashboard_terms_and_conditions';
import { withRouter} from 'react-router-dom';

class Tconditions extends Component{
	constructor(props){
		super(props);
		this.state = {
			terms_condition_accepted:undefined
		};
		this.onTCStatusSuccess = this.onTCStatusSuccess.bind(this);
		this.onTCStatusFailure = this.onTCStatusFailure.bind(this);
		this.renderTCPopup = this.renderTCPopup.bind(this);
	}

	renderTCPopup(){
		if(this.state.terms_condition_accepted == false){
			return(<TCPopup/>)
		}
	}

	onTCStatusSuccess(data){
		this.setState({
			terms_condition_accepted:data.data.terms_conditions
		});
	}

	onTCStatusFailure(error){
		console.log(error.message);
	}
	componentDidMount(){
		getTermsConditionStatus(this.onTCStatusSuccess, this.onTCStatusFailure)
	}

	render(){
		return(
			<div>
			 {this.renderTCPopup()}
			 </div>
			)
	}
}
export default Tconditions;