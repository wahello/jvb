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
  	<Container>

      <br/>
      <br/>
      <br/>
      <p>You have succesfully registered your Garmin Connect</p>

    </Container>
    </div>
  );
}

}

export default ServiceConnect; 