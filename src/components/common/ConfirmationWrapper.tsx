import React, {
	Dispatch, ReactElement,
	ReactNode,
	SetStateAction,
	useState
} from "react";
import { Button } from "reactstrap";
import Modal from "./Modal";

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
	dialogContent = typeof dialogContent === "string" ? <p>{ dialogContent }</p> : dialogContent || <p>Opravdu si přejete pokračovat?</p>;
	dialogTitle = dialogTitle || "Potvrzení akce";
	const onNegativeAction: (sdo: Dispatch<SetStateAction<boolean>>) => void = onNegative
		? (async(sdo) => {
			setIsWorking(true); await onNegative(sdo); setIsWorking(false);
		}) : () => setDialogOpen(false);
	const onPositiveAction: (sdo: Dispatch<SetStateAction<boolean>>) => void = (async(sdo) => {
		setIsWorking(true); await onPositive(sdo); setIsWorking(false);
	});
	
	return (
		<>
			{/* Children Wrapper */}
			<div
				className={ className }
				onClick={ () => trigger === "onClick" ? setDialogOpen(true) : null }
				onDoubleClick={ () => trigger === "onDoubleClick" ? setDialogOpen(true) : null }>
				{ children }
			</div>
			
			{/* Confirmation Modal */}
			<Modal
				isOpen={ dialogOpen }
				onDismiss={ () => setDialogOpen(false) }
				className={ `modal-${type}` }
				title={ dialogTitle }
				actions={
					<>
						<Button
							className={ `button button-${type} button-alt` }
							disabled={ isWorking }
							onClick={ () => onNegativeAction(setDialogOpen) }>
							<span>{ negativeText }</span>
						</Button>
						<Button
							className={ `button button-${type}` }
							style={{ order: orderSwap ? -1 : 0 }}
							disabled={ isWorking }
							onClick={ () => onPositiveAction(setDialogOpen) }>
							<span>{ positiveText }</span>
						</Button>
					</>
				}>
				{ dialogContent }
			</Modal>
		</>
	);
};

export interface ConfirmationWrapperProps {
	onPositive: (setDialogOpen: Dispatch<SetStateAction<boolean>>) => Promise<any | void> | void;
	positiveText?: string;
	onNegative?: (setDialogOpen: Dispatch<SetStateAction<boolean>>) => Promise<any | void> | void;
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
