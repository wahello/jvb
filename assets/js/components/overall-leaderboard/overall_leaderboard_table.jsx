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

function strToSecond(value){
    let time = value.split(':');
    let hours = parseInt(time[0])*3600;
    let min = parseInt(time[1])*60;
    let s_time = hours + min;
    return s_time;
}

class OverallLeaderboardTable extends Component{

	constructor(props){
		super(props);
		
        this.renderTable = this.renderTable.bind(this);
        this.scrollCallback = this.scrollCallback.bind(this);
		this.doOnOrientationChange = this.doOnOrientationChange.bind(this);
		this.renderStepsColor = this.renderStepsColor.bind(this);
		this.renderCommaSteps = this.renderCommaSteps.bind(this);
		this.getStylesForExerciseduration   = this.getStylesForExerciseduration.bind(this);
		this.exerciseDurColrsSingleDayOr2to6Days = this.exerciseDurColrsSingleDayOr2to6Days.bind(this);
		this.getFoodColors = this.getFoodColors.bind(this);
		this.getFoodGrades = this.getFoodGrades.bind(this);
		this.getAlcoholColors = this.getAlcoholColors.bind(this);
		this.getAlcoholGrades = this.getAlcoholGrades.bind(this);
		this.getExerciseConsistencyGrades = this.getExerciseConsistencyGrades.bind(this);
		this.getExerciseConsistencyColors = this.getExerciseConsistencyColors.bind(this);
		this.getMomentConsistencyGrades = this.getMomentConsistencyGrades.bind(this);
		this.getMomentConsistencyColors = this.getMomentConsistencyColors.bind(this);
		this.getRestingHeartRateColors = this.getRestingHeartRateColors.bind(this);
		this.getRestingHeartRateGrades = this.getRestingHeartRateGrades.bind(this);
		this.getSleepColors = this.getSleepColors.bind(this);
		this.getOverallGpaColors = this.getOverallGpaColors.bind(this);
		this.getOverallGpaGrades = this.getOverallGpaGrades.bind(this);
	}
1
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

  	getFoodGrades(score){
  		let grade = "";
			if (score >= 80){
			 grade = 'A';
		   }
			else if (score >= 70 && score < 80){
			grade = 'B';
		    }
			else if (score >= 60 && score < 70){
			grade = 'C'
	        } 
			else if (score >= 50 && score < 60){
			grade = 'D'
		    }
			else if (score < 50){
			grade = 'F';
		    }
		return grade;
  	}
  	getFoodColors(score,rank){
      let background = "";
      let color = "";
      if(isNaN(score) || score == null || score == 'N/A'){
      	background = '';
      	color = '';
      	score = 'NA'
      		return (
					<td className ="overall_rank_value upf" 
					style = {{backgroundColor:background,color:color}}>
					<span>{score}{' '}{'('+rank+')'}</span>
					</td> 
				  );
      }
      	else{

      		let grade = this.getFoodGrades(score);
				if ( grade == 'A' ){    				
					background ='green';
					color = 'white';
				}
				else if ( grade == 'B' ){
					background = "#32CD32";
					color = "white";
				}
				else if ( grade == 'C'){
					background = "yellow";
					color = "black"
				}	
				else if ( grade == 'D'){
					background ='#FF8C00';
					color = 'white';
				}	
				else if ( grade == 'F'){
					background = "red";
					color = "black";
				}									
			}
				return (
					<td className ="overall_rank_value" 
					style = {{backgroundColor:background,color:color}}>
					<span>{score}{'%'}{' '}{'('+rank+')'}</span>
					</td> 
		);

    }
    getAlcoholGrades(drink_avg, gender){
		let grade = '';
		if (gender === 'F') {
			if (drink_avg <= 3){
        		grade = 'A'
	        }   
	        else if (drink_avg > 3 && drink_avg < 5){
	            grade = 'B'
	        }
	        else if (drink_avg >= 5 && drink_avg < 7){
	            grade = 'C';
	        }
	        else if (drink_avg >= 7 && drink_avg < 9){
	            grade = 'D';
	        }
	        else if (drink_avg >= 9 && drink_avg <= 14){
	            grade = 'F';
	        }
	        else if( drink_avg > 14){
	            grade = 'F';
	        }
		} 
		else{
			if (drink_avg <= 5){
        	grade = 'A'
	        }   
	        else if (drink_avg > 5 && drink_avg < 12){
	            grade = 'B'
	        }
	        else if (drink_avg >= 12 && drink_avg < 15){
	            grade = 'C';
	        }
	        else if (drink_avg >= 15 && drink_avg < 16){
	            grade = 'D';
	        }
	        else if (drink_avg >= 16 && drink_avg <= 21){
	            grade = 'F';
	        }
	        else if( drink_avg > 21){
	            grade = 'F';
	        }
		}
        return grade;
    }
	getAlcoholColors(alcoholperday,alcoholperweek,rank, gender){
		let background= '';
		let color='';
		if(isNaN(alcoholperweek) || alcoholperweek == null){
			background = '';
			color = '';   
		}
		else {
			let grade = this.getAlcoholGrades(alcoholperweek, gender); 	
			if(grade == 'A'){
				background='green';
				color='white';
			}
			else if(grade == 'B'){
				background='#32CD32';
				color='white';
			}
			else if(grade == 'C'){
				background='yellow';
				color='black';
			}
			else if(grade == 'D'){
				background='#FF8C00';
				color='white';
			}
			else if(grade == 'F'){
				background='red';
				color='black';
			}
		}
		return (
			<td className ="overall_rank_value" 
			style = {{backgroundColor:background,color:color}}>
			<span>{alcoholperday}{' '}{'/'}<br/>{alcoholperweek}{' '}{'('+rank+')'}</span>
			</td>
		);
	}

