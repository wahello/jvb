import React, { PropTypes } from 'react';
import { Link } from 'react-router'
import { Container, Select, Option, option, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import RegisterNetwork from '../network/register';


class Register extends React.Component {

  onRegisterSuccess(response){


  }

  sendForm(e,d) {
    e.preventDefault();
    console.log(e);
    console.log(d);
    console.log(this);
    var data = {}
    var rn = new RegisterNetwork();
    rn.register(data,this.onRegisterSuccess.bind(this));
    console.log('sent request');
    return false; 
  }

  render() {

    console.log('i am in the render for register');
  return (
    <div>
  	<Container>
     
<Row><Col>&nbsp;</Col></Row><Row><Col>&nbsp;</Col></Row>
    <Row><Col>&nbsp;</Col></Row>
    <Row><Col  xs="6">
      <h1>Registration</h1>
      <Form onSubmit={(e,d) => this.sendForm(e,d)}>

  <FormGroup>
            <Label for='last_name'>Last Name</Label>
              <Input type="text"  ref='last_name' name="last_name" className="form-control" placeholder="please enter last name" required="" />
  </FormGroup>
  <FormGroup>
              <Label>Height</Label>
              <Input type="text"  name="height" className="form-control" placeholder="please enter height" required="" />
  </FormGroup> 
  <FormGroup>
     <Label>Weight</Label>
    <Input type="text"  name="weight" className="form-control" placeholder="please enter weight" required="" />
  </FormGroup> 
   <FormGroup>
    <legend>select your gender</legend>
         <div className="form-check form-check-inline">
            <Label className="form-check-Label">
             <Input className="form-check-Input" type="radio" name="gender" id="" value="male" required="" /> Male
            </Label>
            <Label className="form-check-Label">
             <Input className="form-check-Input" type="radio" name="gender" id="" value="female" required="" /> Female
             </Label>
             <Label className="form-check-Label">
             <Input className="form-check-Input" type="radio" name="gender" id="" value="other" required="" /> Other
             </Label>
         </div>
   </FormGroup>
  <FormGroup>
           <Label>Birthday</Label>
              <Input type="date"  name="dob" className="form-control datepicker" placeholder="please enter birthday" required="" />
  </FormGroup>
  
  <FormGroup>
           <Label>Email</Label>
              <Input type="email" ref="email" className="form-control" placeholder="please enter email" required="" />
  </FormGroup>
 
  <FormGroup>
           <Label>Password</Label>
              <Input type="password" ref="password" className="form-control" placeholder="please enter password" required="" />
  </FormGroup>

<FormGroup>
         <Label className="padding">Goals</Label>
         <Input type="select" className=" form-control" name="goals" id="exampleSelectMulti" multiple>
             <option value="">Maintain Overall Health</option>
             <option value="">improve health</option>
             <option value="">improve energy levels</option>
             <option value="">improve blood work levels</option>
         </Input> 
       
  </FormGroup>


  <FormGroup>
         <Label className="padding">Daily Non Exercise Steps Goals</Label>
           <Input type="text" name="non_steps_goals" className="form-control" placeholder="enter stpes in numbers" />
  </FormGroup>

  <FormGroup>
         <Label className="padding">Daily Sleep Goal</Label>
           <Input type="text" name="sleep_goal" className="form-control" placeholder="enter sleep time" />
  </FormGroup>


   <FormGroup>
     <Label className="padding">Daily Movement Consistency Goal</Label>
       <Input type="text" name="movement_goal" className="form-control" placeholder="enter consistency goal" />
   </FormGroup>

   <Button type='submit'>Submit</Button>
   </Form>

</Col>   </Row>



    </Container>
    </div>
  );
}

}

export default Register; 