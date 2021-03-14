import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Typography, Box, List, Card, CardContent, Icon, CardActionArea, GridList, GridListTile, Button, CardMedia } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add'
import {getUserEPortfolios, getEPortfolioThumbnail, deletePortfolio, getSaved} from '../../actions/eportfolio';
import { Link } from 'react-router-dom';
import Category from './DashboardCategory';
import IndividualMenu from './DashboardMenu';
import useStyles from './DashboardStyles';
import { useThemeStyle } from '../../styles/themes';
import img from '../../images/Quaranteam.png'

const Dashboard = ({getUserEPortfolios, userEPortfolios, getEPortfolioThumbnail, eportfolioThumbnails, deletePortfolio, getSaved, savedPortfolios}) => {
  const classes = useStyles();
  const theme = useThemeStyle();
  useEffect(() => {
    if (savedPortfolios.length === 0){
      getSaved();
    }
    if (userEPortfolios.length == 0){
      getUserEPortfolios();
    }
    ePortfolioIDs.forEach(id => {
      //getEPortfolioThumbnail(id);
    });
  }, [userEPortfolios, savedPortfolios]);
  var ePortfolioIDs = [];
  userEPortfolios.forEach(portfolio => {
    ePortfolioIDs.push(portfolio._id);
  });

  var arrayOfPortfolioObjects = [];
  for (let i = 0; i < userEPortfolios.length; i++) {
    arrayOfPortfolioObjects.push({
      portfolio: userEPortfolios[i],
      thumbnail: eportfolioThumbnails[i]
    })
  }

  const arrayOfSavedPortfolios = savedPortfolios.filter(e => e !== 'dummy item').map((e) => {return {portfolio: e}});
    
  return (
    <Box className={theme.content}>
      <Box className={classes.top}>
        <Typography variant='h2' className={classes.topTypo}>Welcome to your dashboard</Typography>
        <Link to='/create-eportfolio'>
          <Button
            className={classes.topButton}
            variant='contained' 
            color='primary'
            classes={{
              label: theme.buttonLabel
            }}>
            Create new
          </Button>
        </Link>
      </Box>
      
      <Category title='Your existing ePortfolios'></Category>
      <GridList className={classes.portfolioList}>
        {DisplayPortfolioItem(arrayOfPortfolioObjects, deletePortfolio, true)}
      </GridList>
      <Category title='Your favourited ePortfolios'></Category>
      <GridList className={classes.portfolioList}>
        {DisplayPortfolioItem(arrayOfSavedPortfolios, deletePortfolio, false)}
      </GridList>
    </Box>
  );
}


// Component to map each tile
function DisplayPortfolioItem(arrayOfPortfolioObjects, deletePortfolio, editable) {
  const classes = useStyles();
  const theme = useThemeStyle();
  return(
    arrayOfPortfolioObjects.map((object, i) => (
      <GridListTile className={classes.portfolioListItem} key={object.portfolio._id}>
        <Card className={classes.portfolioCard}>
          <CardMedia>
            <img src={img} alt='Portfolio Thumbnail' className={classes.cardThumbnail}></img>
          </CardMedia>
          <CardContent className={classes.cardContent}>
            <Box className={classes.cardContentTypo}>{object.portfolio.name}</Box>
          <IndividualMenu i={i} object={object} deletePortfolio={deletePortfolio} editable={editable}/>
          </CardContent>
        </Card>
        
      </GridListTile>
    ))
  );
}

Dashboard.propTypes = {
  getUserEPortfolios: PropTypes.func.isRequired,
  userEPortfolios: PropTypes.arrayOf(PropTypes.object).isRequired,
  savedPortfolios: PropTypes.arrayOf(PropTypes.object).isRequired,
  eportfolioThumbnails: PropTypes.arrayOf(PropTypes.string).isRequired,
  deletePortfolio: PropTypes.func.isRequired,
  getSaved: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  userEPortfolios: state.eportfolio.userEPortfolios,
  eportfolioThumbnails: state.eportfolio.eportfolioThumbnails,
  savedPortfolios: state.eportfolio.savedPortfolios
});

export default connect(mapStateToProps, { getUserEPortfolios, getEPortfolioThumbnail, deletePortfolio, getSaved })(Dashboard);
