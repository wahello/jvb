import React from 'react';
import ReactDOM from 'react-dom';
import NavbarMenu from '../navbar';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import _ from 'lodash';
import { ToastContainer, toast } from 'react-toastify';
import Textarea from 'react-textarea-autosize';
import 'react-toastify/dist/ReactToastify.min.css';
import FontAwesome from "react-fontawesome";
import CalendarWidget from 'react-calendar-widget';
import { Container, Select, option, Option, Row, Col, Button, 
         ButtonGroup, Form,FormGroup, Label, Input, FormText,
         className, Modal,ModalHeader, ModalBody, ModalFooter,
         Nav, NavItem, NavLink, Collapse, Navbar, NavbarToggler, 
         NavbarBrand,Popover,PopoverBody} from 'reactstrap';
import moment from 'moment';
// https://github.com/Hacker0x01/react-datepicker
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 

import * as handlers from './handlers';
import * as renderers from './renderers';

import { getGarminToken,logoutUser} from '../../network/auth';


import {userDailyInputSend,userDailyInputFetch,
        userDailyInputUpdate,userDailyInputRecentFetch,
        fetchGarminData} from '../../network/userInput';
import {getUserProfile} from '../../network/auth';

class UserInputs extends React.Component{

    getInitialState(){
      const initialState = {
        selected_date:new Date(),
        fetched_user_input_created_at:'',
        update_form:false,
        editable:true,
        isOpen: false,
        isOpen1: false,
        scrollingLock: false,
        gender:'M',
        diet_to_show:'',
        cloning_data:false,
        fetching_data:false,
        updating_form:false,
        submitting_form:false,
        calendarOpen:false,
        calories_item_check:false,
        weather_check:false,
        infoButton:false,
        infoBtn:false,
        infoWorkout:false,
        infoWorkoutType:false,
        unprocessedInfo:false,
        easyorhardInfo:false,
        fastedInfo:false,
        breatheInfo:false,
        chaiseedsInfo:false,
        waterInfo:false,
        painInfo:false,
        workoutlevelInfo:false,
        enjoybleInfo:false,
        hrrInfo:false,
        wetherInfo:false,
        commentInfo:false,
        alcoholInfo:false,

        workout:'',
        workout_type:'',
        workout_input_type:'',
        workout_easy:'',
        workout_enjoyable:'',
        workout_effort:'',
        workout_effort_hard_portion:'',  
        pain:'',
        pain_area:'',
        water_consumed:'',
        chia_seeds:'',
        breath_nose:'',
        prcnt_processed_food:'',
        unprocessed_food_list:'',
        processed_food_list:'',
        alchol_consumed:'',
        alcohol_drink_consumed_list:'',
        stress:'',
        sick:'',
        sickness:'',
        fasted:'',
        food_ate_before_workout:'',
        workout_comment:'',
        calories:'',
        calories_item:'',

        measured_hr:'',
        hr_down_99:'',
        time_to_99_min:'',
        time_to_99_sec:'',
        hr_level:'',
        lowest_hr_first_minute:'',
        lowest_hr_during_hrr:'',
        time_to_lowest_point_min:'',
        time_to_lowest_point_sec:'',


        indoor_temperature:'',
        outdoor_temperature:'',
        temperature_feels_like:'',
        wind:'',
        dewpoint:'',
        humidity:'',
        weather_comment:'',

        sleep_hours_last_night:'',
        sleep_mins_last_night:'',
        sleep_bedtime:null,
        sleep_awake_time:null,
        awake_hours:'',
        awake_mins:'',
        sleep_comment:'',
        prescription_sleep_aids:'',
        sleep_aid_taken:'',
        smoke_substances:'',
        smoked_substance_list:'',
        medications:'',
        medications_taken_list:'',
        controlled_uncontrolled_substance:'',
        stand:'',
        food_consumed:'',
        weight:'',
        waist:'',
        clothes_size:'',
        heart_variability:'',
        breath_sleep:'',
        breath_day:'',
        diet_type:'',
        general_comment:'',

        no_exercise_reason:'',
        no_exercise_comment:'',

      };
      return initialState;
    }

    constructor(props){
      super(props);
      this.state = this.getInitialState();
      this.handleChange = handlers.handleChange.bind(this);
      this.handleChangeSleepBedTime = handlers.handleChangeSleepBedTime.bind(this);
      this.handleChangeSleepAwakeTime = handlers.handleChangeSleepAwakeTime.bind(this);
      this.handleChangeWorkout = handlers.handleChangeWorkout.bind(this);
      this.handleChangeWorkoutDone = handlers.handleChangeWorkoutDone.bind(this);
      this.handleChangeWorkoutEffort = handlers.handleChangeWorkoutEffort.bind(this);
      this.handleChangePain = handlers.handleChangePain.bind(this);
      this.handleChangeProcessedFood = handlers.handleChangeProcessedFood.bind(this);
      this.handleChangeSick = handlers.handleChangeSick.bind(this);
      this.handleChangeSleepAids = handlers.handleChangeSleepAids.bind(this);
      this.handleChangePrescription = handlers.handleChangePrescription.bind(this);
      this.handleChangeFasted = handlers.handleChangeFasted.bind(this);
      this.handleChangeDietModel = handlers.handleChangeDietModel.bind(this);
      this.handleChangeSmokeSubstance = handlers.handleChangeSmokeSubstance.bind(this);
      this.handleChangeAlcoholDrink = handlers.handleChangeAlcoholDrink.bind(this);
      this.handleCaloriesItemCheck = handlers.handleCaloriesItemCheck.bind(this);
      this.handleWeatherCheck = handlers.handleWeatherCheck.bind(this);
      this.handleChangeHrr = handlers.handleChangeHrr.bind(this);
      this.handleChangeSleepLast = handlers.handleChangeSleepLast.bind(this);
      this.handleChangeNoExerciseReason = handlers.handleChangeNoExerciseReason.bind(this);

      this.renderWorkoutEffortModal = renderers.renderWorkoutEffortModal.bind(this);
      this.renderPainModal = renderers.renderPainModal.bind(this);
      this.renderProcessedFoodModal = renderers.renderProcessedFoodModal.bind(this);
      this.renderPainSick = renderers.renderPainSick.bind(this);
      this.renderPrescriptionSleepAids = renderers.renderPrescriptionSleepAids.bind(this);
      this.renderPrescriptionMedication = renderers.renderPrescriptionMedication.bind(this);
      this.renderFasted = renderers.renderFasted.bind(this);
      this.renderDietType = renderers.renderDietType.bind(this);
      this.renderSmokeSubstance = renderers.renderSmokeSubstance.bind(this);
      this.renderAlcoholModal = renderers.renderAlcoholModal.bind(this);
      this.renderCloneOverlay = renderers.renderCloneOverlay.bind(this);
      this.renderFetchOverlay = renderers.renderFetchOverlay.bind(this);
      this.renderUpdateOverlay = renderers.renderUpdateOverlay.bind(this);
      this.renderSubmitOverlay = renderers.renderSubmitOverlay.bind(this);
      this.renderHrr = renderers.renderHrr.bind(this);

      this.onSubmit = this.onSubmit.bind(this);
      this.onUpdate = this.onUpdate.bind(this);
      this.onUpdateSuccess = this.onUpdateSuccess.bind(this);
      this.resetForm = this.resetForm.bind(this);
      this.processDate = this.processDate.bind(this);
      this.onFetchSuccess = this.onFetchSuccess.bind(this);
      this.onFetchFailure = this.onFetchFailure.bind(this);
      this.onProfileSuccessFetch = this.onProfileSuccessFetch.bind(this);
      this.fetchYesterdayData = this.fetchYesterdayData.bind(this); 
      this.toggle = this.toggle.bind(this);
      this.handleScroll = this.handleScroll.bind(this);
      this.toggleCalendar = this.toggleCalendar.bind(this);
      this.toggleEditForm = this.toggleEditForm.bind(this);
      this.toggleInfo=this.toggleInfo.bind(this);
      this.toggleInfo2=this.toggleInfo2.bind(this);
      this.toggleInfoworkout=this.toggleInfoworkout.bind(this);
      this.toggleInfoworkoutType=this.toggleInfoworkoutType.bind(this);
      this.toggleUnprocessedInfo=this.toggleUnprocessedInfo.bind(this);
      this.toggleEasyorHard=this.toggleEasyorHard.bind(this);
      this.toggleFasted=this.toggleFasted.bind(this);
      this.toggleBreathe=this.toggleBreathe.bind(this);
      this.toggleChaiseeds=this.toggleChaiseeds.bind(this);
      this.toggleWater=this.toggleWater.bind(this);
      this.togglePain=this.togglePain.bind(this);
      this.toggleWorkoutLevel=this.toggleWorkoutLevel.bind(this);
      this.toggleEnjoyble=this.toggleEnjoyble.bind(this);
      this.toggleHrr=this.toggleHrr.bind(this);
      this.toggleWeather=this.toggleWeather.bind(this);
      this.toggleComment=this.toggleComment.bind(this);
      this.toggleAlcohol=this.toggleAlcohol.bind(this);
      this.onFetchRecentSuccess = this.onFetchRecentSuccess.bind(this);
      this.onFetchGarminSuccess = this.onFetchGarminSuccess.bind(this);
      this.onFetchGarminFailure = this.onFetchGarminFailure.bind(this);
      this.infoPrint = this.infoPrint.bind(this);
      this.getTotalSleep = this.getTotalSleep.bind(this);

    this.toggle1 = this.toggle1.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.onLogoutSuccess = this.onLogoutSuccess.bind(this);
    }
    
    onFetchSuccess(data,clone_form=undefined){
      if (_.isEmpty(data.data)){
        userDailyInputRecentFetch(this.onFetchRecentSuccess,this.onFetchFailure);
      }
      else {
        const DIET_TYPE = ['','vegan','vegetarian','paleo','low carb/high fat','pescetarian',
                          'high carb','ketogenic diet','whole foods/mostly unprocessed'];
        const WEATHER_FIELDS = ['indoor_temperature','outdoor_temperature','temperature_feels_like',
                                'wind','dewpoint','humidity','weather_comment'];
        let other_diet = true;
        let was_cloning = this.state.cloning_data;
        let has_weather_data = false;
        let has_calories_data = false;
        let have_strong_input = data.data.strong_input?true:false;
        let have_optional_input = data.data.optional_input?true:false;
        let have_encouraged_input = data.data.encouraged_input?true:false; 

        for(let diet of DIET_TYPE){
          if(data.data.optional_input.type_of_diet_eaten === diet)
            other_diet = false;
        }
        
        for(let field of WEATHER_FIELDS){
          if(!has_weather_data){
            if((data.data.strong_input[field] != '') &&
               (data.data.strong_input[field] !== undefined))
              has_weather_data = true;
          }
        }

        if((data.data.optional_input.calories_consumed_during_workout != '' &&
            data.data.optional_input.calories_consumed_during_workout != undefined)||
            (data.data.optional_input.food_ate_during_workout != '' && 
             data.data.optional_input.food_ate_during_workout != undefined)){
          has_calories_data = true;
        }

        this.setState({
          fetched_user_input_created_at:data.data.created_at,
          update_form:clone_form,
          diet_to_show: other_diet ? 'other':data.data.optional_input.type_of_diet_eaten,
          cloning_data:false,
          fetching_data:false,
          weather_check: has_weather_data,
          calories_item_check:has_calories_data,
          editable: was_cloning ? true : false,

          workout:have_strong_input?data.data.strong_input.workout:'',
          no_exercise_reason:have_strong_input?data.data.strong_input.no_exercise_reason:'',
          no_exercise_comment:have_strong_input?data.data.strong_input.no_exercise_comment:'',
          workout_type:have_strong_input?data.data.strong_input.workout_type:'',
          workout_input_type:have_strong_input?data.data.strong_input.workout_input_type:'',
          workout_easy:have_strong_input?data.data.strong_input.work_out_easy_or_hard:'',
          workout_enjoyable:have_optional_input?data.data.optional_input.workout_enjoyable:'',
          workout_effort:have_strong_input?data.data.strong_input.workout_effort_level:'',
          workout_effort_hard_portion:have_strong_input?data.data.strong_input.hard_portion_workout_effort_level:'',
          pain:have_encouraged_input?data.data.encouraged_input.pains_twings_during_or_after_your_workout:'',
          pain_area:have_encouraged_input?data.data.encouraged_input.pain_area:'',
          water_consumed:have_encouraged_input?data.data.encouraged_input.water_consumed_during_workout:'',
          chia_seeds:have_optional_input?data.data.optional_input.chia_seeds_consumed_during_workout:'',
          breath_nose:have_encouraged_input?data.data.encouraged_input.workout_that_user_breathed_through_nose:'',
          prcnt_processed_food:have_strong_input?data.data.strong_input.prcnt_unprocessed_food_consumed_yesterday:'',
          unprocessed_food_list:have_strong_input?data.data.strong_input.list_of_unprocessed_food_consumed_yesterday:'',                
          processed_food_list:have_strong_input?data.data.strong_input.list_of_processed_food_consumed_yesterday:'',
          alchol_consumed:have_strong_input?data.data.strong_input.number_of_alcohol_consumed_yesterday:'',
          alcohol_drink_consumed_list:have_strong_input?data.data.strong_input.alcohol_drink_consumed_list:'',
          stress:have_encouraged_input?data.data.encouraged_input.stress_level_yesterday:'',
          sick:have_optional_input?data.data.optional_input.sick:'',
          sickness:have_optional_input?data.data.optional_input.sickness:'',
          fasted:have_optional_input?data.data.optional_input.fasted_during_workout:'',
          food_ate_before_workout:have_optional_input?data.data.optional_input.food_ate_before_workout:'',
          workout_comment:have_optional_input?data.data.optional_input.general_Workout_Comments:'',
          calories:have_optional_input? data.data.optional_input.calories_consumed_during_workout: '',
          calories_item:have_optional_input?data.data.optional_input.food_ate_during_workout:'',

          indoor_temperature:have_strong_input?data.data.strong_input.indoor_temperature:'',
          outdoor_temperature:have_strong_input?data.data.strong_input.outdoor_temperature:'',
          temperature_feels_like:have_strong_input?data.data.strong_input.temperature_feels_like:'',
          wind:have_strong_input?data.data.strong_input.wind:'',
          dewpoint:have_strong_input?data.data.strong_input.dewpoint:'',
          humidity:have_strong_input?data.data.strong_input.humidity:'',
          weather_comment:have_strong_input?data.data.strong_input.weather_comment:'',


          measured_hr:have_encouraged_input?data.data.encouraged_input.measured_hr:'',
          hr_down_99:have_encouraged_input?data.data.encouraged_input.hr_down_99:'',
          time_to_99_min:have_encouraged_input?data.data.encouraged_input.time_to_99.split(':')[0]:'',
          time_to_99_sec:have_encouraged_input?data.data.encouraged_input.time_to_99.split(':')[1]:'',
          hr_level:have_encouraged_input?data.data.encouraged_input.hr_level:'',
          lowest_hr_first_minute:have_encouraged_input?data.data.encouraged_input.lowest_hr_first_minute:'',
          lowest_hr_during_hrr:have_encouraged_input?data.data.encouraged_input.lowest_hr_during_hrr:'',
          time_to_lowest_point_min:have_encouraged_input?data.data.encouraged_input.time_to_lowest_point.split(':')[0]:'',
          time_to_lowest_point_sec:have_encouraged_input?data.data.encouraged_input.time_to_lowest_point.split(':')[1]:'',


          sleep_hours_last_night:have_strong_input?data.data.strong_input.sleep_time_excluding_awake_time.split(':')[0]:'',
          sleep_mins_last_night:have_strong_input?data.data.strong_input.sleep_time_excluding_awake_time.split(':')[1]:'',
          sleep_bedtime:data.data.strong_input.sleep_bedtime? moment(data.data.strong_input.sleep_bedtime):null,
          sleep_awake_time:data.data.strong_input.sleep_awake_time ? moment(data.data.strong_input.sleep_awake_time):null,
          awake_hours:data.data.strong_input.awake_time.split(':')[0],
          awake_mins:data.data.strong_input.awake_time.split(':')[1],
          sleep_comment:have_strong_input?data.data.strong_input.sleep_comment:'',
          prescription_sleep_aids:have_strong_input?data.data.strong_input.prescription_or_non_prescription_sleep_aids_last_night:'',
          sleep_aid_taken:have_strong_input?data.data.strong_input.sleep_aid_taken:'',
          smoke_substances:have_strong_input?data.data.strong_input.smoke_any_substances_whatsoever:'',
          smoked_substance_list:have_strong_input?data.data.strong_input.smoked_substance:'',
          medications:have_strong_input?data.data.strong_input.prescription_or_non_prescription_medication_yesterday:'',
          medications_taken_list:have_strong_input?data.data.strong_input.prescription_or_non_prescription_medication_taken:'',
          controlled_uncontrolled_substance:have_strong_input?data.data.strong_input.controlled_uncontrolled_substance:'',
          stand:have_optional_input?data.data.optional_input.stand_for_three_hours:'',
          food_consumed:have_optional_input?data.data.optional_input.list_of_processed_food_consumed_yesterday:'',
          weight:have_optional_input?data.data.optional_input.weight:'',
          waist:have_optional_input?data.data.optional_input.waist_size:'',
          clothes_size:have_optional_input?data.data.optional_input.clothes_size:'',
          heart_variability:have_optional_input?data.data.optional_input.heart_rate_variability:'',
          breath_sleep:have_optional_input?data.data.optional_input.percent_breath_nose_last_night:'',
          breath_day:have_optional_input?data.data.optional_input.percent_breath_nose_all_day_not_exercising:'',
          diet_type:have_optional_input?data.data.optional_input.type_of_diet_eaten:'',
          general_comment:have_optional_input?data.data.optional_input.general_comment:''
        },()=>{
          if(!this.state.sleep_bedtime && !this.state.sleep_awake_time){
            fetchGarminData(this.state.selected_date,this.onFetchGarminSuccess, this.onFetchGarminFailure);
          } 
          window.scrollTo(0,0);
        });
      }
    }

