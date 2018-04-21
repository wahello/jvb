import React,{ Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {connect} from 'react-redux';
import FontAwesome from "react-fontawesome";
import { Collapse, Navbar, NavbarToggler, 
         NavbarBrand, Nav, NavItem, NavLink,
        Button,Popover,PopoverBody,Form,FormGroup,FormText,Label,Input} from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import Dimensions from 'react-dimensions';
import { StyleSheet, css } from 'aphrodite';
import html2canvas from 'html2canvas';
import fetchProgress,{fetchUserRank} from '../network/progress';
import AllRank_Data1 from "./leader_all_exp";
import {renderProgressFetchOverlay,renderProgress2FetchOverlay,renderProgress3FetchOverlay,renderProgressSelectedDateFetchOverlay    } from './dashboard_healpers';

var CalendarWidget = require('react-calendar-widget');  

var ReactDOM = require('react-dom');

import { getGarminToken,logoutUser} from '../network/auth';

const catagory = ["oh_gpa","alcohol_drink","avg_sleep","prcnt_uf","mne_gpa","mc","ec"];
const duration = ["week","today","yesterday","year","month","custom_range"];
const categoryMeta = {
  "Overall Health GPA":{
    short_name:"oh_gpa",
    url_name:"overall-health-gpa"
  },
  "Alcohol Drink":{
    short_name:"alcohol_drink",
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
  "Movement Non Exercise GPA":{
    short_name:"mne_gpa",
    url_name:"movement-non-exercise-gpa"
  },
  "Floor Climbed":{
    short_name:"floor_climbed",
    url_name:"floor-climbed"
  },
};
 class DashboardSummary extends Component{
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
    this.state ={
        selectedDate: new Date(),
        cr1_start_date:'',
        cr1_end_date:'',
        cr2_start_date:'',
        cr2_end_date:'',
        cr3_start_date:'',
        cr3_end_date:'',
        isOpen: false,
        isOpen1:false,
        calendarOpen:false,
        dateRange1:false,
        dateRange2:false,
        dateRange3:false,
        fetching_ql1:false,
        fetching_ql2:false,
        fetching_ql3:false,
        fetching_ql4:false,
        scrollingLock:false,
        active_view:true,
        btnView:false,
        active_category:"",
        active_username:"",
        "report_date":"-",
        "rankData":rankInitialState,
        "summary":{
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
       }

    };
    this.successProgress = this.successProgress.bind(this);
    this.errorProgress = this.errorProgress.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.onLogoutSuccess = this.onLogoutSuccess.bind(this);
    this.processDate = this.processDate.bind(this);
   this.toggleCalendar=this.toggleCalendar.bind(this);
   this.toggleDate1 = this.toggleDate1.bind(this);
   this.toggleDate2 = this.toggleDate2.bind(this);
   this.toggleDate3 = this.toggleDate3.bind(this);
   this.onSubmitDate1 = this.onSubmitDate1.bind(this);
   this.onSubmitDate2 = this.onSubmitDate2.bind(this);
   this.onSubmitDate3 = this.onSubmitDate3.bind(this);
   this.handleChange = this.handleChange.bind(this);
   this.renderCustomRangeTD = this.renderCustomRangeTD.bind(this);
   this.nonExerciseSteps = this.nonExerciseSteps.bind(this);
   this.renderCustomRangeTDSteps = this.renderCustomRangeTDSteps.bind(this);
   this.gpascoreDecimal = this.gpascoreDecimal.bind(this);
   this.gpascoreCustomRangeTD = this.gpascoreCustomRangeTD.bind(this);
   this.renderProgressFetchOverlay = renderProgressFetchOverlay.bind(this);
   this.renderProgress2FetchOverlay = renderProgress2FetchOverlay.bind(this);
   this.renderProgress3FetchOverlay = renderProgress3FetchOverlay.bind(this);
   this.renderProgressSelectedDateFetchOverlay = renderProgressSelectedDateFetchOverlay.bind(this);
   this.headerDates = this.headerDates.bind(this);
   this.createExcelPrintURL = this.createExcelPrintURL.bind(this);
   this.exerciseStatsNoWorkOut = this.exerciseStatsNoWorkOut.bind(this);
   this.successRank = this.successRank.bind(this);
   this.vo2MaxNotReported = this.vo2MaxNotReported.bind(this);
   this.renderVo2maxCustomRangeTD = this.renderVo2maxCustomRangeTD.bind(this);
   this.renderExerciseCustomRangeTD = this.renderExerciseCustomRangeTD.bind(this);
   this.renderTablesTd = this.renderTablesTd.bind(this);
   this.handleScroll = this.handleScroll.bind(this);
   this.toggle1 = this.toggle1.bind(this);
   this.reanderAll = this.reanderAll.bind(this);
   this.handleBackButton = this.handleBackButton.bind(this);
   this.renderTableHeader = this.renderTableHeader.bind(this);

  }
    
  successProgress(data){
 
    this.setState({
        fetching_ql1:false,
        fetching_ql2:false,
        fetching_ql3:false,
        fetching_ql4:false,
        report_date:data.data.report_date,
        summary:data.data.summary,
        duration_date:data.data.duration_date,
    });
  }
  successRank(data){
   

    this.setState({
        fetching_ql1:false,
        fetching_ql2:false,
        fetching_ql3:false,
        fetching_ql4:false,
        rankData:data.data,
      //  duration_date:data.data.duration_date,
    });
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
nonExerciseSteps(steps){
let value = steps;
if(value != undefined){
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
}
renderCustomRangeTD(custom_data, toReturn="data"){
    let td=[];
    if(!custom_data){
        return td;
    }
    for (let[key,val] of Object.entries(custom_data)){
        if(toReturn == "data"){
            td.push(<td className="progress_table">{val.data}</td>);
        }
        else if(toReturn == "key"){
            let str = key;
            let d = str.split(" ");
            let d1 = d[0];
            let date1 =moment(d1).format('MMM DD, YYYY');
            let d2 = d[2];
            let date2 =moment(d2).format('MMM DD, YYYY');
            let date = date1 + ' to ' + date2;
            td.push(<th className=" progress_table">{date}</th>);
        }
    }
    return td;
}
renderVo2maxCustomRangeTD(custom_data, toReturn="data"){
    let td=[];
    if(!custom_data){
        return td;
    }
    for (let[key,val] of Object.entries(custom_data)){
        if(toReturn == "data"){
            let value = val.data 
            if(value == undefined || value == 0 || value == "" || value == "00:00"){
                value = "Not Provided"
                td.push(<td className="progress_table">{value}</td>);
            }
            else{
                td.push(<td className="progress_table">{value}</td>);
            }
            
        }
        else if(toReturn == "key"){
            let str = key;
            let d = str.split(" ");
            let d1 = d[0];
            let date1 =moment(d1).format('MMM DD, YYYY');
            let d2 = d[2];
            let date2 =moment(d2).format('MMM DD, YYYY');
            let date = date1 + ' to ' + date2;
            td.push(<th className=" progress_table">{date}</th>);
        }
    }
    return td;
}
renderExerciseCustomRangeTD(custom_data, toReturn="data"){
    let td=[];
    if(!custom_data){
        return td;
    }
    for (let[key,val] of Object.entries(custom_data)){
        if(toReturn == "data"){
            let value = val.data 
            if(value == undefined || value == 0 || value == "" || value == "00:00"){
                value = "No Workout"
                td.push(<td className="progress_table">{value}</td>);
            }
            else{
                td.push(<td className="progress_table">{val.data}</td>);
            }
            
        }
        else if(toReturn == "key"){
            let str = key;
            let d = str.split(" ");
            let d1 = d[0];
            let date1 =moment(d1).format('MMM DD, YYYY');
            let d2 = d[2];
            let date2 =moment(d2).format('MMM DD, YYYY');
            let date = date1 + ' to ' + date2;
            td.push(<th className=" progress_table">{date}</th>);
        }
    }
    return td;
}
gpascoreCustomRangeTD(custom_data, toReturn="data"){
    let td=[];
    if(!custom_data){
        return td;
    }
    for (let[key,val] of Object.entries(custom_data)){
        if(toReturn == "data"){
            let x = val.data;
            let value;
            if(x !=  null && x != undefined && x != "Not Reported"){
              value =parseFloat(x).toFixed(2);
            td.push(<td className="progress_table">{value}</td>);
          }
          else if(x == "Not Reported"){
          td.push(<td className="progress_table">{x}</td>);
         }
          else{
            td.push(<td className="progress_table">{value = ""}</td>);
          }
        }
        else if(toReturn == "key"){
             let str = key;
            let d = str.split(" ");
            let d1 = d[0];
            let date1 =moment(d1).format('MMM DD, YYYY');
            let d2 = d[2];
            let date2 =moment(d2).format('MMM DD, YYYY');
            let date = date1 + ' to ' + date2;
            td.push(<th className="progress_table">{date}</th>);
        }
    }
    return td;
}
renderCustomRangeTDSteps(custom_data, toReturn="data"){
    let td=[];
    if(!custom_data){
        return td;
    }
    for (let[key,val] of Object.entries(custom_data)){
        if(toReturn == "data"){
            let value =val.data;
            if(value != undefined){
              value += '';
              var x = value.split('.');
              var x1 = x[0];
              var x2 = x.length > 1 ? '.' + x[1] : '';
              var rgx = /(\d+)(\d{3})/;
              while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
          }
          td.push(<td className="progress_table">{x1 + x2}</td>);
     }
            
        }
        else if(toReturn == "key"){
            let str = key;
            let d = str.split(" ");
            let d1 = d[0];
            let date1 =moment(d1).format('MMM DD, YYYY');
            let d2 = d[2];
            let date2 =moment(d2).format('MMM DD, YYYY');
            let date = date1 + ' to ' + date2;
            td.push(<th className="progress_table">{date}</th>);

        }
    }
    return td;
}
  
   errorProgress(error){
       console.log(error.message);
       this.setState({
            fetching_ql1:false,
            fetching_ql2:false,
            fetching_ql3:false,
            fetching_ql4:false,
        });
    }

    processDate(selectedDate){ 
    this.setState({
      selectedDate: selectedDate,
      calendarOpen:!this.state.calendarOpen,
      fetching_ql4 :true,                               
    },()=>{
      fetchProgress(this.successProgress,this.errorProgress,this.state.selectedDate);
      fetchUserRank(this.successRank,this.errorProgress,this.state.selectedDate);
    });
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

    componentDidMount(){
      this.setState({
         fetching_ql4 :true,     
       });
      fetchProgress(this.successProgress,this.errorProgress,this.state.selectedDate);
      fetchUserRank(this.successRank,this.errorProgress,this.state.selectedDate,true);
      window.addEventListener('scroll', this.handleScroll);

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
  onLogoutSuccess(response){
    this.props.history.push("/#logout");
  }

  handleLogout(){
    this.props.logoutUser(this.onLogoutSuccess);
  }
  toggleCalendar(){
    this.setState({
      calendarOpen:!this.state.calendarOpen
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

  renderTablesTd(value,value5){
      let category = "";
      let durations = [];
      let scores = [];
      let ranks = [];
      let usernames;
      let tableRows = [];
      let durations_type = ["today","yesterday","week","month","year","custom_range"];
      for(let duration of durations_type){
        let val = value[duration];
        if(duration == "custom_range" && val){
          for(let [range,value1] of Object.entries(val)){
            durations.push(this.headerDates(range));
            for(let [c_key,c_rankData] of Object.entries(value1)){
              if(c_key == "user_rank"){
                if(!category)
                  category = c_rankData.category;
                usernames = c_rankData.username;
                scores.push(c_rankData.score);
                ranks.push({'rank':c_rankData.rank,'duration':range,'isCustomRange':true});
              }
            }
          }
        }
        else{
          if (val){ 
            durations.push(duration);
            for (let [key,a_rankData] of Object.entries(val)){
              if(key == "user_rank"){
                if(!category){
                  category = a_rankData.category;
                }
                usernames = a_rankData.username;
                scores.push(a_rankData.score);
                ranks.push({'rank':a_rankData.rank,'duration':duration,'isCustomRange':false});
              }
            }
          }
        }
      }

      // creating table rows for ranks
      let rankTableData = [];
      if (category){
        for(let rank of ranks){
          if(rank.isCustomRange){
            var all_cat_rank = this.state.rankData[
                  categoryMeta[category]["short_name"]]['custom_range'][rank['duration']].all_rank;    
          }
          else{
            var all_cat_rank = this.state.rankData[
                  categoryMeta[category]["short_name"]][rank['duration']].all_rank;      
          }
          rankTableData.push(
            <td className = "lb_table_style_rows">
            <a href ="#" onClick = {this.reanderAll.bind(this,all_cat_rank,usernames)}>
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
      return rankTableData;
    };
reanderAll(value,value1,event){
    if(value){
      this.setState({
        active_view:!this.state.active_view,
        btnView:!this.state.btnView,
        active_category:value,
        active_username:value1,
      });
      };
    };
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
handleBackButton(){
      this.setState({
        active_view:!this.state.active_view,
        btnView:false
      })
    }
    render(){
        const {fix} = this.props;
        return(
            <div className="dashboard">
        <div className="container-fluid">
        

         <Navbar toggleable
         fixed={fix ? 'top' : ''}
          className="navbar navbar-expand-sm navbar-inverse nav6">
          <NavbarToggler className="navbar-toggler hidden-sm-up" onClick={this.toggle} >
           <FontAwesome
                 name = "bars"
                 size = "1x"

             />

          </NavbarToggler>

          <Link to='/' >
            <NavbarBrand
              className="navbar-brand float-sm-left"
              id="navbarTogglerDemo" style={{fontSize:"16px",marginLeft:"-4px"}}>
              <img className="img-fluid"
               style={{maxWidth:"200px"}}
               src="//static1.squarespace.com/static/535dc0f7e4b0ab57db48c65c/t/5942be8b893fc0b88882a5fb/1504135828049/?format=1500w"/>
            </NavbarBrand>
          </Link>
            <span id="header">
            <h2 className="head" id="head">Progress Analyzer
            </h2>
            </span>
          <Collapse className="navbar-toggleable-xs" isOpen={this.state.isOpen} navbar>
            <Nav className="nav navbar-nav float-xs-right ml-auto" navbar>
              <NavItem className="float-sm-right">
                <Link id="logout"className="nav-link" to='/'>Home</Link>
              </NavItem>
               <NavItem className="float-sm-right">
                   <NavLink
                   className="nav-link"
                   id="logout"
                   onClick={this.handleLogout}>Log Out
                    </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
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
      
           <div className="col-sm-12 col-md-12 col-lg-12">
           {this.state.btnView &&
              <div>
                <Button className = "btn btn-info" onClick = {this.handleBackButton} style = {{marginLeft:"50px",marginTop:"10px",fontSize:"13px"}}>Back</Button>
              </div>
            }
            {this.state.btnView &&
            <div className = "row justify-content-center">
            <span style={{float:"center",fontSize:"17px"}}>{this.renderTableHeader(this.state.active_category)}</span>
          </div>
        }
        {this.state.active_view &&
            <div className="row justify-content-center padding" style = {{paddingTop:"25px"}}>
          <span className = "table table-responsive">
        <table className = "table table-striped table-bordered">
         <thead className=" progress_table">
            <tr className=" progress_table">
                <th className=" progress_table">Overall Health Grade</th>
                <th className=" progress_table">Today<br/>{moment(this.state.duration_date.today).format('MMM DD, YYYY')}</th>
                <th className=" progress_table">Yesterday<br/>{moment(this.state.duration_date.yesterday).format('MMM DD, YYYY')}</th>
                <th className=" progress_table">Avg Last 7 Days<br/>{this.headerDates(this.state.duration_date.week)}</th>
                <th className=" progress_table">Avg Last 30 Days<br/>{this.headerDates(this.state.duration_date.month)}</th>
                <th className=" progress_table">Avg Year to Date<br/>{this.headerDates(this.state.duration_date.year)}</th>
                 {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
            </tr>
        </thead>
        <tbody className="progress_table">
            <tr>
                <td className="progress_table">Total GPA Points</td>
                <td className="progress_table">{this.state.summary.overall_health.total_gpa_point.today}</td>
                <td className="progress_table">{this.state.summary.overall_health.total_gpa_point.yesterday}</td>
                <td className="progress_table">{this.state.summary.overall_health.total_gpa_point.week}</td>
                <td className="progress_table">{this.state.summary.overall_health.total_gpa_point.month}</td>
                <td className="progress_table">{this.state.summary.overall_health.total_gpa_point.year}</td>
                {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range)}
            </tr>
            <tr className="progress_table">
                <td className="progress_table">Overall Health GPA</td>
                <td className=" progress_table">{this.gpascoreDecimal(this.state.summary.overall_health.overall_health_gpa.today)}</td>
                <td className=" progress_table">{this.gpascoreDecimal(this.state.summary.overall_health.overall_health_gpa.yesterday)}</td>
                <td className=" progress_table">{this.gpascoreDecimal(this.state.summary.overall_health.overall_health_gpa.week)}</td>
                <td className=" progress_table">{this.gpascoreDecimal(this.state.summary.overall_health.overall_health_gpa.month)}</td>
                <td className=" progress_table">{this.gpascoreDecimal(this.state.summary.overall_health.overall_health_gpa.year)}</td>
                { this.gpascoreCustomRangeTD(this.state.summary.overall_health.overall_health_gpa.custom_range)}
            </tr>
            <tr className="progress_table">
            <td className="progress_table">Rank against other users</td>
                {this.renderTablesTd(this.state.rankData.oh_gpa)}
            </tr>
             <tr className=" progress_table">
                <td className=" progress_table">Overall Health GPA Grade</td>                
                <td className=" progress_table">{this.state.summary.overall_health.overall_health_gpa_grade.today}</td>
                <td className=" progress_table">{this.state.summary.overall_health.overall_health_gpa_grade.yesterday}</td>
                <td className=" progress_table">{this.state.summary.overall_health.overall_health_gpa_grade.week}</td>
                <td className=" progress_table">{this.state.summary.overall_health.overall_health_gpa_grade.month}</td>
                <td className=" progress_table">{this.state.summary.overall_health.overall_health_gpa_grade.year}</td>
                {this.renderCustomRangeTD(this.state.summary.overall_health.overall_health_gpa_grade.custom_range)}
            </tr>
        </tbody>
    </table>
</span>
</div>
}
{this.state.active_view &&
<div className="row justify-content-center padding">
  <div className = "table table-responsive">
     <table className = "table table-striped table-bordered">
         <thead>
           
                <tr className="progress_table">
                <th className="progress_table">Movement Consistency</th>                 
                <th className="progress_table">Today<br/>{moment(this.state.duration_date.today).format('MMM DD, YYYY')}</th>
                <th className="progress_table">Yesterday<br/>{moment(this.state.duration_date.yesterday).format('MMM DD, YYYY')}</th>
               <th className="progress_table">Avg Last 7 Days<br/>{this.headerDates(this.state.duration_date.week)}</th>
                <th className="progress_table">Avg Last 30 Days<br/>{this.headerDates(this.state.duration_date.month)}</th>
                <th className="progress_table">Avg Year to Date<br/>{this.headerDates(this.state.duration_date.year)}</th>
                {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
            </tr>
           
        </thead>
        <tbody>
            <tr className="progress_table">
                <td className="progress_table">Movement Consistency Score</td>
                <td className="progress_table">{this.state.summary.mc.movement_consistency_score.today}</td>
                <td className="progress_table">{this.state.summary.mc.movement_consistency_score.yesterday}</td>
                <td className="progress_table">{this.state.summary.mc.movement_consistency_score.week}</td>
                <td className="progress_table">{this.state.summary.mc.movement_consistency_score.month}</td>
                <td className="progress_table">{this.state.summary.mc.movement_consistency_score .year}</td>
                {this.renderCustomRangeTD(this.state.summary.mc.movement_consistency_score.custom_range)}
            </tr>
            <tr className="progress_table">
            <td className="progress_table">Rank against other users</td>
               {this.renderTablesTd(this.state.rankData.mc)}
            </tr>
            <tr className="progress_table">
                <td className="progress_table">Movement Consistency Grade</td>
                <td className="progress_table">{this.state.summary.mc.movement_consistency_grade.today}</td>
                <td className="progress_table">{this.state.summary.mc.movement_consistency_grade.yesterday}</td>
                <td className="progress_table">{this.state.summary.mc.movement_consistency_grade.week}</td>
                <td className="progress_table">{this.state.summary.mc.movement_consistency_grade.month}</td>
                <td className="progress_table">{this.state.summary.mc.movement_consistency_grade .year}</td>
                {this.renderCustomRangeTD(this.state.summary.mc.movement_consistency_grade.custom_range)}
            </tr>
            <tr className="progress_table">
                <td className="progress_table">Movement Consistency GPA</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.mc.movement_consistency_gpa.today)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.mc.movement_consistency_gpa.yesterday)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.mc.movement_consistency_gpa.week)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.mc.movement_consistency_gpa.month)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.mc.movement_consistency_gpa .year)}</td>
                {this.gpascoreCustomRangeTD(this.state.summary.mc.movement_consistency_gpa.custom_range)}
            </tr>
        </tbody>
    </table>
</div> 
</div>     
}

{this.state.active_view &&
<div className="row justify-content-center padding">
  <div className = "table table-responsive">
     <table className = "table table-striped table-bordered">
        <thead>
            <tr className="progress_table">
                
                <th className="progress_table">Non Exercise Steps</th>    
                <th className="progress_table">Today<br/>{moment(this.state.duration_date.today).format('MMM DD, YYYY')}</th>
                <th className="progress_table">Yesterday<br/>{moment(this.state.duration_date.yesterday).format('MMM DD, YYYY')}</th>
                <th className="progress_table">Avg Last 7 Days<br/>{this.headerDates(this.state.duration_date.week)}</th>
                <th className="progress_table">Avg Last 30 Days<br/>{this.headerDates(this.state.duration_date.month)}</th>
                <th className="progress_table">Avg Year to Date<br/>{this.headerDates(this.state.duration_date.year)}</th>
                {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
            
            </tr>
        </thead>
        <tbody>
            <tr className="progress_table">
                <td className="progress_table">Non Exercise Steps</td>
                <td className="progress_table">{this.nonExerciseSteps(this.state.summary.non_exercise.non_exercise_steps.today)}</td>
                <td className="progress_table">{this.nonExerciseSteps(this.state.summary.non_exercise.non_exercise_steps.yesterday)}</td>
                <td className="progress_table">{this.nonExerciseSteps(this.state.summary.non_exercise.non_exercise_steps.week)}</td>
                <td className="progress_table">{this.nonExerciseSteps(this.state.summary.non_exercise.non_exercise_steps.month)}</td>
                <td className="progress_table">{this.nonExerciseSteps(this.state.summary.non_exercise.non_exercise_steps.year)}</td>
                 {this.renderCustomRangeTDSteps(this.state.summary.non_exercise.non_exercise_steps.custom_range)}
            </tr>
            <tr className="progress_table">
                 <td className="progress_table">Rank against other users</td>
                 {this.renderTablesTd(this.state.rankData.mne_gpa)}
            </tr>
            <tr className="progress_table">
                <td className="progress_table">Movement-Non Exercise Steps Grade</td>            
                <td className="progress_table">{this.state.summary.non_exercise.movement_non_exercise_step_grade.today}</td>
                <td className="progress_table">{this.state.summary.non_exercise.movement_non_exercise_step_grade.yesterday}</td>
                <td className="progress_table">{this.state.summary.non_exercise.movement_non_exercise_step_grade.week}</td>
                <td className="progress_table">{this.state.summary.non_exercise.movement_non_exercise_step_grade.month}</td>
                <td className="progress_table">{this.state.summary.non_exercise.movement_non_exercise_step_grade.year}</td>
                {this.renderCustomRangeTD(this.state.summary.non_exercise.movement_non_exercise_step_grade.custom_range)}
            </tr>
            <tr className="progress_table">
                <td className="progress_table">Non Exercise Steps GPA</td>                
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.non_exercise.non_exericse_steps_gpa.today)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.non_exercise.non_exericse_steps_gpa.yesterday)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.non_exercise.non_exericse_steps_gpa.week)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.non_exercise.non_exericse_steps_gpa.month)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.non_exercise.non_exericse_steps_gpa.year)}</td>
                {this.gpascoreCustomRangeTD(this.state.summary.non_exercise.non_exericse_steps_gpa.custom_range)}
            </tr>
             <tr className="progress_table">
                <td className="progress_table">Total Steps</td>
                <td className="progress_table">{this.nonExerciseSteps(this.state.summary.non_exercise.total_steps.today)}</td>
                <td className="progress_table">{this.nonExerciseSteps(this.state.summary.non_exercise.total_steps.yesterday)}</td>
                <td className="progress_table">{this.nonExerciseSteps(this.state.summary.non_exercise.total_steps.week)}</td>
                <td className="progress_table">{this.nonExerciseSteps(this.state.summary.non_exercise.total_steps.month)}</td>
                <td className="progress_table">{this.nonExerciseSteps(this.state.summary.non_exercise.total_steps.year)}</td>
                {this.renderCustomRangeTDSteps(this.state.summary.non_exercise.total_steps.custom_range)}
            </tr>
        </tbody>
    </table>
</div>
</div>
}
{this.state.active_view &&
<div className="row justify-content-center padding">
 <div className = "table table-responsive">
 <table className = "table table-striped table-bordered">
        <thead>
            <tr className="progress_table">
                
                <th className="progress_table">Nutrition</th>
                <th className="progress_table">Today<br/>{moment(this.state.duration_date.today).format('MMM DD, YYYY')}</th>
                <th className="progress_table">Yesterday<br/>{moment(this.state.duration_date.yesterday).format('MMM DD, YYYY')}</th>
               <th className="progress_table">Avg Last 7 Days<br/>{this.headerDates(this.state.duration_date.week)}</th>
                <th className="progress_table">Avg Last 30 Days<br/>{this.headerDates(this.state.duration_date.month)}</th>
                <th className="progress_table">Avg Year to Date<br/>{this.headerDates(this.state.duration_date.year)}</th>
                {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
            
            </tr>
        </thead>
        <tbody>
            <tr className="progress_table">
                <td className="progress_table">% of Unprocessed Food Consumed</td>               
                <td className="progress_table">{this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.today}</td>
                <td className="progress_table">{this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.yesterday}</td>
                <td className="progress_table">{this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.week}</td>
                <td className="progress_table">{this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.month}</td>
                <td className="progress_table">{this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.year}</td>
                {this.renderCustomRangeTD(this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.custom_range)}
            </tr>
            <tr className="progress_table">
              <td className="progress_table">Rank against other users</td>
                 {this.renderTablesTd(this.state.rankData.prcnt_uf)}
            </tr>
            <tr className="progress_table">
                <td className="progress_table">% Non Processed Food Consumed Grade</td>
                <td className="progress_table">{this.state.summary.nutrition.prcnt_unprocessed_food_grade.today}</td>
                <td className="progress_table">{this.state.summary.nutrition.prcnt_unprocessed_food_grade.yesterday}</td>
                <td className="progress_table">{this.state.summary.nutrition.prcnt_unprocessed_food_grade.week}</td>
                <td className="progress_table">{this.state.summary.nutrition.prcnt_unprocessed_food_grade.month}</td>
                <td className="progress_table">{this.state.summary.nutrition.prcnt_unprocessed_food_grade.year}</td>
                {this.renderCustomRangeTD(this.state.summary.nutrition.prcnt_unprocessed_food_grade.custom_range)}
            </tr>
            <tr className="progress_table">
                <td className="progress_table">% Non Processed Food Consumed GPA</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.nutrition.prcnt_unprocessed_food_gpa.today)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.nutrition.prcnt_unprocessed_food_gpa.yesterday)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.nutrition.prcnt_unprocessed_food_gpa.week)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.nutrition.prcnt_unprocessed_food_gpa.month)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.nutrition.prcnt_unprocessed_food_gpa.year)}</td>
                {this.gpascoreCustomRangeTD(this.state.summary.nutrition.prcnt_unprocessed_food_gpa.custom_range)}
            </tr>
        </tbody>
    </table>
