import React from 'react';
import { Button as MuiButton, makeStyles, Badge } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
  label: {
    textTransform: 'none',
  },
}));

export default function Button(props) {
  const { variant, onClick, badgeNumber, ...other } = props;
  const classes = useStyles();

  return <Badge badgeContent={badgeNumber}><MuiButton onClick={onClick} {...other} /></Badge>;
}
