import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {Field, reduxForm } from 'redux-form';
import _ from 'lodash';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import queryString from 'query-string';
import moment from 'moment';
import FontAwesome from "react-fontawesome";
 import { Collapse, Navbar, NavbarToggler, 
         NavbarBrand, Nav, NavItem, NavLink,
       Button,Popover,PopoverBody,Form,FormGroup,FormText,Label,Input} from 'reactstrap';
import NavbarMenu from './navbar';
import {fetchLastSync} from '../network/quick';
import {fetchMovementConsistency} from '../network/quick';


axiosRetry(axios, { retries: 3});
var CalendarWidget = require('react-calendar-widget');
var ReactDOM = require('react-dom');

class MCS_Dashboard extends Component{
	constructor(props){
		super(props);
		this.state = {
		    selectedDate:new Date(),
			calendarOpen:false,
			isOpen:false,
			last_synced:null,
			mc_data:{},
			non_exercise_steps:""
		};

		this.toggleCalendar = this.toggleCalendar.bind(this);
		this.processDate = this.processDate.bind(this);
		this.toggle = this.toggle.bind(this);
	    this.errorMCFetch = this.errorMCFetch.bind(this);
		this.successMCFetch = this.successMCFetch.bind(this);
		this.renderLastSync = this.renderLastSync.bind(this);
		this.renderSteps = this.renderSteps.bind(this);
		this.successLastSync = this.successLastSync.bind(this);
		this.errorquick = this.errorquick.bind(this);
		this.stepsValueComma = this.stepsValueComma.bind(this);
		this.renderTable = this.renderTable.bind(this);
		this.renderTablecolumn = this.renderTablecolumn.bind(this);
		this.renderTabledata = this.renderTabledata.bind(this);
		this.renderTablecolumndata = this.renderTablecolumndata.bind(this);
		this.renderTablestatus = this.renderTablestatus.bind(this);
		this.mcHistoricalData = this.mcHistoricalData.bind(this);
		this.renderAddDate = this.renderAddDate.bind(this);
		this.renderRemoveDate = this.renderRemoveDate.bind(this);
		
	}

	errorMCFetch(error){
   		console.log(error.message);
    }
    successLastSync(data){
    	/* Getting Wearable Device Last Sync date and time*/
    	let last_synced;
    	if(_.isEmpty(data.data))
    		last_synced = null
    	else                        
    		 last_synced = data.data.last_synced;
    	this.setState({
    		last_synced:last_synced,
    	})
    }
    errorquick(error){
		console.log(error.message);
	}

    renderLastSync(value){
          let time;
          let sync="";
        if(value != null){
          time = moment(value).format("MMM DD, YYYY @ hh:mm a")
          sync = <div className = "last_sync" style = {{fontWeight:"bold",fontFamily:'Proxima-Nova',color:"black"}}> Wearable Device Last Synced on {time}</div>;
       }
        return sync;
   }
       
   renderSteps(value){
   		  let non_exercise_steps;
   		  let steps = "";
   		if (value!=null){
   		  non_exercise_steps = value
   		  steps = <span className = "steps_count" style = {{fontWeight: "bold",fontFamily:'Proxima-Nova', color:"black"}}> NES: {non_exercise_steps} </span>
   		}
   		return steps;
   }
    renderAddDate(){
    	/*added the angle-right to the calender to getting the next day data */
    	var today = this.state.selectedDate;
		var tomorrow = moment(today).add(1, 'days');
		this.setState({
			selectedDate:tomorrow.toDate()
		},()=>{
			fetchMovementConsistency(this.state.selectedDate,this.successMCFetch,this.errorMCFetch);
		});
	}
    renderRemoveDate(){
    	/*added the angle-left to the calender to getting the last day data*/
   	    var today = this.state.selectedDate;
		var tomorrow = moment(today).subtract(1, 'days');
		this.setState({
			selectedDate:tomorrow.toDate()
		},()=>{
			fetchMovementConsistency(this.state.selectedDate,this.successMCFetch,this.errorMCFetch);;
		});
	}

