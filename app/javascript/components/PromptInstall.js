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
      deferredPrompt: ''
    };
    this.installPWA = this.installPWA.bind(this)
  }

  componentDidMount(){
    self.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.setState({
        deferredPrompt: e
      }, () => {
        //console.log(this.state.deferredPrompt);
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

  subscribePush(){
    const csrfToken = document.querySelector("meta[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-Token"] = csrfToken;
    navigator.serviceWorker.ready
      .then((reg) => {
        let options = {
          userVisibleOnly: true,
          applicationServerKey: 'BEml3OHtzGWsySwKW-Xk2JFMr3kQtHYABXIvF8KH2mdqNQVu5mmQ3CYO1eBCj6jcBn4og9TDQOfd_dLbhlCpiro'
        };
        reg.pushManager.subscribe(options)
          .then((pushsub) => {
            let body = pushsub.toJSON()
            let userInfo = {
              user:{
                endpoint: body.endpoint,
                p256dh: body.keys.p256dh,
                auth: body.keys.auth,
                setup: true
              }
            }
            axios
            .put(`/users`, userInfo)
            .then( (msg) => {
              success('User Updated!');
              console.log(msg);
            })
            .catch((err) => {
              console.log(err)
            });
            console.log(body)
            console.log(body.endpoint);
            console.log(body.keys.p256dh);
            console.log(body.keys.auth);
          }, (err) => {
            console.log(err);
          });
      });
  }

  installPWA(){
    this.state.deferredPrompt.prompt();
  }

  render(){
    return(
      <div>
      {this.state.showButtonPush ? <Button size='small' variant="contained" color="secondary" onClick={this.subscribePush}>Subscribe Push!</Button> : null}
      <br/><br/>
      {this.state.showButtonInstall ? <Button size='small' variant="contained" color="secondary" onClick={this.installPWA}>Install App!</Button> : null}
      </div>
    );
  }
}

export default PromptInstall;
