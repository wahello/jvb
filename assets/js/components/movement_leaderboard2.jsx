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
		//this.time99Colors = this.time99Colors.bind(this);
		
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
		let getTable = this.refs.hrr_table;

		if(screen.width < 1023){
			getTable.classList.add('table_padd')
		}
		else{
			getTable.classList.remove('table_padd')
		}
		
		/***********************/
		let header = this.refs.table_header_hrr;		
		if(screen.width < 650){
			  header.classList.remove("hrr_sticky");
		}

	};


	/******* sticky table header on scroll ********/
	handleScroll = () => {
		 let header = this.refs.table_header_hrr;	
		 var rect = header.getBoundingClientRect()
		 let sticky = rect.top+80;

		 if(screen.width > 650){
		 	if (window.pageYOffset > sticky) {
		    header.classList.add("hrr_sticky");
		  } else {
		    header.classList.remove("hrr_sticky");
		  }
		 }

	};

	renderTable(Movement_data,Movement_username){
		let operationCount = 0;
		// let td_rows = [];
		// let keys = ["rank","username","time_99","beat_lowered","pure_time_99","pure_beat_lowered","total_hrr_rank_point"];
		// objectLength = Object.keys(Movement_data).length;
		// for(let[key,value] of Object.entries(Movement_data)){
		// 	let td_values = [];
		// 	 let currentUser = '';
		// 	for(let key1 of keys){
		// 		if(key1 == "rank"|| key1 == "total_hrr_rank_point"){
		// 			td_values.push(<td className ="overall_rank_value">{value[key1]}</td>);
		// 		}
		// 		else if(key1 == "username"){
		// 			let user = value[key1];
		// 			if(user == Movement_username){
		// 				td_values.push(<td className ="overall_rank_value">{user}</td>);
		// 				currentUser = user;
		// 			}
		// 			else{
		// 				td_values.push(<td className ="overall_rank_value">{user}</td>);
		// 				currentUser = '';
		// 			}
		// 		}

		// 		else if(key1 == "beat_lowered" || key1 == "pure_beat_lowered"){
		// 			let tempRank = null;
		// 			let tempScore = null;
		// 			for(let key3 of ['score','rank']){
		// 				let value4 = value[key1][key3];
		// 				if(key3 == "rank" && tempRank == null){
		// 					tempRank = value4;
		// 				}
		// 				else if(key3 == "score" && tempScore == null){
		// 					tempScore = value4.value;
		// 				}
		// 			}
		// 			if(tempRank != null && tempScore != null)
		// 			{
		// 				td_values.push(this.heartBeatsColors(tempScore, tempRank));
		// 			}
					
		// 		}
				
		// 		else if(key1 == "time_99" || key1 == "pure_time_99"){
		// 			let tempRank = null;
		// 			let tempScore = null;
		// 			let tempValue = null;
		// 			for(let key3 of ['score','rank']){
		// 				let value4 = value[key1][key3];
		// 				if(key3 == "rank" && tempRank == null){
		// 					tempRank = value4;
		// 				}
		// 				else if(key3 == "score" && tempScore == null){
		// 					//tempScore = this.time99Colors(value4.value,value[key1].other_scores.points, tempRank);
		// 					tempScore = value4.value;
		// 					tempValue = value[key1].other_scores.points;
		// 				}
		// 			}
		// 			if(tempRank != null && tempScore != null)
		// 				td_values.push(this.time99Colors(tempScore, tempValue, tempRank));
		// 		}
		// 		else{
		// 			for(let key3 of ['score','rank']){
		// 				if(key3 == "rank"){
		// 					let value4 = value[key1][key3];
		// 					td_values.push(<td className ="overall_rank_value">{value4}</td>);
		// 				}
		// 				else if(key3 == "score"){
		// 					td_values.push(<td className ="overall_rank_value">{value4.value}</td>);

		// 				}
		// 			}
		// 		}
		// 	}
		// 	++operationCount;
  //               this.scrollCallback(operationCount);
		// 	td_rows.push(<tr id={(currentUser) ? 'my-row' : ''}>{td_values}</tr>);	
		// }
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
								</tr>
								<tbody>
								{/*{td_rows}*/}
								</tbody>
							</table>
						</div>
		return table;
	}
	render(){
		return(
				<div className = "container-fluid">		   
					<div className = "hrr_table" ref="hrr_table">
						{this.renderTable()}	
					</div>	
				</div>
			);
	}
}
export default MovementLeaderboard2;