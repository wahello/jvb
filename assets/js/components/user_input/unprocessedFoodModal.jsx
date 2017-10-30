import React, {Component} from 'react'
import {Button,FormGroup, Label, Input, FormText, className, Collapse} from 'reactstrap';

export default class UnprocesedFoodModal extends Component{

	constructor(props){
		super(props);
		const unprocessed_food_list = this.props.unprocessed_food_list;
		this.state = {
			collapse:true,
			enter_food:false,
			unprocessed_food_list:unprocessed_food_list
		};
		
		this.handleChange = this.handleChange.bind(this);
		this.onClickFoodList=this.onClickFoodList.bind(this);
		
	}

	componentWillReceiveProps(nextProps) {
  	  if(nextProps.unprocessed_food_list !== this.props.unprocessed_food_list) {
    	  	this.setState({
    	  		unprocessed_food_list:nextProps.unprocessed_food_list
    	  	});
    	}
  	}

	handleChange(event){
		const value = event.target.value;
	    this.setState({
	    	unprocessed_food_list: value,
	    },()=>{
	    	this.props.updateState(this.state.unprocessed_food_list)
	    });
	}

	onClickFoodList(event){
		console
			this.setState({
				enter_food:!this.state.enter_food
			});
	}



	render(){
		return(
			<div>
				<Collapse isOpen={this.state.collapse}>				
						<FormGroup>   	
                            	{this.props.editable &&
                            		<div>
                            		  <div className="d-flex justify-content-center">
                            			<btn onClick={this.onClickFoodList} className="btn btn-info">I Want to Enter a List of all Foods I Consumed</btn>
                            			</div>
                            			<div className="unprocess_food">
										<Collapse isOpen={this.state.enter_food}>
										<div className="col-xs-5">
											<Label>5.1 What Unprocessed Food Were Consumed?</Label>
											<div className="input1">	
					                            <Input 
						                            type="textarea" 
						                            className="form-control" 
						                            value={this.state.unprocessed_food_list}
						                            rows="5" cols="5"
						                            onChange={this.handleChange}
						                            placeholder="dairy,cheese,pasta,bread,white rice,etc..." />
					                        </div>
					                        </div>
					                        <div className="col-xs-5">
					                        <Label>5.2 What Processed Food Was Consumed?</Label>
											<div className="input1">	
					                            <Input 
						                            type="textarea" 
						                            className="form-control" 
						                            value={this.state.unprocessed_food_list}
						                            rows="5" cols="5"
						                            onChange={this.handleChange}
						                            placeholder="dairy,cheese,pasta,bread,white rice,etc..." />
					                        </div>
					                        </div>
					                    </Collapse>
					                    </div> 
					                    </div>
			                    }
			                    {!this.props.editable &&
	                             
	                              <div className="input">
	                              	<Label>5.1 What Unprocessed Food Were Consumed?</Label>
	                                <p>{this.state.unprocessed_food_list}</p>
	                              </div>
	                             
	                            }
                          </FormGroup> 			
				</Collapse>
			</div>
		);
	}
}