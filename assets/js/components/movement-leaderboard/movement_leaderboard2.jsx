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

let objectLength = 0;

class MovementLeaderboard2 extends Component{
	constructor(props) {
    super(props);
	    this.state = {
	    	//mcs_data:this.props.mcs_data,
	    	//date_of_data:this.props.selected_date
	    }
		this.renderTable = this.renderTable.bind(this);
		//this.heartBeatsColors = this.heartBeatsColors.bind(this);
		this.scrollCallback = this.scrollCallback.bind(this);
		this.doOnOrientationChange = this.doOnOrientationChange.bind(this);
		this.renderStepsColor = this.renderStepsColor.bind(this);
		this.renderCommaSteps = this.renderCommaSteps.bind(this);
		this.renderGetColors = this.renderGetColors.bind(this);
		this.strToSecond = this.strToSecond.bind(this);
		this.getStylesForExerciseduration   = this.getStylesForExerciseduration.bind(this);
		this.secondsToHms = this.secondsToHms.bind(this);
		this.mcsData = this.mcsData.bind(this);

		//this.time99Colors = this.time99Colors.bind(this);
		
	}
	secondsToHms(value) {
    
	var time;
	if(value){
		if(value == "N/A"){
			time = "00:00:00";
		}
		else if(value>0){
			var sec_num = parseInt(value); 
			var hours   = Math.floor(sec_num / 3600);
			var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
			var seconds = sec_num - (hours * 3600) - (minutes * 60);

			if (hours   < 10) {hours   = "0"+hours;}
			if (minutes < 10) {minutes = "0"+minutes;}
			if (seconds < 10) {seconds = "0"+seconds;}
			time = hours+':'+minutes+':'+seconds;
		}
	}
	else if(value == 0 || value == null){
		time = "00:00:00";
	}
	return time;
	}
	
	strToSecond(value){
	    let time = value.split(':');
	    let hours = parseInt(time[0])*3600;
	    let min = parseInt(time[1])*60;
	    let s_time = hours + min;
	    return s_time;
 	}
	getStylesForExerciseduration(value1,rank){
		let value = this.strToSecond(value1);
		let background = "";
		let color = "";
		if(value == this.strToSecond("0:00")){
			background = "red";
		    color = "black";
		}
		else if(this.strToSecond("0:01") <= value && value < this.strToSecond("15:00")){
			background = "orange";
	        color = "white";
	    }
		else if(this.strToSecond("15:00")<=value && value<this.strToSecond("30:00")){
			background = "yellow";
	        color = "white";
	    }
		else if((this.strToSecond("30:00")<=value && value<this.strToSecond("60:00"))){
			background = "lightgreen";
	        color = "white";
	    }
		else if(this.strToSecond("60:00")<=value){
			background = "green";
	        color = "white";
	    }
	    return <td className ="overall_rank_value" style = {{backgroundColor:background,color:color}}><span>{value1} {'('+rank+')'}</span></td>
	}

