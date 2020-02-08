import React from "react";
import { toast } from "react-toastify";
import { ErrorHandler } from "../../components";
import { getRandomInt } from "../../utils";
import { Button } from "reactstrap";

/**
 * Home Component
 */
export const Home: React.FC = () => {
	
	const toastIt = (type: any): void => {
		toast("Lorem ipsum dolor si amet.", {
			type,
			draggable: true,
			autoClose: getRandomInt(1000, 10000),
		});
	};
	
	return (
		<div>
			<ErrorHandler>
				<div className="button-container">
					<Button onClick={ () => toastIt(toast.TYPE.DEFAULT) } className="button button-primary">
						<span>Primary</span></Button>
					<Button onClick={ () => toastIt(toast.TYPE.DEFAULT) }
					        className="button button-primary button-reverse">
						<span>Primary Reverse</span></Button>
					<Button onClick={ () => toastIt(toast.TYPE.DEFAULT) } className="button button-primary button-alt">
						<span>Primary Alt</span></Button>
				</div>
				<div className="button-container">
					<Button onClick={ () => toastIt(toast.TYPE.DEFAULT) } className="button button-secondary">
						<span>Secondary</span></Button>
					<Button onClick={ () => toastIt(toast.TYPE.DEFAULT) }
					        className="button button-secondary button-reverse">
						<span>Secondary Reverse</span></Button>
					<Button onClick={ () => toastIt(toast.TYPE.DEFAULT) } className="button button-secondary button-alt">
						<span>Secondary Alt</span></Button>
				</div>
				<div className="button-container">
					<Button onClick={ () => toastIt(toast.TYPE.ERROR) } className="button button-danger">
						<span>Danger</span>
					</Button>
					<Button onClick={ () => toastIt(toast.TYPE.ERROR) } className="button button-danger button-reverse">
						<span>Danger Reverse</span></Button>
					<Button onClick={ () => toastIt(toast.TYPE.ERROR) } className="button button-danger button-alt">
						<span>Danger Alt</span></Button>
				</div>
				<div className="button-container">
					<Button onClick={ () => toastIt(toast.TYPE.WARNING) } className="button button-warning">
						<span>Warning</span></Button>
					<Button onClick={ () => toastIt(toast.TYPE.WARNING) }
					        className="button button-warning button-reverse">
						<span>Warning Reverse</span></Button>
					<Button onClick={ () => toastIt(toast.TYPE.WARNING) }
					        className="button button-warning button-alt">
						<span>Warning Alt</span></Button>
				</div>
				<div className="button-container">
					<Button onClick={ () => toastIt(toast.TYPE.INFO) } className="button button-info"><span>Info</span>
					</Button>
					<Button onClick={ () => toastIt(toast.TYPE.INFO) } className="button button-info button-reverse">
						<span>Info Reverse</span>
					</Button>
					<Button onClick={ () => toastIt(toast.TYPE.INFO) } className="button button-info button-alt">
						<span>Info Alt</span>
					</Button>
				</div>
				<div className="button-container">
					<Button onClick={ () => toastIt(toast.TYPE.SUCCESS) } className="button button-success">
						<span>Success</span></Button>
					<Button onClick={ () => toastIt(toast.TYPE.SUCCESS) }
					        className="button button-success button-reverse">
						<span>Success Reverse</span></Button>
					<Button onClick={ () => toastIt(toast.TYPE.SUCCESS) }
					        className="button button-success button-alt">
						<span>Success Alt</span></Button>
				</div>
			</ErrorHandler>
		</div>
	);
};

export default Home;
