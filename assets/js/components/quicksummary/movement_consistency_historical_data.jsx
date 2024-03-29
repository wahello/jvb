import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import { withRouter} from 'react-router-dom'
import {Button} from "reactstrap";
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import Dimensions from 'react-dimensions';
import { StyleSheet, css } from 'aphrodite';
import _ from 'lodash';

import {fetchMovementConsistency} from '../../network/quick';

class MovementHistorical extends Component{
	constructor(props){
    super(props);
    this.renderTableColumns = this.renderTableColumns.bind(this);
    this.mcHistoricalData = this.mcHistoricalData.bind(this);
    this.dailyMC = this.dailyMC.bind(this);
    this.getDayWithDate = this.getDayWithDate.bind(this);
    this.renderLastSync = this.renderLastSync.bind(this);

    this.state = {
      tableRowHeader: [{name:"% of Days User Get 300 Steps in the Hour"}],
      uidMCData:null
    }

    var p = this.props.data;

    for(var key in p) {
      this.state.tableRowHeader.push({name: key})
    }
  }

  uidMCDataSuccess = (data) => {
    let uidMCData = {}
    let queryParams = new URLSearchParams(this.props.location.search)
    let startDate = moment(queryParams.get('start_date'))
    let endDate = moment(queryParams.get('end_date'))

    uidMCData[endDate.format('M-D-YY')] = "-";
    let diff = endDate.diff(startDate, 'days');
    let tmp_end_date = moment(endDate);
    for(let i=0; i<diff; i++){
      let dt = tmp_end_date.subtract(1,'days');
      let current_dt = dt.format('M-D-YY');
      uidMCData[current_dt]="-";
    }
    for(let mc of data.data){
      let created_at = moment(mc.created_at).format('M-D-YY');
      if(!_.isEmpty(mc.movement_consistency))
        uidMCData[created_at] = mc.movement_consistency
      else
        uidMCData[created_at] = "-"
    }

    let tableRowHeader = [{name:"% of Days User Get 300 Steps in the Hour"}]
    for(var key in uidMCData) {
      tableRowHeader.push({name: key})
    }

    this.setState({
      tableRowHeader,
      uidMCData
    })
  }

  uidMCDataFailed = (error) => {
    console.log(error);
  }

  getUIDMCData = (uid,start_date,end_date) => {
    fetchMovementConsistency(start_date,
      this.uidMCDataSuccess,
      this.uidMCDataFailed,
      end_date,uid)
  }

  getDayWithDate(date){
   let d = moment(date,'M-D-YY');
   let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
   let dayName = days[d.day()] ;
   return date +"\n"+ dayName;
  }

