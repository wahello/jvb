import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Button} from "reactstrap";
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import Dimensions from 'react-dimensions';
import { StyleSheet, css } from 'aphrodite';


 class Food extends Component{

	constructor(props){
	super(props);
	 this.renderTableColumns = this.renderTableColumns.bind(this);
	 this.getStylesGpaBeforePanalities = this.getStylesGpaBeforePanalities.bind(this);
	 this.getDayWithDate = this.getDayWithDate.bind(this);
	 this.renderLastSync = this.renderLastSync.bind(this);

	 this.state = {
      myTableData: [
        {name: '% Non Processed Food'},
         {name: 'Processed Food Consumed'},
        {name: 'Non Processed Food'},
        {name: 'Diet Type'},       
      ],
    };
  }
getStylesGpaBeforePanalities(score){
      if (score<50)
        return {background:'red',color:'black'};
      else if (score>=50 && score<70)
        return {background:'yellow',color:'black'};
      else if (score >= 70)
        return {background:'green',color:'white'};
      
    }
    renderLastSync(value){
    let time;
    if(value != null){
      time = moment(value).format("MMM DD, YYYY @ hh:mm a")
    }
    return <div style = {{fontSize:"13px"}}>Synced at {time}</div>;
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
					if(key === 'prcnt_non_processed_food'){
						if(value !=='-' && value !==0){
											
						all_data.push({value:value+'%',
									   style:this.getStylesGpaBeforePanalities(value)});
							
					}
					else all_data.push({value:value,
										style:''});
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
			        width={160}
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
		        headerHeight={70}
		        width={containerWidth}
        		height={containerHeight}
        		touchScrollEnabled={true}
        		{...props}>
		        <Column
		          header={<Cell className={css(styles.newTableHeader)}>Food {this.renderLastSync(this.props.last_synced)}</Cell>}
		          cell={props => (
		            <Cell {...{'title':this.state.myTableData[props.rowIndex].name}} {...props} className={css(styles.newTableBody)}>
		              {this.state.myTableData[props.rowIndex].name}
		            </Cell>
		          )}
		          width={150}
		          fixed={true}
		        />
			    {this.renderTableColumns(this.props.data,"food_ql")}
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
    fontSize: '16px', 
    border: 'none',
    fontFamily:'Proxima-Nova',
    fontStyle:'normal'
  }
});



export default Dimensions({
  getHeight: function(element) {
    return window.innerHeight - 170;
  },
  getWidth: function(element) {
    var widthOffset = window.innerWidth < 1024 ? 0 : 3;
    return window.innerWidth - widthOffset;
  }
})(Food);