import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Modal,
		ModalHeader, ModalBody, ModalFooter, Collapse} from 'reactstrap';
import Textarea from 'react-textarea-autosize';
import NavbarMenu from './navbar';
import CalendarWidget from 'react-calendar-widget';
import fetchAcivity from '../network/activity';
import FontAwesome from "react-fontawesome";
import moment from 'moment';



export default class Activity_Type extends Component{
		constructor(props){
				super(props)
				this.state ={
					activityEditModal:false,
					activities:{
						   // 	"2574387387":{
						   //                 "activityID": 2574387387,
						   //                 "activityType": "RUNNING",
						   //                 "avgHeartRate": 102,
						   //                 "durationInSeconds":2700

						   //               },
						   // "2574643387":{
						   //                 "activityID": 2574643387,
						   //                 "activityType": "WALKING",
						   //                 "avgHeartRate": 98,
						   //                 "durationInSeconds":2200
						   //              },
						   // "7424387387":{
						   //                 "activityID": 7424387387,
						   //                 "activityType": "RUNNING",
						   //                 "avgHeartRate": 135,
						   //                 "durationInSeconds":2900
						   //              },
			      //           "7424387388":{
				     //               "activityID": 7424387388,
				     //               "activityType": "JUMPING",
				     //               "avgHeartRate": 135,
				     //               "durationInSeconds":2900
			      //           }
						},
					modal_activity_type:"",
					modal_activity_id:"",
					modala_activity_heart_rate:"",
					modal_activity_hour:"",
					modal_activity_min:"",

				}
				this.sucessActivity = this.sucessActivity.bind(this);
				this.processDate = this.processDate.bind(this);
				this.toggleModal = this.toggleModal.bind(this);
				this.handleChange = this.handleChange.bind(this);
				this.createSleepDropdown = this.createSleepDropdown.bind(this);
				this.renderTable = this.renderTable.bind(this);
				this.renderEditActivityModal = this.renderEditActivityModal.bind(this);
				this.handleChangeModal = this.handleChangeModal.bind(this);
				this.onClickEditActivityModalSave = this.onClickEditActivityModalSave.bind(this);
		}

		sucessActivity(data){
		    console.log(data);
		    this.setState({
		      activities:data.data.activities
		    });
 		 }

 		errorActivity(error){
		    console.log(error.message);
		}

		processDate(date){
		  fetchAcivity(date,this.sucessActivity,this.errorActivity);
		}

		componentDidMount(){
		    var today=new Date();
		    fetchAcivity(today,this.sucessActivity, this.errorActivity)
		}

		toggleModal(){
		    this.setState({
		    	modal_activity_type:"",
				modala_activity_heart_rate:"",
				modal_activity_hour:"",
				modal_activity_min:"",
		      	selectedActivityId:"",
		      activityEditModal:!this.state.activityEditModal
		    });
 		 }

