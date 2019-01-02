import React from 'react';
import FontAwesome from "react-fontawesome";
import {Container,CardLink} from 'reactstrap';

const userNotInvited = (props) => {
	return (
		<Container className="reg-non-invited">
			<div>
				<div>
					<div className="err-icon">
						<FontAwesome 
							name='exclamation-triangle' 
							size='5x'
						/>
					</div>
					<div>
						Please contact <span style={{fontWeight:"bold"}}>info@jvbwellness.com</span> to
						request an invitation to use this site
					</div>
					<CardLink href="/"> Go to Home</CardLink>
				</div>
			</div>
		</Container>
	)
}

export default userNotInvited;