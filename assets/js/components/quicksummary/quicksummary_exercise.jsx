import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Button} from "reactstrap";
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import Dimensions from 'react-dimensions';
import { StyleSheet, css } from 'aphrodite';


const attrVerboseName = {
    workout_easy_hard: 'Workout Easy Hard',
    workout_type: 'Workout Type',
    workout_time: 'Workout Time',
    workout_location: 'Workout Location',
    workout_duration: 'Workout Duration (hh:mm:ss)',
    maximum_elevation_workout: 'Maximum Elevation Workout',
    minutes_walked_before_workout: 'Minutes Walked Before Workout',
    distance_run: 'Distance (In Miles) - Run', 
    distance_bike: 'Distance (in Miles) - Bike', 
    distance_swim: 'Distance (in yards) - Swim', 
    distance_other: 'Distance (in Miles) - Other',  
    pace: 'Pace (minutes:seconds) (Running)',
    avg_heartrate: 'Average Heartrate',
    avg_exercise_heartrate:'Overall Average Exercise Heart Rate',
    avg_non_strength_heartrate: 'Avg HR Non Strength Activities',
    elevation_gain: 'Elevation Gain(feet)',
    elevation_loss: 'Elevation Loss(feet)',  
    effort_level: 'Effort Level',
    dew_point: 'Dew Point (in °F)',
    temperature: 'Temperature (in °F)',
    humidity: 'Humidity (in %)',  
    temperature_feels_like: 'Temperature Feels Like (in °F)',
    wind: 'Wind (in miles per hour)',
    hrr_time_to_99: 'HRR - Time to 99 (mm:ss)',
    hrr_starting_point: 'HRR Starting Point',
    lowest_hr_during_hrr:'HRR (lowest heart rate point) in 1st min', 
    hrr_beats_lowered_first_minute: 'HRR - Beats Lowered in First Minute',
    resting_hr_last_night: 'Resting HR Last Night',
    vo2_max: 'Vo2 Max',
    running_cadence: 'Running Cadence',
    nose_breath_prcnt_workout: 'Percent Breath through Nose During Workout',
    water_consumed_workout: 'Water Consumed during Workout',
    chia_seeds_consumed_workout: 'Chia Seeds consumed during Workout',
    fast_before_workout: 'Fast Before Workout', 
    pain: 'Pain',
    pain_area: 'Pain Area',
    stress_level: 'Stress Level',
    sick: 'Sick ', 
    drug_consumed: 'Drug Consumed',
    drug: 'Drug',
    medication: 'Medication',
    smoke_substance: 'Smoke Substance', 
    exercise_fifteen_more: 'Exercise Fifteen More',
    workout_elapsed_time: 'Workout Elapsed Time',
    timewatch_paused_workout: 'TimeWatch Paused Workout',
    exercise_consistency: 'Exercise Consistency',
    heartrate_variability_stress: 'Garmin Stress Level',
    fitness_age: 'Fitness Age',
    workout_comment: 'Workout Comments'                    
}

