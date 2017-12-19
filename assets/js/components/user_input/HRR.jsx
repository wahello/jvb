import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Modal,
		ModalHeader, ModalBody, ModalFooter, Collapse} from 'reactstrap';
import Textarea from 'react-textarea-autosize';

export default class Hrr extends Component{
	constructor(props){
		super(props);
		const heart_rate_go_down = this.props.heart_rate_go_down;
		const heart_rate_minutes = this.props.heart_rate_minutes;
		const heart_rate_seconds = this.props.heart_rate_seconds;
		const heart_rate_level = this.heart_rate_level;
		const heart_rate_recovery = this.heart_rate_recovery;
		this.state = {
			collapse:true,
			heart_rate_go_down:heart_rate_go_down,
			heart_rate_minutes:heart_rate_minutes,
			heart_rate_seconds:heart_rate_seconds,
			heart_rate_level:heart_rate_level,
			heart_rate_recovery:heart_rate_recovery,
		};
		
		this.handleChange = this.handleChange.bind(this);
		this.createSleepDropdown=this.createSleepDropdown.bind(this);
		
	}
	componentWillReceiveProps(nextProps) {
  	  if((nextProps.heart_rate_go_down !== this.props.heart_rate_go_down) ||
  	  	  (nextProps.heart_rate_minutes !== this.props.heart_rate_minutes) ||
  	  	  (nextProps.heart_rate_seconds !== this.props.heart_rate_seconds) ||
  	  	  (nextProps.heart_rate_level !== this.props.heart_rate_level) ||
  	  	  (nextProps.heart_rate_recovery !== this.props.heart_rate_recovery)
  	  	  ){
    	  	this.setState({
    	  		heart_rate_go_down:nextProps.heart_rate_go_down,
    	  		heart_rate_minutes:nextProps.heart_rate_minutes,
    	  		heart_rate_seconds:nextProps.heart_rate_seconds,
    	  		heart_rate_level:nextProps.heart_rate_level,
    	  		heart_rate_recovery:nextProps.heart_rate_recovery,
    	  	});
    	}
  	}

