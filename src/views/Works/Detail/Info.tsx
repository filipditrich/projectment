import classnames from "classnames";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
	Badge,
	Button,
	CardBody,
	CardFooter,
	CardHeader,
	Col,
	FormFeedback,
	FormGroup, FormText,
	Input,
	Label,
	Row, UncontrolledTooltip
} from "reactstrap";
import * as yup from "yup";
import { RSFInput } from "../../../components/common/CustomSelect";
import { FormFields } from "../../../components/common/FormFields";
import ClassName from "../../../models/className";
import { FormikOnSubmit, UseFormikProps } from "../../../models/formik";
import { DataJsonResponse } from "../../../models/response";
import Subject from "../../../models/subject";
import { IUser } from "../../../models/user";
import { IWorkInfo, IWorkSet, IWorkState, IWork } from "../../../models/work";
import { useAppContext } from "../../../providers";
import { Axios, enumToArray, name } from "../../../utils";
import { handleRes, responseError } from "../../../utils/axios";
import { genInitialValues, genValidationSchema, IFieldConfig } from "../../../utils/form";
import { transformForAPI } from "../../../utils/transform";

/**
 * Work Info Component
 * @constructor
 */
export const WorkInfo: React.FC<WorkInfoProps> = ({ work, users, sets, state, fetcher }: WorkInfoProps) => {
	const [ isEditing, setIsEditing ] = useState<boolean>(false);
	const [ showHelp, setShowHelp ] = useState<boolean>(false);
	const [ { accessToken, userId } ] = useAppContext();
	
	// form configuration
	const config: IFieldConfig<IWorkInfo> = useMemo<IFieldConfig<IWorkInfo>>((): IFieldConfig<IWorkInfo> => {
		return {
			name: {
				value: work?.name || "",
				title: "Název",
				helpMessage: "Název zadání práce",
				yup: yup.string().required("Název zadání práce je požadován"),
			},
			description: {
				value: work?.description || "",
				title: "Popis zadání",
				helpMessage: "Popis zadání práce",
				yup: yup.string().required("Popis zadání práce je požadován"),
				field: ({ getFieldMeta }: UseFormikProps<IWorkInfo>, options) => (
					<Input type="textarea"
					       invalid={ getFieldMeta("description").touched && !!getFieldMeta("description").error }
					       tag={ Field }
					       as="textarea"
					       rows={ 3 }
					       name="description"
					       { ...options } />
				),
			},
			resources: {
				value: work?.resources || "",
				title: "Prostředky",
				helpMessage: "Prostředky potřebné pro zpracování práce",
				yup: yup.string().required("Prostředky pro práci jsou požadovány"),
			},
			subject: {
				value: work?.subject || [],
				title: (work?.subject || []).length > 0 ? "Předmět" : "Předměty",
				helpMessage: `Předmět${ (work?.subject || []).length > 0 ? "y" : "" }, do kterého zadání práce spadá`,
				yup: yup.array().required(`Předmět${ (work?.subject || []).length > 0 ? "y" : "" }, do kterého zadání práce spadá je požadován`).nullable(true),
				displayValue: (
					<div className="badge-container">
						{
							work?.subject.map((subject, index) => (
								<Badge key={ index }>{ subject }</Badge>
							))
						}
					</div>
				),
				field: ({ getFieldMeta }: UseFormikProps<IWorkInfo>, options) => (
					<Field creatable
					       isMulti
					       name="subject"
					       component={ RSFInput }
					       invalid={ getFieldMeta("subject").touched && !!getFieldMeta("subject").error }
					       options={ enumToArray(Subject).map((subject) => (
						       { value: subject.key, label: subject.value }))
					       }
					       { ...options } />
				),
			},
			authorId: {
				value: work?.authorId || "",
				title: "Autor práce",
				helpMessage: "Autor vypracovávající práci",
				yup: yup.string().required("Autor vypracovávající práci je požadován"),
				displayValue: <>{ name(users.find((user) => user.id === work?.authorId)?.name) } (<b>{ work?.className }</b>)</>,
				field: ({ getFieldMeta }: UseFormikProps<IWorkInfo>, options) => (
					<Field name="authorId"
					       component={ RSFInput }
					       invalid={ getFieldMeta("authorId").touched && getFieldMeta("authorId") }
					       options={ users.map((user) => ({ value: user.id, label: name(user.name) })) }
					       { ...options } />
				),
				column: { sm: 12, md: 8, },
			},
			className: {
				value: work?.className || "",
				title: "Třída",
				helpMessage: "Třída vypracovávajícího studenta",
				yup: yup.string().required("Třída studenta vypracovávajícího práci je požadována"),
				displayValue: false,
				field: ({ getFieldMeta }: UseFormikProps<IWorkInfo>, options) => (
					<Field name="className"
					       component={ RSFInput }
					       creatable={ true }
					       invalid={ getFieldMeta("className").touched && !!getFieldMeta("className").error }
					       options={
						       enumToArray(ClassName).map((className) => (
							       { value: className.key, label: className.value }
						       ))
					       }
					       { ...options } />
				),
				column: { sm: 12, md: 4, },
			},
			setId: {
				value: work?.setId || 0,
				title: "Sada prací",
				helpMessage: "Sada prací, do které by zadání spadalo",
				yup: yup.number().required("Sada prací do které práce spadá je požadována"),
				displayValue: sets.find((set) => set.id === work?.setId)?.name,
				field: ({ getFieldMeta }: UseFormikProps<IWorkInfo>, options) => (
					<Field name="setId"
					       component={ RSFInput }
					       invalid={ getFieldMeta("setId").touched && !!getFieldMeta("setId").error }
					       options={ sets.map((set) => ({ value: set.id, label: set.name })) }
					       { ...options } />
				),
			},
		};
	}, [ work, users, sets ]);
	
	// initial values
	const initialValues = genInitialValues<IWorkInfo>(config);
	
	// validation schema
	const validationSchema = genValidationSchema(config);
	
	// onSubmit hook
	const onSubmit: FormikOnSubmit<IWorkInfo> = async (values: IWorkInfo, { setSubmitting, resetForm }) => {
		try {
			setSubmitting(true);
			handleRes<DataJsonResponse<IWork>>(await Axios(accessToken)
				.put<DataJsonResponse<IWork>>(`/works/${ work?.id }`, {
					...transformForAPI(work), userId,
				}));
			toast.success("Zadání práce bylo úspěšně aktualizováno.");
			fetcher();
		} catch (error) {
			resetForm();
			toast.error(responseError(error).message);
		} finally {
			setSubmitting(false);
			setIsEditing(false);
		}
	};
	
	// whether the user can edit it
	const canEdit: boolean = state?.code === 0;
	
	return (
		<Formik
			initialValues={ initialValues }
			validationSchema={ validationSchema }
			enableReinitialize={ true }
			onSubmit={ onSubmit }>
			{
				(props: UseFormikProps<IWorkInfo>) => (
					<>
						<CardHeader className="d-flex justify-content-between">
							<span>Zadání práce</span>
							{
								canEdit ? (
									<>
										<button
											id="edit-work"
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
										<UncontrolledTooltip placement="left" target="edit-work">Upravit zadání</UncontrolledTooltip>
									</>
								) : null
							}
						</CardHeader>
						<CardBody>
							<FormFields isEditing={ isEditing } config={ config } props={ props } showHelp={ showHelp } id="work-info" />
						</CardBody>
						{
							canEdit && isEditing ? (
								<CardFooter className="d-flex flex-wrap align-items-center">
									<Button className="button button-primary"
									        form="work-info"
									        disabled={ props.isSubmitting }
									        type="submit">
										<span>{ props.isSubmitting ? "Working..." : "Uložit" }</span>
									</Button>
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
					</>
				)
			}
		</Formik>
	);
};

export interface WorkInfoProps {
	work?: IWork;
	users: IUser[];
	sets: IWorkSet[];
	state?: IWorkState;
	fetcher: () => void;
}

export default WorkInfo;
