import { History } from "history";
import React, { useCallback, useEffect, useState } from "react";
import { useParams, withRouter } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Card, CardBody, CardDeck } from "reactstrap";
import ConfirmationWrapper from "../../components/common/ConfirmationWrapper";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import { IIdea } from "../../models/idea";
import { DataJsonResponse, NoContentResponse } from "../../models/response";
import { UserClaim } from "../../models/user";
import { useAppContext } from "../../providers";
import { Axios } from "../../utils";
import { handleRes, responseError } from "../../utils/axios";
import { hasClaim, isOwnerOrAdmin } from "../../utils/roles";
import { transformFromAPI } from "../../utils/transform";
import IdeaGoals from "./Detail/Goals";
import IdeaInfo from "./Detail/Info";
import IdeaOutlines from "./Detail/Outlines";

/**
 * Idea Detail Component
 * @constructor
 */
export const IdeaDetail: React.FC<IdeaDetailProps> = ({ history }: IdeaDetailProps) => {
	const { id } = useParams();
	if (!id) throw new Error("no Id present"); // shouldn't happen at all
	const [ isLoading, setIsLoading ] = useState<boolean>(true);
	const [ idea, setIdea ] = useState<IIdea>();
	const [ { accessToken, profile } ] = useAppContext();
	
	// fetch data
	const fetchData = useCallback(() => {
		(async () => {
			try {
				setIsLoading(true);
				const [ res ] = handleRes<DataJsonResponse<IIdea>>(
					await Axios(accessToken).get<DataJsonResponse<IIdea>>(`/ideas/${ id }`));
				setIdea(transformFromAPI<IIdea>(res.data, id));
			} catch (error) {
				toast.error(responseError(error).message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [ accessToken, id ]);
	useEffect(() => {
		fetchData();
	}, [ accessToken ]);
	
	return (
		<LoadingOverlay active={ isLoading }>
			<CardDeck>
				{/* Idea Details */ }
				<IdeaInfo setIsLoading={ setIsLoading } idea={ idea } fetcher={ fetchData }/>
				
				{/* Idea Goals */ }
				<IdeaGoals idea={ idea } loading={[ isLoading, setIsLoading ]} />
				
				{/* Idea Outlines */ }
				<IdeaOutlines idea={ idea } loading={[ isLoading, setIsLoading ]} />
			</CardDeck>
			
			{/* Actions */ }
			{
				(hasClaim(profile, UserClaim.THESES_AUTHOR) && idea?.offered) || isOwnerOrAdmin(profile, idea?.userId) ? (
					<Card>
						<CardBody className="d-flex flex-wrap justify-content-end">
							{
								isOwnerOrAdmin(profile, idea?.userId) ?
									(
										<ConfirmationWrapper
											className="ml-auto"
											orderSwap={ true }
											onPositive={
												async (sdo) => {
													try {
														handleRes<DataJsonResponse<NoContentResponse>>(
															await Axios(accessToken).delete(`/ideas/${ id }`));
														toast.success("Námět byl úspěšně smazán.");
														history.push("/ideas/list");
													} catch (error) {
														toast.error(responseError(error).message);
														sdo(false);
													}
												}
											}
											positiveText="Odstranit"
											dialogTitle="Odstranění námětu"
											dialogContent="Opravdu si přejete námět odstranit?"
											type="danger">
											<Button className="button button-danger">
												<span>Smazat námět</span>
											</Button>
										</ConfirmationWrapper>
									) : null
							}
							{
								hasClaim(profile, UserClaim.THESES_AUTHOR) && idea?.offered ? (
									<Link className="button button-primary ml-3" to={ `/works/create/${ idea?.id }` }>
										<span>Vytvořit zadání</span>
									</Link>
								) : null
							}
						</CardBody>
					</Card>
				) : null
			}
		</LoadingOverlay>
	);
};

export interface IdeaDetailProps {
	history: History;
}

export default withRouter(IdeaDetail);
