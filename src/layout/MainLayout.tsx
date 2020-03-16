import React, { LazyExoticComponent, ReactElement } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import * as router from "react-router-dom";
import {
	AppHeader,
	AppFooter,
	AppSidebar,
	AppSidebarHeader,
	AppSidebarForm,
	AppSidebarNav,
	AppSidebarFooter,
	AppSidebarMinimizer,
	AppBreadcrumb,
	AppAside,
	// @ts-ignore
} from "@coreui/react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import { ErrorHandler } from "../components";
import { ReactHelmetHead } from "../components/common";
import { loading } from "../misc";
import { navigation, routes } from "../config";
import { IRoute } from "../models/route";
import { useAppContext } from "../providers";

// layout parts
const HeaderLayout: LazyExoticComponent<any> = React.lazy(() => import("./HeaderLayout"));
const FooterLayout: LazyExoticComponent<any> = React.lazy(() => import("./FooterLayout"));
const AsideLayout: LazyExoticComponent<any> = React.lazy(() => import("./AsideLayout"));

const MainLayout = (props: any): ReactElement => {
	const [ { accessToken } ] = useAppContext();
	
	return accessToken !== null
		? (
			<ErrorHandler>
				<div className="app">
					
					{/* Header */ }
					<AppHeader fixed>
						<React.Suspense fallback={ loading() }>
							<HeaderLayout />
						</React.Suspense>
					</AppHeader>
					
					{/* Main Content */ }
					<div className="app-body">
						
						{/* Sidebar */ }
						<AppSidebar fixed display="lg" minified="">
							<AppSidebarHeader />
							<AppSidebarForm />
							<React.Suspense fallback={ loading() }>
								<AppSidebarNav navConfig={ navigation }  { ...props } router={ router } />
							</React.Suspense>
							<AppSidebarFooter />
							<AppSidebarMinimizer />
						</AppSidebar>
						
						{/* Main Routed Content */ }
						<main className="main">
							<AppBreadcrumb appRoutes={ routes } router={ router } />
							<Container fluid className="position-relative">
								<React.Suspense fallback={ loading() }>
									<Switch>
										{
											routes.map((route: IRoute, idx: number) => {
												return route.component ?
													<Route
														key={ idx }
														path={ route.path }
														exact={ route.exact }
														render={
															(props: any) => {
																return (
																	<React.Fragment>
																		<div className="animated fadeIn">
																			<ReactHelmetHead title={ route.name } />
																			{
																				route.card ? (
																					<Row className="justify-content-center">
																						<Col sm="12">
																							<Card>
																								{ route.title ? (
																									<CardHeader>{ route.title }</CardHeader>) : null }
																								<CardBody>
																									<route.component { ...props } />
																								</CardBody>
																							</Card>
																						</Col>
																					</Row>
																				) : <route.component title={ route.name } { ...props } />
																			}
																		</div>
																	</React.Fragment>
																);
															}
														}
													/> : null;
											})
										}
										<Redirect from="/" to="/home" />
									</Switch>
								</React.Suspense>
							</Container>
						</main>
					</div>
					
					{/* App Footer */ }
					<AppFooter className="d-md-down-none">
						<React.Suspense fallback={ loading() }>
							<FooterLayout />
						</React.Suspense>
					</AppFooter>
				</div>
			</ErrorHandler>
		) : <Redirect to="/entry" />;
};

export default MainLayout;