	renderCommaSteps(value){
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
	renderGetColors(hours_inactive,rank){
		let background = "";
		let color = "";
	    if (hours_inactive <= 4.5){
	        background = "green";
	        color = "white";
	    }
	    else if (hours_inactive > 4.5 && hours_inactive <= 6){
	       background = "#32CD32";
	        color = "white";
	    }
	    else if (hours_inactive > 6 && hours_inactive <= 7){
	       background = "yellow";
	        color = "white";
	    }
	    else if (hours_inactive > 7 && hours_inactive <= 10){
	       background = "#FF8C00";
	        color = "white";
	    }
	    else if (hours_inactive > 10){
	        background = "red";
	        color = "white";
	    }
	    return <td className ="overall_rank_value" style = {{backgroundColor:background,color:color}}><span>{hours_inactive} {'('+rank+')'}</span></td>
  }
	renderStepsColor(steps,rank){
		let background = "";
		let color = "";
		if (steps >= 10000){
	        background = "green";
	        color = "white";
		}
	    else if (steps <= 9999 && steps >= 7500){
	       background = "#32CD32";
	       color = "white";
	    }
	    else if (steps <= 7499 && steps >= 5000){
	      background = "yellow";
	       color = "white";
	    }
	    else if (steps <= 4999 && steps >= 3500){
	       background = "#FF8C00";
	       color = "white";
	    }
	    else if (steps < 3500){
	        background = "red";
	       color = "black";
	    }
	    return <td className ="overall_rank_value" style = {{backgroundColor:background,color:color}}><span>{this.renderCommaSteps(steps)} {'('+rank+')'}</span></td>
  }
  	scrollCallback(operationCount) {
      if (objectLength === operationCount) {
          setTimeout(function () {
            var x = window.matchMedia("(max-width: 900px)");
            if(x.matches){
               document.getElementById('my-row').style.background = 'lightyellow';
                var index = -1;
                var rows = document.getElementById("my-table").offsetHeight;
                var rows1 = document.getElementById("my-row").offsetTop;
                var rows2 = rows1 + 180;
                var rows3 = rows2 - 712;
                if(rows1 >= 520){
                  window.scrollTo(0,  rows3);
                }
                else{
                  window.scrollTo(0, 155);
                }
            }
            else{
                document.getElementById('my-row').style.background = 'lightyellow';
                var index = -1;
                var rows = document.getElementById("my-table").offsetHeight;
                var rows1 = document.getElementById("my-row").offsetTop;
                var rows2 = rows1 + 180;
                var rows3 = rows2 - 662;
                if(rows1 >= 520){
                  window.scrollTo(0,  rows3);
                }
                else{
                  window.scrollTo(0, 130);
                }
            }
          },100);
      }
  	}
  	doOnOrientationChange() {
	   let screen1 = screen.orientation.angle;
	   let window1 = window.orientation;
	   let final;
	   if(window1 != undefined){
	   }
	   else{
	   	if(screen1 == 90 || screen1 == -90){
	   		final = screen1;	
	   	}
	   	else{
	   		final = 0;
	   	}
	   }
	   return final;
	}
	componentDidMount(){
		window.addEventListener('orientationchange', this.doOnOrientationChange);

		/**** Sticky Header on scroll ********/ 
		window.addEventListener('scroll', this.handleScroll);

		/****** mobile table styles *******/
		let getTable = this.refs.mov_dashboard_table;

		if(screen.width < 1023){
			getTable.classList.add('table_padding')
		}
		else{
			getTable.classList.remove('table_padding')
		}
		
		/***********************/
		let header = this.refs.table_header_hrr;		
		if(screen.width < 650){
			  header.classList.remove("mov_sticky");
		}

	};


	/******* sticky table header on scroll ********/
	handleScroll = () => {
		 let header = this.refs.table_header_hrr;	
		 var rect = header.getBoundingClientRect()
		 let sticky = rect.top+80;

		 if(screen.width > 650){
		 	if (window.pageYOffset > sticky) {
		    header.classList.add("mov_sticky");
		  } else {
		    header.classList.remove("mov_sticky");
		  }
		 }

	};
	mcsData(status){
  		/* adding background color to card depends upon their steps ranges*/
	  	  let background = "";
		  let color = "";
	      if(status == "sleeping"){
	        background= 'rgb(0,176,240)';
	      }
	      else if(status == "inactive"){
	        background = 'red';
	      }
	      else if(status == "strength"){
	      	background = "rgb(255,0,255)";
	      }
	      else if(status == "exercise"){
	        background = "#FD9A44";
	      }
	      else if(status == "no data yet"){
	        background = "#A5A7A5";
	      }
	      else if(status == "time zone change"){
	      	background = "#fdeab7";
	      }
	       else if(status == "nap"){
	      	background = " #107dac";
	      }
	      else if (status == "active"){
	        background = 'green';
	      }
	    return (
	    	<td style = {{background:background}}>
	    	</td> 
	    )
	}
	renderTable(Movement_data,Movement_username,MCS_data,selectedRange){
		let operationCount = 0;
		let td_rows = [];
		let keys = ["rank","username","nes","exercise_steps","total_steps","mc","exercise_duration","active_min_total","active_min_sleep","active_min_exclude_sleep","active_min_exercise","active_min_exclude_sleep_exercise","total_movement_rank_point"];
		objectLength = Object.keys(Movement_data).length;
		for(let[key,value] of Object.entries(Movement_data)){
			let td_values = [];
			 let currentUser = '';
			 let currentUserId = value['nes'].user_id;
			for(let key1 of keys){
				if(key1 == "rank"){
					td_values.push(<td className ="overall_rank_value">{value[key1]}</td>);
				}
				else if(key1 == "username"){
					let user = value[key1];
					if(user == Movement_username){
						td_values.push(<td className ="overall_rank_value">{user}</td>);
						currentUser = user;
					}
					else{
						td_values.push(<td className ="overall_rank_value">{user}</td>);
						currentUser = '';
					}
				}
				else if(key1 == "nes"){
					td_values.push(this.renderStepsColor(value[key1].score.value,value[key1].rank));
				}
				else if(key1 == "exercise_steps"){
					td_values.push(<td className ="overall_rank_value">{this.renderCommaSteps(value[key1].score.value)}</td>);
				}
				else if(key1 == "total_steps"){
					td_values.push(<td className ="overall_rank_value">{this.renderCommaSteps(value[key1].score.value)}</td>);
				}
				else if(key1 == "mc"){
					td_values.push(this.renderGetColors(value[key1].score.value,value[key1].rank));
				}
				else if(key1 == "exercise_duration"){
					td_values.push(this.getStylesForExerciseduration(value[key1].score.value,value[key1].rank));	
				}
				else if(key1 == "active_min_total"){
					td_values.push(<td className ="overall_rank_value"><span>{this.secondsToHms(value[key1].score.value)} ({value[key1].rank})</span></td>);
				}
				  else if(key1 == "active_min_sleep"){
				  	if(value["active_min_total"].other_scores != null) {
						td_values.push(<td className ="overall_rank_value"><span>{this.secondsToHms(value["active_min_total"].other_scores.active_min_sleep.value)}</span></td>);
					}
				}
				else if(key1 == "active_min_exclude_sleep"){
					td_values.push(<td className ="overall_rank_value"><span>{this.secondsToHms(value[key1].score.value)} ({value[key1].rank})</span></td>);	
				}
			     else if(key1 == "active_min_exercise"){
			     	if(value["active_min_total"].other_scores != null) {
						td_values.push(<td className ="overall_rank_value"><span>{this.secondsToHms(value["active_min_total"].other_scores.active_min_exercise.value)}</span></td>);
					}	
			     }
                else if(key1 == "active_min_exclude_sleep_exercise"){
					td_values.push(<td className ="overall_rank_value"><span>{this.secondsToHms(value[key1].score.value)} ({value[key1].rank})</span></td>);	
				}
				else if (key1 == "total_movement_rank_point"){
					td_values.push(<td className ="overall_rank_value"><span>{value[key1]}</span></td>);
				}

			}

			if( MCS_data && !_.isEmpty( MCS_data[currentUserId.toString()] ) ){
				let object = MCS_data[currentUserId.toString()]
				td_values.push(<td className ="overall_rank_value">
				<table cellpadding="3" cellspacing="3" style={{width:"45px"}}>
					<tr>
						{this.mcsData(object["12:00 AM to 12:59 AM"])}
						{this.mcsData(object["01:00 AM to 01:59 AM"])}
						{this.mcsData(object["02:00 AM to 02:59 AM"])}
						{this.mcsData(object["03:00 AM to 03:59 AM"])}
						{this.mcsData(object["04:00 AM to 04:59 AM"])}
						{this.mcsData(object["05:00 AM to 05:59 AM"])}
						{this.mcsData(object["06:00 AM to 06:59 AM"])}
						{this.mcsData(object["07:00 AM to 07:59 AM"])}
						{this.mcsData(object["08:00 AM to 08:59 AM"])}
						{this.mcsData(object["09:00 AM to 09:59 AM"])}
						{this.mcsData(object["10:00 AM to 10:59 AM"])}
						{this.mcsData(object["11:00 AM to 11:59 AM"])}	
					</tr>

					<tr>
						{this.mcsData(object["12:00 PM to 12:59 PM"])}
						{this.mcsData(object["01:00 PM to 01:59 PM"])}
						{this.mcsData(object["02:00 PM to 02:59 PM"])}
						{this.mcsData(object["03:00 PM to 03:59 PM"])}
						{this.mcsData(object["04:00 PM to 04:59 PM"])}
						{this.mcsData(object["05:00 PM to 05:59 PM"])}
						{this.mcsData(object["06:00 PM to 06:59 PM"])}
						{this.mcsData(object["07:00 PM to 07:59 PM"])}
						{this.mcsData(object["08:00 PM to 08:59 PM"])}
						{this.mcsData(object["09:00 PM to 09:59 PM"])}
						{this.mcsData(object["10:00 PM to 10:59 PM"])}
						{this.mcsData(object["11:00 PM to 11:59 PM"])}
					</tr>
				</table>
					
			</td>);
		}
		else if(selectedRange.rangeType !== 'today' && selectedRange.rangeType !== 'yesterday'){
			let startDate = selectedRange.dateRange.split("to")[0].trim();
			let endDate = selectedRange.dateRange.split("to")[1].trim();
			let redirectMCHURL = `/rawdata?&rtype=mch&uid=${currentUserId}&start_date=${startDate}&end_date=${endDate}`
			td_values.push(
				<td className ="overall_rank_value">
					<Link to={redirectMCHURL}>
						<span id="lbfontawesome">
		                    <FontAwesome
		                    	className = "fantawesome_style"
		                        name = "external-link"
		                        size = "1x"
		                    />
					    </span>
					</Link>	
				</td>
			)

		}
		else{
			td_values.push(<td className ="overall_rank_value"></td>);
		}
			++operationCount;
                this.scrollCallback(operationCount);
			td_rows.push(<tr id={(currentUser) ? 'my-row' : ''}>{td_values}</tr>);	
		}
		let table = <div className = "table table-responsive table-bordered">
			          	    <table id="my-table" className = "table table-striped" cellpadding="10" cellspacing="10">
								<tr ref="table_header_hrr">
									<th>Rank</th>
									<th>User</th>
									<th>Non Exercise Steps <br/> (Rank)</th>
									<th>Exercise (Activity) <br/>Steps</th>
									<th>Total <br />Steps *</th>
									<th>MCS Score<br />(Rank)</th>
									<th>Exercise Duration<br />(Rank)</th>
									<th>Entire 24 Hour Day <br/> (Rank)</th>
									<th>During Sleep Hours</th>
									<th>Entire 24 Hour Day Excluding Sleep <br/> (Rank)</th>
									<th>During Exercise Hours</th>
									<th>Entire 24 Hour Day Excluding Sleep and Exercise <br/> (Rank)</th>
									<th>Overall Movement Rank Points</th>
									<th>
										<table>
										<tr><td>12 AM</td><td>11:59 AM</td></tr>
										<tr><td>12 PM</td><td>11:59 PM</td></tr>
										</table>
									</th>
								</tr>
								<tbody>
								{td_rows}
								</tbody>
							</table>
						</div>
		return table;
	}

	render(){
		return(
				<div className = "container-fluid">		   
					<div className = "mov_dashboard_table" ref="mov_dashboard_table">
						{
							this.renderTable(
								this.props.Movement_data,
								this.props.Movement_username,
								this.props.mcs_data,
								this.props.selectedRange
							)
						}	
					</div>
					<div className = "row">
						<div className = "col-sm-9">
			          			<p className="footer_content" style={{marginLeft:"15px"}}>
			          			*  Not included in overall Rank Points
			          			</p>
			          	</div>
		          	</div>	
				</div>
			);
	}
}
export default MovementLeaderboard2;