import React,{ Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {connect} from 'react-redux';
import FontAwesome from "react-fontawesome";
import { Collapse, Navbar, NavbarToggler, 
         NavbarBrand, Nav, NavItem, NavLink,
        Button,Popover,PopoverBody,Form,FormGroup,FormText,Label,Input,Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
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

class ProgressDashboard extends Component{
	constructor(props){
		super(props);
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
		};
		this.successProgress = this.successProgress.bind(this);
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
   		this.handleScroll = this.handleScroll.bind(this);
   		this.renderOverallHealth = this.renderOverallHealth.bind(this);
   		this.renderProgressSelectedDateFetchOverlay = renderProgressSelectedDateFetchOverlay.bind(this);
	}
	successProgress(data){
	    this.setState({
	    	fetching_ql4:false,
	        report_date:data.data.report_date,
	        summary:data.data.summary,
	        duration_date:data.data.duration_date,
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
	    },()=>{
	      fetchProgress(this.successProgress,this.errorProgress,this.state.selectedDate);
	      //fetchUserRank(this.successRank,this.errorProgress,this.state.selectedDate);
	    });
  	}
  	 componentDidMount(){
      this.setState({
         fetching_ql4 :true,     
       },()=>{
       	fetchProgress(this.successProgress,this.errorProgress,this.state.selectedDate);
       });
      
      //fetchUserRank(this.successRank,this.errorProgress,this.state.selectedDate,true);
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
      //fetchUserRank(this.successRank,this.errorProgress,this.state.selectedDate,custom_ranges);

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
      //fetchUserRank(this.successRank,this.errorProgress,this.state.selectedDate,custom_ranges);

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
      //fetchUserRank(this.successRank,this.errorProgress,this.state.selectedDate,custom_ranges);

    });
  }
  	renderOverallHealth(value,value5){
  		let duration_type = ["today","yesterday","week","year","custom_range"];
  		let durations = [];
  		for(let [key,value1] of Object.entries(value)){
  			for(let [key1,value2] of Object.entries(value1)){
  				for(let duration of duration_type){
  					let val = value2[duration];
  					if(dur == "custom_range"){
  						for(let [range,value3] of Object.entries(val)){
  							durations.push(range);
  						}
  					}
  					else{
  						durations.push(duration);
  					}
  				}
  			}
  		}

  		let date;
	  	let tableHeaders = [];
	  	for(let dur of durations){
	  		let rank;
	  		let capt = dur[0].toUpperCase() + dur.slice(1)
	  		if(dur == "today"){
	  			date = moment(value5[dur]).format('MMM DD, YYYY');
	  			rank = value[dur].all_rank;	
	  		}
	  		else if(dur == "yesterday"){
	  			date = moment(value5[dur]).format('MMM DD, YYYY');
	  			rank = value[dur].all_rank;	
	  		}
	  		else if(dur == "week"){
		  		date = this.headerDates(value5[dur]);
		  		rank = value[dur].all_rank;
	  		}
	  		else if(dur == "month"){
		  		date = this.headerDates(value5[dur]);
		  		rank = value[dur].all_rank;
	  		}
	  		else if(dur == "year"){
		  		date = this.headerDates(value5[dur]);
		  		rank = value[dur].all_rank;
	  		}
	  		else{
	  			date = this.headerDates(dur);
	  			capt = "";
	  			rank = value['custom_range'][dur].all_rank;

	  		}

  			tableHeaders.push(
  			 <a className="dropdown-item" 
	  			onClick = {this.reanderAllHrr.bind(this,rank,userName,capt,date)}
	  			style = {{fontSize:"13px"}}>
	  			{capt}<br/>{date}
  			</a>);
	  	}
	  return tableHeaders;	
	  	
  	
  	}
	render(){
		return(
			<div className = "container-fluid">
			<NavbarMenu title = {"Progress Analyzer Dashboard"} />
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

                    <div className = "row gd_padding">
						<div className = "col-md-4 gd_table_margin ">
							{this.renderOverallHealth(this.state.summary,this.state.duration_date)}
					    </div>
					</div>
					{this.renderProgressSelectedDateFetchOverlay()}
			</div>
			)
	}
}
export default ProgressDashboard;