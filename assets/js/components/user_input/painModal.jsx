import React, {Component} from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import {Button,FormGroup, Label, Input, FormText, className, Collapse} from 'reactstrap';
	

export default class PainModal extends Component{

	constructor(props){
		super(props);
		const area = this.props.pain_area;
		this.state = {
			collapse:false,	
			disabled: false,
			stayOpen: true,
			pain_area: area !== '' ? area.split(',') : []
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.handleSelectChange = this.handleSelectChange.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
	handleChange(event){
		const value = event.target.value;
		this.setState({
			pain_area:value
		},() => {
		    	this.props.updateState(this.state.pain_area);
		 });
	}
	handleSelectChange(value) {
		if (value === 'other'){
		    this.setState({
		    	pain_area: value,
		    	collapse:true
		    });
		}else{
			this.setState({
		    	pain_area:value
		    },()=>{
		    	this.props.updateState(this.state.pain_area)
		    });
		}
	}

	onSubmit(){
		this.props.updateState(this.state.pain_area);
		console.log(this.state);
	}

	render(){
		const option=[
                { value:"right knee",label:'Right knee'},
                { value:'left knee',label:'Light knee'},
                { value:"right ankle",label:'Right ankle'},
                { value:"left ankle",label:'Left ankle'},
                { value:"right foot",label:'Right foot'},
                { value:"left foot",label:'Left foot'},
                { value:"right shins",label:'Right shins'},
                { value:"left shins",label:'Left shins'},
                { value:"right hip",label:'Right hip'},
                { value:"left hip",label:'Left hip'},
                { value:"right achilles",label:'Right achilles'},
                { value:"left achilles",label:'Left achilles'},
                { value:"right calf",label:'Right calf'},
                { value:"left calf",label:'Left calf'},
                { value:"right toes",label:'Right toes'},
                { value:"left toes",label:'Left toes'},
                { value:"neck",label:'Neck'},
                { value:"upper back",label:'Upper back'},
                { value:"mid back",label:'Mid back'},
                { value:"lower back",label:'Lower back'},
                { value:"other",label:'Other'}

		];
		return(
			<div>
				<FormGroup>   
                    <Label>Where Did You Have Pain/Twinges?</Label>
                    <Select
							closeOnSelect={!this.state.stayOpen}
							disabled={this.state.disabled}
							multi
							onChange={this.handleSelectChange}
							options={option}
							simpleValue
							value={this.state.pain_area}
					/> 
                  </FormGroup> 

				<Collapse isOpen={this.state.collapse}>
					<FormGroup>
						<Label>Please write where you have pain/twinges</Label>
						<Input
						type="text"
						className="form-control"
						placeholder="Write where you have pain here.."
						onChange={this.handleChange} />
					</FormGroup>
				</Collapse>
			</div>
		);
	}
}