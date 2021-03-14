import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Card,
  IconButton,
  TextField,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ChatIcon from '@material-ui/icons/Chat';
import Helpers from './helpers/Helpers';
import {
  getComments,
  postComment,
  deleteComment,
  editComment,
} from '../../actions/eportfolio';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    maxWidth: '60ch',
  },
  card: {
    maxHeight: 200,
    overflow: 'auto',
    maxWidth: '65ch',
  },
  form: {
    '& > *': {
      margin: theme.spacing(1),
      width: 400,
    },
  },
  button: {
    float: 'right',
    right: '10px',
    bottom: '0px',
  },
}));

const Comment = ({
  getComments,
  postComment,
  deleteComment,
  editComment,
  comments,
  itemID,
  currentUser,
  owner,
}) => {
  const classes = useStyles();
  const [openPopup, setOpenPopup] = useState(false);
  const [textValue, setValue] = useState('');
  useEffect(() => {
    if (!Object.keys(comments).includes(itemID)) {
      getComments(itemID);
    }
  }, [comments]);

  const postCommentWrapper = (itemID, textField) => {
    postComment(itemID, textField);
    setValue('');
  };
  return (
    <>
      {(comments[itemID])? (
      <Helpers.Button
        variant='outlined'
        startIcon={<ChatIcon />}
        className={classes.button}
        onClick={() => {
          setOpenPopup(true);
        }}
        badgeNumber = {comments[itemID].length}
      />) : (
      <Helpers.Button
        variant='outlined'
        startIcon={<ChatIcon />}
        className={classes.button}
        onClick={() => {
          setOpenPopup(true);
        }}
      />)}
      <Helpers.Popup
        title='Comments'
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <Card className={classes.root}>
          <Card className={classes.card}>
            <List className={classes.root}>
              {Object.keys(comments).includes(itemID) ? (
                comments[itemID].map((comment) => {
                  return (
                    <React.Fragment key={comment.id}>
                      <ListItem key={comment.id} alignItems='flex-start'>
                        <ListItemAvatar>
                          <Avatar alt='avatar' src={comment.avatar} />
                          {/* Will need to add avatars later on */}
                        </ListItemAvatar>

                        <ListItemText
                          primary={<Typography>{comment.name}</Typography>}
                          secondary={comment.text}
                        />
                        {/* Check if user is owner of comment or item to display commentMenu */}
                        {(currentUser !== null && (currentUser.googleId === owner ||
                        currentUser.googleId === comment.from)) ? (
                          <CommentMenu
                            comment={comment}
                            deleteComment={deleteComment}
                            editComment={editComment}
                            itemID={itemID}
                            currentUser={currentUser}
                          />
                        ) : (
                          <div />
                        )}
                      </ListItem>
                      <Divider light />
                    </React.Fragment>
                  );
                })
              ) : (
                <div />
              )}
            </List>
          </Card>
          <form className={classes.form} noValidate autoComplete='off'>
            <TextField
              value={textValue}
              id='outlined-basic'
              variant='outlined'
              width='100%'
              onChange={(e) => setValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  postCommentWrapper(itemID, textValue);
                  e.preventDefault();
                }
              }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    edge='end'
                    aria-label='submit'
                    onClick={() => {
                      postCommentWrapper(itemID, textValue);
                    }}
                  >
                    <ArrowUpwardIcon />
                  </IconButton>
                ),
              }}
            />
          </form>
        </Card>
      </Helpers.Popup>
    </>
  );
};

function CommentMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [open, setOpen] = React.useState(false);

  const handleEditOpen = () => {
    setOpen(true);
    setAnchorEl(null);
  };

  const handleEditClose = () => {
    setOpen(false);
  };

  const [commentValue, setCommentValue] = useState(props.comment.text);
  return (
    <div>
      <IconButton edge='end' aria-label='more' onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {props.currentUser !== null && props.currentUser.googleId === props.comment.from ? (
          <div>
            <MenuItem onClick={handleEditOpen}>Edit</MenuItem>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby='form-dialog-title'
              maxWidth='sm'
              fullWidth
            >
              <DialogTitle id='form-dialog-title'>
                Edit Your Comment
              </DialogTitle>
              <DialogContent>
                <TextField
                  value={commentValue}
                  onChange={(e) => setCommentValue(e.target.value)}
                  id='comment'
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    editComment(
                      props.editComment(props.comment._id, commentValue)
                    );
                    setOpen(false);
                  }}
                  color='primary'
                >
                  Edit Comment
                </Button>
                <Button onClick={handleEditClose} color='primary'>
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        ) : (
          <div />
        )}

        <MenuItem
          onClick={() => {
            props.deleteComment(props.comment._id);
            setAnchorEl(null);
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}

Comment.propTypes = {
  getComments: PropTypes.func.isRequired,
  comments: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
  comments: state.eportfolio.comments,
  currentUser: state.auth.user,
  itemID: props.itemID,
  owner: props.owner,
});

export default connect(mapStateToProps, {
  getComments,
  postComment,
  deleteComment,
  editComment,
})(Comment);
