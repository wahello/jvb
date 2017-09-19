import React from 'react';
import NavbarMenu from './navbar';


import { Table} from 'reactstrap';

var CalendarWidget = require('react-calendar-widget');

class Weeklygrade extends React.Component{

 
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