class Exercise extends Component {
constructor(props){
	super(props);
	 this.renderTableColumns = this.renderTableColumns.bind(this);
     this.getDayWithDate = this.getDayWithDate.bind(this);
     this.renderLastSync = this.renderLastSync.bind(this);

     let cols = this.renderTableColumns(props.data,"exercise_reporting_ql");
	 this.state = {
      tableAttrColumn: cols[1],
      columns:cols[0]
    };
  }
componentWillReceiveProps(nextProps){
    let cols = this.renderTableColumns(nextProps.data,"exercise_reporting_ql");
     this.state = {
      tableAttrColumn: cols[1],
      columns:cols[0]
    };
}

isEmpty(obj){
    return Object.keys(obj).length === 0 && obj.constructor === Object
}

toFahrenheit(tempInCelcius){
    return (tempInCelcius * 1.8) + 32;
}
getDayWithDate(date){
   let d = moment(date,'M-D-YY');
   let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
   let dayName = days[d.day()] ;
   return date +"\n"+ dayName;
  }
  renderLastSync(value){
    let time;
    if(value != null){
      time = moment(value).format("MMM DD, YYYY @ hh:mm a")
    }
    return <div style = {{fontSize:"13px"}}>Synced at {time}</div>;
}
renderTableColumns(dateWiseData,category,classes=""){
	let columns = [];
    let avgHrKeys =  [];
    let keys = [];
    let pushKeytoggle = true;

    for(let [date,data] of Object.entries(dateWiseData)){
        let avg_heartrate = data[category]['avg_heartrate'];
        if(!this.isEmpty(JSON.parse(avg_heartrate))){
            let avgHrJson = JSON.parse(avg_heartrate);
            for(let act of Object.keys(avgHrJson).sort()){
                if (avgHrJson[act] != 0){
                    if(avgHrKeys.indexOf(act) < 0)
                        avgHrKeys.push(act);
                }
            }
        }
    }

	for(let [date,data] of Object.entries(dateWiseData)){
        let all_data = [];
        for(let [key,value] of Object.entries(data[category])){
            if(key == 'avg_heartrate' && !this.isEmpty(JSON.parse(value))){
                let avgHrJson = JSON.parse(value);
                for(let act of avgHrKeys)
                    all_data.push(avgHrJson[act]);
            }
            else if (key == 'avg_heartrate' && this.isEmpty(JSON.parse(value))){
                for(let act of avgHrKeys)
                    all_data.push('-');
            }
            else if ((key == 'dew_point' && value === null) ||
                     (key == 'temperature' && value === null) ||
                     (key == 'humidity' && value === null)||
                     (key == 'temperature_feels_like' && value === null) ||
                     (key == 'wind' && value === null)){
                all_data.push('Not Reported');
            }
            else if((key == 'dew_point' && (value && value != '-')) ||
                    (key == 'temperature' && (value && value != '-'))||
                    (key == 'temperature_feels_like' && (value && value != '-'))){
                all_data.push(value);
            }
            else if(key == "workout_duration"){
                if(value == "0:00:00")
                    all_data.push("No Workout");
                else
                    all_data.push(value);
            }
            else if(key == "effort_level"){
                if(value == 0)
                    all_data.push("No Workout");
                else
                    all_data.push(value);
            }
            else if(key == "vo2_max"){
                if(value == 0)
                    all_data.push("Not Provided");
                else
                    all_data.push(value);
            }
            else if(key == 'workout_duration' && value && (value != '-' && value != '')){
                let hms = value.split(':');
                let time_str = `${hms[0]} : ${hms[1]} : ${hms[2]} `;
                all_data.push(time_str);
            }
            else if(key == "hrr_time_to_99"){
                if(value == "" || value == undefined || value == "0:0"){
                    all_data.push("Not Recorded")
                }
                else{
                    all_data.push(value);
                }
            }
            else if(key == "hrr_starting_point"){
                if(value == "" || value == undefined || value == 0){
                    all_data.push("Not Recorded")
                }
                else{
                    all_data.push(value);
                }
            }
             else if(key == "hrr_beats_lowered_first_minute"){
                if(value == "" || value == undefined || value == 0){
                    all_data.push("Not Recorded")
                }
                else{
                    all_data.push(value);
                }
            }
            else if(key == "lowest_hr_during_hrr"){
                if(value == "" || value == undefined || value == 0){
                    all_data.push("Not Recorded")
                }
                else{
                    all_data.push(value);
                }
            }
            else if(key == "avg_exercise_heartrate" || key == "avg_non_strength_heartrate"){
                if(value == "" || value == undefined || value == 0){
                    all_data.push("")
                }
                else{
                    all_data.push(value);
                }
            }
            else
                all_data.push(value);

            if(pushKeytoggle)
                keys.push(key);

        }

		columns.push(
			<Column 
				header={<Cell className={css(styles.newTableHeader)}>{this.getDayWithDate(date)}</Cell>}
		        cell={props => (
			            <Cell {...{'title':all_data[props.rowIndex]}}  {...props} className={css(styles.newTableBody)}>
			              {all_data[props.rowIndex]}
			            </Cell>
			          )}
		        width={170}
			/>
		);
        pushKeytoggle = false;
	}
    let tableAttrColumn = [];
    for(let key of keys){
        if(key == "avg_heartrate"){
            for(let act of avgHrKeys){
                let label = {name:attrVerboseName[key]+" "+act}
                tableAttrColumn.push(label);
            }
        }
        else{
            let label = {name:attrVerboseName[key]};
            tableAttrColumn.push(label);
        }
    }
	return [columns,tableAttrColumn];
}	

	render(){
        const {height, width, containerHeight, containerWidth, ...props} = this.props;
		let rowsCount = this.state.tableAttrColumn.length;

		return(
			<div 
            >
			 <Table
		        rowsCount={rowsCount}
		        rowHeight={50}
		        headerHeight={50}
		         width={containerWidth}
                height={containerHeight}
                touchScrollEnabled={true}
                {...props}>
		        <Column
		          header={<Cell className={css(styles.newTableHeader)}>Exercise Reporting</Cell>}
		          cell={props => (
		            <Cell {...{'title':this.state.tableAttrColumn[props.rowIndex].name}} {...props} className={css(styles.newTableBody)}>
		              {this.state.tableAttrColumn[props.rowIndex].name}
		            </Cell>
		          )}
		          width={167}
		          fixed={true}
		        />
			    {this.state.columns}
      		</Table>
			</div>

			);
	}
}

const styles = StyleSheet.create({
  newTableHeader: {
    textAlign:'center',
    color: '#111111',  
    border: 'none',
    fontFamily:'Proxima-Nova',
    fontStyle:'normal'
  },
  newTableBody:{
    textAlign:'center',
    color: '#5e5e5e',
    fontSize: '16px', 
    border: 'none',
    fontFamily:'Proxima-Nova',
    fontStyle:'normal'
  }
});


export default Dimensions({
  getHeight: function(element) {
    return window.innerHeight - 172;
  },
  getWidth: function(element) {
    var widthOffset = window.innerWidth < 1024 ? 0 : 3;
    return window.innerWidth - widthOffset;
  }
})(Exercise);