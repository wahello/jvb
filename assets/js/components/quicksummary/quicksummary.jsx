import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Table,Button,Form, FormGroup, Label, Input, FormText,Popover,PopoverBody,Nav, 
	     NavItem, NavLink, Collapse, Navbar, NavbarToggler, 
         NavbarBrand,Container } from "reactstrap";
import axios from 'axios';
import FontAwesome from "react-fontawesome";
import CalendarWidget from 'react-calendar-widget';
import axiosRetry from 'axios-retry';
import moment from 'moment';

import {getInitialState} from './initialState';
import {renderQlFetchOverlay,renderQlCreateOverlay} from './helpers';
import {quicksummaryDate,userInputDate,createQuicklook}  from '../../network/quick';


import NavbarMenu from '../navbar';
import { Alert } from 'reactstrap';
import Grades from './quicksummary_grades';
import Swim from './quicksummary_swim';
import Bike from './quicksummary_bike';
import Steps from './quicksummary_steps';
import Sleep from './quicksummary_sleep';
import Food from './quicksummary_food';  
import Alcohol from './quicksummary_alocohol';
import Exercise from './quicksummary_exercise';
import User from './user_inputs'; 
import AllStats1 from './quicksummary_allstats1'; 



axiosRetry(axios, { retries: 3});


var ReactDOM = require('react-dom');


class Quicklook extends Component{

	constructor(props){
		super(props);

		this.successquick = this.successquick.bind(this);
		this.errorquick = this.errorquick.bind(this);
		this.userInputFetchSuccess = this.userInputFetchSuccess.bind(this);
		this.userInputFetchFailure = this.userInputFetchFailure.bind(this);
		this.processDate = this.processDate.bind(this);
		this.onDismiss = this.onDismiss.bind(this);
		this.updateDateState=this.updateDateState.bind(this);
		this.onSubmitDate=this.onSubmitDate.bind(this);
		this.handleChange=this.handleChange.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.toggleCalendar=this.toggleCalendar.bind(this);
		this.toggle = this.toggle.bind(this);
		this.handleCreateQuicklook = this.handleCreateQuicklook.bind(this);
		this.onQuicklookSuccess = this.onQuicklookSuccess.bind(this);
		this.onQuicklookFailure = this.onQuicklookFailure.bind(this);
		this.renderQlFetchOverlay = renderQlFetchOverlay.bind(this);
		this.renderQlCreateOverlay = renderQlCreateOverlay.bind(this);
		
		let initial_state = getInitialState(moment().subtract(7,'days'),
											moment());   

		this.state = {
			today_date:moment(),
			start_date:moment().subtract(7,'days'),
			end_date:moment(),
			visible: true,
			error:false,
			calendarOpen:false,
			scrollingLock: false,
			isOpen: false,
			activeTab : 'allstats1',
			fetching_ql:false,
			creating_ql:false,
			userInputData:{},
			data:initial_state
		};
	}

