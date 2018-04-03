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
import {renderProgressFetchOverlay,renderProgress2FetchOverlay,renderProgress3FetchOverlay,renderProgressSelectedDateFetchOverlay    } from './dashboard_healpers';

var CalendarWidget = require('react-calendar-widget');  

var ReactDOM = require('react-dom');

import { getGarminToken,logoutUser} from '../network/auth';

const catagory = ["oh_gpa","alcohol_drink","avg_sleep","prcnt_uf","total_steps","mc","ec"];
const duration = ["week","today","yesterday","year","month","custom_range"];

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
            }
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
        calendarOpen:false,
        dateRange1:false,
        dateRange2:false,
        dateRange3:false,
        fetching_ql1:false,
        fetching_ql2:false,
        fetching_ql3:false,
        fetching_ql4:false,
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
                 "rank":{
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
                   "rank":{
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
                 "rank":{
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
                     "rank":{
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
                 "rank":{
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
            "rank": {
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
            "rank": {
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
        }
              
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
   this.renderCustomRangeRankTD = this.renderCustomRangeRankTD.bind(this);
   this.vo2MaxNotReported = this.vo2MaxNotReported.bind(this);
  }
    
  successProgress(data){
  let haveCustomData = ((this.state.cr1_start_date && this.state.cr1_end_date) || (this.state.cr2_start_date && this.state.cr2_end_date) ||(this.state.cr3_start_date && this.state.cr3_end_date))?true:false;
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
    let haveCustomData = ((this.state.cr1_start_date && this.state.cr1_end_date) || (this.state.cr2_start_date && this.state.cr2_end_date) ||(this.state.cr3_start_date && this.state.cr3_end_date))?true:false;

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
if(x && x != "Not Reported"){
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
        value = "Not Reported"
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
renderCustomRangeRankTD(custom_data, toReturn="data"){
    let td=[];
    if(!custom_data){
        return td;
    }
   
    for (let[key,val] of Object.entries(custom_data)){
        for(let [key1,val1] of Object.entries(val)){
          if(key1 == "user_rank"){
                 td.push(<td className="progress_table">{val1.rank}</td>);
               }
      }
        if(toReturn == "key"){
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
gpascoreCustomRangeTD(custom_data, toReturn="data"){
    let td=[];
    if(!custom_data){
        return td;
    }
    for (let[key,val] of Object.entries(custom_data)){
        if(toReturn == "data"){
            let x = val.data;
            let value;
            if(x && x != "Not Reported"){
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
      fetching_ql1:true
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
      fetching_ql2:true
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
      fetching_ql3:true
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
      fetchProgress(this.successProgress,this.errorProgress,this.state.selectedDate);
      fetchUserRank(this.successRank,this.errorProgress,this.state.selectedDate);

    }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
     
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
    console.log(custom_ranges);
    let excelURL = `progress/print/progress/excel?date=${selected_date}&&custom_ranges=${custom_ranges}`;
    return excelURL;
}
    render(){
        const {fix} = this.props;
   let haveCustomData = ((this.state.cr1_start_date && this.state.cr1_end_date) || (this.state.cr2_start_date && this.state.cr2_end_date) ||(this.state.cr3_start_date && this.state.cr3_end_date))?true:false;
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
      <div> 
      <span id="navlink" onClick={this.toggleCalendar} id="progress">
                <FontAwesome
                    name = "calendar"
                    size = "2x"

                />
      </span>               
            <span className="pdf_button" id="pdf_button">
            <a href={this.createExcelPrintURL()}>
            <Button className="btn createbutton mb5" onClick={this.printDocument}>Export Excel</Button>
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
      
            <div className="col-sm-12 col-md-12 col-lg-12">
            <div className="row justify-content-center padding">
        <table className = "table table-striped table-responsive">
         <thead className=" progress_table">
            <tr className=" progress_table">
                <th className=" progress_table">Overall Health Grade</th>
                 {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
                <th className=" progress_table">Today<br/>{moment(this.state.duration_date.today).format('MMM DD, YYYY')}</th>
                <th className=" progress_table">Yesterday<br/>{moment(this.state.duration_date.yesterday).format('MMM DD, YYYY')}</th>
                <th className=" progress_table">Avg Last 7 Days<br/>{this.headerDates(this.state.duration_date.week)}</th>
                <th className=" progress_table">Avg Last 30 Days<br/>{this.headerDates(this.state.duration_date.month)}</th>
                <th className=" progress_table">Avg Year to Date<br/>{this.headerDates(this.state.duration_date.year)}</th>
            </tr>
        </thead>
        <tbody className="progress_table">
            <tr>
                <td className="progress_table">Total GPA Points</td>
                 {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range)}
                <td className="progress_table">{this.state.summary.overall_health.total_gpa_point.today}</td>
                <td className="progress_table">{this.state.summary.overall_health.total_gpa_point.yesterday}</td>
                <td className="progress_table">{this.state.summary.overall_health.total_gpa_point.week}</td>
                <td className="progress_table">{this.state.summary.overall_health.total_gpa_point.month}</td>
                <td className="progress_table">{this.state.summary.overall_health.total_gpa_point.year}</td>
            </tr>
            <tr className="progress_table">
                <td className="progress_table">Overall Health GPA</td>
                { this.gpascoreCustomRangeTD(this.state.summary.overall_health.overall_health_gpa.custom_range)}
                <td className=" progress_table">{this.gpascoreDecimal(this.state.summary.overall_health.overall_health_gpa.today)}</td>
                <td className=" progress_table">{this.gpascoreDecimal(this.state.summary.overall_health.overall_health_gpa.yesterday)}</td>
                <td className=" progress_table">{this.gpascoreDecimal(this.state.summary.overall_health.overall_health_gpa.week)}</td>
                <td className=" progress_table">{this.gpascoreDecimal(this.state.summary.overall_health.overall_health_gpa.month)}</td>
                <td className=" progress_table">{this.gpascoreDecimal(this.state.summary.overall_health.overall_health_gpa.year)}</td>
            </tr>
            <tr className="progress_table">
                <td className="progress_table">Rank against other users</td>
                {this.renderCustomRangeRankTD(this.state.rankData.oh_gpa.custom_range)}
                <td className="progress_table">{this.state.rankData.oh_gpa.today.user_rank.rank}</td>
                <td className=" progress_table">{this.state.rankData.oh_gpa.yesterday.user_rank.rank}</td>
                <td className=" progress_table">{this.state.rankData.oh_gpa.week.user_rank.rank}</td>
                <td className=" progress_table">{this.state.rankData.oh_gpa.month.user_rank.rank}</td>
                <td className=" progress_table">{this.state.rankData.oh_gpa.year.user_rank.rank}</td>
            </tr>
             <tr className=" progress_table">
                <td className=" progress_table">Overall Health GPA Grade</td>
                {this.renderCustomRangeTD(this.state.summary.overall_health.overall_health_gpa_grade.custom_range)}
                <td className=" progress_table">{this.state.summary.overall_health.overall_health_gpa_grade.today}</td>
                <td className=" progress_table">{this.state.summary.overall_health.overall_health_gpa_grade.yesterday}</td>
                <td className=" progress_table">{this.state.summary.overall_health.overall_health_gpa_grade.week}</td>
                <td className=" progress_table">{this.state.summary.overall_health.overall_health_gpa_grade.month}</td>
                <td className=" progress_table">{this.state.summary.overall_health.overall_health_gpa_grade.year}</td>
            </tr>
        </tbody>
    </table>
</div>

<div className="row justify-content-center padding">
   
     <table className = "table table-striped table-responsive">
         <thead>
           
                <tr className="progress_table">
                <th className="progress_table">Movement Consistency</th>
                 {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
                <th className="progress_table">Today<br/>{moment(this.state.duration_date.today).format('MMM DD, YYYY')}</th>
                <th className="progress_table">Yesterday<br/>{moment(this.state.duration_date.yesterday).format('MMM DD, YYYY')}</th>
               <th className="progress_table">Avg Last 7 Days<br/>{this.headerDates(this.state.duration_date.week)}</th>
                <th className="progress_table">Avg Last 30 Days<br/>{this.headerDates(this.state.duration_date.month)}</th>
                <th className="progress_table">Avg Year to Date<br/>{this.headerDates(this.state.duration_date.year)}</th>
            </tr>
           
        </thead>
        <tbody>
            <tr className="progress_table">
                <td className="progress_table">Movement Consistency Score</td>
                {this.renderCustomRangeTD(this.state.summary.mc.movement_consistency_score.custom_range)}
                <td className="progress_table">{this.state.summary.mc.movement_consistency_score.today}</td>
                <td className="progress_table">{this.state.summary.mc.movement_consistency_score.yesterday}</td>
                <td className="progress_table">{this.state.summary.mc.movement_consistency_score.week}</td>
                <td className="progress_table">{this.state.summary.mc.movement_consistency_score.month}</td>
                <td className="progress_table">{this.state.summary.mc.movement_consistency_score .year}</td>
            </tr>
            <tr className="progress_table">
               <td className="progress_table">Rank against other users</td>
                {this.renderCustomRangeRankTD(this.state.rankData.mc.custom_range)}
               <td className="progress_table">{this.state.rankData.mc.today.user_rank.rank}</td>
                <td className="progress_table">{this.state.rankData.mc.yesterday.user_rank.rank}</td>
                <td className="progress_table">{this.state.rankData.mc.week.user_rank.rank}</td>
                <td className="progress_table">{this.state.rankData.mc.month.user_rank.rank}</td>
                <td className="progress_table">{this.state.rankData.mc.year.user_rank.rank}</td>
            </tr>
            <tr className="progress_table">
                <td className="progress_table">Movement Consistency Grade</td>
                {this.renderCustomRangeTD(this.state.summary.mc.movement_consistency_grade.custom_range)}
                <td className="progress_table">{this.state.summary.mc.movement_consistency_grade.today}</td>
                <td className="progress_table">{this.state.summary.mc.movement_consistency_grade.yesterday}</td>
                <td className="progress_table">{this.state.summary.mc.movement_consistency_grade.week}</td>
                <td className="progress_table">{this.state.summary.mc.movement_consistency_grade.month}</td>
                <td className="progress_table">{this.state.summary.mc.movement_consistency_grade .year}</td>
            </tr>
            <tr className="progress_table">
                <td className="progress_table">Movement Consistency GPA</td>
                {this.gpascoreCustomRangeTD(this.state.summary.mc.movement_consistency_gpa.custom_range)}
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.mc.movement_consistency_gpa.today)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.mc.movement_consistency_gpa.yesterday)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.mc.movement_consistency_gpa.week)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.mc.movement_consistency_gpa.month)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.mc.movement_consistency_gpa .year)}</td>
            </tr>
        </tbody>
    </table>
</div>      



<div className="row justify-content-center padding">
     <table className = "table table-striped table-responsive">
        <thead>
            <tr className="progress_table">
                
                <th className="progress_table">Non Exercise Steps</th>    
                 {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
                <th className="progress_table">Today<br/>{moment(this.state.duration_date.today).format('MMM DD, YYYY')}</th>
                <th className="progress_table">Yesterday<br/>{moment(this.state.duration_date.yesterday).format('MMM DD, YYYY')}</th>
                <th className="progress_table">Avg Last 7 Days<br/>{this.headerDates(this.state.duration_date.week)}</th>
                <th className="progress_table">Avg Last 30 Days<br/>{this.headerDates(this.state.duration_date.month)}</th>
                <th className="progress_table">Avg Year to Date<br/>{this.headerDates(this.state.duration_date.year)}</th>
            
            </tr>
        </thead>
        <tbody>
            <tr className="progress_table">
                <td className="progress_table">Non Exercise Steps</td>
              {this.renderCustomRangeTDSteps(this.state.summary.non_exercise.non_exercise_steps.custom_range)}
                <td className="progress_table">{this.nonExerciseSteps(this.state.summary.non_exercise.non_exercise_steps.today)}</td>
                <td className="progress_table">{this.nonExerciseSteps(this.state.summary.non_exercise.non_exercise_steps.yesterday)}</td>
                <td className="progress_table">{this.nonExerciseSteps(this.state.summary.non_exercise.non_exercise_steps.week)}</td>
                <td className="progress_table">{this.nonExerciseSteps(this.state.summary.non_exercise.non_exercise_steps.month)}</td>
                <td className="progress_table">{this.nonExerciseSteps(this.state.summary.non_exercise.non_exercise_steps.year)}</td>
            </tr>
            <tr className="progress_table">
               <td className="progress_table">Rank against other users</td>
               {this.renderCustomRangeRankTD(this.state.rankData.total_steps.custom_range)}
                <td className="progress_table">{this.state.rankData.total_steps.today.user_rank.rank}</td>
                <td className="progress_table">{this.state.rankData.total_steps.yesterday.user_rank.rank}</td>
                <td className="progress_table">{this.state.rankData.total_steps.week.user_rank.rank}</td>
                <td className="progress_table">{this.state.rankData.total_steps.month.user_rank.rank}</td>
                <td className="progress_table">{this.state.rankData.total_steps.year.user_rank.rank}</td>
            </tr>
            <tr className="progress_table">
                <td className="progress_table">Movement-Non Exercise Steps Grade</td>
                {this.renderCustomRangeTD(this.state.summary.non_exercise.movement_non_exercise_step_grade.custom_range)}
                <td className="progress_table">{this.state.summary.non_exercise.movement_non_exercise_step_grade.today}</td>
                <td className="progress_table">{this.state.summary.non_exercise.movement_non_exercise_step_grade.yesterday}</td>
                <td className="progress_table">{this.state.summary.non_exercise.movement_non_exercise_step_grade.week}</td>
                <td className="progress_table">{this.state.summary.non_exercise.movement_non_exercise_step_grade.month}</td>
                <td className="progress_table">{this.state.summary.non_exercise.movement_non_exercise_step_grade.year}</td>
            </tr>
            <tr className="progress_table">
                <td className="progress_table">Non Exercise Steps GPA</td>
                {this.gpascoreCustomRangeTD(this.state.summary.non_exercise.non_exericse_steps_gpa.custom_range)}
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.non_exercise.non_exericse_steps_gpa.today)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.non_exercise.non_exericse_steps_gpa.yesterday)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.non_exercise.non_exericse_steps_gpa.week)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.non_exercise.non_exericse_steps_gpa.month)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.non_exercise.non_exericse_steps_gpa.year)}</td>
            </tr>
             <tr className="progress_table">
                <td className="progress_table">Total Steps</td>
               {this.renderCustomRangeTDSteps(this.state.summary.non_exercise.total_steps.custom_range)}
                <td className="progress_table">{this.nonExerciseSteps(this.state.summary.non_exercise.total_steps.today)}</td>
                <td className="progress_table">{this.nonExerciseSteps(this.state.summary.non_exercise.total_steps.yesterday)}</td>
                <td className="progress_table">{this.nonExerciseSteps(this.state.summary.non_exercise.total_steps.week)}</td>
                <td className="progress_table">{this.nonExerciseSteps(this.state.summary.non_exercise.total_steps.month)}</td>
                <td className="progress_table">{this.nonExerciseSteps(this.state.summary.non_exercise.total_steps.year)}</td>
            </tr>
        </tbody>
    </table>
</div>

<div className="row justify-content-center padding">
 <table className = "table table-striped table-responsive">
        <thead>
            <tr className="progress_table">
                
                <th className="progress_table">Nutrition</th>
                  {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
                <th className="progress_table">Today<br/>{moment(this.state.duration_date.today).format('MMM DD, YYYY')}</th>
                <th className="progress_table">Yesterday<br/>{moment(this.state.duration_date.yesterday).format('MMM DD, YYYY')}</th>
               <th className="progress_table">Avg Last 7 Days<br/>{this.headerDates(this.state.duration_date.week)}</th>
                <th className="progress_table">Avg Last 30 Days<br/>{this.headerDates(this.state.duration_date.month)}</th>
                <th className="progress_table">Avg Year to Date<br/>{this.headerDates(this.state.duration_date.year)}</th>
            
            </tr>
        </thead>
        <tbody>
            <tr className="progress_table">
                <td className="progress_table">% of Unprocessed Food Consumed</td>
               {this.renderCustomRangeTD(this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.custom_range)}
                <td className="progress_table">{this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.today}</td>
                <td className="progress_table">{this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.yesterday}</td>
                <td className="progress_table">{this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.week}</td>
                <td className="progress_table">{this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.month}</td>
                <td className="progress_table">{this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.year}</td>
            </tr>
            <tr className="progress_table">
               <td className="progress_table">Rank against other users</td>
               {this.renderCustomRangeRankTD(this.state.rankData.prcnt_uf.custom_range)}
                <td className="progress_table">{this.state.rankData.prcnt_uf.today.user_rank.rank}</td>
                <td className="progress_table">{this.state.rankData.prcnt_uf.yesterday.user_rank.rank}</td>
                <td className="progress_table">{this.state.rankData.prcnt_uf.week.user_rank.rank}</td>
                <td className="progress_table">{this.state.rankData.prcnt_uf.month.user_rank.rank}</td>
                <td className="progress_table">{this.state.rankData.prcnt_uf.year.user_rank.rank}</td>
            </tr>
            <tr className="progress_table">
                <td className="progress_table">% Non Processed Food Consumed Grade</td>
                {this.renderCustomRangeTD(this.state.summary.nutrition.prcnt_unprocessed_food_grade.custom_range)}
                <td className="progress_table">{this.state.summary.nutrition.prcnt_unprocessed_food_grade.today}</td>
                <td className="progress_table">{this.state.summary.nutrition.prcnt_unprocessed_food_grade.yesterday}</td>
                <td className="progress_table">{this.state.summary.nutrition.prcnt_unprocessed_food_grade.week}</td>
                <td className="progress_table">{this.state.summary.nutrition.prcnt_unprocessed_food_grade.month}</td>
                <td className="progress_table">{this.state.summary.nutrition.prcnt_unprocessed_food_grade.year}</td>
            </tr>
            <tr className="progress_table">
                <td className="progress_table">% Non Processed Food Consumed GPA</td>
                {this.gpascoreCustomRangeTD(this.state.summary.nutrition.prcnt_unprocessed_food_gpa.custom_range)}
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.nutrition.prcnt_unprocessed_food_gpa.today)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.nutrition.prcnt_unprocessed_food_gpa.yesterday)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.nutrition.prcnt_unprocessed_food_gpa.week)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.nutrition.prcnt_unprocessed_food_gpa.month)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.nutrition.prcnt_unprocessed_food_gpa.year)}</td>
            </tr>
        </tbody>
    </table>
