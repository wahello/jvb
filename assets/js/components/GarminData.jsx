import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import fetchGarminData  from '../network/garminOperations';
import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3});


var CalendarWidget = require('react-calendar-widget');
var ReactDOM = require('react-dom');

class GarminDataPage extends Component {

  getEpoch(dateObj=null){

    if(!dateObj)
      var dateObj = new Date()
    
    const d = dateObj.getDate();
    const m = dateObj.getMonth();
    const y = dateObj.getFullYear();

    dateObj = new Date(y,m,d,0,0,0);
    // dividing by 1000 to convert into seconds
    return dateObj.getTime()/1000;
  }

  constructor(props) {
    super(props);
    this.processDate = this.processDate.bind(this);
    this.state = {
        raw_output: '',
        selectedDateEpoch: this.getEpoch(),
       garmin_health_api: {
       activity_name:'Running',
       activity_type:'Running',
       event_type:'course',
       course:'nothing',
       location:'nothing',
       start:'nothing',
       time:'sample',
       distance:'sample',
       lap_information:'sample',
       elevation_gain:'sample',
       elevation_loss:'sample',
       average_speed:'nothing',
       max_speed:'nothing',
       average_power:'sample',
       max_power:'sample',
       avg_run_cadence:'nothing',
       max_run_cadence:'nothing',
       avg_bike_cadence:'nothing',
       max_bike_cadence:'nothing',
       steps_from_activity:'nothing',
       calories:'000',
       sum_strokes:'000',
       avg_strokes:'00',
       min_strokes:'000',
       avg_swolf:'000',
       best_swolf:'0',
       training_effect:'nothing',
       normalized_power:'nothing',
       balance_left:'0',
       balance_right:'0',
       tss:'nothing',
       max_avg_power:'0',
       avg_temperature:'0',
       min_temperature:'0',
       max_temperature:'0',
       min_elev:'0' ,
       max_elev:'0',
       moving_time:'nothing',
       elapsed_time:'0',
       avg_moving_pace:'0', 
       avg_stride_length:'0',
       avg_vertical_ratio:'0', 
       avg_vertical_oscillation:'0', 
       avg_gct_balance:'0' ,
       average_ground_contact_time: 'nothing',
       total_steps:'230',
       excersice_steps:'200',
       floors_climbed:'2',
       floors_descended:'23',
       calories_in_out:'0',
       golf_starts:'nothing',
       weight:'0',
       body_mass:'0',
       bmi:'0',
       body_composition_summary:'0',
       resting_heart_rate:'0',
       average_resting_heart_rate:'0',
       max_heart_rate:'0',
       resting_heart_rate_over_time:'0',
       VO2_max_grab_data_and_populate_database:'0',
       intensity_minutes:'0',
       heart_rate_variability_stress:'0',
       training_status: 'nothing',
       data_from_my_fitness_pal:'nothing',
       data_from_withings:'nothing',
       data_from_other_third_party_source:'0',
       total_sleep:'0',
       light_sleep:'0',
       deep_sleep:'0',
       bed_time:'0',
       sleep_awake_aime:'0',
       stress_field:'0',
      }
   }
 }
  processDate(date){

    //processing date logic
    this.setState({
      selectedDateEpoch: this.getEpoch(date)
    })

    const URL = '/users/garmin/fetch';
    const config = {
      method: "get",
      url: URL,
      params: {
          start_date: this.state.selectedDateEpoch
        },
      
    };
    axios(config).then( function(response){
      this.updateState(response);
    }.bind(this)).catch((error) => {
      // errorCallback(error);
      console.log(error.message);
    });
  }

