import React, {Component} from 'react';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
import FontAwesome from "react-fontawesome";
import {
	Button,
	Popover,
	PopoverBody
} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

var CalendarWidget = require('react-calendar-widget');

import NavbarMenu from '../navbar';
import fetchHeartData,{updateHeartData, createHRRStats} from '../../network/heart_cal';
import HRRTable from './HRRTable/HRRTable';
import {getCurrentOffset} from './HRRTable/lib';
import Overlay from '../shared/Overlay/Overlay';

class HeartRateRecoveryChart extends Component {
	constructor(props){
		super(props);
		this.state = {
			selectedDate: new Date(),
			loadingHRRData: false,
			editable: false,
			isCalendarOpen: false,
			isHRRCreated: false,
			creatingManualHRR: false,
			tableMeta: this.getTablesMeta(),
			...this.getInitialHRRValueState(),
		}
	}

	componentDidMount(){
		this.setState({
			loadingHRRData:true,
		});
		fetchHeartData(this.onSuccessHRR,this.onErrorHRR,this.state.selectedDate);
	}

	getInitialHRRValueState = () => {
		let initialValues  = {
			IncludeHRRStats: true,
			UserUpdatedHRRStats: false,

			didMeasuredHRR: '',
			didHRWentBelow99Beats: '',
			timeToReach99Beats: null,
			HRRFileStartHR: null,
			LowestHRInFirstMinute: null,
			HRBeatRecoveredInFirstMinute: null,

			ActEndTime: null,
			DiffActEndHRRStartTime: null,
			HRRStartTime: null,
			ActEndHR: null,
			HRBeatsUpOrDown: null,
			Pure1MinHRRBeatsLowered: null,
			PureTimeTo99: null,

			AutoHRRWentBelow99: '',
			AutoTimeToReach99: null,
			AutoTimeReached99: null,
			AutoLowestHRInFirstMinute: null,
			AutoHRBeatRecoveredInFirstMinute: null
		}
		return initialValues;
	}

	getTableData = (tableName) => {
		let tableData = {};
		if(tableName == 'HRRTableFirst'){
			tableData = {
				didMeasuredHRR: this.state.didMeasuredHRR,
				didHRWentBelow99Beats: this.state.didHRWentBelow99Beats,
				timeToReach99Beats: this.state.timeToReach99Beats,
				HRRFileStartHR: this.state.HRRFileStartHR,
				LowestHRInFirstMinute: this.state.LowestHRInFirstMinute,
				HRBeatRecoveredInFirstMinute: this.state.HRBeatRecoveredInFirstMinute
			} 
		}else if(tableName == 'HRRTableSecond'){
			tableData = {
				ActEndTime: this.state.ActEndTime,
				DiffActEndHRRStartTime: this.state.DiffActEndHRRStartTime,
				HRRStartTime: this.state.HRRStartTime,
				ActEndHR: this.state.ActEndHR,
				HRBeatsUpOrDown: this.state.HRBeatsUpOrDown,
				Pure1MinHRRBeatsLowered: this.state.Pure1MinHRRBeatsLowered,
				PureTimeTo99: this.state.PureTimeTo99
			}
		}else{
			tableData = {
				ActEndTime: this.state.ActEndTime,
				didMeasuredHRR: this.state.didMeasuredHRR,
				AutoHRRWentBelow99: this.state.AutoHRRWentBelow99,
				AutoTimeToReach99: this.state.AutoTimeToReach99,
				AutoTimeReached99: this.state.AutoTimeReached99,
				HRRFileStartHR: this.state.HRRFileStartHR,
				AutoLowestHRInFirstMinute: this.state.AutoLowestHRInFirstMinute,
				AutoHRBeatRecoveredInFirstMinute: this.state.AutoHRBeatRecoveredInFirstMinute,
			}
		}
		return tableData;
	}

