import React, { PropTypes } from 'react';
import { Link } from 'react-router'
import { Container, Select, Option, option, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import NavbarMenu from './navbar';
import Iframe from 'react-iframe';

class ServiceConnect_fitBit extends React.Component {

  onRegisterSuccess(response){


  }

  render() {
  return (
    <div className="container_fluid">
  <NavbarMenu fix={true}/>
      <br/>
      <br/>
      <br/>
      <p style={{textAlign:"center",marginTop:"150px",fontSize:"25px",fontWeight:"bold"}}>You have succesfully registered to your Fitbit</p>

   
    </div>
  );
}

}

export default ServiceConnect_fitBit; 