import React, { Fragment } from 'react';
import { useThemeStyle } from '../../styles/themes';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import group from '../../images/group.png';

const useStyles = makeStyles((theme) => ({
  icon: {
    paddingLeft: '10px'
  },
  center: {
    margin: 'auto',
    width: '50%',
    marginTop: '50px'
  },
  content: {
    paddingTop: '10px'
  },
  leftright: {
    marginTop: '100px'
  },
  image1: {
    marginTop: '100px',
    width: '500px',
    height: '400px',
    objectFit: 'cover',
  },
  image2: {
    paddingLeft: '100px'
  },
  last: {
    textAlign: 'center'
  }
}));

const About = () => {
  const theme = useThemeStyle();
  const classes = useStyles();
  
  return (
    <Fragment>
      <Box className={`${classes.center}`}>
        <Typography align='center' variant='h1'>Contact us</Typography>
      </Box>
      <Box className={`${theme.content} ${classes.content} ${theme.half} ${theme.fontg1}`}>
        <Box className={theme.leftright}>
          <img src={group} alt='Graphic' className={classes.image1}></img>
          <Typography variant='h6'>
              Image showing all of us at University together 
              <br></br>
              because that totally happened.
          </Typography>
        </Box>
        <Box className={`${theme.leftright} ${classes.leftright}`}>
          <Typography variant='h6'>
          If you would like to reach out to us for suggestions, feedback, to buy our app for a few million
          dollars, bugs or any other reason, feel free to use any of the emails listed here.
          </Typography>
          <Typography variant='h5'>
          Ajay Singh - assin@student.unimelb.edu.au
          <br></br>
          <br></br>
          Biyao Chen - biyaoc@student.unimelb.edu.au
          <br></br>
          <br></br>
          Jerrayl Ng - jerrayln@student.unimelb.edu.au
          <br></br>
          <br></br>
          Ju Wey Tan -  juwey.tan@student.unimelb.edu.au
          <br></br>
          <br></br>
          Mehmet Koseoglu - mkoseoglu@student.unimelb.edu.au
          </Typography>
        </Box>
      </Box>
    </Fragment>
  );
};

export default About;
