import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Button} from "reactstrap";
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';

export class AllStats1 extends Component{
	constructor(props) {
    super(props);

    this.state = {
      dataList:10000
    };
  }
	render(){
		  var {dataList} = this.state;
		return(
			<div>
			
			</div>

			);
	}
}

export default AllStats1;