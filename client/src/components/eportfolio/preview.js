import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography, Grid, Box, Card, CardContent, CardHeader, CardMedia, CardActions, Button } from '@material-ui/core';
import {getPortfolio, getPage, getPortfolioAsGuest, getError } from '../../actions/eportfolio';
import { loadUser } from '../../actions/auth';
import { Link, useParams, useHistory } from 'react-router-dom';
import store from '../../store';
import Comment from '../comments/Comment';
import { useThemeStyle } from '../../styles/themes';

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    minWidth: 275,
    boxShadow: 'none',
    borderRadius: 0,
    backgroundColor: 'inherit',
    paddingBottom: '20px'
  },
  pos: {
  },
  media: {
    padding:'20vh'
  },
  titleText:{
    fontSize: '1.5rem'
  },
  viewGridItem: {
    display: 'grid',
  },
  viewGridItemCardHeader: {
    paddingBottom: '0px !important',
  },
  viewCardActions: {
    paddingLeft: '20px !important',
  },
  viewCardContent: {
    paddingBottom: '0px !important',
  },
  content: {
    paddingTop: '20px !important',
    paddingBottom: '20px !important',
  }
}));

const View = ({portfolio, getPage, page, error, getPortfolioAsGuest, portfolioID}) => {
  const classes = useStyles();
  const theme = useTheme();
  const themeStyle = useThemeStyle();
  const [pageName, setPageName] = React.useState("Home");

  useEffect(() => {
    if (portfolioID !== "blank" && (Object.keys(portfolio).length === 0 || portfolio._id !== portfolioID)) {
        getPortfolioAsGuest(portfolioID);
    }
    if (portfolioID !== "blank" && (Object.keys(page).length === 0 || portfolio._id !== portfolioID || !(page.url === pageName || (page.main && pageName ==='')))) {
        getPage(portfolioID, pageName);
    }
  }, [portfolio, page, pageName, portfolioID]);
  const items = (Object.keys(page).length !== 0) ? page.items : [];
  const rowLengths = {};
  const groupedItems = [];
  items.forEach(element => {
    if (rowLengths.hasOwnProperty(element.row)){
      rowLengths[element.row]++;
      groupedItems[element.row].push(element);
    }
    else{
      rowLengths[element.row] = 1;
      groupedItems[element.row] = [element];
    }
  });
    return (
      <Fragment>
         { (portfolioID === "blank") ? <Box className={themeStyle.content}>
      <Typography variant='h2'>Build your own portfolio from scratch with this template</Typography>
      </Box> :
        <Box className={themeStyle.content}>
          {groupedItems.map((item, i)=>
        <Grid container key={i} className={classes.content}>
        {item.map((object) => card(classes, rowLengths, object, setPageName))}  
        </Grid>)}
        </Box>
        }
      </Fragment>
    );
}

const card = (classes, rowLengths, object, setPageName) => {
  return (
    <Grid item xs={12/rowLengths[object.row]} className={classes.viewGridItem} key={object._id}>
      <Card className={classes.cardRoot}>
        {object.mediaType === 'image' && <CardMedia
            className={classes.media}
            image={object.mediaLink}
          />}
        {object.title && <CardHeader
          className={classes.viewGridItemCardHeader}
          classes={{title:classes.titleText}}
          title={object.title}
          subheader={object.subtitle}
        />}
        {object.paragraph&& <CardContent className={classes.viewCardContent}>
          {object.paragraph && <Typography variant='body2' component='p'>
            {object.paragraph}
          </Typography>}
        </CardContent>}
        {object.linkAddress && <CardActions className={classes.viewCardActions}>
            <Button size='small' onClick={() => setPageName(object.linkAddress)}>{object.linkText}</Button>
        </CardActions>}
      </Card>
    </Grid>
  )
}


View.propTypes = {
  getPage: PropTypes.func.isRequired,
  page: PropTypes.object.isRequired,
  portfolio: PropTypes.object.isRequired,
  error: PropTypes.object,
  getPortfolioAsGuest: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  page: state.eportfolio.page,
  portfolio: state.eportfolio.portfolio,
  error: state.eportfolio.error
});

export default connect(mapStateToProps, {getPage, getPortfolio, loadUser, getPortfolioAsGuest})(View);
