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
		this.heartBeatsColors = this.heartBeatsColors.bind(this);
	}
	heartBeatsColors(value){
  		/* Applying the colors for the table cells depends upon their heart beat ranges*/
  		let background = "";
  		let color = "";
  		if(value && value != "N/A"){
	  		if(value >= 20){
	  			background = "green";
	  			color = "white";
	  		}
	  		else if(value >= 12 && value < 20){
	  			background = "yellow";
	  			color = "black";
	  		}
	  		else if(value > 0 && value < 12){
	  			background = "red";
	  			color = "black";
	  		}
  		}
  		return <td style ={{background:background,color:color}}>{value}</td>
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
				else if(key1 == "beat_lowered" || key1 == "pure_beat_lowered"){
					for(let [key3,value4] of Object.entries(value[key1])){
						if(key3 == "rank"){
							td_values.push(<td>{value4}</td>);
						}
						else if(key3 == "score"){
							td_values.push(this.heartBeatsColors(value4.value));
						}
					}
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
									<th>Time to 99 (hh:mm)</th>
									<th>Time to 99 Rank</th>
									<th>Heart beats lowered in 1st minute</th>
									<th>Lowered Beats Rank</th>
									<th>Pure Time to 99 (hh:mm)</th>
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