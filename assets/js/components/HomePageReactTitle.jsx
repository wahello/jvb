import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm} from 'redux-form';
import { withRouter, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
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



 <div className="top-content">
          
            <div className="inner-bg">
    	<Container>
        
        


        <div>

      <section id="why">
            <div className="container">
             

               <div className="row">
                        <div className="col-sm-6 col-sm-offset-3 form-box">
                          <div className="d-flex justify-content-center">
                          
                              <img className="img-fluid"
                               src="https://static1.squarespace.com/static/535dc0f7e4b0ab57db48c65c/t/591e1eb0414fb533af1850a6/1495146161157" alt="JVB"/>
                            
                            </div>

                            <div className="form-bo">
                            <h3>Login</h3>
                          <Form className="login-form" onSubmit={handleSubmit(this.onSubmit)}>
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
                        </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6 col-sm-offset-3 social-login">
                          <h3>Link's</h3>
                          <div className="social-login-buttons">
                          <Link to='/users/dashboard'>Dashboard</Link><br/>
                           
                          <Link to='register'>Register</Link><br/>
                            <Link to="forgotpassword">Forgot Password</Link><br/>
                             <Link to='userinputs'>userinputs</Link><br/>
                             <Link to='nes'>NES Graph</Link><br/>
                              <Link to='sleep'>Sleeping Graph</Link><br/>
                              <Link to='overallgrade'>Over All Grade</Link><br/>
                               <Link to='weeklygrade'>Weekly Grade</Link><br/>
                               <Link to='breakdown'>Break Down Grade</Link><br/>
                               <Link to='weeklysummary'>Weekly Summary</Link><br/>
                               <Link to='/raw/garmin'>Garmin Pull Down</Link><br/>
                               <a href='users/request_token'>Garmin Connect</a><br/>
                               <Link to='quicksummary'>Quick Summary</Link><br/>

                          </div>
                        </div>
                    </div>

              </div>
             
            


          </section>
          </div>



               

      


    	

{/*

<Row className=" d-flex justify-content-center"><Col sm="12" md="8">


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
        <Col>
         <Link to='/users/dashboard'>Dashboard</Link>
        </Col>
       </Row>
       <Row>
       	<Col>
         <Link to='register'>Register</Link>
       	</Col>
       </Row>
       <Row>
       	<Col>
       	<Link to="forgotpassword">Forgot Password</Link>
       	</Col>
         </Row>
       <Row>
        <Col>
         <Link to='userinputs'>userinputs</Link>
        </Col>
       </Row>
        <Row>
        <Col>
         <Link to='nes'>NES Graph</Link>
        </Col>
       </Row>
        <Row>
        <Col>
         <Link to='sleep'>Sleeping Graph</Link>
        </Col>
       </Row>
       <Row>
        <Col>
         <Link to='overallgrade'>Over All Grade</Link>
        </Col>
       </Row>
       <Row>
        <Col>
         <Link to='weeklygrade'>Weekly Grade</Link>
        </Col>
       </Row>
       <Row>
        <Col>
         <Link to='breakdown'>Break Down Grade</Link>
        </Col>
       </Row>
       <Row>
        <Col>
         <Link to='weeklysummary'>Weekly Summary</Link>
        </Col>
       </Row>
       <Row>
        <Col>
         <a href='users/request_token'>Garmin Connect</a>
        </Col>
       </Row>
       <Row>
        <Col>
         <Link to='/raw/garmin'>Garmin Pull Down</Link>
        </Col>
       </Row>*/}
       </Container>
       </div>
       </div>
       
       
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
