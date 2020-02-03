import React, {
	Component,
	DetailedReactHTMLElement,
	HTMLAttributes,
	LazyExoticComponent,
	ReactNode,
} from "react";
import { Route, Switch } from "react-router-dom";
import { Router } from "react-router";
import { createBrowserHistory } from "history";
import { SignInCb, SignOutCb, SilentRenewCb } from "./components/Authentication";
import { ApplicationProvider } from "./providers";
import { loader } from "./misc";
import { ProtectedRoute } from "./components";
import TextLoop from "react-text-loop";
import "./App.scss";

// screen preloader
const preloader = (): NonNullable<ReactNode> => {
	
	const centeredText = (text: string, key: string | number): DetailedReactHTMLElement<HTMLAttributes<any>, HTMLElement> => {
		return React.createElement("div", {
			className: "text-center",
			key,
			style: { width: 300 },
		}, text);
	};
	
	const texts: Array<DetailedReactHTMLElement<HTMLAttributes<any>, HTMLElement>> = [
		centeredText("Connecting to servers...", 1),
		centeredText("Loading components...", 2),
		centeredText("Rendering components...", 3),
	];
	
	return loader(
		<TextLoop mask={ true } interval={ 3500 } springConfig={ { stiffness: 180, damping: 8 } }>
			{ texts }
		</TextLoop>,
	);
};

// layout
const DefaultLayout: LazyExoticComponent<any> = React.lazy(() => import("./layout"));

// pages
const SignIn: LazyExoticComponent<any> = React.lazy(() => import("./components/Authentication/SignIn"));
const SignOut: LazyExoticComponent<any> = React.lazy(() => import("./components/Authentication/SignOut"));
const NotFound: LazyExoticComponent<any> = React.lazy(() => import("./components/NotFound"));
const Unauthorized: LazyExoticComponent<any> = React.lazy(() => import("./components/Unauthorized"));

const history = createBrowserHistory();

/**
 * Main App Entry
 */
export default class App extends Component {
	
	render(): ReactNode {
		/*
		* TODO: convert all components to functional components as following:
		* const Component = (props: any): ReactNode => {}
		* export default Component
		* */
		
		/**
		 * TODO: make all API requests go through one fetcher (to easily catch errors etc.)
		 */
		
		return (
			<ApplicationProvider>
				<Router history={ history }>
					<React.Suspense fallback={ preloader() }>
						<Switch>
							<Route path="/oidc-callback" component={ SignInCb } />
							<Route path="/oidc-signout-callback" component={ SignOutCb } />
							<Route path="/oidc-silent-renew" component={ SilentRenewCb } />
							<Route path="/unauthorized" component={ Unauthorized } />
							<Route path="/sign-in" component={ SignIn } />
							<Route path="/sign-out" component={ SignOut } />
							
							<Route path="/" component={ DefaultLayout } />
							<Route component={ NotFound } />
						</Switch>
					</React.Suspense>
				</Router>
			</ApplicationProvider>
		);
	}
}
