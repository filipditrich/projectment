import React, { ReactElement } from "react";

/**
 * Main Footer Layout
 * @author filipditrich
 */
const FooterLayout = (): ReactElement => {

	return (
		<React.Fragment>
			<span><small>&copy; 2020 <a className="link" href="https://projectment.pslib.cloud" target="_blank" rel="noopener noreferrer">ProjectMent</a>. All Rights Reserved.</small></span>
			<span className="ml-auto"><small>Property of <a className="link" href="https://web.pslib.cz/" target="_blank" rel="noopener noreferrer">SPŠSE a VOŠ Liberec</a>.</small></span>
		</React.Fragment>
	);
};

export default FooterLayout;
