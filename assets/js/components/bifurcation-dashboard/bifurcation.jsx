import React,{ Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import NavbarMenu from '../navbar';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink,
        Button,Popover,PopoverBody,Form,FormGroup,FormText,Label,
        Input,Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
        Modal, ModalHeader, ModalBody} from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import FontAwesome from "react-fontawesome";
import fetchProgress from '../../network/progress';
import { getUserProfile } from '../../network/auth';
import {renderOverallBifurcationSelectedDateFetchOverlay,renderOverallBifurcation1FetchOverlay,renderOverallBifurcation2FetchOverlay,renderOverallBifurcation3FetchOverlay,renderOverallBifurcation4FetchOverlay,renderOverallBifurcationSelectedRangeFetchOverlay} from '../leaderboard_healpers';     

var CalendarWidget = require('react-calendar-widget');  
var ReactDOM = require('react-dom');

class Bifurcation extends React.Component{
   constructor(props){
    super(props);
     this.state = {
        selectedDate: new Date(),
        dateRange1:false,
        dateRange2:false,
        dateRange3:false,
        dateRange4:false,
        isOpen1:false,
        dropdownOpen1:false,
        dropdownOpen:false,
        fetching_ql1:false,
        fetching_ql2:false,
        fetching_ql3:false,
        fetching_ql4:false,
        bf1_start_date:'',
        bf2_start_date:'', 
        bf3_start_date:'',
        bf1_end_date:'',
        bf2_end_date:'',
        bf3_end_date:'', 
        numberOfDays:7,
        duration_date:this.getInitialDur(),
        scrollingLock:false,
        date:'',
        capt:'',
        gender:'',
        age:'',
        selected_range:"week",
        selectedRange:{
              dateRange:null,
              rangeType:'today'
            },
        calendarOpen:false,
        active_view:true,
        fetching_bifurcation:false,
        fetching_bifurcation1:false,
        fetching_bifurcation2:false,
        fetching_bifurcation3:false,
        fetching_bifurcation4:false,
        fetching_bifurcation5:false,
        summary:{
          "overall_health":{
                 "overall_health_gpa_grade":this.getInitialDur(),
                 "cum_days_ohg_got_a":this.getInitialDur(),
                 "cum_days_ohg_got_b":this.getInitialDur(),
                 "cum_days_ohg_got_c":this.getInitialDur(),
                 "cum_days_ohg_got_d":this.getInitialDur(),
                 "cum_days_ohg_got_f":this.getInitialDur(),
                 "prcnt_days_ohg_got_a":this.getInitialDur(),
                 "prcnt_days_ohg_got_b":this.getInitialDur(),
                 "prcnt_days_ohg_got_c":this.getInitialDur(),
                 "prcnt_days_ohg_got_d":this.getInitialDur(),
                 "prcnt_days_ohg_got_f":this.getInitialDur(),
                 "overall_health_gpa":this.getInitialDur()
                },
          "non_exercise":{
            "cum_days_nes_above_10k":this.getInitialDur(), 
            "cum_days_nes_above_20k":this.getInitialDur(),
            "cum_days_nes_above_25k":this.getInitialDur(),
            "cum_days_nes_above_30k":this.getInitialDur(),
            "cum_days_nes_above_40k":this.getInitialDur(),
            "cum_days_nes_got_a":this.getInitialDur(),
            "cum_days_nes_got_b":this.getInitialDur(),
            "cum_days_nes_got_c":this.getInitialDur(),
            "cum_days_nes_got_d":this.getInitialDur(),
            "cum_days_nes_got_f":this.getInitialDur(),
            "cum_days_ts_above_10k":this.getInitialDur(),
            "cum_days_ts_above_20k":this.getInitialDur(),
            "cum_days_ts_above_25k":this.getInitialDur(),
            "cum_days_ts_above_30k":this.getInitialDur(),
            "cum_days_ts_above_40k":this.getInitialDur(),
            "cum_days_ts_got_a":this.getInitialDur(),
            "cum_days_ts_got_b":this.getInitialDur(),
            "cum_days_ts_got_c":this.getInitialDur(),
            "cum_days_ts_got_d":this.getInitialDur(),
            "cum_days_ts_got_f":this.getInitialDur(),
            "exercise_steps":this.getInitialDur(),
            "movement_non_exercise_step_grade":this.getInitialDur(),
            "non_exercise_steps":this.getInitialDur(),
            "non_exericse_steps_gpa":this.getInitialDur(),
            "prcnt_days_nes_above_10k":this.getInitialDur(),
            "prcnt_days_nes_above_20k":this.getInitialDur(),
            "prcnt_days_nes_above_25k":this.getInitialDur(),
            "prcnt_days_nes_above_30k":this.getInitialDur(),
            "prcnt_days_nes_above_40k":this.getInitialDur(),
            "prcnt_days_nes_got_a":this.getInitialDur(),
            "prcnt_days_nes_got_b":this.getInitialDur(),
            "prcnt_days_nes_got_c":this.getInitialDur(),
            "prcnt_days_nes_got_d":this.getInitialDur(),
            "prcnt_days_nes_got_f":this.getInitialDur(),
            "prcnt_days_ts_above_10k":this.getInitialDur(),
            "prcnt_days_ts_above_20k":this.getInitialDur(),
            "prcnt_days_ts_above_25k":this.getInitialDur(),
            "prcnt_days_ts_above_30k":this.getInitialDur(),
            "prcnt_days_ts_above_40k":this.getInitialDur(),
            "prcnt_days_ts_got_a":this.getInitialDur(),
            "prcnt_days_ts_got_b":this.getInitialDur(),
            "prcnt_days_ts_got_c":this.getInitialDur(),
            "prcnt_days_ts_got_d":this.getInitialDur(),
            "prcnt_days_ts_got_f":this.getInitialDur(),
            "total_steps":this.getInitialDur()
          },
          "mc":{
            "active_minutes_without_sleep":this.getInitialDur(),
            "active_minutes_without_sleep_exercise":this.getInitialDur(),
            "active_minutes_without_sleep_exercise_prcnt":this.getInitialDur(),
            "active_minutes_without_sleep_prcnt":this.getInitialDur(),
            "cum_days_act_min_no_sleep_exec_got_a":this.getInitialDur(),
            "cum_days_act_min_no_sleep_exec_got_b":this.getInitialDur(),
            "cum_days_act_min_no_sleep_exec_got_c":this.getInitialDur(),
            "cum_days_act_min_no_sleep_exec_got_d":this.getInitialDur(),
            "cum_days_act_min_no_sleep_exec_got_f":this.getInitialDur(),
            "cum_days_mcs_got_a":this.getInitialDur(),
            "cum_days_mcs_got_b":this.getInitialDur(),
            "cum_days_mcs_got_c":this.getInitialDur(),
            "cum_days_mcs_got_d":this.getInitialDur(),
            "cum_days_mcs_got_f":this.getInitialDur(),
            "cum_days_total_act_min_got_a":this.getInitialDur(),
            "cum_days_total_act_min_got_b":this.getInitialDur(),
            "cum_days_total_act_min_got_c":this.getInitialDur(),
            "cum_days_total_act_min_got_d":this.getInitialDur(),
            "cum_days_total_act_min_got_f":this.getInitialDur(),
            "exercise_active_minutes":this.getInitialDur(),
            "movement_consistency_gpa":this.getInitialDur(),
            "movement_consistency_grade":this.getInitialDur(),
            "movement_consistency_score":this.getInitialDur(),
            "prcnt_days_act_min_no_sleep_exec_got_a":this.getInitialDur(),
            "prcnt_days_act_min_no_sleep_exec_got_b":this.getInitialDur(),
            "prcnt_days_act_min_no_sleep_exec_got_c":this.getInitialDur(),
            "prcnt_days_act_min_no_sleep_exec_got_d":this.getInitialDur(),
            "prcnt_days_act_min_no_sleep_exec_got_f":this.getInitialDur(),
            "prcnt_days_mcs_got_a":this.getInitialDur(),
            "prcnt_days_mcs_got_b":this.getInitialDur(),
            "prcnt_days_mcs_got_c":this.getInitialDur(),
            "prcnt_days_mcs_got_d":this.getInitialDur(),
            "prcnt_days_mcs_got_f":this.getInitialDur(),
            "prcnt_days_total_act_min_got_a":this.getInitialDur(),
            "prcnt_days_total_act_min_got_b":this.getInitialDur(),
            "prcnt_days_total_act_min_got_c":this.getInitialDur(),
            "prcnt_days_total_act_min_got_d":this.getInitialDur(),
            "prcnt_days_total_act_min_got_f":this.getInitialDur(),
            "sleep_active_minutes":this.getInitialDur(),
            "total_active_minutes":this.getInitialDur(),
            "total_active_minutes_prcnt":this.getInitialDur()
          },
         "ec":{
            "avg_no_of_days_exercises_per_week":this.getInitialDur(),
            "cum_days_ec_got_a":this.getInitialDur(),
            "cum_days_ec_got_b":this.getInitialDur(),
            "cum_days_ec_got_c":this.getInitialDur(),
            "cum_days_ec_got_d":this.getInitialDur(),
            "cum_days_ec_got_f":this.getInitialDur(),
            "exercise_consistency_gpa":this.getInitialDur(),
            "exercise_consistency_grade":this.getInitialDur(),
            "prcnt_days_ec_got_a":this.getInitialDur(),
            "prcnt_days_ec_got_b":this.getInitialDur(),
            "prcnt_days_ec_got_c":this.getInitialDur(),
            "prcnt_days_ec_got_d":this.getInitialDur(),
            "prcnt_days_ec_got_f":this.getInitialDur()
          }, 
         "exercise":{
          "avg_exercise_heart_rate":this.getInitialDur(),
          "cum_days_workout_dur_got_a":this.getInitialDur(),
          "cum_days_workout_dur_got_b":this.getInitialDur(),
          "cum_days_workout_dur_got_c":this.getInitialDur(),
          "cum_days_workout_dur_got_d":this.getInitialDur(),
          "cum_days_workout_dur_got_f":this.getInitialDur(),
          "prcnt_days_workout_dur_got_a":this.getInitialDur(),
          "prcnt_days_workout_dur_got_b":this.getInitialDur(),
          "prcnt_days_workout_dur_got_c":this.getInitialDur(),
          "prcnt_days_workout_dur_got_d":this.getInitialDur(),
          "prcnt_days_workout_dur_got_f":this.getInitialDur(),
          "workout_duration_hours_min":this.getInitialDur()
         },
         "sleep":{
          "overall_sleep_gpa":this.getInitialDur(),
          "average_sleep_grade":this.getInitialDur(),
          "awake_duration_in_hours_min":this.getInitialDur(),
          "deep_sleep_in_hours_min":this.getInitialDur(),
          "num_days_sleep_aid_taken_in_period":this.getInitialDur(),
          "prcnt_days_sleep_aid_taken_in_period":this.getInitialDur(),
          "total_sleep_in_hours_min":this.getInitialDur(),
          "cum_days_sleep_got_a":this.getInitialDur(),
          "cum_days_sleep_got_b":this.getInitialDur(),
          "cum_days_sleep_got_c":this.getInitialDur(),
          "cum_days_sleep_got_d":this.getInitialDur(),
          "cum_days_sleep_got_f":this.getInitialDur(),
          "prcnt_days_sleep_got_a":this.getInitialDur(),
          "prcnt_days_sleep_got_b":this.getInitialDur(),
          "prcnt_days_sleep_got_c":this.getInitialDur(),
          "prcnt_days_sleep_got_d":this.getInitialDur(),
          "prcnt_days_sleep_got_f":this.getInitialDur()
         },
         "other":{
           "resting_hr":this.getInitialDur(),
           "cum_days_resting_hr_got_a":this.getInitialDur(),
           "cum_days_resting_hr_got_b":this.getInitialDur(),
           "cum_days_resting_hr_got_c":this.getInitialDur(),
           "cum_days_resting_hr_got_d":this.getInitialDur(),
           "cum_days_resting_hr_got_f":this.getInitialDur(),
           "prcnt_days_resting_hr_got_a":this.getInitialDur(),
           "prcnt_days_resting_hr_got_b":this.getInitialDur(),
           "prcnt_days_resting_hr_got_c":this.getInitialDur(),
           "prcnt_days_resting_hr_got_d":this.getInitialDur(),
           "prcnt_days_resting_hr_got_f":this.getInitialDur()
         },
         "nutrition":{
          "cum_days_ufood_got_a":this.getInitialDur(),
          "cum_days_ufood_got_b":this.getInitialDur(),
          "cum_days_ufood_got_c":this.getInitialDur(),
          "cum_days_ufood_got_d":this.getInitialDur(),
          "cum_days_ufood_got_f":this.getInitialDur(),
          "prcnt_days_ufood_got_a":this.getInitialDur(),
          "prcnt_days_ufood_got_b":this.getInitialDur(),
          "prcnt_days_ufood_got_c":this.getInitialDur(),
          "prcnt_days_ufood_got_d":this.getInitialDur(),
          "prcnt_days_ufood_got_f":this.getInitialDur(),
          "prcnt_unprocessed_food_gpa":this.getInitialDur(),
          "prcnt_unprocessed_food_grade":this.getInitialDur(),
          "prcnt_unprocessed_volume_of_food":this.getInitialDur()
         },
         "alcohol":{
          "alcoholic_drinks_per_week_grade":this.getInitialDur(),
          "alcoholic_drinks_per_week_gpa":this.getInitialDur(),
          "avg_drink_per_day":this.getInitialDur(),
          "avg_drink_per_week":this.getInitialDur(),
          "prcnt_alcohol_consumption_reported":this.getInitialDur(),
          "cum_days_alcohol_week_got_a":this.getInitialDur(),
          "cum_days_alcohol_week_got_b":this.getInitialDur(),
          "cum_days_alcohol_week_got_c":this.getInitialDur(),
          "cum_days_alcohol_week_got_d":this.getInitialDur(),
          "cum_days_alcohol_week_got_f":this.getInitialDur(),
          "prcnt_days_alcohol_week_got_a":this.getInitialDur(),
          "prcnt_days_alcohol_week_got_b":this.getInitialDur(),
          "prcnt_days_alcohol_week_got_c":this.getInitialDur(),
          "prcnt_days_alcohol_week_got_d":this.getInitialDur(),
          "prcnt_days_alcohol_week_got_f":this.getInitialDur()
         },
         "stress":{
           "garmin_stress_lvl":this.getInitialDur(),
           "cum_garmin_stress_days_got_a":this.getInitialDur(),
           "cum_garmin_stress_days_got_b":this.getInitialDur(),
           "cum_garmin_stress_days_got_c":this.getInitialDur(),
           "cum_garmin_stress_days_got_d":this.getInitialDur(),
           "cum_garmin_stress_days_got_f":this.getInitialDur(),
           "prcnt_garmin_stress_days_got_a":this.getInitialDur(),
           "prcnt_garmin_stress_days_got_b":this.getInitialDur(),
           "prcnt_garmin_stress_days_got_c":this.getInitialDur(),
           "prcnt_garmin_stress_days_got_d":this.getInitialDur(),
           "prcnt_garmin_stress_days_got_f":this.getInitialDur()
         },

      },

        
    }

     this.onSubmitDate1 = this.onSubmitDate1.bind(this);
     this.onSubmitDate2 = this.onSubmitDate2.bind(this);
     this.onSubmitDate3 = this.onSubmitDate3.bind(this);
     this.onSubmitDate4 = this.onSubmitDate4.bind(this);
     this.errorProgress = this.errorProgress.bind(this);
     this.successProgress = this.successProgress.bind(this);
     this.handleScroll = this.handleScroll.bind(this);
     this.toggle = this.toggle.bind(this);
     this.toggle1 = this.toggle1.bind(this);
     this.toggleDate1 = this.toggleDate1.bind(this);
     this.toggleDate2 = this.toggleDate2.bind(this);
     this.toggleDate3 = this.toggleDate3.bind(this);
     this.toggleDate4 = this.toggleDate4.bind(this);
     this.toggleDropdown = this.toggleDropdown.bind(this);
     this.processDate = this.processDate.bind(this);
     this.reanderAllHrr = this.reanderAllHrr.bind(this);
     this.createExcelPrintURL = this.createExcelPrintURL.bind(this);
     this.toggleCalendar = this.toggleCalendar.bind(this);
     this.renderDateRangeDropdown = this.renderDateRangeDropdown.bind(this);
     this.headerDates = this.headerDates.bind(this);
     this.getInitialDur = this.getInitialDur.bind(this);
     this.renderValue = this.renderValue.bind(this);
     this.renderOverallHealth = this.renderOverallHealth.bind(this);
     this.getOverallGpaColors = this.getOverallGpaColors.bind(this);
     this.renderNonExerciseSteps = this.renderNonExerciseSteps.bind(this);
     this.renderNonExerciseColors = this.renderNonExerciseColors.bind(this);
     this.renderTotalExerciseSteps = this.renderTotalExerciseSteps.bind(this);
     this.renderMcs = this.renderMcs.bind(this);
     this.getMomentConsistencyColors = this.getMomentConsistencyColors.bind(this);
     this.renderEc = this.renderEc.bind(this);  
     this.getExerciseConsistencyColors = this.getExerciseConsistencyColors.bind(this);
     this.renderExerciseStats = this.renderExerciseStats.bind(this); 
     //this.getStylesForExerciseduration = this.getStylesForExerciseduration.bind(this);
     this.exerciseDurColrsSingleDayOr2to6Days = this.exerciseDurColrsSingleDayOr2to6Days.bind(this);
     this.renderActiveMinutes = this.renderActiveMinutes.bind(this);
     this.renderActiveMinutesColors = this.renderActiveMinutesColors.bind(this);
     this.renderActiveMinutesExcludingSleep = this.renderActiveMinutesExcludingSleep.bind(this);
     this.renderSleep = this.renderSleep.bind(this);
     this.getStylesForSleep = this.getStylesForSleep.bind(this);
     this.renderRestingHeartRate = this.renderRestingHeartRate.bind(this);
     this.restingHrColors = this.restingHrColors.bind(this);
     this.renderNutritionStats = this.renderNutritionStats.bind(this);
     this.getStylesForNutritionFood = this.getStylesForNutritionFood.bind(this);
     this.getStylesForSummaryGrades = this.getStylesForSummaryGrades.bind(this);
     this.renderAlcoholStats = this.renderAlcoholStats.bind(this);
     this.getAlcoholColors = this.getAlcoholColors.bind(this);
     this.renderGarminStats = this.renderGarminStats.bind(this);
     this.GarminStressColors = this.GarminStressColors.bind(this);
     this.successProfile = this.successProfile.bind(this);
     this.strToSecond = this.strToSecond.bind(this);
     this.handleChange = this.handleChange.bind(this);
     this.getGradeStartEndRange = this.getGradeStartEndRange.bind(this);
     this.minuteToHM = this.minuteToHM.bind(this);
     this.strToMin = this.strToMin.bind(this);
     this.renderPercent = this.renderPercent.bind(this);
     this.getAlcoholPercent = this.getAlcoholPercent.bind(this);

     
     this.renderOverallBifurcationSelectedDateFetchOverlay = renderOverallBifurcationSelectedDateFetchOverlay.bind(this);
    this.renderOverallBifurcation1FetchOverlay = renderOverallBifurcation1FetchOverlay.bind(this);
    this.renderOverallBifurcation2FetchOverlay = renderOverallBifurcation2FetchOverlay.bind(this);
    this.renderOverallBifurcation3FetchOverlay = renderOverallBifurcation3FetchOverlay.bind(this);
    this.renderOverallBifurcation4FetchOverlay = renderOverallBifurcation4FetchOverlay.bind(this);
    this.renderOverallBifurcationSelectedRangeFetchOverlay = renderOverallBifurcationSelectedRangeFetchOverlay.bind(this);

   }

