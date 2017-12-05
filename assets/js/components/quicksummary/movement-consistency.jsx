import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Button} from "reactstrap";
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import Dimensions from 'react-dimensions';
import axios from 'axios';
import axiosRetry from 'axios-retry';

import {movementDate} from '../../network/quick';
import movementConcictency from '../../network/quick';
axiosRetry(axios, { retries: 4}); 
var CalendarWidget = require('react-calendar-widget');  

var ReactDOM = require('react-dom');


class Movementquick extends Component{
	constructor(props){
		super(props);
    this.errormovement = this.errormovement.bind(this);
    this.successmovement = this.successmovement.bind(this);
    this.processDate=this.processDate.bind(this);
    this.createStateInstance = this.createStateInstance.bind(this);
		 this.state = {
       myTableData: [
        {name: '12AM - 01AM'},
        {name: '01AM - 02AM'},
        {name: '02AM - 03AM'}, 
        {name: '03AM - 04AM'},
        {name: '04AM - 05AM'},        
        {name: '05AM - 06AM'},
        {name: '06AM - 07AM'},
        {name: '07AM - 08AM'},
        {name: '08AM - 09AM'},
        {name: '09AM - 10AM'},
        {name: '10AM - 11AM'},
        {name: '11AM - 12AM'},
        {name: '12PM - 01PM'},
        {name: '01PM - 02PM'},
        {name: '02PM - 03PM'},
        {name: '03PM - 04PM'},
        {name: '04PM - 05PM'},
        {name: '05PM - 06PM'},
        {name: '06PM - 07PM'},
        {name: '07PM - 08PM'},
        {name: '08PM - 09PM'},        
        {name: '09PM - 10PM'},
        {name: '10PM - 11PM'},
        {name: '11PM - 12AM'},
        {name: 'Active-Hours'},
        {name: 'Inactive-Hours'},              
       ],
      created_at:"-",
       "12AM_01AM":{
       	steps:'-',
       	status:'-',
       },
       "01AM_02AM":{
       	steps:'-',
       	status:'-',
       }, 
       "02AM_03AM":{
       	steps:'-',
       	status:'-',
       }, 
       "03AM_04AM":{
       	steps:'-',
       	status:'-',
       }, 
       "04AM_05AM":{
       	steps:'-',
       	status:'-',
       }, 
       "05AM_06AM":{
       	steps:'-',
       	status:'-',
       }, 
       "06AM_07AM":{
       	steps:'-',
       	status:'-',
       }, 
       "07AM_08AM":{
       	steps:'-',
       	status:'-',
       }, 
       "08AM_09AM":{
       	steps:'-',
       	status:'-',
       }, 
       "09AM_10AM":{
       	steps:'-',
       	status:'-',
       }, 
       "10AM_11AM":{
       	steps:'-',
       	status:'-',
       }, 
       "11AM_12PM":{
       	steps:'-',
       	status:'-',
       }, 
       "12PM_01PM":{
       	steps:'-',
       	status:'-',
       }, 
       "01PM_02PM":{
       	steps:'-',
       	status:'-',
       }, 
       "02PM_03PM":{
       	steps:'-',
       	status:'-',
       }, 
       "03PM_04PM":{
       	steps:'-',
       	status:'-',
       }, 
       "04PM_05PM":{
       	steps:'-',
       	status:'-',
       }, 
       "05PM_06PM":{
       	steps:'-',
       	status:'-',
       },
       "06PM_07PM":{
       	steps:'-',
       	status:'-',
       }, 
       "07PM_08PM":{
       	steps:'-',
       	status:'-',
       }, 
       "08PM_09PM":{
       	steps:'-',
       	status:'-',
       },
       "09PM_10PM":{
       	steps:'-',
       	status:'-',
       }, 
       "10PM_11PM":{
       	steps:'-',
       	status:'-',
       },
       "11PM_12AM":{
        steps:'-',
        status:'-',
       },  
       active_hours:'-',
       inactive_hours:'-',  
                               
      };
	}
    createStateInstance(data){
      let obj = {
        steps:data.steps,
        status:data.status,
      }
      return obj
    }

