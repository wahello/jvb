import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Button} from "reactstrap";
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import Dimensions from 'react-dimensions';
import { StyleSheet, css } from 'aphrodite';
import {getUserProfile} from '../../network/auth';

class Alcohol extends Component{

	constructor(props) {
    super(props);
    this.renderTableColumns = this.renderTableColumns.bind(this);  
this.onProfileSuccessFetch=this.onProfileSuccessFetch.bind(this);
    this.state = {
    	gender:'M',
      myTableData: [
        {name: '# of Alcohol Drinks Consumed Yesterday'},
        {name: '# of Drinks Consumed Over the Last 7 Days'},       
      ],
    };
  }


onProfileSuccessFetch(data){
      this.setState({
        gender:data.data.gender
      });
    }
    
componentDidMount(){
     
      getUserProfile(this.onProfileSuccessFetch);
      
    }

 	renderTableColumns(dateWiseData,category,classes=""){
		let columns = [];
   
		 
		for(let [date,data] of Object.entries(dateWiseData)){
			let all_data = [];
			for(let [key,value] of Object.entries(data[category])){  
       			if(key !== 'id' && key !== 'user_ql' ){

              if((key == 'alcohol_day' || key == 'alcohol_week') && (value == ''  && value != '0')) {
              
                value ='Not Reported';
                 all_data.push(value);
            }else{
              all_data.push(value);
           }
          }    
              
			}

			columns.push(
				<Column 
					header={<Cell className={css(styles.newTableHeader)}>{date}</Cell>}
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
		          header={<Cell className={css(styles.newTableHeader)}>Alcohol</Cell>}
		          cell={props => (
		            <Cell {...{'title':this.state.myTableData[props.rowIndex].name}} {...props} className={css(styles.newTableBody)}>
		              {this.state.myTableData[props.rowIndex].name}
		            </Cell>
		          )}
		          width={165}
		          fixed={true}
		        />
			    {this.renderTableColumns(this.props.data,"alcohol_ql")}
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
    return window.innerHeight - 172;
  },
  getWidth: function(element) {
    var widthOffset = window.innerWidth <1024 ? 0 : 3;
    return window.innerWidth - widthOffset;
  }
})(Alcohol);