    getExerciseConsistencyGrades(ecscore){
    	let grade = '';
		    if (ecscore >= 4){
		        grade = 'A'
		    }
		    else if (ecscore >= 3 && ecscore < 4){
		        grade =  'B'
		    }
		    else if (ecscore >= 2 && ecscore < 3){
		        grade =  'C'
		    }
		    else if (ecscore >= 1 && ecscore < 2){
		        grade =  'D'
		    }
		    else if (ecscore < 1){
		        grade = 'F'
		    }
    return grade;
    }   
    getExerciseConsistencyColors(ecscore,rank){
    	let background= '';
		let color='';
		
		if( isNaN(ecscore) || ecscore == null ){
			background = '';
			color = '';   
		}
		else {
			let grade = this.getExerciseConsistencyGrades(ecscore); 	
			ecscore = parseFloat(ecscore).toFixed(2);
			if(grade == 'A'){
				background='green';
				color='white';
			}
			else if(grade == 'B'){
				background='#32CD32';
				color='white';
			}
			else if(grade == 'C'){
				background='yellow';
				color='black';
			}
			else if(grade == 'D'){
				background='#FF8C00';
				color='white';
			}
			else if(grade == 'F'){
				background='red';
				color='black';
			}
		}
		
		return (
			<td className ="overall_rank_value" 
			style = {{backgroundColor:background,color:color}}>
			<span>{ecscore}<br/>{'('+rank+')'}</span>
			</td>
		);

    }
    getMomentConsistencyGrades(mcscore){
	    let grade = '';
		  	if (mcscore <= 4.5){
		    	grade = 'A';
		    }
		    else if (mcscore > 4.5 && mcscore <= 6){
		        grade = 'B'
		    }
		    else if (mcscore > 6 && mcscore <= 7){
		        grade = 'C'
		    }
		    else if (mcscore > 7 && mcscore <= 10)
		        grade = 'D'
		    else if (mcscore > 10 ){
		        grade = 'F'
		    }
	    return grade;
    }
    getMomentConsistencyColors(mcscore,rank){
        let background= '';
		let color='';
		
		if( isNaN(mcscore) || mcscore == null){
			background = '';
			color = '';   
		}
		else {
			let grade = this.getMomentConsistencyGrades(mcscore); 	
			mcscore = parseFloat(mcscore).toFixed(2);
			if(grade == 'A'){
				background='green';
				color='white';
			}
			else if(grade == 'B'){
				background='#32CD32';
				color='white';
			}
			else if(grade == 'C'){
				background='yellow';
				color='black';
			}
			else if(grade == 'D'){
				background='#FF8C00';
				color='white';
			}
			else if(grade == 'F'){
				background='red';
				color='black';
			}
		}
		
		return (
			<td className ="overall_rank_value" 
			style = {{backgroundColor:background,color:color}}>
			<span>{mcscore}<br/>{'('+rank+')'}</span>
			</td>
		);
    }
    getRestingHeartRateGrades(rhrscore){
       let grade = '';
		    if (rhrscore >= 30 && rhrscore <= 60){
		        grade = 'A';
		    }
		    else if (rhrscore >= 61 && rhrscore <= 68){
		        grade = 'B'
		    }
		    else if (rhrscore >= 69 && rhrscore <= 74){
		        grade = 'C'
		    }
		    else if (rhrscore >= 75 && rhrscore <= 79){
		        grade = 'D'
		    }
		    else if( rhrscore >= 80 || rhrscore < 30){
		        grade = 'F'
		    }
		    else{
		        grade = 'F'
		    }
    return grade;
      
    }
    getRestingHeartRateColors(rhrscore,rank){
     let background= '';
		let color='';
		if(isNaN(rhrscore) || rhrscore == null){
			background = '';
			color = '';   
		}
		else {
			let grade = this.getRestingHeartRateGrades(rhrscore); 	
			if(grade == 'A'){
				background='green';
				color='white';
			}
			else if(grade == 'B'){
				background='#32CD32';
				color='white';
			}
			else if(grade == 'C'){
				background='yellow';
				color='black';
			}
			else if(grade == 'D'){
				background='#FF8C00';
				color='white';
			}
			else if(grade == 'F'){
				background='red';
				color='black';
			}
		}
		return (
			<td className ="overall_rank_value" 
			style = {{backgroundColor:background,color:color}}>
			<span>{rhrscore}<br/>{'('+rank+')'}</span>
			</td>
		);
    }
   
