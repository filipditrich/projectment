import React from "react";
import { Link } from "react-router-dom";
import {
    Button,
    Card,
    CardBody,
    Col,
    Container,
    Form,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row
} from "reactstrap";
// import { useAppContext } from "../../providers";

/**
 * SignIn Page
 * @constructor
 */
export default function SignIn() {
    // const { userManager } = useAppContext();

    return (
        <div className="app flex-row align-items-center">
            <Container>
                <Row className="justify-content-center">
                    <Col md="8">
                        <Card className="p-4">
                            <CardBody>
                                <Form>
                                    <h1>Přihlášení</h1>
                                    <p className="text-muted">Přihlašte se ke svému účtu.</p>

                                    {/* Username */ }
                                    <InputGroup className="mb-3">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText><i className="icon-user"/></InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="text" placeholder="Uživatelské jméno" autoComplete="username"/>
                                    </InputGroup>

                                    {/* Password */ }
                                    <InputGroup className="mb-4">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText><i className="icon-lock"/></InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="password" placeholder="Heslo" autoComplete="current-password"/>
                                    </InputGroup>

                                    {/* Buttons */ }
                                    <Row>
                                        <Col xs="12" s="6" className="d-flex">
                                            <Link to="/oidc-callback" className="button button-primary button-reverse w-100"><span>Přihlásit Se</span></Link>
                                            {/*<Button onClick={ () => userManager.signinRedirect() }*/}
                                            {/*        className="button button-primary button-reverse w-100"><span>Přihlásit se</span></Button>*/}
                                        </Col>
                                        <Col xs="12" s="6" className="text-center text-sm-right mt-2">
                                            <Button disabled color="link" className="link px-0">Zapomenuté heslo?</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
