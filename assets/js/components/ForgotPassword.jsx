import React, { PropTypes } from 'react';
import { Link } from 'react-router'
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';



class Forgotpassword extends React.Component{
  render(){
    console.log(' i am here rendering forgot password page')
     return (
           <div>
              <Container id="forgot">
                <div className="row justify-content-center">
                  <h2 className="head">Forgot Password</h2>   
                    <Form className="forgot-form bootstrap_validator col-sm-12 col-md-6 col-lg-5" role="form" data-toggle="validator">
                        <FormGroup>
                            <Label className="padding">Enter your email to reset your password</Label>
                              <Input className="form-control" placeholder="Email" name="email" type="email" />
                        </FormGroup>
                        <Button type="submit" color="info" className="btn btn-block btn-primary">Rest Your Password</Button>
                    </Form>  
                </div>  
              </Container>
           </div>     
   );
  }
}

export default Forgotpassword;
 