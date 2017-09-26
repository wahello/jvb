import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Table,Button} from "reactstrap";

const Sleep = (props) =>{

	        return(
						  <div className="quick3">
                          <Table className="quick4">
                         
				         <tr>
				         <th>
						  <h4>Sleep</h4>
						  </th>
						   <th><h4>19-09-2017</h4></th>
							<th><h4>20-09-2017</h4></th>
							<th><h4>21-09-2017</h4></th>
							<th><h4>22-09-2017</h4></th>
							<th><h4>23-09-2017</h4></th>
							<th><h4>24-09-2017</h4></th>
							<th><h4>25-09-2017</h4></th>
						</tr>
					
						 <tr>
					        <td>Sleep Per Wearable : </td>
				           <td> {props.data.sunday.sleep_ql.sleep_per_wearable}</td>
				           <td> {props.data.monday.sleep_ql.sleep_per_wearable}</td>
				           <td> {props.data.tuesday.sleep_ql.sleep_per_wearable}</td>
				           <td> {props.data.wednesday.sleep_ql.sleep_per_wearable}</td>
				           <td> {props.data.thursday.sleep_ql.sleep_per_wearable}</td>
				           <td> {props.data.friday.sleep_ql.sleep_per_wearable}</td>
				           <td> {props.data.saturday.sleep_ql.sleep_per_wearable}</td>
				         </tr>
				         <tr>
					        <td>Sleep Per User Input : </td>
				           <td> {props.data.sunday.sleep_ql.sleep_per_user_input} </td>
				           <td> {props.data.monday.sleep_ql.sleep_per_user_input} </td>
				           <td> {props.data.tuesday.sleep_ql.sleep_per_user_input} </td>
				           <td> {props.data.wednesday.sleep_ql.sleep_per_user_input} </td>
				           <td> {props.data.thursday.sleep_ql.sleep_per_user_input} </td>
				           <td> {props.data.friday.sleep_ql.sleep_per_user_input} </td>
				           <td> {props.data.saturday.sleep_ql.sleep_per_user_input} </td>
				         </tr>
				         <tr>
					        <td>Sleep Aid : </td>
				           <td> {props.data.sunday.sleep_ql.sleep_aid}</td>
				           <td> {props.data.monday.sleep_ql.sleep_aid}</td>
				           <td> {props.data.tuesday.sleep_ql.sleep_aid}</td>
				           <td> {props.data.wednesday.sleep_ql.sleep_aid}</td>
				           <td> {props.data.thursday.sleep_ql.sleep_aid}</td>
				           <td> {props.data.friday.sleep_ql.sleep_aid}</td>
				           <td> {props.data.saturday.sleep_ql.sleep_aid}</td>
				         </tr>
				         <tr>
					        <td>Sleep Bed Time : </td>
				            <td>{props.data.sunday.sleep_ql.sleep_bed_time}</td>
				            <td>{props.data.monday.sleep_ql.sleep_bed_time}</td>
				            <td>{props.data.tuesday.sleep_ql.sleep_bed_time}</td>
				            <td>{props.data.wednesday.sleep_ql.sleep_bed_time}</td>
				            <td>{props.data.thursday.sleep_ql.sleep_bed_time}</td>
				            <td>{props.data.friday.sleep_ql.sleep_bed_time}</td>
				            <td>{props.data.saturday.sleep_ql.sleep_bed_time}</td>
				         </tr>
				         <tr>
					        <td>Sleep Awake Time : </td>
				            <td>{props.data.sunday.sleep_ql.sleep_awake_time}</td>
				            <td>{props.data.monday.sleep_ql.sleep_awake_time}</td>
				            <td>{props.data.tuesday.sleep_ql.sleep_awake_time}</td>
				            <td>{props.data.wednesday.sleep_ql.sleep_awake_time}</td>
				            <td>{props.data.thursday.sleep_ql.sleep_awake_time}</td>
				            <td>{props.data.friday.sleep_ql.sleep_awake_time}</td>
				            <td>{props.data.saturday.sleep_ql.sleep_awake_time}</td>
				         </tr>
				         
				         <tr>
					        <td>Deep Sleep : </td>
				            <td>{props.data.sunday.sleep_ql.deep_sleep}</td>
				            <td>{props.data.monday.sleep_ql.deep_sleep}</td>
				            <td>{props.data.tuesday.sleep_ql.deep_sleep}</td>
				            <td>{props.data.wednesday.sleep_ql.deep_sleep}</td>
				            <td>{props.data.thursday.sleep_ql.deep_sleep}</td>
				            <td>{props.data.friday.sleep_ql.deep_sleep}</td>
				            <td>{props.data.saturday.sleep_ql.deep_sleep}</td>
				         </tr>
				          <tr>
					        <td>Light Sleep : </td>
				            <td>{props.data.sunday.sleep_ql.light_sleep}</td>
				            <td>{props.data.monday.sleep_ql.light_sleep}</td>
				            <td>{props.data.tuesday.sleep_ql.light_sleep}</td>
				            <td>{props.data.wednesday.sleep_ql.light_sleep}</td>
				            <td>{props.data.thursday.sleep_ql.light_sleep}</td>
				            <td>{props.data.friday.sleep_ql.light_sleep}</td>
				            <td>{props.data.saturday.sleep_ql.light_sleep}</td>
				         </tr>
				          <tr>
					        <td>Awake Time : </td>
				            <td>{props.data.sunday.sleep_ql.awake_time}</td>
				            <td>{props.data.monday.sleep_ql.awake_time}</td>
				            <td>{props.data.tuesday.sleep_ql.awake_time}</td>
				            <td>{props.data.wednesday.sleep_ql.awake_time}</td>
				            <td>{props.data.thursday.sleep_ql.awake_time}</td>
				            <td>{props.data.friday.sleep_ql.awake_time}</td>
				            <td>{props.data.saturday.sleep_ql.awake_time}</td>
				         </tr>
                          </Table>
                          </div>

		);
}
export default Sleep;