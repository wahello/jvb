import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import fetchGarminData  from '../network/garminOperations';
import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3}); 


var CalendarWidget = require('react-calendar-widget');
var ReactDOM = require('react-dom');
var setText = function (date) {
    // code for processing the JavaScript Date object
};


class GarminDataPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      raw_output: '',
      garmin_health_api: {
       average_ground_contact_time: 'nothing' 
      }
   }

  }

  updateState(data){

    this.setState({raw_output: data,
      garmin_health_api: {
        average_ground_contact_time: data.data.garmin_health_api.average_ground_contact_time
      }});
  }



  componentDidMount(){

    //    fetchGarminData(this.updateState).bind(this);

  const URL = 'users/garmin/fetch/';
  const config = {
    method: "get",
    url: URL
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
		<form onSubmit={handleSubmit} className = "container">
			<div>
      &nbsp;
      &nbsp;
				<div className="row">
          <div className="col-sm-3">
            <div className="row">
              <CalendarWidget onDaySelect={setText}/>,

            </div>

          </div>
          <div className="col-sm-6">
          <h3>From Garmin Connect API</h3>
          <div className="row">

          </div>
          <div className="row">
          <label>Activity Name :</label>
          <Field
              className ="form-control"
              name = "activityname"
              type = "text"
              placeholder = "activityname"
              component="input"
            />
          </div>
          <div className="row">
          <label >Activity Type :</label>
          <Field
              className ="form-control"
              name = "activitytype"
              type = "text"
              placeholder = "activity type"
              component="input"
            />
          </div>
          <div className="row">
          <label>Event Type :</label>
          <Field
              className ="form-control"
              name = "eventtype"
              type = "text"
              placeholder = "event type"
              component="input"
            />
          </div>
          <div className="row">
          <label>Course :</label>
          <Field
              className ="form-control"
              name = "course"
              type = "text"
              placeholder = "course"
              component="input"
            />
          </div>
          <div className="row">
          <label>Location :</label>
          <Field
              className ="form-control"
              name = "location"
              type = "text"
              placeholder = "Location"
              component="input"
            />
          </div>
          <div className="row">
          <label>Start :</label>
          <Field
              className ="form-control"
              name = "start"
              type = "text"
              placeholder = "start"
              component="input"
            />
          </div>
          <div className="row">
          <label>Time :</label>
          <Field
              className ="form-control"
              name = "time"
              type = "text"
              placeholder = "time"
              component="input"
            />
          </div>
          <div className="row">
          <label>Distance :</label>
          <Field
              className ="form-control"
              name = "distancet"
              type = "text"
              placeholder = "distance"
              component="input"
            />
          </div>
          <div className="row">
          <label>Lap Information :</label>
          <Field
              className ="form-control"
              name = "lapinformation"
              type = "text"
              placeholder = "lapinformation"
              component="input"
            />
          </div>
          <div className="row">
          <label>Elevation Gain :</label>
          <Field
              className ="form-control"
              name = "elevationgain"
              type = "text"
              placeholder = "elevationgain"
              component="input"
            />
          </div>
          <div className="row">
          <label>Elevation Loss :</label>
          <Field
              className ="form-control"
              name = "elevationloss"
              type = "text"
              placeholder = "elevationloss"
              component="input"
            />
          </div>
          <div className="row">
          <label>Average Speed :</label>
          <Field
              className ="form-control"
              name = "averagespeed"
              type = "text"
              placeholder = "averagespeed"
              component="input"
            />
          </div>
          <div className="row">
          <label>Max Speed :</label>
          <Field
              className ="form-control"
              name = "maxspeed"
              type = "text"
              placeholder = "maxspeed"
              component="input"
            />
          </div>
          <div className="row">
          <label>Max Speed :</label>
          <Field
              className ="form-control"
              name = "maxspeed"
              type = "text"
              placeholder = "maxspeed"
              component="input"
            />
          </div>
          <div className="row">
          <label>Average Hr :</label>
          <Field
              className ="form-control"
              name = "avghr"
              type = "text"
              placeholder = "averagehr"
              component="input"
            />
          </div>
          <div className="row">
          <label>Maximum Hr :</label>
          <Field
              className ="form-control"
              name = "maxhr"
              type = "text"
              placeholder = "maximumhr"
              component="input"
            />
          </div>
          <div className="row">
          <label>Average Power :</label>
          <Field
              className ="form-control"
              name = "avgpower"
              type = "text"
              placeholder = "averagepower"
              component="input"
            />
          </div>
          <div className="row">
          <label>Maximum Power :</label>
          <Field
              className ="form-control"
              name = "maxpower"
              type = "text"
              placeholder = "maximumpower"
              component="input"
            />
          </div>
          <div className="row">
          <label>Average Run Cadence :</label>
          <Field
              className ="form-control"
              name = "avgruncadence"
              type = "text"
              placeholder = "averageruncadence"
              component="input"
            />
          </div>
          <div className="row">
          <label>Maximum Run Cadence :</label>
          <Field
              className ="form-control"
              name = "maxruncadence"
              type = "text"
              placeholder = "maximumruncadence"
              component="input"
            />
          </div>
          <div className="row">
          <label>Average Bike Cadence :</label>
          <Field
              className ="form-control"
              name = "avgbikecadence"
              type = "text"
              placeholder = "averagebikecadence"
              component="input"
            />
          </div>
          <div className="row">
          <label>Maximum Bike Cadence :</label>
          <Field
              className ="form-control"
              name = "maxbikecadence"
              type = "text"
              placeholder = "maximumbikecadence"
              component="input"
            />
          </div>
          <div className="row">
          <label>Steps from Activity :</label>
          <Field
              className ="form-control"
              name = "stepsfromactivity"
              type = "text"
              placeholder = "stepsfromactivity"
              component="input"
            />
          </div>
          <div className="row">
          <label>Calories :</label>
          <Field
              className ="form-control"
              name = "calories"
              type = "text"
              placeholder = "calories"
              component="input"
            />
          </div>
          <div className="row">
          <label>Sum Strokes :</label>
          <Field
              className ="form-control"
              name = "sumstrokes"
              type = "text"
              placeholder = "sumstrokes"
              component="input"
            />
          </div>
          <div className="row">
          <label>Average Strokes :</label>
          <Field
              className ="form-control"
              name = "avgstrokes"
              type = "text"
              placeholder = "averagestrokes"
              component="input"
            />
          </div>
          <div className="row">
          <label>Average Swolf :</label>
          <Field
              className ="form-control"
              name = "avgswolf"
              type = "text"
              placeholder = "averageswolf"
              component="input"
            />
          </div>
          <div className="row">
          <label>Best Swolf :</label>
          <Field
              className ="form-control"
              name = "bestswolf"
              type = "text"
              placeholder = "bestswolf"
              component="input"
            />
          </div>
          <div className="row">
          <label>Training Effect :</label>
          <Field
              className ="form-control"
              name = "trainingeffect"
              type = "text"
              placeholder = "trainingeffect"
              component="input"
            />
          </div>
          <div className="row">
          <label>Normalized Power :</label>
          <Field
              className ="form-control"
              name = "normalizedpower"
              type = "text"
              placeholder = "normalizedpower"
              component="input"
            />
          </div>
          <div className="row">
          <label>Balance Left(%) :</label>
          <Field
              className ="form-control"
              name = "balanceleft"
              type = "text"
              placeholder = "balanceleft"
              component="input"
            />
          </div>
          <div className="row">
          <label>Balance Right(%) :</label>
          <Field
              className ="form-control"
              name = "balanceright"
              type = "text"
              placeholder = "balanceright"
              component="input"
            />
          </div>
          <div className="row">
          <label>TSS :</label>
          <Field
              className ="form-control"
              name = "tss"
              type = "text"
              placeholder = "tss"
              component="input"
            />
          </div>
          <div className="row">
          <label>Max Average Power(20min) :</label>
          <Field
              className ="form-control"
              name = "maxavgpower"
              type = "text"
              placeholder = "maxavgpower"
              component="input"
            />
          </div>
          <div className="row">
          <label>Average Temparature :</label>
          <Field
              className ="form-control"
              name = "avgtemp"
              type = "text"
              placeholder = "avgtemperature"
              component="input"
            />
          </div>
          <div className="row">
          <label>Minimum Temparature :</label>
          <Field
              className ="form-control"
              name = "mintemp"
              type = "text"
              placeholder = "mintemperature"
              component="input"
            />
          </div>
          <div className="row">
          <label>Maximum Temparature :</label>
          <Field
              className ="form-control"
              name = "maxtemp"
              type = "text"
              placeholder = "maxtemperature"
              component="input"
            />
          </div>
          <div className="row">
          <label>Minimum Elev :</label>
          <Field
              className ="form-control"
              name = "minelev"
              type = "text"
              placeholder = "minelev"
              component="input"
            />
          </div>
          <div className="row">
          <label>Maximum Elev :</label>
          <Field
              className ="form-control"
              name = "maxelev"
              type = "text"
              placeholder = "maxelev"
              component="input"
            />
          </div>
          <div className="row">
          <label>Moving Time :</label>
          <Field
              className ="form-control"
              name = "movingtime"
              type = "text"
              placeholder = "movingtime"
              component="input"
            />
          </div>
          <div className="row">
          <label>Elapsed Time :</label>
          <Field
              className ="form-control"
              name = "elapsedtime"
              type = "text"
              placeholder = "maxtemperature"
              component="input"
            />
          </div>
          <div className="row">
          <label>Average Moving Pace :</label>
          <Field
              className ="form-control"
              name = "avgmovingpace"
              type = "text"
              placeholder = "avgmovingpace"
              component="input"
            />
          </div>
          <div className="row">
          <label>Average Stride Length :</label>
          <Field
              className ="form-control"
              name = "avgstridelength"
              type = "text"
              placeholder = "avgstridelength"
              component="input"
            />
          </div>
          <div className="row">
          <label>Average Vertical Ratio :</label>
          <Field
              className ="form-control"
              name = "avgverticalratio"
              type = "text"
              placeholder = "avgverticalratio"
              component="input"
            />
          </div>
          <div className="row">
          <label>Average Vertical Oscillation :</label>
          <Field
              className ="form-control"
              name = "avgverticaloscillation"
              type = "text"
              placeholder = "avgverticaloscillation"
              component="input"
            />
          </div>
          <div className="row">
          <label>Average gct Balance :</label>
          <Field
              className ="form-control"
              name = "avggctbalance"
              type = "text"
              placeholder = "avggctbalance"
              component="input"
            />
          </div>
          <div className="row">
          <label>Average Ground Contact Time:</label>
             {this.state.garmin_health_api.average_ground_contact_time}
          </div>
          &nbsp;
          &nbsp;
          <h3>Garmin Health API</h3>
          &nbsp;
          &nbsp;
          <div className="row">
          <label>Average Ground Contact Time :
          </label>
          <Field
              className ="form-control"
              name = "avggroundcontacttime"
              type = "text"
              placeholder = "avggroundcontacttime"
              component="input"
            />
          </div>
          <div className="row">
          <label>Total Steps :</label>
          <Field
              className ="form-control"
              name = "totalsteps"
              type = "text"
              placeholder = "provided every 15mins"
              component="input"
            />
          </div>
          <div className="row">
          <label>Floor Climbed :</label>
          <Field
              className ="form-control"
              name = "floorclimbed"
              type = "text"
              placeholder = "floorclimbed"
              component="input"
            />
          </div>
          <div className="row">
          <label>Foors Descended :</label>
          <Field
              className ="form-control"
              name = "foorsdescended"
              type = "text"
              placeholder = "foorsdescended"
              component="input"
            />
          </div>
          <div className="row">
          <label>Calories In/Out :</label>
          <Field
              className ="form-control"
              name = "caloriesin/out"
              type = "text"
              placeholder = "calories in/out"
              component="input"
            />
          </div>
          <div className="row">
          <label>Golf Stats :</label>
          <Field
              className ="form-control"
              name = "golfstats"
              type = "text"
              placeholder = "golfstats"
              component="input"
            />
          </div>
          <div className="row">
          <label>Weight :</label>
          <Field
              className ="form-control"
              name = "weight"
              type = "text"
              placeholder = "weight"
              component="input"
            />
          </div>
          <div className="row">
          <label>Body Mass :</label>
          <Field
              className ="form-control"
              name = "bodymass"
              type = "text"
              placeholder = "bodymass"
              component="input"
            />
          </div>
          <div className="row">
          <label>BMI :</label>
          <Field
              className ="form-control"
              name = "bmi"
              type = "text"
              placeholder = "bmi"
              component="input"
            />
          </div>
          <div className="row">
          <label>Body Composition Summary :</label>
          <Field
              className ="form-control"
              name = "bodycompositionsummary"
              type = "text"
              placeholder = "bodycompositionsummary"
              component="input"
            />
          </div>
          <div className="row">
          <label>Resting Heart Rate:</label>
          <Field
              className ="form-control"
              name = "restingheartrate"
              type = "text"
              placeholder = "restingheartrate"
              component="input"
            />
          </div>
          <div className="row">
          <label>Average Resting Heart Rate:</label>
          <Field
              className ="form-control"
              name = "avgrestingheartrate"
              type = "text"
              placeholder = "avgrestingheartrate"
              component="input"
            />
          </div>
          <div className="row">
          <label>Max Heart Rate :</label>
          <Field
              className ="form-control"
              name = "maxheartrate"
              type = "text"
              placeholder = "maxheartrate"
              component="input"
            />
          </div>
          <div className="row">
          <label>Resting Heart Rate Trends Over Time:</label>
          <Field
              className ="form-control"
              name = "restingheartratetrendsovertime"
              type = "text"
              placeholder = "restingheartratetrendsovertime"
              component="input"
            />
          </div>
          <div className="row">
          <label>VO2 Max Grab Data and Populate Database:</label>
          <Field
              className ="form-control"
              name = "vo2maxgrab"
              type = "text"
              placeholder = "vo2maxgrab"
              component="input"
            />
          </div>
          <div className="row">
          <label>Intensity Minutes:</label>
          <Field
              className ="form-control"
              name = "intensityminutes"
              type = "text"
              placeholder = "intensity minutes"
              component="input"
            />
          </div>
          <div className="row">
          <label>Heart Rate Variability Stress:</label>
          <Field
              className ="form-control"
              name = "heartratevariability"
              type = "text"
              placeholder = "heartratevariability"
              component="input"
            />
          </div>
          <div className="row">
          <label>Training Status:</label>
          <Field
              className ="form-control"
              name = "trainingstatus"
              type = "text"
              placeholder = "trainingstatus"
              component="input"
            />
          </div>
          <div className="row">
          <label>Data From My Fitness Pal:</label>
          <Field
              className ="form-control"
              name = "datafrommyfitnesspal"
              type = "text"
              placeholder = "datafrommyfitnesspal"
              component="input"
            />
          </div>
          <div className="row">
          <label>Data From Withings:</label>
          <Field
              className ="form-control"
              name = "datafromwithings"
              type = "text"
              placeholder = "datafromwithings"
              component="input"
            />
          </div>
          <div className="row">
          <label>Data From Other Third Party Source:</label>
          <Field
              className ="form-control"
              name = "datafromthirdparty"
              type = "text"
              placeholder = "datafromthirdparty"
              component="input"
            />
          </div>
          <div className="row">
          <label>Total Sleep:</label>
          <Field
              className ="form-control"
              name = "totalsleep"
              type = "text"
              placeholder = "totalsleep"
              component="input"
            />
          </div>
          <div className="row">
          <label>Light Sleep:</label>
          <Field
              className ="form-control"
              name = "lightsleep"
              type = "text"
              placeholder = "lightsleep"
              component="input"
            />
          </div>
          <div className="row">
          <label>Deep Sleep:</label>
          <Field
              className ="form-control"
              name = "deepsleep"
              type = "text"
              placeholder = "deepsleep"
              component="input"
            />
          </div>
          <div className="row">
          <label>Bed Time:</label>
          <Field
              className ="form-control"
              name = "bedtime"
              type = "text"
              placeholder = "bedtime"
              component="input"
            />
          </div>
          <div className="row">
          <label>Sleep Awake Time:</label>
          <Field
              className ="form-control"
              name = "sleepawaketime"
              type = "text"
              placeholder = "sleepawaketime"
              component="input"
            />
          </div>
          <div className="row">
          <label>Stress Field:</label>
          <Field
              className ="form-control"
              name = "stressfield"
              type = "text"
              placeholder = "stressfield"
              component="input"
            />
          </div>
        </div>
        <div className="col-sm-3"></div>
        </div>

      </div>
    </form>
    <p><pre>{JSON.stringify(this.state, null, 2)}</pre></p>
    </div>
  )



 }

}


export default reduxForm({
  form: 'data to pull from garmin'
})(
  connect(undefined, {fetchGarminData})(GarminDataPage)
);
