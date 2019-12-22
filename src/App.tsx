import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { preloader } from './misc';
import './App.scss';

// containers
const DefaultLayout = React.lazy(() => import('./containers/MainLayout'));

class App extends Component {

    render() {
        return (
          <BrowserRouter>
              <React.Suspense fallback={ preloader() }>
                  <Switch>
                      <Route path="/" name="Domů" component={ DefaultLayout }/>
                  </Switch>
              </React.Suspense>
          </BrowserRouter>
        );
    }
}

export default App;
