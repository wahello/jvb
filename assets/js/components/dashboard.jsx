import React from 'react';

import { Table, Row, Container, className, Col } from 'reactstrap';

import Navbar from '../components/navbar';


class Dashboard extends React.Component{
	render(){
	  return(
      <div>
        <Navbar />
	    <Container id="dashboard">

	     <div className="row justify-content-center">
          <h3 className="header"> Overall grades for july 16,2017 </h3>
         </div>
         <div className="row justify-content-center row1">
         <div className="col-md-5  col-lg-3 col-sm-6 mt-4">
	          <div className="box">
	           <h3 className="title pt-5">A</h3>
	           <h4 className="title">4</h4>
	           <p className="title">Movement-Non Exercise Step Grade</p>
	          </div>
         </div>
         <div className="col-md-5 col-lg-3 col-sm-6 mt-4">
	         <div className="box_cd">
	           <h3 className="title pt-5">D</h3>
	           <h4 className="title">1.6</h4>
	           <p className="title">Movement consistency Grade</p>
	         </div>
         </div>
         <div className="col-md-5 col-lg-3 col-sm-6 mt-4">
	         <div className="box_cd">
	           <h3 className="title pt-5">C</h3>
	           <h4 className="title">2.7</h4>
	            <p className="title">Average Sleep Per Night Grade</p>
	         </div>
         </div>
         <div className="col-md-5 col-lg-3 col-sm-6 mt-4">
	         <div className="box">
	           <h3 className="title pt-5">A</h3>
	           <h4 className="title">4.00</h4>
	            <p className="title">Exercise Consistency Grade</p>
	         </div>
         </div>
         <div className="col-md-5 col-lg-3 col-sm-6 mt-4">
	         <div className="box">
	           <h3 className="title pt-5">A</h3>
	           <h4 className="title">4</h4>
	            <p className="title">Overall Exercise Grade</p>
	         </div>
         </div>
         <div className="col-md-5 col-lg-3 col-sm-6 mt-4">
	         <div className="box">
	           <h3 className="title pt-5">B</h3>
	           <h4 className="title">3</h4>
	            <p className="title">% Non Processed Food Consumed Grade</p>
	         </div>
         </div>
         <div className="col-md-5 col-lg-3 col-sm-6 mt-4">
	         <div className="box_cd">
	           <h3 className="title pt-5">C</h3>
	           <h4 className="title">2</h4>
	            <p className="title">Alcoholic Drinks Per Day Grade</p>
	         </div>
         </div>
     </div>
	      <div className="weekly_grade">
           <h2 className="weekly_grade_title">Weekly Report With Grades</h2>
          </div>
          <div className="row justify-content-center  tbc">
           <div className="col-lg-10 col-sm-12">
            <Table bordered>
            <thead>
             <tr>
              <th></th>
              <th>10-06-2017</th>
              <th>11-06-2017</th>
              <th>12-06-2017</th>
              <th>13-06-2017</th>
              <th>14-06-2017</th>
              <th>15-06-2017</th>
              <th>16-06-2017</th>
             </tr>
            </thead>
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

      <div className="break_grade">
       <h2 className="break_grade_title">Breakdown Of Grades</h2>
      </div>
      <div className="row justify-content-center btbc">
        <div className="col-lg-8 col-md-10 col-sm-12">
          <Table bordered>
            <thead>
              <th></th>
              <th>A</th>
              <th>B</th>
              <th>C</th>
              <th>D</th>
              <th>F</th>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Non Exercise Steps</th>
                <td className="colorgreen">14</td>
                <td className="colorgreen"> 0</td>
                <td className="coloryellow">0</td>
                <td className="coloryellow">0</td>
                <td className="colorred">0</td>
              </tr>
              <tr>
                <th scope="row">Movement Consistency</th>
                <td className="colorgreen">10</td>
                <td className="colorgreen">10</td>
                <td className="coloryellow">0</td>
                <td className="coloryellow">0</td>
                <td className="colorred">0</td>
              </tr>
              <tr>
                <th scope="row">Sleep</th>
                  <td className="colorgreen">8</td>
                  <td className="colorgreen">5</td>
                  <td className="coloryellow">1</td>
                  <td className="coloryellow">0</td>
                  <td className="colorred">0</td>
              </tr>
              <tr>  
                <th scope="row">Exercise Consistency</th>
                  <td className="colorgreen">2</td>
                  <td className="colorgreen">0</td>
                  <td className="coloryellow">0</td>
                  <td className="coloryellow">0</td>
                  <td className="colorred">0</td>
            </tr>
            <tr>
              <th scope="row">Overall Exercise</th>
                  <td className="colorgreen">9</td>
                  <td className="colorgreen">3</td>
                  <td className="coloryellow">1</td>
                  <td className="coloryellow">1</td>
                  <td className="colorred">0</td>
            </tr>
            <tr>
              <th scope="row">Workout Duration</th>
                  <td className="colorgreen">14</td>
                  <td className="colorgreen">0</td>
                  <td className="coloryellow">0</td>
                  <td className="coloryellow">0</td>
                  <td className="colorred">0</td>
            </tr>
            <tr>
              <th scope="row">Exercise Effort Level</th>
                  <td className="colorgreen">11</td>
                  <td className="colorgreen">1</td>
                  <td className="coloryellow">0</td>
                  <td className="coloryellow">1</td>
                  <td className="colorred">1</td>
            </tr>
            <tr>
              <th scope="row">Exercise Heart Rate</th>
                  <td className="colorgreen">0</td>
                  <td className="colorgreen">12</td>
                  <td className="coloryellow">1</td>
                  <td className="coloryellow">1</td>
                  <td className="colorred">0</td>
            </tr>
            <tr>
              <th scope="row">Food</th>
                  <td className="colorgreen">8</td>
                  <td className="colorgreen">3</td>
                  <td className="coloryellow">3</td>
                  <td className="coloryellow">0</td>
                  <td className="colorred">0</td>
            </tr>
            <tr>
              <th scope="row">Alcohol</th>
                  <td className="colorgreen">3</td>
                  <td className="colorgreen">2</td>
                  <td className="coloryellow">6</td>
                  <td className="coloryellow">2</td>
                  <td className="colorred">1</td>
            </tr>
            </tbody>
          </Table>
        </div>
       </div> 

        <div className="week_summary">
        <h2 className="week_summary_title">Weekly Summary</h2>
      </div>
      <div className="row justify-content-center wstbc">
        <div className="col-lg-7 col-md-9 col-sm-12">
          <Table bordered>
            <thead>
              <th></th>
              <th>Average</th>
              <th>Median</th>
              <th>Best</th>
              <th>Worst</th>
            </thead>
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
        </Container>  
        </div>
	  );
	}
  }	

export default Dashboard;