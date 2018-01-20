import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {loadLocalState} from './localStorage';

// A Wrapper component which will redirect the
// user to homepage if user is not auhenticated
export default function(ComposedComponent) {
    class Authentication extends Component{
        static contextTypes = {
            router: PropTypes.object
        };
        componentWillMount(){
            const persisted_state = loadLocalState();
            if((persisted_state && !persisted_state.authenticated) ||
                persisted_state === undefined){
                this.context.router.history.push('/');
            }
            if((persisted_state && persisted_state.authenticated) &&
                !persisted_state.terms_accepted){
                this.context.router.history.push('/terms_and_conditions');
            }
        }
        componentWillUpdate(nextProps){
            const persisted_state = loadLocalState();
            if((persisted_state && !persisted_state.authenticated) ||
                persisted_state === undefined){
                this.context.router.history.push('/');
            }
            if((persisted_state && persisted_state.authenticated) &&
                !persisted_state.terms_accepted){
                this.context.router.history.push('/terms_and_conditions');
            }
        }
        render(){
            return(
                <ComposedComponent {...this.props} />
            );
        }
    }
    return Authentication;
}