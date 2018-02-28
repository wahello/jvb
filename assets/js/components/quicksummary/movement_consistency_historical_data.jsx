import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Button} from "reactstrap";
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import Dimensions from 'react-dimensions';
import { StyleSheet, css } from 'aphrodite';

class MovementHistorical extends Component{
	constructor(props){
    super(props);
    this.renderTableColumns = this.renderTableColumns.bind(this);

    this.state = {
      myTableData: []
    }

    var p = this.props.data;

    for(var key in p) {
      this.state.myTableData.push({name: key})
    }
  }

renderTableColumns(dateWiseData,category,classes=""){
    let columns = [];
                   let obj ={
                      "12:00 AM to 12:59 AM" : [],
                      "01:00 AM to 01:59 AM" : [],
                      "02:00 AM to 02:59 AM" : [],
                      "03:00 AM to 03:59 AM" : [],
                      "04:00 AM to 04:59 AM" : [],
                      "05:00 AM to 05:59 AM" : [],
                      "06:00 AM to 06:59 AM" : [],
                      "07:00 AM to 07:59 AM" : [],
                      "08:00 AM to 08:59 AM" : [],
                      "09:00 AM to 09:59 AM" : [],
                      "10:00 AM to 10:59 AM" : [],
                      "11:00 AM to 11:59 AM" : [],
                      "12:00 PM to 12:59 PM" : [],
                      "01:00 PM to 01:59 PM" : [],
                      "02:00 PM to 02:59 PM" : [],
                      "03:00 PM to 03:59 PM" : [],
                      "04:00 PM to 04:59 PM" : [],
                      "05:00 PM to 05:59 PM" : [],
                      "06:00 PM to 06:59 PM" : [],
                      "07:00 PM to 07:59 PM" : [],
                      "08:00 PM to 08:59 PM" : [],
                      "09:00 PM to 09:59 PM" : [],
                      "10:00 PM to 10:59 PM" : [],
                      "11:00 PM to 11:59 PM" : []
                          };

    console.log(dateWiseData, this.state.myTableData);
                          
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
            rowHeight={65}
            headerHeight={50}
            width={containerWidth}
            height={containerHeight}
            touchScrollEnabled={true}
            {...props}>
            <Column
              header={<Cell className={css(styles.newTableHeader)}>Movement Consistency Historical Data</Cell>}

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
    return window.innerHeight - 200;
  },
  getWidth: function(element) {
    var widthOffset = window.innerWidth < 1024 ? 0 : 3;
    return window.innerWidth - widthOffset;
  }
})(MovementHistorical);