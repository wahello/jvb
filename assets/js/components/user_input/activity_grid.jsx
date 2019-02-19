import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Modal,
ModalHeader, ModalBody, ModalFooter, Collapse,Popover,PopoverBody} from 'reactstrap';
import Textarea from 'react-textarea-autosize';
import FontAwesome from "react-fontawesome";
import moment from 'moment';
import 'moment-timezone';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
import { ToastContainer, toast } from 'react-toastify';
import {getUserProfile} from '../../network/auth';

const activites = { "":"Select",
"OTHER":"OTHER",
"HEART_RATE_RECOVERY":"HEART RATE RECOVERY(HRR)",
"JVB_STRENGTH_EXERCISES":"JVB STRENGTH EXERCISES",
'ARC_TRAINER':'ARC TRAINER',
"BACKCOUNTRY_SKIING_SNOWBOARDING":"BACKCOUNTRY SKIING SNOWBOARDING",
"BARRE_CLASS":"BARRE CLASS",
"BASKETBALL":"BASKETBALL",
"BIKETORUNTRANSITION":"BIKE TO RUN TRANSITION",
"BOATING":"BOATING",
"CASUAL_WALKING":"CASUAL WALKING",
"CONDITIONING_CLASS":"CONDITIONING CLASS",
"CROSS_COUNTRY_SKIING":"CROSS COUNTRY SKIING",
"CROSS_FIT":"CROSS FIT",
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
"HOCKEY_ICE": "HOCKEY(ICE)",
"HORSEBACK_RIDING":"HORSEBACK RIDING",
"ICE_SKATING": "ICE SKATING",
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
"PELOTON_BIKE":"PELOTON (BIKE)",
"PELOTON_TREADMILL":"PELOTON (TREADMILL)",
"PILATES":"PILATES",
"PIYO-PILATES/YOGA":"PIYO-PILATES/YOGA",
"RECESS_PLAYING":"RECESS PLAYING",
"RECUMBENT_CYCLING":"RECUMBENT CYCLING",
"RESORT_SKIING_SNOWBOARDING":"RESORT SKIING SNOW BOARDING",
"ROAD_BIKING":"ROAD BIKING",
"ROCK_CLIMBING":"ROCK CLIMBING",
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
"SQUASH":"SQUASH",
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
"YOGA":"YOGA",
"ZUMBA":"ZUMBA"
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
this.toggleInfo_duplicate=this.toggleInfo_duplicate.bind(this);
this.toggleInfo_delete=this.toggleInfo_delete.bind(this);
this.infoPrint = this.infoPrint.bind(this);
this.activityStepsTypeModalToggle = this.activityStepsTypeModalToggle.bind(this);
this.toggleInfo_activitySteps = this.toggleInfo_activitySteps.bind(this);
this.toggleInfo_stepsType =this.toggleInfo_stepsType.bind(this);
this.successProfile=this.successProfile.bind(this);
this.calculateZone = this.calculateZone.bind(this);
this.editToggleHandler_weather = this.editToggleHandler_weather.bind(this);
this.handleChange_weather = this.handleChange_weather.bind(this);

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
    modal_exercise_steps_status:"exercise",
    modal_duplicate_info_status:false,
    modal_indoor_temperature:this.props.indoor_temperature,
    modal_temperature:"",
    modal_dew_point:"",
    modal_humidity:"",
    modal_wind:"",
    modal_temperature_feels_like:"",
    modal_weather_conditions:"",
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

    activity_start_date:moment(selected_date),
    activity_start_hour:'',
    activity_start_min:'',
    activity_start_sec:'',
    activity_start_am_pm:'',

    activity_end_date:moment(selected_date),
    activity_end_hour:'',
    activity_end_min:'',
    activity_end_sec:'',
    activity_end_am_pm:'',
    button_state: "",
    modal_delete:false,
    getselectedid:'',
    selectedId_starttime:'',
    selectedId_delete:'',
    infoButton_stepsType:'',
    infoButton_activitySteps:'',
    infoButton_duplicate:false,
    infoButton_delete:false,
    isActivityStepsTypeOpen:false ,
    age:"",
    selectedDate:new Date() ,
    avg_hr: ''
}
}

initializeActivity(activities,selected_date,isEditable,indoor_temperature,callback){
    this.setState({
      selected_date:selected_date,
      activity_start_date:moment(selected_date),
      activity_end_date:moment(selected_date),
      activities_edit_mode:this.createActivityEditModeState(activities),
      activites_hour_min:this.createActivityTime(activities),
      activity_start_end_time:this.createStartAndEndTime(activities),
      activites:activities,
      modal_indoor_temperature:indoor_temperature
    },()=>{
        if(!isEditable)
            callback();
    });
  }

createDropdown(start_num , end_num, step=1){
    let elements = [];
    let i = start_num;
    while(i<=end_num){
      elements.push(<option key={i} value={i}>{i}</option>);
      i=i+step;
    }
    return elements;
}

createWindDropdown(start_num , end_num, step=1){
    let elements = [];
    let i = start_num;
    while(i<=end_num){
      if(i < 1)
        elements.push(
          <option key={0} value={0}>CALM</option>
          );
      else
        elements.push(
          <option key={i} value={i}>{i}</option>);
      i=i+step;
    }
    return elements;
}

