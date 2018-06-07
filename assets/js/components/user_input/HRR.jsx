import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Modal,
		ModalHeader, ModalBody, ModalFooter, Collapse} from 'reactstrap';
import Textarea from 'react-textarea-autosize';
import moment from 'moment'

export default class Hrr extends Component{
	constructor(props){
		super(props);
		const hr_down_99 = this.props.hr_down_99;
		const time_to_99_min = this.props.time_to_99_min;
		const time_to_99_sec = this.props.time_to_99_sec;
		const hr_level = this.props.hr_level;
		const lowest_hr_first_minute = this.props.lowest_hr_first_minute;
		const lowest_hr_during_hrr = this.props.lowest_hr_during_hrr;
		const time_to_lowest_point_min = this.props.time_to_lowest_point_min;
		const time_to_lowest_point_sec = this.props.time_to_lowest_point_sec;
		this.state = {
			collapse:true,
			modal: false,
			modal1:false,
			hr_down_99:hr_down_99,
			time_to_99_min:time_to_99_min,
			time_to_99_sec:time_to_99_sec,
			hr_level:hr_level,
			lowest_hr_first_minute:lowest_hr_first_minute,
			lowest_hr_during_hrr:lowest_hr_during_hrr,
			time_to_lowest_point_min:time_to_lowest_point_min,
			time_to_lowest_point_sec:time_to_lowest_point_sec,
		};
		
		this.handleChange = this.handleChange.bind(this);
		this.handleChangeDown99 = this.handleChangeDown99.bind(this);
		this.createSleepDropdown=this.createSleepDropdown.bind(this);
		this.toggle = this.toggle.bind(this);
		this.toggle1 = this.toggle1.bind(this);
		
	}
	componentWillReceiveProps(nextProps) {
  	  if((nextProps.hr_down_99 !== this.props.hr_down_99) ||
  	  	  (nextProps.time_to_99_min !== this.props.time_to_99_min) ||
  	  	  (nextProps.time_to_99_sec !== this.props.time_to_99_sec) ||
  	  	  (nextProps.hr_level !== this.props.hr_level) ||
  	  	  (nextProps.lowest_hr_first_minute !== this.props.lowest_hr_first_minute) ||
  	  	  (nextProps.lowest_hr_during_hrr !== this.props.lowest_hr_during_hrr) ||
  	  	  (nextProps.time_to_lowest_point_min != this.props.time_to_lowest_point_min) ||
  	  	  (nextProps.time_to_lowest_point_sec != this.props.time_to_lowest_point_sec)
  	  	  ){
    	  	this.setState({
    	  		hr_down_99:nextProps.hr_down_99,
    	  		time_to_99_min:nextProps.time_to_99_min,
    	  		time_to_99_sec:nextProps.time_to_99_sec,
    	  		hr_level:nextProps.hr_level,
    	  		lowest_hr_first_minute:nextProps.lowest_hr_first_minute,
    	  		lowest_hr_during_hrr:nextProps.lowest_hr_during_hrr,
    	  		time_to_lowest_point_min:nextProps.time_to_lowest_point_min,
    	  		time_to_lowest_point_sec:nextProps.time_to_lowest_point_sec,
    	  	});
    	}
  	}

  	handleChange(event){
		const value = event.target.value;
		const name = event.target.name;
	    this.setState({
	    	[name]: value,
	    },()=>{
	    	this.props.updateState({[name]:this.state[name]});
	    });
	}

