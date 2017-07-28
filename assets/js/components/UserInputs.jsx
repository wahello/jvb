import React from 'react';

import { Container, Select, option, Option, Row, Col, Button, Form, FormGroup, Label, Input, FormText, className } from 'reactstrap';

import Navbar from '../components/navbar';
class UserInputs extends React.Component{
    render(){
         console.log('i am in the render for userinputs');
        return(
            <div>
                <Navbar />
                <Container>
                    <div className="row justify-content-center">
                    <div className="col-md-8  col-sm-12">
                        <h2 className="head">Daily user inputs report</h2>
                        <Form className="user-inputs-form bootstrap_validator" role="form" data-toggle="validator">
                         <FormGroup>   
                        <Label className="padding">Was your workout easy or hard</Label>
                          <Input type="select" className="custom-select form-control" name="work_out_easy" multiple>
                                <option value="">select</option>
                                <option value="1">Easy</option>
                                <option value="2">Hard</option>
                          </Input>  
                          </FormGroup> 
                          <FormGroup>   
                        <Label className="padding">Workout Effort Level</Label>
                          <Input type="select" className="custom-select form-control" name="" multiple>
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
                            <Input type="select" className="custom-select form-control" name="unprocessed_food" multiple>
                                <option value="">select</option>
                                <option value="1">0%</option>
                                <option value="2">1%</option>
                                <option value="3">2%</option>
                                <option value="4">3%</option>
                                <option value="5">5%</option>
                                <option value="6">6%</option>
                                <option value="7">7%</option>
                            </Input>
                          </FormGroup>  
                          <FormGroup>
                               <Label className="padding">Number of Alchol Drinks consumed yesterday?</Label>
                                 <Input type="select" className="form-control" name="alchol_consmumed" multiple>
                                    <option value="">select</option>
                                    <option value="1">0.5</option>
                                    <option value="2">1</option>
                                    <option value="3">1.5</option>
                                    <option value="4">2</option>
                                    <option value="5">2.5</option>
                                    <option value="6">3</option>
                                    <option value="7">3.5</option>
                            </Input>
                          </FormGroup>
                          <FormGroup>
                               <Label className="padding">Did you take any prescription or non prescription sleep aids last night?</Label>
                                <Input type="select" className="custom-select form-control" id="prescription_select" name="sllep_aids" multiple >
                                    <option value="">Select</option>
                                    <option value="1">Yes</option>
                                    <option value="2">No</option>
                                </Input>

                            {/* <!-- Hidden fields --> */}
                            <div className="prescription_hidden_fields">

                             <Label className="padding">Did you smoke any substances whatsover</Label>
                                <Input type="select" className="custom-select form-control" name="substances" multiple>
                                        <option value="">select</option>
                                        <option value="1">Yes</option>
                                        <option value="2">No</option>
                                </Input>


                           <Label className="padding">Did you ingest any prescription or non prescription medications</Label>
                                <Input type="select" className="custom-select form-control" name="medications" multiple>
                                        <option value="">select</option>
                                        <option value="1">Yes</option>
                                        <option value="2">No</option>
                                </Input>
                                
                           </div>
                          </FormGroup>

                          <FormGroup>
                             <Label className="padding">Yesterday Stress Level</Label>
                                <Input type="select" className="custom-select form-control" name="stress" multiple>
                                    <option value="select">select</option>
                                    <option value="1">Low</option>
                                    <option value="2">Medium</option>
                                    <option value="3">High</option>
                                </Input>
                            <Label className="padding">Did you have any pain or twinges during or after your workout</Label>
                                <Input type="select" className="custom-select form-control" id="pain_select" name="pain_select" multiple>
                                    <option value="select">select</option>
                                    <option value="1">Yes</option>
                                    <option vlaue="2">No</option>
                                </Input>

                            {/* <!-- hidden fields --> */}
                        
                          <div className="pain_hidden_fields">
                             <Label className="padding">Select the pain is from below dropdown</Label>
                                <Input type="select" className="custom-select form-control" name="pain" multiple>
                                    <option value="select">select</option>
                                    <option value="">neck</option>
                                    <option value="">leg</option>
                                </Input>
                          </div>
                          </FormGroup>
                          <FormGroup>
                              
                        <Label className="padding">Water Consumed During Workout</Label>
                            <Input type="select" className="custom-select form-control" name="water_consumed" multiple>
                                <option value="select">select</option>
                                <option value="">0 ounces</option>
                                <option value="">1 ounces</option>
                                <option value="">2 ounces</option>
                                <option value="">3 ounces</option>
                                <option value="">4 ounces</option>
                                <option value="">5 ounces</option>
                                <option value="">6 ounces</option>
                                <option value="">7 ounces</option>
                            </Input>
                          </FormGroup>
                          <FormGroup>
                            <Label className="padding">How Much % Workout that User breathed in and out through nose</Label>
                                <Input type="select" className="custom-select form-control" name="nose" multiple>
                                    <option value="select">select</option>
                                    <option value="">1%</option>
                                    <option value="">2%</option>
                                    <option value="">3%</option>
                                    <option value="">4%</option>
                                    <option value="">5%</option>
                                    <option value="">6%</option>
                                    <option value="">7%</option>
                                    <option value="">8%</option>
                                    <option value="">9%</option>
                                    <option value="">10%</option>
                                </Input>
                          </FormGroup>
                          <FormGroup>
                             <Label className="padding">Are you sick today?</Label>
                                <Input type="select" className="custom-select form-control" id="sick_select"name="sick" multiple>
                                    <option value="">select</option>
                                    <option value="1">Yes</option>
                                    <option value="2">No</option>
                                </Input>
                            {/* <!-- hidden fields --> */}
                            <div className="sick_hidden_fields">
                            <Input type="textarea" name="sick_comment" rows="5" columns="5" className="form-control" placeholder="type here your illness" />
                            </div>
                            {/* <!-- end of hidden files --> */}
                          </FormGroup>
                          <FormGroup>
                                 
                        <Label className="padding">Did you stand for 3 hours yesterday when you worked </Label>
                            <Input type="select" className="custom-select form-control" id="sick_select" name="stand" multiple>
                                <option value="">select</option>
                                <option value="1">Yes</option>
                                <option value="2">No</option>
                            </Input>
                          </FormGroup>
                          <FormGroup>
                              
                       <Label className="padding">List of processed food consumed yesterday</Label>
                            <Input type="textarea" className="form-control" placeholder="Enter processed items consumed" name="food_consumed" />

                          </FormGroup>
                          <FormGroup>
                              
                        <Label className="padding">Tablespoons of chia seeds consumed during workout ?</Label>
                            <Input type="select" className="custom-select form-control" name="chia_seeds" multiple>
                                <option value="select">select</option>
                                <option value="">1</option>
                                <option value="">2</option>
                                <option value="">3</option>
                                <option value="">4</option>
                                <option value="">5</option>
                                <option value="">6</option>
                                <option value="">7</option>
                                <option value="">8</option>
                                <option value="">9</option>
                                <option value="">10</option>
                                <option value="">11</option>
                                <option value="">12</option>
                                <option value="">13</option>
                                <option value="">14</option>
                                <option value="">15</option>
                                <option value="">16</option>
                                <option value="">17</option>
                                <option value="">18</option>
                                <option value="">19</option>
                                <option value="">20</option>
                            </Input>
                          </FormGroup>
                          <FormGroup>
                            <Label className="padding">Were you fasted during workout </Label>
                                <Input type="select" className="custom-select form-control" name="fasted" multiple>
                                    <option value="select">select</option>
                                    <option value="">Yes</option>
                                    <option value="">No</option>
                                </Input>
                          </FormGroup>
                          <FormGroup>      
                            <Label className="padding">General workout comments</Label>
                               <Input type="text" name="comment" placeholder="please leave a comment" className="form-control" />
                          </FormGroup>
                          <FormGroup>
                            <Label className="padding">Weight</Label>
                                <Input type="select" className="custom-select form-control" name="weight" multiple>
                                    <option value="select">select</option>
                                    <option value="">30 pounds</option>
                                    <option value="">40 pounds</option>
                                    <option value="">50 pounds</option>
                                    <option value="">60 pounds</option>
                                    <option value="">70 pounds</option>
                                    <option value="">80 pounds</option>
                                    <option value="">90 pounds</option>
                                    <option value="">100 pounds</option>
                                    <option value="">110 pounds</option>
                                    <option value="">120 pounds</option>
                                    <option value="">130 pounds</option>
                                    <option value="">140 pounds</option>
                                    <option value="">150 pounds</option>
                                    <option value="">160 pounds</option>
                                    <option value="">170 pounds</option>
                                </Input>
                          </FormGroup>
                          <FormGroup>
                               
                        <Label className="padding">Waist size (Male)</Label>
                            <Input type="select" className="custom-select form-control" name="waist" multiple>
                                <option value="select">select</option>
                                <option value="">20</option>
                                <option value="">22</option>
                                <option value="">24</option>
                                <option value="">26</option>
                                <option value="">28</option>
                                <option value="">30</option>
                                <option value="">32</option>
                                <option value="">34</option>
                                <option value="">36</option>
                                <option value="">38</option>
                                <option value="">40</option>
                                <option value="">42</option>
                                <option value="">44</option>
                                <option value="">46</option>
                                <option value="">48</option>
                                <option value="">50</option>
                                <option value="">52</option>
                                <option value="">54</option>
                                <option value="">56</option>
                                <option value="">58</option>
                                <option value="">60</option>
                            </Input>
                          </FormGroup>
                          <FormGroup>
                              <Label className="padding">Clothes Size (Womens)</Label>
                                <Input type="select" className="custom-select form-control" name="clothes" multiple>
                                    <option value="select">select</option>
                                    <option value="">1</option>
                                    <option value="">2</option>
                                    <option value="">3</option>
                                    <option value="">4</option>
                                    <option value="">5</option>
                                    <option value="">6</option>
                                    <option value="">7</option>
                                    <option value="">8</option>
                                    <option value="">9</option>
                                    <option value="">10</option>
                                    <option value="">11</option>
                                    <option value="">12</option>
                                    <option value="">13</option>
                                    <option value="">14</option>
                                    <option value="">15</option>
                                </Input>
                          </FormGroup>
                          <FormGroup>
                             <Label className="padding">Heart rate variability</Label>
                                <Input type="select" className="custom-select form-control" name="heart" multiple>
                                    <option value="select">select</option>
                                    <option value="">1</option>
                                    <option value="">2</option>
                                    <option value="">3</option>
                                    <option value="">4</option>
                                    <option value="">5</option>
                                    <option value="">6</option>
                                    <option value="">7</option>
                                    <option value="">8</option>
                                    <option value="">9</option>
                                    <option value="">10</option>
                                    <option value="">11</option>
                                    <option value="">12</option>
                                    <option value="">13</option>
                                    <option value="">14</option>
                                    <option value="">15</option>
                                    <option value="">16</option>
                                    <option value="">17</option>
                                    <option value="">18</option>
                                    <option value="">19</option>
                                    <option value="">20</option>
                                </Input>  
                          </FormGroup>
                          <FormGroup>         
                            <Label className="padding">What % did you breath through your nose last night when you were a sleep?</Label>
                                <Input type="select" className="custom-select form-control" name="breath_sleep" multiple>
                                    <option value="select">select</option>
                                    <option value="">0%</option>
                                    <option value="">1%</option>
                                    <option value="">2%</option>
                                    <option value="">3%</option>
                                    <option value="">4%</option>
                                    <option value="">5%</option>
                                    <option value="">6%</option>
                                </Input>
                          </FormGroup>
                          <FormGroup>
                              <Label className="padding">What % did you breath through your nose throughtout the day when you were not exercising?</Label>
                                <Input type="select" className="custom-select form-control" name="breath_day" multiple>
                                    <option value="select">select</option>
                                    <option value="">0%</option>
                                    <option value="">1%</option>
                                    <option value="">2%</option>
                                    <option value="">3%</option>
                                    <option value="">4%</option>
                                    <option value="">5%</option>
                                    <option value="">6%</option>
                                </Input>  
                          </FormGroup>
                        <Button type="submit" color="info" className="btn btn-block btn-primary">Submit</Button>
                    </Form>
                    </div>
                 </div>
                </Container>
            </div>
        );
    }
}

export default UserInputs;