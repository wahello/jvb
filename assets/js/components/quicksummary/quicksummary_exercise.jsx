import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Button} from "reactstrap";
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import Dimensions from 'react-dimensions';



class Exercise extends Component {
constructor(props){
	super(props);
	 this.renderTableColumns = this.renderTableColumns.bind(this);

	 this.state = {
      myTableData: [
        {name: 'Workout Easy Hard'},
        {name: 'Workout Type'},
        {name: 'Workout Time'},
        {name: 'Workout Location'},
        {name: 'Workout Duration'},
        {name: 'Maximum Elevation Workout'},
        {name: 'Minutes Walked Before Workout'},
        {name: 'Distance (In Miles) - Run'}, 
        {name: 'Distance (in Miles) - Bike'}, 
        {name: 'Distance (in yards) - Swim'}, 
        {name: 'Distance (in Miles) - Other'},  
        {name: 'Pace (minutes:seconds) (Running)'},
        {name: 'Average Heartrate'},
        {name: 'Elevation Gain(feet)'},
        {name: 'Elevation Loss(feet)'},  
        {name: 'Effort Level'},
        {name: 'Dew Point'},
        {name: 'Temperature'},
        {name: 'Humidity'},  
        {name: 'Temperature Feels Like'},
        {name: 'Wind'},
        {name: 'HRR'},
        {name: 'HRR Start Point'},  
        {name: 'HRR Beats Lowered'},
        {name: 'Sleep Resting Hr Last Night'},
        {name: 'Vo2 Max'},
        {name: 'Running Cadence'},
        {name: 'Percent Breath through Nose During Workout'},
        {name: 'Water Consumed during Workout'},
        {name: 'Chia Seeds consumed during Workout'},
        {name: 'Fast Before Workout'}, 
        {name: 'Pain'},
        {name: 'Pain Area'},
        {name: 'Stress Level'},
        {name: 'Sick '}, 
        {name: 'Drug Consumed'},
        {name: 'Drug'},
        {name: 'Medication'},
        {name: 'Smoke Substance'}, 
        {name: 'Exercise Fifteen More'},
        {name: 'Workout Elapsed Time'},
        {name: 'TimeWatch Paused Workout'},
        {name: 'Exercise Consistency '},
        {name: 'Workout Duration Grade'},
        {name: 'Workout Effort Level Grade'},
        {name: 'Avg Heart Rate Grade'},
        {name: 'OverAll Workout Grade'},
        {name: 'Heart Rate Variability Stress (Garmin)'},
        {name: 'Fitness Age'},
        {name: 'Workout Comment'},                    
      ],
    };
  }

renderTableColumns(dateWiseData,category,classes=""){
		let columns = [];
		for(let [date,data] of Object.entries(dateWiseData)){

            let all_data = [];
            for(let [key,value] of Object.entries(data[category])){
                if(key !== 'id' && key !== 'user_ql'){
                    all_data.push(value);
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
		let rowsCount = this.state.myTableData.length;
		return(
			<div className="quick3"
            >
			 <Table
		        rowsCount={rowsCount}
		        rowHeight={100}
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