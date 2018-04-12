import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Modal,
ModalHeader, ModalBody, ModalFooter, Collapse,Popover,PopoverBody} from 'reactstrap';
import Textarea from 'react-textarea-autosize';
import NavbarMenu from './navbar';
import CalendarWidget from 'react-calendar-widget';
import fetchActivity from '../network/activity';
import FontAwesome from "react-fontawesome";
import moment from 'moment';


const activites = { "":"SELECT",
  //"ALL":"ALL",
"OTHER":"OTHER",
"HEART_RATE_RECOVERY":"HEART RATE RECOVERY(HRR)",
"JVB_STRENGTH_EXERCISES":"JVB STRENGTH EXERCISES",
"UNCATEGORIZED":"UNCATEGORIZED",
//"SEDENTARY":"SEDENTARY",
//"SLEEP":"SLEEP",
"RUNNING":"RUNNING",
"STREET_RUNNING":"STREET RUNNING",
"TRACK_RUNNING":"TRACK RUNNING",
"TRAIL_RUNNING":"TRAIL RUNNING",
"TREADMILL_RUNNING":"TREADMILL RUNNING",
"CYCLING":"CYCLING",
"CYCLOCROSS":"CYCLOCROSS",
"DOWNHILL_BIKING":"DOWNHILL_BIKING",
"INDOOR_CYCLING":"INDOOR CYCLING",
"MOUNTAIN_BIKING":"MOUNTAIN BIKING",
"RECUMBENT_CYCLING":"RECUMBENT CYCLING",
"ROAD_BIKING":"ROAD BIKING",
"TRACK_CYCLING":"TRACK CYCLING",
"FITNESS_EQUIPMENT":"FITNESS EQUIPMENT",
"ELLIPTICAL":"ELLIPTICAL",
"INDOOR_CARDIO":"INDOOR CARDIO",
"INDOOR_ROWING":"INDOOR ROWING",
"STAIR_CLIMBING":"STAIR CLIMBING",
"STRENGTH_TRAINING":"STRENGTH TRAINING",
"HIKING":"HIKING",
"SWIMMING":"SWIMMING",
"LAP_SWIMMING":"LAP SWIMMING",
"OPEN_WATER_SWIMMING":"OPEN WATER SWIMMING",
"WALKING":"WALKING",
"CASUAL_WALKING":"CASUAL WALKING",
"SPEED_WALKING":"SPEED WALKING",
"TRANSITION":"TRANSITION",
"SWIMTOBIKETRANSITION":"SWIM TO BIKE TRANSITION",
"BIKETORUNTRANSITION":"BIKE TO RUN TRANSITION",
"RUNTOBIKETRANSITION":"RUN TO BIKE TRANSITION",
"MOTORCYCLING":"MOTOR CYCLING",
"BACKCOUNTRY_SKIING_SNOWBOARDING":"BACKCOUNTRY SKIING SNOWBOARDING",
"BOATING":"BOATING",
"CROSS_COUNTRY_SKIING":"CROSS COUNTRY SKIING",
"DRIVING_GENERAL":"DRIVING GENERAL",
"FLYING":"FLYING",
"GOLF":"GOLF",
"HORSEBACK_RIDING":"HORSEBACK RIDING",
"INLINE_SKATING":"INLINE SKATING",
"MOUNTAINEERING":"MOUNTAINEERING",
"PADDLING":"PADDLING",
"RESORT_SKIING_SNOWBOARDING":"RESORT SKIING SNOW BOARDING",
"ROWING":"ROWING",
"SAILING":"SAILING",
"SKATE_SKIING":"SKATE SKIING",
"SKATING":"SKATING",
"SNOWMOBILING":"SNOW MOBILING",
"SNOW_SHOE":"SNOW SHOE",
"STAND_UP_PADDLEBOARDING":"STAND UP PADDLE BOARDING",
"WHITEWATER_RAFTING_KAYAKING":"WHITE WATER RAFTING KAYAKING",
"WIND_KITE_SURFING":"WIND KITE SURFING",
"GYMNASTICS":"GYMNASTICS",
"BASKETBALL":"BASKETBALL"
};

