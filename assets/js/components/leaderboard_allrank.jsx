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
		let values =[];
		for (let cat of category){
			keys.push(cat);
			for (let [key,value] of Object.entries(data)){
				for (let [key1,value1] of Object.entries(value)){
					values.push(value1[cat]);
				}
			}
		}
		let tableHeaders = [];
		for (let head of keys){
			tableHeaders.push(<th>{head}</th>);
		}
		rowData.push(<tr>{tableHeaders}</tr>);

		let tableData = [];
		for (let info of values){
			tableData.push(<td>{info}</td>);
		}
		rowData.push(<tr>{tableData}</tr>);
		return rowData;
	}
	render(){
		return(
			<div>
			<NavbarMenu fix={true}/>
			<div style = {{paddingTop:"150px"}}>
			<table>
			{this.renderTable(this.props.location.state)}
			</table>
			</div>
			</div>
			)
	}
}