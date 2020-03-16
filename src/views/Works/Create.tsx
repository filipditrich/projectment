import { Field, Formik } from "formik";
import * as yup from "yup";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, withRouter } from "react-router";
import { toast } from "react-toastify";
import {
	Button,
	Card,
	CardBody, CardFooter,
	CardHeader,
	Input,
	UncontrolledTooltip,
} from "reactstrap";
import { RSFInput } from "../../components/common/CustomSelect";
import { FormFields } from "../../components/common/FormFields";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import ClassName from "../../models/className";
import { FormikOnSubmit, UseFormikProps } from "../../models/formik";
import { IIdea, IIdeaGoal, IIdeaOutline } from "../../models/idea";
import { DataJsonResponse, NoContentResponse, TableDataJsonResponse } from "../../models/response";
import Subject from "../../models/subject";
import { IUser } from "../../models/user";
import { IWork, IIdeaInit, IWorkSet } from "../../models/work";
import { useAppContext } from "../../providers";
import { Axios, enumToArray, name } from "../../utils";
import { History } from "history";
import { handleRes, responseError } from "../../utils/axios";
import { genInitialValues, genValidationSchema, IFieldConfig } from "../../utils/form";
import { transformForAPI, transformFromAPI } from "../../utils/transform";
import axios from "axios";

/**
 * Work from Idea Component
 * @param history
 * @constructor
 */
export const WorkCreate: React.FC<InitWorkProps> = ({ history }: InitWorkProps) => {
	const { id } = useParams(); if (!id) throw new Error("No Id present!"); // shouldn't happen at all
	const [ { accessToken, userId } ] = useAppContext();
	const [ showHelp, setShowHelp ] = useState<boolean>(false);
	const [ isLoading, setIsLoading ] = useState<boolean>(true);
	
	// data
	const [ idea, setIdea ] = useState<IIdea>();
	const [ goals, setGoals ] = useState<IIdeaGoal[]>([]);
	const [ outlines, setOutlines ] = useState<IIdeaOutline[]>([]);
	const [ users, setUsers ] = useState<IUser[]>([]);
	const [ sets, setSets ] = useState<IWorkSet[]>([]);
	
	// fetch all required data
	useEffect(() => {
		(async () => {
			try {
				setIsLoading(true);
				const [
					ideaRes,
					goalsRes,
					outlinesRes,
					usersRes,
					setsRes
				] = handleRes(...await axios.all<DataJsonResponse | TableDataJsonResponse>([
					Axios(accessToken).get<DataJsonResponse<IIdea>>(`/ideas/${ id }`),
					Axios(accessToken).get<DataJsonResponse<IIdeaGoal[]>>(`/ideas/${ id }/goals`),
					Axios(accessToken).get<DataJsonResponse<IIdeaOutline[]>>(`/ideas/${ id }/outlines`),
					Axios(accessToken).get<TableDataJsonResponse<IUser[]>>("/users"),
					Axios(accessToken).get<TableDataJsonResponse<IWorkSet[]>>("/sets"),
				]));
				
				setIdea(transformFromAPI(ideaRes.data, id));
				setGoals(goalsRes.data);
				setOutlines(outlinesRes.data);
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
	const config: IFieldConfig<IIdeaInit> = useMemo<IFieldConfig<IIdeaInit>>((): IFieldConfig<IIdeaInit> => {
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
				field: ({ getFieldMeta }: UseFormikProps<IIdeaInit>, options) => (
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
				column: { md: 6 },
			},
			className: {
				value: "",
				title: "Třída",
				helpMessage: "Třída vypracovávajícího studenta",
				yup: yup.string().required("Třída studenta vypracovávajícího práci je požadována"),
				field: ({ getFieldMeta }: UseFormikProps<IIdeaInit>, options) => (
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
				column: { md: 6 },
			},
			description: {
				value: idea?.description || "",
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
			authorId: {
				value: userId,
				title: "Autor práce",
				helpMessage: "Autor vypracovávající práci",
				yup: yup.string().required("Autor vypracovávající práci je požadován"),
				field: ({ getFieldMeta }: UseFormikProps<IIdeaInit>, options) => (
					<Field name="authorId"
					       component={ RSFInput }
					       invalid={ getFieldMeta("authorId").touched && getFieldMeta("authorId") }
					       options={ users.map((user) => ({ value: user.id, label: name(user.name) })) }
					       { ...options } />
				),
				column: { md: 4 },
			},
			managerId: {
				value: "",
				title: "Vedoucí práce",
				helpMessage: "Uživatel který povede práci",
				yup: yup.string().required("Vedoucí práce je požadován"),
				field: ({ getFieldMeta }: UseFormikProps<IIdeaInit>, options) => (
					<Field name="managerId"
					       component={ RSFInput }
					       invalid={ getFieldMeta("managerId").touched && getFieldMeta("managerId") }
					       options={ users.map((user) => ({ value: user.id, label: name(user.name) })) }
					       { ...options } />
				),
				column: { md: 4 },
			},
			setId: {
				value: 0,
				title: "Sada prací",
				helpMessage: "Sada prací, do které by zadání spadalo",
				yup: yup.number().required("Sada prací do které práce spadá je požadována"),
				field: ({ getFieldMeta }: UseFormikProps<IIdeaInit>, options) => (
					<Field name="setId"
					       component={ RSFInput }
					       invalid={ getFieldMeta("setId").touched && !!getFieldMeta("setId").error }
					       options={ sets.map((set) => ({ value: set.id, label: set.name })) }
					       { ...options } />
				),
				column: { md: 4 },
			},
		};
	}, [ idea, users, sets ]);
	
	// initial values
	const initialValues = genInitialValues<IIdeaInit>(config);
	
	// validation schema
	const validationSchema = genValidationSchema(config);
	
	// on submit hook
	const onSubmit: FormikOnSubmit<IIdeaInit> = async (values: IIdeaInit, { setSubmitting }) => {
		try {
			setSubmitting(true);
			const [ res ] = handleRes<DataJsonResponse<IWork>>(await Axios(accessToken)
				.post<DataJsonResponse<IWork>>("/works", {
					...transformForAPI({ ...idea, ...values }),
				}));
			
			// post goals and outlines as well
			handleRes<DataJsonResponse<NoContentResponse>>(...await axios.all([
				Axios(accessToken).put<DataJsonResponse<NoContentResponse>>(`/works/${ res.data.id }/goals`,
					goals.map((goal) => ({ Text: goal.text }))),
				Axios(accessToken).put<DataJsonResponse<NoContentResponse>>(`/works/${ res.data.id }/outlines`,
					outlines.map((outline) => ({ Text: outline.text }))),
			]));
			
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
				(props: UseFormikProps<IIdeaInit>) => (
					<LoadingOverlay active={ isLoading } tag={ Card }>
						<CardHeader>Vytvoření zadání z námětu</CardHeader>
						<CardBody>
							<FormFields isEditing={ true } config={ config } props={ props } showHelp={ showHelp } id="work-from-idea"/>
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
							<span className="link-muted ml-auto"
							      id="help-button"
							      onClick={ () => setShowHelp(!showHelp) }>
								<span>Nápověda</span>
							</span>
							<UncontrolledTooltip placement="top" target="help-button">
								Zobrazit nápovědu k formuláři
							</UncontrolledTooltip>
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

export default withRouter(WorkCreate);
