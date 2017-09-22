import React from 'react';
import NavbarMenu from './navbar';

import fetchWeeklyGrade  from '../network/weekly';
import {weeklygradeDate}  from '../network/weekly';
import { Table} from 'reactstrap';
import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 4}); 
var CalendarWidget = require('react-calendar-widget');

var ReactDOM = require('react-dom');


class Weeklygrade extends React.Component{

  constructer(props){
        //super(props);
        this.successweekly=this.successweekly.bind(this); 
      //this.processDate=this.processDate.bind(this);   
        this.state={
            weekly_data:{
                  id:'',
                  user:'',
                  Non_Exercise_Steps:'',
                  movement_consistency:'',
                  sleep:'',
                  exercise_consistency:'',
                  overall_exercise:'',
                  workout_duration:'',
                  exercise_effort_level:'',
                  exercise_heart_rate:'',
                  food:'',
                  alcohol:''

            }

        };

  }
  sucessweekly(data){
    console.log(data);
    this.setState({
      weekly_data:{
        id:data.data.weekly_data.id,
        user:data.data.weekly_data.user,
        Non_Exercise_Steps:data.data.weekly_data.Non_Exercise_Steps,
        movement_consistency:data.data.weekly_data.movement_consistency,
        sleep:data.data.weekly_data.sleep,
        exercise_consistency:data.data.weekly_data.exercise_consistency,
        overall_exercise:data.data.weekly_data.overall_exercise,
        workout_duration:data.data.weekly_data.workout_duration,
        exercise_effort_level:data.data.weekly_data.exercise_effort_level,
        exercise_heart_rate:data.data.weekly_data.exercise_heart_rate,
        food:data.data.weekly_data.food,
         alcohol:data.data.weekly_data.alcohol
      }
    });
  }
  errorweekly(error){
    console.log(error.message);
  }
processDate(date){
  weeklygradeDate(date,this.successweekly,this.errorweekly);

}
  componentDidMount(){
    var today=new Date();
     weeklygradeDate(today,this.successweekly,this.errorweekly);
    fetchWeeklyGrade(this.successweekly, this.errorweekly)
  }
    render(){
        console.log('i am here for rendering weekly grade')
        return(
            <div className="container">
            <NavbarMenu/>

             <div className="col-md-12">
             <div className="tbc">
               <h2>Weekly Report With Grades</h2>
             </div>
          
          <div className="row justify-content-center">
         
          <div className="col-sm-2">
            <CalendarWidget onDaySelect={this.processDate}/>,
             </div>
              <div>
            <Table id="tbc2" className="table table-success">
            
             <tr>
              <th scope="row"></th>
              <th>10-06-2017</th>
              <th>11-06-2017</th>
              <th>12-06-2017</th>
              <th>13-06-2017</th>
              <th>14-06-2017</th>
              <th>15-06-2017</th>
              <th>16-06-2017</th>
             
          </tr>
        <tbody>
            <tr>  
              <th scope="row">Non Exercise Steps</th>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
            </tr>
            <tr>  
              <th scope="row">Movement Consistency</th>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
              </tr>
            <tr>  
              <th scope="row">Sleep</th>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="coloryellow">C</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">B</td>
                <td className="colorgreen">B</td>
            </tr>
            <tr>  
              <th scope="row">Exercise Consistency</th>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>  
              <th scope="row">Overall Exercise</th>
                <td className="coloryellow">D</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">B</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
            </tr>
            <tr>  
              <th scope="row">Workout Duration</th>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
            </tr>
            <tr>  
              <th scope="row">Exercise Effort Level</th>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
            </tr>
            <tr>  
              <th scope="row">Exercise Heart Rate</th>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
            </tr>
            <tr>  
              <th scope="row">Food</th>
                <td className="colorgreen">B</td>
                <td className="colorgreen">C</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
                <td className="colorgreen">A</td>
            </tr>
            <tr>  
              <th scope="row">Alcohol</th>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
          </tbody>
           </Table>
          </div>
          </div>
        </div>
         </div>

        );
    }
}

export default Weeklygrade;