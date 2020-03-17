import { ErrorMessage, Field, Formik } from "formik";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
	Button,
	CardBody,
	CardFooter,
	CardHeader,
	Form,
	FormFeedback,
	FormGroup, FormText,
	Input,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	Label,
	Table, UncontrolledTooltip,
} from "reactstrap";
import * as yup from "yup";
import { SubmitButton } from "../../../components/common/SubmitButton";
import { FormikOnSubmit, UseFormikProps } from "../../../models/formik";
import { DataJsonResponse, NoContentResponse } from "../../../models/response";
import { IWork, IWorkCosts, IWorkState } from "../../../models/work";
import { useAppContext } from "../../../providers";
import { Axios } from "../../../utils";
import { handleRes, responseError } from "../../../utils/axios";
import { transformForAPI } from "../../../utils/transform";

/**
 * Work Costs Component
 * @param work
 * @param state
 * @param fetcher
 * @constructor
 */
export const WorkCosts: React.FC<WorkCostsProps> = ({ work, state, fetcher }: WorkCostsProps) => {
	const [ isEditing, setIsEditing ] = useState<boolean>(false);
	const [ { accessToken } ] = useAppContext();
	
	// initial values
	const initialValues: { [key in keyof IWorkCosts]: IWorkCosts[key] } = {
		materialCosts: work?.materialCosts || 0,
		materialCostsProvidedBySchool: work?.materialCostsProvidedBySchool || 0,
		servicesCosts: work?.servicesCosts || 0,
		servicesCostsProvidedBySchool: work?.servicesCostsProvidedBySchool || 0,
		detailExpenditures: work?.detailExpenditures || "",
	};
	
	// validation schema
	const validationSchema = yup.object().shape<IWorkCosts>({
		materialCosts: yup.number().required().min(0),
		materialCostsProvidedBySchool: yup.number().required().min(0),
		servicesCosts: yup.number().required().min(0),
		servicesCostsProvidedBySchool: yup.number().required().min(0),
		detailExpenditures: yup.string().notRequired(),
	});
	
	// whether the user can edit or not
	const canEdit: boolean = state?.code === 0;
	
	// save changes hook
	const saveChanges: FormikOnSubmit<IWorkCosts> = async (values, { setSubmitting }) => {
		try {
			setSubmitting(true);
			handleRes<DataJsonResponse<NoContentResponse>>(
				await Axios(accessToken).put(`/works/${ work?.id }`, {
					...transformForAPI({ ...work, ...values }),
				})
			);
			toast.success("Náklady práce byly úspěšně uloženy.");
			fetcher();
		} catch (error) {
			toast.error(responseError(error).message);
		} finally {
			setIsEditing(false);
			setSubmitting(false);
		}
	};
	
	return (
		<Formik
			initialValues={ initialValues }
			validationSchema={ validationSchema }
			enableReinitialize={ true }
			onSubmit={ saveChanges }>
			{
				(props: UseFormikProps<IWorkCosts>) => (
					<>
						<CardHeader className="d-flex justify-content-between">
							<span>Náklady</span>
							{
								canEdit ? (
									<>
										<button className="reset-button"
										        id="edit-costs"
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
										                     target="edit-costs">Upravit náklady</UncontrolledTooltip>
									</>
								) : null
							}
						</CardHeader>
						<CardBody>
							<p className="text-muted">Náklady potřebné k vyhotovení všech cílů práce.</p>
							<Form id="work-costs">
								<Table bordered responsive>
									<thead>
									<tr>
										<th />
										<th>Celkové</th>
										<th>Hrazené školou</th>
									</tr>
									</thead>
									<tbody>
									{/* Material Costs */ }
									<tr>
										<th scope="row">Výrobní náklady</th>
										{
											isEditing ? (
												<>
													<td>
														<InputGroup className="flex-nowrap">
															<Input type="number"
															       invalid={ props.getFieldMeta("materialCosts").touched && !!props.getFieldMeta("materialCosts").error }
															       tag={ Field }
															       name="materialCosts"
															/>
															<InputGroupAddon addonType="append">
																<InputGroupText>Kč</InputGroupText>
															</InputGroupAddon>
														</InputGroup>
													</td>
													<td>
														<InputGroup className="flex-nowrap">
															<Input type="number"
															       invalid={ props.getFieldMeta("materialCostsProvidedBySchool").touched && !!props.getFieldMeta("materialCostsProvidedBySchool").error }
															       tag={ Field }
															       name="materialCostsProvidedBySchool"
															/>
															<InputGroupAddon addonType="append">
																<InputGroupText>Kč</InputGroupText>
															</InputGroupAddon>
														</InputGroup>
													</td>
												</>
											) : (
												<>
													<td><b>{ Number(work?.materialCosts).toLocaleString("cs") }</b> Kč
													</td>
													<td>
														<b>{ Number(work?.materialCostsProvidedBySchool).toLocaleString("cs") }</b> Kč
													</td>
												</>
											)
										}
									</tr>
									
									
									{/* Services Costs */ }
									<tr>
										<th scope="row">Náklady na služby</th>
										{
											isEditing ? (
												<>
													<td>
														<InputGroup className="flex-nowrap">
															<Input type="number"
															       invalid={ props.getFieldMeta("servicesCosts").touched && !!props.getFieldMeta("servicesCosts").error }
															       tag={ Field }
															       name="servicesCosts"
															/>
															<InputGroupAddon addonType="append">
																<InputGroupText>Kč</InputGroupText>
															</InputGroupAddon>
														</InputGroup>
													</td>
													<td>
														<InputGroup className="flex-nowrap">
															<Input type="number"
															       invalid={ props.getFieldMeta("servicesCostsProvidedBySchool").touched && !!props.getFieldMeta("servicesCostsProvidedBySchool").error }
															       tag={ Field }
															       name="servicesCostsProvidedBySchool"
															/>
															<InputGroupAddon addonType="append">
																<InputGroupText>Kč</InputGroupText>
															</InputGroupAddon>
														</InputGroup>
													</td>
												</>
											) : (
												<>
													<td><b>{ Number(work?.servicesCosts).toLocaleString("cs") }</b> Kč
													</td>
													<td>
														<b>{ Number(work?.servicesCostsProvidedBySchool).toLocaleString("cs") }</b> Kč
													</td>
												</>
											)
										}
									</tr>
									
									{/* Total */ }
									{
										work ? (
											<tr>
												<th scope="row">Celkové náklady</th>
												<td>
													<b>{ Number(work.materialCosts + work.servicesCosts).toLocaleString("cs") }</b> Kč
												</td>
												<td>
													<b>{ Number(work.materialCostsProvidedBySchool + work.servicesCostsProvidedBySchool).toLocaleString("cs") }</b> Kč
												</td>
											</tr>
										) : null
									}
									</tbody>
								</Table>
								
								{/* Detail Expenditures */ }
								<FormGroup>
									{
										isEditing ? (
											<>
												<hr />
												<Label for="detailExpenditures">Detail Expenditures</Label>
												<Input type="text"
												       invalid={ props.getFieldMeta("detailExpenditures").touched && !!props.getFieldMeta("detailExpenditures").error }
												       tag={ Field }
												       name="detailExpenditures"
												/>
												<ErrorMessage name="detailExpenditures">{ (msg) =>
													<FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
												<FormText>Detail Expenditures Help Message</FormText>
											</>
										) : work?.detailExpenditures ? (
											<>
												<hr />
												<dt>Detail Expenditures</dt>
												<dd>{ work?.detailExpenditures }</dd>
											</>
										) : null
									}
								</FormGroup>
							</Form>
						</CardBody>
						{
							canEdit && isEditing ? (
								<CardFooter className="d-flex flex-wrap align-items-center">
									<SubmitButton passiveText="Uložit"
									              activeText="Ukládám"
									              type="primary"
									              props={ { form: "work-costs", type: "submit" } }
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
								</CardFooter>
							) : null
						}
					</>
				)
			}
		</Formik>
	);
};

export interface WorkCostsProps {
	work?: IWork;
	state?: IWorkState;
	fetcher: () => void;
}

export default WorkCosts;