export default class Activity_Type extends Component{
constructor(props){
super(props)
this.state ={
activityEditModal:false,
calendarOpen:false,
selected_date:new Date(),
activites:{},
activities_edit_mode:{},
activites_hour_min:{},
modal_activity_type:"",
modal_activity_id:"",
modal_activity_heart_rate:"",
modal_activity_hour:"",
modal_activity_min:"",
modal_activity_comment:"",
activity_display_name:"",
editToggle_heartrate:false,
editToggle_comments:false,
editToggle_time:false,
changevalue: '',
}
this.errorActivity = this.errorActivity.bind(this);
this.sucessActivity = this.sucessActivity.bind(this);
this.processDate = this.processDate.bind(this);
this.toggleModal = this.toggleModal.bind(this);
this.handleChange_activity = this.handleChange_activity.bind(this);
this.handleChange_heartrate = this.handleChange_heartrate.bind(this);
this.handleChange_time = this.handleChange_time.bind(this);
this.handleChange_comments = this.handleChange_comments.bind(this);
            //this.handleChange_mins=this.handleChange_mins.bind(this);
            //this.handleChange_hours=this.handleChange_hours.bind(this);
this.createSleepDropdown = this.createSleepDropdown.bind(this);
this.createSleepDropdown_heartrate=this.createSleepDropdown_heartrate.bind(this);
this.renderTable = this.renderTable.bind(this);
this.renderEditActivityModal = this.renderEditActivityModal.bind(this);
this.handleChangeModal = this.handleChangeModal.bind(this);
this.onClickEditActivityModalSave = this.onClickEditActivityModalSave.bind(this);
this.toggleCalendar = this.toggleCalendar.bind(this);
this.activitySelectOptions = this.activitySelectOptions.bind(this);
}

secondsToHourMinStr(durationInSeconds){
	let time = "0:00";
	if(durationInSeconds){
		let min = parseInt(durationInSeconds/60);
		let hour = parseInt(min/60);
		let mins = parseInt(min%60);
		mins = (mins && mins < 10) ? "0" + mins : mins;
		time = hour + ":" + mins;
	}
	return time;
}

createActivityEditModeState(activityData){
let activityEditModeState = {}
for(let [id,data] of Object.entries(activityData)){
let tmp = {}
for(let [key,val] of Object.entries(data))
tmp[key] = false
activityEditModeState[id] = tmp;
}
return activityEditModeState;
}


createActivityTime(activityData){
let activites_hour_min = {}
for(let [id,data] of Object.entries(activityData)){
	let durationInHourMin = this.secondsToHourMinStr(data["durationInSeconds"]);
	let duration_hour = durationInHourMin.split(":")[0];
	let duration_min = durationInHourMin.split(":")[1];
	let tmp = {
		"durationInSeconds":data["durationInSeconds"],
		"duration_hour":duration_hour,
		"duration_min":duration_min
	};
	activites_hour_min[id] = tmp;
}
console.log("Activities hour min state:",activites_hour_min);
return activites_hour_min;
}


sucessActivity(data){
    this.setState({
      selected_date:this.state.selected_date,
      activities_edit_mode:this.createActivityEditModeState(data.data.activites),
      activites_hour_min:this.createActivityTime(data.data.activites),
      activites:data.data.activites,
      activity_hours_mins:data.data.activites,
    });
  }

  errorActivity(error){
    console.log(error.message);
}

processDate(date){
this.setState({
selected_date:date,
calendarOpen:!this.state.calendarOpen
});
fetchActivity(date,this.sucessActivity,this.errorActivity);
}

componentDidMount(){
    fetchActivity(this.state.selected_date,this.sucessActivity, this.errorActivity)
}
toggleCalendar(){
this.setState({
calendarOpen:!this.state.calendarOpen
})
}
toggleModal(){
    this.setState({
   modal_activity_type:"",
	modal_activity_heart_rate:"",
	modal_activity_hour:"",
	modal_activity_min:"",
	modal_activity_comment:"",
      selectedActivityId:"",
      activityEditModal:!this.state.activityEditModal
    });
  }

