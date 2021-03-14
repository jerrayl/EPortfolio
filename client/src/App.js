import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Routes from './components/routing/Routes';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

// Material IU styles and theme
import { ThemeProvider } from '../node_modules/@material-ui/core/styles';
import theme from './styles/themes'
import { Box, CssBaseline } from '@material-ui/core';

import './App.css';

const App = () => {
  useEffect(() => {
    if(sessionStorage.token){
      setAuthToken(sessionStorage.token);
      store.dispatch(loadUser());
    };
    window.addEventListener('scroll', handleScroll);
  }, []);

  const [scrolled, setScrolled] = React.useState(false);
  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 100){
      setScrolled(true);
    }
    else setScrolled(false);
  }

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Navbar scrolled={scrolled}/>
            <Box className="main-content">
              <Switch>
                <Route exact path='/' component={Landing} />
                <Route component={Routes} />
              </Switch>
            </Box>
            <Footer />
          </ThemeProvider>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
