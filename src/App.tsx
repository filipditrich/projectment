import React, {
	Component,
	DetailedReactHTMLElement,
	HTMLAttributes,
	LazyExoticComponent,
	ReactNode
} from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { SignInCb, SignOutCb, SilentRenewCb } from "./components/Authentication";
import { fakeUsersData, fakeSignedInUserData, fakeIdeasData } from "./utils";
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
			style: { width: 300 }
		}, text);
	};

	const texts: Array<DetailedReactHTMLElement<HTMLAttributes<any>, HTMLElement>> = [
		centeredText("Connecting to servers...", 1),
		centeredText("Loading components...", 2),
		centeredText("Rendering components...", 3),
	];

	return loader(
		<TextLoop mask={ true } interval={ 3500 } springConfig={{ stiffness: 180, damping: 8 }}>
			{ texts }
		</TextLoop>
	);
};

// layout
const DefaultLayout: LazyExoticComponent<any> = React.lazy(() => import("./layout"));

// pages
const SignIn: LazyExoticComponent<any> = React.lazy(() => import("./components/Authentication/SignIn"));
const SignOut: LazyExoticComponent<any> = React.lazy(() => import("./components/Authentication/SignOut"));
const NotFound: LazyExoticComponent<any> = React.lazy(() => import("./components/NotFound"));
const Unauthorized: LazyExoticComponent<any> = React.lazy(() => import("./components/Unauthorized"));

/**
 * Main App Entry
 */
export default class App extends Component {

	render(): ReactNode {
		// TODO: delete
		// localStorage.setItem('fakeUsersData', JSON.stringify(fakeUsersData));
		// localStorage.setItem('fakeIdeasData', JSON.stringify(fakeIdeasData));
		// localStorage.setItem('fakeSignedInUserData', JSON.stringify(fakeSignedInUserData));

		return (
			<BrowserRouter>
				<React.Suspense fallback={ preloader() }>
					<Switch>
						<Route path="/oidc-callback" component={ SignInCb } />
						<Route path="/oidc-signout-callback" component={ SignOutCb } />
						<Route path="/oidc-silent-renew" component={ SilentRenewCb } />
						<Route path="/unauthorized" component={ Unauthorized } />
						<Route path="/sign-in" component={ SignIn } />
						<Route path="/sign-out" component={ SignOut } />

						<ProtectedRoute path="/" component={ DefaultLayout } />
						<Route component={ NotFound } />
					</Switch>
				</React.Suspense>
			</BrowserRouter>
		);
	}
}
