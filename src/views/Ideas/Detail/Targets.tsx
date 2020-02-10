import { AxiosResponse } from "axios";
import React, { Dispatch, ReactElement, SetStateAction, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmationWrapper from "../../../components/common/ConfirmationWrapper";
import TargetBadge, { TargetBadgesTarget } from "../../../components/common/TargetBadge";
import { loading } from "../../../misc";
import { IIdeaTarget } from "../../../models/idea";
import { DataJsonResponse, TableDataJsonResponse } from "../../../models/response";
import { useAppContext } from "../../../providers";
import { Axios, isStatusOk } from "../../../utils";
import { responseError, responseFail } from "../../../utils/axios";

/**
 * Idea Targets Component
 * @constructor
 */
export const IdeaTargets: React.FC<IdeaTargetsProps> = ({ id, setIsLoading }: IdeaTargetsProps) => {
	const [ targets, setTargets ] = useState<IIdeaTarget[] | undefined>();
	const [ allTargets, setAllTargets ] = useState<IIdeaTarget[]>([]);
	const [ { accessToken } ] = useAppContext();
	
	const fetchTargets = useCallback(() => {
		(async () => {
			try {
				const allTargetsRes: AxiosResponse<TableDataJsonResponse<IIdeaTarget[]>> = await (Axios(accessToken))
					.get<TableDataJsonResponse<IIdeaTarget[]>>("/targets");
				
				if (isStatusOk(allTargetsRes)) {
					setAllTargets(allTargetsRes.data.data);
				} else throw responseFail(allTargetsRes);
				
				const ideaTargetsRes: AxiosResponse<DataJsonResponse<IIdeaTarget[]>> = await Axios(accessToken)
					.get<DataJsonResponse<IIdeaTarget[]>>(`/ideas/${ id }/targets`);
				
				if (isStatusOk(ideaTargetsRes)) {
					setTargets(ideaTargetsRes.data);
				} else throw responseFail(ideaTargetsRes);
			} catch (error) {
				toast.error(responseError(error).message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [ accessToken, id ]);
	
	// fetch targets
	useEffect(() => {
		fetchTargets();
	}, []);
	
	// whether the target is being currently used in the idea
	const isTargetUsed = (target: IIdeaTarget): boolean => {
		return !!targets && targets?.findIndex((_target: IIdeaTarget) => _target.id === target.id) >= 0;
	};
	
	// add target to idea / remove target from idea
	const toggleTarget = async (target: TargetBadgesTarget): Promise<void> => {
		setIsLoading(true);
		try {
			const res: AxiosResponse<any> = target.inactive
				? await Axios(accessToken).post(`/ideas/${ id }/targets`, { id: target.id })
				: await Axios(accessToken).delete(`/ideas/${ id }/targets/${ target.id }`);
			
			if (isStatusOk(res)) {
				toast.success("Cíle námětu byly úspěšně aktualizovány.");
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
					.map((target: IIdeaTarget): TargetBadgesTarget => {
						return { ...target, inactive: !isTargetUsed(target), classes: "cursor-pointer p-1" };
					})
					.map((target: TargetBadgesTarget, index: number): ReactElement => (
						<ConfirmationWrapper
							key={ index }
							onPositive={
								async (setDialogOpen) => {
									await toggleTarget(target);
									setDialogOpen(false);
								}
							}
							positiveText={ target.inactive ? "Aktivovat" : "Deaktivovat" }
							dialogContent={ <p>{ target.inactive ? "Aktivovat" : "Deaktivovat" } cílovou skupinu <TargetBadge target={{ ...target, inactive: false, classes: "cursor-normal" }} /> ?</p> }
							type="primary">
							<TargetBadge target={ target } />
						</ConfirmationWrapper>
					))
			}
		</div>
	) : loading();
};

export interface IdeaTargetsProps {
	id: string;
	setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export default IdeaTargets;
