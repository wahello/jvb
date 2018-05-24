import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Button} from "reactstrap";
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import Dimensions from 'react-dimensions';
import { StyleSheet, css } from 'aphrodite';

class Steps extends Component{

	constructor(props){
	super(props);
	 this.renderTableColumns = this.renderTableColumns.bind(this);
	 this.getDayWithDate = this.getDayWithDate.bind(this);
	 this.renderLastSync = this.renderLastSync.bind(this);
	 this.renderGetColors = this.renderGetColors.bind(this);
	 this.renderStepsColor = this.renderStepsColor.bind(this);


	 this.state = {
      myTableData: [
	    {name: 'Movement Consistency'},
        {name: 'Non Exercise Steps'},
        {name: 'Exercise Steps'},  
        {name: 'Total Steps'},
        {name: 'Floors Climed'},
        {name: 'Weight'}
      ],
    };
  }
getDayWithDate(date){
   let d = moment(date,'M-D-YY');
   let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
   let dayName = days[d.day()] ;
   return date +"\n"+ dayName;
  }
  renderGetColors(hours_inactive){
    if (hours_inactive <= 4.5){
        return {background:'green',color:'white'};
    }
    else if (hours_inactive > 4.5 && hours_inactive <= 6){
       return {background:'#32CD32',color:'white'};
    }
    else if (hours_inactive > 6 && hours_inactive <= 7){
       return {background:'yellow',color:'black'};
    }
    else if (hours_inactive > 7 && hours_inactive <= 10){
       return {background:'#FF8C00',color:'black'};
    }
    else if (hours_inactive > 10){
        return {background:'red',color:'black'};
    }
  }
  renderStepsColor(steps){
	if (steps >= 10000){
        return {background:'green',color:'white'};
	}
    else if (steps <= 9999 && steps >= 7500){
       return {background:'#32CD32',color:'white'};
    }
    else if (steps <= 7499 && steps >= 5000){
      return {background:'yellow',color:'black'};
    }
    else if (steps <= 4999 && steps >= 3500){
       return {background:'#FF8C00',color:'black'};
    }
    else if (steps < 3500){
        return {background:'red',color:'black'};
    }
  }
  renderLastSync(value){
    let time;
    if(value != null){
      time = moment(value).format("MMM DD, YYYY @ hh:mm a")
    }
    return <div style = {{fontSize:"13px"}}>Synced at {time}</div>;
}
renderTableColumns(dateWiseData,category,classes=""){
		let columns = [];
		for(let [date,data] of Object.entries(dateWiseData)){
			let all_data = [];

			for(let [key,value] of Object.entries(data[category])){
				console.log("**********",key);
				if(key !== 'id' && key !== 'user_ql'){  
					if (key == 'movement_consistency'){
	                    let mc = value;
	                    if( mc != undefined && mc != "" && mc != "-"){
	                        mc = JSON.parse(mc);
	                        all_data.push({value:mc.inactive_hours,
	                        			   style:this.renderGetColors(mc.inactive_hours)});
	                	}else{
	                		all_data.push({value:'-',
	                						style:""})
	                	}
	            	}
	            	else if(key == "non_exercise_steps"){
	            		all_data.push({value:value,
	            						style:this.renderStepsColor(value)});
	            	}
	            	else if(key == "weight"){
	            		if(value == "i do not weigh myself today" || value == "" || value == undefined){
	            			all_data.push({value:"Not Measured",
	            							style:""})
	            		}
	            		else{
	            			all_data.push({value:value,
	            							style:""});
	            		}
	            	}

	                else{
						value += '';
		             	var x = value.split('.');
		            	var x1 = x[0];
			            var x2 = x.length > 1 ? '.' + x[1] : '';
			            var rgx = /(\d+)(\d{3})/;
			            while (rgx.test(x1)) {
				        x1 = x1.replace(rgx, '$1' + ',' + '$2');
			            }
					    all_data.push({value:x1 + x2,
					    				style:""});                  
					}
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
		          header={<Cell className={css(styles.newTableHeader)}>Steps</Cell>}
		          cell={props => (
		            <Cell {...{'title':this.state.myTableData[props.rowIndex].name}} {...props} className={css(styles.newTableBody)}>
		              {this.state.myTableData[props.rowIndex].name}
		            </Cell>
		          )}
		          width={150}
		          fixed={true}
		        />
			    {this.renderTableColumns(this.props.data,"steps_ql")}
      		</Table>
			</div>
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
})(Steps);