  updateState(data){

    this.setState({raw_output: data,
      garmin_health_api: {
        activity_name:data.data.garmin_health_api.activity_name,
        activity_type:data.data.garmin_health_api.activity_type,
        event_type:data.data.garmin_health_api.event_type,
        course:data.data.garmin_health_api.course,
        location:data.data.garmin_health_api.location,
        start:data.data.garmin_health_api.start,
        time:data.data.garmin_health_api.time,
        distance:data.data.garmin_health_api.distance,
        lap_information:data.data.garmin_health_api.lap_information,
        elevation_gain:data.data.garmin_health_api.elevation_gain,
        elevation_loss:data.data.garmin_health_api.elevation_loss,
        average_speed:data.data.garmin_health_api.average_speed,
        max_speed:data.data.garmin_health_api.max_speed,
        average_power:data.data.garmin_health_api.average_power,
        max_power:data.data.garmin_health_api.max_power,
        avg_run_cadence:data.data.garmin_health_api.avg_run_cadence,
        max_run_cadence:data.data.garmin_health_api.max_run_cadence,
        avg_bike_cadence:data.data.garmin_health_api.avg_bike_cadence,
        max_bike_cadence:data.data.garmin_health_api.max_bike_cadence,
        steps_from_activity:data.data.garmin_health_api.steps_from_activity,
        calories:data.data.garmin_health_api.calories,
        sum_strokes:data.data.garmin_health_api.sum_strokes,
        avg_strokes:data.data.garmin_health_api.avg_strokes,
        min_strokes:data.data.garmin_health_api.min_strokes,
        avg_swolf:data.data.garmin_health_api.avg_swolf,
        best_swolf:data.data.garmin_health_api.best_swolf,
        training_effect:data.data.garmin_health_api.training_effect,
        normalized_power:data.data.garmin_health_api.normalized_power,
        balance_left:data.data.garmin_health_api.balance_left,
        balance_right:data.data.garmin_health_api.balance_right,
        tss:data.data.garmin_health_api.tss,
        max_avg_power:data.data.garmin_health_api.max_avg_power,
        avg_temperature:data.data.garmin_health_api.avg_temperature,
        min_temperature:data.data.garmin_health_api.min_temperature,
        max_temperature:data.data.garmin_health_api.max_temperature,
        min_elev:data.data.garmin_health_api.min_elev,
        max_elev:data.data.garmin_health_api.max_elev,
        moving_time:data.data.garmin_health_api.moving_time,
        elapsed_time:data.data.garmin_health_api.elapsed_time,
        avg_moving_pace:data.data.garmin_health_api.avg_moving_pace,
        avg_stride_length:data.data.garmin_health_api.avg_stride_length,
        avg_vertical_ratio:data.data.garmin_health_api.avg_vertical_ratio,
        avg_vertical_oscillation:data.data.garmin_health_api.avg_vertical_oscillation,
        avg_gct_balance:data.data.garmin_health_api.avg_gct_balance,
        average_ground_contact_time: data.data.garmin_health_api.average_ground_contact_time,
        total_steps:data.data.garmin_health_api.total_steps,
        excersice_steps:data.data.garmin_health_api.excersice_steps,
        floors_climbed:data.data.garmin_health_api.floors_climbed,
        floors_descended:data.data.garmin_health_api.floors_descended,
        calories_in_out:data.data.garmin_health_api.calories_in_out,
        golf_starts:data.data.garmin_health_api.golf_starts,
        weight:data.data.garmin_health_api.weight,
        body_mass:data.data.garmin_health_api.body_mass,
        bmi:data.data.garmin_health_api.bmi,
        body_composition_summary:data.data.garmin_health_api.body_composition_summary,
        resting_heart_rate:data.data.garmin_health_api.resting_heart_rate,
        average_resting_heart_rate:data.data.garmin_health_api.average_resting_heart_rate,
        max_heart_rate:data.data.garmin_health_api.max_heart_rate,
        resting_heart_rate_over_time:data.data.garmin_health_api.resting_heart_rate_over_time,
        VO2_max_grab_data_and_populate_database:data.data.garmin_health_api.VO2_max_grab_data_and_populate_database,
        intensity_minutes:data.data.garmin_health_api.intensity_minutes,
        heart_rate_variability_stress:data.data.garmin_health_api.heart_rate_variability_stress,
        training_status:data.data.garmin_health_api.training_status,
        data_from_my_fitness_pal:data.data.garmin_health_api.data_from_my_fitness_pal,
        data_from_withings:data.data.garmin_health_api.data_from_withings,
        data_from_other_third_party_source:data.data.garmin_health_api.data_from_other_third_party_source,
        total_sleep:data.data.garmin_health_api.total_sleep,
        light_sleep:data.data.garmin_health_api.light_sleep,
        deep_sleep:data.data.garmin_health_api.deep_sleep,
        bed_time:data.data.garmin_health_api.bed_time,
        sleep_awake_aime:data.data.garmin_health_api.sleep_awake_aime,
        stress_field:data.data.garmin_health_api.stress_field,


      }});
  }



  componentDidMount(){
    const URL = '/users/garmin/fetch';
    const config = {
      method: "get",
      url: URL,
      params: {
          start_date: this.state.selectedDateEpoch
      },
    };
    axios(config).then( function(response){
      this.updateState(response);
    }.bind(this)).catch((error) => {
      // errorCallback(error);
      console.log(error.message);
    });
  }


