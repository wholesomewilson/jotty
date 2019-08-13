import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const PostFilter = ({onClickPostFilterMy, onClickPostFilterOther, PostFilterMyColor, PostFilterOtherColor}) => (
  <div style={{textAlign: "center", marginTop:"20px"}}>
  <Grid
  container
  direction="row"
  justify="space-evenly"
  alignItems="flex-end"
  >
    <Button size="small" variant="contained" color={PostFilterMyColor} onClick={onClickPostFilterMy}>My Jotties</Button>
    <Button size="small" variant="contained" color={PostFilterOtherColor} onClick={onClickPostFilterOther}>Other Jotties</Button>
    </Grid>
  </div>
);

export default PostFilter;
