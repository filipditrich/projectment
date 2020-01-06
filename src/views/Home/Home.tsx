import React from "react";
import { toast } from "react-toastify";
import { fakeIdeasData, getRandomInt } from "../../utils";

/**
 * Home Component
 * @author filipditrich
 */
export default class Home extends React.Component {
	
	toastIt = (type: any): void => {
		const content = fakeIdeasData[getRandomInt(0, fakeIdeasData.length - 1)].description;
		toast(content, {
			type,
			draggable: true,
			autoClose: getRandomInt(1000, 10000),
		});
	};
	
	render() {
		return (
			<>
				<div className="button-container">
					<button onClick={ () => this.toastIt(toast.TYPE.DEFAULT) } className="button button-primary"><span>Primary</span></button>
					<button onClick={ () => this.toastIt(toast.TYPE.DEFAULT) } className="button button-primary button-reverse"><span>Primary Reverse</span></button>
					<button onClick={ () => this.toastIt(toast.TYPE.DEFAULT) } className="button button-secondary"><span>Secondary</span></button>
					<button onClick={ () => this.toastIt(toast.TYPE.DEFAULT) } className="button button-secondary button-reverse"><span>Secondary Reverse</span></button>
				</div>
				<div className="button-container">
					<button onClick={ () => this.toastIt(toast.TYPE.ERROR) } className="button button-danger"><span>Danger</span></button>
					<button onClick={ () => this.toastIt(toast.TYPE.ERROR) } className="button button-danger button-reverse"><span>Danger Reverse</span></button>
					<button onClick={ () => this.toastIt(toast.TYPE.WARNING) } className="button button-warning"><span>Warning</span></button>
					<button onClick={ () => this.toastIt(toast.TYPE.WARNING) } className="button button-warning button-reverse"><span>Warning Reverse</span></button>
				</div>
				<div className="button-container">
					<button onClick={ () => this.toastIt(toast.TYPE.INFO) } className="button button-info"><span>Info</span></button>
					<button onClick={ () => this.toastIt(toast.TYPE.INFO) } className="button button-info button-reverse"><span>Info Reverse</span></button>
					<button onClick={ () => this.toastIt(toast.TYPE.SUCCESS) } className="button button-success"><span>Success</span></button>
					<button onClick={ () => this.toastIt(toast.TYPE.SUCCESS) } className="button button-success button-reverse"><span>Success Reverse</span></button>
				</div>
			</>
		);
	}
}
