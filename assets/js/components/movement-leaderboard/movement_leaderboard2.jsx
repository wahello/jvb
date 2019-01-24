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

		//this.time99Colors = this.time99Colors.bind(this);
		
	}
	secondsToHms(value) {
    
	var time;
	if(value){
		if(value>0){
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
	    return <td className ="overall_rank_value" style = {{backgroundColor:background,color:color}}><span>{value1}</span><span style = {{paddingLeft:"8px"}}>({rank})</span></td>
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
	    return <td className ="overall_rank_value" style = {{backgroundColor:background,color:color}}><span>{hours_inactive}</span><span style = {{paddingLeft:"8px"}}>({rank})</span></td>
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
	    return <td className ="overall_rank_value" style = {{backgroundColor:background,color:color}}><span>{this.renderCommaSteps(steps)}</span><span style = {{paddingLeft:"8px"}}>({rank})</span></td>
  }
	// heartBeatsColors(score, rank){
 //  		/* Applying the colors for the table cells depends upon their heart beat ranges*/
 //  		let background = "";
 //  		let color = "";
 //  		if(score && score != "N/A"){
	//   		if(score >= 30){
	//   			background = "green";
	//   			color = "white";
	//   		}
	//   		else if(score >= 20 && score <= 29){
	//   			background = "#32CD32";
	//   			color = "white";
	//   		}
	//   		else if(score >= 14 && score <= 19){
	//   			background = "yellow";
	//   			color = "black";
	//   		}
	//   		else if(score >= 12 && score <= 13){
	//   			background = "#FF8C00";
	//   			color = "black";
	//   		}
	//   		else if(score > 0 && score < 12){
	//   			background = "red";
	//   			color = "black";
	//   		}
 //  		}
 //  		return <td style ={{background:background,color:color}} className ="overall_rank_value">{score + " (" + rank + ")"}</td>
 //  	}
  // 	time99Colors(score,value, rank){
  // 		/* Applying the colors for the table cells depends upon their heart beat ranges*/
  // 		let background = "";
		// let color = "";
		// let hr_background = "";
  // 		if(!(isNaN(value))){
	 //            if(value >= 3.4){
	 //           		background = 'green';
	 //               	color = 'white';
	 //               	hr_background = 'white';
	 //            }
	 //            else if(value >= 3 && value <= 3.39){
	 //                background = '#32CD32';
	 //                color = 'white';
	 //                hr_background = 'white';
	 //            }
	 //            else if(value >= 2 && value < 3){
	 //                background = '#FFFF01';
	 //                color = 'black';
	 //                hr_background = 'black';
	 //            }
	 //            else if(value >= 1 && value < 2){
	 //                background = '#E26B0A';
	 //                color = 'black';
	 //                hr_background = 'black';
	 //            }
	 //            else if(value < 1 && value != -1) {
	 //            	background = 'red';
	 //            	color = 'black';
	 //            	hr_background = 'black';
	 //            }
	 //            else{
	 //            background = 'white';
	 //            color = '#5e5e5e';
	 //            hr_background = '#E5E5E5';
  //       }
	 //        }
  // 		return <td style ={{background:background,color:color}} className ="overall_rank_value">{score + " (" + rank + ")"}</td>
  // 	}


  	scrollCallback(operationCount) {
      if (objectLength === operationCount) {
          setTimeout(function () {
            var x = window.matchMedia("(max-width: 900px)");
            if(x.matches){
               document.getElementById('my-row').style.background = 'lightyellow';
                var index = -1;
                var rows = document.getElementById("my-table").offsetHeight;
                var rows1 = document.getElementById("my-row").offsetTop;
                // for (var i=0;i<rows.length; i++){
                //     if ( rows[i] == document.getElementById("my-row")){
                //         index = i;
                //         break;
                //     }
                // }
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
                // for (var i=0;i<rows.length; i++){
                //     if ( rows[i] == document.getElementById("my-row")){
                //         index = i;
                //         break;
                //     }
                // }
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
			getTable.classList.add('table_padd')
		}
		else{
			getTable.classList.remove('table_padd')
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

	renderTable(Movement_data,Movement_username){
		let operationCount = 0;
		let td_rows = [];
		let keys = ["rank","username","nes","exercise_steps","total_steps","mc","exercise_duration","active_min_total","active_min_sleep","active_min_exclude_sleep","active_min_exercise","active_min_exclude_sleep_exercise","total_movement_rank_point"];
		objectLength = Object.keys(Movement_data).length;
		for(let[key,value] of Object.entries(Movement_data)){
			let td_values = [];
			 let currentUser = '';
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
					td_values.push(<td className ="overall_rank_value"><span>{this.secondsToHms(value[key1].score.value)}</span></td>);
					// if(value[key1].other_scores != null) {
					// 	td_values.push(<td className ="overall_rank_value"><span>{value[key1].other_scores.active_min_exercise.value}</span></td>);
					// 	td_values.push(<td className ="overall_rank_value"><span>{value[key1].other_scores.active_min_sleep.value}</span></td>);
					// }
					//td_values.push(<td className ="overall_rank_value"><span>{value[key1].other_scores.active_min_sleep.value}</span></td>);
				}
				  else if(key1 == "active_min_sleep"){
				  	if(value["active_min_total"].other_scores != null) {
						td_values.push(<td className ="overall_rank_value"><span>{this.secondsToHms(value["active_min_total"].other_scores.active_min_sleep.value)}</span></td>);
					}
					//td_values.push(<td className ="overall_rank_value"><span>{value[key1].other_scores.active_min_sleep.value}</span></td>);
				 	//td_values.push(<td className ="overall_rank_value"><span>{value[key1].score.value}</span></td>);	
				}
				else if(key1 == "active_min_exclude_sleep"){
					td_values.push(<td className ="overall_rank_value"><span>{this.secondsToHms(value[key1].score.value)}</span></td>);	
				}
			     else if(key1 == "active_min_exercise"){
			     	if(value["active_min_total"].other_scores != null) {
						td_values.push(<td className ="overall_rank_value"><span>{this.secondsToHms(value["active_min_total"].other_scores.active_min_exercise.value)}</span></td>);
					}
				// td_values.push(<td className ="overall_rank_value"><span>{value[key1].other_scores.active_min_exercise.value}</span></td>);
				// td_values.push(<td className ="overall_rank_value"><span>{value[key1].score.value}</span></td>);	
			     }
			 //    else if(key1 == "active_min_total"){
				// 		td_values.push(<td className ="overall_rank_value"><span>{value[key1].other_scores.active_min_exercise.value}</span></td>);
				// }
                else if(key1 == "active_min_exclude_sleep_exercise"){
					td_values.push(<td className ="overall_rank_value"><span>{this.secondsToHms(value[key1].score.value)}</span></td>);	
				}
				else if (key1 == "total_movement_rank_point"){
					td_values.push(<td className ="overall_rank_value"><span>{value[key1]}</span></td>);
				}

			}

			++operationCount;
                this.scrollCallback(operationCount);
			td_rows.push(<tr id={(currentUser) ? 'my-row' : ''}>{td_values}</tr>);	
		}
		let table = <div className = "table table-responsive table-bordered">
			          	    <table id="my-table" className = "table table-striped">
								<tr ref="table_header_hrr">
									<th>Rank</th>
									<th>User</th>
									<th>Non Exercise Steps <br/> (Rank)</th>
									<th>Exercise (Activity) <br/>Steps</th>
									<th>Total Steps<br />(not included in overall Rank Points)*</th>
									<th>MCS Score<br />(Rank)</th>
									<th>Exercise Duration</th>
									<th>Entire 24 Hour Day</th>
									<th>During Sleep Hours</th>
									<th>Entire 24 Hour Day Excluding Sleep</th>
									<th>During Exercise Hours</th>
									<th>Entire 24 Hour Day Excluding Sleep and Exercise</th>
									<th>Overall Movement Rank Points (Rank)</th>
									<th> </th>
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
						{this.renderTable(this.props.Movement_data,this.props.Movement_username)}	
					</div>	
				</div>
			);
	}
}
export default MovementLeaderboard2;