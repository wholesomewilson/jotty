import React from 'react';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import SuggestedRecipient from './SuggestedRecipient';
import DialpadIcon from '@material-ui/icons/Dialpad';
import Typography from '@material-ui/core/Typography';

class SuggestedList extends React.Component{
  constructor(props){
    super(props);
    this.renderSuggested = this.renderSuggested.bind(this);
  }

  renderSuggested(){
    const { suggestedList } = this.props;
    return suggestedList.map( user => {
      return <Grid item key={user.id}><SuggestedRecipient user={user} onClickReturnUser={this.props.selectSuggestedUser} value={user.id} current_user = {this.props.current_user}/></Grid>;
    });
  }

  handleDelete(){

  };

  render(){
    const myselfInfo = {first_name: this.props.current_user.first_name}
    return(
      <Grid>
      <Typography style={{marginBottom: "10px"}} variant="body2" display="block" color="textSecondary">Recipient</Typography>
        <Grid container direction="row" justify="flex-start" alignItems="center" spacing={1}>
          <Grid item><SuggestedRecipient user={myselfInfo} onClickReturnUser={this.props.selectSuggestedUser} value={this.props.current_user.id} current_user = {this.props.current_user}/></Grid>
          {this.renderSuggested()}
        </Grid>
        <Grid container direction="row" justify="flex-start" alignItems="center" style={{marginTop: '20px', marginBottom: '5px'}}>
          <Chip size="small" icon={<DialpadIcon />} label="Enter a Mobile Number" variant={this.props.enterMobileChipVariant} clickable color={this.props.enterMobileChipColor} onClick={this.props.onClickOpenMobile}/>
        </Grid>
      </Grid>
    );
  };
};

export default SuggestedList;
