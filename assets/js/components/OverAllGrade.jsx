import React from 'react';

import { Table, Row, Container, className, Col } from 'reactstrap';

class Overallgrade extends React.Component{
    render(){
        console.log('i am here for rendering grade')
        return(
             <Container id="overallgrade">

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
       </Container>
        );
    }
}

export default Overallgrade;