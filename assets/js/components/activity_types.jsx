import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Modal,
ModalHeader, ModalBody, ModalFooter, Collapse,Popover,PopoverBody} from 'reactstrap';
import Textarea from 'react-textarea-autosize';
import NavbarMenu from './navbar';
import CalendarWidget from 'react-calendar-widget';
import fetchActivity from '../network/activity';
import FontAwesome from "react-fontawesome";
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 


const activites = { "":"Select",
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
activityEditModeState_modal:{},
activites_hour_min:{},
start_end_time:{},
activities_to_delete:{},
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
workout_start_time:null,
 modal: false,
 modal_start_time:false,
 activity_calender:moment(),
 end_time_hours:null,
 end_time_min: null,
 end_time_am_pm:null,
 end_time_total_time:null,
 activitystarttime_calender:moment(),
start_time_hours:null,
start_time_min:null,
start_time_am_pm:null,
start_time_total_time:null,
activitystarttime_calender:moment(),
modalstarttime_activity_hour:"",
modalstarttime_activity_min:"",
modalstarttime_activity_ampm:"",
activityendtime_calender:moment(),
modalendtime_activity_hour:"",
modalendtime_activity_min:"",
modalendtime_activity_ampm:"",
button_state: "",
 checkboxState: true,
 modal_delete:false,
 getselectedid:'',
 selectedId_starttime:'',
 selectedId_delete:'',
}
this.errorActivity = this.errorActivity.bind(this);
this.sucessActivity = this.sucessActivity.bind(this);
this.processDate = this.processDate.bind(this);
this.toggleModal = this.toggleModal.bind(this);
this.handleChange=this.handleChange.bind(this);
this.handleChange_activity = this.handleChange_activity.bind(this);
this.handleChange_heartrate = this.handleChange_heartrate.bind(this);
this.handleChange_time = this.handleChange_time.bind(this);
this.handleChange_comments = this.handleChange_comments.bind(this);
this.handleChange_start_time=this.handleChange_start_time.bind(this);
this.handleChange_end_time=this.handleChange_end_time.bind(this);          
this.createSleepDropdown = this.createSleepDropdown.bind(this);
this.createSleepDropdown_heartrate=this.createSleepDropdown_heartrate.bind(this);
this.renderTable = this.renderTable.bind(this);
this.renderEditActivityModal = this.renderEditActivityModal.bind(this);
this.handleChangeModal = this.handleChangeModal.bind(this);
this.onClickEditActivityModalSave = this.onClickEditActivityModalSave.bind(this);
this.toggleCalendar = this.toggleCalendar.bind(this);
this.activitySelectOptions = this.activitySelectOptions.bind(this);
this.toggle = this.toggle.bind(this);
this.handleChangeActivityCalendar = this.handleChangeActivityCalendar.bind(this);
this.EndTimeInSecondsSaveHour = this.EndTimeInSecondsSaveHour.bind(this);
this.EndTimeInSecondsSavemin = this.EndTimeInSecondsSavemin.bind(this);
this.EndTimeInSecondsSaveAMPM = this.EndTimeInSecondsSaveAMPM.bind(this);
this.editTimeSecondsSaveModel = this.editTimeSecondsSaveModel.bind(this);
this.toggle_starttime=this.toggle_starttime.bind(this);
this.handleChangeActivityStartTimeCalendar=this.handleChangeActivityStartTimeCalendar.bind(this);
this.StartTimeInSecondsSaveHour=this.StartTimeInSecondsSaveHour.bind(this);
this.StartTimeInSecondsSavemin=this.StartTimeInSecondsSavemin.bind(this);
this.StartTimeInSecondsSaveAMPM=this.StartTimeInSecondsSaveAMPM.bind(this);
this.editStartTimeSecondsSaveModel=this.editStartTimeSecondsSaveModel.bind(this);
this.Delete_Activity=this.Delete_Activity.bind(this);
this.checkBox=this.checkBox.bind(this);
this.toggle_delete=this.toggle_delete.bind(this);
}

 checkBox(event) {
   const target = event.target;
          const selectedActivityId = target.getAttribute('data-name');
    if(!this.state.checkboxState){
    
    }
    else{

      
     const SelectedRow = delete this.state.activites[selectedActivityId]
     
    }
    this.setState({
      checkboxState: !this.state.checkboxState
    });
    this.toggle_delete(event);
   
  }

 

 Delete_Activity(event) {
    
                          
    }


