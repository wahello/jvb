import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Modal,
ModalHeader, ModalBody, ModalFooter, Collapse,Popover,PopoverBody} from 'reactstrap';
import Textarea from 'react-textarea-autosize';
import FontAwesome from "react-fontawesome";
import moment from 'moment';
import 'moment-timezone';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 


const activites = { "":"Select",
"OTHER":"OTHER",
"HEART_RATE_RECOVERY":"HEART RATE RECOVERY(HRR)",
"JVB_STRENGTH_EXERCISES":"JVB STRENGTH EXERCISES",
"BACKCOUNTRY_SKIING_SNOWBOARDING":"BACKCOUNTRY SKIING SNOWBOARDING",
"BARRE_CLASS":"BARRE CLASS",
"BASKETBALL":"BASKETBALL",
"BIKETORUNTRANSITION":"BIKE TO RUN TRANSITION",
"BOATING":"BOATING",
"CASUAL_WALKING":"CASUAL WALKING",
"CROSS_COUNTRY_SKIING":"CROSS COUNTRY SKIING",
"CYCLING":"CYCLING",
"CYCLOCROSS":"CYCLOCROSS",
"DANCING":"DANCING",
"DOWNHILL_BIKING":"DOWNHILL_BIKING",
"DRIVING_GENERAL":"DRIVING GENERAL",
"ELLIPTICAL":"ELLIPTICAL",
"FITNESS_EQUIPMENT":"FITNESS EQUIPMENT",
"FLYING":"FLYING",
"GARDENING":"GARDENING",
"GOLF":"GOLF",
"GYM CLASS":"GYM CLASS",
"GYMNASTICS":"GYMNASTICS",
"HIKING":"HIKING",
"HORSEBACK_RIDING":"HORSEBACK RIDING",
"INDOOR_CARDIO":"INDOOR CARDIO",
"INDOOR_CYCLING":"INDOOR CYCLING",
"INDOOR_ROWING":"INDOOR ROWING",
"INLINE_SKATING":"INLINE SKATING",
"KICKBALL":"KICKBALL",
"KNEE WALKER SCOOTERING":"KNEE WALKER SCOOTERING",
"LAP_SWIMMING":"LAP SWIMMING",
"MOUNTAIN_BIKING":"MOUNTAIN BIKING",
"MOTORCYCLING":"MOTOR CYCLING",
"MOUNTAINEERING":"MOUNTAINEERING",
"OPEN_WATER_SWIMMING":"OPEN WATER SWIMMING",
"PADDLING":"PADDLING",
"PILATES":"PILATES",
"PIYO-PILATES/YOGA":"PIYO-PILATES/YOGA",
"RECESS_PLAYING":"RECESS PLAYING",
"RECUMBENT_CYCLING":"RECUMBENT CYCLING",
"RESORT_SKIING_SNOWBOARDING":"RESORT SKIING SNOW BOARDING",
"ROAD_BIKING":"ROAD BIKING",
"ROWING":"ROWING",
"RUNNING":"RUNNING",
"RUNTOBIKETRANSITION":"RUN TO BIKE TRANSITION",
"SAILING":"SAILING",
"SCOOTERING":"SCOOTERING",
"SKATE_SKIING":"SKATE SKIING",
"SKATING":"SKATING",
"SNOWMOBILING":"SNOW MOBILING",
"SNOW_SHOE":"SNOW SHOE",
"SOCCER":"SOCCER",
"SPEED_WALKING":"SPEED WALKING",
"STAIR_CLIMBING":"STAIR CLIMBING",
"STAND_UP_PADDLEBOARDING":"STAND UP PADDLE BOARDING",
"STREET_RUNNING":"STREET RUNNING",
"STRENGTH_TRAINING":"STRENGTH TRAINING",
"SWIMMING":"SWIMMING",
"SWIMTOBIKETRANSITION":"SWIM TO BIKE TRANSITION",
"TENNIS":"TENNIS",
"TRACK_CYCLING":"TRACK CYCLING",
"TRACK_RUNNING":"TRACK RUNNING",
"TRAIL_RUNNING":"TRAIL RUNNING",
"TRANSITION":"TRANSITION",
"TREADMILL_RUNNING":"TREADMILL RUNNING",
"UNCATEGORIZED":"UNCATEGORIZED",
"WALKING":"WALKING",
"WHITEWATER_RAFTING_KAYAKING":"WHITE WATER RAFTING KAYAKING",
"WIND_KITE_SURFING":"WIND KITE SURFING",
"YOGA":"YOGA"
};

export default class ActivityGrid extends Component{
constructor(props){
super(props);
this.errorActivity = this.errorActivity.bind(this);
this.initializeActivity = this.initializeActivity.bind(this);
this.toggleModal = this.toggleModal.bind(this);
this.handleChange=this.handleChange.bind(this);
this.handleChange_activity = this.handleChange_activity.bind(this);
this.handleChange_heartrate = this.handleChange_heartrate.bind(this);
this.handleChange_time = this.handleChange_time.bind(this);
this.handleChange_comments = this.handleChange_comments.bind(this);
this.handleChange_steps = this.handleChange_steps.bind(this);
this.handleChange_steps_type = this.handleChange_steps_type.bind(this);
/************** CHANGES DONE BY MOUNIKA NH:STARTS *****************/
this.handleChange_duplicate_info = this.handleChange_duplicate_info.bind(this);
/************** CHANGES DONE BY MOUNIKA NH:ENDS *****************/
this.handleChange_start_time=this.handleChange_start_time.bind(this);
this.handleChange_end_time=this.handleChange_end_time.bind(this);          
this.createSleepDropdown = this.createSleepDropdown.bind(this);
this.createSleepDropdown_heartrate=this.createSleepDropdown_heartrate.bind(this);
this.renderTable = this.renderTable.bind(this);
this.renderEditActivityModal = this.renderEditActivityModal.bind(this);
this.handleChangeModal = this.handleChangeModal.bind(this);
this.CreateNewActivity = this.CreateNewActivity.bind(this);
this.activitySelectOptions = this.activitySelectOptions.bind(this);
this.toggle = this.toggle.bind(this);
this.saveEndTimeModel = this.saveEndTimeModel.bind(this);
this.toggle_starttime=this.toggle_starttime.bind(this);
this.saveStartTimeModel=this.saveStartTimeModel.bind(this);
this.deleteActivity=this.deleteActivity.bind(this);
this.toggle_delete=this.toggle_delete.bind(this);
this.editToggleHandlerStartTime = this.editToggleHandlerStartTime.bind(this);
this.handleChangeActivityStartEndTime = this.handleChangeActivityStartEndTime.bind(this);
this.handleChangeActivityDate = this.handleChangeActivityDate.bind(this);
this.DurationOnStartEndTimeChange = this.DurationOnStartEndTimeChange.bind(this);
this.getTotalActivityDuration = this.getTotalActivityDuration.bind(this);
this.handleChangeModalActivityTime = this.handleChangeModalActivityTime.bind(this);
this.handleChangeModelActivityStartTimeDate = this.handleChangeModelActivityStartTimeDate.bind(this);
this.handleChangeModelActivityEndTimeDate = this.handleChangeModelActivityEndTimeDate.bind(this);
this.createActivityTime = this.createActivityTime.bind(this);
this.createStartAndEndTime = this.createStartAndEndTime.bind(this);
this.setActivitiesEditModeFalse = this.setActivitiesEditModeFalse.bind(this);
this.addingCommaToSteps = this.addingCommaToSteps.bind(this);
let activities = this.props.activities;
let selected_date = this.props.selected_date;
this.toggleInfo=this.toggleInfo.bind(this);
this.infoPrint = this.infoPrint.bind(this);
this.state ={
    selected_date:selected_date,
    activityEditModal:false,
    calendarOpen:false,
    activites:activities,
    activities_edit_mode:this.createActivityEditModeState(activities),
    activites_hour_min:this.createActivityTime(activities),
    activity_start_end_time:this.createStartAndEndTime(activities),
    modal_activity_type:"",
    modal_activity_id:"",
    modal_activity_heart_rate:"",
    modal_activity_hour:"",
    modal_activity_min:"",
    modal_activity_sec:"",
    modal_exercise_steps:"",
    modal_exercise_steps_status:"",
    modal_duplicate_info_status:false,
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
    activity_start_end_date:null,
    activity_start_end_hour:'',
    activity_start_end_min:'',
    activity_start_end_sec:'',
    activity_start_end_am_pm:'',

    activitystarttime_calender:moment(selected_date),
    activityendtime_calender:moment(selected_date),
    modalstarttime_activity_hour:"",
    modalstarttime_activity_min:"",
    modalstarttime_activity_sec:"",
    modalstarttime_activity_ampm:"",
    modalendtime_activity_hour:"",
    modalendtime_activity_min:"",
    modalendtime_activity_sec:"",
    modalendtime_activity_ampm:"",
    button_state: "",
    modal_delete:false,
    getselectedid:'',
    selectedId_starttime:'',
    selectedId_delete:'',
    infoButton:false
}
}

initializeActivity(activities,selected_date,isEditable,callback){
    this.setState({
      selected_date:selected_date,
      activitystarttime_calender:moment(selected_date),
      activityendtime_calender:moment(selected_date),
      activities_edit_mode:this.createActivityEditModeState(activities),
      activites_hour_min:this.createActivityTime(activities),
      activity_start_end_time:this.createStartAndEndTime(activities),
      activites:activities
    },()=>{
        if(!isEditable)
            callback();
    });
  }

componentWillReceiveProps(nextProps) {
    if(nextProps.activities !== this.props.activities) {
        this.initializeActivity(
            nextProps.activities,
            nextProps.selected_date,
            nextProps.editable,
            this.setActivitiesEditModeFalse
        );
    }
    else if(!_.isEmpty(this.state.activities_edit_mode)
            && !nextProps.editable){
        this.setActivitiesEditModeFalse();
    }
}

addingCommaToSteps(value){
                value += '';
                var x = value.split('.');
                var x1 = x[0];
                var x2 = x.length > 1 ? '.' + x[1] : '';
                var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
                }
            return x1 + x2;
}
setActivitiesEditModeFalse(){
    //it will do set the state true to false of activity.
    //it will do hide the fields when you click on the
    // "View Form" button with out click on the pencile.
    let falseEditMode = this.state.activities_edit_mode
    for(let [id,data] of Object.entries(falseEditMode)){
        for(let [key,val] of Object.entries(data))
            falseEditMode[id][key] = false;
    }
    this.setState({
        activities_edit_mode:falseEditMode
    });
}

