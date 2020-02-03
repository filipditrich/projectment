import React, { ReactElement } from "react";
import logo from "../assets/img/logo-projectment-text.png";
import { Application } from "../config";

/**
 * Loader Template
 * @param innerContent
 */
const loaderTemplate = (innerContent: Element | string | any): ReactElement => {
	
	return (
		<div className="preloader">
			
			<div className="preloader-spinner" />
			
			<div className="preloader-text">
				{ innerContent }
			</div>
			
			<div className="preloader-logo">
				<img src={ logo } alt={ Application.APP_NAME + " Logo" } />
			</div>
		</div>
	);
};

export default loaderTemplate;
