import React from 'react';
import { Typography, Divider, Box } from '@material-ui/core';
import useStyles from './DashboardStyles';

export default function Category(props) {
    const classes = useStyles();
    return (
      <Box className={classes.cateogory}>
        <Typography className={classes.categoryTypography} noWrap variant='body1'>{props.title}</Typography>
        <Box className={classes.categoryDiv}>
          <Divider light className={classes.categoryLine}/>
        </Box>
      </Box>
    );
  }