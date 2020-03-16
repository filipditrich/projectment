import { AxiosResponse } from "axios";
import classnames from "classnames";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as yup from "yup";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, withRouter } from "react-router";
import { toast } from "react-toastify";
import {
	Button,
	Card,
	CardBody, CardFooter,
	CardHeader, Col,
	FormFeedback,
	FormGroup,
	FormText,
	Input,
	Label, Row,
	Tooltip,
} from "reactstrap";
import { RSFInput } from "../../components/common/CustomSelect";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import ClassName from "../../models/className";
import { FormikOnSubmit, UseFormikProps } from "../../models/formik";
import { IIdea } from "../../models/idea";
import { DataJsonResponse, TableDataJsonResponse } from "../../models/response";
import Subject from "../../models/subject";
import { IUser } from "../../models/user";
import { IWork, IWorkBase, IWorkInfo, IWorkSet } from "../../models/work";
import { useAppContext } from "../../providers";
import { Axios, enumToArray, name } from "../../utils";
import axios from "axios";
import { History } from "history";
import { handleRes, responseError } from "../../utils/axios";
import { genInitialValues, genValidationSchema, IFieldConfig } from "../../utils/form";
import { transformForAPI, transformFromAPI } from "../../utils/transform";

/**
 * Work from Idea Component
 * @param history
 * @constructor
 */
