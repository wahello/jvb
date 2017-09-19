import React from 'react';
import NavbarMenu from './navbar';


import { Table, Row, Container, className, Col } from 'reactstrap';

class Weeklysummary extends React.Component{
    render(){
        console.log('i am here for rendering summary')
        return(
            <div className="container">
             <NavbarMenu/>
              <div className="col-lg-12 col-md-6 col-sm-3">
                 <div className="tbcw">
                 
                <h2>Weekly Summary</h2>
               
              </div>
      <div className="row justify-content-center">
       <div>
          <Table id="tbcw1" className="table table-info">
            
              <th></th>
              <th>Average</th>
              <th>Median</th>
              <th>Best</th>
              <th>Worst</th>
            
            <tbody>
             <tr>
               <th scope="row">Non Exercise Steps</th>
                  <td className="colorgreen">21174</td>
                  <td className="colorgreen">19775</td>
                  <td className="colorgreen">32652</td>
                  <td className="colorgreen">13987</td>
            </tr>
            <tr>
               <th scope="row">Movement Consistency</th>
                  <td className="colorgreen">3</td>
                  <td className="colorgreen">4</td>
                  <td className="colorgreen">0</td>
                  <td className="coloryellow">6</td>
            </tr>
            <tr>
               <th scope="row">Sleep(in hours)</th>
                  <td className="colorgreen">7.6</td>
                  <td className="colorgreen">7.7</td>
                  <td className="colorgreen">8.2</td>
                  <td className="coloryellow">6.8</td>
            </tr> 
            <tr>
               <th scope="row">Exercise Consistency</th>
                  <td className="colorgreen"></td>
                  <td className="colorgreen"></td>
                  <td className="colorgreen"></td>
                  <td className="colorgreen"></td>
            </tr>
            <tr>
               <th scope="row">Overall Exercise</th>
                  <td className="colorgreen">3.5</td>
                  <td className="colorgreen">3.7</td>
                  <td className="colorgreen">4</td>
                  <td className="colorgreen">2</td>
            </tr>
            <tr>
               <th scope="row">Workout Duration</th>
                  <td className="colorgreen">86</td>
                  <td className="colorgreen">92</td>
                  <td className="colorgreen">99</td>
                  <td className="colorgreen">60</td>
            </tr>
            <tr>
               <th scope="row">Workout Effort Level</th>
                  <td className="colorgreen">3.9</td>
                  <td className="colorgreen">3.0</td>
                  <td className="colorgreen">2.0</td>
                  <td className="colorgreen">9.0</td>
            </tr>
            <tr>
               <th scope="row">Exercise Heart Rate</th>
                  <td className="colorgreen">131</td>
                  <td className="colorgreen">127</td>
                  <td className="colorgreen">124</td>
                  <td className="colorgreen">162</td>
            </tr>
            <tr>
               <th scope="row">Food</th>
                  <td className="colorgreen">78</td>
                  <td className="colorgreen">80</td>
                  <td className="colorgreen">95</td>
                  <td className="colorgreen">65</td>
            </tr>
            <tr>
               <th scope="row">Alcohol</th>
                  <td className="colorgreen">1.8</td>
                  <td className="colorgreen">2.0</td>
                  <td className="colorgreen"></td>
                  <td className="colorgreen">5</td>
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

export default Weeklysummary;