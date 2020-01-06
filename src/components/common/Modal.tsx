import React, { ReactElement, useState } from "react";
import { Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

/**
 * Modal Component
 * @param props
 * @constructor
 */
const Modal = (props: any): ReactElement => {
	const {
		buttonLabel,
		className,
		onDismiss,
		isOpen
	} = props;

	const [ , setIsOpen ] = useState(isOpen);
	const closeBtn: ReactElement = <button className="close" onClick={ (e: any) => props.onDismiss(e) }>{ buttonLabel || "×" }</button>;

	return (
		<div>
			<ReactstrapModal
				isOpen={ isOpen }
				toggle={ (e: any) => onDismiss(e) }
				className={ className }>
				{ props.title
					? <ModalHeader
						toggle={ (e: any) => onDismiss(e) }
						close={ closeBtn }
					>{ props.title }</ModalHeader>
					: "" }
				<ModalBody>
					{ props.children }
				</ModalBody>
				{ props.actions ? <ModalFooter>{ props.actions }</ModalFooter> : "" }
			</ReactstrapModal>
		</div>
	);
};

export default Modal;
