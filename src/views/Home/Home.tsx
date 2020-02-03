import React, { ReactElement } from "react";
import { toast } from "react-toastify";
import { getRandomInt } from "../../utils";

/**
 * Home Component
 * @author filipditrich
 */
const Home = (props: any): ReactElement => {
	
	const toastIt = (type: any): void => {
		toast("Lorem ipsum dolor si amet.", {
			type,
			draggable: true,
			autoClose: getRandomInt(1000, 10000),
		});
	};
	
	return (
		<>
			<div className="button-container">
				<button onClick={ () => toastIt(toast.TYPE.DEFAULT) } className="button button-primary">
					<span>Primary</span></button>
				<button onClick={ () => toastIt(toast.TYPE.DEFAULT) } className="button button-primary button-reverse">
					<span>Primary Reverse</span></button>
				<button onClick={ () => toastIt(toast.TYPE.DEFAULT) } className="button button-secondary">
					<span>Secondary</span></button>
				<button onClick={ () => toastIt(toast.TYPE.DEFAULT) }
				        className="button button-secondary button-reverse"><span>Secondary Reverse</span></button>
			</div>
			<div className="button-container">
				<button onClick={ () => toastIt(toast.TYPE.ERROR) } className="button button-danger"><span>Danger</span>
				</button>
				<button onClick={ () => toastIt(toast.TYPE.ERROR) } className="button button-danger button-reverse">
					<span>Danger Reverse</span></button>
				<button onClick={ () => toastIt(toast.TYPE.WARNING) } className="button button-warning">
					<span>Warning</span></button>
				<button onClick={ () => toastIt(toast.TYPE.WARNING) } className="button button-warning button-reverse">
					<span>Warning Reverse</span></button>
			</div>
			<div className="button-container">
				<button onClick={ () => toastIt(toast.TYPE.INFO) } className="button button-info"><span>Info</span>
				</button>
				<button onClick={ () => toastIt(toast.TYPE.INFO) } className="button button-info button-reverse"><span>Info Reverse</span>
				</button>
				<button onClick={ () => toastIt(toast.TYPE.SUCCESS) } className="button button-success">
					<span>Success</span></button>
				<button onClick={ () => toastIt(toast.TYPE.SUCCESS) } className="button button-success button-reverse">
					<span>Success Reverse</span></button>
			</div>
		</>
	);
};

export default Home;
