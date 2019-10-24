import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import AlarmInfo from './AlarmInfo';
import PostForm from './PostForm';
import PostNotFound from './PostNotFound';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AlarmIcon from '@material-ui/icons/Alarm';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import AcceptDeclinePost from './AcceptDeclinePost';
import DeletePost from './DeletePost';

const Post = ({ post, updatePost, deletePost, acceptPost, declinePost, current_user }) => {

  const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    marginBottom: '15px',
    maxWidth: 500,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  lineheight0:{
    lineHeight: 0
  }
}));

  const classes = useStyles();

  if (!post) return <PostNotFound />;
  const timezone_offset = post.timezone_offset
  //const datemoment = moment(post.date).utc(true).format('MMMM DD YYYY dddd hh:mm:ss A')
  const createdmoment = moment(post.created_at).utc(true).format('MMMM DD YYYY hh:mm A')
  const datemoment = moment(post.date).utc(true).format('DD MMM YYYY hh:mm A')
  const alarmmomentdate = moment(post.alarm).utc(true).format('DD-MM-YYYY')
  const alarmmomenttime = moment(post.alarm).utc(true).format('hh:mm A')
  const posterfullname = post.poster.first_name + ' ' + post.poster.last_name
  const recipientfullname = post.recipient.first_name
  const currentuserfullname = current_user.first_name + ' ' + current_user.last_name
  const postersignoff = posterfullname === currentuserfullname ? 'Myself' : posterfullname
  return (
    <div>
      <Paper className={classes.paper}>
        <Grid container direction="row" justify="flex-end" alignItems="center">
        <Typography variant="subtitle2" color="textSecondary">
          {datemoment}
        </Typography>

        </Grid>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item>
            <Typography variant="subtitle1" style={{ minHeight:"10vh", padding:"5px 0" }}>
              {post.body}
            </Typography>
          </Grid>
          <Grid item>
          </Grid>
        </Grid>
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
          <Avatar aria-label="poster" style={{width: 30,height: 30}}>{post.poster.first_name.charAt(0)}</Avatar>
          </Grid>
          <Grid item xs sm>
            <Grid item xs container direction="column">
              <Grid item xs>
              <Typography variant="body2" color="textSecondary" style={{ marginLeft:"10px" }}>
                {postersignoff}
              </Typography>
              </Grid>
            </Grid>
          </Grid>
          { post.alarm ? <AlarmInfo alarmmomenttime={alarmmomenttime} alarmmomentdate={alarmmomentdate}/> : null }
        </Grid>
        <Grid container direction="row" justify="space-between" alignItems="center" style={{marginTop: '10px'}}>
          <Grid item>
            {
              current_user.id !== post.recipient_id ? <DeletePost onClickDeletePost = {deletePost} postId = {post.id} marginL ='0px'/> : null
            }
          </Grid>
          <Grid item>
            {
              post.recipient_id == current_user.id ?
              <div>
                <AcceptDeclinePost onClickAcceptDeclinePost = {declinePost} postId = {post.id} posterfullname = {posterfullname} choice ="Decline" color="secondary"/>
                <AcceptDeclinePost onClickAcceptDeclinePost = {acceptPost} postId = {post.id} posterfullname = {posterfullname} choice ="Accept" color="primary"/>
              </div>
                :
                <Typography variant="body2" color="textSecondary" style={{ marginLeft:"10px" }}>
                  Waiting for {recipientfullname} to accept
                </Typography>
            }
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

Post.propTypes = {
  post: PropTypes.shape(),
};

Post.defaultProps = {
  post: undefined
};

export default Post;
