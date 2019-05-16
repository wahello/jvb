import React, { Component } from 'react'
import { Button, FormGroup, Label, Input, FormText, className, Collapse } from 'reactstrap';
import Textarea from 'react-textarea-autosize';

export default class UnprocesedFoodModal extends Component {

	constructor(props) {
		super(props);
		const unprocessed_food_list = this.props.unprocessed_food_list;
		const no_plants_consumed = this.props.no_plants_consumed;
		const processed_food_list = this.props.processed_food_list;
		const list_of_pants_consumed = this.props.list_of_pants_consumed;




		this.state = {
			collapse: true,
			enter_food: (unprocessed_food_list !== '') ? true : false,
			list_of_pants: (list_of_pants_consumed !== '') ? true : false,
			unprocessed_food_list: unprocessed_food_list,
			no_plants_consumed: no_plants_consumed,
			list_of_pants_consumed: list_of_pants_consumed,
			processed_food_list: processed_food_list,
			enter_process_food: (processed_food_list !== '') ? true : false,
			opennextquestion: false
		};

		this.handleChange = this.handleChange.bind(this);
		this.onClickFoodList = this.onClickFoodList.bind(this);
		this.onClickProcessFoodList = this.onClickProcessFoodList.bind(this);
		this.handleChangeProcessedFood = this.handleChangeProcessedFood.bind(this);
		this.createDropdown = this.createDropdown.bind(this);

	}

	componentWillReceiveProps(nextProps) {
		if ((nextProps.unprocessed_food_list !== this.props.unprocessed_food_list) ||
			(nextProps.processed_food_list !== this.props.processed_food_list) ||
			(nextProps.no_plants_consumed !== this.props.no_plants_consumed) ||
			(nextProps.list_of_pants_consumed !== this.props.list_of_pants_consumed)) {
			this.setState({
				enter_food: (nextProps.unprocessed_food_list !== '') ? true : false,
				enter_process_food: (nextProps.processed_food_list !== '') ? true : false,
				list_of_pants: (nextProps.list_of_pants_consumed !== '') ? true : false,
				unprocessed_food_list: nextProps.unprocessed_food_list,
				no_plants_consumed: nextProps.no_plants_consumed,
				processed_food_list: nextProps.processed_food_list,
				list_of_pants_consumed: nextProps.list_of_pants_consumed
			});
		}
	}

	handleChangeProcessedFood(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		console.log("no_plants_consumed", value)
		if (value > 0) {
			console.log(value, "value")
			this.setState({
				no_plants_consumed: value,
				opennextquestion: true

			}, () => {
				this.props.updateState(this.state[name], name)
				console.log(this.state.no_plants_consumed,"setstate")
			});
		} else {
			this.setState({
				no_plants_consumed: value,
				opennextquestion: false,
				list_of_pants_consumed: list_of_pants_consumed

			}	,()=>{this.props.updateState(this.state[name], name)}		
			);
		}
	}
	handleChange(event) {
		const value = event.target.value;
		const name = event.target.name;
		this.setState({
			[name]: value,
		}, () => {
			console.log("no of plants consumed",this.state.no_plants_consumed)
			this.props.updateState(this.state[name], name)
		});
	}
	onClickFoodList(event) {
		this.setState({
			enter_food: !this.state.enter_food
		}, () => {
			console.log(this.state.enter_food, "state.enter_food")
		});
	}

	onClickProcessFoodList(event) {
		this.setState({
			enter_process_food: !this.state.enter_process_food
		});
	}
	createDropdown(start_num, end_num, step = 1) {
		let elements = [];
		let i = start_num;
		while (i <= end_num) {
			elements.push(<option key={i} value={i}>{i}</option>);
			i = i + step;
		}
		return elements;
	}

