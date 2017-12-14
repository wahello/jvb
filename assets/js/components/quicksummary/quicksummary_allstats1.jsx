import React, { Component } from 'react';
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
    dew_point: 'Dew Point (in °F)',
    temperature: 'Temperature (in °F)',
    humidity: 'Humidity (in %)',  
    temperature_feels_like: 'Temperature Feels Like (in °F)',
    wind: 'Wind (in miles per hour)',
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
    heartrate_variability_stress: 'Heart Rate Variability Stress (Garmin)',
    fitness_age: 'Fitness Age',
    workout_comment: 'Workout Comment',

    overall_health_grade: 'Overall Health Grade',
    overall_health_gpa: 'Overall Health Gpa',
    movement_non_exercise_steps_grade: 'Movement Non Exercise steps Grade',
    movement_consistency_grade: 'Movement Consistency Grade',
    avg_sleep_per_night_grade: 'Avg Sleep Per Night Grade',
    exercise_consistency_grade: 'Exercise Consistency Grade',
    overall_workout_grade: 'Overall Workout Grade',
    workout_duration_grade:'Workout Duration Grade',
    workout_effortlvl_grade:'Workout Effort Level Grade',
    avg_exercise_hr_grade:'Average Exercise Heartrate Grade',
    prcnt_unprocessed_food_consumed_grade: 'Percentage of Unprocessed Food Grade',
    alcoholic_drink_per_week_grade: 'Alcoholic Drink Per Week Grade',
    penalty: 'Penalty',

    sleep_per_wearable: 'Sleep per Wearable (excluding awake time)',
    sleep_per_user_input: 'Sleep Per User Input (excluding awake time)',
    sleep_aid: 'Sleep Aid',
    sleep_bed_time: 'Sleep Bed Time',
    sleep_awake_time: 'Sleep Awake Time',
    deep_sleep: 'Deep Sleep',
    light_sleep: 'Light Sleep',
    awake_time: 'Awake Time',

    non_exercise_steps: 'Non Exercise Steps',
    exercise_steps: 'Exercise Steps',
    total_steps: 'Total Steps',
    floor_climed: 'Floor Climed',
    floor_decended: 'Floor Decended',
    movement_consistency: 'Movement Consistency',

    avg_speed: 'Avg Speed (MPH) Bike',
    avg_power: 'Avg Power Bike',
    avg_speed_per_mile: 'Asvg Speed Per Mile',
    avg_cadence: 'Avg Cadence Bike',

    prcnt_non_processed_food: 'Percentage of Unprocessed Food',
    non_processed_food: 'Non Processed Food',
    diet_type: 'Diet Type',

    pace_per_100_yard: 'Pace per 100 yard',
    total_strokes: 'Total Strokes',

    alcohol_day: 'Alcohol Per Day',
    alcohol_week: 'Average Alcohol Consumed per Week', 
}

class AllStats1 extends Component{

	constructor(props) {
        super(props);
        this.renderTableColumns = this.renderTableColumns.bind(this);
        let cols = this.renderTableColumns(props.data);
        this.state = {
            columns:cols[0],
            tableAttrColumn: cols[1],
        };
    }

    componentWillReceiveProps(nextProps){
        let cols = this.renderTableColumns(nextProps.data);
         this.state = {
          columns:cols[0],
          tableAttrColumn: cols[1]
        };
    }

    isEmpty(obj){
        return Object.keys(obj).length === 0 && obj.constructor === Object
    }

    toFahrenheit(tempInCelcius){
        return (tempInCelcius * 1.8) + 32;
    }

 	renderTableColumns(dateWiseData,category=undefined,classes=""){
		let columns = [];
        let avgHrKeys =  [];
        let keys = [];
        let pushKeytoggle = true;

        for(let [date,data] of Object.entries(dateWiseData)){
            let avg_heartrate = data['exercise_reporting_ql']['avg_heartrate'];
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
			for(let cat of Object.keys(data).sort()){
				if (cat !== "created_at"){
					for(let key of Object.keys(data[cat]).sort()){
                        let value = data[cat][key];

                        if (key == 'movement_consistency'){
                            let mc = value;
                            if( mc != undefined && mc != "" && mc != "-"){
                                mc = JSON.parse(mc);
                                all_data.push(mc.inactive_hours);
                            }
                        }
                        else if(value !== '-' && value !== undefined && 
                           value !== "" && (key == 'deep_sleep' ||
                            key == 'light_sleep' || key == 'awake_time' ||
                            key == 'sleep_per_wearable')){
                            let hm = value.split(':');
                            let time_str = `${hm[0]} hour ${hm[1]} min`;
                            all_data.push(time_str);
                        }
                        else if(key == 'avg_heartrate' && !this.isEmpty(JSON.parse(value))){
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
                            all_data.push('No GPS data');
                        }
                        else if((key == 'dew_point' && (value && value != '-')) ||
                                (key == 'temperature' && (value && value != '-'))||
                                (key == 'temperature_feels_like' && (value && value != '-'))){
                            all_data.push(this.toFahrenheit(value).toFixed(2));
                        }
                        else{
							all_data.push(value);
                        }

                        if(pushKeytoggle)
                            keys.push(key);
					}
				}
			}
			columns.push(
				<Column 
                style={{wordWrap:"break-word"}}
					header={<Cell className={css(styles.newTableHeader)}>{date}</Cell>}
			        cell={props => (
				            <Cell {...props} className={css(styles.newTableBody)}>
				              {all_data[props.rowIndex]}
				            </Cell>
				          )}
			        width={200}


				/>
			);
            pushKeytoggle = false;
		}

        console.log(keys);
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
			<div>
			 <Table
		        rowsCount={rowsCount}
		        rowHeight={100}
		        headerHeight={50}
		        width={containerWidth}
        		maxHeight={containerHeight}
                touchScrollEnabled={true}
            
         
               
                {...props}>
		        <Column
                
		          header={<Cell className={css(styles.newTableHeader)}>All Stats</Cell>}
		          cell={props => (
		            <Cell {...props} className={css(styles.newTableBody)}>
		              {this.state.tableAttrColumn[props.rowIndex].name}

		            </Cell>
		          )}
		          width={200}
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
    color: '#111111',
    fontSize: '18px',   
    border: 'none',
    fontFamily:'Proxima-Nova',
    fontStyle:'normal'
  },
  newTableBody:{
    color: '#5e5e5e',
    fontSize: '16px', 
    border: 'none',
    fontFamily:'Proxima-Nova',
    fontStyle:'normal'
  }
});


export default Dimensions({
  getHeight: function(element) {
    return window.innerHeight - 158;
  },
  getWidth: function(element) {
    var widthOffset = window.innerWidth < 1024 ? 0 : 3;
    return window.innerWidth - widthOffset;
  }
})(AllStats1);
