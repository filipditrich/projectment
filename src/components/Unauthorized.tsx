import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

/**
 * Unauthorized Component
 * @author filipditrich
 */
export default class Unauthorized extends React.Component {

    render() {
        return(
            <div className="app flex-row align-items-center">
                <Container>
                    <Row className="justify-content-center">
                        <Col md="6" className="text-center">
                            <h1 className="display-3">403</h1>
                            <h4 className="pt-3">Zde podle všeho nemáte co dělat.</h4>
                            <p className="text-muted">Nemáte dostatečná oprávnění k zobrazení této stránky.</p>
                            <Link to="/sign-in" className="button button-primary mt-3"><span>Přihlásit se</span></Link>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
