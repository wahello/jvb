import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Table,Button} from "reactstrap";

const Movement=(props)=>{
	return(

						<div className="quick3">
						<Table className="quick4">
						<tr>
						<th className="quick8">
						  <h4 >Movement Summary</h4>
						</th>
						 	<th className="quick8"><h4>17-09-2017</h4></th>
							 <th className="quick8"><h4>18-09-2017</h4></th>
							 <th className="quick8"><h4>19-09-2017</h4></th>
							 <th className="quick8"><h4>20-09-2017</h4></th>
							 <th className="quick8"><h4>21-09-2017</h4></th>
							 <th className="quick8"><h4>22-09-2017</h4></th>
							 <th className="quick8"><h4>23-09-2017</h4></th>
						</tr>
						<tbody>
								<tr>
								<td>movement summary</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
								</tr>
						</tbody>
						</Table>
						</div>

		);
}
export default Movement;