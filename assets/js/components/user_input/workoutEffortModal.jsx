import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className,Collapse,Popover,PopoverBody} from 'reactstrap';
import FontAwesome from "react-fontawesome";

export default class WorkoutEffortModal extends Component{

	constructor(props){
		super(props);
		const effort = this.props.workout_effort_hard_portion;
		const is_workout_hard = effort !== '' ? 'yes' : '';
		this.state = {
			is_workout_hard:is_workout_hard,
			workout_effort_hard_portion:effort,
			hardportionInfo:false,
			workouthardInfo:false,
		};
		this.handleRadioChange = this.handleRadioChange.bind(this);
		this.handleChangeHardWorkoutEffort = this.handleChangeHardWorkoutEffort.bind(this);
		this.toggleHard = this.toggleHard.bind(this);
		this.toggleWorkouthard=this.toggleWorkouthard.bind(this);

	}

	componentWillReceiveProps(nextProps) {
  	  if(nextProps.workout_effort_hard_portion !== this.props.workout_effort_hard_portion) {
  	  		const effort = nextProps.workout_effort_hard_portion;
			const is_workout_hard = effort !== '' ? 'yes' : 'no';
    	  	this.setState({
    	  		is_workout_hard:is_workout_hard,
				workout_effort_hard_portion:effort
    	  	});
    	}
  	}

	handleChangeHardWorkoutEffort(event){
		const value = event.target.value;
		this.setState({
			workout_effort_hard_portion:value
		},()=>{
			this.props.updateState(this.state.workout_effort_hard_portion);
		});
	}

	handleRadioChange(event){
		const value=event.target.value;
		if(value === 'no'){
		    this.setState({
		    	is_workout_hard: value,
		    	workout_effort_hard_portion:''
		    },()=>{
			this.props.updateState(this.state.workout_effort_hard_portion);
		});
		}else{
			this.setState({
				is_workout_hard: value
			});
		}
	}

	toggleHard(){
      this.setState({
        hardportionInfo:!this.state.hardportionInfo
      });
     }
	toggleWorkouthard(){
	      this.setState({
	        workouthardInfo:!this.state.workouthardInfo
	      });
	     }

	render(){
		return(
			<div>
					
				<Label className="LAbel">1.4.1 Was Any Portion Of Your Workout Hard?
				 <span id="workouthard"
                             onClick={this.toggleWorkouthard} 
                             style={{paddingLeft:"15px",color:"gray"}}>
                             <FontAwesome 
                                          style={{color:"#5E5E5E"}}
                                          name = "info-circle"
                                          size = "1.5x"                                      
                                        
                              />
                              </span>   
				</Label>
				<FormGroup check>
					{this.props.editable &&
						<div className="work_hard">
							<Label check className="btn  radio1">
								<Input type="radio" name="is_workout_hard"
									value="yes"
								 	checked={this.state.is_workout_hard === 'yes'}
								 	onChange={this.handleRadioChange}/> &nbsp;
								Yes
							</Label>
							&nbsp;
							<Label check className="btn radio1">
								<Input type="radio" name="is_workout_hard" 
									value="no"
									checked={this.state.is_workout_hard === 'no'}
									onChange={this.handleRadioChange}/> &nbsp;
								No
							</Label>
						</div>
					}
					{
                      !this.props.editable &&
                      <div className="input">
                        <p>{this.state.is_workout_hard}</p>
                      </div>
                    }
                    
				</FormGroup>

				<Popover 
                            className="pop"
                            id="popover" 
                            placement="right" 
                            isOpen={this.state.workouthardInfo}
                            target="workouthard" 
                            toggle={this.toggleWorkouthard}>
                              <PopoverBody>
                               <div>
                            	If you indicated that your overall workout was “Easy” in question 1.2,
                            	 but some portion of your workout was HARD, for example, you did some hard
                            	  intervals during your easy workout, select Yes to this question. If your
                            	   entire workout was easy with no HARD intervals, select “No”.
                                 </div>                                                   
                              </PopoverBody>
                           </Popover> 

				<Collapse isOpen={this.state.is_workout_hard === 'yes'}>
					<FormGroup>
						<Label className="padding">1.4.2 What Was Your Average Effort Level For The Hard Part Of Your Workout?
						 <span id="hard"
                             onClick={this.toggleHard} 
                             style={{paddingLeft:"8px",color:"gray"}}>
                             <FontAwesome 
                                          style={{color:"#5E5E5E"}}
                                          name = "info-circle"
                                          size = "1.5x"                                      
                                        
                              />
                              </span>   
						</Label>
						{this.props.editable &&
						<div className="input1">
							<Input
							id="placeholder" 
	                        type="select" 
	                        className="form-control custom-select" 
	                        value={this.state.workout_effort_hard_portion}
	                        onChange={this.handleChangeHardWorkoutEffort} >
	                              <option value="select">select</option>
	                              <option value="1">1</option>
	                              <option value="2">2</option>
	                              <option value="3">3</option>
	                              <option value="4">4</option>
	                              <option value="5">5</option>
	                              <option value="6">6</option>
	                              <option value="7">7</option>
	                              <option value="8">8</option>
	                              <option value="9">9</option>
	                              <option value="10">10</option>                            
	                        </Input>
                        </div>
                       }
                       {
                          !this.props.editable &&
                          <div className="input">
                            <p>{this.state.workout_effort_hard_portion}</p>
                          </div>
                        }
					</FormGroup>

					<Popover 
                            className="pop"
                            id="popover" 
                            placement="right" 
                            isOpen={this.state.hardportionInfo}
                            target="hard" 
                            toggle={this.toggleHard}>
                              <PopoverBody>
                               <div>
                            	If you indicated that some portion of your workout was HARD in question 1.4.1,
                            	 indicate what your average effort level was for the HARD portion of your workout.
                            	  For example, if ran 2 of your miles super hard at an effort level of 7 and 9 respectively,
                            	   then select “8” as an answer to this question. If you did HARD intervals at an effort level 
                            	   between 6-8, select “7” as your answer.
                                 </div>                                                   
                              </PopoverBody>
                           </Popover> 
				</Collapse>
			</div>
		);
	}
}