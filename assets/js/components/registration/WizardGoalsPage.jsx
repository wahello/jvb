import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import { Form, Label, Button, Input, FormText, FormGroup,
		 Row, Col, Container,Modal, ModalHeader, ModalBody,ModalFooter} from 'reactstrap';

import { goals_validate } from './validation';
import {renderFieldFormGroup} from './fieldRenderer';

class WizardGoalsPage extends Component{
	constructor(props){
		super(props);
		 this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
	}
	toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

render(){
	const { handleSubmit, previousPage, onSubmit } = this.props;
	return(
		<Form onSubmit={handleSubmit(onSubmit)} >
			<Row>
				<Col className="form-item">

					<div>
						<h3>Tell us your goals</h3>
						<Label className="custom-control custom-checkbox">
							  <Field 
								  	className="custom-control-input"
								  	name="goals"
								  	type="checkbox"
								  	value="Maintain overall health"
								  	required
								  	component="input" 
							   />
							  <span className="custom-control-indicator"></span>
							  <span className="custom-control-description">Maintain Overall health</span>
						</Label>
					</div><br />

					<Field
						name = "sleep_goal"
						type = "number"
						label = "Daily Sleep Goals (in hours)"
						placeholder = "7"
						value=""
						component = {renderFieldFormGroup}
					/>
					<Label className="custom-control custom-checkbox">
							  <Field 
								  	className="custom-control-input"
								  	name="terms_conditions"
								  	type="checkbox"
								  	value=""
								  	required
								  	onClick={this.toggle}
								  	component="input" 
							   />
							  <span className="custom-control-indicator"></span>
							  <span className="custom-control-description">I Agree To The Terms and Conditions</span>
						</Label>

						<Modal isOpen={this.state.modal} toggle={this.toggle}>
				          <ModalHeader>Terms and Conditions</ModalHeader>
				          <ModalBody>
				            <p>Some people provide JVB Health & Wellness with information and/or data.   JVB Health & Wellness believes in keeping you information confidential.  We established this privacy policy to explain how your information is protected, collected and used. This privacy policy may be updated by JVB Health & Wellness from time to time, and JVB Health & Wellness will provide notice of materially significant changes to this privacy policy by posting notice on the JVBWellness.com site.</p>

							<h5>Protecting your privacy</h5>

							<p>For those users that provide us information, we don't share it with third parties for marketing purposes. We don't send you unsolicited communications for marketing purposes.</p> 

							<p>JVB Health & Wellness does not knowingly collect any information from persons under the age of 13. If JVB Health & Wellness learns that an account was created by a person under the age of 13, JVB Health & Wellness will remove that account. JVB Health & Wellness, or people who post on JVB Health & Wellness, may provide links to third party websites, which may have different privacy practices. We are not responsible for, nor have any control over, the privacy policies of those third party websites, and encourage all users to read the privacy policies of each and every website visited.</p>

							<h5>Data we collect</h5>

							<p>In some instances, we may collect data from our users.  Our primary goal in collecting personal information is to provide analyses of your data. We only collect personal information that is relevant to the purpose of our analyses.</p>

							<p>We receive and store any information you provide. You can choose not to provide us with certain information, but then you may not get as much detail in our reporting as you’d like. The personal information you provide is used for such purposes as registration; in order for you to use JVB Health & Wellness services, you must complete a registration form. As part of this registration form, we require your email address.</p>

							<h5>Data we store</h5>

							<p>All data you provide is stored in our database, and may be archived elsewhere.. Although we make good faith efforts to store the information in a secure operating environment that is not available to the public, we cannot guarantee complete security.</p>

							<h5>Circumstances in which JVB Health & Wellness may release information</h5>

							<p>JVB Health & Wellness may disclose information about its users if required to do so by law or in the good faith belief that such disclosure is reasonably necessary to respond to subpoenas, court orders, or other legal process.</p>

							<p>JVB Health & Wellness may also disclose information about its users to law enforcement officers or others, in the good faith belief that such disclosure is reasonably necessary to: enforce our Terms of Use; respond to claims that any posting or other content violates the rights of third-parties; or protect the rights, property, or personal safety of JVB Health & Wellness, its users or the general public.</p>

							<p>In some cases, we may choose to buy or sell assets. In these types of transactions, user information is typically one of the business assets that is transferred. Moreover, if JVB Health & Wellness, or substantially all of its assets, were acquired, user information would be one of the assets that is transferred.</p>

							<p>International Users By visiting our web site and providing us with data, you acknowledge and agree that due to the international dimension of JVB Health & Wellness we may use the data collected in the course of our relationship for the purposes identified in this policy or in our other communications with you, including the transmission of information outside your resident jurisdiction. In addition, please understand that such data may be stored on servers located in the United States. By providing us with your data, you consent to the transfer of such data.</p>
				          </ModalBody>
				          <ModalFooter>
				            <Button color="primary" onClick={this.toggle}>OK</Button>				            
				          </ModalFooter>
				        </Modal>

						
					<div className="f-footer">
						<Button outline color="primary" onClick={previousPage}>
							Previous
						</Button>
						<Button type="submit" outline color="primary" style={{float:'right'}}>
							Submit
						</Button>
					</div>
				</Col>
			</Row>
		</Form>
	);
}
}

export default reduxForm({
	form: 'register',
	destroyOnUnmount: false,
	forceUnregisterOnMount: true,
	validate: goals_validate
})(
	connect(null,{})(WizardGoalsPage)
);