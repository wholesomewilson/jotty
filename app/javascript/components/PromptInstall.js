import React from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { handleAjaxError } from '../helpers/helpers';
import { success } from '../helpers/notifications';

class PromptInstall extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      deferredPrompt: this.props.deferredPrompt,
      buttonAction: this.props.deferredPrompt == null ? { color: 'default', disabled: true , name: 'Installed' } : { color: 'secondary', disabled: null, name: 'Install App' }
    };
    this.installPWA = this.installPWA.bind(this)
  }

  componentDidMount(){
    self.addEventListener('appinstalled', () => {
      this.setState({
        buttonAction: { color: 'default', disabled: true , name: 'Installed' }
      })
    })
  }

  installPWA(){
    this.state.deferredPrompt.prompt();
  }

  render(){
    return(
      <div>
        <Button size='small' variant="contained" color={this.state.buttonAction.color} disabled={this.state.buttonAction.disabled} onClick={this.installPWA}>{this.state.buttonAction.name}</Button>
      </div>
    );
  }
}

export default PromptInstall;
