import React from 'react';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

class SuggestedRecipient extends React.Component {
  handleClick = () => {
    this.props.onClickReturnUser(this.props.value);
  }

  render() {
    const label = this.props.value === this.props.current_user.id ? "Myself" : this.props.user.first_name
    return (
      <Chip avatar={<Avatar>{this.props.user.first_name.charAt(0)}</Avatar>} size="small" label={label} onClick = {this.handleClick} variant="outlined" color="primary"/>
    );
  }
}

export default SuggestedRecipient;
