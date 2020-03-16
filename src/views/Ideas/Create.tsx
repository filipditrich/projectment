import { Field, Formik } from "formik";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { withRouter } from "react-router";
import {
	Button,
	Card,
	CardBody, CardFooter,
	CardHeader,
	CustomInput,
	Input,
	UncontrolledTooltip
} from "reactstrap";
import { History } from "history";
import * as yup from "yup";
import { RSFInput } from "../../components/common/CustomSelect";
import { FormFields } from "../../components/common/FormFields";
import { FormikOnSubmit, UseFormikProps } from "../../models/formik";
import { IIdea, IIdeaInit } from "../../models/idea";
import { DataJsonResponse } from "../../models/response";
import Subject from "../../models/subject";
import { useAppContext } from "../../providers";
import { Axios, enumToArray } from "../../utils";
import { handleRes, responseError } from "../../utils/axios";
import { genInitialValues, genValidationSchema, IFieldConfig } from "../../utils/form";
import { transformForAPI } from "../../utils/transform";

/**
 * Create Idea Component
 * @param history
 * @constructor
 */
export const IdeaCreate: React.FC<IdeaCreateProps> = ({ history }: IdeaCreateProps) => {
	const [ showHelp, setShowHelp ] = useState<boolean>(false);
	const [{ accessToken, userId }] = useAppContext();
	
	// form field configuration
	const config: IFieldConfig<IIdeaInit> = useMemo<IFieldConfig<IIdeaInit>>((): IFieldConfig<IIdeaInit> => {
		return {
			name: {
				value: "",
				title: "Název",
				helpMessage: "Název námětu",
				yup: yup.string().required("Název námětu je požadován"),
				column: { md: 6 },
			},
			resources: {
				value: "",
				title: "Prostředky",
				helpMessage: "Prostředky které budou nezbytné k vyhotovení práce",
				yup: yup.string().required("Prostředky pro práci jsou požadovány"),
				column: { md: 6 },
			},
			subject: {
				value: [],
				title: "Předmět",
				helpMessage: "Předmět, do kterého by námět práce spadal",
				yup: yup.array().required("Předmět, do kterého by námět spadal je požadován").nullable(true),
				field: ({ getFieldMeta }: UseFormikProps<IIdeaInit>, options) => (
					<Field creatable
					       isMulti
					       name="subject"
					       component={ RSFInput }
					       invalid={ getFieldMeta("subject").touched && !!getFieldMeta("subject").error }
					       options={ enumToArray(Subject).map((subject) => (
						       { value: subject.key, label: subject.value }))
					       } { ...options } />
				),
				column: { md: 6 },
			},
			participants: {
				value: 1,
				title: "Počet řešitelů",
				helpMessage: "Kolik rešitelů by se podílelo na zadání",
				yup: yup.number().required("Počet řešitelů je požadován").min(1, "Minimální počet řešitelů je 1"),
				field: ({ getFieldMeta }: UseFormikProps<IIdeaInit>, options) => (
					<Input type="number"
					       invalid={ getFieldMeta("participants").touched && !!getFieldMeta("participants").error }
					       tag={ Field }
					       name="participants"
					       { ...options } />
				),
				column: { md: 6 },
			},
			description: {
				value: "",
				title: "Popis zadání",
				helpMessage: "Popis zadání práce",
				yup: yup.string().required("Popis zadání práce je požadován"),
				field: ({ getFieldMeta }: UseFormikProps<IIdeaInit>, options) => (
					<Input type="textarea"
					       invalid={ getFieldMeta("description").touched && !!getFieldMeta("description").error }
					       tag={ Field }
					       as="textarea"
					       rows={ 3 }
					       name="description"
					       { ...options } />
				),
			},
			offered: {
				value: true,
				title: "Nabízené jako zadání",
				helpMessage: "Zda-li má být námět nabízen jako zadání práce",
				yup: yup.boolean(),
				hideLabel: true,
				field: ({ getFieldMeta, setFieldValue, values }: UseFormikProps<IIdeaInit>, options) => (
					<CustomInput
						type="switch"
						name="offered"
						id="offered"
						checked={ values.offered }
						onChange={ () => setFieldValue("offered", !values.offered) }
						label="Nabízené jako zadání"
						{ ...options } />
				),
			},
		};
	}, []);
	
	// initial values
	const initialValues = genInitialValues<IIdeaInit>(config);
	
	// validation schema
	const validationSchema = genValidationSchema(config);
	
	// on submit hook
	const onSubmit: FormikOnSubmit<IIdeaInit> = async (values: IIdeaInit, { setSubmitting }) => {
		try {
			setSubmitting(true);
			const [ res ] = handleRes<DataJsonResponse<IIdea>>(await Axios(accessToken)
				.post<DataJsonResponse<IIdea>>("/ideas", {
					...transformForAPI(values), userId,
				}));
			toast.success("Námět byl úspěšně vytvořen.");
			history.push(`/ideas/detail/${ res.data.id }`);
		} catch (error) {
			setSubmitting(false);
			toast.error(responseError(error).message);
		}
	};
	
	return (
		<Formik
			initialValues={ initialValues }
			validationSchema={ validationSchema }
			enableReinitialize={ true }
			onSubmit={ onSubmit }>
			{
				(props: UseFormikProps<IIdeaInit>) => (
					<Card>
						<CardHeader>Vytvořit námět</CardHeader>
						<CardBody>
							<FormFields isEditing={ true } config={ config } props={ props } showHelp={ showHelp } id="idea-init" />
						</CardBody>
						<CardFooter className="d-flex align-items-center justify-content-between">
							{/* Buttons */ }
							<div className="form-footer-buttons">
								<Button className="button button-primary"
								        type="submit"
								        form="idea-init"
								        disabled={ props.isSubmitting }>
									<span>{ props.isSubmitting ? "Working..." : "Vytvořit" }</span>
								</Button>
							</div>
							
							{/* Help */ }
							<span className="link-muted ml-auto"
							      id="help-button"
							      onClick={ () => setShowHelp(!showHelp) }>
								<span>Nápověda</span>
							</span>
							<UncontrolledTooltip placement="top" target="help-button">
								Zobrazit nápovědu k formuláři
							</UncontrolledTooltip>
						</CardFooter>
					</Card>
				)
			}
		</Formik>
	);
};

export interface IdeaCreateProps {
	history: History;
}

export default withRouter(IdeaCreate);
