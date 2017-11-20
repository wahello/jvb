import React, {Component} from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import Textarea from 'react-textarea-autosize';

import {Button,FormGroup, Label, Input, FormText, className, Collapse} from 'reactstrap';
	

const option=[	
				{ value:"other",label:'Other'},
                { value:"right knee",label:'Right knee'},
                { value:'left knee',label:'Left knee'},
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
                { value:"groin",label:'Groin'},
                { value:"left it band",label:'Left IT Band'},
                { value:"right it band",label:'Right IT Band'},
                { value:"left shoulder",label:'Left Shoulder'},
                { value:"right shoulder",label:'Right Shoulder'}
                
                

		];

export default class PainModal extends Component{

	OtherPainArea(area){
		let options = {
            "right knee":true,"left knee":true,"right ankle":true,
            "left ankle":true,"right foot":true,"left foot":true,
            "right shins":true,"left shins":true,"right hip":true,
            "left hip":true,"right achilles":true,"left achilles":true,
            "right calf":true,"left calf":true,"right toes":true,
            "left toes":true,"neck":true,"upper back":true,
            "mid back":true,"lower back":true,"other":true,"groin":true,
            "left it band":true,"right it band":true,"left shoulder":true,
            "right shoulder":true,

		}

		let other_areas = [];
		let area_list = area.split(',');
		
		for(let a of area.split(',')){
			if(!options[a]){
				other_areas.push(a);
				area_list.splice(area_list.indexOf(a),1);		
			}
		}
		return [area_list,other_areas];
	}

	constructor(props){
		super(props);
		let area = this.props.pain_area;
		let tmp = this.OtherPainArea(area);
		area = tmp[0].join(',');
		let other_pain_areas = tmp[1].join(',');
		let pain_area_to_show = area;
		if(other_pain_areas.length)
		{	
			if(area.length) 
				pain_area_to_show = area;
			else
				pain_area_to_show = 'other';
		}


		this.state = {
			collapse:other_pain_areas.length ? true : false,	
			disabled: false,
			stayOpen: true,
			pain_area: area,
			pain_area_to_show: pain_area_to_show,
			other_pain_areas:other_pain_areas
		};
		this.handleSelectChange = this.handleSelectChange.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentWillReceiveProps(nextProps) {
  	  if(nextProps.pain_area !== this.props.pain_area) {

	  	  	let tmp = this.OtherPainArea(nextProps.pain_area);
			let area = tmp[0].join(',');
			let other_pain_areas = tmp[1].join(',');
			let pain_area_to_show = area;
			if(other_pain_areas.length){
				if(area.length)
					pain_area_to_show = area;
				else
					pain_area_to_show = 'other';
			}

    	  	this.setState({
    	  		pain_area: area,
    	  		pain_area_to_show:pain_area_to_show,
    	  		other_pain_areas:other_pain_areas
    	  	});
    	}
  	}

	handleChange(event){
		let value = event.target.value;
		this.setState({
			other_pain_areas:value
		},() => {
				if (value && this.state.pain_area){
		    		value = this.state.pain_area + "," + value;
		    	}else if(this.state.pain_area){
		    		value = this.state.pain_area;
		    	}
		    	this.props.updateState(value);
		 });
	}

	handleSelectChange(value) {
		console.log(value);
		let otherPattern = /.*other.*/i;
		if (otherPattern.test(value)){
		    this.setState({
		    	pain_area:value,
		    	pain_area_to_show: value,
		    	collapse:true
		    });
		}else if(value === ''){
			this.setState({
				pain_area:'',
				pain_area_to_show:'',
				other_pain_areas:'',
				collapse:false				
			},()=>{
				this.props.updateState(this.state.pain_area);
			});
		}
		else{
			this.setState({
		    	pain_area:value,
		    	pain_area_to_show:value
		    },()=>{
		    	this.props.updateState(this.state.pain_area);
		    });
		}
	}

	render(){
		return(
			<div>
				<FormGroup>   

                    <Label>1.5.1 Where Did You Have Pain/Twinges?</Label>
                    {this.props.editable &&
						<div className="input1">
		                    <Select
									closeOnSelect={!this.state.stayOpen}
									disabled={this.state.disabled}
									multi
									onChange={this.handleSelectChange}
									options={option}
									simpleValue
									value={this.state.pain_area_to_show}
							/> 
						</div>
					}
					{
                      	!this.props.editable &&
                      	<div className="input">
                        	<p>{this.state.pain_area_to_show}</p>
                      	</div>
                    }
                  </FormGroup> 

				<Collapse isOpen={this.state.collapse}>
					<FormGroup>
						<Label>1.5.1.1 Please Write Where You Have Pain/Twinges</Label>
							{this.props.editable &&
								<div className="input1">
									<Textarea
									type="textarea"
									className="form-control"
									placeholder="Write in....."
									rows="5" cols="5"
									value={this.state.other_pain_areas}
									onChange={this.handleChange} />
								</div>
							}
							{
                             	 !this.props.editable &&
                             	 <div className="input">
                                	<p >{this.state.other_pain_areas}</p>
                              	 </div>
                            }
					</FormGroup>
				</Collapse>
			</div>
		);
	}
}