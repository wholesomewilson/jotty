import React from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { handleAjaxError } from '../helpers/helpers';
import { success } from '../helpers/notifications';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

class PromptInstall extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      setuppush: this.props.setuppush,
      loading: true,
    }
    this.subscribePush = this.subscribePush.bind(this)
  }

  subscribePush(){
    this.setState({
      loading: true
    });
    const csrfToken = document.querySelector("meta[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-Token"] = csrfToken;
    navigator.serviceWorker.ready
      .then((reg) => {
        reg.pushManager.getSubscription()
          .then((sub) => {
            if(sub == null){
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
                      setuppush: true
                    }
                  }
                  axios
                  .put(`/users`, userInfo)
                  .then( (msg) => {
                    success('Notification Activated');
                    this.setState({
                      setuppush: true,
                      loading: false
                    })
                  })
                  .catch((err) => {
                    console.log(err)
                  });
                }, (err) => {
                  console.log(err);
                });
            }else{
              let body = sub.toJSON()
              let userInfo = {
                user:{
                  endpoint: body.endpoint,
                  p256dh: body.keys.p256dh,
                  auth: body.keys.auth
                }
              }
              axios
              .put(`/users`, userInfo)
              .then( (msg) => {
                success('Notification Activated Again');
                this.setState({
                  loading: false
                })
              })
              .catch((err) => {
                console.log(err)
              });
            }
          })
      });

  }

  render(){
    return(
      <div style={{position: 'relative'}}>
        <Button size='small' variant="contained" disabled={this.state.loading} color={ this.state.setuppush ? 'default' : 'secondary' } onClick={this.subscribePush}>
          {this.state.setuppush? 'Activate' : 'Activate Again'}
        </Button>
        {this.state.loading && <CircularProgress size={24}
          style = {{
            position: 'absolute',
            marginTop: '3px',
            marginLeft: '5px',
          }}
        />}
      </div>
    );
  }
}

export default PromptInstall;
