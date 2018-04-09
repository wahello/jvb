import React,{ Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {connect} from 'react-redux';
import FontAwesome from "react-fontawesome";
import { Collapse, Navbar, NavbarToggler, 
         NavbarBrand, Nav, NavItem, NavLink,
        Button,Popover,PopoverBody,Form,FormGroup,FormText,Label,Input} from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import NavbarMenu from './navbar';


export default class AllRank_Data extends Component{
	constructor(props){
		super(props);
		this.renderTable = this.renderTable.bind(this);
	}

	renderTable(data){
		let rowData = [];
		let category = ["username","score","category","rank"];
		let keys = [];
		
		for (let [key,value] of Object.entries(data)){
				for (let [key1,value1] of Object.entries(value)){
					let values =[];
					for (let cat of category){
						values.push(<td className = "progress_table">{value1[cat]}</td>);
					}
				rowData.push(<tr className = "progress_table">{values}</tr>);
			}
		}
		
		return rowData;
	}
	render(){
		return(
			<div>
				<NavbarMenu fix={true}/>
					<div className="col-sm-12 col-md-12 col-lg-12">
					<div style = {{paddingTop:"80px"}} className = "row justify-content-center ar_table_padd">
					<div className = "table table-responsive ">
    				<table className = "table table-striped table-bordered"> 
						<thead className = "progress_table">
							<th className = "progress_table">Username</th>
							<th className = "progress_table">Score</th>
							<th className = "progress_table">Category</th>
							<th className = "progress_table">Rank</th>
						</thead>
						<tbody className = "progress_table">
							{this.renderTable(this.props.location.state)}
						</tbody>
					</table>
					</div>
					</div>
					</div>
			</div>
		)
	}
}