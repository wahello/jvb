import React, { PropTypes } from 'react';
import { Link } from 'react-router'
import { Container, Select, Option, option, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import Navbar from '../components/navbar';
import Iframe from 'react-iframe';

class ServiceConnect extends React.Component {

  onRegisterSuccess(response){


  }

  render() {

    console.log('i am in the render for register');
  return (
    <div>
     <Navbar />
  	<Container>

    <Iframe url="/users/request_token"
        width="450px"
        height="450px"
        display="initial"
        position="relative"
        allowFullScreen/>

    </Container>
    </div>
  );
}

}

export default ServiceConnect; 