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
        <Typography align='center' variant='h1'>About Quaranteam</Typography>
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
          Quaranteam portfolio builder was a project undertaken as part of IT project
          in semester 2, 2020 at the University of Melbourne. The members of the team were
          <ul>
            <br></br>
            <li>• Ajay Singh, 988319</li>
            <li>• Biyao Chen, 893569</li>
            <li>• Jerrayl Ng, 1011117</li>
            <li>• Ju Wey Tan, 1050289</li>
            <li>• Mehmet Koseoglu, 925573</li>
            <br></br>
          </ul>
          As part of this subject, we worked on a real life problem in a small team, 
          supervised by a member of staff. We analysed the information needs of users
          and developed working computational solutions. We applied sound principles 
          studied over the course of our degree to the formulation and solution of our 
          problem. We also learned useful skills like teamwork and communication.
          </Typography>
        </Box>
      </Box>
    </Fragment>
  );
};

export default About;
