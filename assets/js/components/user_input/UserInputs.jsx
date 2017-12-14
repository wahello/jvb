import React from 'react';
import ReactDOM from 'react-dom';
import NavbarMenu from '../navbar';

import { withRouter, Link } from 'react-router-dom';
import {connect} from 'react-redux';

import PropTypes from 'prop-types';

import { getGarminToken,logoutUser} from '../../network/auth';

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

import {userDailyInputSend,userDailyInputFetch,
        userDailyInputUpdate} from '../../network/userInput';
import {getUserProfile} from '../../network/auth';

class UserInputs extends React.Component{

    getInitialState(){
      const initialState = {
        selected_date:new Date(),
        fetched_user_input_created_at:'',
        update_form:false,
        editable:true,
        isOpen: false,
        isOpen1:false,
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
      this.toggle1 = this.toggle1.bind(this);

      this.handleLogout = this.handleLogout.bind(this);
      this.onLogoutSuccess = this.onLogoutSuccess.bind(this);
    }
    
    onFetchSuccess(data,clone_form=undefined){
      const DIET_TYPE = ['','vegan','vegetarian','paleo','low carb/high fat',
                        'high carb','ketogenic diet','whole foods/mostly unprocessed'];
      const WEATHER_FIELDS = ['indoor_temperature','outdoor_temperature','temperature_feels_like',
                              'wind','dewpoint','humidity','weather_comment'];
      let other_diet = true;
      let was_cloning = this.state.cloning_data;
      let has_weather_data = false;
      let has_calories_data = false;

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

        workout:data.data.strong_input.workout,
        workout_type:data.data.strong_input.workout_type,
        workout_input_type: data.data.strong_input.workout_input_type,
        workout_easy:data.data.strong_input.work_out_easy_or_hard,
        workout_enjoyable:data.data.optional_input.workout_enjoyable,
        workout_effort:data.data.strong_input.workout_effort_level,
        workout_effort_hard_portion:data.data.strong_input.hard_portion_workout_effort_level,
        pain:data.data.encouraged_input.pains_twings_during_or_after_your_workout,
        pain_area:data.data.encouraged_input.pain_area,
        water_consumed:data.data.encouraged_input.water_consumed_during_workout,
        chia_seeds:data.data.optional_input.chia_seeds_consumed_during_workout,
        breath_nose:data.data.encouraged_input.workout_that_user_breathed_through_nose,
        prcnt_processed_food:data.data.strong_input.prcnt_unprocessed_food_consumed_yesterday,
        unprocessed_food_list:data.data.strong_input.list_of_unprocessed_food_consumed_yesterday,
        processed_food_list:data.data.strong_input.list_of_processed_food_consumed_yesterday,
        alchol_consumed:data.data.strong_input.number_of_alcohol_consumed_yesterday,
        alcohol_drink_consumed_list:data.data.strong_input.alcohol_drink_consumed_list,
        stress:data.data.encouraged_input.stress_level_yesterday,
        sick:data.data.optional_input.sick,
        sickness:data.data.optional_input.sickness,
        fasted:data.data.optional_input.fasted_during_workout,
        food_ate_before_workout:data.data.optional_input.food_ate_before_workout,
        workout_comment:data.data.optional_input.general_Workout_Comments,
        calories:data.data.optional_input.calories_consumed_during_workout,
        calories_item:data.data.optional_input.food_ate_during_workout,

        indoor_temperature:data.data.strong_input.indoor_temperature,
        outdoor_temperature:data.data.strong_input.outdoor_temperature,
        temperature_feels_like:data.data.strong_input.temperature_feels_like,
        wind:data.data.strong_input.wind,
        dewpoint:data.data.strong_input.dewpoint,
        humidity:data.data.strong_input.humidity,
        weather_comment:data.data.strong_input.weather_comment,

        sleep_hours_last_night:data.data.strong_input.sleep_time_excluding_awake_time.split(':')[0],
        sleep_mins_last_night:data.data.strong_input.sleep_time_excluding_awake_time.split(':')[1],
        sleep_bedtime:moment(data.data.strong_input.sleep_bedtime),
        sleep_awake_time:moment(data.data.strong_input.sleep_awake_time),
        awake_hours:data.data.strong_input.awake_time.split(':')[0],
        awake_mins:data.data.strong_input.awake_time.split(':')[1],
        sleep_comment:data.data.strong_input.sleep_comment,
        prescription_sleep_aids:data.data.strong_input.prescription_or_non_prescription_sleep_aids_last_night,
        sleep_aid_taken:data.data.strong_input.sleep_aid_taken,
        smoke_substances:data.data.strong_input.smoke_any_substances_whatsoever,
        smoked_substance_list:data.data.strong_input.smoked_substance,
        medications:data.data.strong_input.prescription_or_non_prescription_medication_yesterday,
        medications_taken_list:data.data.strong_input.prescription_or_non_prescription_medication_taken,
        controlled_uncontrolled_substance:data.data.strong_input.controlled_uncontrolled_substance,
        stand:data.data.optional_input.stand_for_three_hours,
        food_consumed:data.data.optional_input.list_of_processed_food_consumed_yesterday,
        weight:data.data.optional_input.weight,
        waist:data.data.optional_input.waist_size,
        clothes_size:data.data.optional_input.clothes_size,
        heart_variability:data.data.optional_input.heart_rate_variability,
        breath_sleep:data.data.optional_input.percent_breath_nose_last_night,
        breath_day:data.data.optional_input.percent_breath_nose_all_day_not_exercising,
        diet_type:data.data.optional_input.type_of_diet_eaten,
        general_comment:data.data.optional_input.general_comment
      });
      window.scrollTo(0,0);
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

componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
}

