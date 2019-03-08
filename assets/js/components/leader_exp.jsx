import React,{ Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {connect} from 'react-redux';
import FontAwesome from "react-fontawesome";
import { Collapse, Navbar, NavbarToggler, 
         NavbarBrand, Nav, NavItem, NavLink,
        Button,Popover,PopoverBody,Form,FormGroup,FormText,Label,Input} from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import NavbarMenu from './navbar';

import {renderLeaderBoardFetchOverlay,renderLeaderBoard2FetchOverlay,renderLeaderBoard3FetchOverlay,renderLeaderBoardSelectedDateFetchOverlay} from './leaderboard_healpers';
import { getGarminToken,logoutUser} from '../network/auth';
import fetchLeaderBoard from '../network/leaderBoard';
import AllRank_Data1 from "./leader_all_exp";
import HrrLeaderboard from "./Hrr_leaderboard"; 



var CalendarWidget = require('react-calendar-widget');  
var ReactDOM = require('react-dom');
const categoryMeta = {
	"Overall Health GPA":{    
		short_name:"oh_gpa",
		url_name:"overall-health-gpa"
	},
	"Alcohol":{
		short_name:"alcohol",
		url_name:"alcohol-drink"
	},
	"Average Sleep":{ 
		short_name:"avg_sleep",
		url_name:"avg-sleep"
	},
	"Percent Unprocessed Food":{
		short_name:"prcnt_uf",
		url_name:"percent-unprocessed-food"
	},
	"Total Steps":{
		short_name:"total_steps",
		url_name:"total-steps"
	},
	"Movement Consistency":{
		short_name:"mc",
		url_name:"movement-consistency"
	},
	"Exercise Consistency":{
		short_name:"ec",
		url_name:"exercise-consistency"
	},
	"Awake Time":{
		short_name:"awake_time",
		url_name:"awake-time"
	},
	"Resting Heart Rate":{
		short_name:"resting_hr",
		url_name:"resting-heart-rate"
	},
	"Deep Sleep":{
		short_name:"deep_sleep",
		url_name:"deep-sleep" 
	},
	"Non Exercise Steps":{
		short_name:"nes",
		url_name:"movement-non-exercise-gpa"
	},
	"Floors Climbed":{
		short_name:"floor_climbed",
		url_name:"floor-climbed"
	},
	"Heart Beats Lowered In 1st Minute":{
		short_name:"beat_lowered",
		url_name:"beat-lowered"
	},
	"Pure Heart Beats Lowered In 1st Minute":{
		short_name:"pure_beat_lowered",
		url_name:"pure-beat-lowered"
	},
	"Pure Time To 99":{
		short_name:"pure_time_99",
		url_name:"pure-time-99"
	},
	"Time To 99":{
		short_name:"time_99",
		url_name:"time-99"
	},
	/*******/
	"Active Minute Per Day (24 hours)":{
		short_name:"active_min_total",
		url_name:"active-min-total"
	},
	"Active Minute Per Day (Excludes Active Minutes When Sleeping)":{
		short_name:"active_min_exclude_sleep",
		url_name:"active-min-exclude-sleep"
	},
	"Active Minute Per Day (Excludes Active Minutes When Sleeping and Exercising)":{
		short_name:"active_min_exclude_sleep_exercise",
		url_name:"active-min-exclude-sleep-exercise"
	}
	/*******/
};
const overallHrrcategory = ["overall_hrr"];
const catagory = ["oh_gpa","alcohol","avg_sleep","prcnt_uf",
	"total_steps","mc","ec","awake_time","resting_hr","deep_sleep",
	"nes","floor_climbed","beat_lowered","pure_beat_lowered",
	"pure_time_99","time_99","active_min_total","active_min_exclude_sleep",
	"active_min_exclude_sleep_exercise"];
const duration = ["week","today","yesterday","year","month","custom_range"];
let durations_captilize = {"today":"Today","yesterday":"Yesterday","week":"Week","month":"Month","year":"Year",};
class LeaderBoard1 extends Component{
	constructor(props){
		super(props);
		let rankInitialState = {}
    for (let catg of catagory){
        let catInitialState = {}
        for(let dur of duration){
          	let userRank = {
	            'user_rank':{
	              category:'',
	              rank:'',
	              username:'', 
	              score:''
	            },
	            "all_rank":[
	            ]
	        };
         catInitialState[dur] = userRank;
        }
        rankInitialState[catg] = catInitialState;
    };

	let overallHrrrankInitialState = {}
    for (let catg of overallHrrcategory){
        let hrrInitialState = {}
        for(let dur of duration){
	          let userRank = {
	            'user_rank':{

	            },
	            "all_rank":[
	            ]
	        };
         hrrInitialState[dur] = userRank;
        }
        overallHrrrankInitialState[catg] = hrrInitialState;
    };
		this.state = {
			selectedDate:new Date(),
			lb1_start_date:'',
	        lb1_end_date:'',
	        lb2_start_date:'',
	        lb2_end_date:'',
	        lb3_start_date:'',
	        lb3_end_date:'',
	        fetching_lb1:false,
	        fetching_lb2:false,
	        fetching_lb3:false,
	        fetching_lb4:false,
	        dateRange1:false,
	        dateRange2:false,
	        dateRange3:false,
			calendarOpen:false,
			isOpen:false,
			isOpen1:false,
			ranking_data:rankInitialState,
			Hrr_ranking_data:overallHrrrankInitialState,
			active_view:true,
			btnView:false,
			btnView2:false,
			Hrr_view:false,
			scrollingLock:false,
			active_category:"",
			active_username:"",
			active_category_name:"",
			all_verbose_name:"",
			all_hrr_rank_data:"",
			Hrr_username:"",
			duration_date:{
				"week":"",
				"today":"",
				"yesterday":"",
				"year":"",
				"month":"",
			
			},
		}
		this.toggleCalendar = this.toggleCalendar.bind(this);
		this.toggle = this.toggle.bind(this);
		this.toggle1 = this.toggle1.bind(this);
		this.successLeaderBoard = this.successLeaderBoard.bind(this);
		this.errorLeaderBoard = this.errorLeaderBoard.bind(this);
		this.processDate = this.processDate.bind(this);
		this.renderTablesTd = this.renderTablesTd.bind(this);
		this.onSubmitDate1 = this.onSubmitDate1.bind(this);
		this.onSubmitDate2 = this.onSubmitDate2.bind(this);
		this.onSubmitDate3 = this.onSubmitDate3.bind(this);
		this.toggleDate1 = this.toggleDate1.bind(this);
		this.toggleDate2 = this.toggleDate2.bind(this);
		this.toggleDate3 = this.toggleDate3.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.headerDates = this.headerDates.bind(this);
		this.renderLeaderBoardFetchOverlay = renderLeaderBoardFetchOverlay.bind(this);
		this.renderLeaderBoard2FetchOverlay = renderLeaderBoard2FetchOverlay.bind(this);
		this.renderLeaderBoard3FetchOverlay = renderLeaderBoard3FetchOverlay.bind(this);
		this.renderLeaderBoardSelectedDateFetchOverlay = renderLeaderBoardSelectedDateFetchOverlay.bind(this);
		this.handleBackButton = this.handleBackButton.bind(this);
		this.renderTableHeader = this.renderTableHeader.bind(this);
		this.renderOverallHrrTable = this.renderOverallHrrTable.bind(this);
		this.MinToHours = this.MinToHours.bind(this);

	}
	successLeaderBoard(data){
		this.setState({
			Hrr_ranking_data:data.data.overall_hrr,
			ranking_data:data.data,
			duration_date:data.data.duration_date,
			fetching_lb1:false,
	        fetching_lb2:false,
	        fetching_lb3:false,
	        fetching_lb4:false,
		});
	}

	errorLeaderBoard(error){
		this.setState({
			fetching_lb1:false,
	        fetching_lb2:false,
	        fetching_lb3:false,
	        fetching_lb4:false,
    	});
	}
	processDate(selectedDate){
		this.setState({
			selectedDate:selectedDate,
			fetching_lb4:true,
			calendarOpen:!this.state.calendarOpen,
		},()=>{fetchLeaderBoard(this.successLeaderBoard,this.errorLeaderBoard,this.state.selectedDate);
		});
	}
	onSubmitDate1(event){
    event.preventDefault();
    this.setState({
      dateRange1:!this.state.dateRange1,
      fetching_lb1:true,
       isOpen1: !this.state.isOpen1,
    },()=>{
        let custom_ranges = [];
        if(this.state.lb2_start_date && this.state.lb2_end_date){
            custom_ranges.push(this.state.lb2_start_date);
            custom_ranges.push(this.state.lb2_end_date);
        }
         if(this.state.lb3_start_date && this.state.lb3_end_date){
            custom_ranges.push(this.state.lb3_start_date);
            custom_ranges.push(this.state.lb3_end_date);
        }
        custom_ranges.push(this.state.lb1_start_date);
        custom_ranges.push(this.state.lb1_end_date);
      fetchLeaderBoard(this.successLeaderBoard,this.errorLeaderBoard,this.state.selectedDate,custom_ranges);
    });
  }
   onSubmitDate2(event){
    event.preventDefault();
    this.setState({
      dateRange2:!this.state.dateRange2,
      fetching_lb2:true,
       isOpen1: !this.state.isOpen1,
    },()=>{
         let custom_ranges = [];
        if(this.state.lb1_start_date && this.state.lb1_end_date){
            custom_ranges.push(this.state.lb1_start_date);
            custom_ranges.push(this.state.lb1_end_date);
        }
         if(this.state.lb3_start_date && this.state.lb3_end_date){
            custom_ranges.push(this.state.lb3_start_date);
            custom_ranges.push(this.state.lb3_end_date);
        }

        custom_ranges.push(this.state.lb2_start_date);
        custom_ranges.push(this.state.lb2_end_date);
      fetchLeaderBoard(this.successLeaderBoard,this.errorLeaderBoard,this.state.selectedDate,custom_ranges);
    });
  }
 onSubmitDate3(event){
    event.preventDefault();
    this.setState({
      dateRange3:!this.state.dateRange3,
      fetching_lb3:true,
       isOpen1: !this.state.isOpen1,
    },()=>{
         let custom_ranges = [];
         if(this.state.lb1_start_date && this.state.lb1_end_date){
            custom_ranges.push(this.state.lb1_start_date);
            custom_ranges.push(this.state.lb1_end_date);
        }
        if(this.state.lb2_start_date && this.state.lb2_end_date){
            custom_ranges.push(this.state.lb2_start_date);
            custom_ranges.push(this.state.lb2_end_date);
        }
        custom_ranges.push(this.state.lb3_start_date);
        custom_ranges.push(this.state.lb3_end_date);
      fetchLeaderBoard(this.successLeaderBoard,this.errorLeaderBoard,this.state.selectedDate,custom_ranges);
    });
  }
	componentDidMount(){
		this.setState({
			fetching_lb4:true,
		});
		fetchLeaderBoard(this.successLeaderBoard,this.errorLeaderBoard,this.state.selectedDate,true);
	}

	MinToHours(score){
		let time;// undefined
	  	if(score != null && score != undefined && score != "" && score != "N/A"){
		    if (score == -1){
		      time = "Never"
	    }
	    else{
	      let hours = parseInt(score/60);//3
	      let minutes = (score % 60);//9
	      if(hours < 10){// 3<10 
	        hours = "0" + hours;  //time = 03
	      }
	      else{
	        hours = hours; // time = 03 
	      }
	      if(minutes < 10){// 9<10 
	        time = hours + ":0" + minutes; // time = 03:09
	      }
	      else{
	        time = hours + ":" + minutes;// time = 3:9
	      }
	    }
	  }
	  else{
	    time = "N/A"
	  }
	  if (score == null || score == 0){
	    time = "N/A"
	  }
	  return time;
	}// time = 03:09


	toggle() {
	    this.setState({
	      isOpen: !this.state.isOpen,
	    });
  	}
  	toggle1() {
	    this.setState({
	      isOpen1: !this.state.isOpen1,
	    });
  	}
	toggleCalendar(){
	    this.setState({
	      calendarOpen:!this.state.calendarOpen
	    });
    }
    toggleDate1(){
    this.setState({
      dateRange1:!this.state.dateRange1
    });
   }
 toggleDate2(){
    this.setState({
      dateRange2:!this.state.dateRange2
    });
   }
    toggleDate3(){
    this.setState({
      dateRange3:!this.state.dateRange3
    });
   }
  	handleChange(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;
      this.setState({
        [name]: value
      });
    }
    headerDates(value){
    let str = value;
            let d = str.split(" ");
            let d1 = d[0];
            let date1 =moment(d1).format('MMM DD, YYYY');
            let d2 = d[2];
            let date2 =moment(d2).format('MMM DD, YYYY');
            let date = date1 + ' to ' + date2;
            return date;
	}
	renderOverallHrrTable(value,value5){
		let category = "";
	  	let durations = [];
	  	let scores = [];
	  	let userName;
	  	let ranks = [];
	  	let tableRows = [];
	  	let durations_type = ["today","yesterday","week","month","year","custom_range"];
	  	for(let duration of durations_type){
	  		let val = value[duration];
	  		if(duration == "custom_range" && val){
	  			for(let [range,value1] of Object.entries(val)){
	  				durations.push(this.headerDates(range));
	  				for(let [c_key,c_rankData] of Object.entries(value1)){
		  				if(c_key == "user_rank"){
		  					userName = c_rankData.username;
			  		 		scores.push(c_rankData.total_rank_point);
			  		 		ranks.push({'rank':c_rankData.rank,'duration':range,'isCustomRange':true});
		  		 		}
	  				}
	  			}
	  		}
	  		else{
	  			if (val){ 
			  		durations.push(duration);
			  		for (let [key,rankData] of Object.entries(val)){
			  		 	if(key == "user_rank"){
			  		 		userName = rankData.username;
			  		 		scores.push(rankData.total_rank_point);
			  		 		ranks.push({'rank':rankData.rank,'duration':duration,'isCustomRange':false});
			  		 	}
			  		 	
			  		}
			  	}
		  	}
		}

		let date;
	  	let tableHeaders = [<th className = "lb_table_style_rows">Overall HRR</th>]
	  	for(let dur of durations){
	  		let capt = dur[0].toUpperCase() + dur.slice(1)
	  		if(dur == "today"){
	  			date = moment(value5[dur]).format('MMM DD, YYYY');	
	  		}
	  		else if(dur == "yesterday"){
	  			date = moment(value5[dur]).format('MMM DD, YYYY');	
	  		}
	  		else if(dur == "week"){
		  		date = this.headerDates(value5[dur]);
	  		}
	  		else if(dur == "month"){
		  		date = this.headerDates(value5[dur]);
	  		}
	  		else if(dur == "year"){
		  		date = this.headerDates(value5[dur]);
	  		}
	  		else{
	  			date = value5[dur];
	  		}	
	  		tableHeaders.push(<th className = "lb_table_style_rows">{capt}<br/>{date}</th>);
	  	}
	  	tableRows.push(<thead className = "lb_table_style_rows">{tableHeaders}</thead>);
	  	
	  	let rankTableData = [<td style={{fontWeight:"bold"}}
	  							 className = "lb_table_style_rows">
	  							 {"Ranks"}</td>]

		  	for(let rank of ranks){
		  		if(rank.isCustomRange){
		  			var all_cat_rank = this.state.Hrr_ranking_data['custom_range'][rank['duration']].all_rank;
			  	}
			  	else{
			  		var all_cat_rank = this.state.Hrr_ranking_data[rank['duration']].all_rank;
			  	}
		  		rankTableData.push(
			  		<td className = "lb_table_style_rows">
			  		<a  onClick = {this.reanderAllHrr.bind(this,all_cat_rank,userName)}>
			  				<span style={{textDecoration:"underline"}}>{rank.rank}</span>
			  				 <span id="lbfontawesome">
			                    <FontAwesome
			                    	className = "fantawesome_style"
			                        name = "external-link"
			                        size = "1x"
			                    />
			                 </span>  
			                 </a> 
			  		</td>
		  		);
		  	}
	  	tableRows.push(<tbody><tr className = "lb_table_style_rows">{rankTableData}</tr></tbody>);

	  	let scoreTableData = [<td style={{fontWeight:"bold"}}
	  							 className = "lb_table_style_rows">
	  							 {"Total Hrr Rank Point"}</td>]
	  	for(let score of scores){
	  		scoreTableData.push(<td className = "lb_table_style_rows">
			  				{score}</td>)
	  	}
	  	tableRows.push(<tr className = "lb_table_style_rows">{scoreTableData}</tr>);

	  	return  <table className = "table table-striped table-bordered">
	  	{tableRows}
	  	</table>;
	}
	reanderAllHrr(all_data,value1){
		this.setState({
			all_hrr_rank_data:all_data,
			Hrr_username:value1,
			Hrr_view:!this.state.Hrr_view,
			active_view:!this.state.active_view,
			btnView2:!this.state.btnView2,
		});
	}
  	renderTablesTd(value,value5){
  		let category = "";
	  	let durations = [];
	  	let scores = [];
	  	let ranks = [];
	  	let usernames;
	  	let other_score_name;
	  	let other_Scores = {};
	  	let tableRows = [];
	  	let durations_type = ["today","yesterday","week","month","year","custom_range"];
	  	for(let duration of durations_type){
	  		let val = value[duration];
	  		if(duration == "custom_range" && val){
	  			for(let [range,value1] of Object.entries(val)){
	  				durations.push(this.headerDates(range));
	  				for(let [c_key,c_rankData] of Object.entries(value1)){

			  			let otherScoreObject = c_rankData.other_scores;
		  				if(c_key == "user_rank"){
			  		 		if(!category){
			  		 			category = c_rankData.category;
			  		 		}
			  		 		if(category != "Pure Time To 99" 
			  		 			&& category != "Time To 99"
			  		 			&& category != "Active Minute Per Day (24 hours)"
			  		 			&& category != "Alcohol"
			  		 			&& (otherScoreObject != null
			  		 			&& otherScoreObject != undefined 
			  		 			&& otherScoreObject != "")){
				  		 		for (let [key3,o_score] of Object.entries(otherScoreObject)){
				  		 			if(o_score != null && o_score != undefined && o_score != "") {
				  		 				if(!other_Scores[key3]){
					  		 				other_Scores[key3] = {
					  		 					verbose_name:o_score.verbose_name,
					  		 					scores:[]
					  		 				}
					  		 			}
					  		 			other_Scores[key3]["scores"].push(o_score.value);
					  		 			other_score_name = o_score.verbose_name;
				  		 			}
				  		 		}
			  		 	    }
			  		 		usernames = c_rankData.username;
			  		 		let score_val = null;
		  		 			if(category == "Active Minute Per Day (24 hours)" || category == "Active Minute Per Day (Excludes Active Minutes When Sleeping)" || category == "Active Minute Per Day (Excludes Active Minutes When Sleeping and Exercising)"){
					                score_val = this.MinToHours(c_rankData.score.value);
					            }
					        else{
					        	score_val = c_rankData.score.value;
					        }

			  		 		scores.push(score_val);
			  		 
			  		 		ranks.push({'rank':c_rankData.rank,'duration':range,'isCustomRange':true});
		  		 		}
	  				}
	  			}
	  		}
	  		else{
	  			if (val){ 
			  		durations.push(duration);
			  		for (let [key,rankData] of Object.entries(val)){
			  			let otherScoreObject = rankData.other_scores;
			  		 	if(key == "user_rank"){
			  		 		if(!category){
			  		 			category = rankData.category;
			  		 		}
			  		 		if(category != "Pure Time To 99" 
			  		 			&& category != "Time To 99"
			  		 			&& category != "Active Minute Per Day (24 hours)"
			  		 			&& category != "Alcohol"
			  		 			&& otherScoreObject != null 
			  		 			&& otherScoreObject != undefined 
			  		 			&& otherScoreObject != ""){
				  		 		for (let [key3,o_score] of Object.entries(otherScoreObject)){
				  		 			if(o_score != null && o_score != undefined && o_score != "") {
				  		 				if(!other_Scores[key3]){
					  		 				other_Scores[key3] = {
					  		 					verbose_name:o_score.verbose_name,
					  		 					scores:[]
					  		 				}
					  		 			}
					  		 			other_Scores[key3]["scores"].push(o_score.value);
					  		 			other_score_name = o_score.verbose_name;
				  		 			}
				  		 		}
			  		 	    }
			  		 	    
			  		 		usernames = rankData.username;
			  		 		let score_val = null;
		  		 			if(category == "Active Minute Per Day (24 hours)" || category == "Active Minute Per Day (Excludes Active Minutes When Sleeping)" || category == "Active Minute Per Day (Excludes Active Minutes When Sleeping and Exercising)"){
					                score_val = this.MinToHours(rankData.score.value);
					            }
					        else{
					        	score_val = rankData.score.value;
					        }

			  		 		scores.push(score_val);
			  	
			  		 		ranks.push({'rank':rankData.rank,'duration':duration,'isCustomRange':false});
			  		 	}
			  		}
			  	}
		  	}
	  	}

	  	// creating headers for table
	  	let date;
	  	let tableHeaders = [<th className = "lb_table_style_rows">{category}</th>]
	  	for(let dur of durations){
	  		let capt = dur[0].toUpperCase() + dur.slice(1)
	  		if(dur == "today"){
	  			date = moment(value5[dur]).format('MMM DD, YYYY');	
	  		}
	  		else if(dur == "yesterday"){
	  			date = moment(value5[dur]).format('MMM DD, YYYY');	
	  		}
	  		else if(dur == "week"){
		  		date = this.headerDates(value5[dur]);
	  		}
	  		else if(dur == "month"){
		  		date = this.headerDates(value5[dur]);
	  		}
	  		else if(dur == "year"){
		  		date = this.headerDates(value5[dur]);
	  		}
	  		else{
	  			date = value5[dur];
	  		}	
	  		tableHeaders.push(<th className = "lb_table_style_rows">{capt}<br/>{date}</th>);
	  	}
	 
	  	tableRows.push(<thead className = "lb_table_style_rows">{tableHeaders}</thead>);
	  	// creating table rows for ranks
	  	let rankTableData = [<td style={{fontWeight:"bold"}}
	  							 className = "lb_table_style_rows">
	  							 {"Ranks"}</td>]
	  	if (category){
		  	for(let rank of ranks){
		  		if(rank.isCustomRange){
		  			var all_cat_rank = this.state.ranking_data[
			  					categoryMeta[category]["short_name"]]['custom_range'][rank['duration']].all_rank;


			  	}
			  	else{
			  		var all_cat_rank = this.state.ranking_data[
			  					categoryMeta[category]["short_name"]][rank['duration']].all_rank;	

			  	}
		  		rankTableData.push(
			  		<td className = "lb_table_style_rows">
			  		<a  onClick = {this.reanderAll.bind(this,all_cat_rank,usernames,category,other_Scores)}>
			  				<span style={{textDecoration:"underline"}}>{rank.rank}</span>
			  				 <span id="lbfontawesome">
			                    <FontAwesome
			                    	className = "fantawesome_style"
			                        name = "external-link"
			                        size = "1x"
			                    />
			                 </span>  
			                 </a> 
			  		</td>
		  		);
		  	}
		 }else{
		 	for(let rank of ranks){
		  		rankTableData.push(
			  		<td className = "lb_table_style_rows">
			  				<span style={{textDecoration:"underline"}}>{rank?rank.rank:rank}</span>
			  				 <span id="lbfontawesome">
			                    <FontAwesome
			                    	className = "fantawesome_style"
			                        name = "external-link"
			                        size = "1x"
			                    />
			                 </span>    
			  		</td>
		  		);
		  	}
		 }
	  	tableRows.push(<tbody><tr className = "lb_table_style_rows">{rankTableData}</tr></tbody>);

	  	let scoreTableData = [];
	  	if(category == "Overall Health GPA"){
	  	scoreTableData.push(<td style={{fontWeight:"bold"}}
	  							  className = "lb_table_style_rows">
	  							  {"Overall Health GPA"}</td>);
	    }
	  	else if(category == "Alcohol"){
	  	scoreTableData.push(<td style={{fontWeight:"bold"}}
	  							  className = "lb_table_style_rows">
	  							  {"Average Drinks Per Week (7 Days)"}</td>);
	    }
	    else if(category == "Average Sleep"){
	  	scoreTableData.push(<td style={{fontWeight:"bold"}}
	  							  className = "lb_table_style_rows">
	  							  {"Sleep GPA"}</td>);
	    }
	   //  else if(category == "Percent Unprocessed Food"){
	  	// scoreTableData.push(<td style={{fontWeight:"bold"}}
	  	// 						  className = "lb_table_style_rows">
	  	// 						  {"% Unprocessed Food"}</td>);
	   //  }
	    else if(category == "Total Steps"){
	  	scoreTableData.push(<td style={{fontWeight:"bold"}}
	  							  className = "lb_table_style_rows">
	  							  {"Total Steps"}</td>);
	    }
	    else if(category == "Movement Consistency"){
	  	scoreTableData.push(<td style={{fontWeight:"bold"}}
	  							  className = "lb_table_style_rows">
	  							  {"Movement Consistency Score"}</td>);
	    }
	    else if(category == "Exercise Consistency"){
	  	scoreTableData.push(<td style={{fontWeight:"bold"}}
	  							  className = "lb_table_style_rows">
	  							  {"Avg # of Days Exercised/Week"}</td>);
	    }
	    else if(category == "Awake Time"){
	  	scoreTableData.push(<td style={{fontWeight:"bold"}}
	  							  className = "lb_table_style_rows">
	  							  {"Awake Time Duration (hh:mm"}</td>);
	    }
	    else if(category == "Resting Heart Rate"){
	  	scoreTableData.push(<td style={{fontWeight:"bold"}}
	  							  className = "lb_table_style_rows">
	  							  {"Resting Heart Rate (RHR)"}</td>);
	    }
	    else if(category == "Deep Sleep"){
	  	scoreTableData.push(<td style={{fontWeight:"bold"}}
	  							  className = "lb_table_style_rows">
	  							  {"Deep Sleep Duration (hh:mm)"}</td>);
	    }
	    else if(category == "Non Exercise Steps"){
	  	scoreTableData.push(<td style={{fontWeight:"bold"}}
	  							  className = "lb_table_style_rows">
	  							  {"Non Exercise Steps"}</td>);
	    }
	    else if(category == "Floors Climbed"){
	  	scoreTableData.push(<td style={{fontWeight:"bold"}}
	  							  className = "lb_table_style_rows">
	  							  {"Floors Climbed"}</td>);
	    }
	    else if(category == "Heart Beats Lowered In 1st Minute"){
	  	scoreTableData.push(<td style={{fontWeight:"bold"}}
	  							  className = "lb_table_style_rows">
	  							  {"Heart Beats Lowered In 1st Minute"}</td>);
	    }
	     else if(category == "Pure Heart Beats Lowered In 1st Minute"){
	  	scoreTableData.push(<td style={{fontWeight:"bold"}}
	  							  className = "lb_table_style_rows">
	  							  {"Pure Heart Beats Lowered In 1st Minute"}</td>);
	    }
	     else if(category == "Pure Time To 99"){
	  	scoreTableData.push(<td style={{fontWeight:"bold"}}
	  							  className = "lb_table_style_rows">
	  							  {"Pure Time To 99"}</td>);
	    }
	     else if(category == "Time To 99"){
	  	scoreTableData.push(<td style={{fontWeight:"bold"}}
	  							  className = "lb_table_style_rows">
	  							  {"Time To 99"}</td>);
	    }
	    /********************************/



	    else if(category == "Active Minute Per Day (24 hours)"){
	  	scoreTableData.push(<td style={{fontWeight:"bold"}}
	  							  className = "lb_table_style_rows">
	  							  {"Active Minutes (24 hours)"}</td>);
	    }
	     else if(category == "Active Minute Per Day (Excludes Active Minutes When Sleeping)"){
	  	scoreTableData.push(<td style={{fontWeight:"bold"}}
	  							  className = "lb_table_style_rows">
	  							  {"Active Minutes (when not sleeping)"}</td>);
	    }
	     else if(category == "Active Minute Per Day (Excludes Active Minutes When Sleeping and Exercising)"){
	  	scoreTableData.push(<td style={{fontWeight:"bold"}}
	  							  className = "lb_table_style_rows">
	  							  {"Active Minutes (when not sleeping and exercising)"
									}</td>);
	    }
	    /********************************/									
	  	for(let score of scores){
	  		if(category == "Total Steps"){
	  			var value = score;
	  		    if(value != undefined){
	                value += '';
	                var x = value.split('.');
	                var x1 = x[0];
	                var x2 = x.length > 1 ? '.' + x[1] : '';
	                var rgx = /(\d+)(\d{3})/;
	                while (rgx.test(x1)) {
	            			x1 = x1.replace(rgx, '$1' + ',' + '$2');
	          		}
	                scoreTableData.push(<td className="lb_table_style_rows">{x1 + x2}</td>);
    	        }
	  		}
	  		else if(category == "Non Exercise Steps"){
	  			var value = score;
	  		    if(value != undefined){
	                value += '';
	                var x = value.split('.');
	                var x1 = x[0];
	                var x2 = x.length > 1 ? '.' + x[1] : '';
	                var rgx = /(\d+)(\d{3})/;
	                while (rgx.test(x1)) {
	            			x1 = x1.replace(rgx, '$1' + ',' + '$2');
	          		}
	                scoreTableData.push(<td className="lb_table_style_rows">{x1 + x2}</td>);
    	        }
	  		}
	  		else if(category == "Percent Unprocessed Food"){
	  			scoreTableData.push(null);
	  		}
	  		else{
	  		scoreTableData.push(<td className = "lb_table_style_rows">{score}</td>);
	  	    }
	  	}
	  	if(category == "Percent Unprocessed Food"){
	  		tableRows.push(null);
	  	}
	  	else{
	  		tableRows.push(<tr className = "lb_table_style_rows">{scoreTableData}</tr>);
	  	}

	for (let [otherScoreCatg,otherScoreData] of Object.entries(other_Scores)){
		if(category == "Percent Unprocessed Food" || category == "Average Sleep" 
			|| category == "Active Minute Per Day (Excludes Active Minutes When Sleeping)" 
			|| category == "Active Minute Per Day (Excludes Active Minutes When Sleeping and Exercising)"){
		  	let other_scoresData = [];
		  	other_scoresData.push(<td style={{fontWeight:"bold"}}
		  							  className = "lb_table_style_rows">
		  							  {otherScoreData['verbose_name']}</td>);
		    for(let score of otherScoreData['scores']){
			  	other_scoresData.push(<td className = "lb_table_style_rows">{score}</td>);
			  }
		  	
		    tableRows.push(<tbody><tr className = "lb_table_style_rows">{other_scoresData}</tr></tbody>);
		  }
		}

	  	return  <table className = "table table-striped table-bordered">{tableRows}</table>;
  	};
  	reanderAll(value,value1,value2,value3,event){
 		if(value){
  		this.setState({
  			active_view:!this.state.active_view,
  			btnView:!this.state.btnView,
  			active_category:value,
  			active_username:value1,
  			active_category_name:value2,
  			all_verbose_name:value3
  		});
  		};
  	};
  	handleBackButton(){
  		this.setState({
  			active_view:!this.state.active_view,
  			btnView:false,
  			btnView2:false,
  		})
  	}
  	renderTableHeader(data){
		let category = ["rank","username","score","category"];
		let keys = [];
		let values;
		
				for (let [key1,value1] of Object.entries(data)){
					values =[];
					for (let cat of category){
						if(cat == "category"){
							values.push(<span style = {{fontWeight:"bold"}}>{value1[cat]}</span>);
						}
					}
				}
		  
		return values;
	}

	render(){
		 const {fix} = this.props;
		return(
			<div className="container-fluid" >
			<div id = "hambergar">
		        <NavbarMenu title = {"My Ranking"} />
		    </div>

		    {this.state.active_view &&
		      <div className="nav3" id='bottom-nav'>
                           <div className="nav1" style={{position: this.state.scrollingLock ? "fixed" : "relative"}}>
                           <Navbar light toggleable className="navbar nav1 user_nav">
                                <NavbarToggler className="navbar-toggler hidden-sm-up user_clndr" onClick={this.toggle1}>
                                    <div className="toggler">
                                    <FontAwesome 
                                          name = "bars"
                                          size = "1x"
                                        />
                                    </div> 
                               </NavbarToggler>
                               <span id="navlink" onClick={this.toggleCalendar} id="progress">
					                    <FontAwesome
					                    	style = {{color:"white"}}
					                        name = "calendar"
					                        size = "1x"
					                    />
	                                     <span id="navlink">
	                                      	{moment(this.state.selectedDate).format('MMM D, YYYY')}
	                                     </span>  
					            </span>

                               <Collapse className="navbar-toggleable-xs"  isOpen={this.state.isOpen1} navbar>
                                  <Nav className="nav navbar-nav float-xs-right ml-auto" navbar>
                                    <span  onClick={this.toggleDate1} id="daterange1" style={{color:"white"}}>
					                    <span className="date_range_btn">
					                        <Button
					                            className="daterange-btn btn"                            
					                            id="daterange"
					                            onClick={this.toggleDate1} >Custom Date Range1
					                        </Button>
					                    </span>
					                </span>
					                 <span  onClick={this.toggleDate2} id="daterange2" style={{color:"white"}}>
							                    <span className="date_range_btn">
							                        <Button
							                            className="daterange-btn btn"                            
							                            id="daterange"
							                            onClick={this.toggleDate2} >Custom Date Range2
							                        </Button>
							                    </span>
						                	</span>
						               <span  onClick={this.toggleDate3} id="daterange3" style={{color:"white"}}>
							                    <span className="date_range_btn">
							                        <Button
							                            className="daterange-btn btn"                            
							                            id="daterange"
							                            onClick={this.toggleDate3} >Custom Date Range3
							                        </Button>
							                    </span>
							                </span>                                                                                                                 
                                  </Nav>
                                </Collapse>    
                           </Navbar> 
                           </div>
                           </div>                                
		    }

            <Popover
            placement="bottom"
            isOpen={this.state.calendarOpen}
            target="progress"
            toggle={this.toggleCalendar}>
	              <PopoverBody className="calendar2">
	                <CalendarWidget  onDaySelect={this.processDate}/>
	              </PopoverBody>
	        </Popover>

	        <Popover
            placement="bottom"
            isOpen={this.state.dateRange1}
            target="daterange1"
            toggle={this.toggleDate1}>
                    <PopoverBody>
                        <div >
                            <Form>
	                            <div style={{paddingBottom:"12px"}} className="justify-content-center">
	                                <Label>Start Date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
	                                <Input type="date"
	                                name="lb1_start_date"
	                                value={this.state.lb1_start_date}
	                                onChange={this.handleChange} style={{height:"35px",borderRadius:"7px"}}/>
	                            </div>
	                            <div id="date" className="justify-content-center">
	                                <Label>End date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
	                                <Input type="date"
	                                name="lb1_end_date"
	                                value={this.state.lb1_end_date}
	                                onChange={this.handleChange} style={{height:"35px",borderRadius:"7px"}}/>
	                            </div>
	                            <div id="date" style={{marginTop:"12px"}} className="justify-content-center">
		                            <button
		                            id="nav-btn"
		                            style={{backgroundColor:"#ed9507"}}
		                            type="submit"
		                            className="btn btn-block-lg"
		                            onClick={this.onSubmitDate1} style={{width:"175px"}}>SUBMIT</button>
	                            </div>
                            </Form>
                        </div>
                    </PopoverBody>
                </Popover>
                 <Popover
            placement="bottom"
            isOpen={this.state.dateRange2}
            target="daterange2"
            toggle={this.toggleDate2}>
                    <PopoverBody>
                        <div >
                            <Form>
	                            <div style={{paddingBottom:"12px"}} className="justify-content-center">
	                                <Label>Start Date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
	                                <Input type="date"
	                                name="lb2_start_date"
	                                value={this.state.lb2_start_date}
	                                onChange={this.handleChange} style={{height:"35px",borderRadius:"7px"}}/>
	                            </div>
	                            <div id="date" className="justify-content-center">
	                                <Label>End date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
	                                <Input type="date"
	                                name="lb2_end_date"
	                                value={this.state.lb2_end_date}
	                                onChange={this.handleChange} style={{height:"35px",borderRadius:"7px"}}/>
	                            </div>
	                            <div id="date" style={{marginTop:"12px"}} className="justify-content-center">
		                            <button
		                            id="nav-btn"
		                            style={{backgroundColor:"#ed9507"}}
		                            type="submit"
		                            className="btn btn-block-lg"
		                            onClick={this.onSubmitDate2} style={{width:"175px"}}>SUBMIT</button>
	                            </div>
                            </Form>
                        </div>
                    </PopoverBody>
                </Popover>
                 <Popover
            placement="bottom"
            isOpen={this.state.dateRange3}
            target="daterange3"
            toggle={this.toggleDate3}>
                    <PopoverBody>
                        <div >
                            <Form>
	                            <div style={{paddingBottom:"12px"}} className="justify-content-center">
	                                <Label>Start Date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
	                                <Input type="date"
	                                name="lb3_start_date"
	                                value={this.state.lb3_start_date}
	                                onChange={this.handleChange} style={{height:"35px",borderRadius:"7px"}}/>
	                            </div>
	                            <div id="date" className="justify-content-center">
	                                <Label>End date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
	                                <Input type="date"
	                                name="lb3_end_date"
	                                value={this.state.lb3_end_date}
	                                onChange={this.handleChange} style={{height:"35px",borderRadius:"7px"}}/>
	                            </div>
	                            <div id="date" style={{marginTop:"12px"}} className="justify-content-center">
		                            <button
		                            id="nav-btn"
		                            style={{backgroundColor:"#ed9507"}}
		                            type="submit"
		                            className="btn btn-block-lg"
		                            onClick={this.onSubmitDate3} style={{width:"175px"}}>SUBMIT</button>
	                            </div>
                            </Form>
                        </div>
                    </PopoverBody>
                </Popover>
            <div className="col-sm-12 col-md-12 col-lg-12">
            {this.state.btnView &&
	           	<div>
	            	<Button className = "btn btn-info" onClick = {this.handleBackButton} style = {{marginLeft:"50px",marginTop:"10px",fontSize:"13px"}}>Back</Button>
	            </div>
            }
            {this.state.btnView2 &&
	           	<div>
	            	<Button className = "btn btn-info" onClick = {this.handleBackButton} style = {{marginLeft:"50px",marginTop:"10px",fontSize:"13px"}}>Back</Button>
	            </div>
            }
            {this.state.btnView &&
	        	<div className = "row justify-content-center">
  					<span style={{float:"center",fontSize:"17px"}}>{this.renderTableHeader(this.state.active_category)}</span>
  					{/*<span style={{float:"center",fontSize:"17px",fontWeight:"bold",marginLeft:"20px"}}>{this.state.active_day}</span>*/}
  				</div>
  			}
  			
            {this.state.active_view &&
		        <div className = "row justify-content-center lb_table_style" style = {{paddingTop:"25px"}}>
		        	<div className = "table table-responsive">
			        	{this.renderTablesTd(this.state.ranking_data.oh_gpa,this.state.duration_date)}
			        </div>
		        </div>
		    }
		    {this.state.active_view &&
		    	<div className = "row justify-content-center lb_table_style">
		        	<div className = "table table-responsive">
		        		{this.renderTablesTd(this.state.ranking_data.alcohol,this.state.duration_date)}
		        	</div>
		        </div>
		    }
		    {this.state.active_view &&
		        <div className = "row justify-content-center lb_table_style">
		        	<div className = "table table-responsive">
		        		{this.renderTablesTd(this.state.ranking_data.avg_sleep,this.state.duration_date)}
		        	</div>
		        </div>
		    }
		    {this.state.active_view &&
		        <div className = "row justify-content-center lb_table_style">
		        	<div className = "table table-responsive">
		        		{this.renderTablesTd(this.state.ranking_data.prcnt_uf,this.state.duration_date)}
		        	</div>
		        </div>
		    }
		    {this.state.active_view &&
		        <div className = "row justify-content-center lb_table_style">
		        	<div className = "table table-responsive">
		        		{this.renderTablesTd(this.state.ranking_data.total_steps,this.state.duration_date)}
		        	</div>
		        </div>
		    }
		    {this.state.active_view &&
		        <div className = "row justify-content-center lb_table_style">
		        	<div className = "table table-responsive">
		        		{this.renderTablesTd(this.state.ranking_data.mc,this.state.duration_date)}
		        	</div>
		        </div>
		    }
		    {this.state.active_view &&
		        <div className = "row justify-content-center lb_table_style">
		        	<div className = "table table-responsive">
		        		{this.renderTablesTd(this.state.ranking_data.ec,this.state.duration_date)}
		        	</div>
		        </div>
		    }
		     
		    {this.state.active_view &&
		        <div className = "row justify-content-center lb_table_style">
		        	<div className = "table table-responsive">
		        		{this.renderTablesTd(this.state.ranking_data.awake_time,this.state.duration_date)}
		        	</div>
		        </div>
		    }
		    {this.state.active_view &&
		        <div className = "row justify-content-center lb_table_style">
		        	<div className = "table table-responsive">
		        		{this.renderTablesTd(this.state.ranking_data.resting_hr,this.state.duration_date)}
		        	</div>
		        </div>
		    }
		    {this.state.active_view &&
		        <div className = "row justify-content-center lb_table_style">
		        	<div className = "table table-responsive">
		        		{this.renderTablesTd(this.state.ranking_data.deep_sleep,this.state.duration_date)}
		        	</div>
		        </div>
		    }
		    {this.state.active_view &&
		        <div className = "row justify-content-center lb_table_style">
		        	<div className = "table table-responsive">
		        		{this.renderTablesTd(this.state.ranking_data.nes,this.state.duration_date)}
		        	</div>
		        </div>
		    }
		   
		    {this.state.active_view &&
		        <div className = "row justify-content-center lb_table_style">
			        <div className = "table table-responsive">
			        	{this.renderTablesTd(this.state.ranking_data.floor_climbed,this.state.duration_date)}
			        </div>
		        </div>
		    }
		    {this.state.active_view &&
		        <div className = "row justify-content-center lb_table_style">
			        <div className = "table table-responsive">
			        	{this.renderTablesTd(this.state.ranking_data.beat_lowered,this.state.duration_date)}
			        </div>
		        </div>
		    }
		    {this.state.active_view &&
		        <div className = "row justify-content-center lb_table_style">
			        <div className = "table table-responsive">
			        	{this.renderTablesTd(this.state.ranking_data.pure_beat_lowered,this.state.duration_date)}
			        </div>
		        </div>
		    }
		     {this.state.active_view &&
		        <div className = "row justify-content-center lb_table_style">
			        <div className = "table table-responsive">
			        	{this.renderTablesTd(this.state.ranking_data.pure_time_99,this.state.duration_date)}
			        </div>
		        </div>
		    }
		    {this.state.active_view &&
		        <div className = "row justify-content-center lb_table_style">
			        <div className = "table table-responsive">
			        	{this.renderTablesTd(this.state.ranking_data.time_99,this.state.duration_date)}
			        </div>
		        </div>
		    }
		    
		    {this.state.active_view &&
		        <div className = "row justify-content-center lb_table_style">
			        <div className = "table table-responsive">
			        	{this.renderOverallHrrTable(this.state.Hrr_ranking_data,this.state.duration_date)}
			        </div>
		        </div>
		    }
			{/*****************************/}
			{this.state.active_view &&
		        <div className = "row justify-content-center lb_table_style">
			        <div className = "table table-responsive">
			        	{this.renderTablesTd(this.state.ranking_data.active_min_total,this.state.duration_date) == null?"Not Reported":this.renderTablesTd(this.state.ranking_data.active_min_total,this.state.duration_date)}
			        </div>
		        </div>
		    }
		    {this.state.active_view &&
		        <div className = "row justify-content-center lb_table_style">
			        <div className = "table table-responsive">
			        	{this.renderTablesTd(this.state.ranking_data.active_min_exclude_sleep,this.state.duration_date)}
			        </div>
		        </div>
		    }
		    
		    {this.state.active_view &&
		        <div className = "row justify-content-center lb_table_style">
			        <div className = "table table-responsive">
			        	{this.renderTablesTd(this.state.ranking_data.active_min_exclude_sleep_exercise,this.state.duration_date)}
			        </div>
		        </div>
		    }
			{/****************************/}
	      	{this.state.btnView && 
		        <AllRank_Data1 data={this.state.active_category} 
		        active_username = {this.state.active_username} 
		        active_category_name = {this.state.active_category_name}
		        all_verbose_name = {this.state.all_verbose_name}/>
		  	}
			{this.state.btnView2 &&
		  		<HrrLeaderboard Hrr_data = {this.state.all_hrr_rank_data}
	  							Hrr_username = {this.state.Hrr_username}/>
			}
	        </div>
	        {this.renderLeaderBoardFetchOverlay()}
			{this.renderLeaderBoard2FetchOverlay()}
			{this.renderLeaderBoard3FetchOverlay()}
			{this.renderLeaderBoardSelectedDateFetchOverlay()}
	        </div>
		)
	}
	
}

export default LeaderBoard1;
