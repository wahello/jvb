import React, { Component } from 'react';
import {Button} from "reactstrap";
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import Dimensions from 'react-dimensions';

import {getInitialStateUserInput} from './initialStateUser';
import {userInputDate} from '../../network/quick';
import { Alert } from 'reactstrap';

 class User extends Component{

	constructor(props){
	super(props);
	this.renderTableColumns = this.renderTableColumns.bind(this);
	this.state = {
		columnAttributeName: [
        {name: 'Pain area'},
        {name: 'Pain and twinges during or after workout'},
        {name: 'Stres level yesterday'},
        {name: 'Water consumend during workout'}, 
        {name: 'Percent workout breath through nose?'},
        {name: 'Calories consumed during workout'},
        {name: 'Chia seed consumed during workout'},
        {name: 'Clothes size'}, 
        {name: 'Fasted during workout?'},
        {name: 'Food ate before workout?'},
        {name: 'Food ate during workout'},
		{name: 'General workout comments'},
		{name: 'General comment'},
		{name: 'sick'},
		{name: "sickness"},
		{name: "Do you stand for three hours?"},
		{name: "what type of diet you eat?"},
		{name: "Waist size"},
		{name: "Weight"},
		{name: "Was your workout today enjoyable"},
		{name: "What alcohol drink consumed"},
		{name: "Did you take controlled or uncontrolled substance today?"},
		{name: "Workout effort level of hard portion"},
		{name: "What processed food you consumed yesterday?"},
		{name: "What unprocessed food you consumed yesterday"},
		{name: "Number of alcohol consumed yesterday"},
		{name: "Percent of unprocessed food consumed yesterday"},
		{name: "Prescription or non-prescription medication taken"},
		{name: "What prescription or non-prescription medication taken yesterday?"},
		{name: "Prescription or non-prescription sleep aids last night"},
		{name: "Sleep aid taken last night"},
		{name: "Sleep comments"},
		{name: "Sleep time excluding awake time"},
		{name: "Did you smoke any substances yesterday"},
		{name: "Smoked substance"},
		{name: "Was your workout easy or hard"},
		{name: "Did you workout today?"},
		{name: "Workout effort level"},
		{name: "Workout type"}           
      ],
	};
	
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
					header={<Cell>{date}</Cell>}
			        cell={props => (
				            <Cell {...props}>
				              {all_data[props.rowIndex]}
				            </Cell>
				          )}
			        width={134}
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
		          header={<Cell>User Input</Cell>}
		          cell={props => (
		            <Cell {...props}>
		              {this.state.columnAttributeName[props.rowIndex].name}
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
export default Dimensions({
  getHeight: function(element) {
    return window.innerHeight - 260;
  },
  getWidth: function(element) {
    var widthOffset = window.innerWidth < 1024 ? 30 : 400;
    return window.innerWidth - widthOffset;
  }
})(User);