/*deleteActivity(event) {
    const target = event.target;
    const selectedActivityId = target.getAttribute('data-name');
    let updated_activites_state = this.state.activites;
    let updated_activities_edit_mode = this.state.activities_edit_mode;
    let updated_activites_hour_min = this.state.activites_hour_min;
    let updated_activity_start_end_time = this.state.activity_start_end_time;
    delete updated_activites_state[selectedActivityId];
    delete updated_activities_edit_mode[selectedActivityId];
    delete updated_activites_hour_min[selectedActivityId];
    delete updated_activity_start_end_time[selectedActivityId];
    this.setState({
        activites:updated_activites_state,
        activities_edit_mode:updated_activities_edit_mode,
        activites_hour_min:updated_activites_hour_min,
        activity_start_end_time:updated_activity_start_end_time,
    },()=>{
        this.props.updateParentActivities(this.state.activites);
    });

    this.toggle_delete(event);
}*/

deleteActivity(event){
    const target = event.target;
    const selectedActivityId = target.getAttribute('data-name');
    let updated_activites_state = this.state.activites;
    let updated_activities_edit_mode = this.state.activities_edit_mode;
    updated_activites_state[selectedActivityId]['deleted'] = true;
    for(let[key,val] of Object.entries(updated_activities_edit_mode[selectedActivityId])){
        updated_activities_edit_mode[selectedActivityId][key] = false;
    }
    this.setState({
        activites:updated_activites_state,
        activities_edit_mode:updated_activities_edit_mode
    },()=>{
        this.props.updateParentActivities(this.state.activites);
    });
    this.toggle_delete(event);
}

toggle_delete(event){
    const target = event.target;
    const selectedActivityId = target.getAttribute('data-name');
    this.setState({
        modal_delete: !this.state.modal_delete,
        selectedId_delete: selectedActivityId
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
    let time = "0:00:00";
    if(durationInSeconds){
        let hours   = Math.floor(durationInSeconds / 3600);
        let mins = Math.floor((durationInSeconds - (hours * 3600)) / 60);
        let secs = durationInSeconds - (hours * 3600) - (mins * 60);
        if (secs < 10)
        secs = `0${secs}`;

        if(mins < 10)
        mins = `0${mins}`;
        time = hours+":"+mins+":"+secs;
    }
    return time;
}

createActivityEditModeState(activityData){
    let activityEditModeState = {}
    for(let [id,data] of Object.entries(activityData)){
        let tmp = {'endTimeInSeconds':false};
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
        let duration_sec = durationInHourMin.split(":")[2];
        let tmp = {
            "durationInSeconds":data["durationInSeconds"],
            "duration_hour":duration_hour,
            "duration_min":duration_min,
            "duration_sec":duration_sec
        };
        activites_hour_min[id] = tmp;
    }
    return activites_hour_min;
}

createStartAndEndTime(activityData){
    let activity_start_end_time= {}
    for(let [id,data] of Object.entries(activityData)){
        let start_time_seconds = data["startTimeInSeconds"]; 
        let end_time_seconds= data["startTimeInSeconds"] + data["durationInSeconds"];
        let tzOffset = data["startTimeOffsetInSeconds"];

        if (start_time_seconds && tzOffset){
            start_time_seconds = start_time_seconds;
            start_time_seconds = moment.unix(start_time_seconds);
        }

        if (end_time_seconds && tzOffset){
            end_time_seconds = end_time_seconds;
            end_time_seconds = moment.unix(end_time_seconds);
        }

        let tmp = {
            "start_time":start_time_seconds,
            "end_time":end_time_seconds
        };
        activity_start_end_time[id] = tmp;
    }
    return activity_start_end_time;
}

errorActivity(error){
    console.log(error);
}
toggleModal(){
    this.setState({
      modal_activity_type:"",
      modal_activity_heart_rate:"",
      modal_activity_hour:"",
      modal_activity_min:"",
      modal_exercise_steps:"",
      modal_exercise_steps_status:"",
      modal_duplicate_info_status:false,
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
    modal_exercise_steps:current_activity?current_activity.steps:"",
    modal_exercise_steps_status:current_activity?current_activity.steps_type:"",
    modal_duplicate_info_status:current_activity?current_activity.duplicate:false,
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
        },()=>{
            this.props.updateParentActivities(this.state.activites);
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
        },()=>{
            this.props.updateParentActivities(this.state.activites);
        });
    }
}

editToggleHandlerStartTime(selectedActivityId,event){
    let categoryEditMode = this.state.activities_edit_mode[selectedActivityId];
    let activity_start_end_date = null;
    let activity_start_end_hour = "";
    let activity_start_end_min = "";
    let activity_start_end_sec = "";
    let activity_start_end_am_pm = "";
    categoryEditMode['startTimeInSeconds'] = !categoryEditMode['startTimeInSeconds'];

    if(selectedActivityId && categoryEditMode['startTimeInSeconds']){
        let start_time = this.state.activity_start_end_time[selectedActivityId]['start_time'];
        let start_time_info = this._extractDateTimeInfo(start_time);
        activity_start_end_date = start_time_info.calendarDate;
        activity_start_end_hour = start_time_info.hour;
        activity_start_end_min = start_time_info.min;
        activity_start_end_sec = start_time_info.sec;
        activity_start_end_am_pm = start_time_info.meridiem;
    }

    this.setState({
        activities_edit_mode:{
            ...this.state.activities_edit_mode,
            [selectedActivityId]:categoryEditMode
        },
        activity_start_end_date:activity_start_end_date,
        activity_start_end_hour:activity_start_end_hour,
        activity_start_end_min:activity_start_end_min,
        activity_start_end_sec:activity_start_end_sec,
        activity_start_end_am_pm:activity_start_end_am_pm,
    },()=>{
        this.props.updateParentActivities(this.state.activites);
    });
}

editToggleHandlerEndTime(selectedActivityId,event){
    let categoryEditMode = this.state.activities_edit_mode[selectedActivityId];
    let activity_start_end_date = null;
    let activity_start_end_hour = "";
    let activity_start_end_min = "";
    let activity_start_end_sec = "";
    let activity_start_end_am_pm = "";
    categoryEditMode['endTimeInSeconds'] = !categoryEditMode['endTimeInSeconds'];

    if(selectedActivityId && categoryEditMode['endTimeInSeconds']){
        let end_time = this.state.activity_start_end_time[selectedActivityId]['end_time'];
        let end_time_info = this._extractDateTimeInfo(end_time);
        activity_start_end_date = end_time_info.calendarDate;
        activity_start_end_hour = end_time_info.hour;
        activity_start_end_min = end_time_info.min;
        activity_start_end_sec = end_time_info.sec;
        activity_start_end_am_pm = end_time_info.meridiem;
    }

    this.setState({
        activities_edit_mode:{
            ...this.state.activities_edit_mode,
            [selectedActivityId]:categoryEditMode
        },
        activity_start_end_date:activity_start_end_date,
        activity_start_end_hour:activity_start_end_hour,
        activity_start_end_min:activity_start_end_min,
        activity_start_end_sec:activity_start_end_sec,
        activity_start_end_am_pm:activity_start_end_am_pm,
    },()=>{
        this.props.updateParentActivities(this.state.activites);
    });
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
        },()=>{
            this.props.updateParentActivities(this.state.activites);
        });
       if(!categoryMode['comments']){
            $('#'+selectedActivityId).css('display','none');

        }
    }
  }
  editToggleHandler_steps(event){
    const target = event.target;
    const selectedActivityId = target.getAttribute('data-name');
    let categoryMode = this.state.activities_edit_mode[selectedActivityId];
    categoryMode['steps'] = !categoryMode['steps'] 
    if(selectedActivityId){
        this.setState({
            ...this.state.activities_edit_mode,
            [selectedActivityId]:categoryMode
        },()=>{
            this.props.updateParentActivities(this.state.activites);
        });
    }
}
editToggleHandler_steps_type(event){
    const target = event.target;
    const selectedActivityId = target.getAttribute('data-name');
    let categoryMode = this.state.activities_edit_mode[selectedActivityId];
    categoryMode['steps_type'] = !categoryMode['steps_type'] 
    if(selectedActivityId){
        this.setState({
            ...this.state.activities_edit_mode,
            [selectedActivityId]:categoryMode
        },()=>{
            this.props.updateParentActivities(this.state.activites);
        });
    }
}

