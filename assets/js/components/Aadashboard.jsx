import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';
import axios from 'axios';
import { StyleSheet, css } from 'aphrodite';
import axiosRetry from 'axios-retry';
import moment from 'moment';
import html2canvas from 'html2canvas';
import Dimensions from 'react-dimensions';
import FontAwesome from "react-fontawesome";
import {
	Collapse, Navbar, NavbarToggler,
	NavbarBrand, Nav, NavItem, NavLink,
	Button, Popover, DropdownToggle, Dropdown, DropdownMenu, DropdownItem, PopoverBody, Form, FormGroup,
	FormText, Label, Input, Card, CardImg, CardText,
	CardBody, CardTitle, CardSubtitle, Badge
} from 'reactstrap';
import NavbarMenu from './navbar';
import fetchProgress, { fetchAaRanges } from '../network/progress';
import { getUserProfile } from '../network/auth';
import { fetchLastSync } from '../network/quick';
import { renderProgressFetchOverlay, renderProgress2FetchOverlay, renderProgress3FetchOverlay, renderProgressSelectedDateFetchOverlay } from './dashboard_healpers';

import durationInTimeZones from './Aadashboard.json'
import { isNull } from 'util';

axiosRetry(axios, { retries: 3 });
const duration = ["week", "today", "yesterday", "year", "month", "custom_range"];
const category = ['oh_gpa', 'nes', 'mc', 'avg_sleep', 'ec', 'prcnt_uf',
	'alcohol', 'total_steps', 'floor_climbed', 'resting_hr',
	'deep_sleep', 'awake_time', 'time_99', "pure_time_99",
	'beat_lowered', 'pure_beat_lowered', 'overall_hrr',
	'active_min_total', 'active_min_exclude_sleep',
	'active_min_exclude_sleep_exercise'];
var CalendarWidget = require('react-calendar-widget');
var ReactDOM = require('react-dom');

class Aadashboard extends Component {
	constructor(props) {
		super(props);
		let rankInitialState = {}
		for (let catg of category) {
			let catInitialState = {}
			for (let dur of duration) {
				let userRank = {
					'user_rank': {
						category: '',
						rank: 'Getting Ranks...',
						username: '',
						score: ''
					},
					"all_rank": [
					]
				};
				catInitialState[dur] = userRank;
			}
			rankInitialState[catg] = catInitialState;
		};
		this.state = {
			selectedDate: new Date(),
			cr1_start_date: '',
			cr1_end_date: '',
			cr2_start_date: '',
			cr2_end_date: '',
			cr3_start_date: '',
			cr3_end_date: '',
			calendarOpen: false,
			isOpen1: false,

			fetching_ql1: false,
			fetching_ql2: false,
			fetching_ql3: false,
			fetching_ql4: false,
			scrollingLock: false,
			dropdownOpen1: false,
			active_view: true,
			btnView: false,
			rankData: rankInitialState,
			last_synced: null,
			userage: '',
			summary: {


				"exercise": {
					"avg_non_strength_exercise_heart_rate": this.getInitialDur(),
					"hr_aerobic_duration_hour_min": this.getInitialDur(),
					"hr_anaerobic_duration_hour_min": this.getInitialDur(),
					"hr_below_aerobic_duration_hour_min": this.getInitialDur(),
					"hr_not_recorded_duration_hour_min": this.getInitialDur(),
					"prcnt_aerobic_duration": this.getInitialDur(),
					"prcnt_anaerobic_duration": this.getInitialDur(),
					"prcnt_below_aerobic_duration": this.getInitialDur(),
					"prcnt_hr_not_recorded_duration": this.getInitialDur(),
					"workout_duration_hours_min": this.getInitialDur()
				}
			},
			"duration_date": this.getInitialDur(),
			selected_range: "today",
			selectedRange: {
				dateRange: null,
				rangeType: 'today'
			},
			date: "",
			dateRange: null,
			capt: "",
			active_category: "",
			active_username: "",
			active_category_name: "",
			all_verbose_name: "",
			dateRange4: false,
			isStressInfoModelOpen: false,
			numberOfDays: null,
			aa_ranges: {},
			durationInTimeZones: durationInTimeZones,
		};


		this.successProgress = this.successProgress.bind(this);
		this.headerDates = this.headerDates.bind(this);
		this.errorProgress = this.errorProgress.bind(this);
		this.toggleCalendar = this.toggleCalendar.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.createExcelPrintURL = this.createExcelPrintURL.bind(this);
		this.toggleDropdown = this.toggleDropdown.bind(this);
		this.processDate = this.processDate.bind(this);
		this.strToSecond = this.strToSecond.bind(this);
		this.renderPercent = this.renderPercent.bind(this);
		this.getInitialDur = this.getInitialDur.bind(this);
		this.renderValue = this.renderValue.bind(this);
		this.renderDateRangeDropdown = this.renderDateRangeDropdown.bind(this);
		this.reanderAllHrr = this.reanderAllHrr.bind(this);
		this.toggle = this.toggle.bind(this);
		this.toggleDate1 = this.toggleDate1.bind(this);
		this.toggleDate2 = this.toggleDate2.bind(this);
		this.toggleDate3 = this.toggleDate3.bind(this);
		this.onSubmitDate1 = this.onSubmitDate1.bind(this);
		this.onSubmitDate2 = this.onSubmitDate2.bind(this);
		this.onSubmitDate3 = this.onSubmitDate3.bind(this);
		this.onSubmitDate4 = this.onSubmitDate4.bind(this);
		this.aerobicTimeZone = this.aerobicTimeZone.bind(this);
		this.aaExercisestats = this.aaExercisestats.bind(this);
		this.belowAerobicTimeZone = this.belowAerobicTimeZone.bind(this);
		this.anerobicTimeZone = this.anerobicTimeZone.bind(this);
		this.totalworkoutdurationTimeZone = this.totalworkoutdurationTimeZone.bind(this);
		this.heartRateNotRecordedTimeZone = this.heartRateNotRecordedTimeZone.bind(this);
		this.renderLastSync = this.renderLastSync.bind(this);
		this.succesCallback = this.succesCallback.bind(this);
		this.aaColorRanges = this.aaColorRanges.bind(this);
		this.toggleDate4 = this.toggleDate4.bind(this);
		this.toggle1 = this.toggle1.bind(this);
		this.successLastSync = this.successLastSync.bind(this);
		this.aaExercisestatsPrct = this.aaExercisestatsPrct.bind(this);
		this.successAaRanges = this.successAaRanges.bind(this);
		this.errorAaRanges = this.errorAaRanges.bind(this);
		this.renderProgressFetchOverlay = renderProgressFetchOverlay.bind(this);
		this.renderProgress2FetchOverlay = renderProgress2FetchOverlay.bind(this);
		this.renderProgress3FetchOverlay = renderProgress3FetchOverlay.bind(this);
		this.renderProgressSelectedDateFetchOverlay = renderProgressSelectedDateFetchOverlay.bind(this);

	}
	reanderAllHrr(period, date, capt, selectedRange) {
		this.setState({
			selected_range: period,
			date: date,
			capt: capt,
		});

		let numberOfDays;
		if (selectedRange.rangeType !== 'today' && selectedRange.rangeType !== 'yesterday') {
			let startDate = selectedRange.dateRange.split("to")[0].trim();
			let endDate = selectedRange.dateRange.split("to")[1].trim();
			let numberOfDays = Math.abs(moment(endDate).diff(moment(startDate), 'days')) + 1;
			this.setState({
				numberOfDays: numberOfDays,
			})
		}
		else {
			this.setState({
				numberOfDays: null,
			})
		}

	}

	toggle1() {
		this.setState({
			isOpen1: !this.state.isOpen1,
		});
	}


	renderPercent(value) {
		let percent = '';
		if (value != null || value != undefined) {
			percent = value + " " + '%';
		}
		else {
			percent = value;
		}
		return percent;
	}

	renderValue(value, dur) {
		let score = "";
		if (dur && dur != "today" && dur != "month" &&
			dur != "yesterday" && dur != "week" && dur != "year") {
			if (value && value['custom_range'] != undefined) {
				if (value['custom_range'][dur] != undefined) {
					score = value['custom_range'][dur].data;
				}
			}
		}
		else {
			score = value[dur];
		}
		return score;
	}