	handleChangeDown99(event){
		const value = event.target.value;
		const name = event.target.name;
		if(value == 'yes'){
			const state_value_obj = {
				[name]:value,
		    	lowest_hr_during_hrr:'',
		    	time_to_lowest_point_min:'',
		    	time_to_lowest_point_sec:'',
			};
			this.setState({
		    	...state_value_obj
		    },()=>{
		    	this.props.updateState(state_value_obj);
		    });
		}
		else if(value == 'no'){
			const state_value_obj = {
				[name]: value,
		    	time_to_99_min:'',
		    	time_to_99_sec:''
			}
			this.setState({
		    	...state_value_obj
		    },()=>{
		    	this.props.updateState(state_value_obj);
		    });
		}
		else{
	    	this.setState({
	    		[name]: value,
	   	 	},()=>{
	    		this.props.updateState({[name]:this.state[name]});
	    	});
	    }
	}

createSleepDropdown(start_num , end_num, mins=false, step=1){
    let elements = [];
    let i = start_num;
    while(i<=end_num){
      let j = (mins && i < 10) ? "0"+i : i;
      elements.push(<option key={j} value={j}>{j}</option>);
      i=i+step;
    }
    return elements;
  }
toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }
  toggle1() {
    this.setState({
      modal: !this.state.modal1
    });
  }
	render(){
var ddyy = moment.utc("2018-05-02")
		return(
			<div>
			<Collapse isOpen={this.state.collapse}>
			 <FormGroup>   
                              <Label className="padding">1.12.1 Did your heart rate go down to 99 beats per minute or lower?</Label>
                             {this.props.editable &&
	                            <div className="input1">
		                              <Label className="btn  radio1">
                                    <Input type="radio"
                                    name="hr_down_99"                                                                   
                                    value="yes"
                                    id="hr_down_yes" 
                                    checked={this.state.hr_down_99 === 'yes'}
                                    onChange={this.handleChangeDown99}/> Yes
                                  </Label>
                                  <Label className="btn  radio1">
                                    <Input type="radio" name="hr_down_99" 
                                    value="no"
                                    id="hr_down_no" 
                                    checked={this.state.hr_down_99 === 'no'}
                                    onChange={this.handleChangeDown99}/> No
                                  </Label>
	                            </div> 
	                        }
	                        {
	                          !this.props.editable &&
	                          <div className="input">
	                            <p>{this.state.hr_down_99}</p>
	                          </div>
	                        }
                          </FormGroup>
			</Collapse>


					
						 { (this.state.hr_down_99 == "yes") &&
                          <FormGroup>   
                            <Label className="LAbel">1.12.2 How long did it take for your heart rate to get to 99 bpm?</Label>

                              {this.props.editable &&
	                           	  <div className="input1">
		                             <div className="col-xs-6">
                                  <div className="input1"> 
                                <Input type="select" name="time_to_99_min"
                                id="hours"
                                className="form-control custom-select"
                                value={this.state.time_to_99_min}
                                onChange={this.handleChange}>
                                 <option key="minutes" value="">Minutes</option>
                                {this.createSleepDropdown(0,59)}                        
                                </Input>
                                </div>
                                </div>
                              
                                <div className="col-xs-6 justify-content-right">
                               <div className="input1">
                                <Input type="select" name="time_to_99_sec"
                                 id="minutes"
                                className="form-control custom-select "
                                value={this.state.time_to_99_sec}
                                onChange={this.handleChange}>
                                 <option key="seconds" value="">Seconds</option>
                                {this.createSleepDropdown(0,59,true)}                        
                                </Input>                        
                                </div>
                                </div>
			                      </div>
			                   }
			                   {
	                              !this.props.editable &&
	                              <div className="input1">
                              {(this.state.time_to_99_min && this.state.time_to_99_sec) &&
                                <p>{this.state.time_to_99_min} minutes {this.state.time_to_99_sec} seconds</p>
                              }
                              </div>
	                           }
                          </FormGroup> 
                      }
                     
                     { (this.state.hr_down_99 == "yes") &&
                     <FormGroup>
						<Label className="padding">1.12.3 What was your heart rate level when you started your heart rate recovery file?</Label>
						{this.props.editable &&
						<div className="input1">
							<Input
								id="placeholder"
								name="hr_level"
		                        type="select" 
		                        className="form-control custom-select" 
		                        value={this.state.hr_level}
		                        onChange={this.handleChange} >
		                         <option key="select" value="">Select</option>
	                             {this.createSleepDropdown(70,220,true)}                             
	                        </Input>
                        </div>
                       }
                       {
                          !this.props.editable &&
                          <div className="input">
                            <p>{this.state.hr_level}</p>
                          </div>
                        }
					</FormGroup>
				}

				{ (this.state.hr_down_99 == "yes") &&
					 <FormGroup>
						<Label className="padding">1.12.4 In the first minute of your heart rate recovery file, what was your lowest heart rate?</Label>
						{this.props.editable &&
						<div className="input1">
							<Input
								id="placeholder"
								name="lowest_hr_first_minute"
		                        type="select" 
		                        className="form-control custom-select" 
		                        value={this.state.lowest_hr_first_minute}
		                        onChange={this.handleChange} >
		                         <option key="select" value="">Select</option>
	                             {this.createSleepDropdown(70,220,true)}                             
	                        </Input>
                        </div>
                       }
                       {
                          !this.props.editable &&
                          <div className="input">
                            <p>{this.state.lowest_hr_first_minute}</p>
                          </div>
                        }						                      
					</FormGroup>

				}

				{ (this.state.hr_down_99 == "yes") &&
				  (this.state.lowest_hr_first_minute >= "70") &&

				 <div  className="table-responsive input1 tablecenter1">			       			       			    
			         <table className="table table-bordered">  
			         <thead> 
			         <th>HRR time to 99</th>
			         <th>Heart rate starting point</th>
			         <th>Number of heart beats recovered in the first minute</th>
			         <th>Lowest heart rate point in your heart rate recovery recording</th>
			         </thead>
			         <tbody>
			         <td>{this.state.time_to_99_min + ":" + this.state.time_to_99_sec}</td>
			         <td>{this.state.hr_level}</td>
			         <td>{this.state.hr_level - this.state.lowest_hr_first_minute}</td>
			         <td>{this.state.lowest_hr_first_minute}</td>
			         </tbody>
			         </table>
			         <p style={{paddingTop:'10px',fontWeight:'bold'}}>If any of your HRR stats are incorrect, please edit your user inputs above</p>    
			      </div>
			  }

				
				{ (this.state.hr_down_99 == "no") &&
					 <FormGroup>
						<Label className="padding">1.12.6 What is the lowest point your heart rate got to during your heart rate recovery?</Label>
						{this.props.editable &&
						<div className="input1">
							<Input
							id="placeholder"
							name="lowest_hr_during_hrr"
	                        type="select" 
	                        className="form-control custom-select" 
	                        value={this.state.lowest_hr_during_hrr}
	                        onChange={this.handleChange} >
	                         <option key="select" value="">Select</option>
                             {this.createSleepDropdown(70,220,true)}                             
	                        </Input>
                        </div>
                       }
                       {
                          !this.props.editable &&
                          <div className="input">
                            <p>{this.state.lowest_hr_during_hrr}</p>
                          </div>
                        }
					</FormGroup>
				}

				{ (this.state.hr_down_99 == "no") &&
					<FormGroup>   
                            <Label className="LAbel">1.12.7 How long did it take for your heart rate to get to the lowest point?</Label>

                              {this.props.editable &&
	                           	  <div className="input1">
		                             <div className="col-xs-6">
                                  <div className="input1"> 
                                <Input type="select" name="time_to_lowest_point_min"
                                id="hours"
                                name="time_to_lowest_point_min"
                                className="form-control custom-select"
                                value={this.state.time_to_lowest_point_min}
                                onChange={this.handleChange}>
                                 <option key="minutes" value="">Minutes</option>
                                {this.createSleepDropdown(0,59)}                        
                                </Input>
                                </div>
                                </div>
                              
                                <div className="col-xs-6 justify-content-right">
                               <div className="input1">
                                <Input type="select" name="time_to_lowest_point_sec"
                                 id="minutes"
                                 name="time_to_lowest_point_sec"
                                className="form-control custom-select "
                                value={this.state.time_to_lowest_point_sec}
                                onChange={this.handleChange}>
                                 <option key="seconds" value="">Seconds</option>
                                {this.createSleepDropdown(0,59,true)}                        
                                </Input>                        
                                </div>
                                </div>
			                      </div>
			                   }
			                   {
	                              !this.props.editable &&
	                              <div className="input1">
                              {(this.state.time_to_lowest_point_min && this.state.time_to_lowest_point_sec) &&
                                <p>{this.state.time_to_lowest_point_min} minutes {this.state.time_to_lowest_point_sec} seconds</p>
                              }
                              </div>
	                           }
                          </FormGroup> 
                      }
                      	{ (this.state.hr_down_99 == "no") &&
                           <FormGroup>
						<Label className="padding">1.12.8 What was your heart rate level when you started your heart rate recovery file?</Label>
						{this.props.editable &&
						<div className="input1">
							<Input
							id="placeholder" 
							name="hr_level"
	                        type="select" 
	                        className="form-control custom-select" 
	                        value={this.state.hr_level}
	                        onChange={this.handleChange} >
	                         <option key="select" value="">Select</option>
                             {this.createSleepDropdown(70,220,true)}                             
	                        </Input>
                        </div>
                       }
                       {
                          !this.props.editable &&
                          <div className="input">
                            <p>{this.state.hr_level}</p>
                          </div>
                        }
					</FormGroup>
				}
				{ (this.state.hr_down_99 == "no") &&
					 <FormGroup>
						<Label className="padding">1.12.9 In the first minute of your heart rate recovery file, what was your lowest heart rate?</Label>
						{this.props.editable &&
						<div className="input1">
							<Input
							id="placeholder" 
							name="lowest_hr_first_minute"
	                        type="select" 
	                        className="form-control custom-select" 
	                        value={this.state.lowest_hr_first_minute}
	                        onChange={this.handleChange} >
	                         <option key="select" value="">Select</option>
                             {this.createSleepDropdown(70,220,true)}                             
	                        </Input>
                        </div>
                       }
                       {
                          !this.props.editable &&
                          <div className="input">
                            <p>{this.state.lowest_hr_first_minute}</p>
                          </div>
                        }
					</FormGroup>
				}
				{ (this.state.hr_down_99 == "no") &&
				  (this.state.lowest_hr_first_minute >= "70") &&
				<FormGroup>
				 <div className="table-responsive input1 tablecenter1">			       			       			         
			         <table className="table table-bordered">
			         <thead>
			         <th>HRR Time to 99</th>
			         <th>Heart rate starting point</th>
			         <th>Number of heart beats recovered in the first minute</th>
			         <th>Lowest heart rate point during your heart rate recovery recording</th>
			         </thead>
			         <tbody>
			         <td>Never</td>
			         <td>{this.state.hr_level}</td>
			         <td>{this.state.hr_level - this.state.lowest_hr_first_minute}</td>
			         <td>{this.state.lowest_hr_during_hrr}</td>
			         </tbody>
			         </table>
			         <p style={{paddingTop:'10px',fontWeight:'bold'}}>If any of your HRR stats are incorrect, please edit your user inputs above</p>			         
			      </div>
			      </FormGroup>
			  }
			</div>

		);
	}
}