</div>
</div>
}
{this.state.active_view &&
<div className="row justify-content-center padding">
 <div className = "table table-responsive">
 <table className = "table table-striped table-bordered">
        <thead>
            <tr className="progress_table">
                <th className="progress_table">Alcohol</th>
                <th className="progress_table">Today<br/>{moment(this.state.duration_date.today).format('MMM DD, YYYY')}</th>
                <th className="progress_table">Yesterday<br/>{moment(this.state.duration_date.yesterday).format('MMM DD, YYYY')}</th>
               <th className="progress_table">Avg Last 7 Days<br/>{this.headerDates(this.state.duration_date.week)}</th>
                <th className="progress_table">Avg Last 30 Days<br/>{this.headerDates(this.state.duration_date.month)}</th>
                <th className="progress_table">Avg Year to Date<br/>{this.headerDates(this.state.duration_date.year)}</th>
                {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
            </tr>
        </thead>
        <tbody>
            <tr className="progress_table">
                <td className="progress_table">Average Drinks Per Week (7 Days)</td>
                <td className="progress_table">{this.state.summary.alcohol.avg_drink_per_week.today}</td>
                <td className="progress_table">{this.state.summary.alcohol.avg_drink_per_week.yesterday}</td>
                <td className="progress_table">{this.state.summary.alcohol.avg_drink_per_week.week}</td>
                <td className="progress_table">{this.state.summary.alcohol.avg_drink_per_week.month}</td>
                <td className="progress_table">{this.state.summary.alcohol.avg_drink_per_week.year}</td>
                {this.renderCustomRangeTD(this.state.summary.alcohol.avg_drink_per_week.custom_range)}
            </tr>
            <tr className="progress_table">
              <td className="progress_table">Rank against other users</td>
                 {this.renderTablesTd(this.state.rankData.alcohol_drink)}
            </tr>
            <tr className="progress_table">
                <td className="progress_table">Alcoholic drinks per week Grade</td>               
                <td className="progress_table">{this.state.summary.alcohol.alcoholic_drinks_per_week_grade.today}</td>
                <td className="progress_table">{this.state.summary.alcohol.alcoholic_drinks_per_week_grade.yesterday}</td>
                <td className="progress_table">{this.state.summary.alcohol.alcoholic_drinks_per_week_grade.week}</td>
                <td className="progress_table">{this.state.summary.alcohol.alcoholic_drinks_per_week_grade.month}</td>
                <td className="progress_table">{this.state.summary.alcohol.alcoholic_drinks_per_week_grade.year}</td>
                {this.renderCustomRangeTD(this.state.summary.alcohol.alcoholic_drinks_per_week_grade.custom_range)}
            </tr>
            <tr className="progress_table">
                <td className="progress_table">Alcoholic drinks per week GPA</td>                
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.today)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.yesterday)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.week)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.month)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.year)}</td>
                {this.gpascoreCustomRangeTD(this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.custom_range)}
            </tr>
             <tr className="progress_table">
                <td className="progress_table">% of Days Alcohol Consumption Reported</td>               
                <td className="progress_table">{this.state.summary.alcohol.prcnt_alcohol_consumption_reported.today}</td>
                <td className="progress_table">{this.state.summary.alcohol.prcnt_alcohol_consumption_reported.yesterday}</td>
                <td className="progress_table">{this.state.summary.alcohol.prcnt_alcohol_consumption_reported.week}</td>
                <td className="progress_table">{this.state.summary.alcohol.prcnt_alcohol_consumption_reported.month}</td>
                <td className="progress_table">{this.state.summary.alcohol.prcnt_alcohol_consumption_reported.year}</td>
                {this.renderCustomRangeTD(this.state.summary.alcohol.prcnt_alcohol_consumption_reported.custom_range)}
            </tr>
        </tbody>
    </table>
