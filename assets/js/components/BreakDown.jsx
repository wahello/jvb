import React from 'react';

import { Table, Row, Container, className, Col } from 'reactstrap';

class Breakdown extends React.Component{
    render(){
        console.log('i am here for rendering grade')
        return(
            <Container id="breakdown">
                      <div className="break_grade row justify-content-center">
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
            </Container>
        );
    }
}

export default Breakdown;