 		 handleChangeModal(event){
		      const target = event.target;
		      const selectedActivityId = target.getAttribute('data-name');
		      let current_activity = this.state.activities[selectedActivityId];
			  let activityDuration = current_activity?current_activity.durationInSeconds:"";
			  let	hour = "";
			  let	mins = "";
			  if(activityDuration){
					let min = parseInt(activityDuration/60);				
					hour = parseInt(min/60);				
					mins = parseInt(min%60);
			   }

		      this.setState({
		      	modal_activity_type:current_activity?current_activity.activityType:"",
				modala_activity_heart_rate:current_activity?current_activity.avgHeartRate:"",
				modal_activity_hour:hour,
				modal_activity_min:mins,
		      	selectedActivityId:selectedActivityId,
		      	activityEditModal:true,
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

    	 createSleepDropdown(start_num , end_num, mins=false, step=1){
			    let elements = [];
			    let i = start_num;
			    while(i<=end_num){
			      let j = (mins && i < 10) ? "0"+i : i;
			      elements.push(<option key={j} value={j}>{j}</option>);
			      i=i+step;
			    }
			    return elements;
  		}
  		onClickEditActivityModalSave(){
			var randomeNumber = Math.floor(1000000000 + Math.random() * 900000000);
			let custom_activity_id = this.state.selectedActivityId;
			custom_activity_id = custom_activity_id?custom_activity_id:randomeNumber;
  			let durationmins = this.state.modal_activity_min;
  			let durationhours = this.state.modal_activity_hour;
  			let durationSeconds;
  			durationSeconds = durationhours*3600 + durationmins*60;			
  			let new_value = {
  							  "activityID": custom_activity_id,
			                   "activityType": this.state.modal_activity_type,
			                   "avgHeartRate": this.state.modala_activity_heart_rate,
			                   "durationInSeconds":durationSeconds
  			};
  			this.setState({
  				activities:{
  					...this.state.activities,
  					[custom_activity_id]:new_value,
  				},
  				modal_activity_type:"",
				modala_activity_heart_rate:"",
				modal_activity_hour:"",
				modal_activity_min:"",
		      	selectedActivityId:"",
		      	activityEditModal:!this.state.activityEditModal,
  			});
  		}

		renderTable(){
			let activityRows = [];
			for (let [key,value] of Object.entries(this.state.activities)){
				let activityData = [];
				let activityID;	
				let hour;
				let min;				
				for (let [key1,value1] of Object.entries(value)){
						if(key1 == 'activityID'){
							activityID = value1;
						}
						else if(key1 == "durationInSeconds"){
							let duration = value1;
							let min = parseInt(duration/60);
							let hour = parseInt(min/60);
							let mins = parseInt(min%60);
							let time = hour + ":" + mins;
							activityData.push(<td>{time}</td>);						
						}else{
							activityData.push(<td>{value1}</td>);
						}
				 }
				activityRows.push(<tr name = {activityID}>{activityData}
					              <span name={activityID}
					              data-name = {activityID}
					              className="fa fa-pencil fa-1x"
					              onClick={this.handleChangeModal}
					              id="progressActivity">
					              </span>
								</tr>); 
			}
			return activityRows;
		}

		renderEditActivityModal(){
			if (this.state.activityEditModal){
					let modal =	<Modal
	                        placement="bottom"
	                        target="progressActivity"		                           
	                        isOpen={this.state.activityEditModal}
	                        toggle={this.handleChangeModal}>
	                        <ModalHeader toggle={this.toggleModal}></ModalHeader>
	                            <ModalBody>
	                       <FormGroup>                            
	         
	                      <Label className="padding">1.Activity Type.</Label>
	                      <div className="input ">
	                         <Input 
	                          type="select" 
	                          className="custom-select form-control" 
	                          name="modal_activity_type"
	                          value={this.state.modal_activity_type}                                       
	                          onChange={this.handleChange}>
	                                  <option value=" ">Select</option>                                        
	                                  <option value="RUNNING">RUNNING</option>
	                                  <option value="JUMPING">JUMPING</option>  
	                                  <option value="WALKING">WALKING</option>                                                                                                                                                                    
	                              </Input>
	                      </div>
	                     </FormGroup>
	                      <FormGroup>
	                    <Label className="padding">2. Activity Heart Rate.</Label>
	                     <div className="input1 ">
	                      <Input 
	                        type="select" 
	                        className="form-control"
	                        style={{height:"37px"}}
	                        name = "modala_activity_heart_rate" 
	                        value={this.state.modala_activity_heart_rate}                               
	                        onChange={this.handleChange}>
	                        <option key="hours" value="">Select</option>
	                    	{this.createSleepDropdown(90,220)}     
	                      </Input>
	                          </div> 
	                          </FormGroup>                               
	           		
	                     <FormGroup>
	                   <Label className="padding">3. Activity Duration.</Label>
	                   <div className=" display_flex" >
                         <div className="align_width align_width1">
	                      <div className="input "> 
	                    <Input type="select" name="modal_activity_hour"
	                    id="bed_hr"
	                    className="form-control custom-select"
	                    value={this.state.modal_activity_hour}
	                    onChange={this.handleChange}>
	                     <option key="hours" value="">Hours</option>
	                    {this.createSleepDropdown(0,12)}                        
	                    </Input>
	                    </div>
	                    </div>

	           			<div className="align_width align_width1">
	                   <div className="input ">
	                    <Input type="select" name="modal_activity_min"
	                     id="bed_min"
	                    className="form-control custom-select "	                  
	                    value={this.state.modal_activity_min}
	                    onChange={this.handleChange}>
	                     <option key="mins" value="">Minutes</option>
	                    {this.createSleepDropdown(0,59,true)}                        
	                    </Input>                        
	                    </div>
	                    </div>
	                    </div>
	                    <div className ="row" id="save_cancel_btn">
	                    <Button size = "sm" className="btn btn-info" onClick={this.onClickEditActivityModalSave}>Save</Button>&nbsp;&nbsp;&nbsp;&nbsp;
	                    <Button size = "sm" className="btn btn-info" onClick={this.toggleModal}>Cancel</Button>
	                    </div>
	                    </FormGroup>
	                  
	                        </ModalBody>
	                        </Modal>  
	                return modal;
	        }
		}

	render(){
		return(
			<div className = "container_fluid">
				<NavbarMenu fix={true}/>
				<div id = "activity_calender">
				<CalendarWidget  onDaySelect={this.processDate}/>
				</div>
					<table>
					<thead>
					<td>Activity Type</td>
					<td>Avg Heart Rate</td>
					<td>Duration In Seconds</td>
					</thead>
						<tbody>
						{this.renderTable()}
						<tr>
						<td></td>
						<td> 
						<span
			              className="fa fa-plus-circle fa-1x"
			              onClick={this.handleChangeModal}
			              id="progressActivity">
			              </span>
			            </td>
						<td></td>	
						</tr>
						</tbody>
					</table>
					{this.renderEditActivityModal()}

			</div>
			)
	}
}
