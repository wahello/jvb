import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Button} from "reactstrap";
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import Dimensions from 'react-dimensions';
import { StyleSheet, css } from 'aphrodite';


 class Sleep extends Component{
	constructor(props){
	super(props);
	 this.renderTableColumns = this.renderTableColumns.bind(this);
	 this.getStylesGpaBeforePanalities = this.getStylesGpaBeforePanalities.bind(this);
	 this.getDayWithDate = this.getDayWithDate.bind(this);
	 this.getStylesForUserinputSleep = this.getStylesForUserinputSleep.bind(this);
	 this.strToSecond = this.strToSecond.bind(this);
	 this.state = {
      myTableData: [
          {name: 'Sleep Per User Input (excluding awake time) (hh:mm)'},
          {name: 'Sleep Comments'},
          {name: 'Sleep Aid taken?'},
          {name: 'Resting Heart Rate (RHR)'},
          {name: 'Sleep per Wearable (excluding awake time) (hh:mm)'},
          {name: 'Sleep Bed Time'}, 
          {name: 'Sleep Awake Time'},
          {name: 'Deep Sleep (hh:mm)'},
          {name: 'Light Sleep (hh:mm)'},
          {name: 'Awake Time (hh:mm)'}                     
      ],
    };
  }
getStylesGpaBeforePanalities(score){	
      if (score>=76)
        return {background:'red',color:'black'};
      else if (score>=63 && score<=75)
        return {background:'yellow',color:'black'};
      else if (score >=30 && score <= 62)
        return {background:'green',color:'white'};
      if (score<30)
        return {background:'red',color:'black'};
      
    }
    strToSecond(value){
    	let time = value.split(':');
    	let hours = parseInt(time[0])*3600;
    	let min = parseInt(time[1])*60;
    	let s_time = hours + min;
    	return s_time;
}
	getStylesForUserinputSleep(value){
		value = this.strToSecond(value);
		if(value < this.strToSecond("6:00") || value > this.strToSecond("12:00"))
			return {background:'red',color:'black'};
		else if(this.strToSecond("7:30") <= value && value <= this.strToSecond("10:00"))
			return {background:'green',color:'black'};
    	else if((this.strToSecond("7:00")<=value && value<= this.strToSecond("7:29"))
    	 || (this.strToSecond("10:01")<=value && value<=this.strToSecond("10:30")))
    		return {background:'green',color:'black'};
    	else if((this.strToSecond("6:30")<=value && value<=this.strToSecond("7:29"))
    	 || (this.strToSecond("10:31")<= value && value<=this.strToSecond("11:00")))
    		return {background:'yellow',color:'black'};
    	else if((this.strToSecond("06:00")<=value && value<= this.strToSecond("6:29"))
    	 || (this.strToSecond("11:30")<=value && value<= this.strToSecond("12:00")))
    		return {background:'yellow',color:'black'};	
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
					if(value !== '-' && value !== undefined && value !== "" &&
						(key == 'deep_sleep' ||
						key == 'light_sleep' ||
						key == 'awake_time' ||
						key == 'sleep_per_wearable')){
						let hm = value.split(':');
						let time_str = `${hm[0]}:${hm[1]}`;

						all_data.push({value:time_str,
									   style:''});						
					}
					else if(key == "sleep_aid"){
						if(value == "yes"){
							all_data.push({value:"Yes",
									   style:''});	
						}
						else if(value == "no"){
							all_data.push({value:"No",
									   style:''});	
						}
						else{
						 all_data.push({value:value,
										style:''});
						}
					}
					else if(key == "sleep_per_user_input"){
						if(value != " " && value != "-" && value != undefined){
							all_data.push({value:value,
										   style:this.getStylesForUserinputSleep(value)});
						}
					}
					else if(key == 'resting_heart_rate'){
						all_data.push({value:value,
										style:this.getStylesGpaBeforePanalities(value)})
					}
					else all_data.push({value:value,
										style:''});
				}
			}

			columns.push(
				<Column 
					header={<Cell className={css(styles.newTableHeader)}>{this.getDayWithDate(date)}</Cell>}
			        cell={props => (
				            <Cell style={all_data[props.rowIndex].style} {...{'title':all_data[props.rowIndex].value}} {...props} className={css(styles.newTableBody)}>
				              {all_data[props.rowIndex].value}
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
			<div>
			 <Table
		        rowsCount={rowsCount}
		        rowHeight={50}
		        headerHeight={60}
		        width={containerWidth}
        		height={containerHeight}
        		touchScrollEnabled={true}
        		{...props}>
		        <Column
		          header={<Cell className={css(styles.newTableHeader)}>Sleep</Cell>}
		          cell={props => (
		            <Cell {...{'title':this.state.myTableData[props.rowIndex].name}} {...props} className={css(styles.newTableBody)}>
		              {this.state.myTableData[props.rowIndex].name}
		            </Cell>
		          )}
		          width={225}
		          fixed={true}
		        />
			    {this.renderTableColumns(this.props.data,"sleep_ql")}
      		</Table>
			</div>

			);
	}
}

const styles = StyleSheet.create({
  newTableHeader: {
  	textAlign:'center', 
    border: 'none',
    fontFamily:'Proxima-Nova',
    fontStyle:'normal'
  },
  newTableBody:{
  	textAlign:'center',
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
})(Sleep);