</div>


<div className="row justify-content-center padding">
 <table className = "table table-striped table-responsive">
        <thead>
            <tr className="progress_table">
                
                <th className="progress_table">Alcohol</th>
                 {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
                <th className="progress_table">Today<br/>{moment(this.state.duration_date.today).format('MMM DD, YYYY')}</th>
                <th className="progress_table">Yesterday<br/>{moment(this.state.duration_date.yesterday).format('MMM DD, YYYY')}</th>
               <th className="progress_table">Avg Last 7 Days<br/>{this.headerDates(this.state.duration_date.week)}</th>
                <th className="progress_table">Avg Last 30 Days<br/>{this.headerDates(this.state.duration_date.month)}</th>
                <th className="progress_table">Avg Year to Date<br/>{this.headerDates(this.state.duration_date.year)}</th>
            </tr>
        </thead>
        <tbody>
            <tr className="progress_table">
                <td className="progress_table">Average Drinks Per Week (7 Days)</td>
                {this.renderCustomRangeTD(this.state.summary.alcohol.avg_drink_per_week.custom_range)}
                <td className="progress_table">{this.state.summary.alcohol.avg_drink_per_week.today}</td>
                <td className="progress_table">{this.state.summary.alcohol.avg_drink_per_week.yesterday}</td>
                <td className="progress_table">{this.state.summary.alcohol.avg_drink_per_week.week}</td>
                <td className="progress_table">{this.state.summary.alcohol.avg_drink_per_week.month}</td>
                <td className="progress_table">{this.state.summary.alcohol.avg_drink_per_week.year}</td>
            </tr>
            <tr className="progress_table">
               <td className="progress_table">Rank against other users</td>
                {this.renderCustomRangeRankTD(this.state.rankData.alcohol_drink.custom_range)}
                <td className="progress_table">{this.state.rankData.alcohol_drink.today.user_rank.rank}</td>
                <td className="progress_table">{this.state.rankData.alcohol_drink.yesterday.user_rank.rank}</td>
                <td className="progress_table">{this.state.rankData.alcohol_drink.week.user_rank.rank}</td>
                <td className="progress_table">{this.state.rankData.alcohol_drink.month.user_rank.rank}</td>
                <td className="progress_table">{this.state.rankData.alcohol_drink.year.user_rank.rank}</td>
            </tr>
            <tr className="progress_table">
                <td className="progress_table">Alcoholic drinks per week Grade</td>
                {this.renderCustomRangeTD(this.state.summary.alcohol.alcoholic_drinks_per_week_grade.custom_range)}
                <td className="progress_table">{this.state.summary.alcohol.alcoholic_drinks_per_week_grade.today}</td>
                <td className="progress_table">{this.state.summary.alcohol.alcoholic_drinks_per_week_grade.yesterday}</td>
                <td className="progress_table">{this.state.summary.alcohol.alcoholic_drinks_per_week_grade.week}</td>
                <td className="progress_table">{this.state.summary.alcohol.alcoholic_drinks_per_week_grade.month}</td>
                <td className="progress_table">{this.state.summary.alcohol.alcoholic_drinks_per_week_grade.year}</td>
            </tr>
            <tr className="progress_table">
                <td className="progress_table">Alcoholic drinks per week GPA</td>
                {this.gpascoreCustomRangeTD(this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.custom_range)}
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.today)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.yesterday)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.week)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.month)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.year)}</td>
            </tr>
        </tbody>
    </table>
