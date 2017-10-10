import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import NavbarMenu from './navbar';
import {Table} from 'reactstrap';


var CalendarWidget = require('react-calendar-widget');

var ReactDOM = require('react-dom');

 class Movement extends Component{
 	render(){
 		return(

 			 <div className="container">
             <NavbarMenu/>
              <div className="col-lg-12 col-md-6 col-sm-3">  
              <div className="row">
                 <div className="move">
                <h2>Movement Consistency</h2>
               </div>
              </div>
               
     
              
               <div className="row">
              

      <div>
       <div  className="col-sm-5">
            <CalendarWidget onDaySelect={this.processDate}/>,
             </div>
             <div className="col-sm-7">

          <Table id="move1" className="table table-info">
            <tr>
              <th></th>
              <th>date</th>
              <th></th>
              </tr>
               <th>Timing</th>
              <th>steps</th>
              <th>status</th>
              <tr>

              </tr>
              
            
            <tbody>
             <tr>
               <th scope="row">7 AM to 8 AM</th>
                  <td>21174</td>
                  <td>19775</td>
                 
            </tr>
            <tr>
               <th scope="row">8 AM to 9 AM</th>
                  <td>3</td>
                  <td>4</td>
                  
            </tr>
            <tr>
               <th scope="row">9 AM to 10 AM</th>
                  <td>7.6</td>
                  <td>7.7</td>
                 
            </tr> 
            <tr>
               <th scope="row">10 AM to 11 AM</th>
                  <td>4</td>
                  <td>5</td>
                 
            </tr>
            <tr>
               <th scope="row">11 AM to 12 PM</th>
                  <td>3.5</td>
                  <td>3.7</td>
                 
            </tr>
            <tr>
               <th scope="row">12 PM to 1 PM</th>
                  <td>86</td>
                  <td>92</td>
                 
            </tr>
            <tr>
               <th scope="row">1 PM to 2 PM</th>
                  <td>3.9</td>
                  <td>3.0</td>
                  
            </tr>
            <tr>
             <th scope="row">2 AM to 3 AM</th>
                  <td>21174</td>
                  <td>19775</td>
                 
            </tr>
            <tr>
               <th scope="row">3 AM to 4 AM</th>
                  <td>3</td>
                  <td>4</td>
                  
            </tr>
            <tr>
               <th scope="row">4 AM to 5 AM</th>
                  <td>7.6</td>
                  <td>7.7</td>
                 
            </tr> 
            <tr>
               <th scope="row">5 AM to 6 AM</th>
                  <td>4</td>
                  <td>5</td>
                 
            </tr>
            <tr>
               <th scope="row">6 AM to 7 PM</th>
                  <td>3.5</td>
                  <td>3.7</td>
                 
            </tr>
            <tr>
               <th scope="row">7 PM to 8 PM</th>
                  <td>86</td>
                  <td>92</td>
                 
            </tr>
            <tr>
               <th scope="row">8 PM to 9 PM</th>
                  <td>3.9</td>
                  <td>3.0</td>
                  
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
export default Movement;