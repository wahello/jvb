import React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import PropTypes from 'prop-types';

export default class Navbarmenu extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
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
                <NavLink href="/components/" >Home</NavLink>
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
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

Navbar.propTypes={
    fixed: PropTypes.string,
    color: PropTypes.string,
}