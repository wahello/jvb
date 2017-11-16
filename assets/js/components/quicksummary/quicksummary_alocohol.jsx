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
    // this.renderTableAttrColumn = this.renderTableAttrColumn.bind(this);

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

	// renderTableAttrColumn(dateWiseData,category,table_name,classes="")
	// {
	// 	let attributes = Object.keys(Object.entries(dateWiseData)[0][1][category]);
	// 	return(
	// 		<Column
	// 			header={<Cell>{table_name}</Cell>}
	// 	        cell={props => (
	// 		            <Cell {...props}>
	// 		              {attributes[props.rowIndex]}
	// 		            </Cell>
	// 		          )}
	// 	        width={200}
	// 	    />
	// 	);
	// }
	render(){
		 // var {dataList} = this.state;
		 const {height, width, containerHeight, containerWidth, ...props} = this.props;
		let rowsCount = Object.keys(Object.entries(this.props.data)[0][1]["alcohol_ql"]).length;
		return(
			<div className="quick3">			
			 <Table
		        rowsCount={rowsCount}
		        rowHeight={50}
		        headerHeight={50}
		        width={containerWidth}
        		height={containerHeight}
        		{...props}>
		        {/*this.renderTableAttrColumn(this.props.data,"alcohol_ql","Alcohol")*/}
		        <Column
		          header={<Cell>Alchohol</Cell>}
		          cell={props => (
		            <Cell {...props}>
		              {this.state.myTableData[props.rowIndex].name}
		            </Cell>
		          )}
		          width={200}
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
    return window.innerHeight - 200;
  },
  getWidth: function(element) {
    var widthOffset = window.innerWidth < 680 ? 0 : 240;
    return window.innerWidth - widthOffset;
  }
})(Alcohol);