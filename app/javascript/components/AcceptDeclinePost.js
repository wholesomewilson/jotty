import React from 'react';
import Button from '@material-ui/core/Button';

class AcceptDeclinePost extends React.Component {
  handleClick = () => {
    this.props.onClickAcceptDeclinePost(this.props.postId, this.props.posterfullname);
  }

  render() {
    return (
      <Button size="small" variant="contained" color={this.props.color} onClick = {this.handleClick} style={{ marginLeft:"15px" }}>{this.props.choice}</Button>
    );
  }
}

export default AcceptDeclinePost;
