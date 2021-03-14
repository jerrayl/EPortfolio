import React, { Fragment, useEffect } from 'react';
import { Box, Button, Typography, Divider, List, ListItem } from '@material-ui/core';
import image from '../../images/pick.png';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createPortfolio, getTemplates } from '../../actions/eportfolio'
import store from '../../store';
import { makeStyles } from '@material-ui/core/styles';
import { useThemeStyle } from '../../styles/themes';
import { useHistory } from 'react-router-dom';
import View from './preview';

const useStyles = makeStyles((theme) => ({
  category: {
    display: 'inline-table',
  },
  categoryTypography: {
    display: 'table-cell',
  },
  categoryDiv: {
    display: 'table-cell',
    width: '100%',
  },
  categoryLine: {
    marginBottom: '5px',
  },
  templateSelection: {
    boxShadow: '0px 20px 50px 0px #00000019',
    position: 'relative'
  },
  templateButton: {
    backgroundColor: '#E0E0E0',
    padding: '18px 38px',
    textAlign: 'center',
    fontSize: '14px',
    borderRadius: '8px',
  },
  templateButtonSelected: {
    padding: '18px 38px',
    textAlign: 'center',
    fontSize: '14px',
    borderRadius: '8px',
    backgroundColor: '#4F4F4F',
    color: '#F2F2F2'
  },
  templateBox: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    display: 'inline-block',
    width: 'fit-content'
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    whiteSpace: 'nowrap',
    overflowX: 'auto'
  }
}));

const PickTemplate = ({createPortfolio, createPortfolioDetails, getTemplates, templates}) => {
  const classes = useStyles();
  const theme = useThemeStyle();
  const history = useHistory();
  const [currTemplate, setCurrTemplate] = React.useState("");

  useEffect(() => {
    if (templates.length === 0){
      getTemplates();
    }
    if (Object.keys(createPortfolioDetails).length !== 0 && Object.keys(createPortfolioDetails).includes('_id')){
      history.push('/edit/' + createPortfolioDetails._id + '/' + encodeURI('Home'));
      history.go(0);
    }
  }, [createPortfolioDetails, templates]);

  return (
    <Fragment>
      <Box className={`${theme.content} ${classes.templateSelection} ${theme.fontg1} ${theme.gray6}`}>
        <Typography variant='h2'>Select a template for {(Object.keys(createPortfolioDetails).length !== 0) ? createPortfolioDetails.name : ""}</Typography>
        
        <List className={classes.list}>
          <ListItem className={classes.templateBox}>
            <Button variant='contained' 
              onClick={() => setCurrTemplate("blank")} 
              className={(currTemplate === "blank") ? classes.templateButtonSelected : classes.templateButton}>
                Blank
            </Button>
          </ListItem>
          {templates.map((template) => <ListItem className={classes.templateBox} key={template._id}>
            <Button 
              onClick={() => setCurrTemplate(template._id)} 
              variant='contained' 
              className={(currTemplate === template._id) ? classes.templateButtonSelected : classes.templateButton}>
                {template.name}
            </Button>
          </ListItem>)}
        </List>
        <Box className={classes.category}>
          <Typography noWrap variant='body1' className={classes.categoryTypography}></Typography>
          <Box className={classes.categoryDiv}>
            <Divider light className={classes.categoryLine}/>
          </Box>
          <Button style={{marginBottom: '10px'}} 
            variant='contained' 
            color='primary' 
            disabled={!Boolean(currTemplate)}
            onClick={()=>{createPortfolio(store.getState().eportfolio.createPortfolioDetails, currTemplate);}}
            classes={{
              label: theme.buttonLabel
            }}>
              CREATE
          </Button>
        </Box>
      </Box>
      { (currTemplate === "") ? <Box className={`${theme.content} ${theme.half} ${theme.fontg1} ${theme.gray6}`}>
        <Box className={theme.leftright}>
          <Typography variant='h1'>Choose a template</Typography>
          <Typography variant='h6'>
            Pick one of the options above to see if it works for you.
          </Typography>
        </Box>
        <Box className={theme.leftright}>
          <img src={image} alt='Illustration'></img>
        </Box>
        </Box> : <View portfolioID={currTemplate}></View>}
    </Fragment>
  );
}

PickTemplate.propTypes = {
  createPortfolio: PropTypes.func.isRequired,
  createPortfolioDetails: PropTypes.object.isRequired,
  templates: PropTypes.arrayOf(PropTypes.object).isRequired,
  getTemplates: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  createPortfolioDetails: state.eportfolio.createPortfolioDetails,
  templates: state.eportfolio.templates
});

export default connect(mapStateToProps, { createPortfolio, getTemplates })(PickTemplate);
