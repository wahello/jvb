import React, { PropTypes } from 'react';
import { Link } from 'react-router'
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText,
         Modal, ModalHeader, ModalBody, ModalFooter,Card,CardTitle, 
     CardHeader, CardBlock, CardText} from 'reactstrap';
import NavbarMenu from './navbar';
import {userForgetPassword}  from '../network/forget';



class Forgotpassword extends React.Component{
  constructor(props){
    super(props);
    this.state={
      modal:false,
      email:'' 
    };
    this.toggle=this.toggle.bind(this);
    this.handlechange=this.handlechange.bind(this);  
    this.onSuccess = this.onSuccess.bind(this); 
  }
handlechange(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;
      this.setState({
        [name]:value
      })
}

 onFetchFailureMail(error){
      // alert('User input not found');
      this.setState(this.state);
    }

onSuccess(){
  this.setState({
    email:''
  });
}
onSubmit(event){
      event.preventDefault();
      userForgetPassword(this.state.email);
    }


  toggle(event){
    this.setState({
      modal:!this.state.modal,
      email:''
    });
  }

  render(){
    
     return (
           <div className="form-container1">
        <Container className="h-100" id="reg-form1">
        <NavbarMenu/>
          <Row className="justify-content-center align-items-center">
            <Col md="6">
              <Card className="form-card1">
                <CardHeader className="text-center">
                  <h3>Forgot Password</h3>
                </CardHeader>
                <CardBlock className="text-center">
                <Row className="justify-content-center align-items-center">
                   <Form 

                    className="forgot-form bootstrap_validator col-sm-12 col-md-6 col-lg-5" 
                    role="form"
                    onSubmit = {this.onSubmit}
                    data-toggle="validator">
                        <FormGroup>
                            <Label className="padding">Enter your email to reset your password</Label>
                              <Input 
                              className="form-control" 
                              placeholder="Email" 
                              name="email" 
                              type="email" 
                              value = {this.state.email}
                              onChange={this.handlechange}/>
                        </FormGroup>
                        <Button color="info" size="lg" block className="btn btn-block" onClick={this.toggle}>Rest Your Password</Button>
                    </Form>
                    </Row> 
                    <Modal isOpen={this.state.modal} toggle={this.toggle}> 
                        <ModalBody>
                            the reset passworde link send to your mail. 
                         </ModalBody>
                        <ModalFooter>
                          <Button color="primary" onClick={this.toggle}>Ok</Button>{' '}
                          <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                </CardBlock>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>   

   );
  }
}

export default Forgotpassword;
 