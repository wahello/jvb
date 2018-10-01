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
    workout_comment: 'General Workout Comment',
    general_comment:'Genaral comment',

    overall_health_grade: 'Overall Health Grade',
    overall_health_gpa: 'Overall Health GPA',
    movement_non_exercise_steps_grade: 'Movement Non Exercise steps Grade',
    movement_non_exercise_steps: 'Movement Non Exercise steps',
    movement_consistency_grade: 'Movement Consistency Grade',
    movement_consistency_score: 'Movement Consistency Score',
    avg_sleep_per_night_grade: 'Avg Sleep Per Night Grade',
    avg_sleep_per_night: 'Avg Sleep Per Night',
    exercise_consistency_grade: 'Exercise Consistency Grade',
    workout_today: 'Did You Workout Today',
    exercise_consistency_score: 'Exercise Consistency Score',
    overall_workout_grade: 'Overall Workout Grade',
    workout_duration_grade:'Workout Duration Grade',
    workout_effortlvl_grade:'Workout Effort Level Grade',
    avg_exercise_hr_grade:'Average Exercise Heartrate Grade',
    prcnt_unprocessed_food_consumed_grade: '% Unprocessed Food Grade',
    prcnt_unprocessed_food_consumed: '% Unprocessed Food',
    alcoholic_drink_per_week_grade: 'Alcoholic Drink Per Week Grade',
    alcoholic_drink_per_week: 'Alcoholic Drink Per Week',
    sleep_aid_penalty:'Sleep Aid Penalty',
    ctrl_subs_penalty:'Controlled Substance Penalty',
    smoke_penalty:'Smoking Penalty',
    overall_health_gpa_before_panalty:'Overall Health GPA Before Penalties',
    submitted_user_input:'Did you Report your Inputs Today?',

    // resting_hr:'Resting Heart Rate',
    // stress_level:'Stress Level',
    // stand_three_hours:'Did you Stand for 3 hours or more above and beyond your exercise yesterday?', 

    // overall_workout_grade:'Overall Workout Grade ',
    // overall_workout_score:'Overall Workout Score (points)',
    // workout_duration_grade:'Workout Duration Grade',
    // workout_duration:'Workout Duration',
    // workout_effortlvl_grade:'Workout Effort Level Grade',
    // workout_effortlvl:'Workout Effort Level',
    // avg_exercise_hr_grade:'Average Exercise Heart Rate Grade',
    // avg_exercise_hr:'Average Exercise Heart Rate',
    // time_to_99:'Heart Rate Recovery (HRR) - time to 99',
    // lowest_hr_first_minute:'Heart Rate Recovery (HRR) - heart beats lowered in the first minute ',
    // vo2_max:'VO2 Max',
    // floor_climed:'Floors Climbed',   

    sleep_per_wearable: 'Sleep per Wearable (excluding awake time) (hh:mm)',
    sleep_comments:'Sleep Comments',
    sleep_per_user_input: 'Sleep Per User Input (excluding awake time) (hh:mm)',
    sleep_aid: 'Sleep Aid taken?',
    sleep_bed_time: 'Sleep Bed Time',
    sleep_awake_time: 'Sleep Awake Time',
    nap_comment:'Nap Comment',
    nap_duration:'Nap Duration (hh:mm)',
    nap_end_time:'Nap End Time (hh:mm)',
    nap_start_time:'Nap Start Time (hh:mm)',
    deep_sleep: 'Deep Sleep (hh:mm)',
    light_sleep: 'Light Sleep (hh:mm)',
    awake_time: 'Awake Time (hh:mm)',
    rem_sleep: 'REM Sleep (hh:mm)',
    resting_heart_rate: 'Resting Heart Rate (RHR)',

    non_exercise_steps: 'Non Exercise Steps',
    exercise_steps: 'Exercise Steps',
    total_steps: 'Total Steps',
    weight:'Weight',
    floor_climed: 'Floor Climed',
    movement_consistency: 'Movement Consistency',

    avg_speed: 'Avg Speed (MPH) Bike',
    avg_power: 'Avg Power Bike',
    avg_speed_per_mile: 'Asvg Speed Per Mile',
    avg_cadence: 'Avg Cadence Bike',
    
    prcnt_non_processed_food: '% Non Processed Food',
    non_processed_food: 'Non Processed Food',
    processed_food_consumed:'Processed Food Consumed',
    diet_type: 'Diet Type',

    pace_per_100_yard: 'Pace per 100 yard',
    total_strokes: 'Total Strokes',

    alcohol_day: '# of Alcohol Drinks Consumed Yesterday',
    alcohol_week: '# of Drinks Consumed Over the Last 7 Days',

    movement_non_exercise_steps_gpa: 'Non Exercise Steps Points',
    movement_consistency_points: 'Movement Consistency Points',
    avg_sleep_per_night_gpa: 'Avg Sleep Per Night Points',
    exercise_consistency_points: 'Exercise Consistency Points', 
    prcnt_unprocessed_food_consumed_gpa: '% of Unprocessed Food Consumed Points',
    alcoholic_drink_per_week_gpa: 'Alcohol Drinks Consumed Per Last 7 Days Points',
    sleep_aid_penalty_points: 'Sleep Aid Penalty Points',
    ctrl_subs_penalty_points: 'Controlled Substance Penalty Points',
    smoke_penalty_points: 'Smoking Penalty Points',
    total_points: 'Total Points',
}

