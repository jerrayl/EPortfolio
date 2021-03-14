import React from 'react';
import { CssBaseline, Typography, CardMedia, Card, CardContent, CardHeader, IconButton, Box, CardActions, Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import {useStyles} from './editStyles';
import { ThemeProvider } from '@material-ui/core/styles';


export default function ItemCard({classes, rowLengths, portfolioID, object, history, handleDrawerOpen, handleDialogOpen, addItemWrapper, headerTheme}){
  classes = useStyles();
  return (
    <Box className={classes.cardGroup}>
      <Card className={classes.cardRoot}>
        {object.mediaType === 'image' && <CardMedia
            className={classes.media}
            image={object.mediaLink}
          />}
         <CardHeader
          classes={{title:classes.titleText, action:classes.unflex}}
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
          action={
            <div>
            <IconButton aria-label='edit' onClick={() => handleDrawerOpen(object._id)}>
              <EditIcon />
            </IconButton>
            <IconButton aria-label="delete" onClick={() => handleDialogOpen("ITEM", object._id)}>
            <DeleteIcon />
          </IconButton>
          </div>
          }
        />
          {object.paragraph&& <CardContent>
          {object.paragraph && <Typography variant='body2' component='p' color='textPrimary'>
            {object.paragraph}
          </Typography>}
        </CardContent>}
        <ThemeProvider theme={headerTheme}>
          <CssBaseline/>
          <CardActionsThemed classes={classes} object={object} history={history} portfolioID={portfolioID}></CardActionsThemed>
        </ThemeProvider>
      </Card>
    </Box>
    )
  }

  const CardActionsThemed = ({classes, object, history, portfolioID}) => {
    classes = useStyles();
  
    return (
      <CardActions className={classes.cardActions}>
        <Button size='small'
          color='textPrimary'
          onClick={()=> {if (object.linkAddress.includes("http")){window.location.href = object.linkAddress} else {history.push('/view/' + portfolioID + '/' + object.linkAddress); history.go(0);}}}>
            {object.linkText}
        </Button>
      </CardActions>
    )
  }