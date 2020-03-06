import { AxiosResponse } from "axios";
import classnames from "classnames";
import { ErrorMessage, Field, Form, Formik, FormikHelpers, FormikTouched } from "formik";
import * as yup from "yup";
import { FieldMetaProps, FormikErrors } from "formik/dist/types";
import React, { useEffect, useState } from "react";
import { useParams, withRouter } from "react-router";
import { toast } from "react-toastify";
import {
	Button,
	Card,
	CardBody,
	CardHeader, Col,
	FormFeedback,
	FormGroup,
	FormText,
	Input,
	Label, Row,
	Tooltip
} from "reactstrap";
import { RSFInput } from "../../components/common/CustomSelect";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import { loading } from "../../misc";
import ClassName from "../../models/className";
import { IIdea } from "../../models/idea";
import { DataJsonResponse, TableDataJsonResponse } from "../../models/response";
import Subject from "../../models/subject";
import { IUser } from "../../models/user";
import { IWork, IWorkFull, IWorkInit, IWorkSet } from "../../models/work";
import { useAppContext } from "../../providers";
import { Axios, enumToArray, isStatusOk, name } from "../../utils";
import axios from "axios";
import { History } from "history";
import { responseError, responseFail } from "../../utils/axios";

/**
 * Init Work Form Component
 * @constructor
 */
