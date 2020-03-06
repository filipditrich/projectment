import classnames from "classnames";
import { ErrorMessage, Field, Form, Formik, FormikTouched } from "formik";
import { FieldMetaProps, FormikErrors, FormikHelpers } from "formik/dist/types";
import React, { ReactNode, useState } from "react";
import { Col, CustomInput, FormFeedback, FormGroup, FormText, Input, Label, Row, Tooltip } from "reactstrap";
import { RSFInput } from "../../components/common/CustomSelect";
import { IIdeaInit } from "../../models/idea";
import Subject from "../../models/subject";
import { enumToArray } from "../../utils";

/**
 * Idea From Component
 * @constructor
 */
export const IdeaForm: React.FC<IdeaFormProps> = ({ initialValues, validate, onSubmit, buttons, id, large }: IdeaFormProps) => {
	const [ showHelp, setShowHelp ] = useState<boolean>(false);
	const [ helpTooltipOpen, setHelpTooltipOpen ] = useState<boolean>(false);
	
	if (!validate) {
		validate = (values: IIdeaInit) => {
			const errors: any = {};
			if (!values.name) errors.name = "Vyplňte název námětu";
			if (!values.description) errors.description = "Vyplňte popis námětu";
			if (!values.resources) errors.resources = "Vyplňte očekávané zdroje";
			if (values.participants === null || !values.participants) errors.participants = "Vyplňte počet autorů";
			if (!values.subject) errors.subject = "Vyplňte zkratu předmětu, do kterého by zadání spadalo";
			return errors;
		};
	}
	
	return (
		<Formik
			initialValues={ initialValues }
			validate={ validate }
			onSubmit={
				(values: IIdeaInit, formikHelpers: FormikHelpers<IIdeaInit>) => {
					values.subject = Array.isArray(values.subject) ? values.subject.join(", ") : values.subject;
					onSubmit(values, formikHelpers);
				}
			}>
			{
				({ isSubmitting, errors, touched, values, setFieldValue, getFieldMeta }: IdeaFormikProps) => (
					<Form id={ id || "idea-form" }>
						<Row>
							{/* Name */ }
							<Col md={ large ? 6 : 12 }>
								<FormGroup>
									<Label for="name">Název</Label>
									<Input type="text"
									       invalid={ getFieldMeta("name").touched && !!errors.name }
									       tag={ Field }
									       name="name" />
									<ErrorMessage name="name">{ (msg) =>
										<FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
									<FormText className={ classnames({ "d-none": !showHelp }) }>Název námětu</FormText>
								</FormGroup>
							</Col>
							
							{/* Resources */ }
							<Col md={ large ? 6 : 12 }>
								<FormGroup>
									<Label for="resources">Zdroje</Label>
									<Input type="text"
									       invalid={ getFieldMeta("resources").touched && !!errors.resources }
									       tag={ Field }
									       name="resources" />
									<ErrorMessage name="resources">{ (msg) =>
										<FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
									<FormText className={ classnames({ "d-none": !showHelp }) }>Očekávané zdroje</FormText>
								</FormGroup>
							</Col>
							
							{/* Subject */ }
							<Col md={ large ? 6 : 12 }>
								<FormGroup>
									<Label for="subject">Předmět</Label>
									<Field name="subject"
									       component={ RSFInput }
									       creatable={ true }
									       isMulti
									       invalid={ getFieldMeta("subject").touched && !!errors.subject }
									       options={
										       enumToArray(Subject).map((subject) => {
											       return {
												       value: subject.key,
												       label: subject.value
											       };
										       })
									       } />
									<ErrorMessage name="subject">{ (msg) =>
										<FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
									<FormText
										className={ classnames({ "d-none": !showHelp }) }>Předmět, do kterého by námět spadal</FormText>
								</FormGroup>
							</Col>
							
							{/* Participants */ }
							<Col md={ large ? 6 : 12 }>
								<FormGroup>
									<Label for="participants">Počet řešitelů</Label>
									<Input type="number"
									       invalid={ getFieldMeta("participants").touched && !!errors.participants }
									       tag={ Field }
									       name="participants" />
									<ErrorMessage name="participants">{ (msg) =>
										<FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
									<FormText
										className={ classnames({ "d-none": !showHelp }) }>Počet řešitelů daného námětu</FormText>
								</FormGroup>
							</Col>
							
							{/* Description */ }
							<Col sm={ 12 }>
								<FormGroup>
									<Label for="description">Popis</Label>
									<Input type="textarea"
									       invalid={ getFieldMeta("description").touched && !!errors.description }
									       tag={ Field }
									       as="textarea"
									       rows={ 3 }
									       name="description" />
									<ErrorMessage name="description">{ (msg) =>
										<FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
									<FormText className={ classnames({ "d-none": !showHelp }) }>Popis námětu</FormText>
								</FormGroup>
							</Col>
							
							{/* Offered */ }
							<Col sm={ 12 }>
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
							</Col>
							
							{/* Form Footer */ }
							{
								buttons ? (
									<Col sm={ 12 }>
										<FormGroup className="d-flex flex-wrap justify-content-between align-items-center mb-0 mt-3">
											
											{/* Buttons */ }
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
									</Col>
								) : null
							}
						</Row>
					</Form>
				)
			}
		</Formik>
	);
};

export type IdeaFormPropValidate = (values: IIdeaInit) => void | object | Promise<FormikErrors<IIdeaInit>>;
export type IdeaFormPropOnSubmit = (values: IIdeaInit, formikHelpers: FormikHelpers<IIdeaInit>) => void | Promise<any>;

export interface IdeaFormProps {
	id?: string;
	initialValues: IIdeaInit;
	validate?: IdeaFormPropValidate;
	onSubmit: IdeaFormPropOnSubmit;
	buttons?: (isSubmitting: boolean) => ReactNode;
	large?: boolean;
}

export interface IdeaFormikProps {
	isSubmitting: boolean;
	errors: FormikErrors<IIdeaInit>;
	touched: FormikTouched<IIdeaInit>;
	values: IIdeaInit;
	setFieldValue(field: string, value: any, shouldValidate?: boolean): void;
	setFieldError(field: string, message: string): void;
	getFieldMeta<Value>(name: string): FieldMetaProps<Value>;
}

export default IdeaForm;
