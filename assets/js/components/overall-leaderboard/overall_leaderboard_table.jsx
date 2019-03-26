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

class OverallLeaderboardTable extends Component{

	constructor(props){
		super(props);
       
        this.setState = {

        }
        this.renderTable = this.renderTable.bind(this);
        this.scrollCallback = this.scrollCallback.bind(this);
		this.doOnOrientationChange = this.doOnOrientationChange.bind(this);
		this.renderStepsColor = this.renderStepsColor.bind(this);
		this.renderCommaSteps = this.renderCommaSteps.bind(this);
		this.renderGetColors = this.renderGetColors.bind(this);
		this.getStylesForExerciseduration   = this.getStylesForExerciseduration.bind(this);
		this.mcsData = this.mcsData.bind(this);
		this.exerciseDurColrsSingleDayOr2to6Days = this.exerciseDurColrsSingleDayOr2to6Days.bind(this);
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
		let getTable = this.refs.overall_Leaderboard;

		if(screen.width < 1023){
			//getTable.classList.add('table_padding')
		}
		else{
			getTable.classList.remove('table_padding')
		}
		
		/***********************/
		let header = this.refs.table_header_overall;		
		if(window.scrollY < 150){
			  header.classList.remove("mov_sticky");
		}

	};


	/******* sticky table header on scroll ********/
	handleScroll = () => {
		 let header = this.refs.table_header_overall;	
		 	if (window.scrollY >= 150) {
		    header.classList.add("mov_sticky");
		  } else {
		    header.classList.remove("mov_sticky");
		  }
	};

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

