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
        {name: 'Movement Consistency'}                     
      ],
    };
  }

renderTableColumns(dateWiseData,category,classes=""){
		let columns = [];
		for(let [date,data] of Object.entries(dateWiseData)){
			let mc = data[category]["movement_consistency"];
			let all_data = [];

			if( mc != undefined && mc != "" && mc != "-"){
				mc = JSON.parse(mc);
				data[category]["movement_consistency"] = mc.inactive_hours;
			}

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
		          width={185}
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
    return window.innerHeight - 295;
  },
  getWidth: function(element) {
    var widthOffset = window.innerWidth < 1024 ? 30 : 400;
    return window.innerWidth - widthOffset;
  }
})(Steps);