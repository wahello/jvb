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
import jsPDF from 'jspdf';
import fetchProgress from '../network/progress';

var CalendarWidget = require('react-calendar-widget');  

var ReactDOM = require('react-dom');

import { getGarminToken,logoutUser} from '../network/auth';
 class DashboardSummary extends Component{
constructor(props){
    super(props);
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

        "created_at":"-",
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
   
  }
    
  successProgress(data){
  let haveCustomData = ((this.state.cr1_start_date && this.state.cr1_end_date) || (this.state.cr2_start_date && this.state.cr2_end_date) ||(this.state.cr3_start_date && this.state.cr3_end_date))?true:false;
    this.setState({
        created_at:data.data.created_at,
        summary:{
            overall_health:{
               overall_health_gpa:{
                        week:parseFloat(data.data.summary.overall_health.overall_health_gpa.week).toFixed(2),
                        yesterday:parseFloat(data.data.summary.overall_health.overall_health_gpa.yesterday).toFixed(2),
                        month:parseFloat(data.data.summary.overall_health.overall_health_gpa.month).toFixed(2),            
                        custom_range:haveCustomData?data.data.summary.overall_health.overall_health_gpa.custom_range:null,
                        today:parseFloat(data.data.summary.overall_health.overall_health_gpa.today).toFixed(2),
                        year:parseFloat(data.data.summary.overall_health.overall_health_gpa.year).toFixed(2)

                     },
                 overall_health_gpa_grade:{
                        week:data.data.summary.overall_health.overall_health_gpa_grade.week,
                        yesterday:data.data.summary.overall_health.overall_health_gpa_grade.yesterday,
                        month:data.data.summary.overall_health.overall_health_gpa_grade.month,
                        custom_range:haveCustomData?data.data.summary.overall_health.overall_health_gpa_grade.custom_range:null,
                        today:data.data.summary.overall_health.overall_health_gpa_grade.today,
                        year:data.data.summary.overall_health.overall_health_gpa_grade.year

                     },
                 rank:{
                        week:data.data.summary.overall_health.rank.week,
                        yesterday:data.data.summary.overall_health.rank.yesterday,
                        month:data.data.summary.overall_health.rank.month,
                        custom_range:haveCustomData?data.data.summary.overall_health.rank.custom_range:null,
                        today:data.data.summary.overall_health.rank.today,
                        year:data.data.summary.overall_health.rank.year

                     },
                 total_gpa_point:{
                        week:data.data.summary.overall_health.total_gpa_point.week,
                        yesterday:data.data.summary.overall_health.total_gpa_point.yesterday,
                        month:data.data.summary.overall_health.total_gpa_point.month,
                        custom_range:haveCustomData?data.data.summary.overall_health.total_gpa_point.custom_range:null,
                        today:data.data.summary.overall_health.total_gpa_point.today,
                        year:data.data.summary.overall_health.total_gpa_point.year
                     }
                },

            ec:{
                 avg_no_of_days_exercises_per_week:{
                        week:data.data.summary.ec.avg_no_of_days_exercises_per_week.week,
                        yesterday:data.data.summary.ec.avg_no_of_days_exercises_per_week.yesterday,
                        month:data.data.summary.ec.avg_no_of_days_exercises_per_week.month,
                        custom_range:haveCustomData?data.data.summary.ec.avg_no_of_days_exercises_per_week.custom_range:null,
                        today:data.data.summary.ec.avg_no_of_days_exercises_per_week.today,
                        year:data.data.summary.ec.avg_no_of_days_exercises_per_week.year
                     },
                  exercise_consistency_grade:{
                        week:data.data.summary.ec.exercise_consistency_grade.week,
                        yesterday:data.data.summary.ec.exercise_consistency_grade.yesterday,
                        month:data.data.summary.ec.exercise_consistency_grade.month,
                        custom_range:haveCustomData?data.data.summary.ec.exercise_consistency_grade.custom_range:null,
                        today:data.data.summary.ec.exercise_consistency_grade.today,
                        year:data.data.summary.ec.exercise_consistency_grade.year
                     },
                   rank:{
                        week:data.data.summary.ec.rank.week,
                        yesterday:data.data.summary.ec.rank.yesterday,
                        month:data.data.summary.ec.rank.month,
                        custom_range:haveCustomData?data.data.summary.ec.rank.custom_range:null,                     
                        today:data.data.summary.ec.rank.today,
                        year:data.data.summary.ec.rank.year
                     },
                   exercise_consistency_gpa:{
                        week:parseFloat(data.data.summary.ec.exercise_consistency_gpa.week).toFixed(2),
                        yesterday:parseFloat(data.data.summary.ec.exercise_consistency_gpa.yesterday).toFixed(2),
                        month:parseFloat(data.data.summary.ec.exercise_consistency_gpa.month).toFixed(2),
                       custom_range:haveCustomData?data.data.summary.ec.exercise_consistency_gpa.custom_range:null,                     
                        today:parseFloat(data.data.summary.ec.exercise_consistency_gpa.today).toFixed(2),
                        year:parseFloat(data.data.summary.ec.exercise_consistency_gpa.year).toFixed(2)
                     }
                 },
                nutrition:{
                   prcnt_unprocessed_food_gpa:{
                       week:parseFloat(data.data.summary.nutrition.prcnt_unprocessed_food_gpa.week).toFixed(2),
                        yesterday:parseFloat(data.data.summary.nutrition.prcnt_unprocessed_food_gpa.yesterday).toFixed(2),
                        month:parseFloat(data.data.summary.nutrition.prcnt_unprocessed_food_gpa.month).toFixed(2),
                        custom_range:haveCustomData?data.data.summary.nutrition.prcnt_unprocessed_food_gpa.custom_range:null,      
                        today:parseFloat(data.data.summary.nutrition.prcnt_unprocessed_food_gpa.today).toFixed(2),
                        year:parseFloat(data.data.summary.nutrition.prcnt_unprocessed_food_gpa.year).toFixed(2)
                     },
                 prcnt_unprocessed_food_grade:{
                         week:data.data.summary.nutrition.prcnt_unprocessed_food_grade.week,
                        yesterday:data.data.summary.nutrition.prcnt_unprocessed_food_grade.yesterday,
                        month:data.data.summary.nutrition.prcnt_unprocessed_food_grade.month,
                        custom_range:haveCustomData?data.data.summary.nutrition.prcnt_unprocessed_food_grade.custom_range:null,                     
                        today:data.data.summary.nutrition.prcnt_unprocessed_food_grade.today,
                        year:data.data.summary.nutrition.prcnt_unprocessed_food_grade.year
                     },
                 rank:{
                         week:data.data.summary.nutrition.rank.week,
                        yesterday:data.data.summary.nutrition.rank.yesterday,
                        month:data.data.summary.nutrition.rank.month,
                        custom_range:haveCustomData?data.data.summary.nutrition.rank.custom_range:null,
                        today:data.data.summary.nutrition.rank.today,
                        year:data.data.summary.nutrition.rank.year
                     },
                  prcnt_unprocessed_volume_of_food:{
                         week:data.data.summary.nutrition.prcnt_unprocessed_volume_of_food.week,
                        yesterday:data.data.summary.nutrition.prcnt_unprocessed_volume_of_food.yesterday,
                        month:data.data.summary.nutrition.prcnt_unprocessed_volume_of_food.month,
                        custom_range:haveCustomData?data.data.summary.nutrition.prcnt_unprocessed_volume_of_food.custom_range:null,                   
                        today:data.data.summary.nutrition.prcnt_unprocessed_volume_of_food.today,
                        year:data.data.summary.nutrition.prcnt_unprocessed_volume_of_food.year
                     }

                  },
            mc:{
                movement_consistency_gpa:{
                        week:parseFloat(data.data.summary.mc.movement_consistency_gpa.week).toFixed(2),
                        yesterday:parseFloat(data.data.summary.mc.movement_consistency_gpa.yesterday).toFixed(2),
                        month:parseFloat(data.data.summary.mc.movement_consistency_gpa.month).toFixed(2),
                       custom_range:haveCustomData?data.data.summary.mc.movement_consistency_gpa.custom_range:null,                
                        today:parseFloat(data.data.summary.mc.movement_consistency_gpa.today).toFixed(2),
                        year:parseFloat(data.data.summary.mc.movement_consistency_gpa.year).toFixed(2)
                     },
                     movement_consistency_grade:{
                        week:data.data.summary.mc.movement_consistency_grade.week,
                        yesterday:data.data.summary.mc.movement_consistency_grade.yesterday,
                        month:data.data.summary.mc.movement_consistency_grade.month,
                        custom_range:haveCustomData?data.data.summary.mc.movement_consistency_grade.custom_range:null,
                        today:data.data.summary.mc.movement_consistency_grade.today,
                        year:data.data.summary.mc.movement_consistency_grade.year
                     },
                     rank:{
                       week:data.data.summary.mc.rank.week,
                        yesterday:data.data.summary.mc.rank.yesterday,
                        month:data.data.summary.mc.rank.month,
                        custom_range:haveCustomData?data.data.summary.mc.rank.custom_range:null,         
                        today:data.data.summary.mc.rank.today,
                        year:data.data.summary.mc.rank.year
                     },
                     movement_consistency_score:{
                       week:data.data.summary.mc.movement_consistency_score.week,
                        yesterday:data.data.summary.mc.movement_consistency_score.yesterday,
                        month:data.data.summary.mc.movement_consistency_score.month,
                        custom_range:haveCustomData?data.data.summary.mc.movement_consistency_score.custom_range:null,                     
                        today:data.data.summary.mc.movement_consistency_score.today,
                        year:data.data.summary.mc.movement_consistency_score.year
                     }
                  },
            non_exercise:{
                 non_exericse_steps_gpa:{
                        week:parseFloat(data.data.summary.non_exercise.non_exericse_steps_gpa.week).toFixed(2),
                        yesterday:parseFloat(data.data.summary.non_exercise.non_exericse_steps_gpa.yesterday).toFixed(2),
                        month:parseFloat(data.data.summary.non_exercise.non_exericse_steps_gpa.month).toFixed(2),
                       custom_range:haveCustomData?data.data.summary.non_exercise.non_exericse_steps_gpa.custom_range:null,                    
                        today:parseFloat(data.data.summary.non_exercise.non_exericse_steps_gpa.today).toFixed(2),
                        year:parseFloat(data.data.summary.non_exercise.non_exericse_steps_gpa.year).toFixed(2)
                     },
                 rank:{
                        week:data.data.summary.non_exercise.rank.week,
                        yesterday:data.data.summary.non_exercise.rank.yesterday,
                        month:data.data.summary.non_exercise.rank.month,
                        custom_range:haveCustomData?data.data.summary.non_exercise.rank.custom_range:null,                   
                        today:data.data.summary.non_exercise.rank.today,
                        year:data.data.summary.non_exercise.rank.year
                     },
                 movement_non_exercise_step_grade:{
                         week:data.data.summary.non_exercise.movement_non_exercise_step_grade.week,
                        yesterday:data.data.summary.non_exercise.movement_non_exercise_step_grade.yesterday,
                        month:data.data.summary.non_exercise.movement_non_exercise_step_grade.month,
                        custom_range:haveCustomData?data.data.summary.non_exercise.movement_non_exercise_step_grade.custom_range:null,                    
                        today:data.data.summary.non_exercise.movement_non_exercise_step_grade.today,
                        year:data.data.summary.non_exercise.movement_non_exercise_step_grade.year
                     },
                 non_exercise_steps:{
                        week:data.data.summary.non_exercise.non_exercise_steps.week,
                        yesterday:data.data.summary.non_exercise.non_exercise_steps.yesterday,
                        month:data.data.summary.non_exercise.non_exercise_steps.month,
                        custom_range:haveCustomData?data.data.summary.non_exercise.non_exercise_steps.custom_range:null,       
                        today:data.data.summary.non_exercise.non_exercise_steps.today,
                        year:data.data.summary.non_exercise.non_exercise_steps.year
                     },
                total_steps:{
                         week:data.data.summary.non_exercise.total_steps.week,
                        yesterday:data.data.summary.non_exercise.total_steps.yesterday,
                        month:data.data.summary.non_exercise.total_steps.month,
                        custom_range:haveCustomData?data.data.summary.non_exercise.total_steps.custom_range:null,                      
                        today:data.data.summary.non_exercise.total_steps.today,
                        year:data.data.summary.non_exercise.total_steps.year
                     },     
            },
        exercise:{ 
            workout_duration_hours_min:{
                        week:data.data.summary.exercise.workout_duration_hours_min.week,
                        yesterday:data.data.summary.exercise.workout_duration_hours_min.yesterday,
                        month:data.data.summary.exercise.workout_duration_hours_min.month,
                        custom_range:haveCustomData?data.data.summary.exercise.workout_duration_hours_min.custom_range:null,                      
                        today:data.data.summary.exercise.workout_duration_hours_min.today,
                        year:data.data.summary.exercise.workout_duration_hours_min.year
                     },   
                avg_exercise_heart_rate:{
                        week:data.data.summary.exercise.avg_exercise_heart_rate.week,
                        yesterday:data.data.summary.exercise.avg_exercise_heart_rate.yesterday,
                        month:data.data.summary.exercise.avg_exercise_heart_rate.month,
                        custom_range:haveCustomData?data.data.summary.exercise.avg_exercise_heart_rate.custom_range:null,
                     
                        today:data.data.summary.exercise.avg_exercise_heart_rate.today,
                        year:data.data.summary.exercise.avg_exercise_heart_rate.year
                     },    
                workout_effort_level:{
                        week:data.data.summary.exercise.workout_effort_level.week,
                        yesterday:data.data.summary.exercise.workout_effort_level.yesterday,
                        month:data.data.summary.exercise.workout_effort_level.month,
                        custom_range:haveCustomData?data.data.summary.exercise.workout_effort_level.custom_range:null,                     
                        today:data.data.summary.exercise.workout_effort_level.today,
                        year:data.data.summary.exercise.workout_effort_level.year
                     },
                      vo2_max:{
                        week:data.data.summary.exercise.vo2_max.week,
                        yesterday:data.data.summary.exercise.vo2_max.yesterday,
                        month:data.data.summary.exercise.vo2_max.month,
                        custom_range:haveCustomData?data.data.summary.exercise.vo2_max.custom_range:null,
                        today:data.data.summary.exercise.vo2_max.today,
                        year:data.data.summary.exercise.vo2_max.year
                     }                               
                },
         sleep: {
             prcnt_days_sleep_aid_taken_in_period: {
                        week:data.data.summary.sleep.prcnt_days_sleep_aid_taken_in_period.week,
                        yesterday:data.data.summary.sleep.prcnt_days_sleep_aid_taken_in_period.yesterday,
                        month:data.data.summary.sleep.prcnt_days_sleep_aid_taken_in_period.month,
                        custom_range:haveCustomData?data.data.summary.sleep.prcnt_days_sleep_aid_taken_in_period.custom_range:null,                    
                        today:data.data.summary.sleep.prcnt_days_sleep_aid_taken_in_period.today,
                        year:data.data.summary.sleep.prcnt_days_sleep_aid_taken_in_period.year
                     },
            average_sleep_grade: {
                        week:data.data.summary.sleep.average_sleep_grade.week,
                        yesterday:data.data.summary.sleep.average_sleep_grade.yesterday,
                        month:data.data.summary.sleep.average_sleep_grade.month,
                        custom_range:haveCustomData?data.data.summary.sleep.average_sleep_grade.custom_range:null,                  
                        today:data.data.summary.sleep.average_sleep_grade.today,
                        year:data.data.summary.sleep.average_sleep_grade.year
                     },
            rank: {
                        week:data.data.summary.sleep.rank.week,
                        yesterday:data.data.summary.sleep.rank.yesterday,
                        month:data.data.summary.sleep.rank.month,
                        custom_range:haveCustomData?data.data.summary.sleep.rank.custom_range:null,                      
                        today:data.data.summary.sleep.rank.today,
                        year:data.data.summary.sleep.rank.year
                    },
            total_sleep_in_hours_min: {
                        week:data.data.summary.sleep.total_sleep_in_hours_min.week,
                        yesterday:data.data.summary.sleep.total_sleep_in_hours_min.yesterday,
                        month:data.data.summary.sleep.total_sleep_in_hours_min.month,
                        custom_range:haveCustomData?data.data.summary.sleep.total_sleep_in_hours_min.custom_range:null,                      
                        today:data.data.summary.sleep.total_sleep_in_hours_min.today,
                        year:data.data.summary.sleep.total_sleep_in_hours_min.year
                    },
            overall_sleep_gpa: {
                        week:parseFloat(data.data.summary.sleep.overall_sleep_gpa.week).toFixed(2),
                        yesterday:parseFloat(data.data.summary.sleep.overall_sleep_gpa.yesterday).toFixed(2),
                        month:parseFloat(data.data.summary.sleep.overall_sleep_gpa.month).toFixed(2),
                       custom_range:haveCustomData?data.data.summary.sleep.overall_sleep_gpa.custom_range:null,
                        today:parseFloat(data.data.summary.sleep.overall_sleep_gpa.today).toFixed(2),
                        year:parseFloat(data.data.summary.sleep.overall_sleep_gpa.year).toFixed(2)
                     },
            num_days_sleep_aid_taken_in_period: {
                        week:data.data.summary.sleep.num_days_sleep_aid_taken_in_period.week,
                        yesterday:data.data.summary.sleep.num_days_sleep_aid_taken_in_period.yesterday,
                        month:data.data.summary.sleep.num_days_sleep_aid_taken_in_period.month,
                        custom_range:haveCustomData?data.data.summary.sleep.num_days_sleep_aid_taken_in_period.custom_range:null,
                        today:data.data.summary.sleep.num_days_sleep_aid_taken_in_period.today,
                        year:data.data.summary.sleep.num_days_sleep_aid_taken_in_period.year
                     }
               },
         alcohol: {
            alcoholic_drinks_per_week_grade: {
                        week:data.data.summary.alcohol.alcoholic_drinks_per_week_grade.week,
                        yesterday:data.data.summary.alcohol.alcoholic_drinks_per_week_grade.yesterday,
                        month:data.data.summary.alcohol.alcoholic_drinks_per_week_grade.month,
                        custom_range:haveCustomData?data.data.summary.alcohol.alcoholic_drinks_per_week_grade.custom_range:null,                  
                        today:data.data.summary.alcohol.alcoholic_drinks_per_week_grade.today,
                        year:data.data.summary.alcohol.alcoholic_drinks_per_week_grade.year
            },
            avg_drink_per_week: {
                        week:data.data.summary.alcohol.avg_drink_per_week.week,
                        yesterday:data.data.summary.alcohol.avg_drink_per_week.yesterday,
                        month:data.data.summary.alcohol.avg_drink_per_week.month,
                        custom_range:haveCustomData?data.data.summary.alcohol.avg_drink_per_week.custom_range:null,                     
                        today:data.data.summary.alcohol.avg_drink_per_week.today,
                        year:data.data.summary.alcohol.avg_drink_per_week.year
            },
            rank: {
                       week:data.data.summary.alcohol.rank.week,
                        yesterday:data.data.summary.alcohol.rank.yesterday,
                        month:data.data.summary.alcohol.rank.month,
                        custom_range:haveCustomData?data.data.summary.alcohol.rank.custom_range:null,                       
                        today:data.data.summary.alcohol.rank.today,
                        year:data.data.summary.alcohol.rank.year
            },
            alcoholic_drinks_per_week_gpa: {
                        week:parseFloat(data.data.summary.alcohol.alcoholic_drinks_per_week_gpa.week).toFixed(2),
                        yesterday:parseFloat(data.data.summary.alcohol.alcoholic_drinks_per_week_gpa.yesterday).toFixed(2),
                        month:parseFloat(data.data.summary.alcohol.alcoholic_drinks_per_week_gpa.month).toFixed(2),
                       custom_range:haveCustomData?data.data.summary.alcohol.alcoholic_drinks_per_week_gpa.custom_range:null,                    
                        today:parseFloat(data.data.summary.alcohol.alcoholic_drinks_per_week_gpa.today).toFixed(2),
                        year:parseFloat(data.data.summary.alcohol.alcoholic_drinks_per_week_gpa.year).toFixed(2)
            }
        },
        other: {
            hrr_beats_lowered_in_first_min: {
                        week:data.data.summary.other.hrr_beats_lowered_in_first_min.week,
                        yesterday:data.data.summary.other.hrr_beats_lowered_in_first_min.yesterday,
                        month:data.data.summary.other.hrr_beats_lowered_in_first_min.month,
                        custom_range:haveCustomData?data.data.summary.other.hrr_beats_lowered_in_first_min.custom_range:null,
                        today:data.data.summary.other.hrr_beats_lowered_in_first_min.today,
                        year:data.data.summary.other.hrr_beats_lowered_in_first_min.year
            },
            hrr_highest_hr_in_first_min: {
                        week:data.data.summary.other.hrr_highest_hr_in_first_min.week,
                        yesterday:data.data.summary.other.hrr_highest_hr_in_first_min.yesterday,
                        month:data.data.summary.other.hrr_highest_hr_in_first_min.month,
                        custom_range:haveCustomData?data.data.summary.other.hrr_highest_hr_in_first_min.custom_range:null,                    
                        today:data.data.summary.other.hrr_highest_hr_in_first_min.today,
                        year:data.data.summary.other.hrr_highest_hr_in_first_min.year
            },
            hrr_lowest_hr_point: {
                        week:data.data.summary.other.hrr_lowest_hr_point.week,
                        yesterday:data.data.summary.other.hrr_lowest_hr_point.yesterday,
                        month:data.data.summary.other.hrr_lowest_hr_point.month,
                        custom_range:haveCustomData?data.data.summary.other.hrr_lowest_hr_point.custom_range:null,
                        today:data.data.summary.other.hrr_lowest_hr_point.today,
                        year:data.data.summary.other.hrr_lowest_hr_point.year
            },
            floors_climbed: {
                        week:data.data.summary.other.floors_climbed.week,
                        yesterday:data.data.summary.other.floors_climbed.yesterday,
                        month:data.data.summary.other.floors_climbed.month,
                        custom_range:haveCustomData?data.data.summary.other.floors_climbed.custom_range:null,                   
                        today:data.data.summary.other.floors_climbed.today,
                        year:data.data.summary.other.floors_climbed.year
            },
            resting_hr: {
                        week:data.data.summary.other.resting_hr.week,
                        yesterday:data.data.summary.other.resting_hr.yesterday,
                        month:data.data.summary.other.resting_hr.month,
                        custom_range:haveCustomData?data.data.summary.other.resting_hr.custom_range:null,                   
                        today:data.data.summary.other.resting_hr.today,
                        year:data.data.summary.other.resting_hr.year
            },
            hrr_time_to_99: {
                        week:data.data.summary.other.hrr_time_to_99.week,
                        yesterday:data.data.summary.other.hrr_time_to_99.yesterday,
                        month:data.data.summary.other.hrr_time_to_99.month,
                        custom_range:haveCustomData?data.data.summary.other.hrr_time_to_99.custom_range:null,
                        today:data.data.summary.other.hrr_time_to_99.today,
                        year:data.data.summary.other.hrr_time_to_99.year
            }
        }
              
        }
    });



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
        if(toReturn == "data")
            td.push(<td>{val.data}</td>);
        else if(toReturn == "key")
            td.push(<th>{key}</th>);
    }
    return td;
}
  
   errorProgress(error){
       console.log(error.message);
    }

    processDate(selectedDate,fromDate,toDate){ 
    this.setState({
      selectedDate: selectedDate,
      calendarOpen:!this.state.calendarOpen                                    
    },()=>{
      fetchProgress(this.successProgress,this.errorProgress,this.state.selectedDate);
    });
  }

  onSubmitDate1(event){
    event.preventDefault();
    this.setState({
      dateRange1:!this.state.dateRange1,
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
    });
  }
 onSubmitDate2(event){
    event.preventDefault();
    this.setState({
      dateRange2:!this.state.dateRange2,
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
    });
  }
 onSubmitDate3(event){
    event.preventDefault();
    this.setState({
      dateRange3:!this.state.dateRange3,
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
    });
  }


    componentDidMount(){
      fetchProgress(this.successProgress,this.errorProgress,this.state.selectedDate);
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
            <Button className="btn createbutton mb5" onClick={this.printDocument}>Create PDF</Button>
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
       <div id="divToPrint" className="mt4">
			<div className="col-sm-12 col-md-12 col-lg-12 padding">
			<div className="row justify-content-center">
			<div className="table-responsive"> 
   		 <table className="table table-bordered">
         <thead>
            <tr>
                <th >Overall Health Grade</th>
                 {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td >Total GPA Points</td>
                 {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range)}
                <td>{this.state.summary.overall_health.total_gpa_point.today}</td>
                <td>{this.state.summary.overall_health.total_gpa_point.yesterday}</td>
                <td>{this.state.summary.overall_health.total_gpa_point.week}</td>
                <td>{this.state.summary.overall_health.total_gpa_point.month}</td>
                <td>{this.state.summary.overall_health.total_gpa_point.year}</td>
            </tr>
            <tr>
                <td >Overall Health GPA</td>
                { this.renderCustomRangeTD(this.state.summary.overall_health.overall_health_gpa.custom_range)}
                <td>{this.state.summary.overall_health.overall_health_gpa.today}</td>
                <td>{this.state.summary.overall_health.overall_health_gpa.yesterday}</td>
                <td>{this.state.summary.overall_health.overall_health_gpa.week}</td>
                <td>{this.state.summary.overall_health.overall_health_gpa.month}</td>
                <td>{this.state.summary.overall_health.overall_health_gpa.year}</td>
            </tr>
            <tr>
                <td >Rank against other users</td>
                {this.renderCustomRangeTD( this.state.summary.overall_health.rank.custom_range)}
                <td>{this.state.summary.overall_health.rank.today}</td>
                <td>{this.state.summary.overall_health.rank.yesterday}</td>
                <td>{this.state.summary.overall_health.rank.week}</td>
                <td>{this.state.summary.overall_health.rank.month}</td>
                <td>{this.state.summary.overall_health.rank.year}</td>
            </tr>
             <tr>
                <td>Overall Health GPA Grade</td>
                {this.renderCustomRangeTD(this.state.summary.overall_health.overall_health_gpa_grade.custom_range)}
                <td>{this.state.summary.overall_health.overall_health_gpa_grade.today}</td>
                <td>{this.state.summary.overall_health.overall_health_gpa_grade.yesterday}</td>
                <td>{this.state.summary.overall_health.overall_health_gpa_grade.week}</td>
                <td>{this.state.summary.overall_health.overall_health_gpa_grade.month}</td>
                <td>{this.state.summary.overall_health.overall_health_gpa_grade.year}</td>
            </tr>
        </tbody>
    </table>
</div>
</div>

<div className="row justify-content-center">
	<div className="table-responsive tablecenter"> 
    <table className="table table-bordered ">
         <thead>
           
                <tr>
                <th>Movement Consistency</th>
                 {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            </tr>
           
        </thead>
        <tbody>
            <tr>
                <td>Movement Consistency Score</td>
                {this.renderCustomRangeTD(this.state.summary.mc.movement_consistency_score.custom_range)}
                <td>{this.state.summary.mc.movement_consistency_score.today}</td>
                <td>{this.state.summary.mc.movement_consistency_score.yesterday}</td>
                <td>{this.state.summary.mc.movement_consistency_score.week}</td>
                <td>{this.state.summary.mc.movement_consistency_score.month}</td>
                <td>{this.state.summary.mc.movement_consistency_score .year}</td>
            </tr>
            <tr>
               <td>Rank against other users</td>
                {this.renderCustomRangeTD(this.state.summary.mc.rank.custom_range)}
                <td>{this.state.summary.mc.rank.today}</td>
                <td>{this.state.summary.mc.rank.yesterday}</td>
                <td>{this.state.summary.mc.rank.week}</td>
                <td>{this.state.summary.mc.rank.month}</td>
                <td>{this.state.summary.mc.rank .year}</td>
            </tr>
            <tr>
                <td>Movement Consistency Grade</td>
                {this.renderCustomRangeTD(this.state.summary.mc.movement_consistency_grade.custom_range)}
                <td>{this.state.summary.mc.movement_consistency_grade.today}</td>
                <td>{this.state.summary.mc.movement_consistency_grade.yesterday}</td>
                <td>{this.state.summary.mc.movement_consistency_grade.week}</td>
                <td>{this.state.summary.mc.movement_consistency_grade.month}</td>
                <td>{this.state.summary.mc.movement_consistency_grade .year}</td>
            </tr>
            <tr>
                <td>Movement Consistency GPA</td>
                {this.renderCustomRangeTD(this.state.summary.mc.movement_consistency_gpa.custom_range)}
                <td>{this.state.summary.mc.movement_consistency_gpa.today}</td>
                <td>{this.state.summary.mc.movement_consistency_gpa.yesterday}</td>
                <td>{this.state.summary.mc.movement_consistency_gpa.week}</td>
                <td>{this.state.summary.mc.movement_consistency_gpa.month}</td>
                <td>{this.state.summary.mc.movement_consistency_gpa .year}</td>
            </tr>
        </tbody>
    </table>
</div>		
</div>


<div className="row justify-content-center padding">
<div className="table-responsive"> 
    <table className="table table-bordered">
        <thead>
            <tr>
                
                <th>Non Exercise Steps</th>    
                 {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Non Exercise Steps</td>
              {this.renderCustomRangeTD(this.state.summary.non_exercise.non_exercise_steps.custom_range)}
                <td>{this.nonExerciseSteps(this.state.summary.non_exercise.non_exercise_steps.today)}</td>
                <td>{this.nonExerciseSteps(this.state.summary.non_exercise.non_exercise_steps.yesterday)}</td>
                <td>{this.nonExerciseSteps(this.state.summary.non_exercise.non_exercise_steps.week)}</td>
                <td>{this.nonExerciseSteps(this.state.summary.non_exercise.non_exercise_steps.month)}</td>
                <td>{this.nonExerciseSteps(this.state.summary.non_exercise.non_exercise_steps.year)}</td>
            </tr>
            <tr>
               <td>Rank against other users</td>
               {this.renderCustomRangeTD(this.state.summary.non_exercise.rank.custom_range)}
                <td>{this.state.summary.non_exercise.rank.today}</td>
                <td>{this.state.summary.non_exercise.rank.yesterday}</td>
                <td>{this.state.summary.non_exercise.rank.week}</td>
                <td>{this.state.summary.non_exercise.rank.month}</td>
                <td>{this.state.summary.non_exercise.rank.year}</td>
            </tr>
            <tr>
                <td>Movement-Non Exercise Steps Grade</td>
                {this.renderCustomRangeTD(this.state.summary.non_exercise.movement_non_exercise_step_grade.custom_range)}
                <td>{this.state.summary.non_exercise.movement_non_exercise_step_grade.today}</td>
                <td>{this.state.summary.non_exercise.movement_non_exercise_step_grade.yesterday}</td>
                <td>{this.state.summary.non_exercise.movement_non_exercise_step_grade.week}</td>
                <td>{this.state.summary.non_exercise.movement_non_exercise_step_grade.month}</td>
                <td>{this.state.summary.non_exercise.movement_non_exercise_step_grade.year}</td>
            </tr>
            <tr>
                <td>Non Exercise Steps GPA</td>
                {this.renderCustomRangeTD(this.state.summary.non_exercise.non_exericse_steps_gpa.custom_range)}
                <td>{this.state.summary.non_exercise.non_exericse_steps_gpa.today}</td>
                <td>{this.state.summary.non_exercise.non_exericse_steps_gpa.yesterday}</td>
                <td>{this.state.summary.non_exercise.non_exericse_steps_gpa.week}</td>
                <td>{this.state.summary.non_exercise.non_exericse_steps_gpa.month}</td>
                <td>{this.state.summary.non_exercise.non_exericse_steps_gpa.year}</td>
            </tr>
             <tr>
                <td>Total Steps</td>
               {this.renderCustomRangeTD(this.state.summary.non_exercise.total_steps.custom_range)}
                <td>{this.nonExerciseSteps(this.state.summary.non_exercise.total_steps.today)}</td>
                <td>{this.nonExerciseSteps(this.state.summary.non_exercise.total_steps.yesterday)}</td>
                <td>{this.nonExerciseSteps(this.state.summary.non_exercise.total_steps.week)}</td>
                <td>{this.nonExerciseSteps(this.state.summary.non_exercise.total_steps.month)}</td>
                <td>{this.nonExerciseSteps(this.state.summary.non_exercise.total_steps.year)}</td>
            </tr>
        </tbody>
    </table>
</div>
</div>

<div className="row justify-content-center padding">
<div className="table-responsive"> 
    <table className="table table-bordered">
        <thead>
            <tr>
                
                <th>Nutrition</th>
                  {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>% of Unprocessed Food Consumed</td>
               {this.renderCustomRangeTD(this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.custom_range)}
                <td>{this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.today}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.yesterday}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.week}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.month}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.year}</td>
            </tr>
            <tr>
               <td>Rank against other users</td>
               {this.renderCustomRangeTD(this.state.summary.nutrition.rank.custom_range)}
                <td>{this.state.summary.nutrition.rank.today}</td>
                <td>{this.state.summary.nutrition.rank.yesterday}</td>
                <td>{this.state.summary.nutrition.rank.week}</td>
                <td>{this.state.summary.nutrition.rank.month}</td>
                <td>{this.state.summary.nutrition.rank.year}</td>
            </tr>
            <tr>
                <td>% Non Processed Food Consumed Grade</td>
                {this.renderCustomRangeTD(this.state.summary.nutrition.prcnt_unprocessed_food_grade.custom_range)}
                <td>{this.state.summary.nutrition.prcnt_unprocessed_food_grade.today}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_food_grade.yesterday}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_food_grade.week}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_food_grade.month}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_food_grade.year}</td>
            </tr>
            <tr>
                <td>% Non Processed Food Consumed GPA</td>
                {this.renderCustomRangeTD(this.state.summary.nutrition.prcnt_unprocessed_food_gpa.custom_range)}
                <td>{this.state.summary.nutrition.prcnt_unprocessed_food_gpa.today}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_food_gpa.yesterday}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_food_gpa.week}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_food_gpa.month}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_food_gpa.year}</td>
            </tr>
        </tbody>
    </table>
