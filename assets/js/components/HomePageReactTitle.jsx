import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm} from 'redux-form';
import { withRouter, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Form, FormGroup,
         Label, Input, FormText,Collapse, Navbar, NavbarToggler, 
         NavbarBrand, Nav, NavItem, NavLink,
       } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import FontAwesome from "react-fontawesome";
import { loginUser } from '../network/auth';
import {loadLocalState,saveLocalState} from './localStorage';
import NavbarMenu from './navbar';


class HomePageReactTitle extends Component {

  constructor(props){
    super(props);
    this.state={
       password_type: 'password',
    };

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
    this.showHidePassword = this.showHidePassword.bind(this);
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
showHidePassword(e){
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      password_type: this.state.password_type === 'password' ? 'input' : 'password'
    })  
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
     const {fix} = this.props;
    const { handleSubmit} = this.props;

    return (
       <div className="top-content">
           <Navbar toggleable 
         fixed={fix ? 'top' : ''} 
          className="navbar navbar-expand-sm navbar-inverse">
          <NavbarToggler className="navbar-toggler hidden-sm-up" onClick={this.toggle} >
           <FontAwesome 
                 name = "bars"
                 size = "1x"
                                          
             />
            
          </NavbarToggler>
          <Link to='/'>
            <NavbarBrand 
              className="navbar-brand float-xs-right float-sm-left" 
              id="navbarTogglerDemo">
              <img className="img-fluid"
               style={{maxWidth:"200px"}}
               src="//static1.squarespace.com/static/535dc0f7e4b0ab57db48c65c/t/5942be8b893fc0b88882a5fb/1504135828049/?format=1500w"/>
            </NavbarBrand>
          </Link>
        </Navbar>
            <div className="inner-bg">
          	<Container>
              <div>
                <section id="why">
                      <div className="container">

                         <div className="row">
                                  <div className="col-sm-6 col-sm-offset-3 form-box">
                                    <div className="d-flex justify-content-center">
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
                                      <FormGroup>
                                      <Field
                                      style={{borderRadius:"0px",position:"relative"}} 
                                        name = "password"
                                        type={this.state.password_type} 
                                        label = "Password"
                                        placeholder = "Password"
                                        component = {this.renderField}
                                      />

                                      <a onClick={this.showHidePassword} color="link" style={{ color:"#535559" , position:"absolute", top:"163px", right:"57px"}}>
                                        {this.state.password_type === 'input' ?
                                         <span ><i  className="fa fa-eye-slash" aria-hidden="true"></i></span> :
                                         <i className="fa fa-eye" aria-hidden="true"></i>}
                                      </a> 
                                      </FormGroup>
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
                                    <a href="password_reset/">Forgot Password</a><br/>
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
