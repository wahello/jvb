import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Button} from "reactstrap";
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import Dimensions from 'react-dimensions';
import { StyleSheet, css } from 'aphrodite';

import {fetchMovementConsistency} from '../../network/quick';
var CalendarWidget = require('react-calendar-widget');  

var ReactDOM = require('react-dom');


class Movementquick extends Component{
  constructor(props){
    super(props);
    this.errorMCFetch = this.errorMCFetch.bind(this);
    this.successMCFetch = this.successMCFetch.bind(this);
    this.processDate = this.processDate.bind(this);
    this.renderTableColumns = this.renderTableColumns.bind(this);

     this.state = {
       tableAttrColumn: [
        {name: '12 AM - 01 AM'},
        {name: '01 AM - 02 AM'},
        {name: '02 AM - 03 AM'}, 
        {name: '03 AM - 04 AM'},
        {name: '04 AM - 05 AM'},        
        {name: '05 AM - 06 AM'},
        {name: '06 AM - 07 AM'},
        {name: '07 AM - 08 AM'},
        {name: '08 AM - 09 AM'},
        {name: '09 AM - 10 AM'},
        {name: '10 AM - 11 AM'},
        {name: '11 AM - 12 AM'},
        {name: '12 PM - 01 PM'},
        {name: '01 PM - 02 PM'},
        {name: '02 PM - 03 PM'},
        {name: '03 PM - 04 PM'},
        {name: '04 PM - 05 PM'},
        {name: '05 PM - 06 PM'},
        {name: '06 PM - 07 PM'},
        {name: '07 PM - 08 PM'},
        {name: '08 PM - 09 PM'},        
        {name: '09 PM - 10 PM'},
        {name: '10 PM - 11 PM'},
        {name: '11 PM - 12 AM'},
        {name: 'Active-Hours'},
        {name: 'Inactive-Hours'},              
       ],
       mc_data:[],
       selectedDate: new Date()                      
      };
  }

  errorMCFetch(error){
    const initial_data = [
      {
         created_at:"-",
         movement_consistency: {
          "12 AM to 01 AM":{
            steps:'-',
            status:'-'
           },
           "01 AM to 02 AM":{
            steps:'-',
            status:'-'
           }, 
           "02 AM to 03 AM":{
            steps:'-',
            status:'-'
           }, 
           "03 AM to 04 AM":{
            steps:'-',
            status:'-'
           }, 
           "04 AM to 05 AM":{
            steps:'-',
            status:'-'
           }, 
           "05 AM to 06 AM":{
            steps:'-',
            status:'-'
           }, 
           "06 AM to 07 AM":{
            steps:'-',
            status:'-'
           }, 
           "07 AM to 08 AM":{
            steps:'-',
            status:'-'
           }, 
           "08 AM to 09 AM":{
            steps:'-',
            status:'-'
           }, 
           "09 AM to 10 AM":{
            steps:'-',
            status:'-'
           }, 
           "10 AM to 11 AM":{
            steps:'-',
            status:'-'
           }, 
           "11 AM to 12 PM":{
            steps:'-',
            status:'-'
           }, 
           "12 PM to 01 PM":{
            steps:'-',
            status:'-'
           }, 
           "01 PM to 02 PM":{
            steps:'-',
            status:'-'
           }, 
           "02 PM to 03 PM":{
            steps:'-',
            status:'-'
           },
           "03 PM to 04 PM":{
            steps:'-',
            status:'-'
           }, 
           "04 PM to 05 PM":{
            steps:'-',
            status:'-'
           },
           "05 PM to 06 PM":{
            steps:'-',
            status:'-'
           },
           "06 PM to 07 PM":{
            steps:'-',
            status:'-'
           }, 
           "07 PM to 08 PM":{
            steps:'-',
            status:'-'
           }, 
           "08 PM to 09 PM":{
            steps:'-',
            status:'-'
           },
           "09 PM to 10 PM":{
            steps:'-',
            status:'-'
           }, 
           "10 PM to 11 PM":{
            steps:'-',
            status:'-'
           },
           "11 PM to 12 AM":{
            steps:'-',
            status:'-'
           }, 
           active_hours:'-',
           inactive_hours:'-'
         }
      }
    ];
    this.setState({
      mc_data:initial_data
    });
  }

