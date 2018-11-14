import React,{ Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {connect} from 'react-redux';
import FontAwesome from "react-fontawesome";
import { Collapse, Navbar, NavbarToggler, 
         NavbarBrand, Nav, NavItem, NavLink,
        Button,Popover,PopoverBody,Form,FormGroup,FormText,Label,Input} from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import NavbarMenu from './navbar';
import { getGarminToken,logoutUser} from '../network/auth';


let objectLength = 0;
 let names;
 let names1;  
class AllRank_Data1 extends Component{
    constructor(props){
        super(props);
        this.state = {
            isOpen:false,
            td_view:false,
        }
        this.renderTable = this.renderTable.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.toggle = this.toggle.bind(this);
        this.scrollCallback = this.scrollCallback.bind(this);
        this.renderScoreHeader = this.renderScoreHeader.bind(this);
        this.renderScoreHeader1 = this.renderScoreHeader1.bind(this);
    }
     handleLogout(){
        this.props.logoutUser(this.onLogoutSuccess);
      }
      toggle() {
        this.setState({
          isOpen: !this.state.isOpen,
        });
      }
      componentDidUpdate() {
          console.log("Hello componentDidUpdate");
      }

  scrollCallback(operationCount) {
      if (objectLength === operationCount) {
          setTimeout(function () {
            var x = window.matchMedia("(max-width: 900px)");
            if(x.matches){
               document.getElementById('my-row').style.background = 'lightyellow';
                var index = -1;
                var rows = document.getElementById("my-table").offsetHeight;
                var rows1 = document.getElementById("my-row").offsetTop;
                // for (var i=0;i<rows.length; i++){
                //     if ( rows[i] == document.getElementById("my-row")){
                //         index = i;
                //         break;
                //     }
                // }
                var rows2 = rows1 + 180;
                var rows3 = rows2 - 712;
                if(rows1 >= 520){
                  window.scrollTo(0,  rows3);
                }
                else{
                  window.scrollTo(0, 155);
                }
            }
            else{
                document.getElementById('my-row').style.background = 'lightyellow';
                var index = -1;
                var rows = document.getElementById("my-table").offsetHeight;
                var rows1 = document.getElementById("my-row").offsetTop;
                // for (var i=0;i<rows.length; i++){
                //     if ( rows[i] == document.getElementById("my-row")){
                //         index = i;
                //         break;
                //     }
                // }
                var rows2 = rows1 + 180;
                var rows3 = rows2 - 662;
                if(rows1 >= 520){
                  window.scrollTo(0,  rows3);
                }
                else{
                  window.scrollTo(0, 130);
                }
            }
          }, 100);
      }
  }
  renderScoreHeader(data,c_name){
     let category = ["rank","username","score","other_scores"];
                for (let [key1,value1] of Object.entries(data)){
                    let values =[];
                    let currentUser = '';
                    for (let cat of category){
                        if(cat == "score"){
                          if(c_name == "Percent Unprocessed Food"){
                            names = null;
                          }
                          else{
                            names = <th className = "myranking_all">{value1[cat].verbose_name}</th>;
                          }
                        }
                    }
                }
                return names;
  }
renderScoreHeader1(otherScoreObject){
  let name = [];
  if(otherScoreObject != null && otherScoreObject != undefined && otherScoreObject != ""){
    for (let [otherScoreCatg,otherScoreData] of Object.entries(otherScoreObject)){
        let other_scoresData = [];
        name.push(<th className = "myranking_all">{otherScoreData['verbose_name']}</th>);
    }
  }
    /*if(data){
      name = <th className = "myranking_all">{data}</th>
    };*/
    return name;
  }

    renderTable(data,a_username,c_name){
      let rowData = [];
      let category = ["rank","username","score","other_scores"];
      let keys = [];
      let operationCount = 0;
      let trCount = 0;
        
      objectLength = Object.keys(data).length;
      for (let [key1,value1] of Object.entries(data)){
        let values =[];
        let currentUser = '';
        for (let cat of category){
          if(cat == "score"){
            if(c_name == "Percent Unprocessed Food"){
              values.push(null);
            }
            else{
              //let value = value1[cat].value;
              let value;
              if(c_name == "Active Minute Per Day (24 hours)" || c_name == "Active Minute Per Day (Excludes Active Minutes When Sleeping)" || c_name == "Active Minute Per Day (Excludes Active Minutes When Sleeping and Exercising)"){
                  value = this.props.MinToHours(value1[cat].value);
              }
              else{
                value = value1[cat].value;
              }
              if(value != undefined){
                value += '';
                var x = value.split('.');
                var x1 = x[0];
                var x2 = x.length > 1 ? '.' + x[1] : '';
                var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                  x1 = x1.replace(rgx, '$1' + ',' + '$2');
                }
                values.push(<td className = "myranking_all">{x1 + x2}</td>);
               }
              }
            }
            else if(cat == "username"){
                let user = value1[cat];
                if(user == a_username){
                     values.push(<td className = "myranking_all">{user}</td>);
                     currentUser = user;
                }
                else{
                    values.push(<td className = "myranking_all"><div>{user}</div></td>);
                    currentUser = '';
                }

            }
            else if(cat == "other_scores"){
              if(value1[cat] != null && value1[cat] != undefined && value1[cat] != "") {
                if(c_name == "Percent Unprocessed Food" || c_name == "Average Sleep" || c_name == "Active Minute Per Day (Excludes Active Minutes When Sleeping)" || c_name == "Active Minute Per Day (Excludes Active Minutes When Sleeping and Exercising)"){
                for (let [key3,o_score] of Object.entries(value1[cat])){
                    //values.push(<td className = "myranking_all">{o_score.value}</td>)
                    if(o_score != null && o_score != undefined && o_score != "") {
                        if(!values[key3]){
                          values[key3] = {
                            verbose_name:o_score.verbose_name,
                            scores:[]
                          }
                        }
                        //if(o_score.value != null && o_score.value != undefined && o_score.value != "") {
                          /*if(c_name == "Active Minute Per Day (24 hours)" || c_name == "Active Minute Per Day (Excludes Active Minutes When Sleeping)" || c_name == "Active Minute Per Day (Excludes Active Minutes When Sleeping and Exercising)")
                          {
                            values.push(<td className = "myranking_all">{this.props.MinToHours(value1[cat])}</td>);
                          }else{
                            values.push(<td className = "myranking_all">{value1[cat]}</td>);
                          }*/
                          values[key3]["scores"].push(<td className = "myranking_all">{o_score.value}</td>);
                        
                      }
                  }
                }
              }
            }
            else{
                values.push(<td className = "myranking_all">{value1[cat]}</td>);
            }
        }
        ++operationCount;
        this.scrollCallback(operationCount);
         if(c_name == "Percent Unprocessed Food" || c_name == "Average Sleep" || c_name == "Active Minute Per Day (Excludes Active Minutes When Sleeping)" || c_name == "Active Minute Per Day (Excludes Active Minutes When Sleeping and Exercising)"){
          let rowData1 = [];
          rowData1.push(values);
          let flag = 1;
          for (let [otherScoreCatg,otherScoreData] of Object.entries(values)){                         
            
              if(isNaN(otherScoreCatg)){
                rowData1.push(otherScoreData["scores"]);
              }
          }
          rowData.push(<tr id={(currentUser) ? 'my-row' : ''} className ="myranking_all">{rowData1}</tr>);
        }
        else {
          rowData.push(<tr id={(currentUser) ? 'my-row' : ''} className ="myranking_all">{values}</tr>);
        }
                
      }
      
      return rowData;
  }
    render(){
        const {fix} = this.props;
        const rankdata = this.props.data;
        return(
            <div>
                    <div className="col-xs-6 col-sm-6 col-md-12 col-lg-12">
                    <div style = {{paddingTop:"5px"}} className = "row justify-content-center ar_table_padd">
                    <div className = "table table-responsive ">
                    <div id="lbscroll">
                    <table id="my-table" className = "table table-striped table-bordered"> 
                        <thead className = "myranking_all">
                            <th className = "myranking_all">Rank</th>
                            <th className = "myranking_all">Username</th>
                            {this.renderScoreHeader(this.props.data,this.props.active_category_name)}
                            {this.renderScoreHeader1(this.props.all_verbose_name)}         
                        </thead>
                        <tbody className = "myranking_all">
                            {this.renderTable(this.props.data,this.props.active_username,this.props.active_category_name)}
                        </tbody>
                    </table>
                    <div style={{height: "100px"}}></div>
                    </div>
                    </div>
                    </div>
                    </div> 
            </div>
        )
    }
}
function mapStateToProps(state){
  return {
    errorMessage: state.garmin_auth.error,
    message : state.garmin_auth.message
  };
}
export default connect(mapStateToProps,{getGarminToken,logoutUser})(withRouter(AllRank_Data1));
Navbar.propTypes={
    fixed: PropTypes.string,
    color: PropTypes.string,
} 