</div>
</div>


<div className="row justify-content-center padding">
<div className="table-responsive"> 
    <table className="table table-bordered">
        <thead>
            <tr>
                
                <th>Alcohol</th>
                 {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Average Drinks Per Week (7 Days)</td>
                {this.renderCustomRangeTD(this.state.summary.alcohol.avg_drink_per_week.custom_range)}
                <td>{this.state.summary.alcohol.avg_drink_per_week.today}</td>
                <td>{this.state.summary.alcohol.avg_drink_per_week.yesterday}</td>
                <td>{this.state.summary.alcohol.avg_drink_per_week.week}</td>
                <td>{this.state.summary.alcohol.avg_drink_per_week.month}</td>
                <td>{this.state.summary.alcohol.avg_drink_per_week.year}</td>
            </tr>
            <tr>
               <td>Rank against other users</td>
                {this.renderCustomRangeTD(this.state.summary.alcohol.rank.custom_range)}
                <td>{this.state.summary.alcohol.rank.today}</td>
                <td>{this.state.summary.alcohol.rank.yesterday}</td>
                <td>{this.state.summary.alcohol.rank.week}</td>
                <td>{this.state.summary.alcohol.rank.month}</td>
                <td>{this.state.summary.alcohol.rank.year}</td>
            </tr>
            <tr>
                <td>Alcoholic drinks per week Grade</td>
                {this.renderCustomRangeTD(this.state.summary.alcohol.alcoholic_drinks_per_week_grade.custom_range)}
                <td>{this.state.summary.alcohol.alcoholic_drinks_per_week_grade.today}</td>
                <td>{this.state.summary.alcohol.alcoholic_drinks_per_week_grade.yesterday}</td>
                <td>{this.state.summary.alcohol.alcoholic_drinks_per_week_grade.week}</td>
                <td>{this.state.summary.alcohol.alcoholic_drinks_per_week_grade.month}</td>
                <td>{this.state.summary.alcohol.alcoholic_drinks_per_week_grade.year}</td>
            </tr>
            <tr>
                <td>Alcoholic drinks per week GPA</td>
                {this.renderCustomRangeTD(this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.custom_range)}
                <td>{this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.today}</td>
                <td>{this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.yesterday}</td>
                <td>{this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.week}</td>
                <td>{this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.month}</td>
                <td>{this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.year}</td>
            </tr>
        </tbody>
    </table>
</div>
</div>

<div className="row justify-content-center padding">
<div className="table-responsive"> 
    <table className="table table-bordered">
        <thead>
            <tr>
                
                <th>Exercise Consistency</th>
                {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Avg # of Days Exercised/Week</td>
               {this.renderCustomRangeTD(this.state.summary.ec.avg_no_of_days_exercises_per_week.custom_range)}
                <td>{this.state.summary.ec.avg_no_of_days_exercises_per_week.today}</td>
                <td>{this.state.summary.ec.avg_no_of_days_exercises_per_week.yesterday}</td>
                <td>{this.state.summary.ec.avg_no_of_days_exercises_per_week.week}</td>
                <td>{this.state.summary.ec.avg_no_of_days_exercises_per_week.month}</td>
                <td>{this.state.summary.ec.avg_no_of_days_exercises_per_week.year}</td>
            </tr>
            <tr>
               <td>Rank against other users</td>
                {this.renderCustomRangeTD(this.state.summary.ec.rankcustom_range)}
                <td>{this.state.summary.ec.rank.today}</td>
                <td>{this.state.summary.ec.rank.yesterday}</td>
                <td>{this.state.summary.ec.rank.week}</td>
                <td>{this.state.summary.ec.rank.month}</td>
                <td>{this.state.summary.ec.rank.year}</td>
            </tr>
            <tr>
                <td>Exercise Consistency Grade</td>
                {this.renderCustomRangeTD(this.state.summary.ec.exercise_consistency_grade.custom_range)}
                <td>{this.state.summary.ec.exercise_consistency_grade.today}</td>
                <td>{this.state.summary.ec.exercise_consistency_grade.yesterday}</td>
                <td>{this.state.summary.ec.exercise_consistency_grade.week}</td>
                <td>{this.state.summary.ec.exercise_consistency_grade.month}</td>
                <td>{this.state.summary.ec.exercise_consistency_grade.year}</td>
            </tr>
            <tr>
                <td>Exercise Consistency GPA</td>
                {this.renderCustomRangeTD(this.state.summary.ec.exercise_consistency_gpa.custom_range)}
                <td>{this.state.summary.ec.exercise_consistency_gpa.today}</td>
                <td>{this.state.summary.ec.exercise_consistency_gpa.yesterday}</td>
                <td>{this.state.summary.ec.exercise_consistency_gpa.week}</td>
                <td>{this.state.summary.ec.exercise_consistency_gpa.month}</td>
                <td>{this.state.summary.ec.exercise_consistency_gpa .year}</td>
            </tr>
        </tbody>
    </table>
</div>
</div>
<div className="row justify-content-center padding">
<div className="table-responsive tablecenter"> 
<table className="table table-bordered">
        <thead>
            <tr>
                
                <th>Exercise Stats</th>
                 {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Workout Duration (hours:minutes)</td>
                {this.renderCustomRangeTD(this.state.summary.exercise.workout_duration_hours_min.custom_range)}
                <td>{this.state.summary.exercise.workout_duration_hours_min.today}</td>
                <td>{this.state.summary.exercise.workout_duration_hours_min.yesterday}</td>
                <td>{this.state.summary.exercise.workout_duration_hours_min.week}</td>
                <td>{this.state.summary.exercise.workout_duration_hours_min.month}</td>
                <td>{this.state.summary.exercise.workout_duration_hours_min.year}</td>
            </tr>
            <tr>
            	<td>Workout Effort Level</td>
                {this.renderCustomRangeTD(this.state.summary.exercise.workout_effort_level.custom_range)}
                <td>{this.state.summary.exercise.workout_effort_level.today}</td>
                <td>{this.state.summary.exercise.workout_effort_level.yesterday}</td>
                <td>{this.state.summary.exercise.workout_effort_level.week}</td>
                <td>{this.state.summary.exercise.workout_effort_level.month}</td>
                <td>{this.state.summary.exercise.workout_effort_level.year}</td>
            </tr>
             <tr>
                <td>Average Exercise Heart Rate</td>
               {this.renderCustomRangeTD(this.state.summary.exercise.avg_exercise_heart_rate.custom_range)}
                <td>{this.state.summary.exercise.avg_exercise_heart_rate.today}</td>
                <td>{this.state.summary.exercise.avg_exercise_heart_rate.yesterday}</td>
                <td>{this.state.summary.exercise.avg_exercise_heart_rate.week}</td>
                <td>{this.state.summary.exercise.avg_exercise_heart_rate.month}</td>
                <td>{this.state.summary.exercise.avg_exercise_heart_rate.year}</td>
            </tr>
             <tr>
            	<td>VO2 Max</td>
                {this.renderCustomRangeTD(this.state.summary.exercise.vo2_max.custom_range)}
                <td>{this.state.summary.exercise.vo2_max.today}</td>
                <td>{this.state.summary.exercise.vo2_max.yesterday}</td>
                <td>{this.state.summary.exercise.vo2_max.week}</td>
                <td>{this.state.summary.exercise.vo2_max.month}</td>
                <td>{this.state.summary.exercise.vo2_max.year}</td>
            </tr>

            
        </tbody>
    </table>
</div>
</div>

<div className="row justify-content-center padding">
	<div className="table-responsive tablecenter"> 
    <table className="table table-bordered">
         <thead>
            <tr>
                
                <th>Other Stats</th>
                {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Resting Heart Rate (RHR)</td>
                {this.renderCustomRangeTD(this.state.summary.other.resting_hr.custom_range)}
                <td>{this.state.summary.other.resting_hr.today}</td>
                <td>{this.state.summary.other.resting_hr.yesterday}</td>
                <td>{this.state.summary.other.resting_hr.week}</td>
                <td>{this.state.summary.other.resting_hr.month}</td>
                <td>{this.state.summary.other.resting_hr.year}</td>
            </tr>
            <tr>
                <td>HRR (time to 99)</td>
                {this.renderCustomRangeTD(this.state.summary.other.hrr_time_to_99.custom_range)}
                <td>{this.state.summary.other.hrr_time_to_99.today}</td>
                <td>{this.state.summary.other.hrr_time_to_99.yesterday}</td>
                <td>{this.state.summary.other.hrr_time_to_99.week}</td>
                <td>{this.state.summary.other.hrr_time_to_99.month}</td>
                <td>{this.state.summary.other.hrr_time_to_99.year}</td>
            </tr>
            <tr>
               <td>HRR (heart beats lowered in 1st minute)</td>
                {this.renderCustomRangeTD(this.state.summary.other.hrr_beats_lowered_in_first_min.custom_range)}
                <td>{this.state.summary.other.hrr_beats_lowered_in_first_min.today}</td>
                <td>{this.state.summary.other.hrr_beats_lowered_in_first_min.yesterday}</td>
                <td>{this.state.summary.other.hrr_beats_lowered_in_first_min.week}</td>
                <td>{this.state.summary.other.hrr_beats_lowered_in_first_min.month}</td>
                <td>{this.state.summary.other.hrr_beats_lowered_in_first_min.year}</td>
            </tr>
            <tr>
                <td>HRR (higest heart rate in 1st minute)</td>
                {this.renderCustomRangeTD(this.state.summary.other.hrr_highest_hr_in_first_min.custom_range)}
                <td>{this.state.summary.other.hrr_highest_hr_in_first_min.today}</td>
                <td>{this.state.summary.other.hrr_highest_hr_in_first_min.yesterday}</td>
                <td>{this.state.summary.other.hrr_highest_hr_in_first_min.week}</td>
                <td>{this.state.summary.other.hrr_highest_hr_in_first_min.month}</td>
                <td>{this.state.summary.other.hrr_highest_hr_in_first_min.year}</td>
            </tr>
            <tr>
                <td>HRR (lowest heart rate point)</td>
                {this.renderCustomRangeTD(this.state.summary.other.hrr_lowest_hr_point.custom_range)}
                <td>{this.state.summary.other.hrr_lowest_hr_point.today}</td>
                <td>{this.state.summary.other.hrr_lowest_hr_point.yesterday}</td>
                <td>{this.state.summary.other.hrr_lowest_hr_point.week}</td>
                <td>{this.state.summary.other.hrr_lowest_hr_point.month}</td>
                <td>{this.state.summary.other.hrr_lowest_hr_point.year}</td>
            </tr>
             <tr>
                <td>Floors Climbed</td>
                {this.renderCustomRangeTD(this.state.summary.other.floors_climbed.custom_range)}
                <td>{this.state.summary.other.floors_climbed.today}</td>
                <td>{this.state.summary.other.floors_climbed.yesterday}</td>
                <td>{this.state.summary.other.floors_climbed.week}</td>
                <td>{this.state.summary.other.floors_climbed.month}</td>
                <td>{this.state.summary.other.floors_climbed.year}</td>
            </tr>
        </tbody>
    </table>
</div>
</div>		
<div className=" row justify-content-center padding">
   <div className="table-responsive"> 
    <table className="table table-bordered">
         <thead>
             
                <tr>
                  <th>Sleep Per Night(excluding awake time)</th>
                {this.renderCustomRangeTD(this.state.summary.overall_health.total_gpa_point.custom_range,"key")}
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            </tr>
            
        </thead>
        <tbody>
            <tr>
                <td>Total Sleep in hours:minutes</td>
                {this.renderCustomRangeTD(this.state.summary.sleep.total_sleep_in_hours_min.custom_range)}
                <td>{this.state.summary.sleep.total_sleep_in_hours_min.today}</td>
                <td>{this.state.summary.sleep.total_sleep_in_hours_min.yesterday}</td>
                <td>{this.state.summary.sleep.total_sleep_in_hours_min.week}</td>
                <td>{this.state.summary.sleep.total_sleep_in_hours_min.month}</td>
                <td>{this.state.summary.sleep.total_sleep_in_hours_min.year}</td>
            </tr>
            <tr>
               <td>Rank against other users</td>
                {this.renderCustomRangeTD(this.state.summary.sleep.rank.custom_range)}
                <td>{this.state.summary.sleep.rank.today}</td>
                <td>{this.state.summary.sleep.rank.yesterday}</td>
                <td>{this.state.summary.sleep.rank.week}</td>
                <td>{this.state.summary.sleep.rank.month}</td>
                <td>{this.state.summary.sleep.rank.year}</td>
            </tr>
            <tr>
                <td>Average Sleep Grage</td>
                {this.renderCustomRangeTD(this.state.summary.sleep.average_sleep_grade.custom_range)}
                <td>{this.state.summary.sleep.average_sleep_grade.today}</td>
                <td>{this.state.summary.sleep.average_sleep_grade.yesterday}</td>
                <td>{this.state.summary.sleep.average_sleep_grade.week}</td>
                <td>{this.state.summary.sleep.average_sleep_grade.month}</td>
                <td>{this.state.summary.sleep.average_sleep_grade.year}</td>
            </tr>
            <tr>
                <td># of Days Sleep Aid Taken in Period</td>
                {this.renderCustomRangeTD(this.state.summary.sleep.num_days_sleep_aid_taken_in_period.custom_range)}
                <td>{this.state.summary.sleep.num_days_sleep_aid_taken_in_period.today}</td>
                <td>{this.state.summary.sleep.num_days_sleep_aid_taken_in_period.yesterday}</td>
                <td>{this.state.summary.sleep.num_days_sleep_aid_taken_in_period.week}</td>
                <td>{this.state.summary.sleep.num_days_sleep_aid_taken_in_period.month}</td>
                <td>{this.state.summary.sleep.num_days_sleep_aid_taken_in_period.year}</td>
            </tr>
            <tr>
                <td>% of Days Sleep Aid Taken in Period</td>
                {this.renderCustomRangeTD(this.state.summary.sleep.prcnt_days_sleep_aid_taken_in_period.custom_range)}
                <td>{this.state.summary.sleep.prcnt_days_sleep_aid_taken_in_period.today}</td>
                <td>{this.state.summary.sleep.prcnt_days_sleep_aid_taken_in_period.yesterday}</td>
                <td>{this.state.summary.sleep.prcnt_days_sleep_aid_taken_in_period.week}</td>
                <td>{this.state.summary.sleep.prcnt_days_sleep_aid_taken_in_period.month}</td>
                <td>{this.state.summary.sleep.prcnt_days_sleep_aid_taken_in_period.year}</td>
            </tr>
            <tr>
                <td>Overall Sleep GPA</td>
               {this.renderCustomRangeTD(this.state.summary.sleep.overall_sleep_gpa.custom_range)}
                <td>{this.state.summary.sleep.overall_sleep_gpa.today}</td>
                <td>{this.state.summary.sleep.overall_sleep_gpa.yesterday}</td>
                <td>{this.state.summary.sleep.overall_sleep_gpa.week}</td>
                <td>{this.state.summary.sleep.overall_sleep_gpa.month}</td>
                <td>{this.state.summary.sleep.overall_sleep_gpa.year}</td>
            </tr>
        </tbody>
    </table>
    </div>
</div>        
</div>
</div>
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