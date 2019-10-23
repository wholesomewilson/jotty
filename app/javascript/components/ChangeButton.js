import React from 'react';
import Button from '@material-ui/core/Button';

class ChangeButton extends React.Component {
  handleClick = () => {
    this.props.onClickChangeButton(this.props.changedbutton);
  }

  render() {
    return (
      <Button size="small" variant="contained" color={this.props.buttonName.color} disable={this.props.buttonName.disabled} href={this.props.buttonHref} target="_blank" onClick = {this.handleClick}>{this.props.buttonName.name}</Button>
    );
  }
}

export default ChangeButton;
