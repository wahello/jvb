import React, { PropTypes } from 'react';
import { Link } from 'react-router'
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';



const HomePageReactTitle = ({ title }) => {
  const homeURL = window.Django.url('home');

  return (
  	<Container><Row><Col>&nbsp;</Col></Row><Row><Col>&nbsp;</Col></Row>
  	<Row><Col>&nbsp;</Col></Row>
  	<Row><Col  xs="6">
  	  <h1>Login</h1>
      <Form>
        <FormGroup>
          <Label for="exampleEmail">Email</Label>
          <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder" />
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
     	 <a>Register</a>
     	</Col>
     </Row>
          <Row>
     	<Col  xs="6">
     	<a>Forgot Password</a>
     	</Col>
     </Row>
     </Container>
  )
};

HomePageReactTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default HomePageReactTitle;
