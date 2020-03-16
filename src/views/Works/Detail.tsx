import { History } from "history";
import React, { useCallback, useEffect, useState } from "react";
import { useParams, withRouter } from "react-router";
import { toast } from "react-toastify";
import { Card, CardDeck } from "reactstrap";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import { DataJsonResponse, TableDataJsonResponse } from "../../models/response";
import { IUser } from "../../models/user";
import { IWork, IWorkSet, IWorkState } from "../../models/work";
import { useAppContext } from "../../providers";
import { Axios } from "../../utils";
import { handleRes, responseError } from "../../utils/axios";
import axios from "axios";
import { cardWidth } from "../../utils/cards";
import { transformFromAPI } from "../../utils/transform";
import { WorkCosts } from "./Detail/Costs";
import { WorkFiles } from "./Detail/Files";
import { WorkGoals } from "./Detail/Goals";
import WorkInfo from "./Detail/Info";
import { WorkOutlines } from "./Detail/Outlines";
import { WorkRoles } from "./Detail/Roles";
import { WorkState } from "./Detail/State";

/**
 * Work Detail Component
 * @param history
 * @constructor
 */
export const WorkDetail: React.FC<WorkDetailProps> = ({ history }: WorkDetailProps) => {
	const { id } = useParams();
	if (!id) throw new Error("no Id present");
	const [ isLoading, setIsLoading ] = useState<boolean>(true);
	const [ work, setWork ] = useState<IWork>();
	const [ workState, setWorkState ] = useState<IWorkState>();
	const [ users, setUsers ] = useState<IUser[]>([]);
	const [ sets, setSets ] = useState<IWorkSet[]>([]);
	const [ allstates, setallStates ] = useState<IWorkState[]>([]);
	const [ nextstates, setnextStates ] = useState<IWorkState[]>([]);
	const [ { accessToken } ] = useAppContext();
	
	// fetch all data
	const fetchData = useCallback(() => {
		(async () => {
			try {
				setIsLoading(true);
				const [
					workRes,
					workState,
					usersRes,
					setsRes,
					allstatesRes,
					nextstatesRes
				] = handleRes(...await axios.all<TableDataJsonResponse | DataJsonResponse>([
					Axios(accessToken).get<DataJsonResponse<IWork>>(`/works/${ id }`),
					Axios(accessToken).get<DataJsonResponse<IWorkState>>(`/works/${ id }/state`),
					Axios(accessToken).get<TableDataJsonResponse<IUser[]>>("/users"),
					Axios(accessToken).get<TableDataJsonResponse<IWorkSet[]>>("/sets"),
					Axios(accessToken).get<DataJsonResponse<IWorkState[]>>("/works/allstates"),
					Axios(accessToken).get<DataJsonResponse<IWorkState[]>>(`/works/${ id }/nextstates`),
				]));
				
				setWork(transformFromAPI(workRes.data, id));
				setWorkState(workState.data);
				setUsers(usersRes.data.data);
				setSets(setsRes.data.data);
				setallStates(allstatesRes.data);
				setnextStates(nextstatesRes.data);
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
				{/* Basic Info */ }
				<Card style={ cardWidth(50) }>
					<WorkInfo work={ work } users={ users } sets={ sets } state={ workState } fetcher={ fetchData } />
				</Card>
				
				{/* State & Costs */ }
				<CardDeck className="flex-column" style={{ ...cardWidth(50), margin: 0 }}>
					{/* State */ }
					<Card style={ cardWidth(100) }>
						<WorkState work={ work } state={ workState } allStates={ allstates } nextStates={ nextstates } fetcher={ fetchData } />
					</Card>
					
					{/* Costs */}
					<Card style={ cardWidth(100) }>
						<WorkCosts work={ work } state={ workState } fetcher={ fetchData } />
					</Card>
				</CardDeck>
				
				{/* Goals */ }
				<Card style={ cardWidth(100 / 3) }>
					<WorkGoals work={ work } loading={ [ isLoading, setIsLoading ] } state={ workState } />
				</Card>
				
				{/* Outlines */ }
				<Card style={ cardWidth(100 / 3) }>
					<WorkOutlines work={ work } loading={ [ isLoading, setIsLoading ] } state={ workState } />
				</Card>
				
				{/* TODO: Roles */ }
				<Card style={ cardWidth(100 / 3) }>
					<WorkRoles work={ work } state={ workState } fetcher={ fetchData } />
				</Card>
				
				{/* TODO: Files */ }
				<Card style={ cardWidth(50) }>
					<WorkFiles work={ work } state={ workState } fetcher={ fetchData } />
				</Card>
			</CardDeck>
		</LoadingOverlay>
	);
};

export interface WorkDetailProps {
	history: History;
}

export default withRouter(WorkDetail);
