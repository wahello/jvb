import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import NavbarMenu from './navbar';
import FontAwesome from "react-fontawesome";
import CalendarWidget from 'react-calendar-widget';
import { Collapse, Navbar, NavbarToggler, 
         NavbarBrand, Nav, NavItem, NavLink,
        Button,Popover,PopoverBody,Form,FormGroup,FormText,Label,Input} from 'reactstrap';
import Textarea from 'react-textarea-autosize';
import moment from 'moment';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import {fetchData} from '../network/new_link';

class NewLink extends Component{
	constructor(props){
		super(props);
			this.errorFetch = this.errorFetch.bind(this);
		    this.successFetch = this.successFetch.bind(this);
		    this.processDate = this.processDate.bind(this);
			this.toggle = this.toggle.bind(this);
			this.handleChange = this.handleChange.bind(this);
				this.state = {
					mode:'',
				       tableAttrColumn: [
				        {name: '12:00 AM - 12:59 AM'},
				        {name: '01:00 AM - 01:59 AM'},
				        {name: '02:00 AM - 02:59 AM'}, 
				        {name: '03:00 AM - 03:59 AM'},
				        {name: '04:00 AM - 04:59 AM'},        
				        {name: '05:00 AM - 05:59 AM'},
				        {name: '06:00 AM - 06:59 AM'},
				        {name: '07:00 AM - 07:59 AM'},
				        {name: '08:00 AM - 08:59 AM'},
				        {name: '09:00 AM - 09:59 AM'},
				        {name: '10:00 AM - 10:59 AM'},
				        {name: '11:00 AM - 11:59 AM'},
				        {name: '12:00 PM - 12:59 PM'},
				        {name: '01:00 PM - 01:59 PM'},
				        {name: '02:00 PM - 02:59 PM'},
				        {name: '03:00 PM - 03:59 PM'},
				        {name: '04:00 PM - 04:59 PM'},
				        {name: '05:00 PM - 05:59 PM'},
				        {name: '06:00 PM - 06:59 PM'},
				        {name: '07:00 PM - 07:59 PM'},
				        {name: '08:00 PM - 08:59 PM'},        
				        {name: '09:00 PM - 09:59 PM'},
				        {name: '10:00 PM - 10:59 PM'},
				        {name: '11:00 PM - 11:59 PM'},
				        {name: 'Active Hours'},
				        {name: 'Inactive Hours'},
				        {name: 'Strength Hours'},
				        {name: 'Sleeping Hours'},
				        {name:'Nap Hours'},
				        {name: 'Exercise Hours'},
				        {name: 'No Data Yet Hours'},
				        {name: 'Time Zone Change Hours'},
				        {name: 'Total Active Minutes'},
				        {name: 'Total % Active'},
				        {name: 'Total Steps *Total Steps on this chart may differ slightly from overall steps'}              
				       ],
        			popoverOpen: false,
			       selectedDate: new Date()                      
      			};
	}

	toggle(){
	    this.setState({
	      popoverOpen: !this.state.popoverOpen
	    });
	}

	processDate(selectedDate){
	    this.setState({
	      selectedDate: selectedDate,
	      popoverOpen: !this.state.popoverOpen,
	    },()=>{
	      fetchData(this.state.selectedDate,this.successFetch,this.errorFetch);
	    });
	}

	successFetch(data){
	    if(data.data.length){
	      this.setState({
	          mc_data : data.data
	        });
	    }
	    else{
	      this.errorFetch(data);
	    }
  	}



