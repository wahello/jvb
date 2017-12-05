import React from 'react';
import NavbarMenu from './navbar';
import fetchWeeklySummary from '../network/weeklysummary';
import {weeklysummaryDate} from '../network/weeklysummary'
import axios from 'axios';
import axiosRetry from 'axios-retry';

import { Table, Row, Container, className, Col } from 'reactstrap';


axiosRetry(axios, { retries: 4}); 
var CalendarWidget = require('react-calendar-widget');  

var ReactDOM = require('react-dom');

class Weeklysummary extends React.Component{
  constructer(props){
   //super(props);
   this.successweeklysummary=this.successweeklysummary.bind(this);
   //this.processDate=this.processDate.bind(this); 
    this.state={
      average_ws:{
        id:'',
        user_ws:'',
        non_exercise_steps:'',
        movement_consistency:'',
        sleep:'',
        exercise_consistency:'',
        overall_exercise:'',
        workout_duration:'',
        workout_effort_level:'',
        exercise_heart_rate:'',
        food:'',
        alcohol:'',
      },
       medium_ws:{
        id:'',
        user_ws:'',
        non_exercise_steps:'',
        movement_consistency:'',
        sleep:'',
        exercise_consistency:'',
        overall_exercise:'',
        workout_duration:'',
        workout_effort_level:'',
        exercise_heart_rate:'',
        food:'',
        alcohol:'',
      },
       best_ws:{
        id:'',
        user_ws:'',
        non_exercise_steps:'',
        movement_consistency:'',
        sleep:'',
        exercise_consistency:'',
        overall_exercise:'',
        workout_duration:'',
        workout_effort_level:'',
        exercise_heart_rate:'',
        food:'',
        alcohol:'',
      },
       worst_ws:{
        id:'',
        user_ws:'',
        non_exercise_steps:'',
        movement_consistency:'',
        sleep:'',
        exercise_consistency:'',
        overall_exercise:'',
        workout_duration:'',
        workout_effort_level:'',
        exercise_heart_rate:'',
        food:'',
        alcohol:'',
      }

    };

  }

  successweeklysummary(data){
    console.log(data);
    this.setState({
        average_ws:{
        id:data.data.average_ws.id,
        user_ws:data.data.average_ws.user_ws,
        non_exercise_steps:data.data.average_ws.non_exercise_steps,
        movement_consistency:data.data.average_ws.movement_consistency,
        sleep:data.data.average_ws.sleep,
        exercise_consistency:data.data.average_ws.exercise_consistency,
        overall_exercise:data.data.average_ws.overall_exercise,
        workout_duration:data.data.average_ws.workout_duration,
        workout_effort_level:data.data.average_ws.workout_effort_level,
        exercise_heart_rate:data.data.average_ws.exercise_heart_rate,
        food:data.data.average_ws.food,
        alcohol:data.data.average_ws.alcohol,
      },
      medium_ws:{
        id:data.data.medium_ws.id,
        user_ws:data.data.medium_ws.user_ws,
        non_exercise_steps:data.data.medium_ws.non_exercise_steps,
        movement_consistency:data.data.medium_ws.movement_consistency,
        sleep:data.data.medium_ws.sleep,
        exercise_consistency:data.data.medium_ws.exercise_consistency,
        overall_exercise:data.data.medium_ws.overall_exercise,
        workout_duration:data.data.medium_ws.workout_duration,
        workout_effort_level:data.data.medium_ws.workout_effort_level,
        exercise_heart_rate:data.data.medium_ws.exercise_heart_rate,
        food:data.data.medium_ws.food,
        alcohol:data.data.medium_ws.alcohol,
      },
      best_ws:{
        id:data.data.best_ws.id,
        user_ws:data.data.best_ws.user_ws,
        non_exercise_steps:data.data.best_ws.non_exercise_steps,
        movement_consistency:data.data.best_ws.movement_consistency,
        sleep:data.data.best_ws.sleep,
        exercise_consistency:data.data.best_ws.exercise_consistency,
        overall_exercise:data.data.best_ws.overall_exercise,
        workout_duration:data.data.best_ws.workout_duration,
        workout_effort_level:data.data.best_ws.workout_effort_level,
        exercise_heart_rate:data.data.best_ws.exercise_heart_rate,
        food:data.data.best_ws.food,
        alcohol:data.data.best_ws.alcohol,
      },
       worst_ws:{
        id:data.data.worst_ws.id,
        user_ws:data.data.worst_ws.user_ws,
        non_exercise_steps:data.data.worst_ws.non_exercise_steps,
        movement_consistency:data.data.worst_ws.movement_consistency,
        sleep:data.data.worst_ws.sleep,
        exercise_consistency:data.data.worst_ws.exercise_consistency,
        overall_exercise:data.data.worst_ws.overall_exercise,
        workout_duration:data.data.worst_ws.workout_duration,
        workout_effort_level:data.data.worst_ws.workout_effort_level,
        exercise_heart_rate:data.data.worst_ws.exercise_heart_rate,
        food:data.data.worst_ws.food,
        alcohol:data.data.worst_ws.alcohol,
      },

    });
  }