export const WorkFormInit: React.FC<InitWorkProps> = ({ history }: InitWorkProps) => {
	const { id } = useParams();
	if (!id) throw new Error("No Id present!"); // shouldn't happen at all
	
	const [ { accessToken, userId } ] = useAppContext();
	const [ showHelp, setShowHelp ] = useState<boolean>(false);
	const [ helpTooltipOpen, setHelpTooltipOpen ] = useState<boolean>(false);
	const [ isLoading, setIsLoading ] = useState<boolean>(true);
	
	// data
	const [ idea, setIdea ] = useState<IIdea>();
	const [ users, setUsers ] = useState<IUser[]>([]);
	const [ sets, setSets ] = useState<IWorkSet[]>([]);
	
	// fetch all required data
	useEffect(() => {
		(async () => {
			try {
				setIsLoading(true);
				const [ ideaRes, usersRes, setsRes ] = await axios.all<DataJsonResponse | TableDataJsonResponse>([
					Axios(accessToken).get<DataJsonResponse<IIdea>>("/ideas/" + id),
					Axios(accessToken).get<TableDataJsonResponse<IUser[]>>("/users"),
					Axios(accessToken).get<TableDataJsonResponse<IWorkSet[]>>("/sets"),
				]);
				
				if (isStatusOk(ideaRes)) setIdea({ ...ideaRes.data, id, subject: ideaRes.data.subject.split(", ") });
				else throw responseFail(ideaRes);
				if (isStatusOk(usersRes)) setUsers(usersRes.data.data);
				else throw responseFail(usersRes);
				if (isStatusOk(setsRes)) setSets(setsRes.data.data);
				else throw responseFail(setsRes);
			} catch (error) {
				toast.error(responseError(error).message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [ accessToken ]);
	
	// initial form values
	const initialValues: { [K in keyof IWork]: any } = {
		name: idea?.name,
		description: idea?.description,
		resources: idea?.resources,
		subject: idea?.subject,
		authorId: userId,
		managerId: "",
		setId: "",
		className: "",
	};
	
	// validation schema
	const validationSchema = yup.object().shape({
		name: yup.string().required("Název zadání je požadován"),
		description: yup.string().required("Podrobný popis zadání práce je požadován"),
		resources: yup.string().required("Prostředky potřebné pro vyhotovení práce jsou požadovány"),
		subject: yup.array().required("Předmět pod který práce spadá je požadován").nullable(true),
		className: yup.string().required("Třída studenta vypracovávajícího práci je požadována"),
		setId: yup.mixed().required("Sada prací do které práce spadá je požadována"),
		managerId: yup.mixed().required("Vedoucí práce je požadován"),
		authorId: yup.mixed().required("Autor vypracovávající práci je požadován")
	} as { [K in keyof IWork]: any });
	
	// on submit hook
	const onSubmit: InitWorkPropOnSubmit = async (values: IWork, { setSubmitting }) => {
		try {
			setSubmitting(true);
			const res: AxiosResponse<DataJsonResponse<IWorkFull>> = await Axios(accessToken)
				.post<DataJsonResponse<IWorkFull>>("/works", {
					Name: values.name,
					Description: values.description,
					Resources: values.resources,
					Subject: Array.isArray(values.subject) ? values.subject.join(", ") : values.subject,
					ClassName: values.className,
					UserId: userId,
					AuthorId: values.authorId,
					ManagerId: values.managerId,
					SetId: values.setId,
				});
			
			if (isStatusOk(res)) {
				toast.success("Zadání z námětu bylo úspěšně vytvořeno.");
				console.log(res);
				history.push(`/works/detail/${ res.data.id }`);
			} else throw responseFail(res);
		} catch (error) {
			setSubmitting(false);
			toast.error(responseError(error).message);
		}
	};
	
	return (
		<LoadingOverlay active={ isLoading || !idea } tag={ Card }>
			<CardHeader>Vytořit zadání z námětu &quot;{ idea?.name }&ldquo;</CardHeader>
			{
				idea ? (
					<CardBody>
						<Formik
							initialValues={ initialValues }
							validationSchema={ validationSchema }
							onSubmit={ onSubmit }>
							{
								({ isSubmitting, errors, touched, values, getFieldMeta }: InitWorkFormikProps) => {
									setIsLoading(isSubmitting);
									return (
										<Form id="init-work">
											<Row>
												{/* Name */ }
												<Col md={ 6 }>
													<FormGroup>
														<Label for="name">Název</Label>
														<Input type="text"
														       invalid={ getFieldMeta("name").touched && !!errors.name }
														       tag={ Field }
														       name="name"
														       disabled />
														<ErrorMessage name="name">{ (msg) =>
															<FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
														<FormText className={ classnames({ "d-none": !showHelp }) }>Název námětu</FormText>
													</FormGroup>
												</Col>
												
												{/* Resources */ }
												<Col md={ 6 }>
													<FormGroup>
														<Label for="resources">Zdroje</Label>
														<Input type="text"
														       invalid={ getFieldMeta("resources").touched && !!errors.resources }
														       tag={ Field }
														       name="resources"
														       disabled />
														<ErrorMessage name="resources">{ (msg) =>
															<FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
														<FormText className={ classnames({ "d-none": !showHelp }) }>Očekávané zdroje</FormText>
													</FormGroup>
												</Col>
												
												{/* Subject */ }
												<Col md={ 6 }>
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
												
												{/* Class Name */ }
												<Col md={ 6 }>
													<FormGroup>
														<Label for="className">Třída</Label>
														<Field name="className"
														       component={ RSFInput }
														       creatable={ true }
														       invalid={ getFieldMeta("className").touched && !!errors.className }
														       options={
															       enumToArray(ClassName).map((className) => {
																       return {
																	       value: className.key,
																	       label: className.value
																       };
															       })
														       } />
														<ErrorMessage name="className">{ (msg) =>
															<FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
														<FormText className={ classnames({ "d-none": !showHelp }) }>Název třídy</FormText>
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
														       name="description"
														       disabled />
														<ErrorMessage name="description">{ (msg) =>
															<FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
														<FormText className={ classnames({ "d-none": !showHelp }) }>Popis námětu</FormText>
													</FormGroup>
												</Col>
												
												{/* Author */ }
												<Col md={ 4 }>
													<FormGroup>
														<Label for="authorId">Author práce</Label>
														<Field name="authorId"
														       component={ RSFInput }
														       invalid={ getFieldMeta("authorId").touched && !!errors.authorId }
														       options={
															       users.map((user) => {
																       return {
																	       value: user.id,
																	       label: name(user.name)
																       };
															       })
														       } />
														<ErrorMessage name="authorId">{ (msg) =>
															<FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
														<FormText className={ classnames({ "d-none": !showHelp }) }>Autor práce</FormText>
													</FormGroup>
												</Col>
												
												{/* Manager */ }
												<Col md={ 4 }>
													<FormGroup>
														<Label for="managerId">Vedoucí práce</Label>
														<Field name="managerId"
														       component={ RSFInput }
														       invalid={ getFieldMeta("managerId").touched && !!errors.managerId }
														       options={
															       users.filter((user) => user.canBeEvaluator).map((user) => {
																       return {
																	       value: user.id,
																	       label: name(user.name)
																       };
															       })
														       } />
														<ErrorMessage name="managerId">{ (msg) =>
															<FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
														<FormText className={ classnames({ "d-none": !showHelp }) }>Vedoucí práce</FormText>
													</FormGroup>
												</Col>
												
												{/* Set */ }
												<Col md={ 4 }>
													<FormGroup>
														<Label for="setId">Sada prací</Label>
														<Field name="setId"
														       component={ RSFInput }
														       invalid={ getFieldMeta("setId").touched && !!errors.setId }
														       options={
															       sets.map((set) => {
																       return { value: set.id, label: set.name };
															       })
														       } />
														<ErrorMessage name="setId">{ (msg) =>
															<FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
														<FormText className={ classnames({ "d-none": !showHelp }) }>Sada prací</FormText>
													</FormGroup>
												</Col>
												
												{/* Form Footer */ }
												<Col sm={ 12 }>
													<FormGroup className="d-flex flex-wrap justify-content-between align-items-center mb-0 mt-5">
														{/* Buttons */ }
														<div className="form-footer-buttons">
															<Button className="button button-primary"
															        type="submit"
															        disabled={ isSubmitting }>
																<span>{ !isSubmitting ? "Vytvořit" : "Pracuji..." }</span>
															</Button>
														</div>
														
														{/* Help */ }
														<a className="link-muted"
														   href="#help"
														   id="help-button"
														   onClick={ (e) => {
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
											</Row>
										</Form>
									);
								}
							}
						</Formik>
					</CardBody>
				) : loading()
			}
		</LoadingOverlay>
	);
};

type InitWorkPropOnSubmit = (values: IWork, formikHelpers: FormikHelpers<IWork>) => void | Promise<any>;

interface InitWorkProps {
	history: History;
}

interface InitWorkFormikProps {
	isSubmitting: boolean;
	errors: FormikErrors<IWork>;
	touched: FormikTouched<IWork>;
	values: IWorkInit;
	setFieldValue(field: string, value: any, shouldValidate?: boolean): void;
	setFieldError(field: string, message: string): void;
	getFieldMeta<Value>(name: string): FieldMetaProps<Value>;
}

export default withRouter(WorkFormInit);
