import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm} from 'redux-form';
import { withRouter, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Form, FormGroup,
         Label, Input, FormText } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';

import { loginUser } from '../network/auth';
import {loadLocalState,saveLocalState} from './localStorage';


class HomePageReactTitle extends Component {

  constructor(props){
    super(props);

    const persisted_state = loadLocalState();
    
    if(location.hash === '#logout'){
      location.hash = ''
      location.reload(true);
    }

    if(persisted_state.authenticated){
      this.props.history.push("/users/dashboard");
    }

    this.onSubmit = this.onSubmit.bind(this);
    this.renderAlert = this.renderAlert.bind(this);
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
  }

  onLoginSuccess(){
    this.props.history.push("/users/dashboard");
  }

  onLoginFailure(error){
    toast.error("Please check your username/email or password!", {
      position: toast.POSITION.TOP_CENTER
    });
  }

  renderAlert(){
    if(this.props.errorMessage){
      return(
        <div style={{color:'red'}}><strong>Error!</strong> {this.props.errorMessage}</div>
      );
    }
  }

  onSubmit(values){
    this.props.loginUser(values, this.onLoginSuccess,this.onLoginFailure);
  }

  renderField(field){
    const { meta: {touched, error} } = field;
    const className = `${ touched && error ? 'has-danger' : '' }`;
    return(
      <Form method="post">
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
      </Form>
    );
  }

  render(){
    const { handleSubmit} = this.props;

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
                                        label = "Email/Username"
                                        placeholder = "Email / Username"
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
                                    <div className="social-login-buttons">

                                    <Link to='register'>Register</Link><br/>
                                      <Link to="forgotpassword">Forgot Password</Link><br/>

                                    </div>
                                  </div>
                              </div>

                        </div>
                    </section>
                </div>
             </Container>
          </div>
          <ToastContainer 
            position="top-center"
            type="error"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            style={{fontSize:"12px"}}
          />
        </div>
    );
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
