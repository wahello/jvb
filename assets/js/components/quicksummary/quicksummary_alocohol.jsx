import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Button} from "reactstrap";
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import Dimensions from 'react-dimensions';

class Alcohol extends Component{

	constructor(props) {
    super(props);
    this.renderTableColumns = this.renderTableColumns.bind(this);  

    this.state = {
      myTableData: [
        {name: 'Alcohol Per Day'},
        {name: 'Alcohol Per Week'},       
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
			<div className="quick3">			
			 <Table
		        rowsCount={rowsCount}
		        rowHeight={100}
		        headerHeight={50}
		        width={containerWidth}
        		height={containerHeight}
        		touchScrollEnabled={true}
        		{...props}>
		        <Column
		          header={<Cell>Alchohol</Cell>}
		          cell={props => (
		            <Cell {...props}>
		              {this.state.myTableData[props.rowIndex].name}
		            </Cell>
		          )}
		          width={167}
		          fixed={true}
		        />
			    {this.renderTableColumns(this.props.data,"alcohol_ql")}
      		</Table>
			</div>

			);
	}
}
export default Dimensions({
  getHeight: function(element) {
    return window.innerHeight - 395;
  },
  getWidth: function(element) {
    var widthOffset = window.innerWidth <1024 ? 0 : 125;
    return window.innerWidth - widthOffset;
  }
})(Alcohol);