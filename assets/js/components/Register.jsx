import React, { PropTypes } from 'react';
import { Link } from 'react-router'
import { Container, Select, Option, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

class Register extends React.Component {
  render() {

    console.log('i am in the render for register');
  return (
  	<Container>
     
    <Row><Col  xs="6">
      <h1>Login</h1>
      <Form>
        <FormGroup>
          <Label for="exampleEmail">Email</Label>
          <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder" />
        </FormGroup>
        <FormGroup>
            <Label for="last_name">Last Name</Label>
            <Input type="text"  id="last_name" name="last_name" className="form-control" placeholder="please enter last name" required="" />
        </FormGroup>
        <FormGroup>
          <Label for="examplePassword">Password</Label>
          <Input type="password" name="password" id="examplePassword" placeholder="password placeholder" />
        </FormGroup>
        <Button>Submit</Button>
      </Form>
     </Col></Row>
     <Row>
      <Col  xs="6">
       <Link to='register'>Register</Link>
      </Col>
     </Row>
          <Row>
      <Col  xs="6">
      <a>Forgot Password</a>
      </Col>
     </Row>

    </Container>
  );
}

}

export default Register; 