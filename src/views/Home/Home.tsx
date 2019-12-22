import React from 'react';
import { Row, Col } from 'reactstrap';

/**
 * Home Component
 * @author filipditrich
 */
export default class Home extends React.Component {

    render() {
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="6" lg="4">
                        <h1>You are home.</h1>
                    </Col>
                </Row>
            </div>
        );
    }
}
