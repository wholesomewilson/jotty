import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const FriendFilter = ({onClickFriends, onClickBan, colorFriends, colorBans}) => (
  <div style={{textAlign: "center", marginTop:"20px", marginBottom:"16px"}}>
  <Grid
  container
  direction="row"
  justify="space-evenly"
  alignItems="flex-end"
  >
    <Button size="small" variant="contained" color={colorFriends} onClick={onClickFriends}>Friends</Button>
    <Button size="small" variant="contained" color={colorBans} onClick={onClickBan}>Ban List</Button>
    </Grid>
  </div>
);

export default FriendFilter;