  handleChangeModal(event){
      const target = event.target;
      const selectedActivityId = target.getAttribute('data-name');
      let activityDisplayName = "";
      let current_activity = "";
      let hour = "";
  let mins = "";

      if(selectedActivityId){
      current_activity = this.state.activites[selectedActivityId];
  let activityDuration = current_activity?current_activity.durationInSeconds:"";
  const possible_activities = Object.keys(activites);
      let isOtherActivity = true;
      activityDisplayName = current_activity.activityType;
      for(let activity of possible_activities){
      if(current_activity.activityType == activity){
        isOtherActivity = false;
    break
  }
          }
          if(isOtherActivity)
          activityDisplayName = 'OTHER'

  if(activityDuration){
let min = parseInt(activityDuration/60); 
hour = parseInt(min/60); 
mins = parseInt(min%60);
mins = (mins && mins < 10) ? "0" + mins : mins;
   }
}
           this.setState({
      activity_display_name:activityDisplayName,
      modal_activity_type:current_activity?current_activity.activityType:"",
		modal_activity_heart_rate:current_activity?current_activity.averageHeartRateInBeatsPerMinute:"",
		modal_activity_hour:hour,
		modal_activity_min:mins,
		modal_activity_comment:current_activity?current_activity.comments:"",
      selectedActivityId:selectedActivityId,
      activityEditModal:true,
      });
     
    }
    editToggleHandlerActivityType(event){
    const target = event.target;
      const selectedActivityId = target.getAttribute('data-name');
      let activity_time=this.state.activites_hour_min[selectedActivityId];
      console.log("activity_time",activity_time);
      let categoryMode = this.state.activities_edit_mode[selectedActivityId];

      categoryMode['activityType'] = !categoryMode['activityType'] 
      console.log("cat"+categoryMode['activityType']);
      if(selectedActivityId){
    this.setState({
    ...this.state.activities_edit_mode,
        [selectedActivityId]:categoryMode
      });
           
            }
     }




editToggleHandler_heartrate(event){
            const target = event.target;
const selectedActivityId = target.getAttribute('data-name');
  let categoryMode = this.state.activities_edit_mode[selectedActivityId];
            
      categoryMode['averageHeartRateInBeatsPerMinute'] = !categoryMode['averageHeartRateInBeatsPerMinute'] 
      console.log("cat"+categoryMode['averageHeartRateInBeatsPerMinute']);
if(selectedActivityId){
    this.setState({
    ...this.state.activities_edit_mode,
        [selectedActivityId]:categoryMode
      });
   
  }
}




  editToggleHandler_comments(event){
  $('#'+selectedActivityId,).css('display','block');
  const target = event.target;
   const selectedActivityId = target.getAttribute('data-name');
   console.log("comment_id"+ selectedActivityId);
     let categoryMode = this.state.activities_edit_mode[selectedActivityId];
            
      categoryMode['comments'] = !categoryMode['comments'] 
      console.log("cat"+categoryMode['comments']);
if(selectedActivityId){
    this.setState({
    ...this.state.activities_edit_mode,
        [selectedActivityId]:categoryMode
      });
   if(!categoryMode['comments']){
      $('#'+selectedActivityId).css('display','none');

   }
    }
  }
componentDidMount(){
$('.comment_td .save_btn').css('display','none');
}
   
  
  editToggleHandler_time(event){
 
  const target = event.target;
      const selectedActivityId = target.getAttribute('data-name');
     let categoryMode = this.state.activities_edit_mode[selectedActivityId];
      //console.log("categoryMode", categoryMode);  
     let activity_mode=this.state.activites_hour_min[selectedActivityId]; 
     console.log("activitymode", activity_mode);  
         activity_mode['durationInSeconds']=!activity_mode['durationInSeconds'];
         console.log("activity_mode",activity_mode['durationInSeconds']);
      categoryMode['durationInSeconds'] = !categoryMode['durationInSeconds'] ;
      console.log("cat"+categoryMode['durationInSeconds']);
     if(selectedActivityId){
    this.setState({
    	activites_hour_min:{
    		...this.state.activites_hour_min,
    		[selectedActivityId]:activity_mode
    	},
    activities_edit_mode: {
    ...this.state.activities_edit_mode,
        [selectedActivityId]:categoryMode
        }
      });
   
         }
         
  }   

    handleChange_activity(event){
  const target = event.target;
  const value = target.value;
  const selectedActivityId = target.getAttribute('data-name');
  let activity_data = this.state.activites[selectedActivityId];
  console.log("Selected activity id:",selectedActivityId);
  activity_data['activityType'] = value;
  this.setState({
  activites:{...this.state.activites,
  [selectedActivityId]:activity_data
  }
     });
 
  $('#comments_id').css('display','none');
   if(value == "OTHER"){
  this.setState({
[selectedActivityId]: value,
"modal_activity_type":""
  });
  }
  else if(name == "activity_display_name"){
  this.setState({
[selectedActivityId]: value,
"modal_activity_type":value
  });

  }
  else{
  this.setState({
[selectedActivityId]: value
  });
  }
}
 
