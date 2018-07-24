import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';
import FontAwesome from "react-fontawesome";
import { Collapse, Navbar, NavbarToggler, 
         NavbarBrand, Nav, NavItem, NavLink,
        Button,Popover,PopoverBody,Form,FormGroup,FormText,Label,Input} from 'reactstrap';

class HrrLeaderboard extends Component{
	constructor(props) {
    super(props);
	    this.state = {
	    }
		this.renderTable = this.renderTable.bind(this);
	}
	
	renderTable(Hrr_data){
		let td_rows = [];
		let keys = ["rank","username","time_99","beat_lowered","pure_time_99","pure_beat_lowered","total_hrr_rank_point"];
		for(let[key,value] of Object.entries(Hrr_data)){
			let td_values = [];
			for(let key1 of keys){
				if(key1 == "rank" || key1 == "username" || key1 == "total_hrr_rank_point"){
					td_values.push(<td>{value[key1]}</td>);
				}
				else{
					for(let [key3,value4] of Object.entries(value[key1])){
						if(key3 == "rank"){
							td_values.push(<td>{value4}</td>);
						}
						else if(key3 == "score"){
							td_values.push(<td>{value4.value}</td>);
						}
					}
				}
			}
			td_rows.push(<tr>{td_values}</tr>);	
		}
		return td_rows;
	}
	render(){
		return(
				<div className = "container-fluid">
					<div className = "row justify-content-center hr_table_padd">
						<div className = "table table-responsive">
			          	    <table className = "table table-striped table-bordered ">
								<tr>
									<th>Overall HRR Rank</th>
									<th>User</th>
									<th>Time to 99</th>
									<th>Time to 99 Rank</th>
									<th>Heart beats lowered in 1st minute</th>
									<th>Lowered Beats Rank</th>
									<th>Pure Time to 99</th>
									<th>Pure Time to 99 Rank</th>
									<th>Pure Heart beats lowered in 1st minute</th>
									<th>Pure Heart beats lowered in 1st minute Rank</th>
									<th>Total HRR Rank Points</th>
								</tr>
								<tbody>
								{this.renderTable(this.props.Hrr_data)}	
								</tbody>
							</table>
						</div>
					</div>	
				</div>
			);
	}
}
export default HrrLeaderboard;