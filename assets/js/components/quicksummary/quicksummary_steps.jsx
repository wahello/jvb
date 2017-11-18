import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Button} from "reactstrap";
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import Dimensions from 'react-dimensions';

class Steps extends Component{

	constructor(props){
	super(props);
	 this.renderTableColumns = this.renderTableColumns.bind(this);

	 this.state = {
      myTableData: [
        {name: 'Non Exercise Steps'},
        {name: 'Exercise Steps'},
        {name: 'Total Steps'},
        {name: 'Floor Climed'}, 
        {name: 'Floor Decended'},
        {name: 'Movement Consistency'},
        {name: 'Light Sleep'},
        {name: 'Awake Time'},                       
      ],
    };
  }

renderTableColumns(dateWiseData,category,classes=""){
		let columns = [];
		for(let [date,data] of Object.entries(dateWiseData)){
			let mc = data[category]["movement_consistency"];
			if( mc != undefined && mc != "" && mc != "-"){
				mc = JSON.parse(mc);
				data[category]["movement_consistency"] = mc.inactive_hours;
			}
			columns.push(
				<Column 
					header={<Cell>{date}</Cell>}
			        cell={props => (
				            <Cell {...props}>
				              {data[category][Object.keys(data[category])[props.rowIndex+2]]}
				            </Cell>
				          )}
			        width={132}
				/>
			)
		}
		return columns;
	}

 render(){
 		const {height, width, containerHeight, containerWidth, ...props} = this.props;
		let rowsCount = Object.keys(Object.entries(this.props.data)[0][1]["steps_ql"]).length;
		return(
			<div>
			 <div className="quick3"
			  >
			 <Table
		        rowsCount={rowsCount}
		        rowHeight={50}
		        headerHeight={50}
		        width={containerWidth}
        		height={containerHeight}
        		{...props}>
		        <Column
		          header={<Cell>Steps</Cell>}
		          cell={props => (
		            <Cell {...props}>
		              {this.state.myTableData[props.rowIndex].name}
		            </Cell>
		          )}
		          width={200}
		          fixed={true}
		        />
			    {this.renderTableColumns(this.props.data,"steps_ql")}
      		</Table>
			</div>
			</div>

			);
	}

}

export default Dimensions({
  getHeight: function(element) {
    return window.innerHeight - 200;
  },
  getWidth: function(element) {
    var widthOffset = window.innerWidth < 1024 ? 30 : 240;
    return window.innerWidth - widthOffset;
  }
})(Steps);