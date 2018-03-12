import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Button} from "reactstrap";
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import Dimensions from 'react-dimensions';
import { StyleSheet, css } from 'aphrodite';


 class Bike extends Component {


	constructor(props){
	super(props);
	//this.bikeStatScroll=this.bikeStatScroll.bind(this);
	 this.renderTableColumns = this.renderTableColumns.bind(this);
	 this.getDayWithDate = this.getDayWithDate.bind(this);

	 this.state = {
      myTableData: [
        {name: 'Avg Speed (MPH) Bike'}, 
        {name: 'Avg Power Bike'},
        {name: 'Asvg Speed Per Mile'},
        {name: 'Avg Cadence Bike'},       
      ],
    };
  }
getDayWithDate(date){
   let d = moment(date,'M-D-YY');
   let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
   let dayName = days[d.day()] ;
   return date +"\n"+ dayName;
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
					header={<Cell className={css(styles.newTableHeader)}>{this.getDayWithDate(date)}</Cell>}
			        cell={props => (
				            <Cell {...{'title':all_data[props.rowIndex]}} {...props} className={css(styles.newTableBody)}>
				              {all_data[props.rowIndex]}
				            </Cell>
				          )}
			        width={100}
				/>
			)
		}
		return columns;
	}

	
render(){
		const {height, width, containerHeight, containerWidth, ...props} = this.props;
		let rowsCount = this.state.myTableData.length;
		return(
			<div 
			 >
			 <Table
		        rowsCount={rowsCount}
		        rowHeight={50}
		        headerHeight={60}
		        width={containerWidth}
        		height={containerHeight}
        		touchScrollEnabled={true}
        		{...props}>
		        <Column
		          header={<Cell className={css(styles.newTableHeader)}>Bike Stats</Cell>}
		          cell={props => (
		            <Cell {...{'title':this.state.myTableData[props.rowIndex].name}} {...props} className={css(styles.newTableBody)}>
		              {this.state.myTableData[props.rowIndex].name}
		            </Cell>
		          )}
		          width={167}
		          fixed={true}
		        />
			    {this.renderTableColumns(this.props.data,"bike_stats_ql")}  
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
})(Bike);