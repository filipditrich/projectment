import classnames from "classnames";
import { ErrorMessage, Field, Form } from "formik";
import React from "react";
import { Col, FormFeedback, FormGroup, FormText, Input, Label, Row } from "reactstrap";
import { UseFormikProps } from "../../models/formik";
import { IFieldConfig, IFieldConfigFieldOptions } from "../../utils/form";
import { unset } from "lodash";

/**
 * Form Fields Component
 * @param config
 * @param props
 * @param showHelp
 * @constructor
 */
export const FormFields: React.FC<FormFieldsProps> = ({ config, props, showHelp, id, isEditing }: FormFieldsProps) => {
	return (
		<Form id={ id || "form-fields" }>
			<Row>
				{/* Fields */ }
				{
					Object.keys(config).map((name, index) => {
						const field = config[name];
						const options: IFieldConfigFieldOptions = {
							isDisabled: props.isSubmitting,
							disabled: props.isSubmitting,
						};
						if (!field.field || (field.field && field.field(props).props.type))
							delete options.isDisabled;
						
						return (
							<Col key={ index } sm={ 12 } { ...field.column }>
								<FormGroup>
									{
										isEditing ? (
											<>
												{
													!field.hideField ? (
														<>
															{
																!field.hideLabel ? (
																	<Label for={ name }>{ field.title }</Label>
																) : null
															}
															{
																field.field ? field.field(props, options) : (
																	<Input type="text"
																	       invalid={ props.getFieldMeta(name).touched && !!props.getFieldMeta(name).error }
																	       tag={ Field }
																	       name={ name }
																	       { ...options }
																	/>
																)
															}
														</>
													) : null
												}
											</>
										) : (
											field.displayValue !== false ? (
												<>
													<dt>{ field.title }</dt>
													<dd>{ field.displayValue || field.value }</dd>
												</>
											) : null
										)
									}
									<ErrorMessage name={ name }>{ (msg) => <FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
									<FormText className={ classnames({ "d-none": !showHelp }) }>{ field.helpMessage }</FormText>
								</FormGroup>
							</Col>
						);
					})
				}
			</Row>
		</Form>
	);
};

interface FormFieldsProps<T = any> {
	config: IFieldConfig<T>;
	props: UseFormikProps<T>;
	showHelp: boolean;
	isEditing: boolean;
	id?: string;
}