</div>
</div>
}
{this.state.active_view &&
<div className="row justify-content-center padding">
 <div className = "table table-responsive">
 <table className = "table  table-striped table-bordered">
        <thead>
            <tr className="progress_table">
                
                <th className="progress_table">Exercise Consistency</th>
                <th className="progress_table">Today<br/>{moment(this.state.duration_date.today).format('MMM DD, YYYY')}</th>
                <th className="progress_table">Yesterday<br/>{moment(this.state.duration_date.yesterday).format('MMM DD, YYYY')}</th>
                <th className="progress_table">Avg Last 7 Days<br/>{this.headerDates(this.state.duration_date.week)}</th>
                <th className="progress_table">Avg Last 30 Days<br/>{this.headerDates(this.state.duration_date.month)}</th>
                <th className="progress_table">Avg Year to Date<br/>{this.headerDates(this.state.duration_date.year)}</th>
                {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}

            </tr>
        </thead>
        <tbody>
            <tr className="progress_table">
                <td className="progress_table">Avg # of Days Exercised/Week</td>
                <td className="progress_table">{this.state.summary.ec.avg_no_of_days_exercises_per_week.today}</td>
                <td className="progress_table">{this.state.summary.ec.avg_no_of_days_exercises_per_week.yesterday}</td>
                <td className="progress_table">{this.state.summary.ec.avg_no_of_days_exercises_per_week.week}</td>
                <td className="progress_table">{this.state.summary.ec.avg_no_of_days_exercises_per_week.month}</td>
                <td className="progress_table">{this.state.summary.ec.avg_no_of_days_exercises_per_week.year}</td>
                {this.renderCustomRangeTD(this.state.summary.ec.avg_no_of_days_exercises_per_week.custom_range)}

            </tr>
            <tr className="progress_table">
              <td className="progress_table">Rank against other users</td>
                {this.renderTablesTd(this.state.rankData.ec)}
            </tr>
            <tr className="progress_table">
                <td className="progress_table">Exercise Consistency Grade</td>
                <td className="progress_table">{this.state.summary.ec.exercise_consistency_grade.today}</td>
                <td className="progress_table">{this.state.summary.ec.exercise_consistency_grade.yesterday}</td>
                <td className="progress_table">{this.state.summary.ec.exercise_consistency_grade.week}</td>
                <td className="progress_table">{this.state.summary.ec.exercise_consistency_grade.month}</td>
                <td className="progress_table">{this.state.summary.ec.exercise_consistency_grade.year}</td>
                {this.renderCustomRangeTD(this.state.summary.ec.exercise_consistency_grade.custom_range)}
            </tr>
            <tr className="progress_table">
                <td className="progress_table">Exercise Consistency GPA</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.ec.exercise_consistency_gpa.today)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.ec.exercise_consistency_gpa.yesterday)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.ec.exercise_consistency_gpa.week)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.ec.exercise_consistency_gpa.month)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.ec.exercise_consistency_gpa .year)}</td>
                {this.gpascoreCustomRangeTD(this.state.summary.ec.exercise_consistency_gpa.custom_range)}
            </tr>
        </tbody>
    </table>
