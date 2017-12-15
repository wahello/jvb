import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Button} from "reactstrap";
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import Dimensions from 'react-dimensions';
import { StyleSheet, css } from 'aphrodite';

class AllStats1 extends Component{

	constructor(props) {
    super(props);
    this.renderTableColumns = this.renderTableColumns.bind(this);

    this.state = {
       myTableData: [
        {name: 'Alcohol Per Day'},
        {name: 'Average Alcohol Consumed per Week'},
        {name: 'Avg Cadence Bike'}, 
        {name: 'Avg Power Bike'},
        {name: 'Avg Speed (MPH) Bike'},        
        {name: 'Asvg Speed Per Mile'},
        {name: 'Average Heartrate'},
        {name: 'Chia Seeds consumed during Workout'},
        {name: 'Dew Point'},
        {name: 'Distance (in Miles) - Bike'},
        {name: 'Distance (in Miles) - Other'},
        {name: 'Distance (In Miles) - Run'},
        {name: 'Distance (in yards) - Swim'},
        {name: 'Drug'},
        {name: 'Drug Consumed'},
        {name: 'Effort Level'},
        {name: 'Elevation Gain (feet)'},
        {name: 'Elevation Loss (feet)'},
        {name: 'Exercise Consistency '},
        {name: 'Exercise Fifteen More'},        
        {name: 'Fast Before Workout'},
        {name: 'Fitness Age'},
        {name: 'Heart Rate Variability Stress (garmin)'},
        {name: 'HRR'},
        {name: 'HRR Beats Lowered'},
        {name: 'HRR Start Point'},
        {name: 'Humidity'},
        {name: 'Maximum Elevation Workout'},  
        {name: 'Medication'},
        {name: 'Minutes Walked Before Workout'},
        {name: 'Percent Breath through Nose During Workout'},
        {name: 'Pace (minutes:seconds) (Running)'},
        {name: 'Pain'},
        {name: 'Pain Area'},
        {name: 'Running Cadence'},
        {name: 'Sick '}, 
        {name: 'Sleep Resting Hr Last Night'},
        {name: 'Smoke Substance'},
        {name: 'Stress Level'},
        {name: 'Temperature'},          
        {name: 'Temperature Feels Like'},
        {name: 'TimeWatch Paused Workout'},
        {name: 'Vo2 Max'},              
        {name: 'Water Consumed during Workout'},
        {name: 'Wind'},
        {name: 'Workout Comment'},
        {name: 'Workout Duration'},
        {name: 'Workout Easy Hard'},
        {name: 'Workout Elapsed Time'},
        {name: 'Workout Location'},
        {name: 'Workout Time'},
        {name: 'Workout Type'},
        {name: 'Diet Type'},
        {name: 'Non Processed Food'}, 
        {name: 'Percentage of Unprocessed Food'},
        {name: 'Alcoholic Drink Per Week Grade'},
        {name: 'Average Exercise Heartrate Grade'},
        {name: 'Avg Sleep Per Night Grade'},
        {name: 'Exercise Consistency Grade'},
        {name: 'Movement Consistency Grade'},
        {name: 'Movement Non Exercise steps Grade'},
        {name: 'Overall Health Gpa'},
        {name: 'Overall Health Grade'},
        {name: 'Overall Workout Grade'},
        {name: 'Penalty'},
        {name: 'Percentage of Unprocessed Food Grade'},
        {name: 'Workout Duration Grade'},
        {name: 'Workout Effort Level Grade'},
        {name: 'Awake Time'},
        {name: 'Deep Sleep'},
        {name: 'Light Sleep'},
        {name: 'Sleep Aid'},
        {name: 'Sleep Awake Time'},
        {name: 'Sleep Bed Time'},
        {name: 'Sleep Per User Input (excluding awake time)'},
        {name: 'Sleep per Wearable (excluding awake time)'},
        {name: 'Exercise Steps'},
        {name: 'Floor Climed'}, 
        {name: 'Floor Decended'},
        {name: 'Movement Consistency'},
        {name: 'Non Exercise Steps'},
        {name: 'Total Steps'},
        {name: 'pace per 100 yard'},
        {name: 'Total Strokes'},         
       ],            
    };
  }

 	renderTableColumns(dateWiseData,category=undefined,classes=""){
		let columns = [];
         const obj = {
        A: { background: 'green', color: 'black' },
        B: { background: 'green', color: 'black' },
        C: { background: 'yellow', color: 'black'},
        D: { background: 'yellow', color: 'black'},
        F: { background: 'red', color: 'black' }
    };
		for(let [date,data] of Object.entries(dateWiseData)){
			let all_data = [];
			let keys = [];
			for(let cat of Object.keys(data).sort()){
				if (cat !== "created_at" &&
					cat !== "updated_at" &&
					cat !== "user"){
					for(let key of Object.keys(data[cat]).sort()){
						if(key !== 'id' && key !== 'user_ql'){
                            if (key == 'movement_consistency'){
                                let mc = data[cat][key];
                                if( mc != undefined && mc != "" && mc != "-"){
                                    mc = JSON.parse(mc);
                                    all_data.push(mc.inactive_hours);
                                }
                            }
                            else if(data[cat][key] !== '-' && data[cat][key] !== undefined && 
                               data[cat][key] !== "" && (key == 'deep_sleep' ||
                                key == 'light_sleep' || key == 'awake_time' ||
                                key == 'sleep_per_wearable')){
                                let hm = data[cat][key].split(':');
                                let time_str = `${hm[0]} hour ${hm[1]} min`;
                                all_data.push(time_str);
                            }
                            else{
    							all_data.push({key:data[cat][key],
                                                    style:obj[data[cat][key]]});
                            }
                            keys.push(key);
						}
					}
				}
			}
			columns.push(
				<Column 
                style={{wordWrap:"break-word"}}
					header={<Cell className={css(styles.newTableHeader)}>{date}</Cell>}
			        cell={props => (
				            <Cell style={all_data[props.rowIndex].style} {...props} className={css(styles.newTableBody)}>
				              {all_data[props.rowIndex].key}
				            </Cell>
				          )}
			        width={200}


				/>
			);
            console.log(keys);
		}
		return columns;
	}

	render(){
		const {height, width, containerHeight, containerWidth, ...props} = this.props;
		let rowsCount = this.state.myTableData.length;
				
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
		              {this.state.myTableData[props.rowIndex].name}
		            </Cell>
		          )}
		          width={200}
		          fixed={true}


		        />
			    {this.renderTableColumns(this.props.data)}	   
      		</Table>
			</div>

			);
	}
}

const styles = StyleSheet.create({
  newTableHeader: {
    textAlign:'center',
    color: '#111111',
    fontSize: '18px',   
    border: 'none',
    fontFamily:'Proxima-Nova',
    fontStyle:'normal'
  },
  newTableBody:{
    textAlign:'center',   
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
