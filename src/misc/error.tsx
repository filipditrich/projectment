import React from "react";

/**
 * Default Error Partial
 * @author filipditrich
 */
const errorPartial = (error?: any) =>
	<div className="animated fadeIn pt-1 text-center text-muted">{ error || "Nastala neočekávaná chyba." }</div>;

export default errorPartial;
