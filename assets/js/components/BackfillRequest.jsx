import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import NavbarMenu from './navbar';
import FontAwesome from "react-fontawesome";
import CalendarWidget from 'react-calendar-widget';
import { Collapse,Navbar,NavbarToggler,NavbarBrand,Nav,NavItem,NavLink,Button,Form,
        FormGroup,FormText,Label,Input,Modal,ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Textarea from 'react-textarea-autosize';
import moment from 'moment';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import requestBackfill from '../network/backfillRequest';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class BackfillRequest extends Component{
	constructor(props){
		super(props);
      this.successBackfill = this.successBackfill.bind(this);
			this.errorBackfill = this.errorBackfill.bind(this);
      this.onSubmitDate = this.onSubmitDate.bind(this);
      this.toggleInfo=this.toggleInfo.bind(this);
      this.infoPrint = this.infoPrint.bind(this);
			this.handleChange = this.handleChange.bind(this);
      this.handleChangeDate = this.handleChangeDate.bind(this);

			this.state = {
			    device_type:'',
          start_date:'',
          end_date:'',
          fetching_data:false, 
          isOpen: false,
          fitbit_data:{},
          garmin_data:{},
    			};
	}

	successBackfill(data){
      toast.info("Your request has been submitted successfully.",{className:"dark"});
	    if(data.data.length){
	      this.setState({
	          fitbit_data:data.data,
            fetching_data:false,
	        });
	    }
	    else{
	      this.errorBackfill(error);
	    }
  }

	errorBackfill(error){
      console.log(error);
      this.setState({
          fetching_data:false,
      });
  }
  
  handleChange(event){
      let value=event.target.value;
      event.preventDefault();
      this.setState({
          fetching_data:true,
          models:!this.state.models,
          device_type:value,

      });
  }
  handleChangeDate(event){
      let name = event.target.name;
      let value=event.target.value;
      event.preventDefault();
      this.setState({
          fetching_data:true,
          models:!this.state.models,
          [name]: value,

      });
  }

  onSubmitDate(event){
      event.preventDefault();
      let start_date = moment(this.state.start_date);
      let end_date = moment(this.state.end_date);
      this.setState({
          fetching_data:true,
          models:!this.state.models,
      },()=>{
          let requestData = {
            'device_type':this.state.device_type,
            'start_date':start_date,
            'end_date':end_date,
            'user':1
          }
        requestBackfill(this.successBackfill, this.errorBackfill, this.state.start_date, this.state.end_date, requestData.device_type, requestData.user, requestData.status);
      });
  }

  toggleInfo(){
      this.setState({
          infoButton:!this.state.infoButton
      });
  }

  infoPrint(){
      var mywindow = window.open('', 'PRINT');
      mywindow.document.write('<html><head><style>' +
                              '.research-logo {margin-bottom: 20px;width: 100%; min-height: 55px; float: left;}' +
                              '.print {visibility: hidden;}' +
                              '.research-logo img {max-height: 100px;width: 60%;border-radius: 4px;}' +
                              '</style><title>' + document.title  + '</title>');
      mywindow.document.write('</head><body >');
      mywindow.document.write('<h1>' + document.title  + '</h1>');
      mywindow.document.write(document.getElementById('modal1').innerHTML);
      mywindow.document.write('</body></html>');

      mywindow.document.close(); // necessary for IE >= 10
      mywindow.focus(); // necessary for IE >= 10*/

      mywindow.print();
      mywindow.close();
   }

	render(){
		const {fix} = this.props;
    //let device_type = this.state.device_type == 'Fitbit'?this.state.fitbit_data:this.state.garmin_data;
		return(
			<div className = "container-fluid">
		    <NavbarMenu title = { <span> Request Historical Data Backfill&nbsp;
                                  <span id = "infobutton" onClick = {this.toggleInfo}>
                                      <a className="infoBtn"> 
                                         <FontAwesome 
                                            name = "info-circle"
                                            size = "1x"/>
                                      </a>
                                  </span>
                              </span> }>
        </NavbarMenu>
        <Modal id = "popover"
               placement = "bottom" 
               isOpen = {this.state.infoButton}
               target = "infobutton" 
               toggle = {this.toggleInfo}>
                    <ModalHeader toggle={this.toggleInfo} style={{fontWeight:"bold"}}>
                        <div >                      
                          <a href="#" onClick={this.infoPrint} style={{fontSize:"15px",color:"black"}}><i className="fa fa-print">Print</i></a>
                        </div>
                    </ModalHeader>
                    <ModalBody className="modalcontent" id="modal1" >
                        <div> In some instances, we may able to backfill your historical data. Please enter the date range to backfill and we will try to backfill it. </div>
                    </ModalBody>
        </Modal> 

        <div className = "input" style={{ marginTop:"30px", marginBottom:"30px"}}>
            <Label style = {{marginBottom:"15px",display:"flex", justifyContent:"center"}}>Choose the Type of Device :</Label>   
            <div style={{display:"flex", justifyContent:"center"}}>
            <Input type = "select" 
                   className = "custom-select form-control" 
                   id = "select"
                   name = "type"
                   style = {{height:"35px", width:"220px",borderRadius:"7px",borderWidth:"medium", fontWeight:"bold", backgroundColor:"#E5E7E6"}}
                   checked = {this.state.device_type === ''}
                   onChange = {this.handleChange}>
                      <option value="select">Select</option>
                      <option value="fitbit">Fitbit</option>
                      <option value="garmin">Garmin</option>  
            </Input>
            </div>
        </div>

        <div style={{display:"flex", justifyContent:"center"}}>
            <Form>
            <div style = {{paddingBottom:"12px"}} className="justify-content-center">
                <Label>Start Date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
                <Input type = "date"
                       name = "start_date"
                       value = {moment(this.state.start_date).format('YYYY-MM-DD')}
                       onChange = {this.handleChangeDate} 
                       style = {{height:"35px",width:"220px",borderRadius:"7px"}}>
                </Input>
            </div>
            <div id = "date" className = "justify-content-center">
                <Label>End date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
                <Input type = "date"
                       name = "end_date"
                       value = {moment(this.state.end_date).format('YYYY-MM-DD')}
                       onChange = {this.handleChangeDate} 
                       style = {{height:"35px",width:"220px",borderRadius:"7px"}}>
                </Input>
            </div>
            <div id = "date" style = {{paddingLeft:"25px", marginTop:"22px"}} className = "justify-content-center">
                <button id = "nav-btn"
                        style = {{backgroundColor:"#ed9507"}}
                        type = "submit"
                        className = "btn btn-block-lg"
                        onClick = {this.onSubmitDate} 
                        style = {{width:"175px"}}>
                        SUBMIT
                </button>
            </div>
            </Form>
        </div>

        <ToastContainer position="top-center"
                        type="success"
                        autoClose={5000}
                        hideProgressBar={true}
                        newestOnTop={false}
                        closeOnClick
                        className="toast-popup">
        </ToastContainer>

      </div>
		)
	}
}

export default BackfillRequest;
