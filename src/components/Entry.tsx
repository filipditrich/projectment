import React from "react";
import { Link, Redirect } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import { Application } from "../config";
import { useAppContext } from "../providers";
import importLogo from "../utils/logo";

/**
 * Entry Component
 * @constructor
 */
export const Entry: React.FC<EntryProps> = () => {
	const [{ accessToken }] = useAppContext();
	
	// TODO: better visuals
	// need to know whether I can post a request from here
	// to the oauth client (to build a simple login form here)
	return accessToken !== null ? (
		<Redirect to="/home" />
	) : (
		<div className="app flex-row align-items-center">
			<Container>
				<Row className="justify-content-center">
					<Col sm="12" className="d-flex flex-column align-items-center">
						<img src={ importLogo("sm") } alt={ "Logo " + Application.APP_NAME } width="100" className="mb-3" />
						<img src={ importLogo("text") } alt={ "Logo " + Application.APP_NAME } width="300" className="mb-5" />
						<Link to="/sign-in" className="button button-primary mt-5"><span>Přihlásit se</span></Link>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export interface EntryProps {

}

export default Entry;
