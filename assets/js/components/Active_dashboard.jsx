import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import _ from 'lodash';
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
import NavbarMenu from './navbar';
import {fetchActiveData} from '../network/momentDashboard';

import {renderLeaderBoardFetchOverlay,renderLeaderBoard2FetchOverlay,renderLeaderBoard3FetchOverlay,renderLeaderBoardSelectedDateFetchOverlay} from './leaderboard_healpers';
import { getGarminToken,logoutUser} from '../network/auth';
import fetchLeaderBoard from '../network/leaderBoard';
import AllRank_Data1 from "./leader_all_exp";

axiosRetry(axios, { retries: 3});
var CalendarWidget = require('react-calendar-widget');
var ReactDOM = require('react-dom');

class ActiveDashboard extends Component{
	constructor(props) {
    super(props);
	    this.state = {
	    	calendarOpen:false,
	    	fetching_active_data:false,
		   	selectedDate:new Date(),
		   	active_data:{},
		   	fetching_ranking_data:false,
	        ranking_data:{},
	        active_view:true,
			btnView:false,
	       
	    }
	    this.toggleCalendar = this.toggleCalendar.bind(this);
	    this.renderAddDate = this.renderAddDate.bind(this);
		this.renderRemoveDate = this.renderRemoveDate.bind(this);
		this.processDate = this.processDate.bind(this);
		this.successActiveData = this.successActiveData.bind(this);
		this.errorActiveData = this.errorActiveData.bind(this);
		this.successLeaderBoard = this.successLeaderBoard.bind(this);
		this.errorLeaderBoard = this.errorLeaderBoard.bind(this);
		this.renderAllRank = this.renderAllRank.bind(this);
		this.handleBackButton = this.handleBackButton.bind(this);
		this.renderTablesTd = this.renderTablesTd.bind(this);
	}
	successActiveData(data){
		this.setState({
			active_data:data.data,
			fetching_active_data:false
		});
  	}
  	errorActiveData(error){
		console.log(error.message);
		this.setState({
			fetching_active_data:false,
		});
		
  	}
  	successLeaderBoard(data){
		this.setState({
			ranking_data:data.data,
			fetching_ranking_data:false,
			
		});

	}