  componentDidMount(){
    let queryParams = new URLSearchParams(this.props.location.search)
    let startDate = queryParams.get('start_date')
    let endDate = queryParams.get('end_date')
    let uid = queryParams.get('uid')
    if(startDate && endDate && uid){
      this.getUIDMCData(uid,startDate,endDate);
    }
  }

mcHistoricalData(score,status){
      if(status == "sleeping")
        return {background:'rgb(0,176,240)',color:'white'}
      else if(status == "inactive")
         return {background:'red',color:'white'}
      else if(status == "strength")
        return {background:"rgb(255,0,255)",color:'white'}
      else if(status == "exercise"){
        return {background:"#FD9A44",color:'black'}
      }
      else if(status == "no data yet"){
        return {background:" #A5A7A5",color:'white'}
      }
      else if(status == 'time zone change'){
        return {background:'#fdeab7',color:'black'}
      }
      else if(status == 'nap'){
        return {background:'#107dac',color:'white'}
      }
      else if (score >= 300 )
        return {background:'green', color:'white'};
}

dailyMC(score,status){
      if (score <= 5 )
        return {background:'green', color:'white'};
      else if (score > 5 && score <= 10)
        return {background:'yellow', color:'black'};
      else if (score > 10 )
        return {background:'red', color:'white'};
}

renderLastSync(value){
    let time;
    if(value != null){
      time = moment(value).format("MMM DD, YYYY @ hh:mm a")
    }
    return <div style = {{fontSize:"13px"}}>Synced at {time}</div>;
}

renderTableColumns(mcDatewise, start_date, end_date){
    let columns = [];
    let obj ={ 
            "dmc" :[],
            "total_steps" : [],
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
            "11:00 PM to 11:59 PM" : [],
            "active_hours" : [],
            "inactive_hours" : [],
            "sleeping_hours" : [],
            "nap_hours":[],
            "strength_hours" : [],
            "exercise_hours" : [],
            "no_data_hours": [],
            "timezone_change_hours": [],
            "total_active_minutes": [],
            "total_active_prcnt": [],
            "total_steps" : []
          };
        
        // let start_dt = moment(this.props.start_date);
        // let end_dt = moment(this.props.end_date);
        let duration = end_date.diff(start_date,'days') + 1;

    for(let [date,mc] of Object.entries(mcDatewise)){
        if( mc != undefined && mc != "" && mc != "-"){                      
            for(let time of Object.keys(obj)){
                if(time !== 'dmc'){
                    let mCdata = mc[time];
                    if(time == "inactive_hours"){
                        obj[time].push({value:mc.inactive_hours?mc.inactive_hours:0,
                            extra:"",
                            style:{}});
                            obj["dmc"].push({value:mc.inactive_hours,
                            extra:"",
                            style:this.dailyMC(mc.inactive_hours)
                        });
                    }
                    else if (time == "active_hours")
                        obj[time].push({value:mc.active_hours?mc.active_hours:0,
                            extra:"",
                            style:{}
                        });
                    else if (time == "strength_hours")
                        obj[time].push({value:mc.strength_hours?mc.strength_hours:0,
                            extra:"",
                            style:{}
                        });
                    else if (time == "exercise_hours")
                        obj[time].push({value:mc.exercise_hours?mc.exercise_hours:0,
                        extra:"",
                        style:{}
                    });
                    else if (time == "sleeping_hours")
                        obj[time].push({value:mc.sleeping_hours?mc.sleeping_hours:0,
                        extra:"",
                        style:{}
                    });
                    else if (time == "no_data_hours")
                        obj[time].push({value:mc.no_data_hours?mc.no_data_hours:0,
                        extra:"",
                        style:{}
                    });
                    else if (time == "timezone_change_hours")
                        obj[time].push({value:mc.timezone_change_hours?mc.timezone_change_hours:0,
                        extra:"",
                        style:{}
                    });
                    else if (time == "nap_hours")
                        obj[time].push({value:mc.nap_hours?mc.nap_hours:0,
                        extra:"",
                        style:{}
                    });
                    else if (time == "total_active_minutes")
                        obj[time].push({
                            value:mc.total_active_minutes?mc.total_active_minutes:0,
                            extra:"",
                            style:{}
                        });
                    else if (time == "total_active_prcnt")
                        obj[time].push({
                            value:mc.total_active_prcnt?mc.total_active_prcnt:0,
                            extra:"",
                            style:{}
                        }); 
                    else if (time == "total_steps"){
                        let totalSteps = mc.total_steps;
                        if(totalSteps != undefined){
                            totalSteps += '';
                            var x = totalSteps.split('.');
                            var x1 = x[0];
                            var x2 = x.length > 1 ? '.' + x[1] : '';
                            var rgx = /(\d+)(\d{3})/;
                            while (rgx.test(x1)) {
                                x1 = x1.replace(rgx, '$1' + ',' + '$2');
                            }
                            obj[time].push({value:x1 + x2,
                                extra:"",
                                style:{}
                            });
                        }
                    }
                    else if(mCdata.status == "no data yet"){
                        obj[time].push({
                            value:"No Data Yet",
                            extra:(mCdata.active_prcnt != null || mCdata.active_prcnt != undefined
                            ?" ( " + mCdata.active_prcnt + "% )":""),
                            style:this.mcHistoricalData(mCdata.steps,mCdata.status)
                        });
                    }
                    else{
                        obj[time].push({
                            value:mCdata.steps,
                            extra:(mCdata.active_prcnt != null || mCdata.active_prcnt != undefined 
                            ?" ( " + mCdata.active_prcnt + "% )":""),
                            style:this.mcHistoricalData(mCdata.steps,mCdata.status)
                        });
                    }
                }
            }
        }else{
            for(let [time,mCdata] of Object.entries(obj)){
                obj[time].push({value:'-',
                    extra:"",
                    style:""}
                );
            }
        }
    }      

    let verbose_name = {
        "12:00 AM to 12:59 AM" : "12:00 AM to 12:59 AM",
        "01:00 AM to 01:59 AM" : "01:00 AM to 01:59 AM",
        "02:00 AM to 02:59 AM" : "02:00 AM to 02:59 AM",
        "03:00 AM to 03:59 AM" : "03:00 AM to 03:59 AM",
        "04:00 AM to 04:59 AM" : "04:00 AM to 04:59 AM",
        "05:00 AM to 05:59 AM" : "05:00 AM to 05:59 AM",
        "06:00 AM to 06:59 AM" : "06:00 AM to 06:59 AM",
        "07:00 AM to 07:59 AM" : "07:00 AM to 07:59 AM",
        "08:00 AM to 08:59 AM" : "08:00 AM to 08:59 AM",
        "09:00 AM to 09:59 AM" : "09:00 AM to 09:59 AM",
        "10:00 AM to 10:59 AM" : "10:00 AM to 10:59 AM",
        "11:00 AM to 11:59 AM" : "11:00 AM to 11:59 AM",
        "12:00 PM to 12:59 PM" : "12:00 PM to 12:59 PM",
        "01:00 PM to 01:59 PM" : "01:00 PM to 01:59 PM",
        "02:00 PM to 02:59 PM" : "02:00 PM to 02:59 PM",
        "03:00 PM to 03:59 PM" : "03:00 PM to 03:59 PM",
        "04:00 PM to 04:59 PM" : "04:00 PM to 04:59 PM",
        "05:00 PM to 05:59 PM" : "05:00 PM to 05:59 PM",
        "06:00 PM to 06:59 PM" : "06:00 PM to 06:59 PM",
        "07:00 PM to 07:59 PM" : "07:00 PM to 07:59 PM",
        "08:00 PM to 08:59 PM" : "08:00 PM to 08:59 PM",
        "09:00 PM to 09:59 PM" : "09:00 PM to 09:59 PM",
        "10:00 PM to 10:59 PM" : "10:00 PM to 10:59 PM",
        "11:00 PM to 11:59 PM" : "11:00 PM to 11:59 PM",
        "active_hours" : "Active Hours",
        "inactive_hours" : "Inactive Hours",
        "sleeping_hours" : "Sleeping Hours",
        "nap_hours" : "Nap Hours",
        "strength_hours" : "Strength Hours",
        "exercise_hours" : "Exercise Hours",
        "no_data_hours": "No Data Yet Hours",
        "timezone_change_hours":"Time Zone Change Hours",
        "total_active_minutes": "Total Active Minutes",
        "total_active_prcnt": "Total % Active",
        "total_steps" : "Total Steps",
        "dmc":"Daily Movement consistency"
      }

    for(let [key,col] of Object.entries(obj)){
      let prcnt_active_steps = '';
      if(key != "active_hours" && key != "inactive_hours" &&
         key != "sleeping_hours" && key != "nap_hours" && key != "strength_hours" &&
         key != "exercise_hours" && key != "total_steps" && key != "dmc"
         && key !== 'no_data_hours' && key !== "timezone_change_hours"
         && key !== 'total_active_prcnt' && key !== 'total_active_minutes'){
        let active_days = 0;
        for(let step of col){
          if(step.value >= 300){
              let value = step.value;
              if(value != undefined){
                value += '';
                var x = value.split('.');
                var x1 = x[0];
                var x2 = x.length > 1 ? '.' + x[1] : '';
                var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1))
                  x1 = x1.replace(rgx, '$1' + ',' + '$2');
                step.value = x1+x2;
              }
              active_days += 1;
        }
        prcnt_active_steps = parseFloat((active_days / duration) * 100).toFixed(2) +"%";
      }
    }
      col.splice(0, 0,{value:prcnt_active_steps,
                       extra:"",
                       style:""});
       columns.push(
        <Column 
          header={<Cell className={css(styles.newTableHeader)}>{verbose_name[key]}</Cell>}
           cell={props => (
                    <Cell 
                    style={col[props.rowIndex].style}
                    className={css(styles.newTableBody)} 
                    {...{'title':col[props.rowIndex].value + col[props.rowIndex].extra}}
                    {...props} >
                        {col[props.rowIndex].value + col[props.rowIndex].extra}
                    </Cell>
                  )}
          width ={100}
          
        />
      )
    }
  return columns;
}

