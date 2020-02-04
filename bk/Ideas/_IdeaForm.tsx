import React, { ReactElement, useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { CustomInput, FormFeedback, FormGroup, FormText, Input, Label, Tooltip } from "reactstrap";
import classnames from "classnames";

/**
 * Ideas IdeaEdit/IdeaCreate Form
 * @param props
 * @returns {*}
 * @constructor
 */
const _IdeaForm = (props: { initialValues: any; validate: any; onSubmit: (values: any, { setSubmitting }: any) => Promise<any> | void; footerButtons: ({ isSubmitting }: any) => ReactElement }): any => {
	const {
		initialValues,
		validate,
		onSubmit,
		footerButtons,
	} = props;
	
	// const { accessToken, userId } = useAppContext();
	const [ failed, setFailed ]: any = useState(false);
	const [ ok, setOk ]: any = useState(false);
	const [ showHelp, setShowHelp ]: any = useState(false);
	const [ helpTooltipOpen, setHelpTooltipOpen ]: any = useState(false);
	useEffect(() => {
		setFailed(false);
		setOk(false);
	}, []);
	
	return (
		<Formik
			initialValues={ initialValues }
			validate={ validate }
			onSubmit={ onSubmit }>
			{
				({ isSubmitting, errors, touched, values, setFieldValue }) => (
					<Form>
						{/* Name */ }
						<FormGroup>
							<Label for="name">Název</Label>
							<Input type="text" invalid={ !!touched.name && !!errors.name } tag={ Field } name="name" />
							<ErrorMessage name="name">{ (msg) => <FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
							<FormText className={ classnames({ "d-none": !showHelp }) }>Název námětu</FormText>
						</FormGroup>
						
						{/* Description */ }
						<FormGroup>
							<Label for="description">Popis</Label>
							<Input type="textarea"
							       invalid={ !!touched.description && !!errors.description }
							       tag={ Field }
							       name="description" />
							<ErrorMessage name="description">{ (msg) =>
								<FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
							<FormText className={ classnames({ "d-none": !showHelp }) }>Popis námětu</FormText>
						</FormGroup>
						
						{/* Subject */ }
						{/* TODO: Wouldn't select be better for this? */ }
						<FormGroup>
							<Label for="subject">Předmět</Label>
							<Input type="text"
							       invalid={ !!touched.subject && !!errors.subject }
							       tag={ Field }
							       name="subject" />
							<ErrorMessage name="subject">{ (msg) =>
								<FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
							<FormText
								className={ classnames({ "d-none": !showHelp }) }>Předmět, do kterého by námět spadal</FormText>
						</FormGroup>
						
						{/* Resources */ }
						<FormGroup>
							<Label for="resources">Zdroje</Label>
							<Input type="text"
							       invalid={ !!touched.resources && !!errors.resources }
							       tag={ Field }
							       name="resources" />
							<ErrorMessage name="resources">{ (msg) =>
								<FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
							<FormText className={ classnames({ "d-none": !showHelp }) }>Očekávané zdroje</FormText>
						</FormGroup>
						
						{/* Participants */ }
						<FormGroup>
							<Label for="participants">Počet řešitelů</Label>
							<Input type="number"
							       invalid={ !!touched.participants && !!errors.participants }
							       tag={ Field }
							       name="participants" />
							<ErrorMessage name="participants">{ (msg) =>
								<FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
							<FormText
								className={ classnames({ "d-none": !showHelp }) }>Počet řešitelů daného námětu</FormText>
						</FormGroup>
						
						{/* Offered */ }
						<FormGroup>
							<CustomInput
								type="switch"
								name="offered"
								id="offered"
								checked={ values.offered }
								onChange={ () => setFieldValue("offered", !values.offered) }
								label="Nabízené jako zadání" />
							<FormText
								className={ classnames({ "d-none": !showHelp }) }>Zda bude námět nabízen jako zadání</FormText>
						</FormGroup>
						
						{/* Buttons */ }
						<FormGroup className="d-flex flex-wrap justify-content-between align-items-center mb-0">
							
							<div className="form-footer-buttons">
								{ footerButtons(isSubmitting) }
							</div>
							
							{/* Help */ }
							<a className="link-muted" href="#help" id="help-button" onClick={ (e) => {
								e.preventDefault();
								setShowHelp(!showHelp);
							} }>
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
	);
};

export default _IdeaForm;
