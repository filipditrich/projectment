import React, { CSSProperties } from "react";

/**
 * Loading Overlay Component
 * @param active
 * @param text
 * @param children
 * @constructor
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ active, text, tag, styles, children }: LoadingOverlayProps) => {
	
	const Wrapper: string | React.ElementType = tag || "div";
	return (
		<Wrapper style={ styles }>
			{
				active ? (
					<div className="preloader loading-overlay">
						<div className="preloader-spinner" />
						<div className="preloader-text">{ text || "Načítání..." }</div>
					</div>
				) : null
			}
			{ children }
		</Wrapper>
	);
};

interface LoadingOverlayProps {
	active: boolean;
	text?: string;
	children?: React.ReactNode | any;
	tag?: string | React.ElementType;
	styles?: CSSProperties;
}

export default LoadingOverlay;
