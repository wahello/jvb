import React,{ Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {connect} from 'react-redux';
import FontAwesome from "react-fontawesome";
import { Collapse, Navbar, NavbarToggler, 
         NavbarBrand, Nav, NavItem, NavLink,
        Button} from 'reactstrap';
import PropTypes from 'prop-types';


import { getGarminToken,logoutUser} from '../network/auth';
 class DashboardSummary extends Component{
constructor(props){
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.onLogoutSuccess = this.onLogoutSuccess.bind(this);
    this.state = {
      isOpen: false,
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
     
    });
  }

  onLogoutSuccess(response){
    this.props.history.push("/#logout");
  }

  handleLogout(){
    this.props.logoutUser(this.onLogoutSuccess);
  }


	render(){
		const {fix} = this.props;
		return(
			<div className="dashboard">
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
            <h2 className="head" id="head">Progress Analyzer
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
            <div className="row justify-content-center ">
            <Button className="btn createbutton">Create PDF</Button>
            </div>
			<div className="col-sm-12 col-md-12 col-lg-12 padding">
			<div className="row">
			<div className="col-md-6">
			<div className="table-responsive"> 
   		 <table className="table table-bordered">
         <thead>
            <tr>
                <th >Overall Health Grade</th>
                <th>Custom Date Range</th>
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td >Total GPA Points</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td >Overall Health GPA</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td >Rank against other users</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
             <tr>
                <td>Overall Health GPA</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
    </table>
</div>
</div>

<div className="col-md-6">
	<div className="table-responsive tablecenter"> 
    <table className="table table-bordered ">
        <thead>
             
                <tr>
                <th>Sleep Per Night(excluding awake time)</th>
                <th>Custom Date Range</th>
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            </tr>
            
        </thead>
        <tbody>
            <tr>
                <td>Total Sleep in hours:minutes</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
               <td>Rank against other users</td>
               <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Average Sleep Grage</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Overall Sleep GPA</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
    </table>
</div>		
</div>

</div>

<div className="row padding">
			<div className="col-md-6">
<div className="table-responsive"> 
    <table className="table table-bordered">
        <thead>
            <tr>
                
                <th>Non Exercise Steps</th>
                <th>Custom Date Range</th>
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Non Exercise Steps</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
               <td>Rank against other users</td>
               <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Movement-Non Exercise Steps Grade</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Non Exercise Steps GPA</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
             <tr>
                <td>Total Steps</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
    </table>
</div>
</div>

<div className="col-md-6">
<div className="table-responsive"> 
    <table className="table table-bordered">
        <thead>
            <tr>
                
                <th>Nutrition</th>
                <th>Custom Date Range</th>
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>% of Unprocessed Food Consumed</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
               <td>Rank against other users</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>% Non Processed Food Consumed Grade</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>% Non Processed Food Consumed GPA</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
    </table>
</div>



</div>

</div>

<div className="row padding">
			<div className="col-md-6">
<div className="table-responsive"> 
    <table className="table table-bordered">
        <thead>
            <tr>
                
                <th>Alcohol</th>
                <th>Custom Date Range</th>
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Average Drinks Per Week (7 Days)</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
               <td>Rank against other users</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Alcoholic drinks per week Grade</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Alcoholic drinks per week GPA</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
    </table>
</div>
</div>

<div className="col-md-6">
<div className="table-responsive"> 
    <table className="table table-bordered">
        <thead>
            <tr>
                
                <th>Other Stats</th>
                <th>Custom Date Range</th>
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>HRR (time to 99)</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
               <td>HRR (heart beats lowered in 1st minute)</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>HRR (higest heart rate in 1st minute)</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>HRR (lowest heart rate point)</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
    </table>
</div>
</div>

</div>
<div className="row padding">
			<div className="col-md-6">
			<div className="table-responsive tablecenter"> 
    <table className="table table-bordered">
        <thead>
            <tr>
                
                <th>Exercise Stats</th>
                <th>Custom Date Range</th>
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Workout Duration (hours:minutes)</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
               <td>Workout Duration Grade </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Rank against other users</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
            	<td>Workout Effort Level</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
             <tr>
            	<td>Workout Effort Level Grade</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>

             <tr>
                <td>Average Exercise Heart Rate</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
               <td>Average Exercise Heart Rate Grade </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Overall Workout Grade</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
            	<td>Overall Exercise GPA</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
             <tr>
            	<td>Overall Exercise GPA Rank</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
    </table>
</div>
</div>

<div className="col-md-6">
	<div className="table-responsive tablecenter"> 
    <table className="table table-bordered">
        <thead>
            <tr>
                
                <th>Exercise Consistency</th>
                <th>Custom Date Range</th>
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Avg # of Days Exercised/Week</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
               <td>Rank against other users</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Exercise Consistency Grade</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Exercise Consistency GPA</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
    </table>
</div>		
<div className="padding">
   <div className="table-responsive"> 
    <table className="table table-bordered">
         <thead>
           
                <tr>
                <th>Movement Consistency</th>
                <th>Custom Date Range</th>
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            </tr>
           
        </thead>
        <tbody>
            <tr>
                <td>Movement Consistency Score</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
               <td>Rank against other users</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Movement Consistency Grade</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Movement Consistency GPA</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
    </table>
</div>
         
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
export default connect(mapStateToProps,{getGarminToken,logoutUser})(withRouter(DashboardSummary));
Navbar.propTypes={
    fixed: PropTypes.string,
    color: PropTypes.string,
}