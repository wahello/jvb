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

function minuteToHM(value) {
	var time;
	if( isNaN(value) || value == null ){
      return "00:00";
	} 
	if(value){
		if(value == "N/A"){
			time = "00:00";
		}
		else if(value>0){
			var min_num = parseInt(value); 
			var hours   = Math.floor(min_num / 60);
			var minutes = Math.floor(min_num % 60);

			if (hours   < 10) {hours   = "0"+hours;}
			if (minutes < 10) {minutes = "0"+minutes;}
			time = hours+':'+minutes;
		}
	}
	else if(value == 0 || value == null ){
		time = "00:00";
	}
	return time;
}
	
function strToSecond(value){
    let time = value.split(':');
    let hours = parseInt(time[0])*3600;
    let min = parseInt(time[1])*60;
    let s_time = hours + min;
    return s_time;
}

function strToMin(value){
    let time = value.split(':');
    let hours = parseInt(time[0])*60;
    let mins = parseInt(time[1]);
    return hours+mins;
}

function getGradeStartEndRange(exerciseActiveDuration=null){
	let gradeRanges = {
		'A':["04:06","04:06"], //[lower End, higher End]
		'B':["03:13","04:05"],
		'C':["02:45","03:12"],
		'D':["02:01","02:44"],
		'F':["00:00","02:00"]
	}

	if(exerciseActiveDuration){
		const EXERCISE_ACTIVE_TIME_CAP = 60;
		let timeToDeduct = EXERCISE_ACTIVE_TIME_CAP;
		exerciseActiveDuration = strToMin(exerciseActiveDuration);
		if(exerciseActiveDuration < EXERCISE_ACTIVE_TIME_CAP)
			timeToDeduct = exerciseActiveDuration;
		for(let [grade,range] of Object.entries(gradeRanges)){
			let lowEnd = strToMin(range[0]);
			let highEnd = strToMin(range[1]);
			if(lowEnd != 0)
				gradeRanges[grade][0] = minuteToHM(lowEnd - timeToDeduct)
			gradeRanges[grade][1] = minuteToHM(highEnd - timeToDeduct)
		}

	}

	return gradeRanges
}

function getStylesForActiveMinute(totalActiveDuration,rank,exerciseActiveMin=null){
	let gradeStartEndRange = getGradeStartEndRange(exerciseActiveMin);
	totalActiveDuration = minuteToHM(totalActiveDuration);
	let totalTimeInSeconds = strToSecond(totalActiveDuration);
	let background = "";
	let color = "";
	if(totalTimeInSeconds >= strToSecond(gradeStartEndRange.A[0])){
		background = "green";
		color = "white";
	}else if(totalTimeInSeconds >= strToSecond(gradeStartEndRange.B[0]) 
			 && totalTimeInSeconds <= strToSecond(gradeStartEndRange.B[1])){
		background = "#32CD32";
		color = "white";
	}else if(totalTimeInSeconds >= strToSecond(gradeStartEndRange.C[0])
			 && totalTimeInSeconds <= strToSecond(gradeStartEndRange.C[1])){
		background = "yellow";
		color = "black";
	}else if(totalTimeInSeconds >= strToSecond(gradeStartEndRange.D[0])
			 && totalTimeInSeconds <= strToSecond(gradeStartEndRange.D[1])){
		background = "orange";
		color = "white";
	}else{
		background = "red";
		color = "black";
	}
	return (
		<td 
			className ="overall_rank_value"
			style = {{backgroundColor:background,color:color}}>
			<span>{totalActiveDuration} {'('+rank+')'}</span>
		</td>
	);

}

class MovementLeaderboard2 extends Component{
	constructor(props) {
    super(props);
	    this.state = {
	    	
	    }
		this.renderTable = this.renderTable.bind(this);
		//this.heartBeatsColors = this.heartBeatsColors.bind(this);
		this.scrollCallback = this.scrollCallback.bind(this);
		this.doOnOrientationChange = this.doOnOrientationChange.bind(this);
		this.renderStepsColor = this.renderStepsColor.bind(this);
		this.renderCommaSteps = this.renderCommaSteps.bind(this);
		this.renderGetColors = this.renderGetColors.bind(this);
		this.getStylesForExerciseduration   = this.getStylesForExerciseduration.bind(this);
		this.mcsData = this.mcsData.bind(this);
		this.exerciseDurColrsSingleDayOr2to6Days = this.exerciseDurColrsSingleDayOr2to6Days.bind(this);

		//this.time99Colors = this.time99Colors.bind(this);
		
	}