    getInitialDur(){
     let paDurationInitialState = {
      "week":"-",
            "yesterday":"-",
            "month":"-",
           "custom_range":"-",
            "today":"-", 
            "year":"-"
       };
       return paDurationInitialState;
  }

    toggle(){
    this.setState({
      dropdownOpen1:!this.state.dropdownOpen1
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

    toggleDate4(){
        this.setState({
          dateRange4:!this.state.dateRange4
        });
    }
    
    toggleDropdown() {
      this.setState({
          dropdownOpen: !this.state.dropdownOpen
      });
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

  onSubmitDate1(event){
    event.preventDefault();
    this.setState({
      dateRange1:!this.state.dateRange1,
      fetching_ql1:true,
    },()=>{
        let custom_ranges = [];
        if(this.state.bf2_start_date && this.state.bf2_end_date){
          custom_ranges.push(this.state.bf2_start_date);
          custom_ranges.push(this.state.bf2_end_date);
        }
        if(this.state.bf3_start_date && this.state.bf3_end_date){
          custom_ranges.push(this.state.bf3_start_date);
          custom_ranges.push(this.state.bf3_end_date);
        }
        custom_ranges.push(this.state.bf1_start_date);
        custom_ranges.push(this.state.bf1_end_date);
        let crange1 = this.state.bf1_start_date + " " + "to" + " " + this.state.bf1_end_date ;
        let selected_range = {
            range:crange1,
            duration:this.headerDates(crange1),
            caption:""
       }
      fetchProgress(this.successProgress,this.errorProgress,this.state.selectedDate,
                      custom_ranges,selected_range);
    });
  }

  onSubmitDate2(event){
    event.preventDefault();
    this.setState({
      dateRange2:!this.state.dateRange2,
      fetching_ql2:true,
    },()=>{
      let custom_ranges = [];
      if(this.state.bf1_start_date && this.state.bf1_end_date){
      custom_ranges.push(this.state.bf1_start_date);
      custom_ranges.push(this.state.bf1_end_date);
      }
      if(this.state.bf3_start_date && this.state.bf3_end_date){
      custom_ranges.push(this.state.bf3_start_date);
      custom_ranges.push(this.state.bf3_end_date);
      }

      custom_ranges.push(this.state.bf2_start_date);
      custom_ranges.push(this.state.bf2_end_date);
      let crange1 = this.state.bf2_start_date + " " + "to" + " " + this.state.bf2_end_date; 
      let selected_range = {
      range:crange1,
      duration:this.headerDates(crange1),
      caption:""
      }
      fetchProgress(this.successProgress,this.errorProgress,this.state.selectedDate,
                  custom_ranges,selected_range);
    });
  }
 onSubmitDate3(event){
    event.preventDefault();
    this.setState({
      dateRange3:!this.state.dateRange3,
      fetching_ql3:true,
    },()=>{
         let custom_ranges = [];
         if(this.state.bf1_start_date && this.state.bf1_end_date){
            custom_ranges.push(this.state.bf1_start_date);
            custom_ranges.push(this.state.bf1_end_date);
        }
        if(this.state.bf2_start_date && this.state.bf2_end_date){
            custom_ranges.push(this.state.bf2_start_date);
            custom_ranges.push(this.state.bf2_end_date);
        }
        custom_ranges.push(this.state.bf3_start_date);
        custom_ranges.push(this.state.bf3_end_date);
      let crange1 = this.state.bf3_start_date + " " + "to" + " " + this.state.bf3_end_date 
      let selected_range = {
            range:crange1,
            duration:this.headerDates(crange1),
            caption:""
       }
     fetchProgress(this.successProgress,this.errorProgress,this.state.selectedDate,
                 custom_ranges,selected_range);
    });
  }

  onSubmitDate4(event){
    event.preventDefault();
    this.setState({
      dateRange4:!this.state.dateRange4,
      fetching_ql1:true,
    },()=>{
        let custom_ranges = [];
        if(this.state.bf2_start_date && this.state.bf2_end_date){
            custom_ranges.push(this.state.bf2_start_date);
            custom_ranges.push(this.state.bf2_end_date);
        }
         if(this.state.bf3_start_date && this.state.bf3_end_date){
            custom_ranges.push(this.state.bf3_start_date);
            custom_ranges.push(this.state.bf3_end_date);
        }
        custom_ranges.push(this.state.bf1_start_date);
        custom_ranges.push(this.state.bf1_end_date);

      let crange1 = this.state.bf1_start_date + " " + "to" + " " + this.state.bf1_end_date; 
      let selected_range = {
            range:crange1,
            duration:this.headerDates(crange1),
            caption:""
       }
      fetchProgress(this.successProgress,this.errorProgress,this.state.selectedDate,
                    custom_ranges,selected_range);
    });
  }

  successProgress(data,renderAfterSuccess=undefined){
    let weeklydates = data.data.duration_date["week"];
    let week = this.headerDates(weeklydates);
    // let week_start = moment(data.data.duration_date["week"].split('to')[0]).format("MMM DD, YYYY")
    // let week_end = moment(data.data.duration_date["week"].split('to')[1]).format("MMM DD, YYYY")
    // week = week_start + ' to ' + week_end;
    let date =moment(data.data.duration_date["today"]).format("MMM DD, YYYY"); 
      this.setState({
        fetching_ql1:false,
            fetching_ql2:false,
            fetching_ql3:false,
            fetching_ql4:false,
             // fetching_bifurcation:false,
             // fetching_bifurcation1:false,   
             fetching_bifurcation2:false, 
             fetching_bifurcation3:false, 
             fetching_bifurcation4:false,
             // fetching_bifurcation5:false, 
          report_date:data.data.report_date,
          summary:data.data.summary,
          duration_date:data.data.duration_date,
          capt:"Week",
          date:week,

      },()=>{
            if(renderAfterSuccess){
                let crange = renderAfterSuccess.range;
                let selectedRange = {
                  dateRange:null,
                  rangeType:null,
                }
                selectedRange['dateRange'] = crange;
                selectedRange['rangeType'] = 'custom_range';
                this.reanderAllHrr(
                    renderAfterSuccess.range,
                    renderAfterSuccess.duration,
                    renderAfterSuccess.caption,
                    selectedRange
                );
            }
        });setTimeout(()=>{this.setState({
                fetching_bifurcation:false,
                 fetching_bifurcation1:false, 
              })},200)
    }
    errorProgress(error){
        console.log(error.message);
       this.setState({
          fetching_ql1:false,
            fetching_ql2:false,
            fetching_ql3:false,
            fetching_ql4:false,
            fetching_bifurcation:false,
            fetching_bifurcation1:false,  
            fetching_bifurcation2:false,  
            fetching_bifurcation3:false,  
            fetching_bifurcation4:false,
       })
    }

  reanderAllHrr(period,date,capt,selectedRange){
    let numberOfDays;
    if(selectedRange.rangeType !== 'today' && selectedRange.rangeType !== 'yesterday'){
      let startDate = selectedRange.dateRange.split("to")[0].trim();
      let endDate = selectedRange.dateRange.split("to")[1].trim();
      let numberOfDays = Math.abs(moment(endDate).diff(moment(startDate), 'days'))+1;
      this.setState({
        numberOfDays:numberOfDays,
      })
    }
    else if(selectedRange.rangeType == 'today'){
              this.setState({
                numberOfDays:moment(this.state.selectedDate).format('MMM D, YYYY'),
                
              })
             
         }
    else if(selectedRange.rangeType == 'yesterday'){
      var d = new Date(this.state.selectedDate)
      let  yesterday = new Date(d.getFullYear(),
                                d.getMonth(),
                                d.getDate()-1);
       this.setState({
                numberOfDays:moment(yesterday).format("MMM DD, YYYY"),
              })
    }
    else{
      this.setState({
        numberOfDays:null,
      })
    }
      this.setState({
        selected_range:period,
        date:date,
        capt:capt,
        selectedRange:selectedRange,
        
      },()=>{
        this.setState({
          fetching_bifurcation5:true, 
        })
        
      });
       setTimeout(()=>{this.setState({
                fetching_bifurcation5:false,
              })},200)
    }

   successProfile(data){
    this.setState({
      gender:data.data.gender,
      age:data.data.user_age
    })
   }
  componentDidMount(){
    this.setState({
      fetching_bifurcation1:true,     
    },()=>{
      fetchProgress(this.successProgress,this.errorProgress,this.state.selectedDate);
      getUserProfile(this.successProfile);

    });
    window.addEventListener('scroll', this.handleScroll);
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

    processDate(selectedDate){ 
      this.setState({
        fetching_ql4:true,
        selectedDate: selectedDate,
        calendarOpen:!this.state.calendarOpen,
        numberOfDays:7,
        selected_range:"week",
        fetching_bifurcation:true,   
        fetching_bifurcation1:true, 
        fetching_bifurcation2:true, 
        fetching_bifurcation3:true, 
        fetching_bifurcation4:true,                         
      },()=>{
        fetchProgress(this.successProgress,this.errorProgress,this.state.selectedDate);
      });
    }

   createExcelPrintURL(){
      // code
      let custom_ranges = [];
      let selected_date = moment(this.state.selectedDate).format("YYYY-MM-DD");
      if(this.state.bf1_start_date && this.state.bf1_end_date){
          custom_ranges.push(this.state.bf1_start_date);
          custom_ranges.push(this.state.bf1_end_date);
      }

      if(this.state.bf2_start_date && this.state.bf2_end_date){
          custom_ranges.push(this.state.bf2_start_date);
          custom_ranges.push(this.state.bf2_end_date);
      }
       if(this.state.bf3_start_date && this.state.bf3_end_date){
          custom_ranges.push(this.state.bf3_start_date);
          custom_ranges.push(this.state.bf3_end_date);
      }
      custom_ranges = (custom_ranges && custom_ranges.length) ? custom_ranges.toString():'';
      let excelURL = `progress/print/progress/excel?date=${selected_date}&&custom_ranges=${custom_ranges}`;
      return excelURL;
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
        let selectedRange = {
          dateRange:null,
          rangeType:null
        };
        let rank;
        let capt = dur[0].toUpperCase() + dur.slice(1)
        if(dur == "today"){
          date = moment(value5[dur]).format('MMM DD, YYYY');
          selectedRange['dateRange'] = value5[dur];
          selectedRange['rangeType'] = dur;
          
        }
        else if(dur == "yesterday"){
          date = moment(value5[dur]).format('MMM DD, YYYY');
           selectedRange['dateRange'] = value5[dur];
           selectedRange['rangeType'] = dur;
        }
        else if(dur == "week"){
          date = this.headerDates(value5[dur]);
          selectedRange['dateRange'] = value5[dur];
           selectedRange['rangeType'] = dur;
        }
        else if(dur == "month"){
          date = this.headerDates(value5[dur]);
          selectedRange['dateRange'] = value5[dur];
           selectedRange['rangeType'] = dur;
        }
        else if(dur == "year"){
          date = this.headerDates(value5[dur]);
          selectedRange['dateRange'] = value5[dur];
           selectedRange['rangeType'] = dur;
        }
        else{
          date = this.headerDates(dur);
          capt = "";
          selectedRange['dateRange'] = dur;
          selectedRange['rangeType'] = 'custom_range';
        }

        tableHeaders.push(
         <DropdownItem>
         <a className="dropdown-item" 
          onClick = {this.reanderAllHrr.bind(this,dur,date,capt,selectedRange)}
          style = {{fontSize:"13px"}}>
          {capt}<br/>{date}
        </a></DropdownItem>);
      }
    return tableHeaders;  
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

   renderValue(value,dur){
      let score = "";
      if(dur && dur != "today" && dur != "month" &&
        dur != "yesterday" && dur != "week" && dur != "year"){
            if(value && value['custom_range'] != undefined){
                if(value['custom_range'][dur] != undefined){
          score = value['custom_range'][dur].data;
             }
            }
        }
      else{
          score = value[dur];
      }
      return score;
    }

  renderOverallHealth(ohgpavalue,dur){  
   let overallgpa = this.renderValue(ohgpavalue.overall_health_gpa,dur);
   let overallHealthGrade = this.renderValue(ohgpavalue.overall_health_gpa_grade,dur);
   let ohgpa_a = this.renderValue(ohgpavalue.cum_days_ohg_got_a,dur);
   let ohgpa_b = this.renderValue(ohgpavalue.cum_days_ohg_got_b,dur);
   let ohgpa_c = this.renderValue(ohgpavalue.cum_days_ohg_got_c,dur);
   let ohgpa_d = this.renderValue(ohgpavalue.cum_days_ohg_got_d,dur);
   let ohgpa_f = this.renderValue(ohgpavalue.cum_days_ohg_got_f,dur);
   let ohgpa_prcnt_a = this.renderPercent(this.renderValue(ohgpavalue.prcnt_days_ohg_got_a,dur));
   let ohgpa_prcnt_b = this.renderPercent(this.renderValue(ohgpavalue.prcnt_days_ohg_got_b,dur));
   let ohgpa_prcnt_c = this.renderPercent(this.renderValue(ohgpavalue.prcnt_days_ohg_got_c,dur));
   let ohgpa_prcnt_d = this.renderPercent(this.renderValue(ohgpavalue.prcnt_days_ohg_got_d,dur));
   let ohgpa_prcnt_f = this.renderPercent(this.renderValue(ohgpavalue.prcnt_days_ohg_got_f,dur));
   let numberOfDays = this.state.numberOfDays;

    if( overallgpa == null || overallgpa == undefined ){
      overallgpa = 'NA';  
    }
    if( overallgpa == "Not Reported"){
      overallgpa = 'NR';  
    }
    if( overallgpa == "Not Provided"){
      overallgpa = 'NP'
    }
    
   let overallGpaColors = this.getOverallGpaColors(overallgpa);
   
   if( overallHealthGrade == null || overallHealthGrade == undefined ){
    overallHealthGrade = 'NA';
   }
   if( overallHealthGrade == "Not Reported"){
    overallHealthGrade = 'NR';
   }
   if( overallHealthGrade == "Not Provided"){
      overallHealthGrade = 'NP'
    }
   let overallHealthGradeColor = this.getStylesForSummaryGrades(overallHealthGrade);

   if( ohgpa_a == null || ohgpa_a == undefined || ohgpa_a == ' '){
    ohgpa_a = '-';
   }
   if( ohgpa_b == null || ohgpa_b == undefined || ohgpa_b == ' '){
    ohgpa_b = '-';
   }
   if( ohgpa_c == null || ohgpa_c == undefined || ohgpa_c == ' '){
    ohgpa_c = '-';
   }
   if( ohgpa_d == null || ohgpa_d == undefined || ohgpa_d == ' '){
    ohgpa_d = '-';
   }
   if( ohgpa_f == null || ohgpa_f == undefined || ohgpa_f == ' '){
    ohgpa_f = '-';
   }
   if( ohgpa_prcnt_a == null || ohgpa_prcnt_a == undefined || ohgpa_prcnt_a == ' '){
    ohgpa_prcnt_a = '-';
   }
   if( ohgpa_prcnt_b == null || ohgpa_prcnt_b == undefined || ohgpa_prcnt_b == ' '){
    ohgpa_prcnt_b = '-';
   }
   if( ohgpa_prcnt_c == null || ohgpa_prcnt_c == undefined || ohgpa_prcnt_c == ' '){
    ohgpa_prcnt_c = '-';
   }
   if( ohgpa_prcnt_d == null || ohgpa_prcnt_d == undefined || ohgpa_prcnt_d == ' '){
    ohgpa_prcnt_d = '-';
   }
   if( ohgpa_prcnt_f == null || ohgpa_prcnt_f == undefined || ohgpa_prcnt_f == ' '){
    ohgpa_prcnt_f = '-';
   }

   let Table =  <table className="bifurcation_table">
                <tr>
                <th colSpan={2}>Avg Overall Health GPA</th>
                <th colSpan={3}>Overall Health Grade</th>
                </tr>
                <tr>
                <td colSpan={2} style={{backgroundColor:overallGpaColors[0],color:overallGpaColors[1]}}>{overallgpa}</td>
                <td colSpan={3} style={{backgroundColor:overallHealthGradeColor[0],color:overallHealthGradeColor[1]}}>{overallHealthGrade}</td>
                </tr>
                <th colSpan={5}>Daily Distribution</th>
                <tr>
                <th style={{backgroundColor:'green',color:'white'}}>A</th>
                <th style={{backgroundColor:'#32CD32',color:'white'}}>B</th>
                <th style={{backgroundColor:'Yellow',color:'black'}}>C</th>
                <th style={{backgroundColor:'orange',color:'white'}}>D</th>
                <th style={{backgroundColor:'red',color:'black'}}>F</th>
                </tr> 
                <tr>
                <td style={{backgroundColor:'green',color:'white'}}>>=3.4</td>
                <td style={{backgroundColor:'#32CD32',color:'white'}}>3.0 -<br/>3.39</td>
                <td style={{backgroundColor:'Yellow',color:'black'}}>2.00 -<br/>2.99</td>
                <td style={{backgroundColor:'orange',color:'white'}}>1.0 -<br/>1.99</td>
                <td style={{backgroundColor:'red',color:'black'}}>below<br/>1.0</td>
                </tr>
                <tr>
                <td>{ohgpa_a}</td>
                <td>{ohgpa_b}</td>
                <td>{ohgpa_c}</td>
                <td>{ohgpa_d}</td>
                <td>{ohgpa_f}</td>
                </tr>
                <tr>
                <td>{ohgpa_prcnt_a}</td>
                <td>{ohgpa_prcnt_b}</td>
                <td>{ohgpa_prcnt_c}</td>
                <td>{ohgpa_prcnt_d}</td>
                <td>{ohgpa_prcnt_f}</td>
                </tr>
                <th colSpan={5}>Days in period : {numberOfDays}</th>
                </table>

  return Table;
  }
  
  getOverallGpaColors(ogpascore){
    let background= '';
    let color='';
   
    if( ogpascore == 'NA' || ogpascore == 'NR' || ogpascore == 'NP'){
        background = '';
        color = '';
      }
    else if (ogpascore >= 3.4){
         background='green';
         color='white';
    }
    else if (ogpascore >= 3 && ogpascore < 3.4){
         background='#32CD32';
         color='white';
    }     
    else if (ogpascore >= 2 && ogpascore < 3){
         background='yellow';
         color='black';
    }
    else if (ogpascore >= 1 && ogpascore < 2){
         background='#FF8C00';
         color='white';
    }
    else if (ogpascore < 1){
         background='red';
         color='black';
     }
     return [background,color];
  } 

renderNonExerciseSteps(nesvalue,dur){
  let avg_nonExerciseStepsScore = this.renderValue(nesvalue.non_exercise_steps,dur);
  let nonExerciseStepsgrade = this.renderValue(nesvalue.movement_non_exercise_step_grade,dur);
  let nesvalue_a = this.renderValue(nesvalue.cum_days_nes_got_a,dur);
  let nesvalue_b = this.renderValue(nesvalue.cum_days_nes_got_b,dur);
  let nesvalue_c = this.renderValue(nesvalue.cum_days_nes_got_c,dur);
  let nesvalue_d = this.renderValue(nesvalue.cum_days_nes_got_d,dur);
  let nesvalue_f = this.renderValue(nesvalue.cum_days_nes_got_f,dur);
  let nesvalue_prcnt_a = this.renderPercent(this.renderValue(nesvalue.prcnt_days_nes_got_a,dur));
  let nesvalue_prcnt_b = this.renderPercent(this.renderValue(nesvalue.prcnt_days_nes_got_b,dur));
  let nesvalue_prcnt_c = this.renderPercent(this.renderValue(nesvalue.prcnt_days_nes_got_c,dur));
  let nesvalue_prcnt_d = this.renderPercent(this.renderValue(nesvalue.prcnt_days_nes_got_d,dur));
  let nesvalue_prcnt_f = this.renderPercent(this.renderValue(nesvalue.prcnt_days_nes_got_f,dur));
  let nesvalue_above_10k = this.renderValue(nesvalue.cum_days_nes_above_10k,dur);
  let nesvalue_above_20k = this.renderValue(nesvalue.cum_days_nes_above_20k,dur);
  let nesvalue_above_25k = this.renderValue(nesvalue.cum_days_nes_above_25k,dur);
  let nesvalue_above_30k = this.renderValue(nesvalue.cum_days_nes_above_30k,dur);
  let nesvalue_above_40k = this.renderValue(nesvalue.cum_days_nes_above_40k,dur);
  let nesvalue_prcnt_above_10k = this.renderPercent(this.renderValue(nesvalue.prcnt_days_nes_above_10k,dur));
  let nesvalue_prcnt_above_20k = this.renderPercent(this.renderValue(nesvalue.prcnt_days_nes_above_20k,dur));
  let nesvalue_prcnt_above_25k = this.renderPercent(this.renderValue(nesvalue.prcnt_days_nes_above_25k,dur));
  let nesvalue_prcnt_above_30k = this.renderPercent(this.renderValue(nesvalue.prcnt_days_nes_above_30k,dur));
  let nesvalue_prcnt_above_40k = this.renderPercent(this.renderValue(nesvalue.prcnt_days_nes_above_40k,dur));
  let numberOfDays = this.state.numberOfDays;

  if( avg_nonExerciseStepsScore == null || avg_nonExerciseStepsScore == undefined ){
      avg_nonExerciseStepsScore = 'NA';   
  }
  if( avg_nonExerciseStepsScore == "Not Reported"){
      avg_nonExerciseStepsScore = 'NR';   
  }
    if( avg_nonExerciseStepsScore == "Not Provided"){
      avg_nonExerciseStepsScore = 'NP'
    }

  let avg_nonExerciseStepsColor = this.renderNonExerciseColors(avg_nonExerciseStepsScore);

  if( nonExerciseStepsgrade == null || nonExerciseStepsgrade == undefined ){
      nonExerciseStepsgrade = 'NA';     
  }  
  if( nonExerciseStepsgrade == "Not Reported" ){
      nonExerciseStepsgrade = 'NR';     
  }
  if( nonExerciseStepsgrade == "Not Provided"){
      nonExerciseStepsgrade = 'NP'
    }
  let nonExerciseStepsgradecolor = this.getStylesForSummaryGrades(nonExerciseStepsgrade);

  if( nesvalue_a == null || nesvalue_a == undefined || nesvalue_a == ' ' ){
    nesvalue_a = '-';
  }
  if( nesvalue_b == null || nesvalue_b == undefined || nesvalue_b == ' ' ){
    nesvalue_b = '-';
  }
  if( nesvalue_c == null || nesvalue_c == undefined || nesvalue_c == ' ' ){
    nesvalue_c = '-';
  }
  if( nesvalue_d == null || nesvalue_d == undefined || nesvalue_d == ' ' ){
    nesvalue_d = '-';
  }
  if( nesvalue_f == null || nesvalue_f == undefined || nesvalue_f == ' ' ){
    nesvalue_f = '-';
  }  
  if( nesvalue_prcnt_a == null || nesvalue_prcnt_a == undefined || nesvalue_prcnt_a == ' ' ){
    nesvalue_prcnt_a = '-';
  } 
  if( nesvalue_prcnt_b == null || nesvalue_prcnt_b == undefined || nesvalue_prcnt_b == ' ' ){
    nesvalue_prcnt_b = '-';
  }
  if( nesvalue_prcnt_c == null || nesvalue_prcnt_c == undefined || nesvalue_prcnt_c == ' ' ){
    nesvalue_prcnt_c = '-';
  }
  if( nesvalue_prcnt_d == null || nesvalue_prcnt_d == undefined || nesvalue_prcnt_d == ' ' ){
    nesvalue_prcnt_d = '-';
  }
  if( nesvalue_prcnt_f == null || nesvalue_prcnt_f == undefined || nesvalue_prcnt_f == ' ' ){
    nesvalue_prcnt_f = '-';
  }
  if( nesvalue_above_10k == null || nesvalue_above_10k == undefined || nesvalue_above_10k == ' ' ){
    nesvalue_above_10k = '-';
  }
   if( nesvalue_above_20k == null || nesvalue_above_20k == undefined || nesvalue_above_20k == ' ' ){
    nesvalue_above_20k = '-';
  }
   if( nesvalue_above_25k == null || nesvalue_above_25k == undefined || nesvalue_above_25k == ' ' ){
    nesvalue_above_25k = '-';
  }
   if( nesvalue_above_30k == null || nesvalue_above_30k == undefined || nesvalue_above_30k == ' ' ){
    nesvalue_above_30k = '-';
  }
   if( nesvalue_above_40k == null || nesvalue_above_40k == undefined || nesvalue_above_40k == ' ' ){
    nesvalue_above_40k = '-';
  }
   if( nesvalue_prcnt_above_10k == null || nesvalue_prcnt_above_10k == undefined || nesvalue_prcnt_above_10k == ' ' ){
    nesvalue_prcnt_above_10k = '-';
  }
   if( nesvalue_prcnt_above_20k == null || nesvalue_prcnt_above_20k == undefined || nesvalue_prcnt_above_20k == ' ' ){
    nesvalue_prcnt_above_20k = '-';
  }
   if( nesvalue_prcnt_above_25k == null || nesvalue_prcnt_above_25k == undefined || nesvalue_prcnt_above_25k == ' ' ){
    nesvalue_prcnt_above_25k = '-';
  }  
   if( nesvalue_prcnt_above_30k == null || nesvalue_prcnt_above_30k == undefined || nesvalue_prcnt_above_30k == ' ' ){
    nesvalue_prcnt_above_30k = '-';
  }
   if( nesvalue_prcnt_above_40k == null || nesvalue_prcnt_above_40k == undefined || nesvalue_prcnt_above_40k == ' ' ){
    nesvalue_prcnt_above_40k = '-';
  } 
 
   let Table =  <table className="bifurcation_table" >
                <tr>
                <th colSpan={2}>Avg Non Exercise Steps</th>
                <th colSpan={3}>Non Exercise Steps Grade</th>
                </tr>
                <tr>
                <td colSpan={2} style={{backgroundColor:avg_nonExerciseStepsColor[0],color:avg_nonExerciseStepsColor[1]}}>{this.renderComma(avg_nonExerciseStepsScore)}</td>
                <td colSpan={3} style={{backgroundColor:nonExerciseStepsgradecolor[0],color:nonExerciseStepsgradecolor[1]}}>{nonExerciseStepsgrade}</td>
                </tr>
                <th colSpan={5}>Daily Distribution</th>
                <tr>
                <th style={{backgroundColor:'green',color:'white'}}>A</th>
                <th style={{backgroundColor:'#32CD32',color:'white'}}>B</th>
                <th style={{backgroundColor:'Yellow',color:'black'}}>C</th>
                <th style={{backgroundColor:'orange',color:'white'}}>D</th>
                <th style={{backgroundColor:'red',color:'black'}}>F</th>
                </tr> 
                <tr>
                <td style={{backgroundColor:'green',color:'white'}}>10k+</td>
                <td style={{backgroundColor:'#32CD32',color:'white'}}>7.5k -<br/>9.99k</td>
                <td style={{backgroundColor:'Yellow',color:'black'}}>5.0k -<br/>7.49k</td>
                <td style={{backgroundColor:'orange',color:'white'}}>3.5k -<br/>4.99k</td>
                <td style={{backgroundColor:'red',color:'black'}}>{'<'}3.5k</td>
                </tr>
                <tr>
                <td>{nesvalue_a}</td>
                <td>{nesvalue_b}</td>
                <td>{nesvalue_c}</td>
                <td>{nesvalue_d}</td>
                <td>{nesvalue_f}</td>
                </tr>
                <tr>
                <td>{nesvalue_prcnt_a}</td>
                <td>{nesvalue_prcnt_b}</td>
                <td>{nesvalue_prcnt_c}</td>
                <td>{nesvalue_prcnt_d}</td>
                <td>{nesvalue_prcnt_f}</td>
                </tr>
                <th colSpan={5}>Days in period : {numberOfDays}</th>
                <tr>
                <th colSpan={5} style={{backgroundColor:'green',color:'white'}}>"A" Grade Bifurcation</th>
                </tr>
                 <tr>
                <td style={{backgroundColor:'green',color:'white'}}>10.1k -<br/>19.9k</td>
                <td style={{backgroundColor:'green',color:'white'}}>20k -<br/>24.9k</td>
                <td style={{backgroundColor:'green',color:'white'}}>25k -<br/>29.9k</td>
                <td style={{backgroundColor:'green',color:'white'}}>30k -<br/>40k</td>
                <td style={{backgroundColor:'green',color:'white'}}>>40</td>
                </tr>
                <tr>
                <td>{nesvalue_above_10k}</td>
                <td>{nesvalue_above_20k}</td>
                <td>{nesvalue_above_25k}</td>
                <td>{nesvalue_above_30k}</td>
                <td>{nesvalue_above_40k}</td>
                </tr>
                <tr>
                <td>{nesvalue_prcnt_above_10k}</td>
                <td>{nesvalue_prcnt_above_20k}</td>
                <td>{nesvalue_prcnt_above_25k}</td>
                <td>{nesvalue_prcnt_above_30k}</td>
                <td>{nesvalue_prcnt_above_40k}</td>
                </tr>
                </table>
  return Table; 
  } 
renderNonExerciseColors(steps){
    let background = "";
    let color = "";
    
    if( steps == 'NA' || steps == 'NR' || steps == 'NP'){
      background = '';
      color = '';
    }
    else if (steps >= 10000){
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
   return [background,color];   
}
renderTotalExerciseSteps(tesvalue,dur){
  let tesvalue_a = this.renderValue(tesvalue.cum_days_ts_got_a,dur);
  let tesvalue_b = this.renderValue(tesvalue.cum_days_ts_got_b,dur);
  let tesvalue_c = this.renderValue(tesvalue.cum_days_ts_got_c,dur);
  let tesvalue_d = this.renderValue(tesvalue.cum_days_ts_got_d,dur);
  let tesvalue_f = this.renderValue(tesvalue.cum_days_ts_got_f,dur);
  let tesvalue_prcnt_a = this.renderPercent(this.renderValue(tesvalue.prcnt_days_ts_got_a,dur));
  let tesvalue_prcnt_b = this.renderPercent(this.renderValue(tesvalue.prcnt_days_ts_got_b,dur));
  let tesvalue_prcnt_c = this.renderPercent(this.renderValue(tesvalue.prcnt_days_ts_got_c,dur));
  let tesvalue_prcnt_d = this.renderPercent(this.renderValue(tesvalue.prcnt_days_ts_got_d,dur));
  let tesvalue_prcnt_f = this.renderPercent(this.renderValue(tesvalue.prcnt_days_ts_got_f,dur));
  let tesvalue_above_10k = this.renderValue(tesvalue.cum_days_ts_above_10k,dur);
  let tesvalue_above_20k = this.renderValue(tesvalue.cum_days_ts_above_20k,dur);
  let tesvalue_above_25k = this.renderValue(tesvalue.cum_days_ts_above_25k,dur);
  let tesvalue_above_30k = this.renderValue(tesvalue.cum_days_ts_above_30k,dur);
  let tesvalue_above_40k = this.renderValue(tesvalue.cum_days_ts_above_40k,dur);
  let tesvalue_prcnt_above_10k = this.renderPercent(this.renderValue(tesvalue.prcnt_days_ts_above_10k,dur));
  let tesvalue_prcnt_above_20k = this.renderPercent(this.renderValue(tesvalue.prcnt_days_ts_above_20k,dur));
  let tesvalue_prcnt_above_25k = this.renderPercent(this.renderValue(tesvalue.prcnt_days_ts_above_25k,dur));
  let tesvalue_prcnt_above_30k = this.renderPercent(this.renderValue(tesvalue.prcnt_days_ts_above_30k,dur));
  let tesvalue_prcnt_above_40k = this.renderPercent(this.renderValue(tesvalue.prcnt_days_ts_above_40k,dur));
  let totalSteps = this.renderValue(tesvalue.total_steps,dur);
  let numberOfDays = this.state.numberOfDays;

  if( tesvalue_a == null || tesvalue_a == undefined || tesvalue_a == ' ' ){
      tesvalue_a = '-';
    }
  if( tesvalue_b == null || tesvalue_b == undefined || tesvalue_b == ' ' ){
      tesvalue_b = '-';
    }  
  if( tesvalue_c == null || tesvalue_c == undefined || tesvalue_c == ' ' ){
      tesvalue_c = '-';
    }
  if( tesvalue_d == null || tesvalue_d == undefined || tesvalue_d == ' ' ){
      tesvalue_d = '-';
    } 
  if( tesvalue_f == null || tesvalue_f == undefined || tesvalue_f == ' ' ){
      tesvalue_f = '-';
    }
  if( tesvalue_prcnt_a == null || tesvalue_prcnt_a == undefined || tesvalue_prcnt_a == ' ' ){
      tesvalue_prcnt_a = '-';
    }  
  if( tesvalue_prcnt_b == null || tesvalue_prcnt_b == undefined || tesvalue_prcnt_b == ' ' ){
      tesvalue_prcnt_b = '-';
    }
  if( tesvalue_prcnt_c == null || tesvalue_prcnt_c == undefined || tesvalue_prcnt_c == ' ' ){
      tesvalue_prcnt_c = '-';
    }
  if( tesvalue_prcnt_d == null || tesvalue_prcnt_d == undefined || tesvalue_prcnt_d == ' ' ){
      tesvalue_prcnt_d = '-';
    }
  if( tesvalue_prcnt_f == null || tesvalue_prcnt_f == undefined || tesvalue_prcnt_f == ' ' ){
      tesvalue_prcnt_f = '-';
    }
  if( tesvalue_above_10k == null || tesvalue_above_10k == undefined || tesvalue_above_10k == ' ' ){
      tesvalue_above_10k = '-';
    }
  if( tesvalue_above_20k == null || tesvalue_above_20k == undefined || tesvalue_above_20k == ' ' ){
      tesvalue_above_20k = '-';
    }
  if( tesvalue_above_25k == null || tesvalue_above_25k == undefined || tesvalue_above_25k == ' ' ){
      tesvalue_above_25k = '-';
    }
  if( tesvalue_above_30k == null || tesvalue_above_30k == undefined || tesvalue_above_30k == ' ' ){
      tesvalue_above_30k = '-';
    }                    
  if( tesvalue_above_40k == null || tesvalue_above_40k == undefined || tesvalue_above_40k == ' ' ){
      tesvalue_above_40k = '-';
    }
  if( tesvalue_prcnt_above_10k == null || tesvalue_prcnt_above_10k == undefined || tesvalue_prcnt_above_10k == ' ' ){
      tesvalue_prcnt_above_10k = '-';
    }
  if( tesvalue_prcnt_above_20k == null || tesvalue_prcnt_above_20k == undefined || tesvalue_prcnt_above_20k == ' ' ){
      tesvalue_prcnt_above_20k = '-';
    }
   if( tesvalue_prcnt_above_25k == null || tesvalue_prcnt_above_25k == undefined || tesvalue_prcnt_above_25k == ' ' ){
      tesvalue_prcnt_above_25k = '-';
    }     
  if( tesvalue_prcnt_above_30k == null || tesvalue_prcnt_above_30k == undefined || tesvalue_prcnt_above_30k == ' ' ){
      tesvalue_prcnt_above_30k = '-';
    }
  if( tesvalue_prcnt_above_40k == null || tesvalue_prcnt_above_40k == undefined || tesvalue_prcnt_above_40k == ' ' ){
      tesvalue_prcnt_above_40k = '-';
    } 
   if( totalSteps == null || totalSteps == undefined ){
      totalSteps = 'NA';
    }    
    if( totalSteps == "Not Reported" ){
      totalSteps = 'NR';
    }
     if( totalSteps == "Not Provided"){
      totalSteps = 'NP'
    }
  let Table =  <table className="bifurcation_table">
                  <tr>
                  <th colSpan={5}>Total Steps</th>
                  </tr>
                  <tr>

                  <td  colSpan={5} style={{fontWeight:'bold'}}>{this.renderComma(totalSteps)}</td>
                  </tr>
                  <th colSpan={5}>Daily Distribution</th> 

                  <tr>
                  <td style={{backgroundColor:'green',color:'white'}}>10k+</td>
                  <td style={{backgroundColor:'#32CD32',color:'white'}}>7.5k -<br/>9.99k</td>
                  <td style={{backgroundColor:'Yellow',color:'black'}}>5.0k -<br/>7.49k</td>
                  <td style={{backgroundColor:'orange',color:'white'}}>3.5k -<br/>4.99k</td>
                  <td style={{backgroundColor:'red',color:'black'}}>{'<'}3.5k</td>
                  </tr>
                  <tr>
                  <td>{tesvalue_a}</td>
                  <td>{tesvalue_b}</td>
                  <td>{tesvalue_c}</td>
                  <td>{tesvalue_d}</td>
                  <td>{tesvalue_f}</td>
                  </tr>
                  <tr>
                  <td>{tesvalue_prcnt_a}</td>
                  <td>{tesvalue_prcnt_b}</td>
                  <td>{tesvalue_prcnt_c}</td>
                  <td>{tesvalue_prcnt_d}</td>
                  <td>{tesvalue_prcnt_f}</td>
                  </tr>
                  <th colSpan={5}>Days in period : {numberOfDays}</th>
                  <tr>
                  <th colSpan={5} style={{backgroundColor:'green',color:'white'}}>10k Total Steps Bifurcation</th>
                  </tr>
                   <tr>
                  <td style={{backgroundColor:'green',color:'white'}}>10.1k -<br/>19.9k</td>
                  <td style={{backgroundColor:'green',color:'white'}}>20k -<br/>24.9k</td>
                  <td style={{backgroundColor:'green',color:'white'}}>25k -<br/>29.9k</td>
                  <td style={{backgroundColor:'green',color:'white'}}>30k -<br/>40k</td>
                  <td style={{backgroundColor:'green',color:'white'}}>>40</td>
                  </tr>
                  <tr>
                  <td>{tesvalue_above_10k}</td>
                  <td>{tesvalue_above_20k}</td>
                  <td>{tesvalue_above_25k}</td>
                  <td>{tesvalue_above_30k}</td>
                  <td>{tesvalue_above_40k}</td>
                  </tr>
                  <tr>
                  <td>{tesvalue_prcnt_above_10k}</td>
                  <td>{tesvalue_prcnt_above_20k}</td>
                  <td>{tesvalue_prcnt_above_25k}</td>
                  <td>{tesvalue_prcnt_above_30k}</td>
                  <td>{tesvalue_prcnt_above_40k}</td>
                  </tr>
                  </table>
    return Table;   
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

renderMcs(mcvalue,dur){
  let mcvalue_a = this.renderValue(mcvalue.cum_days_mcs_got_a,dur);
  let mcvalue_b = this.renderValue(mcvalue.cum_days_mcs_got_b,dur);
  let mcvalue_c = this.renderValue(mcvalue.cum_days_mcs_got_c,dur);
  let mcvalue_d = this.renderValue(mcvalue.cum_days_mcs_got_d,dur);
  let mcvalue_f = this.renderValue(mcvalue.cum_days_mcs_got_f,dur);
  let mcvalue_prcnt_a = this.renderPercent(this.renderValue(mcvalue.prcnt_days_mcs_got_a,dur));
  let mcvalue_prcnt_b = this.renderPercent(this.renderValue(mcvalue.prcnt_days_mcs_got_b,dur));
  let mcvalue_prcnt_c = this.renderPercent(this.renderValue(mcvalue.prcnt_days_mcs_got_c,dur));
  let mcvalue_prcnt_d = this.renderPercent(this.renderValue(mcvalue.prcnt_days_mcs_got_d,dur));
  let mcvalue_prcnt_f = this.renderPercent(this.renderValue(mcvalue.prcnt_days_mcs_got_f,dur));
  let mcgrade = this.renderValue(mcvalue.movement_consistency_grade,dur);
  let mcscore = this.renderValue(mcvalue.movement_consistency_score,dur);
  let numberOfDays = this.state.numberOfDays;
  
  if( mcvalue_a == null || mcvalue_a == undefined || mcvalue_a == ' ' ){
      mcvalue_a = '-';
    }
  if( mcvalue_b == null || mcvalue_b == undefined || mcvalue_b == ' ' ){
      mcvalue_b = '-';
    } 
  if( mcvalue_c == null || mcvalue_c == undefined || mcvalue_c == ' ' ){
      mcvalue_c = '-';
    } 
  if( mcvalue_d == null || mcvalue_d == undefined || mcvalue_d == ' ' ){
      mcvalue_d = '-';
    } 
  if( mcvalue_f == null || mcvalue_f == undefined || mcvalue_f == ' ' ){
      mcvalue_f = '-';
    }
  if( mcvalue_prcnt_a == null || mcvalue_prcnt_a == undefined || mcvalue_prcnt_a == ' ' ){
      mcvalue_prcnt_a = '-';
    } 
  if( mcvalue_prcnt_b == null || mcvalue_prcnt_b == undefined || mcvalue_prcnt_b == ' ' ){
      mcvalue_prcnt_b = '-';
    }             
  if( mcvalue_prcnt_c == null || mcvalue_prcnt_c == undefined || mcvalue_prcnt_c == ' ' ){
      mcvalue_prcnt_c = '-';
    }   
  if( mcvalue_prcnt_d == null || mcvalue_prcnt_d == undefined || mcvalue_prcnt_d == ' ' ){
      mcvalue_prcnt_d = '-';
    } 
  if( mcvalue_prcnt_f == null || mcvalue_prcnt_f == undefined || mcvalue_prcnt_f == ' ' ){
      mcvalue_prcnt_f = '-';
    } 
  if( mcgrade == null || mcgrade == undefined ){
      mcgrade = 'NA';
    }
  if( mcgrade == "Not Reported" ){
      mcgrade = 'NR';
    }
   
    let mcGradeColor = this.getStylesForSummaryGrades(mcgrade);
  
  if( mcscore == null || mcscore == undefined ){
      mcscore = 'NA';
    }         
  if( mcscore == "Not Reported" ){
      mcscore = 'NR';
    }
    if( mcscore == "Not Provided"){
      mcscore = 'NP'
    }
    let mcScoreColor= this.getMomentConsistencyColors(mcscore);
 
 let Table =  <table className="bifurcation_table">
                <tr>
                <th colSpan={2}>Movement Consistency Score (MCS)</th>
                <th colSpan={3}>MCS Grade</th>
                </tr>
                <tr>
                <td colSpan={2} style={{backgroundColor:mcScoreColor[0],color:mcScoreColor[1]}}>{mcscore}</td>
                <td colSpan={3} style={{backgroundColor:mcGradeColor[0],color:mcGradeColor[1]}}>{mcgrade}</td>
                </tr>
                <th colSpan={5}>Daily Distribution</th>
                <tr>
                <th style={{backgroundColor:'green',color:'white'}}>A</th>
                <th style={{backgroundColor:'#32CD32',color:'white'}}>B</th>
                <th style={{backgroundColor:'Yellow',color:'black'}}>C</th>
                <th style={{backgroundColor:'orange',color:'white'}}>D</th>
                <th style={{backgroundColor:'red',color:'black'}}>F</th>
                </tr> 
                <tr>
                <td style={{backgroundColor:'green',color:'white'}}>4.5 or<br/>less</td>
                <td style={{backgroundColor:'#32CD32',color:'white'}}>4.51 -<br/>6.0</td>
                <td style={{backgroundColor:'Yellow',color:'black'}}>6.01 -<br/>7.0</td>
                <td style={{backgroundColor:'orange',color:'white'}}>7.01 -<br/>10</td>
                <td style={{backgroundColor:'red',color:'black'}}>>10</td>
                </tr>
                <tr>
                <td>{mcvalue_a}</td>
                <td>{mcvalue_f}</td>
                <td>{mcvalue_c}</td>
                <td>{mcvalue_d}</td>
                <td>{mcvalue_f}</td>
                </tr>
                <tr>
                <td>{mcvalue_prcnt_a}</td>
                <td>{mcvalue_prcnt_b}</td>
                <td>{mcvalue_prcnt_c}</td>
                <td>{mcvalue_prcnt_d}</td>
                <td>{mcvalue_prcnt_f}</td>
                </tr>
                <th colSpan={5}>Days in period : {numberOfDays}</th>
                </table>

  return Table;
  }

  getMomentConsistencyColors(mcscore){
        let background= '';
        let color='';
        
        if(mcscore == 'NA' || mcscore == 'NR' || mcscore == 'NP'){
          background='';
          color='';
        }
        else if (mcscore <= 4.5){
           background='green';
           color='white';
        }
        else if (mcscore > 4.5 && mcscore <= 6){
            background='#32CD32';
            color='white';
        }
        else if (mcscore > 6 && mcscore <= 7){
            background='yellow';
            color='black';
        }
        else if (mcscore > 7 && mcscore <= 10){
            background='#FF8C00';
            color='white';
        }    
        else if (mcscore > 10 ){
            background='red';
            color='black';
        }
      return [background,color];
    }

  renderEc(ecvalue,dur){
    let ecvalue_a = this.renderValue(ecvalue.cum_days_ec_got_a,dur);
    let ecvalue_b = this.renderValue(ecvalue.cum_days_ec_got_b,dur);
    let ecvalue_c = this.renderValue(ecvalue.cum_days_ec_got_c,dur);
    let ecvalue_d = this.renderValue(ecvalue.cum_days_ec_got_d,dur);
    let ecvalue_f = this.renderValue(ecvalue.cum_days_ec_got_f,dur);
    let ecvalue_prcnt_a = this.renderPercent(this.renderValue(ecvalue.prcnt_days_ec_got_a,dur));
    let ecvalue_prcnt_b = this.renderPercent(this.renderValue(ecvalue.prcnt_days_ec_got_b,dur));
    let ecvalue_prcnt_c = this.renderPercent(this.renderValue(ecvalue.prcnt_days_ec_got_c,dur));
    let ecvalue_prcnt_d = this.renderPercent(this.renderValue(ecvalue.prcnt_days_ec_got_d,dur));
    let ecvalue_prcnt_f = this.renderPercent(this.renderValue(ecvalue.prcnt_days_ec_got_f,dur));
    let avgExercisePerWeekValue = this.renderValue(ecvalue.avg_no_of_days_exercises_per_week,dur);
    let ecGrade = this.renderValue(ecvalue.exercise_consistency_grade,dur);
    let numberOfDays = this.state.numberOfDays;
    
    if( ecvalue_a == null || ecvalue_a == undefined || ecvalue_a == ' ' ){
      ecvalue_a = '-';
    }
    if( ecvalue_b == null || ecvalue_b == undefined || ecvalue_b == ' ' ){
      ecvalue_b = '-';
    }
    if( ecvalue_c == null || ecvalue_c == undefined || ecvalue_c == ' ' ){
      ecvalue_c = '-';
    }
    if( ecvalue_d == null || ecvalue_d == undefined || ecvalue_d == ' ' ){
      ecvalue_d = '-';
    }
    if( ecvalue_f == null || ecvalue_f == undefined || ecvalue_f == ' ' ){
      ecvalue_f = '-';
    }
    if( ecvalue_prcnt_a == null || ecvalue_prcnt_a == undefined || ecvalue_prcnt_a == ' ' ){
      ecvalue_prcnt_a = '-';
    }
    if( ecvalue_prcnt_b == null || ecvalue_prcnt_b == undefined || ecvalue_prcnt_b == ' ' ){
      ecvalue_prcnt_b = '-';
    }
    if( ecvalue_prcnt_c == null || ecvalue_prcnt_c == undefined || ecvalue_prcnt_c == ' ' ){
      ecvalue_prcnt_c = '-';
    }
    if( ecvalue_prcnt_d == null || ecvalue_prcnt_d == undefined || ecvalue_prcnt_d == ' ' ){
      ecvalue_prcnt_d = '-';
    }
    if( ecvalue_prcnt_f == null || ecvalue_prcnt_f == undefined || ecvalue_prcnt_f == ' ' ){
      ecvalue_prcnt_f = '-';
    }
    if( avgExercisePerWeekValue == null || avgExercisePerWeekValue == undefined ){
      avgExercisePerWeekValue = 'NA';
    }
    if( avgExercisePerWeekValue == "Not Reported" ){
      avgExercisePerWeekValue = 'NR';
    }
    if( avgExercisePerWeekValue == "Not Provided"){
      avgExercisePerWeekValue = 'NP'
    }

    let exerciseColorPerWeek =  this.getExerciseConsistencyColors(avgExercisePerWeekValue);

    if( ecGrade == null || ecGrade == undefined ){
      ecGrade = 'NA';
    }
    if( ecGrade == "Not Reported" ){
      ecGrade = 'NR';
    }
    if( ecGrade == "Not Provided"){
      ecGrade = 'NP'
    }

    let ecGardeColor = this.getStylesForSummaryGrades(ecGrade);

    let Table =  <table className="bifurcation_table">
                  <tr>
                  <th colSpan={2}>Avg # of Days Exercised/Week</th>
                  <th colSpan={3}>Exercise Consistency Grade</th>
                  </tr>
                  <tr>
                  <td colSpan={2} style={{backgroundColor:exerciseColorPerWeek[0],color:exerciseColorPerWeek[1]}}>{avgExercisePerWeekValue}</td>
                  <td colSpan={3} style={{backgroundColor:ecGardeColor[0],color:ecGardeColor[1]}}>{ecGrade}</td>
                  </tr>
                  <th colSpan={5}>Daily Distribution</th>
                  <tr>
                  <th style={{backgroundColor:'green',color:'white'}}>A</th>
                  <th style={{backgroundColor:'#32CD32',color:'white'}}>B</th>
                  <th style={{backgroundColor:'Yellow',color:'black'}}>C</th>
                  <th style={{backgroundColor:'orange',color:'white'}}>D</th>
                  <th style={{backgroundColor:'red',color:'black'}}>F</th>
                  </tr> 
                  <tr>
                  <td style={{backgroundColor:'green',color:'white'}}>{'<='}4</td>
                  <td style={{backgroundColor:'#32CD32',color:'white'}}>3.0 -<br/>3.99</td>
                  <td style={{backgroundColor:'Yellow',color:'black'}}>2.0 -<br/>2.99</td>
                  <td style={{backgroundColor:'orange',color:'white'}}>1.0 -<br/>1.99</td>
                  <td style={{backgroundColor:'red',color:'black'}}>{'<'}1</td>
                  </tr>
                  <tr>
                  <td>{ecvalue_a}</td>
                  <td>{ecvalue_b}</td>
                  <td>{ecvalue_c}</td>
                  <td>{ecvalue_d}</td>
                  <td>{ecvalue_f}</td>
                  </tr>
                  <tr>
                  <td>{ecvalue_prcnt_a}</td>
                  <td>{ecvalue_prcnt_b}</td>
                  <td>{ecvalue_prcnt_c}</td>
                  <td>{ecvalue_prcnt_d}</td>
                  <td>{ecvalue_prcnt_f}</td>
                  </tr>
                  <th colSpan={5}>Days in period : {numberOfDays}</th>
                  </table>

    return Table;
  }
  
  getExerciseConsistencyColors(ecscore){
      let background=' ';
      let color=' ';

        if( ecscore == 'NA' || ecscore == 'NR' || ecscore == 'NP' ){
           background='';
           color='';
        }
        else if (ecscore >= 4){
            background='green';
            color='white';
        }
        else if (ecscore >= 3 && ecscore < 4){
            background='#32CD32';
            color='white';
        }
        else if (ecscore >= 2 && ecscore < 3){
             background='yellow';
             color='black';
        }
        else if (ecscore >= 1 && ecscore < 2){
            background='#FF8C00';
            color='white';
        }
        else if (ecscore < 1){
            background='red';
            color='black';
        }
    return [background,color];
    }   

  renderExerciseStats(exvalue,dur){
    let exvalue_a = this.renderValue(exvalue.cum_days_workout_dur_got_a,dur);
    let exvalue_b = this.renderValue(exvalue.cum_days_workout_dur_got_b,dur);
    let exvalue_c = this.renderValue(exvalue.cum_days_workout_dur_got_c,dur);
    let exvalue_d = this.renderValue(exvalue.cum_days_workout_dur_got_d,dur);
    let exvalue_f = this.renderValue(exvalue.cum_days_workout_dur_got_f,dur);
    let exvalue_prcnt_a = this.renderPercent(this.renderValue(exvalue.prcnt_days_workout_dur_got_a,dur));
    let exvalue_prcnt_b = this.renderPercent(this.renderValue(exvalue.prcnt_days_workout_dur_got_b,dur));
    let exvalue_prcnt_c = this.renderPercent(this.renderValue(exvalue.prcnt_days_workout_dur_got_c,dur));
    let exvalue_prcnt_d = this.renderPercent(this.renderValue(exvalue.prcnt_days_workout_dur_got_d,dur));
    let exvalue_prcnt_f = this.renderPercent(this.renderValue(exvalue.prcnt_days_workout_dur_got_f,dur));
    let workoutDurationHrMin = this.renderValue(exvalue.workout_duration_hours_min,dur);
    let numberOfDays = this.state.numberOfDays;

    if( exvalue_a == null || exvalue_a == undefined || exvalue_a == ' ' ){
          exvalue_a = '-';
        }
    if( exvalue_b == null || exvalue_b == undefined || exvalue_b == ' ' ){
      exvalue_b= '-';
    }
    if( exvalue_c == null || exvalue_c == undefined || exvalue_c == ' ' ){
      exvalue_c = '-';
    }
    if( exvalue_d == null || exvalue_d == undefined || exvalue_d == ' ' ){
      exvalue_d = '-';
    }
    if( exvalue_f == null || exvalue_f == undefined || exvalue_f == ' ' ){
      exvalue_f = '-';
    }
    if( exvalue_prcnt_a == null || exvalue_prcnt_a == undefined || exvalue_prcnt_a == ' ' ){
      exvalue_prcnt_a = '-';
    }
    if( exvalue_prcnt_b == null || exvalue_prcnt_b == undefined || exvalue_prcnt_b == ' ' ){
      exvalue_prcnt_b = '-';
    }
    if( exvalue_prcnt_c == null || exvalue_prcnt_c == undefined || exvalue_prcnt_c == ' ' ){
      exvalue_prcnt_c = '-';
    }
    if( exvalue_prcnt_d == null || exvalue_prcnt_d == undefined || exvalue_prcnt_d == ' ' ){
      exvalue_prcnt_d = '-';
    }
    if( exvalue_prcnt_f == null || exvalue_prcnt_f == undefined || exvalue_prcnt_f == ' ' ){
      exvalue_prcnt_f = '-';
    }
    if( workoutDurationHrMin == null || workoutDurationHrMin == undefined ){
      workoutDurationHrMin = 'NA';
    }
    if( workoutDurationHrMin == 'Not Reported' ){
      workoutDurationHrMin = 'NR';
    }
    if( workoutDurationHrMin == "Not Provided"){
      workoutDurationHrMin = 'NP'
    }
  
    let workoutdurationColors = this.exerciseDurColrsSingleDayOr2to6Days(workoutDurationHrMin);
    
    let Table =  <table className="bifurcation_table">
                  <tr>
                  <th colSpan={5}>Exercise Duration (hh:mm)</th>
                  </tr>
                  <tr>
                  <td colSpan={5} style={{backgroundColor:workoutdurationColors[0],color:workoutdurationColors[1]}}>{workoutDurationHrMin}</td>
                  </tr>
                  <th colSpan={5}>Daily Distribution</th>
                  <tr>
                  <td style={{backgroundColor:'green',color:'white'}}>A</td>
                  <td style={{backgroundColor:'#32CD32',color:'white'}}>B</td>
                  <td style={{backgroundColor:'Yellow',color:'black'}}>C</td>
                  <td style={{backgroundColor:'orange',color:'white'}}>D</td>
                  <td style={{backgroundColor:'red',color:'black'}}>F</td>
                  </tr> 
                  <tr>
                  <td style={{backgroundColor:'green',color:'white'}}>>=1:00</td>
                  <td style={{backgroundColor:'#32CD32',color:'white'}}>0:30 -<br/>0:59</td>
                  <td style={{backgroundColor:'Yellow',color:'black'}}>0:15 -<br/>0:29</td>
                  <td style={{backgroundColor:'orange',color:'white'}}>0:01 -<br/>0:14</td>
                  <td style={{backgroundColor:'red',color:'black'}}>0</td>
                  </tr>
                  <tr>
                  <td>{exvalue_a}</td>
                  <td>{exvalue_b}</td>
                  <td>{exvalue_c}</td>
                  <td>{exvalue_d}</td>
                  <td>{exvalue_f}</td>
                  </tr>
                  <tr>
                  <td>{exvalue_prcnt_a}</td>
                  <td>{exvalue_prcnt_b}</td>
                  <td>{exvalue_prcnt_c}</td>
                  <td>{exvalue_prcnt_d}</td>
                  <td>{exvalue_prcnt_f}</td>
                  </tr>
                  <th colSpan={5}>Days in period : {numberOfDays}</th>
                  </table>
    return Table;  
  }

  strToSecond(value){
    let time = value.split(':');
    let hours = parseInt(time[0])*3600;
    let min = parseInt(time[1])*60;
    let s_time = hours + min;
    return s_time;
  }


  exerciseDurColrsSingleDayOr2to6Days(ExDurHrMinvalue){
    let background='';
    let color='';
    let exDurHrMinInSeconds = this.strToSecond(ExDurHrMinvalue);    
      if(exDurHrMinInSeconds == 'NA' || exDurHrMinInSeconds == 'NR' || exDurHrMinInSeconds == 'NP'){
        background='';
        color='';
      }
      else if(exDurHrMinInSeconds == this.strToSecond("0:00")){
        background = "red";
          color = "black";
      }
      else if(this.strToSecond("00:01") <= exDurHrMinInSeconds && exDurHrMinInSeconds < this.strToSecond("00:15")){
        background = "orange";
            color = "white";
        }
      else if(this.strToSecond("00:15") <= exDurHrMinInSeconds && exDurHrMinInSeconds < this.strToSecond("00:30")){
        background = "yellow";
            color = "black";
        }
      else if((this.strToSecond("00:30") <= exDurHrMinInSeconds && exDurHrMinInSeconds < this.strToSecond("01:00"))){
        background = "#32CD32";
            color = "white";
        }
      else if(this.strToSecond("01:00")<=exDurHrMinInSeconds){
        background = "green";
            color = "white";
        }
        return [background,color];
  }

 renderActiveMinutes(totalactminvalue,dur){
  let avg_actminWithoutSleep = this.renderValue(totalactminvalue.total_active_minutes,dur);
  let totalactminvalue_a = this.renderValue(totalactminvalue.cum_days_total_act_min_got_a,dur);
  let totalactminvalue_b = this.renderValue(totalactminvalue.cum_days_total_act_min_got_b,dur);
  let totalactminvalue_c = this.renderValue(totalactminvalue.cum_days_total_act_min_got_c,dur);
  let totalactminvalue_d = this.renderValue(totalactminvalue.cum_days_total_act_min_got_d,dur);
  let totalactminvalue_f = this.renderValue(totalactminvalue.cum_days_total_act_min_got_f,dur);
  let totalactminvalue_prcnt_a = this.renderPercent(this.renderValue(totalactminvalue.prcnt_days_total_act_min_got_a,dur));
  let totalactminvalue_prcnt_b = this.renderPercent(this.renderValue(totalactminvalue.prcnt_days_total_act_min_got_b,dur));
  let totalactminvalue_prcnt_c = this.renderPercent(this.renderValue(totalactminvalue.prcnt_days_total_act_min_got_c,dur));
  let totalactminvalue_prcnt_d = this.renderPercent(this.renderValue(totalactminvalue.prcnt_days_total_act_min_got_d,dur));
  let totalactminvalue_prcnt_f = this.renderPercent(this.renderValue(totalactminvalue.prcnt_days_total_act_min_got_f,dur));
  let numberOfDays = this.state.numberOfDays;
  
   if( avg_actminWithoutSleep == null || avg_actminWithoutSleep == undefined ){
      avg_actminWithoutSleep = 'NA';
   }
   if( avg_actminWithoutSleep == "Not Reported"){
      avg_actminWithoutSleep = 'NR';
   }
   if( avg_actminWithoutSleep == "Not Provided"){
      avg_actminWithoutSleep = 'NP'
    }
   
   let colorsforActiveMin = this.renderActiveMinutesColors(avg_actminWithoutSleep);

   if( totalactminvalue_a == null || totalactminvalue_a == undefined || totalactminvalue_a == " "){
      totalactminvalue_a = '-';
   }
   if( totalactminvalue_b == null || totalactminvalue_b == undefined || totalactminvalue_b == " "){
      totalactminvalue_b = '-';
   }
   if( totalactminvalue_c == null || totalactminvalue_c == undefined || totalactminvalue_c == " "){
      totalactminvalue_c = '-';
   }
   if( totalactminvalue_d == null || totalactminvalue_d == undefined || totalactminvalue_d == " "){
      totalactminvalue_d = '-';
   }
   if( totalactminvalue_f == null || totalactminvalue_f == undefined || totalactminvalue_f == " "){
      totalactminvalue_f = '-';
   } 
  if( totalactminvalue_prcnt_a == null || totalactminvalue_prcnt_a == undefined || totalactminvalue_prcnt_a == " "){
      totalactminvalue_prcnt_a = '-';
   } 
  if( totalactminvalue_prcnt_b == null || totalactminvalue_prcnt_b == undefined || totalactminvalue_prcnt_b == " "){
      totalactminvalue_prcnt_b = '-';
   } 
  if( totalactminvalue_prcnt_c == null || totalactminvalue_prcnt_c == undefined || totalactminvalue_prcnt_c == " "){
      totalactminvalue_prcnt_c = '-';
   } 
  if( totalactminvalue_prcnt_d == null || totalactminvalue_prcnt_d == undefined || totalactminvalue_prcnt_d == " "){
      totalactminvalue_prcnt_d = '-';
   } 
  if( totalactminvalue_prcnt_f == null || totalactminvalue_prcnt_f == undefined || totalactminvalue_prcnt_f == " "){
      totalactminvalue_prcnt_f = '-';
   }             
  let Table =  <table className="bifurcation_table">
                  <tr>
                  <th colSpan={5}>Active Minutes 24 Hours (hh:mm)</th>
                  </tr>
                  <tr>
                  <td colSpan={5} style={{backgroundColor:colorsforActiveMin[0],color:colorsforActiveMin[1]}}>{colorsforActiveMin[2]}</td>
                  </tr>
                  <th colSpan={5}>Daily Distribution</th>
                  <tr>
                  <td style={{backgroundColor:'green',color:'white'}}>>= 3:06</td>
                  <td style={{backgroundColor:'#32CD32',color:'white'}}>2:13 -<br/>3:05</td>
                  <td style={{backgroundColor:'Yellow',color:'black'}}>1:45 -<br/>2:12</td>
                  <td style={{backgroundColor:'orange',color:'white'}}>1:01 or<br/>1:44</td>
                  <td style={{backgroundColor:'red',color:'black'}}>1:00 or<br/>less</td>
                  </tr>
                  <tr>
                  <td>{totalactminvalue_a}</td>
                  <td>{totalactminvalue_b}</td>
                  <td>{totalactminvalue_c}</td>
                  <td>{totalactminvalue_d}</td>
                  <td>{totalactminvalue_f}</td>
                  </tr>
                  <tr>
                  <td>{totalactminvalue_prcnt_a}</td>
                  <td>{totalactminvalue_prcnt_b}</td>
                  <td>{totalactminvalue_prcnt_c}</td>
                  <td>{totalactminvalue_prcnt_d}</td>
                  <td>{totalactminvalue_prcnt_f}</td>
                  </tr>
                  <th colSpan={5}>Days in period : {numberOfDays}</th>
                  </table>
    return Table;  
 }

 minuteToHM(value) {
  var time;
  if( isNaN(value) || value == null ){
      return "00:00";
  } 
  if(value){
    if(value == "NA" || value == "NR" || value =="NP" ){
      time = "00:00";
    }
    else if(value>0){
      var min_num = parseInt(value); 
      var hours   = Math.floor(min_num / 60);
      var minutes = Math.floor(min_num % 60);

      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      time = hours+':'+minutes;
    }
  }
  else if(value == 0 || value == null ){
    time = "00:00";
  }
  return time;
}
 
getGradeStartEndRange(exerciseActiveDuration=null){
  let gradeRanges = {
    'A':["03:06","03:06"], //[lower End, higher End]
    'B':["02:13","03:05"],
    'C':["01:45","02:12"],
    'D':["01:01","01:44"],
    'F':["00:00","01:00"]
  }

  if(exerciseActiveDuration){
    const EXERCISE_ACTIVE_TIME_CAP = 60;
    let timeToDeduct = EXERCISE_ACTIVE_TIME_CAP;
    exerciseActiveDuration = this.strToMin(exerciseActiveDuration);
    if(exerciseActiveDuration < EXERCISE_ACTIVE_TIME_CAP)
      timeToDeduct = exerciseActiveDuration;
    for(let [grade,range] of Object.entries(gradeRanges)){
      let lowEnd = this.strToMin(range[0]);
      let highEnd = this.strToMin(range[1]);
      if(lowEnd != 0)
        gradeRanges[grade][0] = this.minuteToHM(lowEnd - timeToDeduct)
      gradeRanges[grade][1] = this.minuteToHM(highEnd - timeToDeduct)
    }

  }

  return gradeRanges
}

strToMin(value){
    let time = value.split(':');
    let hours = parseInt(time[0])*60;
    let mins = parseInt(time[1]);
    return hours+mins;
}

renderActiveMinutesColors(totalActiveDuration,exerciseActiveMin=null){
  let gradeStartEndRange = this.getGradeStartEndRange(exerciseActiveMin);
  totalActiveDuration = this.minuteToHM(totalActiveDuration);
  let totalTimeInSeconds = this.strToSecond(totalActiveDuration);
  let background = "";
  let color = "";
  if( totalActiveDuration == "00:00"){
    totalActiveDuration = 'NR';
  }
  else if( totalTimeInSeconds == 0){
    background='';
    color='';
  }
  else if(totalTimeInSeconds >= this.strToSecond(gradeStartEndRange.A[0])){
    background = "green";
    color = "white";
  }else if(totalTimeInSeconds >= this.strToSecond(gradeStartEndRange.B[0]) 
       && totalTimeInSeconds <= this.strToSecond(gradeStartEndRange.B[1])){
    background = "#32CD32";
    color = "white";
  }else if(totalTimeInSeconds >= this.strToSecond(gradeStartEndRange.C[0])
       && totalTimeInSeconds <= this.strToSecond(gradeStartEndRange.C[1])){
    background = "yellow";
    color = "black";
  }else if(totalTimeInSeconds >= this.strToSecond(gradeStartEndRange.D[0])
       && totalTimeInSeconds <= this.strToSecond(gradeStartEndRange.D[1])){
    background = "orange";
    color = "white";
  }else{
    background = "red";
    color = "black";
  }
  return [background,color,totalActiveDuration];

}      

 renderActiveMinutesExcludingSleep(amexsvalue,dur){
   let amexsvalue_avg = this.renderValue(amexsvalue.active_minutes_without_sleep_exercise,dur);
   let amexsvalue_a = this.renderValue(amexsvalue.cum_days_act_min_no_sleep_exec_got_a,dur);
   let amexsvalue_b = this.renderValue(amexsvalue.cum_days_act_min_no_sleep_exec_got_b,dur);
   let amexsvalue_c = this.renderValue(amexsvalue.cum_days_act_min_no_sleep_exec_got_c,dur);
   let amexsvalue_d = this.renderValue(amexsvalue.cum_days_act_min_no_sleep_exec_got_d,dur);
   let amexsvalue_f = this.renderValue(amexsvalue.cum_days_act_min_no_sleep_exec_got_f,dur);
   let amexsvalue_prcnt_a = this.renderPercent(this.renderValue(amexsvalue.prcnt_days_act_min_no_sleep_exec_got_a,dur));
   let amexsvalue_prcnt_b = this.renderPercent(this.renderValue(amexsvalue.prcnt_days_act_min_no_sleep_exec_got_b,dur));
   let amexsvalue_prcnt_c = this.renderPercent(this.renderValue(amexsvalue.prcnt_days_act_min_no_sleep_exec_got_c,dur));
   let amexsvalue_prcnt_d = this.renderPercent(this.renderValue(amexsvalue.prcnt_days_act_min_no_sleep_exec_got_d,dur));
   let amexsvalue_prcnt_f = this.renderPercent(this.renderValue(amexsvalue.prcnt_days_act_min_no_sleep_exec_got_f,dur));
   let numberOfDays = this.state.numberOfDays;

   
   if( amexsvalue_avg == null || amexsvalue_avg == undefined ){
      amexsvalue_avg = 'NA';
   }
   if( amexsvalue_avg == "Not Reported"){
      amexsvalue_avg = 'NR';
   }  
   if( amexsvalue_avg == "Not Provided"){
      amexsvalue_avg = 'NP'
    }

   let avg_amexsvaluecolors = this.renderActiveMinutesColors(amexsvalue_avg);

   if( amexsvalue_a == null || amexsvalue_a == undefined || amexsvalue_a == " "){
      amexsvalue_a = '-';
   } 
   if( amexsvalue_b == null || amexsvalue_b == undefined || amexsvalue_b == " "){
      amexsvalue_b = '-';
   }
   if( amexsvalue_c == null || amexsvalue_c == undefined || amexsvalue_c == " "){
      amexsvalue_c = '-';
   }
   if( amexsvalue_d == null || amexsvalue_d == undefined || amexsvalue_d == " "){
      amexsvalue_d = '-';
   }
   if( amexsvalue_f == null || amexsvalue_f == undefined || amexsvalue_f == " "){
      amexsvalue_f = '-';
   } 
   if( amexsvalue_prcnt_a == null || amexsvalue_prcnt_a == undefined || amexsvalue_prcnt_a == " "){
      amexsvalue_prcnt_a = '-';
   }
  if( amexsvalue_prcnt_b == null || amexsvalue_prcnt_b == undefined || amexsvalue_prcnt_b == " "){
      amexsvalue_prcnt_b = '-';
   }
  if( amexsvalue_prcnt_c == null || amexsvalue_prcnt_c == undefined || amexsvalue_prcnt_c == " "){
      amexsvalue_prcnt_c = '-';
   }
  if( amexsvalue_prcnt_d == null || amexsvalue_prcnt_d == undefined || amexsvalue_prcnt_d == " "){
      amexsvalue_prcnt_d = '-';
   }
  if( amexsvalue_prcnt_f == null || amexsvalue_prcnt_f == undefined || amexsvalue_prcnt_f == " "){
      amexsvalue_prcnt_f = '-';
   }
      
    let Table =  <table className="bifurcation_table">
                  <tr>
                  <th colSpan={5}>Active Minutes 24 Hours Excluding Sleep and Exercise (hh:mm)</th>
                  </tr>
                  <tr>
                  <td colSpan={5} style={{backgroundColor:avg_amexsvaluecolors[0],color:avg_amexsvaluecolors[1]}}>{avg_amexsvaluecolors[2]}</td>
                  </tr>
                  <th colSpan={5}>Daily Distribution</th>
                  <tr>
                  <td style={{backgroundColor:'green',color:'white'}}>>= 3:06</td>
                  <td style={{backgroundColor:'#32CD32',color:'white'}}>2:13 -<br/>3:05</td>
                  <td style={{backgroundColor:'Yellow',color:'black'}}>1:45 -<br/>2:12</td>
                  <td style={{backgroundColor:'orange',color:'white'}}>1:01 or<br/>1:44</td>
                  <td style={{backgroundColor:'red',color:'black'}}>1:00 or<br/>less</td>
                  </tr>
                  <tr>
                  <td>{amexsvalue_a}</td>
                  <td>{amexsvalue_b}</td>
                  <td>{amexsvalue_c}</td>
                  <td>{amexsvalue_d}</td>
                  <td>{amexsvalue_f}</td>
                  </tr>
                  <tr>
                  <td>{amexsvalue_prcnt_a}</td>
                  <td>{amexsvalue_prcnt_b}</td>
                  <td>{amexsvalue_prcnt_c}</td>
                  <td>{amexsvalue_prcnt_d}</td>
                  <td>{amexsvalue_prcnt_f}</td>
                  </tr>
                  <th colSpan={5}>Days in period : {numberOfDays}</th>
                  </table>
    return Table; 
 }

 renderRestingHeartRate(restinghrvalue,dur){
  let restinghr_avg_score =this.renderValue(restinghrvalue.resting_hr,dur);
  let restinghrvalue_a = this.renderValue(restinghrvalue.cum_days_resting_hr_got_a,dur);
  let restinghrvalue_b = this.renderValue(restinghrvalue.cum_days_resting_hr_got_b,dur);
  let restinghrvalue_c = this.renderValue(restinghrvalue.cum_days_resting_hr_got_c,dur);
  let restinghrvalue_d = this.renderValue(restinghrvalue.cum_days_resting_hr_got_d,dur);
  let restinghrvalue_f = this.renderValue(restinghrvalue.cum_days_resting_hr_got_f,dur);
  let restinghrvalue_prcnt_a = this.renderPercent(this.renderValue(restinghrvalue.prcnt_days_resting_hr_got_a,dur));  
  let restinghrvalue_prcnt_b = this.renderPercent(this.renderValue(restinghrvalue.prcnt_days_resting_hr_got_b,dur));  
  let restinghrvalue_prcnt_c = this.renderPercent(this.renderValue(restinghrvalue.prcnt_days_resting_hr_got_c,dur));  
  let restinghrvalue_prcnt_d = this.renderPercent(this.renderValue(restinghrvalue.prcnt_days_resting_hr_got_d,dur));  
  let restinghrvalue_prcnt_f = this.renderPercent(this.renderValue(restinghrvalue.prcnt_days_resting_hr_got_f,dur));  
  let numberOfDays = this.state.numberOfDays;

  if( restinghr_avg_score == null || restinghr_avg_score == undefined ){
      restinghr_avg_score = 'NA';
    }
   if( restinghr_avg_score == "Not Reported" ){
      restinghr_avg_score = 'NR';
    }
  if( restinghr_avg_score == "Not Provided"){
      restinghr_avg_score = 'NP'
    }

    let restinghrScoreColor = this.restingHrColors(restinghr_avg_score);

  if( restinghrvalue_a == null || restinghrvalue_a == undefined || restinghrvalue_a == ' ' ){
      restinghrvalue_a = '-';
    }
   else if(restinghrvalue_a!= null || restinghrvalue_a!= undefined || restinghrvalue_a!= ' ' ){
        let outres11 = parseFloat(restinghrvalue_a)
        // restinghrvalue_a =outres11.toFixed(1)
   }
  if( restinghrvalue_b == null || restinghrvalue_b == undefined || restinghrvalue_b == ' ' ){
      restinghrvalue_b = '-';
    }
  else if(restinghrvalue_b!= null || restinghrvalue_b!= undefined || restinghrvalue_b!= ' ' ){
        let outres12 = parseFloat(restinghrvalue_b)
        // restinghrvalue_b =outres12.toFixed(1)
   }
  if( restinghrvalue_c == null || restinghrvalue_c == undefined || restinghrvalue_c == ' ' ){
      restinghrvalue_c = '-';
    }
  else if(restinghrvalue_c!= null || restinghrvalue_c!= undefined || restinghrvalue_c!= ' ' ){
        let outres13 = parseFloat(restinghrvalue_c)
        // restinghrvalue_c =outres13.toFixed(1)
   }
  if( restinghrvalue_d == null || restinghrvalue_d == undefined || restinghrvalue_d == ' ' ){
      restinghrvalue_d = '-';
    }
  else if(restinghrvalue_d!= null || restinghrvalue_d!= undefined || restinghrvalue_d!= ' ' ){
       let outres14 = parseFloat(restinghrvalue_d)
        // restinghrvalue_d =outres14.toFixed(1)
   }
  if( restinghrvalue_f == null || restinghrvalue_f == undefined || restinghrvalue_f == ' ' ){
      restinghrvalue_f = '-';

    }     
  else if(restinghrvalue_f!= null || restinghrvalue_f!= undefined || restinghrvalue_f!= ' ' ){
       let outres15 = parseFloat(restinghrvalue_f)
        // restinghrvalue_f =outres15.toFixed(1)
   }   
  if( restinghrvalue_prcnt_a == null || restinghrvalue_prcnt_a == undefined || restinghrvalue_prcnt_a == ' ' ){
      restinghrvalue_prcnt_a = '-';
    }
  if( restinghrvalue_prcnt_b == null || restinghrvalue_prcnt_b == undefined || restinghrvalue_prcnt_b == ' ' ){
      restinghrvalue_prcnt_b = '-';
    }
  if( restinghrvalue_prcnt_c == null || restinghrvalue_prcnt_c == undefined || restinghrvalue_prcnt_c == ' ' ){
      restinghrvalue_prcnt_c = '-';
    }
  if( restinghrvalue_prcnt_d == null || restinghrvalue_prcnt_d == undefined || restinghrvalue_prcnt_d == ' ' ){
      restinghrvalue_prcnt_d = '-';
    }
  if( restinghrvalue_prcnt_f == null || restinghrvalue_prcnt_f == undefined || restinghrvalue_prcnt_f == ' ' ){
      restinghrvalue_prcnt_f = '-';
    }
            
    let Table =  <table className="bifurcation_table">
                  <tr>
                  <th colSpan={5}>Resting Heart Rate</th>
                  </tr>
                  <tr>
                  <td colSpan={5} style={{backgroundColor:restinghrScoreColor[0],color:restinghrScoreColor[1]}}>{restinghr_avg_score}</td>
                  </tr>
                  <th colSpan={5}>Daily Distribution</th>
                  <tr>
                  <td style={{backgroundColor:'green',color:'white'}}>30-60</td>
                  <td style={{backgroundColor:'#32CD32',color:'white'}}>61-68</td>
                  <td style={{backgroundColor:'Yellow',color:'black'}}>69-74</td>
                  <td style={{backgroundColor:'orange',color:'white'}}>75-79</td>
                  <td style={{backgroundColor:'red',color:'black'}}>>80 ;<br/>{'<'}30</td>
                  </tr>
                  <tr>
                  <td>{restinghrvalue_a}</td>
                  <td>{restinghrvalue_b}</td>
                  <td>{restinghrvalue_c}</td>
                  <td>{restinghrvalue_d}</td>
                  <td>{restinghrvalue_f}</td>
                  </tr>
                  <tr>
                  <td>{restinghrvalue_prcnt_a}</td>
                  <td>{restinghrvalue_prcnt_b}</td>
                  <td>{restinghrvalue_prcnt_c}</td>
                  <td>{restinghrvalue_prcnt_d}</td>
                  <td>{restinghrvalue_prcnt_f}</td>
                  </tr>
                  <th colSpan={5}>Days in period : {numberOfDays}</th>
                  </table>
    return Table; 

}

restingHrColors(rhrscore){
   let background='';
   let color='';

      if( rhrscore == 'NA' || rhrscore == 'NR' || rhrscore == 'NP'){
          background='';
          color='';
      }
      else if(rhrscore>=80){
          background = 'red';
          color = 'black';
      }
      else if(rhrscore>=75 && rhrscore<=79){
          background = '#ff8c00'; //Orange
          color = 'black';
      }
      else if(rhrscore>=69 && rhrscore<=74){
          background = '#ffff00' ; //Yellow
          color = 'black';
      }
      else if(rhrscore >=61 && rhrscore <= 68){
          background = '#32cd32'; //Light getGarminToken
          color = 'white';
      }
      else if(rhrscore >=30 && rhrscore <= 60){
          background = '#008000'; 
          color = 'white';
      }
      else if(rhrscore<30){
          background = 'red';
          color = 'black';
      }
    return [background,color];  
 }

 renderSleep(sleepvalue,userage,dur){
  let sleepgrade = this.renderValue(sleepvalue.average_sleep_grade,dur);
  let awake_time = this.renderValue(sleepvalue.total_sleep_in_hours_min,dur);
  let sleepvalue_a = this.renderValue(sleepvalue.cum_days_sleep_got_a,dur); 
  let sleepvalue_b = this.renderValue(sleepvalue.cum_days_sleep_got_b,dur); 
  let sleepvalue_c = this.renderValue(sleepvalue.cum_days_sleep_got_c,dur); 
  let sleepvalue_d = this.renderValue(sleepvalue.cum_days_sleep_got_d,dur); 
  let sleepvalue_f = this.renderValue(sleepvalue.cum_days_sleep_got_f,dur); 
  let sleepvalue_prcnt_a = this.renderPercent(this.renderValue(sleepvalue.prcnt_days_sleep_got_a,dur));
  let sleepvalue_prcnt_b = this.renderPercent(this.renderValue(sleepvalue.prcnt_days_sleep_got_b,dur));
  let sleepvalue_prcnt_c = this.renderPercent(this.renderValue(sleepvalue.prcnt_days_sleep_got_c,dur));
  let sleepvalue_prcnt_d = this.renderPercent(this.renderValue(sleepvalue.prcnt_days_sleep_got_d,dur));
  let sleepvalue_prcnt_f = this.renderPercent(this.renderValue(sleepvalue.prcnt_days_sleep_got_f,dur));
  let numberOfDays = this.state.numberOfDays;

  if( sleepgrade == null || sleepgrade == undefined ){
      sleepgrade = 'NA';
    }
  if( sleepgrade == "Not Reported" ){
      sleepgrade = 'NR';
    }
  if( sleepgrade == "Not Provided" ){
      sleepgrade = 'NR';
    }    
  if( awake_time == null || awake_time == undefined ){
      awake_time = 'NA';
    }
  if( awake_time == "Not Reporded" ){
      awake_time = 'NR';
    }    
  if( awake_time == "Not Provided" ){
      awake_time = 'NP';
    }

    let awakeTimeColors = this.getStylesForSleep(awake_time,userage);

  if( sleepvalue_a == null || sleepvalue_a == undefined || sleepvalue_a == ' ' ){
      sleepvalue_a = '-';
    }
  if( sleepvalue_b == null || sleepvalue_b == undefined || sleepvalue_b == ' ' ){
      sleepvalue_b = '-';
    }
    if( sleepvalue_c == null || sleepvalue_c == undefined || sleepvalue_c == ' ' ){
      sleepvalue_c = '-';
    }
    if( sleepvalue_d == null || sleepvalue_d == undefined || sleepvalue_d == ' ' ){
      sleepvalue_d = '-';
    }
    if( sleepvalue_f == null || sleepvalue_f == undefined || sleepvalue_f == ' ' ){
      sleepvalue_f = '-';
    }
  if( sleepvalue_prcnt_a == null || sleepvalue_prcnt_a == undefined || sleepvalue_prcnt_a == ' ' ){
      sleepvalue_prcnt_a = '-';
    }
  if( sleepvalue_prcnt_b == null || sleepvalue_prcnt_b == undefined || sleepvalue_prcnt_b == ' ' ){
      sleepvalue_prcnt_b = '-';
    }
  if( sleepvalue_prcnt_c == null || sleepvalue_prcnt_c == undefined || sleepvalue_prcnt_c == ' ' ){
      sleepvalue_prcnt_c = '-';
    }
  if( sleepvalue_prcnt_d == null || sleepvalue_prcnt_d == undefined || sleepvalue_prcnt_d == ' ' ){
      sleepvalue_prcnt_d = '-';
    }
  if( sleepvalue_prcnt_f == null || sleepvalue_prcnt_f == undefined || sleepvalue_prcnt_f == ' ' ){
      sleepvalue_prcnt_f = '-';
    }        
  let Table =  <table className="bifurcation_table">
                  <tr>
                  <th colSpan={2}>Sleep Per Night (excl awake time)</th>
                  <th colSpan={3}>Sleep Grade</th>
                  </tr>
                  <tr>
                  <td colSpan={2} style={{backgroundColor:awakeTimeColors[0],color:awakeTimeColors[1]}}>{awake_time}</td>
                  <td colSpan={3} style={{backgroundColor:awakeTimeColors[0],color:awakeTimeColors[1]}}>{sleepgrade}</td>
                  </tr>
                  <th colSpan={5}>Daily Distribution</th>
                  <tr>
                  <th style={{backgroundColor:'green',color:'white'}}>A</th>
                  <th style={{backgroundColor:'#32CD32',color:'white'}}>B</th>
                  <th style={{backgroundColor:'Yellow',color:'black'}}>C</th>
                  <th style={{backgroundColor:'orange',color:'white'}}>D</th>
                  <th style={{backgroundColor:'red',color:'black'}}>F</th>
                  </tr> 
                  <tr>
                  <td style={{backgroundColor:'green',color:'white'}}>7:30 -<br/>10:00</td>
                  <td style={{backgroundColor:'#32CD32',color:'white'}}>7:00 -<br/>7:29</td>
                  <td style={{backgroundColor:'Yellow',color:'black'}}>6:30 -<br/>6:59</td>
                  <td style={{backgroundColor:'orange',color:'white'}}>6:00 -<br/>6:29</td>
                  <td style={{backgroundColor:'red',color:'black'}}>{'<'}6 ;<br/>>12</td>
                  </tr>
                  <tr>
                  <td>{sleepvalue_a}</td>
                  <td>{sleepvalue_b}</td>
                  <td>{sleepvalue_c}</td>
                  <td>{sleepvalue_d}</td>
                  <td>{sleepvalue_f}</td>
                  </tr>
                  <tr>
                  <td>{sleepvalue_prcnt_a}</td>
                  <td>{sleepvalue_prcnt_b}</td>
                  <td>{sleepvalue_prcnt_c}</td>
                  <td>{sleepvalue_prcnt_d}</td>
                  <td>{sleepvalue_prcnt_f}</td>
                  </tr>
                  <th colSpan={5}>Days in period : {numberOfDays}</th>
                  </table>

    return Table;

 } 

 getStylesForSleep(awaketime,usrage){
    let background = "";
    let color = "";
     
     if( awaketime == 'NA' || awaketime == 'NR' || awaketime == 'NP' ){
        background='';
        color='';  
      }
     else {
          let awakeTimeInSeconds = this.strToSecond(awaketime)
        if( usrage >= 18 ){
            if(awakeTimeInSeconds < this.strToSecond("6:00") || awakeTimeInSeconds > this.strToSecond("12:00")){
                      background = '#FF0101';
                      color = 'black';         
              }
            else if(this.strToSecond("7:30") <= awakeTimeInSeconds && awakeTimeInSeconds <= this.strToSecond("10:00")){
                    background = 'green';
                    color = 'white';         
             }
            else if((this.strToSecond("7:00") <= awakeTimeInSeconds && awakeTimeInSeconds <= this.strToSecond("7:29"))
             || (this.strToSecond("10:01") <= awakeTimeInSeconds && awakeTimeInSeconds <= this.strToSecond("10:30"))){
                      background = '#32CD32';
                      color = 'white';    
             } 
            else if((this.strToSecond("6:30") <= awakeTimeInSeconds && awakeTimeInSeconds <= this.strToSecond("6:59"))
             || (this.strToSecond("10:31") <= awakeTimeInSeconds && awakeTimeInSeconds <= this.strToSecond("11:00"))){
                      background = '#FFFF01';
                      color = 'black';     
             }
            else if((this.strToSecond("06:00") <= awakeTimeInSeconds && awakeTimeInSeconds <= this.strToSecond("6:29"))
             || (this.strToSecond("11:00") <= awakeTimeInSeconds && awakeTimeInSeconds <= this.strToSecond("12:00"))){
                      background = '#E26B0A';
                      color = 'black';      
             }
         
         }
       else{
            if(awakeTimeInSeconds < this.strToSecond("6:30") || awakeTimeInSeconds > this.strToSecond("14:00")){
                    background = '#FF0101';
                    color = 'black'; 
            }
            else if(awakeTimeInSeconds >= this.strToSecond("8:00") && awakeTimeInSeconds <= this.strToSecond("12:00")){
                   background = 'green';
                   color = 'white'; 
            }
            else if((awakeTimeInSeconds >= this.strToSecond("7:30") && awakeTimeInSeconds <= this.strToSecond("7:59")) ||
                     (awakeTimeInSeconds >= this.strToSecond("12:01") && awakeTimeInSeconds <= this.strToSecond("12:30"))){
                    background = '#32CD32';
                    color = 'white';
            }
            else if((awakeTimeInSeconds >= this.strToSecond("7:00") && awakeTimeInSeconds <= this.strToSecond("7:29")) ||
                    (awakeTimeInSeconds >= this.strToSecond("12:31") && awakeTimeInSeconds <= this.strToSecond("13:00"))){
                    background = '#FFFF01';
                    color = 'black'; 
            }
            else if((awakeTimeInSeconds >= this.strToSecond("6:30") && awakeTimeInSeconds <= this.strToSecond("6:59")) ||
                    (awakeTimeInSeconds >= this.strToSecond("13:01") && awakeTimeInSeconds <= this.strToSecond("14:00"))){
                    background = '#E26B0A';
                    color = 'black';
            }
         }    
      }  
     return [background,color];   
  }

 renderNutritionStats(nutritionvalue,dur){
  let prcnt_unproc_food = this.renderValue(nutritionvalue.prcnt_unprocessed_volume_of_food,dur);
  let food_grade = this.renderValue(nutritionvalue.prcnt_unprocessed_food_grade,dur);
  let nutritionvalue_a = this.renderValue(nutritionvalue.cum_days_ufood_got_a,dur);
  let nutritionvalue_b = this.renderValue(nutritionvalue.cum_days_ufood_got_b,dur);
  let nutritionvalue_c = this.renderValue(nutritionvalue.cum_days_ufood_got_c,dur);
  let nutritionvalue_d = this.renderValue(nutritionvalue.cum_days_ufood_got_d,dur);
  let nutritionvalue_f = this.renderValue(nutritionvalue.cum_days_ufood_got_f,dur);
  let nutritionvalue_prcnt_a = this.renderPercent(this.renderValue(nutritionvalue.prcnt_days_ufood_got_a,dur));
  let nutritionvalue_prcnt_b = this.renderPercent(this.renderValue(nutritionvalue.prcnt_days_ufood_got_b,dur));
  let nutritionvalue_prcnt_c = this.renderPercent(this.renderValue(nutritionvalue.prcnt_days_ufood_got_c,dur));
  let nutritionvalue_prcnt_d = this.renderPercent(this.renderValue(nutritionvalue.prcnt_days_ufood_got_d,dur));
  let nutritionvalue_prcnt_f = this.renderPercent(this.renderValue(nutritionvalue.prcnt_days_ufood_got_f,dur));
  let numberOfDays = this.state.numberOfDays;

  if( prcnt_unproc_food == null || prcnt_unproc_food == undefined ){
      prcnt_unproc_food = 'NA';

    }
   if( prcnt_unproc_food == "Not Reported" ){
      prcnt_unproc_food = 'NR';
    } 
   if( prcnt_unproc_food == "Not Provided" ){
      prcnt_unproc_food = 'NP';
    } 
      
  let foodcolors = this.getStylesForNutritionFood(prcnt_unproc_food);
  let prcnt_unproc_food_value = this.renderPercent(prcnt_unproc_food);
  
  if( food_grade == null || food_grade == undefined ){
      food_grade = 'NA';
    }
  if( food_grade == "Not Reported" ){
      food_grade = 'NR';
    }  
  if( food_grade == "Not Provided" ){
      food_grade = 'NP';
    }
    

    let foodGradecolors = this.getStylesForSummaryGrades(food_grade);

  if( nutritionvalue_a == null || nutritionvalue_a == undefined || nutritionvalue_a == ' '){
      nutritionvalue_a = '-';
    }
  if( nutritionvalue_b == null || nutritionvalue_b == undefined || nutritionvalue_b == ' ' ){
      nutritionvalue_b = '-';
    }
  if( nutritionvalue_c == null || nutritionvalue_c == undefined || nutritionvalue_c == ' ' ){
      nutritionvalue_c = '-';
    }
  if( nutritionvalue_d == null || nutritionvalue_d == undefined || nutritionvalue_d == ' ' ){
      nutritionvalue_d = '-';
    }
  if( nutritionvalue_f == null || nutritionvalue_f == undefined || nutritionvalue_f == ' ' ){
      nutritionvalue_f = '-';
    }        
  if( nutritionvalue_prcnt_a == null || nutritionvalue_prcnt_a == undefined || nutritionvalue_prcnt_a == ' ' ){
      nutritionvalue_prcnt_a = '-';
    }
  if( nutritionvalue_prcnt_b == null || nutritionvalue_prcnt_b == undefined || nutritionvalue_prcnt_b == ' ' ){
      nutritionvalue_prcnt_b = '-';
    }  
  if( nutritionvalue_prcnt_c == null || nutritionvalue_prcnt_c == undefined || nutritionvalue_prcnt_c == ' ' ){
      nutritionvalue_prcnt_c = '-';
    }
  if( nutritionvalue_prcnt_d == null || nutritionvalue_prcnt_d == undefined || nutritionvalue_prcnt_d == ' ' ){
      nutritionvalue_prcnt_d = '-';
    }
  if( nutritionvalue_prcnt_f == null || nutritionvalue_prcnt_f == undefined || nutritionvalue_prcnt_f == ' ' ){
      nutritionvalue_prcnt_f = '-';
    }    
  
  let Table =  <table className="bifurcation_table">
                  <tr>
                  <th colSpan={2}>%Unprocessed Food Consumed</th>
                  <th colSpan={3}>Nutrition Grade</th>
                  </tr>
                  <tr>
                  <td colSpan={2} style={{backgroundColor:foodcolors[0],color:foodcolors[1]}}>{prcnt_unproc_food_value}</td>
                  <td colSpan={3} style={{backgroundColor:foodGradecolors[0],color:foodGradecolors[1]}}>{food_grade}</td>
                  </tr>
                  <th colSpan={5}>Daily Distribution</th>
                  <tr>
                  <th style={{backgroundColor:'green',color:'white'}}>A</th>
                  <th style={{backgroundColor:'#32CD32',color:'white'}}>B</th>
                  <th style={{backgroundColor:'Yellow',color:'black'}}>C</th>
                  <th style={{backgroundColor:'orange',color:'white'}}>D</th>
                  <th style={{backgroundColor:'red',color:'black'}}>F</th>
                  </tr> 
                  <tr>
                  <td style={{backgroundColor:'green',color:'white'}}>80% -<br/>100%</td>
                  <td style={{backgroundColor:'#32CD32',color:'white'}}>70% -<br/>79%</td>
                  <td style={{backgroundColor:'Yellow',color:'black'}}>60% -<br/>69%</td>
                  <td style={{backgroundColor:'orange',color:'white'}}>50 -<br/>59%</td>
                  <td style={{backgroundColor:'red',color:'black'}}>{'<'}50%</td>
                  </tr>
                  <tr>
                  <td>{nutritionvalue_a}</td>
                  <td>{nutritionvalue_b}</td>
                  <td>{nutritionvalue_c}</td>
                  <td>{nutritionvalue_d}</td>
                  <td>{nutritionvalue_f}</td>
                  </tr>
                  <tr>
                  <td>{nutritionvalue_prcnt_a}</td>
                  <td>{nutritionvalue_prcnt_b}</td>
                  <td>{nutritionvalue_prcnt_c}</td>
                  <td>{nutritionvalue_prcnt_d}</td>
                  <td>{nutritionvalue_prcnt_f}</td>
                  </tr>
                  <th colSpan={5}>Days in period : {numberOfDays}</th>
                  </table>

    return Table;

 }

   renderPercent(value){
    let percent ='';
    if( value == 'NA' || value == '' || value == null || value == undefined){
      percent= value ;
      return percent;
    }
   else {
      percent = value+'%';
      return percent;
    }
  }

  getStylesForNutritionFood(foodscore){
    let background = "";
    let color = "";
    
      if( foodscore == 'NA' || foodscore == 'NR' || foodscore == 'NP'){
          background='';
          color='';
        }
      else if (foodscore >= 80){
          background ='green';
          color = 'white';
        }
      else if (foodscore >= 70 && foodscore < 80){
          background = "#32CD32";
          color = "white";
        }
      else if (foodscore >= 60 && foodscore < 70){
          background = "yellow";
          color = "black"
        } 
      else if (foodscore >= 50 && foodscore < 60){
          background ='#FF8C00';
          color = 'white';
        } 
      else if (foodscore < 50){
          background = "red";
          color = "black";
        }
    return [background,color];
  }

 getStylesForSummaryGrades(grade){
  let background='';
  let color='';
        
        if( grade == 'NA' || grade == 'NR' || grade == 'NP'){
          background='';
          color='';
        }
        else if ( grade == 'A' ){            
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
     return [background,color];   
 }
 renderAlcoholStats(alcoholvalue,gendr,dur){
  let alcoholgpa = this.renderValue(alcoholvalue.avg_drink_per_week,dur);
  let alcoholgrade = this.renderValue(alcoholvalue.alcoholic_drinks_per_week_grade,dur);
  let alcoholvalue_a = this.renderValue(alcoholvalue.cum_days_alcohol_week_got_a,dur);
  let alcoholvalue_b = this.renderValue(alcoholvalue.cum_days_alcohol_week_got_b,dur);
  let alcoholvalue_c = this.renderValue(alcoholvalue.cum_days_alcohol_week_got_c,dur);
  let alcoholvalue_d = this.renderValue(alcoholvalue.cum_days_alcohol_week_got_d,dur);
  let alcoholvalue_f = this.renderValue(alcoholvalue.cum_days_alcohol_week_got_f,dur);
  let alcoholvalue_prcnt_a = this.renderPercent(this.getAlcoholPercent(this.renderValue(alcoholvalue.prcnt_days_alcohol_week_got_a,dur)));
  let alcoholvalue_prcnt_b = this.renderPercent(this.getAlcoholPercent(this.renderValue(alcoholvalue.prcnt_days_alcohol_week_got_b,dur)));
  let alcoholvalue_prcnt_c = this.renderPercent(this.getAlcoholPercent(this.renderValue(alcoholvalue.prcnt_days_alcohol_week_got_c,dur)));
  let alcoholvalue_prcnt_d = this.renderPercent(this.getAlcoholPercent(this.renderValue(alcoholvalue.prcnt_days_alcohol_week_got_d,dur)));
  let alcoholvalue_prcnt_f = this.renderPercent(this.getAlcoholPercent(this.renderValue(alcoholvalue.prcnt_days_alcohol_week_got_f,dur)));
  let numberOfDays = this.state.numberOfDays;

  if( alcoholgpa == null || alcoholgpa == undefined ){
      alcoholgpa = 'NA';
    }
  if( alcoholgpa == "Not Reported" ){
      alcoholgpa = 'NR';
    }
  if( alcoholgpa == "Not Provided" ){
      alcoholgpa = 'NP';
    }

  let alcoholgpacolors = this.getAlcoholColors(alcoholgpa,gendr);

    
  if( alcoholgrade == null || alcoholgrade == undefined ){
      alcoholgrade = 'NA';
    }  
  if( alcoholgrade == "Not Reported" ){
      alcoholgrade = 'NR';
    }
  if( alcoholgrade == "Not Provided" ){
      alcoholgrade = 'NP';
    }

   let alcoholgradecolors = this.getAlcoholColors(gendr,alcoholgrade);

  if( alcoholvalue_a == null || alcoholvalue_a == undefined || alcoholvalue_a == ' ' ){
      alcoholvalue_a = '-';
    }
  if( alcoholvalue_b == null || alcoholvalue_b == undefined || alcoholvalue_b == ' ' ){
      alcoholvalue_b = '-';
    } 
  if( alcoholvalue_c == null || alcoholvalue_c == undefined || alcoholvalue_c == ' ' ){
      alcoholvalue_c = '-';
    }
  if( alcoholvalue_d == null || alcoholvalue_d == undefined || alcoholvalue_d == ' ' ){
      alcoholvalue_d = '-';
    } 
  if( alcoholvalue_f == null || alcoholvalue_f == undefined || alcoholvalue_f == ' ' ){
      alcoholvalue_f = '-';
    }                
  if( alcoholvalue_prcnt_a == null || alcoholvalue_prcnt_a == undefined || alcoholvalue_prcnt_a == ' ' ){
      alcoholvalue_prcnt_a = '-';
    }
  if( alcoholvalue_prcnt_b == null || alcoholvalue_prcnt_b == undefined || alcoholvalue_prcnt_b == ' ' ){
      alcoholvalue_prcnt_b = '-';
    }
  if( alcoholvalue_prcnt_c == null || alcoholvalue_prcnt_c == undefined || alcoholvalue_prcnt_c == ' ' ){
      alcoholvalue_prcnt_c = '-';
    }
  if( alcoholvalue_prcnt_d == null || alcoholvalue_prcnt_d == undefined || alcoholvalue_prcnt_d == ' ' ){
      alcoholvalue_prcnt_d = '-';
    }
  if( alcoholvalue_prcnt_f == null || alcoholvalue_prcnt_f == undefined || alcoholvalue_prcnt_f == ' ' ){
      alcoholvalue_prcnt_f = '-';
    }  

  let Table =  <table className="bifurcation_table">
                  <tr>
                  <th colSpan={2}>Average Drinks Per Week (7 Days)</th>
                  <th colSpan={3}>Alcohol Grade</th>
                  </tr>
                  <tr>
                  <td colSpan={2} style={{backgroundColor:alcoholgpacolors[0],color:alcoholgpacolors[1]}}>{alcoholgpa}</td>
                  <td colSpan={3} style={{backgroundColor:alcoholgpacolors[0],color:alcoholgpacolors[1]}}>{alcoholgrade}</td>
                  </tr>
                  <th colSpan={5}>Daily Distribution</th>
                  <tr>
                  <th style={{backgroundColor:'green',color:'white'}}>A</th>
                  <th style={{backgroundColor:'#32CD32',color:'white'}}>B</th>
                  <th style={{backgroundColor:'Yellow',color:'black'}}>C</th>
                  <th style={{backgroundColor:'orange',color:'white'}}>D</th>
                  <th style={{backgroundColor:'red',color:'black'}}>F</th>
                  </tr> 
                  <tr>
                  <td style={{backgroundColor:'green',color:'white'}}>0</td>
                  <td style={{backgroundColor:'#32CD32',color:'white'}}>0.1-1</td>
                  <td style={{backgroundColor:'Yellow',color:'black'}}>1.01-2</td>
                  <td style={{backgroundColor:'orange',color:'white'}}>2.01-5</td>
                  <td style={{backgroundColor:'red',color:'black'}}>>5</td>
                  </tr>
                  <tr>
                  <td>{alcoholvalue_a}</td>
                  <td>{alcoholvalue_b}</td>
                  <td>{alcoholvalue_c}</td>
                  <td>{alcoholvalue_d}</td>
                  <td>{alcoholvalue_f}</td>
                  </tr>
                  <tr>
                  <td>{alcoholvalue_prcnt_a}</td>
                  <td>{alcoholvalue_prcnt_b}</td>
                  <td>{alcoholvalue_prcnt_c}</td>
                  <td>{alcoholvalue_prcnt_d}</td>
                  <td>{alcoholvalue_prcnt_f}</td>
                  </tr>
                  <th colSpan={5}>Days in period : {numberOfDays}</th>
                  </table>

    return Table;
 }

 getAlcoholPercent(value){
  let intvalue;
  if( value != null || value != undefined || value != '' ){
   intvalue = value/100;  
  }
  return intvalue;
 }
 
 getAlcoholColors(drink_avg,gender,grade){
    let background='';
    let color='';

    if (gender === 'Form') {
          if(drink_avg == 'NA' || grade == 'NA' || drink_avg == 'NP' || grade == 'NP'|| drink_avg == 'NR' || grade == 'NR'){
            background='';
            color='';
          }
          else if (drink_avg <= 3 || grade == 'A'){
             background='green';
             color='white';
          }   
          else if ( drink_avg > 3 && drink_avg < 5 || grade == 'B'){
              background='#32CD32';
              color='white';
          }
          else if ( drink_avg >= 5 && drink_avg < 7 || grade == 'C'){
              background='yellow';
              color='black';
          }
          else if ( drink_avg >= 7 && drink_avg < 9 || grade == 'D'){
              background='#FF8C00';
              color='white';
          }
          else if ( drink_avg >= 9 && drink_avg <= 14 || grade == 'F'){
              background='red';
              color='black';
          }
          else if( drink_avg > 14 || grade == 'F'){
              background='red';
              color='black';
          }
    } 
    else{
          if(drink_avg == 'NA' || grade == 'NA' || drink_avg == 'NP' || grade == 'NP' || drink_avg == 'NR' || grade == 'NR'){
            background='';
            color='';
          }
          else if (drink_avg <= 5 || grade == 'A'){
             background='green';
             color='white';
          }   
          else if (drink_avg > 5 && drink_avg < 12 || grade == 'B'){
              background='#32CD32';
              color='white';
          }
          else if (drink_avg >= 12 && drink_avg < 15 || grade == 'C'){
              background='yellow';
              color='black';
          }
          else if (drink_avg >= 15 && drink_avg < 16 || grade == 'D'){
              background='#FF8C00';
              color='white';
          }
          else if (drink_avg >= 16 && drink_avg <= 21 || grade == 'F'){
              background='red';
              color='black';
          }
          else if( drink_avg > 21 || grade == 'F'){
              background='red';
              color='black';
          }
      }
     return [background,color];
    }
 
 renderGarminStats(garminvalue,dur){
  let garmin_avg = this.renderValue(garminvalue.garmin_stress_lvl,dur);
  let garminvalue_a = this.renderValue(garminvalue.cum_garmin_stress_days_got_a,dur);
  let garminvalue_b = this.renderValue(garminvalue.cum_garmin_stress_days_got_b,dur);
  let garminvalue_c = this.renderValue(garminvalue.cum_garmin_stress_days_got_c,dur);
  let garminvalue_f = this.renderValue(garminvalue.cum_garmin_stress_days_got_f,dur);
  let garminvalue_prcnt_a = this.renderPercent(this.renderValue(garminvalue.prcnt_garmin_stress_days_got_a,dur));
  let garminvalue_prcnt_b = this.renderPercent(this.renderValue(garminvalue.prcnt_garmin_stress_days_got_b,dur));
  let garminvalue_prcnt_c = this.renderPercent(this.renderValue(garminvalue.prcnt_garmin_stress_days_got_c,dur));
  let garminvalue_prcnt_f = this.renderPercent(this.renderValue(garminvalue.prcnt_garmin_stress_days_got_f,dur));
  let numberOfDays = this.state.numberOfDays;

  if( garmin_avg == null || garmin_avg == undefined ){
      garmin_avg = 'NA';
    }
  if( garmin_avg == "Not Reported" ){
      garmin_avg = 'NR';
    }
   if( garmin_avg == "Not Provided" ){
      garmin_avg = 'NP';
    }

    let avg_garmin_color = this.GarminStressColors(garmin_avg); 

  if( garminvalue_a == null || garminvalue_a == undefined || garminvalue_a == ' ' ){
      garminvalue_a = '-'; 
    }
  else if(garminvalue_a!= null||garminvalue_a!= undefined|| garminvalue_a!= ' '){
    let outres1 = parseFloat(garminvalue_a)
    // garminvalue_a =outres1.toFixed(1)
    }
   
  if( garminvalue_b == null || garminvalue_b == undefined || garminvalue_b == ' ' ){
      garminvalue_b = '-';
    }
     else if(garminvalue_b!= null||garminvalue_b!= undefined|| garminvalue_b!= ' '){
    let outres2 = parseFloat(garminvalue_b)
    // garminvalue_b =outres2.toFixed(1)
   
    }
 if( garminvalue_c == null || garminvalue_c == undefined || garminvalue_c == ' ' ){
      garminvalue_c = '-';
    }
     else if(garminvalue_c!= null||garminvalue_c!= undefined|| garminvalue_c!= ' '){
    let outres3 = parseFloat(garminvalue_c)
    // garminvalue_c =outres3.toFixed(1)
  
    }
 if( garminvalue_f == null || garminvalue_f == undefined || garminvalue_f == ' ' ){
      garminvalue_f = '-';
    }
     else if(garminvalue_f!= null||garminvalue_f!= undefined|| garminvalue_f!= ' '){
    let outres4 = parseFloat(garminvalue_f)
    // garminvalue_f =outres4.toFixed(1)
  
    }                        
 if( garminvalue_prcnt_a == null || garminvalue_prcnt_a == undefined || garminvalue_prcnt_a == ' ' ){
      garminvalue_prcnt_a = '-';
    }
 if( garminvalue_prcnt_b == null || garminvalue_prcnt_b == undefined || garminvalue_prcnt_b == ' ' ){
      garminvalue_prcnt_b = '-';
    }
 if( garminvalue_prcnt_c == null || garminvalue_prcnt_c == undefined || garminvalue_prcnt_c == ' ' ){
      garminvalue_prcnt_c = '-';
    }
 if( garminvalue_prcnt_f == null || garminvalue_prcnt_f == undefined || garminvalue_prcnt_f == ' ' ){
      garminvalue_prcnt_f = '-';
    }        
    let Table =  <table className="bifurcation_table">
                  <tr>
                  <th colSpan={4}>Garmin Stress</th>
                  </tr>
                  <tr>
                  <td colSpan={4} style={{backgroundColor:avg_garmin_color[0],color:avg_garmin_color[1]}}>{garmin_avg}</td>
                  </tr>
                  <th colSpan={4}>Daily Distribution</th>
                  <tr>
                  <td style={{backgroundColor:'green',color:'white'}}>A</td>
                  <td style={{backgroundColor:'#32CD32',color:'white'}}>B</td>
                  <td style={{backgroundColor:'Yellow',color:'black'}}>C</td>
                  <td style={{backgroundColor:'red',color:'black'}}>F</td>
                  </tr>
                  <tr>
                  <td style={{backgroundColor:'green',color:'white'}}>0-25</td>
                  <td style={{backgroundColor:'#32CD32',color:'white'}}>26-50</td>
                  <td style={{backgroundColor:'Yellow',color:'black'}}>51-75</td>
                  <td style={{backgroundColor:'red',color:'black'}}>76-100</td>
                  </tr>
                  <tr>
                  <td>{garminvalue_a}</td>
                  <td>{garminvalue_b}</td>
                  <td>{garminvalue_c}</td>
                  <td>{garminvalue_f}</td>
                  </tr>
                  <tr>
                  <td>{garminvalue_prcnt_a}</td>
                  <td>{garminvalue_prcnt_b}</td>
                  <td>{garminvalue_prcnt_c}</td>
                  <td>{garminvalue_prcnt_f}</td>
                  </tr>
                  <th colSpan={4}>Days in period : {numberOfDays}</th>
                  </table>
    return Table; 

 }

 GarminStressColors(stressvalue){
   let background='';
   let color='';

   if(stressvalue == 'NA' || stressvalue == 'NR' || stressvalue == 'NP'){
      background='';
      color='';
   } 
   else if(stressvalue >= 0 && stressvalue <= 25){
      background = 'green';
      color = 'white';
    }
    else if(stressvalue >= 26 && stressvalue <= 50){
      background = '#32CD32';
      color = 'white';
    }
    else if(stressvalue >= 51 && stressvalue <= 75){
      background = 'yellow';
      color = 'black';
    }
    else if(stressvalue >= 76 && stressvalue <= 100){
      background = 'red';
      color = 'black';
    }
   return [background,color];
  } 

  render(){
    return(
        <div>
        <NavbarMenu title={"Bifurcation (Consistency) Dashboard (BCD)"}/>
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
                                 <span  onClick={this.toggleDate4} id="daterange4" className= "date_range1" style={{color:"white"}}>
                                        <span className="date_range_btn">
                                            <Button
                                                className="daterange-btn btn"                            
                                                id="daterange"
                                                onClick={this.toggleDate4} >Custom Date Range1
                                            </Button>
                                        </span>
                                </span>

                               <Collapse className="navbar-toggleable-xs"  isOpen={this.state.isOpen1} navbar>
                                  <Nav className="nav navbar-nav float-xs-right ml-auto" navbar>
                                     <span className="pdf_button" id="pdf_button">
                                    <a href={this.createExcelPrintURL()}>
                                    <Button className="btn createbutton mb5">Export Report</Button>
                                    </a>
                                </span>
                                <span  onClick={this.toggleDate1} id="daterange1" className= "date_rangee1"style={{color:"white"}}>
                                        <span className="date_range_btn">
                                            <Button
                                                className="daterange-btn btn"                            
                                                id="daterange"
                                                onClick={this.toggleDate1}>Custom Date Range1
                                            </Button>
                                        </span>
                                </span>
                           <span  onClick={this.toggleDate2} id="daterange2" style={{color:"white"}}>
                                  <span className="date_range_btn date_range_btn2">
                                      <Button
                                          className="daterange-btn btn"                            
                                          id="daterange"
                                          onClick={this.toggleDate2}>Custom Date Range2
                                      </Button>
                                  </span>
                              </span>
                           <span  onClick={this.toggleDate3} id="daterange3" style={{color:"white"}}>
                                  <span className="date_range_btn date_range_btn3">
                                      <Button
                                          className="daterange-btn btn"                            
                                          id="daterange"
                                          onClick={this.toggleDate3}>Custom Date Range3
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
                                   name="bf1_start_date"
                                   value={this.state.bf1_start_date}
                                   onChange={this.handleChange} style={{height:"35px",borderRadius:"7px"}}/>

                                </div>
                                <div id="date" className="justify-content-center">

                                  <Label>End date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
                                  <Input type="date"
                                   name="bf1_end_date"
                                   value={this.state.bf1_end_date}
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
                    isOpen={this.state.dateRange4}
                    target="daterange4"
                    toggle={this.toggleDate4}>
                          <PopoverBody>
                            <div >

                               <Form>
                                <div style={{paddingBottom:"12px"}} className="justify-content-center">
                                  <Label>Start Date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
                                  <Input type="date"
                                   name="bf1_start_date"
                                   value={this.state.bf1_start_date}
                                   onChange={this.handleChange} style={{height:"35px",borderRadius:"7px"}}/>

                                </div>
                                <div id="date" className="justify-content-center">

                                  <Label>End date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
                                  <Input type="date"
                                   name="bf1_end_date"
                                   value={this.state.bf1_end_date}
                                   onChange={this.handleChange} style={{height:"35px",borderRadius:"7px"}}/>

                                </div>
                                <div id="date" style={{marginTop:"12px"}} className="justify-content-center">

                                <button
                                id="nav-btn"
                                 style={{backgroundColor:"#ed9507"}}
                                 type="submit"
                                 className="btn btn-block-lg"
                                 onClick={this.onSubmitDate4} style={{width:"175px"}}>SUBMIT</button>
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
                                   name="bf2_start_date"
                                   value={this.state.bf2_start_date}
                                   onChange={this.handleChange} style={{height:"35px",borderRadius:"7px"}}/>

                                </div>
                                <div id="date" className="justify-content-center">

                                  <Label>End date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
                                  <Input type="date"
                                   name="bf2_end_date"
                                   value={this.state.bf2_end_date}
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
                                   name="bf3_start_date"
                                   value={this.state.bf3_start_date}
                                   onChange={this.handleChange} style={{height:"35px",borderRadius:"7px"}}/>
                                </div>
                                <div id="date" className="justify-content-center">
       
                                  <Label>End date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
                                   <Input type="date"
                                   name="bf3_end_date"
                                   value={this.state.bf3_end_date}
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
                <div className = "row padropStyles">
                    <Dropdown isOpen={this.state.dropdownOpen1} toggle={this.toggle}>
                      <DropdownToggle caret>
                        Select Range
                      </DropdownToggle>
                      <DropdownMenu>
                       {this.renderDateRangeDropdown(this.state.summary,this.state.duration_date)}
                      </DropdownMenu>
                    </Dropdown>
                    <span className="paweekdate"><span>{this.state.capt}</span><span>{" (" + this.state.date + ")"}</span></span>
                  </div>
            </div>
          }
          <div>
           <div className="row"> 
              <div className="col-md-6"> 
                  {this.renderOverallHealth(this.state.summary.overall_health,this.state.selected_range)}
             </div>
               <div className="col-md-6">
                  {this.renderMcs(this.state.summary.mc,this.state.selected_range)}
             </div>
           </div>  
           <div className="row">
            <div className="col-md-6">
                  {this.renderNonExerciseSteps(this.state.summary.non_exercise,this.state.selected_range)}
             </div>
             <div className="col-md-6">
                  {this.renderTotalExerciseSteps(this.state.summary.non_exercise,this.state.selected_range)}
             </div>
           </div>
           <div className="row">
              <div className="col-md-6">
                  {this.renderEc(this.state.summary.ec,this.state.selected_range)}
             </div>
             <div className="col-md-6">
                 {this.renderExerciseStats(this.state.summary.exercise,this.state.selected_range)}

             </div>
             <div className="col-md-6">
                {this.renderActiveMinutes(this.state.summary.mc,this.state.selected_range)}
             </div>
             <div className="col-md-6">
                {this.renderActiveMinutesExcludingSleep(this.state.summary.mc,this.state.selected_range)}
             </div>
          </div>
          <div className="row">
             <div className="col-md-6">
             {this.renderRestingHeartRate(this.state.summary.other,this.state.selected_range)}
             </div>
              <div className="col-md-6">
                {this.renderSleep(this.state.summary.sleep,this.state.age,this.state.selected_range)}
              </div>
           </div> 
           <div className="row">
             <div className="col-md-6">
             {this.renderNutritionStats(this.state.summary.nutrition,this.state.selected_range)}
             </div>
             <div className="col-md-6">
             {this.renderAlcoholStats(this.state.summary.alcohol,this.state.gender,this.state.selected_range)}
             </div>
            </div>
            <div>
             <div className="col-md-6">
             {this.renderGarminStats(this.state.summary.stress,this.state.selected_range)}
             </div>     
            </div> 
            </div>
            {this.renderOverallBifurcationSelectedDateFetchOverlay()}
            {this.renderOverallBifurcation1FetchOverlay()}
            {this.renderOverallBifurcation2FetchOverlay()}
            {this.renderOverallBifurcation3FetchOverlay()}
            {this.renderOverallBifurcation4FetchOverlay()}
            {this.renderOverallBifurcationSelectedRangeFetchOverlay()}
            
        </div>
      );
    }

  }
export default Bifurcation;