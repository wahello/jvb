import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Table,Button} from "reactstrap";

const Bike = (props) => {
	return(
                          <div className="quick3">
                          <Table className="quick4">
                           
				        
				         <th className="quick8">
						  <h5>Bike Stats</h5>
						  </th>
						    <th className="quick8"><h5>{props.data.sunday.created_at}</h5></th>
							<th className="quick8"><h5>{props.data.monday.created_at}</h5></th>
							<th className="quick8"><h5>{props.data.tuesday.created_at}</h5></th>
							<th className="quick8"><h5>{props.data.wednesday.created_at}</h5></th>
							<th className="quick8"><h5>{props.data.thursday.created_at}</h5></th>
							<th className="quick8"><h5>{props.data.friday.created_at}</h5></th>
							<th className="quick8"><h5>{props.data.saturday.created_at}</h5></th>
						
					
						 <tr>
					        <td>Avg Speed</td>
				            <td>{props.data.sunday.bike_stats_ql.avg_speed}</td>
				            <td>{props.data.monday.bike_stats_ql.avg_speed}</td>
				            <td>{props.data.tuesday.bike_stats_ql.avg_speed}</td>
				            <td>{props.data.wednesday.bike_stats_ql.avg_speed}</td>
				            <td>{props.data.thursday.bike_stats_ql.avg_speed}</td>
				            <td>{props.data.friday.bike_stats_ql.avg_speed}</td>
				            <td>{props.data.saturday.bike_stats_ql.avg_speed}</td>
				         </tr>

				         <tr>
					        <td className="quick9">Avg Power</td>
				            <td>{props.data.sunday.bike_stats_ql.avg_power}</td>
				            <td>{props.data.monday.bike_stats_ql.avg_power}</td>
				            <td>{props.data.tuesday.bike_stats_ql.avg_power}</td>
				            <td>{props.data.wednesday.bike_stats_ql.avg_power}</td>
				            <td>{props.data.thursday.bike_stats_ql.avg_power}</td>
				            <td>{props.data.friday.bike_stats_ql.avg_power}</td>
				            <td>{props.data.saturday.bike_stats_ql.avg_power}</td>
				         </tr>
				         <tr>
					        <td>Asvg Speed Per Mile</td>
				            <td>{props.data.sunday.bike_stats_ql.avg_speed_per_mile}</td>
				            <td>{props.data.monday.bike_stats_ql.avg_speed_per_mile}</td>
				            <td>{props.data.tuesday.bike_stats_ql.avg_speed_per_mile}</td>
				            <td>{props.data.wednesday.bike_stats_ql.avg_speed_per_mile}</td>
				            <td>{props.data.thursday.bike_stats_ql.avg_speed_per_mile}</td>
				            <td>{props.data.friday.bike_stats_ql.avg_speed_per_mile}</td>
				            <td>{props.data.saturday.bike_stats_ql.avg_speed_per_mile}</td>
				         </tr>
				         <tr>
					        <td className="quick9">Avg Cadence</td>
				            <td>{props.data.sunday.bike_stats_ql.avg_cadence}</td>
				            <td>{props.data.monday.bike_stats_ql.avg_cadence}</td>
				            <td>{props.data.tuesday.bike_stats_ql.avg_cadence}</td>
				            <td>{props.data.wednesday.bike_stats_ql.avg_cadence}</td>
				            <td>{props.data.thursday.bike_stats_ql.avg_cadence}</td>
				            <td>{props.data.friday.bike_stats_ql.avg_cadence}</td>
				            <td>{props.data.saturday.bike_stats_ql.avg_cadence}</td>
				         </tr>
				         </Table>
                         </div>

		);
}
export default Bike;