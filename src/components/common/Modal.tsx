import React, { ReactElement, useState } from "react";
import { Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { DefaultProps } from "../../models/props";

/**
 * Modal Props Interface
 */
export interface ModalProps extends DefaultProps {
	isOpen: boolean;
	onDismiss: (e: Event) => void;
	actions?: ReactElement;
	buttonLabel?: string;
	className?: string;
}

/**
 * Modal Component
 * @param isOpen
 * @param onDismiss
 * @param actions
 * @param children
 * @param title
 * @param buttonLabel
 * @param className
 * @constructor
 */
export const Modal: React.FC<ModalProps> = ({ isOpen, onDismiss, actions, children, title, buttonLabel, className }: ModalProps) => {
	const [ , setIsOpen ] = useState(isOpen);
	const closeBtn: ReactElement =
		<button className="close" onClick={ (e: any) => onDismiss(e) }>{ buttonLabel || "×" }</button>;
	
	return (
		<div>
			<ReactstrapModal
				isOpen={ isOpen }
				toggle={ (e: any) => onDismiss(e) }
				className={ className }>
				{ title
					? <ModalHeader
						toggle={ (e: any) => onDismiss(e) }
						close={ closeBtn }
					>{ title }</ModalHeader>
					: "" }
				<ModalBody>
					{ children }
				</ModalBody>
				{ actions ? <ModalFooter>{ actions }</ModalFooter> : "" }
			</ReactstrapModal>
		</div>
	);
};

export default Modal;