    successMCFetch(data){
	  console.log(data.data)
		let non_exercise_steps = "";
		if(!_.isEmpty(data.data)){
        for(let[keys1,values1] of Object.entries(data.data)){
         	for(let[key2,values2] of Object.entries(values1)){
	         	if (key2 == "non_exercise_steps"){
	         		non_exercise_steps = values2;
		         	}
		        }	         	
	  		}
  		}	
		this.setState({
		  mc_data:data.data,
  		  non_exercise_steps:non_exercise_steps
	   });
   }
    toggleCalendar(){
         this.setState({
	      calendarOpen:!this.state.calendarOpen
       });
   }
    processDate(selectedDate){
	    this.setState({
	        selectedDate:selectedDate,
	        calendarOpen:!this.state.calendarOpen,
       },()=>{
        fetchMovementConsistency(this.state.selectedDate,this.successMCFetch,this.errorMCFetch);
        
     });
    }

    componentDidMount(){
    	const values = queryString.parse(this.props.location.search);
    	let value = values.date;
    	window.history.pushState(null,"mcs_dashboard","/mcs_dashboard")	
       	if(value){
               this.setState({
	    		selectedDate:new Date(values.date)
	    	},()=>{
	    		fetchMovementConsistency(values.date,this.successMCFetch,this.errorMCFetch);  
	    	});
    	}
    	else{
      	   fetchMovementConsistency(this.state.selectedDate,this.successMCFetch,this.errorMCFetch);
        }
      
            fetchLastSync(this.successLastSync,this.errorquick);
            window.scrollTo(0,0);
    }

    toggle() {
	    this.setState({
	      isOpen: !this.state.isOpen
	    });
   }


    stepsValueComma(value){
		/*adding comma to the steps when we get greater than 999 (,)comma will be added */
		if(value){
			value += '';
	     	var x = value.split('.');
	    	var x1 = x[0];
	        var x2 = x.length > 1 ? '.' + x[1] : '';
	        var rgx = /(\d+)(\d{3})/;
	        while (rgx.test(x1)) {
	         x1 = x1.replace(rgx, '$1' + ',' + '$2');
	        }
	        return x1 + x2;
	    }
	    else if(value == 0){
	    	return "0";
	    }
	    else{
	    	return "-";
	    }
	}

  	mcHistoricalData(score,status,active_prcnt){
  		/* adding background color to card depends upon their steps ranges*/
	  	  let background = "";
		  let color = "";
	      if(status == "sleeping"){
	        background= 'rgb(0,176,240)';
	        color = 'black';
	      }
	      else if(status == "inactive"){
	        background = 'red';
	    	color = 'white';
	      }
	      else if(status == "strength"){
	      	background = "rgb(255,0,255)";
	      	color = 'white';
	      }
	      else if(status == "exercise"){
	        background = "#FD9A44";
	        color = 'black';
	      }
	      else if(status == "no data yet"){
	      	score = "NDY";
	        background = "#A5A7A5";
	        color = 'black';
	      }
	      else if(status == "time zone change"){
	      	background = "#fdeab7";
	      	color = 'black';
	      }
	       else if(status == "nap"){
	      	background = " #107dac";
	      	color = 'white';
	      }
	      else if (score >= 300){
	        background = 'green';
	        color = 'white';
	      }
	    return (
	    	<td style = {{background:background,color:color}}>
	    	<div>
		    	{this.stepsValueComma(score)}
		    </div> 
		    	<div>{active_prcnt}</div>
	    	</td>
	    )
	}
	
