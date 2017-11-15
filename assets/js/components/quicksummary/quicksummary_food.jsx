import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Button} from "reactstrap";
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import Dimensions from 'react-dimensions';

// function renderTableRows(dateWiseData,category,field,classes=""){
// 	let elements = [];
// 	for(let [date,data] of Object.entries(dateWiseData)){
// 		if(field === "created_at"){
// 			elements.push(
// 				<th key={date} className={classes}>{date}</th>
// 			);	
// 		}else{
// 			elements.push(
// 				<td key={date} className={classes}>{data[category][field]}</td>
// 			);
// 		}
// 	}
// 	return elements;
// }


export class Food extends Component{

	constructor(props){
	super(props);
	//this.bikeStatScroll=this.bikeStatScroll.bind(this);
	 this.renderTableColumns = this.renderTableColumns.bind(this);

	 this.state = {
      myTableData: [
        {name: 'percentage Non Processed Food'},
        {name: 'Percentage Non Processed Food Grade'},
        {name: 'Non Processed Food'},
        {name: 'Diet Type'},       
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
// 	constructor(props){
// 	super(props);
// 	this.foodScroll=this.foodScroll.bind(this);

// }
// componentDidMount() {
// 	document.getElementById('tBodyFood').addEventListener('scroll', this.bikeStatScroll);
// }


//   foodScroll(e) { 
//         var tbody = document.getElementById("tBodyFood");
//         document.getElementById("tHeadFood").style.left = '-'+tbody.scrollLeft+'px';
//         document.querySelector('#tHeadFood th:nth-child(1)').style.left = tbody.scrollLeft+'px';
//         var trLength = document.querySelector('#tBodyFood').children;
//         for (var i = 0; i < trLength.length; i++) {
//         	trLength[i].querySelector('#tBodyFood td:nth-child(1)').style.left = tbody.scrollLeft+'px';
//         }

//     };
   
render(){
		 // var {dataList} = this.state;
		let rowsCount = Object.keys(Object.entries(this.props.data)[0][1]["food_ql"]).length;
		return(
			<div className="quick3"
			 containerWidth={this.props.containerWidth}
             containerHeight={this.props.containerHeight}>
			 <Table
		        rowsCount={rowsCount}
		        rowHeight={50}
		        headerHeight={50}
		        width={1000}
		        height={170}>
		        {/*this.renderTableAttrColumn(this.props.data,"alcohol_ql","Alcohol")*/}
		        <Column
		          header={<Cell>Food</Cell>}
		          cell={props => (
		            <Cell {...props}>
		              {this.state.myTableData[props.rowIndex].name}
		            </Cell>
		          )}
		          width={200}
		          fixed={true}
		        />
			    {this.renderTableColumns(this.props.data,"food_ql")}
      		</Table>
			</div>

			);
	}

}
export default Food;