handleScroll() {

  if (window.scrollY >= 300 && !this.state.scrollingLock) {
    this.setState({
      scrollingLock: true
    });
  } else if(window.scrollY < 300 && this.state.scrollingLock) {
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

   toggleEasyorHard(){
    this.setState({
      easyorhardInfo:!this.state.easyorhardInfo
    });
   }

  toggleEditForm(){
    this.setState({
      editable:!this.state.editable
    });
  }
   onLogoutSuccess(response){
    this.props.history.push("/#logout");
  }

  handleLogout(){
    this.props.logoutUser(this.onLogoutSuccess);
  }
    render(){
       const {fix} = this.props;

        return(
            <div>            
                           <div id="hambergar" className="container-fluid">
                             <Navbar toggleable 
                                 fixed={fix ? 'top' : ''} 
                                  className="navbar navbar-expand-sm navbar-inverse">
                                  <NavbarToggler className="navbar-toggler hidden-sm-up" onClick={this.toggle1} style={{paddingRight:"30px"}}>
                                   <FontAwesome 
                                         name = "bars"
                                         size = "1x"
                                                                  
                                     />
                                    
                                  </NavbarToggler>
                                  <Link to='/'>
                                    <NavbarBrand 
                                      className="navbar-brand float-xs-right float-sm-left" 
                                      id="navbarTogglerDemo">
                                      <img className="img-fluid"
                                       id="navbarbrand"
                                       src="//static1.squarespace.com/static/535dc0f7e4b0ab57db48c65c/t/5942be8b893fc0b88882a5fb/1504135828049/?format=1500w"/>
                                    </NavbarBrand>
                                  </Link>
                                  <span id="header">
                                  <h2 className="head">Daily User Inputs 
                                   <span id="infobutton"
                                     onClick={this.toggleInfo}>
                                     <a style={{color:"black" ,paddingLeft:"10px"}}> 
                                     <FontAwesome 
                                                  style={{color:"white",fontSize:"25px"}}
                                                  name = "info-circle"
                                                  size = "1x"                                      
                                                
                                      />
                                      </a>
                                  </span> 
                             
                             </h2>

                                  </span>
                                  <Collapse className="navbar-toggleable-xs" isOpen={this.state.isOpen1} navbar>
                                    <Nav className="nav navbar-nav float-xs-right ml-auto" navbar>
                                      <NavItem className="float-sm-right">  
                                        <Link id="logout" className="nav-link" to='/'>Home</Link>
                                      </NavItem>
                                       <NavItem className="float-sm-right">                
                                           <NavLink
                                           id="logout"  
                                           className="nav-link"                    
                                           onClick={this.handleLogout}>Log Out
                                            </NavLink>               
                                      </NavItem>  
                                    </Nav>
                                  </Collapse>

                                </Navbar>
                              </div>                                                        
                            <Popover
                            id="popover"
                            placement="bottom" 
                            isOpen={this.state.infoButton}
                            target="infobutton" 
                            toggle={this.toggleInfo}>
                              <PopoverBody>
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
                              </PopoverBody>
                           </Popover> 
                                  
                           
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
                                      {this.state.editable ? 'VIEW INPUTS' : 'EDIT FORM'}
                                   </Button>
                                   </span>
                               <Collapse className="navbar-toggleable-xs"  isOpen={this.state.isOpen} navbar>
                                  <Nav className="nav navbar-nav" navbar>
                                          <NavItem>
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

                                        <NavItem>
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

                                        <NavItem>
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

                                        <NavItem>
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

                                        <NavItem>
                                        <span id="spa">
                                          <abbr  id="abbri"  title="Extra Inputs">
                                            <NavLink id="navlink" href="#daily">
                                              <FontAwesome
                                                name = "plus-circle"
                                                size = "1x"
                                              />&nbsp; Extra 
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

                           <Popover 
                          id="popover"
                          className="pop" 
                            placement="bottom" 
                            isOpen={this.state.infoBtn}
                            target="info2" 
                            toggle={this.toggleInfo2}>
                              <PopoverBody>
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
                              </PopoverBody>
                           </Popover>                                                        
               
                <Container id="user-inputs">                          
                    <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-10 col-sm-12">
                        <Form 
                          onSubmit = {this.onSubmit}
                          className="user-inputs-form bootstrap_validator" 
                          role="form" 
                          data-toggle="validator">
                          {this.state.editable &&
                                 <div className="row justify-content-center"> 
                                   <span>
                                       <Button
                                            id="btn1"                                            
                                            size="sm"
                                            onClick={this.fetchYesterdayData}
                                            className="btn">
                                            COPY YESTERDAY'S INPUTS
                                          </Button>
                                   </span>
                                </div>
                          }

                          <div id="workout">
                          <h3><strong>Workout Inputs</strong></h3>

                           <FormGroup>   
                            <Label className="padding">1. Did You Workout Today?
                             <span id="workoutinfo"
                             onClick={this.toggleInfoworkout} 
                             style={{float:"right",paddingLeft:"15px",color:"gray"}}>
                             <FontAwesome 
                                          style={{color:"#5e5e5e"}}
                                          name = "info-circle"
                                          size = "1.5x"                                      
                                        
                              />
                              </span>
                            </Label>
                            {this.state.editable &&
                              <div className="input">                           
                              
                                  <Label className="btn radio1">
                                    <Input type="radio" 
                                    name="workout" 
                                    value="yes" 
                                    checked={this.state.workout === 'yes'}
                                    onChange={this.handleChangeWorkoutDone}/> Yes
                                  </Label>
                                  <Label className="btn radio1">
                                    <Input type="radio" name="workout" 
                                    value="no"
                                    checked={this.state.workout === 'no'}
                                    onChange={this.handleChangeWorkoutDone}/> No
                                  </Label>
                                  <Label className="btn radio1">
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

                            <Popover 
                            id="popover"
                            className="pop"
                            placement="right" 
                            isOpen={this.state.infoWorkout}
                            target="workoutinfo" 
                            toggle={this.toggleInfoworkout}>
                              <PopoverBody>
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
                              </PopoverBody>
                           </Popover>       
                          
                          {(this.state.workout === "yes" || this.state.workout === "") &&
                            <FormGroup>   
                            <Label className="padding">1.1 What Type of Workout Did You Do Today?

                             <span id="workouttypeinfo"
                             onClick={this.toggleInfoworkoutType} 
                             style={{paddingLeft:"15px",color:"gray"}}>
                            
                             <FontAwesome 
                                          style={{color:"#5e5e5e"}}
                                          name = "info-circle"
                                          size = "1x"                                      
                                        
                              />
                            
                              </span>
                            </Label>

                            {this.state.editable &&
                              <div className="input">                           
                              
                                  <Label className="btn  radio1">
                                    <Input type="radio" 
                                    name="workout_type" 
                                    value="cardio" 
                                    checked={this.state.workout_type === 'cardio'}
                                    onChange={this.handleChange}/> Cardio
                                  </Label>
                                  <Label className="btn  radio1">
                                    <Input type="radio" 
                                    name="workout_type" 
                                    value="strength"
                                    checked={this.state.workout_type === 'strength'}
                                    onChange={this.handleChange}/> Strength
                                  </Label>
                                  <Label className="btn  radio1">
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
                             <Popover 
                           id="popover" 
                            placement="right"
                            className="pop" 
                            isOpen={this.state.infoWorkoutType}
                            target="workouttypeinfo" 
                            toggle={this.toggleInfoworkoutType}>
                              <PopoverBody>
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
                              </PopoverBody>
                           </Popover>                         

                            {(this.state.workout == "yes" || this.state.workout == "") &&
                              <FormGroup>   
                                <Label className="padding">1.2 Was Your Workout Easy or Hard?
                                <span id="easyorhard"
                             onClick={this.toggleEasyorHard} 
                             style={{paddingLeft:"15px",color:"gray"}}>
                            
                             <FontAwesome 
                                          style={{color:"#5e5e5e"}}
                                          name = "info-circle"
                                          size = "1x"                                      
                                        
                              />
                          
                              </span>
                                </Label>
                                {this.state.editable && 
                                 

                                     <div className="input">
                                     <Label check className="btn  radio1">
                                        <Input type="radio" name="workout_easy" 
                                        value="easy"
                                        checked={this.state.workout_easy === 'easy'}
                                        onChange={this.handleChangeWorkout}/>{' '}
                                        Easy
                                     </Label>

                                     <Label check className="btn  radio1">
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

                           <Popover 
                          id="popover" 
                            placement="right"
                            className="pop" 
                            isOpen={this.state.easyorhardInfo}
                            target="easyorhard" 
                            toggle={this.toggleEasyorHard}>
                              <PopoverBody>
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
                              </PopoverBody>
                           </Popover> 


                        { (this.state.workout == "yes" || this.state.workout == "") &&
                          <FormGroup>   
                              <Label className="padding">1.3 Was Your Workout Today Enjoyable?</Label>
                              {this.state.editable &&
                                <div className="input">

                                     <Label check className="btn  radio1">
                                        <Input type="radio" name="workout_enjoyable" 
                                        value="yes"
                                        checked={this.state.workout_enjoyable === 'yes'}
                                        onChange={this.handleChange}/>{' '}
                                        Yes
                                     </Label>

                                     <Label check className="btn  radio1">
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

                          { (this.state.workout == "yes" || this.state.workout == "") &&
                            <FormGroup>   
                              <Label className="padding">1.4 Your Workout Effort Level? (with 1 being the easiest and 10 the hardest)</Label>
                                { this.state.editable &&
                                  <div className="input">
                                      <Input 
                                      id="placeholder"
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
              
                  

                          { (this.state.workout == "yes" || this.state.workout == "") &&
                          <FormGroup>
                            <Label className="padding">1.5 Did You Have Any Pain or Twinges During or After Your Workout?</Label>
                                {this.state.editable &&
                                  <div className="input">
                                     
                                       <Label check className="btn  radio1">
                                      <Input type="radio" name="pain" 
                                      value="yes"
                                      checked={this.state.pain === 'yes'}
                                      onChange={this.handleChangePain}/>{' '}
                                      Yes
                                   </Label>

                                   <Label check className="btn  radio1">
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

                          { (this.state.workout == "yes" || this.state.workout == "") &&
                            this.state.workout_type !== "strength" &&
                            this.state.workout_input_type !== "strength" &&
                          <FormGroup>    
                            <Label className="padding">1.6 Water Consumed During Workout (Ounces)</Label>
                              { this.state.editable &&
                              <div className="input">
                                  <Input type="select"
                                        id="placeholder" 
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

                          
                          { (this.state.workout == "yes" || this.state.workout == "") &&
                            this.state.workout_type !== "strength" &&
                            this.state.workout_input_type !== "strength" &&    
                          <FormGroup>      
                            <Label className="padding">1.7 Tablespoons of Chia Seeds Consumed During Workout?</Label>
                                { this.state.editable &&
                                  <div className="input">
                                      <Input
                                      id="placeholder" 
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

                        
                          { (this.state.workout == "yes" || this.state.workout == "") &&
                            this.state.workout_type !== "strength" &&
                            this.state.workout_input_type !== "strength" &&  
                            <FormGroup>
                              <Label className="padding">1.8 What % of Your Workout Did you breathe in and out through Your nose?</Label>
                                  {this.state.editable &&
                                    <div className="input">
                                        <Input type="select"
                                        id="placeholder"
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

                           
                          { (this.state.workout == "yes" || this.state.workout == "") &&
                            this.state.workout_type !== "strength" &&
                            this.state.workout_input_type !== "strength" &&
                           <FormGroup>
                            <Label className="padding">1.9 Were You Fasted During Your Workout? </Label>
                              {this.state.editable &&
                                <div className="input">
                                  
                                    <Label check className="btn  radio1">
                                      <Input type="radio" name="fasted" 
                                      value="yes"
                                      checked={this.state.fasted === 'yes'}
                                      onChange={this.handleChangeFasted}/>{' '}
                                      Yes
                                   </Label>

                                   <Label check className="btn  radio1">
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
                               <FormGroup id="padd">
                                 {this.renderFasted()}
                               </FormGroup>
                          </FormGroup>
                        }

                        { (this.state.workout === "yes" || this.state.workout === "") &&     
                          <FormGroup>      
                            <Label className="padding">
                              {(this.state.workout_type === 'strength' ||
                                this.state.workout_input_type === 'strength')?
                               '1.10 General Strength Comments/What Strength Sets Did You Do?':
                               '1.10 General Workout Comments'}
                            </Label>
                              {this.state.editable &&
                                <div className="input1">
                                     <Textarea name="workout_comment"
                                     id="placeholder"                            
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
                                <Label>1.11 I want to manually enter in weather information for my workout</Label>
                                </div>
                              }
                              {
                                !this.state.editable &&
                                <div>
                                <Label className="LAbel">1.11 I want to manually enter in weather information for my workout</Label>
                                <div className="input">                             
                                  <p>{this.state.weather_check?"yes":"no"}</p>
                                </div>
                                </div>
                              }
                            </FormGroup>
                        }
                         
                        <Collapse isOpen={this.state.weather_check}>
                         { (this.state.workout === "yes" || this.state.workout === "") &&                                                      
                         <FormGroup>                          
                            <Label className="padding">1.11.1 What was the temperature (in degree celsius)
                             when I did my workout (get from weather apps)?</Label>
                            {this.state.editable &&
                              <div>
                                <div className="col-xs-6">
                                  <div className="input"> 
                                <Input type="select" 
                                id="placeholder"
                                name="indoor_temperature"
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
                                <Input type="select"
                                id="placeholder"
                                 name="outdoor_temperature"
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
                                  id="placeholder" 
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
                                    id="placeholder"
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
                                  id="placeholder" 
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
                                    id="placeholder" 
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
                                 id="placeholder"
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
                          <Label>I did a long workout and want to enter what I ate/calories consumed</Label>
                          </div>
                          }
                          {!this.state.editable &&
                            <div>
                              <Label>I did a long workout and want to enter what I ate/calories consumed</Label>
                              <div className="input">
                                <p >{this.state.calories_item_check?"yes":"no"}</p>
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
                            <Label className="padding">1.12 Approximately How Many Calories Did You Consume During Your Workout?</Label>
                            {this.state.editable &&
                              <div className="input1">
                                 <Input type="text" name="calories"
                                 id="placeholder" 
                                 value={this.state.calories}
                                 onChange={this.handleChange}/>
                              </div>
                            }
                            {
                              !this.state.editable &&
                              <div className="input">
                                <p>{this.state.calories}</p>
                              </div>
                            }
                          </FormGroup>
                        }
                                                
                          { (this.state.workout == "yes" || this.state.workout == "") &&
                            this.state.workout_type !== "strength" &&
                            this.state.workout_input_type !== "strength" &&
                          <FormGroup>      
                            <Label className="padding">1.13 What Specifically Did You Consume During Your Workout?</Label>
                            {this.state.editable &&
                              <div className="input1">
                                 <Textarea  name="calories_item"
                                 id="placeholder"
                                  rows="5" cols="5" 
                                  className="form-control" 
                                 value={this.state.calories_item}
                                 onChange={this.handleChange}></Textarea>
                              </div>
                            }
                            {
                              !this.state.editable &&
                              <div className="input">
                                <p >{this.state.calories_item}</p>
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
                                <Input type="select"
                                id="placeholder"
                                 name="sleep_hours_last_night"
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
                                <Input type="select" 
                                id="placeholder"
                                name="sleep_mins_last_night"
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

                           <FormGroup>
                          
                            <Label className="padding">2.1 Sleep Bed Time</Label>
                            {this.state.editable &&
                              <div className="input1">
                                <DatePicker
                                    id="datepicker"
                                    name = "sleep_bedtime"
                                    selected={this.state.sleep_bedtime}
                                    onChange={this.handleChangeSleepBedTime}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
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
                          
                            <Label className="padding">2.2 Sleep Awake Time</Label>
                            {this.state.editable &&
                              <div className="input1">
                                <DatePicker
                                    id="datepicker"
                                    name = "sleep_awake_time"
                                    selected={this.state.sleep_awake_time}
                                    onChange={this.handleChangeSleepAwakeTime}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
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
                                    this.state.sleep_awake_time != null?
                                    this.state.sleep_awake_time.format('MMMM Do YYYY, h:mm a'): ''
                                  }
                                </p>
                              </div>
                            }                          
                          </FormGroup>

                           <FormGroup>
                          
                            <Label className="padding">2.3 Awake Time</Label>
                            {this.state.editable &&
                              <div>
                                <div className="col-xs-6">
                                  <div className="input"> 
                                <Input type="select" 
                                id="placeholder"
                                name="awake_hours"
                                id="hours"
                                className="form-control custom-select"
                                value={this.state.awake_hours}
                                onChange={this.handleChange}>
                                 <option key="hours" value="">Hours</option>
                                {this.createSleepDropdown(0,24)}                        
                                </Input>
                                </div>
                                </div>
                              
                                <div className="col-xs-6 justify-content-right">
                               <div className="input">
                                <Input type="select" 
                                id="placeholder"
                                name="awake_mins"
                                 id="minutes"
                                className="form-control custom-select "
                                value={this.state.awake_mins}
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
                                     id="placeholder" 
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
                                
                                     <Label check className="btn  radio1">
                                      <Input type="radio" name="prescription_sleep_aids" 
                                      value="yes"
                                      checked={this.state.prescription_sleep_aids === 'yes'}
                                      onChange={this.handleChangeSleepAids}/>{' '}
                                      Yes
                                   </Label>

                                   <Label check className="btn  radio1">
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
                                          style={{color:"#5e5e5e"}}
                                          name = "info-circle"
                                          size = "1x"                                      
                                        
                              />
                        
                              </span>
                             </Label>
                              {this.state.editable &&
                                <div className="input1">
                                  <Input
                                  type="select" 
                                  id="placeholder"
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
                          <div >
                           <Popover
                           className="pop"                         
                           id="popover" 
                            placement="right" 
                            isOpen={this.state.unprocessedInfo}
                            target="unprocessedinfo" 
                            toggle={this.toggleUnprocessedInfo}>
                              <PopoverBody>
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
                                1. Dairy (cheese, milk, yogurt, other refined milk products),
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
                                  6. Oils that have been heated up (e.g., olive oil, coconut oil, avocado oils, corn oils,
                                   soybean oils, etc).  If the oil has been heated up to prepare/sanitize your food, it is
                                   processed (for example nuts cooked in oil, anything else heated in oil)
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
                              </PopoverBody>
                           </Popover> 
                           </div>     

                          <FormGroup>
                               <Label className="padding">6. Number of Alcohol Drinks Consumed Yesterday?</Label>
                                {this.state.editable &&
                                  <div className="input1">
                                       <Input 
                                       type="select"
                                       id="placeholder" 
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
                                            
                          <FormGroup>
                            <Label className="padding">7. Did You Smoke Any Substances Yesterday?</Label>
                            {this.state.editable &&
                              <div className="input1">
                                  

                                   <Label check className="btn  radio1">
                                      <Input type="radio" name="smoke_substances" 
                                      value="yes"
                                      checked={this.state.smoke_substances === 'yes'}
                                      onChange={this.handleChangeSmokeSubstance}/>{' '}
                                      Yes
                                   </Label>

                                   <Label check className="btn  radio1">
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
                                   
                                     <Label check className="btn  radio1">
                                      <Input type="radio" name="medications"
                                      id="placeholder" 
                                      value="yes"
                                      checked={this.state.medications === 'yes'}
                                      onChange={this.handleChangePrescription}/>{' '}
                                      Yes
                                   </Label>

                                   <Label check className="btn  radio1">
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
                                 <Label check className="btn  radio1">
                                    <Input type="radio" name="stress" 
                                    value="low"
                                    checked={this.state.stress === 'low'}
                                    onChange={this.handleChange}/>{' '}
                                    Low
                                 </Label>

                                 <Label check className="btn  radio1">
                                   <Input type="radio" name="stress" 
                                        value="medium"
                                        checked={this.state.stress === 'medium'}
                                        onChange={this.handleChange}/>{' '}
                                      Medium
                                </Label>
                                 <Label check className="btn  radio1">
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
                               

                                  <Label check className="btn  radio1">
                                    <Input type="radio" name="sick" 
                                    value="yes"
                                    checked={this.state.sick === 'yes'}
                                    onChange={this.handleChangeSick}/>{' '}
                                    Yes
                                 </Label>

                                 <Label check className="btn  radio1">
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
                                  id="placeholder" 
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
                                    id="placeholder" 
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
                                    id="placeholder" 
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
                                        id="placeholder"
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
                                  


                                    <Label check className="btn  radio1">
                                      <Input type="radio" name="stand" 
                                      value="yes"
                                      checked={this.state.stand === 'yes'}
                                      onChange={this.handleChange}/>{' '}
                                      Yes
                                   </Label>

                                   <Label check className="btn  radio1">
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
                                     id="placeholder" 
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
                              id="btn1"
                              type="submit" 
                              className="btn btn-block">
                                SUBMIT
                            </Button>

                          }

                          {(this.state.update_form && this.state.editable) &&
                            <Button 
                              id="btn1" 
                              className="btn btn-block"
                              onClick={this.onUpdate}>
                                UPDATE
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

