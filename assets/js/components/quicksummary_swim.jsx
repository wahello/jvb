import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Table,Button} from "reactstrap";

const Swim = (props) =>{
	return(
					 <div className="quick3">
			         <Table className="quick4">
                           
				         <th>
						  <h4>Swim Stats</h4>
						</th>
						 <th><h4>19-09-2017</h4></th>
							<th><h4>20-09-2017</h4></th>
							<th><h4>21-09-2017</h4></th>
							<th><h4>22-09-2017</h4></th>
							<th><h4>23-09-2017</h4></th>
							<th><h4>24-09-2017</h4></th>
							<th><h4>25-09-2017</h4></th>
						
						  <tr>
					        <td>Overall Truth Grade : </td>
				            <td>{props.data.sunday.swim_stats_ql.pace_per_100_yard}</td>
				            <td>{props.data.monday.swim_stats_ql.pace_per_100_yard}</td>
				            <td>{props.data.tuesday.swim_stats_ql.pace_per_100_yard}</td>
				            <td>{props.data.wednesday.swim_stats_ql.pace_per_100_yard}</td>
				            <td>{props.data.thursday.swim_stats_ql.pace_per_100_yard}</td>
				            <td>{props.data.friday.swim_stats_ql.pace_per_100_yard}</td>
				            <td>{props.data.saturday.swim_stats_ql.pace_per_100_yard}</td>
				         </tr>
				        <tr>
					        <td>Total Strokes : </td>
				            <td>{props.data.sunday.swim_stats_ql.total_strokes}</td>
				            <td>{props.data.monday.swim_stats_ql.total_strokes}</td>
				            <td>{props.data.tuesday.swim_stats_ql.total_strokes}</td>
				            <td>{props.data.wednesday.swim_stats_ql.total_strokes}</td>
				            <td>{props.data.thursday.swim_stats_ql.total_strokes}</td>
				            <td>{props.data.friday.swim_stats_ql.total_strokes}</td>
				            <td>{props.data.saturday.swim_stats_ql.total_strokes}</td>
				            </tr>
				         </Table>
                          </div>

		);
}
export default Swim;