   successmovement(data){
    console.log(data);
    this.setState({
      created_at:data.data.created_at,
       "12AM_01AM": this.createStateInstance(data.data['12 AM to 01 AM']),
       "01AM_02AM": this.createStateInstance(data.data['01 AM to 02 AM']),       
       "02AM_03AM": this.createStateInstance(data.data['02 AM to 03 AM']),  
       "03AM_04AM": this.createStateInstance(data.data['03 AM to 04 AM']),  
       "04AM_05AM": this.createStateInstance(data.data['04 AM to 05 AM']),  
       "05AM_06AM": this.createStateInstance(data.data['05 AM to 06 AM']),  
       "06AM_07AM": this.createStateInstance(data.data['06 AM to 07 AM']),  
       "07AM_08AM": this.createStateInstance(data.data['07 AM to 08 AM']),  
       "08AM_09AM": this.createStateInstance(data.data['08 AM to 09 AM']),  
       "09AM_10AM": this.createStateInstance(data.data['09 AM to 10 AM']),  
       "10AM_11AM": this.createStateInstance(data.data['10 AM to 11 AM']),  
       "11AM_12PM": this.createStateInstance(data.data['11 AM to 12 PM']),  
       "12PM_01PM": this.createStateInstance(data.data['12 PM to 01 PM']),  
       "01PM_02PM": this.createStateInstance(data.data['01 PM to 02 PM']),
       "02PM_03PM": this.createStateInstance(data.data['02 PM to 03 PM']),
       "03PM_04PM": this.createStateInstance(data.data['03 PM to 04 PM']),
       "04PM_05PM": this.createStateInstance(data.data['04 PM to 05 PM']),
       "05PM_06PM": this.createStateInstance(data.data['05 PM to 06 PM']),
       "06PM_07PM": this.createStateInstance(data.data['06 PM to 07 PM']),
       "07PM_08PM": this.createStateInstance(data.data['07 PM to 08 PM']),
       "08PM_09PM": this.createStateInstance(data.data['08 PM to 09 PM']),
       "09PM_10PM": this.createStateInstance(data.data['09 PM to 10 PM']),
       "10PM_11PM": this.createStateInstance(data.data['10 PM to 11 PM']),
       "11PM_12AM": this.createStateInstance(data.data['11 PM to 12 AM']),
       active_hours:data.data.active_hours,
       inactive_hours:data.data.inactive_hours,  

      })
    
  }

  errormovement(error){
    console.log(error.message);
  }
  processDate(date){
  movementDate(date,this.successmovement,this.errormovement);
}
componentDidMount(){
  var today= new Date();
  movementDate(today,this.successmovement,this.errormovement);
  movementConcictency(this.successmovement,this.errormovement)
}
	render(){
		const {height, width, containerHeight, containerWidth, ...props} = this.props;
		let rowsCount = this.state.myTableData.length;
				
		return(
			<div className="row justify-content-center">
      <div>
       <CalendarWidget onDaySelect={this.processDate}/>,
      </div>
			 <Table
		        rowsCount={rowsCount}
		        rowHeight={100}
		        headerHeight={65}
		        width={containerWidth}
        		maxHeight={containerHeight}
                touchScrollEnabled={true}
                {...props}>
		        <Column
		          header={<Cell>Movement Consistency</Cell>}
		          cell={props => (
		            <Cell {...props}>
		              {this.state.myTableData[props.rowIndex].name}
		            </Cell>
		          )}
		          width={167}
		          fixed={true}
		        />
		         <Column
		          header={<Cell>Steps</Cell>}
		          width={167}
		        />

		         <Column
		          header={<Cell>Status</Cell>}
		          width={167}
		         
		        />
			     
      		</Table>
			</div>

			);
	}
}
export default Dimensions({
  getHeight: function(element) {
    return window.innerHeight - 217;
  },
  getWidth: function(element) {
    var widthOffset = window.innerWidth < 1024 ? 0 :860;
    return window.innerWidth - widthOffset;
  }
})(Movementquick);

