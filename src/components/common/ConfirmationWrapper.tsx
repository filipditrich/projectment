import React, {
	Dispatch,
	ReactElement,
	SetStateAction,
	useState
} from "react";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import { responseError } from "../../utils/axios";
import Modal from "./Modal";
import { SubmitButton } from "./SubmitButton";

/**
 * Confirmation Wrapper (modal)
 * @param innerContent
 * @param onNegative
 * @param onPositive
 * @param positiveText
 * @param negativeText
 * @param type
 * @param children
 * @constructor
 */
export const ConfirmationWrapper: React.FC<ConfirmationWrapperProps> = ({ onNegative, onPositive, dialogContent, dialogTitle, positiveText, negativeText, type, trigger, children, className, orderSwap }: ConfirmationWrapperProps) => {
	const [ dialogOpen, setDialogOpen ] = useState<boolean>(false);
	const [ isWorking, setIsWorking ] = useState<boolean>(false);
	
	// set defaults
	type = type || "primary";
	trigger = trigger || "onClick";
	positiveText = positiveText || "Pokračovat";
	negativeText = negativeText || "Zrušit";
	dialogContent = typeof dialogContent === "string" ? <p>{ dialogContent }</p> : dialogContent ||
		<p>Opravdu si přejete pokračovat?</p>;
	dialogTitle = dialogTitle || "Potvrzení akce";
	const onNegativeAction: onCallback = onNegative
		? (async (sdo, siw) => onNegative(sdo, siw))
		: (async () => {
			setIsWorking(false);
			setDialogOpen(false);
		});
	
	return (
		<>
			{/* Children Wrapper */ }
			<div
				className={ className }
				onClick={ () => trigger === "onClick" ? setDialogOpen(true) : null }
				onDoubleClick={ () => trigger === "onDoubleClick" ? setDialogOpen(true) : null }>
				{ children }
			</div>
			
			{/* Confirmation Modal */ }
			<Modal
				isOpen={ dialogOpen }
				onDismiss={ () => setDialogOpen(false) }
				className={ `modal-${ type }` }
				title={ dialogTitle }
				actions={
					<>
						<Button
							className={ `button button-${ type } button-alt` }
							disabled={ isWorking }
							style={ { order: orderSwap ? 1 : 0 } }
							onClick={ async () => await onNegativeAction(setDialogOpen, setIsWorking) }>
							<span>{ negativeText }</span>
						</Button>
						<SubmitButton passiveText={ positiveText }
						              submitting={ isWorking }
						              unmounted={ !dialogOpen }
						              type={ type }
						              onClick={ async () => onPositive(setDialogOpen, setIsWorking) } />
					</>
				}>
				{ dialogContent }
			</Modal>
		</>
	);
};

type onCallback = (setDialogOpen: Dispatch<SetStateAction<boolean>>, setIsWorking: Dispatch<SetStateAction<boolean>>) => Promise<any | void> | void;

export interface ConfirmationWrapperProps {
	onPositive: onCallback;
	positiveText?: string;
	onNegative?: onCallback;
	negativeText?: string;
	orderSwap?: boolean;
	dialogContent?: ReactElement | string;
	dialogTitle?: string;
	type?: "primary" | "danger" | "warning" | "success" | "info";
	trigger?: "onClick" | "onDoubleClick";
	children?: ReactElement;
	className?: string;
}

export default ConfirmationWrapper;
