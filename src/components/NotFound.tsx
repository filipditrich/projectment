import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

/**
 * Not Found Component
 * @author filipditrich
 */
const NotFound = (): ReactElement => {
	return (
		<div className="app flex-row align-items-center">
			<Container>
				<Row className="justify-content-center">
					<Col md="6" className="text-center">
						<h1 className="display-3">404</h1>
						<h4 className="pt-3">Jejda! Zřejmě jste se ztratili.</h4>
						<p className="text-muted">Požadovaná stránka nebyla nalezena.</p>
						<Link to="/" className="button button-primary mt-3"><span>Zpět domů</span></Link>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default NotFound;
