import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Modal,
		ModalHeader, ModalBody, ModalFooter, Collapse} from 'reactstrap';

export default class SmokedSubstance extends Component{

	getStateObj(item){
		let pat = /^cigarettes/i;
		let isCigarettes = pat.test(item);
		let cigarettes_count = '';
		let smoked_substance_to_show = '';

		if (isCigarettes){
			if(item === 'cigarettes(60+)')
				cigarettes_count = "60+";
			else{
				let pattern = /^cigarettes\((\d+)\)$/i;
				cigarettes_count = pattern.exec(item)[1];
			}
			item = 'cigarettes';
		}

		if(isCigarettes)
			smoked_substance_to_show = 'cigarettes';
		else if(item === '')
			smoked_substance_to_show = '';
		else
			smoked_substance_to_show = 'other';

		let stateObj = {
			collapse:true,
			smoked_substance_to_show:smoked_substance_to_show,
			smoked_substance_list:item,
			cigarettes_count:cigarettes_count,
			collapseOther: (item !== '' && item !== 'cigarettes')? true : false,
			collapseCigarettesCount: isCigarettes ? true : false
		}

		return stateObj;
	}

	constructor(props){
		super(props);
		let smoked_substance_list = this.props.smoked_substance_list;
		let stateObj = this.getStateObj(smoked_substance_list);
		this.state = stateObj;
		this.handleChange = this.handleChange.bind(this);
		this.handleChangeCigarettes = this.handleChangeCigarettes.bind(this);		

	}

	componentWillReceiveProps(nextProps) {
  	  if(nextProps.smoked_substance_list !== this.props.smoked_substance_list) {
  	  		let smoked_substance_list = nextProps.smoked_substance_list;
			let stateObj = this.getStateObj(smoked_substance_list);
    	  	this.setState({
    	  		...stateObj
    	  	});
    	}
  	}

	handleChange(event){
		const value = event.target.value;
		if (value === 'other'){
		    this.setState({
		    	collapseOther:true,
		    	smoked_substance_to_show:value,
		    	collapseCigarettesCount:false
		    });
		}else if (value === 'cigarettes'){
			this.setState({
		    	smoked_substance_list: value,
		    	smoked_substance_to_show:value,
		    	collapseCigarettesCount: true,
		    	collapseOther:false
		    });
		}else {
			this.setState({
				smoked_substance_list: value,
				smoked_substance_to_show:'other'
			},()=>{
					this.props.updateState(this.state.smoked_substance_list)
				});
		}
	}

	handleChangeCigarettes(event){
		const value = event.target.value;
		const smoked_substance_list = this.state.smoked_substance_list+"("+value+")";

		this.setState({
			cigarettes_count: value,
			smoked_substance_list:smoked_substance_list
		},()=>{
			this.props.updateState(smoked_substance_list);
		});
	}
	

	createCigarettesDropdown(num){
		let elements = [];
		elements.push(<option key="select" value=''>select</option>);
		for(let i=1;i<=num;i++){
			elements.push(<option key={i} value={i}>{i}</option>);
		}
		elements.push(<option key={num+"+"} value={num+"+"}>{num+"+"}</option>);
		return elements;
	}

	render(){
		return(
			<div>
				
					<Collapse isOpen={this.state.collapse}>
						<FormGroup>   
                            <Label>7.1 What Did You Smoke Yesterday?</Label>

                            {this.props.editable &&
	                            <div className="input1">
		                            <Input 
		                            type="select" 
		                            className="custom-select form-control" 
		                            value={this.state.smoked_substance_to_show}
		                            onChange={this.handleChange}>
		                            	<option value="">select</option>
		                                <option value="other">Other</option>
		                                <option value="cigarettes">Cigarettes</option>
		                            </Input> 
	                            </div> 
	                        }
	                        {
	                          !this.props.editable &&
	                          <div className="input">
	                            <p>{this.state.smoked_substance_to_show}</p>
	                          </div>
	                        }
                          </FormGroup> 

                        <Collapse isOpen={this.state.collapseCigarettesCount}>
							<FormGroup>
								<Label>7.2 How Many Cigarettes You Have Smoked?</Label>

								{this.props.editable &&
									<div className="input1">
										<Input 
				                            type="select" 
				                            className="custom-select form-control" 
				                            value={this.state.cigarettes_count}
				                            onChange={this.handleChangeCigarettes}>
				                            {this.createCigarettesDropdown(60)}
			                            </Input>
		                            </div> 
		                        }
		                        {
                                  !this.props.editable &&
                                  <div className="input">
                                    <p>{this.state.cigarettes_count}</p>
                                  </div>
                                }
							</FormGroup>
						</Collapse>

						<Collapse isOpen={this.state.collapseOther}>
							<FormGroup>
							{this.props.editable &&
								<div className="input1">
									<Input 
		                            type="textarea" 
		                            className="form-control" 
		                            rows="5" cols="5"
		                            placeholder="Please type in..."
		                            value={this.state.smoked_substance_list}
		                            onChange={this.handleChange} />
	                            </div>
	                        }
	                        {
                              !this.props.editable &&
                              <div>
                              	  <Label>6.2 Other Smoked Substances </Label>
	                              <div className="input">
	                                <p>{this.state.smoked_substance_list}</p>
	                              </div>
                              </div>
                            }
							</FormGroup>
						</Collapse>

					
					</Collapse>
				
			</div>
		);
	}
}