import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles, useTheme, ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline, Typography, Grid, Box, Card, CardContent, CardHeader, CardMedia, CardActions, Button, IconButton, CardActionArea } from '@material-ui/core';
import {getPortfolio, getPage, getPortfolioAsGuest, getError, getSaved, savePortfolio, getPageAsGuest, getTheme } from '../../actions/eportfolio';
import { loadUser } from '../../actions/auth';
import { Link, useParams, useHistory } from 'react-router-dom';
import store from '../../store';
import Comment from '../comments/Comment';
import { useThemeStyle } from '../../styles/themes';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import {Instagram, Facebook, LinkedIn, Twitter} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    boxShadow: 'none',
    borderRadius: 0,
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end'
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
  viewCardActions: {
    paddingLeft: theme.spacing(2),
    justifyContent: 'space-between',
    backgroundColor: theme.palette.primary.main,
  },
  content: {
    paddingTop: '20px !important',
    paddingBottom: '50px !important',
    paddingLeft: '10% !important',
    backgroundColor: theme.palette.primary.main
  },
  primaryColor: {
    backgroundColor: theme.palette.primary.main
  },
  secondaryColor: {
    backgroundColor: theme.palette.secondary.main
  },
  contentInherit: {
    backgroundColor: 'inherit'
  },
  cardPadding: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  gridPadding: {
    paddingLeft: '10% !important',
    paddingRight: '10% !important',
  },
  socialLinks:{      
    display: 'flex',
    alignItems: 'center'
  },
  socialMedia:{
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2),
    fontSize: '20px',
    color: 'white',
    padding: theme.spacing(2),
  },
}));

const ViewTheme = ({getPortfolio, portfolio, getPage, page, loadUser, isAuthenticated, error, getPortfolioAsGuest, getSaved, savePortfolio, savedPortfolios, getPageAsGuest, getTheme, muiTheme, itemMuiThemes, headerTheme }) => {
  const params = useParams();
  const theme = useTheme();
  const classes = useStyles();
  const themeStyle = useThemeStyle();
  const history = useHistory();
  useEffect(() => {
    if (Object.keys(error).length===0){
    if (Object.keys(portfolio).length === 0 || portfolio._id !== params.id) {
        if (isAuthenticated){
          getPortfolio(params.id);
        }
        else if (isAuthenticated===false){
          getPortfolioAsGuest(params.id);
        }
    }
    if (Object.keys(page).length === 0 || portfolio._id !== params.id || !(page.name === params.pagename || (page.main && params.pagename===undefined))) {
      if (isAuthenticated){
        getPage(params.id, params.pagename);
      }
      else if (isAuthenticated===false){
        getPageAsGuest(params.id, params.pagename);
      }
    }
    if (Object.keys(portfolio).length !== 0 && Object.keys(page).length !== 0){
      getTheme(portfolio.theme, 'portfolio', '');
    }
    if (Object.keys(items).length !== 0){
      items.forEach(object => {
        if (object.theme)
        getTheme(object.theme, 'item', object._id);
      });
    }
  }
  }, [getPortfolio, portfolio, getPage, page, loadUser, isAuthenticated, getTheme]);
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
    <Box>
      {Object.keys(error).length!==0 ? 
        <Box className={themeStyle.content}>
          <Typography variant='h3' color='textPrimary'>You are not authorised to view this portfolio.</Typography>
        </Box> :
        <Box>
          <ThemeProvider theme={headerTheme}>
            <CssBaseline/>
            <PortfolioHeader classes={classes} portfolio={portfolio} savePortfolio={savePortfolio} savedPortfolios={savedPortfolios}></PortfolioHeader>
          </ThemeProvider>
          <ThemeProvider theme={muiTheme}>
            <CssBaseline/>
            <View portfolio={portfolio} error={error} savePortfolio={savePortfolio} savedPortfolios={savedPortfolios} itemMuiThemes={itemMuiThemes} groupedItems={groupedItems} rowLengths={rowLengths} params={params} classes={classes} themeStyle={themeStyle} history={history} muiTheme={muiTheme} headerTheme={headerTheme}></View>
          </ThemeProvider>
        </Box>
      }
    </Box>
  )
}

const PortfolioHeader = ({classes, portfolio, savePortfolio, savedPortfolios}) => {
  classes = useStyles();

  const isSaved = savedPortfolios.some((e) => e._id === portfolio._id);

  return (
    <Box className={classes.content}>
        <Typography variant='h1' color='textPrimary'>{portfolio.name}
        <IconButton aria-label="save" onClick={() => savePortfolio(portfolio._id)}>
            {isSaved ? <StarIcon/> : <StarBorderIcon/>}
        </IconButton>
        </Typography>
        <div className={classes.socialLinks}>
            {Object.keys(portfolio).includes("socialmedia") && portfolio.socialmedia.facebook !== "" && <Button className={classes.socialMedia} style={{backgroundColor:"#4267B2"}} onClick={() => window.location.href=portfolio.socialmedia.facebook}><Facebook/></Button>}
            {Object.keys(portfolio).includes("socialmedia") && portfolio.socialmedia.instagram !== "" && <Button className={classes.socialMedia} style={{backgroundColor:"#DD2A7B"}} onClick={() => window.location.href=portfolio.socialmedia.instagram}><Instagram/></Button>}
            {Object.keys(portfolio).includes("socialmedia") && portfolio.socialmedia.twitter !== "" && <Button className={classes.socialMedia} style={{backgroundColor:"#1DA1F2"}} onClick={() => window.location.href=portfolio.socialmedia.twitter}><Twitter/></Button>}
            {Object.keys(portfolio).includes("socialmedia") && portfolio.socialmedia.linkedin !== "" && <Button className={classes.socialMedia} style={{backgroundColor:"#2867B2"}} onClick={() => window.location.href=portfolio.socialmedia.linkedin}><LinkedIn/></Button>}
        </div>
    </Box>
  );
}

