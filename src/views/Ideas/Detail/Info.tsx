import { Field, Formik } from "formik";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
	Badge,
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	CustomInput,
	Input,
	UncontrolledTooltip
} from "reactstrap";
import * as yup from "yup";
import { RSFInput } from "../../../components/common/CustomSelect";
import { FormFields } from "../../../components/common/FormFields";
import { SubmitButton } from "../../../components/common/SubmitButton";
import { FormikOnSubmit, UseFormikProps } from "../../../models/formik";
import { IIdea, IIdeaInfo } from "../../../models/idea";
import { DataJsonResponse } from "../../../models/response";
import Subject from "../../../models/subject";
import { useAppContext } from "../../../providers";
import { Axios, enumToArray } from "../../../utils";
import { handleRes, responseError } from "../../../utils/axios";
import { genInitialValues, genValidationSchema, IFieldConfig } from "../../../utils/form";
import { isOwnerOrAdmin } from "../../../utils/roles";
import { transformForAPI } from "../../../utils/transform";
import IdeaTargets from "./Targets";

/**
 * Idea Detail Component
 * @constructor
 */
export const IdeaInfo: React.FC<IdeaInfoProps> = ({ idea, setIsLoading, fetcher }: IdeaInfoProps) => {
	const [ isEditing, setIsEditing ] = useState<boolean>(false);
	const [ showHelp, setShowHelp ] = useState<boolean>(false);
	const [ { accessToken, userId, profile } ] = useAppContext();
	
	// form field configuration
	const config: IFieldConfig<IIdeaInfo> = useMemo<IFieldConfig<IIdeaInfo>>((): IFieldConfig<IIdeaInfo> => {
		return {
			name: {
				value: idea?.name || "",
				title: "Název",
				helpMessage: "Název námětu",
				yup: yup.string().required("Název námětu je požadován"),
			},
			resources: {
				value: idea?.resources || "",
				title: "Prostředky",
				helpMessage: "Prostředky které budou nezbytné k vyhotovení práce",
				yup: yup.string().required("Prostředky pro práci jsou požadovány"),
			},
			subject: {
				value: idea?.subject || [],
				title: "Předmět",
				helpMessage: "Předmět, do kterého by námět práce spadal",
				yup: yup.array().required("Předmět, do kterého by námět spadal je požadován").nullable(true),
				displayValue: (
					<div className="badge-container">
						{
							idea?.subject.map((subject, index) => (
								<Badge key={ index }>{ subject }</Badge>
							))
						}
					</div>
				),
				field: ({ getFieldMeta }: UseFormikProps<IIdeaInfo>, options) => (
					<Field creatable
					       isMulti
					       name="subject"
					       component={ RSFInput }
					       invalid={ getFieldMeta("subject").touched && !!getFieldMeta("subject").error }
					       options={ enumToArray(Subject).map((subject) => (
						       { value: subject.key, label: subject.value }))
					       } { ...options } />
				),
			},
			participants: {
				value: idea?.participants || 1,
				title: "Počet řešitelů",
				helpMessage: "Kolik rešitelů by se podílelo na zadání",
				yup: yup.number().required("Počet řešitelů je požadován").min(1, "Minimální počet řešitelů je 1"),
				field: ({ getFieldMeta }: UseFormikProps<IIdeaInfo>, options) => (
					<Input type="number"
					       invalid={ getFieldMeta("participants").touched && !!getFieldMeta("participants").error }
					       tag={ Field }
					       name="participants"
					       { ...options } />
				),
			},
			description: {
				value: idea?.description || "",
				title: "Popis zadání",
				helpMessage: "Popis zadání práce",
				yup: yup.string().required("Popis zadání práce je požadován"),
				field: ({ getFieldMeta }: UseFormikProps<IIdeaInfo>, options) => (
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
				value: idea?.offered || false,
				title: "Nabízené jako zadání",
				helpMessage: "Zda-li má být námět nabízen jako zadání práce",
				yup: yup.boolean(),
				hideLabel: true,
				displayValue: idea?.offered ? "Ano" : "Ne",
				field: ({ getFieldMeta, setFieldValue, values }: UseFormikProps<IIdeaInfo>, options) => (
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
			targets: {
				value: idea?.targets || [],
				title: "Cílové skupiny",
				helpMessage: "Cílové skupiny práce",
				yup: yup.array(),
				hideField: true,
				displayValue: (idea ? <IdeaTargets setIsLoading={ setIsLoading } idea={ idea } /> : null),
			},
		};
	}, [ idea ]);
	
	// initial values
	const initialValues = genInitialValues<IIdeaInfo>(config);
	
	// validation schema
	const validationSchema = genValidationSchema(config);
	
	// on submit hook
	const onSubmit: FormikOnSubmit<IIdeaInfo> = async (values: IIdeaInfo, { setSubmitting, resetForm }) => {
		try {
			setSubmitting(true);
			delete values.targets;
			handleRes<DataJsonResponse<IIdea>>(await Axios(accessToken)
				.put<DataJsonResponse<IIdea>>(`/ideas/${ idea?.id }`, {
					...transformForAPI({ ...idea, ...values }), userId,
				}));
			toast.success("Námět byl úspěšně aktualizován.");
			fetcher();
		} catch (error) {
			resetForm();
			toast.error(responseError(error).message);
		} finally {
			setSubmitting(false);
			setIsEditing(false);
		}
	};
	
	// whether the user can edit
	const canEdit: boolean = isOwnerOrAdmin(profile, idea?.userId);
	
	return (
		<Formik
			initialValues={ initialValues }
			validationSchema={ validationSchema }
			enableReinitialize={ true }
			onSubmit={ onSubmit }>
			{
				(props: UseFormikProps<IIdeaInfo>) => (
					<Card>
						<CardHeader className="d-flex justify-content-between">
							<span>Detail námětu</span>
							{
								canEdit ? (
									<>
										<button
											id="edit-idea"
											className="reset-button"
											disabled={ isEditing }
											onClick={
												(e) => {
													e.preventDefault();
													setIsEditing(true);
												}
											}>
											<i className="icon-magic-wand font-xl" />
										</button>
										<UncontrolledTooltip placement="left"
										                     target="edit-idea">Upravit zadání</UncontrolledTooltip>
									</>
								) : null
							}
						</CardHeader>
						<CardBody>
							<FormFields isEditing={ isEditing }
							            config={ config }
							            props={ props }
							            showHelp={ showHelp }
							            id="idea-edit" />
						</CardBody>
						{
							canEdit && isEditing ? (
								<CardFooter className="d-flex flex-wrap align-items-center">
									{/* Buttons */ }
									<SubmitButton passiveText="Uložit"
									              activeText="Ukládám"
									              type="primary"
									              props={ { form: "idea-edit", type: "submit" } }
									              onClick={ props.submitForm } />
									<Button className="button button-secondary ml-3"
									        type="button"
									        disabled={ props.isSubmitting }
									        onClick={
										        (e) => {
											        e.preventDefault();
											        setIsEditing(false);
										        }
									        }>
										<span>Zrušit</span>
									</Button>
									
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
							) : null
						}
					</Card>
				)
			}
		</Formik>
	);
};

export interface IdeaInfoProps {
	idea?: IIdea;
	setIsLoading: Dispatch<SetStateAction<boolean>>;
	fetcher: () => any;
}

export default IdeaInfo;