	render() {
		return (
			<div>
				<Collapse isOpen={this.state.collapse}>
					<FormGroup>
						{this.props.editable &&
							<div>
								<div className="unprocess_food">
									<Input type="checkbox"
										id="unprocess_check"
										onClick={this.onClickProcessFoodList}
										checked={this.state.enter_process_food ? 'checked' : ''}
									/>
									<Label id="text" className="LAbel">I Want to enter in the processed foods I consumed yesterday</Label>
								</div>
								<Collapse isOpen={this.state.enter_process_food}>
									<Label className="LAbel">5.1 What Processed Food were Consumed?</Label>
									<div className="input1">
										<Textarea
											id="placeholder"
											className="form-control"
											value={this.state.processed_food_list}
											name="processed_food_list"
											rows="5" cols="5"
											onChange={this.handleChange}
										/>
									</div>
								</Collapse>
								{(this.props.report_type == "full") &&
									<div className="unprocess_food">
										<Input type="checkbox"
											id="unprocess_check"
											onClick={this.onClickFoodList}
											checked={this.state.enter_food ? 'checked' : ''}
										/>
										<Label id="text" className="LAbel">I Want To Enter A List Of &nbsp;
			                            			 <span style={{ fontWeight: "bold" }}>
												<span style={{ textDecoration: "underline" }}>Un</span>processed?
						                             </span> Foods I Consumed</Label>
									</div>
								}

								<div>
									<Collapse isOpen={this.state.enter_food}>

										<Label className="LAbel">5.2 What &nbsp;
										 <span style={{ fontWeight: "bold" }}>
												<span style={{ textDecoration: "underline" }}>Un</span>processed?
			                             </span> Food Were Consumed?</Label>
										<div className="input1">
											<Textarea
												id="placeholder"
												className="form-control"
												value={this.state.unprocessed_food_list}
												name="unprocessed_food_list"
												rows="5" cols="5"
												onChange={this.handleChange}
											/>
										</div>
									</Collapse>
								</div>
								{(this.props.report_type == "full") &&
									<div className="unprocess_food">

										<Label id="text" className="LAbel">5.3 How many different types of plants did you consume yesterday
										in total (fruits, vegetables, greens, nuts, seeds)?”
																		</Label>

										{this.props.editable &&
										<div className="input1">
											<Input type="select"
												className="form-control custom-select "
												name="no_plants_consumed"
												value={this.state.no_plants_consumed}
												onChange={this.handleChangeProcessedFood}>
												<option key="select" value="">select</option>
												{this.createDropdown(0,100,1)}
											</Input>
										</div>
										}
										
										<Collapse isOpen={this.state.opennextquestion}>
											<Label className="LAbel">5.3.1 Plants Consumed Yesterday (write in): 
											</Label>
											<div className="input1">
												<Textarea
													id="placeholder"
													className="form-control"
													value={this.state.list_of_pants_consumed}
													name="list_of_pants_consumed"
													rows="5" cols="5"
													onChange={this.handleChange}
												/>
											</div>
										</Collapse>
									</div>
								}

							</div>
						}
						{!this.props.editable &&
							<div>
								<div className="input">
									<Label className="LAbel">5.1 What Processed Food Were Consumed?</Label><br />

									<p>{this.state.processed_food_list}</p>
								</div>

								{(this.props.report_type == "full") &&
									<div className="input">
										<Label>5.2 What &nbsp;
	                                <span style={{ fontWeight: "bold" }}>
												<span style={{ textDecoration: "underline" }}>Un</span>processed?
		                             </span> Food Were Consumed?</Label>
										<p >{this.state.unprocessed_food_list}</p>
									</div>
								}

								{(this.props.report_type == "full") &&
									<div className="input">
										<Label>5.3 How many different types of plants did you consume yesterday
																		in total (fruits, vegetables, greens, nuts, seeds)?”</Label>
										<p>{this.state.no_plants_consumed}</p>
									</div>
								}


								{(this.props.report_type == "full") &&
									<div className="LAbel">
										<Label>5.3.1 Plants Consumed Yesterday (write in): </Label>
										<p >{this.state.list_of_pants_consumed}</p>
									</div>
								}
							</div>
						}
					</FormGroup>
				</Collapse>
			</div>
		);
	}
}