const View = ({portfolio, itemMuiThemes, groupedItems, rowLengths, params, classes, history, muiTheme, headerTheme }) => {
  classes = useStyles();
  const getItemTheme = (itemID) => {
    if (itemMuiThemes.length > 0){
      return itemMuiThemes.find((theme)=>{
        return theme.id === itemID
      });
    }
  }
    return (
      <Fragment>
        {groupedItems.map((item, i)=>
          <Grid container
            className={`${classes.gridPadding} ${classes.secondaryColor}`}>
              {item.map((object) => CardTheme(classes, rowLengths, params.id, object, history, portfolio.user, getItemTheme(object._id), muiTheme, headerTheme))}
          </Grid>)}
      </Fragment>
    );
  
}

const CardTheme = (classes, rowLengths, portfolioID, object, history, owner, customTheme, muiTheme, headerTheme ) => {
  return (
    <Grid item xs={12/rowLengths[object.row]} className={`${classes.viewGridItem} ${classes.cardPadding} ${classes.secondaryColo}`} key={object._id}>
      <ThemeProvider theme={customTheme ? customTheme.theme : muiTheme}>
        <CssBaseline/>
          <ItemCard classes={classes} rowLengths={rowLengths} portfolioID={portfolioID} object={object} history={history} owner={owner} muiTheme={muiTheme} headerTheme={headerTheme}></ItemCard>
      </ThemeProvider>
    </Grid>
  );
}

const ItemCard = ({classes, rowLengths, portfolioID, object, history, owner, muiTheme, headerTheme}) => {
  classes = useStyles();
  return (
    <Card className={`${classes.cardRoot} ${classes.primaryColor}`}>
      {object.mediaType === 'image' && <CardMedia
          className={classes.media}
          image={object.mediaLink}
        />}
      {(object.title || object.subtitle) && <CardHeader
        className={classes.viewGridItemCardHeader}
        classes={{title:classes.titleText}}
        title={object.title}
        subheader={object.subtitle}
        titleTypographyProps={{
          variant:'h3',
          color: 'textPrimary'
        }}
        subheaderTypographyProps={{
          variant:'subtitle1',
          color: 'textPrimary'
        }}
      />}
      {object.paragraph&& <CardContent>
        {object.paragraph && <Typography variant='body2' component='p' color='textPrimary'>
          {object.paragraph}
        </Typography>}
      </CardContent>}
      <ThemeProvider theme={headerTheme}>
        <CssBaseline/>
        <CardActionsThemed classes={classes} object={object} history={history} owner={owner} portfolioID={portfolioID}></CardActionsThemed>
      </ThemeProvider>
    </Card>
  )
}

const CardActionsThemed = ({classes, object, history, owner, portfolioID}) => {
  classes = useStyles();

  return (
    <CardActions className={classes.viewCardActions}>
      <Button size='small'
        color='textPrimary'
        onClick={()=> {if (object.linkAddress.includes("http")){window.location.href = object.linkAddress} else {history.push('/view/' + portfolioID + '/' + object.linkAddress); history.go(0);}}}>
          {object.linkText}
      </Button>  
      <Comment itemID={object._id} owner={owner}/>
    </CardActions>
  )
}


ViewTheme.propTypes = {
  getPage: PropTypes.func.isRequired,
  page: PropTypes.object.isRequired,
  getPortfolio: PropTypes.func.isRequired,
  portfolio: PropTypes.object.isRequired,
  loadUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  error: PropTypes.object,
  getPortfolioAsGuest: PropTypes.func.isRequired,
  getSaved: PropTypes.func.isRequired,
  savePortfolio: PropTypes.func.isRequired,
  getPageAsGuest: PropTypes.func.isRequired,
  getTheme: PropTypes.func.isRequired,
  muiTheme: PropTypes.object.isRequired,
  itemMuiThemes: PropTypes.arrayOf(PropTypes.object).isRequired,
  headerTheme: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  page: state.eportfolio.page,
  savedPortfolios: state.eportfolio.savedPortfolios,
  portfolio: state.eportfolio.portfolio,
  isAuthenticated: state.auth.isAuthenticated,
  error: state.eportfolio.error,
  muiTheme: state.eportfolio.muiTheme,
  itemMuiThemes: state.eportfolio.itemMuiThemes,
  headerTheme: state.eportfolio.headerTheme
});

export default connect(mapStateToProps, {getPage, getPortfolio, loadUser, getPortfolioAsGuest, getSaved, savePortfolio, getPageAsGuest, getTheme})(ViewTheme);
