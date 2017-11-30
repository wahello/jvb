import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Button} from "reactstrap";
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import Dimensions from 'react-dimensions';

 class Sleep extends Component{
	constructor(props){
	super(props);
	 this.renderTableColumns = this.renderTableColumns.bind(this);

	 this.state = {
      myTableData: [
        {name: 'Sleep per Wearable (excluding awake time)'},
        {name: 'Sleep Per User Input (excluding awake time)'},
        {name: 'Sleep Aid'},
        {name: 'Sleep Bed Time'}, 
        {name: 'Sleep Awake Time'},
        {name: 'Deep Sleep'},
        {name: 'Light Sleep'},
        {name: 'Awake Time'},                       
      ],
    };
  }

renderTableColumns(dateWiseData,category,classes=""){
		let columns = [];
		for(let [date,data] of Object.entries(dateWiseData)){

			let all_data = [];
			for(let [key,value] of Object.entries(data[category])){
				if(key !== 'id' && key !== 'user_ql'){
					if(value !== '-' && value !== undefined && value !== "" &&
						(key == 'deep_sleep' ||
						key == 'light_sleep' ||
						key == 'awake_time' ||
						key == 'sleep_per_wearable')){
						let hm = value.split(':');
						let time_str = `${hm[0]} hour ${hm[1]} min`;
						all_data.push(time_str);
					}
					else all_data.push(value);
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
		          header={<Cell>Sleep</Cell>}
		          cell={props => (
		            <Cell {...props}>
		              {this.state.myTableData[props.rowIndex].name}
		            </Cell>
		          )}
		          width={167}
		          fixed={true}
		        />
			    {this.renderTableColumns(this.props.data,"sleep_ql")}
      		</Table>
			</div>

			);
	}
}

export default Dimensions({
  getHeight: function(element) {
    return window.innerHeight - 235;
  },
  getWidth: function(element) {
    var widthOffset = window.innerWidth < 1024 ? 0 : 145;
    return window.innerWidth - widthOffset;
  }
})(Sleep);