	errorLeaderBoard(error){
		console.log(error.message);
		this.setState({
			fetching_ranking_data:false,
    	});
	}
	renderAddDate(){
		/*It is forward arrow button for the calender getting the next day date*/
		var today1 = this.state.selectedDate;
		var tomorrow = moment(today1).add(1, 'days');
		this.setState({
			selectedDate:tomorrow.toDate(),
			fetching_active_data:true,
			active_data:{},
			fetching_ranking_data:true,
			ranking_data:{},
		
		},()=>{
			fetchActiveData(this.successActiveData,this.errorActiveData,this.state.selectedDate);
			fetchLeaderBoard(this.successLeaderBoard,this.errorLeaderBoard,this.state.selectedDate);
		});
	}
	renderRemoveDate(){
		/*It is backward arrow button for the calender getting the last day date*/
		var today1 = this.state.selectedDate;
		var tomorrow = moment(today1).subtract(1, 'days');
		this.setState({
			selectedDate:tomorrow.toDate(),
			fetching_active_data:true,
			active_data:{},
			fetching_ranking_data:true,
			ranking_data:{},
			
	},()=>{
			fetchActiveData(this.successActiveData,this.errorActiveData,this.state.selectedDate);
			fetchLeaderBoard(this.successLeaderBoard,this.errorLeaderBoard,this.state.selectedDate);
		})
	}
	toggleCalendar(){
		//Toggle of calander icon.
	    this.setState({
	      calendarOpen:!this.state.calendarOpen
	    });
    }
     processDate(selectedDate){
		this.setState({
			selectedDate:selectedDate,
			calendarOpen:!this.state.calendarOpen,
			fetching_active_data:true,
			active_data:{},
			fetching_ranking_data:true,
			ranking_data:{},
			
		},()=>{
			fetchActiveData(this.successActiveData,this.errorActiveData,this.state.selectedDate);
			fetchLeaderBoard(this.successLeaderBoard,this.errorLeaderBoard,this.state.selectedDate);
		});
	}
	componentDidMount(){
		this.setState({
			fetching_active_data:true,
			fetching_ranking_data:true,
		});
		fetchActiveData(this.successActiveData,this.errorActiveData,this.state.selectedDate);
		fetchLeaderBoard(this.successLeaderBoard,this.errorLeaderBoard,this.state.selectedDate);
	}
	handleBackButton(){
      this.setState({
        active_view:!this.state.active_view,
        btnView:false
      })
    }
	renderAllRank(all_rank,value1,value2,value3){
  		this.setState({
  			active_view:!this.state.active_view,
        	btnView:!this.state.btnView,
  			active_category:all_rank,
        	active_username:value1,
        	active_category_name:value2,
        	all_verbose_name:value3
  		})
  		
  	}
	renderTablesTd(active_data,ranking_data){
		let tableRows = [];
		let table_headings = ["Entire 24 Hour Day","Sleep Hours","Entire 24 Hour Day Excluding Sleep","Exercise Hours","Entire 24 Hour Day Excluding Sleep and Exercise"]
		let tableHeaders = [<th>{}</th>]
		for(let th of table_headings){
			tableHeaders.push(<th>{th}</th>);
		}
		tableRows.push(<thead >{tableHeaders}</thead>);
		let activeTableData = [<td>{"Time Moving / Active (hh:mm)"}</td>]
	  	let active = ["total_active_time", "sleeping_active_time", "excluded_sleep", "exercise_active_time", "excluded_sleep_exercise"]
	  	for(let key1 of active){
	  		if(active_data[key1] != null && active_data[key1] != undefined){
	  			if(key1=="total_active_time"||key1=="excluded_sleep"||key1=="excluded_sleep_exercise"){
		  			if(key1=="total_active_time"){
		  				var value = ranking_data.active_min_total;
		  			}
		  			else if(key1=="excluded_sleep"){
		  				var value = ranking_data.active_min_exclude_sleep;
		  			}
		  			else if(key1=="excluded_sleep_exercise"){
		  				var value = ranking_data.active_min_exclude_sleep_exercise;
		  			}
		  			let dur = "today";
		  			let rank = '';
			  		let all_rank_data = '';
			  		let userName = '';
			  		let category = '';
			  		let verbose_name = '';
			        let other_Scores = {};
		  			if(dur&&dur=="today"){
		  				if(value && value[dur]!=undefined){
		  					rank = value[dur].user_rank.rank;
				     		all_rank_data = value[dur].all_rank;
				     		userName = value[dur].user_rank.username;
				     		category = value[dur].user_rank.category;
				     		let otherScoreObject = value[dur].user_rank.other_scores;
				     		if(otherScoreObject != null 
				     		   && otherScoreObject != undefined 
				     		   && otherScoreObject != ""
				     		   && key1 !== 'total_active_time'){
					            for (let [key3,o_score] of Object.entries(otherScoreObject)){
					            	if(o_score != null && o_score != undefined && o_score != "") {
					                      if(!other_Scores[key3]){
					                        other_Scores[key3] = {
					                          verbose_name:o_score.verbose_name,
					                          scores:[]
					                        }
					                      }
					                      if(o_score.value != null && o_score.value != undefined && o_score.value != "") {
					                        other_Scores[key3]["scores"].push(o_score.value);
					                   	  }
					                }
					            } 
				            }      
	     	 			}	
		  			}
		  			
		  			activeTableData.push(
				  		<td>{active_data[key1]}<br/>{'( '}
				  			<a onClick = {this.renderAllRank.bind(this,all_rank_data,userName,category,other_Scores)}>
				  				 <span >{rank}</span>
				  				 <span id="lbfontawesome">
				                    <FontAwesome
				                    	className = "fantawesome_style"
				                        name = "external-link"
				                        size = "1x"
				                    />
				                 </span>
				            </a>{')'}    
				  		</td>
			  		);
	  			}
	  			else if(key1=="sleeping_active_time"||"exercise_active_time"){
	  				activeTableData.push(
			  			<td>{active_data[key1]}</td>);
	  			}
			}
			else{
				activeTableData.push(
			  			<td>{" - "}</td>);
			}
	  	}
	  	tableRows.push(<tbody><tr >{activeTableData}</tr></tbody>);
	  	let timePeriodTableData = [<td>{"Time in Period (hh:mm)"}</td>];
	  	let timeperiod = ["total_hours", "total_sleeping_hours", "excluded_sleep_hours", 
				"total_exercise_hours", "excluded_sleep_exercise_hours"]
		for(let key1 of timeperiod){
			if(active_data[key1] != null && active_data[key1] != undefined){
				timePeriodTableData.push(
				  		<td>{active_data[key1]}</td>);
			}
			else{
				timePeriodTableData.push(
			  			<td>{" - "}</td>);
			}
		}
		tableRows.push(<tbody><tr >{timePeriodTableData}</tr></tbody>);
		let activePercentTableData = [<td>{"% Active"}</td>];
	  	let activepercent = ["total_active_prcnt", "sleep_hour_prcnt", "excluded_sleep_prcnt", 
				"exercise_hour_prcnt", "excluded_sleep_exercise_prcnt"]
	  	for(let key1 of activepercent){
	  		if(active_data[key1] != null && active_data[key1] != undefined){
				activePercentTableData.push(
				  		<td>{active_data[key1]}</td>);
			}
			else{
				activePercentTableData.push(
			  			<td>{" - "}</td>);
			}
		}
		tableRows.push(<tbody><tr >{activePercentTableData}</tr></tbody>);

		return  <table className = "activeTimeTable table  table-bordered">{tableRows}</table>;
	}
	render(){
		return(
			<div className = "container-fluid mnh-mobile-view">
				<NavbarMenu title = {<span style = {{fontSize:"18px"}}>
				Time Moving / Active Dashboard
				</span>} />
				{this.state.active_view&&
					<div className = "cla_center" style = {{fontSize:"12px"}}>
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
				{this.state.btnView &&
	           	<div>
	            	<Button className = "btn btn-info" onClick = {this.handleBackButton} style = {{marginLeft:"50px",marginTop:"10px",fontSize:"13px"}}>Back</Button>
	            </div>
            	}
            	{this.state.active_view &&
		       <div style = {{fontSize:"12px"}}>
		        <div className="" style = {{fontWeight:"bold","textAlign":"center"}}>Time Moving / Active (hh:mm)
                </div>
		        	<div className = "activeTimeTableParentDiv">
			        	{this.renderTablesTd(this.state.active_data,this.state.ranking_data)}
			        </div>
		        </div>
		    	}
		    	{this.state.btnView && 
			        <AllRank_Data1 data={this.state.active_category} 
			        active_username = {this.state.active_username} 
			        active_category_name = {this.state.active_category_name}
			        all_verbose_name = {this.state.all_verbose_name}/>
		  		}
			</div>
		);			
	}
}
export default ActiveDashboard;