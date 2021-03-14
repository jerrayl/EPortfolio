import React from 'react';
import { Box, Typography } from '@material-ui/core';
import logo from '../../images/Quaranteam-darkmode.png';
import { makeStyles } from '@material-ui/core/styles';
import { useThemeStyle } from '../../styles/themes';

const useStyles = makeStyles((theme) => ({
  logo: {
    margin: 'auto',
    padding: '10px',
    width: '20%',
    justifyContent: 'center',
    display: 'flex'
  },
  thirds: {
    width: '33.33333%'
  },
  madeby: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center'
  },
  content: {
    padding: '30px 10% 30px'
  }
}));
function Footer() {
  const classes = useStyles();
  const theme = useThemeStyle();
  return (
    <Box className={`${classes.content} ${theme.black} ${theme.fontg6}`}>
      <Box>
        <Box>
          <img src={logo} className={classes.logo} alt='Quaranteam'></img>
        </Box>
      </Box>
      <Box className={classes.madeby}>
        <Typography variant='body1'>This webapp was made by <br/>
            Ajay Singh, 
            Jerrayl Ng, 
            Ju Wey Tan, 
            Mehmet Koseoglu, 
            Winnie Chen<br/>
         for IT Project (COMP30022) in Semester 2, 2020 at the  University of Melbourne</Typography>
      </Box>
    </Box>
  );
}

export default Footer;
