import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Button} from "reactstrap";
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import Dimensions from 'react-dimensions';
import { StyleSheet, css } from 'aphrodite';
import NumberFormat from 'react-number-format';

 class Grades extends Component{


	constructor(props){
	super(props);
	 this.renderTableColumns = this.renderTableColumns.bind(this);
   this.getStylesGpaBeforePanalities = this.getStylesGpaBeforePanalities.bind(this);
   this.getDayWithDate = this.getDayWithDate.bind(this); 
   this.userInputsColor = this.userInputsColor.bind(this);

   this.state = {
      myTableData: [
        {name: 'Overall Health Grade'},
        {name: 'Overall Health GPA'},
        {name: 'Non Exercise steps Grade'},   
        {name: 'Non Exercise steps'},
        {name: 'Movement Consistency Grade'},
        {name: 'Movement Consistency Score'}, 
        {name: 'Avg Sleep Per Night Grade'},
        {name: 'Avg Sleep Per Night'},
        {name: 'Exercise Consistency Grade'},
        {name: 'Did You Workout Today'},
        {name: 'Exercise Consistency Score'},
        {name: '% Unprocessed Food Grade'},
        {name: '% Unprocessed Food'}, 
        {name: 'Alcoholic Drink Per Week Grade'},
        {name: '# of Drinks Consumed Over the Last 7 Days'},
        {name: 'Sleep Aid Penalty'},
        {name: 'Controlled Substance Penalty'},
        {name: 'Smoking Penalty'}, 
        {name:'Overall Health GPA Before Penalties'},
        {name:'Did you Report your Inputs Today?'},
        // {name:'NOT GRADED CATEGORIES'},
        // {name:'Resting Heart Rate'},
        // {name:'Stress Level'},
        // {name:'Did you Stand for 3 hours or more above and beyond your exercise yesterday?'},
        
        // {name:'PERFORMANCE ASSESSMENT'},
        // {name: 'Overall Workout Grade '},
        // {name: 'Overall Workout Score (points)'},
        // {name: 'Workout Duration Grade'},   
        // {name: 'Workout Duration'},
        // {name: 'Workout Effort Level Grade'},
        // {name: 'Workout Effort Level'}, 
        // {name: 'Average Exercise Heart Rate Grade'},
        // {name: 'Average Exercise Heart Rate'},
        // {name: 'Heart Rate Recovery (HRR) - time to 99'},
        // {name: 'Heart Rate Recovery (HRR) - heart beats lowered in the first minute '},
        // {name: 'VO2 Max'}, 
        // {name: 'Floors Climbed '},          
      ],
    };
  }
  getDayWithDate(date){
   let d = moment(date,'M-D-YY');
   let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
   let dayName = days[d.day()] ;
   return date +"\n"+ dayName;
  }
getStylesGpaBeforePanalities(score){
      if (score<1)
        return {background:'red',color:'black'};
      else if (score >= 1 && score < 3)
        return {background:'yellow',color:'black'};
      else if (score >= 3)
        return {background:'green',color:'black'};
    }
userInputsColor(value){
  if(value == "No")
    return {background:'red',color:'black'};
}

renderTableColumns(dateWiseData,category,classes=""){
    let columns = [];
    const obj = {
        A: { background: 'green', color: 'white'},
        B: { background: 'green', color: 'white' },
        C: { background: 'yellow', color:'black' },
        D: { background: 'yellow', color:'black' },
        F: { background: 'red', color: 'black' },
        penalty:{background: 'red', color: 'black' },        
    };
  
    for(let [date,data] of Object.entries(dateWiseData)){
        let all_data = [];
        for(let [key,value] of Object.entries(data[category])){
            if(key !== 'id' && key !== 'user_ql'){
            
            if(key == "resting_hr" || key == "overall_workout_grade"){
              all_data.push({
                  value:'',
                  style:''
                });
            }
            if(key === 'overall_health_gpa' ){
               var i = parseFloat(value);
               if(isNaN(i)) { i = 0.00; }
               var minus = '';
               if(i < 0) { minus = '-'; }
               i = Math.abs(i);
               i = parseInt((i + .005) * 100);
               i = i / 100;
               var s = new String(i);
               if(s.indexOf('.') < 0) { s += '.00'; }
               if(s.indexOf('.') == (s.length - 2)) { s += '0'; }
               s = minus + s;
               all_data.push({value: s});
            }
           else if(key =='movement_non_exercise_steps' ){
              all_data.push({
                    value: value.toLocaleString(),
                    style: obj[value]
                });
            }
            // else if((key =='movement_consistency_grade' || key =='overall_health_grade' || 
            //   key =='overall_health_gpa' ||  key =='movement_non_exercise_steps_grade' || 
            //   key =='movement_non_exercise_steps' ||  key =='movement_consistency_score' || 
            //   key =='avg_sleep_per_night_grade' ||  key =='avg_sleep_per_night' || 
            //   key =='exercise_consistency_grade' ||  key =='workout_today' || 
            //   key =='exercise_consistency_score' ||  key =='prcnt_unprocessed_food_consumed_grade' || 
            //   key =='prcnt_unprocessed_food_consumed' ||  key =='alcoholic_drink_per_week_grade' || 
            //   key =='alcoholic_drink_per_week' ||  key =='sleep_aid_penalty' || 
            //   key =='ctrl_subs_penalty' ||  key =='smoke_penalty' || 
            //   key =='overall_health_gpa_before_panalty'  ) && (value ==' ' )){
            //      all_data.push({
            //         value: 'Not Reported',
            //         style: obj[value]
            //     });
            // }
            else if(key === 'overall_health_gpa_before_panalty' ){
               var i = parseFloat(value);
               if(isNaN(i)) { i = 0.00; }
               var minus = '';
               if(i < 0) { minus = '-'; }
               i = Math.abs(i);
               i = parseInt((i + .005) * 100);
               i = i / 100;
               var s = new String(i);
               if(s.indexOf('.') < 0) { s += '.00'; }
               if(s.indexOf('.') == (s.length - 2)) { s += '0'; }
               s = minus + s;
               all_data.push({value: s,
                style:this.getStylesGpaBeforePanalities(parseFloat(s))});
            }
            else  if(key === 'exercise_consistency_score' ){
               var i = parseFloat(value);
               if(isNaN(i)) { i = 0.00; }
               var minus = '';
               if(i < 0) { minus = '-'; }
               i = Math.abs(i);
               i = parseInt((i + .005) * 100);
               i = i / 100;
               var s = new String(i);
               if(s.indexOf('.') < 0) { s += '.00'; }
               if(s.indexOf('.') == (s.length - 2)) { s += '0'; }
               s = minus + s;
               all_data.push({value: s});
            }
            
            else if(key == 'smoke_penalty' || key ==  'ctrl_subs_penalty' || key == 'sleep_aid_penalty'){
              if(value && value != "-"){
                all_data.push({
                  value:'Yes',
                  style:obj['penalty']
                });
              }
              else{
                all_data.push({
                  value:'No',
                  style:''
                });
              }
            }
            else if(key == 'submitted_user_input'){
                all_data.push({
                  value:value,
                  style:this.userInputsColor(value)
                });
            }
            else if(key == 'movement_consistency_score'){
              let mc = value;
              if( mc != undefined && mc != "" && mc != "-"){
                mc = JSON.parse(mc);
                all_data.push({
                  value: mc.inactive_hours,
                  style:''
                  });
              }else
                all_data.push({
                  value:'Not Reported',
                  style:''
                });
            }
            else if(value == ''  ){
                all_data.push({
                    value: 'Not Reported',
                    style: obj[value]
                });
            }
            else {
                all_data.push({
                    value: value,
                    style: obj[value]
                });
            }
            }
        }

        columns.push(
            <Column
                header={<Cell className={css(styles.newTableHeader)}>{this.getDayWithDate(date)}</Cell>}
                cell={props => (
                    <Cell style={all_data[props.rowIndex].style}  {...{'title':all_data[props.rowIndex].value}} {...props} className={css(styles.newTableBody)}>
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
        className="responsive"
            rowsCount={rowsCount}
            rowHeight={50}
            headerHeight={60}
            width={containerWidth}
            height={containerHeight}
            touchScrollEnabled={true}
                
            {...props}>
            <Column
              header={<Cell className={css(styles.newTableHeader)}>Grades</Cell>}
              cell={props => (
                <Cell {...{'title':this.state.myTableData[props.rowIndex].name}} {...props} className={css(styles.newTableBody)}>
                  {this.state.myTableData[props.rowIndex].name}
                </Cell>
              )}
              width={170}
              fixed={true}
            />
          {this.renderTableColumns(this.props.data,"grades_ql")}
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
    var widthOffset = window.innerWidth < 1024 ? 0 : 3;
    return window.innerWidth - widthOffset;
  }
})(Grades);