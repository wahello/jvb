import React from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import CalendarWidget from 'react-calendar-widget';

import { Container, Select, option, Option, Row, Col, Button, Form,
         FormGroup, Label, Input, FormText, className, Modal,
          ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import {userDailyInputSend,userDailyInputFetch,
        userDailyInputUpdate} from '../../network/userInput';

import {getUserProfile} from '../../network/auth';
import WorkoutEffortModal from './workoutEffortModal';
import PainModal from './painModal';
import UnprocesedFoodModal from './unprocessedFoodModal';
import SickModal from './sickModal';
import PrescriptionSleepAids from './prescriptionsleepaids';
import PrescriptionMedication from './pres-nonprescriptionmedication';
import FastedModal from './fastedModal';
import DietType from './diettype';
import SmokedSubstance from './smokedSubstance';

class UserInputs extends React.Component{

    getInitialState(){
      const initialState = {
        selected_date:new Date(),
        fetched_user_input_created_at:'',
        update_form:false,
        showResults:false,
        gender:'M',

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
        alchol_consumed:'',
        stress:'',
        sick:'',
        sickness:'',
        fasted:'',
        food_ate_before_workout:'',
        workout_comment:'',
        calories:'',
        calories_item:'',
        //sleep_last_night:'',
        sleep_hours_last_night:'',
        sleep_mins_last_night:'',
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
        diet_type:''
      };
      return initialState;
    }

    constructor(props){
      super(props);
      this.state = this.getInitialState();
      this.handleChange = this.handleChange.bind(this);
      this.handleChangeWorkout=this.handleChangeWorkout.bind(this);
      this.handleChangeWorkoutEffort = this.handleChangeWorkoutEffort.bind(this);
      this.handleChangePain = this.handleChangePain.bind(this);
      this.handleChangeUnprocessedFood = this.handleChangeUnprocessedFood.bind(this);
      this.handleOnBlurUnprocessedFood = this.handleOnBlurUnprocessedFood.bind(this);
      this.handleChangeSick = this.handleChangeSick.bind(this);
      this.handleChangeSleepAids = this.handleChangeSleepAids.bind(this);
      this.handleChangePrescription=this.handleChangePrescription.bind(this);
      this.handleChangeFasted = this.handleChangeFasted.bind(this);
      this.handleChangeDietModel = this.handleChangeDietModel.bind(this);
      this.handleChangeSmokeSubstance = this.handleChangeSmokeSubstance.bind(this);

      this.renderWorkoutEffortModal = this.renderWorkoutEffortModal.bind(this);
      this.renderPainModal = this.renderPainModal.bind(this);
      this.renderUnprocessedFoodModal = this.renderUnprocessedFoodModal.bind(this);
      this.renderPainSick = this.renderPainSick.bind(this);
      this.renderPrescriptionSleepAids=this.renderPrescriptionSleepAids.bind(this);
      this.renderPrescriptionMedication=this.renderPrescriptionMedication.bind(this);
      this.renderFasted = this.renderFasted.bind(this);
      this.renderDietType = this.renderDietType.bind(this);
      this.renderSmokeSubstance = this.renderSmokeSubstance.bind(this);
      this.renderUpdateButton = this.renderUpdateButton.bind(this);

      this.onSubmit = this.onSubmit.bind(this);
      this.onUpdate = this.onUpdate.bind(this);
      this.resetForm = this.resetForm.bind(this);
      this.processDate = this.processDate.bind(this);
      this.onFetchSuccess = this.onFetchSuccess.bind(this);
      this.onFetchFailure = this.onFetchFailure.bind(this);
      this.onProfileSuccessFetch = this.onProfileSuccessFetch.bind(this);
      this.onNoWorkoutToday=this.onNoWorkoutToday.bind(this);
      this.fetchYesterdayData=this.fetchYesterdayData.bind(this);

    }
    
    // modal renderers
  

    renderWorkoutEffortModal(){
      if(this.state.workout_effort !== "no workout today" && 
         this.state.workout_effort !== ""){
        const updateState = function(val){
                              this.setState({
                                workout_effort_hard_portion:val
                              })}.bind(this);
    
        return(
          <WorkoutEffortModal
            workout_effort_hard_portion={this.state.workout_effort_hard_portion}
            updateState={updateState}
          />
        );
    }
      }

    renderPainModal(){
      if(this.state.pain === 'yes'){
        const updateState = function(val){
                              this.setState({
                                pain_area: val
                              })}.bind(this);
        return(
          <PainModal
            pain_area={this.state.pain_area}
            updateState={updateState}
          />
        );
      }
    }

    renderUnprocessedFoodModal(callback){
      return(
            <UnprocesedFoodModal
            unprocessed_food_list={this.state.unprocessed_food_list}
            updateState={callback}
          />
      );
    }

    renderPainSick(callback){
      return(
        <SickModal
          sickness={this.state.sickness}
          updateState={callback}
        />
      );
    }

    renderPrescriptionSleepAids(callback){
      return(
          <PrescriptionSleepAids
          sleep_aid_taken={this.state.sleep_aid_taken}
          updateState={callback}
          />
        );
    }
     renderPrescriptionMedication(callback){
      return(
          <PrescriptionSleepAids
          sleep_aid_taken={this.state.medications_taken_list}
          updateState={callback}
          />
        );
    }

    renderFasted(callback){   
      return(
        <FastedModal
          food_ate_before_workout={this.state.food_ate_before_workout}
          updateState={callback}
        />
      );
    }

    renderDietType(callback){
      return(
        <DietType
          food_ate_before_workout={this.state.diet_type}
          updateState={callback}
        />
      );
    }

    renderSmokeSubstance(callback){
      return(
        <SmokedSubstance
          smoked_substance_list={this.state.smoked_substance_list}
          updateState={callback}
        />
      );
    }

    renderUpdateButton(){
      if(this.state.update_form){
        return(
          <Button 
            color="info" 
            className="btn btn-block btn-primary"
            onClick={this.onUpdate}>
              Update
          </Button>
        );
      }
    }
  
    handleChange(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;
      this.setState({
        [name]: value
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
    handleChangeWorkout(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;
      if (value === "no workout today"){
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
      }else{
          this.setState({
          workout_easy:value
        });
      }
    }

    handleChangeWorkoutEffort(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;

      this.setState({
        workout_effort:value,
      });
    }



    handleChangePain(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;

      this.setState({
        pain:value
      });
    }

    handleChangeUnprocessedFood(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;

      this.setState({
        prcnt_unprocessed_food:value
      });
    }

    handleOnBlurUnprocessedFood(event){
      const value = event.target.value; 
      if(value > 0){
        const updateState = function(val){
          this.setState({
            unprocessed_food_list: val
          });
        }.bind(this);

        ReactDOM.render(
          this.renderUnprocessedFoodModal(updateState),
          document.getElementById('unprocessedFoodModal')
        );
      }
    }

    handleChangeSick(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;

      this.setState({
        sick:value
      },function(){
        if(value === 'yes'){
          const updateState = function(val){
            this.setState({
              sickness : val
            });
          }.bind(this);
          ReactDOM.render(
            this.renderPainSick(updateState),
            document.getElementById('sickModal')
          );
        }
      }.bind(this));
    }

    handleChangeSleepAids(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;

      this.setState({
        prescription_sleep_aids:value
      },function(){
        if(value === 'yes'){
          const updateState = function(val){
            this.setState({
              sleep_aid_taken: val
            });
          }.bind(this);
          ReactDOM.render(
            this.renderPrescriptionSleepAids(updateState),
            document.getElementById('sleepAidModal')
          );
        }
      }.bind(this));
    }

    handleChangePrescription(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;

      this.setState({
        medications:value
      },function(){
        if(value === 'yes'){
          const updateState = function(val){
            this.setState({
             medications_taken_list: val
            });
          }.bind(this);
          ReactDOM.render(
            this.renderPrescriptionMedication(updateState),
            document.getElementById('medicationModel')
          );
        }
      }.bind(this));
    }

    handleChangeFasted(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;

      this.setState({
        fasted:value
      },function(){
        if(value === 'no'){
          const updateState = function(val){
            this.setState({
             food_ate_before_workout: val
            });
          }.bind(this);
          ReactDOM.render(
            this.renderFasted(updateState),
            document.getElementById('fastedModal')
          );
        }
      }.bind(this));
    }

    handleChangeDietModel(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;

      this.setState({
        diet_type:value
      },function(){
        if(value === 'other'){
          const updateState = function(val){
            this.setState({
             diet_type: val
            });
          }.bind(this);
          ReactDOM.render(
            this.renderDietType(updateState),
            document.getElementById('dietMo')
          );
        }
      }.bind(this));
    }

   handleChangeSmokeSubstance(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;

      this.setState({
        smoke_substances:value
      },function(){
        if(value === 'yes'){
          const updateState = function(val){
            this.setState({
             smoked_substance_list: val
            });
          }.bind(this);
          ReactDOM.render(
            this.renderSmokeSubstance(updateState),
            document.getElementById('smokeSubstanceModal')
          );
        }
      }.bind(this));
    }

    onFetchSuccess(data,clone=false){
      this.setState({
        fetched_user_input_created_at:data.data.created_at,
        update_form:!clone,
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
        alchol_consumed:data.data.strong_input.number_of_alcohol_consumed_yesterday,
        stress:data.data.encouraged_input.stress_level_yesterday,
        sick:data.data.optional_input.sick,
        sickness:data.data.optional_input.sickness,
        fasted:data.data.optional_input.fasted_during_workout,
        food_ate_before_workout:data.data.optional_input.food_ate_before_workout,
        workout_comment:data.data.optional_input.general_Workout_Comments,
        calories:data.data.optional_input.calories_consumed_during_workout,
        calories_item:data.data.optional_input.food_ate_during_workout,
       // sleep_last_night:data.data.strong_input.sleep_time_excluding_awake_time,
        sleep_hours_last_night:data.data.strong_input.sleep_time_excluding_awake_time.split(':')[0],
        sleep_mins_last_night:data.data.strong_input.sleep_time_excluding_awake_time.split(':')[1],
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
        diet_type:data.data.optional_input.type_of_diet_eaten
      });
    }

    onFetchFailure(error){
      // alert('User input not found');
      const initial_state = this.getInitialState();
      this.setState({...initial_state,selected_date:this.state.selected_date});
    }

    processDate(date){
      this.setState({
        selected_date:date
      },function(){
        const clone = false;
        userDailyInputFetch(date,this.onFetchSuccess,this.onFetchFailure,clone);
      }.bind(this));
    }

    fetchYesterdayData(){
      const today = new Date();
      const yesterday = new Date(today.getFullYear(),
                                today.getMonth(),
                                today.getDate()-1);
      const clone = true;
      userDailyInputFetch(yesterday,this.onFetchSuccess,this.onFetchFailure,clone);
    }

    resetForm(){
       toast.info(" User Input submitted successfully!",{
          className:"dark"
                });
      const initial_state = this.getInitialState();
      this.setState({...initial_state,gender:this.state.gender});
    }


    onUpdateSuccess(response){
      alert("Successfully updated form");
    }

    onUpdate(){
      userDailyInputUpdate(this.state,this.onUpdateSuccess);
    }

    onSubmit(event){
      console.log(this.state);
      event.preventDefault();
      userDailyInputSend(this.state,this.resetForm());    
    }

    onProfileSuccessFetch(data){
      this.setState({
        gender:data.data.gender
      });
    }

    componentDidMount(){
      getUserProfile(this.onProfileSuccessFetch);
    }

    createDropdown(start_num , end_num){
    let elements = [];
    for(let i=start_num;i<=end_num;i++){
      elements.push(<option value={i}>{i}</option>);
    }
    return elements;
  }


    render(){

        return(
            <div>
            
                <Container id="user-inputs">
                    <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-10 col-sm-12">

                    
                      <div className="col-sm-2">
                           <CalendarWidget onDaySelect={this.processDate}/>,
                      </div>
                        <h2 className="head">Daily user inputs report</h2>
                        <div className="row justify-content-center">
                        <div className="btn1">
                          <Button  
                           size="sm"
                            onClick={this.onNoWorkoutToday}

                            className="btn btn-info">
                            I Did Not Workout Today
                          </Button>
                          </div>
                        <div className="btn2">
                          <Button  
                        size="sm"
                            onClick={this.fetchYesterdayData}
                            className="btn btn-info">
                            Copy Yesterday’s Inputs
                          </Button>
                          </div>
                        </div>

                        <Form 
                          getRef = {(input) => this.input_form = input}
                          onSubmit = {this.onSubmit}
                          className="user-inputs-form bootstrap_validator" 
                          role="form" 
                          data-toggle="validator">

                          { this.state.workout_easy != "no workout today" &&
                          <FormGroup>   
                            <Label className="padding">Was Your Workout Easy or Hard?</Label>
                            <Input 
                            type="select" 
                            className="custom-select form-control" 
                            name="workout_easy"
                            value={this.state.workout_easy}
                            onChange={this.handleChangeWorkout}>
                                <option value="">select</option>
                                <option value="no workout today">No Workout Today</option>
                                <option value="easy">Easy</option>
                                <option value="hard">Hard</option>
                            </Input>  
                          </FormGroup> 
                        }

                        { this.state.workout_enjoyable !="no workout today" &&
                        <FormGroup>   
                            <Label className="padding">Was Your Workout Today Enjoyable?</Label>
                            <Input 
                            type="select" 
                            className="custom-select form-control" 
                            name="workout_enjoyable"
                            value={this.state.workout_enjoyable}
                            onChange={this.handleChange}>
                                  <option value="">select</option>
                                  <option value="no workout today">No Workout Today</option>
                                  <option value="yes">Yes</option>
                                  <option value="no">No</option>
                            </Input>  
                        </FormGroup>
                      }

                          { this.state.workout_effort !="no workout today" &&
                          <FormGroup>   
                            <Label className="padding">Your Workout Effort Level?</Label>
                            <Input 
                            type="select" 
                            className="custom-select form-control" 
                            name="workout_effort"
                            value={this.state.workout_effort}
                            onChange={this.handleChangeWorkoutEffort} >
                                  <option value="">select</option>  
                                  <option value="no workout today">No Workout Today</option>
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
                            {this.renderWorkoutEffortModal()}
                          </FormGroup>
                                }
              
                  

                          { this.state.pain !="no workout today" &&
                          <FormGroup>
                            <Label className="padding">Did You Have Any Pain or Twinges During or After Your Workout?</Label>
                            <Input 
                            type="select" 
                            className="custom-select form-control" 
                            id="pain_select" 
                            name="pain"
                            value={this.state.pain}
                            onChange={this.handleChangePain}>
                                <option value="">select</option>
                                <option value="no workout today">No Workout Today</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </Input>
                            {this.renderPainModal()}
                          </FormGroup>
                          }

                          { this.state.water_consumed !="no workout today" &&
                          <FormGroup>    
                            <Label className="padding">Water Consumed During Workout (Ounces)</Label>
                            <Input type="select" 
                                   className="custom-select form-control" 
                                   name="water_consumed"                                 
                                   value={this.state.water_consumed}
                                   onChange={this.handleChange}>
                                   <option value="">select</option>
                                   <option value="no workout today">No Workout Today</option>
                                   {this.createDropdown(0,250)}
                                   </Input>
                          </FormGroup>
                        }

                          { this.state.chia_seeds !="no workout today" &&     
                          <FormGroup>      
                            <Label className="padding">Tablespoons of Chia Seeds Consumed During Workout?</Label>
                            <Input 
                            type="select" 
                            className="custom-select form-control" 
                            name="chia_seeds"
                            value={this.state.chia_seeds}
                            onChange={this.handleChange}>
                                <option value="">select</option>
                                <option value="no workout today">No Workout Today</option>
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
                          </FormGroup>
                        }

                         { this.state.breath_nose !="no workout today" &&     
                          <FormGroup>
                            <Label className="padding">What % of Your Workout Did you breathe in and out through Your nose?</Label>
                            <Input type="select"
                             className="form-control custom-select" 
                             name="breath_nose"                         
                             value={this.state.breath_nose}
                             onChange={this.handleChange}>
                             <option value="">select</option>
                             <option value="no workout today">No Workout Today</option>
                              {this.createDropdown(1,100)}
                            </Input>
                          </FormGroup>

                        }
                           { this.state.fasted !="no workout today" &&
                           <FormGroup>
                            <Label className="padding">Were You Fasted During Your Workout? </Label>
                                <Input 
                                type="select" 
                                className="custom-select form-control" 
                                name="fasted"
                                value={this.state.fasted}
                                onChange={this.handleChangeFasted}>
                                    <option value="">select</option>
                                    <option value="no workout today">No Workout Today</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </Input>
                          </FormGroup>
                        }

                          <div id="fastedModal"></div>


                           { this.state.workout_comment !="No Workout Today" &&     
                          <FormGroup>      
                            <Label className="padding">General Workout Comments</Label>
                               <Input type="textarea" name="workout_comment" 
                               placeholder="please leave a comment" 
                               className="form-control"
                               rows="5" columns="5" 
                               value={this.state.workout_comment}
                               onChange={this.handleChange}/>
                          </FormGroup>
                        }

                         { this.state.calories !="No Workout Today" &&
                          <FormGroup>      
                            <Label className="padding">Approximately How Many Calories Did You Consume During Your Workout?</Label>
                               <Input type="text" name="calories" 
                               value={this.state.calories}
                               onChange={this.handleChange}/>
                          </FormGroup>
                        }

                        { this.state.calories_item !="No Workout Today" &&
                          <FormGroup>      
                            <Label className="padding">What Specifically Did You Consume During Your Workout?</Label>
                               <Input type="textarea" name="calories_item"
                                rows="5" columns="5" 
                                className="form-control" 
                               value={this.state.calories_item}
                               onChange={this.handleChange}/>
                          </FormGroup>
                            }

                          <h2><strong>Sleep Input</strong></h2>
                           <FormGroup>
                            <Label className="padding">How Much Time Did You Sleep Last Night (Excluding Awake Time)?</Label>
                            <div className="col-md-5 col-lg-6 col-sm-6">
                            <Input type="select" name="sleep_hours_last_night"
                            placeholder="Hours"
                            className="form-control custom-select"
                            value={this.state.sleep_hours_last_night}
                            onChange={this.handleChange}>
                             <option value="">Hours</option>
                            {this.createDropdown(0,24)}                        
                            </Input>
                            </div>
                            <div className="col-md-5 col-lg-6 col-sm-6">
                             <span><Input type="select" name="sleep_mins_last_night"
                             placeholder="Minutes"
                            className="form-control custom-select"
                            value={this.state.sleep_mins_last_night}
                            onChange={this.handleChange}>
                             <option value="">Minutes</option>
                            {this.createDropdown(0,59)}                        
                            </Input></span>
                            </div>
                          </FormGroup>

                        
                          <FormGroup className="food">
                            <h2><strong>Food/Drink/Other Inputs</strong></h2>
                            <Label className="padding"> What % of The Food You Consumed Yesterday Was Unprocessed?</Label>
                            <Input
                            type="select" 
                            className="form-control custom-select" 
                            name="prcnt_unprocessed_food"                            
                            value={this.state.prcnt_unprocessed_food}
                            onChange={this.handleChangeUnprocessedFood}
                            onBlur={this.handleOnBlurUnprocessedFood}>
                            <option value="">select</option>
                            {this.createDropdown(0,100)}
                            </Input>
                          </FormGroup>

                          <div id="unprocessedFoodModal"></div>

                          <FormGroup>
                               <Label className="padding">Number of Alcohol Drinks Consumed Yesterday?</Label>
                                 <Input 
                                 type="select" 
                                 className="custom-select form-control" 
                                 name="alchol_consumed"
                                 value={this.state.alchol_consumed}
                                 onChange={this.handleChange}>
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
                          </FormGroup>
                          
                           <h2><strong>Sleep Aids/Smoking/Medications/Supplements Inputs</strong></h2>
                           <FormGroup>
                             <Label className="padding">Did You Take Any Prescription or Non Prescription Sleep Aids Last Night?</Label>
                              <Input 
                              type="select" 
                              className="custom-select form-control" 
                              id="prescription_select" 
                              name="prescription_sleep_aids"
                              value={this.state.prescription_sleep_aids}
                              onChange={this.handleChangeSleepAids}>
                                  <option value="">select</option>
                                  <option value="yes">Yes</option>
                                  <option value="no">No</option>
                              </Input>
                          </FormGroup>
                          <div id="sleepAidModal"></div>

                          <FormGroup>
                            <Label className="padding">Did You Smoke Any Substances Yesterday?</Label>
                            <Input 
                            type="select" 
                            className="custom-select form-control" 
                            name="smoke_substances"
                            value={this.state.smoke_substances}
                            onChange = {this.handleChangeSmokeSubstance}>
                                    <option value="">select</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                            </Input>       
                          </FormGroup>

                          <div id="smokeSubstanceModal"></div>

                           <FormGroup>
                              <Label className="padding">Did You Take Any Prescription or Non Prescription Medications or Supplements Yesterday?</Label>
                              <Input 
                              type="select" 
                              className="custom-select form-control" 
                              name="medications"
                              value={this.state.medications}
                              onChange={this.handleChangePrescription}>
                                      <option value="">select</option>
                                      <option value="yes">Yes</option>
                                      <option value="no">No</option>
                              </Input>
                          </FormGroup>
                          <div id="medicationModel"></div>

                           <h2><strong>Stress/Illness Inputs</strong></h2>
                          <FormGroup>
                            <Label className="padding">Yesterday's Stress Level</Label>
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
                          </FormGroup>

                          <FormGroup>
                            <Label className="padding">Are You Sick Today?</Label>
                            <Input 
                            type="select" 
                            className="custom-select form-control" 
                            id="sick_select"
                            name="sick"
                            value={this.state.sick}
                            onChange={this.handleChangeSick}>
                                <option value="">select</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </Input>
                          </FormGroup>

                          <div id="sickModal"></div>
                         
                         
                          <h2><strong>Daily User Inputs (optional)</strong></h2>
                          <FormGroup>
                            <Label className="padding">Weight (Pounds)</Label>
                                <Input type="select" 
                                   className="custom-select form-control"
                                   name="weight"                                  
                                   value={this.state.weight}
                                   onChange={this.handleChange} >
                                    <option value="">select</option>
                                   {this.createDropdown(30,300)}
                                   </Input>
                          </FormGroup>

                          { this.state.gender === 'M' &&
                            <FormGroup>       
                              <Label className="padding">Waist Size (Male)</Label>
                              <Input 
                                type="text" 
                                className="form-control" 
                                placeholder="Between 20 - 60"
                                name="waist"                               
                                value={this.state.waist}
                                onChange={this.handleChange}>
                              </Input>
                            </FormGroup>
                          }

                          { this.state.gender === 'F' &&
                            <FormGroup>
                              <Label className="padding">Clothes Size (Womens)</Label>
                              <Input 
                                type="text" 
                                className="form-control"
                                placeholder="Between 0 - 16" 
                                name="clothes_size"                                
                                value={this.state.clothes_size}
                                onChange={this.handleChange}>
                              </Input>
                            </FormGroup>
                          }

                          <FormGroup>
                              <Label className="padding">What Type Of Diet Do You Eat?</Label>
                              <Input 
                              type="select" 
                              className="custom-select form-control" 
                              name="diet_type"
                              value={this.state.diet_type}
                              onChange={this.handleChangeDietModel}>
                                      <option value="">select</option>
                                      <option value="other">Other</option> 
                                      <option value="vegan">Vegan</option>
                                      <option value="vegetarian">Vegetarian</option>
                                      <option value="paleo">Paleo</option>
                                      <option value="low carb/high fat">Low carb/High fat</option>
                                      <option value="high carb">High Carb</option>
                                      <option value="">None</option>
                                      
                              </Input>
                          </FormGroup>
                          <div id="dietMo"></div>

                           <FormGroup>     
                            <Label className="padding">Did You Stand For 3 Hours or More Yesterday? </Label>
                            <Input 
                            type="select" 
                            className="custom-select form-control"  
                            name="stand"
                            value={this.state.stand}
                            onChange={this.handleChange}>
                                <option value="">select</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </Input>
                          </FormGroup>

                          { !this.state.update_form &&
                            <Button 
                              type="submit"
                              color="info" 
                              className="btn btn-block btn-primary">
                                Submit
                            </Button>

                          }
                          {this.renderUpdateButton()}
                           <ToastContainer 
                                position="top-center"
                                type="success"
                                autoClose={10000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                pauseOnHover
                              />
                    </Form>
                    </div>
                 </div>
                </Container>
            </div>
        );
    }
}

export default UserInputs;