</div>


<div className="row justify-content-center padding">
 <table className = "table table-striped table-responsive">
        <thead>
            <tr className="progress_table">
                
                <th className="progress_table">Exercise Consistency</th>
                {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
                <th className="progress_table">Today<br/>{moment(this.state.duration_date.today).format('MMM DD, YYYY')}</th>
                <th className="progress_table">Yesterday<br/>{moment(this.state.duration_date.yesterday).format('MMM DD, YYYY')}</th>
               <th className="progress_table">Avg Last 7 Days<br/>{this.headerDates(this.state.duration_date.week)}</th>
                <th className="progress_table">Avg Last 30 Days<br/>{this.headerDates(this.state.duration_date.month)}</th>
                <th className="progress_table">Avg Year to Date<br/>{this.headerDates(this.state.duration_date.year)}</th>
            </tr>
        </thead>
        <tbody>
            <tr className="progress_table">
                <td className="progress_table">Avg # of Days Exercised/Week</td>
               {this.renderCustomRangeTD(this.state.summary.ec.avg_no_of_days_exercises_per_week.custom_range)}
                <td className="progress_table">{this.state.summary.ec.avg_no_of_days_exercises_per_week.today}</td>
                <td className="progress_table">{this.state.summary.ec.avg_no_of_days_exercises_per_week.yesterday}</td>
                <td className="progress_table">{this.state.summary.ec.avg_no_of_days_exercises_per_week.week}</td>
                <td className="progress_table">{this.state.summary.ec.avg_no_of_days_exercises_per_week.month}</td>
                <td className="progress_table">{this.state.summary.ec.avg_no_of_days_exercises_per_week.year}</td>
            </tr>
            <tr className="progress_table">
               <td className="progress_table">Rank against other users</td>
                {this.renderCustomRangeRankTD(this.state.rankData.ec.custom_range)}
                <td className="progress_table">{this.state.rankData.ec.today.user_rank.rank}</td>
                <td className="progress_table">{this.state.rankData.ec.yesterday.user_rank.rank}</td>
                <td className="progress_table">{this.state.rankData.ec.week.user_rank.rank}</td>
                <td className="progress_table">{this.state.rankData.ec.month.user_rank.rank}</td>
                <td className="progress_table">{this.state.rankData.ec.year.user_rank.rank}</td>
            </tr>
            <tr className="progress_table">
                <td className="progress_table">Exercise Consistency Grade</td>
                {this.renderCustomRangeTD(this.state.summary.ec.exercise_consistency_grade.custom_range)}
                <td className="progress_table">{this.state.summary.ec.exercise_consistency_grade.today}</td>
                <td className="progress_table">{this.state.summary.ec.exercise_consistency_grade.yesterday}</td>
                <td className="progress_table">{this.state.summary.ec.exercise_consistency_grade.week}</td>
                <td className="progress_table">{this.state.summary.ec.exercise_consistency_grade.month}</td>
                <td className="progress_table">{this.state.summary.ec.exercise_consistency_grade.year}</td>
            </tr>
            <tr className="progress_table">
                <td className="progress_table">Exercise Consistency GPA</td>
                {this.gpascoreCustomRangeTD(this.state.summary.ec.exercise_consistency_gpa.custom_range)}
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.ec.exercise_consistency_gpa.today)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.ec.exercise_consistency_gpa.yesterday)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.ec.exercise_consistency_gpa.week)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.ec.exercise_consistency_gpa.month)}</td>
                <td className="progress_table">{this.gpascoreDecimal(this.state.summary.ec.exercise_consistency_gpa .year)}</td>
            </tr>
        </tbody>
    </table>
