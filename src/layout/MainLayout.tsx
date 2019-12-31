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
import { Card, Col, Container, Row } from 'reactstrap';
import { loading } from '../misc';
import { navigation, routes } from '../config';

// layout parts
const HeaderLayout = React.lazy(() => import('./HeaderLayout'));
const FooterLayout = React.lazy(() => import('./FooterLayout'));
const AsideLayout = React.lazy(() => import('./AsideLayout'));

export default class MainLayout extends React.Component {

    render() {
        return(
            <div className="app">

                <AppHeader fixed>
                    <React.Suspense fallback={ loading() }>
                        <HeaderLayout />
                    </React.Suspense>
                </AppHeader>

                <div className="app-body">
                    <AppSidebar fixed display="lg" minified="0">
                        <AppSidebarHeader />
                        <AppSidebarForm />
                        <React.Suspense fallback={ loading() }>
                            <AppSidebarNav navConfig={ navigation }  { ...this.props } router={ router } />
                        </React.Suspense>
                        <AppSidebarFooter />
                        <AppSidebarMinimizer />
                    </AppSidebar>

                    <main className="main">
                        <AppBreadcrumb appRoutes={ routes } router={ router } />
                        <Container fluid>
                            <React.Suspense fallback={ loading() }>
                                <div className="animated fadeIn">
                                    <Row className="justify-content-center">
                                        <Col sm="12">
                                            <Card className="p-4">
                                                <Switch>
                                                    {
                                                        routes.map((route, idx) => {
                                                            return route.component ?
                                                                <Route
                                                                    key={ idx }
                                                                    path={ route.path }
                                                                    exact={ route.exact }
                                                                    name={ route.name }
                                                                    component={ route.component }
                                                                /> : (null);
                                                        })
                                                    }
                                                    <Redirect from="/" to="/home" />
                                                </Switch>
                                            </Card>
                                        </Col>
                                    </Row>
                                </div>
                            </React.Suspense>
                        </Container>
                    </main>

                    <AppAside fixed>
                        <React.Suspense fallback={ loading() }>
                            <AsideLayout />
                        </React.Suspense>
                    </AppAside>
                </div>

                <AppFooter className="d-md-down-none">
                    <React.Suspense fallback={ loading() }>
                        <FooterLayout />
                    </React.Suspense>
                </AppFooter>
            </div>
        );
    }
}
