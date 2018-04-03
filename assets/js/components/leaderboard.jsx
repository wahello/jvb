 import React,{ Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {connect} from 'react-redux';
import FontAwesome from "react-fontawesome";
import { Collapse, Navbar, NavbarToggler, 
         NavbarBrand, Nav, NavItem, NavLink,
        Button,Popover,PopoverBody,Form,FormGroup,FormText,Label,Input} from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';

import { getGarminToken,logoutUser} from '../network/auth';
import fetchLeaderBoard from '../network/leaderBoard';


var CalendarWidget = require('react-calendar-widget');  
var ReactDOM = require('react-dom');

const catagory = ["oh_gpa","alcohol_drink","avg_sleep","prcnt_uf","total_steps","mc","ec","awake_time","resting_hr","deep_sleep","mne_gpa","floor_climbed",];
const duration = ["week","today","yesterday","year","month","custom_range"];

class LeaderBoard extends Component{
	constructor(props){
		super(props);
		let rankInitialState = {}
    for (let catg of catagory){
        let catInitialState = {}
        for(let dur of duration){
	          let userRank = {
	            'user_rank':{
	              category:'',
	              rank:'',
	              username:'',
	              score:''
	            },
	            "all_rank":[
	            ]
	        };
         catInitialState[dur] = userRank;
        }
        rankInitialState[catg] = catInitialState;
    };
		this.state = {
			selectedDate:new Date(),
			calendarOpen:false,
			isOpen:false,
			ranking_data:rankInitialState,
		}
		this.toggleCalendar = this.toggleCalendar.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
		this.toggle = this.toggle.bind(this);
		this.successLeaderBoard = this.successLeaderBoard.bind(this);
		this.successLeaderBoard = this.successLeaderBoard.bind(this);
		this.processDate = this.processDate.bind(this);
		this.renderTablesTd = this.renderTablesTd.bind(this);
	}
	successLeaderBoard(data){
		this.setState({
			ranking_data:data.data
		});
	}
	errorLeaderBoard(error){
		console.log(error.message);
	}
	processDate(selectedDate){
		this.setState({
			selectedDate:selectedDate,
			calendarOpen:!this.state.calendarOpen,
		},()=>{fetchLeaderBoard(this.successLeaderBoard,this.errorLeaderBoard,this.state.selectedDate);
		});
	}
	componentDidMount(){
		fetchLeaderBoard(this.successLeaderBoard,this.errorLeaderBoard,this.state.selectedDate);
	}
	toggle() {
	    this.setState({
	      isOpen: !this.state.isOpen,
	     
	    });
  	}
	toggleCalendar(){
	    this.setState({
	      calendarOpen:!this.state.calendarOpen
	    });
    }
    handleLogout(){
    	this.props.logoutUser(this.onLogoutSuccess);
  	}
  	renderTablesTd(value){
	  	let tables = [];
	  	let th = [];
	  	for(let [key,val] of Object.entries(value)){
	  		 for (let [key1,val1] of Object.entries(val)){
	  		 	let score = [];
	  		 	let rank = [];
	  		 	if(key1 == "user_rank"){
	  		 		for(let[key2,val2] of Object.entries(val1)){
	  		 			if(key2 == "score"){
	  		 			 score.push(<td>{val2}</td>);
	  		 			}
	  		 			else if(key2 == "rank"){
	  		 			 rank.push(<td>{val2}</td>);
	  		 			}
	  		 		}
	  		 		tables.push(<tr>{score}</tr>);
	  		 		tables.push(<tr>{rank}</tr>);
	  		 	}
	  		 }
	  		 
	  	}
	  	return tables;
  	}
	render(){
		 const {fix} = this.props;
		return(
			<div>
			 <div className="container-fluid">
		         <Navbar toggleable
		         fixed={fix ? 'top' : ''}
		          className="navbar navbar-expand-sm navbar-inverse nav6">
		          <NavbarToggler className="navbar-toggler hidden-sm-up" onClick={this.toggle} >
		           <FontAwesome
		                 name = "bars"
		                 size = "1x"

		             />
		          </NavbarToggler>
		          <Link to='/' >
		            <NavbarBrand
		              className="navbar-brand float-sm-left"
		              id="navbarTogglerDemo" style={{fontSize:"16px",marginLeft:"-4px"}}>
		              <img className="img-fluid"
		               style={{maxWidth:"200px"}}
		               src="//static1.squarespace.com/static/535dc0f7e4b0ab57db48c65c/t/5942be8b893fc0b88882a5fb/1504135828049/?format=1500w"/>
		            </NavbarBrand>
		          </Link>
		            <span id="header">
		            <h2 className="head" id="head">Leader Board
		            </h2>
		            </span>
		          <Collapse className="navbar-toggleable-xs" isOpen={this.state.isOpen} navbar>
		            <Nav className="nav navbar-nav float-xs-right ml-auto" navbar>
		              <NavItem className="float-sm-right">
		                <Link id="logout"className="nav-link" to='/'>Home</Link>
		              </NavItem>
		               <NavItem className="float-sm-right">
		                   <NavLink
		                   className="nav-link"
		                   id="logout"
		                   onClick={this.handleLogout}>Log Out
		                    </NavLink>
		              </NavItem>
		            </Nav>
		          </Collapse>
		        </Navbar>
      		</div>
 			<span id="navlink" onClick={this.toggleCalendar} id="progress">
                <FontAwesome
                    name = "calendar"
                    size = "2x"
            	/>
            </span>
            <Popover
            placement="bottom"
            isOpen={this.state.calendarOpen}
            target="progress"
            toggle={this.toggleCalendar}>
	              <PopoverBody className="calendar2">
	                <CalendarWidget  onDaySelect={this.processDate}/>
	              </PopoverBody>
	        </Popover>
	        <table>
	        	{this.renderTablesTd(this.state.ranking_data.oh_gpa)}
	        </table>
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
export default connect(mapStateToProps,{getGarminToken,logoutUser})(withRouter(LeaderBoard));
Navbar.propTypes={
    fixed: PropTypes.string,
    color: PropTypes.string,
} 