    getOverallGpaGrades(ogpascore){
      let grade = '';
		if (ogpascore >= 3.4){
		    grade = 'A';
		}
		else if (ogpascore >= 3 && ogpascore < 3.4)
		    grade = 'B';
		else if (ogpascore >= 2 && ogpascore < 3){
		    grade = 'C';
		}
		else if (ogpascore >= 1 && ogpascore < 2){
		    grade = 'D';
		}
		else if (ogpascore < 1){
		    grade = 'F';
		 }
     return grade;
    }
    getOverallGpaColors(ogpascore,rank){
     let background= '';
		let color='';
		let grade = this.getOverallGpaGrades(ogpascore); 	
		if( isNaN(ogpascore) ||ogpascore == null || grade ==  ' ' ){
			background = '';
			color = ''; 
			grade = 'NA';
		}
		else {
		     ogpascore = parseFloat(ogpascore).toFixed(2);	
			 if(grade == 'A'){
				background='green';
				color='white';
			}
			else if(grade == 'B'){
				background='#32CD32';
				color='white';
			}
			else if(grade == 'C'){
				background='yellow';
				color='black';
			}
			else if(grade == 'D'){
				background='#FF8C00';
				color='white';
			}
			else if(grade == 'F'){
				background='red';
				color='black';
			}
		
		}
		return (
			<td className ="overall_rank_value" 
			style = {{backgroundColor:background,color:color}}>
			<span>{grade}{' '}{'/'}<br/>{ogpascore}{' '}{'('+rank+')'}</span>
			</td>
		);
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
	    		<span>{this.renderCommaSteps(steps)}<br/>{'('+rank+')'}</span>
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
    getSleepColors(sleepduration,rank,avgsleepgpa){
		let background = "";
		let color = "";
		if(sleepduration && sleepduration != 'NA' && sleepduration != 'NR'){
			let sleepDurationInSeconds = strToSecond(sleepduration);
			if(sleepDurationInSeconds < strToSecond("6:00") || sleepDurationInSeconds > strToSecond("12:00")){
				 	background = '#FF0101';
	                color = 'black';
	             
	        }
			else if(strToSecond("7:30") <= sleepDurationInSeconds && sleepDurationInSeconds <= strToSecond("10:00")){
					background = 'green';
		            color = 'white';
		       
		    }
	    	else if((strToSecond("7:00")<=sleepDurationInSeconds && sleepDurationInSeconds<= strToSecond("7:29"))
	    	 || (strToSecond("10:01")<=sleepDurationInSeconds && sleepDurationInSeconds<= strToSecond("10:30"))){
	    		 	background = '#32CD32';
	                color = 'white';
	            
	    	}	
	    	else if((strToSecond("6:30")<=sleepDurationInSeconds && sleepDurationInSeconds<=strToSecond("6:59"))
	    	 || (strToSecond("10:31")<= sleepDurationInSeconds && sleepDurationInSeconds<=strToSecond("11:00"))){
	    		 	background = '#FFFF01';
	                color = 'black';
	               
	        }
	    	else if((strToSecond("06:00")<=sleepDurationInSeconds && sleepDurationInSeconds<= strToSecond("6:29"))
	    	 || (strToSecond("11:00")<=sleepDurationInSeconds && sleepDurationInSeconds<= strToSecond("12:00"))){
	    		 	background = '#E26B0A';
	                color = 'black';
	             
	    	}
    	}

		return (
			<td className ="overall_rank_value" 
			style = {{backgroundColor:background,color:color}}>
			<span>{sleepduration}<br/>{'('+rank+')'}</span>
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
			    		<span>{value1}{' '}{'('+rank+')'}<br/>{' / '}{avgHR}</span>
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
		    		<span>{value1}{' '}{'('+rank+')'}<br/> {' / '}{avgHR}</span>
		    	</td>
		    )
	}

	renderTable(overall_data,Movement_username,MCS_data,selectedRange){
		let operationCount = 0;
		let td_rows = [];
		let keys = [ "rank","username","oh_gpa","avg_sleep","resting_hr","nes",
		             "mc","ec","exercise_duration","aerobic_duration","vo2_max",
		             "prcnt_uf","alcohol","user_daily_inputs"];		         
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
					  let  overallGpaScore = value[key1].score.value;
						if( overallGpaScore == 'N/A' || overallGpaScore == null ){
							overallGpaScore = 'NA';
						}
						if( overallGpaScore == 'Not Reported' ){
							overallGpaScore = 'NR';
						}
					td_values.push(this.getOverallGpaColors(overallGpaScore,value[key1].rank));
					}
					else if( key1 == "avg_sleep" ){
					  let  avgSleepScore = value[key1].other_scores.sleep_duration.value;
						if( avgSleepScore == 'N/A' || avgSleepScore == null ){
							avgSleepScore = 'NA';
						}
						if( avgSleepScore == 'Not Reported' ){
							avgSleepScore = 'NR';
						}
					td_values.push(this.getSleepColors(avgSleepScore,value[key1].rank,value[key1].score.value)); 	
					}
					else if( key1 == "resting_hr" ){
					  let  restingHeartRateScore = value[key1].score.value;
						if( restingHeartRateScore == 'N/A' || restingHeartRateScore == null ){
							restingHeartRateScore = 'NA';
						} 
						if( restingHeartRateScore == 'Not Reported' ){
							restingHeartRateScore == 'NR';
						}
					td_values.push(this.getRestingHeartRateColors(restingHeartRateScore,value[key1].rank));   
					}
					else if( key1 == "nes" ){
					  let  nonExerciseStepsScore = value[key1].score.value;
						if( nonExerciseStepsScore == 'N/A' || nonExerciseStepsScore == null ){
							nonExerciseStepsScore = 'NA';
						} 
						if( nonExerciseStepsScore == 'Not Reported' ){
							nonExerciseStepsScore = 'NR';
						}
					 td_values.push(this.renderStepsColor(nonExerciseStepsScore,value[key1].rank));
					}
					else if( key1 == "mc" ){
					  let  momentConsistencyScore = value[key1].score.value;
						if( momentConsistencyScore == 'N/A' || momentConsistencyScore == null ){
							momentConsistencyScore = 'NA';
						} 
						if( momentConsistencyScore == 'Not Reported' ){
							momentConsistencyScore = 'NR';
						}
					td_values.push(this.getMomentConsistencyColors(momentConsistencyScore,value[key1].rank));
					}
					else if( key1 == "ec" ){
					  let  exerciseConsistencyScore = value[key1].score.value;
						if( exerciseConsistencyScore == 'N/A' || exerciseConsistencyScore == null ){
							exerciseConsistencyScore = 'NA'
						} 
						if( exerciseConsistencyScore == 'Not Reported' ){
							exerciseConsistencyScore = 'NR';
						}
					 td_values.push(this.getExerciseConsistencyColors(exerciseConsistencyScore,value[key1].rank));
					}
					else if( key1 == "exercise_duration" ){
					  let avg_exercise_heart_rate = value[key1].other_scores.avg_exercise_heart_rate.value;
					  let exerciseduartionScore = value[key1].score.value;
						if( avg_exercise_heart_rate == null || avg_exercise_heart_rate == 'N/A' ){
						    avg_exercise_heart_rate = 'NA'; 
						}
						if( avg_exercise_heart_rate == "Not Reported" ){
						   avg_exercise_heart_rate = 'NR';
						}
						if( exerciseduartionScore == null || exerciseduartionScore == 'N/A' ){
						    exerciseduartionScore = 'NA';
						}	
						if( exerciseduartionScore == "Not Reported" ){
						    exerciseduartionScore = 'NR';
						}
					 td_values.push(this.getStylesForExerciseduration(exerciseduartionScore,value[key1].rank,avg_exercise_heart_rate,selectedRange));	
					}
					else if( key1 == "aerobic_duration" ){
						let aerobic_prcnt = value[key1].other_scores.prcnt_aerobic_duration.value;
						let anaerobic_prcnt = value[key1].other_scores.prcnt_anaerobic_duration.value;
						let below_aerobic_prcnt =  value[key1].other_scores.prcnt_below_aerobic_duration.value;
						let heartrate_not_recorded_prcnt = value[key1].other_scores.prcnt_hr_not_recorded_duration.value; 
							if( aerobic_prcnt == null ){
							    aerobic_prcnt = 0;
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
							<td>
							<table className="heartrate_zone_table" style={{marginLeft:"auto",marginRight:"auto",backgroundColor:'#FFF'}}>
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
							td_values.push(<td>{"-"}</td>);		                        

							}
					}
					else if( key1 == "vo2_max" ){
                       let vmax = value[key1].score.value; 
					   if( vmax == null || vmax == 'N/A' ){
					   	   vmax = 'NA';
					   }
					   if( vmax == "Not Reported" ){
					   	   vmax = 'NR';
					   }
					  td_values.push(<td>{vmax}</td>);	
					}
					else if( key1 == "prcnt_uf" ){
						let foodUnproc = value[key1].score.value;
						 if( foodUnproc == 'Not Reported' ){
						 	  foodUnproc = 'NR';
						 }
					    td_values.push(this.getFoodColors(foodUnproc,value[key1].rank)); 	
					}
					else if( key1 == "alcohol" ){
						let alcohol_drink_per_day = value[key1].other_scores.alcohol_drink_per_day.value;
						let alcohol_drink_per_week = value[key1].score.value;
							if( alcohol_drink_per_day == null || alcohol_drink_per_day == 'N/A'  ){
								alcohol_drink_per_day = 'NA';
							}
							if( alcohol_drink_per_day == "Not Reported"){
								alcohol_drink_per_day = 'NR';
							}
							if( alcohol_drink_per_week == null || alcohol_drink_per_week == 'N/A' ){
								alcohol_drink_per_week = 'NA'
							}
							if( alcohol_drink_per_week == 'Not Reported'){
								alcohol_drink_per_week = 'NR'
							}
						td_values.push(this.getAlcoholColors(alcohol_drink_per_day,
															 alcohol_drink_per_week,
															 value[key1].rank),
															 this.props.gender);
						}
					 else if( key1 == "user_daily_inputs" ){
					  let reported_inputs = value[key1].other_scores.prcnt_days_reported_inputs.value;
					  let sick = value[key1].other_scores.prcnt_days_sick.value;
					  let travel =  value[key1].other_scores.prcnt_days_travel.value;
					  let medium_high_stress = value[key1].other_scores.prcnt_days_medium_high_stress.value; 
					  if( travel == null ){
					  	travel = 0
					  }
					  if( sick == null ){
					     sick = 0;
					  }
					  if( medium_high_stress == null ){
					     medium_high_stress = 0;
					  }
					  if( reported_inputs == null ){
					         reported_inputs = 0;
					  }
					  if(value[key1].score.value != null && value[key1].other_scores.days_sick.value != null &&
					      value[key1].other_scores.days_medium_high_stress.value != null && value[key1].other_scores.days_travel.value != null){
					      td_values.push(
					           <td className="udi">
					       	 <table className="heartrate_zone_table" style={{marginLeft:"auto",marginRight:"auto",backgroundColor:'#FFF'}}>
					      	<tr><td>
					         {value[key1].other_scores.days_travel.value+('\n')+"("+travel+"%"+")"}
					         </td>
					          <td>
					         {value[key1].other_scores.days_sick.value+('\n')+"("+sick+"%"+")"}
					         </td></tr>
					         <tr><td>
					         {value[key1].other_scores.days_medium_high_stress.value+('\n')+"("+medium_high_stress+"%"+")"}
					         </td>
					         <td>
					         {value[key1].score.value+('\n')+"("+reported_inputs+"%"+")"}
					         </td></tr>
					         </table>
					          </td>);
					          }
					     else{
					             td_values.push(<td>{"-"}</td>);		                        
						     
					         }
					}

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
							<th>Overall Graade / GPA (Rank)</th>
							<th>Sleep (Rank)</th>
							<th>Resting HR (Rank)</th>
							<th>Non Exercise Steps (Rank)</th>
							<th>MCS Score (Rank)</th>
							<th>Exercise L7 Days (Rank)</th>
							<th>Exercise Duration (Rank) / Avg HR</th>
							<th>
							<table>
							<tr><td>AE</td><td>AN</td></tr>
							<tr><td>BA</td><td>NR</td></tr> 
							</table>
							</th>
							<th>VO2<br/>Max</th>
							<th>% Food Unproc (Rank)</th>
							<th>Drinks Per Day / Per Week</th>
							<th>
							<table>
							<tr><td>TR</td><td>SK</td></tr>
							<tr><td>STR</td><td>RI</td></tr> 
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
							Grades:&nbsp;
							<div className="rd_mch_color_legend color_legend_green"></div>
							<span className="rd_mch_color_legend_label">A</span>
							<div className="rd_mch_color_legend color_legend_parrot_green"></div>
							<span className="rd_mch_color_legend_label">B</span>
							<div className="rd_mch_color_legend color_legend_yelow"></div>
							<span className="rd_mch_color_legend_label">C</span>
							<div className="rd_mch_color_legend color_legend_orange"></div>
							 <span className="rd_mch_color_legend_label">D</span>
							<div className="rd_mch_color_legend color_legend_red"></div>
							<span className="rd_mch_color_legend_label">F</span>
							</p>      
							<p className="footer_content" style={{marginLeft:"15px"}}>
							Numbers in (parenthesis) represent overall rank in category (where (1) is best)
							</p>
							<p className="footer_content" style={{marginLeft:"15px"}}>
							See the Movement Leaderboard for more details regarding Overall Movement Rank
							</p>
						</div>
					</div>      
				</div>
	   );
	}
}
export default OverallLeaderboardTable;