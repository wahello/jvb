import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Table,Button} from "reactstrap";

const Movement=(props)=>{
	return(

						<div className="quick3">
						<Table className="quick4">
						
						<th className="quick8">
						  <h5 >Movement Summary</h5>
						</th>
						 	<th className="quick8"><h5>17-09-2017</h5></th>
							 <th className="quick8"><h5>18-09-2017</h5></th>
							 <th className="quick8"><h5>19-09-2017</h5></th>
							 <th className="quick8"><h5>20-09-2017</h5></th>
							 <th className="quick8"><h5>21-09-2017</h5></th>
							 <th className="quick8"><h5>22-09-2017</h5></th>
							 <th className="quick8"><h5>23-09-2017</h5></th>
						
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