	prepareHRRStatsForSubmitUpdate = () => {
		let data = {
			include_hrr: this.state.IncludeHRRStats,
			use_updated_hrr: this.state.UserUpdatedHRRStats,

			Did_you_measure_HRR: this.state.didMeasuredHRR,
			Did_heartrate_reach_99: this.state.didHRWentBelow99Beats,
			time_99: this.state.timeToReach99Beats,
			HRR_start_beat: this.state.HRRFileStartHR,
			lowest_hrr_1min: this.state.LowestHRInFirstMinute,
			No_beats_recovered: this.state.HRBeatRecoveredInFirstMinute,

			end_time_activity: this.state.ActEndTime,
			diff_actity_hrr: this.state.DiffActEndHRRStartTime,
			HRR_activity_start_time: this.state.HRRStartTime,
			end_heartrate_activity: this.state.ActEndHR,
			heart_rate_down_up: this.state.HRBeatsUpOrDown,
			pure_1min_heart_beats: this.state.Pure1MinHRRBeatsLowered,
			pure_time_99: this.state.PureTimeTo99,

			no_fitfile_hrr_reach_99: this.state.AutoHRRWentBelow99,
			no_fitfile_hrr_time_reach_99: this.state.AutoTimeToReach99,
			time_heart_rate_reached_99: this.state.AutoTimeReached99,
			lowest_hrr_no_fitfile: this.state.AutoLowestHRInFirstMinute,
			no_file_beats_recovered: this.state.AutoHRBeatRecoveredInFirstMinute
		}
		return data;
	}

	initializeFieldMeta = (label,stateMappingKey,isSelectField = False,
						   selectOptions = [], isTimeField = false,
						   isDurationField=false, editable = true) => {
		let field = {
			label,
			stateMappingKey,
			isSelectField,
			selectOptions,
			isTimeField,
			isDurationField,
			editable
		}
		return field
	}

	getTablesMeta = () => {
		let heartRateOptions = _.range(70,220).map( x => {return {label:x, value:x}});
		let beatRecoveredOptions = _.range(0, 220).map(x => {return {label:x, value:x}});
		let yesNoOptions = [
			{label:"Yes", value: "yes"},
			{label: "No", value: "no"}
		]

		let tables = {}

		let tableFirst = {
			tableHeader: "HRR Stats",
			fields:[
				this.initializeFieldMeta(
					"Did you measure your heart rate recovery (HRR) after today’s aerobic workout?",
					"didMeasuredHRR", true, yesNoOptions
				),
				this.initializeFieldMeta(
					"Did your heart rate go down to 99 beats per minute or lower?",
					"didHRWentBelow99Beats", true, yesNoOptions
				),
				this.initializeFieldMeta(
					"Duration (mm:ss) for Heart Rate Time to Reach 99",
					"timeToReach99Beats", false, [], false, true
				),
				this.initializeFieldMeta(
					"HRR File Starting Heart Rate",
					"HRRFileStartHR", true, heartRateOptions
				),
				this.initializeFieldMeta(
					"Lowest Heart Rate Level in the 1st Minute",
					"LowestHRInFirstMinute", true, heartRateOptions
				),
				this.initializeFieldMeta(
					"Number of heart beats recovered in the first minute",
					"HRBeatRecoveredInFirstMinute", true, beatRecoveredOptions
				)
			]
		}

		let tableSecond = {
			tableHeader: "Other HRR Stats",
			fields:[
				this.initializeFieldMeta(
					"End Time of Activity (hh:mm:ss)",
					"ActEndTime", false, [], true
				),
				this.initializeFieldMeta(
					"Difference Between Activity End time and HRR Start time (mm:ss)",
					"DiffActEndHRRStartTime", false, [], false, true
				),
				this.initializeFieldMeta(
					"HRR Start Time (hh:mm:ss)",
					"HRRStartTime", false, [], true
				),
				this.initializeFieldMeta(
					"Heart Rate at End of Activity",
					"ActEndHR", true, heartRateOptions
				),
				this.initializeFieldMeta(
					"Heart rate beats your heart rate went down/(up) from end of workout file to start of HRR file",
					"HRBeatsUpOrDown", true, beatRecoveredOptions
				),
				this.initializeFieldMeta(
					"Pure 1 Minute HRR Beats Lowered",
					"Pure1MinHRRBeatsLowered", true, beatRecoveredOptions
				),
				this.initializeFieldMeta(
					"Pure time to 99 (mm:ss)",
					"PureTimeTo99", false, [], false, true
				)
			]
		}

		let tableThird = {
			tableHeader: "Hrr Automation When User Didn't Create HRR File *",
			fields:[
				this.initializeFieldMeta(
					"End Time of Activity (hh:mm:ss)",
					"ActEndTime", false, [], true, false
				),
				this.initializeFieldMeta(
					"Did you measure your heart rate recovery (HRR) after today’s aerobic workout?",
					"didMeasuredHRR", true, yesNoOptions, false, false, false
				),
				this.initializeFieldMeta(
					"Did your heart rate go down to 99 beats per minute or lower?",
					"AutoHRRWentBelow99", true, yesNoOptions
				),
				this.initializeFieldMeta(
					"Duration (mm:ss) for Heart Rate Time to Reach 99",
					"AutoTimeToReach99", false, [], false, true
				),
				this.initializeFieldMeta(
					"Time Heart Rate Reached 99 (hh:mm:ss)",
					"AutoTimeReached99", false, [], true
				),
				this.initializeFieldMeta(
					"HRR File Starting Heart Rate",
					"HRRFileStartHR", true, heartRateOptions
				),
				this.initializeFieldMeta(
					"Lowest Heart Rate Level in the 1st Minute",
					"AutoLowestHRInFirstMinute", true, heartRateOptions
				),
				this.initializeFieldMeta(
					"Number of heart beats recovered in the first minute",
					"AutoHRBeatRecoveredInFirstMinute", true, beatRecoveredOptions
				)
			]
		}
		
		tables['HRRTableFirst'] = tableFirst;
		tables['HRRTableSecond'] = tableSecond;
		tables['HRRTableThird'] = tableThird;

		return tables;
	}

