import React from 'react';
import ReactDOM from 'react-dom';

import CalendarWidget from 'react-calendar-widget';

import { Container, Select, option, Option, Row, Col, Button, Form,
         FormGroup, Label, Input, FormText, className } from 'reactstrap';

import {userDailyInputSend} from '../network/userInput';
class UserInputs extends React.Component{

    constructor(props){
      super(props);
      // default dis current date
      this.state = {
        selected_date:new Date()
      }
      this.onSubmit = this.onSubmit.bind(this);
      this.processDate = this.processDate.bind(this);
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
      userDailyInputSend(form_values,this.reset_form).bind(this);
      this.input_form.reset();
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
                        <Label className="padding">Was your workout easy or hard</Label>
                          <Input type="select" className="custom-select form-control" name="work_out_easy">
                                <option value="select">select</option>
                                <option value="Easy">Easy</option>
                                <option value="Hard">Hard</option>
                          </Input>  
                          </FormGroup> 
                          <FormGroup>   
                        <Label className="padding">Workout Effort Level</Label>
                          <Input type="select" className="custom-select form-control" name="workout_effort" >
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
                          </FormGroup>
                          <FormGroup>
                        <Label className="padding"> how much % unprocessed food consumed yesterday?</Label>
                            <Input
                            type="number" 
                            className="form-control" 
                            name="unprocessed_food"
                            step="5" min="0" max="100" />
                          </FormGroup>  
                          <FormGroup>
                               <Label className="padding">Number of Alchol Drinks consumed yesterday?</Label>
                                 <Input type="select" className="custom-select form-control" name="alchol_consumed">
                                    <option value="">select</option>
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
                                    <option value="10">3</option>
                            </Input>
                          </FormGroup>
                          <FormGroup>
                              <Label className="padding">Sleep aids last night?</Label>
                                <Input type="select" className="custom-select form-control" id="sleep_aids_select" name="sleep_aids">
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </Input>

                               <Label className="padding">Did you take any prescription or non prescription sleep aids last night?</Label>
                                <Input type="select" className="custom-select form-control" id="prescription_select" name="prescription_sleep_aids">
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </Input>

                            {/* <!-- Hidden fields --> */}
                            <div className="prescription_hidden_fields">

                             <Label className="padding">Did you smoke any substances whatsover</Label>
                                <Input type="select" className="custom-select form-control" name="substances">
                                        <option value="">select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                </Input>


                           <Label className="padding">Did you ingest any prescription or non prescription medications</Label>
                                <Input type="select" className="custom-select form-control" name="medications">
                                        <option value="">select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                </Input>
                                
                           </div>
                          </FormGroup>

                          <FormGroup>
                             <Label className="padding">Yesterday Stress Level</Label>
                                <Input type="select" className="custom-select form-control" name="stress">
                                    <option value="select">select</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </Input>
                            <Label className="padding">Did you have any pain or twinges during or after your workout</Label>
                                <Input type="select" className="custom-select form-control" id="pain_select" name="pain_select">
                                    <option value="select">select</option>
                                    <option value="Yes">Yes</option>
                                    <option vlaue="No">No</option>
                                </Input>

                            {/* <!-- hidden fields --> */}
                        
                          <div className="pain_hidden_fields">
                             <Label className="padding">Select the pain is from below dropdown</Label>
                                <Input type="select" className="custom-select form-control" name="pain" >
                                    <option value="select">select</option>
                                    <option value="neck">neck</option>
                                    <option value="leg">leg</option>
                                </Input>
                          </div>
                          </FormGroup>
                          <FormGroup>
                              
                        <Label className="padding">Water Consumed During Workout(ounce)</Label>
                            <Input type="number" 
                                   className="custom-select form-control" 
                                   name="water_consumed"
                                   min="1" max="250"
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label className="padding">How Much % Workout that User breathed in and out through nose</Label>
                                <Input type="number" step="10"
                                 className="form-control" 
                                 name="nose"
                                 min="0"
                                 max="100"/>
                          </FormGroup>
                          <FormGroup>
                             <Label className="padding">Are you sick today?</Label>
                                <Input type="select" className="custom-select form-control" id="sick_select"name="sick">
                                    <option value="">select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </Input>
                            {/* <!-- hidden fields --> */}
                            <div className="sick_hidden_fields">
                            <Input type="textarea" name="sick_comment" rows="5" columns="5" className="form-control" placeholder="type here your illness" />
                            </div>
                            {/* <!-- end of hidden files --> */}
                          </FormGroup>
                          <FormGroup>
                                 
                        <Label className="padding">Did you stand for 3 hours yesterday when you worked </Label>
                            <Input type="select" className="custom-select form-control" id="sick_select" name="stand">
                                <option value="">select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </Input>
                          </FormGroup>
                          <FormGroup>
                              
                       <Label className="padding">List of processed food consumed yesterday</Label>
                            <Input type="textarea" className="form-control" placeholder="Enter processed items consumed" name="food_consumed" />

                          </FormGroup>
                          <FormGroup>
                              
                        <Label className="padding">Tablespoons of chia seeds consumed during workout ?</Label>
                            <Input type="select" className="custom-select form-control" name="chia_seeds">
                                <option value="select">select</option>
                                <option value="0">0</option>
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
                          <FormGroup>
                            <Label className="padding">Were you fasted during workout </Label>
                                <Input type="select" className="custom-select form-control" name="fasted">
                                    <option value="select">select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </Input>
                          </FormGroup>
                          <FormGroup>      
                            <Label className="padding">General workout comments</Label>
                               <Input type="textarea" name="comment" 
                               placeholder="please leave a comment" 
                               className="form-control"
                               rows="5" columns="5" />
                          </FormGroup>
                          <FormGroup>
                            <Label className="padding">Weight (pounds)</Label>
                                <Input type="number" 
                                       className="custom-select form-control"
                                       name="weight"
                                       min="30"
                                       max="500" 
                                />
                          </FormGroup>
                          <FormGroup>
                               
                        <Label className="padding">Waist size (Male)</Label>
                            <Input type="select" className="custom-select form-control" name="waist">
                                <option value="select">select</option>
                                <option value="20">20</option>
                                <option value="22">22</option>
                                <option value="24">24</option>
                                <option value="26">26</option>
                                <option value="28">28</option>
                                <option value="30">30</option>
                                <option value="32">32</option>
                                <option value="34">34</option>
                                <option value="36">36</option>
                                <option value="38">38</option>
                                <option value="40">40</option>
                                <option value="42">42</option>
                                <option value="44">44</option>
                                <option value="46">46</option>
                                <option value="48">48</option>
                                <option value="50">50</option>
                                <option value="52">52</option>
                                <option value="54">54</option>
                                <option value="56">56</option>
                                <option value="58">58</option>
                                <option value="60">60</option>
                            </Input>
                          </FormGroup>
                          <FormGroup>
                              <Label className="padding">Clothes Size (Womens)</Label>
                                <Input type="select" className="custom-select form-control" name="clothes">
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
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                    <option value="13">13</option>
                                    <option value="14">14</option>
                                    <option value="15">15</option>
                                </Input>
                          </FormGroup>
                          <FormGroup>
                             <Label className="padding">Heart rate variability</Label>
                                <Input
                                  type="number"
                                  className"form-control"
                                  name="heart"
                                  min="0" max="100" step="10"

                                />
                          </FormGroup>
                          <FormGroup>         
                            <Label className="padding">What % did you breath through your nose last night when you were asleep?</Label>
                                <Input 
                                  type="number" 
                                  className="form-control" 
                                  name="breath_sleep"
                                  min="0" max="100" step="10"
                                />
                         </FormGroup>
                          <FormGroup>
                              <Label className="padding">What % did you breath through your nose throughtout the day when you were not exercising?</Label>
                                <Input 
                                  type="text" 
                                  className="form-control" 
                                  name="breath_day"
                                  min="0" max="0" step="10" 
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