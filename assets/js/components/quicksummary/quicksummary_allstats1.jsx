import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Button} from "reactstrap";
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';

export class AllStats1 extends Component{

	constructor(props) {
    super(props);
    this.renderTableColumns = this.renderTableColumns.bind(this);
    // this.renderTableAttrColumn = this.renderTableAttrColumn.bind(this);

    this.state = {
      myTableData: [
      	{name: 'Overall Truth Grade'},
        {name: 'Overall Truth Health Gpa'},
        {name: 'Movement Non Exercise steps Grade'},
        {name: 'Movement Consistency Grade'}, 
        {name: 'Avg Sleep Per Night Grade'},
        {name: 'Exercise Consistency Grade'},
        {name: 'Overall Workout Grade'},
        {name: 'percent NonProcessed Food Consumed Grade'}, 
        {name: 'Alcoholic Drink Per Week Grade'},
        {name: 'Penalty'},  
        {name: 'Overall Truth Grade'},
        {name: 'Total Strokes'}, 
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
			        width={200}
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
		let rowsCount = Object.keys(Object.entries(this.props.data)[0][1]["grades_ql"]).length;		
		return(
			<div>
			 <Table
		        rowsCount={rowsCount}
		        rowHeight={50}
		        headerHeight={50}
		        width={1000}
		        height={500}>
		        {/*this.renderTableAttrColumn(this.props.data,"alcohol_ql","Alcohol")*/}
		        <Column
		          header={<Cell>Alchohol</Cell>}
		          cell={props => (
		            <Cell {...props}>
		              {this.state.myTableData[props.rowIndex].name}
		            </Cell>
		          )}
		          width={200}
		        />
			    {this.renderTableColumns(this.props.data,"grades_ql")}
			     {this.renderTableColumns(this.props.data,"swim_stats_ql")}
			      {this.renderTableColumns(this.props.data,"alcohol_ql")}
			   
      		</Table>
			</div>

			);
	}
}

export default AllStats1;