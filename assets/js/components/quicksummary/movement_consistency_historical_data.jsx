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
  }

renderTableColumns(dateWiseData,category,classes=""){
    let columns = [];
    for(let [date,data] of Object.entries(dateWiseData)){
      console.log(date);
      columns.push(
      <Column    
         cell= {<Cell className={css(styles.newTableHeader)}>{date}</Cell>}
          />
             
      )
    }

    
  return columns;
}

 render(){
    const {height, width, containerHeight, containerWidth, ...props} = this.props;
    return(
      <div>
       <div>
       <Table
            rowsCount={10}
            rowHeight={65}
            headerHeight={50}
            width={containerWidth}
            height={containerHeight}
            touchScrollEnabled={true}
            {...props}>
            <Column
              header={<Cell className={css(styles.newTableHeader)}>Movement Consistency Historical Data</Cell>}
              cell={<Cell data={this.renderTableColumns}></Cell>}
              width={150}
              fixed={true}
            />
         
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
    return window.innerHeight - 172;
  },
  getWidth: function(element) {
    var widthOffset = window.innerWidth < 1024 ? 0 : 3;
    return window.innerWidth - widthOffset;
  }
})(MovementHistorical);