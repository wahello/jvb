import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import NavbarMenu from './navbar';
import FontAwesome from "react-fontawesome";
import CalendarWidget from 'react-calendar-widget';
import { Collapse, Navbar, NavbarToggler, 
         NavbarBrand, Nav, NavItem, NavLink,
        Button,Popover,PopoverBody,Form,FormGroup,FormText,Label,Input} from 'reactstrap';
import Textarea from 'react-textarea-autosize';
import moment from 'moment';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import {fetchData} from '../network/new_link';
import {getInput} from './Input';  

class NewLink extends Component{
	constructor(props){
		super(props);
			this.errorFetch = this.errorFetch.bind(this);
		  this.successFetch = this.successFetch.bind(this);
      this.onSuccess = this.onSuccess.bind(this);
      this.onFailure = this.onFailure.bind(this);
		  this.processDate = this.processDate.bind(this);
      this.onSubmitDate = this.onSubmitDate.bind(this);
			this.toggleCalendar = this.toggleCalendar.bind(this);
			this.handleChange = this.handleChange.bind(this);

      let initial_state = getInput(moment().subtract(7,'days'),
                      moment());

				this.state = {
				    mode:'',
			      today_date:moment(),
            start_date:moment().subtract(7,'days').toDate(),
            end_date:moment().toDate(),
		        selected_date: new Date(),
            calendarOpen:false,  
            fetching_ql:false,
            creating_ql:false,  
            isOpen: false,
            data:initial_state,
            // fitbit_data:{},    
            // garmin_data:{},              
      			};
	}

	processDate(date){
	    let end_date = moment(end_date);
      let start_date = moment(start_date).subtract(7,'days');
          this.setState({
            selected_date:new Date(),
            start_date : start_date.toDate(),
            end_date : end_date.toDate(),
            fetching_ql:true,
            calendarOpen:!this.state.calendarOpen
          },()=>{
            fetchData(this.state.start_date, this.state.end_date, this.state.selected_date, this.successFetch,
                    this.errorFetch);
          });
	}

	successFetch(data){
	    if(data.data.length){
	      this.setState({
	          data : data.data,
	        });
	    }
	    else{
	      this.errorFetch(data);
	    }
  	}

	errorFetch(error){
    let initial_state = getInput(this.state.start_date,
                           this.state.end_date);

    this.setState({
      InputData:initial_state,
      selected_date:this.state.selected_date, 
    },()=>{
      fetchData(this.state.start_date, this.state.end_date, this.state.selected_date, this.success,this.error);
    });
  }
  
  handleChange(event){
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  onSubmitDate(event){
    event.preventDefault();
    let start_date = moment(this.state.start_date);
    let end_date = moment(this.state.end_date);
    this.setState({
      start_date : start_date.toDate(),
      end_date : end_date.toDate(),
      fetching_ql:true,
      model:!this.state.model,
    },()=>{
      fetchData(this.state.start_date, this.state.end_date, this.SuccessFetch,
              this.errorFetch);
    });
  }

  toggleCalendar(){
    this.setState({
      calendarOpen:!this.state.calendarOpen
    });
  }

  onSuccess(data,start_date,end_date){
    this.success(data,start_date,end_date);
    this.setState({
      creating_ql:false
    });
  }

  onFailure(error){
    console.log(error.message);
    this.setState({
      creating_ql:false
    });
  }

	componentDidMount(){
	    fetchData(this.state.start_date, this.state.end_date, this.state.selected_date, this.successFetch, this.errorFetch);  
	}

	render(){
		const {fix} = this.props;
    //let this.state.mode == 'Fitbit'?this.state.fitbit_data:this.state.garmin_data;
		return(
			<div className = "container-fluid">
			    <NavbarMenu title = {<span style = {{fontSize:"22px"}}>New Page</span>} />
          <div className="input" style={{marginLeft:"30px",marginTop:"30px", marginBottom:"30px"}}>
            <Label style={{textAlign:"left", paddingBottom:"12px"}}>Select the type of data :</Label><br></br>
            <Input type="select" 
                   className="custom-select form-control" 
                   id="select"
                   name="type"
                   style={{height:"35px", width:"220px",marginBottom:"20px", borderRadius:"7px",borderWidth:"medium", fontWeight:"bold", backgroundColor:"#E5E7E6"}}
                   checked = {this.state.mode === ''}
                   onChange={this.handleChange}>
                      <option value="select">Select</option>
                      <option value="Fitbit">Fitbit</option>
                      <option value="Garmin">Garmin</option>                                                                                                                                                                                                      </Input>
          </div> 
     <Form>
        <div style={{paddingLeft:"30px", paddingBottom:"12px"}} className="justify-content-center">
            <Label>Start Date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
            <Input type="date"
                   name="start_date"
                   value={moment(this.state.start_date).format('YYYY-MM-DD')}
                   onChange={this.handleChange} 
                   style={{height:"35px",width:"220px",borderRadius:"7px"}}/>
        </div>
        <div id="date" style={{paddingLeft:"30px"}} className="justify-content-center">
            <Label>End date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
            <Input type="date"
                   name="end_date"
                   value={moment(this.state.end_date).format('YYYY-MM-DD')}
                   onChange={this.handleChange} 
                   style={{height:"35px",width:"220px",borderRadius:"7px"}}/>
        </div>
        <div id="date" style={{paddingLeft:"50px", marginTop:"22px"}} className="justify-content-center">
        <button id="nav-btn"
                style={{backgroundColor:"#ed9507"}}
                type="submit"
                className="btn btn-block-lg"
                onClick={this.onSubmitDate} 
                style={{width:"175px"}}>SUBMIT</button>
         </div>
     </Form>

     <Popover placement="bottom"
              isOpen={this.state.calendarOpen}
              target="calendar"
              toggle={this.toggleCalendar}>
                <PopoverBody className="calendar">
                  <CalendarWidget onDaySelect={this.processDate}/>
                </PopoverBody>
     </Popover>

</div>
		)
	}
}

export default NewLink;
