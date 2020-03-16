import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button, CardBody, CardHeader, FormFeedback, UncontrolledTooltip } from "reactstrap";
import ConfirmationWrapper from "../../../components/common/ConfirmationWrapper";
import { RSFInput } from "../../../components/common/CustomSelect";
import { FormikOnSubmit, UseFormikProps } from "../../../models/formik";
import { DataJsonResponse } from "../../../models/response";
import { IWork, IWorkState, IWorkStateIn } from "../../../models/work";
import { useAppContext } from "../../../providers";
import { Axios } from "../../../utils";
import { handleRes, responseError } from "../../../utils/axios";
import { stateName } from "../../../utils/name";

/**
 * Work State Component
 * @param work
 * @param state
 * @param nextStates
 * @param allStates
 * @param fetcher
 * @constructor
 */
export const WorkState: React.FC<WorkStateProps> = ({ work, state, nextStates, allStates, fetcher }: WorkStateProps) => {
	const [ isEditing, setIsEditing ] = useState<boolean>(false);
	const [{ accessToken }] = useAppContext();
	
	// initial form values
	const initialValues: IWorkStateIn = {
		state: state?.code.toString() || "0",
	};
	
	// onSubmit hook
	const onSubmit: FormikOnSubmit<IWorkStateIn> = async (values: IWorkStateIn, { setSubmitting, resetForm }) => {
		try {
			setSubmitting(true);
			handleRes<DataJsonResponse<IWorkState>>(
				await Axios(accessToken).put(`/works/${ work?.id }/state`, nextStates.find((_state) => _state.code.toString() === values.state.toString())));
			toast.success("Stav práce byl úspěšně změněn.");
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
	// TODO: is this correct?
	const canEdit: boolean = state?.code === 0;
	
	return (
		<Formik
			initialValues={ initialValues }
			enableReinitialize={ true }
			validate={
				(values: IWorkStateIn) => {
					return {
						state: !values.state
							? "Stav práce je požadován"
							: [ ...nextStates, state ].findIndex((_state) => _state?.code.toString() === values.state.toString()) === -1
								? "Neplatný stav práce"
								: undefined,
					};
				}
			}
			onSubmit={ onSubmit }>
			{
				(props: UseFormikProps<IWorkStateIn>) => (
					<>
						<CardHeader className="d-flex justify-content-between">
							<span>Stav práce</span>
							{
								canEdit ? (
									<>
										<button className="reset-button"
										        id="edit-state"
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
										                     target="edit-state">Změnit stav práce</UncontrolledTooltip>
									</>
								) : null
							}
						</CardHeader>
						<CardBody>
							<Form>
								{
									isEditing ? (
										<div className="d-flex flex-wrap align-items-center">
											<p className="mb-0">Tato práce je ve stavu:</p>
											<div className="ml-3 flex-grow-1">
												<div className="d-flex align-items-center">
													<Field name="state"
													       className="flex-grow-1"
													       component={ RSFInput }
													       invalid={ props.getFieldMeta("state").touched && !!props.getFieldMeta("state").error }
													       options={ allStates.map((_state) => ({
														       value: _state.code.toString(),
														       label: stateName(_state.code),
														       isDisabled: ![ ...nextStates, state ].find((nextState) => _state.code === nextState?.code),
													       })) } />
													{
														props.values.state.toString() !== state?.code.toString() ? (
															<ConfirmationWrapper
																onPositive={
																	async (setDialogOpen, setIsWorking) => {
																		setIsWorking(true);
																		await onSubmit(props.values, props);
																	}
																}
																onNegative={ () => { props.resetForm(); setIsEditing(false); } }
																dialogTitle="Změna stavu práce"
																dialogContent={ <>Opravdu si přejete změnit stav práce ze stavu <b>{ stateName(state?.code) }</b> do stavu <b>{ stateName(allStates.find((_state) => _state.code.toString() === props.values.state.toString())?.code) }</b></> }
																type="primary">
																<Button className="button-icon circular ml-3"
																        color="success">
																	<i className="fa fa-check" />
																</Button>
															</ConfirmationWrapper>
														) : (
															<Button className="button-icon circular ml-3"
															        onClick={ () => { props.resetForm(); setIsEditing(false); } }
															        color="secondary">
																<i className="fa fa-close" />
															</Button>
														)
													}
												</div>
												<ErrorMessage name="state">{ (msg) => <FormFeedback>{ msg }</FormFeedback> }</ErrorMessage>
											</div>
										</div>
									) : (
										<p className="mb-0">Tato práce je ve stavu <b>{ stateName(state?.code) }</b>.</p>
									)
								}
							</Form>
						</CardBody>
					</>
				)
			}
		</Formik>
	);
};

export interface WorkStateProps {
	work?: IWork;
	state?: IWorkState;
	nextStates: IWorkState[];
	allStates: IWorkState[];
	fetcher: () => void;
}

export default WorkState;
