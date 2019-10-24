import React from 'react';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';

class DeletePost extends React.Component {
  handleClick = () => {
    this.props.onClickDeletePost(this.props.postId);
  }

  render() {
    return (
      <DeleteIcon style={{marginTop: '4px', marginLeft: this.props.marginL}} onClick= {this.handleClick}/>
    );
  }
}

export default DeletePost;
