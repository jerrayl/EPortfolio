import React, { Fragment } from 'react';
import { Button, List, ListItem, Typography, Box, Avatar, Menu, MenuItem } from '@material-ui/core';
import MaterialUILink from '@material-ui/core/Link';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import 'whatwg-fetch';
import api from '../../utils/api';
import { signIn, signOut } from '../../actions/auth';
import logo from '../../images/Quaranteam.png';
import { makeStyles } from '@material-ui/core/styles';
import { useThemeStyle } from '../../styles/themes';
import { getFonts } from '../../actions/googleFonts';

const useStyles = makeStyles((theme) => ({
  logo: {
    width: '20%',
    padding: '0px',
    display: 'initial'
  },
  logoLink: {
    padding: '0 !important',
    flexGrow: '4'
  },
  listItem: {
    width: 'fit-content',
    color: '#333333'
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: '1'
  },  
  header: {
    display: 'flex',
    padding: '10px 5%',
    zIndex: '99'
  },
  scrolled: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    zIndex: '99'
  },
  buttonBase: {
    marginLeft: '10px'
  }
}));

//initialize firebase google authentication
const firebaseConfig = require('../../utils/firebaseConfig').firebaseConfig;
firebase.initializeApp(firebaseConfig);
var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');


//function for google sign in
export const GSignIn = (signIn, getFonts) => {
  //sign in google with pop up window
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function (result) {
      //get idToken from google server
      firebase
        .auth()
        .currentUser.getIdToken(true)
        .then(function (idToken) {
          getFonts();
          signIn(idToken);
        })
        .catch(function (error) {
          console.debug(error);
        });
    });
};

//navbar includes home page, sign in with google and dashboard
const Navbar = ({
  auth: { isAuthenticated, loading, user },
  signIn,
  signOut,
  scrolled,
  getFonts
}) => {
  const classes = useStyles();
  const theme = useThemeStyle();
  //navbar for users signed in
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    signOut();
    handleClose();
  }

  const authLinks = (
    <Box className={(scrolled ? classes.scrolled : '')}>
      <Box className={classes.header}>
        <Link className={classes.logoLink} to='/'>
          <img src={logo} alt='Quaranteam' className={classes.logo}></img>
        </Link>
        <List disablePadding className={classes.list} color={theme.gray6}>
          <ListItem disableGutters dense className={classes.listItem}>
            <Link to='/dashboard'>
              <MaterialUILink><Typography variant='body1' color='textPrimary'>Dashboard</Typography></MaterialUILink>
            </Link>
          </ListItem>
          <ListItem disableGutters dense className={classes.listItem}>
            {/** change links */}
            <Link to='/about'>
              <MaterialUILink><Typography variant='body1' color='textPrimary'>About</Typography></MaterialUILink>
            </Link>
          </ListItem>
          <ListItem disableGutters dense className={classes.listItem}>
            {/** change links */}
            <Link to='/contact'>
              <MaterialUILink><Typography variant='body1' color='textPrimary'>Contact</Typography></MaterialUILink>
            </Link>
          </ListItem>
          <ListItem disableGutters dense className={classes.listItem}>
            <Typography variant='body1' color='textPrimary'>{user && user.name}</Typography>
            <Avatar src={user && user.avatar} onClick={handleClick}></Avatar>
          </ListItem>
        </List>
      </Box>
      <Menu
        id='logout'
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        <MenuItem onClick={logout}><Link to='/'>Sign out</Link></MenuItem>
      </Menu>
    </Box>
    
  );


  //navbar for guests not signed in yet
  const guestLinks = (
    <Box className={(scrolled ? classes.scrolled : '')}>
      <Box className={classes.header}>
        <Link className={classes.logoLink} to='/'>
          <MaterialUILink><img src={logo} alt='Quaranteam' className={classes.logo}></img></MaterialUILink>
        </Link>
        <List disablePadding className={classes.list} color={theme.gray6}>
          <ListItem disableGutters dense className={classes.listItem}>
            <Link to='/'>
              <MaterialUILink><Typography variant='body1' color='textPrimary'>Home</Typography></MaterialUILink>
            </Link>
          </ListItem>
          <ListItem disableGutters dense className={classes.listItem}>
            {/** change links */}
            <Link to='/about'>
              <MaterialUILink><Typography variant='body1' color='textPrimary'>About</Typography></MaterialUILink>
            </Link>
          </ListItem>
          <ListItem disableGutters dense className={classes.listItem}>
            {/** change links */}
            <Link to='/contact'>
              <MaterialUILink><Typography variant='body1' color='textPrimary'>Contact</Typography></MaterialUILink>
            </Link>
          </ListItem>
          <ListItem disableGutters dense className={classes.listItem}>
          <Link to='/'>
            <Button onClick={() => GSignIn(signIn, getFonts)} 
              variant='contained' 
              color='primary'
              className={classes.buttonBase}
              classes={{
                label: theme.buttonLabel
              }}>
              SIGN IN
            </Button>
          </Link>
          </ListItem>
        </List>
      </Box>
      <Menu
        id='logout'
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        <MenuItem>Logout</MenuItem>
      </Menu>
    </Box>
  );

  return (
    <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
  );
};

Navbar.propTypes = {
  signIn: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  getFonts: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  signOut,
  signIn,
  getFonts,
})(Navbar);