componentWillReceiveProps(nextProps) {
    if(nextProps.activities !== this.props.activities) {
        this.initializeActivity(
            nextProps.activities,
            nextProps.selected_date,
            nextProps.editable,
            nextProps.indoor_temperature,
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
successProfile(data){
    // let today_date = new Date();
    // let date_of_birth = moment(data.data.date_of_birth);
    // let today_date1 = moment(moment(today_date).format('YYYY-MM-DD'));
    // let age = Math.abs(today_date1.diff(date_of_birth, 'years'));
    this.setState({
        age:data.data.user_age
    })
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

        if (start_time_seconds){
            start_time_seconds = start_time_seconds;
            start_time_seconds = moment.unix(start_time_seconds);
        }

        if (end_time_seconds){
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
        modal_exercise_steps_status:"exercise",
        modal_duplicate_info_status:false,
        modal_indoor_temperature:this.props.indoor_temperature,
        modal_temperature:"",
        modal_dew_point:this.props.dewPoint,
        modal_humidity:"",
        modal_wind:this.props.wind,
        modal_temperature_feels_like:this.props.temperature_feels_like,
        modal_weather_conditions:"",
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
        activity_start_date:"",
        activity_start_hour:'',
        activity_start_min:'',
        activity_start_sec:'',
        activity_start_am_pm:'',

        activity_end_date:"",
        activity_end_hour:'',
        activity_end_min:'',
        activity_end_sec:'',
        activity_end_am_pm:'',
        activityEditModal:!this.state.activityEditModal
    });
  }

handleChangeModal(event){
    const target = event.target;
    const selectedActivityId = target.getAttribute('data-name');

    let categoryEditMode = this.state.activities_edit_mode[selectedActivityId];
    
    let activity_start_date = null;
    let activity_start_hour = "";
    let activity_start_min = "";
    let activity_start_sec = "";
    let activity_start_am_pm = "";

    let activity_end_date = null;
    let activity_end_hour = "";
    let activity_end_min = "";
    let activity_end_sec = "";
    let activity_end_am_pm = "";

    /*this.editToggleHandlerStartTime(selectedActivityId)
    this.editToggleHandlerEndTime(selectedActivityId)*/
    let date = moment(this.state.selected_date);
    let activityDisplayName = "";
    let current_activity = "";
    let hour = "";
    let mins = "";
    let secs = "";

    if(selectedActivityId){

        let start_time = this.state.activity_start_end_time[selectedActivityId]['start_time'];
        let start_time_info = this._extractDateTimeInfo(start_time);
        activity_start_date = start_time_info.calendarDate;
        activity_start_hour = start_time_info.hour;
        activity_start_min = start_time_info.min;
        activity_start_sec = start_time_info.sec;
        activity_start_am_pm = start_time_info.meridiem;

        let end_time = this.state.activity_start_end_time[selectedActivityId]['end_time'];
        let end_time_info = this._extractDateTimeInfo(end_time);
        activity_end_date = end_time_info.calendarDate;
        activity_end_hour = end_time_info.hour;
        activity_end_min = end_time_info.min;
        activity_end_sec = end_time_info.sec;
        activity_end_am_pm = end_time_info.meridiem;
        
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
            mins = ((mins) && (mins < 10)) ? "0" + mins : mins;
            secs = parseInt(activityDuration-(hour * 3600) - (mins * 60));
            secs = ((secs) && (secs < 10)) ? "0" + secs : secs;
        }
        else{
            hour = "0";
            mins = "00";
            secs = "00";
        }
    }
    this.setState({
        activity_display_name:activityDisplayName,
        modal_activity_type:current_activity?current_activity.activityType:"",
        modal_activity_heart_rate:current_activity?current_activity.averageHeartRateInBeatsPerMinute:"",
        modal_activity_hour:hour,
        modal_activity_min:mins,
        modal_activity_sec:secs,
        modal_exercise_steps:current_activity?current_activity.steps:"",
        modal_exercise_steps_status:current_activity?current_activity.steps_type:"exercise",
        modal_duplicate_info_status:current_activity?current_activity.duplicate:false,
        modal_indoor_temperature:current_activity?(current_activity.indoor_temperature?current_activity.indoor_temperature:this.props.indoor_temperature):this.props.indoor_temperature,
        modal_temperature:current_activity?(current_activity.temperature?current_activity.temperature:""):"",
        modal_dew_point:current_activity?(current_activity.dewPoint?current_activity.dewPoint:""):"",
        modal_humidity:current_activity?(current_activity.humidity?current_activity.humidity:""):"",
        modal_wind:current_activity?(current_activity.wind?current_activity.wind:""):"",
        modal_temperature_feels_like:current_activity?(current_activity.temperature_feels_like?current_activity.temperature_feels_like:""):"",
        modal_weather_conditions:current_activity?(current_activity.weather_condition?current_activity.weather_condition:""):"",
        modal_activity_comment:current_activity?current_activity.comments:"",
        selectedActivityId:selectedActivityId,
        activityEditModal:true,
        activity_start_date:date,

        activity_start_date:activity_start_date,
        activity_start_hour:activity_start_hour,
        activity_start_min:activity_start_min,
        activity_start_sec:activity_start_sec,
        activity_start_am_pm:activity_start_am_pm,

        activity_end_date:activity_end_date,
        activity_end_hour:activity_end_hour,
        activity_end_min:activity_end_min,
        activity_end_sec:activity_end_sec,
        activity_end_am_pm:activity_end_am_pm,

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

editToggleHandler_weather(key, event){
    const target = event.target;
    const selectedActivityId = target.getAttribute('data-name');
    let categoryMode = this.state.activities_edit_mode[selectedActivityId];
    categoryMode[key] = !categoryMode[key] 
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
        activity_start_hour:activity_start_end_hour,
        activity_start_min:activity_start_end_min,
        activity_start_sec:activity_start_end_sec,
        activity_start_am_pm:activity_start_end_am_pm,
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
        activity_end_hour:activity_start_end_hour,
        activity_end_min:activity_start_end_min,
        activity_end_sec:activity_start_end_sec,
        activity_end_am_pm:activity_start_end_am_pm,
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

calculateZone(){
    let age = this.state.age;
    let aerobic_zone = 180-age-29;
    let anaerobic_zone = 180-age+5;

    return {
        aerobic_zone: aerobic_zone ,
        anaerobic_zone: anaerobic_zone
    };
}   

getActivityCategory = (activityType,heartrate) => {
    const EXERCISE = 'exercise';
    if(activityType){
        let hrzone = this.calculateZone();
        const NON_EXERCISE = 'non_exercise';
        const HEART_RATE_RECOVERY = 'heart_rate_recovery'
        const WALK = "walk";

        if(activityType.toLowerCase() == HEART_RATE_RECOVERY){
            return NON_EXERCISE;
        }
        else if(activityType.toLowerCase().includes(WALK)){
            if(!heartrate || heartrate < hrzone['aerobic_zone'])
                return NON_EXERCISE;
            return EXERCISE;
        }
        else{
            return EXERCISE;
        }
    }
    return EXERCISE;
}

handleChange_activity(event){
    const target = event.target;
    const value = target.value;
    const selectedActivityId = target.getAttribute('data-name');
    let activity_data = this.state.activites[selectedActivityId];
    activity_data['activityType'] = value;

    /************** CHANGES DONE BY BHANUCHANDAR B:STARTS *****************/
    let avg_hr = activity_data['averageHeartRateInBeatsPerMinute'];
    let steps_type = this.getActivityCategory(value,avg_hr);
    activity_data['steps_type'] = steps_type;
    /************** CHANGES DONE BY BHANUCHANDAR B:ENDS *****************/
    this.setState({
    activites:{
        ...this.state.activites,
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
    /************** CHANGES DONE BY BHANUCHANDAR B:STARTS *****************/
    let act_type = activity_data['activityType'];
    let steps_type = this.getActivityCategory(act_type,parseInt(value));
    activity_data['steps_type'] = steps_type;
    /************** CHANGES DONE BY BHANUCHANDAR B:ENDS *****************/
    this.setState({
        activites:{
            ...this.state.activites,
            [selectedActivityId]:activity_data
        }
    });
    
}
handleChange_weather(key, event) {
    const target = event.target;
    const value = target.value;
    const selectedActivityId = target.getAttribute('data-name');
    let activity_data = this.state.activites[selectedActivityId];
    activity_data[key] = value;
    this.setState({
        activites:{...this.state.activites,
        [selectedActivityId]:activity_data,
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
    let activitiesObj = this.state.activites;
    let activity_data = activitiesObj[selectedActivityId];
    let steps_type = activity_data['steps_type'];
    let count = 0;
    let activitiesLen = 0;
    if(steps_type == "exercise"){
        /*for(let activityId of Object.keys(activitiesObj)) {
            if(activitiesObj[activityId]["deleted"] !== true && activitiesObj[activityId]["duplicate"] !== true){
                if(activitiesObj[activityId]["activityType"] !== "HEART_RATE_RECOVERY")
                    activitiesLen ++;
                for(let key of Object.keys(activitiesObj[activityId])){

                    if((key === "activityType" && activitiesObj[activityId][key] !== "HEART_RATE_RECOVERY" && activitiesObj[activityId]["steps_type"] === "non_exercise")) {
                        count ++;
                    }
                }
            }
                
        }
        if((activity_data["activityType"] !== "HEART_RATE_RECOVERY") && ((count === 0 && activitiesLen === 1) || (count === (activitiesLen -1)))) {

            this.activityStepsTypeModalToggle();
            steps_type = "exercise";
        } else {
            steps_type = "non_exercise";
        }*/
        steps_type = "non_exercise";
    }
    else {
        steps_type = "exercise";
    }
    activity_data['steps_type'] = steps_type;
    if(activity_data['can_update_steps_type']){
        this.setState({
            [selectedActivityId]: activity_data
        });
    }
    this.props.updateParentActivities(this.state.activites);
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
    this.props.updateParentActivities(this.state.activites);
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
        this.state.activity_start_date,
        this.state.activity_start_hour,
        this.state.activity_start_min,
        this.state.activity_start_sec,
        this.state.activity_start_am_pm
    );
    let durationUpdatedStateObjs = this.DurationOnStartEndTimeChange(
        newStartTime,CurrentEndTime,selectedActivityId
    );
    let updatedActivity = durationUpdatedStateObjs[0];
    let updatedTimeHourMin = duUpdatedStateObjs[1];

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
        this.state.activity_end_date,
        this.state.activity_end_hour,
        this.state.activity_end_min,
        this.state.activity_end_sec,
        this.state.activity_end_am_pm
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

 /************** CHANGES DONE BY BHANUCHANDAR B:STARTS *****************/
    let actType = this.state.modal_activity_type;
    let actAvgHeartRate = this.state.modal_activity_heart_rate;
    let steps_type = this.getActivityCategory(actType,parseInt(actAvgHeartRate));
/************** CHANGES DONE BY BHANUCHANDAR B:ENDS *****************/

    if(value == "OTHER"){
        let actType = value;
        let actAvgHeartRate = this.state.modal_activity_heart_rate;
        let steps_type = this.getActivityCategory(actType,parseInt(actAvgHeartRate));
        this.setState({
            [name]: value,
            modal_activity_type:"",
            modal_exercise_steps_status:steps_type
        });
    }
    else if(name == "activity_display_name"){
        let actType = value;
        let actAvgHeartRate = this.state.modal_activity_heart_rate;
        let steps_type = this.getActivityCategory(actType,parseInt(actAvgHeartRate));
        this.setState({
            [name]: value,
            modal_activity_type:value,
            modal_exercise_steps_status:steps_type
        });
    }
    else if(name == "modal_activity_heart_rate"){
        let actType = this.state.modal_activity_type;
        let actAvgHeartRate = parseInt(value);
        let steps_type = this.getActivityCategory(actType,actAvgHeartRate);

        this.setState({
            [name]: parseInt(value),
             modal_exercise_steps_status:steps_type
        });
    }
    else if (name == "modal_exercise_steps"){
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

valueToFixedDecimal(event){
    const target = event.target;
    const value = parseFloat(target.value);
    const name = target.name;
    this.setState({
        [name]:(value.toFixed(2))
    })
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
    let activity_Id = null;
    if(this.state.selectedActivityId) {
        activity_Id = this.state.selectedActivityId;
    } else {
        let newActivityID = Math.floor(1000000000 + Math.random() * 900000000);
        activity_Id = newActivityID;
    }
    
    let durationsecs = this.state.modal_activity_sec;
    let durationmins = this.state.modal_activity_min;
    let durationhours = this.state.modal_activity_hour;
    let durationSeconds = (parseInt(durationhours)*3600 
        + parseInt(durationmins)*60
        + parseInt(durationsecs)
    );

    let activityStartTimeMObject = this.getDTMomentObj(
        this.state.activity_start_date,
        this.state.activity_start_hour,
        this.state.activity_start_min,
        this.state.activity_start_sec,
        this.state.activity_start_am_pm
        
    );
    let activityEndTimeMObject = this.getDTMomentObj(
        this.state.activity_end_date,
        this.state.activity_end_hour,
        this.state.activity_end_min,
        this.state.activity_end_sec,
        this.state.activity_end_am_pm,
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
        "summaryId": activity_Id.toString(),
        "activityType": this.state.modal_activity_type,
        "averageHeartRateInBeatsPerMinute": this.state.modal_activity_heart_rate,
        "durationInSeconds":durationSeconds,
        "steps":steps,
        "steps_type":this.state.modal_exercise_steps_status?
            this.state.modal_exercise_steps_status:'exercise',
        "duplicate":this.state.modal_duplicate_info_status,
        "indoor_temperature":this.state.modal_indoor_temperature,
        "temperature":this.state.modal_temperature,
        "dewPoint":this.state.modal_dew_point,
        "humidity":this.state.modal_humidity,
        "wind":this.state.modal_wind,
        "temperature_feels_like":this.state.modal_temperature_feels_like,
        "weather_condition":this.state.modal_weather_conditions,
        "comments":this.state.modal_activity_comment,
        "startTimeInSeconds":activityStartTimeMObject.unix(),
        "startTimeOffsetInSeconds":tzOffsetFromUTCInSeconds,
        "can_update_steps_type":true,
        "deleted":false
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

    let activity_start_end_time_state = this.createStartAndEndTime({[activity_Id]:new_value});
    this.setState({
        activites:{
            ...this.state.activites,
            [activity_Id]:new_value,
        },
        activity_display_name:"",
        modal_activity_type:"",
        modal_activity_heart_rate:"",
        modal_activity_hour:"",
        modal_activity_min:"",
        modal_exercise_steps:"",
        modal_exercise_steps_status:"exercise",
        modal_duplicate_info_status:false,
        modal_activity_comment:"",
        modal_indoor_temperature:this.props.indoor_temperature,
        modal_temperature:"",
        modal_dew_point:"",
        modal_humidity:"",
        modal_wind:"",
        modal_temperature_feels_like:"",
        modal_weather_conditions:"",
        activity_start_date:"",
        activity_start_hour:"",
        activity_start_min:"",
        activity_start_sec:"",
        activity_start_am_pm:"",
        activity_end_date:"",
        activity_end_hour:"",
        activity_end_min:"",
        activity_end_sec:"",
        activity_end_am_pm:"",
        selectedActivityId:"",
        activityEditModal:!this.state.activityEditModal,
        editToggle: false,
        editToggle_heartrate:false,
        editToggle_comments:false,
        editToggle_time:false,
        //activityEditModal: !this.state.activityEditModal,
        activities_edit_mode:{
            ...this.state.activities_edit_mode,
            [activity_Id]:edit_mode_state
        },
        activites_hour_min:{
            ...this.state.activites_hour_min,
            [activity_Id]:activity_hour_min_state
        },
        activity_start_end_time:{
            ...this.state.activity_start_end_time,
            [activity_Id]:activity_start_end_time_state[activity_Id]
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
    activity_start_date: date,
    activity_end_date: date
  });
}

getTotalActivityDuration(){

    let activityStartTimeDate = this.state.activity_start_date;
    let activityStartTimeHour = this.state.activity_start_hour;
    let activityStartTimeMin = this.state.activity_start_min;
    let activityStartTimeSec = this.state.activity_start_sec;
    let activityStartTimeAmPm = this.state.activity_start_am_pm;
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

    let activityEndTimeDate = this.state.activity_end_date;
    let activityEndTimeHour = this.state.activity_end_hour;
    let activityEndTimeMin = this.state.activity_end_min;
    let activityEndTimeSec = this.state.activity_end_sec;
    let activityEndTimeAmPm = this.state.activity_end_am_pm;
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

ActivityTimeInvalidErrorPopup(){
  toast.info("Workout start time should be less than activity end time",{
    className:"dark"
  })
}

handleChangeModelActivityStartTimeDate(date){
    let oldValue = this.state.activitystarttime_calender;
    this.setState({
        activity_start_date:date
    },()=>{
            let duration = this.getTotalActivityDuration();
            let isActivityTimeValid = this.props.dateTimeValidation(
                this.state.activitystarttime_calender,
                this.state.modalstarttime_activity_hour,
                this.state.modalstarttime_activity_min,
                this.state.modalstarttime_activity_ampm,
                this.state.activityendtime_calender,
                this.state.modalendtime_activity_hour,
                this.state.modalendtime_activity_min,
                this.state.modalendtime_activity_ampm);
            if(duration && isActivityTimeValid){  
                this.setState({
                    modal_activity_hour:duration.split(":")[0],
                    modal_activity_min: duration.split(":")[1],
                    modal_activity_sec:duration.split(":")[2]
                });
            }else if(!isActivityTimeValid){
                this.ActivityTimeInvalidErrorPopup();
                this.setState({
                    activitystarttime_calender:oldValue
                })
            }
    });
}

handleChangeModelActivityEndTimeDate(date){
    let oldValue = this.state.activityendtime_calender;
    this.setState({
        activity_end_date:date
    },()=>{
            let duration = this.getTotalActivityDuration();
            let isActivityTimeValid = this.props.dateTimeValidation(
                this.state.activitystarttime_calender,
                this.state.modalstarttime_activity_hour,
                this.state.modalstarttime_activity_min,
                this.state.modalstarttime_activity_ampm,
                this.state.activityendtime_calender,
                this.state.modalendtime_activity_hour,
                this.state.modalendtime_activity_min,
                this.state.modalendtime_activity_ampm);
            if(duration && isActivityTimeValid){  
                this.setState({
                    modal_activity_hour:duration.split(":")[0],
                    modal_activity_min: duration.split(":")[1],
                    modal_activity_sec:duration.split(":")[2]
                });
            }else if(!isActivityTimeValid){
                this.ActivityTimeInvalidErrorPopup();
                this.setState({
                    activityendtime_calender:oldValue
                })
            }
    });
}

handleChangeModalActivityTime(event){
    const value = event.target.value;
    const name = event.target.name;
    let oldValue = this.state[name];
    this.setState({
        [name]: value
    },()=>{
            let duration = this.getTotalActivityDuration();
            let isActivityTimeValid = this.props.dateTimeValidation(
                this.state.activitystarttime_calender,
                this.state.modalstarttime_activity_hour,
                this.state.modalstarttime_activity_min,
                this.state.modalstarttime_activity_ampm,
                this.state.activityendtime_calender,
                this.state.modalendtime_activity_hour,
                this.state.modalendtime_activity_min,
                this.state.modalendtime_activity_ampm);
            if(duration && isActivityTimeValid){  
                this.setState({
                    modal_activity_hour:duration.split(":")[0],
                    modal_activity_min: duration.split(":")[1],
                    modal_activity_sec:duration.split(":")[2]
                });
            }else if(!isActivityTimeValid){
                this.ActivityTimeInvalidErrorPopup();
                this.setState({
                    [name]:oldValue
                })
            }
    });
}
 
toggleInfo_duplicate(){
    this.setState({
      infoButton_duplicate:!this.state.infoButton_duplicate
    });
}
toggleInfo_delete(){
    this.setState({
      infoButton_delete:!this.state.infoButton_delete
    });

}
toggleInfo_activitySteps(){
    this.setState({
      infoButton_activitySteps:!this.state.infoButton_activitySteps
    });

}
toggleInfo_stepsType(){
    this.setState({
      infoButton_stepsType:!this.state.infoButton_stepsType
    });

}
activityStepsTypeModalToggle() {
    this.setState({
        isActivityStepsTypeOpen:!this.state.isActivityStepsTypeOpen
    });
}
infoPrint(infoPrintText){
    var mywindow = window.open('', 'PRINT');
    mywindow.document.write('<html><head><style>' +
        '.research-logo {margin-bottom: 20px;width: 100%; min-height: 55px; float: left;}' +
        '.print {visibility: hidden;}' +
        '.research-logo img {max-height: 100px;width: 60%;border-radius: 4px;}' +
        '</style><title>' + document.title  + '</title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1>' + document.title  + '</h1>');
    mywindow.document.write(document.getElementById(infoPrintText).innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();
   }

renderTable(){
    const activityKeys = ["summaryId","activityType","averageHeartRateInBeatsPerMinute",
        "startTimeInSeconds","endTimeInSeconds","durationInSeconds","steps","steps_type","duplicate","indoor_temperature","temperature","dewPoint","humidity","wind","temperature_feels_like","weather_condition","comments"];
        /*const WEATHER_FIELDS = ['humidity','temperature_feels_like','weather_condition','dewPoint','temperature'];*/
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
                activityData.push(
                    this.props.editable && <td  name = {summaryId}  id = "add_button">
                        {isActivityDeleted?
                            <span>
                                <span  data-name = {summaryId}
                                    style={{display:"inline"}}
                                    className="fa fa-pencil fa-1x"
                                    id = "add_button">
                                </span>
                                &nbsp;&nbsp;
                                <span 
                                    className= "checkbox_delete fa  fa-check martp_20"
                                    data-name={summaryId}
                                    style={{color:"green", marginTop:"15px", display:"inline"}}
                                    onClick={this.toggle_delete}>  
                                </span>
                            </span>:
                            <span>
                                <span  data-name = {summaryId}
                                    className="fa fa-pencil fa-1x"
                                    id = "add_button"
                                    onClick={this.handleChangeModal}
                                    style={{display:"inline"}}>
                                </span>
                                &nbsp;&nbsp;
                                <span 
                                    className="checkbox_delete fa fa-close martp_20"
                                    data-name={summaryId}
                                    style={{color:"red", marginTop:"15px", display:"inline"}}

                                    onClick={this.toggle_delete}>  
                                </span>
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
                        
                    </td>);
            }

            else if(key === "activityType"){
                var  activityType=keyValue;
                var deleted_text = "";
                if(isActivityDeleted) {
                    deleted_text = " (Deleted)";
                }
                activityData.push(<td  name = {summaryId}  id = "add_button">
                {!this.state.activites[summaryId][key]? activityType + deleted_text :this.state.activites[summaryId][key] + deleted_text}                               
                </td>);
            }
            else if(key === "averageHeartRateInBeatsPerMinute"){
                let averageHeartRateInBeatsPerMinute=keyValue;
                let hr = this.state.activites[summaryId][key];
                hr = hr && hr !== null && hr !== undefined ?hr:'Not Measured'; 
                activityData.push(<td  name = {summaryId}  id = "add_button">
                    {hr}
                </td>);
            }

            else if(key === "startTimeInSeconds"){
                let start_time = this.state.activity_start_end_time[summaryId]['start_time'];
                activityData.push(<td  name = {summaryId}  id = "add_button">
                {start_time?moment(start_time).format('MMM D, YYYY h:mm:ss a'):''} 
                      </td>);
            }

            else if(key === "endTimeInSeconds"){
                let end_time = this.state.activity_start_end_time[summaryId]['end_time'];
                activityData.push(<td  name = {summaryId}  id = "add_button">
                    {end_time?moment(end_time).format('MMM D, YYYY h:mm:ss a'):''} 
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
                    </div>
                    :this.state.activites_hour_min[summaryId]?
            
                    this.state.activites_hour_min[summaryId]["duration_hour"]+":"+
                    this.state.activites_hour_min[summaryId]["duration_min"]+":"+
                    this.state.activites_hour_min[summaryId]["duration_sec"]:time}
                </td>); 
            }
            else if(key === "steps"){
                let  steps=keyValue;
                activityData.push(
                    <td name={summaryId} className="comment_td" id = "add_button">
                    { 
                        this.addingCommaToSteps(this.state.activites[summaryId][key])}
                        
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
                    { exerciseTypeLabel}
                   
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
                        duplicateInfoLabel
                    }
                </td>);
                /*//<Input
                          type = "text" 
                          className="form-control"
                          style={{height:"37px"}}
                          name="modal_activity_type"
                          value={this.state.modal_activity_type}                                 
                          onChange={this.handleChange}>   
                        </Input>*/
            }
            //const WEATHER_FIELDS = ['humidity','temperature_feels_like','weather_condition','dewPoint','temperature'];
           else if(key === "indoor_temperature") {
                let indoor_temperature = this.state.activites[summaryId][key];
                indoor_temperature = indoor_temperature && indoor_temperature !== null && indoor_temperature !== undefined ?indoor_temperature:' - '; 
                activityData.push(<td name = {summaryId}  id = "add_button">
                    {indoor_temperature}
                    </td>
               );
            }
            else if(key === "humidity") {
                let humidity = this.state.activites[summaryId][key];
                humidity = humidity && humidity !== null && humidity !== undefined ?humidity:' - '; 
                activityData.push(<td name = {summaryId}  id = "add_button">
                    {humidity}
                    </td>
               );
            }
            else if(key === "temperature_feels_like") {
                let temperature_feels_like = this.state.activites[summaryId][key];
                temperature_feels_like = temperature_feels_like && temperature_feels_like !== null && temperature_feels_like !== undefined ?temperature_feels_like:' - '; 
                activityData.push(<td  name = {summaryId}  id = "add_button">
                    {temperature_feels_like}
                    </td>
               );
            }
            else if(key === "temperature") {
                let temperature = this.state.activites[summaryId][key];
                temperature = temperature && temperature !== null && temperature !== undefined ?temperature:' - '; 
                activityData.push(<td  name = {summaryId}  id = "add_button">
                    {temperature}
                    </td>
               );
            }
            else if(key === "weather_condition") {
                let weather_condition = this.state.activites[summaryId][key];
                weather_condition = weather_condition && weather_condition !== null && weather_condition !== undefined ?weather_condition:' - '; 
                activityData.push(<td  name = {summaryId}  id = "add_button">
                    {weather_condition}
                    </td>
               );
            }
            else if(key === "dewPoint") {
                let dewPoint = this.state.activites[summaryId][key];
                dewPoint = dewPoint && dewPoint !== null && dewPoint !== undefined ?dewPoint:' - '; 
                activityData.push(<td  name = {summaryId}  id = "add_button">
                    {dewPoint}
                    </td>
               );
            }
            else if(key === "wind") {
                let wind = this.state.activites[summaryId][key];
                wind = wind && wind !== null && wind !== undefined ?wind:' - '; 
                activityData.push(<td  name = {summaryId}  id = "add_button">
                    {wind}
                    </td>
               );
            }
            /************** CHANGES DONE BY MOUNIKA NH:ENDS *****************/
            else if(key === "comments"){
                let  comments=keyValue;
                activityData.push(<td name={summaryId} className="comment_td" id = "add_button">
                { this.state.activites[summaryId][key]}
                </td>);
            }

            else
                activityData.push(<td id = "add_button">{keyValue}</td>);
        }
    activityRows.push(
        <tr name = {summaryId} 
            id = "add_button" 
            className = {isActivityDeleted? "disableElement" : ""}>
            {activityData}
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
                        {this.createSleepDropdown_heartrate(60,220)}     
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
                                name = "activity_start_date"
                                selected={this.state.activity_start_date}
                                onChange={this.handleChangeModelActivityStartTimeDate}
                                dateFormat="LL"
                                isClearable={true}
                                shouldCloseOnSelect={false}
                            />
                      </div>
                      </div>

                    <div className="align_width align_width1">
                        <div className="input " style = {{marginLeft:"15px"}}> 
                            <Input type="select" name="activity_start_hour"
                              id="bed_hr"
                              className="form-control custom-select"
                              value={this.state.activity_start_hour}
                              onChange={this.handleChangeModalActivityTime}>
                               <option key="hours" value="">Hours</option>
                              {this.createSleepDropdown(0,12)}                        
                            </Input>

                        </div>
                    </div>

                  <div className="align_width align_width1">
                     <div className="input " style = {{marginLeft:"15px"}}>
                      <Input type="select" name="activity_start_min"
                       id="bed_min"
                      className="form-control custom-select "                   
                      value={this.state.activity_start_min}
                      onChange={this.handleChangeModalActivityTime}>
                       <option key="mins" value="">Minutes</option>
                      {this.createSleepDropdown(0,59,true)}                        
                      </Input>                       
                      </div>
                      </div>

                    <div className="align_width align_width1">
                     <div className="input " style = {{marginLeft:"15px"}}>
                      <Input type="select" name="activity_start_sec"
                       id="bed_min"
                      className="form-control custom-select "                   
                      value={this.state.activity_start_sec}
                      onChange={this.handleChangeModalActivityTime}>
                       <option key="mins" value="">Seconds</option>
                      {this.createSleepDropdown(0,59,true)}                        
                      </Input>                        
                      </div>
                      </div>
                       <div className="align_width align_width1">
                     <div className="input " style = {{marginLeft:"15px"}}> 
                      <Input type="select" name="activity_start_am_pm"
                       id="bed_min"
                      className="form-control custom-select "                   
                      value={this.state.activity_start_am_pm}
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
                                   name = "activity_end_date"
                                   selected={this.state.activity_end_date}
                                   onChange={this.handleChangeModelActivityEndTimeDate}
                                   dateFormat="LL"
                                   isClearable={true}
                                   shouldCloseOnSelect={false}
                            />
                        </div>
                      </div>
                         <div className="align_width align_width1">
                        <div className="input " style = {{marginLeft:"15px"}}> 
                      <Input type="select" name="activity_end_hour"
                      id="bed_hr"
                      className="form-control custom-select"
                      value={this.state.activity_end_hour}
                      onChange={this.handleChangeModalActivityTime}>
                       <option key="hours" value="">Hours</option>
                      {this.createSleepDropdown(0,12)}                        
                      </Input>
                      </div>
                      </div>

                    <div className="align_width align_width1">
                     <div className="input " style = {{marginLeft:"15px"}}>
                      <Input type="select" name="activity_end_min"
                       id="bed_min"
                      className="form-control custom-select "                   
                      value={this.state.activity_end_min}
                      onChange={this.handleChangeModalActivityTime}>
                       <option key="mins" value="">Minutes</option>
                      {this.createSleepDropdown(0,59,true)}                        
                      </Input>                     
                      </div>
                      </div>

                       <div className="align_width align_width1">
                     <div className="input " style = {{marginLeft:"15px"}}>
                      <Input type="select" name="activity_end_sec"
                       id="bed_min"
                      className="form-control custom-select "                   
                      value={this.state.activity_end_sec}
                      onChange={this.handleChangeModalActivityTime}>
                       <option key="mins" value="">Seconds</option>
                      {this.createSleepDropdown(0,59,true)}                        
                      </Input>                        
                      </div>
                      </div>
                       <div className="align_width align_width1">
                     <div className="input " style = {{marginLeft:"15px"}}>
                      <Input type="select" name="activity_end_am_pm"
                       id="bed_min"
                      className="form-control custom-select "                   
                      value={this.state.activity_end_am_pm}
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
                       {/*
                        *********************WEATHER REPORT **********************
                       */}
                       <FormGroup>
                       <Label className="padding1">9. Change Indoor Temperature</Label>
                        <div className="input">
                            {/*<Input 
                                type="text" 
                                className="form-control"
                                name="modal_indoor_temperature"
                                style={{height:"37px",width:"80%"}}
                                value={this.state.modal_indoor_temperature}                               
                                onChange={this.handleChange}>
                            </Input>*/}
                            <Input type="select" name="modal_indoor_temperature"
                                className="form-control custom-select"
                                value={this.state.modal_indoor_temperature}
                                onChange={this.handleChange} >
                                 <option key="hours" value="">Indoor</option>
                                {this.createDropdown(-20,120)}                        
                            </Input>
                        </div>
                       </FormGroup>
                       <FormGroup>
                       <Label className="padding1">10. Change Temperature</Label>
                        <div className="input">
                            {/*<Input type="text" 
                                name="modal_temperature" 
                                value={this.state.modal_temperature}
                                onChange={this.handleChange}
                                onBlur={this.valueToFixedDecimal.bind(this)}/>*/}
                            <Input type="select" 
                                className="custom-select form-control"
                                name="modal_temperature"                                  
                                value={this.state.modal_temperature}
                                onChange={this.handleChange} >
                                <option key="select" value="">Select</option>                                    
                                {this.createDropdown(-20,120)}
                            </Input>
                        </div>
                       </FormGroup>
                       <FormGroup>
                       <Label className="padding1">11. Change Dew Point</Label>
                        <div className="input">
                            {/*<Input type="text" 
                                name="modal_dew_point" 
                                value={this.state.modal_dew_point}
                                onChange={this.handleChange}
                                onBlur={this.valueToFixedDecimal.bind(this)} />*/}
                            <Input type="select" 
                                className="custom-select form-control"
                                name="modal_dew_point"                                  
                                value={this.state.modal_dew_point}
                                onChange={this.handleChange} >
                                <option key="select" value="">Select</option>                                    
                                {this.createDropdown(-20,120,true)}
                            </Input>
                        </div>
                       </FormGroup>
                       <FormGroup>
                       <Label className="padding1">12. Change Humidity</Label>
                        <div className="input">
                            {/*<Input type="text" 
                                name="modal_humidity" 
                                value={this.state.modal_humidity}
                                onChange={this.handleChange}/>*/}
                            <Input type="select" 
                                className="custom-select form-control"
                                name="modal_humidity"                                  
                                value={this.state.modal_humidity}
                                onChange={this.handleChange} >
                                <option key="select" value="">Select</option>                                    
                                {this.createDropdown(1,100)}
                            </Input>
                        </div>
                        </FormGroup>
                        <FormGroup>
                        <Label className="padding1">13. Change wind</Label>
                        <div className="input">
                            {/*<Input type="text" 
                                name="modal_wind" 
                                value={this.state.modal_wind}
                                onChange={this.handleChange}
                                onBlur={this.valueToFixedDecimal.bind(this)} /> */}
                                <Input type="select" 
                                    className="custom-select form-control"
                                    name="modal_wind"                                  
                                    value={this.state.modal_wind}
                                    onChange={this.handleChange} >
                                    <option key="select" value="">Select</option>                                    
                                    {this.createWindDropdown(0,350)}
                                </Input>
                        </div>
                       </FormGroup>
                       <FormGroup>
                       <Label className="padding1">14. Change Temperature Feels Like</Label>
                        <div className="input">
                            {/*<Input type="text" 
                                name="modal_temperature_feels_like" 
                                value={this.state.modal_temperature_feels_like}
                                onChange={this.handleChange}
                                onBlur={this.valueToFixedDecimal.bind(this)} /> */}
                            <Input type="select" 
                                className="custom-select form-control"
                                name="modal_temperature_feels_like"
                                value={this.state.modal_temperature_feels_like}
                                onChange={this.handleChange} >
                                <option key="select" value="">Select</option>                                    
                                {this.createDropdown(-20,120)}
                            </Input>
                        </div>
                       </FormGroup>
                       <FormGroup>
                       <Label className="padding1">15. Change Weather Conditions</Label>
                        <div className="input">
                            <Input type="text" 
                                name="modal_weather_conditions" 
                                value={this.state.modal_weather_conditions}
                                onChange={this.handleChange}/> 
                        </div>
                       </FormGroup>
                        {/*********************/}
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
                      <Button size = "sm" className="btn btn-info" onClick={this.CreateNewActivity}>
                        {this.state.selectedActivityId?'Update':'Save'}
                      </Button>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Button size = "sm" className="btn btn-info" onClick={this.toggleModal}>Cancel</Button>
                      </div>
                    </ModalBody>
                </Modal>  
                return modal;
          }
    }


    
componentDidMount(){
    getUserProfile(this.successProfile);
}


render(){

return(
<div className = "container_fluid">
<div className="row justify-content-center">
<div id = "activity_table">
<div  className="table-responsive input1 tablecenter1">
                                             
<table className="table table-bordered">  
<thead id = "add_button">
{
    this.props.editable && <td 
        id = "add_button" 
        className="add_button_back">
        Edit / (Delete  
        <span id="deleteInfoModalWindow" onClick={this.toggleInfo_delete}>
            <a  className="infoBtn"> 
                <FontAwesome style={{fontSize:"16px"}}
                    name = "info-circle"
                    size = "1x"                                      
                  />
            </a>
        </span>)         
    </td>
}
<td id = "add_button" className="add_button_back">Exercise Type</td>
<td id = "add_button" className="add_button_back">Average Heart Rate</td>
<td id = "add_button" className="add_button_back">Workout Start Time</td>
<td id = "add_button" className="add_button_back">Workout End Time</td>
<td id = "add_button" className="add_button_back">Exercise Duration (hh:mm:ss)</td>
<td id = "add_button" className="add_button_back">
    Activity Steps
    <span id="activityStepsInfoModalWindow" onClick={this.toggleInfo_activitySteps}>
        <a  className="infoBtn"> 
            <FontAwesome style={{fontSize:"16px"}}
                name = "info-circle"
                size = "1x"                                      
              />
        </a>
    </span>
</td>
<td id = "add_button" className="add_button_back">
          Exercise or Non-Exercise? / Exercise or Non-Exercise Steps
    <span id="stepsTypeInfoModalWindow" onClick={this.toggleInfo_stepsType}>
        <a  className="infoBtn"> 
            <FontAwesome style={{fontSize:"16px"}}
                name = "info-circle"
                size = "1x"                                      
              />
        </a>
    </span>
</td>
<td id = "add_button" className="add_button_back">
    Duplicate Info 
    <span id="infoModalWindow" onClick={this.toggleInfo_duplicate}>
        <a  className="infoBtn"> 
            <FontAwesome style={{fontSize:"16px"}}
                name = "info-circle"
                size = "1x"                                      
              />
        </a>
    </span>
</td>
<td id = "add_button" className="add_button_back" >Indoor<br /> Temperature
</td>
<td id = "add_button" className="add_button_back" >Temperature <br />(fahrenheit)
</td>
<td id = "add_button" className="add_button_back" >Dew Point <br />(fahrenheit)
</td>
<td id = "add_button" className="add_button_back" >Humidity <br />(%)
</td>
<td id = "add_button" className="add_button_back">Wind <br />(miles/hour)
</td>
<td id = "add_button" className="add_button_back">Temperature Feels like <br />(fahrenheit)
</td>
<td id = "add_button" className="add_button_back">Weather <br />Conditions
</td>
<td id = "add_button" className="add_button_back">Comment</td>
 
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
        isOpen={this.state.infoButton_duplicate}
        target="infoModalWindow" 
        toggle={this.toggleInfo_duplicate}>
         <ModalHeader toggle={this.toggleInfo_duplicate}>
       <span>
        <a href="#" onClick={()=>this.infoPrint("duplicate_info_modal_text")} style={{paddingLeft:"35px",fontSize:"15px",color:"black"}}><i className="fa fa-print" aria-hidden="true">Print</i></a>
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
        isOpen={this.state.infoButton_delete}
        target="deleteInfoModalWindow" 
        toggle={this.toggleInfo_delete}>
         <ModalHeader toggle={this.toggleInfo_delete}>
       <span>
        <a href="#" onClick={() => this.infoPrint("delete_info_modal_text")} style={{paddingLeft:"35px",fontSize:"15px",color:"black"}}><i className="fa fa-print" aria-hidden="true">Print</i></a>
            &nbsp;
            Delete Functionality
        </span>
        </ModalHeader>
          <ModalBody className="modalcontent" id="delete_info_modal_text">
            <div>
            If you would like to delete an activity, click the X button and the activity file be deleted. If you delete a file, this will remove all stats from the deleted activity file everywhere on our website, including but not limited to in the raw data section, progress analyzer, aerobic/anaerobic charts, heart rate recovery, etc. We store all deleted files, so if you deleted the file by mistake, email us at info@jvbwellness.com and we can restore this file for you and include it in your stats.
            </div>
        </ModalBody>
    </Modal>
{/****Modal window for activitity steps change, if validation fails****/}
    <Modal 
        className="pop"
        id="activityStepsTypeModalWindow" 
        placement="right" 
        isOpen={this.state.isActivityStepsTypeOpen}
        target="activityStepsTypeModalWindow" 
        toggle={this.activityStepsTypeModalToggle}>
        
          <ModalBody className="modalcontent" id="activity_steps_type_modal_text">
            <div>
            One workout (non HRR) file must characterize its steps as Exercise Steps. Please classify one activity as "exercise steps"
            </div>
            <Button
            className="btn btn-info" size="sm" style={{ float: "right", backgroundColor:"#ed9507"}}
            onClick={this.activityStepsTypeModalToggle}>
                OK
        </Button>
        </ModalBody>
        
    </Modal>
{/************ MODAL WINDOW FOR ACTIVITY STEPS ***********/}
    <Modal 
        className="pop"
        id="activityStepsInfoModalWindow" 
        placement="right" 
        isOpen={this.state.infoButton_activitySteps}
        target="activityStepsInfoModalWindow" 
        toggle={this.toggleInfo_activitySteps}>
         <ModalHeader toggle={this.toggleInfo_activitySteps}>
       <span>
        <a href="#" onClick={() => this.infoPrint("activitySteps_info_modal_body")} style={{paddingLeft:"35px",fontSize:"15px",color:"black"}}><i className="fa fa-print" aria-hidden="true">Print</i></a>
            &nbsp;
            Activity Steps
        </span>
        </ModalHeader>
          <ModalBody className="modalcontent" id="activitySteps_info_modal_body">
            <div>
                We define steps in 2 different ways:  
                <ol>
                    <li>Exercise steps (steps accumulated during exercise, generally when a person’s heart rate is elevated to the aerobic or anaerobic zone).
                    </li>
                    <li>
                        Non exercise steps (generally when moving around throughout the day when not exercising i.e., the heart rate is lower and a person would generally not consider this movement as “exercise”). 
                    </li>
                    </ol>
                    <p>  We receive “activity steps” from various wearable devices provide what we receive as activity steps.  If you enter an activity in manually ,you can decide whether you want to call these steps exercise or non exercise steps.
                    </p>
                    <p>For more information, also see the information button next to “Steps Type”.
                    </p>
            </div>
        </ModalBody>
    </Modal>
    
{/********** MODAL WINDOW CODE:ENDS HERE***********/}

{/************ MODAL WINDOW FOR STEPS TYPE ***********/}
    <Modal 
        className="pop"
        id="stepsTypeInfoModalWindow" 
        placement="right" 
        isOpen={this.state.infoButton_stepsType}
        target="stepsTypeInfoModalWindow" 
        toggle={this.toggleInfo_stepsType}>
         <ModalHeader toggle={this.toggleInfo_stepsType}>
       <span>
        <a href="#" onClick={() => this.infoPrint("steps_type_info_modal_body")} style={{paddingLeft:"35px",fontSize:"15px",color:"black"}}><i className="fa fa-print" aria-hidden="true">Print</i></a>
            &nbsp;
            Exercise or Non-Exercise? / Exercise or Non-Exercise Steps
        </span>
        </ModalHeader>
          <ModalBody className="modalcontent" id="steps_type_info_modal_body">
            <div>
                We define steps in 2 different ways:
                <ol>
                    <li>
                        Exercise steps (steps accumulated during exercise, generally when a person’s heart rate is elevated to the aerobic or anaerobic zone)
                    </li>
                    <li>
                        Non exercise steps (generally when moving around throughout the day when not exercising i.e., the heart rate is lower and a person may not consider this movement as “exercise”)
                    </li>
                </ol> 
                <p>We receive “activity steps” from various wearable devices and use the logic below to characterize steps and “exercise” or “non exercise” steps (and this characterization also determines the “Non Exercise Steps” grade on our site as well as other stats we provide).  We give you the ability to recharacterize your steps as “exercise” or “non exercise” steps in certain scenarios, as you may create an activity file on your wearable device (we encourage this) that you may characterize differently than the logic we use below.  To recharacterize your steps between exercise and non exercise steps, select the toggle button in the “Steps Type” column.  
                </p>
                <p>NOTE: USERS CAN NOT CHANGE EXERCISE STEPS TO NON EXERCISE STEPS IN THE ACTIVITY FILE HAS AN AVERAGE HEART RATE IN THE ANAEROBIC ZONE.
                </p>  
                <p>If you’d like to recharacterize it as non exercise steps for some reason, email info@jvbwellness.com to request this and explain why
                </p>
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <td>
                                Exercise/Non-Exercise Steps Characterization
                            </td>
                            <td colSpan="4">
                                If the average heart rate of an activity file is
                            </td>
                        </tr>
                        <tr>
                            <td>

                            </td>
                            <td>
                                Below Aerobic zone
                            </td>
                            <td>
                                Aerobic Zone
                            </td>
                            <td>
                                Anaerobic zone
                            </td>
                            <td>
                                 Not Recorded
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Heart Rate Recovery (“HRR”) File
                            </td>
                            <td>
                                Default: Non-exercise steps
                                <br /><br />Allow User to Characterize as Exercise or Non Exercise Steps:  Yes
                            </td>
                            <td>
                                Default: Non-Exercise steps
                                <br /><br />Allow User to Characterize as Exercise or Non Exercise Steps: Yes
                            </td>
                            <td>
                                Default: Non-Exercise steps
                                <br /><br />Allow User to Characterize as Exercise or Non Exercise Steps: Yes
                            </td>
                            <td>
                                Default: Non-Exercise steps
                                <br /><br />Allow User to Characterize as Exercise or Non Exercise Steps: Yes
                            </td>


                        </tr>
                        <tr>
                            <td>
                                Activity (Exercise) File (Except Walk/Walking Activity Type)
                            </td>
                            <td>
                                Default: Exercise steps
                                <br /><br />Allow User to Characterize as Exercise or Non Exercise Steps:  Yes
                            </td>
                            <td>
                                Default: Exercise steps
                                <br /><br />Allow User to Characterize as Exercise or Non Exercise Steps: Yes
                            </td>
                            <td>
                                Default: Exercise steps
                                <br /><br />Allow User to Characterize as Exercise or Non Exercise Steps:  No
                            </td>

                            <td>
                                Default: Exercise steps
                                <br /><br />Allow User to Characterize as Exercise or Non Exercise Steps: Yes
                            </td>
                        </tr>

                        <tr>
                            <td>
                                 Activity (Exercise) File:  Walk/Walking Activity Type
                            </td>
                            <td>
                                Default: Non Exercise steps
                                <br /><br />Allow User to Characterize as Exercise or Non Exercise Steps:  Yes
                            </td>
                            <td>
                                Default: Exercise steps
                                <br /><br />Allow User to Characterize as Exercise or Non Exercise Steps: Yes
                            </td>
                            <td>
                                Default: Exercise steps
                                <br /><br />Allow User to Characterize as Exercise or Non Exercise Steps:  No
                            </td>

                            <td>
                                Default: Non Exercise steps
                                <br /><br />Allow User to Characterize as Exercise or Non Exercise Steps: Yes
                            </td>
                        </tr>
                        </tbody>
                </table>
                        
                            
                            We differentiate between Exercise and Not Exercise (Movement).  Both are important.  In general, we define exercise as 
                            <ol>
                                <li>when one elevates his/her average heart rate to an aerobic or anaerobic zone over the course of the workout; and </li>
                                
                                 <li> during strength training or other activities that are clearly exercise but may or may not elevate one's average heart rate over the course of the workout to an aerobic or anaerobic zone </li>
                            </ol>

                           <p> We define "Exercise Steps" ("Activity Steps") as those steps accumulated during exercise, generally when a person's heart rate is elevated consistently to the aerobic or anaerobic zone; conversely, we define non exercise steps generally as those steps accumulated when moving around throughout the day (MOVEMENT!) when not exercising, and therefore one's heart rate is lower and therefore we consider it to be movement, not exercise </p>


                            <p> We receive and/or have written proprietary algorithms to arrive at 'Exercise Steps"/“Activity Steps” from various wearable devices and use the logic to characterize steps as “exercise” or “non exercise” steps (and this characterization also determines the “Non Exercise Steps” grade on our site as well as other stats we provide). We give you the ability to recharacterize your steps as “exercise” or “non exercise” steps in certain scenarios, as you may create an activity file on your wearable device (we encourage this) that you may characterize differently than the logic we use below. To recharacterize your steps between exercise and non exercise steps, select the toggle button in the “Steps Type” column.  </p>

                            <p> NOTE 1:  IF ONE CHARACTERIZES STEPS AS "NON EXERCISE STEPS", THEN THE "Exercise or Not Exercise (Movement)" CLASSIFICATION MUST BE "NOT EXERCISE (MOVEMENT)" (AND VICE VERSA).   THIS ENSURES THAT USERS WILL NOT DOUBLE DIP BY GETTING CREDIT FOR BOTH EXERCISE WHILE AT THE SAME TIME ACCUMULATING NON EXERCISE STEPS </p>

                            <p> NOTE 2: USERS CAN NOT CHANGE EXERCISE STEPS TO NON EXERCISE STEPS IF THE ACTIVITY FILE HAS AN AVERAGE HEART RATE IN THE ANAEROBIC ZONE, AS IN ALL CASES WE CONSIDER THIS EXERCISE (AND NOT MOVEMENT) </p>

                            <p>If you’d like to recharacterize AN EXERCISE ACTIVITY AS EXERCISE OR NOT EXERCISE (MOVEMENT) and are unable to do so on the site, email us at info@jvbwellness.com to request what you would like to do and explain why </p>
                            
                        
                        

                       
                   
            </div>
        </ModalBody>
    </Modal>
    
{/********** MODAL WINDOW CODE:ENDS HERE***********/}

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