import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import _ from 'lodash';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';
import FontAwesome from "react-fontawesome";
import { Collapse, Navbar, NavbarToggler, 
        NavbarBrand, Nav, NavItem, NavLink,
        Button,Popover,PopoverBody,Form,FormGroup,
        FormText,Label,Input,Card, CardImg, CardText, 
        CardBody,CardTitle, CardSubtitle} from 'reactstrap';
import NavbarMenu from './navbar';
import {fetchLastSync} from '../network/quick';
import fetchHrrSummaryData from '../network/Hrr_dashboard';
import fetchLeaderBoard from '../network/leaderBoard';
import {renderHrrSummaryDashboardDataFetchOverlay} from './dashboard_healpers';
import HrrLeaderboard from './Hrr_leaderboard';


axiosRetry(axios, { retries: 3});


var CalendarWidget = require('react-calendar-widget');
var ReactDOM = require('react-dom');

class Hrr_Dashboard extends Component{
	constructor(props) {
		super(props);
		this.state = {
			calendarOpen:false,
			gridview:false,
			dashView:true,
			fetching_hrr_dashboard:false,
			heart_beats_lowest_1st_minute:"",
			pure_heart_beats_lowered_in_1st_min:"",
			pure_time_to_99:{
				pure_time99:"",
				points:"",
			},
			time_to_99:{
				time99:"",
				points:"",
			},
			last_synced:null,
			all_hrr_rank_data:"",
			Hrr_username:"",
			selectedDate:new Date(),
			rank_data:"Getting Rank...",

		}

		this.renderOverallHrrRankColor= this.renderOverallHrrRankColor.bind(this);
		this.renderTimeTo99Color = this.renderTimeTo99Color.bind(this);
		this.renderHeartBeatsColors = this.renderHeartBeatsColors.bind(this);
		this.renderPureHeartBeatsColors = this.renderPureHeartBeatsColors.bind(this);
		this.toggleCalendar = this.toggleCalendar.bind(this);
		this.successHrrSummaryData = this.successHrrSummaryData.bind(this);
		this.errorHrrSummaryData = this.errorHrrSummaryData.bind(this);
		this.processDate = this.processDate.bind(this);
		this.successLastSync = this.successLastSync.bind(this);
		this.errorquick = this.errorquick.bind(this);
		this.renderLastSync = this.renderLastSync.bind(this);
		this.renderAddDate = this.renderAddDate.bind(this);
		this.renderRemoveDate = this.renderRemoveDate.bind(this);
		this.renderPureTimeTo99Colors = this.renderPureTimeTo99Colors.bind(this);
		this.renderSecToMin = this.renderSecToMin.bind(this);
		this.successLeaderboard = this.successLeaderboard.bind(this);
		this.handleBackButton = this.handleBackButton.bind(this);
		this.renderHrrSummaryDashboardDataFetchOverlay = renderHrrSummaryDashboardDataFetchOverlay.bind(this);
	}
	successHrrSummaryData(data){
		if(!_.isEmpty(data.data)){
			this.setState({
		  		heart_beats_lowest_1st_minute:data.data.heart_beats_lowest_1st_minute,
				pure_heart_beats_lowered_in_1st_min:data.data.pure_heart_beats_lowered_in_1st_min,
				pure_time_to_99:data.data.pure_time_to_99,
				time_to_99:data.data.time_to_99,
				fetching_hrr_dashboard:false,
			});
		}else{
			this.setState({
		  		heart_beats_lowest_1st_minute:null,
				pure_heart_beats_lowered_in_1st_min:null,
				pure_time_to_99:{
				pure_time99:null,
				points:null,
				},
				time_to_99:{
				time99:null,
				points:null,
				},
				fetching_hrr_dashboard:false,
			});
		}
  	}

