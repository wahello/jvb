import React, {Component} from 'react';
import moment from 'moment';

import TableItem from './TableItem';
import {
	convertSecToString,
	renderTimestampToString,
	getDTMomentObj,
	SELECT_FIELD,
	TIME_FIELD,
	DURATION_FIELD} from './lib';

class HRRTable extends Component{

	constructor(props){
		super(props);
		this.state = {
			editingField:false, //currently any field is being edited? 
			targetFieldStateMapping: null, //field currently being edited
			targetFieldType: null,
			modalHour:null,
			modalMinute: null,
			modalSecond: null,
			modalMeridian: null
		}
	}

	initializeModalTimeStates = (fieldStateMapping, fieldType) => {
		let hours = null;
		let minutes = null;
		let seconds = null;
		let meridian = null;
		let value = this.props.tableData[fieldStateMapping];
		if(fieldType == DURATION_FIELD){
			minutes = "0";
			seconds = "00";
			value = convertSecToString(value);
			if(value && value !== null){
				let ms = value.split(":");
				minutes = ms[0];
				seconds = ms[1];
			}
		}else if (fieldType == TIME_FIELD){
			hours = "00";
			minutes = "00";
			seconds = "00";
			meridian = ""
			value = renderTimestampToString(value);
			if(value && value !== null){
				let hmsa = value.split(":");
				hours = hmsa[0];
				minutes = hmsa[1];
				seconds = hmsa[2].split(" ")[0];
				meridian = hmsa[2].split(" ")[1];
			}
		}
		this.setState({
			modalHour:hours,
			modalMinute: minutes,
			modalSecond: seconds,
			modalMeridian: meridian
		});

	}

	toggleEditField = (event,fieldStateMapping=null, fieldType=null) => {
		let editingField = !this.state.editingField;
		let targetFieldStateMapping = fieldStateMapping;

		if(!editingField)
			targetFieldStateMapping = null;

		if(fieldStateMapping && editingField 
		   && (fieldType == TIME_FIELD || fieldType == DURATION_FIELD)){
			this.initializeModalTimeStates(fieldStateMapping, fieldType);
		}

		this.setState({
			editingField: editingField,
			targetFieldStateMapping: targetFieldStateMapping,
			targetFieldType: fieldType
		})
	}

	onTimeFieldChangeHandler = (stateName, event) => {
		let value = event.target.value;
		this.setState({
			[stateName]: value
		})
	}

	onTimeFieldFinishChange = () => {
		let timeInSeconds = 0;
		if(this.state.targetFieldType == TIME_FIELD){
			timeInSeconds = getDTMomentObj(
				moment(this.props.selectedDate),
				this.state.modalHour,
				this.state.modalMinute,
				this.state.modalSecond,
				this.state.modalMeridian
			)
			timeInSeconds = timeInSeconds.utc().valueOf();
		}else{
			let minutes = this.state.modalMinute? parseInt(this.state.modalMinute):0
			let seconds = this.state.modalSecond? parseInt(this.state.modalSecond):0
			timeInSeconds = minutes * 60 + seconds; 
		}
		let targetFieldStateMapping = this.state.targetFieldStateMapping;
		this.props.onChangeHandler(timeInSeconds, targetFieldStateMapping);
		this.onCancleTimeChange();
	}

	onCancleTimeChange = () => {
		this.setState({
			editingField:false,
			targetFieldStateMapping: null,
			modalHour:null,
			modalMinute: null,
			modalSecond: null,
			modalMeridian: null
		})
	}

	onChangeHandlerWrapper = (stateName, event) => {
		let yesNoFieldStateMapping = [
			"didMeasuredHRR", "didHRWentBelow99Beats", "AutoHRRWentBelow99"
		];
		let value = event.target.value;

		if(!isNaN(value) && value !== ""){
			value = parseInt(value);
		}else if(value == "" && !_.includes(yesNoFieldStateMapping,stateName)){
			value = null
		}
		this.setState({
			editingField: false,
			targetFieldStateMapping: false
		},() => {
			this.props.onChangeHandler(value, stateName);
		})
	}

	generateTableItems = () => {
		let tableItems = this.props.fieldConfig.fields.map(config => {
			let valueToRender = this.props.tableData[config.stateMappingKey];
			if(config.isDurationField){
				valueToRender = convertSecToString(valueToRender)
			}else if (config.isTimeField){
				valueToRender = renderTimestampToString(valueToRender);
			}
			let hours = null;
			let minutes = null;
			let seconds = null;
			let meridian = null;
			if(config.isTimeField || config.isDurationField){
				if(config.isDurationField){
					minutes = "0";
					seconds = "00";
					if(this.state.targetFieldStateMapping == config.stateMappingKey){
						minutes = this.state.modalMinute;
						seconds = this.state.modalSecond
					}else if(valueToRender){
						let ms = valueToRender.split(":");
						minutes = ms[0];
						seconds = ms[1];
					}
				}else{
					hours = "00";
					minutes = "00";
					seconds = "00";
					meridian = ""
					if(this.state.targetFieldStateMapping == config.stateMappingKey){
					   	hours = this.state.modalHour;
						minutes = this.state.modalMinute;
						seconds = this.state.modalSecond;
						meridian = this.state.modalMeridian;
					}else if(valueToRender){
						let hmsa = valueToRender.split(":");
						hours = hmsa[0]
						minutes = hmsa[1];
						seconds = hmsa[2].split(" ")[0];
						meridian = hmsa[2].split(" ")[1];
					}
				}
			}
			return(
				<TableItem {...config} 
				editMode = {this.props.editable}
				editingField = {this.state.editingField}
				toogleEditField = {this.toggleEditField}
				fieldCurrentlyEditing = {this.state.targetFieldStateMapping}
				onChangeHandler = {this.onChangeHandlerWrapper}
				onTimeFieldChangeHandler = {this.onTimeFieldChangeHandler}
				onTimeFieldChangeCancle = {this.onCancleTimeChange}
				onTimeFieldFinishChange = {this.onTimeFieldFinishChange}
				modalHour = {hours}
				modalMinute = {minutes}
				modalSecond = {seconds}
				modalMeridian = {meridian}
				{...this.props.tableData} />
			);
		})
		return tableItems
	}

	render(){
		let tableItems = this.generateTableItems();
		return (
			<div>
				<div className = "row justify-content-center hr_table_padd">
					<div className = "table table-responsive">
						<table className = "table table-striped table-bordered ">
							<thead className = "hr_table_style_rows">
								<th className = "hr_table_style_rows">{this.props.fieldConfig.tableHeader}</th>
								<th className = "hr_table_style_rows">
									{moment(this.props.selectedDate).format("MMM DD, YYYY")}
								</th>
							</thead>  
							<tbody>  
								{tableItems}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		)
	}
}

export default HRRTable;