	onSuccessHRR = (data) => {
		let IncludeHRRStats = this.state.IncludeHRRStats;
		if(data.data.include_hrr !== undefined && data.data.include_hrr !== null)
			IncludeHRRStats = data.data.include_hrr
		let UserUpdatedHRRStats = this.state.UserUpdatedHRRStats;
		if(data.data.use_updated_hrr !== undefined && data.data.use_updated_hrr !== null)
			UserUpdatedHRRStats = data.data.use_updated_hrr
		let isHRRCreated = data.data.created_at || data.data.offset ? true : false;

		this.setState({
			loadingHRRData:false,
			editable: false,
			isHRRCreated: isHRRCreated,

			IncludeHRRStats: IncludeHRRStats,
			UserUpdatedHRRStats: UserUpdatedHRRStats,

			didMeasuredHRR: data.data.Did_you_measure_HRR,
			didHRWentBelow99Beats: data.data.Did_heartrate_reach_99,
			timeToReach99Beats: data.data.time_99,
			HRRFileStartHR: data.data.HRR_start_beat,
			LowestHRInFirstMinute: data.data.lowest_hrr_1min,
			HRBeatRecoveredInFirstMinute:data.data.No_beats_recovered,

			ActEndTime: data.data.end_time_activity,
			DiffActEndHRRStartTime: data.data.diff_actity_hrr,
			HRRStartTime: data.data.HRR_activity_start_time,
			ActEndHR: data.data.end_heartrate_activity,
			HRBeatsUpOrDown: data.data.heart_rate_down_up,
			Pure1MinHRRBeatsLowered: data.data.pure_1min_heart_beats,
			PureTimeTo99: data.data.pure_time_99,

			AutoHRRWentBelow99: data.data.no_fitfile_hrr_reach_99,
			AutoTimeToReach99: data.data.no_fitfile_hrr_time_reach_99,
			AutoTimeReached99: data.data.time_heart_rate_reached_99,
			AutoLowestHRInFirstMinute: data.data.lowest_hrr_no_fitfile,
			AutoHRBeatRecoveredInFirstMinute: data.data.no_file_beats_recovered
		})
	}

	onErrorHRR = (error) => {
		console.log(error.message);
		this.setState({
			loadingHRRData:false,
			editable: true
		})
	}

	onSelectNewDate = (date) => {
		let updatedState = {
			selectedDate: date,
			loadingHRRData: true,
			editable: false,
			isCalendarOpen: false,
			isHRRCreated: false,
			creatingManualHRR: false,
			...this.getInitialHRRValueState()
		}

		this.setState({
			...updatedState
		},() => {
			fetchHeartData(this.onSuccessHRR,this.onErrorHRR,this.state.selectedDate);
		})
	}

