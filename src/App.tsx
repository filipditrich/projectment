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
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import TouchBackend from "react-dnd-touch-backend";
import { loader } from "./misc";
import TextLoop from "react-text-loop";
import "./App.scss";
import { isTouchDevice } from "./utils/helpers";

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
const Entry: LazyExoticComponent<any> = React.lazy(() => import("./components/Entry"));

const history = createBrowserHistory();

/**
 * Main App Entry
 */
export default class App extends Component {
	
	render(): ReactNode {
		
		return (
			<ApplicationProvider>
				<Router history={ history }>
					<React.Suspense fallback={ preloader() }>
						<DndProvider backend={ isTouchDevice() ? TouchBackend : Backend }>
							<Switch>
								<Route path="/oidc-callback" component={ SignInCb } />
								<Route path="/oidc-signout-callback" component={ SignOutCb } />
								<Route path="/oidc-silent-renew" component={ SilentRenewCb } />
								<Route path="/unauthorized" component={ Unauthorized } />
								
								<Route path="/sign-in" component={ SignIn } />
								<Route path="/sign-out" component={ SignOut } />
								
								<Route path="/entry" component={ Entry } />
								<Route path="/" component={ DefaultLayout } />
								<Route component={ NotFound } />
							</Switch>
						</DndProvider>
					</React.Suspense>
				</Router>
			</ApplicationProvider>
		);
	}
}
