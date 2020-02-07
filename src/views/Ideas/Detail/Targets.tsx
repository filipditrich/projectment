import { AxiosResponse } from "axios";
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import { Modal } from "../../../components";
import TargetBadge, { TargetBadgesTarget } from "../../../components/common/TargetBadge";
import TargetBadges from "../../../components/common/TargetBadges";
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
	const [ targets, setTargets ] = useState<IIdeaTarget[]>([]);
	const [ allTargets, setAllTargets ] = useState<IIdeaTarget[]>([]);
	const [ { accessToken } ] = useAppContext();
	const [ modal, setModal ] = useState<IdeaTargetModal>({ active: false });
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
		return targets?.findIndex((_target: IIdeaTarget) => _target.id === target.id) >= 0;
	};
	
	// close modal
	const closeModal = (): void => {
		setModal({ ...modal, active: false });
	};
	
	// add target to idea / remove target from idea
	const toggleTarget = (target: TargetBadgesTarget) => {
		(async() => {
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
				setModal({ active: false });
			}
		})();
	};
	
	// on target badge click
	const onClick = useCallback((target: TargetBadgesTarget) => {
		setModal({ active: true, target });
	}, [ targets, setModal ]);
	
	return (allTargets.length && targets.length) ? (
		<>
			<TargetBadges targets={
				allTargets.map((target: IIdeaTarget): TargetBadgesTarget => {
					return { ...target, inactive: !isTargetUsed(target), classes: "cursor-pointer" };
				})
			}
			              onClick={ onClick } />
			{
				(modal.active && modal.target) ? (
					<Modal
						isOpen={ modal.active }
						onDismiss={ closeModal }
						actions={
							<>
								<Button className="button button-primary"
								        onClick={ () => { toggleTarget(modal.target as TargetBadgesTarget); } }
								        type="submit">
									<span>{ modal.target?.inactive ? "Aktivovat" : "Deaktivovat" }</span>
								</Button>
								<Button className="button button-secondary"
								        onClick={ closeModal }
								        type="submit">
									<span>Zrušit</span>
								</Button>
							</>
						}
						title={ modal.target?.inactive ? "Aktivace" : "Deaktivace" + " cílu"}>
						<p className="text-muted">{ modal.target?.inactive ? "Aktivovat" : "Deaktivovat" } cíl <TargetBadge target={{ ...modal.target, inactive: false }} /> ?</p>
					</Modal>
				) : null
			}
		</>
	) : loading();
};

interface IdeaTargetModal {
	active: boolean;
	target?: TargetBadgesTarget;
}

export interface IdeaTargetsProps {
	id: string;
	setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export default IdeaTargets;
