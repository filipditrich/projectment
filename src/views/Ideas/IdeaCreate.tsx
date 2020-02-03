import React, { ReactElement, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { RequestMethod } from "../../models";
import { useAppContext } from "../../providers";
import { Button } from "reactstrap";
import { toast } from "react-toastify";
import IdeaForm from "./IdeaForm";

/**
 * IdeaCreate Idea Component
 * @param props
 * @returns {*}
 * @constructor
 */
export const IdeaCreate = (props: any): ReactElement => {
	const [ { accessToken, userId } ] = useAppContext();
	const [ failed, setFailed ]: any = useState(false);
	const [ ok, setOk ]: any = useState(false);
	const [ showHelp, setShowHelp ]: any = useState(false);
	const [ helpTooltipOpen, setHelpTooltipOpen ]: any = useState(false);
	useEffect(() => {
		setFailed(false);
		setOk(false);
	}, []);
	
	return (
		<>
			<IdeaForm
				initialValues={ {
					name: "",
					description: "",
					resources: "",
					participants: 1,
					subject: "",
					offered: false,
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
						
						const res = await fetch(process.env.REACT_APP_API_URL + "/ideas", {
							method: RequestMethod.POST,
							headers: {
								Authorization: "Bearer " + accessToken,
								"Content-Type": "application/json"
							},
							body: JSON.stringify({
								Name: values.name,
								Description: values.description,
								Resources: values.resources,
								Participants: values.participants,
								Subject: values.subject,
								Offered: values.offered,
								UserId: userId
							})
						});
						
						if (res.ok) {
							let json = await res.json();
							setOk(true);
							toast("Námět byl úspěšně vytvořen.", {
								type: toast.TYPE.SUCCESS,
							});
							props.history.push("/ideas/list/" + json.id);
						} else {
							setFailed(res.statusText);
							toast(`Námět nemohl být vytvořen. (${ res.statusText })`, {
								type: toast.TYPE.ERROR,
								autoClose: false,
							});
							setSubmitting(false);
						}
					}
				}
				footerButtons={
					({ isSubmitting }) => (
						<Button className="button button-primary button-reverse"
						        type="submit"
						        disabled={ isSubmitting }>
							<span>{ !isSubmitting ? "Vytvořit" : "Pracuji..." }</span>
						</Button>
					)
				}
			/>
		</>
	);
};

export default withRouter(IdeaCreate);
