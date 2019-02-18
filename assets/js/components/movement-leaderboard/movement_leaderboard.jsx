import React,{ Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {connect} from 'react-redux';
import FontAwesome from "react-fontawesome";
import { Collapse, Navbar, NavbarToggler, 
         NavbarBrand, Nav, NavItem, NavLink,
        Button,Popover,PopoverBody,Form,FormGroup,FormText,Label,Input,
    	Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import NavbarMenu from '../navbar';
import {renderOverallMovement1FetchOverlay,renderOverallMovement2FetchOverlay,renderOverallMovement3FetchOverlay,renderOverallMovementSelectedDateFetchOverlay} from '../leaderboard_healpers';
import { getGarminToken,logoutUser} from '../../network/auth';
import fetchLeaderBoard, {fetchMcsSnapshot} from '../../network/leaderBoard';
import MovementLeaderboard2 from "./movement_leaderboard2";

var CalendarWidget = require('react-calendar-widget');  
var ReactDOM = require('react-dom');
const duration = ["week","today","yesterday","year","month","custom_range"];
let durations_captilize = {"today":"Today","yesterday":"Yesterday","week":"Week","month":"Month","year":"Year",};
const overallMovementcategory = ["movement"];
class MovementLeaderboard extends Component{
	constructor(props){
		super(props);
		let overallMovementrankInitialState = {}
	    for (let catg of overallMovementcategory){
	        let movementInitialState = {}
	        for(let dur of duration){
		          let userRank = {
		            'user_rank':{

		            },
		            "all_rank":[
		            ]
		        };
	         movementInitialState[dur] = userRank;
	        }
	        overallMovementrankInitialState[catg] = movementInitialState;
	    };

		this.state = {
			Movement_data:overallMovementrankInitialState,
			selectedDate:new Date(),
			lb1_start_date:'',
	        lb1_end_date:'',
	        lb2_start_date:'',
	        lb2_end_date:'',
	        lb3_start_date:'',
	        lb3_end_date:'',
	        fetching_hrr1:false,
	        fetching_hrr2:false,
	        fetching_hrr3:false,
	        fetching_hrr4:false,
			calendarOpen:false,
			isOpen1:false,
			dateRange1:false,


	        dateRange2:false,
	        dateRange3:false,
	        Movement_view:false,
	        active_view:true,
			btnView:false,
	        all_movement_rank_data:'',
	        mcs_data:'',
	        current_user_id:null,
	        // mcs_date:new Date(),
	        Movement_username:"",
	        duration_date:{
				"week":"",
				"today":"",
				"yesterday":"",
				"year":"",
				"month":"",
			
			},
			date:new Date(),
			capt:"",
			dropdownOpen: false,
			selectedRange:{
		  		dateRange:null,
		  		rangeType:'today'
		  	},
		  	numberOfDays:1,
		}
		this.toggleCalendar = this.toggleCalendar.bind(this);
		this.renderOverallMovementTable = this.renderOverallMovementTable.bind(this);
		this.successOverallMovementRank = this.successOverallMovementRank.bind(this);
		this.errorOverallMovementRank = this.errorOverallMovementRank.bind(this);
		this.successMcsSnapshot = this.successMcsSnapshot.bind(this);
		this.errorMcsSnapshot = this.errorMcsSnapshot.bind(this);
		this.processDate = this.processDate.bind(this);
		this.toggle1 = this.toggle1.bind(this);
		this.toggleDate1 = this.toggleDate1.bind(this);
		this.toggleDate2 = this.toggleDate2.bind(this);
		this.toggleDate3 = this.toggleDate3.bind(this);
		this.onSubmitDate1 = this.onSubmitDate1.bind(this);
		this.onSubmitDate2 = this.onSubmitDate2.bind(this);
		this.onSubmitDate3 = this.onSubmitDate3.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.headerDates = this.headerDates.bind(this);
		this.handleBackButton = this.handleBackButton.bind(this);
		this.renderOverallMovement1FetchOverlay = renderOverallMovement1FetchOverlay.bind(this);
		this.renderOverallMovement2FetchOverlay = renderOverallMovement2FetchOverlay.bind(this);
		this.renderOverallMovement3FetchOverlay = renderOverallMovement3FetchOverlay.bind(this);
		this.renderOverallMovementSelectedDateFetchOverlay = renderOverallMovementSelectedDateFetchOverlay.bind(this);
		this.renderDate = this.renderDate.bind(this);
		this.toggle = this.toggle.bind(this);
		this.reanderAllHrr = this.reanderAllHrr.bind(this);
		// this.doResizeCode = this.doResizeCode.bind(this);
		// this.doOnOrientationChange = this.doOnOrientationChange.bind(this);
	}
	successOverallMovementRank(data,custom_range=undefined){
		let date = this.renderDate(data.data.movement,data.data.duration_date);
		this.setState({
			Movement_data:data.data.movement,
			duration_date:data.data.duration_date,
			all_movement_rank_data:data.data.movement.today.all_rank,
			current_user_id:data.data.movement.today.user_rank.total_steps.user_id,
			date:moment(date).format("MMM D, YYYY"),
			capt:"Today",
			fetching_hrr1:false,
	        fetching_hrr2:false,
	        fetching_hrr3:false,
	        fetching_hrr4:false,
		},()=>{
			if(custom_range&&this.state.Movement_data['custom_range']){
				let rank = this.state.Movement_data['custom_range'][custom_range].all_rank;
				let date = this.headerDates(custom_range);
				let capt = "";
				let rangeMCSData = null;
				let selectedRange = {
					dateRange:null,
					rangeType:null,
				}
				selectedRange['dateRange'] = custom_range;
				selectedRange['rangeType'] = 'custom_range';
				let startDate = selectedRange.dateRange.split("to")[0].trim();
				let endDate = selectedRange.dateRange.split("to")[1].trim();
				let numberOfDays = moment(endDate).diff(moment(startDate), 'days')+1;
				let val = this.state.Movement_data['custom_range'];
				let userName;
		  		if(val){
		  			for(let [range,value1] of Object.entries(val)){
		  				for(let [c_key,c_rankData] of Object.entries(value1)){
			  				if(c_key == "all_rank"){
			  					userName = c_rankData.username;
			  		 		}
		  				}
		  			}
		  		}
		  		this.reanderAllHrr(
	  				rank,rangeMCSData,userName,
	  				capt,date,selectedRange,numberOfDays)
			}
		})
	}
	// doOnOrientationChange() {
	//    console.log("********************",screen.orientation.angle)
	// }
	// doResizeCode(){
	// 	window.addEventListener('orientationchange', this.doOnOrientationChange);
	// }
	errorOverallMovementRank(error){
		console.log(error.message);
		this.setState({
			fetching_hrr1:false,
	        fetching_hrr2:false,
	        fetching_hrr3:false,
	        fetching_hrr4:false,
		})
	}
	successMcsSnapshot(data){
		this.setState({
			// mcs_data:data.data[moment(this.state.selectedDate).format('YYYY-MM-DD')]
			mcs_data:data.data,
			selectedRangeMCSData:data.data[moment(this.state.selectedDate).format('YYYY-MM-DD')]
		},()=>{
			
		})
	}
	errorMcsSnapshot(error){
		console.log(error.message);
	}
	processDate(selectedDate){
		this.setState({
			selectedDate:selectedDate,
			// mcs_date:selectedDate,
			fetching_hrr4:true,
			calendarOpen:!this.state.calendarOpen,
			numberOfDays:1,
			selectedRange:{
		  		dateRange:null,
		  		rangeType:'today'
		  	},
		},()=>{
			fetchLeaderBoard(this.successOverallMovementRank,this.errorOverallMovementRank,this.state.selectedDate);
			fetchMcsSnapshot(this.successMcsSnapshot,this.errorMcsSnapshot,this.state.selectedDate);

		});
	}
	componentDidMount(){
		this.setState({
			fetching_hrr4:true,
		});
		fetchLeaderBoard(this.successOverallMovementRank,this.errorOverallMovementRank,this.state.selectedDate);
		fetchMcsSnapshot(this.successMcsSnapshot,this.errorMcsSnapshot,this.state.selectedDate);
	}
	toggle(){
		this.setState({
			dropdownOpen:!this.state.dropdownOpen
		})
	}
	onSubmitDate1(event){
    event.preventDefault();
    this.setState({
      dateRange1:!this.state.dateRange1,
      fetching_hrr1:true,
       isOpen1: !this.state.isOpen1,
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
        let crange1 = this.state.lb1_start_date + " " + "to" + " " + this.state.lb1_end_date ;
      fetchLeaderBoard(this.successOverallMovementRank,this.errorOverallMovementRank,this.state.selectedDate,custom_ranges,crange1);
    });
  }
   onSubmitDate2(event){
    event.preventDefault();
    this.setState({
      dateRange2:!this.state.dateRange2,
      fetching_hrr2:true,
       isOpen1: !this.state.isOpen1,
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
        let crange2 = this.state.lb2_start_date + " " + "to" + " " + this.state.lb2_end_date ;
      fetchLeaderBoard(this.successOverallMovementRank,this.errorOverallMovementRank,this.state.selectedDate,custom_ranges,crange2);
    });
  }
 onSubmitDate3(event){
    event.preventDefault();
    this.setState({
      dateRange3:!this.state.dateRange3,
      fetching_hrr3:true,
       isOpen1: !this.state.isOpen1,
    },()=>{
         let custom_ranges = [];
         if(this.state.lb1_start_date && this.state.lb1_end_date){
            custom_ranges.push(this.state.lb1_start_date);
            custom_ranges.push(this.state.lb1_end_date);
        }
        if(this.state.lb2_start_date && this.state.lb2_end_date){
            custom_ranges.push(this.state.lb2_start_date);
            custom_ranges.push(this.state.lb2_end_date);
        }
        custom_ranges.push(this.state.lb3_start_date);
        custom_ranges.push(this.state.lb3_end_date);
        let crange3 = this.state.lb3_start_date + " " + "to" + " " + this.state.lb3_end_date ;
      fetchLeaderBoard(this.successOverallMovementRank,this.errorOverallMovementRank,this.state.selectedDate,custom_ranges,crange3);
    });
  }
  handleChange(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;
      this.setState({
        [name]: value
      });
    }
	toggleCalendar(){
	    this.setState({
	      calendarOpen:!this.state.calendarOpen
	    });
    }
    toggle1() {
	    this.setState({
	      isOpen1: !this.state.isOpen1,
	    });
  	}
  	toggleDate1(){
	    this.setState({
	      dateRange1:!this.state.dateRange1
	    });
   	}
 	toggleDate2(){
	    this.setState({
	      dateRange2:!this.state.dateRange2
	    });
   	}
    toggleDate3(){
	    this.setState({
	      dateRange3:!this.state.dateRange3
	    });
   	}
   	headerDates(value){
   	   let str = value;
       let d = str.split(" ");
       let d1 = d[0];
       let date1 =moment(d1).format('MMM DD, YYYY');
       let d2 = d[2];
       let date2 =moment(d2).format('MMM DD, YYYY');
       if(moment(d2).isAfter(d1)){
       	let date = date1 + ' to ' + date2;
       	return date;
       }
       else{
       	let date = date2 + ' to ' + date1;
       	return date;
       }
	}
	handleBackButton(){
  		this.setState({
  			active_view:!this.state.active_view,
  			btnView:false,
  		})
  	}
  	renderDate(value,value5){
  		let date;
  		for(let [key,val] of Object.entries(value)){
  			if(key == "today"){
  				date = value5[key];
  			}
  		}
  		return date;
  	}
   	renderOverallMovementTable(value,mcs_data,value5){
		let category = "";
	  	let durations = [];
	  	let scores = [];
	  	let userName;
	  	let ranks = [];
	  	let tableRows = [];
	  	let durations_type = ["today","yesterday","week","month","year","custom_range"];
	  	for(let duration of durations_type){
	  		let val = value[duration];
	  		if(duration == "custom_range" && val){
	  			for(let [range,value1] of Object.entries(val)){
	  				durations.push(range);
	  				for(let [c_key,c_rankData] of Object.entries(value1)){
		  				if(c_key == "all_rank"){
		  					userName = c_rankData.username;
		  					/*console.log("************* custom",userName)*/
			  		 		ranks.push(c_rankData);
		  		 		}
	  				}
	  			}
	  		}
	  		else{
	  			if (val){ 
			  		durations.push(duration);
			  		for (let [key,rankData] of Object.entries(val)){
			  		 	if(key == "all_rank"){
			  		 		 userName = rankData.username;
			  		 		ranks.push(rankData);
			  		 	}	
			  		}
			  	}
		  	}
		}

		let date;
	  	let tableHeaders = [];
	  	for(let dur of durations){
	  		let selectedRange = {
		  		dateRange:null,
		  		rangeType:null
		  	};
		  	let numberOfDays = 1;
	  		let rangeMCSData = null;
	  		let rank;
	  		let capt = dur[0].toUpperCase() + dur.slice(1)
	  		if(dur == "today"){
	  			date = moment(value5[dur]).format('MMM DD, YYYY');
	  			rank = value[dur].all_rank;
	  			rangeMCSData = mcs_data[value5[dur]];
	  			selectedRange['dateRange'] = value5[dur];
	  			selectedRange['rangeType'] = dur;
	  		}
	  		else if(dur == "yesterday"){
	  			date = moment(value5[dur]).format('MMM DD, YYYY');
	  			rank = value[dur].all_rank;	
	  			rangeMCSData = mcs_data[value5[dur]];
	  			selectedRange['dateRange'] = value5[dur];
	  			selectedRange['rangeType'] = dur;
	  			// let numberOfDays = 1;
	  		}
	  		else if(dur == "week"){
		  		date = this.headerDates(value5[dur]);
		  		rank = value[dur].all_rank;
		  		selectedRange['dateRange'] = value5[dur];
	  			selectedRange['rangeType'] = dur;
	  		}
	  		else if(dur == "month"){
		  		date = this.headerDates(value5[dur]);
		  		rank = value[dur].all_rank;
		  		selectedRange['dateRange'] = value5[dur];
	  			selectedRange['rangeType'] = dur;
	  		}
	  		else if(dur == "year"){
		  		date = this.headerDates(value5[dur]);
		  		rank = value[dur].all_rank;
		  		selectedRange['dateRange'] = value5[dur];
	  			selectedRange['rangeType'] = dur;
	  		}
	  		else{
	  			date = this.headerDates(dur);
	  			capt = "";
	  			rank = value['custom_range'][dur].all_rank;
	  			selectedRange['dateRange'] = dur;
	  			selectedRange['rangeType'] = 'custom_range';
	  		}
  			tableHeaders.push(
          	<DropdownItem>
  			 <a className="dropdown-item" 
	  			onClick = {this.reanderAllHrr.bind(
	  				this,rank,rangeMCSData,userName,
	  				capt,date,selectedRange)}
	  			style = {{fontSize:"13px"}}>
	  			{capt}<br/>{date}
  			</a></DropdownItem>);
	  	}
	  return tableHeaders;	
	  	
	}
	reanderAllHrr(all_data,rangeMCSData,value1,capt,date,selectedRange){
		console.log("reander")
		let numberOfDays = 1;
		if(selectedRange.rangeType !== 'today' && selectedRange.rangeType !== 'yesterday'){
			let startDate = selectedRange.dateRange.split("to")[0].trim();
			let endDate = selectedRange.dateRange.split("to")[1].trim();
			let numberOfDays = Math.abs(moment(endDate).diff(moment(startDate), 'days'))+1;
			this.setState({
				numberOfDays:numberOfDays,
			})
		}
		else{
			this.setState({
				numberOfDays:1,
			})
		}
		this.setState({
			all_movement_rank_data:all_data,
			Movement_username:value1,
			date:date,
			capt:capt,
			Movement_view:!this.state.Movement_view,
			active_view:!this.state.active_view,
			btnView:!this.state.btnView2,
			selectedRangeMCSData:rangeMCSData,
			selectedRange:selectedRange,
		},()=>{
		});
	}

	render(){
		 const {fix} = this.props;
		return(
			<div className="container-fluid" >
			<div id = "hambergar">
		        <NavbarMenu title = {"Movement Leaderboard"} />
		    </div>
		   
		      	<div className="nav3" id='bottom-nav'>
                           <div className="nav1" style={{position: this.state.scrollingLock ? "fixed" : "relative"}}>
                           <Navbar light toggleable className="navbar nav1 user_nav">
                                <NavbarToggler className="navbar-toggler hidden-sm-up user_clndr" onClick={this.toggle1}>
                                    <div className="toggler">
                                    <FontAwesome 
                                          name = "bars"
                                          size = "1x"
                                        />
                                    </div> 
                               </NavbarToggler>
                               <span id="navlink" onClick={this.toggleCalendar} id="progress">
					                    <FontAwesome
					                    	style = {{color:"white"}}
					                        name = "calendar"
					                        size = "1x"
					                    />
	                                     <span id="navlink">
	                                      	{moment(this.state.selectedDate).format('MMM D, YYYY')}
	                                     </span>  
					            </span>

                               <Collapse className="navbar-toggleable-xs"  isOpen={this.state.isOpen1} navbar>
                                  
                                  <Nav className="nav navbar-nav float-xs-right ml-auto" navbar>
                                    <span  onClick={this.toggleDate1} id="daterange1" style={{color:"white"}}>
					                    <span className="date_range_btn">
					                        <Button
					                            className="daterange-btn btn"                            
					                            id="daterange"
					                            onClick={this.toggleDate1} >Custom Date Range1
					                        </Button>
					                    </span>
					                </span>
					                 <span  onClick={this.toggleDate2} id="daterange2" style={{color:"white"}}>
							                    <span className="date_range_btn">
							                        <Button
							                            className="daterange-btn btn"                            
							                            id="daterange"
							                            onClick={this.toggleDate2} >Custom Date Range2
							                        </Button>
							                    </span>
						                	</span>
						               <span  onClick={this.toggleDate3} id="daterange3" style={{color:"white"}}>
							                    <span className="date_range_btn">
							                        <Button
							                            className="daterange-btn btn"                            
							                            id="daterange"
							                            onClick={this.toggleDate3} >Custom Date Range3
							                        </Button>
							                    </span>
							                </span>                                                                                                                 
                                  </Nav>
                              
                                </Collapse>    
                           </Navbar> 
                           </div>
                           </div>                                
		  

            <Popover
            placement="bottom"
            isOpen={this.state.calendarOpen}
            target="progress"
            toggle={this.toggleCalendar}>
	              <PopoverBody className="calendar2">
	                <CalendarWidget  onDaySelect={this.processDate}/>
	              </PopoverBody>
	        </Popover>

	       <Popover
            placement="bottom"
            isOpen={this.state.dateRange1}
            target="daterange1"
            toggle={this.toggleDate1}>
                    <PopoverBody>
                        <div >
                            <Form>
	                            <div style={{paddingBottom:"12px"}} className="justify-content-center">
	                                <Label>Start Date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
	                                <Input type="date"
	                                name="lb1_start_date"
	                                value={this.state.lb1_start_date}
	                                onChange={this.handleChange} style={{height:"35px",borderRadius:"7px"}}/>
	                            </div>
	                            <div id="date" className="justify-content-center">
	                                <Label>End date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
	                                <Input type="date"
	                                name="lb1_end_date"
	                                value={this.state.lb1_end_date}
	                                onChange={this.handleChange} style={{height:"35px",borderRadius:"7px"}}/>
	                            </div>
	                            <div id="date" style={{marginTop:"12px"}} className="justify-content-center">
		                            <button
		                            id="nav-btn"
		                            style={{backgroundColor:"#ed9507"}}
		                            type="submit"
		                            className="btn btn-block-lg"
		                            onClick={this.onSubmitDate1} style={{width:"175px"}}>SUBMIT</button>
	                            </div>
                            </Form>
                        </div>
                    </PopoverBody>
                </Popover>
                 <Popover
            placement="bottom"
            isOpen={this.state.dateRange2}
            target="daterange2"
            toggle={this.toggleDate2}>
                    <PopoverBody>
                        <div >
                            <Form>
	                            <div style={{paddingBottom:"12px"}} className="justify-content-center">
	                                <Label>Start Date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
	                                <Input type="date"
	                                name="lb2_start_date"
	                                value={this.state.lb2_start_date}
	                                onChange={this.handleChange} style={{height:"35px",borderRadius:"7px"}}/>
	                            </div>
	                            <div id="date" className="justify-content-center">
	                                <Label>End date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
	                                <Input type="date"
	                                name="lb2_end_date"
	                                value={this.state.lb2_end_date}
	                                onChange={this.handleChange} style={{height:"35px",borderRadius:"7px"}}/>
	                            </div>
	                            <div id="date" style={{marginTop:"12px"}} className="justify-content-center">
		                            <button
		                            id="nav-btn"
		                            style={{backgroundColor:"#ed9507"}}
		                            type="submit"
		                            className="btn btn-block-lg"
		                            onClick={this.onSubmitDate2} style={{width:"175px"}}>SUBMIT</button>
	                            </div>
                            </Form>
                        </div>
                    </PopoverBody>
                </Popover>
                 <Popover
            placement="bottom"
            isOpen={this.state.dateRange3}
            target="daterange3"
            toggle={this.toggleDate3}>
                    <PopoverBody>
                        <div >
                            <Form>
	                            <div style={{paddingBottom:"12px"}} className="justify-content-center">
	                                <Label>Start Date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
	                                <Input type="date"
	                                name="lb3_start_date"
	                                value={this.state.lb3_start_date}
	                                onChange={this.handleChange} style={{height:"35px",borderRadius:"7px"}}/>
	                            </div>
	                            <div id="date" className="justify-content-center">
	                                <Label>End date</Label>&nbsp;<b style={{fontWeight:"bold"}}>:</b>&nbsp;
	                                <Input type="date"
	                                name="lb3_end_date"
	                                value={this.state.lb3_end_date}
	                                onChange={this.handleChange} style={{height:"35px",borderRadius:"7px"}}/>
	                            </div>
	                            <div id="date" style={{marginTop:"12px"}} className="justify-content-center">
		                            <button
		                            id="nav-btn"
		                            style={{backgroundColor:"#ed9507"}}
		                            type="submit"
		                            className="btn btn-block-lg"
		                            onClick={this.onSubmitDate3} style={{width:"175px"}}>SUBMIT</button>
	                            </div>
                            </Form>
                        </div>
                    </PopoverBody>
                </Popover>

                <div className = "col-md-12 col-sm-12 col-lg-12" >
			        <div className = "row dropStyles" style={{marginBottom:'10px'}}>
				        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
					        <DropdownToggle caret className = "drop_text">
					          Select Range
					        </DropdownToggle>
					        <DropdownMenu>
					          {this.renderOverallMovementTable(this.state.Movement_data,this.state.mcs_data,this.state.duration_date)}
					        </DropdownMenu>
					      </Dropdown>
					      
				      	<span className = "weekdate" style={{marginLeft:"auto",marginRight:"auto"}}><span>{this.state.capt}</span><span>{" (" + this.state.date + ")"+" - "+" Number of Days: "+this.state.numberOfDays}</span></span>
			        </div>
		  		<MovementLeaderboard2 
		  			Movement_data = {this.state.all_movement_rank_data}
	  				Movement_username = {this.state.Movement_username}
	  				mcs_data = {this.state.selectedRangeMCSData}
	  				selectedRange = {this.state.selectedRange}
	  			/>
				
                </div>
                {this.renderOverallMovementSelectedDateFetchOverlay()}
                {this.renderOverallMovement1FetchOverlay()}
                {this.renderOverallMovement2FetchOverlay()}
                {this.renderOverallMovement3FetchOverlay()}
                {/*{this.doResizeCode()}*/}
			</div>
			);
	}
}
export default MovementLeaderboard;