  	renderTable(mc_data){
    /*In this table mc_data is getting into the column for a single day*/
  		var td_rows = [];
  		let keys = ["12:00 AM to 12:59 AM","01:00 AM to 01:59 AM","02:00 AM to 02:59 AM","03:00 AM to 03:59 AM","04:00 AM to 04:59 AM","05:00 AM to 05:59 AM"];
  		if(!_.isEmpty(mc_data)){
  			let non_exercise_steps = "";
	        for(let[keys1,values1] of Object.entries(mc_data)){
	         	for(let[key2,values2] of Object.entries(values1)){
	         		if(key2 == "movement_consistency"){
         	     		if(!_.isEmpty(values2)){
	                     	let td_values = [];
			              	for(let key3 of keys){
			         		 	let active_prcnt = (
			         		 		values2[key3].active_prcnt !== null && values2[key3].active_prcnt !== undefined
			         		 		?" ( "+values2[key3].active_prcnt+"% )"
			         		 		:""
			         		 	)
			         		 	let styledTd = this.mcHistoricalData(values2[key3].steps,values2[key3].status,active_prcnt); 
			         			td_values.push(styledTd);
			         		}	
		         			td_rows.push(<tr>{td_values}</tr>);
		         		}
		         	}
		        }
	         	
	  		}
  		}	
  		return td_rows;
    }
    renderTablecolumn(mc_data){
  		var td_rows = [];
  		let keys = ["06:00 AM to 06:59 AM","07:00 AM to 07:59 AM","08:00 AM to 08:59 AM","09:00 AM to 09:59 AM","10:00 AM to 10:59 AM","11:00 AM to 11:59 AM"];
     	if(!_.isEmpty(mc_data)){
	        for(let[keys1,values1] of Object.entries(mc_data)){
	         	for(let[key2,values2] of Object.entries(values1)){
	         		if(key2 == "movement_consistency"){
         	     		if(!_.isEmpty(values2)){
	                     	let td_values = [];
			              	for(let key3 of keys){
			         		 	let active_prcnt = (
			         		 		values2[key3].active_prcnt !== null && values2[key3].active_prcnt !== undefined
			         		 		?" ( "+values2[key3].active_prcnt+"% )"
			         		 		:""
			         		 	)
			         		 	let styledTd = this.mcHistoricalData(values2[key3].steps,values2[key3].status,active_prcnt); 
			         			td_values.push(styledTd);
			         		}
		         			td_rows.push(<tr>{td_values}</tr>);
		         		}
		         	}
		        }
	         	
	  		}
  		}	
  		return td_rows;
    }
    renderTabledata(mc_data){
    	var td_rows = [];
  		let keys = ["12:00 PM to 12:59 PM","01:00 PM to 01:59 PM","02:00 PM to 02:59 PM","03:00 PM to 03:59 PM","04:00 PM to 04:59 PM","05:00 PM to 05:59 PM"];
         if(!_.isEmpty(mc_data)){
	        for(let[keys1,values1] of Object.entries(mc_data)){
	         	for(let[key2,values2] of Object.entries(values1)){
         	     	if(key2 == "movement_consistency"){
         	     		if(!_.isEmpty(values2)){
	                     	let td_values = [];
			              	for(let key3 of keys){
			              		let active_prcnt = (
			         		 		values2[key3].active_prcnt !== null && values2[key3].active_prcnt !== undefined
			         		 		?" ( "+values2[key3].active_prcnt+"% )"
			         		 		:""
			         		 	)
			         		 	let styledTd = this.mcHistoricalData(values2[key3].steps,values2[key3].status,active_prcnt); 
			         			td_values.push(styledTd);
			         		}
		         			td_rows.push(<tr>{td_values}</tr>);
		         		}
		         	}
		        }
	         	
	  		}
  		}	
  		return td_rows;
    }
    renderTablecolumndata(mc_data){

    	var td_rows = [];
  		let keys = ["06:00 PM to 06:59 PM","07:00 PM to 07:59 PM","08:00 PM to 08:59 PM","09:00 PM to 09:59 PM","10:00 PM to 10:59 PM","11:00 PM to 11:59 PM"];
        if(!_.isEmpty(mc_data)){
	        for(let[keys1,values1] of Object.entries(mc_data)){
	         	for(let[key2,values2] of Object.entries(values1)){
	         		if(key2 == "movement_consistency"){
         	     		if(!_.isEmpty(values2)){
	                     	let td_values = [];
			              	for(let key3 of keys){
			         		 	let active_prcnt = (
			         		 		values2[key3].active_prcnt !== null && values2[key3].active_prcnt !== undefined
			         		 		?" ( "+values2[key3].active_prcnt+"% )"
			         		 		:""
			         		 	)
			         		 	let styledTd = this.mcHistoricalData(values2[key3].steps,values2[key3].status,active_prcnt); 
			         			td_values.push(styledTd);
			         		}
		         			td_rows.push(<tr>{td_values}</tr>);
		         		}
		         	}
		        }
	         	
	  		}
  		}	
  		return td_rows;
    }
    renderTablestatus(mc_data){
    	var td_rows = [];
        let keys = ["sleeping_hours","nap_hours","active_hours","inactive_hours","strength_hours",
        	"exercise_hours","no_data_hours","timezone_change_hours",];
        if(!_.isEmpty(mc_data)){
	        for(let[keys1,values1] of Object.entries(mc_data)){
	         	for(let[key2,values2] of Object.entries(values1)){
         	     	if(key2 == "movement_consistency"){
         	     		if(!_.isEmpty(values2)){
	                     	let td_values = [];
	                     	for(let key3 of keys) 
			         		 	td_values.push(<td className="mcs-dashboard">{values2[key3]}</td>);
		          			td_rows.push(<tr className="mcs-dashboard">{td_values}</tr>);
		         		}
		         	}
		        }
	         	
	  		}
  		}	
  		return td_rows;
  	}
    render(){
        return(
			<div className="container-fluid">
			   <NavbarMenu title = {<span className = "last_sync">Movement Consistency Score (MCS) Dashboard
                    </span>} />
               
                    <div className=" row cla_center">
                    	<span className = "col-md-3">
							<span onClick = {this.renderRemoveDate} style = {{marginLeft:"30px",marginRight:"14px"}}>
								<FontAwesome
								className="arrow"
			                        name = "angle-left"
			                        size = "2x"
				                />
							 </span> 
	                
				            <span id="navlink"  onClick={this.toggleCalendar} id="gd_progress">
	                            <FontAwesome
	                            className="arrow"
				                  name = "calendar"
				                  size = "2x"
				                />
				                <span className="date_sync" style = {{marginLeft:"20px",fontWeight:"bold",paddingTop:"4px"}}>{moment(this.state.selectedDate).format('MMM DD, YYYY')}</span>  

			                	</span>
			                <span onClick = {this.renderAddDate} style = {{marginLeft:"14px"}}>
							    <FontAwesome
							    className="arrow"
			                        name = "angle-right"
			                        size = "2x"
				                />
								</span>
							</span>

						<span  className="last_sync col-md-6 offset-md-1">{this.renderLastSync(this.state.last_synced)}</span> 
			                <Popover
					            placement="bottom"
					            isOpen={this.state.calendarOpen}
					            target="gd_progress"
					            toggle={this.toggleCalendar}>
				                <PopoverBody className="calendar2">
				                   <CalendarWidget  onDaySelect={this.processDate}/>
				         
				                </PopoverBody>
			                </Popover>
			            
			            <span className="steps_count col-md-2">{this.renderSteps(this.state.non_exercise_steps)}</span>
			         </div>
		    
			       <div className = "row justify-content-center mcs_dashboard">
			          <div className="col-sm-9 table_process">          	
	          	    	  <table className = "table table-striped table-bordered tableContent ">
		          	    	<tr className="table_content">
			          	    	<th className="table_size">12:00 - 12:59 AM</th>
			          	    	<th className="table_size">01:00 - 01:59 AM</th> 
			          	    	<th className="table_size">02:00 - 02:59 AM</th>
			          	    	<th className="table_size">03:00 - 03:59 AM</th>
			          	    	<th className="table_size">04:00 - 04:59 AM</th>
			          	    	<th className="table_size">05:00 - 05:59 AM</th>
			          	 
		          	    	</tr>
		          	    	<tbody>
		          	    		{this.renderTable(this.state.mc_data)}

		          	    </tbody>
		          	    	<tr className="table_content">
		          	    		<th className="table_size">06:00 - 06:59 AM</th>
			          	    	<th className="table_size">07:00 - 07:59 AM</th>
			          	    	<th className="table_size">08:00 - 08:59 AM</th>
			          	    	<th className="table_size">09:00 - 09:59 AM</th>
			          	    	<th className="table_size">10:00 - 10:59 AM</th>
			          	    	<th className="table_size">11:00 - 11:59 AM</th>
		          	    	</tr>
		          	    	<tbody>
		          	    		{this.renderTablecolumn(this.state.mc_data)}
		          	    </tbody>
		          	    	<tr className="table_content">
			          	    	<th className="table_size">12:00 - 12:59 PM</th>
			          	    	<th className="table_size">01:00 - 01:59 PM</th>
			          	    	<th className="table_size">02:00 - 02:59 PM</th>
			          	    	<th className="table_size">03:00 - 03:59 PM</th>
			          	    	<th className="table_size">04:00 - 04:59 PM</th>
			          	    	<th className="table_size">05:00 - 05:59 PM</th>
		          	    	</tr>
		          	    	<tbody>
		          	    		{this.renderTabledata(this.state.mc_data)}
		          	    </tbody>
		          	    	 <tr className="table_content">
		          	    		<th className="table_size">06:00 - 06:59 PM</th>
			          	    	<th className="table_size">07:00 - 07:59 PM</th>
			          	    	<th className="table_size">08:00 - 08:59 PM</th>
			          	    	<th className="table_size">09:00 - 09:59 PM</th>
			          	    	<th className="table_size">10:00 - 10:59 PM</th>
			          	    	<th className="table_size">11:00 - 11:59 PM</th>
		          	    	</tr>
		          	    	<tbody>
		          	    		{this.renderTablecolumndata(this.state.mc_data)}
		          	    </tbody>
		          	</table>
	          	</div>
		     </div>

		          <div className = "row justify-content-center table_size1">
		          	<div className = "col-sm-9">
		          	<div className="table_pro">
		          	    <table className="table table-striped table-bordered">
		          	    	<tr>
		          	    		<th className="mcs-dashboard" style={{background:'rgb(0,176,240)',color:'black'}}>Sleeping Hours</th>
			          	    	<th className="mcs-dashboard" style={{background:' #107dac',color:'white'}}>Nap Hours</th>
			          	    	<th className="mcs-dashboard" style={{background:'green',color:'white'}}>Active Hours</th>
			          	    	<th className="mcs-dashboard" style={{background:'red',color:'white'}}>Inactive Hours</th>
			          	    	<th className="mcs-dashboard" style={{background:'rgb(255,0,255)',color:'white'}}>Strength Hours</th>
								<th className="mcs-dashboard" style={{background:'#FD9A44',color:'black'}}>Exercise Hours</th>
								<th className="mcs-dashboard" style={{background:'#A5A7A5',color:'black'}}>No Data Yet</th>
								<th className="mcs-dashboard" style={{background:'#fdeab7',color:'black'}}>Time Zone Change</th>
								
		          	    	</tr>
		          	    	<tbody>
		          	    		{this.renderTablestatus(this.state.mc_data)}
		          	    	</tbody>
		            </table>
		            </div>
		            </div>
					</div>
					<div className = "row justify-content-center mcs-dashboard">
		          	<div className = "col-sm-9">
			                <p className="mcs_content" style={{marginLeft:"15px"}}>NES = Non Exercise Steps</p>
	         				<p className="mcs_content" style={{marginLeft:"15px"}}>Data in each cell = Steps in that particular hour ( percentage of active minutes in that hour )</p>
				          	<p className="mcs_content" style={{marginLeft:"15px"}}>NDY(No Data Yet) = When no data is provided from a user's wearable device (usually due to not syncing the wearable device)</p>
				          	<p className="mcs_content" style={{marginLeft:"15px"}}>Sleeping Hours = Any portion of an hour user was asleep</p>
				          	<p className="mcs_content" style={{marginLeft:"15px"}}>Active Hours = Any hour with more than 300 steps when user was not sleeping</p>
				          	<p className="mcs_content" style={{marginLeft:"15px"}}>Inactive Hours (MCS Score) = # of hours a day with 300 steps or less when a user is not sleeping</p>
				          	<p className="mcs_content" style={{marginLeft:"15px"}}>Strength Hours = Hours user recorded strength exercises</p>
			                <p className="mcs_content" style={{marginLeft:"15px"}}>Exercise Hours = (1) Any hour a user recorded an exercise activity on his/her wearable device AND/OR (2) Any hour a user added a manual activity on the user inputs page after question 1.NOTE: All exercise hours are considered ACTIVE hours</p>
			                <p className="mcs_content" style={{marginLeft:"15px"}}>Time Zone Change = Represents time period when a user changed time zones and are not considered “inactive” hours</p>
		       				<p className="mcs_content" style={{marginLeft:"15px"}}>Nap Hours = Any portion of an hour user taking nap</p>
		       		</div>
		       		</div>
     							
     </div>

      	  
      
      );
	}
}
export default MCS_Dashboard;