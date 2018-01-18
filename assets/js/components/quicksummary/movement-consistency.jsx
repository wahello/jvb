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
        {name: '12:00 AM - 12:59 AM'},
        {name: '01:00 AM - 01:59 AM'},
        {name: '02:00 AM - 02:59 AM'}, 
        {name: '03:00 AM - 03:59 AM'},
        {name: '04:00 AM - 04:59 AM'},        
        {name: '05:00 AM - 05:59 AM'},
        {name: '06:00 AM - 06:59 AM'},
        {name: '07:00 AM - 07:59 AM'},
        {name: '08:00 AM - 08:59 AM'},
        {name: '09:00 AM - 09:59 AM'},
        {name: '10:00 AM - 10:59 AM'},
        {name: '11:00 AM - 11:59 AM'},
        {name: '12:00 PM - 12:59 PM'},
        {name: '01:00 PM - 01:59 PM'},
        {name: '02:00 PM - 02:59 PM'},
        {name: '03:00 PM - 03:59 PM'},
        {name: '04:00 PM - 04:59 PM'},
        {name: '05:00 PM - 05:59 PM'},
        {name: '06:00 PM - 06:59 PM'},
        {name: '07:00 PM - 07:59 PM'},
        {name: '08:00 PM - 08:59 PM'},        
        {name: '09:00 PM - 09:59 PM'},
        {name: '10:00 PM - 10:59 PM'},
        {name: '11:00 PM - 11:59 AM'},
        {name: 'Active Hours'},
        {name: 'Inactive Hours'},
        {name: 'Sleeping Hours'},
        {name: 'Total Steps *Total Steps on this chart may differ slightly from overall steps'}              
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
          "12:00 AM to 12:59 AM":{
            steps:'-',
            status:'-'
           },
           "01:00 AM to 01:59 AM":{
            steps:'-',
            status:'-'
           }, 
           "02:00 AM to 02:59 AM":{
            steps:'-',
            status:'-'
           }, 
           "03:00 AM to 03:59 AM":{
            steps:'-',
            status:'-'
           }, 
           "04:00 AM to 04:59 AM":{
            steps:'-',
            status:'-'
           }, 
           "05:00 AM to 05:59 AM":{
            steps:'-',
            status:'-'
           }, 
           "06:00 AM to 06:59 AM":{
            steps:'-',
            status:'-'
           }, 
           "07:00 AM to 07:59 AM":{
            steps:'-',
            status:'-'
           }, 
           "08:00 AM to 08:59 AM":{
            steps:'-',
            status:'-'
           }, 
           "09:00 AM to 09:59 AM":{
            steps:'-',
            status:'-'
           }, 
           "10:00 AM to 10:59 AM":{
            steps:'-',
            status:'-'
           }, 
           "11:00 AM to 11:59 AM":{
            steps:'-',
            status:'-'
           }, 
           "12:00 PM to 12:59 PM":{
            steps:'-',
            status:'-'
           }, 
           "01:00 PM to 01:59 PM":{
            steps:'-',
            status:'-'
           }, 
           "02:00 PM to 02:59 PM":{
            steps:'-',
            status:'-'
           },
           "03:00 PM to 03:59 PM":{
            steps:'-',
            status:'-'
           }, 
           "04:00 PM to 04:59 PM":{
            steps:'-',
            status:'-'
           },
           "05:00 PM to 05:59 PM":{
            steps:'-',
            status:'-'
           },
           "06:00 PM to 06:59 PM":{
            steps:'-',
            status:'-'
           }, 
           "07:00 PM to 07:59 PM":{
            steps:'-',
            status:'-'
           }, 
           "08:00 PM to 08:59 PM":{
            steps:'-',
            status:'-'
           },
           "09:00 PM to 09:59 PM":{
            steps:'-',
            status:'-'
           }, 
           "10:00 PM to 10:59 PM":{
            steps:'-',
            status:'-'
           },
           "11:00 PM to 11:59 PM":{
            steps:'-',
            status:'-'
           }, 
           active_hours:'-',
           inactive_hours:'-',
           sleeping_hours:'-',
           total_steps:'-'
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
    const sortedDate = ["12:00 AM to 12:59 AM","01:00 AM to 01:59 AM","02:00 AM to 02:59 AM",
    "03:00 AM to 03:59 AM","04:00 AM to 04:59 AM","05:00 AM to 05:59 AM","06:00 AM to 06:59 AM",
    "07:00 AM to 07:59 AM","08:00 AM to 08:59 AM","09:00 AM to 09:59 AM","10:00 AM to 10:59 AM",
    "11:00 AM to 11:59 AM","12:00 PM to 12:59 PM","01:00 PM to 01:59 PM","02:00 PM to 02:59 PM",
    "03:00 PM to 03:59 PM","04:00 PM to 04:59 PM","05:00 PM to 05:59 PM","06:00 PM to 06:59 PM",
    "07:00 PM to 07:59 PM","08:00 PM to 08:59 PM","09:00 PM to 09:59 PM","10:00 PM to 10:59 PM",
    "11:00 PM to 11:59 PM"];
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
      steps_data.push(data['movement_consistency'].sleeping_hours);
      steps_data.push(data['movement_consistency'].total_steps);
      
      columns.push(
        <Column 
          header={<Cell className={css(styles.newTableHeader)}>Steps</Cell>}
              cell={props => (
                    <Cell {...{'title':steps_data[props.rowIndex]}} {...props} className={css(styles.newTableBody)}>
                      {steps_data[props.rowIndex]}
                    </Cell>
                  )}
              width={110}
        />
      );
      columns.push(
        <Column 
          header={<Cell className={css(styles.newTableHeader)}>Status</Cell>}
              cell={props => (
                    <Cell {...{'title':status_data[props.rowIndex]}} {...props} className={css(styles.newTableBody)}>
                      {status_data[props.rowIndex]}
                    </Cell>
                  )}
              width={1000}
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
          rowHeight={65}
          headerHeight={65}
          width={containerWidth}
          maxHeight={containerHeight}
              touchScrollEnabled={true}
              {...props}>
          <Column
            header={<Cell className={css(styles.newTableHeader)}>Movement Consistency</Cell>}
            cell={props => (
              <Cell {...{'title':this.state.tableAttrColumn[props.rowIndex].name}} {...props} className={css(styles.newTableBody)}>
                {this.state.tableAttrColumn[props.rowIndex].name}
              </Cell>
            )}
            width={130}
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
    textAlign:'center',
    color: '#111111',
    fontSize: '18px',   
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
    return window.innerHeight - 192;
  },
  getWidth: function(element) {
    var widthOffset = window.innerWidth < 1024 ? 0 :1150;
    return window.innerWidth - widthOffset;
  }
})(Movementquick);