    handleChange_heartrate(event){
  const target = event.target;
  const value = target.value;
  const selectedActivityId = target.getAttribute('data-name');
  let activity_data = this.state.activites[selectedActivityId];
  console.log("Selected activity id:",selectedActivityId);
  activity_data['averageHeartRateInBeatsPerMinute'] = value;
  console.log("Selected:",activity_data['averageHeartRateInBeatsPerMinute'] );
  this.setState({
  activites:{...this.state.activites,
  [selectedActivityId]:activity_data
  }
     });

  $('#comments_id').css('display','none');
   if(value== "OTHER"){
  this.setState({
[selectedActivityId]: value,
"modal_activity_heart_rate":""
  });
  }
  else if(name == "modal_activity_heart_rate"){

  this.setState({
[selectedActivityId]: value,
"modal_activity_heart_rate":value
  });

  }
  else{
  this.setState({
[selectedActivityId]: value
  });
  console.log("name"+name);

  }
}
valueChange(event){
const target = event.target;
  const value = target.value;
  const selectedActivityId = target.getAttribute('data-name');
  console.log("comid:", selectedActivityId);
  let activity_data = this.state.activites[selectedActivityId];
   console.log("com_data:", activity_data);
  console.log("Selected activity id:",selectedActivityId);
  activity_data['comments'] = value;
  console.log("selection:", activity_data['comments'] );
  this.setState({
 
  changevalue: activity_data

 
     });
}
 handleChange_comments(event){
  const target = event.target;
  const value = target.value;
  const selectedActivityId = target.getAttribute('data-name');
  console.log("comid:", selectedActivityId);
  let activity_data = this.state.activites[selectedActivityId];
   console.log("com_data:", activity_data);
  console.log("Selected activity id:",selectedActivityId);
  activity_data['comments'] = value;
  console.log("selection:", activity_data['comments'] );
  this.setState({
  activites:{...this.state.activites,
  [selectedActivityId]:activity_data,

  }
     });
  $('#'+selectedActivityId).css('display','none');
   if(value== "OTHER"){
  this.setState({
[selectedActivityId]: value,
"modal_activity_comment":""
  });
  console.log("testing");
  }

  else if(name == "modal_activity_comment"){
  this.setState({
[selectedActivityId]: value,
"modal_activity_comment":value
  });
  console.log("state_id"+this.state.selectedActivityId);

  }
  this.setState({
[selectedActivityId]: value,

  });

  console.log("****", selectedActivityId)


}
//  handleChange_hours(event){
//   const target = event.target;
//   const value = target.value;
//   const selectedActivityId = target.getAttribute('data-name');
//   let activity_data = this.state.activites[selectedActivityId];
//   console.log("Selected activity id:",selectedActivityId);
//   console.log("data_value",activity_data);
//   var randomNumber = Math.floor(1000000000 + Math.random() * 900000000);
// let custom_activity_id = this.state.selectedActivityId;
// custom_activity_id = custom_activity_id?custom_activity_id:randomNumber;
  // let durationmins = this.state.modal_activity_min;
  // let durationhours = this.state.modal_activity_hour;
  // console.log("min"+durationmins);
  // let durationSeconds;
  // durationSeconds = durationhours*3600 + durationmins*60; 
  // console.log("tm"+durationSeconds); 
//   activity_data['durationInSeconds'] = value;
  // this.setState({
  // activites:{...this.state.activites,
  // [selectedActivityId]:activity_data
  // }
//      });
 
//   $('#comments_id').css('display','none');
//    if(value== "OTHER"){
//    this.setState({
// [selectedActivityId]: value,
// "durationSeconds":""
//   });
//   }
//   else if(name == "modal_activity_hour" && name== "modal_activity_min"){
//    this.setState({
// [selectedActivityId]: value,
// "durationSeconds":value
//   });

//   }

  
//   else{
//   this.setState({
// [selectedActivityId]: value
//   });
//   }
// }
handleChange_time(event){
  const target = event.target;
  const value = target.value;
  const name = target.name;
  const selectedActivityId = target.getAttribute('data-name');
  let activity_data = this.state.activites_hour_min[selectedActivityId];
  activity_data[name] = value;
  this.setState({
  	activites_hour_min:{
  		...this.state.activites_hour_min,
  		[selectedActivityId]:activity_data
  	}
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
  createSleepDropdown_heartrate(start_num , end_num, mins=false, step=1){
    let elements = [];
    let i = start_num;
    while(i<=end_num){
      if(i < 1)
        elements.push(
          <option key={0} value={0}>Not Measured</option>
          );
      else
        elements.push(
          <option key={i} value={i}>{i}</option>);
      i=i+step;
    }
    return elements;
  }


  onClickEditActivityModalSave(){
var randomNumber = Math.floor(1000000000 + Math.random() * 900000000);
let custom_activity_id = this.state.selectedActivityId;
custom_activity_id = custom_activity_id?custom_activity_id:randomNumber;
  let durationmins = this.state.modal_activity_min;
  let durationhours = this.state.modal_activity_hour;
  let durationSeconds;
  durationSeconds = durationhours*3600 + durationmins*60; 
  let new_value = {
    "summaryId": custom_activity_id,
                   "activityType": this.state.modal_activity_type,
                   "averageHeartRateInBeatsPerMinute": this.state.modal_activity_heart_rate,
                   "durationInSeconds":durationSeconds,
                   "comments":this.state.modal_activity_comment,
  }; 
 
  this.setState({
  activites:{
  ...this.state.activites,
  [custom_activity_id]:new_value,
  },
	   activity_display_name:"",
	   modal_activity_type:"",
		modal_activity_heart_rate:"",
		modal_activity_hour:"",
		modal_activity_min:"",
		modal_activity_comment:"",
      selectedActivityId:"",
      activityEditModal:!this.state.activityEditModal,
      editToggle: false,
      editToggle_heartrate:false,
      editToggle_comments:false,
      editToggle_time:false,
  });
 
  }
  activitySelectOptions(){
  let option = [];
for(let [value,label] of Object.entries(activites)){
option.push(<option key={value} value={value}>{label}</option>)
}
return option;
  }
  fieldChange(){
    if(this.state.editToggle_comments){
      this.setState({
      editToggle_comments:false


      })
      }
      }
 
renderTable(){
const activityKeys = ["summaryId","activityType","averageHeartRateInBeatsPerMinute","durationInSeconds","comments"];
let activityRows = [];
for (let [key,value] of Object.entries(this.state.activites)){
let activityData = [];
let summaryId; 
let hour;
let min; 
for (let key of activityKeys){
let value1 = value[key];
if(key == 'summaryId'){
summaryId = value1;
}
else if(key == "activityType"){
let  activityType=value1;
activityData.push(<td  name = {summaryId}  id = "add_button">

{ this.state.activities_edit_mode[summaryId][key] ? <Input 
                          type="select"
                                  data-name = {summaryId}
                          className="custom-select form-control edit_sel" 
                          name="activity_display_name"
                          value={this.state.activites[summaryId][key]}                                       
                          onChange={this.handleChange_activity}
                          onBlur={ this.editToggleHandlerActivityType.bind(this)}>
                                  {this.activitySelectOptions()}                                                                                                                                                                
                          </Input> : !this.state.activites[summaryId][key]? activityType:this.state.activites[summaryId][key] }
 
                              
<span  data-name = {summaryId} onClick={this.editToggleHandlerActivityType.bind(this)}
            className="fa fa-pencil fa-1x progressActivity1"
            id = "add_button">
        </span>
                                   
        </td>);

}
else if(key == "averageHeartRateInBeatsPerMinute"){
let  averageHeartRateInBeatsPerMinute=value1;
activityData.push(<td  name = {summaryId}  id = "add_button">
                            { this.state.activities_edit_mode[summaryId][key]  ? <Input 
                           data-name = {summaryId}
                        type="select" 
                        className="form-control"
                        style={{height:"37px",width:"80%"}}
                        name = "modal_activity_heart_rate" 
                        value={this.state.activites[summaryId][key]}                               
                        onChange={this.handleChange_heartrate}
                        onBlur={this.editToggleHandler_heartrate.bind(this)}>
                        
                        <option key="hours" value=" ">Select</option>
                    {this.createSleepDropdown_heartrate(90,220)}
                    <option value="Not Measured">Not Measured</option>     
                      </Input>: this.state.modal_activity_heart_rate? this.state.modal_activity_heart_rate:averageHeartRateInBeatsPerMinute}
                        <span data-name = {summaryId} onClick={this.editToggleHandler_heartrate.bind(this)}
            className="fa fa-pencil fa-1x progressActivity1"
            id = "add_button">
        </span></td>);

}
else if(key == "comments"){
let  comments=value1;
activityData.push(<td name={summaryId} className="comment_td" id = "add_button">
                              { this.state.activities_edit_mode[summaryId][key] ? <div><Textarea 
                              data-name={summaryId}
                            onBlur={ this.editToggleHandler_comments.bind(this)}
                            id="text_area"
                        className="form-control"
                        style={{height:"37px"}}
                        name = "modal_activity_comment" 
                        value={this.state.activites[summaryId][key]} 
                       onChange={this.valueChange.bind(this)}
                        onBlur={this.handleChange_comments.bind(this), this.editToggleHandler_comments.bind(this)}                              
                           >                       
                          </Textarea><Button data-name={summaryId} size = "sm" id={summaryId} className="btn btn-info save_btn" onClick={ this.editToggleHandler_comments.bind(this)}>Save</Button></div>
: this.state.modal_activity_comment? this.state.modal_activity_comment:comments}
                         
<span data-name={summaryId} onClick={this.editToggleHandler_comments.bind(this)}
            className="fa fa-pencil fa-1x progressActivity1 "
            id = "add_button">
        </span>
        </td>);

}

else if(key == "durationInSeconds"){
let duration = value1;
let min = parseInt(duration/60);
let hour = parseInt(min/60);
let mins = parseInt(min%60);
mins = (mins && mins < 10) ? "0" + mins : mins;
let time = hour + ":" + mins;
activityData.push(<td  name={summaryId} id = "add_button">
	
                     { this.state.activities_edit_mode[summaryId][key] ? 
                        <div className=" displayflex" >

                        <div className=" align_width1">
                     <div className="input " style = {{}}> 
                     <Input  ref="activity_hours" 
                     onBlur={this.editToggleHandler_time.bind(this)}
                     type="select" name="duration_hour"
                     data-name = {summaryId} 
                    id="bed_hr"

                    className="form-control custom-select"
                    value={this.state.activites_hour_min[summaryId]["duration_hour"]}
                    onChange={this.handleChange_time}>
                     <option key="hours" value="">Hours</option>
                    {this.createSleepDropdown(0,12)}                        
                    </Input>

                    </div>
                   
                    </div>

            <div className=" align_width1">
                   <div className="input " style = {{}}>
                    <Input  ref="activity_mins" type="select" name="duration_min"
                     data-name = {summaryId} 
                     id="bed_min"
                     onBlur={this.editToggleHandler_time.bind(this)}
                     className="form-control custom-select "                   
                    value={this.state.activites_hour_min[summaryId]["duration_min"]}
                    onChange={this.handleChange_time}>
                     <option key="mins" value="">Minutes</option>
                    {this.createSleepDropdown(0,59,true)}                        
                    </Input>  

                    </div>
                    </div>
                    </div>: this.state.activites_hour_min[summaryId]? this.state.activites_hour_min[summaryId]["duration_hour"]+":"+this.state.activites_hour_min[summaryId]["duration_min"]:time}
            <span data-name = {summaryId} onClick={this.editToggleHandler_time.bind(this)}
            className="fa fa-pencil fa-1x progressActivity1 "
            id = "add_button">
            </span>
            </td>); 
				}
				else{
				activityData.push(<td id = "add_button">{value1}</td>);
				}
				}
				activityRows.push(<tr name = {summaryId} id = "add_button">{activityData}
				             
				</tr>); 
				}
				return activityRows;
				}


			renderEditActivityModal(){
			if (this.state.activityEditModal){
			let modal = <Modal
                        placement="bottom"
                        target="progressActivity"                            
                        isOpen={this.state.activityEditModal}
                        toggle={this.handleChangeModal}>
                        <ModalHeader toggle={this.toggleModal}>
                        {this.state.selectedActivityId?'Edit Activity':'Add Activity'}
                        </ModalHeader>
                            <ModalBody>
                       <FormGroup>                            
         
                      <Label className="padding">1.Exercise Type</Label>
                      <div className="input ">
                         <Input 
                          type="select" 
                          className="custom-select form-control" 
                          name="activity_display_name"
                          value={this.state.activity_display_name}                                       
                          onChange={this.handleChange}>
                                  {this.activitySelectOptions()}                                                                                                                                                                
                              </Input>
                      </div>
                     </FormGroup>

                     {this.state.activity_display_name == "OTHER" &&
                     <FormGroup>                      
                    <Label className="padding">1.1 Other Exercise Type</Label>
                     <div className="input1 ">
                      <Input
                      type = "text" 
                        className="form-control"
                        style={{height:"37px"}}
                        name="modal_activity_type"
                        value={this.state.modal_activity_type}                                 
                        onChange={this.handleChange}>   
                      </Input>
                          </div> 
                          </FormGroup>
                      }
                      <FormGroup>
                    <Label className="padding">2. Activity Average Heart Rate</Label>
                     <div className="input1 ">
                      <Input 
                        type="select" 
                        className="form-control"
                        style={{height:"37px"}}
                        name = "modal_activity_heart_rate" 
                        value={this.state.modal_activity_heart_rate}                               
                        onChange={this.handleChange}>
                        <option key="hours" value="">Select</option>
                    {this.createSleepDropdown(90,220)}     
                      </Input>
                          </div> 
                          </FormGroup>                               
            
                     <FormGroup>
                   <Label className="padding">3. Exercise Duration (hh:mm)</Label>
                   <div className=" displayflex" >
                         <div className=" align_width1">
                      <div className="input " style = {{}}> 
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

            <div className=" align_width1">
                   <div className="input " style = {{}}>
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
                     <FormGroup>
                    <Label className="padding">4. Exercise Comments</Label>
                     <div className="input1 ">
                      <Textarea 
                        className="form-control"
                        style={{height:"37px"}}
                        name = "modal_activity_comment" 
                        value={this.state.modal_activity_comment}                               
                        onChange={this.handleChange}>   
                      </Textarea>
                          </div> 
                          </FormGroup> 
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
// componentDidMount(){
// $(window).click(function(e){
// var modal= document.getElementById("text_area");
// console.log(modal);

//     if(modal) {
//     this.setState({
     
//        editToggle_comments:true,

//       });

   
//     }
//      var modal= document.getElementById("text_area");

//     if(e.target modal == ''){
//    this.setState({
//    editToggle_comments: false
//    })
//     }
// }.bind(this));
// 
//}

render(){

return(

<div className = "container_fluid">
<NavbarMenu fix={true}/>
<div className="row justify-content-center">
<div id = "activity_calender">
<span id="navlink" onClick={this.toggleCalendar} id="progress">
                <FontAwesome
                    name = "calendar"
                    size = "2x"
                />
      </span> 
      <Popover
                        placement="bottom"
                        isOpen={this.state.calendarOpen}
                        target="progress"
                        toggle={this.toggleCalendar}>
                              <PopoverBody className="calendar2">
                                <CalendarWidget  onDaySelect={this.processDate}/>
                              </PopoverBody>
                     </Popover> 
                     </div>
                     <div id = "activity_table">
                      <div className="table-responsive tableresponsive" >  
<table className = "table table-striped table-hover table-responsive">
<thead id = "add_button">
<td id = "add_button" className="add_button_back">Exercise Type</td>
<td id = "add_button" className="add_button_back">Avg Heart Rate</td>

<td id = "add_button" className="add_button_back">Exercise Duration (hh:mm)</td>
<td id = "add_button" className="add_button_back">Comment</td>
</thead>
<tbody className = "tbody_styles">
{this.renderTable()}
<tr>
<td id="add_button" className="add_button_back"></td>
<td id="add_button"  className="add_button_back "> 
<span
  id="add_button"
  data-name=""
              className="fa fa-plus-circle fa-1x add_button"
              onClick={this.handleChangeModal}
              >
              </span>
            </td>
            <td id="add_button" className="add_button_back"></td> 
</tr>
</tbody>
</table>
{this.renderEditActivityModal()}
</div>
</div>
</div>
</div>

)
}
}

