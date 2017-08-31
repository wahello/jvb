import React from 'react';
import { withRouter, Link } from 'react-router-dom';

import {connect} from 'react-redux';
import { Collapse, Navbar, NavbarToggler, 
         NavbarBrand, Nav, NavItem, NavLink,
         Dropdown, DropdownToggle, DropdownMenu,
         DropdownItem } from 'reactstrap';
import PropTypes from 'prop-types';

import { getGarminToken } from '../network/auth';

class NavbarMenu extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      dropdownOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
      dropdownOpen: !this.state.dropdownOpen
    });
  }
  render() {
    return (
      <div>
        <Navbar color="faded" light toggleable fixed="top">
          <NavbarToggler right onClick={this.toggle} />
          <NavbarBrand href="/">HEALTH AND WELLNESS</NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink>
                    <Link to="/">Home</Link>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="">User Inputs</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="">Registration</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="">Login</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="">Dashboard</NavLink>
              </NavItem>
              <NavItem>
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                  <DropdownToggle caret>
                    Device Connect
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem>
                      <a href="/users/request_token">Connect Device</a>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
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