class AllStats1 extends Component{

	constructor(props) {
        super(props);
        this.renderTableColumns = this.renderTableColumns.bind(this);
        this.getStylesGpaBeforePanalities = this.getStylesGpaBeforePanalities.bind(this);
        this.getStylesNonProcessedFood = this.getStylesNonProcessedFood.bind(this);
        this.getDayWithDate = this.getDayWithDate.bind(this);
        this.renderLastSync = this.renderLastSync.bind(this);

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
    renderLastSync(value){
      let time;
      if(value != null){
        time = moment(value).format("MMM DD, YYYY @ hh:mm a")
      }
      return <div style = {{fontSize:"13px"}}>Synced at {time}</div>;
    }
    getStylesGpaBeforePanalities(score){
      if (score<1)
        return {background:'red',color:'black'};
      else if (score >= 1 && score < 3)
        return {background:'yellow',color:'black'};
      else if (score >= 3)
        return {background:'green',color:'black'};
    }
    getStylesNonProcessedFood(score){
      if (score<50)
        return {background:'red',color:'black'};
      else if (score>=50 && score<70)
        return {background:'yellow',color:'black'};
      else if (score >= 70)
        return {background:'green',color:'white'};
      
    }
getDayWithDate(date){
   let d = moment(date,'M-D-YY');
   let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
   let dayName = days[d.day()] ;
   return date +"\n"+ dayName;
  }
 	renderTableColumns(dateWiseData,category=undefined,classes=""){
		let columns = [];
        const obj = {
            A: { background: 'green', color: 'white'},
            B: { background: '#32CD32', color: 'white' },
            C: { background: 'yellow', color:'black' },
            D: { background: '#FF8C00', color:'black' },
            F: { background: 'red', color: 'black' },
        };
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

            if (key == 'movement_consistency'|| key == 'movement_consistency_score'){
                let mc = value;
                if( mc != undefined && mc != "" && mc != "-"){
                    mc = JSON.parse(mc);
                    all_data.push({value:mc.inactive_hours,
                                   style:{}});
                }
                else{
                    all_data.push({value:'-',
                                   style:{}});
                }
            }
             else if(key === 'overall_health_gpa_before_panalty' ){
                       var i = parseFloat(value);
                       if(isNaN(i)) { i = 0.00; }
                       var minus = '';
                       if(i < 0) { minus = '-'; }
                       i = Math.abs(i);
                       i = parseInt((i + .005) * 100);
                       i = i / 100;
                       var s = new String(i);
                       if(s.indexOf('.') < 0) { s += '.00'; }
                       if(s.indexOf('.') == (s.length - 2)) { s += '0'; }
                       s = minus + s;
                       all_data.push({value: s,
                                      style:this.getStylesGpaBeforePanalities(parseFloat(s))});
                    }
            
              else if(key === 'prcnt_non_processed_food'){
                  if(value !=='-' && value !==0){
                  all_data.push({value:value+'%',
                                style:this.getStylesNonProcessedFood(value)});
                  }
                  else{
                    all_data.push({value:'Not Reported',
                                   style:{}});
                  }
              }
            else if(key === 'overall_health_gpa'){
               var i = parseFloat(value);
               if(isNaN(i)) { i = 0.00; }
               var minus = '';
               if(i < 0) { minus = '-'; }
               i = Math.abs(i);
               i = parseInt((i + .005) * 100);
               i = i / 100;
               var s = new String(i);
               if(s.indexOf('.') < 0) { s += '.00'; }
               if(s.indexOf('.') == (s.length - 2)) { s += '0'; }
               s = minus + s;
               all_data.push({value: s});
            }
             else  if(key === 'exercise_consistency_score' ){
               var i = parseFloat(value);
               if(isNaN(i)) { i = 0.00; }
               var minus = '';
               if(i < 0) { minus = '-'; }
               i = Math.abs(i);
               i = parseInt((i + .005) * 100);
               i = i / 100;
               var s = new String(i);
               if(s.indexOf('.') < 0) { s += '.00'; }
               if(s.indexOf('.') == (s.length - 2)) { s += '0'; }
               s = minus + s;
               all_data.push({value: s});
            }

            else if(value !== '-' && value !== undefined && 
               value !== "" && (key == 'deep_sleep' ||
                key == 'light_sleep' || key == 'awake_time' ||
                key == 'sleep_per_wearable')){
                let hm = value.split(':');
                let time_str = `${hm[0]}:${hm[1]}`;
                all_data.push({value:time_str,
                              style:{}});
            }

            else if(value !== '-' && value !== undefined &&
                key == 'workout_duration'){
                let hms = value.split(':');
                let time_str = `${hms[0]}:${hms[1]}:${hms[2]}`;
                if(time_str =="0:00:00")
                 all_data.push({value:"No Workout",
                                    style:{}});
                else
                 all_data.push({value:time_str,
                                    style:{}});
            }
            else if(key == "effort_level"){
                if(value == 0)
                    all_data.push({value:"No Workout",
                                    style:{}});
                else
                    all_data.push({value:value,
                                     style:{}});
            }
            else if(key == "vo2_max"){
                if(value == 0)
                    all_data.push({value:"Not Provided",
                                    style:{}});
                else
                    all_data.push({value:value,
                                    style:{}});
            }
            else if(key == 'avg_heartrate' && !this.isEmpty(JSON.parse(value))){
                let avgHrJson = JSON.parse(value);
                for(let act of avgHrKeys)
                    all_data.push({value:avgHrJson[act],
                                   style:{}});
            }
            else if (key == 'avg_heartrate' && this.isEmpty(JSON.parse(value))){     
                for(let act of avgHrKeys)
                    all_data.push({value:'-',
                                   style:{}});
            }
            else if ((key == 'dew_point' && value === null) ||
                     (key == 'temperature' && value === null) ||
                     (key == 'humidity' && value === null)||
                     (key == 'temperature_feels_like' && value === null) ||
                     (key == 'wind' && value === null)){
                all_data.push({value:'Not Reported',
                               style:{}});
            }
            else if((key == 'dew_point' && (value && value != '-')) ||       
                    (key == 'temperature' && (value && value != '-'))||    
                    (key == 'temperature_feels_like' && (value && value != '-'))){   
                all_data.push({value:value,   
                               style:{}});    
            }
            else if(key == "hrr_time_to_99"){
                if(value == "" || value == undefined || value == "0:0"){
                    all_data.push({value:"Not Recorded",
                                    style:{}});
                }
                else{
                    all_data.push({value:value,
                                    style:{}});
                }
            }
            else if(key == "hrr_starting_point"){
                if(value == "" || value == undefined || value == 0){
                    all_data.push({value:"Not Recorded",
                                    style:{}});
                }
                else{
                    all_data.push({value:value,
                                    style:{}});
                }
            }
             else if(key == "hrr_beats_lowered_first_minute"){
                if(value == "" || value == undefined || value == 0){
                   all_data.push({value:"Not Recorded",
                                    style:{}});
                }
                else{
                   all_data.push({value:value,
                                    style:{}});
                }
            }
            else if(key == "lowest_hr_during_hrr"){
                if(value == "" || value == undefined || value == 0){
                    all_data.push({value:"Not Recorded",
                                    style:{}});
                }
                else{
                    all_data.push({value:value,
                                    style:{}});
                }
            }
            else if(key == "avg_exercise_heartrate"){
                if(value == "" || value == undefined || value == 0){
                    all_data.push({value:"",
                                    style:{}});
                }
                else{
                   all_data.push({value:value,
                                    style:{}});
                }
            }
           
            else{
            value += '';
            var x = value.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? '.' + x[1] : '';  
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            all_data.push({value:x1 + x2,   
                               style:obj[value]});     
            }

            if(pushKeytoggle)
                keys.push(key);   
					}

				}
			}
			columns.push(
				<Column 
                style={{wordWrap:"break-word"}}      
					header={<Cell className={css(styles.newTableHeader)}>{this.getDayWithDate(date)}</Cell>}     
			        cell={props => (
				            <Cell style={all_data[props.rowIndex].style} {...{'title':all_data[props.rowIndex].value}} {...props} className={css(styles.newTableBody)}>
				              {all_data[props.rowIndex].value}
				            </Cell>
				          )}
			        width={100}



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
			<div>
			 <Table
		        rowsCount={rowsCount}    
		        rowHeight={50}  
		        headerHeight={60}   
		        width={containerWidth}    
        		maxHeight={containerHeight}
            touchScrollEnabled={true}                  
                {...props}>
		        <Column 
		          header={<Cell className={css(styles.newTableHeader)}>All Stats</Cell>}
		          cell={props => (
		            <Cell {...{'title':this.state.tableAttrColumn[props.rowIndex].name}} {...props} className={css(styles.newTableBody)}>
		              {this.state.tableAttrColumn[props.rowIndex].name}

		            </Cell>
		          )}
		          width={225}
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
    fontSize: '16px', 
    border: 'none',
    fontFamily:'Proxima-Nova',
    fontStyle:'normal',     
  }
});


export default Dimensions({  
  getHeight: function(element) {
    return window.innerHeight - 172;
  },
  getWidth: function(element) {     
    var widthOffset = window.innerWidth < 1024 ? 0 : 5;     
    return window.innerWidth - widthOffset;    
  }
})(AllStats1);               
