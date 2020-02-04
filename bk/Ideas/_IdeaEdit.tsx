import React, { ReactElement, useEffect, useState } from "react";
import { RequestMethod } from "../../models";
import { useAppContext } from "../../providers";
import { useFetch } from "../../utils";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import { loading, error } from "../../misc";
import _IdeaForm from "./IdeaForm";

/**
 * Idea IdeaEdit Component
 * @param props
 * @returns {*}
 * @constructor
 */
export const _IdeaEdit = (props: { switchEditMode: any, id: string | undefined }): ReactElement & any => {
	const {
		switchEditMode,
	} = props;
	const [ { accessToken, userId } ] = useAppContext();
	const [ failed, setFailed ]: any = useState(false);
	const [ ok, setOk ]: any = useState(false);
	
	useEffect(() => {
		setFailed(false);
		setOk(false);
	}, []);
	
	const { response, error: err, isLoading }: { response: any, error: any, isLoading: boolean } = useFetch(process.env.REACT_APP_API_URL + "/ideas/" + props.id, {
		method: RequestMethod.GET,
		headers: {
			Authorization: "Bearer " + accessToken,
		},
	});
	
	if (isLoading) {
		return loading();
	} else if (response) {
		console.log(response);
		return (
			<>
				<_IdeaForm
					initialValues={ {
						name: response.name,
						description: response.description,
						resources: response.resources,
						participants: response.participants,
						subject: response.subject,
						offered: response.offered,
					} }
					validate={
						(values: any) => {
							const errors: any = {};
							if (!values.name) errors.name = "Vyplňte název námětu";
							if (!values.description) errors.description = "Vyplňte popis námětu";
							if (!values.resources) errors.resources = "Vyplňte očekávané zdroje";
							if (values.participants === null) errors.participants = "Vyplňte počet autorů";
							if (!values.subject) errors.subject = "Vyplňte zkratu předmětu, do kterého by zadání spadalo";
							return errors;
						}
					}
					onSubmit={
						async (values, { setSubmitting }) => {
							setSubmitting(true);
							const res = await fetch(process.env.REACT_APP_API_URL + "/ideas/" + props.id, {
							    method: RequestMethod.PUT,
							    headers: {
							        Authorization: "Bearer " + accessToken,
							        "Content-Type": "application/json"
							    },
							    body: JSON.stringify({
							        Id: response.id,
							        Name: values.name,
							        Description: values.description,
							        Resources: values.resources,
							        Participants: values.participants,
							        Subject: values.subject,
							        Offered: values.offered,
							        UserId: userId
							    })
							});
							console.log(res);
							
							if (res.ok) {
								setOk(true);
								toast("Námět byl úspěšně uložen.", {
									type: toast.TYPE.SUCCESS,
								});
								switchEditMode(false);
							} else {
								toast(`Námět nemohl být uložen. (${ res.statusText })`, {
									type: toast.TYPE.ERROR,
									autoClose: false,
								});
								setFailed(res.statusText);
							}
							setSubmitting(false);
						}
					}
					footerButtons={
						({ isSubmitting }) => (
							<>
								<Button className="button button-primary button-reverse" type="submit" disabled={ isSubmitting }>
									<span>{ !isSubmitting ? "Uložit" : "Pracuji..." }</span>
								</Button>
								<Button className="button button-primary ml-3" onClick={ () => switchEditMode(false) }>
									<span>Zpět</span>
								</Button>
							</>
						)
					}
				/>
			</>
		);
	} else if (err) {
		console.error(err);
		toast(`${ err.text } (${ err.status }).`, {
			type: toast.TYPE.ERROR,
			toastId: "T_ERR_EDIT_RESPONSE",
			autoClose: false,
		});
		return error(err.toString());
	} else {
		return error("Chybějící data");
	}
};

export default _IdeaEdit;
