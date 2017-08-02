import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom'
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
       <Link to='register'>Register</Link>
     	</Col>
     </Row>
     <Row>
     	<Col  xs="6">
     	<Link to="forgotpassword">Forgot Password</Link>
     	</Col>
       </Row>
     <Row>
      <Col xs="6">
       <Link to='userinputs'>userinputs</Link>
      </Col>
     </Row>
      <Row>
      <Col xs="6">
       <Link to='nes'>NES Graph</Link>
      </Col>
     </Row>
      <Row>
      <Col xs="6">
       <Link to='sleep'>Sleeping Graph</Link>
      </Col>
     </Row>
     <Row>
      <Col xs="6">
       <Link to='overallgrade'>Over All Grade</Link>
      </Col>
     </Row>
     <Row>
      <Col xs="6">
       <Link to='weeklygrade'>Weekly Grade</Link>
      </Col>
     </Row>
     <Row>
      <Col xs="6">
       <Link to='breakdown'>Break Down Grade</Link>
      </Col>
     </Row>
     <Row>
      <Col xs="6">
       <Link to='weeklysummary'>Weekly Summary</Link>
      </Col>
     </Row>
     </Container>
  )
};

HomePageReactTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default HomePageReactTitle;
