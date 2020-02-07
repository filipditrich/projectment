import React, { ReactElement } from "react";
import { Application } from "../config";
import importLogo from "../utils/logo";

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
				<img src={ importLogo("text") } alt={ "Logo " + Application.APP_NAME } />
			</div>
		</div>
	);
};

export default loaderTemplate;