</div>

<div className="row justify-content-center padding">
 <table className = "table table-striped table-responsive">
        <thead>
            <tr className="progress_table">
                
                <th className="progress_table">Exercise Stats</th>
                 {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
                <th className="progress_table">Today<br/>{moment(this.state.duration_date.today).format('MMM DD, YYYY')}</th>
                <th className="progress_table">Yesterday<br/>{moment(this.state.duration_date.yesterday).format('MMM DD, YYYY')}</th>
               <th className="progress_table">Avg Last 7 Days<br/>{this.headerDates(this.state.duration_date.week)}</th>
                <th className="progress_table">Avg Last 30 Days<br/>{this.headerDates(this.state.duration_date.month)}</th>
                <th className="progress_table">Avg Year to Date<br/>{this.headerDates(this.state.duration_date.year)}</th>
            </tr>
        </thead>
        <tbody>
            <tr className="progress_table">
                <td className="progress_table">Workout Duration (hours:minutes)</td>
                {this.renderCustomRangeTD(this.state.summary.exercise.workout_duration_hours_min.custom_range)}
                <td className="progress_table">{this.exerciseStatsNoWorkOut(this.state.summary.exercise.workout_duration_hours_min.today)}</td>
                <td className="progress_table">{this.exerciseStatsNoWorkOut(this.state.summary.exercise.workout_duration_hours_min.yesterday)}</td>
                <td className="progress_table">{this.state.summary.exercise.workout_duration_hours_min.week}</td>
                <td className="progress_table">{this.state.summary.exercise.workout_duration_hours_min.month}</td>
                <td className="progress_table">{this.state.summary.exercise.workout_duration_hours_min.year}</td>
            </tr>
            <tr className="progress_table">
                <td className="progress_table">Workout Effort Level</td>
                {this.renderCustomRangeTD(this.state.summary.exercise.workout_effort_level.custom_range)}
                <td className="progress_table">{this.exerciseStatsNoWorkOut(this.state.summary.exercise.workout_effort_level.today)}</td>
                <td className="progress_table">{this.exerciseStatsNoWorkOut(this.state.summary.exercise.workout_effort_level.yesterday)}</td>
                <td className="progress_table">{this.state.summary.exercise.workout_effort_level.week}</td>
                <td className="progress_table">{this.state.summary.exercise.workout_effort_level.month}</td>
                <td className="progress_table">{this.state.summary.exercise.workout_effort_level.year}</td>
            </tr>
             <tr className="progress_table">
                <td className="progress_table">Average Exercise Heart Rate</td>
               {this.renderCustomRangeTD(this.state.summary.exercise.avg_exercise_heart_rate.custom_range)}
                <td className="progress_table">{this.exerciseStatsNoWorkOut(this.state.summary.exercise.avg_exercise_heart_rate.today)}</td>
                <td className="progress_table">{this.exerciseStatsNoWorkOut(this.state.summary.exercise.avg_exercise_heart_rate.yesterday)}</td>
                <td className="progress_table">{this.state.summary.exercise.avg_exercise_heart_rate.week}</td>
                <td className="progress_table">{this.state.summary.exercise.avg_exercise_heart_rate.month}</td>
                <td className="progress_table">{this.state.summary.exercise.avg_exercise_heart_rate.year}</td>
            </tr>
             <tr className="progress_table">
                <td className="progress_table">VO2 Max</td>
                {this.renderCustomRangeTD(this.state.summary.exercise.vo2_max.custom_range)}
                <td className="progress_table">{this.vo2MaxNotReported(this.state.summary.exercise.vo2_max.today)}</td>
                <td className="progress_table">{this.vo2MaxNotReported(this.state.summary.exercise.vo2_max.yesterday)}</td>
                <td className="progress_table">{this.state.summary.exercise.vo2_max.week}</td>
                <td className="progress_table">{this.state.summary.exercise.vo2_max.month}</td>
                <td className="progress_table">{this.state.summary.exercise.vo2_max.year}</td>
            </tr>

            
        </tbody>
    </table>
</div>


<div className="row justify-content-center padding">
    <table className = "table table-striped table-responsive">
         <thead>
            <tr className="progress_table">
                
                <th className="progress_table">Other Stats</th>
                {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
                <th className="progress_table">Today<br/>{moment(this.state.duration_date.today).format('MMM DD, YYYY')}</th>
                <th className="progress_table">Yesterday<br/>{moment(this.state.duration_date.yesterday).format('MMM DD, YYYY')}</th>
               <th className="progress_table">Avg Last 7 Days<br/>{this.headerDates(this.state.duration_date.week)}</th>
                <th className="progress_table">Avg Last 30 Days<br/>{this.headerDates(this.state.duration_date.month)}</th>
                <th className="progress_table">Avg Year to Date<br/>{this.headerDates(this.state.duration_date.year)}</th>
            
            </tr>
        </thead>
        <tbody>
            <tr className="progress_table">
                <td className="progress_table">Resting Heart Rate (RHR)</td>
                {this.renderCustomRangeTD(this.state.summary.other.resting_hr.custom_range)}
                <td className="progress_table">{this.state.summary.other.resting_hr.today}</td>
                <td className="progress_table">{this.state.summary.other.resting_hr.yesterday}</td>
                <td className="progress_table">{this.state.summary.other.resting_hr.week}</td>
                <td className="progress_table">{this.state.summary.other.resting_hr.month}</td>
                <td className="progress_table">{this.state.summary.other.resting_hr.year}</td>
            </tr>
            <tr className="progress_table">
                <td className="progress_table">HRR (time to 99)</td>
                {this.renderCustomRangeTD(this.state.summary.other.hrr_time_to_99.custom_range)}
                <td className="progress_table">{this.state.summary.other.hrr_time_to_99.today}</td>
                <td className="progress_table">{this.state.summary.other.hrr_time_to_99.yesterday}</td>
                <td className="progress_table">{this.state.summary.other.hrr_time_to_99.week}</td>
                <td className="progress_table">{this.state.summary.other.hrr_time_to_99.month}</td>
                <td className="progress_table">{this.state.summary.other.hrr_time_to_99.year}</td>
            </tr>
            <tr className="progress_table">
               <td className="progress_table">HRR (heart beats lowered in 1st minute)</td>
                {this.renderCustomRangeTD(this.state.summary.other.hrr_beats_lowered_in_first_min.custom_range)}
                <td className="progress_table">{this.state.summary.other.hrr_beats_lowered_in_first_min.today}</td>
                <td className="progress_table">{this.state.summary.other.hrr_beats_lowered_in_first_min.yesterday}</td>
                <td className="progress_table">{this.state.summary.other.hrr_beats_lowered_in_first_min.week}</td>
                <td className="progress_table">{this.state.summary.other.hrr_beats_lowered_in_first_min.month}</td>
                <td className="progress_table">{this.state.summary.other.hrr_beats_lowered_in_first_min.year}</td>
            </tr>
            <tr className="progress_table">
                <td className="progress_table">HRR (higest heart rate in 1st minute)</td>
                {this.renderCustomRangeTD(this.state.summary.other.hrr_highest_hr_in_first_min.custom_range)}
                <td className="progress_table">{this.state.summary.other.hrr_highest_hr_in_first_min.today}</td>
                <td className="progress_table">{this.state.summary.other.hrr_highest_hr_in_first_min.yesterday}</td>
                <td className="progress_table">{this.state.summary.other.hrr_highest_hr_in_first_min.week}</td>
                <td className="progress_table">{this.state.summary.other.hrr_highest_hr_in_first_min.month}</td>
                <td className="progress_table">{this.state.summary.other.hrr_highest_hr_in_first_min.year}</td>
            </tr>
            <tr className="progress_table">
                <td className="progress_table">HRR (lowest heart rate point)</td>
                {this.renderCustomRangeTD(this.state.summary.other.hrr_lowest_hr_point.custom_range)}
                <td className="progress_table">{this.state.summary.other.hrr_lowest_hr_point.today}</td>
                <td className="progress_table">{this.state.summary.other.hrr_lowest_hr_point.yesterday}</td>
                <td className="progress_table">{this.state.summary.other.hrr_lowest_hr_point.week}</td>
                <td className="progress_table">{this.state.summary.other.hrr_lowest_hr_point.month}</td>
                <td className="progress_table">{this.state.summary.other.hrr_lowest_hr_point.year}</td>
            </tr>
             <tr className="progress_table">
                <td className="progress_table">Floors Climbed</td>
                {this.renderCustomRangeTD(this.state.summary.other.floors_climbed.custom_range)}
                <td className="progress_table">{this.state.summary.other.floors_climbed.today}</td>
                <td className="progress_table">{this.state.summary.other.floors_climbed.yesterday}</td>
                <td className="progress_table">{this.state.summary.other.floors_climbed.week}</td>
                <td className="progress_table">{this.state.summary.other.floors_climbed.month}</td>
                <td className="progress_table">{this.state.summary.other.floors_climbed.year}</td>
            </tr>
        </tbody>
    </table>
</div>      
<div className=" row justify-content-center padding">
    <table className = "table table-striped table-responsive">
         <thead>
             
                <tr className="progress_table">
                  <th className="progress_table">Sleep Per Night (excluding awake time)</th>
                {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
                <th className="progress_table">Today<br/>{moment(this.state.duration_date.today).format('MMM DD, YYYY')}</th>
                <th className="progress_table">Yesterday<br/>{moment(this.state.duration_date.yesterday).format('MMM DD, YYYY')}</th>
               <th className="progress_table">Avg Last 7 Days<br/>{this.headerDates(this.state.duration_date.week)}</th>
                <th className="progress_table">Avg Last 30 Days<br/>{this.headerDates(this.state.duration_date.month)}</th>
                <th className="progress_table">Avg Year to Date<br/>{this.headerDates(this.state.duration_date.year)}</th>
            </tr>
            
        </thead>
        <tbody>
            <tr className="progress_table">
                <td className="progress_table">Total Sleep in hours:minutes</td>
                {this.renderCustomRangeTD(this.state.summary.sleep.total_sleep_in_hours_min.custom_range)}
                <td className="progress_table">{this.state.summary.sleep.total_sleep_in_hours_min.today}</td>
                <td className="progress_table">{this.state.summary.sleep.total_sleep_in_hours_min.yesterday}</td>
                <td className="progress_table">{this.state.summary.sleep.total_sleep_in_hours_min.week}</td>
                <td className="progress_table">{this.state.summary.sleep.total_sleep_in_hours_min.month}</td>
                <td className="progress_table">{this.state.summary.sleep.total_sleep_in_hours_min.year}</td>
            </tr>
            <tr className="progress_table">
               <td className="progress_table">Rank against other users</td>
                {this.renderCustomRangeRankTD(this.state.rankData.avg_sleep.custom_range)}
                <td className="progress_table">{this.state.rankData.avg_sleep.today.user_rank.rank}</td>
                <td className="progress_table">{this.state.rankData.avg_sleep.yesterday.user_rank.rank}</td>
                <td className="progress_table">{this.state.rankData.avg_sleep.week.user_rank.rank}</td>
                <td className="progress_table">{this.state.rankData.avg_sleep.month.user_rank.rank}</td>
                <td className="progress_table">{this.state.rankData.avg_sleep.year.user_rank.rank}</td>
            </tr>
            <tr className="progress_table">
                <td className="progress_table">Average Sleep Grade</td>
                {this.renderCustomRangeTD(this.state.summary.sleep.average_sleep_grade.custom_range)}
                <td className="progress_table">{this.state.summary.sleep.average_sleep_grade.today}</td>
                <td className="progress_table">{this.state.summary.sleep.average_sleep_grade.yesterday}</td>
                <td className="progress_table">{this.state.summary.sleep.average_sleep_grade.week}</td>
                <td className="progress_table">{this.state.summary.sleep.average_sleep_grade.month}</td>
                <td className="progress_table">{this.state.summary.sleep.average_sleep_grade.year}</td>
            </tr>
            <tr className="progress_table">
                <td className="progress_table"># of Days Sleep Aid Taken in Period</td>
                {this.renderCustomRangeTD(this.state.summary.sleep.num_days_sleep_aid_taken_in_period.custom_range)}
                <td className="progress_table">{this.state.summary.sleep.num_days_sleep_aid_taken_in_period.today}</td>
                <td className="progress_table">{this.state.summary.sleep.num_days_sleep_aid_taken_in_period.yesterday}</td>
                <td className="progress_table">{this.state.summary.sleep.num_days_sleep_aid_taken_in_period.week}</td>
                <td className="progress_table">{this.state.summary.sleep.num_days_sleep_aid_taken_in_period.month}</td>
                <td className="progress_table">{this.state.summary.sleep.num_days_sleep_aid_taken_in_period.year}</td>
            </tr>
            <tr className="progress_table">
                <td className="progress_table">% of Days Sleep Aid Taken in Period</td>
                {this.renderCustomRangeTD(this.state.summary.sleep.prcnt_days_sleep_aid_taken_in_period.custom_range)}
                <td className="progress_table">{this.state.summary.sleep.prcnt_days_sleep_aid_taken_in_period.today}</td>
                <td className="progress_table">{this.state.summary.sleep.prcnt_days_sleep_aid_taken_in_period.yesterday}</td>
                <td className="progress_table">{this.state.summary.sleep.prcnt_days_sleep_aid_taken_in_period.week}</td>
                <td className="progress_table">{this.state.summary.sleep.prcnt_days_sleep_aid_taken_in_period.month}</td>
                <td className="progress_table">{this.state.summary.sleep.prcnt_days_sleep_aid_taken_in_period.year}</td>
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