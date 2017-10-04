import React from 'react';
import ReactDOM from 'react-dom';

import CalendarWidget from 'react-calendar-widget';

import { Container, Select, option, Option, Row, Col, Button, Form,
         FormGroup, Label, Input, FormText, className, Modal,
          ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import {userDailyInputSend} from '../..//network/userInput';
import WorkoutEffortModal from './workoutEffortModal';
import PainModal from './painModal';
import UnprocesedFoodModal from './unprocessedFoodModal';
import SickModal from './sickModal';
import FastedModal from './fastedModal';

class UserInputs extends React.Component{

    constructor(props){
      super(props);
      this.state = {
        selected_date:new Date(),

        workout_easy:'',
        workout_enjoyable:'',
        workout_effort:'',
        workout_effort_hard_portion:'',
        pain:'',
        pain_area:'',
        water_consumed:'',
        chia_seeds:'',
        breath_nose:'',
        prnct_unprocessed_food:'',
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
        sleep_last_night:'',
        prescription_sleep_aids:'',
        sleep_aid_taken:[],
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
      this.handleChange = this.handleChange.bind(this);
      this.handleChangeWorkout=this.handleChangeWorkout.bind(this);
      this.handleChangeWorkoutEffort = this.handleChangeWorkoutEffort.bind(this);
      this.handleChangePain = this.handleChangePain.bind(this);
      this.handleChangeUnprocessedFood = this.handleChangeUnprocessedFood.bind(this);
      this.handleOnBlurUnprocessedFood = this.handleOnBlurUnprocessedFood.bind(this);
      this.handleChangeSick = this.handleChangeSick.bind(this);
      this.handleChangeFasted = this.handleChangeFasted.bind(this);

      this.renderWorkoutEffortModal = this.renderWorkoutEffortModal.bind(this);
      this.renderPainModal = this.renderPainModal.bind(this);
      this.renderUnprocessedFoodModal = this.renderUnprocessedFoodModal.bind(this);
      this.renderPainSick = this.renderPainSick.bind(this);
      this.renderFasted = this.renderFasted.bind(this);

      this.onSubmit = this.onSubmit.bind(this);
      this.processDate = this.processDate.bind(this);
    }
    
    // modal renderers

    renderWorkoutEffortModal(callback){
        return(
          <WorkoutEffortModal
            workout_effort_hard_portion={this.state.workout_effort_hard_portion}
            updateState={callback}
          />
        );
    }

    renderPainModal(callback){
        return(
          <PainModal
            pain_area={this.state.pain_area}
            updateState={callback}
          />
        );
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

    renderFasted(callback){
      return(
        <FastedModal
          food_ate_before_workout={this.state.food_ate_before_workout}
          updateState={callback}
        />
      );
    }

    // Change handlers
    handleChange(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;
      this.setState({
        [name]: value
      });
    }

    handleChangeWorkout(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;
      if (value === "no workout today"){
        this.setState({
          workout_easy:value,
          workout_effort:0,
          workout_effort_hard_portion:0,
          workout_enjoyable:value,
          pain:value,
          water_consumed:0,
          breath_nose:0,
          chia_seeds:0,
          calories:0
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
        workout_effort:value
      },function(){
        if(value > 0){
          const updateState = function(val){
              this.setState({
                workout_effort_hard_portion: val
              });
          }.bind(this);
          ReactDOM.render(
            this.renderWorkoutEffortModal(updateState),
            document.getElementById('workoutEffortModal')
          );
        }
      }.bind(this));
    }

    handleChangePain(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;

      this.setState({
        pain:value
      },function(){
        if(value === 'yes'){
          const updateState = function(val){
              this.setState({
                pain_area: val
              });
          }.bind(this);
          ReactDOM.render(
            this.renderPainModal(updateState),
            document.getElementById('painModal')
          );
        }
      }.bind(this));
    }

    handleChangeUnprocessedFood(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;

      this.setState({
        prnct_unprocessed_food:value
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

    handleChangeFasted(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;

      this.setState({
        fasted:value
      },function(){
        if(value === 'yes'){
          const updateState = function(val){
            this.setState({
              food_ate_before_workout : val
            });
          }.bind(this);
          ReactDOM.render(
            this.renderFasted(updateState),
            document.getElementById('fastedModal')
          );
        }
      }.bind(this));
    }

    processDate(date){
      this.setState({
        selected_date:date
      });
    }

    reset_form(){
      this.input_form.reset();
    }

    onSubmit(event){
      event.preventDefault();
      var form = this.input_form;
      var elmnts = form.elements.length;
      var form_values = {'created_at':this.state.selected_date};
      for(var i=0; i<elmnts; i++){
        form_values[form.elements[i].name] = form.elements[i].value;
      }
      // userDailyInputSend(form_values,this.reset_form).bind(this);
      // console.log(form_values);
      this.input_form.reset();
      console.log(this.state);
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
                        <Form 
                          getRef = {(input) => this.input_form = input}
                          onSubmit = {this.onSubmit}
                          className="user-inputs-form bootstrap_validator" 
                          role="form" 
                          data-toggle="validator">

                          <FormGroup>   
                            <Label className="padding">Was your workout easy or hard?</Label>
                            <Input 
                            type="select" 
                            className="custom-select form-control" 
                            name="workout_easy"
                            value={this.state.workout_easy}
                            onChange={this.handleChangeWorkout}>
                                <option value="select">select</option>
                                <option value="easy">Easy</option>
                                <option value="hard">Hard</option>
                                <option value="no workout today">No workout today</option>
                            </Input>  
                          </FormGroup> 

                          <FormGroup>   
                            <Label className="padding">Was your workout today enjoyable?</Label>
                            <Input 
                            type="select" 
                            className="custom-select form-control" 
                            name="workout_enjoyable"
                            value={this.state.workout_enjoyable}
                            onChange={this.handleChange}>
                                  <option value="select">select</option>
                                  <option value="yes">Yes</option>
                                  <option value="no">No</option>
                                  <option value="no workout today">No workout today</option>
                            </Input>  
                          </FormGroup>

                          <FormGroup>   
                            <Label className="padding">Workout Effort Level</Label>
                            <Input 
                            type="select" 
                            className="custom-select form-control" 
                            name="workout_effort"
                            value={this.state.workout_effort}
                            onChange={this.handleChangeWorkoutEffort} >
                                  <option value="select">select</option>
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
                                  <option value="0">No workout today</option>
                            </Input>
                          </FormGroup>

                          <div id="workoutEffortModal"></div>

                          <FormGroup>
                            <Label className="padding">Did you have any pain or twinges during or after your workout</Label>
                            <Input 
                            type="select" 
                            className="custom-select form-control" 
                            id="pain_select" 
                            name="pain"
                            value={this.state.pain}
                            onChange={this.handleChangePain}>
                                <option value="select">select</option>
                                <option value="yes">Yes</option>
                                <option vlaue="no">No</option>
                            </Input>
                          </FormGroup>

                          <div id="painModal"></div>

                          <FormGroup>    
                            <Label className="padding">Water Consumed During Workout(ounce)</Label>
                            <Input type="number" 
                                   className="custom-select form-control" 
                                   name="water_consumed"
                                   min="1" max="250"
                                   value={this.state.water_consumed}
                                   onChange={this.handleChange}/>
                          </FormGroup>

                          <FormGroup>      
                            <Label className="padding">Tablespoons of chia seeds consumed during workout ?</Label>
                            <Input 
                            type="select" 
                            className="custom-select form-control" 
                            name="chia_seeds"
                            value={this.state.chia_seeds}
                            onChange={this.handleChange}>
                                <option value="select">select</option>
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
                                <option value="0">No workout today</option>
                            </Input>
                          </FormGroup>

                          <FormGroup>
                            <Label className="padding">How much % of Workout that you breathed in and out through the nose</Label>
                            <Input type="number" step="10"
                             className="form-control" 
                             name="breath_nose"
                             min="0"
                             max="100"
                             value={this.state.breath_nose}
                             onChange={this.handleChange}/>
                          </FormGroup>

                          <FormGroup>
                            <Label className="padding"> how much % unprocessed food consumed yesterday?</Label>
                            <Input
                            type="number" 
                            className="form-control" 
                            name="prcnt_unprocessed_food"
                            step="5" min="0" max="100" 
                            value={this.state.unprocessed_food}
                            onChange={this.handleChangeUnprocessedFood}
                            onBlur={this.handleOnBlurUnprocessedFood}/>
                          </FormGroup>

                          <div id="unprocessedFoodModal"></div>

                          <FormGroup>
                               <Label className="padding">Number of Alchol Drinks consumed yesterday?</Label>
                                 <Input 
                                 type="select" 
                                 className="custom-select form-control" 
                                 name="alchol_consumed"
                                 value={this.state.alchol_consumed}
                                 onChange={this.handleChange}>
                                    <option value="select">select</option>
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
                                  </Input>
                          </FormGroup>

                          <FormGroup>
                            <Label className="padding">Yesterday Stress Level</Label>
                            <Input 
                            type="select" 
                            className="custom-select form-control" 
                            name="stress"
                            value={this.state.stress}
                            onChange={this.handleChange}>
                                <option value="select">select</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </Input>
                          </FormGroup>

                          <FormGroup>
                            <Label className="padding">Are you sick today?</Label>
                            <Input 
                            type="select" 
                            className="custom-select form-control" 
                            id="sick_select"
                            name="sick"
                            value={this.state.sick}
                            onChange={this.handleChangeSick}>
                                <option value="select">select</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </Input>
                          </FormGroup>

                          <div id="sickModal"></div>

                          <FormGroup>
                            <Label className="padding">Were you fasted during workout </Label>
                                <Input 
                                type="select" 
                                className="custom-select form-control" 
                                name="fasted"
                                value={this.state.fasted}
                                onChange={this.handleChangeFasted}>
                                    <option value="select">select</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </Input>
                          </FormGroup>

                          <div id="fastedModal"></div>

                          <FormGroup>      
                            <Label className="padding">General workout comments</Label>
                               <Input type="textarea" name="workout_comment" 
                               placeholder="please leave a comment" 
                               className="form-control"
                               rows="5" columns="5" 
                               value={this.state.workout_comment}
                               onChange={this.handleChange}/>
                          </FormGroup>

                          <FormGroup>      
                            <Label className="padding">Approximately how many calories did you consume during your workout?</Label>
                               <Input type="number" name="calories" 
                               value={this.state.calories}
                               onChange={this.handleChange}/>
                          </FormGroup>

                          <FormGroup>      
                            <Label className="padding">What item you consumed?</Label>
                            <Input type="textarea" name="calories_item" 
                            className="form-control"
                            rows="5" columns="5" 
                            value={this.state.calories_item}
                            onChange={this.handleChange}/>
                          </FormGroup>

                          <FormGroup>
                            <Label className="padding">How much time did you Sleep last night (excluding awake time)?</Label>
                            <Input type="text" name="sleep_last_night"
                            className="form-control" placeholder="5:10" 
                            value={this.state.sleep_last_night}
                            onChange={this.handleChange}/>
                          </FormGroup>

                          <FormGroup>
                             <Label className="padding">Did you take any prescription or non prescription sleep aids last night?</Label>
                              <Input 
                              type="select" 
                              className="custom-select form-control" 
                              id="prescription_select" 
                              name="prescription_sleep_aids"
                              value={this.state.prescription_sleep_aids}>
                                  <option value="select">Select</option>
                                  <option value="yes">Yes</option>
                                  <option value="no">No</option>
                              </Input>
                          </FormGroup>

                          <FormGroup>
                            <Label className="padding">Did you smoke any substances whatsover?</Label>
                            <Input 
                            type="select" 
                            className="custom-select form-control" 
                            name="smoke_substances"
                            value={this.state.smoke_substances}>
                                    <option value="select">select</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                            </Input>       
                          </FormGroup>

                           <FormGroup>
                              <Label className="padding">Did you ingest any prescription or non prescription medications/controlled yesterday?</Label>
                              <Input 
                              type="select" 
                              className="custom-select form-control" 
                              name="medications"
                              value={this.state.medications}>
                                      <option value="select">select</option>
                                      <option value="yes">Yes</option>
                                      <option value="no">No</option>
                              </Input>
                          </FormGroup>

                          <FormGroup>     
                            <Label className="padding">Did you stand for 3 hours yesterday when you worked </Label>
                            <Input 
                            type="select" 
                            className="custom-select form-control"  
                            name="stand"
                            value={this.state.stand}
                            onChange={this.handleChange}>
                                <option value="select">select</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </Input>
                          </FormGroup>

                          <FormGroup>
                            <Label className="padding">List of processed food consumed yesterday</Label>
                            <Input 
                            type="textarea" 
                            className="form-control" 
                            placeholder="Enter processed items consumed" 
                            name="food_consumed"
                            value={this.state.food_consumed}
                            onChange={this.handleChange} />
                          </FormGroup>
                          
                          <FormGroup>
                            <Label className="padding">Weight (pounds)</Label>
                                <Input type="number" 
                                   className="custom-select form-control"
                                   name="weight"
                                   min="30"
                                   max="500" 
                                   value={this.state.weight}
                                   onChange={this.handleChange}
                                />
                          </FormGroup>

                          <FormGroup>       
                            <Label className="padding">Waist size (Male)</Label>
                            <Input 
                              type="number" 
                              className="form-control" 
                              placeholder="Between 20 - 60"
                              name="waist"
                              min="20" max="60" step="1"
                              value={this.state.waist}
                              onChange={this.handleChange}>
                            </Input>
                          </FormGroup>

                          <FormGroup>
                            <Label className="padding">Clothes Size (Womens)</Label>
                            <Input 
                              type="number" 
                              className="form-control"
                              placeholder="Between 0 - 16" 
                              name="clothes_size"
                              min="0" max="16" step="1"
                              value={this.state.clothes_size}
                              onChange={this.handleChange}>
                            </Input>
                          </FormGroup>

                          <FormGroup>
                              <Label className="padding">Heart rate variability</Label>
                              <Input
                                type="number"
                                className="form-control"
                                name="heart_variability"
                                min="0" max="100" step="10"
                                value={this.state.heart_variability}
                                onChange={this.handleChange}
                              />
                          </FormGroup>

                          <FormGroup>
                              <Label className="padding">What type of diet do you eat?</Label>
                              <Input 
                              type="select" 
                              className="custom-select form-control" 
                              name="diet_type"
                              value={this.state.diet_type}>
                                      <option value="select">select</option>
                                      <option value="vegan">Vegan</option>
                                      <option value="vegetarian">Vegetarian</option>
                                      <option value="paleo">Paleo</option>
                                      <option value="low carb/high fat">Low carb/High fat</option>
                                      <option value="">None</option>
                                      <option value="other">Other</option>
                              </Input>
                          </FormGroup>

                          <FormGroup>         
                            <Label className="padding">What % did you breath through your nose last night when you were asleep?</Label>
                            <Input 
                              type="number" 
                              className="form-control" 
                              name="breath_sleep"
                              min="0" max="100" step="10"
                              value={this.state.breath_sleep}
                              onChange={this.handleChange}
                            />
                         </FormGroup>

                          <FormGroup>
                              <Label className="padding">What % did you breath through your nose throughtout the day when you were not exercising?</Label>
                              <Input 
                                type="number" 
                                className="form-control" 
                                name="breath_day"
                                min="0" max="0" step="10" 
                                value={this.state.breath_day}
                                onChange={this.handleChange}
                              />
                          </FormGroup>

                        <Button 
                          type="submit"
                          color="info" 
                          className="btn btn-block btn-primary">
                            Submit
                        </Button>

                    </Form>
                    </div>
                 </div>
                </Container>
            </div>
        );
    }
}

export default UserInputs;