	updateDateState(data){
       			var properties={
       			created_at:data.created_at,
				grades_ql: {
			        id: data.grades_ql.id,
			        user_ql: data.grades_ql.user_ql,
			        overall_truth_grade: data.grades_ql.overall_truth_grade,
			        overall_truth_health_gpa: data.grades_ql.overall_truth_health_gpa,
			        movement_non_exercise_steps_grade: data.grades_ql.movement_non_exercise_steps_grade,   
			        movement_consistency_grade: data.grades_ql.movement_consistency_grade,
			        avg_sleep_per_night_grade: data.grades_ql.avg_sleep_per_night_grade,
			        exercise_consistency_grade: data.grades_ql.exercise_consistency_grade,
			        overall_workout_grade: data.grades_ql.overall_workout_grade,
			        prcnt_unprocessed_food_consumed_grade: data.grades_ql.prcnt_unprocessed_food_consumed_grade,
			        alcoholic_drink_per_week_grade: data.grades_ql.alcoholic_drink_per_week_grade,
			        penalty:data.grades_ql.penalty		
	    		},

			    exercise_reporting_ql: {
			        id:data.exercise_reporting_ql.id,
			        user_ql: data.exercise_reporting_ql.user_ql,
			        workout_easy_hard: data.exercise_reporting_ql.workout_easy_hard,
			        workout_type:data.exercise_reporting_ql.workout_type,
			        workout_time: data.exercise_reporting_ql.workout_time,
			        workout_location:data.exercise_reporting_ql.workout_location,
			        workout_duration: data.exercise_reporting_ql.workout_duration,
			        maximum_elevation_workout:data.exercise_reporting_ql.maximum_elevation_workout,
			        minutes_walked_before_workout:data.exercise_reporting_ql.minutes_walked_before_workout,
			        distance:data.exercise_reporting_ql.distance,
			        pace: data.exercise_reporting_ql.pace,
			        avg_heartrate: data.exercise_reporting_ql.avg_heartrate,
			        elevation_gain: data.exercise_reporting_ql.elevation_gain,
			        elevation_loss: data.exercise_reporting_ql.elevation_loss,
			        effort_level: data.exercise_reporting_ql.effort_level,
			        dew_point: data.exercise_reporting_ql.dew_point,
			        temperature: data.exercise_reporting_ql.temperature,
			        humidity: data.exercise_reporting_ql.humidity,
			        temperature_feels_like: data.exercise_reporting_ql.temperature_feels_like,  
			        wind:data.exercise_reporting_ql.wind,
			        hrr: data.exercise_reporting_ql.hrr,
			        hrr_start_point: data.exercise_reporting_ql.hrr_start_point,
			        hrr_beats_lowered:data.exercise_reporting_ql.hrr_beats_lowered,
			        sleep_resting_hr_last_night:data.exercise_reporting_ql.sleep_resting_hr_last_night,
			        vo2_max:data.exercise_reporting_ql.vo2_max,
			        running_cadence: data.exercise_reporting_ql.running_cadence,
			        nose_breath_prcnt_workout: data.exercise_reporting_ql.nose_breath_prcnt_workout,
			        water_consumed_workout: data.exercise_reporting_ql.water_consumed_workout,
			        chia_seeds_consumed_workout: data.exercise_reporting_ql. chia_seeds_consumed_workout,
			        fast_before_workout: data.exercise_reporting_ql.fast_before_workout,
			        pain: data.exercise_reporting_ql.pain,
			        pain_area: data.exercise_reporting_ql.pain_area,
			        stress_level: data.exercise_reporting_ql.stress_level,
			        sick: data.exercise_reporting_ql.sick,
			        drug_consumed: data.exercise_reporting_ql.drug_consumed,
			        drug: data.exercise_reporting_ql.drug,
			        medication: data.exercise_reporting_ql.medication,
			        smoke_substance: data.exercise_reporting_ql.smoke_substance,
			        exercise_fifteen_more: data.exercise_reporting_ql.exercise_fifteen_more,
			        workout_elapsed_time: data.exercise_reporting_ql.workout_elapsed_time,
			        timewatch_paused_workout: data.exercise_reporting_ql.timewatch_paused_workout,
			        exercise_consistency:data.exercise_reporting_ql.exercise_consistency,
			        workout_duration_grade: data.exercise_reporting_ql.workout_duration_grade,
			        workout_effortlvl_grade: data.exercise_reporting_ql.workout_effortlvl_grade,
			        avg_heartrate_grade: data.exercise_reporting_ql.avg_heartrate_grade,
			        overall_workout_grade: data.exercise_reporting_ql.overall_workout_grade,
			        heartrate_variability_grade: data.exercise_reporting_ql.heartrate_variability_grade,
			        workout_comment:data.exercise_reporting_ql.workout_comment
			    },
			    swim_stats_ql: {
			        id: data.swim_stats_ql.id,
			        user_ql: data.swim_stats_ql.user_ql,
			        pace_per_100_yard: data.swim_stats_ql.pace_per_100_yard,
			        total_strokes: data.swim_stats_ql.total_strokes
			    },
			     "bike_stats_ql": {
			        id: data.bike_stats_ql.id,
			        user_ql: data.bike_stats_ql.user_ql,
			        avg_speed: data.bike_stats_ql.avg_speed,
			        avg_power: data.bike_stats_ql.avg_power,
			        avg_speed_per_mile: data.bike_stats_ql.avg_speed_per_mile,
			        avg_cadence: data.bike_stats_ql.avg_cadence
			    },
			    "steps_ql": {
			        "id": data.steps_ql.id,
			        "user_ql": data.steps_ql.user_ql,
			        "non_exercise_steps": data.steps_ql.non_exercise_steps,
			        "exercise_steps": data.steps_ql.exercise_steps,
			        "total_steps": data.steps_ql.total_steps,
			        "floor_climed": data.steps_ql.floor_climed,
			        "floor_decended": data.steps_ql.floor_decended,
			        "movement_consistency": data.steps_ql.movement_consistency
			    },

			    sleep_ql: {
			        id: data.sleep_ql.id,
			        user_ql: data.sleep_ql.user_ql,
			        sleep_per_wearable: data.sleep_ql.sleep_per_wearable,
			        sleep_per_user_input: data.sleep_ql.sleep_per_user_input,
			        sleep_aid: data.sleep_ql.sleep_aid,
			        sleep_bed_time: data.sleep_ql.sleep_bed_time,
			        sleep_awake_time: data.sleep_ql.sleep_awake_time,
			        deep_sleep: data.sleep_ql.deep_sleep,
			        light_sleep: data.sleep_ql.light_sleep,
			        awake_time: data.sleep_ql.awake_time   
			    },
			    food_ql: {
			        id: data.food_ql.id,
			        user_ql: data.food_ql.user_ql,
			        prcnt_non_processed_food: data.food_ql.prcnt_non_processed_food,
			        prcnt_non_processed_food_grade: data.food_ql.prcnt_non_processed_food_grade,
			        non_processed_food: data.food_ql.non_processed_food,
			        diet_type: data.food_ql.diet_type
			    },
			    alcohol_ql: {
			        id: data.alcohol_ql.id,
			        user_ql: data.alcohol_ql.user_ql,
			        alcohol_day: data.alcohol_ql.alcohol_day,
			        alcohol_week: data.alcohol_ql.alcohol_week
			    }
             };
             return properties;
       		}