  successMCFetch(data){
    if(data.data.length){
      this.setState({
          mc_data : data.data
        });
    }else{
      this.errorMCFetch(data);
    }
  }

  getSortKeysAccordingTime(data){
    const sortedDate = ["12 AM to 01 AM","01 AM to 02 AM","02 AM to 03 AM","03 AM to 04 AM",
    "04 AM to 05 AM","05 AM to 06 AM","06 AM to 07 AM","07 AM to 08 AM","08 AM to 09 AM",
    "09 AM to 10 AM","10 AM to 11 AM","11 AM to 12 PM","12 PM to 01 PM","01 PM to 02 PM",
    "02 PM to 03 PM","03 PM to 04 PM","04 PM to 05 PM","05 PM to 06 PM","06 PM to 07 PM",
    "07 PM to 08 PM","08 PM to 09 PM","09 PM to 10 PM","10 PM to 11 PM","11 PM to 12 AM"];
    return sortedDate;
  }

  processDate(selectedDate){
    this.setState({
      selectedDate: selectedDate,
    },()=>{
      fetchMovementConsistency(this.state.selectedDate,this.successMCFetch,this.errorMCFetch);
    });
  }

  componentDidMount(){
    fetchMovementConsistency(this.state.selectedDate,this.successMCFetch,this.errorMCFetch);
  }

 renderTableColumns(dateWiseData){
    let columns = [];
    for(let data of dateWiseData) {
      let steps_data = [];
      let status_data = [];
      for(let slot of this.getSortKeysAccordingTime()){
          steps_data.push(data['movement_consistency'][slot].steps);
          status_data.push(data['movement_consistency'][slot].status);
        }
      steps_data.push(data['movement_consistency'].active_hours);
      steps_data.push(data['movement_consistency'].inactive_hours);
      
      columns.push(
        <Column 
          header={<Cell className={css(styles.newTableHeader)}>Steps</Cell>}
              cell={props => (
                    <Cell {...props} className={css(styles.newTableBody)}>
                      {steps_data[props.rowIndex]}
                    </Cell>
                  )}
              width={132}
        />
      );
      columns.push(
        <Column 
          header={<Cell className={css(styles.newTableHeader)}>Status</Cell>}
              cell={props => (
                    <Cell {...props} className={css(styles.newTableBody)}>
                      {status_data[props.rowIndex]}
                    </Cell>
                  )}
              width={132}
        />
      );
    }
    return columns;
  }

render(){
  const {height, width, containerHeight, containerWidth, ...props} = this.props;
  let rowsCount = this.state.tableAttrColumn.length;
      
  return(
    <div className="row justify-content-center">
    <div>
     <CalendarWidget onDaySelect={this.processDate}/>,
    </div>
     <Table
          rowsCount={rowsCount}
          rowHeight={100}
          headerHeight={65}
          width={containerWidth}
          maxHeight={containerHeight}
              touchScrollEnabled={true}
              {...props}>
          <Column
            header={<Cell className={css(styles.newTableHeader)}>Movement Consistency</Cell>}
            cell={props => (
              <Cell {...props} className={css(styles.newTableBody)}>
                {this.state.tableAttrColumn[props.rowIndex].name}
              </Cell>
            )}
            width={167}
            fixed={true}
          />
         {this.renderTableColumns(this.state.mc_data)}
        </Table>
    </div>

    );
  }
}

const styles = StyleSheet.create({
  newTableHeader: {
    color: '#111111',
    fontSize: '18px',   
    border: 'none',
    fontFamily:'Proxima-Nova',
    fontStyle:'normal'
  },
  newTableBody:{
    color: '#5e5e5e',
    fontSize: '16px', 
    border: 'none',
    fontFamily:'Proxima-Nova',
    fontStyle:'normal'
  }
});

export default Dimensions({
  getHeight: function(element) {
    return window.innerHeight - 217;
  },
  getWidth: function(element) {
    var widthOffset = window.innerWidth < 1024 ? 0 :940;
    return window.innerWidth - widthOffset;
  }
})(Movementquick);