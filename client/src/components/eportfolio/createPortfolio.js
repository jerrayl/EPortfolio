import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Typography, Box, Button, TextField, Checkbox, FormControlLabel, List, ListItem } from '@material-ui/core';
import { creatingPortfolioName, resetCreatingPortfolioName } from '../../actions/eportfolio';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useThemeStyle } from '../../styles/themes';

const useStyles = makeStyles((theme) => ({
  portfolioNameInput: {
    paddingBottom: '20px !important',
    width: '100%',
    paddingLeft: '10px !important',
  },
  portfolioNameInputLabel: {
    paddingLeft: '10px !important'
  },
  checkbox: {
    paddingLeft: '10px !important'
  }
}));

const CreateEPortfolio = ({creatingPortfolioName, resetCreatingPortfolioName}) => {
  const classes = useStyles();
  const theme = useThemeStyle();
  
  const [name, setName] = React.useState('');
  const [label, setLabel] = React.useState('Name of Portfolio');
  const [error, setError] = React.useState(false);
  const [privacy, setPrivacy] = React.useState(false);

  useEffect(() => {
    resetCreatingPortfolioName();
  }, []);

  function handleInputChange(component){
    setName(component.target.value);
    if (component.target.value != ''){
      setError(false);
      setLabel('Name of Portfolio');
    }
    else {
      setLabel('Please enter a name');
      setError(true);
    }
  }

  function handleChange(component){
    setPrivacy(component.target.checked);
  }
    
  return (
    <Box className={theme.content}>
      <Typography variant='h2'>Enter your portfolio name here</Typography>
      <form>
        <TextField error={error} 
          id='standard-required' 
          className={classes.portfolioNameInput} 
          label={label} 
          placeholder='My Portfolio' 
          onChange={handleInputChange}
          InputLabelProps={{className: classes.portfolioNameInputLabel}}>
        </TextField>
        <FormControlLabel
          control={<Checkbox 
            checked={privacy} 
            onChange={handleChange}
            color='primary'/>}
          label='Private'
          className={classes.checkbox}
        />
        <Typography variant='p'>*All content on a public portfolio is visible to anyone with the link by default, but privacy can still be set on individual items.</Typography>
        <Link onClick={() => name && creatingPortfolioName(name, privacy)} to={()=> name ? '/pick-template' : true}>
          <Button style={{float: 'right'}} 
            variant='contained' 
            color='primary'
            classes= {{
              label: theme.buttonLabel
            }} >NEXT</Button>
        </Link>
      </form>
    </Box>
  )
}

CreateEPortfolio.propTypes = {
  creatingPortfolioName: PropTypes.func.isRequired,
  resetCreatingPortfolioName: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, { creatingPortfolioName, resetCreatingPortfolioName })(CreateEPortfolio);