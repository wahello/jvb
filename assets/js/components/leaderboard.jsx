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
			lb1_start_date:'',
	        lb1_end_date:'',
	        lb2_start_date:'',
	        lb2_end_date:'',
	        lb3_start_date:'',
	        lb3_end_date:'',
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
		this.onSubmitDate1 = this.onSubmitDate1.bind(this);
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
	onSubmitDate1(event){
    event.preventDefault();
    this.setState({
      dateRange1:!this.state.dateRange1,
      fetching_ql1:true
    },()=>{
        let custom_ranges = [];
        if(this.state.lb2_start_date && this.state.lb2_end_date){
            custom_ranges.push(this.state.lb2_start_date);
            custom_ranges.push(this.state.lb2_end_date);
        }
         if(this.state.lb3_start_date && this.state.lb3_end_date){
            custom_ranges.push(this.state.lb3_start_date);
            custom_ranges.push(this.state.lb3_end_date);
        }
        custom_ranges.push(this.state.lb1_start_date);
        custom_ranges.push(this.state.lb1_end_date);
      fetchLeaderBoard(this.successProgress,this.errorProgress,this.state.selectedDate,custom_ranges);
    });
  }
   onSubmitDate2(event){
    event.preventDefault();
    this.setState({
      dateRange2:!this.state.dateRange2,
      fetching_ql2:true
    },()=>{
         let custom_ranges = [];
        if(this.state.lb1_start_date && this.state.lb1_end_date){
            custom_ranges.push(this.state.lb1_start_date);
            custom_ranges.push(this.state.lb1_end_date);
        }
         if(this.state.lb3_start_date && this.state.lb3_end_date){
            custom_ranges.push(this.state.lb3_start_date);
            custom_ranges.push(this.state.lb3_end_date);
        }

        custom_ranges.push(this.state.lb2_start_date);
        custom_ranges.push(this.state.lb2_end_date);
      fetchLeaderBoard(this.successProgress,this.errorProgress,this.state.selectedDate,custom_ranges);
    });
  }
 onSubmitDate3(event){
    event.preventDefault();
    this.setState({
      dateRange3:!this.state.dateRange3,
      fetching_ql3:true
    },()=>{
         let custom_ranges = [];
         if(this.state.lb1_start_date && this.state.lb1_end_date){
            custom_ranges.push(this.state.cr1_start_date);
            custom_ranges.push(this.state.cr1_end_date);
        }
        if(this.state.cr2_start_date && this.state.cr2_end_date){
            custom_ranges.push(this.state.cr2_start_date);
            custom_ranges.push(this.state.cr2_end_date);
        }
        custom_ranges.push(this.state.cr3_start_date);
        custom_ranges.push(this.state.cr3_end_date);
      fetchLeaderBoard(this.successProgress,this.errorProgress,this.state.selectedDate,custom_ranges);
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
  		let category = "";
	  	let durations = [];
	  	let scores = [];
	  	let ranks = [];
	  	let tableRows = [];

	  	for(let [duration,val] of Object.entries(value)){
	  		durations.push(duration);
	  		 for (let [key,rankData] of Object.entries(val)){
	  		 	if(key == "user_rank"){
	  		 		if(!category)
	  		 			category = rankData.category;
	  		 		scores.push(rankData.score);
	  		 		ranks.push(rankData.rank);
	  		 	}
	  		 }
	  	}

	  	// creating headers for table
	  	let tableHeaders = [<th className = "lb_table_style_rows">{category}</th>]
	  	for(let dur of durations){
	  		tableHeaders.push(<th className = "lb_table_style_rows">{dur}</th>);
	  	}
	  	tableRows.push(<thead className = "lb_table_style_rows">{tableHeaders}</thead>);

	  	// creating table rows for ranks
	  	let rankTableData = [<td style={{fontWeight:"bold"}}
	  							 className = "lb_table_style_rows">
	  							 {"Ranks"}</td>]
	  	for(let rank of ranks){
	  		rankTableData.push(<td className = "lb_table_style_rows">{rank}</td>);
	  	}
	  	tableRows.push(<tr className = "lb_table_style_rows">{rankTableData}</tr>)

	  	let scoreTableData = [<td style={{fontWeight:"bold"}}
	  							  className = "lb_table_style_rows">
	  							  {"Scores"}</td>]
	  	for(let score of scores){
	  		scoreTableData.push(<td className = "lb_table_style_rows">{score}</td>);
	  	}
	  	tableRows.push(<tr className = "lb_table_style_rows">{scoreTableData}</tr>)

	  	return  <table className = "table table-striped table-hover table-responsive lb_table_style_rows">{tableRows}</table>;
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
	        <div className = "row justify-content-center lb_table_style">
		        {this.renderTablesTd(this.state.ranking_data.oh_gpa)}
	        </div>
	        <div className = "row justify-content-center lb_table_style">
	        	{this.renderTablesTd(this.state.ranking_data.alcohol_drink)}
	        </div>
	        <div className = "row justify-content-center lb_table_style">
	        	{this.renderTablesTd(this.state.ranking_data.avg_sleep)}
	        </div>
	        <div className = "row justify-content-center lb_table_style">
	        	{this.renderTablesTd(this.state.ranking_data.prcnt_uf)}
	        </div>
	        <div className = "row justify-content-center lb_table_style">
	        	{this.renderTablesTd(this.state.ranking_data.total_steps)}
	        </div>
	        <div className = "row justify-content-center lb_table_style">
	        	{this.renderTablesTd(this.state.ranking_data.mc)}
	        </div>
	        <div className = "row justify-content-center lb_table_style">
	        	{this.renderTablesTd(this.state.ranking_data.ec)}
	        </div>
	        <div className = "row justify-content-center lb_table_style">
	        	{this.renderTablesTd(this.state.ranking_data.awake_time)}
	        </div>
	        <div className = "row justify-content-center lb_table_style">
	        	{this.renderTablesTd(this.state.ranking_data.resting_hr)}
	        </div>
	        <div className = "row justify-content-center lb_table_style">
	        	{this.renderTablesTd(this.state.ranking_data.deep_sleep)}
	        </div>
	        <div className = "row justify-content-center lb_table_style">
	        	{this.renderTablesTd(this.state.ranking_data.mne_gpa)}
	        </div>
	        <div className = "row justify-content-center lb_table_style">
	        	{this.renderTablesTd(this.state.ranking_data.floor_climbed)}
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
export default connect(mapStateToProps,{getGarminToken,logoutUser})(withRouter(LeaderBoard));
Navbar.propTypes={
    fixed: PropTypes.string,
    color: PropTypes.string,
} 