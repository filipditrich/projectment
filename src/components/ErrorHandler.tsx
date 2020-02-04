import React from "react";
import PropTypes from "prop-types";

/**
 * Error Handler Class Component
 */
export default class ErrorHandler extends React.Component<{ children: any }, { errorOccurred: boolean }> {

	static propTypes = {
		children: PropTypes.any,
	};

	constructor(props: any) {
		super(props);
		this.state = { errorOccurred: false };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
		this.setState({ errorOccurred: true });

		// TODO: custom error logger
		console.error(error, errorInfo);
	}

	render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
		return this.state.errorOccurred
			? <h1>Something went wrong!</h1>
			: this.props.children;
	}

}
