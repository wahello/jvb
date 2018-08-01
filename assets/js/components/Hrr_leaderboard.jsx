import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';
import FontAwesome from "react-fontawesome";
import { Collapse, Navbar, NavbarToggler, 
         NavbarBrand, Nav, NavItem, NavLink,
        Button,Popover,PopoverBody,Form,FormGroup,FormText,Label,Input} from 'reactstrap';

let objectLength = 0;

class HrrLeaderboard extends Component{
	constructor(props) {
    super(props);
	    this.state = {
	    }
		this.renderTable = this.renderTable.bind(this);
		this.heartBeatsColors = this.heartBeatsColors.bind(this);
		this.scrollCallback = this.scrollCallback.bind(this);
	}
	heartBeatsColors(value){
  		/* Applying the colors for the table cells depends upon their heart beat ranges*/
  		let background = "";
  		let color = "";
  		if(value && value != "N/A"){
	  		if(value >= 20){
	  			background = "green";
	  			color = "white";
	  		}
	  		else if(value >= 12 && value < 20){
	  			background = "yellow";
	  			color = "black";
	  		}
	  		else if(value > 0 && value < 12){
	  			background = "red";
	  			color = "black";
	  		}
  		}
  		return <td style ={{background:background,color:color}} className ="progress_table">{value}</td>
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
	renderTable(Hrr_data,Hrr_username){
		let operationCount = 0;
		let td_rows = [];
		let keys = ["rank","username","time_99","beat_lowered","pure_time_99","pure_beat_lowered","total_hrr_rank_point"];
		objectLength = Object.keys(Hrr_data).length;
		for(let[key,value] of Object.entries(Hrr_data)){
			let td_values = [];
			 let currentUser = '';
			for(let key1 of keys){
				if(key1 == "rank"|| key1 == "total_hrr_rank_point"){
					td_values.push(<td className ="progress_table">{value[key1]}</td>);
				}
				else if(key1 == "username"){
					let user = value[key1];
					if(user == Hrr_username){
						td_values.push(<td className ="progress_table">{user}</td>);
						currentUser = user;
					}
					else{
						td_values.push(<td className ="progress_table">{user}</td>);
						currentUser = '';
					}
				}
				else if(key1 == "beat_lowered" || key1 == "pure_beat_lowered"){
					for(let [key3,value4] of Object.entries(value[key1])){
						if(key3 == "rank"){
							td_values.push(<td className ="progress_table">{value4}</td>);
						}
						else if(key3 == "score"){
							td_values.push(this.heartBeatsColors(value4.value));
						}
					}
				}
				else{
					for(let [key3,value4] of Object.entries(value[key1])){
						if(key3 == "rank"){
							td_values.push(<td className ="progress_table">{value4}</td>);
						}
						else if(key3 == "score"){
							td_values.push(<td className ="progress_table">{value4.value}</td>);
						}
					}
				}
			}
			++operationCount;
                this.scrollCallback(operationCount);
			td_rows.push(<tr id={(currentUser) ? 'my-row' : ''} className ="progress_table">{td_values}</tr>);	
		}
		return td_rows;
	}
	render(){
		return(
				<div className = "container-fluid">
					<div className = "row justify-content-center hr_table_padd">
						<div className = "table table-responsive">
			          	    <table id="my-table" className = "table table-striped table-bordered ">
								<tr className ="progress_table">
									<th>Overall HRR Rank</th>
									<th>User</th>
									<th>Time to 99 (hh:mm)</th>
									<th>Time to 99 Rank</th>
									<th>Heart beats lowered in 1st minute</th>
									<th>Lowered Beats Rank</th>
									<th>Pure Time to 99 (hh:mm)</th>
									<th>Pure Time to 99 Rank</th>
									<th>Pure Heart beats lowered in 1st minute</th>
									<th>Pure Heart beats lowered in 1st minute Rank</th>
									<th>Total HRR Rank Points</th>
								</tr>
								<tbody>
								{this.renderTable(this.props.Hrr_data,this.props.Hrr_username)}	
								</tbody>
							</table>
						</div>
					</div>	
				</div>
			);
	}
}
export default HrrLeaderboard;