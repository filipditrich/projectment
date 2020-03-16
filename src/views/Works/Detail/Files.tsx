import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
	Button,
	CardBody, CardFooter,
	CardHeader, FormFeedback, FormGroup, FormText, Input, Label, UncontrolledTooltip,
} from "reactstrap";
import { FormikOnSubmit, UseFormikProps } from "../../../models/formik";
import { DataJsonResponse } from "../../../models/response";
import { IWork, IWorkFiles, IWorkState } from "../../../models/work";
import { useAppContext } from "../../../providers";
import { Axios } from "../../../utils";
import { handleRes, responseError } from "../../../utils/axios";
import * as yup from "yup";
import { transformForAPI } from "../../../utils/transform";

// @ts-ignore
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import download from "downloadjs";

/**
 * Work Files Component
 * @param work
 * @param state
 * @param fetcher
 * @constructor
 */
export const WorkFiles: React.FC<WorkFilesProps> = ({ work, state, fetcher }: WorkFilesProps) => {
	const [ isEditing, setIsEditing ] = useState<boolean>(false);
	const [ { accessToken } ] = useAppContext();
	
	// form initial values
	const initialValues: IWorkFiles = {
		repositoryURL: work?.repositoryURL || "",
	};
	
	// form validation schema
	const validationSchema: any = yup.object().shape({
		repositoryURL: yup.string().notRequired(),
	});
	
	// onSubmit hook
	const onSubmit: FormikOnSubmit<IWorkFiles> = async (values: IWorkFiles, { setSubmitting, resetForm }) => {
		try {
			setSubmitting(true);
			handleRes<DataJsonResponse<IWorkState>>(
				await Axios(accessToken).put(`/works/${ work?.id }`, {
					...transformForAPI(work), ...values,
				}));
			toast.success("Odkaz na repozitář práce byl úspěšně změněn.");
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
	const canEdit: boolean = state?.code === 0;
	
	// file download hook
	// TODO
	const downloadFile = (type: "application") => {
		(async () => {
			try {
				const [ res ] = handleRes(await Axios(accessToken).get<any>(`/works/${ work?.id }/${ type }`));
				const tab: Window = window.open("", "Přihláška", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=200,top=" + (window.screen.height - 400) + ",left=" + (window.screen.width - 840)) as Window;
				tab.document.body.innerHTML = res.data;
				tab.focus();
				// window.html2canvas = html2canvas;
				// const doc = new jsPDF();
				// doc.html(res.data, {
				// 	callback: (doc: any) => {
				// 		doc.save();
				// 	},
				// });
			} catch (error) {
				console.log(error);
			}
		})();
	};
	
	return (
		<Formik
			initialValues={ initialValues }
			validationSchema={ validationSchema }
			enableReinitialize={ true }
			onSubmit={ onSubmit }>
			{
				(props: UseFormikProps<IWorkFiles>) => (
					<>
						<CardHeader className="d-flex justify-content-between">
							<span>Soubory</span>
							{
								canEdit ? (
									<>
										<button className="reset-button"
										        id="edit-files"
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
										                     target="edit-files">Upravit soubory</UncontrolledTooltip>
									</>
								) : null
							}
						</CardHeader>
						<CardBody>
							<p className="text-muted">Zde si můžete stáhnout různé potřebné soubory k práci.</p>
							<div className="button-container">
								<Button className="button button-secondary"
								        onClick={ () => downloadFile("application") }>
									<span>Přihláška</span>
								</Button>
								
								<Button className="button button-secondary" disabled>
									<span>Posudek</span>
								</Button>
								
								<Button className="button button-secondary" disabled>
									<span>Kompletní posudek</span>
								</Button>
								
								<Button className="button button-secondary" disabled>
									<span>Posudek se známkami</span>
								</Button>
							</div>
							
							<Form id="work-files">
								<FormGroup>
									{
										isEditing ? (
											<>
												<hr />
												<Label for="repositoryURL">Repozitář práce</Label>
												<Input type="url"
												       invalid={ props.getFieldMeta("repositoryURL").touched && !!props.getFieldMeta("repositoryURL").error }
												       tag={ Field }
												       name="repositoryURL"
												/>
												<ErrorMessage name="repositoryURL">{ (msg) =>
													<FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
												<FormText>Odkaz na repozitář s prací</FormText>
											</>
										) : work?.repositoryURL ? (
											<>
												<hr />
												<dt>Repozitář práce</dt>
												<dd className="mt-2">
													<a href={ work?.repositoryURL }
													   target="_blank"
													   rel="noopener noreferrer">
														<i className="icon-link mr-2" />
														{ work?.repositoryURL }
													</a>
												</dd>
											</>
										) : null
									}
								</FormGroup>
							</Form>
						</CardBody>
						{
							canEdit && isEditing ? (
								<CardFooter className="d-flex flex-wrap align-items-center">
									<Button className="button button-primary"
									        form="work-files"
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
								</CardFooter>
							) : null
						}
					</>
				)
			}
		</Formik>
	);
};

export interface WorkFilesProps {
	work?: IWork;
	state?: IWorkState;
	fetcher: () => void;
}
