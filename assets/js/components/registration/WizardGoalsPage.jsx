import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import {Field, reduxForm } from 'redux-form';
import { Form, Label, Button, Input, FormText, FormGroup,InputGroup,
		 Row, Col, Container,Modal, ModalHeader, ModalBody,ModalFooter} from 'reactstrap';

import { goals_validate } from './validation';
import {renderSelectHours,renderSelectMinutes} from './fieldRenderer';

class WizardGoalsPage extends Component{
	constructor(props){
		super(props);
		 this.state = {
		 	 'hr_error':' ' ,
		 	  'minute_error':' ' ,
		 	
      score: 'null',
      modal: false,
      backdrop:'static',
       nestedModal: false,
       nestedModalsubmit:false
    };





this.hrError = this.hrError.bind(this);
this.MinuteError = this.MinuteError.bind(this);
    this.toggle = this.toggle.bind(this);
     this.toggleNested = this.toggleNested.bind(this);
      this.toggleSubmit = this.toggleSubmit.bind(this);
      this.onDisagreeTerms =this.onDisagreeTerms.bind(this);
	}




	hrError(err_msg){
		this.setState({
			hr_error:err_msg !== undefined ? err_msg : ' '
		});
	}
	MinuteError(err_msg){
		this.setState({
			minute_error:err_msg !== undefined ? err_msg : ' '
		});
	}
	toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }
  toggleNested() {
    this.setState({
      nestedModal: !this.state.nestedModal,
      closeAll: false
    });
  }
   toggleSubmit() {
    this.setState({
      nestedModalsubmit: !this.state.nestedModalsubmit,
      closeAll: false
    });
  }

  onDisagreeTerms(){
 		this.props.history.push("/");
  }