	renderTable(overall_data,Movement_username,MCS_data,selectedRange){
		let operationCount = 0;
		let td_rows = [];
		let keys = [ "rank","username","oh_gpa","avg_sleep","resting_hr","nes",
		             "mc","ec","exercise_duration","aerobic_duration","vo2_max",
		             "prcnt_uf","alcohol" ];
{/*"user_daily_inputs"*/}
		objectLength = Object.keys(overall_data).length;
		for(let[key,value] of Object.entries(overall_data)){
			let td_values = [];
			 let currentUser = '';
			 let currentUserId = value['nes'].user_id;
			for(let key1 of keys){
				if( key1 == "rank" ){
					td_values.push(<td className="rnk">{value[key1]}</td>);
				}
				else if( key1 == "username" ){
					let user = value[key1];
					if(user == Movement_username){
						td_values.push(<td className="usr">{user}</td>);
						currentUser = user;
					}
					else{
						td_values.push(<td  className="usr">{user}</td>);
						currentUser = '';
					}
				}
				else if( key1 == "oh_gpa" ){
					td_values.push(<td className="ogpa">{value[key1].score.value,value[key1].rank}</td>);
				}
				else if( key1 == "avg_sleep" ){
				    td_values.push(<td className="slp">{value[key1].score.value,value[key1].rank}</td>); 	
				}
                else if( key1 == "resting_hr" ){
                    td_values.push(<td className="rhr">{value[key1].score.value,value[key1].rank}</td>);   
                }
                else if( key1 == "nes" ){
                     td_values.push(<td className="Nes">{value[key1].score.value,value[key1].rank}</td>);
                }
                else if( key1 == "mc" ){
                	td_values.push(<td className="MC">{value[key1].score.value,value[key1].rank}</td>);
                }
                else if( key1 == "ec" ){
                     td_values.push(<td className="EC">{value[key1].score.value,value[key1].rank}</td>);
                }
                else if( key1 == "exercise_duration" ){
                	let avg_exercise_heart_rate = value[key1].other_scores.avg_exercise_heart_rate.value; 
                     if( avg_exercise_heart_rate == null ){
                     	 avg_exercise_heart_rate = 'N/A'; 
                     	}
                     td_values.push(
                     	            <td className="ed">
                     	            {value[key1].score.value,(value[key1].rank)+(' ')+'/'+(' ')+avg_exercise_heart_rate}
                     	            </td>);	
                }
                else if( key1 == "aerobic_duration" ){
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
	                          <td className="ad">
	                      	 <table style={{marginLeft:"auto",marginRight:"auto",backgroundColor:'#FFF'}}>
	                     	<tr><td>
	                        {value[key1].score.value}<br/>{"("+aerobic_prcnt+"%"+")"}
	                        </td>
	                         <td>
	                        {value[key1].other_scores.anaerobic_duration.value}<br/>{"("+anaerobic_prcnt+"%"+")"}
	                        </td></tr>
	                        <tr><td>
	                        {value[key1].other_scores.below_aerobic_duration.value}<br/>{"("+ below_aerobic_prcnt+"%"+")"}
	                        </td>
	                        <td>
	                        {value[key1].other_scores.hr_not_recorded_duration.value}<br/>{"("+heartrate_not_recorded_prcnt+"%"+")"}
	                        </td></tr>
	                        </table>
	                         </td>);
                          }
                     else{
                             td_values.push(<td className="ad">{"-"}</td>);		                        
                  	     
                         }
                }
                else if( key1 == "vo2_max" ){
                    td_values.push(<td className="vmax">{value[key1].score.value}</td>);	
                }
                else if( key1 == "prcnt_uf" ){
                	let percent_unprocessed_food = value[key1].other_scores.percent_unprocessed_food.value;
                	if( percent_unprocessed_food == null ){
                		percent_unprocessed_food = 'N/A';
                	}
                    td_values.push(<td className="upf">
                    	            {percent_unprocessed_food+"%"+"("+value[key1].score.value+")"}
                    	           </td>);     
                }
                else if( key1 == "alcohol" ){
                	let alcohol_drink_per_day = value[key1].other_scores.alcohol_drink_per_day.value;
                	if( alcohol_drink_per_day == null ){
                		alcohol_drink_per_day = 'N/A';
                	}
                	if( alcohol_drink_per_day == "Not Reported"){
                		alcohol_drink_per_day = 'N/R';
                	}
                	td_values.push(<td className = "alchl_drnk">
                		           {alcohol_drink_per_day+'/'+value[key1].score.value}
                		           </td>);
                }
                //  else if( key1 == "user_daily_inputs" ){
                //   let reported_inputs = value[key1].other_scores.prcnt_days_reported_inputs.value;
                //   let sick = value[key1].other_scores.prcnt_days_sick.value;
                //   let travel =  value[key1].other_scores.prcnt_days_travel.value;
                //   let medium_high_stress = value[key1].other_scores.prcnt_days_medium_high_stress.value; 
                //   if( travel == null ){
                //   	travel = 0
                //   }
                //   if( sick == null ){
                //      sick = 0;
                //   }
                //   if( medium_high_stress == null ){
                //      medium_high_stress = 0;
                //   }
                //   if( reported_inputs == null ){
                //          reported_inputs = 0;
                //   }
                //   if(value[key1].score.value != null && value[key1].other_scores.days_sick.value != null &&
                //       value[key1].other_scores.days_medium_high_stress.value != null && value[key1].other_scores.days_travel.value != null){
                //       td_values.push(
	               //            <td className="udi">
	               //        	 <table style={{marginLeft:"auto",marginRight:"auto",backgroundColor:'#FFF'}}>
	               //       	<tr><td>
	               //          {value[key1].other_scores.days_travel.value+('\n')+"("+travel+"%"+")"}
	               //          </td>
	               //           <td>
	               //          {value[key1].other_scores.days_sick.value+('\n')+"("+sick+"%"+")"}
	               //          </td></tr>
	               //          <tr><td>
	               //          {value[key1].other_scores.days_medium_high_stress.value+('\n')+"("+medium_high_stress+"%"+")"}
	               //          </td>
	               //          <td>
	               //          {value[key1].score.value+('\n')+"("+reported_inputs+"%"+")"}
	               //          </td></tr>
	               //          </table>
	               //           </td>);
                //           }
                //      else{
                //              td_values.push(<td>{"-"}</td>);		                        
                  	     
                //          }
                // }
            
		}	
			++operationCount;
                this.scrollCallback(operationCount);
			td_rows.push(<tr id={(currentUser) ? 'my-row' : ''}>{td_values}</tr>);	
		}
		let table =    
		                <div className="table table-responsive table-bordered">
			          	    <table className = "table table-striped">
								<tr  ref="table_header_overall">
									<th>Rank</th>
									<th>User</th>														    
								    <th>Overall GPA</th>
								   	 <th>Sleep</th>
								   	 <th>RHR</th>
								   	 <th>Non Exercise Steps</th>
								   	 <th>MCS Score</th>
								   	 <th>Exercise Consistency</th>
								   	 <th>Exercise Duration / Avg HR</th>
								   	 <th>
								   	  <table className="aa">
									    <tr><td>AE</td><td>AN</td></tr>
									    <tr><td>BA</td><td>NR</td></tr> 
									  </table>
								   	 </th>
								   	<th>VO2 Max</th>
								    <th>% Unprocessed</th>
								    <th>Drinks Yesterday / Per Week</th>
								    {/*<th>
								   	   <table className="userip">
									    <tr><td>Travel</td><td>Sick</td></tr>
									    <tr><td>M/H stress</td><td>Report Inputs</td></tr> 
									   </table>
								   </th>*/}
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
                <div>                  
                  <div className="overall_Leaderboard" ref="overall_Leaderboard"> 
						{
							this.renderTable(
								this.props.overall_data,
								this.props.Movement_username,
								this.props.mcs_data,
								this.props.selectedRange
							)
						}	
					</div>   
                    <div className = "row">
						<div className = "col-sm-12">
			          	  <p className="footer_content" style={{marginLeft:"15px"}}>	 
						  MCS: Movement Consistency Score
						  </p>
                    	  <p className="footer_content" style={{marginLeft:"15px"}}>
                          ECS: Exercise Consistency Score
                          </p>
                          <p className="footer_content" style={{marginLeft:"15px"}}>
                          NR = Not Reported; NA = Not Available
                          </p>
                          <p className="footer_content" style={{marginLeft:"15px"}}>
                          Grades:
                          <span style={{height:'15px',width:'40px',backgroundColor:'#008000'}}>A</span>
                          </p>
                          <p className="footer_content" style={{marginLeft:"15px"}}>
                          Numbers in (parenthesis) represent overall rank in category (where (1) is best)
                          </p>
                         </div>
                     </div>      
                 </div>
	   );
	}
}
export default OverallLeaderboardTable;