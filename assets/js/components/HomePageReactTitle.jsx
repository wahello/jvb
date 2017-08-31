import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm} from 'redux-form';
import { withRouter, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Form,
         FormGroup, Label, Input, FormText } from 'reactstrap';

import { loginUser } from '../network/auth';

class HomePageReactTitle extends Component {

  constructor(props){
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.renderAlert = this.renderAlert.bind(this);
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
  }

  onLoginSuccess(){
    this.props.history.push("/users/dashboard");
  }

  renderAlert(){
    if(this.props.errorMessage){
      return(
        <div style={{color:'red'}}><strong>Error!</strong> {this.props.errorMessage}</div>
      );
    } 
  }

  onSubmit(values){
    this.props.loginUser(values, this.onLoginSuccess);
  }

  renderField(field){
    const { meta: {touched, error} } = field;
    const className = `${ touched && error ? 'has-danger' : '' }`;
    return(
      <FormGroup className={className}>
        <Label className="sr-only">{field.label}</Label>
        <Input 
          type={field.type} 
          name={field.name} 
          placeholder={field.placeholder} 
          value={field.value}
          {...field.input}
        />
        <div className="form-control-feedback">
          {touched ? error : ''}
        </div>
      </FormGroup>
    );
  }

  render(){
    const { handleSubmit} = this.props;
    const homeURL = window.Django.url('home');

    return (
    	<Container><Row><Col>&nbsp;</Col></Row><Row><Col>&nbsp;</Col></Row>
    	<Row><Col>&nbsp;</Col></Row>
    	<Row><Col  xs="6">
    	  <h1>Login</h1>
        <Form onSubmit={handleSubmit(this.onSubmit)}>
            <Field
            name = "username"
            type = "text"
            label = "Username"
            placeholder = "username"
            component = {this.renderField}
          />
          <Field
            name = "password"
            type = "password"
            label = "Password"
            placeholder = "Password"
            component = {this.renderField}
          />
          <Button>Submit</Button>
          {this.renderAlert()}
        </Form>
       </Col></Row>
       <Row>
        <Col  xs="6">
         <Link to='/users/dashboard'>Dashboard</Link>
        </Col>
       </Row>
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
       <Row>
        <Col xs="6">
         <a href='users/request_token'>Garmin Connect</a>
        </Col>
       </Row>
       </Container>
    )
  }
};

HomePageReactTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

function mapStateToProps(state){
  return {
    errorMessage: state.auth.error,
    message : state.auth.message
  };
}


export default reduxForm({
  form: 'login'
})(
  connect(mapStateToProps,{loginUser})(withRouter(HomePageReactTitle))
);
