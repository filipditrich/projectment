import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Card, CardBody, CardFooter, CardHeader } from "reactstrap";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import { loading } from "../../../misc";
import { IIdea } from "../../../models/idea";
import { DataJsonResponse } from "../../../models/response";
import { useAppContext } from "../../../providers";
import { Axios, isStatusOk } from "../../../utils";
import { responseError, responseFail } from "../../../utils/axios";
import IdeaEditor from "../Edit";
import IdeaTargets from "./Targets";

/**
 * Idea Detail Component
 * @constructor
 */
export const IdeaInfo: React.FC<IdeaInfoProps> = ({ id }: IdeaInfoProps) => {
	const [ editing, setEditing ] = useState<boolean>(false);
	const [ isLoading, setIsLoading ] = useState<boolean>(true);
	const [ idea, setIdea ] = useState<IIdea>();
	const [ { accessToken } ] = useAppContext();
	
	useEffect(() => {
		(async () => {
			try {
				const res: AxiosResponse<DataJsonResponse<IIdea>> = await Axios(accessToken)
					.get<DataJsonResponse<IIdea>>("/ideas/" + id);
				
				if (isStatusOk(res)) {
					setIdea(res.data);
				} else throw responseFail(res);
			} catch (error) {
				toast.error(responseError(error).message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [ accessToken, id ]);
	
	return editing ? (
		idea ? <IdeaEditor idea={ idea } setEditing={ setEditing }/> : loading()
	) : (
		<LoadingOverlay active={ isLoading } tag={ Card } styles={{ minWidth: "40vw" }}>
			<CardHeader>Detail námětu</CardHeader>
			<CardBody>
				<dl>
					<dt>Název</dt>
					<dd className="text-muted">{ idea?.name }</dd>
					<dt>Popis</dt>
					<dd className="text-muted">{ idea?.description }</dd>
					<dt>Id</dt>
					<dd className="text-muted">{ id }</dd>
					<dt>Nabízené</dt>
					<dd className="text-muted">{ idea?.offered ? "Ano" : "Ne" }</dd>
					<dt>Prostředky</dt>
					<dd className="text-muted">{ idea?.resources }</dd>
					<dt>Předmět</dt>
					<dd className="text-muted">{ idea?.subject }</dd>
					<dt>Počet řešitelů</dt>
					<dd className="text-muted">{ idea?.participants }</dd>
					<dt className="mb-1">Cílové skupiny</dt>
					<dd><IdeaTargets setIsLoading={ setIsLoading } id={ id } /></dd>
				</dl>
			</CardBody>
			<CardFooter className="d-flex">
				<Button className="button button-primary ml-auto"
				        onClick={ () => { setEditing(true); } }>
					<span>Editovat</span>
				</Button>
			</CardFooter>
		</LoadingOverlay>
	);
};

export interface IdeaInfoProps {
	id: string;
}

export default IdeaInfo;
