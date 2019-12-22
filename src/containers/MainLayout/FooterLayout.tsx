import React from 'react';

/**
 * Main Footer Layout
 * @author filipditrich
 */
export default class FooterLayout extends React.Component {

    render() {
        return (
            <React.Fragment>
                <span><small>&copy; 2020 <a className="link" href="https://projectment.pslib.cloud">ProjectMent</a>. All Rights Reserved.</small></span>
                <span className="ml-auto"><small>Property of <a className="link" href="https://web.pslib.cz/">SPŠSE a VOŠ Liberec</a>.</small></span>
            </React.Fragment>
        );
    }
}