toggle_delete(event){
  const target = event.target;
  const selectedActivityId = target.getAttribute('data-name');
  this.setState({
    modal_delete:!this.state.modal_delete,
        selectedId_delete:selectedActivityId

  });
}

 toggle(event) {
  const target = event.target;
    const selectedActivityId = target.getAttribute('data-name');
    this.setState({
      modal: !this.state.modal,
      getselectedid: selectedActivityId

    });
    

     
  }
  toggle_starttime(event){
    const target = event.target;
    const selectedActivityId = target.getAttribute('data-name');
    this.setState({
     modal_start_time:! this.state.modal_start_time ,
     selectedId_starttime: selectedActivityId  
    });
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

convertingStartEndTime(start_end_time){
  if(start_end_time){
    let starttime=moment.unix(start_end_time);
    var totalTime=moment(starttime, "x").format("DD MMM YYYY hh:mm a");
  }
  return totalTime;    
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
return activites_hour_min;

}

createActivityTime_modal(activityData){
let activites_hour_min_modal = {}
for(let [id,data] of Object.entries(activityData)){
let durationInHourMin_modal = this.secondsToHourMinStr(data["durationInSeconds"]);
let duration_hour_modal = durationInHourMin.split(":")[0];
let duration_min_modal = durationInHourMin.split(":")[1];
let tmp = {
"durationInSeconds":data["durationInSeconds"],
"duration_hour":duration_hour,
"duration_min":duration_min
};
activites_hour_min[id] = tmp;
}
return activites_hour_min;
}


createStartAndEndTime(activityData){
let start_end_time= {}
for(let [id,data] of Object.entries(activityData)){
let start_time_seconds = this.convertingStartEndTime(data["startTimeInSeconds"]);
let end_time_seconds= this.convertingStartEndTime(data["endTimeInSeconds"]);
let tmp = {
"start_time_seconds":start_time_seconds,
"end_time_seconds":end_time_seconds
};

start_end_time[id] = tmp;
}
return start_end_time;
}

sucessActivity(data){
    this.setState({
      selected_date:this.state.selected_date,
      activities_edit_mode:this.createActivityEditModeState(data.data.activites),
      activites_hour_min:this.createActivityTime(data.data.activites),
      start_end_time:this.createStartAndEndTime(data.data.activites),
      activites:data.data.activites,
      //activity_hours_mins:data.data.activites,
      //start_end_time:data.data.activites,
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
toggleCalendar(event){
 
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
      activitystarttime_calender:"",
      modalstarttime_activity_hour:"",
      modalstarttime_activity_min:"",
      modalstarttime_activity_ampm:"",
      activityendtime_calender:"",
      modalendtime_activity_hour:"",
      modalendtime_activity_min:"",
      modalendtime_activity_ampm:"",
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
      let categoryMode = this.state.activities_edit_mode[selectedActivityId];

      categoryMode['activityType'] = !categoryMode['activityType'] 
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
if(selectedActivityId){
    this.setState({
    ...this.state.activities_edit_mode,
        [selectedActivityId]:categoryMode
      });
   
  }
}


editToggleHandler_end_time(event){
            const target = event.target;
const selectedActivityId = target.getAttribute('data-name');
  let categoryMode = this.state.activities_edit_mode[selectedActivityId];
            
      categoryMode['endTimeInSeconds'] = !categoryMode['endTimeInSeconds'] 
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
     let categoryMode = this.state.activities_edit_mode[selectedActivityId];
            
      categoryMode['comments'] = !categoryMode['comments'] 
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

   
  editToggleHandler_start_time(event){
  const target = event.target;
  var selectedActivityId1 = target.getAttribute('data-name');
  let categoryMode = this.state.activities_edit_mode[selectedActivityId1];
  //let starttime_mode = this.state.start_end_time[selectedActivityId1];
  //starttime_mode['startTimeInSeconds'] = !starttime_mode['startTimeInSeconds'] ;
  categoryMode['startTimeInSeconds'] = !categoryMode['startTimeInSeconds'] ;
  if(selectedActivityId1){
    this.setState({
    //   start_end_time:{
    // ...this.state.start_end_time,
    //     [selectedActivityId1]:starttime_mode
    //   },
      //activities_edit_mode: {
    ...this.state.activities_edit_mode,
        [selectedActivityId1]:categoryMode
        //}
      });
      
   
  }
}
  editToggleHandler_time(event){
      const target = event.target;
      const selectedActivityId = target.getAttribute('data-name');
      let categoryMode = this.state.activities_edit_mode[selectedActivityId];
      let activity_mode=this.state.activites_hour_min[selectedActivityId]; 
         activity_mode['durationInSeconds']=!activity_mode['durationInSeconds'];
      categoryMode['durationInSeconds'] = !categoryMode['durationInSeconds'] ;
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

handleChangeActivityCalendar(date){
 
  this.setState({
    activity_calender: date
  })
}
handleChangeActivityStartTimeCalendar(date){
 
  this.setState({
    activitystarttime_calender: date
  })
}
    handleChange_activity(event){
  const target = event.target;
  const value = target.value;
  const selectedActivityId = target.getAttribute('data-name');
  let activity_data = this.state.activites[selectedActivityId];
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
  handleChange_start_time(date){
    //let start_time_data= date._d;
     this.setState({
      workout_start_time:date
     });


  }
  handleChange_end_time(date){
       
    this.setState({
      workout_end_time:date
    });
  }
 
    handleChange_heartrate(event){
  const target = event.target;
  const value = target.value;
  const selectedActivityId = target.getAttribute('data-name');
  let activity_data = this.state.activites[selectedActivityId];
  activity_data['averageHeartRateInBeatsPerMinute'] = value;
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

  }
}
valueChange(event){
const target = event.target;
  const value = target.value;
  const selectedActivityId = target.getAttribute('data-name');
  let activity_data = this.state.activites[selectedActivityId];
  activity_data['comments'] = value;
  this.setState({
 
  changevalue: activity_data

 
     });
}
 handleChange_comments(event){
  const target = event.target;
  const value = target.value;
  const selectedActivityId = target.getAttribute('data-name');
  let activity_data = this.state.activites[selectedActivityId];
  activity_data['comments'] = value;
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
  }

  else if(name == "modal_activity_comment"){
  this.setState({
[selectedActivityId]: value,
"modal_activity_comment":value
  });

  }
  this.setState({
[selectedActivityId]: value,

  });
}

editTimeSecondsSaveModel(event){
  const target = event.target;
  const value = target.value;
  const name = target.name;
  var end_date=this.state.activity_calender;
  var time_store=moment(end_date).format('DD MMM YYYY')
  var selectedActivityId = target.getAttribute('data-name');
  var hours = this.state.end_time_hours;
  var min = this.state.end_time_min;
  var ampm = this.state.end_time_am_pm;
  var result = time_store+' '+hours+' :'+min+' '+ampm;
  let activity_data = this.state.activites[selectedActivityId];
  activity_data['endTimeInSeconds'] = result;
  this.setState({
  activites:{...this.state.activites,
            [selectedActivityId]:activity_data
        }
     });
  this.toggle(event);
  this.setState({
    [selectedActivityId]: result
  })
}

  



editStartTimeSecondsSaveModel(event){
  const target = event.target;
  const value = target.value;
  const name = target.name;
  var start_date=this.state.activitystarttime_calender;
  var time_store1=moment(start_date).format('DD MMM YYYY')
  var selectedActivityId = target.getAttribute('data-name');
  var hours = this.state.start_time_hours;
  var min = this.state.start_time_min;
  var ampm = this.state.start_time_am_pm;
  var result1 = time_store1+' '+hours+': '+min+' '+ampm;
  let activity_data = this.state.activites[selectedActivityId];
  activity_data['startTimeInSeconds'] = result1;
  this.setState({
  activites:{...this.state.activites,
            [selectedActivityId]:activity_data
        }
     });
  this.toggle_starttime(event);
  this.setState({
     [selectedActivityId]: result1
  })
}
EndTimeInSecondsSaveCalender(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;
      const selectedActivityId = target.getAttribute('data-name');
  let new_value = {
      "calender_date":this.state.activity_calender,
      
  }
  this.setState({
    end_time_hours:value,
  })
}
EndTimeInSecondsSaveHour(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;
      const selectedActivityId = target.getAttribute('data-name');
  let new_value = {
      "calender_date":this.state.activity_calender,
      
  }
  this.setState({
    end_time_hours:value,
  })
}
StartTimeInSecondsSaveHour(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;
      const selectedActivityId = target.getAttribute('data-name');
  let new_value = {
      "calender_date":this.state.activitystarttime_calender,
      
  }
  this.setState({
    start_time_hours:value,
  });
  
}
EndTimeInSecondsSavemin(event){
  const target = event.target;
      const value = target.value;
      const name = target.name;
      const selectedActivityId = target.getAttribute('data-name');
  this.setState({
    end_time_min:value,
  })
}
StartTimeInSecondsSavemin(event){
  const target = event.target;
      const value = target.value;
      const name = target.name;
      const selectedActivityId = target.getAttribute('data-name');
  this.setState({
    start_time_min:value,
  })
}
EndTimeInSecondsSaveAMPM(event){
  const target = event.target;
      const value = target.value;
      const name = target.name;
      const selectedActivityId = target.getAttribute('data-name');
  this.setState({
    end_time_am_pm:value,
  })
}
StartTimeInSecondsSaveAMPM(event){
  const target = event.target;
      const value = target.value;
      const name = target.name;
      const selectedActivityId = target.getAttribute('data-name');
  this.setState({
    start_time_am_pm:value,
  })
}

 handleChange(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;
       if(value== "OTHER"){
        this.setState({
      [name]: value,
      "modal_activity_type":""
      });
      }
      else if(name == "activity_display_name"){
        this.setState({
      [name]: value,
      "modal_activity_type":value
      });
      }
      else{
        this.setState({
        [name]: value
        });
      }
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
 

  onClickEditActivityModalSave(data){
  var randomNumber = Math.floor(1000000000 + Math.random() * 900000000);
  let custom_activity_id = this.state.selectedActivityId;
  custom_activity_id = custom_activity_id?custom_activity_id:randomNumber;
  let durationmins = this.state.modal_activity_min;
  let durationhours = this.state.modal_activity_hour;
  let durationSeconds=durationhours +":"+ durationmins;
  let start_calender = moment(this.state.activitystarttime_calender, "x").format("DD MMM YYYY");
  let start_time_hours = this.state.modalstarttime_activity_hour
  let start_time_min = this.state.modalstarttime_activity_min
  let start_time_ampm = this.state.modalstarttime_activity_ampm
  let end_calender = moment(this.state.activityendtime_calender, "x").format("DD MMM YYYY");
  let end_time_hours = this.state.modalendtime_activity_hour
  let end_time_min = this.state.modalendtime_activity_min
  let end_time_ampm = this.state.modalendtime_activity_ampm
  let startTimeInSeconds = start_calender+" "+start_time_hours +":"+ start_time_min+" "+start_time_ampm;
  let endTimeInSeconds = end_calender+" "+end_time_hours+ ":"+ end_time_min+" "+end_time_ampm;

  let new_value = {
   "summaryId": custom_activity_id,
   "activityType": this.state.modal_activity_type,
   "averageHeartRateInBeatsPerMinute": this.state.modal_activity_heart_rate,
   "durationInSeconds":durationSeconds,
   "comments":this.state.modal_activity_comment,
   "startTimeInSeconds":startTimeInSeconds,
   "endTimeInSeconds":endTimeInSeconds,
  }; 
  
  let edit_mode_state = {}
  for(let [key,val] of Object.entries(new_value)){
    edit_mode_state[key] = false
  }

  let activity_time_state = {}
  for(let [id,data] of Object.entries(new_value)){
    let durationInHourMin = new_value["durationInSeconds"];
    let duration_hour = durationInHourMin.split(":")[0];
    let duration_min = durationInHourMin.split(":")[1];
    let activity_time_state = {
    "durationInSeconds":new_value["durationInSeconds"],
    "duration_hour":duration_hour,
    "duration_min":duration_min
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
    activitystarttime_calender:"",
    modalstarttime_activity_hour:"",
    modalstarttime_activity_min:"",
    modalstarttime_activity_ampm:"",
    activityendtime_calender:"",
    modalendtime_activity_hour:"",
    modalendtime_activity_min:"",
    modalendtime_activity_ampm:"",
    selectedActivityId:"",
    activityEditModal:!this.state.activityEditModal,
    editToggle: false,
    editToggle_heartrate:false,
    editToggle_comments:false,
    editToggle_time:false,
    activityEditModal: !this.state.activityEditModal,
    activities_edit_mode:{
      ...this.state.activities_edit_mode,
      [custom_activity_id]:edit_mode_state
    },
    activites_hour_min:{
      ...this.state.activites_hour_min,
      [custom_activity_id]:activity_time_state
    },
  });
}
  
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
const activityKeys = ["summaryId","activityType","averageHeartRateInBeatsPerMinute","startTimeInSeconds","endTimeInSeconds","durationInSeconds","comments"];
let activityRows = [];
for (let [key,value] of Object.entries(this.state.activites)){
let activityData = [];
let summaryId; 
let hour;
let min;

for (let key of activityKeys){
let value1 = value[key];
if(key === 'summaryId'){
summaryId = value1;
}
else if(key === "activityType"){
var  activityType=value1;
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
                          </Input> : !this.state.activites[summaryId][key]? activityType :this.state.activites[summaryId][key] }
                           
<span  data-name = {summaryId} onClick={this.editToggleHandlerActivityType.bind(this)}
            className="fa fa-pencil fa-1x progressActivity1"
            id = "add_button">
        </span>
                                   
        </td>);

}
else if(key === "averageHeartRateInBeatsPerMinute"){
let  averageHeartRateInBeatsPerMinute=value1;
activityData.push(<td  name = {summaryId}  id = "add_button">
                            { this.state.activities_edit_mode[summaryId][key]  ?                            
                        <Input 
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
        </span>
        </td>
        );
}
else if(key === "startTimeInSeconds"){
var  start_time=value1;
var start_time_sec=moment.unix(start_time);
var total_time1=moment(start_time_sec, "x").format("DD MMM YYYY hh:mm a");


activityData.push(<td  name = {summaryId}  id = "add_button">

                            { this.state.activities_edit_mode[summaryId][key]  ? 
                         <div>
                        </div> :this.state.activites[summaryId][key]?this.state.activites[summaryId][key]:total_time1  }  
                 
                  
                        <span data-name = {summaryId}  onClick={this.toggle_starttime}
            className="fa fa-pencil fa-1x progressActivity1"
            id = "add_button">
        </span>{console.log("id",this.state.activites[summaryId][key])}
        <Modal isOpen={this.state.modal_start_time} toggle={this.toggle_starttime} >
          <ModalHeader toggle={this.toggle_starttime}>Enter the Time Your Workout Started</ModalHeader>
          <ModalBody>
      <div className=" display_flex" >
                              <div className="align_width align_width1">
                              <div className="input  ">
                                <DatePicker
                                    id="datepicker"
                                    // name = "activitystarttime_calender"
                                    selected={this.state.activitystarttime_calender}
                                    onChange={this.handleChangeActivityStartTimeCalendar}
                                    data-name={summaryId}
                                    dateFormat="LL"
                                    isClearable={true}
                                    shouldCloseOnSelect={false}
                                />
                              </div>
                              </div>
                               <div className="align_width_time align_width1 margin_tp">
                                  <div className="input "> 
                                <Input type="select" 
                                // name="start_time_hours"
                                id="bed_hr"
                                data-name={summaryId}
                                className="form-control custom-select"
                                value={this.state.start_time_hours}
                                onChange={this.StartTimeInSecondsSaveHour}>
                                 <option key="hours" value="">Hours</option>
                                {this.createSleepDropdown(1,12)}                        
                                </Input>
                                </div>
                                </div>

                                <div className="align_width_time align_width1 margin_tp">
                               <div className="input ">
                                <Input type="select" 
                                //name="start_time_min"
                                 id="bed_min"
                                 data-name={summaryId}
                                className="form-control custom-select "
                                value={this.state.start_time_min}
                                onChange={this.StartTimeInSecondsSavemin}>
                                 <option key="mins" value="">Minutes</option>
                                {this.createSleepDropdown(0,59,true)}                        
                                </Input>                        
                                </div>
                                </div>

                                <div className="align_width_time align_width1 margin_tp">
                                 <div className="input1 ">
                                  <Input type="select" 
                                  data-name={summaryId}
                                     className="custom-select form-control "
                                    // name="start_time_am_pm"                                  
                                     value={this.state.start_time_am_pm}
                                     onChange={this.StartTimeInSecondsSaveAMPM} >
                                       <option value="">AM/PM</option>
                                       <option value="am">AM</option>
                                       <option value="pm">PM</option> 
                                    
                                     </Input>
                                      </div> 

                              </div>
                              </div>
                                        </ModalBody>
          <ModalFooter>
            <Button color="primary" data-name={this.state.selectedId_starttime} onClick={this.editStartTimeSecondsSaveModel}>Save</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </td>);

}
else if(key === "endTimeInSeconds"){
var  end_time=start_time+duration;
var end_time_sec=moment.unix(end_time);
var total_time=moment(end_time_sec, "x").format("DD MMM YYYY hh:mm a");
activityData.push(<td  name = {summaryId}  id = "add_button">
                            { this.state.activities_edit_mode[summaryId][key] ? <div>
                     </div> :  !this.state.activites[summaryId][key]? total_time :this.state.activites[summaryId][key]    }
                        
                        <span data-name = {summaryId} 
            className="fa fa-pencil fa-1x progressActivity1"
            id = "add_button"
            onClick={this.toggle}
            >
        </span>
        <Modal isOpen={this.state.modal} toggle={this.toggle} >
          <ModalHeader toggle={this.toggle}>Enter the Time Your Workout Ended</ModalHeader>
          <ModalBody>
      <div className=" display_flex" >
                              <div className="align_width align_width1">
                              <div className="input ">
                                <DatePicker
                                    id="datepicker"
                                    name = "sleep_bedtime_date"
                                    selected={this.state.activity_calender}
                                    onChange={this.handleChangeActivityCalendar}
                                    data-name={summaryId}
                                    dateFormat="LL"
                                    isClearable={true}
                                    shouldCloseOnSelect={false}
                                />
                              </div>
                              </div>
                               <div className="align_width_time align_width1 margin_tp">
                                  <div className="input "> 
                                <Input type="select" name="sleep_hours_bed_time"
                                id="bed_hr"
                                data-name={summaryId}
                                className="form-control custom-select"
                                value={this.state.end_time_hours}
                                onChange={this.EndTimeInSecondsSaveHour}>
                                 <option key="hours" value="">Hours</option>
                                {this.createSleepDropdown(1,12)}                        
                                </Input>
                                </div>
                                </div>

                                <div className="align_width_time align_width1 margin_tp">
                               <div className="input ">
                                <Input type="select" name="sleep_mins_bed_time"
                                 id="bed_min"
                                 data-name={summaryId}
                                className="form-control custom-select "
                                value={this.state.end_time_min}
                                onChange={this.EndTimeInSecondsSavemin}>
                                 <option key="mins" value="">Minutes</option>
                                {this.createSleepDropdown(0,59,true)}                        
                                </Input>                        
                                </div>
                                </div>

                                <div className="align_width_time align_width1 margin_tp">
                                 <div className="input1 ">
                                  <Input type="select" 
                                  data-name={summaryId}
                                     className="custom-select form-control "
                                     name="sleep_bedtime_am_pm"                                  
                                     value={this.state.end_time_am_pm}
                                     onChange={this.EndTimeInSecondsSaveAMPM} >
                                       <option value="">AM/PM</option>
                                       <option value="am">AM</option>
                                       <option value="pm">PM</option> 
                                    
                                     </Input>
                                      </div> 

                              </div>
                              </div>
                                        </ModalBody>
          <ModalFooter>
            <Button color="primary" data-name={this.state.getselectedid} onClick={this.editTimeSecondsSaveModel}>Save</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
              
        </td>);

}
else if(key === "durationInSeconds"){
var duration = value1;
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
else if(key === "comments"){
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
                        onBlur={this.handleChange_comments.bind(this), this.editToggleHandler_comments.bind(this)}>                       
                          </Textarea><Button data-name={summaryId} size = "sm" id={summaryId} 
                          className="btn btn-info save_btn" onClick={ this.editToggleHandler_comments.bind(this)}>Save
                          </Button></div>:this.state.modal_activity_comment? this.state.modal_activity_comment:comments}
                         
            <span data-name={summaryId} onClick={this.editToggleHandler_comments.bind(this)}
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

                       <span className="checkbox_delete fa fa-close martp_20" data-name={summaryId} style={{color:"red", marginTop:"15px"}} onClick={this.toggle_delete}>  
                     {/* <input  type="checkbox"
                          
                     
                    className="martp_20" type="checkbox" id="myCheck"
                    />*/}
                    </span>
                     <Modal isOpen={this.state.modal_delete} toggle={this.toggle_delete} >
         
          <ModalBody toggle={this.toggle_delete}>
      <div className=" display_flex" >
                              <div className=" align_width1">
                              
                               Do You want to Delete
                              </div>
                           </div>
                </ModalBody>
          <ModalFooter>
            <Button color="primary" data-name={this.state.selectedId_delete} onClick={this.checkBox}>Yes</Button>{' '}
            <Button color="secondary" onClick={this.toggle_delete}>No</Button>
          </ModalFooter>
        </Modal>
    </tr>
    ); 
      }
      
return activityRows.reverse();
}


renderEditActivityModal(){
      if (this.state.activityEditModal){
                 let modal = <Modal
                          placement="bottom"
                          target="progressActivity"                              
                          isOpen={this.state.activityEditModal}
                          toggle={this.handleChangeModal}>
                          <ModalHeader toggle={this.toggleModal}>
                            {this.state.selectedActivityId?'Edit Activity':'Create Manual Activity'}
                          </ModalHeader>
                              <ModalBody>
                         <FormGroup>                            
           
                        <Label className="padding1">1.Exercise Type</Label>
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
                      <Label className="padding1">1.1 Other Exercise Type</Label>
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
                      <Label className="padding1">2. Activity Heart Rate</Label>
                       <div className="input1 ">
                        <Input 
                          type="select" 
                          className="form-control"
                          style={{height:"37px"}}
                          name = "modal_activity_heart_rate" 
                          value={this.state.modal_activity_heart_rate}                               
                          onChange={this.handleChange}>
                          <option key="hours" value="">Select</option>
                          <option value="Not Measured">Not Measured</option>  
                        {this.createSleepDropdown(90,220)}     
                        </Input>
                            </div> 
                            </FormGroup>                               
                         <FormGroup>
                            <Label className="padding1">3. Enter the Time Your Workout Started</Label>
                     <div className=" display_flex margin_lft0" >
                      <div className="align_width align_width1">
                        <div className="input " style = {{marginLeft:"15px"}}> 
                      <DatePicker  className="calender_styles"
                                   id="datepicker"
                                   name = "activitystarttime_calender"
                                   selected={this.state.activitystarttime_calender}
                                   onChange={(date)=>{this.setState({activitystarttime_calender: date})}}
                                   //data-name={summaryId}
                                   dateFormat="LL"
                                   isClearable={true}
                                   shouldCloseOnSelect={false}
                               />
                      </div>
                      </div>

                         <div className="align_width align_width1">
                        <div className="input " style = {{marginLeft:"15px"}}> 
                      <Input type="select" name="modalstarttime_activity_hour"
                      id="bed_hr"
                      className="form-control custom-select"
                      value={this.state.modalstarttime_activity_hour}
                      onChange={this.handleChange}>
                       <option key="hours" value="">Hours</option>
                      {this.createSleepDropdown(0,12)}                        
                      </Input>
                      </div>
                      </div>

                  <div className="align_width align_width1">
                     <div className="input " style = {{marginLeft:"15px"}}>
                      <Input type="select" name="modalstarttime_activity_min"
                       id="bed_min"
                      className="form-control custom-select "                   
                      value={this.state.modalstarttime_activity_min}
                      onChange={this.handleChange}>
                       <option key="mins" value="">Minutes</option>
                      {this.createSleepDropdown(0,59,true)}                        
                      </Input>                        
                      </div>
                      </div>
                       <div className="align_width align_width1">
                     <div className="input " style = {{marginLeft:"15px"}}>
                      <Input type="select" name="modalstarttime_activity_ampm"
                       id="bed_min"
                      className="form-control custom-select "                   
                      value={this.state.modalstarttime_activity_ampm}
                      onChange={this.handleChange}>
                      <option value="">AM/PM</option>
                                      <option value="am">AM</option>
                                      <option value="pm">PM</option>                      
                      </Input>                        
                      </div>
                      </div>
                      </div>
                         </FormGroup>
                              <FormGroup>
                            <Label className="padding1">4. Enter the Time Your Workout Ended</Label>
                     <div className=" display_flex margin_lft0" >
                     <div className="align_width align_width1">
                        <div className="input " style = {{marginLeft:"15px"}}> 
                      <DatePicker  className="calender_styles"
                                   id="datepicker"
                                   name = "activityendtime_calender"
                                   selected={this.state.activityendtime_calender}
                                   onChange={(date)=>{this.setState({activityendtime_calender: date})}}
                                   //data-name={summaryId}
                                   dateFormat="LL"
                                   isClearable={true}
                                   shouldCloseOnSelect={false}
                               />
                      </div>
                      </div>
                         <div className="align_width align_width1">
                        <div className="input " style = {{marginLeft:"15px"}}> 
                      <Input type="select" name="modalendtime_activity_hour"
                      id="bed_hr"
                      className="form-control custom-select"
                      value={this.state.modalendtime_activity_hour}
                      onChange={this.handleChange}>
                       <option key="hours" value="">Hours</option>
                      {this.createSleepDropdown(0,12)}                        
                      </Input>
                      </div>
                      </div>

                  <div className="align_width align_width1">
                     <div className="input " style = {{marginLeft:"15px"}}>
                      <Input type="select" name="modalendtime_activity_min"
                       id="bed_min"
                      className="form-control custom-select "                   
                      value={this.state.modalendtime_activity_min}
                      onChange={this.handleChange}>
                       <option key="mins" value="">Minutes</option>
                      {this.createSleepDropdown(0,59,true)}                        
                      </Input>                        
                      </div>
                      </div>
                       <div className="align_width align_width1">
                     <div className="input " style = {{marginLeft:"15px"}}>
                      <Input type="select" name="modalendtime_activity_ampm"
                       id="bed_min"
                      className="form-control custom-select "                   
                      value={this.state.modalendtime_activity_ampm}
                      onChange={this.handleChange}>
                      <option value="">AM/PM</option>
                                      <option value="am">AM</option>
                                      <option value="pm">PM</option>                      
                      </Input>                        
                      </div>
                      </div>
                      </div>
                         </FormGroup>
                       <FormGroup>
                     <Label className="padding1">5. Exercise Duration (hh:mm)</Label>
                     <div className=" display_flex margin_lft0" >
                         <div className="align_width align_width1">
                        <div className="input " style = {{marginLeft:"15px"}}> 
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
                     <div className="input " style = {{marginLeft:"15px"}}>
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
                      </FormGroup>
                       <FormGroup>
                      <Label className="padding1">4. Exercise Comments</Label>
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
                      
                    
                          </ModalBody>
                          </Modal>  
            
                  return modal;
          
          }
    }
render(){

return(

<div className = "container_fluid">
<NavbarMenu fix={true}/>
<div className="row justify-content-center">
<div id = "activity_calender " className="cal_width">
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
<table className = "table table-striped table-hover table-responsive" id="dataTable">
<thead id = "add_button">
<td id = "add_button" className="add_button_back">Exercise Type</td>
<td id = "add_button" className="add_button_back">Activity Average Heart Rate</td>
<td id = "add_button" className="add_button_back">Enter the Time Your Workout Started</td>
<td id = "add_button" className="add_button_back">Enter the Time Your Workout Ended</td>
<td id = "add_button" className="add_button_back">Exercise Duration (hh:mm)</td>
<td id = "add_button" className="add_button_back">Comment</td>
<td id = "add_button" className="add_button_back">Delete</td>
</thead>
<tbody className = "tbody_styles">
{this.renderTable()}



            
            

</tbody>
</table>
</div>
 <div className="btn2 btn4 mar_20  row">
 <div>
                                    <Button
                                     id="nav-btn"
                                    style={{backgroundColor:"#ed9507"}}
                         type="submit"
                           className="btn btn-block-lg"
                            onClick={this.handleChangeModal}>
                            Create Manual Activity
                      </Button>
</div>
<div className="delete_position">
                       <Button
                            id="nav-btn"
                            style={{backgroundColor:"#ed9507"}}
                            className="btn btn-block-lg"
                            onClick={this.Delete_Activity('dataTable')}>
                            Delete
                      </Button>
                                   </div>
                                   </div>

{this.renderEditActivityModal()}

</div>
</div>
</div>

)
}
}