import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import Home from './containers/home';

export const Routes = () => (
  <Router>
    <Route exact path="/" component={Home} />
  </Router>
);

export default Routes;