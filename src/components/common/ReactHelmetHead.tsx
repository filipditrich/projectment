import React from "react";
import Helmet from "react-helmet";
import { Application } from '../../config';

/**
 * React-Helmet Component
 * @param {string} title
 * @constructor
 */
const ReactHelmetHead = ({ title }: { title?: string }) => {
    const defaultTitle: string = Application.APP_NAME;

    return (
        <Helmet>
            <title>{ title ? `${title} | ${Application.APP_NAME}` : defaultTitle }</title>
        </Helmet>
    );
};

export default ReactHelmetHead;
