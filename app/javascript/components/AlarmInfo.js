import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AlarmIcon from '@material-ui/icons/Alarm':

const AlarmInfo = ({ alarmmomenttime, alarmmomentdate }) => {

  return(
    <React.Fragment>
      <Grid item>
        <Typography variant="body2" color="textSecondary">
          <AlarmIcon style={{ marginTop:"5px", marginRight:"10px" }}/>
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body2" display="block" color="textSecondary">
          {alarmmomentdate}
        </Typography>
        <Typography variant="body2" display="block" color="textSecondary">
          {alarmmomenttime}
        </Typography>
      </Grid>
    </React.Fragment>
  )
}

export default AlarmInfo;