  render(){
    let handleSubmit = this.props.handleSubmit;
	// const { handleSubmit, onSubmit } = this.props;

	return(
    <div>
		<form onSubmit={handleSubmit} className = "container" >
    <div>
				<div className="row">
          <div className="col-sm-3">
            <div className="row">
            <CalendarWidget onDaySelect={this.processDate}/>,
            </div>
          </div>
          <div className="col-sm-6">
          <h3>From Garmin Connect API</h3>
          <div className="row">
          </div>
          <div className="row">
          <label>Activity Name :</label>
            {this.state.garmin_health_api.activity_name}
          </div>
          <div className="row">
          <label >Activity Type :</label>
            {this.state.garmin_health_api.activity_type}
          </div>
          <div className="row">
          <label>Event Type :</label>
            {this.state.garmin_health_api.event_type}
          </div>
          <div className="row">
          <label>Course :</label>
            {this.state.garmin_health_api.course}
          </div>
          <div className="row">
          <label>Location :</label>
            {this.state.garmin_health_api.location}
          </div>
          <div className="row">
          <label>Start :</label>
            {this.state.garmin_health_api.start}
          </div>
          <div className="row">
          <label>Time :</label>
            {this.state.garmin_health_api.time}
          </div>
          <div className="row">
          <label>Distance :</label>
            {this.state.garmin_health_api.distance}
          </div>
          <div className="row">
          <label>Lap Information :</label>
            {this.state.garmin_health_api.lap_information}
          </div>
          <div className="row">
          <label>Elevation Gain :</label>
            {this.state.garmin_health_api.elevation_gain}
          </div>
          <div className="row">
          <label>Elevation Loss :</label>
            {this.state.garmin_health_api.elevation_loss}
          </div>
          <div className="row">
          <label>Average Speed :</label>
            {this.state.garmin_health_api.average_speed}
          </div>
          <div className="row">
          <label>Max Speed :</label>
            {this.state.garmin_health_api.max_speed}
          </div>
          <div className="row">
          <label>Average Hr :</label>
            {this.state.garmin_health_api.avg_hr}
          </div>
          <div className="row">
          <label>Maximum Hr :</label>
              {this.state.garmin_health_api.max_hr}
          </div>
          <div className="row">
          <label>Average Power :</label>
              {this.state.garmin_health_api.average_power}
          </div>
          <div className="row">
          <label>Maximum Power :</label>
            {this.state.garmin_health_api.maximum_power}
          </div>
          <div className="row">
          <label>Average Run Cadence :</label>
            {this.state.garmin_health_api.avg_run_cadence}
          </div>
          <div className="row">
          <label>Maximum Run Cadence :</label>
            {this.state.garmin_health_api.max_run_cadence}
          </div>
          <div className="row">
          <label>Average Bike Cadence :</label>
            {this.state.garmin_health_api.avg_bike_cadence}
          </div>
          <div className="row">
          <label>Maximum Bike Cadence :</label>
            {this.state.garmin_health_api.max_bike_cadence}
          </div>
          <div className="row">
          <label>Steps from Activity :</label>
            {this.state.garmin_health_api.steps_from_activity}
          </div>
          <div className="row">
          <label>Calories :</label>
            {this.state.garmin_health_api.calories}
          </div>
          <div className="row">
          <label>Sum Strokes :</label>
            {this.state.garmin_health_api.sum_strokes}
          </div>
          <div className="row">
          <label>Average Strokes :</label>
            {this.state.garmin_health_api.avg_strokes}
          </div>
          <div className="row">
          <label>Average Swolf :</label>
            {this.state.garmin_health_api.avg_swolf}
          </div>
          <div className="row">
          <label>Best Swolf :</label>
            {this.state.garmin_health_api.best_swolf}
          </div>
          <div className="row">
          <label>Training Effect :</label>
            {this.state.garmin_health_api.training_effect}
          </div>
          <div className="row">
          <label>Normalized Power :</label>
            {this.state.garmin_health_api.normalized_power}
          </div>
          <div className="row">
          <label>Balance Left(%) :</label>
            {this.state.garmin_health_api.balance_left}
          </div>
          <div className="row">
          <label>Balance Right(%) :</label>
            {this.state.garmin_health_api.balance_right}
          </div>
          <div className="row">
          <label>TSS :</label>
            {this.state.garmin_health_api.tss}
          </div>
          <div className="row">
          <label>Max Average Power(20min) :</label>
            {this.state.garmin_health_api.max_avg_power}
          </div>
          <div className="row">
          <label>Average Temparature :</label>
            {this.state.garmin_health_api.avg_temperature}
          </div>
          <div className="row">
          <label>Minimum Temparature :</label>
            {this.state.garmin_health_api.min_temperature}
          </div>
          <div className="row">
          <label>Maximum Temparature :</label>
            {this.state.garmin_health_api.max_temperature}
          </div>
          <div className="row">
          <label>Minimum Elev :</label>
            {this.state.garmin_health_api.min_elev}
          </div>
          <div className="row">
          <label>Maximum Elev :</label>
            {this.state.garmin_health_api.max_elev}
          </div>
          <div className="row">
          <label>Moving Time :</label>
            {this.state.garmin_health_api.moving_time}
          </div>
          <div className="row">
          <label>Elapsed Time :</label>
            {this.state.garmin_health_api.elapsed_time}
          </div>
          <div className="row">
          <label>Average Moving Pace :</label>
            {this.state.garmin_health_api.avg_moving_pace}
          </div>
          <div className="row">
          <label>Average Stride Length :</label>
            {this.state.garmin_health_api.avg_stride_length}
          </div>
          <div className="row">
          <label>Average Vertical Ratio :</label>
            {this.state.garmin_health_api.avg_vertical_ratio}
		      </div>
          <div className="row">
          <label>Average Vertical Oscillation :</label>
            {this.state.garmin_health_api.avg_vertical_oscillation}
          </div>
          <div className="row">
          <label>Average gct Balance :</label>
            {this.state.garmin_health_api.avg_gct_balance}
          </div>
          <div className="row">
          <label>Average Ground Contact Time:</label>
             {this.state.garmin_health_api.average_ground_contact_time}
          </div>
          <div className="row">
          <label>Average Ground Contact Time:</label>
               <h3>Garmin Health API</h3>
          </div>
          <div className="row">
          <label>Total Steps :</label>
            {this.state.garmin_health_api.total_steps}
          </div>
          <div className="row">
          <label>Floor Climbed :</label>
            {this.state.garmin_health_api.floor_climbed}
          </div>
          <div className="row">
          <label>Floors Descended :</label>
            {this.state.garmin_health_api.floors_descended}
          </div>
          <div className="row">
          <label>Calories In/Out :</label>
            {this.state.garmin_health_api.calories_in_out}
          </div>
          <div className="row">
          <label>Golf Stats :</label>
            {this.state.garmin_health_api.golf_starts}
          </div>
          <div className="row">
          <label>Weight :</label>
            {this.state.garmin_health_api.weight}
          </div>
          <div className="row">
          <label>Body Mass :</label>
            {this.state.garmin_health_api.body_mass}
          </div>
          <div className="row">
          <label>BMI :</label>
            {this.state.garmin_health_api.bmi}
          </div>
          <div className="row">
          <label>Body Composition Summary :</label>
            {this.state.garmin_health_api.body_composition_summary}
          </div>
          <div className="row">
          <label>Resting Heart Rate:</label>
            {this.state.garmin_health_api.resting_heart_rate}
          </div>
          <div className="row">
          <label>Average Resting Heart Rate:</label>
            {this.state.garmin_health_api.average_resting_heart_rate}
          </div>
          <div className="row">
          <label>Max Heart Rate :</label>
            {this.state.garmin_health_api.max_heart_rate}
          </div>
          <div className="row">
          <label>Resting Heart Rate Trends Over Time:</label>
            {this.state.garmin_health_api.resting_heart_rate_over_time}
          </div>
          <div className="row">
          <label>VO2 Max Grab Data and Populate Database:</label>
            {this.state.garmin_health_api.VO2_max_grab_data_and_populate_database}
		      </div>
          <div className="row">
          <label>Intensity Minutes:</label>
            {this.state.garmin_health_api.intensity_minutes}
          </div>
          <div className="row">
          <label>Heart Rate Variability Stress:</label>
            {this.state.garmin_health_api.heart_rate_variability_stress}
          </div>
          <div className="row">
          <label>Training Status:</label>
            {this.state.garmin_health_api.training_status}
          </div>
          <div className="row">
          <label>Data From My Fitness Pal:</label>
            {this.state.garmin_health_api.data_from_my_fitness_pal}
          </div>
          <div className="row">
          <label>Data From Withings:</label>
            {this.state.garmin_health_api.data_from_withings}
          </div>
          <div className="row">
          <label>Data From Other Third Party Source:</label>
            {this.state.garmin_health_api.data_from_other_third_party_source}
          </div>
          <div className="row">
          <label>Total Sleep:</label>
            {this.state.garmin_health_api.total_sleep}
          </div>
          <div className="row">
          <label>Light Sleep:</label>
            {this.state.garmin_health_api.light_sleep}
          </div>
          <div className="row">
          <label>Deep Sleep:</label>
              {this.state.garmin_health_api.deep_sleep}
          </div>
          <div className="row">
          <label>Bed Time:</label>
            {this.state.garmin_health_api.bed_time}
          </div>
          <div className="row">
          <label>Sleep Awake Time:</label>
            {this.state.garmin_health_api.sleep_awake_time}
          </div>
          <div className="row">
          <label>Stress Field:</label>
              {this.state.garmin_health_api.stress_field}

          </div>
          </div>
          <div className="col-sm-3">
          </div>
        </div>
      </div>
    </form>
    <p><pre>{JSON.stringify(this.state, null, 2)}</pre></p>
    </div>
    );
  }
}
export default reduxForm({
    form: 'data to pull from garmin'
  })(
    connect(undefined, {fetchGarminData})(GarminDataPage)
  );
