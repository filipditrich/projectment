import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { withRouter } from "react-router-dom";
// import { useAppContext } from "../../providers";
import { fakePromise, getRandomInt } from "../../utils";
import {FormFeedback, FormGroup, Label, FormText, Tooltip, Input, Button, CustomInput} from "reactstrap";
import classNames from "classnames";

/**
 * Create Idea Component
 * @param props
 * @returns {*}
 * @constructor
 */
export const Create = (props) => {
    // const { accessToken, userId } = useAppContext();
    const [ failed, setFailed ] = useState(false);
    const [ ok, setOk ] = useState(false);
    const [ showHelp, setShowHelp ] = useState(false);
    const [ helpTooltipOpen, setHelpTooltipOpen ] = useState(false);
    useEffect(() => {
        setFailed(false);
        setOk(false);
    },[]);

    return (
        <>
            <h1 className="mb-3">Vytvořit námět</h1>
            <Formik
                initialValues={{
                    name: "",
                    description: "",
                    resources: "",
                    participants: 1,
                    subject: "",
                    offered: false
                }}
                validate={
                    (values) => {
                        let errors = {};
                        if (!values.name) errors.name = "Vyplňte název námětu";
                        if (!values.description) errors.description = "Vyplňte popis námětu";
                        if (!values.resources) errors.resources = "Vyplňte očekávané zdroje";
                        if (values.participants === null) errors.participants = "Vyplňte počet autorů";
                        if (!values.subject) errors.subject = "Vyplňte zkratu předmětu, do kterého by zadání spadalo";
                        return errors;
                    }
                }
                onSubmit={
                    async (values, { setSubmitting }) => {
                        setSubmitting(true);

                        // TODO: de-fake
                        const res = await fakePromise(getRandomInt(500, 1000), {
                            ok: true,
                            json: () => { return { id: "fake-id" } },
                            statusText: "200 OK",
                            status: 200,
                        });
                        // const res = await fetch(process.env.REACT_APP_API_URL + "/ideas", {
                        //     method: "POST",
                        //     headers: {
                        //         Authorization: "Bearer " + accessToken,
                        //         "Content-Type": "application/json"
                        //     },
                        //     body: JSON.stringify({
                        //         Name: values.name,
                        //         Description: values.description,
                        //         Resources: values.resources,
                        //         Participants: values.participants,
                        //         Subject: values.subject,
                        //         Offered: values.offered,
                        //         UserId: userId
                        //     })
                        // });
                        if (res.ok) {
                            let json = await res.json();
                            setOk(true);
                            props.history.push("/ideas/" + json.id);
                        } else {
                            setFailed(res.statusText);
                            setSubmitting(false);
                        }
                    }
                }>
                {
                    ({isSubmitting, errors, touched, values, setFieldValue}) => (
                        <Form>
                            {/* Name */}
                            <FormGroup>
                                <Label for="name">Název</Label>
                                <Input type="text" invalid={ !!touched.name && !!errors.name } tag={ Field } name="name" />
                                <ErrorMessage name="name">{ (msg) => <FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
                                <FormText className={ classNames({ 'd-none': !showHelp }) }>Název námětu</FormText>
                            </FormGroup>

                            {/* Description */}
                            <FormGroup>
                                <Label for="description">Popis</Label>
                                <Input type="textarea" invalid={ !!touched.description && !!errors.description } tag={ Field } name="description" />
                                <ErrorMessage name="description">{ (msg) => <FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
                                <FormText className={ classNames({ 'd-none': !showHelp }) }>Popis námětu</FormText>
                            </FormGroup>

                            {/* Subject */}
                            <FormGroup>
                                <Label for="subject">Předmět</Label>
                                <Input type="text" invalid={ !!touched.subject && !!errors.subject } tag={ Field } name="subject" />
                                <ErrorMessage name="subject">{ (msg) => <FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
                                <FormText className={ classNames({ 'd-none': !showHelp }) }>Předmět, do kterého by námět spadal</FormText>
                            </FormGroup>

                            {/* Resources */}
                            <FormGroup>
                                <Label for="resources">Zdroje</Label>
                                <Input type="text" invalid={ !!touched.resources && !!errors.resources } tag={ Field } name="resources" />
                                <ErrorMessage name="resources">{ (msg) => <FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
                                <FormText className={ classNames({ 'd-none': !showHelp }) }>Očekávané zdroje</FormText>
                            </FormGroup>

                            {/* Participants */}
                            <FormGroup>
                                <Label for="participants">Počet řešitelů</Label>
                                <Input type="number" invalid={ !!touched.participants && !!errors.participants } tag={ Field } name="participants" />
                                <ErrorMessage name="participants">{ (msg) => <FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
                                <FormText className={ classNames({ 'd-none': !showHelp }) }>Počet řešitelů daného námětu</FormText>
                            </FormGroup>

                            {/* Offered */}
                            <FormGroup>
                                <CustomInput
                                    type="switch"
                                    name="offered"
                                    id="offered"
                                    checked={ values.offered }
                                    onChange={ () => setFieldValue("offered", !values.offered) }
                                    label="Nabízené jako zadání" />
                                <FormText className={ classNames({ 'd-none': !showHelp }) }>Zda bude námět nabízen jako zadání</FormText>
                            </FormGroup>

                            <FormGroup className="d-flex flex-wrap justify-content-between align-items-center mb-0">
                                {/* Submit */}
                                <Button className="button button-primary button-reverse" type="submit" disabled={ isSubmitting }>
                                    <span>{ !isSubmitting ? "Vytvořit" : "Pracuji..." }</span>
                                </Button>

                                {/* Help */}
                                <a className="link-muted"
                                   href="#help"
                                   id="help-button"
                                   onClick={ (e) => { e.preventDefault(); setShowHelp(!showHelp); } }>
                                    <span>Nápověda</span>
                                </a>
                                <Tooltip
                                    placement="top"
                                    isOpen={ helpTooltipOpen }
                                    target="help-button"
                                    toggle={ () => setHelpTooltipOpen(!helpTooltipOpen) }>
                                    Zobrazit nápovědu k formuláři
                                </Tooltip>
                            </FormGroup>
                        </Form>
                    )
                }
            </Formik>
        </>
    );
};

export default withRouter(Create);
