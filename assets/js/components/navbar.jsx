import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import {connect} from 'react-redux';
import FontAwesome from "react-fontawesome";
import { Collapse, Navbar, NavbarToggler, 
         NavbarBrand, Nav, NavItem, NavLink,
        Button} from 'reactstrap';
import PropTypes from 'prop-types';

import { getGarminToken,logoutUser,getUserProfile} from '../network/auth';

class NavbarMenu extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.onLogoutSuccess = this.onLogoutSuccess.bind(this);
    this.successProfile = this.successProfile.bind(this);
    this.state = {
      isOpen: false,
      username:"",
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
     
    });
  }
  successProfile(data){
    this.setState({            
      username:data.data.username
    })
  }
  onLogoutSuccess(response){
    this.props.history.push("/#logout");
  }

  handleLogout(){
    this.props.logoutUser(this.onLogoutSuccess);
  }
  componentDidMount(){
    getUserProfile(this.successProfile);
  }

  render() {
    const {fix} = this.props;
    return (
      <div className="container-fluid">
        {/**<Navbar toggleable 
         fixed={fix ? 'top' : ''} 
          className="navbar navbar-expand-sm navbar-inverse">
          
            <Link to='/'>
              <NavbarBrand 
                className="navbar-brand float-xs-right float-sm-left" 
                id="navbarTogglerDemo">
                <img className="img-fluid"
                 style={{maxWidth:"200px"}}
                 src="//static1.squarespace.com/static/535dc0f7e4b0ab57db48c65c/t/5942be8b893fc0b88882a5fb/1504135828049/?format=1500w"/>
              </NavbarBrand>
            </Link>

            <NavbarToggler className="navbar-toggler hidden-sm-up" onClick={this.toggle} >
             <FontAwesome 
                   name = "bars"
                   size = "1x"
                                            
               />
              
            </NavbarToggler>

           <span id="header">
            <h2 className="head" id="head">{this.props.title}
            
            </h2>
          </span>

          <Collapse className="navbar-toggleable-xs" isOpen={this.state.isOpen} navbar>
            <Nav className="nav navbar-nav float-xs-right ml-auto" navbar>
              <NavItem className="float-sm-right">  
                <Link className="nav-link" to='/'>Home</Link>
              </NavItem>
              <NavItem className="float-sm-right">  
                <Link className="nav-link" to='/'>
                <span>
                    <FontAwesome
                              style = {{fontSize:"17px",marginRight:"6px"}}
                              name = "user"
                             
                    />
                </span><span>{this.state.username}</span></Link>
              </NavItem>
              <NavItem className="float-sm-right">                
                   <Link to="#" 
                   className="nav-link"                    
                   onClick={this.handleLogout}>Log Out
                    </Link>               
              </NavItem>  
            </Nav>
          </Collapse>
        </Navbar>**/}




        <Navbar className="navbar navbar-expand-sm navbar-inverse" fixed={fix ? 'top' : ''} >
          <div className="col-md-4 col-sm-4 no-padding">
              <span className="navbar-brand">
              <Link to='/'>
                <span
                  className="navbar-brand" 
                  id="navbarTogglerDemo">
                  <img className="img-fluid"
                   style={{maxWidth:"200px"}}
                   src="//static1.squarespace.com/static/535dc0f7e4b0ab57db48c65c/t/5942be8b893fc0b88882a5fb/1504135828049/?format=1500w"/>
                </span>
              </Link>
            </span>
             <button className="navbar-toggler tgl_btn" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                <span className="fa fa-bars"></span>
              </button>

          </div>

          <div className="col-md-4 col-sm-3 no-padding page_title text-center">
                <h2>{this.props.title}</h2>
          </div>

          <div className="col-md-4 col-sm-5 no-padding">
              <div className="collapse navbar-collapse navbar-right" id="collapsibleNavbar">
                <ul className="navbar-nav nav_mobile navbar_right">
                  <li className="nav-item">
                      <Link className="nav-link" to='/'>Home</Link>
                  </li>
                  <li className="nav-item">
                      <Link className="nav-link" to='/'>
                        <span><i className="fa fa-user"></i> {this.state.username}</span>
                      </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="#" 
                       className="nav-link"                    
                       onClick={this.handleLogout}>Log Out
                    </Link> 
                  </li>    
                </ul>
              </div> 
          </div>
        </Navbar>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    errorMessage: state.garmin_auth.error,
    message : state.garmin_auth.message
  };
}

export default connect(mapStateToProps,{getGarminToken,logoutUser})(withRouter(NavbarMenu));

Navbar.propTypes={
    fixed: PropTypes.string,
    color: PropTypes.string,
}