	errorFetch(error){
    const initial_data = [
      {
         created_at:"-",
         movement_consistency: {
          "12:00 AM to 12:59 AM":{
            steps:'-',
            status:'-',
            active_prcnt:'-',
            active_duration:{unit: "minute", duration: '-'}
           },
           "01:00 AM to 01:59 AM":{
            steps:'-',
            status:'-',
            active_prcnt:'-',
            active_duration:{unit: "minute", duration: '-'}
           }, 
           "02:00 AM to 02:59 AM":{
            steps:'-',
            status:'-',
            active_prcnt:'-',
            active_duration:{unit: "minute", duration: '-'}
           }, 
           "03:00 AM to 03:59 AM":{
            steps:'-',
            status:'-',
            active_prcnt:'-',
            active_duration:{unit: "minute", duration: '-'}
           }, 
           "04:00 AM to 04:59 AM":{
            steps:'-',
            status:'-',
            active_prcnt:'-',
            active_duration:{unit: "minute", duration: '-'}
           }, 
           "05:00 AM to 05:59 AM":{
            steps:'-',
            status:'-',
            active_prcnt:'-',
            active_duration:{unit: "minute", duration: '-'}
           }, 
           "06:00 AM to 06:59 AM":{
            steps:'-',
            status:'-',
            active_prcnt:'-',
            active_duration:{unit: "minute", duration: '-'}
           }, 
           "07:00 AM to 07:59 AM":{
            steps:'-',
            status:'-',
            active_prcnt:'-',
            active_duration:{unit: "minute", duration: '-'}
           }, 
           "08:00 AM to 08:59 AM":{
            steps:'-',
            status:'-',
            active_prcnt:'-',
            active_duration:{unit: "minute", duration: '-'}
           }, 
           "09:00 AM to 09:59 AM":{
            steps:'-',
            status:'-',
            active_prcnt:'-',
            active_duration:{unit: "minute", duration: '-'}
           }, 
           "10:00 AM to 10:59 AM":{
            steps:'-',
            status:'-',
            active_prcnt:'-',
            active_duration:{unit: "minute", duration: '-'}
           }, 
           "11:00 AM to 11:59 AM":{
            steps:'-',
            status:'-',
            active_prcnt:'-',
            active_duration:{unit: "minute", duration: '-'}
           }, 
           "12:00 PM to 12:59 PM":{
            steps:'-',
            status:'-',
            active_prcnt:'-',
            active_duration:{unit: "minute", duration: '-'}
           }, 
           "01:00 PM to 01:59 PM":{
            steps:'-',
            status:'-',
            active_prcnt:'-',
            active_duration:{unit: "minute", duration: '-'}
           }, 
           "02:00 PM to 02:59 PM":{
            steps:'-',
            status:'-',
            active_prcnt:'-',
            active_duration:{unit: "minute", duration: '-'}
           },
           "03:00 PM to 03:59 PM":{
            steps:'-',
            status:'-',
            active_prcnt:'-',
            active_duration:{unit: "minute", duration: '-'}
           }, 
           "04:00 PM to 04:59 PM":{
            steps:'-',
            status:'-',
            active_prcnt:'-',
            active_duration:{unit: "minute", duration: '-'}
           },
           "05:00 PM to 05:59 PM":{
            steps:'-',
            status:'-',
            active_prcnt:'-',
            active_duration:{unit: "minute", duration: '-'}
           },
           "06:00 PM to 06:59 PM":{
            steps:'-',
            status:'-',
            active_prcnt:'-',
            active_duration:{unit: "minute", duration: '-'}
           }, 
           "07:00 PM to 07:59 PM":{
            steps:'-',
            status:'-',
            active_prcnt:'-',
            active_duration:{unit: "minute", duration: '-'}
           }, 
           "08:00 PM to 08:59 PM":{
            steps:'-',
            status:'-',
            active_prcnt:'-',
            active_duration:{unit: "minute", duration: '-'}
           },
           "09:00 PM to 09:59 PM":{
            steps:'-',
            status:'-',
            active_prcnt:'-',
            active_duration:{unit: "minute", duration: '-'}
           }, 
           "10:00 PM to 10:59 PM":{
            steps:'-',
            status:'-',
            active_prcnt:'-',
            active_duration:{unit: "minute", duration: '-'}
           },
           "11:00 PM to 11:59 PM":{
            steps:'-',
            status:'-',
            active_prcnt:'-',
            active_duration:{unit: "minute", duration: '-'}
           }, 
           active_hours:'-',
           inactive_hours:'-',
           strength_hours:'-',
           sleeping_hours:'-',
           nap_hours:'-',
           exercise_hours:'-',
           no_data_hours: '-',
           timezone_change_hours:'-',
           total_active_minutes: '-',
           total_active_prcnt:'-',
           total_steps:'-'
         }
      }
    ];
  }
  	handleChange(){

  	}

	componentDidMount(){
	    fetchData(this.state.selectedDate,this.successFetch,this.errorFetch);  
	}

	render(){
		const {fix} = this.props;
		let rowsCount = this.state.tableAttrColumn.length;
		return(
			<div className = "container-fluid">
			    <NavbarMenu title = {<span style = {{fontSize:"22px"}}>New Page</span>} />
					<div className="col-md-12,col-sm-12,col-lg-12"></div>
					<div className="row justify-content-center">
					       	<span id="navlink" onClick={this.toggle} id="progress" style={{paddingRight:"20px"}}>
				             	<FontAwesome name = "calendar" size = "2x"/>
					  		</span>   
					    	<Popover placement="bottom" isOpen={this.state.popoverOpen} target="progress" toggle={this.toggle}>
					   			<PopoverBody><CalendarWidget onDaySelect={this.processDate}/></PopoverBody>
							</Popover>
			    	</div>

			    	<div className = "input ">
                            <Label check className = "btn btn-secondary fitbit_class " id = "fitbit_btn">
                                 <Input type = "radio" 
                                 		name = "mode"
	                                	color = "grey"
	                                	style = {{borderRadius:"100px"}}
	                                    value = "fitbit"
	                                    checked = {this.state.mode === 'fitbit'}
	                                    onChange = {this.handleChange} />{' '}
                                    Fitbit
                            </Label>
                            <Label check className = "btn btn-secondary garmin_class " id = "garmin_btn">
                                 <Input type = "radio" 
                                 		name = "mode" 
	                                	color = "grey"
	                                	size="lg"
	                                	style = {{borderRadius:"100px"}}
	                                    value = "garmin"
	                                    checked = {this.state.mode === 'garmin'}
	                                    onChange = {this.handleChange} />{' '}
                                    Garmin
                            </Label>
                    </div>

                    <div className = "Button">
                    		<Button color = "primary" 
                    				size="lg">Save
                    		</Button>{' '}
                    </div>
	    	</div>
		)
	}
}

export default NewLink;
