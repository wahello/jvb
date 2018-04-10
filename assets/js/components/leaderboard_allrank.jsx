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



class AllRank_Data extends Component{
	constructor(props){
		super(props);
		this.state = {
			isOpen:false,
		}
		this.renderTable = this.renderTable.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
		this.toggle = this.toggle.bind(this);
	}
	 handleLogout(){
    	this.props.logoutUser(this.onLogoutSuccess);
  	}
  	toggle() {
	    this.setState({
	      isOpen: !this.state.isOpen,
	    });
  	}
	renderTable(data){
		let rowData = [];
		let category = ["username","score","category","rank"];
		let keys = [];
		
		for (let [key,value] of Object.entries(data)){
				for (let [key1,value1] of Object.entries(value)){
					let values =[];
					for (let cat of category){
						values.push(<td className = "progress_table">{value1[cat]}</td>);
					}
				rowData.push(<tr className = "progress_table">{values}</tr>);
			}
		}
		
		return rowData;
	}
	render(){
		const {fix} = this.props;
		return(
			<div>
				<Navbar toggleable
		         fixed={fix ? 'top' : ''}
		          className="navbar navbar-expand-sm navbar-inverse nav6">
		          <NavbarToggler className="navbar-toggler hidden-sm-up" onClick={this.toggle}>
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
		            <h2 className="head" id="head">
		            </h2>
		            </span>
		          <Collapse className="navbar-toggleable-xs" isOpen={this.state.isOpen} navbar>
		            <Nav className="nav navbar-nav float-xs-right ml-auto" navbar>
		              <NavItem className="float-sm-right">
		                <Link id="logout"className="nav-link" to='/leaderboard'>Leader Board</Link>
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

					<div className="col-sm-12 col-md-12 col-lg-12">
					<div style = {{paddingTop:"20px"}} className = "row justify-content-center ar_table_padd">
					<div className = "table table-responsive ">
    				<table className = "table table-striped table-bordered"> 
						<thead className = "progress_table">
							<th className = "progress_table">Username</th>
							<th className = "progress_table">Score</th>
							<th className = "progress_table">Category</th>
							<th className = "progress_table">Rank</th>
						</thead>
						<tbody className = "progress_table">
							{this.renderTable(this.props.location.state)}
						</tbody>
					</table>
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
export default connect(mapStateToProps,{getGarminToken,logoutUser})(withRouter(AllRank_Data));
Navbar.propTypes={
    fixed: PropTypes.string,
    color: PropTypes.string,
} 