  	handleChange(event){
		const value = event.target.value;
		const name = event.target.name;
	    this.setState({
	    	[name]: value,
	    },()=>{
	    	this.props.updateState(this.state[name],name)
	    });
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

	render(){

		return(
			<div>
			<Collapse isOpen={this.state.collapse}>
			 <FormGroup>   
                              <Label className="padding">1.12.1 Did your heart rate go down to 99 beats per minute or lower?</Label>
                             {this.props.editable &&
	                            <div className="input1">
		                              <Label className="btn  radio1">
                                    <Input type="radio"
                                    name="heart_rate_go_down"                                                                   
                                    value="heart_yes" 
                                    checked={this.state.heart_rate_go_down === 'heart_yes'}
                                    onChange={this.handleChange}/> Yes
                                  </Label>
                                  <Label className="btn  radio1">
                                    <Input type="radio" name="heart_rate_go_down" 
                                    value="heart_no"
                                    checked={this.state.heart_rate_go_down === 'heart_no'}
                                    onChange={this.handleChange}/> No
                                  </Label>
	                            </div> 
	                        }
	                        {
	                          !this.props.editable &&
	                          <div className="input">
	                            <p>{this.state.heart_rate_go_down}</p>
	                          </div>
	                        }
                          </FormGroup>
			</Collapse>


					
						
                          <FormGroup>   
                            <Label className="LAbel">1.12.2 How long did it take for your heart rate to get to 99 bpm?</Label>

                              {this.props.editable &&
	                           	  <div className="input1">
		                             <div className="col-xs-6">
                                  <div className="input1"> 
                                <Input type="select" name="heart_rate_minutes"
                                id="hours"
                                className="form-control custom-select"
                                value={this.state.heart_rate_minutes}
                                onChange={this.handleChange}>
                                 <option key="minutes" value="">Minutes</option>
                                {this.createSleepDropdown(0,59)}                        
                                </Input>
                                </div>
                                </div>
                              
                                <div className="col-xs-6 justify-content-right">
                               <div className="input1">
                                <Input type="select" name="heart_rate_seconds"
                                 id="minutes"
                                className="form-control custom-select "
                                value={this.state.heart_rate_seconds}
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
                              {(this.state.heart_rate_minutes && this.state.heart_rate_seconds) &&
                                <p>{this.state.heart_rate_minutes} minutes {this.state.heart_rate_seconds} seconds</p>
                              }
                              </div>
	                           }
                          </FormGroup> 
                     
                     <FormGroup>
						<Label className="padding">1.12.3 What was your heart rate level when you started your heart rate recovery file?</Label>
						{this.props.editable &&
						<div className="input1">
							<Input
							id="placeholder" 
	                        type="select" 
	                        className="form-control custom-select" 
	                        value={this.state.heart_rate_level}
	                        onChange={this.handleChange} >
	                         <option key="select" value="">Select</option>
                             {this.createSleepDropdown(70,220,true)}                             
	                        </Input>
                        </div>
                       }
                       {
                          !this.props.editable &&
                          <div className="input">
                            <p>{this.state.heart_rate_level}</p>
                          </div>
                        }
					</FormGroup>

					 <FormGroup>
						<Label className="padding">1.12.4 In the first minute of your heart rate recovery file, what was your lowest heart rate?</Label>
						{this.props.editable &&
						<div className="input1">
							<Input
							id="placeholder" 
	                        type="select" 
	                        className="form-control custom-select" 
	                        value={this.state.heart_rate_recovery}
	                        onChange={this.handleChange} >
	                         <option key="select" value="">Select</option>
                             {this.createSleepDropdown(70,220,true)}                             
	                        </Input>
                        </div>
                       }
                       {
                          !this.props.editable &&
                          <div className="input">
                            <p>{this.state.heart_rate_recovery}</p>
                          </div>
                        }
					</FormGroup>

					 <FormGroup>
						<Label className="padding">1.12.5 Based on your HRR inputs, your heart rate recovery today</Label>
						{this.props.editable &&
						<div className="input1">
							<Input
							id="placeholder" 
	                        type="select" 
	                        className="form-control custom-select" 
	                        value={this.state.heart_rate_recovery}
	                        onChange={this.handleChange} >
	                         <option key="select" value="">Select</option>
                             {this.createSleepDropdown(70,220,true)}                             
	                        </Input>
                        </div>
                       }
                       {
                          !this.props.editable &&
                          <div className="input">
                            <p>{this.state.heart_rate_recovery}</p>
                          </div>
                        }
					</FormGroup>


					 <FormGroup>
						<Label className="padding">1.12.6 What is the lowest point your heart rate got to during your heart rate recovery?</Label>
						{this.props.editable &&
						<div className="input1">
							<Input
							id="placeholder" 
	                        type="select" 
	                        className="form-control custom-select" 
	                        value={this.state.heart_rate_recovery}
	                        onChange={this.handleChange} >
	                         <option key="select" value="">Select</option>
                             {this.createSleepDropdown(70,220,true)}                             
	                        </Input>
                        </div>
                       }
                       {
                          !this.props.editable &&
                          <div className="input">
                            <p>{this.state.heart_rate_recovery}</p>
                          </div>
                        }
					</FormGroup>

					<FormGroup>   
                            <Label className="LAbel">1.12.7 How long did it take for your heart rate to get to the lowest point?</Label>

                              {this.props.editable &&
	                           	  <div className="input1">
		                             <div className="col-xs-6">
                                  <div className="input1"> 
                                <Input type="select" name="heart_rate_minutes"
                                id="hours"
                                className="form-control custom-select"
                                value={this.state.heart_rate_minutes}
                                onChange={this.handleChange}>
                                 <option key="minutes" value="">Minutes</option>
                                {this.createSleepDropdown(0,59)}                        
                                </Input>
                                </div>
                                </div>
                              
                                <div className="col-xs-6 justify-content-right">
                               <div className="input1">
                                <Input type="select" name="heart_rate_seconds"
                                 id="minutes"
                                className="form-control custom-select "
                                value={this.state.heart_rate_seconds}
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
                              {(this.state.heart_rate_minutes && this.state.heart_rate_seconds) &&
                                <p>{this.state.heart_rate_minutes} minutes {this.state.heart_rate_seconds} seconds</p>
                              }
                              </div>
	                           }
                          </FormGroup> 

                           <FormGroup>
						<Label className="padding">1.12.8 What was your heart rate level when you started your heart rate recovery file?</Label>
						{this.props.editable &&
						<div className="input1">
							<Input
							id="placeholder" 
	                        type="select" 
	                        className="form-control custom-select" 
	                        value={this.state.heart_rate_recovery}
	                        onChange={this.handleChange} >
	                         <option key="select" value="">Select</option>
                             {this.createSleepDropdown(70,220,true)}                             
	                        </Input>
                        </div>
                       }
                       {
                          !this.props.editable &&
                          <div className="input">
                            <p>{this.state.heart_rate_recovery}</p>
                          </div>
                        }
					</FormGroup>

					 <FormGroup>
						<Label className="padding">1.12.9 In the first minute of your heart rate recovery file, what was your lowest heart rate?</Label>
						{this.props.editable &&
						<div className="input1">
							<Input
							id="placeholder" 
	                        type="select" 
	                        className="form-control custom-select" 
	                        value={this.state.heart_rate_recovery}
	                        onChange={this.handleChange} >
	                         <option key="select" value="">Select</option>
                             {this.createSleepDropdown(70,220,true)}                             
	                        </Input>
                        </div>
                       }
                       {
                          !this.props.editable &&
                          <div className="input">
                            <p>{this.state.heart_rate_recovery}</p>
                          </div>
                        }
					</FormGroup>

					 <FormGroup>
						<Label className="padding">1.12.10 Based on your HRR inputs, your heart rate recovery today</Label>
						{this.props.editable &&
						<div className="input1">
							<Input
							id="placeholder" 
	                        type="select" 
	                        className="form-control custom-select" 
	                        value={this.state.heart_rate_recovery}
	                        onChange={this.handleChange} >
	                         <option key="select" value="">Select</option>
                             {this.createSleepDropdown(70,220,true)}                             
	                        </Input>
                        </div>
                       }
                       {
                          !this.props.editable &&
                          <div className="input">
                            <p>{this.state.heart_rate_recovery}</p>
                          </div>
                        }
					</FormGroup>




			</div>

		);
	}
}