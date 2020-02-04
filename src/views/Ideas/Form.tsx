import classnames from "classnames";
import { ErrorMessage, Field, Form, Formik, FormikTouched } from "formik";
import { FormikErrors, FormikHelpers } from "formik/dist/types";
import React, { ReactNode, useState } from "react";
import { CustomInput, FormFeedback, FormGroup, FormText, Input, Label, Tooltip } from "reactstrap";
import { IIdeaInit } from "../../models/idea";

/**
 * Idea From Component
 * @constructor
 */
export const IdeaForm: React.FC<IdeaFormProps> = ({ initialValues, validate, onSubmit, buttons }: IdeaFormProps) => {
	const [ showHelp, setShowHelp ] = useState<boolean>(false);
	const [ helpTooltipOpen, setHelpTooltipOpen ] = useState<boolean>(false);
	
	return (
		<Formik
			initialValues={ initialValues }
			validate={ validate }
			onSubmit={ onSubmit }>
			{
				({ isSubmitting, errors, touched, values, setFieldValue }: IdeaFormikProps) => (
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
								{ buttons(isSubmitting) }
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

export type IdeaFormPropValidate = (values: IIdeaInit) => void | object | Promise<FormikErrors<IIdeaInit>>;
export type IdeaFormPropOnSubmit = (values: IIdeaInit, formikHelpers: FormikHelpers<IIdeaInit>) => void | Promise<any>;

export interface IdeaFormProps {
	initialValues: IIdeaInit;
	validate: IdeaFormPropValidate;
	onSubmit: IdeaFormPropOnSubmit;
	buttons: (isSubmitting: boolean) => ReactNode;
}

export interface IdeaFormikProps {
	isSubmitting: boolean;
	errors: FormikErrors<IIdeaInit>;
	touched: FormikTouched<IIdeaInit>;
	values: IIdeaInit;
	setFieldValue: (field: string, value: any) => void;
}

export default IdeaForm;
