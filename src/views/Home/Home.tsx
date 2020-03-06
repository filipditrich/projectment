import React from "react";
import { toast } from "react-toastify";
import { ErrorHandler } from "../../components";
import { useAppContext } from "../../providers";
import { getRandomInt, greeter } from "../../utils";
import { Button, Card, CardBody, CardDeck, CardHeader } from "reactstrap";

/**
 * Home Component
 */
export const Home: React.FC = () => {
	const [{ profile }] = useAppContext();
	
	return (
		<>
			<h1>Vítejte zpět, { greeter(profile.given_name) }!</h1>
		</>
	);
};

export default Home;
