import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import * as router from 'react-router-dom';
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
} from '@coreui/react';
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap';
import { ReactHelmetHead } from '../components/common';
import { loading } from '../misc';
import { navigation, routes } from '../config';
import { IRoute } from '../models/route';
import { ToastContainer } from 'react-toastify';

// layout parts
const HeaderLayout = React.lazy(() => import('./HeaderLayout'));
const FooterLayout = React.lazy(() => import('./FooterLayout'));
const AsideLayout = React.lazy(() => import('./AsideLayout'));

export default class MainLayout extends React.Component {

    render() {
        return(
            <div className="app">

                {/* Header */}
                <AppHeader fixed>
                    <React.Suspense fallback={ loading() }>
                        <HeaderLayout />
                    </React.Suspense>
                </AppHeader>

                {/* Toaster Container */}
                <ToastContainer autoClose={ 7500 } />

                {/* Main Content */}
                <div className="app-body">

                    {/* Sidebar */}
                    <AppSidebar fixed display="lg" minified="0">
                        <AppSidebarHeader />
                        <AppSidebarForm />
                        <React.Suspense fallback={ loading() }>
                            <AppSidebarNav navConfig={ navigation }  { ...this.props } router={ router } />
                        </React.Suspense>
                        <AppSidebarFooter />
                        <AppSidebarMinimizer />
                    </AppSidebar>

                    {/* Main Routed Content */}
                    <main className="main">
                        <AppBreadcrumb appRoutes={ routes } router={ router } />
                        <Container fluid>
                            <React.Suspense fallback={ loading() }>
                                <Switch>
                                    {
                                        routes.map((route: IRoute, idx) => {
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
                                                                                            { route.title ? (<CardHeader>{ route.title }</CardHeader>) : null }
                                                                                            <CardBody>
                                                                                                <route.component { ...props } />
                                                                                            </CardBody>
                                                                                        </Card>
                                                                                    </Col>
                                                                                </Row>
                                                                            ) : <route.component { ...props } />
                                                                        }
                                                                    </div>
                                                                </React.Fragment>
                                                            );
                                                        }
                                                    }
                                                /> : (null);
                                        })
                                    }
                                    <Redirect from="/" to="/home" />
                                </Switch>
                            </React.Suspense>
                        </Container>
                    </main>

                    {/* TODO: remove? */}
                    {/* App Aside */}
                    <AppAside fixed>
                        <React.Suspense fallback={ loading() }>
                            <AsideLayout />
                        </React.Suspense>
                    </AppAside>
                </div>

                {/* App Footer */}
                <AppFooter className="d-md-down-none">
                    <React.Suspense fallback={ loading() }>
                        <FooterLayout />
                    </React.Suspense>
                </AppFooter>
            </div>
        );
    }
}
