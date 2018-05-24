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
import NavbarMenu from './navbar';
import {renderAerobicSelectedDateFetchOverlay} from './dashboard_healpers'; 

class Workout extends Component{
	constructor(props){
		super(props);
		this.state = {
			data:{
			    "date":"10-MAR-2018",
			    "workout_type":"RUNNING",
			    "duration":1500,
			    "average_heart_rate":135,
			    "total_time":3000,
			    "avg_hrr":75,
			    "date":"10-MAR-2019",
			    "workout_type":"walking",
			    "duration":1500,
			    "average_heart_rate":135,
			    "total_time":3000,
			    "avg_hrr":75
			}
		}
		this.renderTable = this.renderTable.bind(this);
	}
	renderTable(data){
		let td_values = [];
		let td_rows = [];
		let keys = ["date","workout_type","duration","average_heart_rate"];
			let keyvalue;
			for(let key of keys){
				 keyvalue = data[key];
				 td_values.push(<td>{keyvalue}</td>);
			}
			td_rows.push(<tr>{td_values}</tr>);
			return td_rows;
	}
	render(){
		return(
			<div className = "container_fluid">
				<NavbarMenu title = {"Workout Stats"}/>
				<table>
					<thead>
					<th>Date</th>
					<th>Workout Type</th>
					<th>Duration</th>
					<th>Average Heartrate</th>
					</thead>
					<tbody>
						{this.renderTable(this.state.data)}
					</tbody>
				</table>
			</div>
		);
	}
}
export default Workout;