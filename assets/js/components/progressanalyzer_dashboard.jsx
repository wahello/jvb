import React,{ Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {connect} from 'react-redux';
import FontAwesome from "react-fontawesome";
import { Collapse, Navbar, NavbarToggler, 
         NavbarBrand, Nav, NavItem, NavLink,
        Button,Popover,PopoverBody,Form,FormGroup,FormText,Label,
        Input,Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Card, CardImg, CardText, 
        CardBody,CardTitle, CardSubtitle} from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import NavbarMenu from './navbar';
import Dimensions from 'react-dimensions';
import { StyleSheet, css } from 'aphrodite';
import html2canvas from 'html2canvas';
import fetchProgress,{fetchUserRank,progressAnalyzerUpdateTime} from '../network/progress';
import AllRank_Data1 from "./leader_all_exp";
import {renderProgressFetchOverlay,renderProgress2FetchOverlay,renderProgress3FetchOverlay,renderProgressSelectedDateFetchOverlay    } from './dashboard_healpers';

var CalendarWidget = require('react-calendar-widget');  

var ReactDOM = require('react-dom');

import { getGarminToken,logoutUser} from '../network/auth';
const catagory = ["oh_gpa","alcohol","avg_sleep","prcnt_uf","nes","mc","ec","resting_hr",
"beat_lowered","pure_beat_lowered","pure_time_99","time_99",];
const duration = ["week","today","yesterday","year","month","custom_range"];

class ProgressDashboard extends Component{
	constructor(props){
		super(props);
		let rankInitialState = {}
    for (let catg of catagory){
        let catInitialState = {}
        for(let dur of duration){
          let userRank = {
            'user_rank':{
              category:'',
              rank:'Getting Ranks...',
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
		this.state = {
			 selectedDate: new Date(),
			 cr1_start_date:'',
        	 cr1_end_date:'',
        	 cr2_start_date:'',
        	 cr2_end_date:'',
        	 cr3_start_date:'',
        	 cr3_end_date:'',
			 calendarOpen:false,
			 isOpen1:false,
			 dateRange1:false,
			 dateRange2:false,
			 dateRange3:false,
			 fetching_ql4:false,
			 scrollingLock:false,
			 dropdownOpen1:false,
			 active_view:true,
			 btnView:false,
			 rankData:rankInitialState,
			 summary:{
            "overall_health":{
               "overall_health_gpa":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                       "custom_range":"-",
                        "today":"-",
                        "year":"-"
                     },
                 "overall_health_gpa_grade":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                       "custom_range":"-",
                        "today":"-",
                        "year":"-"

                     },
                 "total_gpa_point":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                       "custom_range":"-",
                        "today":"-",
                        "year":"-"
                     }
                },

            "ec":{
                 "avg_no_of_days_exercises_per_week":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                       "custom_range":"-",
                        "today":"-",
                        "year":"-"
                     },
                  "exercise_consistency_grade":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                       "custom_range":"-",
                        "today":"-",
                        "year":"-"
                     },
                   "exercise_consistency_gpa":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                       "custom_range":"-",
                        "today":"-",
                        "year":"-"
                     }
                 },
                "nutrition":{
                   "prcnt_unprocessed_food_gpa":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                       "custom_range":"-",
                        "today":"-",
                        "year":"-"
                     },
                 "prcnt_unprocessed_food_grade":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                       "custom_range":"-",
                        "today":"-",
                        "year":"-"
                     },
                  "prcnt_unprocessed_volume_of_food":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                       "custom_range":"-",
                        "today":"-",
                        "year":"-"
                     }

                  },
            "mc":{
                "movement_consistency_gpa":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                       "custom_range":"-",
                        "today":"-",
                        "year":"-"
                     },
                     "movement_consistency_grade":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                       "custom_range":"-",
                        "today":"-",
                        "year":"-"
                     },
                     "movement_consistency_score":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                       "custom_range":"-",
                        "today":"-",
                        "year":"-"
                     }
                  },
            "non_exercise":{
                 "non_exericse_steps_gpa":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                       "custom_range":"-",
                        "today":"-",
                        "year":"-"
                     },
                 "movement_non_exercise_step_grade":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                       "custom_range":"-",
                        "today":"-",
                        "year":"-"
                     },
                 "non_exercise_steps":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                       "custom_range":"-",
                        "today":"-",
                        "year":"-"
                     },
                "total_steps":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                       "custom_range":"-",
                        "today":"-",
                        "year":"-"
                     },     
            },
        "exercise":{                
            "workout_duration_hours_min":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                       "custom_range":"-",
                        "today":"-",
                        "year":"-"
                     }, 
                "avg_exercise_heart_rate":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                       "custom_range":"-",
                        "today":"-",
                        "year":"-"
                     },                                      
                "workout_effort_level":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                       "custom_range":"-",
                        "today":"-",
                        "year":"-"
                     },
                      "vo2_max":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                       "custom_range":"-",
                        "today":"-",
                        "year":"-"
                     }               
                },
         "sleep": {
             "prcnt_days_sleep_aid_taken_in_period": {
                "custom_range": "-",
                "year": "-",
                "yesterday": "-",
                "month": "-",
                "today":"-" ,
                "week":"-" 
            },
            "average_sleep_grade": {
                "week": "-",
                "yesterday": "-",
                "month": "-",
               "custom_range":"-",
                "today": "-",
                "year": "-"
            },
            "total_sleep_in_hours_min": {
                "week": "-",
                "yesterday": "-",
                "month": "-",
               "custom_range":"-",
                "today": "-",
                "year": "-"
            },
            "overall_sleep_gpa": {
                "week": "-",
                "yesterday": "-",
                "month": "-",
               "custom_range":"-",
                "today": "-",
                "year": "-"
            },
             "num_days_sleep_aid_taken_in_period": {
                "week": "-",
                "yesterday": "-",
                "month": "-",
               "custom_range":"-",
                "today": "-",
                "year": "-"
            }
        },
         "alcohol": {
            "alcoholic_drinks_per_week_grade": {
                "week": "-",
                "yesterday": "-",
                "month": "-",
                "custom_range":"-",
                "today": "-",
                "year": "-"
            },
            "avg_drink_per_week": {
                "week": "-",
                "yesterday": "-",
                "month": "-",
                "custom_range": "-",
                "today": "-",
                "year": "-"
            },
            "alcoholic_drinks_per_week_gpa": {
               "week": "-",
                "yesterday": "-",
                "month": "-",
               "custom_range":"-",
                "today": "-",
                "year": "-"
            },
            "prcnt_alcohol_consumption_reported":{
                "week": "-",
                "yesterday": "-",
                "month": "-",
               "custom_range":"-",
                "today": "-",
                "year": "-"
            }
        },
         "other": {
            "hrr_beats_lowered_in_first_min": {
                "week": "-",
                "yesterday": "-",
                "month": "-",
               "custom_range":"-",
                "today": "-",
                "year": "-"
            },
            "hrr_highest_hr_in_first_min": {
                "week": "-",
                "yesterday": "-",
                "month": "-",
               "custom_range":"-",
                "today": "-",
                "year": "-"
            },
            "hrr_lowest_hr_point": {
               "week": "-",
                "yesterday": "-",
                "month": "-",
               "custom_range":"-",
                "today": "-",
                "year": "-"
            },
            "floors_climbed": {
               "week": "-",
                "yesterday": "-",
                "month": "-",
               "custom_range":"-",
                "today": "-",
                "year": "-"
            },
            "resting_hr": {
               "week": "-",
                "yesterday": "-",
                "month": "-",
                "custom_range": "-",
                "today": "-",
                "year": "-"
            },
            "hrr_time_to_99": {
               "week": "-",
                "yesterday": "-",
                "month": "-",
               "custom_range":"-",
                "today": "-",
                "year": "-"
            },
            "hrr_pure_1_minute_beat_lowered": {
               "week": "-",
                "yesterday": "-",
                "month": "-",
               "custom_range":"-",
                "today": "-",
                "year": "-"
            },
             "hrr_pure_time_to_99": {
               "week": "-",
                "yesterday": "-",
                "month": "-",
               "custom_range":"-",
                "today": "-",
                "year": "-"
            }
        },
        "sick":{
          "days_sick_not_sick_reported":{
                "week": "-",
                "yesterday": "-",
                "month": "-",
               "custom_range":"-",
                "today": "-",
                "year": "-"
          },
          "number_of_days_not_sick":{
                "week": "-",
                "yesterday": "-",
                "month": "-",
               "custom_range":"-",
                "today": "-",
                "year": "-"
          },
          "number_of_days_sick":{
               "week": "-",
                "yesterday": "-",
                "month": "-",
               "custom_range":"-",
                "today": "-",
                "year": "-"
          },
          "prcnt_of_days_not_sick":{
                "week": "-",
                "yesterday": "-",
                "month": "-",
               "custom_range":"-",
                "today": "-",
                "year": "-"
          },
          "prcnt_of_days_sick":{
                "week": "-",
                "yesterday": "-",
                "month": "-",
               "custom_range":"-",
                "today": "-",
                "year": "-",
        }
      },
        "stress":{
          "days_stress_level_reported":{
                "week": "-",
                "yesterday": "-",
                "month": "-",
               "custom_range":"-",
                "today": "-",
                "year": "-"
          },
          "number_of_days_high_stress_reported":{
                "week": "-",
                "yesterday": "-",
                "month": "-",
               "custom_range":"-",
                "today": "-",
                "year": "-"
          },
          "number_of_days_low_stress_reported":{
                "week": "-",
                "yesterday": "-",
                "month": "-",
               "custom_range":"-",
                "today": "-",
                "year": "-"
          },
          "number_of_days_medium_stress_reported":{
              "week": "-",
                "yesterday": "-",
                "month": "-",
               "custom_range":"-",
                "today": "-",
                "year": "-"
          },
          "prcnt_of_days_high_stress":{
              "week": "-",
                "yesterday": "-",
                "month": "-",
               "custom_range":"-",
                "today": "-",
                "year": "-"
          },
          "prcnt_of_days_low_stress":{
              "week": "-",
                "yesterday": "-",
                "month": "-",
               "custom_range":"-",
                "today": "-",
                "year": "-"
          },
          "prcnt_of_days_medium_stress":{
                "week": "-",
                "yesterday": "-",
                "month": "-",
                 "custom_range":"-",
                  "today": "-",
                  "year": "-"
          }
        },
        "standing":{
          "number_days_reported_stood_not_stood_three_hours":{
                "week": "-",
                "yesterday": "-",
                "month": "-",
                "custom_range":"-",
                "today": "-",
                "year": "-"
          },
          "number_days_stood_three_hours":{
                "week": "-",
                "yesterday": "-",
                "month": "-",
                "custom_range":"-",
                "today": "-",
                "year": "-"
          },
          "prcnt_days_stood_three_hours":{
                "week": "-",
                "yesterday": "-",
                "month": "-",
                "custom_range":"-",
                "today": "-",
                "year": "-",
          }

        },
        "travel":{
          "number_days_travel_away_from_home":{
                "week": "-",
                "yesterday": "-",
                "month": "-",
                "custom_range":"-",
                "today": "-",
                "year": "-"
          },
          "prcnt_days_travel_away_from_home":{
                "week": "-",
                "yesterday": "-",
                "month": "-",
                "custom_range":"-",
                "today": "-",
                "year": "-",
          	}
        },
 	 	},
			"duration_date": {
	           "month": "-",
	           "year": "-",
	           "week": "-",
	           "today": "-",
	           "yesterday": "-"
	       	},
	       	selected_range:"today",
	       	date:"",
			capt:"",
			active_category:"",
        	active_username:"",
        	active_category_name:"",
        	all_verbose_name:"",
		};
		this.successProgress = this.successProgress.bind(this);
		this.successRank = this.successRank.bind(this);
		this.headerDates = this.headerDates.bind(this);
    	this.errorProgress = this.errorProgress.bind(this);
    	this.toggleCalendar=this.toggleCalendar.bind(this);
    	this.toggleDate1 = this.toggleDate1.bind(this);
   		this.toggleDate2 = this.toggleDate2.bind(this);
   		this.toggleDate3 = this.toggleDate3.bind(this);
   		this.handleChange = this.handleChange.bind(this);
   		this.createExcelPrintURL = this.createExcelPrintURL.bind(this);
   		this.toggleDropdown = this.toggleDropdown.bind(this);
   		this.onSubmitDate1 = this.onSubmitDate1.bind(this);
   		this.onSubmitDate2 = this.onSubmitDate2.bind(this);
   		this.onSubmitDate3 = this.onSubmitDate3.bind(this);
   		this.processDate = this.processDate.bind(this);
   		this.strToSecond = this.strToSecond.bind(this);
   		this.handleScroll = this.handleScroll.bind(this);
   		this.renderDateRangeDropdown = this.renderDateRangeDropdown.bind(this);
   		this.renderProgressSelectedDateFetchOverlay = renderProgressSelectedDateFetchOverlay.bind(this);
   		this.toggle = this.toggle.bind(this);
   		this.renderOverallHealth = this.renderOverallHealth.bind(this);
   		this.renderMcs = this.renderMcs.bind(this);
   		this.renderNonExerciseSteps = this.renderNonExerciseSteps.bind(this);
   		this.renderNutrition = this.renderNutrition.bind(this);
   		this.renderAlcohol = this.renderAlcohol.bind(this);
   		this.renderEc = this.renderEc.bind(this);
   		this.renderExerciseStats = this.renderExerciseStats.bind(this);
   		this.renderOther = this.renderOther.bind(this);
   		this.renderSleep = this.renderSleep.bind(this);
   		this.renderSick = this.renderSick.bind(this);
   		this.renderStress = this.renderStress.bind(this);
   		this.renderStanding = this.renderStanding.bind(this);
   		this.renderTravel = this.renderTravel.bind(this);
   		this.gpascoreDecimal = this.gpascoreDecimal.bind(this);
   		this.renderComma = this.renderComma.bind(this);
   		this.exerciseStatsNoWorkOut = this.exerciseStatsNoWorkOut.bind(this);
   		this.vo2MaxNotReported = this.vo2MaxNotReported.bind(this);
   		this.renderPercent = this.renderPercent.bind(this);
   		this.renderRank = this.renderRank.bind(this);
   		this.handleBackButton = this.handleBackButton.bind(this);
   		this.getStylesForGrades = this.getStylesForGrades.bind(this);
   		this.getStylesForGpa = this.getStylesForGpa.bind(this);
   		this.getStylesForsteps = this.getStylesForsteps.bind(this);
   		this.getStylesForSleep = this.getStylesForSleep.bind(this);
   		this.getStylesForBeats = this.getStylesForBeats.bind(this);
   		this.getStylesForRhr = this.getStylesForRhr.bind(this);
   		this.getStylesForFood = this.getStylesForFood.bind(this);

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
	gpascoreDecimal(gpa){
		let value;
		let x = gpa;
		if( x !=  null && x != undefined && x != "Not Reported"){
		    value =parseFloat(x).toFixed(2);
		 }
		 else if(x == "Not Reported"){
		  value = x;
		 }
		 else{
		  value = "";
		 }
		return value;
	}
	 strToSecond(value){
    	let time = value.split(':');
    	let hours = parseInt(time[0])*3600;
    	let min = parseInt(time[1])*60;
    	let s_time = hours + min;
    	return s_time;
	}
	renderComma(value){
		let steps = '';
		if(value){
			value += '';
	     	var x = value.split('.');
	    	var x1 = x[0];
	        var x2 = x.length > 1 ? '.' + x[1] : '';
	        var rgx = /(\d+)(\d{3})/;
	        while (rgx.test(x1)) {
	        	x1 = x1.replace(rgx, '$1' + ',' + '$2');
	        }
	        steps = x1 + x2;
    	}
        return steps;
	}
	exerciseStatsNoWorkOut(value){
      	if(value == undefined || value == 0 || value == "" || value == "00:00"){
        	value = "No Workout"
      	}
      	else{
        	value = value
      	}
    	return value;
	}
	vo2MaxNotReported(value){
      	if(value == undefined || value == 0 || value == "" || value == "00:00"){
        	value = "Not Provided"
      	}
      	else{
        	value = value
      	}
    	return value;
	}
	renderPercent(value){
		let percent ='';
		if(value != null || value != undefined){
			percent = value +" "+ '%';
		}
		else{
			percent = value;
		}
		return percent;
	}
	successRank(data){
	    this.setState({
	        fetching_ql4:false,
	        rankData:data.data,
	      //  duration_date:data.data.duration_date,
	    });
  	}

	successProgress(data){
		let date =moment(data.data.duration_date["today"]).format("MMM DD, YYYY"); 
	    this.setState({
	    	fetching_ql4:false,
	        report_date:data.data.report_date,
	        summary:data.data.summary,
	        duration_date:data.data.duration_date,
	        capt:"Today",
	        date:date,

	    });
  	}
  	errorProgress(error){
       console.log(error.message);
       this.setState({
       		fetching_ql4:false
       })
    }
	handleChange(event){
      	const target = event.target;
      	const value = target.value;
      	const name = target.name;
      	this.setState({
        	[name]: value
      	});
    }
    toggle(){
		this.setState({
			dropdownOpen1:!this.state.dropdownOpen1
		})
	}
	toggleCalendar(){
	    this.setState({
      		calendarOpen:!this.state.calendarOpen
	    });
  	}
  	toggle1() {
      this.setState({
        isOpen1: !this.state.isOpen1,
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
   	toggleDropdown() {
	    this.setState({
      		dropdownOpen: !this.state.dropdownOpen
	    });
	}
	processDate(selectedDate){ 
	    this.setState({
	      fetching_ql4:true,
	      selectedDate: selectedDate,
	      calendarOpen:!this.state.calendarOpen,
	      selected_range:"today",                              
	    },()=>{
	      fetchProgress(this.successProgress,this.errorProgress,this.state.selectedDate);
	      fetchUserRank(this.successRank,this.errorProgress,this.state.selectedDate);
	    });
  	}
  	 componentDidMount(){
      this.setState({
         fetching_ql4:true,     
       },()=>{
       	fetchProgress(this.successProgress,this.errorProgress,this.state.selectedDate);
       	fetchUserRank(this.successRank,this.errorProgress,this.state.selectedDate,true);
       });
      window.addEventListener('scroll', this.handleScroll);
      //progressAnalyzerUpdateTime(this.successUpdateTime,this.errorUpdateTime);

    }
    componentWillUnmount() {
      	window.removeEventListener('scroll', this.handleScroll);
    }
    handleScroll() {
      if (window.scrollY >= 150 && !this.state.scrollingLock) {
        this.setState({
          scrollingLock: true
        });
      } else if(window.scrollY < 100 && this.state.scrollingLock) {                                               
        this.setState({
          scrollingLock: false
        });
      }
  	}
   	createExcelPrintURL(){
    	// code
	    let custom_ranges = [];
	    let selected_date = moment(this.state.selectedDate).format("YYYY-MM-DD");
	    if(this.state.cr1_start_date && this.state.cr1_end_date){
	        custom_ranges.push(this.state.cr1_start_date);
	        custom_ranges.push(this.state.cr1_end_date);
	    }

	    if(this.state.cr2_start_date && this.state.cr2_end_date){
	        custom_ranges.push(this.state.cr2_start_date);
	        custom_ranges.push(this.state.cr2_end_date);
	    }
	     if(this.state.cr3_start_date && this.state.cr3_end_date){
	        custom_ranges.push(this.state.cr3_start_date);
	        custom_ranges.push(this.state.cr3_end_date);
	    }
	    custom_ranges = (custom_ranges && custom_ranges.length) ? custom_ranges.toString():'';
	    let excelURL = `progress/print/progress/excel?date=${selected_date}&&custom_ranges=${custom_ranges}`;
	    return excelURL;
	}
	onSubmitDate1(event){
    event.preventDefault();
    this.setState({
      dateRange1:!this.state.dateRange1,
      fetching_ql1:true,
      isOpen1: !this.state.isOpen1,

    },()=>{
        let custom_ranges = [];
        if(this.state.cr2_start_date && this.state.cr2_end_date){
            custom_ranges.push(this.state.cr2_start_date);
            custom_ranges.push(this.state.cr2_end_date);
        }
         if(this.state.cr3_start_date && this.state.cr3_end_date){
            custom_ranges.push(this.state.cr3_start_date);
            custom_ranges.push(this.state.cr3_end_date);
        }
        custom_ranges.push(this.state.cr1_start_date);
        custom_ranges.push(this.state.cr1_end_date);
      fetchProgress(this.successProgress,this.errorProgress,this.state.selectedDate,custom_ranges);
      fetchUserRank(this.successRank,this.errorProgress,this.state.selectedDate,custom_ranges);

    });
  }
 onSubmitDate2(event){
    event.preventDefault();
    this.setState({
      dateRange2:!this.state.dateRange2,
      fetching_ql2:true,
      isOpen1: !this.state.isOpen1,

    },()=>{
         let custom_ranges = [];
        if(this.state.cr1_start_date && this.state.cr1_end_date){
            custom_ranges.push(this.state.cr1_start_date);
            custom_ranges.push(this.state.cr1_end_date);
        }
         if(this.state.cr3_start_date && this.state.cr3_end_date){
            custom_ranges.push(this.state.cr3_start_date);
            custom_ranges.push(this.state.cr3_end_date);
        }

        custom_ranges.push(this.state.cr2_start_date);
        custom_ranges.push(this.state.cr2_end_date);
      fetchProgress(this.successProgress,this.errorProgress,this.state.selectedDate,custom_ranges);
      fetchUserRank(this.successRank,this.errorProgress,this.state.selectedDate,custom_ranges);

    });
  }
 onSubmitDate3(event){
    event.preventDefault();
    this.setState({
      dateRange3:!this.state.dateRange3,
      fetching_ql3:true,
      isOpen1: !this.state.isOpen1,

    },()=>{
         let custom_ranges = [];
         if(this.state.cr1_start_date && this.state.cr1_end_date){
            custom_ranges.push(this.state.cr1_start_date);
            custom_ranges.push(this.state.cr1_end_date);
        }
        if(this.state.cr2_start_date && this.state.cr2_end_date){
            custom_ranges.push(this.state.cr2_start_date);
            custom_ranges.push(this.state.cr2_end_date);
        }
        custom_ranges.push(this.state.cr3_start_date);
        custom_ranges.push(this.state.cr3_end_date);
      fetchProgress(this.successProgress,this.errorProgress,this.state.selectedDate,custom_ranges);
      fetchUserRank(this.successRank,this.errorProgress,this.state.selectedDate,custom_ranges);

    });
  }
  	renderDateRangeDropdown(value,value5){
  		let duration_type = ["today","yesterday","week","month","year","custom_range"];
  		let duration_type1 = ["today","yesterday","week","month","year",];
  		let durations = [];
  		for(let [key,value1] of Object.entries(value)){
  			if(key == "overall_health"){
	  			for(let [key1,value2] of Object.entries(value1)){
	  				if(key1 == "overall_health_gpa"){
		  				for(let duration of duration_type){
		  					let val = value2[duration];
		  					if(duration == "custom_range" && val){
		  						for(let [range,value3] of Object.entries(val)){
		  							duration_type1.push(range);
		  						}
		  					}
		  				}
		  			}
	  			}
	  		}
  		}
  
  		let date;
	  	let tableHeaders = [];
	  	for(let dur of duration_type1){
	  		let rank;
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
	  			date = this.headerDates(dur);
	  			capt = "";
	  			

	  		}

  			tableHeaders.push(
  			 <DropdownItem>
  			 <a className="dropdown-item" 
	  			onClick = {this.reanderAllHrr.bind(this,dur,date,capt)}
	  			style = {{fontSize:"13px"}}>
	  			{capt}<br/>{date}
  			</a></DropdownItem>);
	  	}
	  return tableHeaders;	
  	}
  	reanderAllHrr(period,date,capt){
  		this.setState({
  			selected_range:period,
  			date:date,
  			capt:capt,
  		});
  	}
  	renderRank(value,dur){
  		let rank = '';
  		let all_rank_data = '';
  		let userName = '';
  		let category = '';
  		let verbose_name = '';
  		if(dur && dur != "today" && dur != "month" &&
  			dur != "yesterday" && dur != "week" && dur != "year"){
  			rank = value['custom_range'][dur].user_rank.rank;
  			all_rank_data = value['custom_range'][dur].all_rank;
  			userName = value['custom_range'][dur].user_rank.username;
  			category = value['custom_range'][dur].user_rank.category;
  			if(category == "Percent Unprocessed Food" || category == "Average Sleep"){
  				verbose_name = value['custom_range'][dur].user_rank.score.verbose_name;
  			}
  		}
  		else{
  			rank = value[dur].user_rank.rank;
  			all_rank_data = value[dur].all_rank;
  			userName = value[dur].user_rank.username;
  			category = value[dur].user_rank.category;
  			if(category == "Percent Unprocessed Food" || category == "Average Sleep"){
  				verbose_name = value[dur].user_rank.score.verbose_name;
  			}
  		}
  		let code = <a onClick = {this.renderAllRank.bind(this,all_rank_data,userName,category,verbose_name)}>
						         		<span style={{textDecoration:"underline"}}>{rank}</span>
					         			 	<span id="lbfontawesome">
					                          	<FontAwesome
					                            className = "fantawesome_style"
					                              name = "external-link"
					                              size = "1x"
					                          	/>
				                       		</span> 
						         		</a>
 		return code;
  	}
  	getStylesForGrades(score){
		let background = "";
		let color = "";
		let hr_background = "";
		if(score){
			if (score == "A"){
	        	background = 'green';
	           	color = 'white';
	           	hr_background = 'white';
	      	}
	      	 else if(score == "B"){
                background = '#32CD32';
                color = 'white';
                hr_background = 'white';
            }
	      	else if (score == "C"){
	    	 	background = '#FFFF01';
	            color = 'black';
	            hr_background = 'black';
	  		}
	  		else if(score == "D"){
                background = '#E26B0A';
                color = 'black';
                hr_background = 'black';
            }
	      	else if (score == "F"){
	        	background = '#FF0101';
	            color = 'black';
	            hr_background = 'black';
	      	}  	
	    }
	   	else{
	        	score = "Not Reported"
	            background = 'white';
	            color = '#5e5e5e';
	            hr_background = '#e5e5e5';
        }
		var model = <div  style = {{background:background, color:color}}>
						{score}
					</div>
		return model;
      
    }
    getStylesForGpa(score){
		let background = "";
		let color = "";
		let hr_background = "";
		if(score || score == 0){
		var score = parseFloat(score); 
	            if(score >= "3.4"){
	               	background = 'green';
	               	color = 'white';
	               	hr_background = 'white';
	            }
	            else if(score >= "3" && score < "3.4"){
	                background = '#32CD32';
	                color = 'white';
	                hr_background = 'white';
	            }
	            else if(score >= "2" && score < "3"){
	                background = '#FFFF01';
	                color = 'black';
	                hr_background = 'black';
	            }
	            else if(score >= "1" && score < "2"){
	                background = '#E26B0A';
	                color = 'black';
	                hr_background = 'black';
	            }
	            else if(score < "1"){
	                background = '#FF0101';
	                color = 'black';
	                hr_background = 'black';
	            }
        	
        	
		}
		else{
				score = "Not Reported"
	            background = 'white';
	            color = '#5e5e5e';
	            hr_background = '#E5E5E5';
        }
		var model = <div  style = {{background:background, color:color}}>
						{this.gpascoreDecimal(score)}
					</div>
		return model;
      
    }
    getStylesForsteps(score){
		let background = "";
		let color = "";
		let hr_background = "";
		if(score || score == 0){
	            if(score >= 10000){
	           		background = 'green';
	               	color = 'white';
	               	hr_background = 'white';
	            }
	            else if(score >= 7500 && score < 10000){
	                background = '#32CD32';
	                color = 'white';
	                hr_background = 'white';
	            }
	            else if(score >= 5000 && score < 7500){
	                background = '#FFFF01';
	                color = 'black';
	                hr_background = 'black';
	            }
	            else if(score >= 3500 && score < 5000){
	                background = '#E26B0A';
	                color = 'black';
	                hr_background = 'black';
	            }
	            else if(score >= 0 && score < 3500){
	                background = '#FF0101';
	                color = 'black';
	                hr_background = 'black';
	            }
        }
       else{
	        	score = "No Data Yet"
	            background = 'white';
	            color = '#5e5e5e';
	            hr_background = '#e5e5e5';
        }
		var model = <div  style = {{background:background, color:color}}>
						{this.renderComma(score)}
					</div>
		return model;
      
    }
     getStylesForSleep(value){
		let background = "";
		let color = "";
		let hr_background = "";
		let score;
		if(value){
		 score = value;
		}
		else{
			score = "No Data Yet";
            background = 'white';
            color = '#5e5e5e';
            hr_background = '#E5E5E5';
        }
			if(value){
				value = this.strToSecond(value);
				if(value < this.strToSecond("6:00") || value > this.strToSecond("12:00")){
					 	background = '#FF0101';
		                color = 'black';
		                hr_background = 'black';
		        }
				else if(this.strToSecond("7:30") <= value && value <= this.strToSecond("10:00")){
						background = 'green';
			            color = 'white';
			            hr_background = 'white';
			    }
		    	else if((this.strToSecond("7:00")<=value && value<= this.strToSecond("7:29"))
		    	 || (this.strToSecond("10:01")<=value && value<=this.strToSecond("10:30"))){
		    		 	background = '#32CD32';
		                color = 'white';
		                hr_background = 'white';
		    	}	
		    	else if((this.strToSecond("6:30")<=value && value<=this.strToSecond("6:59"))
		    	 || (this.strToSecond("10:31")<= value && value<=this.strToSecond("11:00"))){
		    		 	background = '#FFFF01';
		                color = 'black';
		                hr_background = 'black';
		        }
		    	else if((this.strToSecond("06:00")<=value && value<= this.strToSecond("6:29"))
		    	 || (this.strToSecond("11:00")<=value && value<= this.strToSecond("12:00"))){
		    		 	background = '#E26B0A';
		                color = 'black';
		                hr_background = 'black';
		    	}
	    	}
 
       else{
	        	score = "No Data Yet"
	            background = 'white';
	            color = '#5e5e5e';
	            hr_background = '#e5e5e5';
        }
		var model = <div  style = {{background:background, color:color}}>
						{score}
					</div>
		return model;
      
    }
  	renderOverallHealth(value,dur,rank){
  		let overall_health_gpa = '';
  		let overall_health_gpa_grade = '';
  		let overall_health_rank = '';
  		let total_gpa_point = '';
  		if(dur && dur != "today" && dur != "month" &&
  			dur != "yesterday" && dur != "week" && dur != "year"){
  			overall_health_gpa = value.overall_health_gpa['custom_range'][dur].data;
  			overall_health_gpa_grade = value.overall_health_gpa_grade['custom_range'][dur].data;
  			overall_health_rank  = rank['custom_range'][dur].user_rank.rank;
  			total_gpa_point = value.total_gpa_point['custom_range'][dur].data;	
  		}
  		else{
  			overall_health_gpa = value.overall_health_gpa[dur];
  			overall_health_gpa_grade = value.overall_health_gpa_grade[dur];
  			overall_health_rank = rank[dur].user_rank.rank;
  			total_gpa_point = value.total_gpa_point[dur];	
  		}
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style" style = {{fontWeight:"bold"}}>Overall Health Grade</CardTitle>
			          		<hr 
			          			
			          			/>
			          		<CardText>
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						          		Total GPA Points
		          					</div>
		          					<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						          		{ total_gpa_point }
		          					</div>
		          				</div>
		          				<hr 
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Overall Health GPA
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{ this.getStylesForGpa(overall_health_gpa) }
						         	</div>
						        </div>
				          		<hr 
	          						
          						/>
          						 <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Rank against other users
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.renderRank(this.state.rankData.oh_gpa,this.state.selected_range)}
						         	</div>
						        </div>
				          		<hr/>
          						<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Overall Health GPA Grade
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{this.getStylesForGrades(overall_health_gpa_grade) }
					          		</div>
					          	</div>
			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
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
  	handleBackButton(){
      this.setState({
        active_view:!this.state.active_view,
        btnView:false
      })
    }
  	renderMcs(value,dur,rank){
  		let movement_consistency_score = '';
  		let movement_consistency_grade = '';
  		let movement_consistency_gpa = '';
  		if(dur && dur != "today" && dur != "month" &&
  			dur != "yesterday" && dur != "week" && dur != "year"){
  			movement_consistency_score = value.movement_consistency_score['custom_range'][dur].data;
  			movement_consistency_grade = value.movement_consistency_grade['custom_range'][dur].data;
  			movement_consistency_gpa = value.movement_consistency_gpa['custom_range'][dur].data;
  		}
  		else{
  			movement_consistency_score = value.movement_consistency_score[dur];
  			movement_consistency_grade = value.movement_consistency_grade[dur];
  			movement_consistency_gpa = value.movement_consistency_gpa[dur];
  		}
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style"
			          		 style = {{fontWeight:"bold"}}>
			          		 	Movement Consistency
			          		 </CardTitle>
			          		<hr  
			          			
			          			/>
			          		<CardText>
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						          		Movement Consistency Score
		          					</div>
		          					<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						          		{ movement_consistency_score }
		          					</div>
		          				</div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Movement Consistency Grade
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.getStylesForGrades(movement_consistency_grade) }
						         	</div>
						        </div>
						        <hr  
	          						
          						/>
          						 <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Rank against other users
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">						         		
						         		{this.renderRank(this.state.rankData.mc,this.state.selected_range)}
						         	</div>
						        </div>
				          		<hr  
	          						
          						/>
          						<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Movement Consistency GPA
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{this.getStylesForGpa(movement_consistency_gpa) }
					          		</div>
					          	</div>
			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
  	}
  	renderNonExerciseSteps(value,dur,rank){
  		let non_exercise_steps = '';
  		let movement_non_exercise_step_grade = '';
  		let non_exericse_steps_gpa = '';
  		let total_steps = '';
  		
  		if(dur && dur != "today" && dur != "month" &&
  			dur != "yesterday" && dur != "week" && dur != "year"){
  			non_exercise_steps = value.non_exercise_steps['custom_range'][dur].data;
  			movement_non_exercise_step_grade = value.movement_non_exercise_step_grade['custom_range'][dur].data;
  			non_exericse_steps_gpa = value.non_exericse_steps_gpa['custom_range'][dur].data;
  			total_steps = value.total_steps['custom_range'][dur].data;
  		}
  		else{
  			non_exercise_steps = value.non_exercise_steps[dur];
  			movement_non_exercise_step_grade = value.movement_non_exercise_step_grade[dur];
  			non_exericse_steps_gpa = value.non_exericse_steps_gpa[dur];
  			total_steps = value.total_steps[dur];
  		}
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style" style = {{fontWeight:"bold"}}>Non Exercise Steps</CardTitle>
			          		<hr  
			          			
			          			/>
			          		<CardText>
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						          		Non Exercise Steps
		          					</div>
		          					<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						          		{ this.getStylesForsteps(non_exercise_steps) }
		          					</div>
		          				</div>
		          				 <hr  
	          						
          						/>
          						 <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Rank against other users
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.renderRank(this.state.rankData.nes,this.state.selected_range)}
						         	</div>
						        </div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-9 col-sm-9 col-lg-9 text_center1">
						         		Movement-Non Exercise Steps Grade
						         	</div>
						         	<div className = "col-md-3 col-sm-3 col-lg-3 text_center">
						         		{this.getStylesForGrades(movement_non_exercise_step_grade) }
						         	</div>
						        </div>
				          		<hr  
	          						
          						/>
          						<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Non Exercise Steps GPA
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{this.getStylesForGpa(non_exericse_steps_gpa) }
					          		</div>
					          	</div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Total Steps
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{this.renderComma(total_steps)}
					          		</div>
					          	</div>
			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
  	}
  		getStylesForFood(score){
  		let background = "";
		let color = "";
		let hr_background = "";
		if(score || score == 0){
	            if(score<50){
	           		 background = '#FF0101';
	                color = 'black';
	                hr_background = 'black';
	            }
	            else if(score>=50 && score<70){
	                background = '#FFFF01';
	                color = 'black';
	                hr_background = 'black';
	            }	      
	            else if(score >= 70){	       
	                background = 'green';
	               	color = 'white';
	               	hr_background = 'white';
	            }
        }
       
		var model = <div  style = {{background:background, color:color}}>
						{this.renderPercent(score)}
					</div>
		return model;
  	}
  	renderNutrition(value,dur,rank){
  		let prcnt_unprocessed_volume_of_food = '';
  		let prcnt_unprocessed_food_grade = '';
  		let prcnt_unprocessed_food_gpa = '';
  		if(dur && dur != "today" && dur != "month" &&
  			dur != "yesterday" && dur != "week" && dur != "year"){
  			prcnt_unprocessed_volume_of_food = value.prcnt_unprocessed_volume_of_food['custom_range'][dur].data;
  			prcnt_unprocessed_food_grade = value.prcnt_unprocessed_food_grade['custom_range'][dur].data;
  			prcnt_unprocessed_food_gpa = value.prcnt_unprocessed_food_gpa['custom_range'][dur].data;
  		}
  		else{
  			prcnt_unprocessed_volume_of_food = value.prcnt_unprocessed_volume_of_food[dur];
  			prcnt_unprocessed_food_grade = value.prcnt_unprocessed_food_grade[dur];
  			prcnt_unprocessed_food_gpa = value.prcnt_unprocessed_food_gpa[dur];
  		}
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style" style = {{fontWeight:"bold"}}>Nutrition</CardTitle>
			          		<hr  
			          			
			          			/>
			          		<CardText>
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						          		% of Unprocessed Food Consumed
		          					</div>
		          					<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						          		{ this.getStylesForFood(prcnt_unprocessed_volume_of_food) }
		          					</div>
		          				</div>
		          				<hr  
	          						
          						/>
          						 <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Rank against other users
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.renderRank(this.state.rankData.prcnt_uf,this.state.selected_range)}
						         	</div>
						        </div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		% Non Processed Food Consumed Grade
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.getStylesForGrades(prcnt_unprocessed_food_grade) }
						         	</div>
						        </div>
				          		<hr  
	          						
          						/>
          						<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			% Non Processed Food Consumed GPA
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{this.getStylesForGpa(prcnt_unprocessed_food_gpa) }
					          		</div>
					          	</div>
			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
  	}
  	renderAlcohol(value,dur,rank){
  		let avg_drink_per_week = '';
  		let alcoholic_drinks_per_week_grade = '';
  		let alcoholic_drinks_per_week_gpa = '';
  		let prcnt_alcohol_consumption_reported = '';
  		if(dur && dur != "today" && dur != "month" &&
  			dur != "yesterday" && dur != "week" && dur != "year"){
  			avg_drink_per_week = value.avg_drink_per_week['custom_range'][dur].data;
  			alcoholic_drinks_per_week_grade = value.alcoholic_drinks_per_week_grade['custom_range'][dur].data;
  			alcoholic_drinks_per_week_gpa = value.alcoholic_drinks_per_week_gpa['custom_range'][dur].data;
  			prcnt_alcohol_consumption_reported = value.prcnt_alcohol_consumption_reported['custom_range'][dur].data;
  		}
  		else{
  			avg_drink_per_week = value.avg_drink_per_week[dur];
  			alcoholic_drinks_per_week_grade = value.alcoholic_drinks_per_week_grade[dur];
  			alcoholic_drinks_per_week_gpa = value.alcoholic_drinks_per_week_gpa[dur];
  			prcnt_alcohol_consumption_reported = value.prcnt_alcohol_consumption_reported[dur];
  		}
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style" style = {{fontWeight:"bold"}}>Alcohol</CardTitle>
			          		<hr  
			          			
			          			/>
			          		<CardText>
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						          		Average Drinks Per Week (7 Days)
		          					</div>
		          					<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						          		{ avg_drink_per_week }
		          					</div>
		          				</div>
		          				<hr  
	          						
          						/>
          						 <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Rank against other users
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.renderRank(this.state.rankData.alcohol,this.state.selected_range)}
						         	</div>
						        </div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Alcoholic drinks per week Grade
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{ this.getStylesForGrades(alcoholic_drinks_per_week_grade) }
						         	</div>
						        </div>
				          		<hr  
	          						
          						/>
          						<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Alcoholic drinks per week GPA
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ this.getStylesForGpa(alcoholic_drinks_per_week_gpa) }
					          		</div>
					          	</div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-9 col-sm-9 col-lg-9 text_center1">
					          			% of Days Alcohol Consumption Reported
					          		</div>
					          		<div className = "col-md-3 col-sm-3 col-lg-3 text_center">
					          			{this.renderPercent(prcnt_alcohol_consumption_reported) }
					          		</div>
					          	</div>
			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
  	}
  	renderEc(value,dur,rank){
  		let avg_no_of_days_exercises_per_week = '';
  		let exercise_consistency_grade = '';
  		let exercise_consistency_gpa = '';
  		if(dur && dur != "today" && dur != "month" &&
  			dur != "yesterday" && dur != "week" && dur != "year"){
  			avg_no_of_days_exercises_per_week = value.avg_no_of_days_exercises_per_week['custom_range'][dur].data;
  			exercise_consistency_grade = value.exercise_consistency_grade['custom_range'][dur].data;
  			exercise_consistency_gpa = value.exercise_consistency_gpa['custom_range'][dur].data;
  		}
  		else{
  			avg_no_of_days_exercises_per_week = value.avg_no_of_days_exercises_per_week[dur];
  			exercise_consistency_grade = value.exercise_consistency_grade[dur];
  			exercise_consistency_gpa = value.exercise_consistency_gpa[dur];
  		}
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style" style = {{fontWeight:"bold"}}>Exercise Consistency</CardTitle>
			          		<hr  
			          			
			          			/>
			          		<CardText>
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						          		Avg # of Days Exercised/Week
		          					</div>
		          					<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						          		{avg_no_of_days_exercises_per_week }
		          					</div>
		          				</div>
		          				<hr  
	          						
          						/>
          						 <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Rank against other users
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.renderRank(this.state.rankData.ec,this.state.selected_range)}
						         	</div>
						        </div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Exercise Consistency Grade
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{ this.getStylesForGrades(exercise_consistency_grade) }
						         	</div>
						        </div>
				          		<hr  
	          						
          						/>
          						<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Exercise Consistency GPA
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ this.getStylesForGpa(exercise_consistency_gpa) }
					          		</div>
					          	</div>
			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
  	}
  	renderExerciseStats(value,dur){
  		let workout_duration_hours_min = '';
  		let workout_effort_level = '';
  		let avg_exercise_heart_rate = '';
  		let vo2_max = '';
  		if(dur && dur != "today" && dur != "month" &&
  			dur != "yesterday" && dur != "week" && dur != "year"){
  			workout_duration_hours_min = value.workout_duration_hours_min['custom_range'][dur].data;
  			workout_effort_level = value.workout_effort_level['custom_range'][dur].data;
  			avg_exercise_heart_rate = value.avg_exercise_heart_rate['custom_range'][dur].data;
  			vo2_max = value.vo2_max['custom_range'][dur].data;
  		}
  		else{
  			workout_duration_hours_min = value.workout_duration_hours_min[dur];
  			workout_effort_level = value.workout_effort_level[dur];
  			avg_exercise_heart_rate = value.avg_exercise_heart_rate[dur];
  			vo2_max = value.vo2_max[dur];
  		}
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style" style = {{fontWeight:"bold"}}>Exercise Stats</CardTitle>
			          		<hr  
			          			
			          			/>
			          		<CardText>
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-7 col-sm-7 col-lg-7 text_center1">
						          		Workout Duration (hours:minutes)
		          					</div>
		          					<div className = "col-md-5 col-sm-5 col-lg-5 text_center">
						          		{ this.exerciseStatsNoWorkOut(workout_duration_hours_min) }
		          					</div>
		          				</div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-7 col-sm-7 col-lg-7 text_center1">
						         		Workout Effort Level
						         	</div>
						         	<div className = "col-md-5 col-sm-5 col-lg-5 text_center">
						         		{ this.exerciseStatsNoWorkOut(workout_effort_level) }
						         	</div>
						        </div>
				          		<hr  
	          						
          						/>
          						<div className = "row justify-content-center">
					          		<div className = "col-md-7 col-sm-7 col-lg-7 text_center1">
					          			Average Exercise Heart Rate
					          		</div>
					          		<div className = "col-md-5 col-sm-5 col-lg-5 text_center">
					          			{ this.exerciseStatsNoWorkOut(avg_exercise_heart_rate) }
					          		</div>
					          	</div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-7 col-sm-7 col-lg-7 text_center1">
					          			VO2 Max
					          		</div>
					          		<div className = "col-md-5 col-sm-5 col-lg-5 text_center">
					          			{ this.vo2MaxNotReported(vo2_max) }
					          		</div>
					          	</div>
			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
  	}
  	getStylesForBeats(value){
  		let background = "";
		let color = "";
		let hr_background = "";
		if(value || value == 0){
	            if(value >= 20){
	           		background = 'green';
	               	color = 'white';
	               	hr_background = 'white';
	            }
	            else if(value >= 12 && value < 20){
	                background = '#FFFF01';
	                color = 'black';
	                hr_background = 'black';
	            }	      
	            else if(value > 0 && value < 12){
	                background = '#FF0101';
	                color = 'black';
	                hr_background = 'black';
	            }
        }
       else{
	        	value = "No Data Yet"
	            background = 'white';
	            color = '#5e5e5e';
	            hr_background = '#e5e5e5';
        }
		var model = <div  style = {{background:background, color:color}}>
						{value}
					</div>
		return model;
  	}
  	getStylesForRhr(score){
  		let background = "";
		let color = "";
		let hr_background = "";
		if(score || score == 0){
	            if(score>=76){
	           		background = 'red';
	               	color = 'black';
	               	hr_background = 'black';
	            }
	            else if(score>=63 && score<=75){
	                background = '#FFFF01';
	                color = 'black';
	                hr_background = 'black';
	            }
	            else if(score >=30 && score <= 62){
	                background = 'green';
	                color = 'white';
	                hr_background = 'white';
	            }
	            else if(score<30){
	                background = 'red';
	                color = 'black';
	                hr_background = 'black';
	            }
        }
       else{
	        	score = "No Data Yet"
	            background = 'white';
	            color = '#5e5e5e';
	            hr_background = '#e5e5e5';
        }
		var model = <div  style = {{background:background, color:color}}>
						{this.renderComma(score)}
					</div>
		return model;
  	}
  	renderOther(value,dur,rank){
  		let resting_hr = '';
  		let hrr_time_to_99 = '';
  		let hrr_beats_lowered_in_first_min = '';
  		let hrr_highest_hr_in_first_min = '';
  		let hrr_lowest_hr_point = '';
  		let hrr_pure_1_minute_beat_lowered = '';
  		let hrr_pure_time_to_99 = '';
  		let floors_climbed = '';
  		if(dur && dur != "today" && dur != "month" &&
  			dur != "yesterday" && dur != "week" && dur != "year"){
  			resting_hr = value.resting_hr['custom_range'][dur].data;
  			hrr_time_to_99 = value.hrr_time_to_99['custom_range'][dur].data;
  			hrr_beats_lowered_in_first_min = value.hrr_beats_lowered_in_first_min['custom_range'][dur].data;
  			hrr_highest_hr_in_first_min = value.hrr_highest_hr_in_first_min['custom_range'][dur].data;
  			hrr_lowest_hr_point = value.hrr_lowest_hr_point['custom_range'][dur].data;
  			hrr_pure_1_minute_beat_lowered = value.hrr_pure_1_minute_beat_lowered['custom_range'][dur].data;
  			hrr_pure_time_to_99 = value.hrr_pure_time_to_99['custom_range'][dur].data;
  			floors_climbed = value.floors_climbed['custom_range'][dur].data;
  		}
  		else{
  			resting_hr = value.resting_hr[dur];
  			hrr_time_to_99 = value.hrr_time_to_99[dur];
  			hrr_beats_lowered_in_first_min = value.hrr_beats_lowered_in_first_min[dur];
  			hrr_highest_hr_in_first_min = value.hrr_highest_hr_in_first_min[dur];
  			hrr_lowest_hr_point = value.hrr_lowest_hr_point[dur];
  			hrr_pure_1_minute_beat_lowered = value.hrr_pure_1_minute_beat_lowered[dur];
  			hrr_pure_time_to_99 = value.hrr_pure_time_to_99[dur];
  			floors_climbed = value.floors_climbed[dur];
  		}
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style" style = {{fontWeight:"bold"}}>Other Stats</CardTitle>
			          		<hr  
			          			
			          			/>
			          		<CardText>
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						          		Resting Heart Rate (RHR)
		          					</div>
		          					<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						          		{this.getStylesForRhr(resting_hr) }
		          					</div>
		          				</div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Rank against other users
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.renderRank(this.state.rankData.resting_hr,this.state.selected_range)}
						         	</div>
						        </div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		HRR (time to 99)
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{ hrr_time_to_99 }
						         	</div>
						        </div>
						        <hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Rank against other users
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.renderRank(this.state.rankData.time_99,this.state.selected_range)}
						         	</div>
						        </div>
				          		<hr  
	          						
          						/>
          						<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			HRR (heart beats lowered in 1st minute)
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{this.getStylesForBeats(hrr_beats_lowered_in_first_min) }
					          		</div>
					          	</div>
					          	<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Rank against other users
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.renderRank(this.state.rankData.beat_lowered,this.state.selected_range)}
						         	</div>
						        </div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			HRR (highest heart rate in 1st minute)
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{hrr_highest_hr_in_first_min }
					          		</div>
					          	</div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			HRR (lowest heart rate point in 1st Minute)
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{hrr_lowest_hr_point }
					          		</div>
					          	</div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Pure 1 Minute HRR Beats Lowered
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ this.getStylesForBeats(hrr_pure_1_minute_beat_lowered) }
					          		</div>
					          	</div>
					          	<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Rank against other users
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.renderRank(this.state.rankData.pure_beat_lowered,this.state.selected_range)}
						         	</div>
						        </div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Pure time to 99 (mm:ss)
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ hrr_pure_time_to_99 }
					          		</div>
					          	</div>
					          	<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Rank against other users
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.renderRank(this.state.rankData.pure_time_99,this.state.selected_range)}
						         	</div>
						        </div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Floors Climbed
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ floors_climbed }
					          		</div>
					          	</div>
			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
  	}
  	renderSleep(value,dur,rank){
  		let total_sleep_in_hours_min = '';
  		let average_sleep_grade = '';
  		let num_days_sleep_aid_taken_in_period = '';
  		let prcnt_days_sleep_aid_taken_in_period = '';
  		if(dur && dur != "today" && dur != "month" &&
  			dur != "yesterday" && dur != "week" && dur != "year"){
  			total_sleep_in_hours_min = value.total_sleep_in_hours_min['custom_range'][dur].data;
  			average_sleep_grade = value.average_sleep_grade['custom_range'][dur].data;
  			num_days_sleep_aid_taken_in_period = value.num_days_sleep_aid_taken_in_period['custom_range'][dur].data;
  			prcnt_days_sleep_aid_taken_in_period = value.prcnt_days_sleep_aid_taken_in_period['custom_range'][dur].data;
  		}
  		else{
  			total_sleep_in_hours_min = value.total_sleep_in_hours_min[dur];
  			average_sleep_grade = value.average_sleep_grade[dur];
  			num_days_sleep_aid_taken_in_period = value.num_days_sleep_aid_taken_in_period[dur];
  			prcnt_days_sleep_aid_taken_in_period = value.prcnt_days_sleep_aid_taken_in_period[dur];
  		}
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style" style = {{fontWeight:"bold"}}>Sleep Per Night (excluding awake time)</CardTitle>
			          		<hr  
			          			
			          			/>
			          		<CardText>
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						          		Total Sleep in hours:minutes
		          					</div>
		          					<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						          		{ this.getStylesForSleep(total_sleep_in_hours_min) }
		          					</div>
		          				</div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Rank against other users 
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{this.renderRank(this.state.rankData.avg_sleep,this.state.selected_range)}
						         	</div>
						        </div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		Average Sleep Grade
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{ this.getStylesForGrades(average_sleep_grade) }
						         	</div>
						        </div>
				          		<hr  
	          						
          						/>
          						<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			# of Days Sleep Aid Taken in Period
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{num_days_sleep_aid_taken_in_period }
					          		</div>
					          	</div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			% of Days Sleep Aid Taken in Period
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ this.renderPercent(prcnt_days_sleep_aid_taken_in_period) }
					          		</div>
					          	</div>
			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
  	}
  	renderSick(value,dur){
  		let number_of_days_not_sick = '';
  		let prcnt_of_days_not_sick = '';
  		let number_of_days_sick = '';
  		let prcnt_of_days_sick = '';
  		let days_sick_not_sick_reported = '';
  		if(dur && dur != "today" && dur != "month" &&
  			dur != "yesterday" && dur != "week" && dur != "year"){
  			number_of_days_not_sick = value.number_of_days_not_sick['custom_range'][dur].data;
  			prcnt_of_days_not_sick = value.prcnt_of_days_not_sick['custom_range'][dur].data;
  			number_of_days_sick = value.number_of_days_sick['custom_range'][dur].data;
  			prcnt_of_days_sick = value.prcnt_of_days_sick['custom_range'][dur].data;
  			days_sick_not_sick_reported = value.days_sick_not_sick_reported['custom_range'][dur].data;
  		}
  		else{
  			number_of_days_not_sick = value.number_of_days_not_sick[dur];
  			prcnt_of_days_not_sick = value.prcnt_of_days_not_sick[dur];
  			number_of_days_sick = value.number_of_days_sick[dur];
  			prcnt_of_days_sick = value.prcnt_of_days_sick[dur];
  			days_sick_not_sick_reported = value.days_sick_not_sick_reported[dur];
  		}
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style" style = {{fontWeight:"bold"}}>Sick</CardTitle>
			          		<hr  
			          			
			          			/>
			          		<CardText>
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						          		Number of Days Not Sick
		          					</div>
		          					<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						          		{ number_of_days_not_sick }
		          					</div>
		          				</div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		% of Days Not Sick
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{ this.renderPercent(prcnt_of_days_not_sick) }
						         	</div>
						        </div>
				          		<hr  
	          						
          						/>
          						<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Number of Days Sick
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ number_of_days_sick }
					          		</div>
					          	</div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			% of Days Sick
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ this.renderPercent(prcnt_of_days_sick) }
					          		</div>
					          	</div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Days Sick/Not Sick Reported
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ days_sick_not_sick_reported }
					          		</div>
					          	</div>
			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
  	}
  	renderStress(value,dur){
  		let number_of_days_low_stress_reported = '';
  		let prcnt_of_days_low_stress = '';
  		let number_of_days_medium_stress_reported = '';
  		let prcnt_of_days_medium_stress = '';
  		let number_of_days_high_stress_reported = '';
  		let prcnt_of_days_high_stress = '';
  		let days_stress_level_reported = '';
  		if(dur && dur != "today" && dur != "month" &&
  			dur != "yesterday" && dur != "week" && dur != "year"){
  			number_of_days_low_stress_reported = value.number_of_days_low_stress_reported['custom_range'][dur].data;
  			prcnt_of_days_low_stress = value.prcnt_of_days_low_stress['custom_range'][dur].data;
  			number_of_days_medium_stress_reported = value.number_of_days_medium_stress_reported['custom_range'][dur].data;
  			prcnt_of_days_medium_stress = value.prcnt_of_days_medium_stress['custom_range'][dur].data;
  			number_of_days_high_stress_reported = value.number_of_days_high_stress_reported['custom_range'][dur].data;
  			prcnt_of_days_high_stress = value.prcnt_of_days_high_stress['custom_range'][dur].data;
  			days_stress_level_reported = value.days_stress_level_reported['custom_range'][dur].data;
  		}
  		else{
  			number_of_days_low_stress_reported = value.number_of_days_low_stress_reported[dur];
  			prcnt_of_days_low_stress = value.prcnt_of_days_low_stress[dur];
  			number_of_days_medium_stress_reported = value.number_of_days_medium_stress_reported[dur];
  			prcnt_of_days_medium_stress = value.prcnt_of_days_medium_stress[dur];
  			number_of_days_high_stress_reported = value.number_of_days_high_stress_reported[dur];
  			prcnt_of_days_high_stress = value.prcnt_of_days_high_stress[dur];
  			days_stress_level_reported = value.days_stress_level_reported[dur];
  		}
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style" style = {{fontWeight:"bold"}}>Stress</CardTitle>
			          		<hr  
			          			
			          			/>
			          		<CardText>
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						          		Number of Days Low Stress Reported
		          					</div>
		          					<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						          		{ number_of_days_low_stress_reported }
		          					</div>
		          				</div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		% of Days Low Stress
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{ this.renderPercent(prcnt_of_days_low_stress) }
						         	</div>
						        </div>
				          		<hr  
	          						
          						/>
          						<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Number of Days Medium Stress Reported
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ number_of_days_medium_stress_reported }
					          		</div>
					          	</div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			% of Days Medium Stress
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ this.renderPercent(prcnt_of_days_medium_stress) }
					          		</div>
					          	</div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Number of Days High Stress Reported
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ number_of_days_high_stress_reported }
					          		</div>
					          	</div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			% of Days High Stress
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ this.renderPercent(prcnt_of_days_high_stress) }
					          		</div>
					          	</div>
					          	<hr  
	          						
          						/>
					          	<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Number of Days Stress Level Reported
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ days_stress_level_reported }
					          		</div>
					          	</div>
			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
  	}
  	renderStanding(value,dur){
  		let number_days_stood_three_hours = '';
  		let prcnt_days_stood_three_hours = '';
  		let number_days_reported_stood_not_stood_three_hours = '';
  		
  		if(dur && dur != "today" && dur != "month" &&
  			dur != "yesterday" && dur != "week" && dur != "year"){
  			number_days_stood_three_hours = value.number_days_stood_three_hours['custom_range'][dur].data;
  			prcnt_days_stood_three_hours = value.prcnt_days_stood_three_hours['custom_range'][dur].data;
  			number_days_reported_stood_not_stood_three_hours = value.number_days_reported_stood_not_stood_three_hours['custom_range'][dur].data;
  			
  		}
  		else{
  			number_days_stood_three_hours = value.number_days_stood_three_hours[dur];
  			prcnt_days_stood_three_hours = value.prcnt_days_stood_three_hours[dur];
  			number_days_reported_stood_not_stood_three_hours = value.number_days_reported_stood_not_stood_three_hours[dur];
  		}
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style" style = {{fontWeight:"bold"}}>Standing</CardTitle>
			          		<hr  
			          			
			          			/>
			          		<CardText>
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						          		Number of Days Stood more than 3 hours
		          					</div>
		          					<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						          		{ number_days_stood_three_hours }
		          					</div>
		          				</div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		% of Days Stood More Than 3 Hours
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{ this.renderPercent(prcnt_days_stood_three_hours) }
						         	</div>
						        </div>
				          		<hr  
	          						
          						/>
          						<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
					          			Number of Days Reported Standing/Not Standing more than 3 hours
					          		</div>
					          		<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
					          			{ number_days_reported_stood_not_stood_three_hours }
					          		</div>
					          	</div>					       
			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
  	}
  	renderTravel(value,dur){
  		let number_days_travel_away_from_home = '';
  		let prcnt_days_travel_away_from_home = '';
  		
  		if(dur && dur != "today" && dur != "month" &&
  			dur != "yesterday" && dur != "week" && dur != "year"){
  			number_days_travel_away_from_home = value.number_days_travel_away_from_home['custom_range'][dur].data;
  			prcnt_days_travel_away_from_home = value.prcnt_days_travel_away_from_home['custom_range'][dur].data;
  			
  		}
  		else{
  			number_days_travel_away_from_home = value.number_days_travel_away_from_home[dur];
  			prcnt_days_travel_away_from_home = value.prcnt_days_travel_away_from_home[dur];
  		}
  		let card = <Card className = "card_style" 
						id = "my-card-mcs"
						style = {{fontSize:"14px"}}
						 >
			        	<CardBody>
			          		<CardTitle className = "header_style" style = {{fontWeight:"bold"}}>Travel</CardTitle>
			          		<hr  
			          			
			          			/>
			          		<CardText>
				          		<div className = "row justify-content-center">
					          		<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						          		Number of Days you Traveled/Stayed Away From Home?
		          					</div>
		          					<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						          		{ number_days_travel_away_from_home }
		          					</div>
		          				</div>
		          				<hr  
			          				
		          				/>
						        <div className = "row justify-content-center">
						         	<div className = "col-md-8 col-sm-8 col-lg-8 text_center1">
						         		% of Days you Traveled/Stayed Away From Home?
						         	</div>
						         	<div className = "col-md-4 col-sm-4 col-lg-4 text_center">
						         		{ this.renderPercent(prcnt_days_travel_away_from_home) }
						         	</div>
						        </div>				       
			          		</CardText>
			        	</CardBody>
		      		</Card>
  		return card;
  	}
	render(){
		return(
			<div className = "container-fluid">
			<NavbarMenu title = {"Progress Analyzer Dashboard"} />
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
                                     <span className="pdf_button" id="pdf_button">
                                    <a href={this.createExcelPrintURL()}>
                                    <Button className="btn createbutton mb5">Export Report</Button>
                                    </a>
                                </span>
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
                                  <span className="date_range_btn date_range_btn2">
                                      <Button
                                          className="daterange-btn btn"                            
                                          id="daterange"
                                          onClick={this.toggleDate2} >Custom Date Range2
                                      </Button>
                                  </span>
                              </span>
                           <span  onClick={this.toggleDate3} id="daterange3" style={{color:"white"}}>
                                  <span className="date_range_btn date_range_btn3">
                                      <Button
                                          className="daterange-btn btn"                            
                                          id="daterange"
                                          onClick={this.toggleDate3} >Custom Date Range3
                                      </Button>
                                  </span>
                              </span>
                              <span className="pa_dropbutton">
                                    <span id="spa">
                                    <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                                        <DropdownToggle caret style={{backgroundColor:"#40E0D0",borderColor:"#40E0D0",paddingTop:"10px"}}>
                                            More
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>
                                                <span  onClick={this.toggleDate2} id="daterange2" style={{color:"white"}}>
                                                    <span className="date_range_btn drop_date_range_btn2">
                                                        <Button
                                                            className="daterange-btn btn"                            
                                                            id="daterange"
                                                            onClick={this.toggleDate2} >Custom Date Range2
                                                        </Button>
                                                    </span>
                                                </span>
                                            </DropdownItem>
                                            <DropdownItem>
                                                <span  onClick={this.toggleDate3} id="daterange3" style={{color:"white"}}>
                                                    <span className="date_range_btn drop_date_range_btn3">
                                                        <Button
                                                          className="daterange-btn btn"                            
                                                          id="daterange"
                                                          onClick={this.toggleDate3} >Custom Date Range3
                                                        </Button>
                                                    </span>
                                                </span>
                                            </DropdownItem>
                                            
                                        </DropdownMenu>
                                    </Dropdown>
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
                                   name="cr1_start_date"
                                   value={this.state.cr1_start_date}
                                   onChange={this.handleChange} style={{height:"35px",borderRadius:"7px"}}/>

                                </div>
                                <div id="date" className="justify-content-center">

                                  <Label>End date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
                                  <Input type="date"
                                   name="cr1_end_date"
                                   value={this.state.cr1_end_date}
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
                                   name="cr2_start_date"
                                   value={this.state.cr2_start_date}
                                   onChange={this.handleChange} style={{height:"35px",borderRadius:"7px"}}/>

                                </div>
                                <div id="date" className="justify-content-center">

                                  <Label>End date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
                                  <Input type="date"
                                   name="cr2_end_date"
                                   value={this.state.cr2_end_date}
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
                                   name="cr3_start_date"
                                   value={this.state.cr3_start_date}
                                   onChange={this.handleChange} style={{height:"35px",borderRadius:"7px"}}/>

                                </div>
                                <div id="date" className="justify-content-center">

                                  <Label>End date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
                                  <Input type="date"
                                   name="cr3_end_date"
                                   value={this.state.cr3_end_date}
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
                   	{this.state.active_view && 
	                    <div className = "row gd_padding">
						    <div className = "row dropStyles">
						        <Dropdown isOpen={this.state.dropdownOpen1} toggle={this.toggle}>
							        <DropdownToggle caret>
							          Select Range
							        </DropdownToggle>
							        <DropdownMenu>
							         {this.renderDateRangeDropdown(this.state.summary,this.state.duration_date)}
							        </DropdownMenu>
						      	</Dropdown>
						      	<span className = "weekdate"><span>{this.state.capt}</span><span>{" (" + this.state.date + ")"}</span></span>
				        	</div>
						</div>
					}
					{this.state.btnView &&
		              <div>
		                <Button className = "btn btn-info" onClick = {this.handleBackButton} style = {{marginLeft:"50px",marginTop:"10px",fontSize:"13px"}}>Back</Button>
		              </div>
           			 }
           			  {this.state.btnView &&
			            <div className = "row justify-content-center">
			            <span style={{float:"center",fontSize:"17px",fontWeight:"bold"}}>{this.state.active_category_name}</span>
			          </div>
       				 }
					<div className="col-sm-12 col-md-12 col-lg-12 card_padding1">
					{this.state.active_view &&
						<div>
						<div className = "row">
							<div className ="col-md-4 card_padding"> 
								{this.renderOverallHealth(this.state.summary.overall_health,this.state.selected_range,this.state.rankData.oh_gpa)}
							</div>
							<div className ="col-md-4 card_padding">
								{this.renderMcs(this.state.summary.mc,this.state.selected_range,this.state.rankData.mc)}
							</div>
							<div className = "col-md-4 card_padding">
								{this.renderEc(this.state.summary.ec,this.state.selected_range,this.state.rankData.ec)}
							</div>
						</div>
						<div className = "row">
							<div className = "col-md-4 card_padding">
								{this.renderSleep(this.state.summary.sleep,this.state.selected_range,this.state.rankData.avg_sleep)}
							</div>
							<div className = "col-md-4 card_padding">
								{this.renderAlcohol(this.state.summary.alcohol,this.state.selected_range,this.state.rankData.alcohol)}
							</div>
							<div className ="col-md-4 card_padding">
								{this.renderNonExerciseSteps(this.state.summary.non_exercise,this.state.selected_range,this.state.rankData.nes)}
							</div>
						</div>
						<div className = "row">
							<div className = "col-md-4 card_padding">
								{this.renderExerciseStats(this.state.summary.exercise,this.state.selected_range)}
							</div>
							<div className = "col-md-4 card_padding">
								{this.renderSick(this.state.summary.sick,this.state.selected_range)}
							</div>
							
							<div className = "col-md-4 card_padding">
								{this.renderNutrition(this.state.summary.nutrition,this.state.selected_range,this.state.rankData.prcnt_uf)}
							</div>
						</div>
						<div className = "row">
							<div className = "col-md-4 card_padding">
								{this.renderOther(this.state.summary.other,this.state.selected_range,this.state.rankData)}
							</div>
							<div className = "col-md-4 card_padding">
								{this.renderStress(this.state.summary.stress,this.state.selected_range)}
							</div>
							<div className = "col-md-4 card_padding">
								<div>
									{this.renderStanding(this.state.summary.standing,this.state.selected_range)}
								</div>
								<div style = {{marginTop:"15px"}}>
									{this.renderTravel(this.state.summary.travel,this.state.selected_range)}
								</div>
							</div>
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
					{this.renderProgressSelectedDateFetchOverlay()}
			</div>
			)
	}
}
export default ProgressDashboard;