import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';

const PostFilter = ({onClickPostFilterMy, onClickPostFilterOther, onClickPostFilterPending, PostFilterMyColor, PostFilterOtherColor, PostFilterPendingColor, badgeInvisible, badgeNum}) => (
  <div style={{textAlign: "center", marginTop:"20px"}}>
  <Grid container direction="row" justify="space-evenly" alignItems="flex-end">
    <Button size="small" variant="contained" color={PostFilterMyColor} onClick={onClickPostFilterMy}>For Me</Button>
    <Button size="small" variant="contained" color={PostFilterOtherColor} onClick={onClickPostFilterOther}>For Others</Button>
    <Badge color="secondary" badgeContent={badgeNum} invisible={badgeInvisible}>
      <Button size="small" variant="contained" color={PostFilterPendingColor} onClick={onClickPostFilterPending}>Pending</Button>
    </Badge>
    </Grid>
  </div>
);

export default PostFilter;
