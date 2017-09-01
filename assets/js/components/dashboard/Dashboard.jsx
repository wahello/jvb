import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { fetchGarminData } from '../../network/garminOperations';

import NavbarMenu from '../navbar';

class Dashboard extends Component {

	constructor(props){
		super(props)
		this.fetchGarminData = this.fetchGarminData.bind(this);
	}
	onFetchSuccess(){
		alert("Data fetched successfully");
	}

	onFetchError(error){
		console.log("Cannot fetch data now!");
	}

	fetchGarminData(){
		data = this.props.fetchGarminData(this.onFetchSuccess,this.onFetchError);
		console.log(data);
	}

	render(){
		return (
			<div>
				<NavbarMenu />
				<div>
					{this.fetchGarminData()}
				</div>
			</div>
		);
	}
}

function mapStateToProps(state){
  return {
  	have_token: state.garmin_auth.authenticated,
    errorMessage: state.garmin_auth.error,
    message : state.garmin_auth.message,
    is_authorized: state.auth.authenticated
  };
}

export default connect(mapStateToProps,{fetchGarminData})(Dashboard);