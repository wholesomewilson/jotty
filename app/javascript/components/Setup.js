import React from 'react';
import PromptInstall from './PromptInstall';
import axios from 'axios';
import {handleAjaxError} from '../helpers/helpers';

const csrfToken = document.querySelector("meta[name=csrf-token]").content;
axios.defaults.headers.common["X-CSRF-Token"] = csrfToken;
axios
  .get(`/api/currentusers.json`)
  .then( response => {
    /*
    this.setState({
      current_user: response.data,
    })
    */
    console.log(response.data)
  })
  .catch(handleAjaxError);

const Setup = () => (
  <div>
    <h1 style={{textAlign:"center"}}>Setup Page</h1>
    <PromptInstall/>
  </div>
);

export default Setup;
