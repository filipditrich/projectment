import { AxiosResponse } from "axios";
import React, { Dispatch, ReactElement, SetStateAction, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmationWrapper from "../../../components/common/ConfirmationWrapper";
import TargetBadge, { TargetBadgesTarget } from "../../../components/common/TargetBadge";
import { loading } from "../../../misc";
import { IIdea, ITarget } from "../../../models/idea";
import { DataJsonResponse, TableDataJsonResponse } from "../../../models/response";
import { useAppContext } from "../../../providers";
import { Axios, isStatusOk } from "../../../utils";
import { responseError, responseFail } from "../../../utils/axios";
import { isOwnerOrAdmin } from "../../../utils/roles";

/**
 * Idea Targets Component
 * @constructor
 */
export const IdeaTargets: React.FC<IdeaTargetsProps> = ({ idea, setIsLoading }: IdeaTargetsProps) => {
	const [ targets, setTargets ] = useState<ITarget[] | undefined>();
	const [ allTargets, setAllTargets ] = useState<ITarget[]>([]);
	const [ { accessToken, profile } ] = useAppContext();
	
	const fetchTargets = useCallback(() => {
		(async () => {
			try {
				const allTargetsRes: AxiosResponse<TableDataJsonResponse<ITarget[]>> = await (Axios(accessToken))
					.get<TableDataJsonResponse<ITarget[]>>("/targets");
				
				if (isStatusOk(allTargetsRes)) {
					setAllTargets(allTargetsRes.data.data);
				} else throw responseFail(allTargetsRes);
				
				const ideaTargetsRes: AxiosResponse<DataJsonResponse<ITarget[]>> = await Axios(accessToken)
					.get<DataJsonResponse<ITarget[]>>(`/ideas/${ idea.id }/targets`);
				
				if (isStatusOk(ideaTargetsRes)) {
					setTargets(ideaTargetsRes.data);
				} else throw responseFail(ideaTargetsRes);
			} catch (error) {
				toast.error(responseError(error).message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [ accessToken, idea ]);
	
	// fetch targets
	useEffect(() => {
		fetchTargets();
	}, []);
	
	// whether the target is being currently used in the idea
	const isTargetUsed = (target: ITarget): boolean => {
		return !!targets && targets?.findIndex((_target: ITarget) => _target.id === target.id) >= 0;
	};
	
	// add target to idea / remove target from idea
	const toggleTarget = async (target: TargetBadgesTarget): Promise<void> => {
		setIsLoading(true);
		try {
			const res: AxiosResponse<any> = target.inactive
				? await Axios(accessToken).post(`/ideas/${ idea.id }/targets`, { id: target.id })
				: await Axios(accessToken).delete(`/ideas/${ idea.id }/targets/${ target.id }`);
			
			if (isStatusOk(res)) {
				toast.success("Cílové skupiny námětu byly úspěšně aktualizovány.");
				fetchTargets();
			} else throw responseFail(res);
		} catch (error) {
			toast.error(responseError(error).message);
		} finally {
			setIsLoading(false);
		}
	};
	
	return !!targets && allTargets.length ? (
		<div className="badge-container">
			{
				allTargets
					.map((target: ITarget): TargetBadgesTarget => {
						return { ...target, inactive: !isTargetUsed(target), classes: isOwnerOrAdmin(profile, idea.userId) ? "cursor-pointer p-1" : "p-1" };
					})
					.map((target: TargetBadgesTarget, index: number): ReactElement => (
						isOwnerOrAdmin(profile, idea.userId) ? (
							<ConfirmationWrapper
								key={ index }
								onPositive={
									async (setDialogOpen, setIsWorking) => {
										await toggleTarget(target);
										setDialogOpen(false);
										setIsWorking(false);
									}
								}
								positiveText={ target.inactive ? "Aktivovat" : "Deaktivovat" }
								dialogContent={ <p>{ target.inactive ? "Aktivovat" : "Deaktivovat" } cílovou skupinu <TargetBadge target={{ ...target, inactive: false, classes: "cursor-normal" }} /> ?</p> }
								type="primary">
								<TargetBadge target={ target } />
							</ConfirmationWrapper>
						) : <TargetBadge key={ index } target={ target } />
					))
			}
		</div>
	) : loading();
};

export interface IdeaTargetsProps {
	idea: IIdea;
	setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export default IdeaTargets;