    onFetchRecentSuccess(data){
      if(!_.isEmpty(data.data)){
        const initial_state = this.getInitialState();
        let have_strong_input = data.data.strong_input?true:false;
        let have_optional_input = data.data.optional_input?true:false;
        let have_encouraged_input = data.data.encouraged_input?true:false;
        let other_diet = true;
        const DIET_TYPE = ['','vegan','vegetarian','paleo','low carb/high fat','pescetarian',
                          'high carb','ketogenic diet','whole foods/mostly unprocessed'];
        for(let diet of DIET_TYPE){
          if(data.data.optional_input.type_of_diet_eaten === diet)
            other_diet = false;
        }

        this.setState(
          {...initial_state,
          prescription_sleep_aids:have_strong_input?data.data.strong_input.prescription_or_non_prescription_sleep_aids_last_night:'',
          sleep_aid_taken:have_strong_input?data.data.strong_input.sleep_aid_taken:'',
          smoke_substances:have_strong_input?data.data.strong_input.smoke_any_substances_whatsoever:'',
          smoked_substance_list:have_strong_input?data.data.strong_input.smoked_substance:'',
          medications:have_strong_input?data.data.strong_input.prescription_or_non_prescription_medication_yesterday:'',
          medications_taken_list:have_strong_input?data.data.strong_input.prescription_or_non_prescription_medication_taken:'',
          controlled_uncontrolled_substance:have_strong_input?data.data.strong_input.controlled_uncontrolled_substance:'',
          stress:have_encouraged_input?data.data.encouraged_input.stress_level_yesterday:'',
          sick:have_optional_input?data.data.optional_input.sick:'',
          sickness:have_optional_input?data.data.optional_input.sickness:'',
          waist:have_optional_input?data.data.optional_input.waist_size:'',
          clothes_size:have_optional_input?data.data.optional_input.clothes_size:'',
          diet_type:have_optional_input?data.data.optional_input.type_of_diet_eaten:'',
          diet_to_show: other_diet ? 'other':data.data.optional_input.type_of_diet_eaten,
          selected_date:this.state.selected_date,
          gender:this.state.gender},()=>{
          fetchGarminData(this.state.selected_date,this.onFetchGarminSuccess, this.onFetchGarminFailure);
          window.scrollTo(0,0);
        });
      }else{
        this.onFetchFailure(data)
      }
    }

    onFetchGarminSuccess(data){
      let sleep_bedtime = data.data.sleep_bed_time?moment(data.data.sleep_bed_time):null;
      let sleep_awake_time = data.data.sleep_awake_time?moment(data.data.sleep_awake_time):null;
      let awake_hours = data.data.awake_time?data.data.awake_time.split(':')[0]:'';
      awake_hours = awake_hours?parseInt(awake_hours):0
      let awake_mins = data.data.awake_time?data.data.awake_time.split(':')[1]:'';
      awake_mins = awake_mins?parseInt(awake_mins):0
      let awake_time_in_mins = awake_hours*60 + awake_mins;
      if(sleep_bedtime && sleep_awake_time){
        let diff = sleep_awake_time.diff(sleep_bedtime,'minutes')-awake_time_in_mins; 
        let hours = Math.floor(diff/60);
        let mins = diff % 60;
        if(mins < 10)
           mins = `0${mins}`;

        this.setState({
          sleep_bedtime:data.data.sleep_bed_time?moment(data.data.sleep_bed_time):null,
          sleep_awake_time:data.data.sleep_awake_time?moment(data.data.sleep_awake_time):null,
          awake_hours:data.data.awake_time?data.data.awake_time.split(':')[0]:'',
          awake_mins:data.data.awake_time?data.data.awake_time.split(':')[1]:'',
          sleep_hours_last_night:hours,
          sleep_mins_last_night:mins
      });
     }
    }

getTotalSleep(){
     let sleep_bedtime = this.state.sleep_bedtime;
     let sleep_awake_time = this.state.sleep_awake_time;
     let awake_hours = this.state.awake_hours?parseInt(this.state.awake_hours):0;
     let awake_mins = this.state.awake_mins?parseInt(this.state.awake_mins):0;
     let awake_time_in_mins = awake_hours*60 + awake_mins;
     if(sleep_bedtime && sleep_awake_time){
       let diff = sleep_awake_time.diff(sleep_bedtime,'minutes')-awake_time_in_mins;
       let hours = Math.floor(diff/60);
       let mins = diff % 60;
       if(mins < 10)
         mins = `0${mins}`;
       return hours+":"+mins;
     }else
       return '';
   }
   

    onFetchGarminFailure(error){
      console.log(error);
    }

    onFetchFailure(error){
      const initial_state = this.getInitialState();
      this.setState(
        {...initial_state,
        selected_date:this.state.selected_date,
        gender:this.state.gender},()=>{
          window.scrollTo(0,0);
        });
    }

    processDate(date){
      this.setState({
        selected_date:date,
        fetching_data:true
      },function(){
        const clone = true;
        userDailyInputFetch(date,this.onFetchSuccess,this.onFetchFailure,clone);
      }.bind(this));
    }

    fetchYesterdayData(){
      const today = this.state.selected_date;
      const yesterday = new Date(today.getFullYear(),
                                today.getMonth(),
                                today.getDate()-1);
      const clone = false;
      this.setState({
        cloning_data:true
      },function(){
        userDailyInputFetch(yesterday,this.onFetchSuccess,this.onFetchFailure,clone);
      }.bind(this))
    }

    resetForm(){
      this.setState({editable:false,
                    submitting_form:false,
                    update_form:true,
                    fetched_user_input_created_at:moment(this.state.selected_date).format('YYYY-MM-DD')},
                    ()=>{
                      toast.info(" User Input submitted successfully!",{
                      className:"dark"
                    })
                  });
    }


    onUpdateSuccess(response){
      this.setState({
        updating_form:false,
        editable:false
      },()=>{
        toast.info(" Successfully updated form!",{
          className:"dark"
        });
      });
    }

    onUpdate(){
      this.setState({
        updating_form:true
      },function(){
        userDailyInputUpdate(this.state,this.onUpdateSuccess);
      }.bind(this));
    }

    onSubmit(event){
      event.preventDefault();
      this.setState({
        submitting_form:true
      },function(){
        userDailyInputSend(this.state,this.resetForm);
      }.bind(this));    
    }

    onProfileSuccessFetch(data){
      this.setState({
        gender:data.data.gender
      });
    }

    componentDidMount(){
      this.setState({
        fetching_data:true
      });
      userDailyInputFetch(this.state.selected_date,this.onFetchSuccess,
                          this.onFetchFailure,true);
      getUserProfile(this.onProfileSuccessFetch);
      window.addEventListener('scroll', this.handleScroll);
    }

createDropdown(start_num , end_num, step=1){
    let elements = [];
    let i = start_num;
    while(i<=end_num){
      elements.push(<option key={i} value={i}>{i}</option>);
      i=i+step;
    }
    return elements;
  }

  createNoseDropdown(start_num , end_num, step=10){
    let elements = [];
    let i = start_num;
    while(i<=end_num){
      elements.push(<option key={i} value={i}>{i}</option>);
      i=i+step;
    }
    return elements;
  }

  createSleepDropdown(start_num , end_num, mins=false, step=1){
    let elements = [];
    let i = start_num;
    while(i<=end_num){
      let j = (mins && i < 10) ? "0"+i : i;
      elements.push(<option key={j} value={j}>{j}</option>);
      i=i+step;
    }
    return elements;
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

  onLogoutSuccess(response){
    this.props.history.push("/#logout");
  }

  handleLogout(){
    this.props.logoutUser(this.onLogoutSuccess);
  }
componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
}

handleScroll() {

  if (window.scrollY >= 200 && !this.state.scrollingLock) {
    this.setState({
      scrollingLock: true
    });
  } else if(window.scrollY < 200 && this.state.scrollingLock) {                                               
    this.setState({
      scrollingLock: false
    });
  }
}

  toggleCalendar(){
    this.setState({
      calendarOpen:!this.state.calendarOpen
    });
  }

  toggleInfo(){
    this.setState({
      infoButton:!this.state.infoButton
    });
  }
   
   toggleInfo2(){
    this.setState({
      infoBtn:!this.state.infoBtn
    });
   }

   toggleInfoworkout(){
    this.setState({
      infoWorkout:!this.state.infoWorkout
    });
   }

   toggleInfoworkoutType(){
    this.setState({
      infoWorkoutType:!this.state.infoWorkoutType
    });
   }

   toggleUnprocessedInfo(){
    this.setState({
      unprocessedInfo:!this.state.unprocessedInfo
    });
   }

