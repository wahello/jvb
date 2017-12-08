import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Modal,
		ModalHeader, ModalBody, ModalFooter, Collapse} from 'reactstrap';
import Textarea from 'react-textarea-autosize';

export default class SmokedSubstance extends Component{

	getStateObj(item){
		let pat = /^cigarettes/i;
		let isCigarettes = pat.test(item);
		let cigarettes_count = '';

		if (isCigarettes){
			if(item === 'cigarettes(60+)')
				cigarettes_count = "60+";
			else{
				let pattern = /^cigarettes\((\d+)\)$/i;
				cigarettes_count = pattern.exec(item)[1];
			}
			item = 'cigarettes';
		}

		let isOther = true;
		let smoke_items = ["",'cigarettes','cigars','marijuana'];

		for(let i of smoke_items){
			if(item === i){
				isOther = false;
				break;
			} 
		} 

		let stateObj = {
			collapse:true,
			smoked_substance_list:item,
			smoked_substance_to_show:isOther?'other':item,
			cigarettes_count:cigarettes_count,
			collapseOther: isOther,
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
		    	smoked_substance_list:'',
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
				smoked_substance_to_show:value
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
		elements.push(<option key={num} value={num+"+"}>{num+"+"}</option>);
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
		                              <Label className="btn btn-secondary radio1">
                                    <Input type="radio"
                                    name="smoked_substance_to_show"                                                                   
                                    value="cigarettes" 
                                    checked={this.state.smoked_substance_to_show === 'cigarettes'}
                                    onChange={this.handleChange}/> Cigarettes
                                  </Label>
                                  <Label className="btn btn-secondary radio1">
                                    <Input type="radio" name="smoked_substance_to_show" 
                                    value="cigars"
                                    checked={this.state.smoked_substance_to_show === 'cigars'}
                                    onChange={this.handleChange}/> Cigars
                                  </Label>
                                  <Label className="btn btn-secondary radio1">
                                    <Input type="radio" 
                                    name="smoked_substance_to_show" 
                                    value="marijuana"
                                    checked={this.state.smoked_substance_to_show === 'marijuana'}
                                    onChange={this.handleChange}/>Marijuana
                                  </Label> 
                                   <Label className="btn btn-secondary radio1">
                                    <Input type="radio" 
                                    name="smoked_substance_to_show" 
                                    value="other"
                                    checked={this.state.smoked_substance_to_show === 'other'}
                                    onChange={this.handleChange}/> Other
                                  </Label> 
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
				                            {this.createCigarettesDropdown(80)}
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
								<div>
								<Label>7.2 Write in What You Smoked</Label>
								<div className="input1">
									<Textarea 		                           
		                            className="form-control" 
		                            rows="5" cols="5"
		                            placeholder="Please type in..."
		                            value={this.state.smoked_substance_list}
		                            onChange={this.handleChange} />
	                            </div>
	                            </div>
	                        }
	                        {
                              !this.props.editable &&
                              <div>
                              	  <Label>7.2 Write in What You Smoked </Label>
	                              <div className="input">
	                                <p >{this.state.smoked_substance_list}</p>
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