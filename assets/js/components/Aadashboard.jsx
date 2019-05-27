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
	CardBody, CardTitle, CardSubtitle
} from 'reactstrap';
import NavbarMenu from './navbar';
import fetchProgress, { fetchAaRanges, durationInTimeZones } from '../network/progress';
import { getUserProfile } from '../network/auth';
import { fetchLastSync } from '../network/quick';
import { renderProgressFetchOverlay, renderProgress2FetchOverlay, renderProgress3FetchOverlay, renderProgressSelectedDateFetchOverlay } from './dashboard_healpers';


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
			durationInTimeZones: {}
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
		this.renderDurationInTimeZones = this.renderDurationInTimeZones.bind(this)
		this.successDurationInTimeZones = this.successDurationInTimeZones.bind(this)
		this.errorDurationInTimeZones = this.errorDurationInTimeZones.bind(this)
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
			durationInTimeZones(this.successDurationInTimeZones, this.errorDurationInTimeZones, this.state.selectedDate)
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
		durationInTimeZones(this.successDurationInTimeZones, this.errorDurationInTimeZones, this.state.selectedDate)
	}
	successDurationInTimeZones(data) {
		this.setState({
			durationInTimeZones: data.data
		})
	}
	errorDurationInTimeZones(error) {
		console.log(error.message)
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
		let background = '';
		let color = '';
		let userage = this.state.userage;
		if (heartrate == null || heartrate == undefined) {
			background = '';
			color = '';
			return [background, color];
		}
		else if (heartrate == 0) {
			if (heartRateNotRecorded == "00:00" && (workout_duration_hours_min_score != ' ' && workout_duration_hours_min_score != '00:00' &&
				workout_duration_hours_min_score)) {
				background = 'green';
				color = 'white';
				return [background, color]

			}
			else if ((heartRateNotRecorded != "00:00" && heartRateNotRecorded) && (workout_duration_hours_min_score != ' ' &&
				workout_duration_hours_min_score && workout_duration_hours_min_score != '00:00')) {
				color = ""
				background = "";
				return [background, color]
			}
		}
		else {
			if (userage >= 13 && userage <= 16) {
				if (heartrate >= 153 && heartrate < 166) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 166 && heartrate < 170) {
					background = "Yellow";
				}
				else if (heartrate >= 170 && heartrate < 175) {
					background = "Orange";
				}
				else if (heartrate >= 175 && heartrate < 179) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 179 && heartrate < 182) {
					background = "green";
					color = "white";
				}
				else if (heartrate >= 182 && heartrate < 187) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 187 && heartrate < 190) {
					background = "Yellow";
				}
				else if (heartrate >= 190 && heartrate < 192) {
					background = "Orange";
				}
				else if (heartrate >= 192 && heartrate < 200) {
					background = "Red";
				}
			}

			if (userage >= 13 && userage <= 25) {
				if (heartrate >= 110 && heartrate < 121) {
					background = "Yellow";
				}
			}

			if (userage >= 13 && userage < 14) {
				if (heartrate >= 121 && heartrate < 141) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 141 && heartrate <= 153) {
					color = "white";
					background = "green";
				}
			}

			if (userage >= 14 && userage < 15) {
				if (heartrate >= 121 && heartrate < 140) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 140 && heartrate < 153) {
					color = "white";
					background = "green";
				}
			}

			if (userage >= 15 && userage < 16) {
				if (heartrate >= 121 && heartrate < 139) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 139 && heartrate < 153) {
					color = "white";
					background = "green";
				}
			}

			if (userage >= 18 && userage < 55) {
				if (heartrate >= 179 && heartrate < 184) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 184 && heartrate < 187) {
					background = "Yellow";
				}
				else if (heartrate >= 187 && heartrate < 189) {
					background = "Orange";
				}
				else if (heartrate >= 189 && heartrate < 200) {
					background = "Red";
				}
			}

			if (userage >= 26 && userage < 31) {
				if (heartrate >= 155 && heartrate < 159) {
					background = "Yellow";
				}
				else if (heartrate >= 159 && heartrate < 164) {
					background = "Orange";
				}
				else if (heartrate >= 164 && heartrate < 167) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 167 && heartrate < 179) {
					color = "white";
					background = "green";
				}
			}

			if (userage >= 48 && userage < 80) {
				if (heartrate >= 102 && heartrate < 106) {
					background = "Yellow";
				}
				else if (heartrate >= 101 && heartrate < 102) {
					background = "Red";
				}
			}

			if (userage >= 63 && userage < 80) {
				if (heartrate >= 127 && heartrate < 128) {
					background = "Yellow";
				}
			}

			if (userage >= 70 && userage < 80) {
				if (heartrate >= 128 && heartrate < 129) {
					background = "Orange";
				}
			}

			if (userage >= 80 && userage < 91) {
				if (heartrate >= 101 && heartrate < 105) {
					background = "Yellow";
				}
				else if (heartrate >= 100 && heartrate < 101) {
					background = "Red";
				}
			}

			if (userage >= 59 && userage < 80) {
				if (heartrate >= 126 && heartrate < 127) {
					background = "#32CD32";
					color = "white";
				}
			}

			if (userage >= 55 && userage < 80) {
				if (heartrate >= 106 && heartrate < 110) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 110 && heartrate < 125) {
					color = "white";
					background = "green";
				}
			}

			if (userage >= 16 && userage < 17) {
				if (heartrate >= 121 && heartrate < 138) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 138 && heartrate < 153) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 153 && heartrate < 165) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 165 && heartrate < 169) {
					background = "Yellow";
				}
				else if (heartrate >= 169 && heartrate < 174) {
					background = "Orange";
				}
				else if (heartrate >= 174 && heartrate < 178) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 178 && heartrate < 181) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 181 && heartrate < 186) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 186 && heartrate < 189) {
					background = "Yellow";
				}
				else if (heartrate >= 189 && heartrate < 191) {
					background = "Orange";
				}
				else if (heartrate >= 191 && heartrate < 200) {
					background = "Red";
				}
			}

			if (userage >= 17 && userage < 18) {
				if (heartrate >= 121 && heartrate < 137) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 137 && heartrate < 153) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 153 && heartrate < 164) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 164 && heartrate < 168) {
					background = "Yellow";
				}
				else if (heartrate >= 168 && heartrate < 173) {
					background = "Orange";
				}
				else if (heartrate >= 173 && heartrate < 177) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 177 && heartrate < 180) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 180 && heartrate < 185) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 185 && heartrate < 188) {
					background = "Yellow";
				}
				else if (heartrate >= 188 && heartrate < 190) {
					background = "Orange";
				}
				else if (heartrate >= 190 && heartrate < 200) {
					background = "Red";
				}
			}


			if (userage >= 18 && userage < 19) {
				if (heartrate >= 121 && heartrate < 136) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 136 && heartrate < 153) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 153 && heartrate < 163) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 163 && heartrate < 167) {
					background = "Yellow";
				}
				else if (heartrate >= 167 && heartrate < 172) {
					background = "Orange";
				}
				else if (heartrate >= 172 && heartrate < 176) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 176 && heartrate < 179) {
					color = "white";
					background = "green";
				}
			}

			if (userage >= 19 && userage < 20) {
				if (heartrate >= 121 && heartrate < 135) {
					background = "#32CD32";
				}
				else if (heartrate >= 135 && heartrate < 153) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 153 && heartrate < 162) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 162 && heartrate < 166) {
					background = "Yellow";
				}
				else if (heartrate >= 166 && heartrate < 171) {

					background = "Orange";
				}
				else if (heartrate >= 171 && heartrate < 174) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 174 && heartrate < 179) {
					color = "white";
					background = "green";
				}
			}

			if (userage >= 20 && userage < 21) {
				if (heartrate >= 121 && heartrate < 134) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 134 && heartrate < 153) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 153 && heartrate < 161) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 161 && heartrate < 165) {
					background = "Yellow";
				}
				else if (heartrate >= 165 && heartrate < 170) {
					background = "Orange";
				}
				else if (heartrate >= 170 && heartrate < 173) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 173 && heartrate < 179) {
					color = "white";
					background = "green";
				}
			}

			if (userage >= 21 && userage < 22) {
				if (heartrate >= 121 && heartrate < 133) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 133 && heartrate < 153) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 153 && heartrate < 160) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 160 && heartrate < 164) {
					background = "Yellow";
				}
				else if (heartrate >= 164 && heartrate < 169) {
					background = "Orange";
				}
				else if (heartrate >= 169 && heartrate < 172) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 172 && heartrate < 179) {
					color = "white";
					background = "green";
				}
			}

			if (userage >= 22 && userage < 23) {
				if (heartrate >= 121 && heartrate < 132) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 132 && heartrate < 153) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 153 && heartrate < 159) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 159 && heartrate < 163) {
					background = "Yellow";
				}
				else if (heartrate >= 163 && heartrate < 168) {
					background = "Orange";
				}
				else if (heartrate >= 168 && heartrate < 171) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 171 && heartrate < 179) {
					color = "white";
					background = "green";
				}
			}


			if (userage >= 23 && userage < 24) {
				if (heartrate >= 121 && heartrate < 131) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 131 && heartrate < 153) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 153 && heartrate < 158) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 158 && heartrate < 162) {
					background = "Yellow";
				}
				else if (heartrate >= 162 && heartrate < 167) {
					background = "Orange";
				}
				else if (heartrate >= 167 && heartrate < 170) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 170 && heartrate < 179) {
					color = "white";
					background = "green";
				}
			}


			if (userage >= 24 && userage < 25) {
				if (heartrate >= 121 && heartrate < 130) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 130 && heartrate < 152) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 152 && heartrate < 157) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 157 && heartrate < 161) {
					background = "Yellow";
				}
				else if (heartrate >= 161 && heartrate < 166) {
					background = "Orange";
				}
				else if (heartrate >= 166 && heartrate < 169) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 169 && heartrate < 179) {
					color = "white";
					background = "green";
				}
			}


			if (userage >= 25 && userage < 26) {
				if (heartrate >= 110 && heartrate < 120) {
					background = "Yellow";
				}
				else if (heartrate >= 120 && heartrate < 129) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 129 && heartrate < 151) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 156 && heartrate < 160) {
					background = "Yellow";
				}
				else if (heartrate >= 160 && heartrate < 165) {
					background = "Orange";
				}
				else if (heartrate >= 165 && heartrate < 168) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 168 && heartrate < 179) {
					color = "white";
					background = "green";
				}
			}


			if (userage >= 26 && userage < 27) {
				if (heartrate >= 110 && heartrate < 119) {
					background = "Yellow";
				}
				else if (heartrate >= 119 && heartrate < 128) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 128 && heartrate < 150) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 150 && heartrate < 155) {
					background = "#32CD32";
					color = "white";
				}

			}



			if (userage >= 27 && userage < 28) {
				if (heartrate >= 110 && heartrate < 118) {
					background = "Yellow";
				}
				else if (heartrate >= 118 && heartrate < 127) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 127 && heartrate < 149) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 149 && heartrate < 155) {
					background = "#32CD32";
					color = "white";
				}

			}


			if (userage >= 28 && userage < 29) {
				if (heartrate >= 110 && heartrate < 117) {
					background = "Yellow";
				}
				else if (heartrate >= 117 && heartrate < 126) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 126 && heartrate < 148) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 148 && heartrate < 155) {
					background = "#32CD32";
					color = "white";
				}

			}



			if (userage >= 29 && userage < 30) {
				if (heartrate >= 110 && heartrate < 116) {
					background = "Yellow";
				}
				else if (heartrate >= 116 && heartrate < 125) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 125 && heartrate < 147) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 147 && heartrate < 155) {
					background = "#32CD32";
					color = "white";
				}

			}



			if (userage >= 30 && userage < 31) {
				if (heartrate >= 110 && heartrate < 116) {
					background = "Yellow";
				}
				else if (heartrate >= 116 && heartrate < 124) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 124 && heartrate < 146) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 146 && heartrate < 155) {
					background = "#32CD32";
					color = "white";
				}

			}

			if (userage >= 31 && userage < 37) {
				if (heartrate >= 110 && heartrate < 115) {
					background = "Yellow";
				}
			}


			if (userage >= 31 && userage < 32) {
				if (heartrate >= 115 && heartrate < 134) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 134 && heartrate < 146) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 146 && heartrate < 155) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 155 && heartrate < 160) {
					background = "Yellow";
				}

				else if (heartrate >= 160 && heartrate < 168) {
					background = "Orange";
				}
				else if (heartrate >= 168 && heartrate < 171) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 171 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}


			if (userage >= 32 && userage < 33) {
				if (heartrate >= 115 && heartrate < 133) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 133 && heartrate < 146) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 146 && heartrate < 154) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 154 && heartrate < 159) {
					background = "Yellow";
				}

				else if (heartrate >= 159 && heartrate < 167) {
					background = "Orange";
				}
				else if (heartrate >= 167 && heartrate < 170) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 170 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}


			if (userage >= 33 && userage < 34) {
				if (heartrate >= 115 && heartrate < 132) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 132 && heartrate < 146) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 146 && heartrate < 153) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 153 && heartrate < 158) {
					background = "Yellow";
				}

				else if (heartrate >= 158 && heartrate < 166) {
					background = "Orange";
				}
				else if (heartrate >= 166 && heartrate < 169) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 169 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}

			if (userage >= 34 && userage < 35) {
				if (heartrate >= 115 && heartrate < 131) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 131 && heartrate < 146) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 146 && heartrate < 152) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 152 && heartrate < 157) {
					background = "Yellow";
				}

				else if (heartrate >= 157 && heartrate < 165) {
					background = "Orange";
				}
				else if (heartrate >= 165 && heartrate < 166) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 168 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}


			if (userage >= 35 && userage < 36) {
				if (heartrate >= 115 && heartrate < 130) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 130 && heartrate < 146) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 146 && heartrate < 151) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 151 && heartrate < 156) {
					background = "Yellow";
				}

				else if (heartrate >= 156 && heartrate < 164) {
					background = "Orange";
				}
				else if (heartrate >= 164 && heartrate < 167) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 167 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}

			if (userage >= 36 && userage < 37) {
				if (heartrate >= 115 && heartrate < 129) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 129 && heartrate < 145) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 145 && heartrate < 150) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 150 && heartrate < 155) {
					background = "Yellow";
				}

				else if (heartrate >= 155 && heartrate < 163) {
					background = "Orange";
				}
				else if (heartrate >= 163 && heartrate < 166) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 166 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}


			if (userage >= 37 && userage < 38) {
				if (heartrate >= 110 && heartrate < 114) {
					background = "Yellow";
				}
				else if (heartrate >= 114 && heartrate < 128) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 128 && heartrate < 144) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 144 && heartrate < 149) {
					background = "#32CD32";
					color = "white";
				}

				else if (heartrate >= 149 && heartrate < 154) {
					background = "Yellow";
				}
				else if (heartrate >= 154 && heartrate < 162) {
					background = "Orange";
				}
				else if (heartrate >= 162 && heartrate < 165) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 165 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}


			if (userage >= 38 && userage < 39) {
				if (heartrate >= 110 && heartrate < 113) {
					background = "Yellow";
				}
				else if (heartrate >= 113 && heartrate < 127) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 127 && heartrate < 143) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 143 && heartrate < 148) {
					background = "#32CD32";
					color = "white";
				}

				else if (heartrate >= 148 && heartrate < 153) {
					background = "Yellow";
				}
				else if (heartrate >= 153 && heartrate < 161) {
					background = "Orange";
				}
				else if (heartrate >= 161 && heartrate < 164) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 164 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}


			if (userage >= 39 && userage < 40) {
				if (heartrate >= 110 && heartrate < 112) {
					background = "Yellow";
				}
				else if (heartrate >= 112 && heartrate < 126) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 126 && heartrate < 142) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 142 && heartrate < 147) {
					background = "#32CD32";
					color = "white";
				}

				else if (heartrate >= 147 && heartrate < 152) {
					background = "Yellow";
				}
				else if (heartrate >= 152 && heartrate < 160) {
					background = "Orange";
				}
				else if (heartrate >= 160 && heartrate < 163) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 163 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}


			if (userage >= 40 && userage < 41) {
				if (heartrate >= 110 && heartrate < 112) {
					background = "Yellow";
				}
				else if (heartrate >= 112 && heartrate < 125) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 125 && heartrate < 141) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 141 && heartrate < 146) {
					background = "#32CD32";
					color = "white";
				}

				else if (heartrate >= 146 && heartrate < 151) {
					background = "Yellow";
				}
				else if (heartrate >= 151 && heartrate < 159) {
					background = "Orange";
				}
				else if (heartrate >= 159 && heartrate < 162) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 162 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}


			if (userage >= 41 && userage < 42) {
				if (heartrate >= 0 && heartrate < 109) {
					background = "Red";
				}
				else if (heartrate >= 109 && heartrate < 110) {
					background = "Yellow";
				}
				else if (heartrate >= 110 && heartrate < 124) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 124 && heartrate < 140) {
					color = "white";
					background = "green";
				}

				else if (heartrate >= 140 && heartrate < 145) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 145 && heartrate < 150) {
					background = "Yellow";
				}
				else if (heartrate >= 150 && heartrate < 158) {
					background = "Orange";
				}
				else if (heartrate >= 158 && heartrate < 161) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 161 && heartrate < 179) {
					color = "white";
					background = "green";
				}
			}

			if (userage >= 42 && userage < 43) {
				if (heartrate >= 0 && heartrate < 108) {
					background = "Red";
				}
				else if (heartrate >= 108 && heartrate < 109) {
					background = "Yellow";
				}
				else if (heartrate >= 109 && heartrate < 123) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 123 && heartrate < 139) {
					color = "white";
					background = "green";
				}

				else if (heartrate >= 139 && heartrate < 144) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 144 && heartrate < 149) {
					background = "Yellow";
				}
				else if (heartrate >= 149 && heartrate < 157) {
					background = "Orange";
				}
				else if (heartrate >= 157 && heartrate < 160) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 160 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}

			if (userage >= 43 && userage < 44) {
				if (heartrate >= 0 && heartrate < 107) {
					background = "Red";
				}
				else if (heartrate >= 107 && heartrate < 108) {
					background = "Yellow";
				}
				else if (heartrate >= 108 && heartrate < 122) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 122 && heartrate < 138) {
					color = "white";
					background = "green";
				}

				else if (heartrate >= 138 && heartrate < 143) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 143 && heartrate < 148) {
					background = "Yellow";
				}
				else if (heartrate >= 148 && heartrate < 156) {
					background = "Orange";
				}
				else if (heartrate >= 156 && heartrate < 159) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 159 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}

			if (userage >= 44 && userage < 45) {
				if (heartrate >= 0 && heartrate < 106) {
					background = "Red";
				}
				else if (heartrate >= 106 && heartrate < 107) {
					background = "Yellow";
				}
				else if (heartrate >= 107 && heartrate < 121) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 121 && heartrate < 137) {
					color = "white";
					background = "green";
				}

				else if (heartrate >= 137 && heartrate < 142) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 142 && heartrate < 147) {
					background = "Yellow";
				}
				else if (heartrate >= 147 && heartrate < 155) {
					background = "Orange";
				}
				else if (heartrate >= 155 && heartrate < 158) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 158 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}

			if (userage >= 45 && userage < 46) {
				if (heartrate >= 0 && heartrate < 105) {
					background = "Red";
				}
				else if (heartrate >= 105 && heartrate < 106) {
					background = "Yellow";
				}
				else if (heartrate >= 106 && heartrate < 120) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 120 && heartrate < 136) {
					color = "white";
					background = "green";
				}

				else if (heartrate >= 136 && heartrate < 141) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 141 && heartrate < 146) {
					background = "Yellow";
				}
				else if (heartrate >= 146 && heartrate < 154) {
					background = "Orange";
				}
				else if (heartrate >= 154 && heartrate < 157) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 157 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}


			if (userage >= 46 && userage < 47) {
				if (heartrate >= 0 && heartrate < 104) {
					background = "Red";
				}
				else if (heartrate >= 104 && heartrate < 106) {
					background = "Yellow";
				}
				else if (heartrate >= 106 && heartrate < 119) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 119 && heartrate < 135) {
					color = "white";
					background = "green";
				}

				else if (heartrate >= 135 && heartrate < 140) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 140 && heartrate < 145) {
					background = "Yellow";
				}
				else if (heartrate >= 145 && heartrate < 153) {
					background = "Orange";
				}
				else if (heartrate >= 153 && heartrate < 156) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 156 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}

			if (userage >= 47 && userage < 48) {
				if (heartrate >= 0 && heartrate < 103) {
					background = "Red";
				}
				else if (heartrate >= 103 && heartrate < 105) {
					background = "Yellow";
				}
				else if (heartrate >= 106 && heartrate < 118) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 118 && heartrate < 134) {
					color = "white";
					background = "green";
				}

				else if (heartrate >= 134 && heartrate < 139) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 140 && heartrate < 144) {
					background = "Yellow";
				}
				else if (heartrate >= 144 && heartrate < 152) {
					background = "Orange";
				}
				else if (heartrate >= 152 && heartrate < 155) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 155 && heartrate < 179) {
					color = "white";
					background = "green";
				}
			}

			if (userage >= 48 && userage < 49) {
				if (heartrate >= 106 && heartrate < 117) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 117 && heartrate < 133) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 133 && heartrate < 138) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 138 && heartrate < 143) {
					background = "Yellow";
				}

				else if (heartrate >= 143 && heartrate < 151) {
					background = "Orange";
				}
				else if (heartrate >= 151 && heartrate < 154) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 154 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}


			if (userage >= 49 && userage < 50) {
				if (heartrate >= 106 && heartrate < 116) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 116 && heartrate < 132) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 132 && heartrate < 137) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 137 && heartrate < 142) {
					background = "Yellow";
				}

				else if (heartrate >= 142 && heartrate < 150) {
					background = "Orange";
				}
				else if (heartrate >= 150 && heartrate < 153) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 153 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}

			if (userage >= 50 && userage < 51) {
				if (heartrate >= 106 && heartrate < 115) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 115 && heartrate < 131) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 131 && heartrate < 136) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 136 && heartrate < 141) {
					background = "Yellow";
				}

				else if (heartrate >= 141 && heartrate < 149) {
					background = "Orange";
				}
				else if (heartrate >= 149 && heartrate < 152) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 152 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}
			if (userage >= 51 && userage < 52) {
				if (heartrate >= 106 && heartrate < 114) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 114 && heartrate < 130) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 130 && heartrate < 135) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 135 && heartrate < 140) {
					background = "Yellow";
				}

				else if (heartrate >= 140 && heartrate < 148) {
					background = "Orange";
				}
				else if (heartrate >= 148 && heartrate < 151) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 151 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}
			if (userage >= 52 && userage < 53) {
				if (heartrate >= 106 && heartrate < 113) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 113 && heartrate < 129) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 129 && heartrate < 134) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 134 && heartrate < 139) {
					background = "Yellow";
				}

				else if (heartrate >= 139 && heartrate < 147) {
					background = "Orange";
				}
				else if (heartrate >= 147 && heartrate < 150) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 150 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}

			if (userage >= 53 && userage < 54) {
				if (heartrate >= 106 && heartrate < 112) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 112 && heartrate < 128) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 128 && heartrate < 133) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 133 && heartrate < 138) {
					background = "Yellow";
				}

				else if (heartrate >= 138 && heartrate < 146) {
					background = "Orange";
				}
				else if (heartrate >= 146 && heartrate < 149) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 149 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}


			if (userage >= 54 && userage < 55) {
				if (heartrate >= 106 && heartrate < 111) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 111 && heartrate < 127) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 127 && heartrate < 132) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 132 && heartrate < 137) {
					background = "Yellow";
				}

				else if (heartrate >= 137 && heartrate < 145) {
					background = "Orange";
				}
				else if (heartrate >= 145 && heartrate < 148) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 148 && heartrate < 179) {
					background = "green";
					color = "white";
				}

			}

			if (userage >= 55 && userage < 56) {
				if (heartrate >= 126 && heartrate < 131) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 131 && heartrate < 136) {
					background = "Yellow";
				}
				else if (heartrate >= 136 && heartrate < 144) {
					background = "Orange";
				}
				else if (heartrate >= 144 && heartrate < 149) {
					background = "#32CD32";
					color = "white";
				}

				else if (heartrate >= 149 && heartrate < 174) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 174 && heartrate < 179) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 179 && heartrate < 184) {
					background = "Yellow";
				}
				else if (heartrate >= 184 && heartrate < 189) {
					background = "Orange";
				}
				else if (heartrate >= 189 && heartrate < 200) {
					background = "Red";
				}

			}

			if (userage >= 56 && userage < 57) {
				if (heartrate >= 126 && heartrate < 130) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 130 && heartrate < 135) {
					background = "Yellow";
				}
				else if (heartrate >= 135 && heartrate < 143) {
					background = "Orange";
				}
				else if (heartrate >= 143 && heartrate < 148) {
					background = "#32CD32";
					color = "white";
				}

				else if (heartrate >= 148 && heartrate < 173) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 173 && heartrate < 178) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 178 && heartrate < 183) {
					background = "Yellow";
				}
				else if (heartrate >= 183 && heartrate < 188) {
					background = "Orange";
				}
				else if (heartrate >= 188 && heartrate < 200) {
					background = "Red";
				}

			}


			if (userage >= 57 && userage < 58) {
				if (heartrate >= 126 && heartrate < 129) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 129 && heartrate < 134) {
					background = "Yellow";
				}
				else if (heartrate >= 134 && heartrate < 142) {
					background = "Orange";
				}
				else if (heartrate >= 142 && heartrate < 147) {
					background = "#32CD32";
					color = "white";
				}

				else if (heartrate >= 147 && heartrate < 172) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 172 && heartrate < 177) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 177 && heartrate < 182) {
					background = "Yellow";
				}
				else if (heartrate >= 182 && heartrate < 187) {
					background = "Orange";
				}
				else if (heartrate >= 187 && heartrate < 200) {
					background = "Red";
				}

			}

			if (userage >= 58 && userage < 59) {
				if (heartrate >= 126 && heartrate < 128) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 128 && heartrate < 133) {
					background = "Yellow";
				}
				else if (heartrate >= 133 && heartrate < 141) {
					background = "Orange";
				}
				else if (heartrate >= 141 && heartrate < 146) {
					background = "#32CD32";
					color = "white";
				}

				else if (heartrate >= 146 && heartrate < 171) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 171 && heartrate < 176) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 176 && heartrate < 181) {
					background = "Yellow";
				}
				else if (heartrate >= 181 && heartrate < 186) {
					background = "Orange";
				}
				else if (heartrate >= 186 && heartrate < 200) {
					background = "Red";
				}

			}

			if (userage >= 59 && userage < 60) {
				if (heartrate >= 127 && heartrate < 132) {
					background = "Yellow";
				}
				else if (heartrate >= 132 && heartrate < 140) {
					background = "Orange";
				}
				else if (heartrate >= 140 && heartrate < 145) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 145 && heartrate < 170) {
					color = "white";
					background = "green";
				}

				else if (heartrate >= 170 && heartrate < 175) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 175 && heartrate < 180) {
					background = "Yellow";
				}
				else if (heartrate >= 180 && heartrate < 185) {
					background = "Orange";
				}
				else if (heartrate >= 185 && heartrate < 200) {
					background = "Red";
				}

			}


			if (userage >= 60 && userage < 61) {
				if (heartrate >= 127 && heartrate < 131) {
					background = "Yellow";
				}
				else if (heartrate >= 131 && heartrate < 139) {
					background = "Orange";
				}
				else if (heartrate >= 139 && heartrate < 144) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 144 && heartrate < 169) {
					color = "white";
					background = "green";
				}

				else if (heartrate >= 169 && heartrate < 174) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 174 && heartrate < 179) {
					background = "Yellow";
				}
				else if (heartrate >= 179 && heartrate < 184) {
					background = "Orange";
				}
				else if (heartrate >= 184 && heartrate < 200) {
					background = "Red";
				}

			}

			if (userage >= 61 && userage < 62) {
				if (heartrate >= 127 && heartrate < 130) {
					background = "Yellow";
				}
				else if (heartrate >= 130 && heartrate < 138) {
					background = "Orange";
				}
				else if (heartrate >= 138 && heartrate < 143) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 143 && heartrate < 168) {
					color = "white";
					background = "green";
				}

				else if (heartrate >= 168 && heartrate < 173) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 173 && heartrate < 178) {
					background = "Yellow";
				}
				else if (heartrate >= 178 && heartrate < 183) {
					background = "Orange";
				}
				else if (heartrate >= 183 && heartrate < 200) {
					background = "Red";
				}

			}

			if (userage >= 63 && userage < 64) {
				if (heartrate >= 128 && heartrate < 136) {
					background = "Orange";
				}
				else if (heartrate >= 136 && heartrate < 141) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 141 && heartrate < 166) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 166 && heartrate < 171) {
					background = "#32CD32";
					color = "white";
				}

				else if (heartrate >= 171 && heartrate < 176) {
					background = "Yellow";
				}
				else if (heartrate >= 176 && heartrate < 181) {
					background = "Orange";
				}
				else if (heartrate >= 181 && heartrate < 200) {
					background = "Red";
				}

			}

			if (userage >= 64 && userage < 65) {
				if (heartrate >= 128 && heartrate < 135) {
					background = "Orange";
				}
				else if (heartrate >= 135 && heartrate < 140) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 140 && heartrate < 165) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 165 && heartrate < 170) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 170 && heartrate < 175) {
					background = "Yellow";
				}
				else if (heartrate >= 175 && heartrate < 180) {
					background = "Orange";
				}
				else if (heartrate >= 180 && heartrate < 200) {
					background = "Red";
				}
			}

			if (userage >= 65 && userage < 66) {
				if (heartrate >= 128 && heartrate < 134) {
					background = "Orange";
				}
				else if (heartrate >= 134 && heartrate < 139) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 139 && heartrate < 164) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 164 && heartrate < 169) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 169 && heartrate < 174) {
					background = "Yellow";
				}
				else if (heartrate >= 174 && heartrate < 179) {
					background = "Orange";
				}
				else if (heartrate >= 179 && heartrate < 200) {
					background = "Red";
				}
			}


			if (userage >= 66 && userage < 67) {
				if (heartrate >= 128 && heartrate < 133) {
					background = "Orange";
				}
				else if (heartrate >= 133 && heartrate < 138) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 138 && heartrate < 163) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 163 && heartrate < 168) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 168 && heartrate < 173) {
					background = "Yellow";
				}
				else if (heartrate >= 173 && heartrate < 178) {
					background = "Orange";
				}
				else if (heartrate >= 178 && heartrate < 200) {
					background = "Red";
				}
			}

			if (userage >= 67 && userage < 68) {
				if (heartrate >= 128 && heartrate < 132) {
					background = "Orange";
				}
				else if (heartrate >= 132 && heartrate < 137) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 137 && heartrate < 162) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 162 && heartrate < 167) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 167 && heartrate < 172) {
					background = "Yellow";
				}
				else if (heartrate >= 172 && heartrate < 177) {
					background = "Orange";
				}
				else if (heartrate >= 177 && heartrate < 200) {
					background = "Red";
				}
			}

			if (userage >= 68 && userage < 69) {
				if (heartrate >= 128 && heartrate < 131) {
					background = "Orange";
				}
				else if (heartrate >= 131 && heartrate < 136) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 136 && heartrate < 161) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 161 && heartrate < 166) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 166 && heartrate < 171) {
					background = "Yellow";
				}
				else if (heartrate >= 171 && heartrate < 176) {
					background = "Orange";
				}
				else if (heartrate >= 176 && heartrate < 200) {
					background = "Red";
				}
			}

			if (userage >= 69 && userage < 70) {
				if (heartrate >= 128 && heartrate < 130) {
					background = "Orange";
				}
				else if (heartrate >= 130 && heartrate < 135) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 135 && heartrate < 160) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 160 && heartrate < 165) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 165 && heartrate < 170) {
					background = "Yellow";
				}
				else if (heartrate >= 170 && heartrate < 175) {
					background = "Orange";
				}
				else if (heartrate >= 175 && heartrate < 200) {
					background = "Red";
				}
			}

			if (userage >= 70 && userage < 71) {
				if (heartrate >= 129 && heartrate < 134) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 134 && heartrate < 159) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 159 && heartrate < 164) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 164 && heartrate < 169) {
					background = "Yellow";
				}
				else if (heartrate >= 169 && heartrate < 174) {
					background = "Orange";
				}
				else if (heartrate >= 174 && heartrate < 200) {
					background = "Red";
				}

			}

			if (userage >= 71 && userage < 72) {
				if (heartrate >= 129 && heartrate < 133) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 133 && heartrate < 158) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 158 && heartrate < 163) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 163 && heartrate < 168) {
					background = "Yellow";
				}
				else if (heartrate >= 168 && heartrate < 173) {
					background = "Orange";
				}
				else if (heartrate >= 173 && heartrate < 200) {
					background = "Red";
				}

			}

			if (userage >= 72 && userage < 73) {
				if (heartrate >= 129 && heartrate < 132) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 132 && heartrate < 157) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 157 && heartrate < 162) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 162 && heartrate < 167) {
					background = "Yellow";
				}
				else if (heartrate >= 167 && heartrate < 172) {
					background = "Orange";
				}
				else if (heartrate >= 172 && heartrate < 200) {
					background = "Red";
				}

			}

			if (userage >= 73 && userage < 74) {
				if (heartrate >= 129 && heartrate < 131) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 131 && heartrate < 156) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 156 && heartrate < 161) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 161 && heartrate < 166) {
					background = "Yellow";
				}
				else if (heartrate >= 168 && heartrate < 171) {
					background = "Orange";
				}
				else if (heartrate >= 171 && heartrate < 200) {
					background = "Red";
				}

			}
			if (userage >= 75 && userage < 76) {
				if (heartrate >= 130 && heartrate < 154) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 154 && heartrate < 159) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 159 && heartrate < 164) {
					background = "Yellow";
				}
				else if (heartrate >= 164 && heartrate < 169) {
					background = "Orange";
				}
				else if (heartrate >= 169 && heartrate < 200) {
					background = "Red";
				}
			}
			if (userage >= 76 && userage < 77) {
				if (heartrate >= 130 && heartrate < 153) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 153 && heartrate < 158) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 158 && heartrate < 163) {
					background = "Yellow";
				}
				else if (heartrate >= 163 && heartrate < 168) {
					background = "Orange";
				}
				else if (heartrate >= 168 && heartrate < 200) {
					background = "Red";
				}
			}
			if (userage >= 77 && userage < 78) {
				if (heartrate >= 130 && heartrate < 152) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 152 && heartrate < 157) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 157 && heartrate < 162) {
					background = "Yellow";
				}
				else if (heartrate >= 162 && heartrate < 167) {
					background = "Orange";
				}
				else if (heartrate >= 167 && heartrate < 200) {
					background = "Red";
				}
			}

			if (userage >= 78 && userage < 79) {
				if (heartrate >= 130 && heartrate < 151) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 151 && heartrate < 156) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 156 && heartrate < 161) {
					background = "Yellow";
				}
				else if (heartrate >= 161 && heartrate < 166) {
					background = "Orange";
				}
				else if (heartrate >= 166 && heartrate < 200) {
					background = "Red";
				}
			}

			if (userage >= 79 && userage < 80) {
				if (heartrate >= 130 && heartrate < 150) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 150 && heartrate < 155) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 155 && heartrate < 160) {
					background = "Yellow";
				}
				else if (heartrate >= 160 && heartrate < 165) {
					background = "Orange";
				}
				else if (heartrate >= 165 && heartrate < 200) {
					background = "Red";
				}
			}
			if (userage >= 80 && userage < 81) {
				if (heartrate >= 105 && heartrate < 109) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 109 && heartrate < 125) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 125 && heartrate < 126) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 127 && heartrate < 129) {
					background = "Orange";
				}
				else if (heartrate >= 130 && heartrate < 149) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 149 && heartrate < 154) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 154 && heartrate < 159) {
					background = "Yellow";
				}
				else if (heartrate >= 159 && heartrate < 164) {
					background = "Orange";
				}
				else if (heartrate >= 164 && heartrate < 200) {
					background = "Red";
				}
			}

			if (userage >= 81 && userage < 82) {
				if (heartrate >= 105 && heartrate < 109) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 109 && heartrate < 124) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 124 && heartrate < 125) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 125 && heartrate < 126) {
					background = "Yellow";
				}
				else if (heartrate >= 126 && heartrate < 129) {
					background = "Orange";
				}
				else if (heartrate >= 130 && heartrate < 148) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 148 && heartrate < 153) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 153 && heartrate < 158) {
					background = "Yellow";
				}
				else if (heartrate >= 158 && heartrate < 163) {
					background = "Orange";
				}
				else if (heartrate >= 163 && heartrate < 200) {
					background = "Red";
				}
			}

			if (userage >= 82 && userage < 83) {
				if (heartrate >= 105 && heartrate < 109) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 109 && heartrate < 123) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 123 && heartrate < 124) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 124 && heartrate < 125) {
					background = "Yellow";
				}
				else if (heartrate >= 125 && heartrate < 129) {
					background = "Orange";
				}
				else if (heartrate >= 130 && heartrate < 147) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 147 && heartrate < 152) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 152 && heartrate < 157) {
					background = "Yellow";
				}
				else if (heartrate >= 157 && heartrate < 162) {
					background = "Orange";
				}
				else if (heartrate >= 162 && heartrate < 200) {
					background = "Red";
				}
			}

			if (userage >= 83 && userage < 84) {
				if (heartrate >= 105 && heartrate < 108) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 108 && heartrate < 122) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 122 && heartrate < 123) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 123 && heartrate < 124) {
					background = "Yellow";
				}
				else if (heartrate >= 124 && heartrate < 129) {
					background = "Orange";
				}
				else if (heartrate >= 130 && heartrate < 146) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 146 && heartrate < 151) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 151 && heartrate < 156) {
					background = "Yellow";
				}
				else if (heartrate >= 156 && heartrate < 161) {
					background = "Orange";
				}
				else if (heartrate >= 161 && heartrate < 200) {
					background = "Red";
				}
			}

			if (userage >= 84 && userage < 85) {
				if (heartrate >= 105 && heartrate < 108) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 108 && heartrate < 121) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 121 && heartrate < 122) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 122 && heartrate < 123) {
					background = "Yellow";
				}
				else if (heartrate >= 123 && heartrate < 129) {
					background = "Orange";
				}
				else if (heartrate >= 130 && heartrate < 145) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 145 && heartrate < 150) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 150 && heartrate < 155) {
					background = "Yellow";
				}
				else if (heartrate >= 155 && heartrate < 160) {
					background = "Orange";
				}
				else if (heartrate >= 160 && heartrate < 200) {
					background = "Red";
				}
			}

			if (userage >= 85 && userage < 86) {
				if (heartrate >= 105 && heartrate < 108) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 108 && heartrate < 120) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 120 && heartrate < 121) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 121 && heartrate < 122) {
					background = "Yellow";
				}
				else if (heartrate >= 122 && heartrate < 129) {
					background = "Orange";
				}
				else if (heartrate >= 130 && heartrate < 144) {
					background = "green";
				}
				else if (heartrate >= 144 && heartrate < 149) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 149 && heartrate < 154) {
					background = "Yellow";
				}
				else if (heartrate >= 154 && heartrate < 159) {
					background = "Orange";
				}
				else if (heartrate >= 159 && heartrate < 200) {
					background = "Red";
				}
			}

			if (userage >= 86 && userage < 87) {
				if (heartrate >= 105 && heartrate < 107) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 107 && heartrate < 119) {
					background = "green";
				}
				else if (heartrate >= 119 && heartrate < 120) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 120 && heartrate < 121) {
					background = "Yellow";
				}
				else if (heartrate >= 121 && heartrate < 129) {
					background = "Orange";
				}
				else if (heartrate >= 130 && heartrate < 143) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 143 && heartrate < 148) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 148 && heartrate < 153) {
					background = "Yellow";
				}
				else if (heartrate >= 153 && heartrate < 158) {
					background = "Orange";
				}
				else if (heartrate >= 158 && heartrate < 200) {
					background = "Red";
				}
			}

			if (userage >= 87 && userage < 88) {
				if (heartrate >= 105 && heartrate < 107) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 107 && heartrate < 118) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 118 && heartrate < 119) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 119 && heartrate < 120) {
					background = "Yellow";
				}
				else if (heartrate >= 120 && heartrate < 128) {
					background = "Orange";
				}
				else if (heartrate >= 130 && heartrate < 142) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 142 && heartrate < 147) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 147 && heartrate < 152) {
					background = "Yellow";
				}
				else if (heartrate >= 152 && heartrate < 157) {
					background = "Orange";
				}
				else if (heartrate >= 157 && heartrate < 200) {
					background = "Red";
				}
			}

			if (userage >= 88 && userage < 89) {
				if (heartrate >= 105 && heartrate < 107) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 107 && heartrate < 117) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 117 && heartrate < 118) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 118 && heartrate < 119) {
					background = "Yellow";
				}
				else if (heartrate >= 119 && heartrate < 127) {
					background = "Orange";
				}
				else if (heartrate >= 130 && heartrate < 141) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 141 && heartrate < 146) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 146 && heartrate < 151) {
					background = "Yellow";
				}
				else if (heartrate >= 151 && heartrate < 156) {
					background = "Orange";
				}
				else if (heartrate >= 156 && heartrate < 200) {
					background = "Red";
				}
			}

			if (userage >= 89 && userage < 90) {
				if (heartrate >= 105 && heartrate < 106) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 106 && heartrate < 116) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 116 && heartrate < 117) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 117 && heartrate < 118) {
					background = "Yellow";
				}
				else if (heartrate >= 118 && heartrate < 126) {
					background = "Orange";
				}
				else if (heartrate >= 130 && heartrate < 140) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 140 && heartrate < 145) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 145 && heartrate < 150) {
					background = "Yellow";
				}
				else if (heartrate >= 150 && heartrate < 155) {
					background = "Orange";
				}
				else if (heartrate >= 155 && heartrate < 200) {
					background = "Red";
				}
			}
			if (userage >= 90 && userage < 91) {
				if (heartrate >= 105 && heartrate < 106) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 106 && heartrate < 115) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 115 && heartrate < 116) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 116 && heartrate < 117) {
					background = "Yellow";
				}
				else if (heartrate >= 117 && heartrate < 125) {
					background = "Orange";
				}
				else if (heartrate >= 130 && heartrate < 139) {
					background = "green";
				}
				else if (heartrate >= 139 && heartrate < 144) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 144 && heartrate < 149) {
					background = "Yellow";
				}
				else if (heartrate >= 149 && heartrate < 154) {
					background = "Orange";
				}
				else if (heartrate >= 154 && heartrate < 200) {
					background = "Red";
				}
			}

			if (userage >= 41 && userage < 42) {
				if (heartrate >= 0 && heartrate < 109) {
					background = "Red";
				}
				else if (heartrate >= 109 && heartrate < 110) {
					background = "Yellow";
				}
				else if (heartrate >= 110 && heartrate < 124) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 124 && heartrate < 140) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 140 && heartrate < 144) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 145 && heartrate < 150) {
					background = "Yellow";
				}
				else if (heartrate >= 150 && heartrate < 158) {
					background = "Orange";
				}
				else if (heartrate >= 158 && heartrate < 161) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 161 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}


			if (userage >= 42 && userage < 43) {
				if (heartrate >= 0 && heartrate < 108) {
					background = "Red";
				}
				else if (heartrate >= 108 && heartrate < 109) {
					background = "Yellow";
				}
				else if (heartrate >= 109 && heartrate < 123) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 123 && heartrate < 139) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 139 && heartrate < 143) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 143 && heartrate < 149) {
					background = "Yellow";
				}
				else if (heartrate >= 149 && heartrate < 157) {
					background = "Orange";
				}
				else if (heartrate >= 157 && heartrate < 160) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 160 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}

			if (userage >= 43 && userage < 44) {
				if (heartrate >= 0 && heartrate < 107) {
					background = "Red";
				}
				else if (heartrate >= 107 && heartrate < 108) {
					background = "Yellow";
				}
				else if (heartrate >= 108 && heartrate < 122) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 122 && heartrate < 138) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 138 && heartrate < 143) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 143 && heartrate < 148) {
					background = "Yellow";
				}
				else if (heartrate >= 148 && heartrate < 156) {
					background = "Orange";
				}
				else if (heartrate >= 156 && heartrate < 159) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 159 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}

			if (userage >= 44 && userage < 45) {
				if (heartrate >= 0 && heartrate < 106) {
					background = "Red";
				}
				else if (heartrate >= 106 && heartrate < 107) {
					background = "Yellow";
				}
				else if (heartrate >= 107 && heartrate < 121) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 121 && heartrate < 137) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 137 && heartrate < 142) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 142 && heartrate < 147) {
					background = "Yellow";
				}
				else if (heartrate >= 147 && heartrate < 155) {
					background = "Orange";
				}
				else if (heartrate >= 155 && heartrate < 158) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 158 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}
			if (userage >= 45 && userage < 46) {
				if (heartrate >= 0 && heartrate < 105) {
					background = "Red";
				}
				else if (heartrate >= 105 && heartrate < 106) {
					background = "Yellow";
				}
				else if (heartrate >= 106 && heartrate < 120) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 120 && heartrate < 136) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 136 && heartrate < 141) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 141 && heartrate < 146) {
					background = "Yellow";
				}
				else if (heartrate >= 146 && heartrate < 154) {
					background = "Orange";
				}
				else if (heartrate >= 154 && heartrate < 157) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 157 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}

			if (userage >= 46 && userage < 47) {
				if (heartrate >= 0 && heartrate < 104) {
					background = "Red";
				}
				else if (heartrate >= 104 && heartrate < 105) {
					background = "Yellow";
				}
				else if (heartrate >= 105 && heartrate < 119) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 119 && heartrate < 135) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 135 && heartrate < 140) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 140 && heartrate < 145) {
					background = "Yellow";
				}
				else if (heartrate >= 145 && heartrate < 153) {
					background = "Orange";
				}
				else if (heartrate >= 153 && heartrate < 156) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 156 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}
			if (userage >= 47 && userage < 48) {
				if (heartrate >= 0 && heartrate < 103) {
					background = "Red";
				}
				else if (heartrate >= 103 && heartrate < 104) {
					background = "Yellow";
				}
				else if (heartrate >= 104 && heartrate < 118) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 118 && heartrate < 134) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 134 && heartrate < 139) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 139 && heartrate < 144) {
					background = "Yellow";
				}
				else if (heartrate >= 144 && heartrate < 152) {
					background = "Orange";
				}
				else if (heartrate >= 152 && heartrate < 155) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 155 && heartrate < 179) {
					color = "white";
					background = "green";
				}

			}
			if (userage >= 91 && userage < 92) {
				if (heartrate >= 0 && heartrate < 100) {
					background = "Red";
				}
				else if (heartrate >= 100 && heartrate < 104) {
					background = "Yellow";
				}
				else if (heartrate >= 104 && heartrate < 106) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 106 && heartrate < 114) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 114 && heartrate < 115) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 115 && heartrate < 116) {
					background = "Yellow";
				}
				else if (heartrate >= 116 && heartrate < 129) {
					background = "Orange";
				}
				else if (heartrate >= 130 && heartrate < 138) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 138 && heartrate < 143) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 143 && heartrate < 148) {
					background = "Yellow";
				}
				else if (heartrate >= 148 && heartrate < 153) {
					background = "Orange";
				}
				else if (heartrate >= 153 && heartrate < 200) {
					background = "Red";
				}

			}
			if (userage >= 92 && userage < 93) {
				if (heartrate >= 0 && heartrate < 99) {
					background = "Red";
				}
				else if (heartrate >= 99 && heartrate < 103) {
					background = "Yellow";
				}
				else if (heartrate >= 103 && heartrate < 105) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 105 && heartrate < 113) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 113 && heartrate < 114) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 114 && heartrate < 115) {
					background = "Yellow";
				}
				else if (heartrate >= 115 && heartrate < 129) {
					background = "Orange";
				}
				else if (heartrate >= 130 && heartrate < 137) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 137 && heartrate < 142) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 142 && heartrate < 147) {
					background = "Yellow";
				}
				else if (heartrate >= 147 && heartrate < 152) {
					background = "Orange";
				}
				else if (heartrate >= 152 && heartrate < 200) {
					background = "Red";
				}

			}

			if (userage >= 93 && userage < 94) {
				if (heartrate >= 0 && heartrate < 98) {
					background = "Red";
				}
				else if (heartrate >= 98 && heartrate < 102) {
					background = "Yellow";
				}
				else if (heartrate >= 102 && heartrate < 104) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 104 && heartrate < 112) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 112 && heartrate < 113) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 113 && heartrate < 114) {
					background = "Yellow";
				}
				else if (heartrate >= 114 && heartrate < 129) {
					background = "Orange";
				}
				else if (heartrate >= 130 && heartrate < 136) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 136 && heartrate < 141) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 141 && heartrate < 146) {
					background = "Yellow";
				}
				else if (heartrate >= 146 && heartrate < 151) {
					background = "Orange";
				}
				else if (heartrate >= 151 && heartrate < 200) {
					background = "Red";
				}

			}


			if (userage >= 94 && userage < 95) {
				if (heartrate >= 0 && heartrate < 97) {
					background = "Red";
				}
				else if (heartrate >= 97 && heartrate < 101) {
					background = "Yellow";
				}
				else if (heartrate >= 101 && heartrate < 103) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 103 && heartrate < 111) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 111 && heartrate < 112) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 112 && heartrate < 113) {
					background = "Yellow";
				}
				else if (heartrate >= 113 && heartrate < 129) {
					background = "Orange";
				}
				else if (heartrate >= 130 && heartrate < 135) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 135 && heartrate < 140) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 140 && heartrate < 145) {
					background = "Yellow";
				}
				else if (heartrate >= 145 && heartrate < 150) {
					background = "Orange";
				}
				else if (heartrate >= 150 && heartrate < 200) {
					background = "Red";
				}

			}

			if (userage >= 95 && userage < 96) {
				if (heartrate >= 0 && heartrate < 96) {
					background = "Red";
				}
				else if (heartrate >= 96 && heartrate < 100) {
					background = "Yellow";
				}
				else if (heartrate >= 100 && heartrate < 102) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 102 && heartrate < 110) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 110 && heartrate < 111) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 111 && heartrate < 112) {
					background = "Yellow";
				}
				else if (heartrate >= 112 && heartrate < 129) {
					background = "Orange";
				}
				else if (heartrate >= 130 && heartrate < 134) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 134 && heartrate < 139) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 139 && heartrate < 144) {
					background = "Yellow";
				}
				else if (heartrate >= 144 && heartrate < 149) {
					background = "Orange";
				}
				else if (heartrate >= 149 && heartrate < 200) {
					background = "Red";
				}

			}

			if (userage >= 96 && userage < 97) {
				if (heartrate >= 0 && heartrate < 95) {
					background = "Red";
				}
				else if (heartrate >= 95 && heartrate < 99) {
					background = "Yellow";
				}
				else if (heartrate >= 99 && heartrate < 101) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 101 && heartrate < 109) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 109 && heartrate < 110) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 110 && heartrate < 111) {
					background = "Yellow";
				}
				else if (heartrate >= 111 && heartrate < 129) {
					background = "Orange";
				}
				else if (heartrate >= 130 && heartrate < 133) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 133 && heartrate < 138) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 138 && heartrate < 143) {
					background = "Yellow";
				}
				else if (heartrate >= 143 && heartrate < 148) {
					background = "Orange";
				}
				else if (heartrate >= 148 && heartrate < 200) {
					background = "Red";
				}

			}

			if (userage >= 97 && userage < 98) {
				if (heartrate >= 0 && heartrate < 94) {
					background = "Red";
				}
				else if (heartrate >= 94 && heartrate < 98) {
					background = "Yellow";
				}
				else if (heartrate >= 98 && heartrate < 100) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 100 && heartrate < 108) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 108 && heartrate < 109) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 109 && heartrate < 110) {
					background = "Yellow";
				}
				else if (heartrate >= 110 && heartrate < 129) {
					background = "Orange";
				}
				else if (heartrate >= 130 && heartrate < 132) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 132 && heartrate < 137) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 137 && heartrate < 142) {
					background = "Yellow";
				}
				else if (heartrate >= 142 && heartrate < 147) {
					background = "Orange";
				}
				else if (heartrate >= 147 && heartrate < 200) {
					background = "Red";
				}

			}

			if (userage >= 98 && userage < 99) {
				if (heartrate >= 0 && heartrate < 93) {
					background = "Red";
				}
				else if (heartrate >= 93 && heartrate < 97) {
					background = "Yellow";
				}
				else if (heartrate >= 97 && heartrate < 99) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 99 && heartrate < 107) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 107 && heartrate < 108) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 108 && heartrate < 109) {
					background = "Yellow";
				}
				else if (heartrate >= 109 && heartrate < 129) {
					background = "Orange";
				}
				else if (heartrate >= 131 && heartrate < 136) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 136 && heartrate < 141) {
					background = "Yellow";
				}
				else if (heartrate >= 141 && heartrate < 146) {
					background = "Orange";
				}
				else if (heartrate >= 146 && heartrate < 200) {
					background = "Red";
				}


			}

			if (userage >= 99 && userage < 100) {
				if (heartrate >= 0 && heartrate < 92) {
					background = "Red";
				}
				else if (heartrate >= 92 && heartrate < 96) {
					background = "Yellow";
				}
				else if (heartrate >= 96 && heartrate < 98) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 98 && heartrate < 106) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 106 && heartrate < 107) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 107 && heartrate < 108) {
					background = "Yellow";
				}
				else if (heartrate >= 108 && heartrate < 129) {
					background = "Orange";
				}
				else if (heartrate >= 131 && heartrate < 135) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 135 && heartrate < 140) {
					background = "Yellow";
				}
				else if (heartrate >= 140 && heartrate < 145) {
					background = "Orange";
				}
				else if (heartrate >= 145 && heartrate < 200) {
					background = "Red";
				}


			}
			if (userage >= 100 && userage < 101) {
				if (heartrate >= 0 && heartrate < 91) {
					background = "Red";
				}
				else if (heartrate >= 91 && heartrate < 95) {
					background = "Yellow";
				}
				else if (heartrate >= 95 && heartrate < 97) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 97 && heartrate < 105) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 105 && heartrate < 106) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 106 && heartrate < 107) {
					background = "Yellow";
				}
				else if (heartrate >= 107 && heartrate < 129) {
					background = "Orange";
				}
				else if (heartrate >= 131 && heartrate < 134) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 134 && heartrate < 139) {
					background = "Yellow";
				}
				else if (heartrate >= 139 && heartrate < 144) {
					background = "Orange";
				}
				else if (heartrate >= 144 && heartrate < 200) {
					background = "Red";
				}
			}

			if (userage >= 100 && userage < 101) {
				if (heartrate >= 0 && heartrate < 90) {
					background = "Red";
				}
				else if (heartrate >= 90 && heartrate < 94) {
					background = "Yellow";
				}
				else if (heartrate >= 94 && heartrate < 97) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 97 && heartrate < 104) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 104 && heartrate < 105) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 105 && heartrate < 106) {
					background = "Yellow";
				}
				else if (heartrate >= 106 && heartrate < 128) {
					background = "Orange";
				}
				else if (heartrate >= 128 && heartrate < 129) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 129 && heartrate < 130) {
					color = "white";
					background = "green";
				}
				else if (heartrate >= 130 && heartrate < 133) {
					background = "#32CD32";
					color = "white";
				}
				else if (heartrate >= 133 && heartrate < 138) {
					background = "Yellow";
				}
				else if (heartrate >= 138 && heartrate < 143) {
					background = "Orange";
				}
				else if (heartrate >= 143 && heartrate < 200) {
					background = "Red";
				}

			}

			if (userage >= 74 && userage < 101) {
				if (heartrate >= 129 && heartrate < 130) {
					background = "#32CD32";
					color = "white";
				}
			}

			if (userage >= 98 && userage < 101) {
				if (heartrate >= 130 && heartrate < 131) {
					color = "white";
					background = "green";
				}
			}
		}
		return [background, color];
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
		if (score == "No workout") {
			return (
				<Card className="card_style" style={{ backgroundColor: '', color: '' }}>
					<CardBody>
						<CardTitle className="header_style">{'Time in Aerobic Zone (' + lower_aerobic_zone + ' - ' + higher_aerobic_zone + ')'}
						</CardTitle>
						<CardText className="value_style">{score}</CardText>
					</CardBody>
				</Card>
			);
		}
		else {
			return (
				<Card className="card_style" >
					<CardBody style={{ backgroundColor: avgheartratecolor[0], color: avgheartratecolor[1] }}>
						<CardTitle className="header_style">{'Time in Aerobic Zone (' + lower_aerobic_zone + ' - ' + higher_aerobic_zone + ')'}</CardTitle>
						<CardText className="value_style">{score}{' '}{'(' + aerobicPrcnt + '%' + ')'}</CardText>
					</CardBody>
				</Card>
			);
		}
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
		if (score == "No workout") {
			return (
				<Card className="card_style">
					<CardBody>
						<CardTitle className="header_style">{'Time in Anaerobic Zone (' + anerobic_zone + ' or above)'}</CardTitle>
						<CardText className="value_style">{score}</CardText>
					</CardBody>
				</Card>
			);
		}
		else {
			return (
				<Card className="card_style">
					<CardBody style={{ backgroundColor: avgheartratecolor[0], color: avgheartratecolor[1] }}>
						<CardTitle className="header_style">{'Time in Anaerobic Zone (' + anerobic_zone + ' or above)'}</CardTitle>
						<CardText className="value_style">{score}{' '}{'(' + anerobicPrcnt + '%' + ')'}</CardText>
					</CardBody>
				</Card>
			);
		}
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
		if (score == "No workout") {
			return (

				<Card className="card_style" id="my-card">
					<CardBody>
						<CardTitle className="header_style">{'Time in below Aerobic Zone (below ' + below_aerobic_zone + ')'}</CardTitle>
						<CardText className="value_style">{score}</CardText>
					</CardBody>
				</Card>

			);
		}
		else {
			return (
				<Card className="card_style" id="my-card">
					<CardBody style={{ backgroundColor: avgheartratecolor[0], color: avgheartratecolor[1] }}>
						<CardTitle className="header_style">{'Time in below Aerobic Zone (below ' + below_aerobic_zone + ')'}</CardTitle>
						<CardText className="value_style">{score}{' '}{'(' + belowAerobicPrcnt + '%' + ')'}</CardText>
					</CardBody>
				</Card>
			);
		}
	}

	heartRateNotRecordedTimeZone(value, durationdate) {
		let workout_duration_hours_min_score = this.renderValue(value.workout_duration_hours_min, durationdate);
		let score = this.aaExercisestats(this.renderValue(value.hr_not_recorded_duration_hour_min, durationdate), workout_duration_hours_min_score);
		let hrr_not_recorded_prcnt = this.aaExercisestatsPrct(this.renderValue(value.prcnt_hr_not_recorded_duration, durationdate));
		if (score == "No workout") {
			return (
				<Card className="card_style">
					<CardBody>
						<CardTitle className="header_style">Heart Rate Not Recorded</CardTitle>
						<CardText className="value_style">{score}</CardText>
					</CardBody>
				</Card>
			);
		}
		else {
			return (
				<Card className="card_style">
					<CardBody>
						<CardTitle className="header_style">Heart Rate Not Recorded</CardTitle>
						<CardText className="value_style">{score}{' '}{'(' + hrr_not_recorded_prcnt + '%' + ')'}</CardText>
					</CardBody>
				</Card>
			);
		}
	}

	totalworkoutdurationTimeZone(value, durationdate) {
		let score = this.renderValue(value.workout_duration_hours_min, durationdate);
		if (score == undefined || score == 0 || score == "" || score == "00:00" || score == null) {
			score = "No workout";
		}
		else {
			score = score;
		}
		if (isNaN(score)) {
			return (
				<Card className="card_style">
					<CardBody>
						<CardTitle className="header_style">Total Workout Duration </CardTitle>
						<CardText className="value_style">{score}</CardText>
					</CardBody>
				</Card>
			);
		}
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
		if (timezonesData == undefined) return null
		timezonesData = timezonesData[0]
		let sequences = Object.keys(timezonesData)
		// console.log(sequences)
		let lastSequence = sequences[sequences.length - 1]
		let lastTimeZone = timezonesData[lastSequence]
		console.log(lastTimeZone)
		sequences.map((timezone) => {
			let currentTimeZone = timezonesData[timezone]
			if (count % 4 == 0) {
				rows.push(<tr>{columns}</tr>)
				columns = []
			}
			count++
			columns.push(
				<td className="value_style" style={{ 'backgroundColor': currentTimeZone["color"], 'color': currentTimeZone['color'] == "green" ? 'white' : 'black' }}>
					{currentTimeZone['range']}<br />&nbsp;
					{this.secondsToHourMinute(currentTimeZone['duration'])}&nbsp;({currentTimeZone['percent']}%)
				</td>)
		})
		let table = <div className="content-justify-center p-2" style={{ 'overflow': 'hidden' }}>
			<h2 className="bg-info text-white">Duration In Zones (hh:mm)(%time in zone)</h2>
			<table className="table table-responsive timezone_duration" > <tbody>{rows}</tbody></table>
			<h3 className="bg-danger text-white">>>&nbsp;{lastTimeZone['range']}&nbsp;{this.secondsToHourMinute(lastTimeZone['duration'])}&nbsp;({lastTimeZone['percent']}%)
			</h3>
		</div>
		return table

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
					<div className="col-md-6 table_margin">
						<span>{this.aerobicTimeZone(this.state.summary.exercise, this.state.selected_range)}</span>
					</div>
					<div className="col-md-6 table_margin">
						<span>{this.anerobicTimeZone(this.state.summary.exercise, this.state.selected_range)}</span>
					</div>
				</div>



				<div className="row justify-content-center md_padding">
					<div className="col-md-6 table_margin">
						<span>{this.belowAerobicTimeZone(this.state.summary.exercise, this.state.selected_range)}</span>
					</div>
					<div className="col-md-6 table_margin">
						<span>{this.heartRateNotRecordedTimeZone(this.state.summary.exercise, this.state.selected_range)}</span>
					</div>
				</div>
				<div className="row justify-content-center md_padding">
					<div className="col-md-6 table_margin">
						<span>{this.totalworkoutdurationTimeZone(this.state.summary.exercise, this.state.selected_range)}</span>
					</div>
				</div>

				<div style={{ "textAlign": "center" }} className="row mt-5 mb-5 justify-content-center">{/* Duration in Time zones table */}
					{this.renderDurationInTimeZones()}
				</div >
				{this.renderProgressFetchOverlay()}
				{this.renderProgress2FetchOverlay()}
				{this.renderProgress3FetchOverlay()}
				{this.renderProgressSelectedDateFetchOverlay()}
			</div>
		);
	}
}
export default Aadashboard;

{/*<span className = "paweekdate"><span>{this.state.capt}</span><span>{" " + this.state.date + ""}</span></span>*/ }
{/*<span className = "weekdate" style={{marginLeft:"300px",marginRight:"auto"}}><span>{this.state.capt}</span><span>{" (" + this.state.date + ")"}{this.state.numberOfDays && <span>{" - " + "Total Days: " +this.state.numberOfDays}</span>}</span></span>*/ }
