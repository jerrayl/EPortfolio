import React, { Fragment, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, Button, Typography, Grid } from '@material-ui/core';
import landing1 from '../../images/Landing/landing1.png';
import landing2 from '../../images/Landing/landing2.png';
import landing3 from '../../images/Landing/landing3.png';
import landing4 from '../../images/Landing/landing4.png';
import icon1 from '../../images/Landing/icon1.png';
import { useThemeStyle } from '../../styles/themes';
import { makeStyles } from '@material-ui/core/styles';
import { GSignIn } from './Navbar';
const useStyles = makeStyles((theme) => ({
  icon: {
    paddingLeft: '10px'
  },
  content: {
    paddingTop: '10px'
  },
  leftright: {
    marginTop: '100px'
  },
  image1: {
    position: 'relative',
    top: '-50px',
    maxHeight: '850px'
  },
  image2: {
    paddingLeft: '100px'
  },
  last: {
    textAlign: 'center'
  }
}));

const Landing = ({isAuthenticated}) => {
  const theme = useThemeStyle();
  const classes = useStyles();
  const history = useHistory();
  useEffect(() => {
    if (isAuthenticated){
      history.push('dashboard');
      history.go(0);
    }
  }, [isAuthenticated]);
  return (
    <Fragment>
      <Box className={`${theme.content} ${classes.content} ${theme.half} ${theme.fontg1}`}>
        <Box className={`${theme.leftright} ${classes.leftright}`}>
          <Typography variant='h1'>The only ePortfolio Platform you need</Typography>
          <Typography variant='h6'>
            Create your own highly customisable ePortfolios for any purpose.<br/>
            Our platforms offers one of the most customisable yet user friendly portfolio building experience online.<br/>
            Just log in with your google account and start building! 
          </Typography>
          <br/>
          <Button className={theme.leftrightButton} 
            variant='contained' 
            color='primary' 
            onClick={GSignIn}
            classes={{
              label: theme.buttonLabel
            }}>
            GET STARTED NOW
          </Button>
          <Button className={theme.leftrightButton} 
            variant='contained' 
            color='secondary'
            classes={{
              label: theme.buttonLabel
            }}>
            {/** Change link */}
            <Link to='/about'>
              Learn More
            </Link>
          </Button>
         </Box>
        <Box className={theme.leftright}>
          <img src={landing1} alt='Graphic' className={classes.image1}></img>
        </Box>
      </Box>
      <Box className={`${theme.content} ${theme.half} ${theme.fontg1}`}>
        <Box className={theme.leftright}>
          <Typography variant='h2'>Elegant templates to get started</Typography>
          <Typography variant='h6'>
            All portfolios on Quaranteam start with a template. 
            Built by our design team, Quaranteam templates are a creative starting point to help inspire your portfolio’s design. <br/><br/>
            You can keep the structure of your original design intact by replacing the demo content with your own, 
            or you can completely change the design of your portfolio and start from scratch. 
            Each design is uniquely coded and designed exclusively for the Quaranteam platform.
          </Typography>
          <Box className={theme.half}>
            <Box className={theme.leftright}>
              <img src={icon1} alt='icon' className={classes.icon}></img>
              <Typography variant='body2'>Fast setup</Typography>
              <Typography variant='body1'>Pick templates with one click and get started immediately</Typography>
            </Box>
            <Box className={theme.leftright}>
              <img src={icon1} alt='icon' className={classes.icon}></img>
              <Typography variant='body2'>Complete control</Typography>
              <Typography variant='body1'>Control your portfolio’s colors and fonts with a handy sidebar</Typography>
            </Box>
          </Box>
        </Box>
        <Box className={theme.leftright}>
          <img src={landing2} alt='Graphic' className={classes.image2}></img>
        </Box>
      </Box>
      <Box className={`${theme.content} ${theme.half} ${theme.fontg1}`}>
        <Box className={theme.leftright}>
          <img src={landing3} alt='Graphic'></img>
        </Box>
        <Box className={theme.leftright}>
          <Typography variant='h2'>No limits on creativity</Typography>
          <Typography variant='h6'>
            Keep creating with no limits to how many portfolio you can have so you can create as many portfolios as you want. 
            All of them will be accesible on dashboard where you can favorite portfolios for access to your best work.<br/><br/>
            You can also create unique links to each of your portfolios with the Get link feature, allowing you to share portfolios with anyone, anywhere.
          </Typography>
        </Box>
      </Box>
      <Box className={`${theme.content} ${theme.half} ${theme.fontg1}`}>
      <Box className={theme.leftright}>
          <img src={landing4} alt='Graphic'></img>
        </Box>
        <Box className={theme.leftright}>
          <Typography variant='h2'>Fast &amp; Secure Login</Typography>
          <Typography variant='h6'>
            With Google authentication, you can be sure that logging in and getting started to Quaranteam is not only fast but extremely secure.<br/><br/>
            You don’t even need to sign up for an account. Just use your Google account to log in. 
          </Typography>
        </Box>
      </Box>
      <Box className={`${theme.content} ${theme.fontg1} ${classes.last}`}>
        <Typography variant='h2'>Create your dream portfolio now</Typography>
        <Typography variant='body1'>Completely free, now and forever</Typography>
        <Button 
            variant='contained' 
            color='primary' 
            onClick={GSignIn}
            classes={{
              label: theme.buttonLabel
            }}>
            GET STARTED NOW
          </Button>
      </Box>
    </Fragment>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
