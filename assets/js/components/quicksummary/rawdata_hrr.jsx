import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Button} from "reactstrap";
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import Dimensions from 'react-dimensions';
import { StyleSheet, css } from 'aphrodite';

class Raw_Hrr extends Component{
	constructor(props){
		super(props);
		this.state = {
	      	myTableData: [
	          	{name: 'Did you measure your heart rate recovery (HRR) after today’s aerobic workout?'},
	          	{name: 'Did your heart rate go down to 99 beats per minute or lower?'},
	          	{name: 'Duration (mm:ss) for Heart Rate Time to Reach 99'},
	          	{name: 'HRR File Starting Heart Rate'},
	          	{name: 'Lowest Heart Rate Level in the 1st Minute'},
	          	{name: 'Number of heart beats recovered in the first minute'}, 
	          	{name: 'End Time of Activity(hh:mm:ss)'},
	          	{name: 'Difference Between Activity End time and Hrr Start time(mm:ss)'},
	          	{name: 'Hrr Start Time(hh:mm:ss)'},
	          	{name: 'Heart Rate End Time Activity'},
	          	{name: 'Heart rate beats your heart rate went down/(up) from end of workout file to start of HRR file'},
	          	{name: 'Pure 1 Minute HRR Beats Lowered'},
	          	{name: 'Pure 1 Minute time to 99'},
	          	{name: 'Did your heart rate go down to 99 beats per minute or lower?'},
	          	{name: 'Duration (mm:ss) for Heart Rate Time to Reach 99'},
	          	{name: 'Time Heart Rate Reached 99 (hh:mm:ss)'}, 
	          	{name: 'HRR File Starting Heart Rate'},
	          	{name: 'Lowest Heart Rate Level in the 1st Minute'},
	          	{name: 'Number of heart beats recovered in the first minute'},
	          	                      
	      	],
	    };
    	this.renderTableColumns = this.renderTableColumns.bind(this);
    	this.getDayWithDate = this.getDayWithDate.bind(this);
    	this.captilizeYes = this.captilizeYes.bind(this);
    	this.renderTime = this.renderTime.bind(this);
    	this.renderSecToMin = this.renderSecToMin.bind(this);
    	this.renderNoworkout = this.renderNoworkout.bind(this);
    	this.heartBeatsColors = this.heartBeatsColors.bind(this);
    	this.renderTimeColors = this.renderTimeColors.bind(this);
    	this.strToSecond = this.strToSecond.bind(this);
  	}

  	getDayWithDate(date){
  		/* Providing Day names accourding to Dates*/
	   	let d = moment(date,'M-D-YY');
	   	let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	   	let dayName = days[d.day()] ;
	   	return date +"\n"+ dayName;
  	}

  	renderSecToMin(value){
  		/* Converting to Minutes and Seconds format from the Seconds */
  		let time;
  		if(value != null && value != "00:00" && value != undefined &&
  		 value != "00:00:00" && value != "-"){
	  		let min = parseInt(value/60);
	  		let sec = (value % 60);
	  		if(sec < 10){
	  			time = min + ":0" + sec;
	  		}
	  		else{
	  			time = min + ":" + sec;
	  		}
	  	}
	  	else{
	  		time = "-"
	  	}
  		return time;
  	}

  	renderTime(value){
  		/* Converting to time format (hh:mm:ss a) from time stamp*/
  		var z;
  		if(value != null && value != "00:00:00" && value != "-"){
  			 z = moment.unix(value).format("hh:mm:ss a");
  		}
  		else if(value == "00:00:00" || value == "-"){
  			 z = "-";
  		}
  		return z
  	}

