import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../providers";
import { greeter } from "../../utils";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";

/**
 * Home Component
 */
export const Home: React.FC = () => {
	const [{ profile }] = useAppContext();
	
	return (
		<Row>
			<Col sm={ 12 }>
				<Card className="w-100">
					<CardHeader>Nástěnka</CardHeader>
					<CardBody>
						<h1>Vítejte zpět, { greeter(profile.given_name) }!</h1>
					</CardBody>
				</Card>
			</Col>
			
			<Col md={ 6 }>
				<Card style={{ minHeight: "320px" }}>
					<CardHeader>Náměty</CardHeader>
					<CardBody className="d-flex justify-content-center align-items-center">
						<Link to="/ideas/list" className="d-flex flex-column text-center no-link">
							<i className="icon-bulb mb-5" style={{ fontSize: "5rem" }}/>
							<h2>Seznam námětů</h2>
						</Link>
					</CardBody>
				</Card>
			</Col>
			
			<Col md={ 6 }>
				<Card style={{ minHeight: "320px" }}>
					<CardHeader>Zadání</CardHeader>
					<CardBody className="d-flex justify-content-center align-items-center">
						<Link to="/works/list" className="d-flex flex-column text-center no-link">
							<i className="icon-briefcase mb-5" style={{ fontSize: "5rem" }}/>
							<h2>Seznam zadání</h2>
						</Link>
					</CardBody>
				</Card>
			</Col>
		</Row>
	);
};

export default Home;
