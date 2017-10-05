import React, { PropTypes } from 'react';
import { Link } from 'react-router'
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText,
         Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import NavbarMenu from './navbar';
import {fetchForgetPassword}  from '../network/forget';



class Forgotpassword extends React.Component{
  constructor(props){
    super(props);
    this.state={
      modal:false,
      email:'' 
    };
    this.toggle=this.toggle.bind(this);
    this.handlechange=this.handlechange.bind(this);
  }
handlechange(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;
      this.setState({
        [name]:value
      })
}
 

  toggle(event){
    this.setState({
      modal:!this.state.modal
    });
  }

  render(){
    console.log(' i am here rendering forgot password page')
     return (
           <div>
              <Container id="forgot">
                <div className="row justify-content-center">
               <NavbarMenu/>
  
                  <h2 className="head">Forgot Password</h2>   
                    <Form className="forgot-form bootstrap_validator col-sm-12 col-md-6 col-lg-5" role="form" data-toggle="validator">
                        <FormGroup>
                            <Label className="padding">Enter your email to reset your password</Label>
                              <Input className="form-control" placeholder="Email" name="email" type="email" />
                        </FormGroup>
                        <Button color="info" className="btn btn-block btn-primary" onClick={this.toggle}>Rest Your Password</Button>
                    </Form> 
                    <Modal isOpen={this.state.modal} toggle={this.toggle}> 
                        <ModalBody>
                            the reset passworde link send to your mail. 
                         </ModalBody>
                        <ModalFooter>
                          <Button color="primary" onClick={this.toggle}>Ok</Button>{' '}
                          <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                </div>  
              </Container>      
           </div>     
   );
  }
}

export default Forgotpassword;
 