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
import IdeaForm, { IdeaFormPropOnSubmit } from "./Form";

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
				history.push("/ideas/detail/" + res.data.id);
			} else throw responseFail(res);
		} catch (error) {
			toast.error(responseError(error).message);
			setSubmitting(false);
		}
	};
	
	// footer buttons
	const buttons = (isSubmitting: boolean) => (
		<Button className="button button-primary"
		        type="submit"
		        disabled={ isSubmitting }>
			<span>{ !isSubmitting ? "Vytvořit" : "Pracuji..." }</span>
		</Button>
	);
	
	return (
		<IdeaForm
			initialValues={ initialValues }
			onSubmit={ onSubmit }
			buttons={ buttons }
		/>
	);
};

export interface IdeaCreateProps {
	history: History;
}

export default withRouter(IdeaCreate);
