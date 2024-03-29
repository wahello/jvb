import React, { Component } from 'react';
import moment from 'moment';
import {Button} from "reactstrap";
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import Dimensions from 'react-dimensions';
import { StyleSheet, css } from 'aphrodite';


import {getInitialStateUserInput} from './initialStateUser';
import {userInputDate} from '../../network/quick';
import { Alert } from 'reactstrap';

 class User extends Component{

	constructor(props){
	super(props);
	this.renderTableColumns = this.renderTableColumns.bind(this);
	this.getDayWithDate = this.getDayWithDate.bind(this);
	this.renderLastSync = this.renderLastSync.bind(this);

	this.state = {
		columnAttributeName: [
		{name: 'Heart rate down to 99'},
		{name: 'Heart Rate level'},
		{name: 'Lowest heart rate during HRR'},
		{name: 'Lowest heart rate in first minute of HRR activity file'},
		{name: 'Did you measured HRR?'},
        {name: 'Pain area'},
        {name: 'Pain and twinges during or after workout'},
        {name: 'Stres level yesterday'},
        {name: 'How long did it take for your heart rate to get to 99 bpm?'},
        {name: 'In the first minute of your heart rate recovery file, what was your lowest heart rate?'},
        {name: 'Water consumend during workout'}, 
        {name: 'Percent workout breathe through nose?'},
        {name: 'Calories consumed during workout'},
        {name: 'Chia seed consumed during workout'},
        {name: 'Clothes size'}, 
        {name: 'Fasted during workout?'},
        {name: 'Food ate before workout?'},
        {name: 'Food ate during workout'},
		{name: 'General workout comments'},
		{name: 'General comment'},
		{name: 'Sick'},
		{name: "Sickness Comments"},
		{name: "Do you stand for three hours?"},
		{name: "what type of diet you eat?"},
		{name: "Waist size"},
		{name: "Weight"},
		{name: "Was your workout today enjoyable"},
		{name: "What alcohol drink consumed"},
		{name: "Did you take controlled or uncontrolled substance today?"},
		{name: "Dewpoint"},
		{name: "Workout effort level of hard portion"},
		{name: "Humidity"},
  		{name: "Indoor Temperature"},
		{name: "What processed food you consumed yesterday?"},
		{name: "What unprocessed food you consumed yesterday"},
		{name: "Number of alcohol consumed yesterday"},
		{name: "Outdoor temperature"},
		{name: "Percent of unprocessed food consumed yesterday"},
		{name: "Prescription or non-prescription medication taken"},
		{name: "What prescription or non-prescription medication taken yesterday?"},
		{name: "Prescription or non-prescription sleep aids last night"},
		{name: "Sleep aid taken last night"},
		{name: "Sleep comments"},
		{name: "Sleep time excluding awake time"},
		{name: "Did you smoke any substances yesterday"},
		{name: "Smoked substance"},
		{name: "Temperature feels like"},
		{name: "Weather Comment"},
		{name: "Wind"},
		{name: "Was your workout easy or hard"},
		{name: "Did you workout today?"},
		{name: "Workout effort level"},
		{name: "Workout type"}           
      ],
	};
	
}
renderLastSync(value){
    let time;
    if(value != null){
      time = moment(value).format("MMM DD, YYYY @ hh:mm a")
    }
    return <div style = {{fontSize:"13px"}}>Synced at {time}</div>;
}
getDayWithDate(date){
   let d = moment(date,'M-D-YY');
   let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
   let dayName = days[d.day()] ;
   return date +"\n"+ dayName;
  }
renderTableColumns(dateWiseData,category=undefined,classes=""){
		let columns = [];
		for(let [date,data] of Object.entries(dateWiseData)){
			let all_data = [];
			let keys = [];
			for(let cat of Object.keys(data).sort()){
					for(let key of Object.keys(data[cat]).sort()){

						all_data.push(data[cat][key]);
						keys.push(key);
					}
			}

			columns.push(
				<Column 
					header={<Cell className={css(styles.newTableHeader)}>{this.getDayWithDate(date)}</Cell>}
			        cell={props => (
				            <Cell {...{'title':all_data[props.rowIndex]}} {...props} className={css(styles.newTableBody)}>
				              {all_data[props.rowIndex]}
				            </Cell>
				          )}
			        width={200}
				/>
			);
		}
		return columns;
	}

	render(){
		const {height, width, containerHeight, containerWidth, ...props} = this.props;
		let rowsCount = this.state.columnAttributeName.length;
		return(
			<div>
			 <Table
			 	className="responsive"
		        rowsCount={rowsCount}
		        rowHeight={50}
		        headerHeight={50}
		        width={containerWidth}
        		height={containerHeight}
        		touchScrollEnabled={true}
        		{...props}>
		        <Column
		          header={<Cell className={css(styles.newTableHeader)}>User Input</Cell>}
		          cell={props => (
		            <Cell {...{'title':this.state.columnAttributeName[props.rowIndex].name}} {...props} className={css(styles.newTableBody)}>
		              {this.state.columnAttributeName[props.rowIndex].name}
		            </Cell>
		          )}
		          width={220}
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
})(User);