  	heartBeatsColors(value){
  		/* Applying the colors for the table cells depends upon their heart beat ranges*/
  		if(value >= 20){
  			return {background:"green",color:"white"};
  		}
  		else if(value >= 12 && value < 20){
  			return {background:"yellow",color:"black"};
  		}
  		else if(value > 0 && value < 12){
  			return {background:"red",color:"black"};
  		}
  	}
  	strToSecond(value){
  		/*Convering mm:ss to only seconds format*/
    	let time = value.split(':');
    	let min = parseInt(time[0])*60;
    	let sec = parseInt(time[1]);
    	let s_time = min + sec;
    	return s_time;
	}
  	renderTimeColors(value,age,beats){
  		/*Adding the background colors for the table data depends upon the Scenarios
  		 in "time to reach 99" and "pure time to reach time to 99"*/
  		if(value && age && beats){
        if(value == -1)
          return {background:"red",color:"black"}
  			else if(beats < (180 - age + 4 + 10)){
  				if(value <= this.strToSecond("2:00")){
  					return {background:"green",color:"white"}
  				}
  				else if((value > this.strToSecond("2:00")) && (value <= this.strToSecond("3:00"))){
  					return {background:"#32CD32",color:"white"}
  				}
  				else if((value > this.strToSecond("3:00")) && (value <= this.strToSecond("8:00"))){
  					return {background:'yellow',color:'black'};
  				}
  				else if((value > this.strToSecond("8:00")) && (value <= this.strToSecond("10:00"))){
  					return {background:'#FF8C00',color:'black'};
  				}
  				else if((value > this.strToSecond("10:00"))){
  					return {background:'red',color:'black'};
  				}
  			}
  			else if(((180 - age + 4 + 25) < beats) && (beats > (180 - age + 4 + 10))){
  				if(value <= this.strToSecond("4:00")){
  					return {background:"green",color:"white"}
  				}
  				else if((value > this.strToSecond("4:00")) && (value <= this.strToSecond("6:00"))){
  					return {background:"#32CD32",color:"white"}
  				}
  				else if((value > this.strToSecond("6:00")) && (value <= this.strToSecond("10:00"))){
  					return {background:'yellow',color:'black'};
  				}
  				else if((value > this.strToSecond("10:00")) && (value <= this.strToSecond("12:00"))){
  					return {background:'#FF8C00',color:'black'};
  				}
  				else if((value > this.strToSecond("12:00"))){
  					return {background:'red',color:'black'};
  				}
  			}
  			else if(beats > (180 - age + 4 + 25)){
  				if(value <= this.strToSecond("6:00")){
  					return {background:"green",color:"white"}
  				}
  				else if((value > this.strToSecond("6:00")) && (value <= this.strToSecond("8:00"))){
  					return {background:"#32CD32",color:"white"}
  				}
  				else if((value > this.strToSecond("8:00")) && (value <= this.strToSecond("20:00"))){
  					return {background:'yellow',color:'black'};
  				}
  				else if((value > this.strToSecond("20:00")) && (value <= this.strToSecond("30:00"))){
  					return {background:'#FF8C00',color:'black'};
  				}
  				else if((value > this.strToSecond("30:00"))){
  					return {background:'red',color:'black'};
  				}
  			}
  		}
  	}
  	renderNoworkout(value){
  		/* If you got null or undefined or empty value for "Did_you_measure_HRR" 
  		it will show the comment "No Workout"*/
		if(value == null || value == undefined || value == ""){
			value = "No Workout";
			value = value[0].toUpperCase()+value.slice(1);
		}
		else{
			value = value[0].toUpperCase()+value.slice(1);
		}
		return value;
	}

  	captilizeYes(value){
  		/* Captilizing the words yes or no*/
		let cpatilize;
		if(value){
			cpatilize = value[0].toUpperCase()+value.slice(1);
	    }
		return cpatilize;
	}

  	renderTableColumns(dateWiseData){
  		/* Creating the columns with table data for 8 days defaultly*/
		let columns = [];
		for(let [date,data] of Object.entries(dateWiseData)){
			let all_data = [];
			for(let [key,value] of Object.entries(data)){
				if(key == "Did_you_measure_HRR" || key == "Did_heartrate_reach_99" ||
					key == "no_fitfile_hrr_reach_99"){
					all_data.push({value:this.captilizeYes(value),
									style:''});
				}
				else if(key == "end_time_activity" || key == "time_heart_rate_reached_99"
					|| key == "HRR_activity_start_time"){
					all_data.push({value:this.renderTime(value),
									style:''});
				}
				else if(key == "diff_actity_hrr" ||
				 key == "no_fitfile_hrr_time_reach_99"){
					all_data.push({value:this.renderSecToMin(value),
									style:''});
				}
				else if(key == "Did_you_measure_HRR"){
					all_data.push({value:this.renderNoworkout(value),
									style:''});
				}
				else if(key == "pure_1min_heart_beats" || key == "No_beats_recovered"){
					all_data.push({value:value,
									style:this.heartBeatsColors(value)});
				}
				else if(key == "time_99" || key == "pure_time_99"){
					let time = value && value == -1?"Never":this.renderSecToMin(value);
					let age = data['age'];
					let beats = data['end_heartrate_activity'];
					all_data.push({value:time,
									style:this.renderTimeColors(value,age,beats)});
				}
				else{
					all_data.push({value:value,
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
			          header={<Cell className={css(styles.newTableHeader)}>Heart Rate Recovery</Cell>}
			          cell={props => (
			            <Cell {...{'title':this.state.myTableData[props.rowIndex].name}} {...props} className={css(styles.newTableBody)}>
			              {this.state.myTableData[props.rowIndex].name}
			            </Cell>
			          )}
			          width={225}
			          fixed={true}
			        />
				    {this.renderTableColumns(this.props.data)}
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
    fontStyle:'normal',
    color:'#111111'
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
})(Raw_Hrr);