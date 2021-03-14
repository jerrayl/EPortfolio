import React from 'react';
import { Box, CardActions, IconButton, Menu, MenuItem, Popover, Button } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useHistory } from 'react-router-dom';
import useStyles from './DashboardStyles';

// Currently using this component for the button and drop down menu
export default function IndividualMenu(props) {
    const classes = useStyles();
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const [popoverAnchor, setPopoverAnchor] = React.useState(null);
  
    const openPopover = (event, id) => {
      setPopoverAnchor(event.currentTarget);
      var index = window.location.href.lastIndexOf('/');
      setUrl(window.location.href.slice(0, index)+ '/' + 'view/' + id);
    };
  
    const popoverClose = () => {
      setPopoverAnchor(null);
    };
  
    // TODO: Copy success
    var [url, setUrl] = React.useState('');
    const copyClipboardLink = (elementId) => {
      document.getElementById(elementId).value = url;
      var textToCopy = document.getElementById(elementId);
      var range = document.createRange();
      range.selectNode(textToCopy);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('copy');
    }
  
    return(
      <Box>
        <CardActions className={classes.portfolioCardHeader}>
          <IconButton 
            aria-label='settings' 
            aria-controls={'menu-'+props.object.portfolio._id} 
            onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
        </CardActions>
        <Menu id={'menu-'+props.i}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                className={classes.portfolioCardMenu}
                classes={{
                  paper: classes.menuPaperRoot
                }}>
            <MenuItem onClick={() => history.push('/view/' + props.object.portfolio._id)}>View</MenuItem>
            {props.editable && <MenuItem onClick={() => history.push('/edit/' + props.object.portfolio._id)}>Edit</MenuItem>}
            {props.editable && <MenuItem onClick={() => {props.deletePortfolio(props.object.portfolio._id)}}>Delete</MenuItem>}
            <MenuItem onClick={(event)=>openPopover(event, props.object.portfolio._id)}>Get link</MenuItem>
        </Menu>
        <Popover id={'popover-'+props.i}
                anchorEl={popoverAnchor}
                onClose={popoverClose}
                open={Boolean(popoverAnchor)}
                classes={{
                  paper: classes.copyLinkPaperRoot
                }}>
          <textarea disabled id={'text-'+props.i} value={url} className={`${classes.textarea} ${classes.popoverContents}`}></textarea>
          <Button className={classes.popoverContents} variant='contained' color='primary' onClick={() => {copyClipboardLink('text-'+props.i)}}>Copy to clipboard</Button>
        </Popover>
      </Box>
    );
  
  }