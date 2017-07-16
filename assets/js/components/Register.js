import React, { PropTypes } from 'react';
import { Link } from 'react-router'
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';



const HomePageReactTitle = ({ title }) => {
  const homeURL = window.Django.url('home');

  return (
  	<Container><Row><Col>&nbsp;</Col></Row><Row><Col>&nbsp;</Col></Row>
  	<Row><Col>&nbsp;</Col></Row>
  	<Row><Col  xs="6">
  	  <h1>Registration</h1>
      <Form>

   <FormGroup>
              <Label>First Name</Label>
              <Input type="text"  name="first_name" class="form-control" placeholder="please enter first  name" required="" />
  </FormGroup>
  <FormGroup>
            <Label>Last Name</Label>
              <Input type="text"  name="last_name" class="form-control" placeholder="please enter last name" required="" />
  </FormGroup>
  <FormGroup>
              <Label>Height</Label>
              <Input type="text"  name="height" class="form-control" placeholder="please enter height" required="" />
  </FormGroup> 
  <FormGroup>
     <Label>Weight</Label>
    <Input type="text"  name="weight" class="form-control" placeholder="please enter weight" required="" />
  </FormGroup> 
   <FormGroup>
    <legend>select your gender</legend>
         <div class="form-check form-check-inline">
            <Label class="form-check-Label">
             <Input class="form-check-Input" type="radio" name="gender" id="" value="male" required="" /> Male
            </Label>
            <Label class="form-check-Label">
             <Input class="form-check-Input" type="radio" name="gender" id="" value="female" required="" /> Female
             </Label>
             <Label class="form-check-Label">
             <Input class="form-check-Input" type="radio" name="gender" id="" value="other" required="" /> Other
             </Label>
         </div>
   </FormGroup>
  <FormGroup>
           <Label>Birthday</Label>
              <Input type="text"  name="dob" class="form-control datepicker" placeholder="please enter birthday" required="" />
  </FormGroup>
  <FormGroup>
           <Label>Garmin username</Label>
              <Input type="text"  name="username" class="form-control" placeholder="please enter garmin username" required="" />
  </FormGroup>
  <FormGroup>
          <Label>Garmin password</Label>
              <Input type="password"  name="password" class="form-control" placeholder="please enter garmin password" required="" />
  </FormGroup>
  <FormGroup>
           <Label>Email</Label>
              <Input type="email" name="email" class="form-control" placeholder="please enter email" required="" />
  </FormGroup>
  <FormGroup>
         <Label class="padding">Goals</Label>
           <select class=" form-control" multiple="multiple" name="goals">
             <option value="">Maintain Overall Health</option>
             <option value="">improve health</option>
             <option value="">improve energy levels</option>
             <option value="">improve blood work levels</option>
           </select> 
       
  </FormGroup>

  <FormGroup>
         <Label class="padding">Daily Non Exercise Steps Goals</Label>
           <Input type="text" name="non_steps_goals" class="form-control" placeholder="enter stpes in numbers" />
  </FormGroup>

  <FormGroup>
         <Label class="padding">Daily Sleep Goal</Label>
           <Input type="text" name="sleep_goal" class="form-control" placeholder="enter sleep time" />
  </FormGroup>


   <FormGroup>
     <Label class="padding">Daily Movement Consistency Goal</Label>
       <Input type="text" name="movement_goal" class="form-control" placeholder="enter consistency goal" />
   </FormGroup>

           <Button type="submit">Sign Up</Button>


      </Form>
     </Col></Row>

          <Row>
     	<Col  xs="6">

       Already have an account? Please <Link to='/'>Login</Link>

     	</Col>
     </Row>
     </Container>
  )
};

HomePageReactTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default HomePageReactTitle;
