import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Spinner } from "reactstrap";

/**
 * Submitting Button Component
 * @param passiveText
 * @param activeText
 * @param type
 * @param onClick
 * @param props
 * @constructor
 */
export const SubmitButton: React.FC<SubmitButtonProps> = ({ passiveText, activeText, type, onClick, classes, submitting, unmounted, props }: SubmitButtonProps) => {
	const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
	
	useEffect(() => {
		setIsSubmitting(submitting || false);
	}, [ submitting ]);
	
	const clickHandler = () => {
		(async () => {
			if (!unmounted) setIsSubmitting(true);
			await onClick();
			if (!unmounted) setIsSubmitting(false);
		})();
	};
	
	return (
		<Button className={ `button button-${ type || "primary" } button-submit ${ classes }` }
		        onClick={ clickHandler }
		        disabled={ isSubmitting }
		        { ...props }>
			<span>
				{
					isSubmitting ? (
						<>
							<div className="spinner-container">
								<Spinner size="sm" className="mr-2" />
							</div>
							{ (activeText || "Potvrzuji") }
						</>
					) : (passiveText || "Potvrdit")
				}
			</span>
		</Button>
	);
};

export interface SubmitButtonProps {
	passiveText?: string;
	activeText?: string;
	type?: "primary" | "danger" | "warning" | "success" | "info";
	onClick: () => Promise<any>;
	props?: any;
	classes?: string;
	submitting?: boolean;
	unmounted?: boolean;
}