  errorweeklysummary(error){
    console.log(error.message);
  }
  processDate(date){
  weeklysummaryDate(date,this.successweeklysummary,this.errorweeklysummary);
}
componentDidMount(){
  var today= new Date();
  weeklysummaryDate(today,this.successweeklysummary,this.errorweeklysummary);
  fetchWeeklySummary(this.successweeklysummary,this.errorweeklysummary)
}
    render(){
        console.log('i am here for rendering summary')
        return(
            <div className="container">
             <NavbarMenu/>
              <div className="col-lg-12 col-md-6 col-sm-3">
              <div className="row justify-content-center">
                 <div className="tbcw">
                <h2>Weekly Summary</h2>
               </div>
              </div>
               
     
              
               <div className="row">
              

      <div>
       <div id="tbcw2" className="col-sm-5">
            <CalendarWidget onDaySelect={this.processDate}/>,
             </div>
             <div className="col-sm-7">

          <Table id="tbcw1" className="table table-info">
            
              <th></th>
              <th>Average</th>
              <th>Median</th>
              <th>Best</th>
              <th>Worst</th>
            
            <tbody>
             <tr>
               <th scope="row">Non Exercise Steps</th>
                  <td>21174</td>
                  <td>19775</td>
                  <td>32652</td>
                  <td>13987</td>
            </tr>
            <tr>
               <th scope="row">Movement Consistency</th>
                  <td>3</td>
                  <td>4</td>
                  <td>0</td>
                  <td>6</td>
            </tr>
            <tr>
               <th scope="row">Sleep(in hours)</th>
                  <td>7.6</td>
                  <td>7.7</td>
                  <td>8.2</td>
                  <td>6.8</td>
            </tr> 
            <tr>
               <th scope="row">Exercise Consistency</th>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
            </tr>
            <tr>
               <th scope="row">Overall Exercise</th>
                  <td>3.5</td>
                  <td>3.7</td>
                  <td>4</td>
                  <td>2</td>
            </tr>
            <tr>
               <th scope="row">Workout Duration</th>
                  <td>86</td>
                  <td>92</td>
                  <td>99</td>
                  <td>60</td>
            </tr>
            <tr>
               <th scope="row">Workout Effort Level</th>
                  <td>3.9</td>
                  <td>3.0</td>
                  <td>2.0</td>
                  <td>9.0</td>
            </tr>
            <tr>
               <th scope="row">Exercise Heart Rate</th>
                  <td>131</td>
                  <td>127</td>
                  <td>124</td>
                  <td>162</td>
            </tr>
            <tr>
               <th scope="row">Food</th>
                  <td>78</td>
                  <td>80</td>
                  <td>95</td>
                  <td>65</td>
            </tr>
            <tr>
               <th scope="row">Alcohol</th>
                  <td>1.8</td>
                  <td>2.0</td>
                  <td></td>
                  <td>5</td>
            </tr>     
            </tbody>
          </Table>
</div>
        </div>
      </div>
      </div>
            </div>
            
        );
    }
}

export default Weeklysummary;