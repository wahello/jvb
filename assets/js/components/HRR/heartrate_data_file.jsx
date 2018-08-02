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

class Heartrate_Data extends Component{
	constructor(props){
		    super(props);
		    let Did_you_measure_HRR = this.props.hrr.Did_you_measure_HRR;
		    let Did_heartrate_reach_99 = this.props.hrr.Did_heartrate_reach_99;
		    let time_99 = this.props.hrr.time_99;
		    let time_99_time = time_99.split(":");
		    let time_99_min = time_99_time[0];
		    let time_99_sec = time_99_time[1];
		    this.state = {
		    	editable:false,
		    	editable_hrr_99_beats:false,
		    	Did_you_measure_HRR:Did_you_measure_HRR,
		    	Did_heartrate_reach_99:Did_heartrate_reach_99,
		    	time_99_min:time_99_min,
		    	time_99_sec:time_99_sec,
		    };
		    this.captilizeYes = this.captilizeYes.bind(this);
		    this.editToggleDidyouWorkout = this.editToggleDidyouWorkout.bind(this);
		    this.handleChange =this.handleChange.bind(this);
		    this.renderSecToMin = this.renderSecToMin.bind(this);
		    this.editToggleHrr99Beats = this.editToggleHrr99Beats.bind(this);
		    this.createSleepDropdown = this.createSleepDropdown.bind(this);
		}
		editToggleDidyouWorkout(){
	  		this.setState({
	  			editable:!this.state.editable
	  		});
  		}
  		createSleepDropdown(start_num , end_num, mins=false, step=1){
		    let elements = [];
		    let i = start_num;
		    while(i<=end_num){
		      let j = (mins && i < 10) ? "0"+i : i;
		      elements.push(<option key={j} value={j}>{j}</option>);
		      i=i+step;
		    }
		    return elements;
  		}
  		editToggleHrr99Beats(){
	  		this.setState({
	  			editable_hrr_99_beats:!this.state.editable_hrr_99_beats
	  		});
  		}
		captilizeYes(value){
			let cpatilize;
			if(value){
				cpatilize = value[0].toUpperCase()+value.slice(1);
		    }
			return cpatilize;
		}
		handleChange(event){
		  	const target = event.target;
		  	const value = target.value;	
		  	const name = target.name;
		  	this.setState({
				[name]: value
		  	});
		}
		renderSecToMin(value){
  		let time;
	  		if(value != null && value != "00:00" && value != undefined && value != "00:00:00"){
		  		let min = parseInt(value/60);
		  		let sec = (value % 60);
		  		if(sec < 10){
		  			time = min + ":0" + sec;
		  		}
		  		else{
		  			time = min + ":" + sec;
		  		}
		  	}
		  	else{
		  		time = "-"
		  	}
	  		return time;
  		}
	render(){
		return(
				<div className = "row justify-content-center hr_table_padd">
	          	    <div className = "table table-responsive">
		          	    <table className = "table table-striped table-bordered ">
			          	    <thead className = "hr_table_style_rows">
				          	    <th className = "hr_table_style_rows">HRR Stats</th>
				          	    <th className = "hr_table_style_rows">{moment(this.props.selectedDate).format("MMM DD, YYYY")}</th>
			          	    </thead>  
			          	    <tbody>  
			          	    <tr className = "hr_table_style_rows">   
				          	    <td className = "hr_table_style_rows">Did you measure your heart rate recovery (HRR) after today’s aerobic workout?</td>    
				          	    <td className = "hr_table_style_rows">{this.state.editable ? 
				          	    	<Input
				          	    		style = {{maxWidth:"100px"}}
                                        type="select"
                                        className="custom-select form-control" 
                                        name="Did_you_measure_HRR"
                                        value={this.state.Did_you_measure_HRR}                                       
                                        onChange={this.handleChange}
                                        onBlur={this.editToggleDidyouWorkout}>
                                        <option value="">select</option>                                 
                                    	<option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </Input> 
				          	    	:this.captilizeYes(this.state.Did_you_measure_HRR)}
				          	    	<span  style = {{marginLeft:"30px"}}  onClick={this.editToggleDidyouWorkout}
                            			className="fa fa-pencil fa-1x"
                            			>
                        			</span>
			          	    	</td>
			          	    </tr>

			          	    <tr className = "hr_table_style_rows">
				          	    <td className = "hr_table_style_rows">Did your heart rate go down to 99 beats per minute or lower?</td>
				          	    <td className = "hr_table_style_rows">
				          	    {this.state.editable_hrr_99_beats ? 
				          	    	<Input
				          	    		style = {{maxWidth:"100px"}}
                                        type="select"
                                        className="custom-select form-control" 
                                        name="Did_heartrate_reach_99"
                                        value={this.state.Did_heartrate_reach_99}                                       
                                        onChange={this.handleChange}
                                        onBlur={this.editToggleHrr99Beats}>
                                        <option value="">select</option>                                 
                                    	<option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </Input> 
				          	    	: this.captilizeYes(this.state.Did_heartrate_reach_99)}
				          	    	<span  style = {{marginLeft:"30px"}}  onClick={this.editToggleHrr99Beats}
                            			className="fa fa-pencil fa-1x"
                            			>
                        			</span>
				          	    </td>
			          	    </tr>

			          	    <tr className = "hr_table_style_rows">
				          	    <td className = "hr_table_style_rows">Duration (mm:ss) for Heart Rate Time to Reach 99</td>
				          	    <td className = "hr_table_style_rows">
				          	    {this.state.editable_hrr_99_beats ?
				          	    	<span>
					          	    	<Input
					          	    		style = {{maxWidth:"100px"}}
	                                        type="select"
	                                        className="custom-select form-control" 
	                                        name="Did_heartrate_reach_99"
	                                        value={this.state.Did_heartrate_reach_99}                                       
	                                        onChange={this.handleChange}
	                                        onBlur={this.editToggleHrr99Beats}>
	                                        {this.createSleepDropdown()}
	                                    </Input>
                                    </span>
                                    <span>
                                    	<Input
				          	    		style = {{maxWidth:"100px"}}
                                        type="select"
                                        className="custom-select form-control" 
                                        name="Did_heartrate_reach_99"
                                        value={this.state.Did_heartrate_reach_99}                                       
                                        onChange={this.handleChange}
                                        onBlur={this.editToggleHrr99Beats}>
                                        {this.createSleepDropdown()}
                                    </Input>
                                    </span> 
				          	    	: this.captilizeYes(this.state.Did_heartrate_reach_99)}
				          	    	
				          	    {this.renderSecToMin(this.props.hrr.time_99)}</td>
			          	    </tr>

			          	    <tr className = "hr_table_style_rows">
				          	    <td className = "hr_table_style_rows">HRR File Starting Heart Rate</td>
								<td className = "hr_table_style_rows">{this.props.hrr.HRR_start_beat}</td>
			          	    </tr>

			          	    <tr className = "hr_table_style_rows">
				          	    <td className = "hr_table_style_rows">Lowest Heart Rate Level in the 1st Minute</td>
				          	    <td className = "hr_table_style_rows">{this.props.hrr.lowest_hrr_1min}</td>
			          	    </tr>

			          	    <tr className = "hr_table_style_rows">
				          	    <td className = "hr_table_style_rows">Number of heart beats recovered in the first minute</td>
								<td className = "hr_table_style_rows">{this.props.hrr.No_beats_recovered}</td>
			          	    </tr>
			          	    </tbody>
		          	    </table> 
		          	   
	          	   </div>
          	  </div>
			);
	}
}
export default Heartrate_Data;