	successquick(data,start_dt,end_dt){
		const dates = [];
		let initial_state = getInitialState(start_dt,end_dt);
		for(let date of Object.keys(initial_state)){
			dates.push(date);
		} 
         if (data.data.length > 0){
		 	 for(var dataitem of data.data){
		      	const date = dataitem.created_at;
		      	let obj = this.updateDateState(dataitem);
		      	initial_state[date] = obj;
		      }
		      this.setState({
				data:initial_state,
				visible:false,
				fetching_ql:false,
				error:true
			});
	     }
	     else{
	     		this.setState({
				data:initial_state,
				visible:true,
				fetching_ql:false,
				error:false
			});
	     }
	}

	errorquick(error){
		console.log(error.message);
		this.setState({
			error:true,
			fetching_ql:false
		});
	}

	userInputFetchSuccess(data){
		this.setState({
			userInputData:data
		});
	}

	userInputFetchFailure(error){
		console.log(error.message);
		this.setState({
			userInputData:{}
		});
	}

	

	processDate(date){
		let end_dt = moment(date);
		let start_dt = moment(date).subtract(7,'days');
		this.setState({
			start_date : start_dt,
			end_date : end_dt,
			fetching_ql:true
		},()=>{
			quicksummaryDate(this.state.start_date, this.state.end_date, this.successquick,this.errorquick);
			userInputDate(this.state.start_date, this.state.end_date, this.userInputFetchSuccess,
						  this.userInputFetchfailure);
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
  
  onSubmitDate(event){
  	event.preventDefault();
  	let start_dt = moment(this.state.start_date);
  	let end_dt = moment(this.state.end_date);
  	this.setState({
			start_date : start_dt,
			end_date : end_dt,
			fetching_ql:true
		},()=>{
			quicksummaryDate(this.state.start_date, this.state.end_date, this.successquick,this.errorquick);
			userInputDate(this.state.start_date, this.state.end_date, this.userInputFetchSuccess,
						  this.userInputFetchfailure);
		});
  }

	componentDidMount(){
		quicksummaryDate(this.state.start_date, this.state.end_date, this.successquick,this.errorquick);
		userInputDate(this.state.start_date, this.state.end_date, this.userInputFetchSuccess,
					  this.userInputFetchfailure);
		 window.addEventListener('scroll', this.handleScroll);
	}
	onDismiss(){
		this.setState(
			{
				visible:false,
				error:false
		});
	}

	activateTab(tab,event){
		this.setState({
           activeTab:tab,
       });
	}

	componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
}

handleScroll() {

  if (window.scrollY >= 77 && !this.state.scrollingLock) {
    this.setState({
      scrollingLock: true
    });
  } else if(window.scrollY < 77 && this.state.scrollingLock) {
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
 toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
     
    });
  }

  onQuicklookSuccess(data,start_date,end_date){
  	console.log("quicklook created successfully");
  	this.successquick(data,start_date,end_date);
  	this.setState({
  		creating_ql:false
  	});
  }

  onQuicklookFailure(error){
  	console.log(error.message);
  	this.setState({
  		creating_ql:false
  	});
  }

  handleCreateQuicklook(){
  	this.setState({
  		creating_ql:true
  	},function(){
  		createQuicklook(this.state.start_date, this.state.end_date,
  					this.onQuicklookSuccess, this.onQuicklookFailure);
  	}.bind(this));
  }


	render(){
		const {activeTab}=this.state;
		const class_allstats1=`nav-link ${activeTab === "allstats1" ? 'active':''}`;
		const class_grade=`nav-link ${activeTab === "grade" ? 'active':''}`;
		const class_swim=`nav-link ${activeTab === "swim" ? 'active':''}`;
		const class_bike=`nav-link ${activeTab === "bike" ? 'active':''}`;
		const class_steps=`nav-link ${activeTab === "steps" ? 'active':''}`;
		const class_sleep=`nav-link ${activeTab === "sleep" ? 'active':''}`;
		const class_food=`nav-link ${activeTab === "food" ? 'active':''}`;
        const class_alcohol=`nav-link ${activeTab === "alcohol" ? 'active':''}`;
        const class_exercise=`nav-link ${activeTab === "exercise" ? 'active':''}`; 
        const class_user=`nav-link ${activeTab === "user" ? 'active':''}`;             
	return(
		<div>
		<div className="container-fluid">
		<NavbarMenu fix={false}/>
		</div>
		           	
					
			
			<div className="quick">
			       
                         
                      
						 <div id="quick1">
			                 <p>Quick Look</p>			                
			             </div>
			             

			             
			             
			             <div id="nav3">
			            <div className="nav2" style={{position: this.state.scrollingLock ? "fixed" : "relative"}}>			         
						  <Navbar light toggleable className="navbar nav2">
                                <NavbarToggler className="navbar-toggler hidden-sm-up" onClick={this.toggle}>
                                    <div className="toggler">
                                    <FontAwesome 
                                          name = "bars"
                                          size = "1x"
                                          
                                        />
                                    </div>
                               </NavbarToggler> 
                                  
                                  <span id="calendar1" 
                                  onClick={this.toggleCalendar}>
                                  <span id="spa" >
                                     <span id="navlink">
                                        <FontAwesome 
                                          name = "calendar"
                                          size = "1x"
                                          
                                        />
                                        </span>                                      
                                  </span>                                  
                                                                  
                                  </span>  

                                   <span className="btn2">
	                                  <Button						        
						         	   type="submit"
						               className="btn btn-block-lg btn-info"
						               onClick = {this.handleCreateQuicklook}>
							               Creat Quicklook
								      </Button>
                                   </span>
                               <Collapse className="navbar-toggleable-xs"  isOpen={this.state.isOpen} navbar>
                                  <Nav className="nav navbar-nav" navbar>
                                          <NavItem>
                                          <span id="spa">
                                            <abbr id="abbri"  title="All Stats">
                                              <NavLink  href="#" className={class_allstats1} value="allstats1"
						    								 onClick={this.activateTab.bind(this,"allstats1")}>
                                               All Stats
                                              </NavLink>
                                            </abbr>
                                            </span>
                                          </NavItem>

                                        <NavItem>
                                        <span id="spa">
                                          <abbr  id="abbri"  title="Grades">
                                            <NavLink href="#" className={class_grade} value="grade"
						    						 onClick={this.activateTab.bind(this,"grade")}>
                                             Grades
                                            </NavLink>
                                          </abbr>
                                          </span>
                                        </NavItem>

                                        <NavItem>
                                        <span id="spa">
                                          <abbr  id="abbri"  title="Nutrition and Lifestyle Inputs">
                                            <NavLink  href="#" className={class_swim}  value="swim"
						    						 onClick={this.activateTab.bind(this,"swim")}>
						    		 		Swim Stats
                                            </NavLink>
                                          </abbr>
                                          </span>
                                        </NavItem>

                                        <NavItem>
                                        <span id="spa">
                                          <abbr  id="abbri"  title="Bike">
                                            <NavLink href="#" className={class_bike} value="bike"
							    		 			onClick={this.activateTab.bind(this,"bike")}>
							    			 Bike Stats
                                            </NavLink>
                                          </abbr>
                                          </span>
                                        </NavItem>

                                        <NavItem>
                                        <span id="spa">
                                          <abbr  id="abbri"  title="Steps">
                                            <NavLink  href="#" className={class_steps}  value="steps"
						    		 				  onClick={this.activateTab.bind(this,"steps")}>
						    		 		Steps
                                            </NavLink>
                                          </abbr>
                                          </span>
                                       </NavItem>

                                        <NavItem>
                                        <span id="spa">
                                          <abbr  id="abbri"  title="Sleep">
                                            <NavLink href="#" className={class_sleep}  value="sleep"
						    		 				 onClick={this.activateTab.bind(this,"sleep")}>
						    				 Sleep 
                                            </NavLink>
                                          </abbr>
                                          </span>
                                       </NavItem>  

                                        <NavItem>
                                        <span id="spa">
                                          <abbr  id="abbri"  title="Food">
                                            <NavLink href="#" className={class_food}  value="food"
						    		 				 onClick={this.activateTab.bind(this,"food")}>
						    		 		Food
                                            </NavLink>
                                          </abbr>
                                          </span>
                                       </NavItem>  

                                        <NavItem>
                                        <span id="spa">
                                          <abbr  id="abbri"  title="Alcohol">
                                            <NavLink href="#" className={class_alcohol} value="alcohol"
						    		 				 onClick={this.activateTab.bind(this,"alcohol")}>
						    		 		 Alcohol 
                                            </NavLink>
                                          </abbr>
                                          </span>
                                       </NavItem>  

                                        <NavItem>
                                        <span id="spa">
                                          <abbr  id="abbri"  title="Exercise Reporting">
                                            <NavLink  href="#" className={class_exercise} value="exercise"
						    		 				  onClick={this.activateTab.bind(this,"exercise")}>
						    		 		Exercise Reporting
                                            </NavLink>                                           
                                          </abbr>
                                          </span>
                                       </NavItem> 


                                       	<NavItem>
                                        <span id="spa">
                                          <abbr  id="abbri"  title="User Inputs">
                                            <NavLink href="#" className={class_user} value="user"
						    		 				onClick={this.activateTab.bind(this,"user")}>
						    		 		 User Inputs 
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
                            target="calendar1" 
                            toggle={this.toggleCalendar}>
                              <PopoverBody>
                                <CalendarWidget onDaySelect={this.processDate}/>
                              </PopoverBody>
                           </Popover> 
                    	
                    	<Container>    
			   <div id="quick2" className="row ">
			   		   <div className="col-lg-10 col-md-12 col-sm-12">       
		            <div className="quick10">
				           <Form>
						        <span style={{paddingLeft:"20px",paddingBottom:"20px"}}>
						      
						          <Label>Start Date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
						          <input type="date"
						           name="start_date"
						           value={this.state.start_date}
						           onChange={this.handleChange} style={{height:"40px",borderRadius:"7px"}}/>
						           
						        </span>
						        <span style={{paddingLeft:"27px"}} id="date">
						       
						          <Label>End date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
						          <input type="date"
						           name="end_date"
						           value={this.state.end_date}
						           onChange={this.handleChange} style={{height:"40px",borderRadius:"7px"}}/>
						        
						        </span>
						        <span style={{paddingLeft:"88px"}} id="date">
						       
						        <button						        
						         type="submit"
						         className="btn btn-block-lg btn-info"
						         onClick={this.onSubmitDate} style={{width:"200px"}}>Submit</button>
						         </span>

						   </Form>
					</div>
					</div>
					</div>
                    <div className="row ">
                    <div className="col-lg-10 col-md-12 col-sm-12">
                    	{this.state.activeTab === "allstats1" && <AllStats1 data={this.state.data}/>}
                    	{this.state.activeTab === "allstats" && 
	                    	<AllStats 
	                    		data={this.state.data} 
	                    		userInputData={this.state.userInputData}
	                    		start_date={this.state.start_date}
	                    		end_date={this.state.end_date}
	                    	/>
                    	}
                    	{this.state.activeTab === "swim" && <Swim data={this.state.data}/>}
                    	{this.state.activeTab === "bike" && <Bike data={this.state.data}/>}
                    	{this.state.activeTab === "alcohol" && <Alcohol data={this.state.data}/>}
                    	{this.state.activeTab === "exercise" && <Exercise data={this.state.data}/>}
                    	{this.state.activeTab === "grade" && <Grades data={this.state.data}/>}
                    	{this.state.activeTab === "steps" && <Steps data={this.state.data}/>}
                    	{this.state.activeTab === "sleep" && <Sleep data={this.state.data}/>}
                    	{this.state.activeTab === "food" && <Food data={this.state.data}/>}
                    	{this.state.activeTab === "user" &&
	                    	 <User  data={this.state.userInputData}
	                    		 	start_date = {this.state.start_date}
	                    		 	end_date = {this.state.end_date}
	                    	 />
                    	}
                    </div>
					</div>
					</Container>
					</div>
					{this.renderQlFetchOverlay()}
					{this.renderQlCreateOverlay()}
				</div>		
		
	);
	}
}
export default connect(null,{})(Quicklook);