	toggleCalendar() {
		this.setState({
			calendarOpen: !this.state.calendarOpen
		});
	}
	strToSecond(value) {
		let time = value.split(':');
		let hours = parseInt(time[0]) * 3600;
		let min = parseInt(time[1]) * 60;
		let s_time = hours + min;
		return s_time;
	}
	toggle() {
		this.setState({
			dropdownOpen1: !this.state.dropdownOpen1
		})
	}
	toggleDate1() {
		this.setState({
			dateRange1: !this.state.dateRange1
		});
	}
	toggleDate2() {
		this.setState({
			dateRange2: !this.state.dateRange2
		});
	}
	toggleDate3() {
		this.setState({
			dateRange3: !this.state.dateRange3
		});
	}
	toggleDate4() {
		this.setState({
			dateRange4: !this.state.dateRange4
		});
	}
	toggleDropdown() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		});
	}
	onSubmitDate1(event) {
		event.preventDefault();
		this.setState({
			dateRange1: !this.state.dateRange1,
			fetching_ql1: true,

		}, () => {
			let custom_ranges = [];
			if (this.state.cr2_start_date && this.state.cr2_end_date) {
				custom_ranges.push(this.state.cr2_start_date);
				custom_ranges.push(this.state.cr2_end_date);
			}
			if (this.state.cr3_start_date && this.state.cr3_end_date) {
				custom_ranges.push(this.state.cr3_start_date);
				custom_ranges.push(this.state.cr3_end_date);
			}
			custom_ranges.push(this.state.cr1_start_date);
			custom_ranges.push(this.state.cr1_end_date);

			let crange1 = this.state.cr1_start_date + " " + "to" + " " + this.state.cr1_end_date
			let selected_range = {
				range: crange1,
				duration: this.headerDates(crange1),
				caption: ""
			}
			fetchProgress(this.successProgress,
				this.errorProgress,
				this.state.selectedDate, custom_ranges,
				selected_range);

		});
	}


	onSubmitDate2(event) {
		event.preventDefault();
		this.setState({
			dateRange2: !this.state.dateRange2,
			fetching_ql2: true,

		}, () => {
			let custom_ranges = [];
			if (this.state.cr1_start_date && this.state.cr1_end_date) {
				custom_ranges.push(this.state.cr1_start_date);
				custom_ranges.push(this.state.cr1_end_date);
			}
			if (this.state.cr3_start_date && this.state.cr3_end_date) {
				custom_ranges.push(this.state.cr3_start_date);
				custom_ranges.push(this.state.cr3_end_date);
			}

			custom_ranges.push(this.state.cr2_start_date);
			custom_ranges.push(this.state.cr2_end_date);
			let crange1 = this.state.cr2_start_date + " " + "to" + " " + this.state.cr2_end_date
			let selected_range = {
				range: crange1,
				duration: this.headerDates(crange1),
				caption: ""
			}

			fetchProgress(this.successProgress,
				this.errorProgress,
				this.state.selectedDate, custom_ranges,
				selected_range);

		});
	}
	onSubmitDate3(event) {
		event.preventDefault();
		this.setState({
			dateRange3: !this.state.dateRange3,
			fetching_ql3: true,
		}, () => {
			let custom_ranges = [];
			if (this.state.cr1_start_date && this.state.cr1_end_date) {
				custom_ranges.push(this.state.cr1_start_date);
				custom_ranges.push(this.state.cr1_end_date);
			}
			if (this.state.cr2_start_date && this.state.cr2_end_date) {
				custom_ranges.push(this.state.cr2_start_date);
				custom_ranges.push(this.state.cr2_end_date);
			}
			custom_ranges.push(this.state.cr3_start_date);
			custom_ranges.push(this.state.cr3_end_date);
			let crange1 = this.state.cr3_start_date + " " + "to" + " " + this.state.cr3_end_date
			let selected_range = {
				range: crange1,
				duration: this.headerDates(crange1),
				caption: ""
			}

			fetchProgress(this.successProgress,
				this.errorProgress,
				this.state.selectedDate, custom_ranges,
				selected_range);
		});
	}

	onSubmitDate4(event) {
		event.preventDefault();
		this.setState({
			dateRange4: !this.state.dateRange4,
			fetching_ql1: true,

		}, () => {
			let custom_ranges = [];
			if (this.state.cr2_start_date && this.state.cr2_end_date) {
				custom_ranges.push(this.state.cr2_start_date);
				custom_ranges.push(this.state.cr2_end_date);
			}
			if (this.state.cr3_start_date && this.state.cr3_end_date) {
				custom_ranges.push(this.state.cr3_start_date);
				custom_ranges.push(this.state.cr3_end_date);
			}
			custom_ranges.push(this.state.cr1_start_date);
			custom_ranges.push(this.state.cr1_end_date);

			let crange1 = this.state.cr1_start_date + " " + "to" + " " + this.state.cr1_end_date
			let selected_range = {
				range: crange1,
				duration: this.headerDates(crange1),
				caption: ""
			}
			fetchProgress(this.successProgress,
				this.errorProgress,
				this.state.selectedDate, custom_ranges,
				selected_range);
		});
	}
	createExcelPrintURL() {
		// code
		let custom_ranges = [];
		let selected_date = moment(this.state.selectedDate).format("YYYY-MM-DD");
		if (this.state.cr1_start_date && this.state.cr1_end_date) {
			custom_ranges.push(this.state.cr1_start_date);
			custom_ranges.push(this.state.cr1_end_date);
		}

		if (this.state.cr2_start_date && this.state.cr2_end_date) {
			custom_ranges.push(this.state.cr2_start_date);
			custom_ranges.push(this.state.cr2_end_date);
		}
		if (this.state.cr3_start_date && this.state.cr3_end_date) {
			custom_ranges.push(this.state.cr3_start_date);
			custom_ranges.push(this.state.cr3_end_date);
		}
		custom_ranges = (custom_ranges && custom_ranges.length) ? custom_ranges.toString() : '';
		let excelURL = `progress/print/progress/excel?date=${selected_date}&&custom_ranges=${custom_ranges}`;
		return excelURL;
	}

	handleChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		this.setState({
			[name]: value
		});
	}

	headerDates(value) {
		let str = value;
		let d = str.split(" ");
		let d1 = d[0];
		let date1 = moment(d1).format('MMM DD, YYYY');
		let d2 = d[2];
		let date2 = moment(d2).format('MMM DD, YYYY');
		let date = date1 + ' to ' + date2;
		return date;
	}
	getInitialDur() {
		let paDurationInitialState = {
			"week": "-",
			"yesterday": "-",
			"month": "-",
			"custom_range": "-",
			"today": "-",
			"year": "-"
		};
		return paDurationInitialState;
	}

	successLastSync(data) {
		/* Getting Wearable Device Last Sync date and time*/
		let last_synced;
		if (_.isEmpty(data.data))
			last_synced = null
		else
			last_synced = data.data.last_synced;
		this.setState({
			last_synced: last_synced,
		})
	}
	errorquick(error) {
	}
	renderLastSync(value) {
		let time;
		var sync = "";
		if (value) {
			time = moment(value).format("MMM DD, YYYY @ hh:mm a");
			sync = <div style={{ fontSize: "15px", fontWeight: "bold", fontFamily: 'Proxima-Nova', color: "black" }}>Wearable Device Last Synced on {time}</div>;
		}
		return sync;
	}


	processDate(selectedDate) {
		this.setState({
			fetching_ql4: true,
			selectedDate: selectedDate,
			calendarOpen: !this.state.calendarOpen,
			numberOfDays: null,
			selected_range: "today",

		}, () => {
			fetchProgress(this.successProgress, this.errorProgress, this.state.selectedDate);
			fetchAaRanges(this.successAaRanges, this.errorAaRanges, this.state.selectedDate);
		});
	}



	toggleCalendar() {
		this.setState({
			calendarOpen: !this.state.calendarOpen
		});
	}

	succesCallback(data) {
		this.setState({
			userage: data.data.user_age
		});
	}

	componentDidMount() {
		this.setState({
			fetching_ql4: true,
		});
		fetchProgress(this.successProgress, this.errorProgress, this.state.selectedDate);
		getUserProfile(this.succesCallback);
		fetchLastSync(this.successLastSync, this.errorquick);
		fetchAaRanges(this.successAaRanges, this.errorAaRanges, this.state.selectedDate);
	}
	successAaRanges(data) {
		this.setState({
			aa_ranges: data.data,
		})
	}
	errorAaRanges(error) {
		console.log(error.message)
	}


	successProgress(data, renderAfterSuccess = undefined) {

		let date = moment(data.data.duration_date["today"]).format("MMM DD, YYYY");
		this.setState({
			fetching_ql1: false,
			fetching_ql2: false,
			fetching_ql3: false,
			fetching_ql4: false,
			report_date: data.data.report_date,
			summary: data.data.summary,
			avg_exercise_heart_rate: data.data.avg_exercise_heart_rate,
			duration_date: data.data.duration_date,
			// capt:"Wearable Device Last Synced on",
			capt: "Today",
			date: date,

		}, () => {
			if (renderAfterSuccess) {
				this.reanderAllHrr(
					renderAfterSuccess.range,
					renderAfterSuccess.duration,
					renderAfterSuccess.caption,
					renderAfterSuccess.selectedRange,

				);
			}
		});
	}

	errorProgress(error) {
		console.log(error.message);
		this.setState({
			fetching_ql1: false,
			fetching_ql2: false,
			fetching_ql3: false,
			fetching_ql4: false,
		})
	}

	renderDateRangeDropdown(value, value5) {
		let duration_type = ["today", "yesterday", "week", "month", "year", "custom_range"];
		let duration_type1 = ["today", "yesterday", "week", "month", "year",];
		let durations = [];
		for (let [key, value1] of Object.entries(value)) {
			if (key == "exercise") {
				for (let [key1, value2] of Object.entries(value1)) {
					if (key1 == "overall_health_gpa") {
						for (let duration of duration_type) {
							let val = value2[duration];
							if (duration == "custom_range" && val) {
								for (let [range, value3] of Object.entries(val)) {
									duration_type1.push(range);
								}
							}
						}
					}
				}
			}
		}
		let rank;
		let date;
		let tableHeaders = [];
		for (let dur of duration_type1) {

			let selectedRange = {
				dateRange: null,
				rangeType: null
			};

			let capt = dur[0].toUpperCase() + dur.slice(1)
			if (dur == "today") {
				date = moment(value5[dur]).format('MMM DD, YYYY');

				selectedRange['dateRange'] = value5[dur];
				selectedRange['rangeType'] = dur;

			}
			else if (dur == "yesterday") {
				date = moment(value5[dur]).format('MMM DD, YYYY');
				selectedRange['dateRange'] = value5[dur];
				selectedRange['rangeType'] = dur;

			}
			else if (dur == "week") {
				date = this.headerDates(value5[dur]);
				selectedRange['dateRange'] = value5[dur];
				selectedRange['rangeType'] = dur;
			}
			else if (dur == "month") {
				date = this.headerDates(value5[dur]);
				selectedRange['dateRange'] = value5[dur];
				selectedRange['rangeType'] = dur;

			}
			else if (dur == "year") {
				date = this.headerDates(value5[dur]);
				selectedRange['dateRange'] = value5[dur];
				selectedRange['rangeType'] = dur;


			}
			else {
				date = this.headerDates(dur);
				capt = "";
				rank = value['custom_range'][dur].all_rank;
				selectedRange['dateRange'] = dur;
				selectedRange['rangeType'] = 'custom_range';

			}

			tableHeaders.push(
				<DropdownItem>
					<a className="dropdown-item"
						onClick={this.reanderAllHrr.bind(this, dur, date, capt, selectedRange)}
						style={{ fontSize: "13px" }}>
						{capt}<br />{date}
					</a></DropdownItem>);
		}
		return tableHeaders;
	}

	aaColorRanges(heartrate, heartRateNotRecorded, workout_duration_hours_min_score) {
		let background = '', color = ''
		let userage = Number.parseInt(this.state.userage)

		if (heartrate == null || heartrate == undefined) return ['', '']
		else if (heartrate == 0) {
			if (heartRateNotRecorded == "00:00"
				&& workout_duration_hours_min_score != ' '
				&& workout_duration_hours_min_score != '00:00'
				&& workout_duration_hours_min_score) {
				background = 'green';
				color = 'white';
			}
			else if (heartRateNotRecorded != "00:00"
				&& heartRateNotRecorded
				&& workout_duration_hours_min_score != ' '
				&& workout_duration_hours_min_score
				&& workout_duration_hours_min_score != '00:00') {
				// this condition is useless as nothing is changed, 
				// but left this code here as the previous definition for this function contains this contidion
				// this will remains background and color to empty 
			}
		} else {
			let colors = {
				white: 'white',
				green: 'green',
				lightgreen: '#32CD32',
				yellow: 'yellow',
				black: 'black',
				orange: 'orange',
				red: 'red',
			}
			let conditions = []
			if (userage < 13) {

			}//if userage < 13
			else if (userage >= 13 || userage <= 100) {
				switch (userage) {
					case 13:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 120, background: colors.yellow, color: colors.black },
							{ lower: 121, upper: 140, background: colors.lightgreen, color: colors.black },
							{ lower: 141, upper: 152, background: colors.green, color: colors.white },
							{ lower: 153, upper: 165, background: colors.lightgreen, color: colors.black },
							{ lower: 166, upper: 169, background: colors.yellow, color: colors.black },
							{ lower: 170, upper: 174, background: colors.orange, color: colors.black },
							{ lower: 175, upper: 178, background: colors.lightgreen, color: colors.black },
							{ lower: 179, upper: 181, background: colors.green, color: colors.white },
							{ lower: 182, upper: 186, background: colors.lightgreen, color: colors.black },
							{ lower: 187, upper: 189, background: colors.yellow, color: colors.black },
							{ lower: 190, upper: 191, background: colors.orange, color: colors.black },
							{ lower: 192, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 14:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 120, background: colors.yellow, color: colors.black },
							{ lower: 121, upper: 139, background: colors.lightgreen, color: colors.black },
							{ lower: 140, upper: 152, background: colors.green, color: colors.white },
							{ lower: 153, upper: 165, background: colors.lightgreen, color: colors.black },
							{ lower: 166, upper: 169, background: colors.yellow, color: colors.black },
							{ lower: 170, upper: 174, background: colors.orange, color: colors.black },
							{ lower: 175, upper: 178, background: colors.lightgreen, color: colors.black },
							{ lower: 179, upper: 181, background: colors.green, color: colors.white },
							{ lower: 182, upper: 186, background: colors.lightgreen, color: colors.black },
							{ lower: 187, upper: 189, background: colors.yellow, color: colors.black },
							{ lower: 190, upper: 191, background: colors.orange, color: colors.black },
							{ lower: 192, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 15:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 120, background: colors.yellow, color: colors.black },
							{ lower: 121, upper: 138, background: colors.lightgreen, color: colors.black },
							{ lower: 139, upper: 152, background: colors.green, color: colors.white },
							{ lower: 153, upper: 165, background: colors.lightgreen, color: colors.black },
							{ lower: 166, upper: 169, background: colors.yellow, color: colors.black },
							{ lower: 170, upper: 174, background: colors.orange, color: colors.black },
							{ lower: 175, upper: 178, background: colors.lightgreen, color: colors.black },
							{ lower: 179, upper: 181, background: colors.green, color: colors.white },
							{ lower: 182, upper: 186, background: colors.lightgreen, color: colors.black },
							{ lower: 187, upper: 189, background: colors.yellow, color: colors.black },
							{ lower: 190, upper: 191, background: colors.orange, color: colors.black },
							{ lower: 192, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 16:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 120, background: colors.yellow, color: colors.black },
							{ lower: 121, upper: 137, background: colors.lightgreen, color: colors.black },
							{ lower: 138, upper: 152, background: colors.green, color: colors.white },
							{ lower: 153, upper: 164, background: colors.lightgreen, color: colors.black },
							{ lower: 165, upper: 168, background: colors.yellow, color: colors.black },
							{ lower: 169, upper: 173, background: colors.orange, color: colors.black },
							{ lower: 174, upper: 177, background: colors.lightgreen, color: colors.black },
							{ lower: 178, upper: 180, background: colors.green, color: colors.white },
							{ lower: 181, upper: 185, background: colors.lightgreen, color: colors.black },
							{ lower: 186, upper: 188, background: colors.yellow, color: colors.black },
							{ lower: 189, upper: 190, background: colors.orange, color: colors.black },
							{ lower: 191, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 17:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 120, background: colors.yellow, color: colors.black },
							{ lower: 121, upper: 136, background: colors.lightgreen, color: colors.black },
							{ lower: 137, upper: 152, background: colors.green, color: colors.white },
							{ lower: 153, upper: 163, background: colors.lightgreen, color: colors.black },
							{ lower: 164, upper: 167, background: colors.yellow, color: colors.black },
							{ lower: 168, upper: 172, background: colors.orange, color: colors.black },
							{ lower: 173, upper: 176, background: colors.lightgreen, color: colors.black },
							{ lower: 177, upper: 179, background: colors.green, color: colors.white },
							{ lower: 180, upper: 184, background: colors.lightgreen, color: colors.black },
							{ lower: 185, upper: 187, background: colors.yellow, color: colors.black },
							{ lower: 188, upper: 189, background: colors.orange, color: colors.black },
							{ lower: 190, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 18:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 120, background: colors.yellow, color: colors.black },
							{ lower: 121, upper: 135, background: colors.lightgreen, color: colors.black },
							{ lower: 136, upper: 152, background: colors.green, color: colors.white },
							{ lower: 153, upper: 162, background: colors.lightgreen, color: colors.black },
							{ lower: 163, upper: 166, background: colors.yellow, color: colors.black },
							{ lower: 167, upper: 171, background: colors.orange, color: colors.black },
							{ lower: 172, upper: 175, background: colors.lightgreen, color: colors.black },
							{ lower: 176, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 19:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 120, background: colors.yellow, color: colors.black },
							{ lower: 121, upper: 134, background: colors.lightgreen, color: colors.black },
							{ lower: 135, upper: 152, background: colors.green, color: colors.white },
							{ lower: 153, upper: 161, background: colors.lightgreen, color: colors.black },
							{ lower: 162, upper: 165, background: colors.yellow, color: colors.black },
							{ lower: 166, upper: 170, background: colors.orange, color: colors.black },
							{ lower: 171, upper: 173, background: colors.lightgreen, color: colors.black },
							{ lower: 174, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 20:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 120, background: colors.yellow, color: colors.black },
							{ lower: 121, upper: 133, background: colors.lightgreen, color: colors.black },
							{ lower: 134, upper: 152, background: colors.green, color: colors.white },
							{ lower: 153, upper: 160, background: colors.lightgreen, color: colors.black },
							{ lower: 161, upper: 164, background: colors.yellow, color: colors.black },
							{ lower: 165, upper: 169, background: colors.orange, color: colors.black },
							{ lower: 170, upper: 172, background: colors.lightgreen, color: colors.black },
							{ lower: 173, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 21:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 120, background: colors.yellow, color: colors.black },
							{ lower: 121, upper: 132, background: colors.lightgreen, color: colors.black },
							{ lower: 133, upper: 152, background: colors.green, color: colors.white },
							{ lower: 153, upper: 159, background: colors.lightgreen, color: colors.black },
							{ lower: 160, upper: 163, background: colors.yellow, color: colors.black },
							{ lower: 164, upper: 168, background: colors.orange, color: colors.black },
							{ lower: 169, upper: 171, background: colors.lightgreen, color: colors.black },
							{ lower: 172, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 22:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 120, background: colors.yellow, color: colors.black },
							{ lower: 121, upper: 131, background: colors.lightgreen, color: colors.black },
							{ lower: 132, upper: 152, background: colors.green, color: colors.white },
							{ lower: 153, upper: 158, background: colors.lightgreen, color: colors.black },
							{ lower: 159, upper: 162, background: colors.yellow, color: colors.black },
							{ lower: 163, upper: 167, background: colors.orange, color: colors.black },
							{ lower: 168, upper: 170, background: colors.lightgreen, color: colors.black },
							{ lower: 171, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 23:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 120, background: colors.yellow, color: colors.black },
							{ lower: 121, upper: 130, background: colors.lightgreen, color: colors.black },
							{ lower: 131, upper: 152, background: colors.green, color: colors.white },
							{ lower: 153, upper: 157, background: colors.lightgreen, color: colors.black },
							{ lower: 158, upper: 161, background: colors.yellow, color: colors.black },
							{ lower: 163, upper: 166, background: colors.orange, color: colors.black },
							{ lower: 167, upper: 169, background: colors.lightgreen, color: colors.black },
							{ lower: 171, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 24:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 120, background: colors.yellow, color: colors.black },
							{ lower: 121, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 151, background: colors.green, color: colors.white },
							{ lower: 152, upper: 156, background: colors.lightgreen, color: colors.black },
							{ lower: 157, upper: 160, background: colors.yellow, color: colors.black },
							{ lower: 161, upper: 165, background: colors.orange, color: colors.black },
							{ lower: 166, upper: 168, background: colors.lightgreen, color: colors.black },
							{ lower: 169, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 25:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 119, background: colors.yellow, color: colors.black },
							{ lower: 120, upper: 128, background: colors.lightgreen, color: colors.black },
							{ lower: 129, upper: 150, background: colors.green, color: colors.white },
							{ lower: 151, upper: 155, background: colors.lightgreen, color: colors.black },
							{ lower: 156, upper: 159, background: colors.yellow, color: colors.black },
							{ lower: 160, upper: 164, background: colors.orange, color: colors.black },
							{ lower: 165, upper: 167, background: colors.lightgreen, color: colors.black },
							{ lower: 168, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 26:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 118, background: colors.yellow, color: colors.black },
							{ lower: 119, upper: 127, background: colors.lightgreen, color: colors.black },
							{ lower: 128, upper: 149, background: colors.green, color: colors.white },
							{ lower: 150, upper: 154, background: colors.lightgreen, color: colors.black },
							{ lower: 155, upper: 158, background: colors.yellow, color: colors.black },
							{ lower: 159, upper: 163, background: colors.orange, color: colors.black },
							{ lower: 164, upper: 166, background: colors.lightgreen, color: colors.black },
							{ lower: 167, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 27:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 117, background: colors.yellow, color: colors.black },
							{ lower: 118, upper: 126, background: colors.lightgreen, color: colors.black },
							{ lower: 127, upper: 148, background: colors.green, color: colors.white },
							{ lower: 150, upper: 154, background: colors.lightgreen, color: colors.black },
							{ lower: 155, upper: 158, background: colors.yellow, color: colors.black },
							{ lower: 159, upper: 163, background: colors.orange, color: colors.black },
							{ lower: 164, upper: 166, background: colors.lightgreen, color: colors.black },
							{ lower: 167, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 28:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 116, background: colors.yellow, color: colors.black },
							{ lower: 117, upper: 125, background: colors.lightgreen, color: colors.black },
							{ lower: 126, upper: 147, background: colors.green, color: colors.white },
							{ lower: 148, upper: 154, background: colors.lightgreen, color: colors.black },
							{ lower: 155, upper: 158, background: colors.yellow, color: colors.black },
							{ lower: 159, upper: 163, background: colors.orange, color: colors.black },
							{ lower: 164, upper: 166, background: colors.lightgreen, color: colors.black },
							{ lower: 167, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 29:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 115, background: colors.yellow, color: colors.black },
							{ lower: 116, upper: 124, background: colors.lightgreen, color: colors.black },
							{ lower: 125, upper: 146, background: colors.green, color: colors.white },
							{ lower: 147, upper: 154, background: colors.lightgreen, color: colors.black },
							{ lower: 155, upper: 158, background: colors.yellow, color: colors.black },
							{ lower: 159, upper: 163, background: colors.orange, color: colors.black },
							{ lower: 164, upper: 166, background: colors.lightgreen, color: colors.black },
							{ lower: 167, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 30:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 115, background: colors.yellow, color: colors.black },
							{ lower: 116, upper: 123, background: colors.lightgreen, color: colors.black },
							{ lower: 124, upper: 145, background: colors.green, color: colors.white },
							{ lower: 146, upper: 154, background: colors.lightgreen, color: colors.black },
							{ lower: 155, upper: 158, background: colors.yellow, color: colors.black },
							{ lower: 159, upper: 163, background: colors.orange, color: colors.black },
							{ lower: 164, upper: 166, background: colors.lightgreen, color: colors.black },
							{ lower: 167, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 31:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 114, background: colors.yellow, color: colors.black },
							{ lower: 115, upper: 133, background: colors.lightgreen, color: colors.black },
							{ lower: 134, upper: 145, background: colors.green, color: colors.white },
							{ lower: 146, upper: 154, background: colors.lightgreen, color: colors.black },
							{ lower: 155, upper: 159, background: colors.yellow, color: colors.black },
							{ lower: 160, upper: 167, background: colors.orange, color: colors.black },
							{ lower: 168, upper: 170, background: colors.lightgreen, color: colors.black },
							{ lower: 171, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 32:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 114, background: colors.yellow, color: colors.black },
							{ lower: 115, upper: 132, background: colors.lightgreen, color: colors.black },
							{ lower: 133, upper: 145, background: colors.green, color: colors.white },
							{ lower: 146, upper: 153, background: colors.lightgreen, color: colors.black },
							{ lower: 154, upper: 158, background: colors.yellow, color: colors.black },
							{ lower: 159, upper: 166, background: colors.orange, color: colors.black },
							{ lower: 167, upper: 169, background: colors.lightgreen, color: colors.black },
							{ lower: 170, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 33:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 114, background: colors.yellow, color: colors.black },
							{ lower: 115, upper: 131, background: colors.lightgreen, color: colors.black },
							{ lower: 132, upper: 145, background: colors.green, color: colors.white },
							{ lower: 146, upper: 152, background: colors.lightgreen, color: colors.black },
							{ lower: 153, upper: 157, background: colors.yellow, color: colors.black },
							{ lower: 158, upper: 165, background: colors.orange, color: colors.black },
							{ lower: 166, upper: 168, background: colors.lightgreen, color: colors.black },
							{ lower: 169, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 34:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 114, background: colors.yellow, color: colors.black },
							{ lower: 115, upper: 130, background: colors.lightgreen, color: colors.black },
							{ lower: 131, upper: 145, background: colors.green, color: colors.white },
							{ lower: 146, upper: 151, background: colors.lightgreen, color: colors.black },
							{ lower: 152, upper: 156, background: colors.yellow, color: colors.black },
							{ lower: 157, upper: 164, background: colors.orange, color: colors.black },
							{ lower: 165, upper: 167, background: colors.lightgreen, color: colors.black },
							{ lower: 168, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 35:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 114, background: colors.yellow, color: colors.black },
							{ lower: 115, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 145, background: colors.green, color: colors.white },
							{ lower: 146, upper: 150, background: colors.lightgreen, color: colors.black },
							{ lower: 151, upper: 155, background: colors.yellow, color: colors.black },
							{ lower: 156, upper: 163, background: colors.orange, color: colors.black },
							{ lower: 164, upper: 166, background: colors.lightgreen, color: colors.black },
							{ lower: 168, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 36:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 114, background: colors.yellow, color: colors.black },
							{ lower: 115, upper: 128, background: colors.lightgreen, color: colors.black },
							{ lower: 129, upper: 144, background: colors.green, color: colors.white },
							{ lower: 145, upper: 149, background: colors.lightgreen, color: colors.black },
							{ lower: 150, upper: 154, background: colors.yellow, color: colors.black },
							{ lower: 155, upper: 162, background: colors.orange, color: colors.black },
							{ lower: 163, upper: 165, background: colors.lightgreen, color: colors.black },
							{ lower: 166, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 37:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 113, background: colors.yellow, color: colors.black },
							{ lower: 114, upper: 127, background: colors.lightgreen, color: colors.black },
							{ lower: 128, upper: 143, background: colors.green, color: colors.white },
							{ lower: 144, upper: 148, background: colors.lightgreen, color: colors.black },
							{ lower: 149, upper: 153, background: colors.yellow, color: colors.black },
							{ lower: 154, upper: 161, background: colors.orange, color: colors.black },
							{ lower: 162, upper: 164, background: colors.lightgreen, color: colors.black },
							{ lower: 165, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 38:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 112, background: colors.yellow, color: colors.black },
							{ lower: 113, upper: 126, background: colors.lightgreen, color: colors.black },
							{ lower: 127, upper: 142, background: colors.green, color: colors.white },
							{ lower: 141, upper: 147, background: colors.lightgreen, color: colors.black },
							{ lower: 148, upper: 152, background: colors.yellow, color: colors.black },
							{ lower: 153, upper: 160, background: colors.orange, color: colors.black },
							{ lower: 161, upper: 163, background: colors.lightgreen, color: colors.black },
							{ lower: 164, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 39:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 111, background: colors.yellow, color: colors.black },
							{ lower: 112, upper: 125, background: colors.lightgreen, color: colors.black },
							{ lower: 126, upper: 141, background: colors.green, color: colors.white },
							{ lower: 142, upper: 146, background: colors.lightgreen, color: colors.black },
							{ lower: 147, upper: 151, background: colors.yellow, color: colors.black },
							{ lower: 152, upper: 159, background: colors.orange, color: colors.black },
							{ lower: 160, upper: 162, background: colors.lightgreen, color: colors.black },
							{ lower: 163, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 40:
						conditions = [
							{ lower: null, upper: 109, background: colors.red, color: colors.white },
							{ lower: 110, upper: 110, background: colors.yellow, color: colors.black },
							{ lower: 111, upper: 124, background: colors.lightgreen, color: colors.black },
							{ lower: 125, upper: 140, background: colors.green, color: colors.white },
							{ lower: 141, upper: 145, background: colors.lightgreen, color: colors.black },
							{ lower: 146, upper: 150, background: colors.yellow, color: colors.black },
							{ lower: 151, upper: 158, background: colors.orange, color: colors.black },
							{ lower: 159, upper: 161, background: colors.lightgreen, color: colors.black },
							{ lower: 162, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 41:
						conditions = [
							{ lower: null, upper: 108, background: colors.red, color: colors.white },
							{ lower: 109, upper: 109, background: colors.yellow, color: colors.black },
							{ lower: 110, upper: 123, background: colors.lightgreen, color: colors.black },
							{ lower: 124, upper: 139, background: colors.green, color: colors.white },
							{ lower: 140, upper: 144, background: colors.lightgreen, color: colors.black },
							{ lower: 145, upper: 149, background: colors.yellow, color: colors.black },
							{ lower: 150, upper: 157, background: colors.orange, color: colors.black },
							{ lower: 158, upper: 160, background: colors.lightgreen, color: colors.black },
							{ lower: 161, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 42:
						conditions = [
							{ lower: null, upper: 107, background: colors.red, color: colors.white },
							{ lower: 108, upper: 108, background: colors.yellow, color: colors.black },
							{ lower: 109, upper: 122, background: colors.lightgreen, color: colors.black },
							{ lower: 123, upper: 138, background: colors.green, color: colors.white },
							{ lower: 139, upper: 143, background: colors.lightgreen, color: colors.black },
							{ lower: 144, upper: 148, background: colors.yellow, color: colors.black },
							{ lower: 149, upper: 156, background: colors.orange, color: colors.black },
							{ lower: 157, upper: 159, background: colors.lightgreen, color: colors.black },
							{ lower: 160, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 43:
						conditions = [
							{ lower: null, upper: 106, background: colors.red, color: colors.white },
							{ lower: 107, upper: 107, background: colors.yellow, color: colors.black },
							{ lower: 108, upper: 121, background: colors.lightgreen, color: colors.black },
							{ lower: 122, upper: 137, background: colors.green, color: colors.white },
							{ lower: 138, upper: 142, background: colors.lightgreen, color: colors.black },
							{ lower: 143, upper: 147, background: colors.yellow, color: colors.black },
							{ lower: 148, upper: 155, background: colors.orange, color: colors.black },
							{ lower: 156, upper: 158, background: colors.lightgreen, color: colors.black },
							{ lower: 159, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 44:
						conditions = [
							{ lower: null, upper: 105, background: colors.red, color: colors.white },
							{ lower: 106, upper: 106, background: colors.yellow, color: colors.black },
							{ lower: 107, upper: 120, background: colors.lightgreen, color: colors.black },
							{ lower: 121, upper: 136, background: colors.green, color: colors.white },
							{ lower: 137, upper: 141, background: colors.lightgreen, color: colors.black },
							{ lower: 142, upper: 146, background: colors.yellow, color: colors.black },
							{ lower: 147, upper: 154, background: colors.orange, color: colors.black },
							{ lower: 155, upper: 157, background: colors.lightgreen, color: colors.black },
							{ lower: 158, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 45:
						conditions = [
							{ lower: null, upper: 104, background: colors.red, color: colors.white },
							{ lower: 105, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 119, background: colors.lightgreen, color: colors.black },
							{ lower: 120, upper: 135, background: colors.green, color: colors.white },
							{ lower: 138, upper: 140, background: colors.lightgreen, color: colors.black },
							{ lower: 141, upper: 145, background: colors.yellow, color: colors.black },
							{ lower: 146, upper: 153, background: colors.orange, color: colors.black },
							{ lower: 154, upper: 156, background: colors.lightgreen, color: colors.black },
							{ lower: 158, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 46:
						conditions = [
							{ lower: null, upper: 103, background: colors.red, color: colors.white },
							{ lower: 104, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 118, background: colors.lightgreen, color: colors.black },
							{ lower: 119, upper: 134, background: colors.green, color: colors.white },
							{ lower: 135, upper: 139, background: colors.lightgreen, color: colors.black },
							{ lower: 140, upper: 144, background: colors.yellow, color: colors.black },
							{ lower: 145, upper: 152, background: colors.orange, color: colors.black },
							{ lower: 153, upper: 155, background: colors.lightgreen, color: colors.black },
							{ lower: 156, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 47:
						conditions = [
							{ lower: null, upper: 102, background: colors.red, color: colors.white },
							{ lower: 103, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 117, background: colors.lightgreen, color: colors.black },
							{ lower: 118, upper: 133, background: colors.green, color: colors.white },
							{ lower: 134, upper: 138, background: colors.lightgreen, color: colors.black },
							{ lower: 139, upper: 143, background: colors.yellow, color: colors.black },
							{ lower: 144, upper: 151, background: colors.orange, color: colors.black },
							{ lower: 152, upper: 154, background: colors.lightgreen, color: colors.black },
							{ lower: 155, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 48:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 116, background: colors.lightgreen, color: colors.black },
							{ lower: 117, upper: 132, background: colors.green, color: colors.white },
							{ lower: 133, upper: 137, background: colors.lightgreen, color: colors.black },
							{ lower: 138, upper: 142, background: colors.yellow, color: colors.black },
							{ lower: 143, upper: 150, background: colors.orange, color: colors.black },
							{ lower: 151, upper: 153, background: colors.lightgreen, color: colors.black },
							{ lower: 154, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 49:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 115, background: colors.lightgreen, color: colors.black },
							{ lower: 116, upper: 131, background: colors.green, color: colors.white },
							{ lower: 132, upper: 136, background: colors.lightgreen, color: colors.black },
							{ lower: 137, upper: 141, background: colors.yellow, color: colors.black },
							{ lower: 142, upper: 149, background: colors.orange, color: colors.black },
							{ lower: 150, upper: 152, background: colors.lightgreen, color: colors.black },
							{ lower: 153, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 50:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 114, background: colors.lightgreen, color: colors.black },
							{ lower: 115, upper: 130, background: colors.green, color: colors.white },
							{ lower: 131, upper: 135, background: colors.lightgreen, color: colors.black },
							{ lower: 136, upper: 140, background: colors.yellow, color: colors.black },
							{ lower: 141, upper: 148, background: colors.orange, color: colors.black },
							{ lower: 149, upper: 151, background: colors.lightgreen, color: colors.black },
							{ lower: 152, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 51:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 113, background: colors.lightgreen, color: colors.black },
							{ lower: 114, upper: 129, background: colors.green, color: colors.white },
							{ lower: 130, upper: 134, background: colors.lightgreen, color: colors.black },
							{ lower: 135, upper: 139, background: colors.yellow, color: colors.black },
							{ lower: 140, upper: 147, background: colors.orange, color: colors.black },
							{ lower: 148, upper: 150, background: colors.lightgreen, color: colors.black },
							{ lower: 151, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 52:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 112, background: colors.lightgreen, color: colors.black },
							{ lower: 113, upper: 128, background: colors.green, color: colors.white },
							{ lower: 129, upper: 133, background: colors.lightgreen, color: colors.black },
							{ lower: 134, upper: 138, background: colors.yellow, color: colors.black },
							{ lower: 139, upper: 146, background: colors.orange, color: colors.black },
							{ lower: 147, upper: 149, background: colors.lightgreen, color: colors.black },
							{ lower: 150, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 53:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 111, background: colors.lightgreen, color: colors.black },
							{ lower: 112, upper: 127, background: colors.green, color: colors.white },
							{ lower: 128, upper: 132, background: colors.lightgreen, color: colors.black },
							{ lower: 133, upper: 137, background: colors.yellow, color: colors.black },
							{ lower: 138, upper: 145, background: colors.orange, color: colors.black },
							{ lower: 146, upper: 148, background: colors.lightgreen, color: colors.black },
							{ lower: 149, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 54:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 110, background: colors.lightgreen, color: colors.black },
							{ lower: 111, upper: 126, background: colors.green, color: colors.white },
							{ lower: 127, upper: 131, background: colors.lightgreen, color: colors.black },
							{ lower: 132, upper: 136, background: colors.yellow, color: colors.black },
							{ lower: 137, upper: 144, background: colors.orange, color: colors.black },
							{ lower: 145, upper: 147, background: colors.lightgreen, color: colors.black },
							{ lower: 148, upper: 178, background: colors.green, color: colors.white },
							{ lower: 179, upper: 183, background: colors.lightgreen, color: colors.black },
							{ lower: 184, upper: 186, background: colors.yellow, color: colors.black },
							{ lower: 187, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 55:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 125, background: colors.green, color: colors.white },
							{ lower: 126, upper: 130, background: colors.lightgreen, color: colors.black },
							{ lower: 131, upper: 135, background: colors.yellow, color: colors.black },
							{ lower: 136, upper: 143, background: colors.orange, color: colors.black },
							{ lower: 144, upper: 148, background: colors.lightgreen, color: colors.black },
							{ lower: 147, upper: 173, background: colors.green, color: colors.white },
							{ lower: 174, upper: 178, background: colors.lightgreen, color: colors.black },
							{ lower: 179, upper: 183, background: colors.yellow, color: colors.black },
							{ lower: 184, upper: 188, background: colors.orange, color: colors.black },
							{ lower: 189, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 56:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 125, background: colors.green, color: colors.white },
							{ lower: 126, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 134, background: colors.yellow, color: colors.black },
							{ lower: 135, upper: 142, background: colors.orange, color: colors.black },
							{ lower: 143, upper: 147, background: colors.lightgreen, color: colors.black },
							{ lower: 146, upper: 172, background: colors.green, color: colors.white },
							{ lower: 173, upper: 177, background: colors.lightgreen, color: colors.black },
							{ lower: 178, upper: 182, background: colors.yellow, color: colors.black },
							{ lower: 183, upper: 187, background: colors.orange, color: colors.black },
							{ lower: 188, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 57:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 125, background: colors.green, color: colors.white },
							{ lower: 126, upper: 128, background: colors.lightgreen, color: colors.black },
							{ lower: 129, upper: 133, background: colors.yellow, color: colors.black },
							{ lower: 134, upper: 141, background: colors.orange, color: colors.black },
							{ lower: 142, upper: 146, background: colors.lightgreen, color: colors.black },
							{ lower: 147, upper: 171, background: colors.green, color: colors.white },
							{ lower: 172, upper: 176, background: colors.lightgreen, color: colors.black },
							{ lower: 177, upper: 181, background: colors.yellow, color: colors.black },
							{ lower: 182, upper: 186, background: colors.orange, color: colors.black },
							{ lower: 187, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 58:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 125, background: colors.green, color: colors.white },
							{ lower: 126, upper: 127, background: colors.lightgreen, color: colors.black },
							{ lower: 128, upper: 132, background: colors.yellow, color: colors.black },
							{ lower: 133, upper: 140, background: colors.orange, color: colors.black },
							{ lower: 141, upper: 145, background: colors.lightgreen, color: colors.black },
							{ lower: 144, upper: 170, background: colors.green, color: colors.white },
							{ lower: 171, upper: 175, background: colors.lightgreen, color: colors.black },
							{ lower: 176, upper: 180, background: colors.yellow, color: colors.black },
							{ lower: 181, upper: 185, background: colors.orange, color: colors.black },
							{ lower: 186, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 59:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 125, background: colors.green, color: colors.white },
							{ lower: 126, upper: 126, background: colors.lightgreen, color: colors.black },
							{ lower: 127, upper: 131, background: colors.yellow, color: colors.black },
							{ lower: 132, upper: 139, background: colors.orange, color: colors.black },
							{ lower: 140, upper: 144, background: colors.lightgreen, color: colors.black },
							{ lower: 145, upper: 169, background: colors.green, color: colors.white },
							{ lower: 170, upper: 174, background: colors.lightgreen, color: colors.black },
							{ lower: 175, upper: 179, background: colors.yellow, color: colors.black },
							{ lower: 180, upper: 184, background: colors.orange, color: colors.black },
							{ lower: 185, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 60:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 125, background: colors.green, color: colors.white },
							{ lower: 126, upper: 126, background: colors.lightgreen, color: colors.black },
							{ lower: 127, upper: 130, background: colors.yellow, color: colors.black },
							{ lower: 131, upper: 138, background: colors.orange, color: colors.black },
							{ lower: 139, upper: 143, background: colors.lightgreen, color: colors.black },
							{ lower: 144, upper: 168, background: colors.green, color: colors.white },
							{ lower: 169, upper: 173, background: colors.lightgreen, color: colors.black },
							{ lower: 174, upper: 178, background: colors.yellow, color: colors.black },
							{ lower: 179, upper: 183, background: colors.orange, color: colors.black },
							{ lower: 184, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 61:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 125, background: colors.green, color: colors.white },
							{ lower: 126, upper: 126, background: colors.lightgreen, color: colors.black },
							{ lower: 127, upper: 129, background: colors.yellow, color: colors.black },
							{ lower: 130, upper: 137, background: colors.orange, color: colors.black },
							{ lower: 138, upper: 142, background: colors.lightgreen, color: colors.black },
							{ lower: 143, upper: 167, background: colors.green, color: colors.white },
							{ lower: 168, upper: 172, background: colors.lightgreen, color: colors.black },
							{ lower: 173, upper: 177, background: colors.yellow, color: colors.black },
							{ lower: 178, upper: 182, background: colors.orange, color: colors.black },
							{ lower: 183, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 62:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 125, background: colors.green, color: colors.white },
							{ lower: 126, upper: 126, background: colors.lightgreen, color: colors.black },
							{ lower: 127, upper: 128, background: colors.yellow, color: colors.black },
							{ lower: 129, upper: 136, background: colors.orange, color: colors.black },
							{ lower: 137, upper: 141, background: colors.lightgreen, color: colors.black },
							{ lower: 142, upper: 166, background: colors.green, color: colors.white },
							{ lower: 167, upper: 171, background: colors.lightgreen, color: colors.black },
							{ lower: 172, upper: 176, background: colors.yellow, color: colors.black },
							{ lower: 177, upper: 181, background: colors.orange, color: colors.black },
							{ lower: 182, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 63:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 125, background: colors.green, color: colors.white },
							{ lower: 126, upper: 126, background: colors.lightgreen, color: colors.black },
							{ lower: 127, upper: 127, background: colors.yellow, color: colors.black },
							{ lower: 128, upper: 135, background: colors.orange, color: colors.black },
							{ lower: 136, upper: 140, background: colors.lightgreen, color: colors.black },
							{ lower: 141, upper: 165, background: colors.green, color: colors.white },
							{ lower: 166, upper: 170, background: colors.lightgreen, color: colors.black },
							{ lower: 171, upper: 175, background: colors.yellow, color: colors.black },
							{ lower: 176, upper: 180, background: colors.orange, color: colors.black },
							{ lower: 181, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 64:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 125, background: colors.green, color: colors.white },
							{ lower: 126, upper: 126, background: colors.lightgreen, color: colors.black },
							{ lower: 127, upper: 127, background: colors.yellow, color: colors.black },
							{ lower: 128, upper: 134, background: colors.orange, color: colors.black },
							{ lower: 135, upper: 139, background: colors.lightgreen, color: colors.black },
							{ lower: 140, upper: 164, background: colors.green, color: colors.white },
							{ lower: 165, upper: 169, background: colors.lightgreen, color: colors.black },
							{ lower: 170, upper: 174, background: colors.yellow, color: colors.black },
							{ lower: 175, upper: 179, background: colors.orange, color: colors.black },
							{ lower: 180, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 65:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 125, background: colors.green, color: colors.white },
							{ lower: 126, upper: 126, background: colors.lightgreen, color: colors.black },
							{ lower: 127, upper: 127, background: colors.yellow, color: colors.black },
							{ lower: 128, upper: 133, background: colors.orange, color: colors.black },
							{ lower: 134, upper: 138, background: colors.lightgreen, color: colors.black },
							{ lower: 139, upper: 163, background: colors.green, color: colors.white },
							{ lower: 164, upper: 168, background: colors.lightgreen, color: colors.black },
							{ lower: 169, upper: 173, background: colors.yellow, color: colors.black },
							{ lower: 174, upper: 178, background: colors.orange, color: colors.black },
							{ lower: 179, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 66:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 125, background: colors.green, color: colors.white },
							{ lower: 126, upper: 126, background: colors.lightgreen, color: colors.black },
							{ lower: 127, upper: 127, background: colors.yellow, color: colors.black },
							{ lower: 128, upper: 132, background: colors.orange, color: colors.black },
							{ lower: 133, upper: 137, background: colors.lightgreen, color: colors.black },
							{ lower: 138, upper: 162, background: colors.green, color: colors.white },
							{ lower: 163, upper: 167, background: colors.lightgreen, color: colors.black },
							{ lower: 168, upper: 172, background: colors.yellow, color: colors.black },
							{ lower: 173, upper: 177, background: colors.orange, color: colors.black },
							{ lower: 178, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 67:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 125, background: colors.green, color: colors.white },
							{ lower: 126, upper: 126, background: colors.lightgreen, color: colors.black },
							{ lower: 127, upper: 127, background: colors.yellow, color: colors.black },
							{ lower: 128, upper: 131, background: colors.orange, color: colors.black },
							{ lower: 132, upper: 136, background: colors.lightgreen, color: colors.black },
							{ lower: 137, upper: 161, background: colors.green, color: colors.white },
							{ lower: 162, upper: 166, background: colors.lightgreen, color: colors.black },
							{ lower: 167, upper: 171, background: colors.yellow, color: colors.black },
							{ lower: 172, upper: 176, background: colors.orange, color: colors.black },
							{ lower: 177, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 68:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 125, background: colors.green, color: colors.white },
							{ lower: 126, upper: 126, background: colors.lightgreen, color: colors.black },
							{ lower: 127, upper: 127, background: colors.yellow, color: colors.black },
							{ lower: 128, upper: 130, background: colors.orange, color: colors.black },
							{ lower: 131, upper: 135, background: colors.lightgreen, color: colors.black },
							{ lower: 136, upper: 160, background: colors.green, color: colors.white },
							{ lower: 161, upper: 165, background: colors.lightgreen, color: colors.black },
							{ lower: 166, upper: 170, background: colors.yellow, color: colors.black },
							{ lower: 171, upper: 175, background: colors.orange, color: colors.black },
							{ lower: 176, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 69:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 125, background: colors.green, color: colors.white },
							{ lower: 126, upper: 126, background: colors.lightgreen, color: colors.black },
							{ lower: 127, upper: 127, background: colors.yellow, color: colors.black },
							{ lower: 128, upper: 129, background: colors.orange, color: colors.black },
							{ lower: 130, upper: 134, background: colors.lightgreen, color: colors.black },
							{ lower: 135, upper: 159, background: colors.green, color: colors.white },
							{ lower: 160, upper: 164, background: colors.lightgreen, color: colors.black },
							{ lower: 165, upper: 169, background: colors.yellow, color: colors.black },
							{ lower: 170, upper: 174, background: colors.orange, color: colors.black },
							{ lower: 175, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 70:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 125, background: colors.green, color: colors.white },
							{ lower: 126, upper: 126, background: colors.lightgreen, color: colors.black },
							{ lower: 127, upper: 127, background: colors.yellow, color: colors.black },
							{ lower: 128, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 133, background: colors.lightgreen, color: colors.black },
							{ lower: 134, upper: 158, background: colors.green, color: colors.white },
							{ lower: 159, upper: 163, background: colors.lightgreen, color: colors.black },
							{ lower: 164, upper: 168, background: colors.yellow, color: colors.black },
							{ lower: 169, upper: 173, background: colors.orange, color: colors.black },
							{ lower: 174, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 71:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 125, background: colors.green, color: colors.white },
							{ lower: 126, upper: 126, background: colors.lightgreen, color: colors.black },
							{ lower: 127, upper: 127, background: colors.yellow, color: colors.black },
							{ lower: 128, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 132, background: colors.lightgreen, color: colors.black },
							{ lower: 133, upper: 157, background: colors.green, color: colors.white },
							{ lower: 158, upper: 162, background: colors.lightgreen, color: colors.black },
							{ lower: 163, upper: 167, background: colors.yellow, color: colors.black },
							{ lower: 168, upper: 172, background: colors.orange, color: colors.black },
							{ lower: 173, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 72:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 125, background: colors.green, color: colors.white },
							{ lower: 126, upper: 126, background: colors.lightgreen, color: colors.black },
							{ lower: 127, upper: 127, background: colors.yellow, color: colors.black },
							{ lower: 128, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 131, background: colors.lightgreen, color: colors.black },
							{ lower: 132, upper: 156, background: colors.green, color: colors.white },
							{ lower: 157, upper: 161, background: colors.lightgreen, color: colors.black },
							{ lower: 162, upper: 166, background: colors.yellow, color: colors.black },
							{ lower: 167, upper: 171, background: colors.orange, color: colors.black },
							{ lower: 172, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 73:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 125, background: colors.green, color: colors.white },
							{ lower: 126, upper: 126, background: colors.lightgreen, color: colors.black },
							{ lower: 127, upper: 127, background: colors.yellow, color: colors.black },
							{ lower: 128, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 130, background: colors.lightgreen, color: colors.black },
							{ lower: 131, upper: 155, background: colors.green, color: colors.white },
							{ lower: 156, upper: 160, background: colors.lightgreen, color: colors.black },
							{ lower: 161, upper: 165, background: colors.yellow, color: colors.black },
							{ lower: 166, upper: 170, background: colors.orange, color: colors.black },
							{ lower: 171, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 74:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 125, background: colors.green, color: colors.white },
							{ lower: 126, upper: 126, background: colors.lightgreen, color: colors.black },
							{ lower: 127, upper: 127, background: colors.yellow, color: colors.black },
							{ lower: 128, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 154, background: colors.green, color: colors.white },
							{ lower: 155, upper: 159, background: colors.lightgreen, color: colors.black },
							{ lower: 160, upper: 164, background: colors.yellow, color: colors.black },
							{ lower: 165, upper: 169, background: colors.orange, color: colors.black },
							{ lower: 170, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 75:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 125, background: colors.green, color: colors.white },
							{ lower: 126, upper: 126, background: colors.lightgreen, color: colors.black },
							{ lower: 127, upper: 127, background: colors.yellow, color: colors.black },
							{ lower: 128, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 153, background: colors.green, color: colors.white },
							{ lower: 154, upper: 158, background: colors.lightgreen, color: colors.black },
							{ lower: 159, upper: 163, background: colors.yellow, color: colors.black },
							{ lower: 164, upper: 168, background: colors.orange, color: colors.black },
							{ lower: 169, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 76:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 125, background: colors.green, color: colors.white },
							{ lower: 126, upper: 126, background: colors.lightgreen, color: colors.black },
							{ lower: 127, upper: 127, background: colors.yellow, color: colors.black },
							{ lower: 128, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 152, background: colors.green, color: colors.white },
							{ lower: 153, upper: 157, background: colors.lightgreen, color: colors.black },
							{ lower: 158, upper: 162, background: colors.yellow, color: colors.black },
							{ lower: 163, upper: 167, background: colors.orange, color: colors.black },
							{ lower: 168, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 77:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 125, background: colors.green, color: colors.white },
							{ lower: 126, upper: 126, background: colors.lightgreen, color: colors.black },
							{ lower: 127, upper: 127, background: colors.yellow, color: colors.black },
							{ lower: 128, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 151, background: colors.green, color: colors.white },
							{ lower: 152, upper: 156, background: colors.lightgreen, color: colors.black },
							{ lower: 157, upper: 161, background: colors.yellow, color: colors.black },
							{ lower: 162, upper: 166, background: colors.orange, color: colors.black },
							{ lower: 167, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 78:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 125, background: colors.green, color: colors.white },
							{ lower: 126, upper: 126, background: colors.lightgreen, color: colors.black },
							{ lower: 127, upper: 127, background: colors.yellow, color: colors.black },
							{ lower: 128, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 150, background: colors.green, color: colors.white },
							{ lower: 151, upper: 155, background: colors.lightgreen, color: colors.black },
							{ lower: 156, upper: 160, background: colors.yellow, color: colors.black },
							{ lower: 161, upper: 165, background: colors.orange, color: colors.black },
							{ lower: 166, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 79:
						conditions = [
							{ lower: null, upper: 101, background: colors.red, color: colors.white },
							{ lower: 102, upper: 105, background: colors.yellow, color: colors.black },
							{ lower: 106, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 125, background: colors.green, color: colors.white },
							{ lower: 126, upper: 126, background: colors.lightgreen, color: colors.black },
							{ lower: 127, upper: 127, background: colors.yellow, color: colors.black },
							{ lower: 128, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 149, background: colors.green, color: colors.white },
							{ lower: 150, upper: 154, background: colors.lightgreen, color: colors.black },
							{ lower: 155, upper: 159, background: colors.yellow, color: colors.black },
							{ lower: 160, upper: 164, background: colors.orange, color: colors.black },
							{ lower: 165, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 80:
						conditions = [
							{ lower: null, upper: 100, background: colors.red, color: colors.white },
							{ lower: 101, upper: 104, background: colors.yellow, color: colors.black },
							{ lower: 105, upper: 108, background: colors.lightgreen, color: colors.black },
							{ lower: 109, upper: 124, background: colors.green, color: colors.white },
							{ lower: 125, upper: 125, background: colors.lightgreen, color: colors.black },
							{ lower: 126, upper: 126, background: colors.yellow, color: colors.black },
							{ lower: 127, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 148, background: colors.green, color: colors.white },
							{ lower: 149, upper: 153, background: colors.lightgreen, color: colors.black },
							{ lower: 154, upper: 158, background: colors.yellow, color: colors.black },
							{ lower: 159, upper: 163, background: colors.orange, color: colors.black },
							{ lower: 164, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 81:
						conditions = [
							{ lower: null, upper: 100, background: colors.red, color: colors.white },
							{ lower: 101, upper: 104, background: colors.yellow, color: colors.black },
							{ lower: 105, upper: 108, background: colors.lightgreen, color: colors.black },
							{ lower: 109, upper: 123, background: colors.green, color: colors.white },
							{ lower: 124, upper: 124, background: colors.lightgreen, color: colors.black },
							{ lower: 125, upper: 125, background: colors.yellow, color: colors.black },
							{ lower: 126, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 147, background: colors.green, color: colors.white },
							{ lower: 148, upper: 152, background: colors.lightgreen, color: colors.black },
							{ lower: 153, upper: 157, background: colors.yellow, color: colors.black },
							{ lower: 158, upper: 162, background: colors.orange, color: colors.black },
							{ lower: 163, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 82:
						conditions = [
							{ lower: null, upper: 100, background: colors.red, color: colors.white },
							{ lower: 101, upper: 104, background: colors.yellow, color: colors.black },
							{ lower: 105, upper: 108, background: colors.lightgreen, color: colors.black },
							{ lower: 109, upper: 122, background: colors.green, color: colors.white },
							{ lower: 123, upper: 123, background: colors.lightgreen, color: colors.black },
							{ lower: 124, upper: 124, background: colors.yellow, color: colors.black },
							{ lower: 125, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 146, background: colors.green, color: colors.white },
							{ lower: 147, upper: 151, background: colors.lightgreen, color: colors.black },
							{ lower: 152, upper: 156, background: colors.yellow, color: colors.black },
							{ lower: 157, upper: 161, background: colors.orange, color: colors.black },
							{ lower: 162, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 83:
						conditions = [
							{ lower: null, upper: 100, background: colors.red, color: colors.white },
							{ lower: 101, upper: 104, background: colors.yellow, color: colors.black },
							{ lower: 105, upper: 107, background: colors.lightgreen, color: colors.black },
							{ lower: 108, upper: 121, background: colors.green, color: colors.white },
							{ lower: 122, upper: 122, background: colors.lightgreen, color: colors.black },
							{ lower: 123, upper: 123, background: colors.yellow, color: colors.black },
							{ lower: 124, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 145, background: colors.green, color: colors.white },
							{ lower: 146, upper: 150, background: colors.lightgreen, color: colors.black },
							{ lower: 151, upper: 155, background: colors.yellow, color: colors.black },
							{ lower: 156, upper: 160, background: colors.orange, color: colors.black },
							{ lower: 161, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 84:
						conditions = [
							{ lower: null, upper: 100, background: colors.red, color: colors.white },
							{ lower: 101, upper: 104, background: colors.yellow, color: colors.black },
							{ lower: 105, upper: 107, background: colors.lightgreen, color: colors.black },
							{ lower: 108, upper: 120, background: colors.green, color: colors.white },
							{ lower: 121, upper: 121, background: colors.lightgreen, color: colors.black },
							{ lower: 122, upper: 122, background: colors.yellow, color: colors.black },
							{ lower: 123, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 144, background: colors.green, color: colors.white },
							{ lower: 145, upper: 149, background: colors.lightgreen, color: colors.black },
							{ lower: 150, upper: 154, background: colors.yellow, color: colors.black },
							{ lower: 155, upper: 159, background: colors.orange, color: colors.black },
							{ lower: 160, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 85:
						conditions = [
							{ lower: null, upper: 100, background: colors.red, color: colors.white },
							{ lower: 101, upper: 104, background: colors.yellow, color: colors.black },
							{ lower: 105, upper: 107, background: colors.lightgreen, color: colors.black },
							{ lower: 108, upper: 119, background: colors.green, color: colors.white },
							{ lower: 120, upper: 120, background: colors.lightgreen, color: colors.black },
							{ lower: 121, upper: 121, background: colors.yellow, color: colors.black },
							{ lower: 122, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 143, background: colors.green, color: colors.white },
							{ lower: 144, upper: 148, background: colors.lightgreen, color: colors.black },
							{ lower: 149, upper: 153, background: colors.yellow, color: colors.black },
							{ lower: 154, upper: 158, background: colors.orange, color: colors.black },
							{ lower: 159, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 86:
						conditions = [
							{ lower: null, upper: 100, background: colors.red, color: colors.white },
							{ lower: 101, upper: 104, background: colors.yellow, color: colors.black },
							{ lower: 105, upper: 106, background: colors.lightgreen, color: colors.black },
							{ lower: 108, upper: 118, background: colors.green, color: colors.white },
							{ lower: 119, upper: 119, background: colors.lightgreen, color: colors.black },
							{ lower: 120, upper: 120, background: colors.yellow, color: colors.black },
							{ lower: 121, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 142, background: colors.green, color: colors.white },
							{ lower: 143, upper: 147, background: colors.lightgreen, color: colors.black },
							{ lower: 148, upper: 152, background: colors.yellow, color: colors.black },
							{ lower: 153, upper: 157, background: colors.orange, color: colors.black },
							{ lower: 158, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 87:
						conditions = [
							{ lower: null, upper: 100, background: colors.red, color: colors.white },
							{ lower: 101, upper: 104, background: colors.yellow, color: colors.black },
							{ lower: 105, upper: 106, background: colors.lightgreen, color: colors.black },
							{ lower: 107, upper: 117, background: colors.green, color: colors.white },
							{ lower: 118, upper: 118, background: colors.lightgreen, color: colors.black },
							{ lower: 119, upper: 119, background: colors.yellow, color: colors.black },
							{ lower: 120, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 141, background: colors.green, color: colors.white },
							{ lower: 142, upper: 146, background: colors.lightgreen, color: colors.black },
							{ lower: 147, upper: 151, background: colors.yellow, color: colors.black },
							{ lower: 152, upper: 156, background: colors.orange, color: colors.black },
							{ lower: 157, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 88:
						conditions = [
							{ lower: null, upper: 100, background: colors.red, color: colors.white },
							{ lower: 101, upper: 104, background: colors.yellow, color: colors.black },
							{ lower: 105, upper: 106, background: colors.lightgreen, color: colors.black },
							{ lower: 107, upper: 116, background: colors.green, color: colors.white },
							{ lower: 117, upper: 117, background: colors.lightgreen, color: colors.black },
							{ lower: 118, upper: 118, background: colors.yellow, color: colors.black },
							{ lower: 119, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 140, background: colors.green, color: colors.white },
							{ lower: 141, upper: 145, background: colors.lightgreen, color: colors.black },
							{ lower: 146, upper: 150, background: colors.yellow, color: colors.black },
							{ lower: 151, upper: 155, background: colors.orange, color: colors.black },
							{ lower: 156, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 89:
						conditions = [
							{ lower: null, upper: 100, background: colors.red, color: colors.white },
							{ lower: 101, upper: 104, background: colors.yellow, color: colors.black },
							{ lower: 105, upper: 105, background: colors.lightgreen, color: colors.black },
							{ lower: 106, upper: 115, background: colors.green, color: colors.white },
							{ lower: 116, upper: 116, background: colors.lightgreen, color: colors.black },
							{ lower: 117, upper: 117, background: colors.yellow, color: colors.black },
							{ lower: 118, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 139, background: colors.green, color: colors.white },
							{ lower: 140, upper: 144, background: colors.lightgreen, color: colors.black },
							{ lower: 145, upper: 149, background: colors.yellow, color: colors.black },
							{ lower: 152, upper: 154, background: colors.orange, color: colors.black },
							{ lower: 155, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 90:
						conditions = [
							{ lower: null, upper: 100, background: colors.red, color: colors.white },
							{ lower: 101, upper: 104, background: colors.yellow, color: colors.black },
							{ lower: 105, upper: 105, background: colors.lightgreen, color: colors.black },
							{ lower: 106, upper: 114, background: colors.green, color: colors.white },
							{ lower: 115, upper: 115, background: colors.lightgreen, color: colors.black },
							{ lower: 116, upper: 116, background: colors.yellow, color: colors.black },
							{ lower: 117, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 138, background: colors.green, color: colors.white },
							{ lower: 139, upper: 143, background: colors.lightgreen, color: colors.black },
							{ lower: 144, upper: 148, background: colors.yellow, color: colors.black },
							{ lower: 149, upper: 153, background: colors.orange, color: colors.black },
							{ lower: 154, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 91:
						conditions = [
							{ lower: null, upper: 99, background: colors.red, color: colors.white },
							{ lower: 100, upper: 103, background: colors.yellow, color: colors.black },
							{ lower: 104, upper: 105, background: colors.lightgreen, color: colors.black },
							{ lower: 106, upper: 113, background: colors.green, color: colors.white },
							{ lower: 114, upper: 114, background: colors.lightgreen, color: colors.black },
							{ lower: 115, upper: 115, background: colors.yellow, color: colors.black },
							{ lower: 116, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 137, background: colors.green, color: colors.white },
							{ lower: 138, upper: 142, background: colors.lightgreen, color: colors.black },
							{ lower: 143, upper: 147, background: colors.yellow, color: colors.black },
							{ lower: 148, upper: 152, background: colors.orange, color: colors.black },
							{ lower: 153, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 92:
						conditions = [
							{ lower: null, upper: 98, background: colors.red, color: colors.white },
							{ lower: 99, upper: 102, background: colors.yellow, color: colors.black },
							{ lower: 103, upper: 104, background: colors.lightgreen, color: colors.black },
							{ lower: 105, upper: 112, background: colors.green, color: colors.white },
							{ lower: 113, upper: 113, background: colors.lightgreen, color: colors.black },
							{ lower: 114, upper: 114, background: colors.yellow, color: colors.black },
							{ lower: 115, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 136, background: colors.green, color: colors.white },
							{ lower: 137, upper: 141, background: colors.lightgreen, color: colors.black },
							{ lower: 142, upper: 146, background: colors.yellow, color: colors.black },
							{ lower: 147, upper: 151, background: colors.orange, color: colors.black },
							{ lower: 152, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 93:
						conditions = [
							{ lower: null, upper: 97, background: colors.red, color: colors.white },
							{ lower: 98, upper: 101, background: colors.yellow, color: colors.black },
							{ lower: 102, upper: 104, background: colors.lightgreen, color: colors.black },
							{ lower: 105, upper: 111, background: colors.green, color: colors.white },
							{ lower: 112, upper: 112, background: colors.lightgreen, color: colors.black },
							{ lower: 113, upper: 113, background: colors.yellow, color: colors.black },
							{ lower: 114, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 135, background: colors.green, color: colors.white },
							{ lower: 136, upper: 140, background: colors.lightgreen, color: colors.black },
							{ lower: 141, upper: 145, background: colors.yellow, color: colors.black },
							{ lower: 146, upper: 150, background: colors.orange, color: colors.black },
							{ lower: 151, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 94:
						conditions = [
							{ lower: null, upper: 96, background: colors.red, color: colors.white },
							{ lower: 97, upper: 100, background: colors.yellow, color: colors.black },
							{ lower: 101, upper: 103, background: colors.lightgreen, color: colors.black },
							{ lower: 104, upper: 110, background: colors.green, color: colors.white },
							{ lower: 111, upper: 111, background: colors.lightgreen, color: colors.black },
							{ lower: 112, upper: 112, background: colors.yellow, color: colors.black },
							{ lower: 113, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 134, background: colors.green, color: colors.white },
							{ lower: 135, upper: 139, background: colors.lightgreen, color: colors.black },
							{ lower: 140, upper: 144, background: colors.yellow, color: colors.black },
							{ lower: 145, upper: 149, background: colors.orange, color: colors.black },
							{ lower: 150, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 95:
						conditions = [
							{ lower: null, upper: 95, background: colors.red, color: colors.white },
							{ lower: 96, upper: 99, background: colors.yellow, color: colors.black },
							{ lower: 100, upper: 102, background: colors.lightgreen, color: colors.black },
							{ lower: 103, upper: 109, background: colors.green, color: colors.white },
							{ lower: 110, upper: 110, background: colors.lightgreen, color: colors.black },
							{ lower: 111, upper: 111, background: colors.yellow, color: colors.black },
							{ lower: 112, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 133, background: colors.green, color: colors.white },
							{ lower: 134, upper: 138, background: colors.lightgreen, color: colors.black },
							{ lower: 139, upper: 143, background: colors.yellow, color: colors.black },
							{ lower: 144, upper: 148, background: colors.orange, color: colors.black },
							{ lower: 149, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 96:
						conditions = [
							{ lower: null, upper: 94, background: colors.red, color: colors.white },
							{ lower: 95, upper: 98, background: colors.yellow, color: colors.black },
							{ lower: 99, upper: 101, background: colors.lightgreen, color: colors.black },
							{ lower: 102, upper: 108, background: colors.green, color: colors.white },
							{ lower: 109, upper: 109, background: colors.lightgreen, color: colors.black },
							{ lower: 110, upper: 110, background: colors.yellow, color: colors.black },
							{ lower: 111, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 132, background: colors.green, color: colors.white },
							{ lower: 133, upper: 137, background: colors.lightgreen, color: colors.black },
							{ lower: 138, upper: 142, background: colors.yellow, color: colors.black },
							{ lower: 143, upper: 147, background: colors.orange, color: colors.black },
							{ lower: 148, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 97:
						conditions = [
							{ lower: null, upper: 93, background: colors.red, color: colors.white },
							{ lower: 94, upper: 97, background: colors.yellow, color: colors.black },
							{ lower: 98, upper: 100, background: colors.lightgreen, color: colors.black },
							{ lower: 101, upper: 107, background: colors.green, color: colors.white },
							{ lower: 108, upper: 108, background: colors.lightgreen, color: colors.black },
							{ lower: 109, upper: 109, background: colors.yellow, color: colors.black },
							{ lower: 110, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 131, background: colors.green, color: colors.white },
							{ lower: 132, upper: 136, background: colors.lightgreen, color: colors.black },
							{ lower: 137, upper: 141, background: colors.yellow, color: colors.black },
							{ lower: 142, upper: 146, background: colors.orange, color: colors.black },
							{ lower: 147, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 98:
						conditions = [
							{ lower: null, upper: 92, background: colors.red, color: colors.white },
							{ lower: 93, upper: 96, background: colors.yellow, color: colors.black },
							{ lower: 97, upper: 99, background: colors.lightgreen, color: colors.black },
							{ lower: 100, upper: 106, background: colors.green, color: colors.white },
							{ lower: 107, upper: 107, background: colors.lightgreen, color: colors.black },
							{ lower: 108, upper: 108, background: colors.yellow, color: colors.black },
							{ lower: 109, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 130, background: colors.green, color: colors.white },
							{ lower: 132, upper: 135, background: colors.lightgreen, color: colors.black },
							{ lower: 135, upper: 140, background: colors.yellow, color: colors.black },
							{ lower: 141, upper: 145, background: colors.orange, color: colors.black },
							{ lower: 146, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 99:
						conditions = [
							{ lower: null, upper: 91, background: colors.red, color: colors.white },
							{ lower: 92, upper: 95, background: colors.yellow, color: colors.black },
							{ lower: 96, upper: 98, background: colors.lightgreen, color: colors.black },
							{ lower: 99, upper: 105, background: colors.green, color: colors.white },
							{ lower: 106, upper: 106, background: colors.lightgreen, color: colors.black },
							{ lower: 107, upper: 107, background: colors.yellow, color: colors.black },
							{ lower: 108, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 130, background: colors.green, color: colors.white },
							{ lower: 131, upper: 134, background: colors.lightgreen, color: colors.black },
							{ lower: 135, upper: 139, background: colors.yellow, color: colors.black },
							{ lower: 140, upper: 144, background: colors.orange, color: colors.black },
							{ lower: 145, upper: null, background: colors.red, color: colors.white }
						]
						break;
					case 100:
						conditions = [
							{ lower: null, upper: 90, background: colors.red, color: colors.white },
							{ lower: 91, upper: 94, background: colors.yellow, color: colors.black },
							{ lower: 95, upper: 97, background: colors.lightgreen, color: colors.black },
							{ lower: 98, upper: 104, background: colors.green, color: colors.white },
							{ lower: 105, upper: 105, background: colors.lightgreen, color: colors.black },
							{ lower: 106, upper: 106, background: colors.yellow, color: colors.black },
							{ lower: 107, upper: 128, background: colors.orange, color: colors.black },
							{ lower: 129, upper: 129, background: colors.lightgreen, color: colors.black },
							{ lower: 130, upper: 130, background: colors.green, color: colors.white },
							{ lower: 131, upper: 133, background: colors.lightgreen, color: colors.black },
							{ lower: 134, upper: 138, background: colors.yellow, color: colors.black },
							{ lower: 139, upper: 143, background: colors.orange, color: colors.black },
							{ lower: 144, upper: null, background: colors.red, color: colors.white }
						]
						break;
					default:
						break;
				}
			}//if userage >= 13 or userage <= 100
			else if (userage > 100) {
				conditions = [
					{ lower: null, upper: 89, background: colors.red, color: colors.white },
					{ lower: 90, upper: 93, background: colors.yellow, color: colors.black },
					{ lower: 94, upper: 96, background: colors.lightgreen, color: colors.black },
					{ lower: 97, upper: 103, background: colors.green, color: colors.white },
					{ lower: 104, upper: 104, background: colors.lightgreen, color: colors.black },
					{ lower: 105, upper: 105, background: colors.yellow, color: colors.black },
					{ lower: 106, upper: 127, background: colors.orange, color: colors.black },
					{ lower: 128, upper: 128, background: colors.lightgreen, color: colors.black },
					{ lower: 129, upper: 129, background: colors.green, color: colors.white },
					{ lower: 130, upper: 132, background: colors.lightgreen, color: colors.black },
					{ lower: 133, upper: 137, background: colors.yellow, color: colors.black },
					{ lower: 138, upper: 142, background: colors.orange, color: colors.black },
					{ lower: 143, upper: null, background: colors.red, color: colors.white }
				]
			}//if userage > 100
			//selecting the background and text color based on userage and heartrate
			for (let rangeIndex = 0; rangeIndex < conditions.length; rangeIndex++) {
				let currentRange = conditions[rangeIndex]
				if (isNull(currentRange.lower)) {
					if (heartrate <= currentRange.upper) {
						background = currentRange.background
						color = currentRange.color
						break
					}
				}
				else if (isNull(currentRange.upper)) {
					if (heartrate >= currentRange.lower) {
						background = currentRange.background
						color = currentRange.color
						break
					}
				} else if (heartrate >= currentRange.lower && heartrate <= currentRange.upper) {
					background = currentRange.background
					color = currentRange.color
					break
				}
			}
		}
		return [background, color]
	}
	aerobicTimeZone(value, durationdate) {
		let lower_aerobic_zone;
		let higher_aerobic_zone;

		for (let [key, ranges] of Object.entries(this.state.aa_ranges)) {
			lower_aerobic_zone = ranges[1];
			higher_aerobic_zone = ranges[2] - 1;
		}
		let aa_ranges = this.state.aa_ranges['0'];
		let workout_duration_hours_min_score = this.renderValue(value.workout_duration_hours_min, durationdate);
		let aerobicPrcnt = this.aaExercisestatsPrct(this.renderValue(value.prcnt_aerobic_duration, durationdate));
		let score = this.aaExercisestats(this.renderValue(value.hr_aerobic_duration_hour_min, durationdate), workout_duration_hours_min_score);
		let heartRateNotRecorded = this.renderValue(value.hr_not_recorded_duration_hour_min, durationdate)
		let avgheartratecolor = this.aaColorRanges(this.renderValue(value.avg_non_strength_exercise_heart_rate, durationdate), heartRateNotRecorded, workout_duration_hours_min_score);

		return (
			<div className="col-md table_margin workout_dashboard_data" style={{ 'backgroundColor': avgheartratecolor[0], color: avgheartratecolor[1] }}>
				<h3>Aerobic Zone</h3>
				<p>
					<span>{lower_aerobic_zone + ' - ' + higher_aerobic_zone}</span><br />
					<h5>
						{
							score == "No workout"
								? "N/A"
								: score + ' ( ' + aerobicPrcnt + '% ) '
						}
					</h5>
				</p>
			</div>
		)
	}

	anerobicTimeZone(value, durationdate) {
		let anerobic_zone;
		for (let [key, ranges] of Object.entries(this.state.aa_ranges)) {
			anerobic_zone = ranges[2];
		}
		let heartRateNotRecorded = this.renderValue(value.hr_not_recorded_duration_hour_min, durationdate)
		let workout_duration_hours_min_score = this.renderValue(value.workout_duration_hours_min, durationdate);
		let score = this.aaExercisestats(this.renderValue(value.hr_anaerobic_duration_hour_min, durationdate), workout_duration_hours_min_score);
		let anerobicPrcnt = this.aaExercisestatsPrct(this.renderValue(value.prcnt_anaerobic_duration, durationdate));
		let avgheartratecolor = this.aaColorRanges(this.renderValue(value.avg_non_strength_exercise_heart_rate, durationdate), heartRateNotRecorded, workout_duration_hours_min_score);

		return (
			<div className="col-md table_margin workout_dashboard_data" style={{ 'backgroundColor': avgheartratecolor[0], color: avgheartratecolor[1] }}>
				<h3>Anaerobic Zone</h3>
				<p>
					<span>Above {anerobic_zone}</span><br />
					<h5>
						{
							score == "No workout"
								? "N/A"
								: score + ' ( ' + anerobicPrcnt + '% ) '
						}
					</h5>
				</p>
			</div>
		)
	}

	belowAerobicTimeZone(value, durationdate) {
		let below_aerobic_zone;
		for (let [key, ranges] of Object.entries(this.state.aa_ranges)) {
			below_aerobic_zone = ranges[0];
		}
		let workout_duration_hours_min_score = this.renderValue(value.workout_duration_hours_min, durationdate);
		let heartRateNotRecorded = this.renderValue(value.hr_not_recorded_duration_hour_min, durationdate)
		let score = this.aaExercisestats(this.renderValue(value.hr_below_aerobic_duration_hour_min, durationdate), workout_duration_hours_min_score);
		let belowAerobicPrcnt = this.aaExercisestatsPrct(this.renderValue(value.prcnt_below_aerobic_duration, durationdate))
		let avgheartratecolor = this.aaColorRanges(this.renderValue(value.avg_non_strength_exercise_heart_rate, durationdate), heartRateNotRecorded, workout_duration_hours_min_score);

		return (
			<div className="col-md table_margin workout_dashboard_data" style={{ 'backgroundColor': avgheartratecolor[0], color: avgheartratecolor[1] }}>
				<h3>Below Aerobic Zone</h3>
				<p>
					<span>Below {below_aerobic_zone}</span><br />
					<h5>
						{
							score == "No workout"
								? "N/A"
								: score + ' ( ' + belowAerobicPrcnt + '% ) '
						}
					</h5>
				</p>
			</div >
		)
	}

	heartRateNotRecordedTimeZone(value, durationdate) {
		let workout_duration_hours_min_score = this.renderValue(value.workout_duration_hours_min, durationdate);
		let score = this.aaExercisestats(this.renderValue(value.hr_not_recorded_duration_hour_min, durationdate), workout_duration_hours_min_score);
		let hrr_not_recorded_prcnt = this.aaExercisestatsPrct(this.renderValue(value.prcnt_hr_not_recorded_duration, durationdate));

		return (
			<div className="col-md table_margin workout_dashboard_data">
				<h3>Heart Rate <br />Not-Recorded</h3>
				<h5>
					{
						score == "No workout"
							? 'N/A'
							: score + ' ( ' + hrr_not_recorded_prcnt + '% ) '
					}
				</h5>
			</div>
		)
	}

	totalworkoutdurationTimeZone(value, durationdate) {
		let score = this.renderValue(value.workout_duration_hours_min, durationdate);
		if (score == undefined || score == 0 || score == "" || score == "00:00" || score == null) {
			score = "N/A";
		}
		return (
			<div className="col-md table_margin workout_dashboard_data">
				<h3>Total Workout Duration</h3>
				<h5>
					{score}
				</h5>
			</div>
		);
	}

	aaExercisestats(value, workout_duration_hours_min_score) {
		if ((value == undefined || value == 0 || value == "" || value == "00:00" || value == null) && (workout_duration_hours_min_score == undefined || workout_duration_hours_min_score == 0 || workout_duration_hours_min_score == "" || workout_duration_hours_min_score == "00:00" || workout_duration_hours_min_score == null)) {
			value = "No workout"
		}
		else if (workout_duration_hours_min_score && workout_duration_hours_min_score != "") {
			value = value
		}
		return value;
	}
	aaExercisestatsPrct(value) {
		if ((value == undefined || value == 0 || value == "" || value == "00:00" || value == null)) {
			value = "0"
		}
		else {
			value = value
		}
		return value;
	}
	secondsToHourMinute(seconds) {
		if (isNaN(seconds) || seconds < 0) return "N/A"
		let hours = Math.floor(seconds / 3600);
		seconds %= 3600;
		let minutes = Math.floor(seconds / 60);
		seconds = seconds % 60;
		return hours + ":" + minutes
	}
	renderDurationInTimeZones() {
		let rows = []
		//code to display duration in timezones if json data keys are of workout type
		// Object.keys(durationInTimeZones).map(workoutType => {
		// 	let columns = []
		// 	durationInTimeZones[workoutType].map((sequence) => {
		// 		console.log(sequence)
		// 		columns.push(
		// 			<td className="value_style" style={{ 'backgroundColor': sequence["color"] }}>
		// 				{duration['range']}<br />&nbsp;
		// 				{this.secondsToHourMinute(1000)}&nbsp;({this.renderPercent(duration['percentage'])})
		// 				</td>)
		// 	})
		// 	rows.push()
		// 	// console.log(durationInTimeZones[workoutType])
		// })
		let count = 0;
		let columns = []
		let timezonesData = this.state.durationInTimeZones[this.state.selected_range]
		let sequences = Object.keys(timezonesData)
		let lastSequence = sequences[sequences.length - 1]
		let lastTimeZone = timezonesData[lastSequence]
		sequences.map((timezone) => {
			let currentTimeZone = timezonesData[timezone]
			// console.log(currentTimeZone)
			if (count % 4 == 0) {
				rows.push(<tr>{columns}</tr>)
				columns = []
			}
			count++
			columns.push(
				<td className="value_style" style={{ 'backgroundColor': currentTimeZone["color"], 'color': currentTimeZone['color'] == "green" ? 'white' : 'black' }}>
					{timezone}<br />&nbsp;
					{this.secondsToHourMinute(currentTimeZone['duration'])}&nbsp;({currentTimeZone['percentage']}%)
				</td>)
		})
		let table = <div className="content-justify-center p-2" style={{ 'overflow': 'hidden' }}>
			<h2 className="bg-info text-white">Duration In Zones (hh:mm)(%time in zone)</h2>
			<table className="table table-responsive timezone_duration" > <tbody>{rows}</tbody></table>
			<h3 className="bg-danger text-white">>>&nbsp;{lastSequence}
				&nbsp;&nbsp;{this.secondsToHourMinute(lastTimeZone['duration'])}&nbsp;({lastTimeZone['percentage']}%)
			</h3>
		</div>
		return table
	}

	render() {
		return (
			<div>
				<NavbarMenu title={"AA Dashboard"} />
				{this.state.active_view &&
					<div className="nav3" id='bottom-nav'>
						<div className="nav1" style={{ position: this.state.scrollingLock ? "fixed" : "relative" }}>
							<Navbar light toggleable className="navbar nav1 user_nav">
								<NavbarToggler className="navbar-toggler hidden-sm-up user_clndr" onClick={this.toggle1}>
									<div className="toggler">
										<FontAwesome
											name="bars"
											size="1x"
										/>
									</div>
								</NavbarToggler>
								<span id="navlink" onClick={this.toggleCalendar} id="gd_progress">
									<FontAwesome
										style={{ color: "white", marginLeft: "20px" }}
										name="calendar"
										size="1x"
									/>
									<span style={{ marginLeft: "20px", color: "white", paddingTop: "7px" }}>
										{moment(this.state.selectedDate).format('MMM D, YYYY ')}
									</span>
								</span>
								<span onClick={this.toggleDate4} id="daterange4" className="date_range1" style={{ color: "white" }}>
									<span className="date_range_btn">
										<Button
											className="daterange-btn btn"
											id="daterange"
											onClick={this.toggleDate4} >Custom Date Range1
                                            </Button>
									</span>
								</span>

								<Collapse className="navbar-toggleable-xs" isOpen={this.state.isOpen1} navbar>
									<Nav className="nav navbar-nav float-xs-right ml-auto" navbar>
										<span className="pdf_button" id="pdf_button">
											<a href={this.createExcelPrintURL()}>
												<Button className="btn createbutton mb5">Export Report</Button>
											</a>
										</span>
										<span onClick={this.toggleDate1} id="daterange1" className="date_rangee1" style={{ color: "white" }}>
											<span className="date_range_btn">
												<Button
													className="daterange-btn btn"
													id="daterange"
													onClick={this.toggleDate1} >Custom Date Range1
                                            </Button>
											</span>
										</span>
										<span onClick={this.toggleDate2} id="daterange2" style={{ color: "white" }}>
											<span className="date_range_btn date_range_btn2">
												<Button
													className="daterange-btn btn"
													id="daterange"
													onClick={this.toggleDate2} >Custom Date Range2
                                      </Button>
											</span>
										</span>
										<span onClick={this.toggleDate3} id="daterange3" style={{ color: "white" }}>
											<span className="date_range_btn date_range_btn3">
												<Button
													className="daterange-btn btn"
													id="daterange"
													onClick={this.toggleDate3} >Custom Date Range3
                                      </Button>
											</span>
										</span>
										<span className="pa_dropbutton">
											<span id="spa">

												<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
													<DropdownToggle caret style={{ backgroundColor: "#40E0D0", borderColor: "#40E0D0", paddingTop: "10px" }}>
														More
                                        </DropdownToggle>
													<DropdownMenu>
														<DropdownItem>
															<span onClick={this.toggleDate2} id="daterange2" style={{ color: "white" }}>
																<span className="date_range_btn drop_date_range_btn2">
																	<Button
																		className="daterange-btn btn"
																		id="daterange"
																		onClick={this.toggleDate2} >Custom Date Range2
                                                        </Button>
																</span>
															</span>
														</DropdownItem>
														<DropdownItem>
															<span onClick={this.toggleDate3} id="daterange3" style={{ color: "white" }}>
																<span className="date_range_btn drop_date_range_btn3">
																	<Button
																		className="daterange-btn btn"
																		onClick={this.toggleDate3} >Custom Date Range3
                                                        </Button>
																</span>
															</span>
														</DropdownItem>

													</DropdownMenu>
												</Dropdown>
											</span>
										</span>
									</Nav>
								</Collapse>
							</Navbar>
						</div>
					</div>
				}

				<span className="cla_center" style={{ textAlign: "center" }}>{this.renderLastSync(this.state.last_synced)}</span>

				<Popover
					placement="bottom"
					isOpen={this.state.calendarOpen}
					target="gd_progress"
					toggle={this.toggleCalendar}>
					<PopoverBody className="calendar2">
						<CalendarWidget onDaySelect={this.processDate} />
					</PopoverBody>
				</Popover>

				<Popover
					placement="bottom"
					isOpen={this.state.dateRange1}
					target="daterange1"
					toggle={this.toggleDate1}>
					<PopoverBody>
						<div >

							<Form>
								<div style={{ paddingBottom: "12px" }} className="justify-content-center">
									<Label>Start Date</Label>&nbsp;<b style={{ fontWeight: "bold" }}>:</b>&nbsp;
                                  <Input type="date"
										name="cr1_start_date"
										value={this.state.cr1_start_date}
										onChange={this.handleChange} style={{ height: "35px", borderRadius: "7px" }} />

								</div>
								<div id="date" className="justify-content-center">

									<Label>End date</Label>&nbsp;<b style={{ fontWeight: "bold" }}>:</b>&nbsp;
                                  <Input type="date"
										name="cr1_end_date"
										value={this.state.cr1_end_date}
										onChange={this.handleChange} style={{ height: "35px", borderRadius: "7px" }} />

								</div>
								<div id="date" style={{ marginTop: "12px" }} className="justify-content-center">

									<button
										id="nav-btn"
										style={{ backgroundColor: "#ed9507" }}
										type="submit"
										className="btn btn-block-lg"
										onClick={this.onSubmitDate1} style={{ width: "175px" }}>SUBMIT</button>
								</div>

							</Form>
						</div>
					</PopoverBody>
				</Popover>

				<Popover
					placement="bottom"
					isOpen={this.state.dateRange2}
					target="daterange2"
					toggle={this.toggleDate2}>
					<PopoverBody>
						<div >

							<Form>
								<div style={{ paddingBottom: "12px" }} className="justify-content-center">
									<Label>Start Date</Label>&nbsp;<b style={{ fontWeight: "bold" }}>:</b>&nbsp;
                                  <Input type="date"
										name="cr2_start_date"
										value={this.state.cr2_start_date}
										onChange={this.handleChange} style={{ height: "35px", borderRadius: "7px" }} />

								</div>
								<div id="date" className="justify-content-center">

									<Label>End date</Label>&nbsp;<b style={{ fontWeight: "bold" }}>:</b>&nbsp;
                                  <Input type="date"
										name="cr2_end_date"
										value={this.state.cr2_end_date}
										onChange={this.handleChange} style={{ height: "35px", borderRadius: "7px" }} />

								</div>
								<div id="date" style={{ marginTop: "12px" }} className="justify-content-center">

									<button
										id="nav-btn"
										style={{ backgroundColor: "#ed9507" }}
										type="submit"
										className="btn btn-block-lg"
										onClick={this.onSubmitDate2} style={{ width: "175px" }}>SUBMIT</button>
								</div>

							</Form>
						</div>
					</PopoverBody>
				</Popover>
				<Popover
					placement="bottom"
					isOpen={this.state.dateRange3}
					target="daterange3"
					toggle={this.toggleDate3}>
					<PopoverBody>
						<div >
							<Form>
								<div style={{ paddingBottom: "12px" }} className="justify-content-center">
									<Label>Start Date</Label>&nbsp;<b style={{ fontWeight: "bold" }}>:</b>&nbsp;
                                  <Input type="date"
										name="cr3_start_date"
										value={this.state.cr3_start_date}
										onChange={this.handleChange} style={{ height: "35px", borderRadius: "7px" }} />
								</div>
								<div id="date" className="justify-content-center">
									<Label>End date</Label>&nbsp;<b style={{ fontWeight: "bold" }}>:</b>&nbsp;
                                  <Input type="date"
										name="cr3_end_date"
										value={this.state.cr3_end_date}
										onChange={this.handleChange} style={{ height: "35px", borderRadius: "7px" }} />
								</div>
								<div id="date" style={{ marginTop: "12px" }} className="justify-content-center">
									<button
										id="nav-btn"
										style={{ backgroundColor: "#ed9507" }}
										type="submit"
										className="btn btn-block-lg"
										onClick={this.onSubmitDate3} style={{ width: "175px" }}>SUBMIT</button>
								</div>
							</Form>
						</div>
					</PopoverBody>
				</Popover>
				<Popover
					placement="bottom"
					isOpen={this.state.dateRange4}
					target="daterange4"
					toggle={this.toggleDate4}>
					<PopoverBody>
						<div >
							<Form>
								<div style={{ paddingBottom: "12px" }} className="justify-content-center">
									<Label>Start Date</Label>&nbsp;<b style={{ fontWeight: "bold" }}>:</b>&nbsp;
                                  <Input type="date"
										name="cr1_start_date"
										value={this.state.cr1_start_date}
										onChange={this.handleChange} style={{ height: "35px", borderRadius: "7px" }} />
								</div>
								<div id="date" className="justify-content-center">
									<Label>End date</Label>&nbsp;<b style={{ fontWeight: "bold" }}>:</b>&nbsp;
                                  <Input type="date"
										name="cr1_end_date"
										value={this.state.cr1_end_date}
										onChange={this.handleChange} style={{ height: "35px", borderRadius: "7px" }} />

								</div>
								<div id="date" style={{ marginTop: "12px" }} className="justify-content-center">

									<button
										id="nav-btn"
										style={{ backgroundColor: "#ed9507" }}
										type="submit"
										className="btn btn-block-lg"
										onClick={this.onSubmitDate4} style={{ width: "175px" }}>SUBMIT</button>
								</div>

							</Form>
						</div>
					</PopoverBody>
				</Popover>
				{this.state.active_view &&
					<div className="row gd_padding">
						<div className="row padropStyles">
							<Dropdown isOpen={this.state.dropdownOpen1} toggle={this.toggle}>
								<DropdownToggle caret>
									Select Range
							        </DropdownToggle>
								<DropdownMenu>
									{this.renderDateRangeDropdown(this.state.summary, this.state.duration_date)}
								</DropdownMenu>
							</Dropdown>
							<span className="weekdate" style={{ marginLeft: "350px", marginRight: "auto" }}><span className='weekdate'>{this.state.capt}</span><span>{" (" + this.state.date + ")"}{this.state.numberOfDays && <span>{" - " + "Total Days: " + this.state.numberOfDays}</span>}</span></span>
						</div>
					</div>
				}
				<div className="row justify-content-center md_padding">
					{this.belowAerobicTimeZone(this.state.summary.exercise, this.state.selected_range)}
					{this.aerobicTimeZone(this.state.summary.exercise, this.state.selected_range)}
					{this.anerobicTimeZone(this.state.summary.exercise, this.state.selected_range)}
					{this.heartRateNotRecordedTimeZone(this.state.summary.exercise, this.state.selected_range)}
					{this.totalworkoutdurationTimeZone(this.state.summary.exercise, this.state.selected_range)}
				</div>
				<div style={{ "textAlign": "center" }} className="row mt-5 mb-5 justify-content-center">{/* Duration in Time zones table */}
					{this.renderDurationInTimeZones()}
				</div >
				{this.renderProgressFetchOverlay()}
				{this.renderProgress2FetchOverlay()}
				{this.renderProgress3FetchOverlay()}
				{this.renderProgressSelectedDateFetchOverlay()}
			</div >
		);
	}
}
export default Aadashboard;

{/*<span className = "paweekdate"><span>{this.state.capt}</span><span>{" " + this.state.date + ""}</span></span>*/ }
{/*<span className = "weekdate" style={{marginLeft:"300px",marginRight:"auto"}}><span>{this.state.capt}</span><span>{" (" + this.state.date + ")"}{this.state.numberOfDays && <span>{" - " + "Total Days: " +this.state.numberOfDays}</span>}</span></span>*/ }