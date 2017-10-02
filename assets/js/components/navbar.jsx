import React from 'react';
import { withRouter, Link } from 'react-router-dom';

import {connect} from 'react-redux';
import { Collapse, Navbar, NavbarToggler, 
         NavbarBrand, Nav, NavItem, NavLink,
          } from 'reactstrap';
import PropTypes from 'prop-types';

import { getGarminToken } from '../network/auth';

class NavbarMenu extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
     //this.dropdownToggle = this.dropdownToggle.bind(this);
    this.state = {
      isOpen: false
      


    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
     
    });
  }
  render() {
    return (
      <div>
        <Navbar light toggleable fixed="top" className="navbar navbar-expand-sm  navbar-fixed-top">
          <NavbarToggler className="navbar-toggler hidden-sm-up" right onClick={this.toggle} />
          <NavbarBrand className="navbar-brand float-xs-right float-sm-left" id="navbarTogglerDemo" href="/">HEALTH AND WELLNESS</NavbarBrand>
          <Collapse className="navbar-toggleable-xs" isOpen={this.state.isOpen} navbar>
            <Nav className="nav navbar-nav float-xs-right ml-auto" navbar>
              <NavItem className="float-sm-right">
                
                 <NavLink href="/">Home</NavLink>
                   {/* <Link to="/">Home</Link>*/}
                
              </NavItem>

            
              
            </Nav>
          </Collapse>
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

export default connect(mapStateToProps,{getGarminToken})(NavbarMenu);

Navbar.propTypes={
    fixed: PropTypes.string,
    color: PropTypes.string,
}