render(){
	const { handleSubmit, previousPage, onSubmit } = this.props;
	return(
		<Form onSubmit={handleSubmit(onSubmit)} >
			<Row>
				<Col className="form-item">

					
					<FormGroup>
						<h3>Tell us your goals</h3>
					</FormGroup>	
						
						<Label className="custom-control custom-checkbox">
							  <Field
								  	className="custom-control-input custom-checkbox custom-control-indicator"
								  	name="sleep_goal"
								  	type="checkbox"
								  	value="Maintain overall health"
								  	required
								  	component="input" 
							   />
							  <span className="custom-control-indicator custom-checkbox"></span>
							  <span className="custom-control-description">Maintain Overall health</span>
						</Label>
					
					
                                <FormGroup>
                                <Label>Daily Sleep Goals (in hours and minutes)</Label>
                                <InputGroup>
                                <Field
									name = "sleep_hours"
									type = "select"
									label = ""
									component = {renderSelectHours}	
									err_callback = {this.hrError}	
								/>&nbsp;&nbsp;&nbsp;
								<Field
									name = "sleep_minutes"
									type = "select"
									label = "Daily Sleep Goals (in hours and minutes)"
									component = {renderSelectMinutes}	
									err_callback = {this.MinuteError}	
								/>
								
							</InputGroup>
							<div style={{color:"red"}}>
								{this.state.hr_error+" "+this.state.minute_error}
							</div>
					        </FormGroup>

					        
					

						<Modal isOpen={this.state.modal} backdrop={this.state.backdrop} toggle={this.toggle} style={{ maxWidth: '52%' }}>
				          <ModalHeader>
                         
				          <p style={{fontSize:'36px', fontWeight:'bold'}}>Terms of Services</p></ModalHeader>
				          <ModalBody style={{marginLeft:'20px', marginRight:'20px;' }}>
				            <p style={{fontWeight:'bold' ,fontSize:'20px'}}>ACCEPTANCE OF TERMS</p>
				            <p style={{marginLeft:'52px'}}>JVB Health & Wellness LLC ("JVB Health & Wellness") provides websites, apps, services, and a platform, (referred to collectively hereafter as "the Services") subject to the following Terms of Use ("Terms"). By using the Services in any way, you are agreeing to comply with these Terms. You are not permitted to use the Services if you object to any part of these Terms or our Privacy Policy.</p>
                             <p style={{fontWeight:'bold' ,fontSize:'20px'}}>MODIFICATIONS TO THIS AGREEMENT</p>  
				          <p style={{marginLeft:'52px'}}>We reserve the right, at our sole discretion, to change, modify, terminate or otherwise alter these Terms and conditions at any time and without prior notice. If we change these Terms, we will inform you by posting the revised Terms to the site with the revised date that they become effective. By continuing to access or use the site or services, you agree to the revised Terms.   </p>
				           <p style={{fontWeight:'bold' ,fontSize:'20px'}}> ELIGIBILITY  </p>

				             <p style={{marginLeft:'52px'}}> To use the Services, you must be 13 years or older, except for our Coaching Services, which requires you to be 18 years or older. If you are a parent or guardian of a child under 13, then you may create an account and allow your child to access that account and the Services under your direct supervision. By using the Services, you represent and warrant that you have the right, authority and capacity to enter into a binding agreement with JVB Health & Wellness and to abide by all of the Terms.  </p>
				           <p style={{fontWeight:'bold' ,fontSize:'20px'}}>USER ACCOUNT   </p>

				             <p style={{marginLeft:'52px'}}>Users of the Services must register for an account. You agree to keep any account information provided to us up-to-date. Accounts that are not completed or up-to-date risk suspension or termination. You are solely responsible for keeping your account credentials confidential and safe and are liable for any unauthorized use of your account. You agree to immediately notify JVB Health & Wellness of any breach of security or unauthorized access of your account. Any personal information is provided at your own risk.   </p>
				           <p style={{fontWeight:'bold' ,fontSize:'20px'}}>CONTENT   </p>

				             <p style={{marginLeft:'52px'}}>The Services may allow you to post, upload, transmit, or otherwise make available and provide Content on the Site, including, without limitation, workout and other data (including personal data), or other materials.   </p>
				              <p style={{marginLeft:'52px'}}> Ownership of Your Content. We do not claim ownership rights in your Content. Subject to the non-exclusive license contained in the following paragraph, you own and will retain any and all intellectual property rights that you may have in your Content.  </p>
				                <p style={{marginLeft:'52px'}}>License to Use Your Content. By posting your Content on or through the Site, you hereby grant us a non-exclusive, fully-paid, royalty-free, perpetual, irrevocable, worldwide license to use or sublicense, copy, modify, translate, reproduce, publicly perform, publicly display, distribute, and create derivative works based on your Content in any online or printed form. You consent to our use and disclosure of your Content as set forth in these Terms of Use, including our Privacy Policy.   </p>
				                  <p style={{marginLeft:'52px'}}>You are entirely responsible for all Content that you post, upload, or otherwise make available via the Services.   </p>
				                    <p style={{marginLeft:'52px'}}>You agree that under no circumstances will JVB Health & Wellness be liable in any way for any Content or for any loss or damage of any kind incurred as a result of the use of any Content posted, uploaded or otherwise made available via the Services.   </p>
				             <p style={{marginLeft:'52px'}}>You acknowledge that JVB Health & Wellness shall have the right (but not the obligation) in its sole discretion to refuse, delete or move any Content that is available via the Services, for violating the letter or spirit of the Terms or for any other reason.   </p>
                                        


				           <p style={{fontWeight:'bold' ,fontSize:'20px'}}>USER CONDUCT   </p>

				             <p style={{marginLeft:'52px'}}>As a condition of use, you promise not to use the Services for any purpose that is unlawful or prohibited by these Terms of Use, or any other purpose not reasonably intended by JVB Health & Wellness.   </p>
				          
                              <p style={{marginLeft:'52px'}}>By way of example, and not as a limitation, you agree not to use the Services:   </p>

				          
				             <p style={{marginLeft:'48px'}}>1.&nbsp;&nbsp; To be obnoxious, more specifically to abuse, harass, threaten, impersonate or intimidate other JVB Health & Wellness users   </p>
				           
                             <p style={{marginLeft:'48px'}}>2.&nbsp;&nbsp;To contribute any Content that is infringing, libelous, defamatory, obscene, pornographic, abusive, offensive or otherwise violates any law or right of any third party  </p>
                             <p style={{marginLeft:'48px'}}>3.&nbsp;&nbsp;For any illegal or unauthorized purpose. If you are an international user, you agree to comply with all local laws regarding online conduct and acceptable content  </p>
                             <p style={{marginLeft:'48px'}}>4.&nbsp;&nbsp;To post or transmit, or cause to be posted or transmitted, any communication or solicitation designed or intended to obtain password, account, or private information from any JVB Health & Wellness user  </p>
                             <p style={{marginLeft:'48px'}}>5.&nbsp;&nbsp;To create or submit unwanted email ("Spam") to any other JVB Health & Wellness users or any URL  </p>
                             <p style={{marginLeft:'48px'}}>6.&nbsp;&nbsp;To violate any laws in your jurisdiction (including but not limited to copyright laws)  </p>
                             <p style={{marginLeft:'48px'}}>7.&nbsp;&nbsp;With the exception of accessing RSS feeds, you will not use any robot, spider, scraper or other automated means to access the Site for any purpose without our express written permission. Additionally, you agree that you will not: (i) take any action that imposes, or may impose in our sole discretion an unreasonable or disproportionately large load on our infrastructure; (ii) interfere or attempt to interfere with the proper working of the Site or any activities conducted on the Site; or (iii) bypass any measures we may use to prevent or restrict access to the Site  </p>


				           <p style={{fontWeight:'bold' ,fontSize:'20px'}}>COPYRIGHT COMPLAINTS   </p>

				             <p style={{marginLeft:'52px'}}>JVB Health & Wellness respects the intellectual property of others. If you believe that your work has been copied in a way that constitutes copyright infringement, <a href="#">contact us </a>  </p>
				           <p style={{fontWeight:'bold' ,fontSize:'20px'}}>PRIVACY AND INFORMATION DISCLOSURE   </p>

				             <p style={{marginLeft:'52px'}}>JVB Health & Wellness's current privacy policy is available at http://www.jvbwellness.com/privacy/    </p>
				           <p style={{fontWeight:'bold' ,fontSize:'20px'}}>NO MEDICAL ADVICE   </p>

				             <p style={{marginLeft:'52px'}}>Neither JVB Health & Wellness (nor its employees, directors, subsidiaries, agents, licensors, managers, and other affiliated companies, and their employees, contractors, agents, officers and directors) nor any of the Coaches can provide any medical or professional advice, diagnosis, or treatment of any kind nor do they create a doctor-patient relationship. Coaching Services are provided for informational purposes only. Users should not rely on the Services or their coach to make any medical decisions and should always consult their physician for any medical question. You agree that before use of Coaching Services, you will consult with your physician. Services are only intended for those who are healthy. You should stop if you are ever experiencing pain or severe discomfort. Call 911 or your doctor immediately if you think you have a medical emergency. You should never disregard medical advice or delay in seeking medical advice because of any content presented on this site, and you should not use our content for diagnosing or treating a health problem. Our content does not constitute medical advice. Relying on any information provided by JVB Health & Wellness or your Coach is solely at your own risk. We reserve the right to terminate your use of the Services for any reason or no reason, including if we determine, in our sole discretion, that you have certain medical conditions. The transmission and receipt of our content, in whole or in part, or communication via the internet, e-mail or other means does not constitute or create a doctor-patient, therapist-patient or other healthcare professional relationship between you and us. JVB Health & Wellness is not a healthcare provider or business associate of a healthcare provider and is not subject to the privacy rule of the health insurance portability and accountability act of 1996 (HIPAA).   </p>
				           <p style={{fontWeight:'bold' ,fontSize:'20px'}}>INDEMNITY   </p>

				             <p style={{marginLeft:'52px'}}> You will indemnify and hold harmless JVB Health & Wellness, its parents, subsidiaries, affiliates, customers, vendors, officers and employees from any liability, damage or cost (including reasonable attorneys fees and cost) from (i) any claim or demand made by any third party due to or arising out of your access to the Site, use of the Services, violation of the Terms of Use by you, or the infringement by you, or any third party using your account or JVB Health & Wellness User ID, of any intellectual property or other right of any person or entity.  </p>
				           <p style={{fontWeight:'bold' ,fontSize:'20px'}}>RELEASE OF LIABILITY FOR INJURY OR DEATH   </p>
                              <p style={{marginLeft:'52px'}}>Your participation in the Services, including Coaching Services, is at your own risk. Exercise can be inherently risky, including risk of injury or illness. Neither JVB Health & Wellness (nor its employees, directors, subsidiaries, agents, licensors, managers, and other affiliated companies, and their employees, contractors, agents, officers and directors) nor any Coach are liable for any personal injury or death that results from the use of the Services or information obtained through the Services. YOU, AND ANYONE ENTITLED TO ACT ON YOUR BEHALF, WAIVE AND RELEASE JVB HEALTH & WELLNESS (AND ITS EMPLOYEES, DIRECTORS, SUBSIDIARIES, AGENTS, LICENSORS, MANAGERS, AND OTHER AFFILIATED COMPANIES, AND THEIR EMPLOYEES, CONTRACTORS, AGENTS, OFFICERS AND DIRECTORS) AND COACHES FROM ANY AND ALL CLAIMS AND LIABILITY FOR INJURY OR DEATH OR ANY OTHER KIND THAT RESULTS FROM USE OR INFORMATION OBTAINED THROUGH THE SERVICES. JVB HEALTH & WELLNESS WILL NOT BE LIABLE TO COACHES FOR ANY INJURY OR DEATH THAT RESULTS FROM COACHES USE OF THE SERVICES AND IF YOU ARE A COACH, YOU RELEASE JVB HEALTH & WELLNESS FROM ANY SUCH LIABILITY. Users should consult a physician before beginning use of the Services or any exercise. In cases where applicable law does not allow the above release of liability, JVB Health & Wellness's liability will be limited to the extent permitted by law. </p>
                                <p style={{fontWeight:'bold' ,fontSize:'20px'}}>WARRANTY DISCLAIMERS  </p>

                                <p style={{marginLeft:'52px'}}>You acknowledge that JVB Health & Wellness has no control over, and no duty to take any action regarding: which users gain access to the Site; what effects the Content may have on you; how you may interpret or use the Content; or what actions you may take as a result of having been exposed to the Content. You release JVB Health & Wellness from all liability for you having acquired or not acquired Content through the Site. The Site may contain, or direct you to sites containing, information that some people may find offensive or inappropriate. JVB Health & Wellness makes no representations concerning any content contained in or accessed through the Site, and JVB Health & Wellness will not be responsible or liable for the accuracy, copyright compliance, legality or decency of material contained in or accessed through the Site. THE SERVICES, CONTENT, AND SITE ARE PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, WITHOUT LIMITATION, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR NON-INFRINGEMENT. SOME STATES DO NOT ALLOW LIMITATIONS ON HOW LONG AN IMPLIED WARRANTY LASTS, SO THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU. </p>
                                <p style={{fontWeight:'bold' ,fontSize:'20px'}}>THIRD PARTY CONTENT, SITES, AND SERVICES  </p>

                                <p style={{marginLeft:'52px'}}>JVB Health & Wellness and Content available through the Services may contain features and functionalities that may link you or provide you with access to third party content which is completely independent of JVB Health & Wellness, including web sites, directories, servers, networks, systems, information and databases, applications, software, programs, products or services, and the Internet as a whole.
                                                                 Your interactions with organizations and/or individuals found on or through the Services, including payment and delivery of goods or services, and any other terms, conditions, warranties or representations associated with such dealings, are solely between you and such organizations and/or individuals. </p>
                                

                                <p style={{marginLeft:'52px'}}>You agree that JVB Health & Wellness shall not be responsible or liable for any loss or damage of any sort incurred as the result of any such dealings. If there is a dispute between participants on this site, or between users and any third party, you understand and agree that JVB Health & Wellness is under no obligation to become involved. In the event that you have a dispute with one or more other users, you hereby release JVB Health & Wellness successors in rights from claims, demands and damages (actual and consequential) of every kind or nature, known or unknown, suspected and unsuspected, disclosed and undisclosed, arising out of or in any way related to such disputes and or our services. </p>
                                <p style={{fontWeight:'bold' ,fontSize:'20px'}}>LIMITATION OF LIABILITY  </p>

                                <p style={{marginLeft:'52px'}}>IN NO EVENT SHALL JVB Health & Wellness OR ITS SUPPLIERS BE LIABLE UNDER CONTRACT, TORT, STRICT LIABILITY, NEGLIGENCE OR OTHER LEGAL THEORY (I) WITH RESPECT TO THE SITE, THE SERVICES OR ANY CONTENT FOR ANY LOST PROFITS OR SPECIAL, INDIRECT, INCIDENTAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES OF ANY KIND WHATSOEVER, SUBSTITUTE GOODS OR SERVICES (HOWEVER ARISING), OR (II) FOR ANY DIRECT DAMAGES IN EXCESS OF (IN THE AGGREGATE) $100. SOME STATES DO NOT ALLOW THE EXCLUSION OR LIMITATION OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE ABOVE LIMITATIONS AND EXCLUSIONS MAY NOT APPLY TO YOU. </p>
                                <p style={{fontWeight:'bold' ,fontSize:'20px'}}>TERMINATION  </p>

                                <p style={{marginLeft:'52px'}}>JVB Health & Wellness may terminate or suspend any and all Services and your JVB Health & Wellness account immediately, without prior notice or liability, if you breach any of the terms or conditions of the Terms of Use. Upon termination of your account, your right to use the Services will immediately cease. If you wish to terminate your JVB Health & Wellness account, you may simply discontinue using the Services. All provisions of the Terms of Use which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability. </p>
                                <p style={{fontWeight:'bold' ,fontSize:'20px'}}> GENERAL INFORMATION </p>

                                <p style={{marginLeft:'52px'}}>The Terms constitute the entire agreement between you and JVB Health & Wellness and govern your use of the Services, superceding any prior agreements between you and JVB Health & Wellness. The Terms and the relationship between you and JVB Health & Wellness shall be governed by the laws of the State of Delaware without regard to its conflict of law provisions. You and JVB Health & Wellness agree to submit to the personal and exclusive jurisdiction of the courts located within the county of New Castle, Delaware. The failure of JVB Health & Wellness to exercise or enforce any right or provision of the Terms shall not constitute a waiver of such right or provision. If any provision of the Terms is found by a court of competent jurisdiction to be invalid, the parties nevertheless agree that the court should endeavor to give effect to the parties' intentions as reflected in the provision, and the other provisions of the Terms remain in full force and effect. You agree that regardless of any statute or law to the contrary, any claim or cause of action arising out of or related to use of the Services or the Terms must be filed within one (1) year after such claim or cause of action arose or be forever barred. </p>
                                <p style={{fontWeight:'bold' ,fontSize:'20px'}}>VIOLATION OF TERMS AND LIQUIDATED DAMAGES  </p>
				          
                                 <p style={{marginLeft:'52px'}}> Please report any violations of the Terms, <a href="#">contact us</a> </p>  
                                  

                                  <p style={{marginLeft:'52px'}}> Our failure to act with respect to a breach by you or others does not waive our right to act with respect to subsequent or similar breaches. </p>  
                                




                                 <p style={{fontWeight:'bold' ,fontSize:'32px',marginTop:'60px'}}>JVB Health & Wellness Privacy Policy </p>    

                                  <p style={{marginTop:'10px'}}>Some people provide JVB Health & Wellness with information and/or data.   JVB Health & Wellness believes in keeping you information confidential.  We established this privacy policy to explain how your information is protected, collected and used. This privacy policy may be updated by JVB Health & Wellness from time to time, and JVB Health & Wellness will provide notice of materially significant changes to this privacy policy by posting notice on the JVBWellness.com site.  </p>  
                                 <p style={{fontWeight:'bold' ,fontSize:'20px'}}>Protecting your privacy </p>    

                                  <p >For those users that provide us information, we don't share it with third parties for marketing purposes. We don't send you unsolicited communications for marketing purposes.   </p>  
                                 <p >JVB Health & Wellness does not knowingly collect any information from persons under the age of 13. If JVB Health & Wellness learns that an account was created by a person under the age of 13, JVB Health & Wellness will remove that account. JVB Health & Wellness, or people who post on JVB Health & Wellness, may provide links to third party websites, which may have different privacy practices. We are not responsible for, nor have any control over, the privacy policies of those third party websites, and encourage all users to read the privacy policies of each and every website visited. </p>    

                                
                                 <p style={{fontWeight:'bold' ,fontSize:'20px'}}>Data we collect </p>    
                                 
                                 <p>In some instances, we may collect data from our users.  Our primary goal in collecting personal information is to provide analyses of your data. We only collect personal information that is relevant to the purpose of our analyses.</p>
                                 <p>We receive and store any information you provide. You can choose not to provide us with certain information, but then you may not get as much detail in our reporting as you’d like. The personal information you provide is used for such purposes as registration; in order for you to use JVB Health & Wellness services, you must complete a registration form. As part of this registration form, we require your email address.</p>
                                
                                  <p style={{fontWeight:'bold' ,fontSize:'20px'}}>Data we store </p>  
                                 <p>All data you provide is stored in our database, and may be archived elsewhere. Although we make good faith efforts to store the information in a secure operating environment that is not available to the public, we cannot guarantee complete security.</p>
                                 
                                     <p style={{fontWeight:'bold' ,fontSize:'20px'}}>Circumstances in which JVB Health & Wellness may release information </p>    


                                 <p>JVB Health & Wellness may disclose information about its users if required to do so by law or in the good faith belief that such disclosure is reasonably necessary to respond to subpoenas, court orders, or other legal process.</p>
                                 <p>JVB Health & Wellness may also disclose information about its users to law enforcement officers or others, in the good faith belief that such disclosure is reasonably necessary to: enforce our Terms of Use; respond to claims that any posting or other content violates the rights of third-parties; or protect the rights, property, or personal safety of JVB Health & Wellness, its users or the general public.</p>
                                 <p>In some cases, we may choose to buy or sell assets. In these types of transactions, user information is typically one of the business assets that is transferred. Moreover, if JVB Health & Wellness, or substantially all of its assets, were acquired, user information would be one of the assets that is transferred.</p>
                                <p>International Users Outside of the United States:&nbsp;&nbsp; By visiting our web site and providing us with data, you acknowledge and agree that due to the international dimension of JVB Health & Wellness we may use the data collected in the course of our relationship for the purposes identified in this policy or in our other communications with you, including the transmission of information outside your resident jurisdiction. In addition, please understand that such data may be stored on servers located in the United States. By providing us with your data, you consent to the transfer of such data.</p>

                                 
                               
				          </ModalBody>
				          <ModalFooter>
				          <div style={{float:'left'}}>
				          <Button color="danger" onClick={this.toggleNested}> I DO NOT Agree to the Terms and Conditions</Button> 
				            
                                   <Modal isOpen={this.state.nestedModal} toggle={this.toggleNested} onClosed={this.state.closeAll ? this.toggle : undefined}>
              
              <ModalBody> You have selected not to agree with our Terms and Conditions, do you want to continue?</ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.toggleNested}>Yes</Button>
                <Button color="primary" onClick={this.onDisagreeTerms}>No</Button>
                
              </ModalFooter>
            </Modal>

                               
				            </div>
				            <div><Button type="submit" color="success" onClick={onSubmit}> I Agree to the Terms and Conditions</Button>				            
				          </div>
				          </ModalFooter>
				        </Modal>

						
					<div className="f-footer">
						<Button outline color="primary" onClick={previousPage}>
							Previous
						</Button>
						<Button  outline color="primary" onClick={this.toggle}  style={{float:'right'}}>
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
	connect(null,{})(withRouter(WizardGoalsPage))
);