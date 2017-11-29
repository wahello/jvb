import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Button} from "reactstrap";
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import Dimensions from 'react-dimensions';


const attrVerboseName = {
    workout_easy_hard: 'Workout Easy Hard',
    workout_type: 'Workout Type',
    workout_time: 'Workout Time',
    workout_location: 'Workout Location',
    workout_duration: 'Workout Duration',
    maximum_elevation_workout: 'Maximum Elevation Workout',
    minutes_walked_before_workout: 'Minutes Walked Before Workout',
    distance_run: 'Distance (In Miles) - Run', 
    distance_bike: 'Distance (in Miles) - Bike', 
    distance_swim: 'Distance (in yards) - Swim', 
    distance_other: 'Distance (in Miles) - Other',  
    pace: 'Pace (minutes:seconds) (Running)',
    avg_heartrate: 'Average Heartrate',
    elevation_gain: 'Elevation Gain(feet)',
    elevation_loss: 'Elevation Loss(feet)',  
    effort_level: 'Effort Level',
    dew_point: 'Dew Point',
    temperature: 'Temperature',
    humidity: 'Humidity',  
    temperature_feels_like: 'Temperature Feels Like',
    wind: 'Wind',
    hrr: 'HRR',
    hrr_start_point: 'HRR Start Point',  
    hrr_beats_lowered: 'HRR Beats Lowered',
    sleep_resting_hr_last_night: 'Sleep Resting Hr Last Night',
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
    workout_duration_grade: 'Workout Duration Grade',
    workout_effortlvl_grade: 'Workout Effort Level Grade',
    avg_heartrate_grade: 'Avg Heart Rate Grade',
    overall_workout_grade: 'OverAll Workout Grade',
    heartrate_variability_stress: 'Heart Rate Variability Stress (Garmin)',
    fitness_age: 'Fitness Age',
    workout_comment: 'Workout Comment'                    
}

class Exercise extends Component {
constructor(props){
	super(props);
	 this.renderTableColumns = this.renderTableColumns.bind(this);

	 this.state = {
      tableAttrColumn: [{name: 'Workout Easy Hard'}]
    };
  }

isEmpty(obj){
    return Object.keys(obj).length === 0 && obj.constructor === Object
}

renderTableColumns(dateWiseData,category,classes=""){
		let columns = [];
        keys = [];
		for(let [date,data] of Object.entries(dateWiseData)){
            let all_data = [];
            for(let [key,value] of Object.entries(data[category])){
                if(key !== 'id' && key !== 'user_ql'){
                    if(key == 'avg_heartrate' && this.isEmpty(JSON.parse(value))){
                        // avg heart rate logic
                    }
                    else
                        all_data.push(value);
                    keys.push(key)
                }
            }

			columns.push(
				<Column 
					header={<Cell>{date}</Cell>}
			        cell={props => (
				            <Cell {...props}>
				              {all_data[props.rowIndex]}
				            </Cell>
				          )}
			        width={134}
				/>
			)
		}
		return columns;
	}	
	render(){
        const {height, width, containerHeight, containerWidth, ...props} = this.props;
		let rowsCount = this.state.tableAttrColumn.length;
		return(
			<div className="quick3"
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
		          header={<Cell>Exercise Reporting</Cell>}
		          cell={props => (
		            <Cell {...props}>
		              {this.state.myTableData[props.rowIndex].name}
		            </Cell>
		          )}
		          width={185}
		          fixed={true}
		        />
			    {this.renderTableColumns(this.props.data,"exercise_reporting_ql")}
      		</Table>
			</div>

			);
	}
}
export default Dimensions({
  getHeight: function(element) {
    return window.innerHeight - 260;
  },
  getWidth: function(element) {
    var widthOffset = window.innerWidth < 1024 ? 30 : 400;
    return window.innerWidth - widthOffset;
  }
})(Exercise);