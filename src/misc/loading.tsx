import React from 'react';

/**
 * Default Loading Partial
 * @author filipditrich
 */
export default (message: string = "Načítání...") => <div className="animated fadeIn pt-1 text-center text-muted">{ message }</div>;