/************** CHANGES DONE BY MOUNIKA NH:STARTS *****************/
editToggleHandler_duplicate_info(event) {
    const target = event.target;
    const selectedActivityId = target.getAttribute('data-name');
    let categoryMode = this.state.activities_edit_mode[selectedActivityId];
    categoryMode['duplicate'] = !categoryMode['duplicate'] 
    if(selectedActivityId){
        this.setState({
            ...this.state.activities_edit_mode,
            [selectedActivityId]:categoryMode
        },()=>{
            this.props.updateParentActivities(this.state.activites);
        });
    }
}
/************** CHANGES DONE BY MOUNIKA NH:ENDS *****************/

editToggleHandlerDuration(event){
    const target = event.target;
    const selectedActivityId = target.getAttribute('data-name');
    let timeEditMode = this.state.activities_edit_mode[selectedActivityId];
    let timeHourMin = this.state.activites_hour_min[selectedActivityId];
    let timeOriginData = this.state.activites[selectedActivityId];
    let currentHour = timeHourMin['duration_hour'];
    let currentMin = timeHourMin['duration_min'];
    let durationInSeconds = timeOriginData['durationInSeconds'];
    let isDurationChanged = false;

    if(currentHour && currentMin){
        currentHour = parseInt(currentHour);
        currentMin = parseInt(currentMin);
        durationInSeconds = ((currentHour * 3600) + (currentMin * 60));
    }

    if (this.secondsToHourMinStr(timeOriginData['durationInSeconds'])
        != this.secondsToHourMinStr(durationInSeconds)){ 
        isDurationChanged = true;
    }
    timeHourMin['durationInSeconds'] = durationInSeconds;
    timeEditMode['durationInSeconds'] = !timeEditMode['durationInSeconds'] ;

    if(selectedActivityId && isDurationChanged){
        this.setState({
            activites_hour_min:{
                ...this.state.activites_hour_min,
                [selectedActivityId]:timeHourMin
            },
            activities_edit_mode: {
                ...this.state.activities_edit_mode,
                [selectedActivityId]:timeEditMode
            },
            activites:{
                ...this.state.activites,
                [selectedActivityId]:timeOriginData
            }
        },()=>{
            this.props.updateParentActivities(this.state.activites);
        });
    }
    else{
        this.setState({
            activites_hour_min:{
                ...this.state.activites_hour_min,
                [selectedActivityId]:timeHourMin
            },
            activities_edit_mode: {
                ...this.state.activities_edit_mode,
                [selectedActivityId]:timeEditMode
            }
        },()=>{
            this.props.updateParentActivities(this.state.activites);
        });
    }
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
    activity_data['averageHeartRateInBeatsPerMinute'] = parseInt(value);
    this.setState({
        activites:{
            ...this.state.activites,
            [selectedActivityId]:activity_data
        }
    });
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
handleChange_steps(event){
  const target = event.target;
  const value = target.value;
  const selectedActivityId = target.getAttribute('data-name');
  let activity_data = this.state.activites[selectedActivityId];
  
  activity_data['steps'] = parseInt(value);
  this.setState({
  activites:{...this.state.activites,
  [selectedActivityId]:activity_data,

  }
     });
  $('#'+selectedActivityId).css('display','none');
   if(value== "OTHER"){
  this.setState({
[selectedActivityId]: value,
"modal_exercise_steps":""
  });
  }

  else if(name == "modal_exercise_steps"){
  this.setState({
[selectedActivityId]: value,
"modal_exercise_steps":value
  });

  }
  this.setState({
[selectedActivityId]: value,

  });
}
handleChange_steps_type(event){
  const target = event.target;
  const selectedActivityId = target.getAttribute('data-name');
  let activity_data = this.state.activites[selectedActivityId];
  let steps_type = activity_data['steps_type'];
  if(steps_type == "exercise")
    steps_type = "non_exercise";
  else
    steps_type = "exercise";
  
  activity_data['steps_type'] = steps_type;
  if(activity_data['can_update_steps_type']){
      this.setState({
        [selectedActivityId]: activity_data
      });
    }
}

/************** CHANGES DONE BY MOUNIKA NH:STARTS *****************/
handleChange_duplicate_info(event) {
    const target = event.target;
    const selectedActivityId = target.getAttribute('data-name');
    let activity_data = this.state.activites[selectedActivityId];
    let duplicate = activity_data['duplicate'];
    if(duplicate == false)
        duplicate = true;
    else
        duplicate = false;

    activity_data['duplicate'] = duplicate;
    if(true){
      this.setState({
        [selectedActivityId]: activity_data
      });
    }
}
/************** CHANGES DONE BY MOUNIKA NH:ENDS *****************/
getDTMomentObj(dt,hour,min,sec,am_pm){
  hour = hour ? parseInt(hour) : 0;
  min = min ? parseInt(min) : 0;
  sec = sec ? parseInt(sec): 0;

  if(am_pm == 'am' && hour && hour == 12){
    hour = 0
  }
  if (am_pm == 'pm' && hour && hour != 12){
    hour = hour + 12;
  }
  let y = dt.year();
  let m = dt.month();
  let d = dt.date();
  let sleep_bedtime_dt = moment({ 
    year :y,
    month :m,
    day :d,
    hour :hour,
    minute :min,
    second :sec
  });
  return sleep_bedtime_dt;
}

DurationOnStartEndTimeChange(startTime, endTime, selectedActivityId){
    let durationInSeconds = endTime.diff(startTime,'seconds');
    let durationInHourMin = this.secondsToHourMinStr(durationInSeconds);
    let strHour = durationInHourMin.split(':')[0];
    let strMin = durationInHourMin.split(':')[1];
    let strSec = durationInHourMin.split(':')[2];

    let timeOriginData = this.state.activites[selectedActivityId];
    let timeHourMin = this.state.activites_hour_min[selectedActivityId];

    timeOriginData['durationInSeconds'] = durationInSeconds;
    timeHourMin['durationInSeconds'] = durationInSeconds;
    timeHourMin['duration_hour'] = strHour;
    timeHourMin['duration_min'] = strMin;
    timeHourMin['duration_sec'] = strSec;

    // First is updated "activites" state object for current summary id
    // Second is updated "activites_hour_min" state object for current summary id
    return [timeOriginData, timeHourMin]
}

saveStartTimeModel(event){
    const selectedActivityId = event.target.name;
    let updatedStartTime = this.state.activity_start_end_time[selectedActivityId];
    let CurrentEndTime = updatedStartTime['end_time']; 
    let newStartTime = this.getDTMomentObj(
        this.state.activity_start_end_date,
        this.state.activity_start_end_hour,
        this.state.activity_start_end_min,
        this.state.activity_start_end_sec,
        this.state.activity_start_end_am_pm
    );
    let durationUpdatedStateObjs = this.DurationOnStartEndTimeChange(
        newStartTime,CurrentEndTime,selectedActivityId
    );
    let updatedActivity = durationUpdatedStateObjs[0];
    let updatedTimeHourMin = durationUpdatedStateObjs[1];

    updatedStartTime['start_time'] = newStartTime;
    updatedActivity['startTimeInSeconds'] = newStartTime.unix();
    this.setState({
        activity_start_end_time:{
            ...this.state.activity_start_end_time,
            [selectedActivityId]:updatedStartTime
        },
        activites_hour_min:{
            ...this.state.activites_hour_min,
            [selectedActivityId]:updatedTimeHourMin
        },
        activites:{
            ...this.state.activites,
            [selectedActivityId]:updatedActivity
        },
    },()=>{
        this.editToggleHandlerStartTime(selectedActivityId);
    })
}

saveEndTimeModel(event){
    const selectedActivityId = event.target.name;
    let updatedEndTime = this.state.activity_start_end_time[selectedActivityId];
    let CurrentStartTime = updatedEndTime['start_time']; 
    let newEndTime = this.getDTMomentObj(
        this.state.activity_start_end_date,
        this.state.activity_start_end_hour,
        this.state.activity_start_end_min,
        this.state.activity_start_end_sec,
        this.state.activity_start_end_am_pm
    );
    let durationUpdatedStateObjs = this.DurationOnStartEndTimeChange(
        CurrentStartTime,newEndTime,selectedActivityId
    );
    let updatedActivity = durationUpdatedStateObjs[0];
    let updatedTimeHourMin = durationUpdatedStateObjs[1];
    updatedEndTime['end_time'] = newEndTime;
    this.setState({
        activity_start_end_time:{
            ...this.state.activity_start_end_time,
            [selectedActivityId]:updatedEndTime
        },
        activites_hour_min:{
            ...this.state.activites_hour_min,
            [selectedActivityId]:updatedTimeHourMin
        },
        activites:{
            ...this.state.activites,
            [selectedActivityId]:updatedActivity
        },
    },()=>{
        this.editToggleHandlerEndTime(selectedActivityId);
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

handleChange(event){
    const target = event.target;
    const value = target.value;
    const name = target.name;//modal_duplicate_info_status
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
    else if (name == "modal_activity_heart_rate"
        || name == "modal_exercise_steps"){
        this.setState({
            [name]: parseInt(value)
        });
    }
    else if (name == "modal_duplicate_info_status"){
        this.setState({
            [name]: (value == "true")
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
    let elements = [<option key={0} value={0}>Not Measured</option>];
    let i = start_num;
    while(i<=end_num){
        elements.push(<option key={i} value={i}>{i}</option>);
        i=i+step;
    }
    return elements;
  }
 

CreateNewActivity(data){
    let newActivityID = Math.floor(1000000000 + Math.random() * 900000000);
    let durationsecs = this.state.modal_activity_sec;
    let durationmins = this.state.modal_activity_min;
    let durationhours = this.state.modal_activity_hour;
    let durationSeconds = (parseInt(durationhours)*3600 
        + parseInt(durationmins)*60
        + parseInt(durationsecs)
    );

    let activityStartTimeMObject = this.getDTMomentObj(
        this.state.activitystarttime_calender,
        this.state.modalstarttime_activity_hour,
        this.state.modalstarttime_activity_min,
        this.state.modalstarttime_activity_sec,
        this.state.modalstarttime_activity_ampm
    );
    let activityEndTimeMObject = this.getDTMomentObj(
        this.state.activityendtime_calender,
        this.state.modalendtime_activity_hour,
        this.state.modalendtime_activity_min,
        this.state.modalendtime_activity_sec,
        this.state.modalendtime_activity_ampm
    );

    if(activityStartTimeMObject && activityEndTimeMObject){
        durationSeconds = activityEndTimeMObject.diff(activityStartTimeMObject,'seconds');
    }
    let timezone = moment.tz.guess();
    let tzOffsetFromUTCInSeconds = (moment.tz(moment.utc(),timezone).utcOffset())*60;

    let steps = this.state.modal_exercise_steps;
    if(!steps)
        steps = 0

    let new_value = {
        "summaryId": newActivityID.toString(),
        "activityType": this.state.modal_activity_type,
        "averageHeartRateInBeatsPerMinute": this.state.modal_activity_heart_rate,
        "durationInSeconds":durationSeconds,
        "steps":steps,
        "steps_type":this.state.modal_exercise_steps_status,
        "duplicate":this.state.modal_duplicate_info_status,
        "comments":this.state.modal_activity_comment,
        "startTimeInSeconds":activityStartTimeMObject.unix(),
        "startTimeOffsetInSeconds":tzOffsetFromUTCInSeconds,
        "can_update_steps_type":true
    }; 

    let durationInHourMin = this.secondsToHourMinStr(new_value["durationInSeconds"]);
    let edit_mode_state = {}
    for(let [key,val] of Object.entries(new_value)){
        edit_mode_state[key] = false;
    }
    let activity_hour_min_state = {
        "durationInSeconds":new_value["durationInSeconds"],
        "duration_hour":durationInHourMin.split(":")[0],
        "duration_min":durationInHourMin.split(":")[1],
        "duration_sec":durationInHourMin.split(":")[2]
    };

    let activity_start_end_time_state = this.createStartAndEndTime({[newActivityID]:new_value});
    this.setState({
        activites:{
            ...this.state.activites,
            [newActivityID]:new_value,
        },
        activity_display_name:"",
        modal_activity_type:"",
        modal_activity_heart_rate:"",
        modal_activity_hour:"",
        modal_activity_min:"",
        modal_exercise_steps:"",
        modal_exercise_steps_status:"",
        modal_duplicate_info_status:false,
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
            [newActivityID]:edit_mode_state
        },
        activites_hour_min:{
            ...this.state.activites_hour_min,
            [newActivityID]:activity_hour_min_state
        },
        activity_start_end_time:{
            ...this.state.activity_start_end_time,
            [newActivityID]:activity_start_end_time_state[newActivityID]
        }
    },()=>{
        this.props.updateParentActivities(this.state.activites);
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
      });
    }
}
_extractDateTimeInfo(dateObj){
      let datetimeInfo = {
        calendarDate:null,
        hour:'',
        min:'',
        sec:'',
        meridiem:''
      }

      if(dateObj){
        dateObj = moment(dateObj);
        datetimeInfo['calendarDate'] = moment({ 
          year :dateObj.year(),
          month :dateObj.month(),
          day :dateObj.date()
        });

        let hour = dateObj.hour();
        if(hour < 12){
          if(hour == 0)
            hour = 12;
          datetimeInfo['hour'] = hour;
          datetimeInfo['meridiem'] = 'am';
        }
        else if(hour >= 12){
          if(hour > 12)
            hour -= 12;
          datetimeInfo['hour'] = hour;
          datetimeInfo['meridiem'] = 'pm';
        }
        let mins = dateObj.minute();
        mins = (mins < 10) ? '0'+mins : mins;
        datetimeInfo['min'] = mins;

        let secs = dateObj.second();
        secs = (secs < 10) ? '0'+secs : secs;
        datetimeInfo['sec'] = secs;
      }
      return datetimeInfo;
    }

handleChangeActivityStartEndTime(event){
  const value = event.target.value;
  const name = event.target.name;
  this.setState({
    [name]: value
  });
}

handleChangeActivityDate(date){
  this.setState({
    activity_start_end_date: date
  });
}

getTotalActivityDuration(){
    let activityStartTimeDate = this.state.activitystarttime_calender;
    let activityStartTimeHour = this.state.modalstarttime_activity_hour;
    let activityStartTimeMin = this.state.modalstarttime_activity_min;
    let activityStartTimeSec = this.state.modalstarttime_activity_sec;
    let activityStartTimeAmPm = this.state.modalstarttime_activity_ampm;
    let activityStartTime = null;
    if (activityStartTimeDate && activityStartTimeHour
    && activityStartTimeMin && activityStartTimeSec
    && activityStartTimeAmPm){
        activityStartTime = this.getDTMomentObj(
            activityStartTimeDate,activityStartTimeHour,
            activityStartTimeMin,activityStartTimeSec,
            activityStartTimeAmPm
        )
    }

    let activityEndTimeDate = this.state.activityendtime_calender;
    let activityEndTimeHour = this.state.modalendtime_activity_hour;
    let activityEndTimeMin = this.state.modalendtime_activity_min;
    let activityEndTimeSec = this.state.modalendtime_activity_sec;
    let activityEndTimeAmPm = this.state.modalendtime_activity_ampm;
    let activityEndTime = null;
    if (activityEndTimeDate && activityEndTimeHour
        && activityEndTimeMin && activityEndTimeSec 
        && activityEndTimeAmPm){
        activityEndTime = this.getDTMomentObj(
            activityEndTimeDate,activityEndTimeHour,
            activityEndTimeMin,activityEndTimeSec,
            activityEndTimeAmPm
        )
    }
    if(activityStartTime && activityEndTime){
        let diff = activityEndTime.diff(activityStartTime,'seconds'); 
        let hours   = Math.floor(diff / 3600);
        let mins = Math.floor((diff - (hours * 3600)) / 60);
        let secs = diff - (hours * 3600) - (mins * 60);
        if (secs < 10)
        secs = `0${secs}`;

        if(mins < 10)
        mins = `0${mins}`;
        return hours+":"+mins+":"+secs;
    }else
        return '';
}

handleChangeModelActivityStartTimeDate(date){
    this.setState({
        activitystarttime_calender:date
    },()=>{
            let duration = this.getTotalActivityDuration();
            if(duration){  
                this.setState({
                    modal_activity_hour:duration.split(":")[0],
                    modal_activity_min: duration.split(":")[1],
                    modal_activity_sec:duration.split(":")[2]
                });
            }
    });
}

handleChangeModelActivityEndTimeDate(date){
    this.setState({
        activityendtime_calender:date
    },()=>{
            let duration = this.getTotalActivityDuration();
            if(duration){  
                this.setState({
                    modal_activity_hour:duration.split(":")[0],
                    modal_activity_min: duration.split(":")[1],
                    modal_activity_sec:duration.split(":")[2]
                });
            }
    });
}

handleChangeModalActivityTime(event){
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
        [name]: value
    },()=>{
            let duration = this.getTotalActivityDuration();
            if(duration){  
                this.setState({
                    modal_activity_hour:duration.split(":")[0],
                    modal_activity_min: duration.split(":")[1],
                    modal_activity_sec:duration.split(":")[2]
                });
            }
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
    mywindow.document.write(document.getElementById('duplicate_info_modal_text').innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();
   }
renderTable(){
    const activityKeys = ["summaryId","activityType","averageHeartRateInBeatsPerMinute",
        "startTimeInSeconds","endTimeInSeconds","durationInSeconds","steps","steps_type","duplicate","comments"];
    let activityRows = [];
    for (let [key,value] of Object.entries(this.state.activites)){
        let activityData = [];
        let summaryId; 
        let hour;
        let min;
        let isActivityDeleted;
        for (let key of activityKeys){
            let keyValue = value[key];
            if(key === 'summaryId'){
                summaryId = keyValue;
                isActivityDeleted = this.state.activites[summaryId]['deleted'];
            }

            else if(key === "activityType"){
                var  activityType=keyValue;
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
                             {this.props.editable && !isActivityDeleted &&              
                            <span  data-name = {summaryId} onClick={this.editToggleHandlerActivityType.bind(this)}
                            className="fa fa-pencil fa-1x progressActivity1"
                            id = "add_button">
                        </span>
                    }
                                                   
                        </td>);
            }

            else if(key === "averageHeartRateInBeatsPerMinute"){
                let averageHeartRateInBeatsPerMinute=keyValue;
                let hr = this.state.activites[summaryId][key];
                hr = hr || hr == null || hr == undefined ?hr:'Not Measured'; 
                activityData.push(<td  name = {summaryId}  id = "add_button">
                                        {this.state.activities_edit_mode[summaryId][key] ?                            
                                        <Input 
                                        data-name = {summaryId}
                                        type="select" 
                                        className="form-control"
                                        style={{height:"37px",width:"80%"}}
                                        value={this.state.activites[summaryId][key]}                               
                                        onChange={this.handleChange_heartrate}
                                        onBlur={this.editToggleHandler_heartrate.bind(this)}>
                                        
                                        <option key="hours" value=" ">Select</option>
                                    {this.createSleepDropdown_heartrate(90,220)}  
                                      </Input>: hr}
                                       {this.props.editable && !isActivityDeleted &&
                                        <span data-name = {summaryId} onClick={this.editToggleHandler_heartrate.bind(this)}
                            className="fa fa-pencil fa-1x progressActivity1"
                            id = "add_button">
                        </span>
                    }
                        </td>
                        );
            }

            else if(key === "startTimeInSeconds"){
                let start_time = this.state.activity_start_end_time[summaryId]['start_time'];
                activityData.push(<td  name = {summaryId}  id = "add_button">
                {start_time?start_time.format('MMM D, YYYY h:mm:ss a'):''} 
                 {this.props.editable && !isActivityDeleted &&                           
                        <span 
                            data-name = {summaryId}  
                            onClick={this.editToggleHandlerStartTime.bind(this,summaryId)}
                            className="fa fa-pencil fa-1x progressActivity1"
                            id = "add_button">
                        </span>
                    }
                        <Modal 
                        isOpen={this.state.activities_edit_mode[summaryId]["startTimeInSeconds"]}
                        toggle={this.editToggleHandlerStartTime.bind(this,summaryId)} 
                        >
                          <ModalHeader
                              toggle={this.editToggleHandlerStartTime.bind(this,summaryId)}>
                              Enter the Time Your Workout Started
                          </ModalHeader>
                          <ModalBody>
                          <div className=" display_flex" >
                                              <div className="align_width align_width1">
                                              <div className="input  ">
                                                <DatePicker
                                                    id="datepicker"
                                                    selected={this.state.activity_start_end_date}
                                                    onChange={this.handleChangeActivityDate}
                                                    data-name={summaryId}
                                                    dateFormat="LL"
                                                    isClearable={true}
                                                    shouldCloseOnSelect={true}
                                                />
                                              </div>
                                              </div>
                                               <div className="align_width_time align_width1 margin_tp">
                                                  <div className="input "> 
                                                <Input type="select" 
                                                id="bed_hr"
                                                name = "activity_start_end_hour"
                                                data-name={summaryId}
                                                className="form-control custom-select"
                                                value={this.state.activity_start_end_hour}
                                                onChange={this.handleChangeActivityStartEndTime}>
                                                 <option key="hours" value="">Hours</option>
                                                {this.createSleepDropdown(1,12)}                        
                                                </Input>
                                                </div>
                                                </div>

                                                <div className="align_width_time align_width1 margin_tp">
                                               <div className="input ">
                                                <Input type="select" 
                                                 id="bed_min"
                                                 name="activity_start_end_min"
                                                 data-name={summaryId}
                                                className="form-control custom-select "
                                                value={this.state.activity_start_end_min}
                                                onChange={this.handleChangeActivityStartEndTime}>
                                                 <option key="mins" value="">Minutes</option>
                                                {this.createSleepDropdown(0,59,true)}                        
                                                </Input>                        
                                                </div>
                                                </div>
                                                <div className="align_width_time align_width1 margin_tp">
                                               <div className="input ">
                                                <Input type="select" 
                                                 id="bed_min"
                                                 name="activity_start_end_sec"
                                                 data-name={summaryId}
                                                className="form-control custom-select "
                                                value={this.state.activity_start_end_sec}
                                                onChange={this.handleChangeActivityStartEndTime}>
                                                 <option key="mins" value="">Seconds</option>
                                                {this.createSleepDropdown(0,59,true)}                        
                                                </Input>                        
                                                </div>
                                                </div>
                                                <div className="align_width_time align_width1 margin_tp">
                                                 <div className="input1 ">
                                                  <Input type="select" 
                                                  name = "activity_start_end_am_pm"
                                                  data-name={summaryId}
                                                 className="custom-select form-control "                     
                                                 value={this.state.activity_start_end_am_pm}
                                                 onChange={this.handleChangeActivityStartEndTime} >
                                                   <option value="">AM/PM</option>
                                                   <option value="am">AM</option>
                                                   <option value="pm">PM</option> 
                                                
                                                 </Input>
                                                  </div> 

                                              </div>
                                              </div>
                                                        </ModalBody>
                          <ModalFooter>
                            <Button color="primary"
                                 name={summaryId} 
                                 onClick={this.saveStartTimeModel}
                            >
                                 Save
                             </Button>{' '}

                            <Button 
                                color="secondary"
                                data-name = {summaryId} 
                                onClick={this.editToggleHandlerStartTime.bind(this,summaryId)}>
                                Cancel
                            </Button>
                          </ModalFooter>
                        </Modal>
                      </td>);
            }

            else if(key === "endTimeInSeconds"){
                let end_time = this.state.activity_start_end_time[summaryId]['end_time'];
                activityData.push(<td  name = {summaryId}  id = "add_button">
                            {end_time?end_time.format('MMM D, YYYY h:mm:ss a'):''}  
                          {this.props.editable && !isActivityDeleted &&                
                        <span 
                            data-name = {summaryId} 
                            className="fa fa-pencil fa-1x progressActivity1"
                            id = "add_button"
                            onClick={this.editToggleHandlerEndTime.bind(this,summaryId)}
                        >
                        </span>
                    }
                        <Modal 
                            isOpen={this.state.activities_edit_mode[summaryId]["endTimeInSeconds"]}
                            toggle={this.editToggleHandlerEndTime.bind(this,summaryId)} 
                        >
                          <ModalHeader 
                            toggle={this.editToggleHandlerEndTime.bind(this,summaryId)}>
                            Enter the Time Your Workout Ended
                          </ModalHeader>
                          <ModalBody>
                      <div className=" display_flex" >
                                              <div className="align_width align_width1">
                                              <div className="input ">
                                                <DatePicker
                                                    id="datepicker"
                                                    name = "sleep_bedtime_date"
                                                    selected={this.state.activity_start_end_date}
                                                    onChange={this.handleChangeActivityDate}
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
                                                id="bed_hr"
                                                name = "activity_start_end_hour"
                                                data-name={summaryId}
                                                className="form-control custom-select"
                                                value={this.state.activity_start_end_hour}
                                                onChange={this.handleChangeActivityStartEndTime}>
                                                 <option key="hours" value="">Hours</option>
                                                {this.createSleepDropdown(1,12)}                        
                                                </Input>
                                                </div>
                                                </div>

                                                <div className="align_width_time align_width1 margin_tp">
                                               <div className="input ">
                                                <Input type="select"
                                                id="bed_min"
                                                name="activity_start_end_min"
                                                data-name={summaryId}
                                                className="form-control custom-select "
                                                value={this.state.activity_start_end_min}
                                                onChange={this.handleChangeActivityStartEndTime}>
                                                 <option key="mins" value="">Minutes</option>
                                                {this.createSleepDropdown(0,59,true)}                        
                                                </Input>                        
                                                </div>
                                                </div>
                                                <div className="align_width_time align_width1 margin_tp">
                                               <div className="input ">
                                                <Input type="select" 
                                                id="bed_min"
                                                name="activity_start_end_sec"
                                                data-name={summaryId}
                                                className="form-control custom-select "
                                                value={this.state.activity_start_end_sec}
                                                onChange={this.handleChangeActivityStartEndTime}>
                                                 <option key="mins" value="">Seconds</option>
                                                {this.createSleepDropdown(0,59,true)}                        
                                                </Input>                        
                                                </div>
                                                </div>
                                                <div className="align_width_time align_width1 margin_tp">
                                                 <div className="input1 ">
                                                  <Input type="select" 
                                                  data-name={summaryId}
                                                     className="custom-select form-control "
                                                     name = "activity_start_end_am_pm"                                  
                                                     value={this.state.activity_start_end_am_pm}
                                                     onChange={this.handleChangeActivityStartEndTime} >
                                                       <option value="">AM/PM</option>
                                                       <option value="am">AM</option>
                                                       <option value="pm">PM</option> 
                                                    
                                                     </Input>
                                                      </div> 

                                              </div>
                                              </div>
                                                        </ModalBody>
                          <ModalFooter>
                            <Button 
                                color="primary" 
                                name={summaryId} 
                                onClick={this.saveEndTimeModel}
                            >
                                    Save
                            </Button>{' '}
                            <Button 
                                color="secondary" 
                                onClick={this.editToggleHandlerEndTime.bind(this,summaryId)}>
                                Cancel
                            </Button>
                          </ModalFooter>
                        </Modal>
                              
                        </td>);
            }

            else if(key === "durationInSeconds"){
                activityData.push(<td  name={summaryId} id = "add_button">
                                     { this.state.activities_edit_mode[summaryId][key] ? 
                                        <div className=" displayflex" >

                                        <div className=" align_width1">
                                     <div className="input " style = {{}}> 
                                     <Input  ref="activity_hours" 
                                     onBlur={this.editToggleHandlerDuration.bind(this)}
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
                                     onBlur={this.editToggleHandlerDuration.bind(this)}
                                     className="form-control custom-select "                   
                                    value={this.state.activites_hour_min[summaryId]["duration_min"]}
                                    onChange={this.handleChange_time}>
                                     <option key="mins" value="">Minutes</option>
                                    {this.createSleepDropdown(0,59,true)}                        
                                    </Input>  

                                    </div>
                                    </div>
                                    </div>:this.state.activites_hour_min[summaryId]?
                                    this.state.activites_hour_min[summaryId]["duration_hour"]+":"+
                                    this.state.activites_hour_min[summaryId]["duration_min"]+":"+
                                    this.state.activites_hour_min[summaryId]["duration_sec"]:time}
                            {/*this.props.editable &&  
                                <span data-name = {summaryId} onClick={this.editToggleHandlerDuration.bind(this)}
                                className="fa fa-pencil fa-1x progressActivity1 "
                                id = "add_button">
                                </span>
                             */}
                            </td>); 
            }
            else if(key === "steps"){
                 let  steps=keyValue;
                activityData.push(<td name={summaryId} className="comment_td" id = "add_button">
                                              { this.state.activities_edit_mode[summaryId][key] ? <div><Input
                                              type = "number" 
                                              data-name={summaryId}
                                              id="text_area"
                                              className="form-control"
                                              value={this.state.activites[summaryId][key]} 
                                              onChange={this.handleChange_steps}
                                              onBlur={this.editToggleHandler_steps.bind(this)}>                       
                                          </Input>
                                          </div>:this.addingCommaToSteps(this.state.activites[summaryId][key])}
                                {this.props.editable && !isActivityDeleted &&           
                            <span data-name={summaryId} onClick={this.editToggleHandler_steps.bind(this)}
                                  className="fa fa-pencil fa-1x progressActivity1 "
                                  id = "add_button">
                            </span>
                        }
                        </td>);
            }

             else if(key === "steps_type"){
                 let steps_type=keyValue;
                 let exerciseTypeLabel = "Not Categorized";
                 if(this.state.activites[summaryId][key] == "exercise")
                    exerciseTypeLabel = "Exercise";
                 else if (this.state.activites[summaryId][key] == "non_exercise")
                    exerciseTypeLabel = "Non Exercise";

                activityData.push(<td name={summaryId} className="comment_td" id = "add_button">
                                              { this.state.activities_edit_mode[summaryId][key]?
                                               <div>
                                                <span>{exerciseTypeLabel}</span>
                                                <span>
                                                <label className="switch">
                                                      <input type="checkbox"
                                                        data-name={summaryId}
                                                        id="text_area"
                                                        style = {{marginLeft:"60px"}}
                                                        className="form-control"
                                                        value={this.state.activites[summaryId][key]} 
                                                        onChange={this.handleChange_steps_type}
                                                        checked = {this.state.activites[summaryId][key] == "exercise"}
                                                        disabled = {!this.state.activites[summaryId]["can_update_steps_type"]}
                                                        onBlur={this.editToggleHandler_steps_type.bind(this)}
                                                       />
                                                      <span className="slider round"></span>
                                                </label>
                                                </span>
                                          </div>:exerciseTypeLabel}
                           {this.props.editable && !isActivityDeleted &&           
                            <span data-name={summaryId} onClick={this.editToggleHandler_steps_type.bind(this)}
                                  className="fa fa-pencil fa-1x progressActivity1 "
                                  id = "add_button">
                             </span>
                        }
                        </td>);
            }
            //duplicate_info
            /************** CHANGES DONE BY MOUNIKA NH:STARTS *****************/
            else if(key === "duplicate"){
                let duplicate_info = keyValue;
                let duplicateInfoLabel = "Not Duplicate";
                if(this.state.activites[summaryId][key] == true)
                    duplicateInfoLabel = "Duplicate";
                else if (this.state.activites[summaryId][key] == false)
                    duplicateInfoLabel = "Not Duplicate";

                activityData.push(
                    <td name={summaryId} className="comment_td" id = "add_button">
                    { 
                        this.state.activities_edit_mode[summaryId][key]?
                        <div>
                            <span>
                                {duplicateInfoLabel}
                            </span>
                            <span>
                                <label className="switch">
                                    <input type="checkbox"
                                        data-name={summaryId}
                                        id="text_area"
                                        style = {{marginLeft:"60px"}}
                                        className="form-control"
                                        value={this.state.activites[summaryId][key]} 

                                        onChange={this.handleChange_duplicate_info}
                                        disabled = {!true}
                                        checked = {this.state.activites[summaryId][key] == true}
                                        onBlur={this.editToggleHandler_duplicate_info.bind(this)}
                                       />
                                    <span className="slider round"></span>
                                </label>
                            </span>
                        </div>:duplicateInfoLabel
                    }
                    {
                        this.props.editable && !isActivityDeleted &&            
                        <span data-name={summaryId} onClick={this.editToggleHandler_duplicate_info.bind(this)}
                              className="fa fa-pencil fa-1x progressActivity1 "
                              id = "add_button">
                        </span>
                    }
                </td>);
            }
            /************** CHANGES DONE BY MOUNIKA NH:ENDS *****************/
            else if(key === "comments"){
                let  comments=keyValue;
                activityData.push(<td name={summaryId} className="comment_td" id = "add_button">
                                              { this.state.activities_edit_mode[summaryId][key] ? <div><Textarea 
                                              data-name={summaryId}
                                            onBlur={ this.editToggleHandler_comments.bind(this)}
                                            id="text_area"
                                            className="form-control"
                                            style={{height:"37px"}}
                                            value={this.state.activites[summaryId][key]} 
                                           onChange={this.valueChange.bind(this)}
                                        onBlur={this.handleChange_comments.bind(this), this.editToggleHandler_comments.bind(this)}>                       
                                          </Textarea><Button data-name={summaryId} size = "sm" id={summaryId} 
                                          className="btn btn-info save_btn" onClick={ this.editToggleHandler_comments.bind(this)}>Save
                                          </Button></div>:this.state.activites[summaryId][key]}
                                {this.props.editable && !isActivityDeleted &&           
                            <span data-name={summaryId} onClick={this.editToggleHandler_comments.bind(this)}
                                  className="fa fa-pencil fa-1x progressActivity1 "
                                  id = "add_button">
                            </span>
                        }
                        </td>);
            }


            else
                activityData.push(<td id = "add_button">{keyValue}</td>);

        }
    console.log("Is activity Deleted:",isActivityDeleted);
    activityRows.push(
        <tr name = {summaryId} 
            id = "add_button" 
            className = {isActivityDeleted? "disableElement" : ""}>
            {activityData}
             {this.props.editable &&  
                <span 
                className= {isActivityDeleted? "checkbox_delete fa  fa-check martp_20" : "checkbox_delete fa fa-close martp_20"}
                 data-name={summaryId}
                 style={isActivityDeleted? {color:"green", marginTop:"15px"} : {color:"red", marginTop:"15px"}}
                 
                 onClick={this.toggle_delete}>  
                </span>
              }

              <Modal 
               isOpen={this.state.modal_delete && summaryId == this.state.selectedId_delete}
               toggle={this.toggle_delete} >
              <ModalBody toggle={this.toggle_delete}>
              <div className=" display_flex" >
                                      <div className=" align_width1">
                                       Are you sure to delete this activity?
                                      </div>
                                   </div>
                        </ModalBody>
                  <ModalFooter>
                    <Button color="primary" data-name={this.state.selectedId_delete} onClick={this.deleteActivity}>Yes</Button>{' '}
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
                        {this.createSleepDropdown_heartrate(90,220)}     
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
                                   onChange={this.handleChangeModelActivityStartTimeDate}
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
                      onChange={this.handleChangeModalActivityTime}>
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
                      onChange={this.handleChangeModalActivityTime}>
                       <option key="mins" value="">Minutes</option>
                      {this.createSleepDropdown(0,59,true)}                        
                      </Input>                        
                      </div>
                      </div>

                       <div className="align_width align_width1">
                     <div className="input " style = {{marginLeft:"15px"}}>
                      <Input type="select" name="modalstarttime_activity_sec"
                       id="bed_min"
                      className="form-control custom-select "                   
                      value={this.state.modalstarttime_activity_sec}
                      onChange={this.handleChangeModalActivityTime}>
                       <option key="mins" value="">Seconds</option>
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
                      onChange={this.handleChangeModalActivityTime}>
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
                                   onChange={this.handleChangeModelActivityEndTimeDate}
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
                      onChange={this.handleChangeModalActivityTime}>
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
                      onChange={this.handleChangeModalActivityTime}>
                       <option key="mins" value="">Minutes</option>
                      {this.createSleepDropdown(0,59,true)}                        
                      </Input>                        
                      </div>
                      </div>

                       <div className="align_width align_width1">
                     <div className="input " style = {{marginLeft:"15px"}}>
                      <Input type="select" name="modalendtime_activity_sec"
                       id="bed_min"
                      className="form-control custom-select "                   
                      value={this.state.modalendtime_activity_sec}
                      onChange={this.handleChangeModalActivityTime}>
                       <option key="mins" value="">Seconds</option>
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
                      onChange={this.handleChangeModalActivityTime}>
                      <option value="">AM/PM</option>
                                      <option value="am">AM</option>
                                      <option value="pm">PM</option>                      
                      </Input>                        
                      </div>
                      </div>
                      </div>
                         </FormGroup>
                       <FormGroup>
                     <Label className="padding1">5. Exercise Duration (hh:mm:ss)</Label>
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


                      <div className="align_width align_width1">
                     <div className="input " style = {{marginLeft:"15px"}}>
                      <Input type="select" name="modal_activity_sec"
                       id="bed_min"
                      className="form-control custom-select "                   
                      value={this.state.modal_activity_sec}
                      onChange={this.handleChange}>
                       <option key="mins" value="">Seconds</option>
                      {this.createSleepDropdown(0,59,true)}                        
                      </Input>                        
                      </div>
                      </div>
                      </div>
                      </FormGroup>
                       <FormGroup>                            
                        <Label className="padding1">6. Exercise Steps</Label>
                        <div className="input ">
                           <Input 
                            type="number" 
                            className="form-control"
                            name="modal_exercise_steps"
                            value={this.state.modal_exercise_steps}                                       
                            onChange={this.handleChange}>                                                                                                                                                             
                            </Input>
                        </div>
                       </FormGroup>
                       <FormGroup>
                       <Label className="padding1">7. Change Exercise Steps to Non Exercise Steps</Label>
                        <div className="input">                           
                              <Label className="btn radio1">
                                <Input type="radio" 
                                name="modal_exercise_steps_status" 
                                value="exercise" 
                                checked={this.state.modal_exercise_steps_status === 'exercise'}
                                onChange={this.handleChange}/> Exercise Steps
                              </Label>
                              <Label className="btn radio1">
                                <Input type="radio" name="modal_exercise_steps_status" 
                                value="non_exercise"
                                checked={this.state.modal_exercise_steps_status === 'non_exercise'}
                                onChange={this.handleChange}/> Non Exercise Steps
                              </Label>
                        </div>
                       </FormGroup>
                       <FormGroup>
                       <Label className="padding1">8. Change Duplicate value to Not Duplicate</Label>
                        <div className="input">                           
                              <Label className="btn radio1">
                                <Input type="radio" 
                                name="modal_duplicate_info_status" 
                                value={true}
                                checked={this.state.modal_duplicate_info_status === true}
                                onChange={this.handleChange}/> Duplicate
                              </Label>
                              <Label className="btn radio1">
                                <Input type="radio" name="modal_duplicate_info_status" 
                                value={false}
                                checked={this.state.modal_duplicate_info_status === false}
                                onChange={this.handleChange}/> Not Duplicate
                              </Label>
                        </div>
                       </FormGroup>
                       <FormGroup>
                      <Label className="padding1">9. Exercise Comments</Label>
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
                      <Button size = "sm" className="btn btn-info" onClick={this.CreateNewActivity}>Save</Button>&nbsp;&nbsp;&nbsp;&nbsp;
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
<div className="row justify-content-center">
<div id = "activity_table">
<div  className="table-responsive input1 tablecenter1">
                                             
<table className="table table-bordered">  
<thead id = "add_button">
<td id = "add_button" className="add_button_back">Exercise Type</td>
<td id = "add_button" className="add_button_back">Average Heart Rate</td>
<td id = "add_button" className="add_button_back">Workout Start Time</td>
<td id = "add_button" className="add_button_back">Workout End Time</td>
<td id = "add_button" className="add_button_back">Exercise Duration (hh:mm:ss)</td>
<td id = "add_button" className="add_button_back">Exercise Steps</td>
<td id = "add_button" className="add_button_back">Steps Type </td>
<td id = "add_button" className="add_button_back">
    Duplicate Info 
    <span id="infoModalWindow" onClick={this.toggleInfo}>
        <a  className="infoBtn"> 
            <FontAwesome style={{fontSize:"16px"}}
                name = "info-circle"
                size = "1x"                                      
              />
        </a>
    </span>
</td>
<td id = "add_button" className="add_button_back">Comment</td>
 {
    this.props.editable &&  
    <td 
        id = "add_button" 
        className="add_button_back">
            <span id="deleteInfoModalWindow" onClick={this.toggleInfo}>
                <a  className="infoBtn"> 
                    <FontAwesome style={{fontSize:"16px"}}
                        name = "info-circle"
                        size = "1x"                                      
                      />
                </a>
            </span>
            Delete
    </td>}
</thead>
<tbody className = "tbody_styles">
{this.renderTable()}
</tbody>
</table>
{/*/************MODAL WINDOW FOR INFO BUTTON*************/}

    <Modal 
        className="pop"
        id="infoModalWindow" 
        placement="right" 
        isOpen={this.state.infoButton}
        target="infoModalWindow" 
        toggle={this.toggleInfo}>
         <ModalHeader toggle={this.toggleInfo}>
       <span>
        <a href="#" onClick={this.infoPrint} style={{paddingLeft:"35px",fontSize:"15px",color:"black"}}><i className="fa fa-print" aria-hidden="true">Print</i></a>
            &nbsp;
            Duplicate / Non Duplicate Files
        </span>
        </ModalHeader>
          <ModalBody className="modalcontent" id="duplicate_info_modal_text">
            <div>
            We identify potential duplicate activities by labeling them "Duplicate File". This often happens when a user has two devices capturing data for the same workout, most commonly seen when triathletes/cyclists start a watch file and a bike computer file for the same cycling workout. In order not report duplicate activities to you, WE EXCLUDE ALL DUPLICATE FILE INFORMATION FROM EXERCISE STATS ON THE SITE (WEEKLY WORKOUT SUMMARIES, RAW DATA STATS, GRADES, AEROBIC/ANAEROBIC STATS, ETC.) If we have mis-identified a file as "duplicate", you can change it back to "non-duplicate".
            </div>
        </ModalBody>
    </Modal>
{/******* INFO MODAL WINDOW FOR DELETE FUNCTIONALITY ************/}    
    <Modal 
        className="pop"
        id="deleteInfoModalWindow" 
        placement="right" 
        isOpen={this.state.infoButton}
        target="infoModalWindow" 
        toggle={this.toggleInfo}>
         <ModalHeader toggle={this.toggleInfo}>
       <span>
        <a href="#" onClick={this.infoPrint} style={{paddingLeft:"35px",fontSize:"15px",color:"black"}}><i className="fa fa-print" aria-hidden="true">Print</i></a>
            &nbsp;
            
        </span>
        </ModalHeader>
          <ModalBody className="modalcontent" id="duplicate_info_modal_text">
            <div>
            We identify potential duplicate activities by labeling them "Duplicate File". This often happens when a user has two devices capturing data for the same workout, most commonly seen when triathletes/cyclists start a watch file and a bike computer file for the same cycling workout. In order not report duplicate activities to you, WE EXCLUDE ALL DUPLICATE FILE INFORMATION FROM EXERCISE STATS ON THE SITE (WEEKLY WORKOUT SUMMARIES, RAW DATA STATS, GRADES, AEROBIC/ANAEROBIC STATS, ETC.) If we have mis-identified a file as "duplicate", you can change it back to "non-duplicate".
            </div>
        </ModalBody>
    </Modal>
</div>
{this.props.editable && 
 <div className="activity_add_btn btn4 mar_20 row"> 
 <div>
  <Button
    id="nav-btn"
    style={{backgroundColor:"#ed9507"}}
    className="btn btn-block-lg"
    onClick={this.handleChangeModal}>
    <span
        data-name=""
        className="fa fa-plus-circle fa-1x "
    >
        </span> &nbsp; 
            Create Manual Activity
  </Button>
</div>

</div>
}

{this.renderEditActivityModal()}

</div>
</div>
</div>

)
}
}