	moveDateBackward = (date) => {
		let today = this.state.selectedDate;
		let yesterday = moment(today).subtract(1, 'days').toDate()
		this.onSelectNewDate(yesterday);
	}

	moveDateForward = (date) => {
		let today = this.state.selectedDate;
		let tomorrow = moment(today).add(1, 'days').toDate()
		this.onSelectNewDate(tomorrow);
	}

	toggleCalendar = () => {
		this.setState({
			isCalendarOpen: !this.state.isCalendarOpen
		})
	}

	toggleEditForm = () => {
		this.setState({
			editable: !this.state.editable
		})
	}

	onChangeHandler = (value, stateName) => {
		this.setState({
			[stateName]: value
		})
	}

	onSuccessUpdateHRR = (data) => {
		toast.info(
			"Your HRR stats have been updated successfully",
			{className:"dark"}
		);
		this.onSuccessHRR(data);
	}

	updateHRR = () => {
		let data = this.prepareHRRStatsForSubmitUpdate();
		data['use_updated_hrr'] = true;
		updateHeartData(
			data,
			this.state.selectedDate,
			this.onSuccessUpdateHRR,
			this.onErrorHRR
		);
	}

	onSuccessCreateHRR = (data) => {
		toast.info(
			"Your HRR stats have been submitted successfully",
			{className:"dark"}
		);
		this.onSuccessHRR(data);
	}

	createHRR = () => {
		let data = this.prepareHRRStatsForSubmitUpdate();
		let offset = getCurrentOffset();
		let created_at = moment(this.state.selectedDate).format('YYYY-MM-DD');
		data["offset"] = offset;
		data["created_at"] = created_at;
		data["include_hrr"] = true;
		data["use_updated_hrr"] = true;
		createHRRStats(
			data,
			this.onSuccessCreateHRR,
			this.onErrorHRR
		);
	}

	createManualHRR = () => {
		this.setState({
			editable: true,
			creatingManualHRR: !this.state.creatingManualHRR
		})
	}

	IncludeExcludeHRRToggler = () => {
		this.setState({
			IncludeHRRStats: !this.state.IncludeHRRStats
		},() => {
			let data = this.prepareHRRStatsForSubmitUpdate();
			updateHeartData(
				data,
				this.state.selectedDate,
				this.onSuccessHRR,
				this.onErrorHRR
			);
		})
	}

