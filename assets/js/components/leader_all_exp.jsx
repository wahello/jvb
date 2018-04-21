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


let objectLength = 0;
class AllRank_Data1 extends Component{
    constructor(props){
        super(props);
        this.state = {
            isOpen:false,
        }
        this.renderTable = this.renderTable.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.toggle = this.toggle.bind(this);
        this.scrollCallback = this.scrollCallback.bind(this);
        
    }
     handleLogout(){
        this.props.logoutUser(this.onLogoutSuccess);
      }
      toggle() {
        this.setState({
          isOpen: !this.state.isOpen,
        });
      }
      componentDidUpdate() {
          console.log("Hello componentDidUpdate");
      }
  /*handleScroll(){
            var b = document.getElementById('hambergar').clientHeight;
            console.log("**********",b);
          var scrollHeight = b + document.getElementById("lbscroll").offsetTop;
          console.log("**********",scrollHeight);
          window.scrollTo(0, scrollHeight+270);    
  }*/
  scrollCallback(operationCount) {
      if (objectLength === operationCount) {
          setTimeout(function () {
              document.getElementById('my-row').style.background = 'lightyellow';
              var index = -1;
            var rows = document.getElementById("my-table").rows;
            for (var i=0;i<rows.length; i++){
                if ( rows[i] == document.getElementById("my-row") ){
                    index = i;
                    break;
                }
            }
            window.scrollTo(0, index * 50 + 180);
          }, 100);
      }
  }
    renderTable(data,a_username){
        let rowData = [];
        let category = ["rank","username","score"];
        let keys = [];
        let operationCount = 0;
        let trCount = 0;
        
        objectLength = Object.keys(data).length;
                for (let [key1,value1] of Object.entries(data)){
                    let values =[];
                    let currentUser = '';
                    for (let cat of category){
                        if(cat == "score"){
                            let value = value1[cat].value;
                            if(value != undefined){
                                value += '';
                                var x = value.split('.');
                                var x1 = x[0];
                                var x2 = x.length > 1 ? '.' + x[1] : '';
                                var rgx = /(\d+)(\d{3})/;
                                while (rgx.test(x1)) {
                                        x1 = x1.replace(rgx, '$1' + ',' + '$2');
                                  }
                                values.push(<td className = "progress_table">{x1 + x2}</td>);
                               }
                        }
                        else if(cat == "username"){
                            let user = value1[cat];
                            if(user == a_username){
                                 values.push(<td className = "progress_table">{user}</td>);
                                 currentUser = user;
                            }
                            else{
                                values.push(<td className = "progress_table"><div>{user}</div></td>);
                                currentUser = '';
                            }

                        }
                        else{
                            values.push(<td className = "progress_table">{value1[cat]}</td>);
                        }
                    }
                    ++operationCount;
                    this.scrollCallback(operationCount);
                rowData.push(<tr id={(currentUser) ? 'my-row' : ''} className ="progress_table">{values}</tr>);
        }
        
        return rowData;
    }
    render(){
        const {fix} = this.props;
        const rankdata = this.props.data;

        return(
            <div>
                {/*<Navbar toggleable
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
                    <span id="lbheader">
                    <h4 className="lbhead" id="head">
                    </h4>
                    </span>
                  <Collapse className="navbar-toggleable-xs" isOpen={this.state.isOpen} navbar>
                    <Nav className="nav navbar-nav float-xs-right ml-auto" navbar>
                      <NavItem className="float-sm-right">
                        <Link id="logout"className="nav-link" to='/leaderboard'>My Ranking</Link>
                      </NavItem>
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
                </Navbar>*/}
               
                    <div className="col-sm-12 col-md-12 col-lg-12">
                    <div style = {{paddingTop:"5px"}} className = "row justify-content-center ar_table_padd">
                    <div className = "table table-responsive ">
                    <div id="lbscroll">
                    <table id="my-table" className = "table table-striped table-bordered"> 
                        <thead className = "progress_table">
                            <th className = "progress_table">Rank</th>
                            <th className = "progress_table">Username</th>
                            <th className = "progress_table">Score</th>                
                        </thead>
                        <tbody className = "progress_table">
                            {this.renderTable(this.props.data,this.props.active_username)}
                        </tbody>
                    </table>
                    <div style={{height: "1000px"}}></div>
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
export default connect(mapStateToProps,{getGarminToken,logoutUser})(withRouter(AllRank_Data1));
Navbar.propTypes={
    fixed: PropTypes.string,
    color: PropTypes.string,
} 
