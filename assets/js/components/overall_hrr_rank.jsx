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
import {renderOverallHrr1FetchOverlay,renderOverallHrr2FetchOverlay,renderOverallHrr3FetchOverlay,renderOverallHrrSelectedDateFetchOverlay} from './leaderboard_healpers';
import { getGarminToken,logoutUser} from '../network/auth';
import fetchLeaderBoard from '../network/leaderBoard';
import HrrLeaderboard from "./Hrr_leaderboard";

var CalendarWidget = require('react-calendar-widget');  
var ReactDOM = require('react-dom');
const duration = ["week","today","yesterday","year","month","custom_range"];
let durations_captilize = {"today":"Today","yesterday":"Yesterday","week":"Week","month":"Month","year":"Year",};
const overallHrrcategory = ["overall_hrr"];
class OverallRank extends Component{
	constructor(props){
		super(props);
		let overallHrrrankInitialState = {}
	    for (let catg of overallHrrcategory){
	        let hrrInitialState = {}
	        for(let dur of duration){
		          let userRank = {
		            'user_rank':{

		            },
		            "all_rank":[
		            ]
		        };
	         hrrInitialState[dur] = userRank;
	        }
	        overallHrrrankInitialState[catg] = hrrInitialState;
	    };

		this.state = {
			Hrr_data:overallHrrrankInitialState,
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
	        Hrr_view:false,
	        active_view:true,
			btnView:false,
	        all_hrr_rank_data:"",
	        Hrr_username:"",
	        duration_date:{
				"week":"",
				"today":"",
				"yesterday":"",
				"year":"",
				"month":"",
			
			},
		}
		this.toggleCalendar = this.toggleCalendar.bind(this);
		this.renderOverallHrrTable = this.renderOverallHrrTable.bind(this);
		this.successOverallHrrRank = this.successOverallHrrRank.bind(this);
		this.errorOverallHrrRank = this.errorOverallHrrRank.bind(this);
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
		this.renderOverallHrr1FetchOverlay = renderOverallHrr1FetchOverlay.bind(this);
		this.renderOverallHrr2FetchOverlay = renderOverallHrr2FetchOverlay.bind(this);
		this.renderOverallHrr3FetchOverlay = renderOverallHrr3FetchOverlay.bind(this);
		this.renderOverallHrrSelectedDateFetchOverlay = renderOverallHrrSelectedDateFetchOverlay.bind(this);

	}
	successOverallHrrRank(data){
		this.setState({
			Hrr_data:data.data.overall_hrr,
			duration_date:data.data.duration_date,
			fetching_hrr1:false,
	        fetching_hrr2:false,
	        fetching_hrr3:false,
	        fetching_hrr4:false,
		})
	}
	errorOverallHrrRank(error){
		console.log(error.message);
		this.setState({
			fetching_hrr1:false,
	        fetching_hrr2:false,
	        fetching_hrr3:false,
	        fetching_hrr4:false,
		})
	}
	processDate(selectedDate){
		this.setState({
			selectedDate:selectedDate,
			fetching_hrr4:true,
			calendarOpen:!this.state.calendarOpen,
		},()=>{fetchLeaderBoard(this.successOverallHrrRank,this.errorOverallHrrRank,this.state.selectedDate);
		});
	}
	componentDidMount(){
		this.setState({
			fetching_hrr4:true,
		});
		fetchLeaderBoard(this.successOverallHrrRank,this.errorOverallHrrRank,this.state.selectedDate,true);
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
      fetchLeaderBoard(this.successOverallHrrRank,this.errorOverallHrrRank,this.state.selectedDate,custom_ranges);
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
      fetchLeaderBoard(this.successOverallHrrRank,this.errorOverallHrrRank,this.state.selectedDate,custom_ranges);
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
      fetchLeaderBoard(this.successOverallHrrRank,this.errorOverallHrrRank,this.state.selectedDate,custom_ranges);
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
            let date = date1 + ' to ' + date2;
            return date;
	}
	handleBackButton(){
  		this.setState({
  			active_view:!this.state.active_view,
  			btnView:false,
  		})
  	}
   	renderOverallHrrTable(value,value5){
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
	  				durations.push(this.headerDates(range));
	  				for(let [c_key,c_rankData] of Object.entries(value1)){
		  				if(c_key == "user_rank"){
		  					userName = c_rankData.username;
			  		 		scores.push(c_rankData.total_hrr_rank_point);
			  		 		ranks.push({'rank':c_rankData.rank,'duration':range,'isCustomRange':true});
		  		 		}
	  				}
	  			}
	  		}
	  		else{
	  			if (val){ 
			  		durations.push(duration);
			  		for (let [key,rankData] of Object.entries(val)){
			  		 	if(key == "user_rank"){
			  		 		userName = rankData.username;
			  		 		scores.push(rankData.total_hrr_rank_point);
			  		 		ranks.push({'rank':rankData.rank,'duration':duration,'isCustomRange':false});
			  		 	}
			  		 	
			  		}
			  	}
		  	}
		}

		let date;
	  	let tableHeaders = [<th className = "lb_table_style_rows">Overall HRR</th>]
	  	for(let dur of durations){
	  		let capt = dur[0].toUpperCase() + dur.slice(1)
	  		if(dur == "today"){
	  			date = moment(value5[dur]).format('MMM DD, YYYY');	
	  		}
	  		else if(dur == "yesterday"){
	  			date = moment(value5[dur]).format('MMM DD, YYYY');	
	  		}
	  		else if(dur == "week"){
		  		date = this.headerDates(value5[dur]);
	  		}
	  		else if(dur == "month"){
		  		date = this.headerDates(value5[dur]);
	  		}
	  		else if(dur == "year"){
		  		date = this.headerDates(value5[dur]);
	  		}
	  		else{
	  			date = value5[dur];
	  		}	
	  		tableHeaders.push(<th className = "lb_table_style_rows">{capt}<br/>{date}</th>);
	  	}
	  	tableRows.push(<thead className = "lb_table_style_rows">{tableHeaders}</thead>);
	  	
	  	let rankTableData = [<td style={{fontWeight:"bold"}}
	  							 className = "lb_table_style_rows">
	  							 {"Ranks"}</td>]

		  	for(let rank of ranks){
		  		if(rank.isCustomRange){
		  			var all_cat_rank = this.state.Hrr_data['custom_range'][rank['duration']].all_rank;
			  	}
			  	else{
			  		var all_cat_rank = this.state.Hrr_data[rank['duration']].all_rank;
			  	}
		  		rankTableData.push(
			  		<td className = "lb_table_style_rows">
			  		<a  onClick = {this.reanderAllHrr.bind(this,all_cat_rank,userName)}>
			  				<span style={{textDecoration:"underline"}}>{rank.rank}</span>
			  				 <span id="lbfontawesome">
			                    <FontAwesome
			                    	className = "fantawesome_style"
			                        name = "external-link"
			                        size = "1x"
			                    />
			                 </span>  
			                 </a> 
			  		</td>
		  		);
		  	}
	  	tableRows.push(<tbody><tr className = "lb_table_style_rows">{rankTableData}</tr></tbody>);

	  	let scoreTableData = [<td style={{fontWeight:"bold"}}
	  							 className = "lb_table_style_rows">
	  							 {"Total Hrr Rank Point"}</td>]
	  	for(let score of scores){
	  		scoreTableData.push(<td className = "lb_table_style_rows">
			  				{score}</td>)
	  	}
	  	tableRows.push(<tr className = "lb_table_style_rows">{scoreTableData}</tr>);

	  	return  <table className = "table table-striped table-bordered">
	  	{tableRows}
	  	</table>;
	}
	reanderAllHrr(all_data,value1){
		this.setState({
			all_hrr_rank_data:all_data,
			Hrr_username:value1,
			Hrr_view:!this.state.Hrr_view,
			active_view:!this.state.active_view,
			btnView:!this.state.btnView2,
		});
	}

	render(){
		 const {fix} = this.props;
		return(
			<div className="container-fluid" >
			<div id = "hambergar">
		        <NavbarMenu title = {"HRR Leaderboard"} />
		    </div>
		    {this.state.active_view &&
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
		    }

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
             	{this.state.btnView &&
		           	<div>
		            	<Button className = "btn btn-info" onClick = {this.handleBackButton} style = {{marginLeft:"50px",marginTop:"10px",fontSize:"13px"}}>Back</Button>
		            </div>
            	}
             	{this.state.active_view &&
			        <div className = "row justify-content-center lb_table_style" style = {{paddingTop:"25px"}}>
				        <div className = "table table-responsive">
				        	{this.renderOverallHrrTable(this.state.Hrr_data,this.state.duration_date)}
				        </div>
			        </div>
		    	}
		    	{this.state.btnView &&
		  		<HrrLeaderboard Hrr_data = {this.state.all_hrr_rank_data}
	  							Hrr_username = {this.state.Hrr_username}/>
				}
                </div>
                {this.renderOverallHrrSelectedDateFetchOverlay()}
                {this.renderOverallHrr1FetchOverlay()}
                {this.renderOverallHrr2FetchOverlay()}
                {this.renderOverallHrr3FetchOverlay()}
			</div>
			);
	}
}
export default OverallRank;