export const WorkFormInit: React.FC<InitWorkProps> = ({ history }: InitWorkProps) => {
	const { id } = useParams(); if (!id) throw new Error("No Id present!"); // shouldn't happen at all
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
				const [
					ideaRes,
					usersRes,
					setsRes
				] = handleRes(...await axios.all<DataJsonResponse | TableDataJsonResponse>([
					Axios(accessToken).get<DataJsonResponse<IIdea>>("/ideas/" + id),
					Axios(accessToken).get<TableDataJsonResponse<IUser[]>>("/users"),
					Axios(accessToken).get<TableDataJsonResponse<IWorkSet[]>>("/sets"),
				]));
				
				setIdea(transformFromAPI(ideaRes.data, id));
				setSets(setsRes.data.data);
				setUsers(usersRes.data.data);
			} catch (error) {
				toast.error(responseError(error).message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [ accessToken ]);
	
	// form configuration
	const config: IFieldConfig<IWorkBase> = useMemo<IFieldConfig<IWorkBase>>((): IFieldConfig<IWorkBase> => {
		return {
			name: {
				value: idea?.name || "",
				title: "Název",
				helpMessage: "Název zadání práce",
				yup: yup.string().required("Název zadání práce je požadován"),
				column: { md: 6 },
			},
			resources: {
				value: idea?.resources || "",
				title: "Prostředky",
				helpMessage: "Prostředky potřebné pro zpracování práce",
				yup: yup.string().required("Prostředky pro práci jsou požadovány"),
				column: { md: 6 },
			},
			subject: {
				value: idea?.subject || [],
				title: (idea?.subject || []).length > 0 ? "Předmět" : "Předměty",
				helpMessage: `Předmět${ (idea?.subject || []).length > 0 ? "y" : "" }, do kterého zadání práce spadá`,
				yup: yup.array().required(`Předmět${ (idea?.subject || []).length > 0 ? "y" : "" }, do kterého zadání práce spadá je požadován`).nullable(true),
				field: ({ getFieldMeta }: UseFormikProps<IWorkBase>) => (
					<Field creatable
					       isMulti
					       name="subject"
					       component={ RSFInput }
					       invalid={ getFieldMeta("subject").touched && !!getFieldMeta("subject").error }
					       options={ enumToArray(Subject).map((subject) => (
						       { value: subject.key, label: subject.value }))
					       } />
				),
				column: { md: 6 },
			},
			className: {
				value: "",
				title: "Třída",
				helpMessage: "Třída vypracovávajícího studenta",
				yup: yup.string().required("Třída studenta vypracovávajícího práci je požadována"),
				field: ({ getFieldMeta }: UseFormikProps<IWorkBase>) => (
					<Field name="className"
					       component={ RSFInput }
					       creatable={ true }
					       invalid={ getFieldMeta("className").touched && !!getFieldMeta("className").error }
					       options={
						       enumToArray(ClassName).map((className) => (
							       { value: className.key, label: className.value }
						       ))
					       } />
				),
				column: { md: 6 },
			},
			description: {
				value: idea?.description || "",
				title: "Popis zadání",
				helpMessage: "Popis zadání práce",
				yup: yup.string().required("Popis zadání práce je požadován"),
				field: ({ getFieldMeta }: UseFormikProps<IWorkBase>) => (
					<Input type="textarea"
					       invalid={ getFieldMeta("description").touched && !!getFieldMeta("description").error }
					       tag={ Field }
					       as="textarea"
					       rows={ 3 }
					       name="description" />
				),
			},
			authorId: {
				value: userId,
				title: "Autor práce",
				helpMessage: "Autor vypracovávající práci",
				yup: yup.string().required("Autor vypracovávající práci je požadován"),
				field: ({ getFieldMeta }: UseFormikProps<IWorkBase>) => (
					<Field name="authorId"
					       component={ RSFInput }
					       invalid={ getFieldMeta("authorId").touched && getFieldMeta("authorId") }
					       options={ users.map((user) => ({ value: user.id, label: name(user.name) })) } />
				),
				column: { md: 4 },
			},
			managerId: {
				value: "",
				title: "Vedoucí práce",
				helpMessage: "Uživatel který povede práci",
				yup: yup.string().required("Vedoucí práce je požadován"),
				field: ({ getFieldMeta }: UseFormikProps<IWorkBase>) => (
					<Field name="managerId"
					       component={ RSFInput }
					       invalid={ getFieldMeta("managerId").touched && getFieldMeta("managerId") }
					       options={ users.map((user) => ({ value: user.id, label: name(user.name) })) } />
				),
				column: { md: 4 },
			},
			setId: {
				value: 0,
				title: "Sada prací",
				helpMessage: "Sada prací, do které by zadání spadalo",
				yup: yup.number().required("Sada prací do které práce spadá je požadována"),
				field: ({ getFieldMeta }: UseFormikProps<IWorkBase>) => (
					<Field name="setId"
					       component={ RSFInput }
					       invalid={ getFieldMeta("setId").touched && !!getFieldMeta("setId").error }
					       options={ sets.map((set) => ({ value: set.id, label: set.name })) } />
				),
				column: { md: 4 },
			},
		};
	}, [ idea, users, sets ]);
	
	// initial values
	const initialValues = genInitialValues<IWorkBase>(config);
	
	// validation schema
	const validationSchema = genValidationSchema(config);
	
	// on submit hook
	const onSubmit: FormikOnSubmit<IWorkBase> = async (values: IWorkBase, { setSubmitting }) => {
		try {
			setSubmitting(true);
			const [ res ] = handleRes<DataJsonResponse<IWork>>(await Axios(accessToken)
				.post<DataJsonResponse<IWork>>("/works", {
					...transformForAPI({ ...idea, ...values }),
					// TODO: outlines, goals?
				}));
			toast.success("Zadání z námětu bylo úspěšně vytvořeno.");
			history.push(`/works/detail/${ res.data.id }`);
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
				(props: UseFormikProps<IWorkBase>) => (
					<LoadingOverlay active={ isLoading } tag={ Card }>
						<CardHeader>Vytvoření zadání z námětu</CardHeader>
						<CardBody>
							<Form id="work-from-idea">
								<Row>
									{/* Fields */ }
									{
										Object.keys(config).map((name, index) => {
											const field = config[name as keyof IWorkInfo];
											
											return (
												<Col key={ index } sm={ 12 } { ...field.column }>
													<FormGroup>
														<Label for={ name }>{ field.title }</Label>
														{
															field.field ? field.field(props) : (
																<Input type="text"
																       invalid={ props.getFieldMeta(name).touched && !!props.getFieldMeta(name).error }
																       tag={ Field }
																       name={ name }
																/>
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
						</CardBody>
						<CardFooter className="d-flex align-items-center justify-content-between">
							{/* Buttons */ }
							<div className="form-footer-buttons">
								<Button className="button button-primary"
								        type="submit"
								        form="work-from-idea"
								        disabled={ props.isSubmitting }>
									<span>{ props.isSubmitting ? "Working..." : "Vytvořit" }</span>
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
						</CardFooter>
					</LoadingOverlay>
				)
			}
		</Formik>
	);
};

interface InitWorkProps {
	history: History;
}

export default withRouter(WorkFormInit);
