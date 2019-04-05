import React from 'react';
import moment from 'moment';

import {
	Input,
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter} from 'reactstrap';

import {
	convertSecToString,
	renderTimestampToString,
	createSelectOptions,
	createDurationOptions,
	captilize,
	SELECT_FIELD,
	TIME_FIELD,
	DURATION_FIELD} from './lib';

const tableItem = (props) => {
	let valueToRender = props[props.stateMappingKey];
	let fieldType = SELECT_FIELD;
	if(props.isDurationField){
		valueToRender = convertSecToString(valueToRender);
		fieldType = DURATION_FIELD;
	}else if (props.isTimeField){
		valueToRender = renderTimestampToString(valueToRender);
		fieldType = TIME_FIELD;
	}

	let formattedValue = valueToRender;
	if(formattedValue == "yes" || formattedValue == "no"){
		formattedValue = captilize(formattedValue);
	}
	
	let tableRow = (
		<tr className = "hr_table_style_rows">   
			<td className = "hr_table_style_rows">{props.label}</td>    
			<td className = "hr_table_style_rows">{formattedValue}</td>
		</tr>
	)
	let inputField = formattedValue

	if (props.editMode){
		if (props.isSelectField){
			if (props.editingField && props.fieldCurrentlyEditing == props.stateMappingKey){
				inputField = (
					<Input
		  	    		style = {{maxWidth:"100px"}}
		                type="select"
		                className="custom-select form-control" 
		               	value = {valueToRender}
		               	onChange = {(event) => {props.onChangeHandler(props.stateMappingKey, event)}}
		            >
		                {createSelectOptions(props.selectOptions)}
		            </Input>
				)
			}
		}
		else if(props.isDurationField){
			if (props.editingField && props.fieldCurrentlyEditing == props.stateMappingKey){
				inputField = (
					<Modal isOpen={props.fieldCurrentlyEditing == props.stateMappingKey}>
	  					<ModalHeader>{props.label}</ModalHeader>
	      				<ModalBody>
	        				<div className = "row justify-content-center">
		        				<span>
				          	    	<Input
				          	    		style = {{minWidth:"130px"}}
		                                type="select"
		                                className="custom-select form-control"
		                                value={props.modalMinute}
		                                onChange = {(event) => props.onTimeFieldChangeHandler(
		                                			 "modalMinute",event)}
		                            >
		                            	{createDurationOptions(0,59)}
		                        	</Input>
		                        </span>
		                        <span style = {{marginLeft:"30px"}}>
		                        	<Input
				          	    		style = {{minWidth:"130px"}}
			                            type="select"
			                            className="custom-select form-control"
			                            value={props.modalSecond}
			                            onChange = {(event) => props.onTimeFieldChangeHandler(
		                                			 "modalSecond",event)}
			                            >
			                            {createDurationOptions(0,59,true)}
		                        	</Input>
		                        </span>
	                        </div>
	  					</ModalBody>
	  					<ModalFooter>
		    				<Button color="primary" onClick = {props.onTimeFieldFinishChange}>
		    					Save
		    				</Button>
		        			<Button color="secondary" onClick = {props.onTimeFieldChangeCancle}>
		        				Cancel
		        			</Button>
	      				</ModalFooter>
    				</Modal>
				)
			}
		}
		else if(props.isTimeField){
			if (props.editingField && props.fieldCurrentlyEditing == props.stateMappingKey){
				inputField = (
					<Modal isOpen={props.fieldCurrentlyEditing == props.stateMappingKey}>
	  					<ModalHeader>{props.label}</ModalHeader>
	      				<ModalBody>
	        				<div className = "row justify-content-center">
		        				<span>
				          	    	<Input
				          	    		style = {{minWidth:"80px"}}
		                                type="select"
		                                className="custom-select form-control"
		                                value={props.modalHour}
		                                onChange = {(event) => props.onTimeFieldChangeHandler(
		                                			 "modalHour",event)}
		                            >
		                            	{createDurationOptions(0,12,true)}
		                        	</Input>
		                        </span>
		                        <span style = {{marginLeft:"30px"}}>
		                        	<Input
				          	    		style = {{minWidth:"80px"}}
			                            type="select"
			                            className="custom-select form-control"
			                            value={props.modalMinute}
			                            onChange = {(event) => props.onTimeFieldChangeHandler(
		                                			 "modalMinute",event)}
			                            >
			                            {createDurationOptions(0,59,true)}
		                        	</Input>
		                        </span>
		                        <span style = {{marginLeft:"30px"}}>
	                            	<Input
				          	    		style = {{minWidth:"80px"}}
			                            type="select"
			                            className="custom-select form-control" 
			                            value={props.modalSecond}
			                            onChange = {(event) => props.onTimeFieldChangeHandler(
		                                			 "modalSecond",event)}
			                            >
			                            {createDurationOptions(0,59,true)}
	                            	</Input>
	                            </span>
	                             <span style = {{marginLeft:"30px"}}>
	                            	<Input
				          	    		style = {{minWidth:"80px"}}
			                            type="select"
			                            className="custom-select form-control"
			                            value={props.modalMeridian}
			                            onChange = {(event) => props.onTimeFieldChangeHandler(
		                                			 "modalMeridian",event)}
			                            >
			                            <option value={""}>AM/PM</option>                                 
                                    	<option value="am">AM</option>
                                        <option value="pm">PM</option>
	                            	</Input>
	                            </span>
	                        </div>
	  					</ModalBody>
	  					<ModalFooter>
		    				<Button color="primary" onClick = {props.onTimeFieldFinishChange}>
		    					Save
		    				</Button>
		        			<Button color="secondary" onClick = {props.onTimeFieldChangeCancle}>
		        				Cancel
		        			</Button>
	      				</ModalFooter>
    				</Modal>
				)
			}
		}

		let editButton = (
			<span style = {{marginLeft:"30px"}}  
            	onClick = {() => props.toogleEditField(event,props.stateMappingKey, fieldType)}
    			className="fa fa-pencil fa-1x">
			</span>
		)
		if(!props.editable){
			editButton = "";
		}

		tableRow = (
			<tr className = "hr_table_style_rows">   
				<td className = "hr_table_style_rows">{props.label}</td>
				<td className = "hr_table_style_rows">
					{inputField}
		            {editButton}
    			</td>
			</tr> 
		)
	}
	return tableRow
}

export default tableItem;