  	errorHrrSummaryData(error){
  		this.setState({
  			fetching_hrr_dashboard:false,
  		});
		console.log(error.message);
    }
    successLeaderboard(data){
    	this.setState({
    		rank_data:data.data.overall_hrr.today,
    	});
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
    handleBackButton(){
  		this.setState({
  			dashView:true,
  			gridview:false
  		})
  	}
    errorquick(error){
		console.log(error.message);
	}
	 renderLastSync(value){
	    let time;
	    var sync = "";
	    if(value){
	      	time = moment(value).format("MMM DD, YYYY @ hh:mm a");
	      	sync = <div style = {{fontSize:"15px",fontWeight:"bold",fontFamily:'Proxima-Nova',color:"black"}}>Wearable Device Last Synced on {time}</div>;
	    }
	    return sync;
	}
	renderAddDate(){
		/*It is forward arrow button for the calender getting the next day date*/
		var today = this.state.selectedDate;
		var tomorrow = moment(today).add(1, 'days');
		this.setState({
			selectedDate:tomorrow.toDate(),
			rank_data:"Getting Rank...",
			fetching_hrr_dashboard:true,

		},()=>{
			fetchHrrSummaryData(this.successHrrSummaryData,this.errorHrrSummaryData,this.state.selectedDate);
			fetchLeaderBoard(this.successLeaderboard,
							 this.errorHrrSummaryData,
							 this.state.selectedDate,
							 null,null,'overall_hrr');
		});
	}
	renderRemoveDate(){
		/*It is backward arrow button for the calender getting the last day date*/
		var today = this.state.selectedDate;
		var tomorrow = moment(today).subtract(1, 'days');
		this.setState({
			selectedDate:tomorrow.toDate(),
			rank_data:"Getting Rank...",
			fetching_hrr_dashboard:true,
		},()=>{
			fetchHrrSummaryData(this.successHrrSummaryData,this.errorHrrSummaryData,this.state.selectedDate);
			fetchLeaderBoard(this.successLeaderboard,
							 this.errorHrrSummaryData,
							 this.state.selectedDate,
							 null,null,"overall_hrr");
		});
	}
    processDate(selectedDate){
		this.setState({
			selectedDate:selectedDate,
			calendarOpen:!this.state.calendarOpen,
			rank_data:"Getting Rank...",
			fetching_hrr_dashboard:true,
		},()=>{
			fetchHrrSummaryData(this.successHrrSummaryData,this.errorHrrSummaryData,this.state.selectedDate);
			fetchLeaderBoard(this.successLeaderboard,
							 this.errorHrrSummaryData,
							 this.state.selectedDate,
							 null, null, "overall_hrr");
		});
	}
	renderCommaInSteps(value){
		/* Adding comma (,) to steps when we get steps greater then 999
		 this function will work and will add (,)*/
		if(value){
			value += '';
	     	var x = value.split('.');
	    	var x1 = x[0];
	        var x2 = x.length > 1 ? '.' + x[1] : '';
	        var rgx = /(\d+)(\d{3})/;
	        while (rgx.test(x1)) {
	        	x1 = x1.replace(rgx, '$1' + ',' + '$2');
	        }
	        value = x1+x2;
    	}
    	else{
        	value = "No Data Yet"
        }
        return value;
	}
	renderOverallHrrRankColor(val){
		// console.log("**********************",score);
		/* adding background color to card depends upon their steps ranges*/
		let background = "";
		let color = "";
		let hr_background = "";
		// if(score){
	 //            if(score >= 300){
  //               	 background = "green";
  //               	 color = "white";
  //               	 hr_background = "white" 
	 //            }
	 //            else if(score >= 0 && score < 300){
	 //            	 background = "#FF0101";
	 //            	 color = "black";
	 //            	 hr_background = "#e5e5e5" 
	 //            }
		// }
  //       else{
  //       	score = "No Data Yet"
  //       	background = "white";
  //       	color = "#5e5e5e";
  //       	hr_background = "#e5e5e5" 
  //       }

		// let score1 = this.renderCommaInSteps(score);

		let category = "";
	  	let userName;
	  	let ranks = [];
  			if (val){ 
  				var all_cat_rank = this.state.rank_data.all_rank;
		  		for (let [key,rankData] of Object.entries(val)){
		  		 	if(key == "user_rank"){
		  		 		userName = rankData.username;
		  		 		ranks.push(rankData.rank ? rankData.rank : "Getting Rank...");
		  		 	}
		  		 	
		  		}
		  	}
			var model = <Card className = "card_style"
					 		id = "my-card"
							style = {{background:background, color:color}}>
					        <CardBody>
					          	<CardTitle className = "header_style">Overall HRR Rank</CardTitle>
					          	<hr className = "hr_style"
				          		id = "hr-style" 
				          		style = {{background:hr_background}}/>
					          	<a onClick = {this.reanderAllHrr.bind(this,all_cat_rank,userName)}>
					          		<CardText className = "value_style">{ranks}
						          		<span id="lbfontawesome">
						                    <FontAwesome
						                    	className = "fantawesome_style"
						                        name = "external-link"
						                        size = "1x"
						                    />
					                 	</span>
			                 		</CardText>
					          	</a> 
					        </CardBody>
				        </Card>
		return model;
	}
	reanderAllHrr(all_data,value1){
		this.setState({
			all_hrr_rank_data:all_data,
			Hrr_username:value1,
			gridview:true,
			dashView:false,
		});
	}
	renderTimeTo99Color(score,value){

		/* adding background color to card depends upon their Non-Exercise steps ranges*/
		let background = "";
		let color = "";
		let hr_background = "";
		if(value){
	            if(value >= 3.4){
	           		background = 'green';
	               	color = 'white';
	               	hr_background = 'white';
	            }
	            else if(value >= 3 && value <= 3.39){
	                background = '#32CD32';
	                color = 'white';
	                hr_background = 'white';
	            }
	            else if(value >= 2 && value < 3){
	                background = '#FFFF01';
	                color = 'black';
	                hr_background = 'black';
	            }
	            else if(value >= 1 && value < 2){
	                background = '#E26B0A';
	                color = 'black';
	                hr_background = 'black';
	            }
	            else if(value < 1 && value != -1) {
	            	background = 'red';
	            	color = 'black';
	            	hr_background = 'black';
	            }
	            else{
	            value = "No Data Yet"
	            background = 'white';
	            color = '#5e5e5e';
	            hr_background = '#E5E5E5';
        }
	        }
		 
		var model = <Card className = "card_style"
						 id = "my-card"
						 style = {{background:background, color:color}}>
					        <CardBody>
					          	<CardTitle className = "header_style">Time To 99</CardTitle>
					          	<hr className = "hr_style"
					          		id = "hr-style" 
					          		style = {{background:hr_background}}/>
					          	<CardText className = "value_style">{this.renderSecToMin(score)}</CardText>
					        </CardBody>
					    </Card>
		return model;
	}
	renderSecToMin(value){

  		/* Converting to Minutes and Seconds format from the Seconds */
  		let time;
  		if(value != null && value != "00:00" && value != undefined &&
  		 value != "00:00:00" && value != "-"){
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
	  		time = "No Data Yet"
	  	}
  		return time;
  	}

	renderPureTimeTo99Colors(score,value){
		/* adding background color to card depends upon their Non-Exercise steps ranges*/
		let background = "";
		let color = "";
		let hr_background = "";
		if(value){
		
	            if(value >= 3.4){
	           		background = 'green';
	               	color = 'white';
	               	hr_background = 'white';
	            }
	            else if(value >= 3 && value <= 3.39){
	                background = '#32CD32';
	                color = 'white';
	                hr_background = 'white';
	            }
	            else if(value >= 2 && value < 3){
	                background = '#FFFF01';
	                color = 'black';
	                hr_background = 'black';
	            }
	            else if(value >= 1 && value < 2){
	                background = '#E26B0A';
	                color = 'black';
	                hr_background = 'black';
	            }
	            else if(value < 1 && value != -1) {
	            	background = 'red';
	            	color = 'black';
	            	hr_background = 'black';
	            }
	            else{

	            value = "No Data Yet"
	            background = 'white';
	            color = '#5e5e5e';
	            hr_background = '#E5E5E5';
        }
	        }

	    if(score && score == -1){
       		background = 'red';
           	color = 'black';
           	hr_background = 'black';
	    }
	    score = score && score == -1?'Never':this.renderSecToMin(score);

		var model = <Card className = "card_style"
						 id = "my-card"
						 style = {{background:background, color:color}}>
					        <CardBody>
					          	<CardTitle className = "header_style">Pure Time To 99</CardTitle>
					          	<hr className = "hr_style"
					          		id = "hr-style" 
					          		style = {{background:hr_background}}/>
					          	<CardText className = "value_style">{score}</CardText>
					        </CardBody>
					    </Card>
		return model;
	}
	renderHeartBeatsColors(score){
		/* adding background color to card depends upon their Movement Consistency Score ranges*/
		let background = "";
		let color = "";
		let hr_background = "";
		if(score || score == 0){
		var score = parseFloat(score); 
	            if(score >= 30){
	               	background = 'green';
	               	color = 'white';
	               	hr_background = 'white';
	            }
	            else if(score >= 20 && score < 29){
	                background = '#32CD32';
	                color = 'white';
	                hr_background = 'white';
	            }
	            else if(score >= 14 && score < 19){
	                background = '#FFFF01';
	                color = 'black';
	                hr_background = 'black';
	            }
	            else if(score >= 12 && score <= 13){
	                background = '#E26B0A';
	                color = 'black';
	                hr_background = 'black';
	            }
	            else if(score < 12){
	                background = '#FF0101';
	                color = 'black';
	                hr_background = 'black';
	            }
        	
		}
		else{
				score = "No Data Yet"
	            background = 'white';
	            color = '#5e5e5e';
	            hr_background = '#E5E5E5';
        }

		var model = <Card className = "card_style" 
							id = "my-card-mcs"
							 style = {{background:background, color:color}}>
				        	<CardBody>
				          		<CardTitle className = "header_style">Heart Beats Lowered in 1st Minute</CardTitle>
				          		<hr className = "hr_style" 
				          			id = "hr-style-mcs"
				          			style = {{background:hr_background}}/>
				          		<CardText className = "value_style">{score}</CardText>
				        	</CardBody>
			      		</Card>
		return model;
	}
	renderPureHeartBeatsColors(score){
		/* adding background color to card depends upon their Movement Consistency Score ranges*/
		let background = "";
		let color = "";
		let hr_background = "";

		if(score || score == 0){
		var score = parseFloat(score); 
	             if(score >= 30){
	               	background = 'green';
	               	color = 'white';
	               	hr_background = 'white';
	            }
	            else if(score >=20 && score <=29){
	                background = '#32CD32';
	                color = 'white';
	            }
	            else if(score >= 14 && score <=19){
	                background = 'yellow';
	                color = 'black';
	                hr_background = 'black';
				}
				else if(score >= 12 && score <=13){
	                background = 'orange';
	                color = 'black';
	                hr_background = 'black';
				}
				   else if(score < 12){
	                background = 'red';
	                color = 'black';
	                hr_background = 'black';
	            }
		}
		else{
				score = "No Data Yet"
	            background = 'white';
	            color = '#5e5e5e';
	            hr_background = '#E5E5E5';
        }
		var model = <Card className = "card_style" 	
							id = "my-card-mcs"
							 style = {{background:background, color:color}}>
				        	<CardBody>
				          		<CardTitle className = "header_style">Pure Heart Beats Lowered in 1st Min</CardTitle>
				          		<hr className = "hr_style" 
				          			id = "hr-style-mcs"
				          			style = {{background:hr_background}}/>
				          		<CardText className = "value_style">{score}</CardText>
				        	</CardBody>
			      		</Card>
		return model;
	}
	toggleCalendar(){
		//Toggle of calander icon.
	    this.setState({
	      calendarOpen:!this.state.calendarOpen
	    });
    }
    componentDidMount(){
    	this.setState({
    		fetching_hrr_dashboard:true,
    	})
		 fetchLastSync(this.successLastSync,this.errorquick);
		 fetchHrrSummaryData(this.successHrrSummaryData,this.errorHrrSummaryData,this.state.selectedDate);
		 fetchLeaderBoard(this.successLeaderboard,this.errorHrrSummaryData,this.state.selectedDate);
	}
	render(){
		return(
			<div>
				<NavbarMenu title={"HRR Summary Dashboard"} />
				{this.state.dashView &&
					<div className = "cla_center">
						<span>
							<span onClick = {this.renderRemoveDate} style = {{marginLeft:"30px",marginRight:"14px"}}>
								<FontAwesome
			                        name = "angle-left"
			                        size = "2x"
				                />
							</span> 
			            	<span id="navlink" onClick={this.toggleCalendar} id="gd_progress">
			                    <FontAwesome
			                        name = "calendar"
			                        size = "2x"
			                    />
			                    <span style = {{marginLeft:"20px",fontWeight:"bold",paddingTop:"7px"}}>{moment(this.state.selectedDate).format('MMM DD, YYYY')}</span>  
		                	</span>
		                	<span onClick = {this.renderAddDate} style = {{marginLeft:"14px"}}>
								<FontAwesome
			                        name = "angle-right"
			                        size = "2x"
				                />
							</span> 
							<span style = {{textAlign:"center"}}>{this.renderLastSync(this.state.last_synced)}</span>
			            	<Popover
					            placement="bottom"
					            isOpen={this.state.calendarOpen}
					            target="gd_progress"
					            toggle={this.toggleCalendar}>
				                <PopoverBody className="calendar2">
				                <CalendarWidget  onDaySelect={this.processDate}/>
				                </PopoverBody>
			                </Popover>
	                	</span>
			        </div>
		    	}
		    	{this.state.gridview &&
	           	<div>
	            	<Button className = "btn btn-info" onClick = {this.handleBackButton} style = {{marginLeft:"50px",marginTop:"10px",fontSize:"13px"}}>Back</Button>
	            </div>
            	}
		        {this.state.dashView &&
					<div className = "row justify-content-center md_padding">
						<div className = "col-md-6 table_margin ">
							{this.renderOverallHrrRankColor(this.state.rank_data)}
					    </div>
						<div className = "col-md-6  table_margin ">
				      		{this.renderTimeTo99Color(this.state.time_to_99.time99,this.state.time_to_99.points)}
				      	</div>
					</div>
				}
				{this.state.dashView &&
					<div className = "row justify-content-center md_padding">
						<div className = "col-md-6 table_margin ">
							{this.renderHeartBeatsColors(this.state.heart_beats_lowest_1st_minute)}
					    </div>
						<div className = "col-md-6 table_margin ">
							{this.renderPureTimeTo99Colors(this.state.pure_time_to_99.pure_time99,this.state.pure_time_to_99.points)}
					    </div>
					</div>
				}
				{this.state.dashView &&
					<div className = "row justify-content-center md_padding hrr_padd">
						<div className = "col-md-6 table_margin ">
							{this.renderPureHeartBeatsColors(this.state.pure_heart_beats_lowered_in_1st_min)}
					    </div>
					</div>
				}
				{this.renderHrrSummaryDashboardDataFetchOverlay()}
				<div className = "hr_dashboard_padd">
				{this.state.gridview &&
					<HrrLeaderboard Hrr_data = {this.state.all_hrr_rank_data}
	  							Hrr_username = {this.state.Hrr_username}/>
				}
				</div>
			</div>
		);
	}
}
export default Hrr_Dashboard;
