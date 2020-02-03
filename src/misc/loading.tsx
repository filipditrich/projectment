import React, { ReactElement } from "react";

/**
 * Default Loading Partial
 * @author filipditrich
 */
const loadingPartial = (message: string = "Načítání..."): ReactElement =>
	<div className="animated fadeIn pt-1 text-center text-muted">{ message }</div>;

export default loadingPartial;