</div>
</div>
}
{this.state.active_view &&
<div className="row justify-content-center padding">
<div className = "table table-responsive">
 <table className = "table table-striped table-bordered">
        <thead>
            <tr className="progress_table">
                
                <th className="progress_table">Exercise Stats</th>               
                <th className="progress_table">Today<br/>{moment(this.state.duration_date.today).format('MMM DD, YYYY')}</th>
                <th className="progress_table">Yesterday<br/>{moment(this.state.duration_date.yesterday).format('MMM DD, YYYY')}</th>
               <th className="progress_table">Avg Last 7 Days<br/>{this.headerDates(this.state.duration_date.week)}</th>
                <th className="progress_table">Avg Last 30 Days<br/>{this.headerDates(this.state.duration_date.month)}</th>
                <th className="progress_table">Avg Year to Date<br/>{this.headerDates(this.state.duration_date.year)}</th>
                 {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
            </tr>
        </thead>
        <tbody>
            <tr className="progress_table">
                <td className="progress_table">Workout Duration (hours:minutes)</td>        
                <td className="progress_table">{this.exerciseStatsNoWorkOut(this.state.summary.exercise.workout_duration_hours_min.today)}</td>
                <td className="progress_table">{this.exerciseStatsNoWorkOut(this.state.summary.exercise.workout_duration_hours_min.yesterday)}</td>
                <td className="progress_table">{this.exerciseStatsNoWorkOut(this.state.summary.exercise.workout_duration_hours_min.week)}</td>
                <td className="progress_table">{this.exerciseStatsNoWorkOut(this.state.summary.exercise.workout_duration_hours_min.month)}</td>
                <td className="progress_table">{this.exerciseStatsNoWorkOut(this.state.summary.exercise.workout_duration_hours_min.year)}</td>
                {this.renderExerciseCustomRangeTD(this.state.summary.exercise.workout_duration_hours_min.custom_range)}
            </tr>
            <tr className="progress_table">
                <td className="progress_table">Workout Effort Level</td>              
                <td className="progress_table">{this.exerciseStatsNoWorkOut(this.state.summary.exercise.workout_effort_level.today)}</td>
                <td className="progress_table">{this.exerciseStatsNoWorkOut(this.state.summary.exercise.workout_effort_level.yesterday)}</td>
                <td className="progress_table">{this.exerciseStatsNoWorkOut(this.state.summary.exercise.workout_effort_level.week)}</td>
                <td className="progress_table">{this.exerciseStatsNoWorkOut(this.state.summary.exercise.workout_effort_level.month)}</td>
                <td className="progress_table">{this.exerciseStatsNoWorkOut(this.state.summary.exercise.workout_effort_level.year)}</td>
                {this.renderExerciseCustomRangeTD(this.state.summary.exercise.workout_effort_level.custom_range)}
            </tr>
             <tr className="progress_table">
                <td className="progress_table">Average Exercise Heart Rate</td>               
                <td className="progress_table">{this.exerciseStatsNoWorkOut(this.state.summary.exercise.avg_exercise_heart_rate.today)}</td>
                <td className="progress_table">{this.exerciseStatsNoWorkOut(this.state.summary.exercise.avg_exercise_heart_rate.yesterday)}</td>
                <td className="progress_table">{this.exerciseStatsNoWorkOut(this.state.summary.exercise.avg_exercise_heart_rate.week)}</td>
                <td className="progress_table">{this.exerciseStatsNoWorkOut(this.state.summary.exercise.avg_exercise_heart_rate.month)}</td>
                <td className="progress_table">{this.exerciseStatsNoWorkOut(this.state.summary.exercise.avg_exercise_heart_rate.year)}</td>
                {this.renderExerciseCustomRangeTD(this.state.summary.exercise.avg_exercise_heart_rate.custom_range)}
            </tr>
             <tr className="progress_table">
                <td className="progress_table">VO2 Max</td>
                <td className="progress_table">{this.vo2MaxNotReported(this.state.summary.exercise.vo2_max.today)}</td>
                <td className="progress_table">{this.vo2MaxNotReported(this.state.summary.exercise.vo2_max.yesterday)}</td>
                <td className="progress_table">{this.vo2MaxNotReported(this.state.summary.exercise.vo2_max.week)}</td>
                <td className="progress_table">{this.vo2MaxNotReported(this.state.summary.exercise.vo2_max.month)}</td>
                <td className="progress_table">{this.vo2MaxNotReported(this.state.summary.exercise.vo2_max.year)}</td>
                {this.renderVo2maxCustomRangeTD(this.state.summary.exercise.vo2_max.custom_range)}
            </tr>

            
        </tbody>
    </table>
</div>
</div>
}
{this.state.active_view &&

<div className="row justify-content-center padding">
  <div className = "table table-responsive">
    <table className = "table table-striped table-bordered ">
         <thead>
            <tr className="progress_table">
                
                <th className="progress_table">Other Stats</th>               
                <th className="progress_table">Today<br/>{moment(this.state.duration_date.today).format('MMM DD, YYYY')}</th>
                <th className="progress_table">Yesterday<br/>{moment(this.state.duration_date.yesterday).format('MMM DD, YYYY')}</th>
               <th className="progress_table">Avg Last 7 Days<br/>{this.headerDates(this.state.duration_date.week)}</th>
                <th className="progress_table">Avg Last 30 Days<br/>{this.headerDates(this.state.duration_date.month)}</th>
                <th className="progress_table">Avg Year to Date<br/>{this.headerDates(this.state.duration_date.year)}</th>
                 {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
            
            </tr>
        </thead>
        <tbody>
            <tr className="progress_table">
                <td className="progress_table">Resting Heart Rate (RHR)</td>            
                <td className="progress_table">{this.state.summary.other.resting_hr.today}</td>
                <td className="progress_table">{this.state.summary.other.resting_hr.yesterday}</td>
                <td className="progress_table">{this.state.summary.other.resting_hr.week}</td>
                <td className="progress_table">{this.state.summary.other.resting_hr.month}</td>
                <td className="progress_table">{this.state.summary.other.resting_hr.year}</td>
                 {this.renderCustomRangeTD(this.state.summary.other.resting_hr.custom_range)}
            </tr>
            <tr className="progress_table">
                <td className="progress_table">HRR (time to 99)</td>
                <td className="progress_table">{this.state.summary.other.hrr_time_to_99.today}</td>
                <td className="progress_table">{this.state.summary.other.hrr_time_to_99.yesterday}</td>
                <td className="progress_table">{this.state.summary.other.hrr_time_to_99.week}</td>
                <td className="progress_table">{this.state.summary.other.hrr_time_to_99.month}</td>
                <td className="progress_table">{this.state.summary.other.hrr_time_to_99.year}</td>
                {this.renderCustomRangeTD(this.state.summary.other.hrr_time_to_99.custom_range)}
            </tr>
            <tr className="progress_table">
               <td className="progress_table">HRR (heart beats lowered in 1st minute)</td>               
                <td className="progress_table">{this.state.summary.other.hrr_beats_lowered_in_first_min.today}</td>
                <td className="progress_table">{this.state.summary.other.hrr_beats_lowered_in_first_min.yesterday}</td>
                <td className="progress_table">{this.state.summary.other.hrr_beats_lowered_in_first_min.week}</td>
                <td className="progress_table">{this.state.summary.other.hrr_beats_lowered_in_first_min.month}</td>
                <td className="progress_table">{this.state.summary.other.hrr_beats_lowered_in_first_min.year}</td>
                {this.renderCustomRangeTD(this.state.summary.other.hrr_beats_lowered_in_first_min.custom_range)}
            </tr>
            <tr className="progress_table">
                <td className="progress_table">HRR (higest heart rate in 1st minute)</td>               
                <td className="progress_table">{this.state.summary.other.hrr_highest_hr_in_first_min.today}</td>
                <td className="progress_table">{this.state.summary.other.hrr_highest_hr_in_first_min.yesterday}</td>
                <td className="progress_table">{this.state.summary.other.hrr_highest_hr_in_first_min.week}</td>
                <td className="progress_table">{this.state.summary.other.hrr_highest_hr_in_first_min.month}</td>
                <td className="progress_table">{this.state.summary.other.hrr_highest_hr_in_first_min.year}</td>
                {this.renderCustomRangeTD(this.state.summary.other.hrr_highest_hr_in_first_min.custom_range)}
            </tr>
            <tr className="progress_table">
                <td className="progress_table">HRR (lowest heart rate point)</td>     
                <td className="progress_table">{this.state.summary.other.hrr_lowest_hr_point.today}</td>
                <td className="progress_table">{this.state.summary.other.hrr_lowest_hr_point.yesterday}</td>
                <td className="progress_table">{this.state.summary.other.hrr_lowest_hr_point.week}</td>
                <td className="progress_table">{this.state.summary.other.hrr_lowest_hr_point.month}</td>
                <td className="progress_table">{this.state.summary.other.hrr_lowest_hr_point.year}</td>
                {this.renderCustomRangeTD(this.state.summary.other.hrr_lowest_hr_point.custom_range)}
            </tr>
             <tr className="progress_table">
                <td className="progress_table">Floors Climbed</td>
                <td className="progress_table">{this.state.summary.other.floors_climbed.today}</td>
                <td className="progress_table">{this.state.summary.other.floors_climbed.yesterday}</td>
                <td className="progress_table">{this.state.summary.other.floors_climbed.week}</td>
                <td className="progress_table">{this.state.summary.other.floors_climbed.month}</td>
                <td className="progress_table">{this.state.summary.other.floors_climbed.year}</td>
                {this.renderCustomRangeTD(this.state.summary.other.floors_climbed.custom_range)}
            </tr>
        </tbody>
    </table>
</div> 
</div> 
}
{this.state.active_view &&    
<div className=" row justify-content-center padding">
<div className = "table table-responsive">
    <table className = "table table-striped table-bordered">
         <thead>
             
                <tr className="progress_table">
                  <th className="progress_table">Sleep Per Night (excluding awake time)</th>               
                <th className="progress_table">Today<br/>{moment(this.state.duration_date.today).format('MMM DD, YYYY')}</th>
                <th className="progress_table">Yesterday<br/>{moment(this.state.duration_date.yesterday).format('MMM DD, YYYY')}</th>
               <th className="progress_table">Avg Last 7 Days<br/>{this.headerDates(this.state.duration_date.week)}</th>
                <th className="progress_table">Avg Last 30 Days<br/>{this.headerDates(this.state.duration_date.month)}</th>
                <th className="progress_table">Avg Year to Date<br/>{this.headerDates(this.state.duration_date.year)}</th>
                {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
            </tr>
            
        </thead>
        <tbody>
            <tr className="progress_table">
                <td className="progress_table">Total Sleep in hours:minutes</td>
                <td className="progress_table">{this.state.summary.sleep.total_sleep_in_hours_min.today}</td>
                <td className="progress_table">{this.state.summary.sleep.total_sleep_in_hours_min.yesterday}</td>
                <td className="progress_table">{this.state.summary.sleep.total_sleep_in_hours_min.week}</td>
                <td className="progress_table">{this.state.summary.sleep.total_sleep_in_hours_min.month}</td>
                <td className="progress_table">{this.state.summary.sleep.total_sleep_in_hours_min.year}</td>
                 {this.renderCustomRangeTD(this.state.summary.sleep.total_sleep_in_hours_min.custom_range)}
            </tr>
            <tr className="progress_table">
               <td className="progress_table">Rank against other users</td>
                {this.renderTablesTd(this.state.rankData.avg_sleep)}
            </tr>
            <tr className="progress_table">
                <td className="progress_table">Average Sleep Grade</td>
                <td className="progress_table">{this.state.summary.sleep.average_sleep_grade.today}</td>
                <td className="progress_table">{this.state.summary.sleep.average_sleep_grade.yesterday}</td>
                <td className="progress_table">{this.state.summary.sleep.average_sleep_grade.week}</td>
                <td className="progress_table">{this.state.summary.sleep.average_sleep_grade.month}</td>
                <td className="progress_table">{this.state.summary.sleep.average_sleep_grade.year}</td>
                {this.renderCustomRangeTD(this.state.summary.sleep.average_sleep_grade.custom_range)}
            </tr>
            <tr className="progress_table">
                <td className="progress_table"># of Days Sleep Aid Taken in Period</td>
                <td className="progress_table">{this.state.summary.sleep.num_days_sleep_aid_taken_in_period.today}</td>
                <td className="progress_table">{this.state.summary.sleep.num_days_sleep_aid_taken_in_period.yesterday}</td>
                <td className="progress_table">{this.state.summary.sleep.num_days_sleep_aid_taken_in_period.week}</td>
                <td className="progress_table">{this.state.summary.sleep.num_days_sleep_aid_taken_in_period.month}</td>
                <td className="progress_table">{this.state.summary.sleep.num_days_sleep_aid_taken_in_period.year}</td>
                {this.renderCustomRangeTD(this.state.summary.sleep.num_days_sleep_aid_taken_in_period.custom_range)}
            </tr>
            <tr className="progress_table">
                <td className="progress_table">% of Days Sleep Aid Taken in Period</td>
                <td className="progress_table">{this.state.summary.sleep.prcnt_days_sleep_aid_taken_in_period.today}</td>
                <td className="progress_table">{this.state.summary.sleep.prcnt_days_sleep_aid_taken_in_period.yesterday}</td>
                <td className="progress_table">{this.state.summary.sleep.prcnt_days_sleep_aid_taken_in_period.week}</td>
                <td className="progress_table">{this.state.summary.sleep.prcnt_days_sleep_aid_taken_in_period.month}</td>
                <td className="progress_table">{this.state.summary.sleep.prcnt_days_sleep_aid_taken_in_period.year}</td>
                {this.renderCustomRangeTD(this.state.summary.sleep.prcnt_days_sleep_aid_taken_in_period.custom_range)}
            </tr>
            {/*<tr className="progress_table">
                <td className="progress_table">Overall Sleep GPA</td>
               {this.gpascoreCustomRangeTD(this.state.summary.sleep.overall_sleep_gpa.custom_range)}
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.sleep.overall_sleep_gpa.today)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.sleep.overall_sleep_gpa.yesterday)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.sleep.overall_sleep_gpa.week)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.sleep.overall_sleep_gpa.month)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.sleep.overall_sleep_gpa.year)}</td>
            </tr>*/}
        </tbody>
    </table>

    </div> 
    </div>
}
{this.state.active_view &&
<div className=" row justify-content-center padding">
<div className = "table table-responsive">
    <table className = "table table-striped table-bordered">
         <thead>
             
                <tr className="progress_table">
                  <th className="progress_table">Sick</th>
                <th className="progress_table">Today<br/>{moment(this.state.duration_date.today).format('MMM DD, YYYY')}</th>
                <th className="progress_table">Yesterday<br/>{moment(this.state.duration_date.yesterday).format('MMM DD, YYYY')}</th>
               <th className="progress_table">Avg Last 7 Days<br/>{this.headerDates(this.state.duration_date.week)}</th>
                <th className="progress_table">Avg Last 30 Days<br/>{this.headerDates(this.state.duration_date.month)}</th>
                <th className="progress_table">Avg Year to Date<br/>{this.headerDates(this.state.duration_date.year)}</th>
                {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
            </tr>
            
        </thead>
        <tbody>
            <tr className="progress_table">
               <td className="progress_table">Number of Days Not Sick</td>
                <td className="progress_table">{this.state.summary.sick.number_of_days_not_sick.today}</td>
                <td className="progress_table">{this.state.summary.sick.number_of_days_not_sick.yesterday}</td>
                <td className="progress_table">{this.state.summary.sick.number_of_days_not_sick.week}</td>
                <td className="progress_table">{this.state.summary.sick.number_of_days_not_sick.month}</td>
                <td className="progress_table">{this.state.summary.sick.number_of_days_not_sick.year}</td>
                {this.renderCustomRangeTD(this.state.summary.sick.number_of_days_not_sick.custom_range)}
            </tr>
             <tr className="progress_table">
                <td className="progress_table">% of Days Not Sick</td>                
                <td className="progress_table">{this.state.summary.sick.prcnt_of_days_not_sick.today}</td>
                <td className="progress_table">{this.state.summary.sick.prcnt_of_days_not_sick.yesterday}</td>
                <td className="progress_table">{this.state.summary.sick.prcnt_of_days_not_sick.week}</td>
                <td className="progress_table">{this.state.summary.sick.prcnt_of_days_not_sick.month}</td>
                <td className="progress_table">{this.state.summary.sick.prcnt_of_days_not_sick.year}</td>
                {this.renderCustomRangeTD(this.state.summary.sick.prcnt_of_days_not_sick.custom_range)}
            </tr>
            <tr className="progress_table">
                <td className="progress_table">Number of Days Sick</td>
                <td className="progress_table">{this.state.summary.sick.number_of_days_sick.today}</td>
                <td className="progress_table">{this.state.summary.sick.number_of_days_sick.yesterday}</td>
                <td className="progress_table">{this.state.summary.sick.number_of_days_sick.week}</td>
                <td className="progress_table">{this.state.summary.sick.number_of_days_sick.month}</td>
                <td className="progress_table">{this.state.summary.sick.number_of_days_sick.year}</td>
                {this.renderCustomRangeTD(this.state.summary.sick.number_of_days_sick.custom_range)}
            </tr>
            <tr className="progress_table">
                <td className="progress_table">% of Days Sick</td>
                <td className="progress_table">{this.state.summary.sick.prcnt_of_days_sick.today}</td>
                <td className="progress_table">{this.state.summary.sick.prcnt_of_days_sick.yesterday}</td>
                <td className="progress_table">{this.state.summary.sick.prcnt_of_days_sick.week}</td>
                <td className="progress_table">{this.state.summary.sick.prcnt_of_days_sick.month}</td>
                <td className="progress_table">{this.state.summary.sick.prcnt_of_days_sick.year}</td>
                {this.renderCustomRangeTD(this.state.summary.sick.prcnt_of_days_sick.custom_range)}
            </tr>
             <tr className="progress_table">
                <td className="progress_table">Days Sick/Not Sick Reported</td>
                <td className="progress_table">{this.state.summary.sick.days_sick_not_sick_reported.today}</td>
                <td className="progress_table">{this.state.summary.sick.days_sick_not_sick_reported.yesterday}</td>
                <td className="progress_table">{this.state.summary.sick.days_sick_not_sick_reported.week}</td>
                <td className="progress_table">{this.state.summary.sick.days_sick_not_sick_reported.month}</td>
                <td className="progress_table">{this.state.summary.sick.days_sick_not_sick_reported.year}</td>
                {this.renderCustomRangeTD(this.state.summary.sick.days_sick_not_sick_reported.custom_range)}
            </tr>
        </tbody>
    </table>
    </div> 
    </div>
}
{this.state.active_view &&
<div className=" row justify-content-center padding">
<div className = "table table-responsive">
    <table className = "table table-striped table-bordered">
         <thead>
                <tr className="progress_table">
                  <th className="progress_table">Stress</th>
                <th className="progress_table">Today<br/>{moment(this.state.duration_date.today).format('MMM DD, YYYY')}</th>
                <th className="progress_table">Yesterday<br/>{moment(this.state.duration_date.yesterday).format('MMM DD, YYYY')}</th>
               <th className="progress_table">Avg Last 7 Days<br/>{this.headerDates(this.state.duration_date.week)}</th>
                <th className="progress_table">Avg Last 30 Days<br/>{this.headerDates(this.state.duration_date.month)}</th>
                <th className="progress_table">Avg Year to Date<br/>{this.headerDates(this.state.duration_date.year)}</th>
                {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
            </tr>
            
        </thead>
        <tbody>
             <tr className="progress_table">
                <td className="progress_table">Number of Days Low Stress Reported</td>                
                <td className="progress_table">{this.state.summary.stress.number_of_days_low_stress_reported.today}</td>
                <td className="progress_table">{this.state.summary.stress.number_of_days_low_stress_reported.yesterday}</td>
                <td className="progress_table">{this.state.summary.stress.number_of_days_low_stress_reported.week}</td>
                <td className="progress_table">{this.state.summary.stress.number_of_days_low_stress_reported.month}</td>
                <td className="progress_table">{this.state.summary.stress.number_of_days_low_stress_reported.year}</td>
                {this.renderCustomRangeTD(this.state.summary.stress.number_of_days_low_stress_reported.custom_range)}
            </tr>
             <tr className="progress_table">
                <td className="progress_table">% of Days Low Stress</td>
                <td className="progress_table">{this.state.summary.stress.prcnt_of_days_low_stress.today}</td>
                <td className="progress_table">{this.state.summary.stress.prcnt_of_days_low_stress.yesterday}</td>
                <td className="progress_table">{this.state.summary.stress.prcnt_of_days_low_stress.week}</td>
                <td className="progress_table">{this.state.summary.stress.prcnt_of_days_low_stress.month}</td>
                <td className="progress_table">{this.state.summary.stress.prcnt_of_days_low_stress.year}</td>
                {this.renderCustomRangeTD(this.state.summary.stress.prcnt_of_days_low_stress.custom_range)}
            </tr>
             <tr className="progress_table">
                <td className="progress_table">Number of Days Medium Stress Reported</td>                
                <td className="progress_table">{this.state.summary.stress.number_of_days_medium_stress_reported.today}</td>
                <td className="progress_table">{this.state.summary.stress.number_of_days_medium_stress_reported.yesterday}</td>
                <td className="progress_table">{this.state.summary.stress.number_of_days_medium_stress_reported.week}</td>
                <td className="progress_table">{this.state.summary.stress.number_of_days_medium_stress_reported.month}</td>
                <td className="progress_table">{this.state.summary.stress.number_of_days_medium_stress_reported.year}</td>
                {this.renderCustomRangeTD(this.state.summary.stress.number_of_days_medium_stress_reported.custom_range)}
            </tr>
             <tr className="progress_table">
                <td className="progress_table">% of Days Medium Stress</td>
                <td className="progress_table">{this.state.summary.stress.prcnt_of_days_medium_stress.today}</td>
                <td className="progress_table">{this.state.summary.stress.prcnt_of_days_medium_stress.yesterday}</td>
                <td className="progress_table">{this.state.summary.stress.prcnt_of_days_medium_stress.week}</td>
                <td className="progress_table">{this.state.summary.stress.prcnt_of_days_medium_stress.month}</td>
                <td className="progress_table">{this.state.summary.stress.prcnt_of_days_medium_stress.year}</td>
                {this.renderCustomRangeTD(this.state.summary.stress.prcnt_of_days_medium_stress.custom_range)}
            </tr>
            <tr className="progress_table">
               <td className="progress_table">Number of Days High Stress Reported</td>                 
                <td className="progress_table">{this.state.summary.stress.number_of_days_high_stress_reported.today}</td>
                <td className="progress_table">{this.state.summary.stress.number_of_days_high_stress_reported.yesterday}</td>
                <td className="progress_table">{this.state.summary.stress.number_of_days_high_stress_reported.week}</td>
                <td className="progress_table">{this.state.summary.stress.number_of_days_high_stress_reported.month}</td>
                <td className="progress_table">{this.state.summary.stress.number_of_days_high_stress_reported.year}</td>
                {this.renderCustomRangeTD(this.state.summary.stress.number_of_days_high_stress_reported.custom_range)}
            </tr>
            <tr className="progress_table">
                <td className="progress_table">% of Days High Stress</td>
                <td className="progress_table">{this.state.summary.stress.prcnt_of_days_high_stress.today}</td>
                <td className="progress_table">{this.state.summary.stress.prcnt_of_days_high_stress.yesterday}</td>
                <td className="progress_table">{this.state.summary.stress.prcnt_of_days_high_stress.week}</td>
                <td className="progress_table">{this.state.summary.stress.prcnt_of_days_high_stress.month}</td>
                <td className="progress_table">{this.state.summary.stress.prcnt_of_days_high_stress.year}</td>
                {this.renderCustomRangeTD(this.state.summary.stress.prcnt_of_days_high_stress.custom_range)}
            </tr>
             <tr className="progress_table">
                <td className="progress_table">Number of Days Stress Level Reported</td>              
                <td className="progress_table">{this.state.summary.stress.days_stress_level_reported.today}</td>
                <td className="progress_table">{this.state.summary.stress.days_stress_level_reported.yesterday}</td>
                <td className="progress_table">{this.state.summary.stress.days_stress_level_reported.week}</td>
                <td className="progress_table">{this.state.summary.stress.days_stress_level_reported.month}</td>
                <td className="progress_table">{this.state.summary.stress.days_stress_level_reported.year}</td>
                {this.renderCustomRangeTD(this.state.summary.stress.days_stress_level_reported.custom_range)}
            </tr>
        </tbody>
    </table>
    </div> 
    </div>
  }
  {this.state.active_view &&
      <div className=" row justify-content-center padding">
      <div className = "table table-responsive">
      <table className = "table table-striped table-bordered">
         <thead>
                <tr className="progress_table">
                  <th className="progress_table">Standing</th>               
                <th className="progress_table">Today<br/>{moment(this.state.duration_date.today).format('MMM DD, YYYY')}</th>
                <th className="progress_table">Yesterday<br/>{moment(this.state.duration_date.yesterday).format('MMM DD, YYYY')}</th>
               <th className="progress_table">Avg Last 7 Days<br/>{this.headerDates(this.state.duration_date.week)}</th>
                <th className="progress_table">Avg Last 30 Days<br/>{this.headerDates(this.state.duration_date.month)}</th>
                <th className="progress_table">Avg Year to Date<br/>{this.headerDates(this.state.duration_date.year)}</th>
                {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
            </tr>
            
        </thead>
        <tbody>
            <tr className="progress_table">
                <td className="progress_table">Number of Days Stood more than 3 hours</td>               
                <td className="progress_table">{this.state.summary.standing.number_days_stood_three_hours.today}</td>
                <td className="progress_table">{this.state.summary.standing.number_days_stood_three_hours.yesterday}</td>
                <td className="progress_table">{this.state.summary.standing.number_days_stood_three_hours.week}</td>
                <td className="progress_table">{this.state.summary.standing.number_days_stood_three_hours.month}</td>
                <td className="progress_table">{this.state.summary.standing.number_days_stood_three_hours.year}</td>
                {this.renderCustomRangeTD(this.state.summary.standing.number_days_stood_three_hours.custom_range)}
            </tr>
            <tr className="progress_table">
                <td className="progress_table">% of Days Stood More Than 3 Hours</td>
                <td className="progress_table">{this.state.summary.standing.prcnt_days_stood_three_hours.today}</td>
                <td className="progress_table">{this.state.summary.standing.prcnt_days_stood_three_hours.yesterday}</td>
                <td className="progress_table">{this.state.summary.standing.prcnt_days_stood_three_hours.week}</td>
                <td className="progress_table">{this.state.summary.standing.prcnt_days_stood_three_hours.month}</td>
                <td className="progress_table">{this.state.summary.standing.prcnt_days_stood_three_hours.year}</td>
                 {this.renderCustomRangeTD(this.state.summary.standing.prcnt_days_stood_three_hours.custom_range)}
            </tr>
             <tr className="progress_table">
                <td className="progress_table">Number of Days Reported Standing/Not Standing more than 3 hours</td>       
                <td className="progress_table">{this.state.summary.standing.number_days_reported_stood_not_stood_three_hours.today}</td>
                <td className="progress_table">{this.state.summary.standing.number_days_reported_stood_not_stood_three_hours.yesterday}</td>
                <td className="progress_table">{this.state.summary.standing.number_days_reported_stood_not_stood_three_hours.week}</td>
                <td className="progress_table">{this.state.summary.standing.number_days_reported_stood_not_stood_three_hours.month}</td>
                <td className="progress_table">{this.state.summary.standing.number_days_reported_stood_not_stood_three_hours.year}</td>
                 {this.renderCustomRangeTD(this.state.summary.standing.number_days_reported_stood_not_stood_three_hours.custom_range)}
            </tr>
        </tbody>
    </table>
    </div> 
    </div>
  }
  {this.state.active_view &&
     <div className=" row justify-content-center padding">
      <div className = "table table-responsive">
      <table className = "table table-striped table-bordered">
         <thead>
                <tr className="progress_table">
                  <th className="progress_table">Travel</th>               
                <th className="progress_table">Today<br/>{moment(this.state.duration_date.today).format('MMM DD, YYYY')}</th>
                <th className="progress_table">Yesterday<br/>{moment(this.state.duration_date.yesterday).format('MMM DD, YYYY')}</th>
               <th className="progress_table">Avg Last 7 Days<br/>{this.headerDates(this.state.duration_date.week)}</th>
                <th className="progress_table">Avg Last 30 Days<br/>{this.headerDates(this.state.duration_date.month)}</th>
                <th className="progress_table">Avg Year to Date<br/>{this.headerDates(this.state.duration_date.year)}</th>
                {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
            </tr>
            
        </thead>
        <tbody>
            <tr className="progress_table">
                <td className="progress_table">Number of Days you Traveled/Stayed Away From Home?</td>
                <td className="progress_table">{this.state.summary.travel.number_days_travel_away_from_home.today}</td>
                <td className="progress_table">{this.state.summary.travel.number_days_travel_away_from_home.yesterday}</td>
                <td className="progress_table">{this.state.summary.travel.number_days_travel_away_from_home.week}</td>
                <td className="progress_table">{this.state.summary.travel.number_days_travel_away_from_home.month}</td>
                <td className="progress_table">{this.state.summary.travel.number_days_travel_away_from_home.year}</td>
                 {this.renderCustomRangeTD(this.state.summary.travel.number_days_travel_away_from_home.custom_range)}
            </tr>
            <tr className="progress_table">
                <td className="progress_table">% of Days you Traveled/Stayed Away From Home?</td>
                <td className="progress_table">{this.state.summary.travel.prcnt_days_travel_away_from_home.today}</td>
                <td className="progress_table">{this.state.summary.travel.prcnt_days_travel_away_from_home.yesterday}</td>
                <td className="progress_table">{this.state.summary.travel.prcnt_days_travel_away_from_home.week}</td>
                <td className="progress_table">{this.state.summary.travel.prcnt_days_travel_away_from_home.month}</td>
                <td className="progress_table">{this.state.summary.travel.prcnt_days_travel_away_from_home.year}</td>
                {this.renderCustomRangeTD(this.state.summary.travel.prcnt_days_travel_away_from_home.custom_range)}
            </tr>
        </tbody>
    </table>
    </div> 
    </div>
  }
        {this.state.btnView && 
            <AllRank_Data1 data={this.state.active_category} active_username = {this.state.active_username}/>
        }</div>
{this.renderProgressFetchOverlay()}
{this.renderProgress2FetchOverlay()}
{this.renderProgress3FetchOverlay()}
{this.renderProgressSelectedDateFetchOverlay()}
</div>      
            
            )
    }
}

function mapStateToProps(state){
  return {
    errorMessage: state.garmin_auth.error,
    message : state.garmin_auth.message
  };
}
export default connect(mapStateToProps,{getGarminToken,logoutUser})(withRouter(DashboardSummary));
Navbar.propTypes={
    fixed: PropTypes.string,
    color: PropTypes.string,
} 