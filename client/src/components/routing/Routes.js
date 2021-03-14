import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from '../dashboard/dashboard';
import CreateEPortfolio from '../eportfolio/createPortfolio';
import About from '../layout/About'
import Contact from '../layout/Contact'
import PickTemplate from '../eportfolio/PickTemplate';
import PrivateRoute from '../routing/PrivateRoute';
import View from '../view/view';
import Edit from '../edit/edit';

const Routes = (props) => {
  return (
    <Fragment>
      <Switch>
        <Route exact path='/view/:id/:pagename?' component={View} />
        <Route exact path='/edit/:id/:pagename?' component={Edit} />
        <Route exact path='/about' component={About} />
        <Route exact path='/contact' component={Contact} />
        <PrivateRoute exact path='/dashboard' component={Dashboard} />
        <PrivateRoute
          exact
          path='/create-eportfolio'
          component={CreateEPortfolio}
        />
        <PrivateRoute exact path='/pick-template' component={PickTemplate} />
      </Switch>
    </Fragment>
  );
};

export default Routes;