extractDatewiseMCS = (dateWiseData,category) => {
    let mcData = {};
    for(let [date,data] of Object.entries(dateWiseData)){
        for(let [key,value] of Object.entries(data[category])){
            if(key !== 'id' && key !== 'user_ql' && key == 'movement_consistency'){  
                let mc = value;
                mcData[date] = mc;
                if( mc != undefined && mc != "" && mc != "-"){
                    mc = JSON.parse(mc);
                    mcData[date] = mc               
                }
            }
        }
    }
    return mcData;
}
 render(){
    let queryParams = new URLSearchParams(this.props.location.search)
    let rangeStartDate = queryParams.get('start_date')
    let rangeEndDate = queryParams.get('end_date')
    const {height, width, containerHeight, containerWidth, ...props} = this.props;
    let rowsCount = this.state.tableRowHeader.length;
    let mcData = (this.extractDatewiseMCS(this.props.data,"steps_ql"));
    let start_date = moment(this.props.start_date)
    let end_date = moment(this.props.end_date)
    if(this.state.uidMCData){
      mcData = this.state.uidMCData;
      start_date = moment(rangeStartDate);
      end_date = moment(rangeEndDate);
    }


    return(
      <div>
       <div>
       <Table
            rowsCount={rowsCount}
            rowHeight={50}
            headerHeight={75}
            width={containerWidth}
            height={containerHeight}
            touchScrollEnabled={true}
            {...props}>
            <Column
              header={<Cell className={css(styles.newTableHeader)}>Movement Consistency Historical Data</Cell>}

              cell={props => (
                <Cell {...{'title':this.state.tableRowHeader[props.rowIndex].name}} {...props} className={css(styles.newTableBody)}>
                  {this.getDayWithDate(this.state.tableRowHeader[props.rowIndex].name)}
                </Cell>
                )}

              width={115}
              fixed={true}
            />
            {this.renderTableColumns(mcData,start_date,end_date)}
         
          </Table>
         
            <div className="rd_mch_color_legend color_legend_green"></div>
            <span className="rd_mch_color_legend_label">Active</span>
            <div className="rd_mch_color_legend color_legend_red"></div>
            <span className="rd_mch_color_legend_label">Inactive</span>
            <div className="rd_mch_color_legend color_legend_pink"></div>
            <span className="rd_mch_color_legend_label">Strength</span>
            <div className="rd_mch_color_legend color_legend_blue"></div>
            <span className="rd_mch_color_legend_label">Sleeping</span>
            <div className="rd_mch_color_legend color_legend_yellow"></div>
            <span className="rd_mch_color_legend_label">Exercise</span>
            <div className="rd_mch_color_legend color_legend_grey"></div>
            <span className="rd_mch_color_legend_label">No Data Yet</span>
            <div className="rd_mch_color_legend color_legend_tz_change"></div>
            <span className="rd_mch_color_legend_label">Time Zone Change</span>
            <div className="rd_mch_color_legend color_legend_nap_change"></div>
            <span className="rd_mch_color_legend_label">Nap</span>

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
    fontStyle:'normal',
    fontSize:'15px',
    color:"#111111"
  },
  newTableBody:{
  	textAlign:'center',
    fontSize: '14px', 
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
})(withRouter(MovementHistorical));