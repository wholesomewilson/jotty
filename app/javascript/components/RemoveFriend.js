import React from 'react';
import Button from '@material-ui/core/Button';

class RemoveFriend extends React.Component {
  handleClick = () => {
    this.props.onClickRemoveFriend(this.props.friendId, this.props.ban);
  }

  render() {
    return (
      <Button size="small" variant="contained" color="secondary" onClick = {this.handleClick}>{this.props.buttonLabel}</Button>
    );
  }
}

export default RemoveFriend;
