import React from "react";
import { toast } from "react-toastify";
import { withRouter } from "react-router";
import { Button } from "reactstrap";
import { History } from "history";
import { IIdea, IIdeaInit } from "../../models/idea";
import { useAppContext } from "../../providers";
import { Axios, isStatusOk } from "../../utils";
import { AxiosResponse } from "axios";
import { responseError, responseFail } from "../../utils/axios";
import IdeaForm, { IdeaFormPropOnSubmit, IdeaFormPropValidate } from "./Form";

/**
 * Create Idea Component
 * @constructor
 */
export const IdeaCreate: React.FC<IdeaCreateProps> = ({ history }: IdeaCreateProps) => {
	const [{ accessToken, userId }] = useAppContext();
	
	// initial values
	const initialValues: IIdeaInit = {
		name: "",
		description: "",
		resources: "",
		participants: 1,
		subject: "",
		offered: false,
	};
	
	// hooks
	const validate: IdeaFormPropValidate = (values: IIdeaInit) => {
		const errors: any = {};
		if (!values.name) errors.name = "Vyplňte název námětu";
		if (!values.description) errors.description = "Vyplňte popis námětu";
		if (!values.resources) errors.resources = "Vyplňte očekávané zdroje";
		if (values.participants === null || !values.participants) errors.participants = "Vyplňte počet autorů";
		if (!values.subject) errors.subject = "Vyplňte zkratu předmětu, do kterého by zadání spadalo";
		return errors;
	};
	const onSubmit: IdeaFormPropOnSubmit = async (values: IIdeaInit, { setSubmitting }) => {
		try {
			setSubmitting(true);
			const res: AxiosResponse<IIdea> = await Axios(accessToken)
				.post("/ideas", {
					Name: values.name,
					Description: values.description,
					Resources: values.resources,
					Participants: values.participants,
					Subject: values.subject,
					Offered: values.offered,
					UserId: userId
				});
			
			if (isStatusOk(res)) {
				toast.success("Námět byl úspěšně vytvořen.");
				history.push("/ideas/list/" + res.data.id);
			} else throw responseFail(res);
		} catch (error) {
			toast.error(responseError(error).message);
		} finally {
			setSubmitting(false);
		}
	};
	
	// footer buttons
	const buttons = (isSubmitting: boolean) => (
		<Button className="button button-primary button-reverse"
		        type="submit"
		        disabled={ isSubmitting }>
			<span>{ !isSubmitting ? "Vytvořit" : "Pracuji..." }</span>
		</Button>
	);
	
	return (
		<IdeaForm
			initialValues={ initialValues }
			validate={ validate }
			onSubmit={ onSubmit }
			buttons={ buttons }
		/>
	);
};

export interface IdeaCreateProps {
	history: History;
}

export default withRouter(IdeaCreate);