	render(){
		let HRRActionButton = (
			<div className = "row justify-content-center">
          	    <Button onClick = {this.createHRR}>Submit</Button>
          	</div>
		)
		if(this.state.isHRRCreated){
			HRRActionButton = (
				<div className = "row justify-content-center">
	          	    <Button onClick = {this.updateHRR}>Update</Button>
	          	</div>
	        )	
		}

		let charts = (
			<div className="no_hrr_message">
				<p>
					There is no HRR stats to show. You can manually create HRR stats
					by clicking on the "Create Manual HRR" button.
				</p>
			</div>
		)
		if(this.state.didMeasuredHRR == 'yes' && !this.state.creatingManualHRR){
			charts = (
				<div>
					<HRRTable 
						fieldConfig = {this.state.tableMeta.HRRTableFirst}
						selectedDate = {this.state.selectedDate}
						editable = {this.state.editable}
						tableData = {this.getTableData("HRRTableFirst")}
						onChangeHandler = {this.onChangeHandler}
					/>
					<HRRTable 
						fieldConfig = {this.state.tableMeta.HRRTableSecond}
						selectedDate = {this.state.selectedDate}
						editable = {this.state.editable}
						tableData = {this.getTableData("HRRTableSecond")}
						onChangeHandler = {this.onChangeHandler}
					/>
					{HRRActionButton}
				</div>
			)
		}else if(this.state.creatingManualHRR){
			charts = (
				<div>
					<HRRTable 
						fieldConfig = {this.state.tableMeta.HRRTableFirst}
						selectedDate = {this.state.selectedDate}
						editable = {this.state.editable}
						tableData = {this.getTableData("HRRTableFirst")}
						onChangeHandler = {this.onChangeHandler}
					/>
					{HRRActionButton}
				</div>
			)
		}else if(this.state.isHRRCreated){
			charts = (
				<div>
					<HRRTable 
						fieldConfig = {this.state.tableMeta.HRRTableThird}
						selectedDate = {this.state.selectedDate}
						editable = {this.state.editable}
						tableData = {this.getTableData("HRRTableThird")}
						onChangeHandler = {this.onChangeHandler}
					/>
					<p className="hrr_chart_footnote">
						* User did not report HRR. All HRR data is generated automatically
						from your wearable device.
					</p>
					{HRRActionButton}
				</div>
			)
		}

		let editOrCreateButton = (
			<Button 
				id="nav-btn"
				size="sm"
				onClick={this.createManualHRR}
				className="btn hidden-sm-up">
				Create Manual HRR		  
			</Button>
		)

		if(this.state.isHRRCreated){
			editOrCreateButton = (
				<Button 
					id="nav-btn"
					size="sm"
					onClick={this.toggleEditForm}
					className="btn hidden-sm-up">
					{this.state.editable ? 'View HRR Data' : 'Edit HRR Data'}		  
				</Button>
			)
		}

		let fetchingHRROverlay = "";
		if(this.state.loadingHRRData){
			let currentDate = moment(this.state.selectedDate).format('MMMM D, YYYY');
			fetchingHRROverlay = (
				<Overlay 
					overlayText={`Fetching Time to Hrr Summary Dashboard Data For ${currentDate}`}
				/>
			);
		}

		return(
			<div className = "container-fluid hrr-container">
				<NavbarMenu title = {"Heartrate Recovery"} />
				<div style = {{marginTop:"10px"}}>
					<span>
						<span onClick = {this.moveDateBackward} style = {{marginLeft:"30px",marginRight:"14px"}}>
							<FontAwesome
								name = "angle-left"
								size = "2x"
							/>
						</span>
						<span id="navlink" onClick={this.toggleCalendar} id="gd_progress">
							<FontAwesome
								name = "calendar"
								size = "2x"
							/>
							<span style = {{marginLeft:"20px",fontWeight:"bold",paddingTop:"7px"}}>
								{moment(this.state.selectedDate).format('MMM DD, YYYY')}
							</span>  
						</span>
						<span onClick = {this.moveDateForward} style = {{marginLeft:"14px"}}>
							<FontAwesome
								name = "angle-right"
								size = "2x"
							/>
						</span>
					</span>
					&nbsp;&nbsp;
					<span>
						{editOrCreateButton}
					</span>
					<span>
						<label>
							<strong 
								className="updated_hrr"
								style = {{marginLeft:"75px"}}>
								User Updated HRR?&nbsp;
							</strong>
						</label>
						<span className="yes_no">{this.state.UserUpdatedHRRStats? 'Yes': 'No'}</span>
					</span>
					<span className="in_button">
						<label  style = {{marginLeft:"145px"}}>
							<input type="radio" 
								name="hrr" 
								checked={this.state.IncludeHRRStats}
								onChange={this.IncludeExcludeHRRToggler}>
							</input>&nbsp;
							Include HRR
						</label>
						<label className="ex_button" style = {{marginLeft:"175px"}}>
							<input type="radio" 
								name="hrr"
								checked={!this.state.IncludeHRRStats}
								onChange={this.IncludeExcludeHRRToggler}>
							</input>&nbsp;
							Exclude HRR
						</label>
					</span>
					<Popover
						placement="bottom"
						isOpen={this.state.isCalendarOpen}
						target="gd_progress"
						toggle={this.toggleCalendar}>
						<PopoverBody className="calendar2">
							<CalendarWidget onDaySelect={this.onSelectNewDate}/>
						</PopoverBody>
					</Popover>
				</div>
				{charts}
                <ToastContainer 
                    position="top-center"
                    type="success"
                    autoClose={5000}
                    hideProgressBar={true}
                    newestOnTop={false}
                    closeOnClick
                    className="toast-popup"
                />
      			{fetchingHRROverlay}
			</div>
		)
	}
}

export default HeartRateRecoveryChart;