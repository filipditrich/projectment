import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { SignInCb, SignOutCb, SilentRenewCb } from './components/Authentication';
import { loader } from './misc';
import { ProtectedRoute } from './components';
import TextLoop from 'react-text-loop';
import './App.scss';

// screen preloader
const preloader = () => {
    const centeredText = (text: string) => React.createElement('div', {
        className: 'text-center',
        style: { width: 300 }
    }, text);

    const texts = [
        centeredText('Connecting to servers...'),
        centeredText('Loading components...'),
        centeredText('Rendering components...'),
    ];

    return loader(<TextLoop mask={ true } children={ texts } interval={ 3500 } springConfig={{ stiffness: 180, damping: 8 }} />);
};

// containers
const DefaultLayout = React.lazy(() => import('./containers/MainLayout'));

// pages
const SignIn = React.lazy(() => import('./components/Authentication/SignIn'));
const SignOut = React.lazy(() => import('./components/Authentication/SignOut'));
const NotFound = React.lazy(() => import('./components/NotFound'));
const Unauthorized = React.lazy(() => import('./components/Unauthorized'));

/**
 * Main App Entry
 */
class App extends Component {

    render() {
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

export default App;
