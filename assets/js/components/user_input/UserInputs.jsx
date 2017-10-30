import React from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import FontAwesome from "react-fontawesome";
import CalendarWidget from 'react-calendar-widget';
import { Container, Select, option, Option, Row, Col, Button, 
         ButtonGroup, Form,FormGroup, Label, Input, FormText,
         className, Modal,ModalHeader, ModalBody, ModalFooter,
         Nav, NavItem, NavLink, Collapse, Navbar, NavbarToggler, 
         NavbarBrand,Popover,PopoverBody } from 'reactstrap';
import moment from 'moment';

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
        scrollingLock: false,
        gender:'M',
        diet_to_show:'',
        cloning_data:false,
        fetching_data:false,
        updating_form:false,
        submitting_form:false,
        calendarOpen:false,

        workout:'',
        workout_easy:'',
        workout_enjoyable:'',
        workout_effort:'',
        workout_effort_hard_portion:'',
        pain:'',
        pain_area:'',
        water_consumed:'',
        chia_seeds:'',
        breath_nose:'',
        prcnt_unprocessed_food:'',
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
        sleep_hours_last_night:'',
        sleep_mins_last_night:'',
        sleep_comment:'',
        prescription_sleep_aids:'',
        sleep_aid_taken:'',
        smoke_substances:'',
        smoked_substance_list:'',
        medications:'',
        medications_taken_list:'',
        stand:'',
        food_consumed:'',
        weight:'',
        waist:'',
        clothes_size:'',
        heart_variability:'',
        breath_sleep:'',
        breath_day:'',
        diet_type:'',
        general_comment:''
      };
      return initialState;
    }

    constructor(props){
      super(props);
      this.state = this.getInitialState();
      this.handleChange = handlers.handleChange.bind(this);
      this.handleChangeWorkout = handlers.handleChangeWorkout.bind(this);
      this.handleChangeWorkoutEffort = handlers.handleChangeWorkoutEffort.bind(this);
      this.handleChangePain = handlers.handleChangePain.bind(this);
      this.handleChangeUnprocessedFood = handlers.handleChangeUnprocessedFood.bind(this);
      this.handleChangeSick = handlers.handleChangeSick.bind(this);
      this.handleChangeSleepAids = handlers.handleChangeSleepAids.bind(this);
      this.handleChangePrescription = handlers.handleChangePrescription.bind(this);
      this.handleChangeFasted = handlers.handleChangeFasted.bind(this);
      this.handleChangeDietModel = handlers.handleChangeDietModel.bind(this);
      this.handleChangeSmokeSubstance = handlers.handleChangeSmokeSubstance.bind(this);
      this.handleChangeAlcoholDrink = handlers.handleChangeAlcoholDrink.bind(this);

      this.renderWorkoutEffortModal = renderers.renderWorkoutEffortModal.bind(this);
      this.renderPainModal = renderers.renderPainModal.bind(this);
      this.renderUnprocessedFoodModal = renderers.renderUnprocessedFoodModal.bind(this);
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
      this.onNoWorkoutToday = this.onNoWorkoutToday.bind(this);
      this.fetchYesterdayData = this.fetchYesterdayData.bind(this); 
      this.toggle = this.toggle.bind(this);
      this.handleScroll = this.handleScroll.bind(this);
      this.toggleCalendar = this.toggleCalendar.bind(this);
      this.toggleEditForm = this.toggleEditForm.bind(this);
    }
    
    onFetchSuccess(data,clone_form=undefined){
      const DIET_TYPE = ['','vegan','vegetarian','paleo','low carb/high fat',
                        'high carb','ketogenic diet','whole foods/mostly unprocessed'];
      let other_diet = true;
      for(let diet of DIET_TYPE){
        if(data.data.optional_input.type_of_diet_eaten === diet)
          other_diet = false;
      }
      let was_cloning = this.state.cloning_data;
      this.setState({
        fetched_user_input_created_at:data.data.created_at,
        update_form:clone_form,
        diet_to_show: other_diet ? 'other':data.data.optional_input.type_of_diet_eaten,
        cloning_data:false,
        fetching_data:false,
        editable: was_cloning ? true : false,

        workout:data.data.strong_input.workout,
        workout_easy:data.data.strong_input.work_out_easy_or_hard,
        workout_enjoyable:data.data.optional_input.workout_enjoyable,
        workout_effort:data.data.strong_input.workout_effort_level,
        workout_effort_hard_portion:data.data.strong_input.hard_portion_workout_effort_level,
        pain:data.data.encouraged_input.pains_twings_during_or_after_your_workout,
        pain_area:data.data.encouraged_input.pain_area,
        water_consumed:data.data.encouraged_input.water_consumed_during_workout,
        chia_seeds:data.data.optional_input.chia_seeds_consumed_during_workout,
        breath_nose:data.data.encouraged_input.workout_that_user_breathed_through_nose,
        prcnt_unprocessed_food:data.data.strong_input.prcnt_unprocessed_food_consumed_yesterday,
        unprocessed_food_list:data.data.strong_input.list_of_unprocessed_food_consumed_yesterday,
       // processed_food_list:data.data.strong_input>list_of_processed_food_consumed_yesterday,
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
        sleep_hours_last_night:data.data.strong_input.sleep_time_excluding_awake_time.split(':')[0],
        sleep_mins_last_night:data.data.strong_input.sleep_time_excluding_awake_time.split(':')[1],
        sleep_comment:data.data.strong_input.sleep_comment,
        prescription_sleep_aids:data.data.strong_input.prescription_or_non_prescription_sleep_aids_last_night,
        sleep_aid_taken:data.data.strong_input.sleep_aid_taken,
        smoke_substances:data.data.strong_input.smoke_any_substances_whatsoever,
        smoked_substance_list:data.data.strong_input.smoked_substance,
        medications:data.data.strong_input.medications_or_controlled_substances_yesterday,
        medications_taken_list:data.data.strong_input.medications_or_controlled_substances_taken,
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
    }

    onNoWorkoutToday(){
      const value = "no workout today";
       this.setState({  
        workout_easy:value,
        workout_effort:value,
        workout_effort_hard_portion:value,
        workout_enjoyable:value,
        pain:value,
        water_consumed:value,
        breath_nose:value,
        chia_seeds:value,
        calories:'No Workout Today',
        fasted:value,          
        calories_item:'No Workout Today',
        workout_comment:'No Workout Today'
      });

    }
    
    onFetchFailure(error){
      const initial_state = this.getInitialState();
      this.setState(
        {...initial_state,
        selected_date:this.state.selected_date})
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
      const initial_state = this.getInitialState();
      this.setState({...initial_state,
                    gender:this.state.gender,
                    selected_date:this.state.selected_date},
                    ()=>{toast.info(" User Input submitted successfully!",{
                      className:"dark"
                    })
                  });
    }


    onUpdateSuccess(response){
      this.setState({
        updating_form:false
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

   toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
     
    });
  }

componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
}

handleScroll() {

  if (window.scrollY >= 135 && !this.state.scrollingLock) {
    this.setState({
      scrollingLock: true
    });
  } else if(window.scrollY < 135 && this.state.scrollingLock) {
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

  toggleEditForm(){
    this.setState({
      editable:!this.state.editable
    });
  }

    render(){

        return(
            <div>
                             
                            <div className="col-md-8 col-lg-8 col-sm-12">

                            <div className="d-flex justify-content-center">

                              <img className="img-fluid"
                               src="https://static1.squarespace.com/static/535dc0f7e4b0ab57db48c65c/t/591e1eb0414fb533af1850a6/1495146161157" alt="JVB"/>

                            </div>
                              
                             <h2 className="head">Daily User Inputs Report</h2>                            
                            </div>

                        <div className="nav3">
                           <div className="nav1" style={{position: this.state.scrollingLock ? "fixed" : "relative"}}>
                           <Navbar light toggleable className="navbar nav1">
                                <NavbarToggler className="navbar-toggler hidden-sm-up" onClick={this.toggle}>
                                    <div className="toggler">
                                     <img src="https://www.shutterstock.com/image-illustration/running-man-illustration-motion-blur-track-394133143"/>
                                    </div>
                               </NavbarToggler> 
                                  <span id="spa">
                                      <NavLink id="navlink1" href="#">
                                        <FontAwesome 
                                          name = "calendar"
                                          size = "1x"
                                          
                                        />
                                      </NavLink>
                                  </span>

                                  <span id="calendar"
                                  onClick={this.toggleCalendar}>

                                   {moment(this.state.selected_date).format('MMM D, YYYY')}
                                  </span>  

                                   <span className="btn2">
                                   <Button  
                                      size="sm"
                                      onClick={this.toggleEditForm}
                                      className="btn btn-info hidden-sm-up">
                                      {this.state.editable ? 'View Inputs' : 'Edit Form'}
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
                                   <span id="btn1">
                                       <Button  
                                            size="sm"
                                            onClick={this.fetchYesterdayData}
                                            className="btn btn-info">
                                            Copy Yesterday’s Inputs
                                          </Button>
                                   </span>
                                </div>
                          }

                          <div id="workout">
                          <h2><strong>Workout Inputs</strong></h2>

                           <FormGroup>   
                            <Label className="padding">1. Did You Workout Today?</Label>
                            {this.state.editable &&
                              <div className="input">                           
                              
                                  <Label className="btn btn-secondary radio1">
                                    <Input type="radio" 
                                    name="workout" 
                                    value="yes" 
                                    checked={this.state.workout === 'yes'}
                                    onChange={this.handleChange}/> Yes
                                  </Label>
                                  <Label className="btn btn-secondary radio1">
                                    <Input type="radio" name="workout" 
                                    value="no"
                                    checked={this.state.workout === 'no'}
                                    onChange={this.handleChange}/> No
                                  </Label>
                                  <Label className="btn btn-secondary radio1">
                                    <Input type="radio" 
                                    name="workout" 
                                    value="not yet"
                                    checked={this.state.workout === 'not yet'}
                                    onChange={this.handleChange}/> Not Yet
                                  </Label>
                                </div>
                              }
                              {!this.state.editable && 
                                <div className="input">
                                  <p>{this.state.workout}</p>
                                </div>
                              }
                           
                          </FormGroup> 

                            {(this.state.workout == "yes" || this.state.workout == "") &&
                              <FormGroup>   
                                <Label className="padding">1.2 Was Your Workout Easy or Hard?</Label>
                                {this.state.editable && 
                                  <div className="input">
                                  <Input 
                                        type="select" 
                                        className="custom-select form-control" 
                                        name="workout_easy"
                                        value={this.state.workout_easy}
                                        onChange={this.handleChangeWorkout} >
                                              <option value="">select</option>                                 
                                              <option value="easy">Easy</option>
                                              <option value="hard">Hard</option>
                                             
                                        </Input>
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

                        { (this.state.workout == "yes" || this.state.workout == "") &&
                          <FormGroup>   
                              <Label className="padding">1.3 Was Your Workout Today Enjoyable?</Label>
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

                          { (this.state.workout == "yes" || this.state.workout == "") &&
                            <FormGroup>   
                              <Label className="padding">1.4 Your Workout Effort Level? (with 1 being the easiest and 10 the hardest)</Label>
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
              
                  

                          { (this.state.workout == "yes" || this.state.workout == "") &&
                          <FormGroup>
                            <Label className="padding">1.5 Did You Have Any Pain or Twinges During or After Your Workout?</Label>
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

                          { (this.state.workout == "yes" || this.state.workout == "") &&
                          <FormGroup>    
                            <Label className="padding">1.6 Water Consumed During Workout (Ounces)</Label>
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

                          { (this.state.workout == "yes" || this.state.workout == "") &&     
                          <FormGroup>      
                            <Label className="padding">1.7 Tablespoons of Chia Seeds Consumed During Workout?</Label>
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

                         { (this.state.workout == "yes" || this.state.workout == "") &&     
                            <FormGroup>
                              <Label className="padding">1.8 What % of Your Workout Did you breathe in and out through Your nose?</Label>
                                  {this.state.editable &&
                                    <div className="input">
                                        <Input type="select"
                                         className="form-control custom-select" 
                                         name="breath_nose"                         
                                         value={this.state.breath_nose}
                                         onChange={this.handleChange}>
                                         <option key="select" value="">select</option>                            
                                          {this.createDropdown(1,100)}
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
                           <FormGroup>
                            <Label className="padding">1.9 Were You Fasted During Your Workout? </Label>
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
                               <FormGroup id="padd">
                                 {this.renderFasted()}
                               </FormGroup>
                          </FormGroup>
                        }

                        { (this.state.workout == "yes" || this.state.workout == "") &&     
                          <FormGroup>      
                            <Label className="padding">1.10 General Workout Comments</Label>
                              {this.state.editable &&
                                <div className="input1">
                                     <Input type="textarea" name="workout_comment" 
                                     placeholder="please leave a comment" 
                                     className="form-control"
                                     rows="5" cols="5" 
                                     value={this.state.workout_comment}
                                     onChange={this.handleChange}/>
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

                         { (this.state.workout == "yes" || this.state.workout == "") &&
                          <FormGroup>      
                            <Label className="padding">1.11 Approximately How Many Calories Did You Consume During Your Workout?</Label>
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
                                <p>{this.state.workout_easy}</p>
                              </div>
                            }
                          </FormGroup>
                        }

                        { (this.state.workout == "yes" || this.state.workout == "") &&
                          <FormGroup>      
                            <Label className="padding">1.12 What Specifically Did You Consume During Your Workout?</Label>
                            {this.state.editable &&
                              <div className="input1">
                                 <Input type="textarea" name="calories_item"
                                  rows="5" cols="5" 
                                  className="form-control" 
                                 value={this.state.calories_item}
                                 onChange={this.handleChange}/>
                              </div>
                            }
                            {
                              !this.state.editable &&
                              <div className="input">
                                <p>{this.state.calories_item}</p>
                              </div>
                            }
                          </FormGroup>
                            }
                      </div>

                            <div id="sleep">
                            <h2><strong>Sleep Input</strong></h2>
                         
                          
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
                                {this.createDropdown(0,24)}                        
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
                                {this.createDropdown(0,59)}                        
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
                            <Label className="padding">3 Sleep Comments</Label>
                              {this.state.editable &&
                                <div className="input1">
                                     <Input type="textarea" name="sleep_comment" 
                                     placeholder="please leave a comment" 
                                     className="form-control"
                                     rows="5" cols="5" 
                                     value={this.state.sleep_comment}
                                     onChange={this.handleChange}/>
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
                        <h2><strong>Nutrition and Lifestyle Inputs</strong></h2>
                        
                          <FormGroup className="food">
                            
                            <Label className="padding">5. What % of The Food You Consumed Yesterday Was Unprocessed?</Label>
                              {this.state.editable &&
                                <div className="input1">
                                  <Input
                                  type="select" 
                                  className="form-control custom-select" 
                                  name="prcnt_unprocessed_food"                            
                                  value={this.state.prcnt_unprocessed_food}
                                  onChange={this.handleChangeUnprocessedFood}>
                                  <option key="select" value="">select</option>
                                  {this.createDropdown(0,100,5)}
                                  </Input>
                                </div>
                              }
                              {
                                !this.state.editable &&
                                <div className="input">
                                  <p>{this.state.prcnt_unprocessed_food}</p>
                                </div>
                              }
                            <FormGroup id="padd"> 
                            {this.renderUnprocessedFoodModal()}
                            </FormGroup>
                          </FormGroup>

                          <FormGroup>
                               <Label className="padding">6. Number of Alcohol Drinks Consumed Yesterday?</Label>
                                {this.state.editable &&
                                  <div className="input1">
                                       <Input 
                                       type="select" 
                                       className="custom-select form-control" 
                                       name="alchol_consumed"
                                       value={this.state.alchol_consumed}
                                       onChange={this.handleChangeAlcoholDrink}>
                                          <option value="">select</option>
                                          <option value="0">0</option>
                                          <option value="0.5">0.5</option>
                                          <option value="1">1</option>
                                          <option value="1.5">1.5</option>
                                          <option value="2">2</option>
                                          <option value="2.5">2.5</option>
                                          <option value="3">3</option>
                                          <option value="3.5">3.5</option>
                                          <option value="4">4</option>
                                          <option value="4.5">4.5</option>
                                          <option value="5">5</option>
                                          <option value="5.5">5.5</option>
                                          <option value="6">6</option>
                                          <option value="6.5">6.5</option>
                                          <option value="7">7</option>
                                          <option value="7.5">7.5</option>
                                          <option value="8">8</option>
                                          <option value="8.5">8.5</option>
                                          <option value="9">9</option>
                                          <option value="9.5">9.5</option>
                                          <option value="10">10</option>
                                          <option value="10+">More Than 10</option>
                                        </Input>
                                    </div>
                                  }
                                  {
                                    !this.state.editable &&
                                    <div className="input">
                                      <p>{this.state.alchol_consumed}</p>
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
                           <h2><strong>Stress/Illness Inputs</strong></h2>
                          <FormGroup>
                            <Label className="padding">9. Yesterday's Stress Level</Label>
                              {this.state.editable &&
                                <div className="input1">
                                  <Input 
                                  type="select" 
                                  className="custom-select form-control" 
                                  name="stress"
                                  value={this.state.stress}
                                  onChange={this.handleChange}>
                                      <option value="">select</option>
                                      <option value="low">Low</option>
                                      <option value="medium">Medium</option>
                                      <option value="high">High</option>
                                  </Input>
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
                          <h2><strong>Extra Inputs</strong></h2>
                          <FormGroup>
                            <Label className="padding">11. Weight (Pounds)</Label>
                            {this.state.editable &&
                              <div className="input1">
                                  <Input type="select" 
                                     className="custom-select form-control"
                                     name="weight"                                  
                                     value={this.state.weight}
                                     onChange={this.handleChange} >
                                      <option key = "select" value="select">select</option>
                                      <option key = "no-weigh" value="">I did not weigh myself today</option> 
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

                              {
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
                                  <p>{this.state.alchol_consumed}</p>
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
                                     <Input type="textarea" name="general_comment" 
                                     placeholder="please leave a comment" 
                                     className="form-control"
                                     rows="5" cols="5" 
                                     value={this.state.general_comment}
                                     onChange={this.handleChange} />
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

                          { !this.state.update_form &&
                            <Button 
                              type="submit"
                              color="info" 
                              className="btn btn-block btn-primary">
                                Submit
                            </Button>

                          }

                          {(this.state.update_form && this.state.editable) &&
                            <Button 
                              color="info" 
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

export default UserInputs;