 	exerciseDurColrsSingleDayOr2to6Days(value,background,color,value1,rank,avgHR){
 			if(value == strToSecond("0:00")){
				background = "red";
			    color = "black";
			}
			else if(strToSecond("0:01") <= value && value < strToSecond("00:15")){
				background = "orange";
		        color = "white";
		    }
			else if(strToSecond("00:15")<=value && value<strToSecond("00:30")){
				background = "yellow";
		        color = "black";
		    }
			else if((strToSecond("00:30")<=value && value<strToSecond("01:00"))){
				background = "#32CD32";
		        color = "white";
		    }
			else if(strToSecond("01:00")<=value){
				background = "green";
		        color = "white";
		    }
		    return (
		    	<td 
		    		className ="overall_rank_value" 
		    		style = {{backgroundColor:background,color:color}}>
		    		<span>{value1} {'('+rank+')'} {' / '}{avgHR}</span>
		    	</td>
		    )
	}

	getStylesForExerciseduration(value1,rank,avgHR,selectedRange){
		let value = strToSecond(value1);
		let background = "";
		let color = "";
		if(!avgHR){
			avgHR = "NM"
		}

		if(selectedRange.rangeType == 'today' || selectedRange.rangeType == 'yesterday'){
			let td = this.exerciseDurColrsSingleDayOr2to6Days(
						value,background,color,value1,rank,avgHR);
			return td;
			
		}
		else{
			let startDate = selectedRange.dateRange.split("to")[0].trim();
			let endDate = selectedRange.dateRange.split("to")[1].trim();
			let numberOfDays = Math.abs(moment(endDate).diff(moment(startDate), 'days'))+1;
			if(numberOfDays >= 7){
				let avgValueInSecPer7Days = Math.round(value / numberOfDays) * 7
				if(avgValueInSecPer7Days == strToSecond("0:00")){
					background = "red";
				    color = "black";
				}
				else if(avgValueInSecPer7Days > strToSecond("0:00") 
						&& avgValueInSecPer7Days <= strToSecond("01:39")){
					background = "orange";
			        color = "white";
			    }
				else if(avgValueInSecPer7Days > strToSecond("01:39") 
						&& avgValueInSecPer7Days <= strToSecond("02:29")){
					background = "yellow";
			        color = "black";
			    }
				else if((avgValueInSecPer7Days > strToSecond("02:29") 
						&& avgValueInSecPer7Days <= strToSecond("04:59"))){
					background = "#32CD32";
			        color = "white";
			    }
				else if(avgValueInSecPer7Days > strToSecond("04:59")){
					background = "green";
			        color = "white";
			    }
			    return (
			    	<td className ="overall_rank_value" 
			    		style = {{backgroundColor:background,color:color}}>
			    		<span>{value1} {'('+rank+')'} {' / '}{avgHR}</span>
			    	</td>
			    );
			}
			else if(numberOfDays >= 2 && numberOfDays <= 6){
				let avgValueInSecPerDay = Math.round(value / numberOfDays)
				let td = this.exerciseDurColrsSingleDayOr2to6Days(
							avgValueInSecPerDay,background,color,value1,rank,avgHR);
				return td;
			}
			else {
				let td = this.exerciseDurColrsSingleDayOr2to6Days(
							value,background,color,value1,rank,avgHR);
				return td;
			} 	
		}   
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
	        color = "black";
	    }
	    else if (hours_inactive > 7 && hours_inactive <= 10){
	       background = "#FF8C00";
	        color = "white";
	    }
	    else if (hours_inactive > 10){
	        background = "red";
	        color = "white";
	    }
	    return (
	    	<td 
	    		className ="overall_rank_value"
	    		style = {{backgroundColor:background,color:color}}>
	    		<span>{hours_inactive} {'('+rank+')'}</span>
	    	</td>
	    );
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
	       color = "black";
	    }
	    else if (steps <= 4999 && steps >= 3500){
	       background = "#FF8C00";
	       color = "white";
	    }
	    else if (steps < 3500){
	        background = "red";
	       color = "black";
	    }
	    return (
	    	<td 
	    		className ="overall_rank_value"
	    		style = {{backgroundColor:background,color:color}}>
	    		<span>{this.renderCommaSteps(steps)} {'('+rank+')'}</span>
	    	</td>
	    );
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
		if(window.scrollY < 150){
			  header.classList.remove("mov_sticky");
		}

	};


	/******* sticky table header on scroll ********/
	handleScroll = () => {
		 let header = this.refs.table_header_hrr;	
		 	if (window.scrollY >= 150) {
		    header.classList.add("mov_sticky");
		  } else {
		    header.classList.remove("mov_sticky");
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
		let keys = ["rank","username","nes","exercise_steps","total_steps","mc",
					"exercise_duration","aerobic_duration","active_min_total",
					"active_min_sleep","active_min_exclude_sleep_exercise",
					"total_rank_point"];

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
                else if(key1 == "aerobic_duration"){
                  let aerobic_prcnt = value[key1].other_scores.prcnt_aerobic_duration.value;
                  let anaerobic_prcnt = value[key1].other_scores.prcnt_anaerobic_duration.value;
                  let below_aerobic_prcnt =  value[key1].other_scores.prcnt_below_aerobic_duration.value;
                  let heartrate_not_recorded_prcnt = value[key1].other_scores.prcnt_hr_not_recorded_duration.value; 
                  if(aerobic_prcnt == null){
                  	aerobic_prcnt = 0
                  }
                  if( anaerobic_prcnt == null ){
                     anaerobic_prcnt = 0;
                  }
                  if( below_aerobic_prcnt == null ){
                     below_aerobic_prcnt = 0;
                  }
                  if( heartrate_not_recorded_prcnt == null ){
                         heartrate_not_recorded_prcnt = 0;
                  }	
                  if(value[key1].score.value != null && value[key1].other_scores.anaerobic_duration.value != null &&
                      value[key1].other_scores.below_aerobic_duration.value != null && value[key1].other_scores.hr_not_recorded_duration.value != null){
                      td_values.push(
	                          <td className ="overall_rank_value" >
	                      	 <table className="heartrate_zone_table" style={{marginLeft:"auto",marginRight:"auto",backgroundColor:'#FFF'}}>
	                     	<tr><td>
	                        {value[key1].score.value+('\n')+"("+aerobic_prcnt+"%"+")"}
	                        </td>
	                         <td>
	                        {value[key1].other_scores.anaerobic_duration.value+('\n')+"("+anaerobic_prcnt+"%"+")"}
	                        </td></tr>
	                        <tr><td>
	                        {value[key1].other_scores.below_aerobic_duration.value+('\n')+"("+ below_aerobic_prcnt+"%"+")"}
	                        </td>
	                        <td>
	                        {value[key1].other_scores.hr_not_recorded_duration.value+('\n')+"("+heartrate_not_recorded_prcnt+"%"+")"}
	                        </td></tr>
	                        </table>
	                         </td>);
                          }
                     else{
                             td_values.push(<td>{"-"}</td>);		                        
                  	     
                         }
                }
				else if(key1 == "exercise_duration"){
					td_values.push(this.getStylesForExerciseduration(
						value[key1].score.value, value[key1].rank,
						value[key1].other_scores.avg_exercise_heart_rate.value,
						selectedRange
					));	
				}
				
				else if(key1 == "active_min_total"){
					td_values.push(getStylesForActiveMinute(value[key1].score.value,value[key1].rank));
				}
				  else if(key1 == "active_min_sleep"){
				  	if( value["active_min_total"].other_scores != null ) {
						td_values.push(<td className ="overall_rank_value"><span>{minuteToHM(value["active_min_total"].other_scores.active_min_sleep.value)
							              +(' ')+'/'+(' ')+minuteToHM(value["active_min_total"].other_scores.active_min_exercise.value)}</span></td>);
					}
				}
                else if(key1 == "active_min_exclude_sleep_exercise"){
					td_values.push(
						getStylesForActiveMinute(
							value[key1].score.value,
							value[key1].rank,
							minuteToHM(value["active_min_total"].other_scores.active_min_exercise.value)
						)
					);	
				}
				else if (key1 == "total_rank_point"){
					td_values.push(<td className ="overall_rank_value"><span>{value[key1]}</span></td>);
				}

			}

			if( MCS_data && !_.isEmpty( MCS_data[currentUserId.toString()] ) ){
				let object = MCS_data[currentUserId.toString()]
				td_values.push(<td className ="overall_rank_value">
				<table cellpadding="3" cellspacing="3" style={{width:"45px",marginLeft:"auto",marginRight:"auto"}}>
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
			startDate = moment(startDate,"YYYY-MM-DD").format("MM-DD-YYYY");
			endDate = moment(endDate,"YYYY-MM-DD").format("MM-DD-YYYY");
			let exportExcelMCHURL = `/quicklook/print/excel?type=only_mcs&user_id=${currentUserId}&from_date=${startDate}&to_date=${endDate}`
			td_values.push(
				<td className ="overall_rank_value">
					<a href={exportExcelMCHURL}>
						<span id="lbfontawesome">
		                    <FontAwesome
		                    	className = "fantawesome_style"
		                        name = "external-link"
		                        size = "1x"
		                    />
					    </span>
					</a>	
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
									<th>Exercise Duration (Rank) / Avg HR</th>
									<th>
									   Aerobic /<br/>Anaerobic **<br/>
									   <table>
									   <tr><td>AE</td><td>AN</td></tr>
									   <tr><td>BA</td><td>NR</td></tr> 
									   </table>
									</th>
									<th>Entire 24 Hour Day <br/> (Rank)</th>
									<th>During Sleep Hours / During Exercise Hours</th>
									<th>24 Hour Day Excluding Sleep and Exercise <br/> (Rank)</th>
									<th>Overall Movement Rank Points</th>
									<th>MCS<br/>
										<table>
										<tr><td>12:00 AM</td><td>11:59 AM</td></tr>
										<tr><td>12:00 PM</td><td>11:59 PM</td></tr>
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
				<div >		   
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
						<div className = "col-sm-12">
			          			<p className="footer_content" style={{marginLeft:"15px"}}>
			          			Note: All time periods/durations are in hours:minutes (hh:mm)
			          			</p>
			          			<p className="footer_content" style={{marginLeft:"15px"}}>
			          				** Represents duration (hh:mm) that the exercise range was in each of our 4 heart rate zones:
			          				<li>Aerobic (AE): Aerobic Duration (% of total time)</li> 
			          				<li>Anaerobic (AN): Anaerobic Duration (% of total time)</li>
			          				<li>Below Aerobic (BA): Below Aerobic Duration (% of total time)</li>
			          				<li>Not Recorded (NR): HR Not Recorded Duration(% of total time)</li>
			          			</p>
			          			<p className="footer_content" style={{marginLeft:"15px"}}>
			          			The Movement Leaderboard provides a robust view of your movement across a number of categories that we use to assess movement.  In our experience, people that do well across all 5 of these categories consistently over time are healthier and feel better than those that don’t.  Users can choose various time periods or select any custom range by touching “Select Range” or entering a time period in one of the “Custom Date Range” buttons.  If viewing on a mobile device, turn your mobile device to the side (landscape mode) to see all columns.  You can also see how other people are doing on this page.  We include this so that each of us are motivated/inspired to do a little better!
			          			</p>
			          			<p className="footer_content" style={{marginLeft:"15px"}}>
			          			Rank: Represents your overall movement rank, calculated by adding up your rank in our 5 movement categories (your rank can be seen next to each of these 5 categories in parenthesis):  (1) total non exercise steps; (2) movement consistency score (MCS), the number of inactive hours defined as when a user does not have 300 steps in an awake hour; (3) exercise duration; (4) the number of active minutes for the full 24 hours; (5) the number of active minutes for the full 24 hours when a user is not sleeping and exercising. 

			          			</p>
			          			<p className="footer_content" style={{marginLeft:"15px"}}>
			          			Non Exercise Steps:  steps achieved when not exercising 
			          			</p>
			          			<p className="footer_content" style={{marginLeft:"15px"}}>
			          			Exercise (activity) steps: steps achieved when exercising.  Users can also manually enter in exercise (activity) steps in the activity grid below question 1. of the user inputs 
			          			</p>
			          			<p className="footer_content" style={{marginLeft:"15px"}}>
			          			Total Steps:  total steps achieved (exercise and non exercise steps)
			          			</p>
			          			<p className="footer_content" style={{marginLeft:"15px"}}>
			          			MCS Score:  total inactive hours (sum of hours each day a user does not achieve 300 steps in any hour) per day when not sleeping, napping, and exercising
			          			</p>
			          			<p className="footer_content" style={{marginLeft:"15px"}}>
			          			Exercise Duration / Average HR:  total exercise duration each day.  Users can characterize an activity as “exercise” or “non exercise” on the activity summary for each activity below question 1. on the user inputs page. Note: users are only given credit for exercise or non exercise for each activity (not both). Also includes the average heartrate of all exercise activities. NM = Heart Rate Not Measured.
			          			</p>
			          			<p className="footer_content" style={{marginLeft:"15px"}}>
			          			Entire 24 Hours:  the number of active minutes for the full 24 hours.  Active minutes are provided by wearable devices and a minute is considered “active” if it has 1 or more steps in that minute
			          			</p>
			          			<p className="footer_content" style={{marginLeft:"15px"}}>
			          			Entire Day (excluding sleep and exercise): the number of active minutes for the full 24 hours when a user is not sleeping and not exercising.  In our experience, this is the category we do the worst in, as many of us sit a large portions of the day after exercising. We encourage you to do better in this category. Get up and move 300 steps every hour (takes 3-5 minute an hour).  Set an alarm or reminder on your phone each awake hour to remind you to get up (otherwise many of us forget to do it!). Sitting is considered smoking by many. Moving each hour will extend your life and make you feel much better!
			          			</p>
			          			<p className="footer_content" style={{marginLeft:"15px"}}>
			          			MCS: represents your movement for all 24 hours of the day (these colors come directly from the Movement Consistency Dashboard, check it out for more details and see below for the color key).   We include this summary so you can quickly see your 24 summary, as well as how others are doing to motivate/inspire you to do better!
			          			</p>
			          			<p className="footer_content" style={{marginLeft:"15px"}}>
			          			<div className="rd_mch_color_legend color_legend_green"></div>
					            <span className="rd_mch_color_legend_label">Active</span>
					            <div className="rd_mch_color_legend color_legend_red"></div>
					            <span className="rd_mch_color_legend_label">Inactive</span>
					            <div className="rd_mch_color_legend color_legend_pink"></div>
					            <span className="rd_mch_color_legend_label">Strength</span>
					            <div className="rd_mch_color_legend color_legend_blue"></div>
					            <span className="rd_mch_color_legend_label">Sleeping</span>
					            <div className="rd_mch_color_legend color_legend_yellow"></div>
					            <span className="rd_mch_color_legend_label">Exercise</span>
					            <div className="rd_mch_color_legend color_legend_grey"></div>
					            <span className="rd_mch_color_legend_label">No Data Yet</span>
					            <div className="rd_mch_color_legend color_legend_tz_change"></div>
					            <span className="rd_mch_color_legend_label">Time Zone Change</span>
					            <div className="rd_mch_color_legend color_legend_nap_change"></div>
					            <span className="rd_mch_color_legend_label">Nap</span>
			          			</p>
			          			<p className="footer_content" style={{marginLeft:"15px"}}>
			          			*  Not included in overall Rank Points. Provided for information purposes only.  We look at exercise (getting your heart rate up above normal heart rate ranges when not exerting yourself) and non exercise (movement when your heart rate is not elevated)
			          			</p>
			          	</div>
		          	</div>
		          	
		          	{/*<div className = "row">
						<div className = "col-sm-9">
			          			<p className="footer_content" style={{marginLeft:"15px"}}>
			          			Note: All time periods/durations are in hours:minutes (hh:mm)
			          			</p>
			          	</div>
		          	</div>	*/}
				</div>
			);
	}
}
export default MovementLeaderboard2;