import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {fetchQuickLook}  from '../network/quick';
import axios from 'axios';
import axiosRetry from 'axios-retry';

class Quicklook extends Component{	
	constructor(props){
		super(props);
		this.successquick = this.successquick.bind(this);
		this.state = {
			quicklook_raw:"fetching"
		};
	}

	successquick(data){
		console.log(data);
		this.setState({
			quicklook_raw : data
		});
	}

	errorquick(error){
		console.log(error.message);
	}

	componentDidMount(){
		this.props.fetchQuickLook(this.successquick, this.errorquick);
	}

	render(){
	return(
		<div>
			<div className="col-sm-12">
						 <div className="row">
			                 <h3>Quick Summary</h3>
			             </div>

			             <div className="col-sm-6">
							<div className="row">
							  <h4>Grades</h4>
							</div>
							 <div className="row">
						        <label>Overall Truth Grade</label>
					            {this.state.grades_ql}
					         </div>
					         
					         </div>
			</div>			
			<p><pre>{JSON.stringify(this.state, null, 2)}</pre></p>
		</div>
	);
	}
}
export default connect(null,{fetchQuickLook})(Quicklook);