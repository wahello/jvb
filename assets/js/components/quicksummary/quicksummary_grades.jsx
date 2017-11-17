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


 class Grades extends Component{

	constructor(props){
	super(props);
	//this.bikeStatScroll=this.bikeStatScroll.bind(this);
	 this.renderTableColumns = this.renderTableColumns.bind(this);

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
// constructor(props){
// 	super(props);
// 	this.myFunction=this.myFunction.bind(this);

// }
// componentDidMount() {
// 	document.getElementById('tBodyGrades').addEventListener('scroll', this.myFunction);
// }


//   myFunction(e) { 
//   console.log('Scroll event detected!');//detect a scroll event on the tbody
//         var tbody = document.getElementById("tBodyGrades");
//         document.getElementById("tHeadGrades").style.left = '-'+tbody.scrollLeft+'px';
//         document.querySelector('#tHeadGrades th:nth-child(1)').style.left = tbody.scrollLeft+'px';
//         var trLength = document.querySelector('#tBodyGrades').children;
//         for (var i = 0; i < trLength.length; i++) {
//         	trLength[i].querySelector('#tBodyGrades td:nth-child(1)').style.left = tbody.scrollLeft+'px';
//         }

//     };
	
	render(){
		const {height, width, containerHeight, containerWidth, ...props} = this.props;
		 // var {dataList} = this.state;
		let rowsCount = Object.keys(Object.entries(this.props.data)[0][1]["grades_ql"]).length;
		return(
			<div className="quick3">
			 <Table
			 	className="responsive"
		        rowsCount={rowsCount}
		        rowHeight={50}
		        headerHeight={50}
		        width={containerWidth}
        		height={containerHeight}
        		{...props}>
		        {/*this.renderTableAttrColumn(this.props.data,"alcohol_ql","Alcohol")*/}
		        <Column
		          header={<Cell>Grades</Cell>}
		          cell={props => (
		            <Cell {...props}>
		              {this.state.myTableData[props.rowIndex].name}
		            </Cell>
		          )}
		          width={200}
		          fixed={true}
		        />
			    {this.renderTableColumns(this.props.data,"grades_ql")}
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
    var widthOffset = window.innerWidth < 1024 ? 30 : 240;
    return window.innerWidth - widthOffset;
  }
})(Grades);