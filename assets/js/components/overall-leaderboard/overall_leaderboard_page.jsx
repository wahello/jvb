import React,{ Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {connect} from 'react-redux';
import NavbarMenu from '../navbar';
import FontAwesome from "react-fontawesome";
import moment from 'moment';
import PropTypes from 'prop-types';
import OverallLeaderboardTable from './overall_leaderboard_table';
import fetchLeaderBoard from '../../network/leaderBoard';
import { Collapse,Button,Modal,ModalHeader,ModalBody,ModalFooter,Navbar,NavbarToggler, 
         NavbarBrand,Nav,NavItem,NavLink,Popover,PopoverBody,Form,FormGroup,FormText,Label,Input,
         Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import {renderOverallLeaderBoard1FetchOverlay,renderOverallLeaderBoard2FetchOverlay,
	    renderOverallLeaderBoard3FetchOverlay,renderOverallLeaderBoardSelectedDateFetchOverlay} from '../leaderboard_healpers';
import { getGarminToken,logoutUser,getUserProfile } from '../../network/auth';	    

var CalendarWidget = require('react-calendar-widget');  
var ReactDOM = require('react-dom');
const duration = ["week","today","yesterday","year","month","custom_range"];
let durations_captilize = {"today":"Today","yesterday":"Yesterday","week":"Week","month":"Month","year":"Year",};
const overallMovementcategory = ["overall"];

class OverallLeaderboard extends Component{
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
		
	  this.state ={
                    overall_data :  overallMovementrankInitialState,
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
					gender:'',


			        dateRange2:false,
			        dateRange3:false,
			        Movement_view:false,
			        active_view:true,
					btnView:false,
			        all_movement_rank_data:'',
			        mcs_data:'',
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
				  	numberOfDays:null,
				  	infoButton:false,


		}

        this.toggleCalendar = this.toggleCalendar.bind(this);
		this.renderOverallMovementTable = this.renderOverallMovementTable.bind(this);
		this.successOverallMovementRank = this.successOverallMovementRank.bind(this);
		this.errorOverallMovementRank = this.errorOverallMovementRank.bind(this);
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
		this.renderOverallLeaderBoard1FetchOverlay = renderOverallLeaderBoard1FetchOverlay.bind(this);
		this.renderOverallLeaderBoard2FetchOverlay = renderOverallLeaderBoard2FetchOverlay.bind(this);
		this.renderOverallLeaderBoard3FetchOverlay = renderOverallLeaderBoard3FetchOverlay.bind(this);
		this.renderOverallLeaderBoardSelectedDateFetchOverlay = renderOverallLeaderBoardSelectedDateFetchOverlay.bind(this);
		this.renderDate = this.renderDate.bind(this);
		this.toggle = this.toggle.bind(this);
		this.reanderAllHrr = this.reanderAllHrr.bind(this);
		this.toggleInfo = this.toggleInfo.bind(this);
		this.infoPrint = this.infoPrint.bind(this);
	}

	successOverallMovementRank(data,custom_range=undefined){
		let date = this.renderDate(data.data.overall,data.data.duration_date);
		this.setState({
			overall_data:data.data.overall,
			duration_date:data.data.duration_date,
			all_movement_rank_data:data.data.overall.today.all_rank,
			date:moment(date).format("MMM D, YYYY"),
			capt:"Today",
			fetching_hrr1:false,
	        fetching_hrr2:false,
	        fetching_hrr3:false,
	        fetching_hrr4:false,
		},()=>{
			if(custom_range&&this.state.overall_data['custom_range']){
				let rank = this.state.overall_data['custom_range'][custom_range].all_rank;
				let date = this.headerDates(custom_range);
				let capt = "";
				let rangeMCSData = null;
				let selectedRange = {
					dateRange:null,
					rangeType:null,
				}
				selectedRange['dateRange'] = custom_range;
				selectedRange['rangeType'] = 'custom_range';
				let val = this.state.overall_data['custom_range'];
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
	  				capt,date,selectedRange)
			}
		})
	}

    errorOverallMovementRank(error){
		console.log(error.message);
		this.setState({
			fetching_hrr1:false,
	        fetching_hrr2:false,
	        fetching_hrr3:false,
	        fetching_hrr4:false,
		})
	}
    
    successProfile(data){
	    this.setState({
	        gender: data.data.gender
	    });
    }
	processDate(selectedDate){
		this.setState({
			selectedDate:selectedDate,
			fetching_hrr4:true,
			calendarOpen:!this.state.calendarOpen,
			numberOfDays:null,
			selectedRange:{
		  		dateRange:null,
		  		rangeType:'today'
		  	},
		},()=>{
			fetchLeaderBoard(this.successOverallMovementRank,
							 this.errorOverallMovementRank,
							 this.state.selectedDate,
							 null,null,'overall');

		});
	}

	  infoPrint(){
	    var mywindow = window.open('', 'PRINT');
	    mywindow.document.write('<html><head><style>' +
	        '.research-logo {margin-bottom: 20px;width: 100%; min-height: 55px; float: left;}' +
	        '.print {visibility: hidden;}' +
	        '.research-logo img {max-height: 100px;width: 60%;border-radius: 4px;}' +
	        '</style><title>' + document.title  + '</title>');
	    mywindow.document.write('</head><body >');
	    mywindow.document.write('<h1>' + document.title  + '</h1>');
	    mywindow.document.write(document.getElementById('modal1').innerHTML);
	    mywindow.document.write('</body></html>');

	    mywindow.document.close();
	    mywindow.focus(); 

	    mywindow.print();
	    mywindow.close();
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

    toggleInfo(){
	    this.setState({
	      infoButton:!this.state.infoButton
	    });
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
      fetchLeaderBoard(this.successOverallMovementRank,
		      		   this.errorOverallMovementRank,
		      		   this.state.selectedDate,
		      		   custom_ranges,crange1,'overall');
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
      fetchLeaderBoard(this.successOverallMovementRank,
		      		   this.errorOverallMovementRank,
		      		   this.state.selectedDate,
		      		   custom_ranges,crange2,'overall');
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
      fetchLeaderBoard(this.successOverallMovementRank,
		      		   this.errorOverallMovementRank,
		      		   this.state.selectedDate,
		      		   custom_ranges,crange3,'overall');
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

    toggle(){
		this.setState({
			dropdownOpen:!this.state.dropdownOpen
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

     componentDidMount(){
		this.setState({
			fetching_hrr4:true,
		});
		fetchLeaderBoard(this.successOverallMovementRank,
						 this.errorOverallMovementRank,
						 this.state.selectedDate,
						 null,null,'overall');
		getUserProfile(this.successProfile);
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
		let numberOfDays;
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
				numberOfDays:null,
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
		return(
            <div className="container-fluid">
			<div id = "hambergar">
		        <NavbarMenu title = {<span> Overall Leaderboard
                  <span id="infobutton"
                        onClick={this.toggleInfo}>
                  <a  className="infoBtn"> 
                       <FontAwesome 
                           name = "info-circle"
                           size = "1x"                                      
                       />
                  </a>
                </span> 
              </span>} />
		    </div>
              <Modal
                            id="popover"                          
                            placement="bottom" 
                            isOpen={this.state.infoButton}
                            target="infobutton" 
                            toggle={this.toggleInfo}
                            >
                            <ModalHeader 
                            toggle={this.toggleInfo}
                             style={{fontWeight:"bold"}}>
                            <div >                      
                            <a href="#"
                               onClick={this.infoPrint} 
                               style={{fontSize:"15px",color:"black"}}><i className="fa fa-print">Print</i></a>
                            </div>
                            </ModalHeader>
                        <ModalBody className="modalcontent" id="modal1" >
		                  <div className = "row">
						    <div className = "col-sm-12">
								<p className="footer_content" style={{marginLeft:"15px"}}>	 
								MCS: Movement Consistency Score
								</p>
								<p className="footer_content" style={{marginLeft:"15px"}}>
								ECS: Exercise Consistency Score
								</p>
								<p className="footer_content" style={{marginLeft:"15px"}}>
								TVL: Total number of days in period traveled (% of total days reported in the duration)
								</p>
								<p className="footer_content" style={{marginLeft:"15px"}}>
								ILL: Total number of days in period sick (% of total days reported in the duration)
								</p>
								<p className="footer_content" style={{marginLeft:"15px"}}>
								STR: Total number of days in period having medium or high Stress (% of total days reported in the duration)
								</p>
								<p className="footer_content" style={{marginLeft:"15px"}}>
								REP: Total number of days in period reported inputs (% of total days reported in the duration)
								</p>
								<p className="footer_content" style={{marginLeft:"15px"}}>
								NR = Not Reported; NA = Not Available
								</p>
								<p className="footer_content" style={{marginLeft:"15px"}}>
								Grades:&nbsp;
								<div className="rd_mch_color_legend color_legend_green"></div>
								<span className="rd_mch_color_legend_label">A</span>
								<div className="rd_mch_color_legend color_legend_parrot_green"></div>
								<span className="rd_mch_color_legend_label">B</span>
								<div className="rd_mch_color_legend color_legend_yelow"></div>
								<span className="rd_mch_color_legend_label">C</span>
								<div className="rd_mch_color_legend color_legend_orange"></div>
								<span className="rd_mch_color_legend_label">D</span>
								<div className="rd_mch_color_legend color_legend_red"></div>
								<span className="rd_mch_color_legend_label">F</span>
								</p>      
								<p className="footer_content" style={{marginLeft:"15px"}}>
								Numbers in (parenthesis) represent overall rank in category (where (1) is best)
								</p>
								<p className="footer_content" style={{marginLeft:"15px"}}>
								See the Movement Leaderboard for more details regarding Overall Movement Rank
								</p>
                             </div>
                          </div>
                         </ModalBody> 
                    </Modal>    
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
					          {this.renderOverallMovementTable(this.state.overall_data,this.state.mcs_data,this.state.duration_date)}
					        </DropdownMenu>
					      </Dropdown>
					      
				      	<span className = "weekdate" style={{marginLeft:"auto",marginRight:"auto"}}><span>{this.state.capt}</span><span>{" (" + this.state.date + ")"}{this.state.numberOfDays&&<span>{" - "+"Total Days: "+this.state.numberOfDays}</span>}</span></span>
			        </div>   
			        <OverallLeaderboardTable 
		  			overall_data = {this.state.all_movement_rank_data}
	  				Movement_username = {this.state.Movement_username}
	  				mcs_data = {this.state.selectedRangeMCSData}
	  				selectedRange = {this.state.selectedRange}
	  				gender={this.state.gender}/>
                    </div>                     
		        {this.renderOverallLeaderBoard1FetchOverlay()}
                {this.renderOverallLeaderBoard2FetchOverlay()}
                {this.renderOverallLeaderBoard3FetchOverlay()}
                {this.renderOverallLeaderBoardSelectedDateFetchOverlay()}
                           
         </div>
	  );
	}
}
export default OverallLeaderboard;