   toggleFasted(){
    this.setState({
     fastedInfo:!this.state.fastedInfo
    });
   }
   infoPrint(){
    var mywindow = window.open('', 'PRINT');
    mywindow.document.write('<html><head><style>' +
        '.research-logo {margin-bottom: 20px;width: 100%; min-height: 55px; float: left;}' +
        '.print {visibility: hidden;}' +
        '.research-logo img {max-height: 100px;width: 60%;border-radius: 4px;}' +
        '</style><title>' + document.title  + '</title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1>' + document.title  + '</h1>');
    mywindow.document.write(document.getElementById('modal1').innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();
  
   }

    toggleEasyorHard(){
    this.setState({
      easyorhardInfo:!this.state.easyorhardInfo
    });
   }

   toggleBreathe(){
    this.setState({
      breatheInfo:!this.state.breatheInfo
    });
   }
  toggleChaiseeds(){
      this.setState({
        chaiseedsInfo:!this.state.chaiseedsInfo
      });
     }
     toggleWater(){
      this.setState({
        waterInfo:!this.state.waterInfo
      });
     }
     togglePain(){
      this.setState({
        painInfo:!this.state.painInfo
      });
     }
      toggleWorkoutLevel(){
      this.setState({
        workoutlevelInfo:!this.state.workoutlevelInfo
      });
     }

   toggleEnjoyble(){
      this.setState({
        enjoybleInfo:!this.state.enjoybleInfo
      });
     }
     toggleHrr(){
      this.setState({
        hrrInfo:!this.state.hrrInfo
      });
     }
     toggleWeather(){
      this.setState({
        weatherInfo:!this.state.weatherInfo
      });
     }
     toggleAlcohol(){
      this.setState({
        alcoholInfo:!this.state.alcoholInfo
      });
     }
     toggleComment(){
      this.setState({
        commentInfo:!this.state.commentInfo
      });
     }
    toggleEditForm(){
       this.setState({
         editable:!this.state.editable
       });
    }

    render(){
       const {fix} = this.props;

        return(
            <div>            
        <div id="hambergar" className="container-fluid">

        <Navbar toggleable 
         fixed={fix ? 'top' : ''} 
          className="navbar navbar-expand-sm navbar-inverse ">
          <NavbarToggler className="navbar-toggler hidden-sm-up" onClick={this.toggle1} >
           <FontAwesome 
                 name = "bars"
                 size = "1x"
                                          
             />

          </NavbarToggler>

          <Link to='/'>
            <NavbarBrand 
              className="navbar-brand float-sm-left" 
              id="navbarTogglerDemo" style={{fontSize:"16px",marginLeft:"-4px"}}>
              <img className="img-fluid"
               style={{maxWidth:"200px"}}
               src="//static1.squarespace.com/static/535dc0f7e4b0ab57db48c65c/t/5942be8b893fc0b88882a5fb/1504135828049/?format=1500w"/>
            </NavbarBrand>
          </Link>
          
            

            <div id="header">
              <h2 className="head">Daily User Inputs 
              <span id="infobutton"
              onClick={this.toggleInfo}                   
              >
              <a  className="infoBtn"> 
                             <FontAwesome 
                                          name = "info-circle"
                                          size = "1x"                                      
                                        
                              />
                              </a>
                              </span> 
                             </h2>
                             
                              </div>

          <Collapse className="navbar-toggleable-xs" isOpen={this.state.isOpen1} navbar>
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
                            <Modal
                            id="popover"                          
                            placement="bottom" 
                            isOpen={this.state.infoButton}
                            target="infobutton" 
                            toggle={this.toggleInfo}>
                            <ModalHeader >
                            <span >
                           <a href="#" target="_blank" style={{fontSize:"15px",color:"black"}}> <i className="fa fa-share-square" aria-hidden="true">Share</i></a>
                           </span>
                           <span >
                            <a href="#" onClick={this.infoPrint} style={{paddingLeft:"35px",fontSize:"15px",color:"black"}}><i className="fa fa-print" aria-hidden="true">Print</i></a>
                            </span>
                            </ModalHeader>
                              <ModalBody className="modalcontent" id="modal1">
                                <div>
                                  <div>Completing your daily inputs EVERY DAY makes you ACCOUNTABLE
                                  to your results and our hope is that you will make healthier
                                  life choices as a result of having to report various topics
                                  (and we see significantly improved results for those that report daily).
                                  Reporting only takes a few minutes a day and is well worth
                                  the time investment. You provide the inputs and we will provide
                                  you the analyses! Create a new habit of reporting your inputs daily!</div>

                                  <p style={{paddingTop:"15px"}}>Reporting your inputs to us has many benefits:</p>

                                  <div style={{paddingTop:"15px"}}>(1) It enables us to report your data to you in a simple, understandable,
                                   and customizable way. Our reporting and proprietary grading system will 
                                   provide you with a powerful tool to identify positive and negative trends
                                    in your health and life, so you can (1) work on improving areas you want
                                     to improve and (2) maintain areas where you are performing well;</div>

                                  <div style={{paddingTop:"15px"}}>(2) If you wear a wearable device, we grab your data from your device
                                   and correlate it to your inputs. The correlation of this data provides
                                    a powerful tool for us to make recommendations for improvements across
                                     various categories;</div>

                                  <div style={{paddingTop:"15px"}}>(3) We will also provide you with how you compare against others in various
                                   reporting categories and how your grades stack up against others;</div>

                                  <div style={{paddingTop:"15px"}}>(4) Periodically, we will provide you with suggestions on how to improve in various categories.
                                  We find that those that submit their Daily User Inputs Report to us EVERY DAY
                                   often are healthier, happier, have more energy, are leaner, have better blood
                                    work results, are more productive at their job, are less stiff, injured less
                                     frequently, and have (far) better training results than those that don’t report
                                      their results, to name a few benefits.</div>
                                </div>
                              </ModalBody>
                           </Modal> 
                                  
                           
                        <div className="nav3">
                           <div className="nav1" style={{position: this.state.scrollingLock ? "fixed" : "relative"}}>
                           <Navbar light toggleable className="navbar nav1">
                                <NavbarToggler className="navbar-toggler hidden-sm-up" onClick={this.toggle}>
                                    <div className="toggler">
                                    <FontAwesome 
                                          name = "bars"
                                          size = "1x"
                                          
                                        />
                                    </div>
                               </NavbarToggler> 
                                  
                                  <span id="calendar" 
                                  onClick={this.toggleCalendar}>
                                  <span id="spa" >
                                     <span id="navlink">
                                        <FontAwesome 
                                          name = "calendar"
                                          size = "1x"
                                          
                                        />
                                        </span>                                        
                                      <span id="navlink">
                                      {moment(this.state.selected_date).format('MMM D, YYYY')}
                                      </span>  
                                  </span>                                  
                                                                  
                                  </span>

                                  <span onClick={this.toggleInfo2} id="info2">
                                   <span id="spa">
                                        <NavLink id="navlink" href="#">
                                              <FontAwesome
                                                  name = "info-circle"
                                                  size = "1x"
                                                />
                                        </NavLink>                                  
                                   </span>
                                   </span>
                                   <span className="btn2">
                                   <Button 
                                   id="nav-btn"
                                      size="sm"
                                      onClick={this.toggleEditForm}
                                      className="btn hidden-sm-up">
                                      {this.state.editable ? 'View Inputs' : 'Edit Form'}
                                   </Button>
                                   </span>
                               <Collapse className="navbar-toggleable-xs"  isOpen={this.state.isOpen} navbar>
                                  <Nav className="nav navbar-nav" navbar>
                                          <NavItem onClick={this.toggle}>
                                          <span id="spa">
                                            <abbr id="abbri"  title="Workout Inputs">
                                              <NavLink id="navlink" href="#workout">
                                               <FontAwesome
                                                  name = "heartbeat"
                                                  size = "1x"
                                                />&nbsp; Workout
                                              </NavLink>
                                            </abbr>
                                            </span>
                                          </NavItem>

                                        <NavItem onClick={this.toggle}>
                                        <span id="spa">
                                          <abbr  id="abbri"  title="Sleep Inputs">
                                            <NavLink id="navlink" href="#sleep">
                                              <FontAwesome
                                                name = "bed"
                                                size = "1x"
                                              />&nbsp; Sleep
                                            </NavLink>
                                          </abbr>
                                          </span>
                                        </NavItem>

                                        <NavItem onClick={this.toggle}>
                                        <span id="spa">
                                          <abbr  id="abbri"  title="Nutrition and Lifestyle Inputs">
                                            <NavLink id="navlink" href="#food">
                                              <FontAwesome
                                                name = "cutlery"
                                                size = "1x"
                                              />&nbsp; Nutrition and Lifestyle
                                            </NavLink>
                                          </abbr>
                                          </span>
                                        </NavItem>

                                        <NavItem onClick={this.toggle}>
                                        <span id="spa">
                                          <abbr  id="abbri"  title="Stress/Illness Inputs">
                                            <NavLink id="navlink" href="#stress">
                                              <FontAwesome
                                                name = "stethoscope"
                                                size = "1x"
                                              />&nbsp; Stress/Illness
                                            </NavLink>
                                          </abbr>
                                          </span>
                                        </NavItem>

                                        <NavItem onClick={this.toggle}>
                                        <span id="spa">
                                          <abbr  id="abbri"  title="Extra Inputs">
                                            <NavLink id="navlink" href="#daily">
                                              <FontAwesome
                                                name = "plus-circle"
                                                size = "1x"
                                              />&nbsp; Extra <b style={{fontWeight:"bold"}}>. . .</b>
                                            </NavLink>
                                          </abbr>
                                          </span>
                                       </NavItem>                                                                                                       
                                  </Nav>
                                </Collapse>
                                
                                 
                           </Navbar> 
                           
                           </div>
                           </div>                                   
                           <Popover 
                            placement="bottom" 
                            isOpen={this.state.calendarOpen}
                            target="calendar" 
                            toggle={this.toggleCalendar}>
                              <PopoverBody>
                                <CalendarWidget onDaySelect={this.processDate}/>
                              </PopoverBody>
                           </Popover> 

                           <Modal 
                          id="popover" 
                            placement="bottom" 
                            isOpen={this.state.infoBtn}
                            target="info2" 
                            toggle={this.toggleInfo2}>
                            <ModalHeader >
                            <span >
                           <a href="#" target="_blank" style={{fontSize:"15px",color:"black"}}> <i className="fa fa-share-square" aria-hidden="true">Share</i></a>
                           </span>
                           <span >
                            <a href="#" onClick={this.infoPrint} style={{paddingLeft:"35px",fontSize:"15px",color:"black"}}><i className="fa fa-print" aria-hidden="true">Print</i></a>
                            </span>
                            </ModalHeader>
                              <ModalBody className="modalcontent" id="modal1">
                               <div>
                                 Use the calendar to select the date you want to enter your inputs for.  The calendar defaults to today,
                                 but if you need to enter your inputs for another date, you can select any date by clicking the calendar
                                 icon OR the date text at the top of the inputs page and then navigating to any date you would like to enter information for.
                                 Use the calendar to enter your inputs for a previous day you forgot to submit your inputs!  
                               </div>

                               <div style={{paddingTop:"15px"}}>
                               TIP:  Many people use the calendar to select tomorrow’s date in order to enter their processed
                               food consumed for the next day’s reporting (since the % unprocessed food question is for the food
                               consumed yesterday and people often forget what they eat unless they write it down right away).
                               For example, if you have a chocolate bar today, go to the calendar, select tomorrow’s date, and
                               enter “Chocolate Bar” in for question 5.1 for your reporting for tomorrow and update question 5,
                               “What % of the food you ate yesterday was unprocessed” to reflect eating the chocolate bar.
                               </div>
                              </ModalBody>
                           </Modal>                                                        
               
                <Container id="user-inputs" >                          
                    <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-10 col-sm-12">
                        <Form 
                          onSubmit = {this.onSubmit}
                          className="user-inputs-form bootstrap_validator" 
                          role="form" 
                          data-toggle="validator">
                          {this.state.editable &&
                                 <div className="row justify-content-center"> 
                                   <span className="button1">
                                       <Button
                                           id="btn1"
                                            size="sm"
                                            onClick={this.fetchYesterdayData}
                                            className="btn">
                                            Copy Yesterday’s Inputs
                                          </Button>
                                   </span>
                                </div>
                          }

                          <div id="workout">
                          <h3><strong>Workout Inputs</strong></h3>

                           <FormGroup>   
                            <Label className="padding">1. Did You Workout Today?</Label>
                             <span id="workoutinfo"
                             onClick={this.toggleInfoworkout} 
                             style={{paddingLeft:"15px",color:"gray"}}>
                             <FontAwesome 
                                          style={{color:"#5E5E5E"}}
                                          name = "info-circle"
                                          size = "1.5x"                                      
                                        
                              />
                              </span>
                            
                            {this.state.editable &&
                              <div className="input">                           
                              
                                  <Label className="btn btn-secondary radio1">
                                    <Input type="radio" 
                                    name="workout" 
                                    value="yes" 
                                    checked={this.state.workout === 'yes'}
                                    onChange={this.handleChangeWorkoutDone}/> Yes
                                  </Label>
                                  <Label className="btn btn-secondary radio1">
                                    <Input type="radio" name="workout" 
                                    value="no"
                                    checked={this.state.workout === 'no'}
                                    onChange={this.handleChangeWorkoutDone}/> No
                                  </Label>
                                  <Label className="btn btn-secondary radio1">
                                    <Input type="radio" 
                                    name="workout" 
                                    value="not yet"
                                    checked={this.state.workout === 'not yet'}
                                    onChange={this.handleChangeWorkoutDone}/> Not Yet
                                  </Label>
                                </div>
                              }
                              {!this.state.editable && 
                                <div className="input">
                                  <p>{this.state.workout}</p>
                                </div>
                              }
                           
                          </FormGroup>

                            <Modal 
                            className="pop"
                            id="popover" 
                            placement="right" 
                            isOpen={this.state.infoWorkout}
                            target="workoutinfo" 
                            toggle={this.toggleInfoworkout}>
                             <ModalHeader >
                            <span >
                           <a href="#" target="_blank" style={{fontSize:"15px",color:"black"}}> <i className="fa fa-share-square" aria-hidden="true">Share</i></a>
                           </span>
                           <span >
                            <a href="#" onClick={this.infoPrint} style={{paddingLeft:"35px",fontSize:"15px",color:"black"}}><i className="fa fa-print" aria-hidden="true">Print</i></a>
                            </span>
                            </ModalHeader>
                              <ModalBody className="modalcontent" id="modal1">
                               <div>
                                If you worked out (exercised) today, select “Yes”, and
                                 then answer the questions related to your workout that follow.
                                 </div>

                               <div style={{paddingTop:"15px"}}>
                               TIP:  If you did not workout (exercise) today, select “No” or ‘Not Yet” and
                               all workout questions will disappear, making it easier for you to answer the
                               remaining (non workout) questions.
                               </div>

                               <div style={{paddingTop:"15px"}}>
                               If you selected “Not Yet” and work out later in the today, select “Yes” instead of “Not Yet”.
                               If you end up not working out, go back to the day you entered “Not Yet” and change the button
                               to “No”.  You can go back or forward to any date by clicking the calendar at the top of the inputs
                               page and selecting any date you would like to enter information for.
                               </div>
                              </ModalBody>
                           </Modal>       
                           {(this.state.workout === "no") &&
                          <FormGroup>
                              <Label className="padding">1.0.1 What Was The Reason You Did Not Exercise Today?</Label>

                                  {this.state.editable &&
                                    <div className="input1">
                                        <Input 
                                        type="select" 
                                        className="custom-select form-control" 
                                        name="no_exercise_reason"
                                        value={this.state.no_exercise_reason}                                       
                                        onChange={this.handleChangeNoExerciseReason}>
                                                <option value=" ">Select</option>                                        
                                                <option value="rest day">Rest Day</option> 
                                                <option value="sick">Sick</option>
                                                <option value="too busy/not enough time">Too Busy/Not Enough Time</option>
                                                <option value="didn’t feel like it">Didn’t Feel Like It</option>                                              
                                                <option value="work got in the way">Work Got in the Way</option>
                                                <option value="travel day">Travel Day</option>
                                                <option value="weather">Weather</option>
                                                <option value="other">Other</option>                                                                                                                                                                            
                                      </Input>
                                    </div>
                                  }
                                  {
                                  !this.state.editable &&
                                  <div className="input">
                                    <p>{this.state.no_exercise_reason}</p>
                                  </div>
                                }
                          </FormGroup>
                        }
                         {(this.state.workout === "no") &&
                           <FormGroup>      
                            <Label className="padding">1.0.2 No Exercise Reason Comments</Label>
                              {this.state.editable &&
                                <div className="input1">
                                     <Textarea  name="no_exercise_comment" 
                                     placeholder="please leave a comment" 
                                     className="form-control"
                                     rows="5" cols="5" 
                                     value={this.state.no_exercise_comment}
                                     onChange={this.handleChange}></Textarea>
                                </div>
                              }
                              {
                                !this.state.editable &&
                                <div className="input">
                                  <p>{this.state.no_exercise_comment}</p>
                                </div>
                              }
                          </FormGroup>
                        }
                          {(this.state.workout === "yes" || this.state.workout === "") &&
                            <FormGroup>   
                            <Label className="padding">1.1 What Type of Workout Did You Do Today?
                             <span id="workouttypeinfo"
                             onClick={this.toggleInfoworkoutType} 
                             style={{paddingLeft:"15px",color:"gray"}}>
                            
                             <FontAwesome 
                                          style={{color:"#5E5E5E"}}
                                          name = "info-circle"
                                          size = "1x"                                      
                                        
                              />
                            
                              </span>
                            </Label>
                            {this.state.editable &&
                              <div className="input">                           
                              
                                  <Label className="btn btn-secondary radio1">
                                    <Input type="radio" 
                                    name="workout_type" 
                                    value="cardio" 
                                    checked={this.state.workout_type === 'cardio'}
                                    onChange={this.handleChange}/> Cardio
                                  </Label>
                                  <Label className="btn btn-secondary radio1">
                                    <Input type="radio" 
                                    name="workout_type" 
                                    value="strength"
                                    checked={this.state.workout_type === 'strength'}
                                    onChange={this.handleChange}/> Strength
                                  </Label>
                                  <Label className="btn btn-secondary radio1">
                                    <Input type="radio" 
                                    name="workout_type" 
                                    value="both"
                                    checked={this.state.workout_type === 'both'}
                                    onChange={this.handleChange}/> Both
                                  </Label>
                                </div>
                              }
                           
                              {!this.state.editable && 
                                <div className="input">
                                  <p>{this.state.workout_type}</p>
                                </div>
                              }
                               </FormGroup>
                                    
                            }   
                             <Modal 
                          id="popover"
                          className="pop" 
                            placement="right" 
                            isOpen={this.state.infoWorkoutType}
                            target="workouttypeinfo" 
                            toggle={this.toggleInfoworkoutType}>
                             <ModalHeader >
                            <span >
                           <a href="#" target="_blank" style={{fontSize:"15px",color:"black"}}> <i className="fa fa-share-square" aria-hidden="true">Share</i></a>
                           </span>
                           <span >
                            <a href="#" onClick={this.infoPrint} style={{paddingLeft:"35px",fontSize:"15px",color:"black"}}><i className="fa fa-print" aria-hidden="true">Print</i></a>
                            </span>
                            </ModalHeader>
                              <ModalBody className="modalcontent" id="modal1">
                               <div>
                               User can select “Cardio”, “Strength” or “Both”.
                                 </div>

                               <div style={{paddingTop:"15px"}}>
                              A Cardio workout is exercise that is focused on consistently
                              getting your heart rate higher than your resting heart rate
                              over the period of your workout
                               </div>

                               <div style={{paddingTop:"15px"}}>
                              A strength workout can be with weights (dumbbells, kettlebells, other things to lift/press)
                              and/or body resistance based exercises (with or without resistance bands), including but not
                              limited to squats, lunges, planks, push ups, clamshells, bridges, step ups, jumps, balancing
                              exercises, pull ups, etc.  
                               </div>
                              </ModalBody>
                           </Modal>                         

                            {(this.state.workout == "yes" || this.state.workout == "") &&
                              <FormGroup>   
                                <Label className="padding">1.2 Was Your Workout Today Easy, Medium, or Hard”?
                                <span id="easyorhard"
                             onClick={this.toggleEasyorHard} 
                             style={{paddingLeft:"15px",color:"gray"}}>
                            
                             <FontAwesome 
                                          style={{color:"#5E5E5E"}}
                                          name = "info-circle"
                                          size = "1x"                                      
                                        
                              />
                          
                              </span>
                                </Label>
                                {this.state.editable && 
                                 
                                     <div className="input">
                                     <Label check className="btn btn-secondary radio1">
                                        <Input type="radio" name="workout_easy" 
                                        value="easy"
                                        checked={this.state.workout_easy === 'easy'}
                                        onChange={this.handleChangeWorkout}/>{' '}
                                        Easy
                                     </Label>
                                    
                                      <Label check className="btn btn-secondary radio1">
                                        <Input type="radio" name="workout_easy" 
                                        value="medium"
                                        checked={this.state.workout_easy === 'medium'}
                                        onChange={this.handleChangeWorkout}/>{' '}
                                        Medium
                                     </Label>
                                     <Label check className="btn btn-secondary radio1">
                                       <Input type="radio" name="workout_easy"
                                            value="hard"
                                            checked={this.state.workout_easy === 'hard'}
                                            onChange={this.handleChangeWorkout}/>{' '}
                                          Hard
                                    </Label>
                                </div>  
                                    
                                }
                                {
                                  !this.state.editable &&
                                  <div className="input">
                                    <p>{this.state.workout_easy}</p>
                                  </div>
                                }
                              </FormGroup> 
                          }

                           <Modal 
                          id="popover"
                          className="pop"
                            placement="right" 
                            isOpen={this.state.easyorhardInfo}
                            target="easyorhard" 
                            toggle={this.toggleEasyorHard}>
                             <ModalHeader >
                            <span >
                           <a href="#" target="_blank" style={{fontSize:"15px",color:"black"}}> <i className="fa fa-share-square" aria-hidden="true">Share</i></a>
                           </span>
                           <span >
                            <a href="#" onClick={this.infoPrint} style={{paddingLeft:"35px",fontSize:"15px",color:"black"}}><i className="fa fa-print" aria-hidden="true">Print</i></a>
                            </span>
                            </ModalHeader>
                              <ModalBody className="modalcontent" id="modal1">
                               <div>
                              User should indicate whether the workout was easy or hard.
                              We will correlate your answer to this question to your perceived
                              workout effort level (question 1.4) and also to your workout average
                              heart rate (from a wearable device). Your thoughtful answers to these
                              questions are an important part of us assessing your exercise and
                              identifying ways you can improve you overall health, get leaner 
                              (and keep weight off), and to get faster as an athlete!
                                 </div>


                               <div style={{paddingTop:"15px"}}>
                                   You should select “Easy” or “Hard” depending on your perceived effort level
                                   of your exercise.  If your workout felt easy and you could have continued
                                   exercising at the same effort level for a long time, select “Easy”.  If you
                                   could not have continued to exercise for a long period of time because your
                                   workout was difficult and/or because your exertion level during your workout
                                   was high, select “Hard”.
                               </div>

                               <div style={{paddingTop:"15px"}}>
                                Users should easily be able to talk during an Easy workout
                               and should not be suffering at any point whatsoever.  
                               </div>

                                <div style={{paddingTop:"15px"}}>
                               If it was hard to talk during a portion of your workout, you suffered for some or most
                               of your workout, and/or your workout was generally difficult,
                               select Hard as the answer to this question.  
                               </div>
                              </ModalBody>
                           </Modal> 


                        { (this.state.workout == "yes" || this.state.workout == "") &&
                          <FormGroup>   
                              <Label className="padding">1.3 Was Your Workout Today Enjoyable?
                              <span id="enjoyble"
                             onClick={this.toggleEnjoyble} 
                             style={{paddingLeft:"15px",color:"gray"}}>
                             <FontAwesome 
                                          style={{color:"#5E5E5E"}}
                                          name = "info-circle"
                                          size = "1.5x"                                      
                                        
                              />
                              </span>  
                              </Label>
                              {this.state.editable &&
                                <div className="input">
                                     <Label check className="btn btn-secondary radio1">
                                        <Input type="radio" name="workout_enjoyable" 
                                        value="yes"
                                        checked={this.state.workout_enjoyable === 'yes'}
                                        onChange={this.handleChange}/>{' '}
                                        Yes
                                     </Label>
                                     <Label check className="btn btn-secondary radio1">
                                       <Input type="radio" name="workout_enjoyable" 
                                            value="no"
                                            checked={this.state.workout_enjoyable === 'no'}
                                            onChange={this.handleChange}/>{' '}
                                          No
                                    </Label>
                                </div>  
                              }
                              {
                                !this.state.editable &&
                                <div className="input">
                                  <p>{this.state.workout_enjoyable}</p>
                                </div>
                              }
                          </FormGroup>
                        }
                         <Modal 
                                    className="pop"
                                    id="popover" 
                                    placement="right" 
                                    isOpen={this.state.enjoybleInfo}
                                    target="enjoyble" 
                                    toggle={this.toggleEnjoyble}>
                                     <ModalHeader >
                            <span >
                           <a href="#" target="_blank" style={{fontSize:"15px",color:"black"}}> <i className="fa fa-share-square" aria-hidden="true">Share</i></a>
                           </span>
                           <span >
                            <a href="#" onClick={this.infoPrint} style={{paddingLeft:"35px",fontSize:"15px",color:"black"}}><i className="fa fa-print" aria-hidden="true">Print</i></a>
                            </span>
                            </ModalHeader>
                                      <ModalBody className="modalcontent" id="modal1">
                                       <div>
                                        We encourage people to enjoy their workouts! When they do,
                                        they tend to exercise more frequently and don’t dread doing it.
                                         If you do not find your exercise enjoyable, you may be working out too hard! Slow down,
                                          breathe in and out through your nose, and enjoy exercising easier. It has many benefits!
                                           One can get faster, fitter, and leaner by exercising easier.
                                         </div>                                                   
                                      </ModalBody>
                                   </Modal> 

                          { (this.state.workout == "yes" || this.state.workout == "") &&
                            <FormGroup>   
                              <Label className="padding">1.4 Your Workout Effort Level? (with 1 being the easiest and 10 the hardest)
                               <span id="workoutlevel"
                             onClick={this.toggleWorkoutLevel} 
                             style={{paddingLeft:"15px",color:"gray"}}>
                             <FontAwesome 
                                          style={{color:"#5E5E5E"}}
                                          name = "info-circle"
                                          size = "1.5x"                                      
                                        
                              />
                              </span>  
                              </Label>
                                { this.state.editable &&
                                  <div className="input">
                                      <Input 
                                      type="select" 
                                      className="custom-select form-control" 
                                      name="workout_effort"
                                      value={this.state.workout_effort}
                                      onChange={this.handleChangeWorkoutEffort} >
                                            <option value="">select</option>                                 
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                      </Input>
                                  </div>
                                }
                                {
                                  !this.state.editable &&
                                  <div className="input">
                                    <p>{this.state.workout_effort}</p>
                                  </div>
                                }
                                <FormGroup id="padd">  
                                {this.renderWorkoutEffortModal()}
                                </FormGroup>
                            </FormGroup>
                          }
              
                           <Modal 
                                    className="pop"
                                    id="popover" 
                                    placement="right" 
                                    isOpen={this.state.workoutlevelInfo}
                                    target="workoutlevel" 
                                    toggle={this.toggleWorkoutLevel}>
                                     <ModalHeader >
                            <span >
                           <a href="#" target="_blank" style={{fontSize:"15px",color:"black"}}> <i className="fa fa-share-square" aria-hidden="true">Share</i></a>
                           </span>
                           <span >
                            <a href="#" onClick={this.infoPrint} style={{paddingLeft:"35px",fontSize:"15px",color:"black"}}><i className="fa fa-print" aria-hidden="true">Print</i></a>
                            </span>
                            </ModalHeader>
                                      <ModalBody className="modalcontent" id="modal1">
                                       <div>
                                         As a general guideline, an effort level of 1-2 is super easy,
                                         barely moving. A 3-4 is an effort level that gets your heart rate up
                                         that you can sustain for a very long time (like a “forever pace”).
                                         You should be able to speak easily at this level and it shouldn’t be hard.
                                          A 5-6-7 is harder and it is much harder to hold this effort level for a long time.
                                          A 7-8 is hard work, it is hard to talk while exercising, and you would have to work
                                          very hard to hold this pace for a long time. A 9 is very hard and you can’t hold this
                                          pace very long. A 10 is an all-out effort.
                                         </div>                                                   
                                      </ModalBody>
                                   </Modal> 

                          { (this.state.workout == "yes" || this.state.workout == "") &&
                          <FormGroup>
                            <Label className="padding">1.5 Did You Have Any Pain or Twinges During or After Your Workout?
                             <span id="pain"
                             onClick={this.togglePain} 
                             style={{paddingLeft:"15px",color:"gray"}}>
                             <FontAwesome 
                                          style={{color:"#5E5E5E"}}
                                          name = "info-circle"
                                          size = "1.5x"                                      
                                        
                              />
                              </span>  
                            </Label>
                                {this.state.editable &&
                                  <div className="input">
                                     
                                       <Label check className="btn btn-secondary radio1">
                                      <Input type="radio" name="pain" 
                                      value="yes"
                                      checked={this.state.pain === 'yes'}
                                      onChange={this.handleChangePain}/>{' '}
                                      Yes
                                   </Label>
                                   <Label check className="btn btn-secondary radio1">
                                     <Input type="radio" name="pain" 
                                          value="no"
                                          checked={this.state.pain === 'no'}
                                          onChange={this.handleChangePain}/>{' '}
                                        No
                                  </Label>
                                  </div>
                                }
                                {
                                  !this.state.editable &&
                                  <div className="input">
                                    <p>{this.state.pain}</p>
                                  </div>
                                }
                                <FormGroup id="padd"> 
                                {this.renderPainModal()}
                                </FormGroup>
                          </FormGroup>
                          }

                          <Modal 
                            className="pop"
                            id="popover" 
                            placement="right" 
                            isOpen={this.state.painInfo}
                            target="pain" 
                            toggle={this.togglePain}>
                             <ModalHeader >
                            <span >
                           <a href="#" target="_blank" style={{fontSize:"15px",color:"black"}}> <i className="fa fa-share-square" aria-hidden="true">Share</i></a>
                           </span>
                           <span >
                            <a href="#" onClick={this.infoPrint} style={{paddingLeft:"35px",fontSize:"15px",color:"black"}}><i className="fa fa-print" aria-hidden="true">Print</i></a>
                            </span>
                            </ModalHeader>
                              <ModalBody className="modalcontent" id="modal1">
                               <div>
                            Enter any twinges/pains here. Be honest. Staying healthy is critical to fitness.
                            We track all twinges and injuries so (1) you can get a picture of what is bothering 
                            you over time and (2) you can figure out why you have pain/twinges so you can fix the
                            root of the problem in order for you to (hopefully) stay injury free in the future.
                            Often strength training and/or wearing custom orthotics can help keep us injury free
                            (although custom orthotics usually require 2-3 adjustments to dial them in). It often
                            takes weeks or months for injuries to appear, and once they do, they are hard to shake.
                            Our rule: NEVER run when you have an injury. If it doesn’t hurt to walk, you can run or
                            do other exercise. If it hurts after a few initial twinges, STOP and do another form of
                            exercise that doesn’t hurt. The bike, elliptical, swimming, and perhaps even stair climbing
                            might be good substitutes for running while injured. The most important thing is to get your
                            heart rate up most days without PAIN!
                                 </div>                                                   
                              </ModalBody>
                           </Modal> 


                          { (this.state.workout == "yes" || this.state.workout == "") &&
                            this.state.workout_type !== "strength" &&
                            this.state.workout_input_type !== "strength" &&
                          <FormGroup>    
                            <Label className="padding">1.6 Water Consumed During Workout (Ounces)
                             <span id="water"
                             onClick={this.toggleWater} 
                             style={{paddingLeft:"15px",color:"gray"}}>
                             <FontAwesome 
                                          style={{color:"#5E5E5E"}}
                                          name = "info-circle"
                                          size = "1.5x"                                      
                                        
                              />
                              </span>   
                            </Label>
                              { this.state.editable &&
                              <div className="input">
                                  <Input type="select" 
                                         className="custom-select form-control" 
                                         name="water_consumed"                                 
                                         value={this.state.water_consumed}
                                         onChange={this.handleChange}>
                                         <option key="select"value="">select</option>                            
                                         {this.createDropdown(0,250)}
                                  </Input>
                              </div>
                            }
                            {
                              !this.state.editable &&
                              <div className="input">
                                <p>{this.state.water_consumed}</p>
                              </div>
                            }
                          </FormGroup>
                        }
                         <Modal 
                            className="pop"
                            id="popover" 
                            placement="right" 
                            isOpen={this.state.waterInfo}
                            target="water" 
                            toggle={this.toggleWater}>
                             <ModalHeader >
                            <span >
                           <a href="#" target="_blank" style={{fontSize:"15px",color:"black"}}> <i className="fa fa-share-square" aria-hidden="true">Share</i></a>
                           </span>
                           <span >
                            <a href="#" onClick={this.infoPrint} style={{paddingLeft:"35px",fontSize:"15px",color:"black"}}><i className="fa fa-print" aria-hidden="true">Print</i></a>
                            </span>
                            </ModalHeader>
                              <ModalBody className="modalcontent" id="modal1">
                               <div>
                             Indicate how many ounces of water you consumed during your workout.
                             We encourage you to drink water when thirsty during your workouts
                             (don’t drink if not thirsty as drinking too much can have negative
                             consequences on your health). We carry a 20 ounce water bottle for
                             all of our runs/workouts (there are many bottles that have handles
                             on them that are great and barely noticeable once you get used to them).
                             Staying hydrated to critical to health. When we become dehydrated, our
                             blood gets thicker, and when our blood get thicker, our heart and
                             cardiovascular system has to work harder to pump the blood through
                             our body. When this happens, our heart rate goes up! As heart rate
                             training is a critical part of our program, we want to keep it as 
                             low as possible during all workouts (easy or hard). Therefore, stay
                             hydrated to keep your heart rate down. We encourage you to stay hydrated
                             throughout the day also. Drink when thirsty and make sure not to drink
                             too much (which can also have negative ramifications on your health).
                                 </div>                                                   
                              </ModalBody>
                           </Modal> 

                          
                          { (this.state.workout == "yes" || this.state.workout == "") &&
                            this.state.workout_type !== "strength" &&
                            this.state.workout_input_type !== "strength" &&    
                          <FormGroup>      
                            <Label className="padding">1.7 Tablespoons of Chia Seeds Consumed During Workout?
                             <span id="chaiseeds"
                             onClick={this.toggleChaiseeds} 
                             style={{paddingLeft:"15px",color:"gray"}}>
                             <FontAwesome 
                                          style={{color:"#5E5E5E"}}
                                          name = "info-circle"
                                          size = "1.5x"                                      
                                        
                              />
                              </span>   
                            </Label>
                                { this.state.editable &&
                                  <div className="input">
                                      <Input 
                                      type="select" 
                                      className="custom-select form-control" 
                                      name="chia_seeds"
                                      value={this.state.chia_seeds}
                                      onChange={this.handleChange}>
                                          <option value="">select</option>
                                          {this.createDropdown(0,10)}
                                      </Input>
                                  </div>
                                }
                                {
                                  !this.state.editable &&
                                  <div className="input">
                                    <p>{this.state.chia_seeds}</p>
                                  </div>
                                }   
                          </FormGroup>
                        }

                        <Modal 
                            className="pop"
                            id="popover" 
                            placement="right" 
                            isOpen={this.state.chaiseedsInfo}
                            target="chaiseeds" 
                            toggle={this.toggleChaiseeds}>
                             <ModalHeader >
                            <span >
                           <a href="#" target="_blank" style={{fontSize:"15px",color:"black"}}> <i className="fa fa-share-square" aria-hidden="true">Share</i></a>
                           </span>
                           <span >
                            <a href="#" onClick={this.infoPrint} style={{paddingLeft:"35px",fontSize:"15px",color:"black"}}><i className="fa fa-print" aria-hidden="true">Print</i></a>
                            </span>
                            </ModalHeader>
                              <ModalBody className="modalcontent" id="modal1">
                               <div>
                              We encourage everybody to consume chia seeds during their workout,                               
                              particularly runners and triathletes that do workouts/races longer
                              than 2 hours. We recommend 2-3 tablespoons of chia seeds in your 20
                              ounce water bottle. TIP: make sure to measure this amount, otherwise
                              you will put too much in your bottle and as a result the chia seeds
                              will become too thick in your bottle and almost undrinkable.
                                 </div>

                               <div style={{paddingTop:"15px"}}>
                               Chia seeds are super healthy for us. They are a great source of healthy omega-3 fatty acids                          
                               carbohydrates, protein, fiber, antioxidants, and calcium, to name a few benefits.
                               They also provide endurance athletes with unprocessed calories, which can provide
                               much needed energy during races (and can easily be carried in a fanny pack or race
                               belt to replace chia seeds consumed throughout the race). Chia seeds become gelatinous
                               when sitting in water after a few minutes and really don’t taste like anything. We encourage
                               you to put chia seeds in your water bottle for every workout to get used to using them so
                               that you can use them easily on race day. 3 tablespoons of chia seeds is 150 calories!
                               </div>                             
                              </ModalBody>
                           </Modal> 

                        
                          { (this.state.workout == "yes" || this.state.workout == "") &&
                            this.state.workout_type !== "strength" &&
                            this.state.workout_input_type !== "strength" &&  
                            <FormGroup>
                              <Label className="padding">1.8 What % of Your Workout Did you breathe in and out through Your nose?
                              <span id="breathe"
                             onClick={this.toggleBreathe} 
                             style={{paddingLeft:"15px",color:"gray"}}>
                             <FontAwesome 
                                          style={{color:"#5E5E5E"}}
                                          name = "info-circle"
                                          size = "1.5x"                                      
                                        
                              />
                              </span>                              
                              </Label>
                                  {this.state.editable &&
                                    <div className="input">
                                        <Input type="select"
                                         className="form-control custom-select" 
                                         name="breath_nose"                         
                                         value={this.state.breath_nose}
                                         onChange={this.handleChange}>
                                         <option key="select" value="">select</option>                            
                                          {this.createNoseDropdown(0,100)}
                                        </Input>
                                    </div>
                                  }
                                  {
                                    !this.state.editable &&
                                    <div className="input">
                                      <p>{this.state.breath_nose}</p>
                                    </div>
                                  }
                            </FormGroup>
                          }
                           <Modal 
                            className="pop"
                            id="popover" 
                            placement="right" 
                            isOpen={this.state.breatheInfo}
                            target="breathe" 
                            toggle={this.toggleBreathe}>
                             <ModalHeader >
                            <span >
                           <a href="#" target="_blank" style={{fontSize:"15px",color:"black"}}> <i className="fa fa-share-square" aria-hidden="true">Share</i></a>
                           </span>
                           <span >
                            <a href="#" onClick={this.infoPrint} style={{paddingLeft:"35px",fontSize:"15px",color:"black"}}><i className="fa fa-print" aria-hidden="true">Print</i></a>
                            </span>
                            </ModalHeader>
                              <ModalBody className="modalcontent" id="modal1">
                               <div>
                               We encourage you to breathe in and out of your nose as much as possible.
                               Indicate what percent of your workout that you breathed in and out of your nose.
                               Nose breathing has many benefits, including but not limited to (1) increasing the
                               production of nitric oxide, which expands blood vessels and increases blood flow;
                               (2) lowering heart rate and breath rate while exercising when compared to mouth breathing;
                               (3) shorter recovery times and better endurance than mouth breathing exercise;
                               (4) driving oxygen more efficiently into the lower lobes of the lungs rather than
                               staying in the upper lobes, as with mouth breathing. With nose breathing, all five
                               lobes of the lungs are used to breathe rather than just the upper two; (5) helping
                               to remove more waste (CO2) from our body; (6) regulating our pace (usually slowing
                               us down) so that over time we can get faster by going slower; (7) helping to lose
                               weight, improve overall health , wellness, and overall athletic performance
                                 </div>

                               <div style={{paddingTop:"15px"}}>
                               Often, people say to us “there’s no way I can breathe in and out of my nose when exercising,
                               I can’t even do it when I’m not exercising!” or “I have cysts (or other blockages or a deviated
                               septum) or other ailments in my nose/sinuses, no way I can breathe 100% in and out of my nose”.
                               Our response “try, and over time it will get easier.  If you can’t breathe in and out of your nose,
                               then slow down!!  If this doesn’t work, you may need to blow your nose and/or blow some snot rockets
                               from your nose while exercising.  Eventually, you will be able to do it (if you BELIEVE)!  If you don’t
                               BELIEVE, you will NEVER be able to do it.  The benefits are vast to nose breathing, including getting
                               much faster as an athlete”
                               </div>                             
                              </ModalBody>
                           </Modal>       
                           
                          { (this.state.workout == "yes" || this.state.workout == "") &&
                            this.state.workout_type !== "strength" &&
                            this.state.workout_input_type !== "strength" &&
                           <FormGroup>
                            <Label className="padding">1.9 Were You Fasted During Your Workout? 
                            <span id="fast"
                             onClick={this.toggleFasted} 
                             style={{paddingLeft:"15px",color:"gray"}}>
                            
                             <FontAwesome 
                                          style={{color:"#5E5E5E"}}
                                          name = "info-circle"
                                          size = "1x"                                      
                                        
                              />
                            
                              </span>
                            </Label>
                              {this.state.editable &&
                                <div className="input">
                                  
                                    <Label check className="btn btn-secondary radio1">
                                      <Input type="radio" name="fasted" 
                                      value="yes"
                                      checked={this.state.fasted === 'yes'}
                                      onChange={this.handleChangeFasted}/>{' '}
                                      Yes
                                   </Label>
                                   <Label check className="btn btn-secondary radio1">
                                     <Input type="radio" name="fasted" 
                                          value="no"
                                          checked={this.state.fasted === 'no'}
                                          onChange={this.handleChangeFasted}/>{' '}
                                        No
                                  </Label>
                                </div>
                              }
                              {
                                !this.state.editable &&
                                <div className="input">
                                  <p>{this.state.fasted}</p>
                                </div>
                              }
                              {
                                !this.state.editable && this.state.fasted == 'yes' &&
                                <div >
                                  <Label className="LAbel">1.9.1 What Food Did You Eat Before Your Workout?</Label>
                                  <p className="input">{this.state.food_ate_before_workout?this.state.food_ate_before_workout:'Nothing'}</p>
                                </div>
                              }
                               <FormGroup id="padd">
                                 {this.renderFasted()}
                               </FormGroup>
                          </FormGroup>
                        }

                        <Modal 
                          id="popover"
                          className="pop"
                            placement="right" 
                            isOpen={this.state.fastedInfo}
                            target="fast" 
                            toggle={this.toggleFasted}>
                             <ModalHeader >
                            <span >
                          <a href="#" target="_blank" style={{fontSize:"15px",color:"black"}}> <i className="fa fa-share-square" aria-hidden="true">Share</i></a>
                           </span>
                           <span >
                            <a href="#" onClick={this.infoPrint} style={{paddingLeft:"35px",fontSize:"15px",color:"black"}}><i className="fa fa-print" aria-hidden="true">Print</i></a>
                            </span>
                            </ModalHeader>
                              <ModalBody className="modalcontent" id="modal1">
                               <div>
                                Did you eat anything 5 hours or less before your workout? If “Yes”,
                                then you were not fasted and you should answer “No” to this question. Otherwise,
                                answer “Yes”, which means you did not eat at least 5 hours before your workout.
                                 </div>


                               <div style={{paddingTop:"15px"}}>
                                  Some experts believe that exercising fasted may increase fat burning while exercising.
                               </div>                            
                              </ModalBody>
                           </Modal> 



                        { (this.state.workout === "yes" || this.state.workout === "") &&     
                          <FormGroup>      
                            <Label className="padding">
                              {(this.state.workout_type === 'strength' ||
                                this.state.workout_input_type === 'strength')?
                               '1.10 General Strength Comments/What Strength Sets Did You Do?':
                               '1.10 General Workout Comments'}
                                <span id="general"
                             onClick={this.toggleComment} 
                             style={{paddingLeft:"15px",color:"gray"}}>
                            
                             <FontAwesome 
                                          style={{color:"#5E5E5E"}}
                                          name = "info-circle"
                                          size = "1x"                                      
                                        
                              />
                            
                              </span>                              
                            </Label>
                              {this.state.editable &&
                                <div className="input1">
                                     <Textarea name="workout_comment"                             
                                     placeholder="please leave a comment" 
                                     className="form-control"
                                     rows="5" cols="5" 
                                     value={this.state.workout_comment}
                                     onChange={this.handleChange}></Textarea>
                                </div>
                              }
                              {
                                !this.state.editable &&
                                <div className="input">                             
                                  <p>{this.state.workout_comment}</p>
                                </div>
                              }
                          </FormGroup>
                        }

                        <Modal 
                          id="popover"
                          className="pop"
                            placement="right" 
                            isOpen={this.state.commentInfo}
                            target="general" 
                            toggle={this.toggleComment}>
                             <ModalHeader >
                            <span >
                           <a href="#" target="_blank" style={{fontSize:"15px",color:"black"}}> <i className="fa fa-share-square" aria-hidden="true">Share</i></a>
                           </span>
                           <span >
                            <a href="#" onClick={this.infoPrint} style={{paddingLeft:"35px",fontSize:"15px",color:"black"}}><i className="fa fa-print" aria-hidden="true">Print</i></a>
                            </span>
                            </ModalHeader>
                              <ModalBody className="modalcontent" id="modal1">
                               <div>
                               Enter any comments about your workout here, including but not limited to how you felt,
                                pain/twinges, things you want to remember later, whether you worked out with somebody,
                                 whether you talked during your workout, to explain something (for example, why your effort
                                  level was harder or easier, why your pace was faster or slower, why you didn’t nose breathe
                                   as much, why you didn’t drink water), etc.
                                 </div>                                                       
                              </ModalBody>
                           </Modal> 

                        { (this.state.workout === "yes" || this.state.workout === "") &&
                            <FormGroup>  
                              {this.state.editable &&
                                <div className="input1">
                                <Input
                                className = "radio1"
                                type="checkbox" 
                                checked = {this.state.weather_check}                                            
                                onClick={this.handleWeatherCheck}
                                >
                                </Input>
                                <Label className="LAbel">1.11 I want to manually enter in weather information for my workout
                                 <span id="wether"
                             onClick={this.toggleWeather} 
                             style={{paddingLeft:"15px",color:"gray"}}>
                            
                             <FontAwesome 
                                          style={{color:"#5E5E5E"}}
                                          name = "info-circle"
                                          size = "1x"                                      
                                        
                              />
                            
                              </span>
                                </Label>
                                </div>
                              }
                               
                              {
                                !this.state.editable &&
                                (this.state.workout === "yes" || this.state.workout === "") &&
                                <div>
                                <Label className="LAbel">1.11 I want to manually enter in weather information for my workout</Label>
                                <div className="input">                             
                                  <p>{this.state.weather_check?"yes":"no"}</p>
                                </div>
                                </div>
                              }
                            </FormGroup>
                          }
                      
                      

                         <Modal 
                          id="popover"
                          className="pop"
                            placement="right" 
                            isOpen={this.state.weatherInfo}
                            target="wether" 
                            toggle={this.toggleWeather}>
                             <ModalHeader >
                            <span >
                           <a href="#" target="_blank" style={{fontSize:"15px",color:"black"}}> <i className="fa fa-share-square" aria-hidden="true">Share</i></a>
                           </span>
                           <span >
                            <a href="#" onClick={this.infoPrint}  style={{paddingLeft:"35px",fontSize:"15px",color:"black"}}><i className="fa fa-print" aria-hidden="true">Print</i></a>
                            </span>
                            </ModalHeader>
                              <ModalBody className="modalcontent" id="modal1">
                               <div>
                               We encourage all users to enter weather information after each workout.
                               We track weather because it can have a HUGE impact on performance. We encourage
                               people to keep their heart rate in an EASY aerobic zone most of the time, even
                               when the dew point/temperature/humidity is high, which means slowing in hot weather.
                               So, people slow down a lot in the summer to keep their heart rate in range. The higher
                               the dew point, the more we have to slow down. In the fall when the dew point is lower,
                               we get faster at the same heart rate level if we have been good about slowing down in 
                               hot weather. It seems counter-intuitive to go slower to get faster, but it works! Your
                               body will become heat acclimated and thrive when it cools down. On our site, you will
                               be able to see your historical performance relative to your weather stats if you enter them consistently.
                                 </div>


                               <div style={{paddingTop:"15px"}}>
                                  We ask that you report your outdoor stats (temperature, humidity, dew point) even for indoor workouts,
                                  as things like humidity and dew point seep inside too.
                               </div>                            
                              </ModalBody>
                           </Modal> 
                         
                        <Collapse isOpen={this.state.weather_check}>
                         { (this.state.workout === "yes" || this.state.workout === "") &&                                                      
                         <FormGroup>                          
                            <Label className="padding">1.11.1 What was the temperature (in degree celsius)
                             when I did my workout (get from weather apps)?</Label>
                            {this.state.editable &&
                              <div>
                                <div className="col-xs-6">
                                  <div className="input"> 
                                <Input type="select" name="indoor_temperature"
                                id="hours"
                                className="form-control custom-select"
                                value={this.state.indoor_temperature}
                                onChange={this.handleChange}>
                                 <option key="hours" value="">Indoor</option>
                                {this.createDropdown(-20,120)}                        
                                </Input>
                                </div>
                                </div>
                              
                                <div className="col-xs-6 justify-content-right">
                               <div className="input">
                                <Input type="select" name="outdoor_temperature"
                                 id="minutes"
                                className="form-control custom-select "
                                value={this.state.outdoor_temperature}
                                onChange={this.handleChange}>
                                 <option key="mins" value="">Outdoor</option>
                                {this.createDropdown(-20,120,true)}                        
                                </Input>                        
                                </div>
                                </div>
                              </div>
                            }
                            {
                              !this.state.editable &&
                              <div className="input">
                              {(this.state.indoor_temperature && this.state.outdoor_temperature) &&
                                <p>Indoor temperature : {this.state.indoor_temperature}  Outdoor temperature : {this.state.outdoor_temperature} </p>
                              }
                              </div>
                            }                          
                          </FormGroup>
                        }

                         { (this.state.workout === "yes" || this.state.workout === "") &&  
                          <FormGroup>
                            <Label className="padding">1.11.2 What was the dew point when I did my workout (get from weather apps)?</Label>
                            {this.state.editable &&
                              <div className="input1">
                                  <Input type="select" 
                                     className="custom-select form-control"
                                     name="dewpoint"                                  
                                     value={this.state.dewpoint}
                                     onChange={this.handleChange} >
                                     <option key="select" value="">Select</option>                                    
                                     {this.createDropdown(-20,120,true)}
                                     </Input>
                              </div>
                            }
                            {
                              !this.state.editable &&
                              <div className="input">
                                <p>{this.state.dewpoint}</p>
                              </div>
                            }
                          </FormGroup> 
                       }

                        { (this.state.workout === "yes" || this.state.workout === "") && 
                        <FormGroup>
                            <Label className="padding">1.11.3  What was the humidity when I did my workout (get from weather apps)? </Label>
                            {this.state.editable &&
                              <div className="input1">
                                  <Input type="select" 
                                     className="custom-select form-control"
                                     name="humidity"                                  
                                     value={this.state.humidity}
                                     onChange={this.handleChange} >
                                     <option key="select" value="">Select</option>                                    
                                     {this.createDropdown(1,100)}
                                     </Input>
                              </div>
                            }
                            {
                              !this.state.editable &&
                              <div className="input">
                                <p>{this.state.humidity}</p>
                              </div>
                            }
                          </FormGroup>  
                        }

                         { (this.state.workout === "yes" || this.state.workout === "") &&  
                          <FormGroup>
                            <Label className="padding">1.11.4 What was the wind when I did my workout (get from weather apps)?</Label>
                            {this.state.editable &&
                              <div className="input1">
                                  <Input type="select" 
                                     className="custom-select form-control"
                                     name="wind"                                  
                                     value={this.state.wind}
                                     onChange={this.handleChange} >
                                     <option key="select" value="">Select</option>                                    
                                     {this.createDropdown(0,350)}
                                     </Input>
                              </div>
                            }
                            {
                              !this.state.editable &&
                              <div className="input">
                                <p>{this.state.wind}</p>
                              </div>
                            }
                          </FormGroup> 
                       }

                        { (this.state.workout === "yes" || this.state.workout === "") &&  
                          <FormGroup>
                            <Label className="padding">1.11.5 What was the Temperature Feels Like when I did my workout (get from weather apps)?</Label>
                            {this.state.editable &&
                              <div className="input1">
                                  <Input type="select" 
                                     className="custom-select form-control"
                                     name="temperature_feels_like"                                  
                                     value={this.state.temperature_feels_like}
                                     onChange={this.handleChange} >
                                     <option key="select" value="">Select</option>                                    
                                     {this.createDropdown(-20,120)}
                                     </Input>
                              </div>
                            }
                            {
                              !this.state.editable &&
                              <div className="input">
                                <p>{this.state.temperature_feels_like}</p>
                              </div>
                            }
                          </FormGroup> 
                       }


                         { (this.state.workout === "yes" || this.state.workout === "") &&
                          <FormGroup>      
                            <Label className="padding">1.11.6  Weather Comments (allow the user to enter text with comments)</Label>
                            {this.state.editable &&
                              <div className="input1">
                                 <Textarea  name="weather_comment"
                                  rows="5" cols="5" 
                                  className="form-control" 
                                 value={this.state.weather_comment}
                                 onChange={this.handleChange}></Textarea>
                              </div>
                            }
                            {
                              !this.state.editable &&
                              <div className="input">
                                <p >{this.state.weather_comment}</p>
                              </div>
                            }
                          </FormGroup>   
                       }
                       </Collapse>
                     
                        { (this.state.workout == "yes" || this.state.workout == "") &&
                          <FormGroup>   
                              <Label className="padding">1.12 Did you measure your heart rate recovery (HRR) after today’s aerobic workout (touch the
                              information button for instructions about how to record this)?
                               <span id="hrr"
                             onClick={this.toggleHrr} 
                             style={{paddingLeft:"15px",color:"gray"}}>
                            
                             <FontAwesome 
                                          style={{color:"#5E5E5E"}}
                                          name = "info-circle"
                                          size = "1x"                                      
                                        
                              />
                            
                              </span>
                              </Label>
                              {this.state.editable &&
                                <div className="input">
                                     <Label check className="btn btn-secondary radio1">
                                        <Input type="radio" name="measured_hr" 
                                        value="yes"
                                        checked={this.state.measured_hr === 'yes'}
                                        onChange={this.handleChangeHrr}/>{' '}
                                        Yes
                                     </Label>
                                     <Label check className="btn btn-secondary radio1">
                                       <Input type="radio" name="measured_hr" 
                                            value="no"
                                            checked={this.state.measured_hr === 'no'}
                                            onChange={this.handleChangeHrr}/>{' '}
                                          No
                                    </Label>
                                </div>  
                              }
                              {
                                !this.state.editable &&
                                <div className="input">
                                  <p>{this.state.measured_hr}</p>
                                </div>
                              }
                               <FormGroup id="padd"> 
                            {this.renderHrr()}
                            </FormGroup>
                          </FormGroup>
                        }

                         <Modal 
                            className="pop"
                            id="popover" 
                            placement="right" 
                            isOpen={this.state.hrrInfo}
                            target="hrr" 
                            toggle={this.toggleHrr}>
                             <ModalHeader >
                            <span >
                           <a href="#" target="_blank" style={{fontSize:"15px",color:"black"}}> <i className="fa fa-share-square" aria-hidden="true">Share</i></a>
                           </span>
                           <span >
                            <a href="#" onClick={this.infoPrint} style={{paddingLeft:"35px",fontSize:"15px",color:"black"}}><i className="fa fa-print" aria-hidden="true">Print</i></a>
                            </span>
                            </ModalHeader>
                              <ModalBody className="modalcontent" id="modal1">
                               <div>
                                HRR: Heart Rate Recovery Tracking after an aerobic workout (you do not need to do HRR after strength,
                                a swim, or other non-aerobic exercise). We find that heart recovery is one of the truest indications
                                of one's fitness level. As a result, we encourage all of our users to track their heart rate recovery.
                                To do this, as soon as you finish your workout, stop your watch or wearable device, save the workout file,
                                and then immediately start a new workout file and stand still for 1 minute (we encourage you to put your
                                hands on your knees during first minute to try to get your heart rate to go down as quickly as possible).
                                If your heart rate is close to getting below 99, you may want to stand still until it gets below 99. If you
                                get stiff and/or have cramps/spasms, move/walk around easily. Don't obsess/be anxious about your HR going
                                down (if you do this, it won't recovery as quickly). Let your HRR file run EITHER (1) for one minute if your
                                heart rate gets to 99 or lower in the first minute OR (2) to whenever your heart rate level gets to 99. SO,
                                YOU WILL ALWAYS RUN YOUR HRR FILE FOR AT LEAST ONE MINUTE. Watches/Wearable devices often spin for 5-10 seconds
                                between finishing a workout and starting a new workout file, so do your best to start your HRR file as quickly
                                as possible.
                                 </div>

                               <div style={{paddingTop:"15px"}}>
                              WHY DO WE LOOK AT HRR? We are looking to see how quickly your heart rate recovers after aerobic exercise.
                              When you have completed your heart rate recovery, stop your watch/wearable device and post the file and go
                              in and rename it "HRR" and select “Other” as the workout type. We are trying to analyze 2 things: (1) How
                              many beats your heart recovers in the first minute (cardiologists look at this to assess heart health),
                              and (2) how long your heart rate takes to get to 99 (below 100). Based on your HRR results, we can make
                              exercise recommendations to help you achieve your goals.
                               </div>                             
                              </ModalBody>
                           </Modal>       

                         { (this.state.workout == "yes" || this.state.workout == "") &&
                            this.state.workout_type !== "strength" &&
                            this.state.workout_input_type !== "strength" &&
                        <FormGroup>
                          {this.state.editable &&
                          <div className="input1">
                          <Input
                          type="checkbox"
                          checked = {this.state.calories_item_check}
                          onClick={this.handleCaloriesItemCheck}
                          >
                          </Input>
                          <Label className="LAbel">I did a long workout and want to enter what I ate/calories consumed</Label>
                          </div>
                          }
                         
                          {!this.state.editable &&
                            <div>
                              <Label className="LAbel">I did a long workout and want to enter what I ate/calories consumed</Label>
                              <div className="input">
                                <p >{ this.state.calories_item_check?"yes":"no"}</p>
                              </div>
                            </div>
                          }                    
                        </FormGroup>
                       }

                        <Collapse isOpen={this.state.calories_item_check}>
                          { (this.state.workout == "yes" || this.state.workout == "") &&
                            this.state.workout_type !== "strength" &&
                            this.state.workout_input_type !== "strength" &&
                            
                          <FormGroup>      
                            <Label className="padding">1.13 Approximately How Many Calories Did You Consume During Your Workout?</Label>
                            {this.state.editable &&
                              <div className="input1">
                                 <Input type="text" name="calories" 
                                 value={this.state.calories}
                                 onChange={this.handleChange}/>
                              </div>
                            }
                            {
                              !this.state.editable && 
                              <div className="input">
                                <p>{this.state.calories ? this.state.calories : "Not Entered"}</p>
                              </div>
                            }
                          </FormGroup>
                        }
                                                
                          { (this.state.workout == "yes" || this.state.workout == "") &&
                            this.state.workout_type !== "strength" &&
                            this.state.workout_input_type !== "strength" &&
                          <FormGroup>      
                            <Label className="padding">1.14 What Specifically Did You Consume During Your Workout?</Label>
                            {this.state.editable &&
                              <div className="input1">
                                 <Textarea  name="calories_item"
                                  rows="5" cols="5" 
                                  className="form-control" 
                                 value={this.state.calories_item}
                                 onChange={this.handleChange}></Textarea>
                              </div>
                            }
                            {
                              !this.state.editable &&
                              <div className="input">
                                <p >{this.state.calories_item ? this.state.calories_item: "Not Entered"}</p>
                              </div>
                            }
                          </FormGroup>
                            }
                             </Collapse>

                      </div>
                     
                            <div id="sleep">
                            <h3><strong>Sleep Input</strong></h3>
                         
                          
                            <FormGroup>
                          
                            <Label className="padding">2. How Much Time Did You Sleep Last Night (Excluding Awake Time)?</Label>
                            {this.state.editable &&
                              <div>
                                <div className="col-xs-6">
                                  <div className="input"> 
                                <Input type="select" name="sleep_hours_last_night"
                                id="hours"
                                className="form-control custom-select"
                                value={this.state.sleep_hours_last_night}
                                onChange={this.handleChange}>
                                 <option key="hours" value="">Hours</option>
                                {this.createSleepDropdown(0,24)}                        
                                </Input>
                                </div>
                                </div>
                              
                                <div className="col-xs-6 justify-content-right">
                               <div className="input">
                                <Input type="select" name="sleep_mins_last_night"
                                 id="minutes"
                                className="form-control custom-select "
                                value={this.state.sleep_mins_last_night}
                                onChange={this.handleChange}>
                                 <option key="mins" value="">Minutes</option>
                                {this.createSleepDropdown(0,59,true)}                        
                                </Input>                        
                                </div>
                                </div>
                              </div>
                            }
                            {
                              !this.state.editable &&
                              <div className="input">
                              {(this.state.sleep_hours_last_night && this.state.sleep_mins_last_night) &&
                                <p>{this.state.sleep_hours_last_night} hours {this.state.sleep_mins_last_night} minutes</p>
                              }
                              </div>
                            }                          
                          </FormGroup>
                          <Label className="padding" >* If your sleep above is incorrect, please fix it by updating hours and minutes above or by updating "Time Fell Asleep" and "Time Woke Up" below. </Label>
                           <FormGroup>
                          
                            <Label className="padding">2.1 Time Fell Asleep As Per Wearable.</Label>
                            {this.state.editable &&
                              <div className="input1">
                                <DatePicker
                                    id="datepicker"
                                    name = "sleep_bedtime"
                                    selected={this.state.sleep_bedtime}
                                    onChange={this.handleChangeSleepBedTime}
                                    showTimeSelect
                                    excludeTimes={[moment().hours(17).minutes(0), moment().hours(18).minutes(0), moment().hours(19).minutes(0)], moment().hours(17).minutes(0)}
                                    timeIntervals={1}
                                    dateFormat="LLL"
                                    isClearable={true}
                                    shouldCloseOnSelect={false}
                                />
                              </div>
                            }
                            {
                              !this.state.editable &&
                              <div className="input">
                                <p>
                                  {
                                    this.state.sleep_bedtime != null?
                                    this.state.sleep_bedtime.format('MMMM Do YYYY, h:mm a'): ''
                                  }
                                </p>
                              </div>
                            }                          
                          </FormGroup>
                           <FormGroup>
                          
                            <Label className="padding">2.2 Time Woke Up As Per Wearable.</Label>
                            {this.state.editable &&
                              <div className="input1">
                                <DatePicker
                                    id="datepicker"
                                    name = "sleep_awake_time"
                                    selected={this.state.sleep_awake_time}
                                    onChange={this.handleChangeSleepAwakeTime}
                                    showTimeSelect
                                     excludeTimes={[moment().hours(17).minutes(0), moment().hours(18).minutes(0), moment().hours(19).minutes(0)], moment().hours(17).minutes(0)}
                                    timeIntervals={1}
                                    dateFormat="LLL"
                                    isClearable={true}
                                    shouldCloseOnSelect={false}
                                />
                              </div>
                            }
                            {
                              !this.state.editable &&
                              <div className="input">
                                <p >
                                  {
                                    this.state.sleep_awake_time != null?
                                    this.state.sleep_awake_time.format('MMMM Do YYYY, h:mm a'): ''
                                  }
                                </p>
                              </div>
                            }                          
                          </FormGroup>
                           <FormGroup>
                          
                            <Label className="padding">2.3 Total Time Awake While Trying To Sleep As Per Wearable Device</Label>
                            {this.state.editable &&
                              <div>
                                <div className="col-xs-6">
                                  <div className="input"> 
                                <Input type="select" name="awake_hours"
                                id="hours"
                                className="form-control custom-select"
                                value={this.state.awake_hours}
                                onChange={this.handleChangeSleepLast}>
                                 <option key="hours" value="">Hours</option>
                                {this.createSleepDropdown(0,24)}                        
                                </Input>
                                </div>
                                </div>
                              
                                <div className="col-xs-6 justify-content-right">
                               <div className="input">
                                <Input type="select" name="awake_mins"
                                 id="minutes"
                                className="form-control custom-select"
                                value={this.state.awake_mins}
                                onChange={this.handleChangeSleepLast}>
                                 <option key="mins" value="">Minutes</option>
                                {this.createSleepDropdown(0,59,true)}                        
                                </Input>                        
                                </div>
                                </div>
                              </div>
                            }
                            {
                              !this.state.editable &&
                              <div className="input">
                              {(this.state.awake_hours && this.state.awake_mins) &&
                                <p>{this.state.awake_hours} hours {this.state.awake_mins} minutes</p>
                              }
                              </div>
                            }                          
                          </FormGroup>
                         

                          <FormGroup>      
                            <Label className="padding">3 Sleep Comments</Label>
                              {this.state.editable &&
                                <div className="input1">
                                     <Textarea name="sleep_comment" 
                                     placeholder="please leave a comment" 
                                     className="form-control"
                                     rows="5" cols="5" 
                                     value={this.state.sleep_comment}
                                     onChange={this.handleChange}></Textarea>
                                </div>
                              }
                              {
                                !this.state.editable &&
                                <div className="input">
                                  <p>{this.state.sleep_comment}</p>
                                </div>
                              }
                          </FormGroup>

                           <FormGroup>
                             <Label className="padding">4. Did You Take Any Prescription or Non Prescription Sleep Aids Last Night?</Label>
                              {this.state.editable &&
                                <div className="input1">
                                
                                     <Label check className="btn btn-secondary radio1">
                                      <Input type="radio" name="prescription_sleep_aids" 
                                      value="yes"
                                      checked={this.state.prescription_sleep_aids === 'yes'}
                                      onChange={this.handleChangeSleepAids}/>{' '}
                                      Yes
                                   </Label>
                                   <Label check className="btn btn-secondary radio1">
                                     <Input type="radio" name="prescription_sleep_aids" 
                                          value="no"
                                          checked={this.state.prescription_sleep_aids === 'no'}
                                          onChange={this.handleChangeSleepAids}/>{' '}
                                        No
                                  </Label>
                                </div>
                              }
                              {
                                !this.state.editable &&
                                <div className="input">
                                  <p>{this.state.prescription_sleep_aids}</p>
                                </div>
                              }
                              <FormGroup id="padd"> 
                              {this.renderPrescriptionSleepAids()}
                              </FormGroup>
                          </FormGroup>
                          </div>
                        
                        <div id="food">
                        <h3><strong>Nutrition and Lifestyle Inputs</strong></h3>
                        
                          <FormGroup className="food">
                            
                            <Label className="padding">5. What % of The Food You Consumed Yesterday Was &nbsp; 
                             <span style={{fontWeight:"bold"}}>
                              <span style={{textDecoration:"underline"}}>Un</span>processed?
                             </span>
                              <span id="unprocessedinfo"
                             onClick={this.toggleUnprocessedInfo} 
                             style={{paddingLeft:"15px",color:"gray"}}>
                           
                             <FontAwesome 
                                          style={{color:"#5E5E5E"}}
                                          name = "info-circle"
                                          size = "1x"                                      
                                        
                              />
                        
                              </span>
                             </Label>
                              {this.state.editable &&
                                <div className="input1">
                                  <Input
                                  type="select" 
                                  className="form-control custom-select" 
                                  name="prcnt_processed_food"                            
                                  value={this.state.prcnt_processed_food}
                                  onChange={this.handleChangeProcessedFood}>
                                  <option key="select" value="">select</option>
                                  {this.createDropdown(0,100,5)}
                                  </Input>
                                </div>
                              }
                              {
                                !this.state.editable && 
                                <div className="input">
                                  <p>{this.state.prcnt_processed_food}</p>
                                </div>
                              }
                            <FormGroup id="padd"> 
                            {this.renderProcessedFoodModal()}
                            </FormGroup>
                          </FormGroup>
                           <Modal
                           id="popover" 
                           className="pop"
                            placement="right" 
                            isOpen={this.state.unprocessedInfo}
                            target="unprocessedinfo" 
                            toggle={this.toggleUnprocessedInfo}>
                             <ModalHeader >
                            <span >
                           <a href="#" target="_blank" style={{fontSize:"15px",color:"black"}}> <i className="fa fa-share-square" aria-hidden="true">Share</i></a>
                           </span>
                           <span >
                            <a href="#" onClick={this.infoPrint} style={{paddingLeft:"35px",fontSize:"15px",color:"black"}}><i className="fa fa-print" aria-hidden="true">Print</i></a>
                            </span>
                            </ModalHeader>
                              <ModalBody className="modalcontent" id="modal1">
                               <div>
                               We encourage people to eat as much unprocessed food as possible and if you
                               do eat processed foods, try and have the higher quality processed foods that
                               are free from high fructose corn syrup, hydrogenated oils, and/or other highly
                               processed and unhealthy ingredients. Our hope is that you will make healthier
                               food choices because you are reporting your daily unprocessed food consumed.
                                 </div>

                               <div style={{paddingTop:"15px"}}>
                                   We ask you to provide the % of unprocessed food you consumed yesterday. A few comments:
                               </div>

                               <div style={{paddingTop:"15px"}}>
                                   1.We ask for yesterday so we have 24 hours of reporting 
                               </div>

                                <div style={{paddingTop:"15px"}}>
                                    2.You determine what % of unprocessed food based on the quantity of
                                    food you consumed yesterday. There are many ways to determine the
                                    unprocessed %. (1) If you had 3 meals yesterday and one was highly
                                    processed and the other 2 meals had little to no unprocessed food,
                                    you may choose 65-70% as your processed count (as approximately 1/3
                                    of what you ate was processed); (2) Determine approximately how many
                                    calories you consumed for the day (ballpark estimate) and take the
                                    processed calories over the total calories. So, if you ate approximately
                                    2,000 calories yesterday and had a 200 calorie candy bar, then your processed
                                    portion would be 10% (200/2000), so your unprocessed portion was 90%
                                 </div>

                               <div style={{paddingTop:"15px"}}>
                                   Processed foods include (but are not limited to):
                               </div>

                               <div style={{paddingTop:"15px"}}>
                                1. 1. Dairy (cheese, milk, yogurt, other refined milk products).
                                      If you consumed any of these dairy products that you
                                     (1) directly obtained from an animal at a local farm or
                                     (2) obtained directly from a local farm that you know has
                                     not been processed in any way (I.e., it has not been processed
                                     at all, including no preservatives added), consider this Unprocessed
                               </div>

                                <div style={{paddingTop:"15px"}}>
                                  2. Processed meats (particularly cold cut meats that have added salts
                                   and preservatives that keep the meat from spoiling),
                                 </div>

                               <div style={{paddingTop:"15px"}}>
                                   3. Bread
                               </div>

                               <div style={{paddingTop:"15px"}}>
                                  4. Pasta (including gluten free pasta)
                               </div>
                               <div style={{paddingTop:"15px"}}>
                                    5. White rice (although wild rice and brown rice is not as processed, read the                                     
                                     ingredients and determine how processed you think the product is.  If you eat
                                     brown rice at a restaurant and they added sugar and gluten to your rice, then
                                     it is more processed than if they simply steamed your brown rice with no additives or preservatives)
                                 </div>  

                               <div style={{paddingTop:"15px"}}>
                                  6. Lower quality oils are often highly processed and may become carcinogenic when heated up
                                   (e.g., olive oil, coconut oil, avocado oils, corn oils, soybean oils, etc). “If you consume lower quality,
                                    more highly processed oil, either raw or heated up, you may want to consider it processed
                               </div>

                               <div style={{paddingTop:"15px"}}>
                                  7. Refined flours, 
                               </div>
                               <div style={{paddingTop:"15px"}}>
                               8. Sodas (diet or regular), 
                                 </div>

                               <div style={{paddingTop:"15px"}}>
                                   9. High fructose corn syrup, 
                               </div>

                               <div style={{paddingTop:"15px"}}>
                                  10. Hydrogenated oils, 
                               </div>
                               <div style={{paddingTop:"15px"}}>
                              11. Chips/popcorn with oil/sugars, preservatives
                                 </div>

                               <div style={{paddingTop:"15px"}}>
                                   12. Any refined foods,
                               </div>

                               <div style={{paddingTop:"15px"}}>
                              13. Any food/snacks with refined/added sugars.  
                               </div>

                                <div style={{paddingTop:"15px"}}>
                                  14.   Anything where additives have been added to preserve the food from spoiling.  
                               </div>
                               <div style={{paddingTop:"15px"}}>
                                Eating organic is always a good idea (although we would rather have you eat a non-organic
                                fruit or vegetable vs eating anything refined).
                                 </div>

                               <div style={{paddingTop:"15px"}}>
                                   Anything that can sit on your kitchen counter or in shelves without spoiling for long
                                    periods of time is processed.   If you are looking to improve your health, shoot to eat
                                    as many unprocessed foods as possible, not eating under a label (e.g., vegan, paleo,
                                    high carb, low carb, gluten free, etc.).  We see tons of unhealthy paleos, gluten free
                                    people, and vegans that eat a majority of refined foods.      If there is only one thing
                                    you change, try to minimize eating processed foods.     Read the ingredients of what you 
                                    eat (or ask if you eat out).  The less ingredients the better. Ingredients are listed in
                                    descending order of what is included in the food.   So if sugar is one of the first 3
                                    ingredients, you know there is a lot of sugar and you should avoid the food in most instances.

                               </div>                      
                              </ModalBody>
                           </Modal>       

                          <FormGroup>
                               <Label className="padding">6. Number of Alcohol Drinks Consumed Yesterday?
                                <span id="alcoholinfo"
                                   onClick={this.toggleAlcohol} 
                                   style={{paddingLeft:"15px",color:"gray"}}>
                                 
                                   <FontAwesome 
                                                style={{color:"#5E5E5E"}}
                                                name = "info-circle"
                                                size = "1x"                                      
                                              
                              />
                        
                              </span>
                               </Label>
                                {this.state.editable &&
                                  <div className="input1">
                                       <Input 
                                       type="select" 
                                       className="custom-select form-control" 
                                       name="alchol_consumed"
                                       value={this.state.alchol_consumed}
                                       onChange={this.handleChangeAlcoholDrink}>
                                          <option value="">select</option>
                                         {this.createDropdown(0,20,0.5)}
                                          <option value="20+">More Than 20</option>
                                        </Input>
                                    </div>
                                  }
                                  {
                                    !this.state.editable &&
                                    <div className="input">
                                      <p>{this.state.alchol_consumed === '20+'?"More than 20" :
                                          this.state.alchol_consumed }</p>
                                    </div>
                                  }
                                  <FormGroup id="padd"> 
                                    {this.renderAlcoholModal()}
                                  </FormGroup>
                          </FormGroup>
                          <Modal
                           id="popover" 
                           className="pop"
                            placement="right" 
                            isOpen={this.state.alcoholInfo}
                            target="alcoholinfo" 
                            toggle={this.toggleAlcohol}>
                             <ModalHeader >
                            <span >
                           <a href="#" target="_blank" style={{fontSize:"15px",color:"black"}}> <i className="fa fa-share-square" aria-hidden="true">Share</i></a>
                           </span>
                           <span >
                            <a href="#" onClick={this.infoPrint} style={{paddingLeft:"35px",fontSize:"15px",color:"black"}}><i className="fa fa-print" aria-hidden="true">Print</i></a>
                            </span>
                            </ModalHeader>
                              <ModalBody className="modalcontent" id="modal1">
                               <div>
                                 Report how many drinks of alcohol you consumed YESTERDAY.
                                 In order to determine how many drinks you consumed, use the
                                 following guidelines:
                               </div>

                               <div style={{paddingTop:"15px"}}>
                                  In the Unites States, a standard drink is equal to 14.0 grams (0.6 ounces) of pure alcohol.
                                  Generally, this amount of pure alcohol is found in:  
                               </div>

                               <div style={{paddingTop:"15px"}}>
                                   (1) 12 ounces of beer (5% alcohol content);
                               </div>

                                <div style={{paddingTop:"15px"}}>
                                    (2) 8 ounces of malt liquor (7% alcohol content); 
                                 </div>

                               <div style={{paddingTop:"15px"}}>
                                   (3) 5 ounces of wine (12% alcohol content); 
                               </div>

                               <div style={{paddingTop:"15px"}}>
                               (4) 1.5 ounces or a “shot” of 80-proof (40% alcohol content) distilled
                                spirits or liquor (e.g., gin, rum, vodka, whiskey)"
                               </div>                                                                        
                              </ModalBody>
                           </Modal>       

                                            
                          <FormGroup>
                            <Label className="padding">7. Did You Smoke Any Substances Yesterday?</Label>
                            {this.state.editable &&
                              <div className="input1">
                                  
                                   <Label check className="btn btn-secondary radio1">
                                      <Input type="radio" name="smoke_substances" 
                                      value="yes"
                                      checked={this.state.smoke_substances === 'yes'}
                                      onChange={this.handleChangeSmokeSubstance}/>{' '}
                                      Yes
                                   </Label>
                                   <Label check className="btn btn-secondary radio1">
                                     <Input type="radio" name="smoke_substances" 
                                          value="no"
                                          checked={this.state.smoke_substances === 'no'}
                                          onChange={this.handleChangeSmokeSubstance}/>{' '}
                                        No
                                  </Label>
                              </div>
                            }
                            {
                              !this.state.editable &&
                              <div className="input">
                                <p>{this.state.smoke_substances}</p>
                              </div>
                            }

                            <FormGroup id="padd"> 
                            {this.renderSmokeSubstance()}   
                            </FormGroup>    
                          </FormGroup>

                           <FormGroup>
                              <Label className="padding">8. Did You Take Any Prescription or Non Prescription Medications or Supplements Yesterday?</Label>
                                {this.state.editable &&
                                  <div className="input1">
                                   
                                     <Label check className="btn btn-secondary radio1">
                                      <Input type="radio" name="medications" 
                                      value="yes"
                                      checked={this.state.medications === 'yes'}
                                      onChange={this.handleChangePrescription}/>{' '}
                                      Yes
                                   </Label>
                                   <Label check className="btn btn-secondary radio1">
                                     <Input type="radio" name="medications" 
                                          value="no"
                                          checked={this.state.medications === 'no'}
                                          onChange={this.handleChangePrescription}/>{' '}
                                        No
                                  </Label>
                                  </div>
                                }
                                {
                                  !this.state.editable &&
                                  <div className="input">
                                    <p>{this.state.medications}</p>
                                  </div>
                                }
                              <FormGroup id="padd"> 
                              {this.renderPrescriptionMedication()}
                              </FormGroup>
                          </FormGroup>
                         

                          </div>

                          <div id="stress">
                           <h3><strong>Stress/Illness Inputs</strong></h3>
                          <FormGroup>
                            <Label className="padding">9. Yesterday's Stress Level</Label>
                              {this.state.editable &&
                                <div className="input1">
                                 <Label check className="btn btn-secondary radio1">
                                    <Input type="radio" name="stress" 
                                    value="low"
                                    checked={this.state.stress === 'low'}
                                    onChange={this.handleChange}/>{' '}
                                    Low
                                 </Label>
                                 <Label check className="btn btn-secondary radio1">
                                   <Input type="radio" name="stress" 
                                        value="medium"
                                        checked={this.state.stress === 'medium'}
                                        onChange={this.handleChange}/>{' '}
                                      Medium
                                </Label>
                                 <Label check className="btn btn-secondary radio1">
                                   <Input type="radio" name="stress" 
                                        value="high"
                                        checked={this.state.stress === 'high'}
                                        onChange={this.handleChange}/>{' '}
                                      High
                                </Label>
                                </div>
                              }
                              {
                                !this.state.editable &&
                                <div className="input">
                                  <p>{this.state.stress}</p>
                                </div>
                              }
                          </FormGroup>

                          <FormGroup>
                            <Label className="padding">10. Are You Sick Today?</Label>
                            {this.state.editable &&
                              <div className="input1">
                               
                                  <Label check className="btn btn-secondary radio1">
                                    <Input type="radio" name="sick" 
                                    value="yes"
                                    checked={this.state.sick === 'yes'}
                                    onChange={this.handleChangeSick}/>{' '}
                                    Yes
                                 </Label>
                                 <Label check className="btn btn-secondary radio1">
                                   <Input type="radio" name="sick" 
                                        value="no"
                                        checked={this.state.sick === 'no'}
                                        onChange={this.handleChangeSick}/>{' '}
                                      No
                                </Label>
                              </div>
                            }
                            {
                              !this.state.editable &&
                              <div className="input">
                                <p>{this.state.sick}</p>
                              </div>
                            }

                            <FormGroup id="padd"> 
                            {this.renderPainSick()}
                            </FormGroup>
                          </FormGroup>

                          

                          </div>
                         
                         <div id="daily">
                          <h3><strong>Extra Inputs</strong></h3>
                          <FormGroup>
                            <Label className="padding">11. Weight (Pounds)</Label>
                            {this.state.editable &&
                              <div className="input1">
                                  <Input type="select" 
                                     className="custom-select form-control"
                                     name="weight"                                  
                                     value={this.state.weight}
                                     onChange={this.handleChange} >
                                      <option key = "" value="">select</option>
                                      <option key = "no-weigh" value="i do not weigh myself today">
                                        I did not weigh myself today
                                      </option> 
                                     {this.createDropdown(30,300)}
                                     </Input>
                              </div>
                            }
                            {
                              !this.state.editable &&
                              <div className="input">
                                <p>{this.state.weight}</p>
                              </div>
                            }
                          </FormGroup>

                          { this.state.gender === 'M' &&
                            <FormGroup>       
                              <Label className="padding">12. Waist Size (Male)</Label>
                              {this.state.editable &&
                                <div className="input1">
                                  <Input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Between 20 - 60"
                                    name="waist"                               
                                    value={this.state.waist}
                                    onChange={this.handleChange}>
                                  </Input>
                                </div>
                              }
                              {
                                !this.state.editable &&
                                <div className="input">
                                  <p>{this.state.waist}</p>
                                </div>
                              }
                            </FormGroup>
                          }

                          { this.state.gender === 'F' &&
                            <FormGroup>
                              <Label className="padding">12. Clothes Size (Womens)</Label>
                              {this.state.editable &&
                                <div className="input1">
                                  <Input 
                                    type="text" 
                                    className="form-control"
                                    placeholder="Between 0 - 16" 
                                    name="clothes_size"                                
                                    value={this.state.clothes_size}
                                    onChange={this.handleChange}>
                                  </Input>
                                </div>
                              }
                              {
                                !this.state.editable &&
                                <div className="input">
                                  <p>{this.state.clothes_size}</p>
                                </div>
                              }
                            </FormGroup>
                          }

                          <FormGroup>
                              <Label className="padding">13. What Type Of Diet Do You Eat?</Label>

                                  {this.state.editable &&
                                    <div className="input1">
                                        <Input 
                                        type="select" 
                                        className="custom-select form-control" 
                                        name="diet_type"
                                        value={this.state.diet_to_show}
                                        onChange={this.handleChangeDietModel}>
                                                <option value="">I do not follow any specific diet</option>
                                                <option value="other">Other</option>
                                                <option value="high carb">High Carb</option> 
                                                <option value="ketogenic diet">Ketogenic Diet</option>
                                                <option value="low carb/high fat">Low carb/High fat</option>
                                                <option value="paleo">Paleo</option>                                              
                                                <option value="vegan">Vegan</option>
                                                <option value="vegetarian">Vegetarian</option>
                                                <option value="whole foods/mostly unprocessed">Whole Foods/Mostly Unprocessed</option>
                                                <option value="pescetarian">Pescetarian</option>                                                                                                                                                                            
                                      </Input>
                                    </div>
                                  }
                                  {
                                    !this.state.editable &&
                                    <div className="input">
                                      <p>{this.state.diet_to_show === "" ? 'I do not follow any specific diet' : this.state.diet_to_show}</p>
                                    </div>
                                  }
                              <FormGroup id="padd"> 
                               {this.renderDietType()}
                               </FormGroup>
                          </FormGroup>
                        

                           <FormGroup>     
                            <Label className="padding">14. Did You Stand For 3 Hours or More Yesterday? </Label>

                              {this.state.editable &&
                                <div className="input1">
                                  
                                    <Label check className="btn btn-secondary radio1">
                                      <Input type="radio" name="stand" 
                                      value="yes"
                                      checked={this.state.stand === 'yes'}
                                      onChange={this.handleChange}/>{' '}
                                      Yes
                                   </Label>
                                   <Label check className="btn btn-secondary radio1">
                                     <Input type="radio" name="stand" 
                                          value="no"
                                          checked={this.state.stand === 'no'}
                                          onChange={this.handleChange}/>{' '}
                                        No
                                  </Label>
                                  </div>
                              }
                              {
                                !this.state.editable &&
                                <div className="input">
                                  <p>{this.state.stand}</p>
                                </div>
                              }
                          </FormGroup>

                           <FormGroup>      
                            <Label className="padding">15. General Comments</Label>
                              {this.state.editable &&
                                <div className="input1">
                                     <Textarea  name="general_comment" 
                                     placeholder="please leave a comment" 
                                     className="form-control"
                                     rows="5" cols="5" 
                                     value={this.state.general_comment}
                                     onChange={this.handleChange}></Textarea>
                                </div>
                              }
                              {
                                !this.state.editable &&
                                <div className="input">
                                  <p>{this.state.general_comment}</p>
                                </div>
                              }
                          </FormGroup>
                          </div>

                          { (!this.state.update_form && this.state.editable) &&
                            <Button
                            style={{borderRadius:"8px"}}
                              id="btn1" 
                              type="submit"
                              color="info" 
                              className="btn btn-block btn-primary">
                                Submit
                            </Button>
                          }

                          {(this.state.update_form && this.state.editable) &&
                            <Button 
                             style={{borderRadius:"8px"}}
                              id="btn1"
                              className="btn btn-block btn-primary"
                              onClick={this.onUpdate}>
                                Update
                            </Button>
                          }

                          <div id="btn-update"></div>

                           <ToastContainer 
                                position="top-center"
                                type="success"
                                autoClose={5000}
                                hideProgressBar={true}
                                newestOnTop={false}
                                closeOnClick
                                className="toast-popup"
                              />
                    </Form>
                    </div>
                    </div>
                
                </Container>
                {this.renderCloneOverlay()}
                {this.renderFetchOverlay()}
                {this.renderUpdateOverlay()}
                {this.renderSubmitOverlay()}
            </div>
        );
    }
}

function mapStateToProps(state){
  return {
    errorMessage: state.garmin_auth.error,
    message : state.garmin_auth.message
  };
}

export default connect(mapStateToProps,{getGarminToken,logoutUser})(withRouter(UserInputs));

Navbar.propTypes={
    fixed: PropTypes.string,
    color: PropTypes.string,
}