import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import {connect} from 'react-redux';
import { Collapse, Navbar, NavbarToggler, 
         NavbarBrand, Nav, NavItem, NavLink,
        Button} from 'reactstrap';
import PropTypes from 'prop-types';

import { getGarminToken,logoutUser} from '../network/auth';

class NavbarMenu extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.onLogoutSuccess = this.onLogoutSuccess.bind(this);
    this.state = {
      isOpen: false
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

  render() {
    const {fix} = this.props;
    return (
      <div>
        <Navbar toggleable 
          fixed={fix ? 'top' : ''} 
          className="navbar navbar-expand-sm">
          <NavbarToggler className="navbar-toggler hidden-sm-up" onClick={this.toggle} />
          <Link to='/'>
            <NavbarBrand 
              className="navbar-brand float-xs-right float-sm-left" 
              id="navbarTogglerDemo">HEALTH AND WELLNESS
            </NavbarBrand>
          </Link>
          <Collapse className="navbar-toggleable-xs" isOpen={this.state.isOpen} navbar>
            <Nav className="nav navbar-nav float-xs-right ml-auto" navbar>
              <NavItem className="float-sm-right">  
                <Link className="nav-link" to='/'>Home</Link>
              </NavItem>
               <NavItem className="float-sm-right">
                
                   <Button 
                      outline color="primary"
                      onClick={this.handleLogout}>Log Out
                    </Button>
                
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

export default connect(mapStateToProps,{getGarminToken,logoutUser})(withRouter(NavbarMenu));

Navbar.propTypes={
    fixed: PropTypes.string,
    color: PropTypes.string,
}