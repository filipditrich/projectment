import React, { Dispatch, SetStateAction, useState } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "reactstrap";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import { IIdea, IIdeaInit } from "../../models/idea";
import { useAppContext } from "../../providers";
import { Axios, isStatusOk } from "../../utils";
import { responseError, responseFail } from "../../utils/axios";
import IdeaForm, { IdeaFormPropOnSubmit, IdeaFormPropValidate } from "./Form";

/**
 * Idea Editor Component
 * @constructor
 */
export const IdeaEditor: React.FC<IdeaEditorProps> = ({ idea, setEditing}: IdeaEditorProps) => {
	const [{ accessToken, userId }] = useAppContext();
	
	const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

	// initial values
	const initialValues: IIdeaInit = {
		name: idea.name,
		description: idea.description,
		resources: idea.resources,
		participants: idea.participants,
		subject: idea.subject,
		offered: idea.offered,
	};
	
	const onSubmit: IdeaFormPropOnSubmit = async (values: IIdeaInit, { setSubmitting }) => {
		try {
			setSubmitting(true);
			setIsSubmitting(true);
			const res: AxiosResponse<IIdea> = await Axios(accessToken)
				.put("/ideas" + idea.id, {
					Name: values.name,
					Description: values.description,
					Resources: values.resources,
					Participants: values.participants,
					Subject: values.subject,
					Offered: values.offered,
					UserId: userId
				});

			if (isStatusOk(res)) {
				toast.success("Námět byl úspěšně aktualizován.");
			} else throw responseFail(res);
		} catch (error) {
			toast.error(responseError(error).message);
		} finally {
			setEditing(false);
		}
	};
	
	return (
		<Card>
			<CardHeader>Upravit &quot;{ idea.name }&ldquo;</CardHeader>
			<CardBody>
				<IdeaForm
					id="idea-edit-form"
					initialValues={ initialValues }
					onSubmit={ onSubmit }
				/>
			</CardBody>
			<CardFooter className="d-flex justify-content-around">
				<Button className="button button-primary button-reverse"
				        type="submit"
				        form="idea-edit-form"
				        disabled={ isSubmitting }>
					<span>{ !isSubmitting ? "Uložit" : "Pracuji..." }</span>
				</Button>
				<Button className="button button-primary"
				        onClick={ () => { setEditing(false); } }
				        disabled={ isSubmitting }>
					<span>Zrušit</span>
				</Button>
			</CardFooter>
		</Card>
	);
};

export interface IdeaEditorProps {
	idea: IIdea;
	setEditing: Dispatch<SetStateAction<boolean>>;
}

export default IdeaEditor;
