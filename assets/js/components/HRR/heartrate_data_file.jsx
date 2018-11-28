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
        Button,Popover,PopoverBody,Form,FormGroup,FormText,Label,Input, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {updateHeartData} from '../../network/heart_cal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import {renderHrrSelectedDateFetchOverlay} from '../dashboard_healpers';

class Heartrate_Data extends Component{
	constructor(props){
		    super(props);
		    let Did_you_measure_HRR = this.props.hrr.Did_you_measure_HRR;
		    let Did_heartrate_reach_99 = this.props.hrr.Did_heartrate_reach_99;
		    let time_99 = this.renderSecToMin(this.props.hrr.time_99);
		    let time_99_time = time_99.split(":");
		    let time_99_min = time_99_time[0];
		    let time_99_sec = time_99_time[1];
		    let HRR_start_beat1= this.props.hrr.HRR_start_beat;
		    let lowest_hrr_1min1 = this.props.hrr.lowest_hrr_1min;
		    let No_beats_recovered = this.props.hrr.No_beats_recovered;
		    this.state = {
		    	editable:this.props.hrr.editable,
		    	editable_did_you_measure_HRR:false,
		    	editable_hrr_99_beats:false,
		    	editable_time_99:false,
		    	editable_HRR_start_beat:false,
		    	editable_lowest_hrr_1min:false,
		    	editable_no_beats:false,
		    	Did_you_measure_HRR:Did_you_measure_HRR,
		    	Did_heartrate_reach_99:Did_heartrate_reach_99,
		    	time_99:"",
		    	HRR_start_beat:HRR_start_beat1,
		    	lowest_hrr_1min:lowest_hrr_1min1,
		    	No_beats_recovered:No_beats_recovered,
		    	time_99_min:time_99_min,
		    	time_99_sec:time_99_sec,

		    };
		    this.captilizeYes = this.captilizeYes.bind(this);
		    this.editToggleDidyouWorkout = this.editToggleDidyouWorkout.bind(this);
		    this.handleChange =this.handleChange.bind(this);
		    this.renderSecToMin = this.renderSecToMin.bind(this);
		    this.editToggleHrr99Beats = this.editToggleHrr99Beats.bind(this);
		    this.createSleepDropdown = this.createSleepDropdown.bind(this);
		    this.editToggletime99 = this.editToggletime99.bind(this);
		    this.renderTime99 = this.renderTime99.bind(this);
		    this.editToggleHrrStartBeat = this.editToggleHrrStartBeat.bind(this);
		    this.editToggleLowestHrr1min = this.editToggleLowestHrr1min.bind(this);
		    this.editToggleNoBeats = this.editToggleNoBeats.bind(this);
		    this.updateData = this.updateData.bind(this);
		    this.successHeart = this.successHeart.bind(this);
			this.errorHeart = this.errorHeart.bind(this);
			this.renderHrrSelectedDateFetchOverlay = renderHrrSelectedDateFetchOverlay.bind(this);

		}
		componentWillReceiveProps(nextProps) {
			this.setState({ editable: nextProps.hrr.editable });  
	  	}
		editToggleDidyouWorkout(){
	  		this.setState({
	  			editable_did_you_measure_HRR:!this.state.editable_did_you_measure_HRR
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
  		editToggletime99(){
	  		this.setState({
	  			editable_time_99:!this.state.editable_time_99
	  		});
  		}
  		editToggleHrrStartBeat(){
  			let beats = parseInt(this.state.HRR_start_beat);
  			let beats1 = parseInt(this.state.lowest_hrr_1min);
 			let diff = beats - beats1;
	  		this.setState({
	  			editable_HRR_start_beat:!this.state.editable_HRR_start_beat,
	  			No_beats_recovered:diff
	  		});
  		}
  		editToggleLowestHrr1min(){
  			let beats = parseInt(this.state.HRR_start_beat);
  			let beats1 = parseInt(this.state.lowest_hrr_1min);
 			let diff = beats - beats1;
	  		this.setState({
	  			editable_lowest_hrr_1min:!this.state.editable_lowest_hrr_1min,
	  			No_beats_recovered:diff
	  		});
  		}
  		editToggleNoBeats(){
	  		this.setState({
	  			editable_no_beats:!this.state.editable_no_beats,
	  		});
  		}
  		renderTime99(){
  			let mins = parseInt(this.state.time_99_min) * 60;
  			let sec = parseInt(this.state.time_99_sec);
  			let time = mins + sec;
  			this.setState({
  				time_99:time,
  				editable_time_99:!this.state.editable_time_99
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
				[name]: value},
				()=>{
					if(target.name=='Did_you_measure_HRR'){
						this.setState({
	  						editable_did_you_measure_HRR:!this.state.editable_did_you_measure_HRR
	  					});
					}
					else if(target.name=='Did_heartrate_reach_99'){
						this.setState({
	  						editable_hrr_99_beats:!this.state.editable_hrr_99_beats
	  					});
					}
					else if(target.name=='HRR_start_beat'){
						let beats = parseInt(this.state.HRR_start_beat);
			  			let beats1 = parseInt(this.state.lowest_hrr_1min);
			 			let diff = beats - beats1;
				  		this.setState({
				  			editable_HRR_start_beat:!this.state.editable_HRR_start_beat,
				  			No_beats_recovered:diff
				  		});
					}
					else if(target.name=='lowest_hrr_1min'){
						let beats = parseInt(this.state.HRR_start_beat);
			  			let beats1 = parseInt(this.state.lowest_hrr_1min);
			 			let diff = beats - beats1;
				  		this.setState({
				  			editable_lowest_hrr_1min:!this.state.editable_lowest_hrr_1min,
				  			No_beats_recovered:diff
				  		});
					}
					else if(target.name=='No_beats_recovered'){
						this.setState({
	  						editable_no_beats:!this.state.editable_no_beats,
	  					});
					}
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

  		successHeart(data){
			toast.info("Updated HRR successfully",{
	          className:"dark"
	        });
	  		this.setState({
	  	    		fetching_hrr:false,
	  	    		editable:false,
	  	   			Did_you_measure_HRR:data.data.Did_you_measure_HRR,
					Did_heartrate_reach_99:data.data.Did_heartrate_reach_99,
					time_99:data.data.time_99,
					HRR_start_beat:data.data.HRR_start_beat,
					lowest_hrr_1min:data.data.lowest_hrr_1min,
					No_beats_recovered:data.data.No_beats_recovered,

					end_time_activity:data.data.end_time_activity,
					diff_actity_hrr:data.data.diff_actity_hrr,
					HRR_activity_start_time:data.data.HRR_activity_start_time,
					end_heartrate_activity:data.data.end_heartrate_activity,
					heart_rate_down_up:data.data.heart_rate_down_up,
					pure_1min_heart_beats:data.data.pure_1min_heart_beats,
					pure_time_99:data.data.pure_time_99,

					no_fitfile_hrr_time_reach_99:data.data.no_fitfile_hrr_time_reach_99,
					no_fitfile_hrr_reach_99:data.data.no_fitfile_hrr_reach_99,
					time_heart_rate_reached_99:data.data.time_heart_rate_reached_99,
					lowest_hrr_no_fitfile:data.data.lowest_hrr_no_fitfile,
					no_file_beats_recovered:data.data.no_file_beats_recovered,

					offset:data.data.offset,
					created_at:data.data.created_at
		  	});
		  	this.props.HRR_measured(data.data.Did_you_measure_HRR);
		}
		errorHeart(error){
			console.log(error.message); 
			this.setState({
				fetching_hrr:false,
			})
	    }

  		updateData(){
  			let mins = parseInt(this.state.time_99_min) * 60;
  			let sec = parseInt(this.state.time_99_sec);
  			let time = mins + sec;
  			this.setState({
  				fetching_hrr:true
  			}, () => {
  				let data = {
	  				Did_you_measure_HRR:this.state.Did_you_measure_HRR,
			    	Did_heartrate_reach_99:this.state.Did_heartrate_reach_99,
			    	time_99:time,
			    	HRR_start_beat:parseInt(this.state.HRR_start_beat),
			    	lowest_hrr_1min:parseInt(this.state.lowest_hrr_1min),
			    	No_beats_recovered:parseInt(this.state.No_beats_recovered),
			    };
			    
	  			updateHeartData(data, this.props.selectedDate, this.successHeart, this.errorHeart);
	  			
  			})
	  			
  			//this.props.renderHrrData(data);
  		}
	render(){
		return(<div>
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
				          	    <td className = "hr_table_style_rows">{this.state.editable_did_you_measure_HRR ? 
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
				          	    	{this.state.editable &&
				          	    	<span  style = {{marginLeft:"30px"}}  onClick={this.editToggleDidyouWorkout}
                            			className="fa fa-pencil fa-1x"
                            			>
                        			</span>
                        			}
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
				          	    	{this.state.editable &&
				          	    	<span  style = {{marginLeft:"30px"}}  onClick={this.editToggleHrr99Beats}
                            			className="fa fa-pencil fa-1x"
                            			>
                        			</span>
                        			}
				          	    </td>
			          	    </tr>

			          	    <tr className = "hr_table_style_rows">
				          	    <td className = "hr_table_style_rows">Duration (mm:ss) for Heart Rate Time to Reach 99</td>
				          	    <td className = "hr_table_style_rows">
				          	    {this.state.editable_time_99 ?
	  						<Modal isOpen={this.state.editable_time_99}  className={this.props.className}>
	      					<ModalHeader toggle={this.editToggletime99}>Tme to 99</ModalHeader>
	          				<ModalBody>
	            				<div className = "row justify-content-center">
	            				<span>
				          	    	<Input
				          	    	style = {{minWidth:"130px"}}
	                                    type="select"
	                                    className="custom-select form-control" 
	                                    name="time_99_min"
	                                    value={this.state.time_99_min}                                       
	                                    onChange={this.handleChange}
	                                    >
	                                    {this.createSleepDropdown(0,59)}
	                            	</Input>
	                            </span>
	                            <span style = {{marginLeft:"30px"}}>
	                            	<Input
				          	    		style = {{minWidth:"130px"}}
			                            type="select"
			                            className="custom-select form-control" 
			                            name="time_99_sec"
			                            value={this.state.time_99_sec}                                       
			                            onChange={this.handleChange}
			                            >
			                            {this.createSleepDropdown(0,59,true)}
	                            	</Input>
	                            </span>
	                            </div>
	      					</ModalBody>
	      					<ModalFooter>
	        				<Button color="primary" onClick={this.renderTime99}>Save</Button>
	            			<Button color="secondary" onClick={this.editToggletime99}>Cancel</Button>
	          				</ModalFooter>
	        				</Modal>              
				          	    	: (this.state.time_99_min + ":" +this.state.time_99_sec)}
				          	    	{this.state.editable &&
				          	    	<span  style = {{marginLeft:"30px"}}  onClick={this.editToggletime99}
                            			className="fa fa-pencil fa-1x"
                            			>
                        			</span>
                        			}
				          	    	</td>
			          	    </tr>

			          	    <tr className = "hr_table_style_rows">
				          	    <td className = "hr_table_style_rows">HRR File Starting Heart Rate</td>
								<td className = "hr_table_style_rows">
								{this.state.editable_HRR_start_beat ? 
				          	    	<Input
				          	    		style = {{maxWidth:"100px"}}
                                        type="select"
                                        className="custom-select form-control" 
                                        name="HRR_start_beat"
                                        value={this.state.HRR_start_beat}                                       
                                        onChange={this.handleChange}
                                        onBlur={this.editToggleHrrStartBeat}>
                                        {this.createSleepDropdown(70,220)}
                                    </Input> 
				          	    	: this.state.HRR_start_beat}
				          	    	{this.state.editable &&
				          	    	<span  style = {{marginLeft:"30px"}}  onClick={this.editToggleHrrStartBeat}
                            			className="fa fa-pencil fa-1x"
                            			>
                        			</span>
                        			}

								</td>
			          	    </tr>

			          	    <tr className = "hr_table_style_rows">
				          	    <td className = "hr_table_style_rows">Lowest Heart Rate Level in the 1st Minute</td>
				          	    <td className = "hr_table_style_rows">
				          	    	{this.state.editable_lowest_hrr_1min ? 
					          	    	<Input
					          	    		style = {{maxWidth:"100px"}}
	                                        type="select"
	                                        className="custom-select form-control" 
	                                        name="lowest_hrr_1min"
	                                        value={this.state.lowest_hrr_1min}                                       
	                                        onChange={this.handleChange}
	                                        onBlur={this.editToggleLowestHrr1min}>
	                                        {this.createSleepDropdown(70,220)}
	                                    </Input> 
				          	    	: this.state.lowest_hrr_1min}
				          	    	{this.state.editable &&
				          	    	<span  style = {{marginLeft:"30px"}}  onClick={this.editToggleLowestHrr1min}
                            			className="fa fa-pencil fa-1x"
                            			>
                        			</span>
                        			}
								</td>
			          	    </tr>

			          	    <tr className = "hr_table_style_rows">
				          	    <td className = "hr_table_style_rows">Number of heart beats recovered in the first minute</td>
								<td className = "hr_table_style_rows">
								{this.state.editable_no_beats ? 
					          	    	<Input
					          	    		style = {{maxWidth:"100px"}}
	                                        type="select"
	                                        className="custom-select form-control" 
	                                        name="No_beats_recovered"
	                                        value={this.state.No_beats_recovered}                                       
	                                        onChange={this.handleChange}
	                                        onBlur={this.editToggleNoBeats}>
	                                        {this.createSleepDropdown(0,220)}
	                                    </Input> 
				          	    	: this.state.No_beats_recovered}
				          	    	{this.state.editable &&
				          	    	<span  style = {{marginLeft:"30px"}}  onClick={this.editToggleNoBeats}
                            			className="fa fa-pencil fa-1x"
                            			>
                        			</span>
                        			}
                        			</td>
			          	    </tr>
			          	</tbody>
		          	</table>
		          	<ToastContainer 
	                    position="top-center"
	                    type="success"
	                    autoClose={5000}
	                    hideProgressBar={true}
	                    newestOnTop={false}
	                    closeOnClick
	                    className="toast-popup"
	                />
		          	   		        
	          	</div>
          	</div>
          	  	<div className = "row justify-content-center">
          	    	<Button onClick = {this.updateData}>Update</Button>
          	    </div>
          	</div>
		);
	}
}
export default Heartrate_Data;