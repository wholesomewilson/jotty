import React from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { handleAjaxError } from '../helpers/helpers';
import { success } from '../helpers/notifications';

class PromptInstall extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      deferredPrompt: null,
      showButtonPush: true,
      showButtonInstall: true,
    };
    this.installPWA = this.installPWA.bind(this)
  }

  componentDidMount(){
    self.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.setState({
        deferredPrompt: e
      }, () => {
        console.log(this.state.deferredPrompt);
      });
    });
    self.addEventListener('appinstalled', () => {
      window.location.reload()
      /*
      this.setState({
        showButton: false
      });
      */
    })
  }

  installPWA(){
    this.state.deferredPrompt.prompt();
  }

  render(){
    const buttonAction = this.state.deferredPrompt == null ? 'Installed' : 'Install App';
    return(
      <div>
        <Button size='small' variant="contained" color="secondary" onClick={this.installPWA}>{buttonAction}</Button>
      </div>
    );
  }
}

export default PromptInstall;
