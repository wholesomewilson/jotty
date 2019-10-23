import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import RemoveFriend from './RemoveFriend';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    margin: "10px 0",
  },
}));

// <Typography variant="h5" component="h3">
//   This is a sheet of paper.
// </Typography>

export default function Friend({fullname, friendId, removeFriend, buttonLabel, ban}){
  const classes = useStyles();

  return(
    <div>
      <Paper className={classes.root}>
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
          <Avatar style={{width: 30,height: 30, backgroundColor:"#3f51b5"}}>{fullname.charAt(0)}</Avatar>
          </Grid>
          <Grid item xs sm>
            <Grid item xs container direction="column">
              <Grid item xs>
              <Typography variant="body2" color="textSecondary" style={{ marginLeft:"10px" }}>
                {fullname}
              </Typography>
              </Grid>
            </Grid>
          </Grid>
            <RemoveFriend onClickRemoveFriend = {removeFriend} friendId = {friendId} buttonLabel = {buttonLabel} ban = {ban}/>
        </Grid>
      </Paper>
    </div>
  )
}
