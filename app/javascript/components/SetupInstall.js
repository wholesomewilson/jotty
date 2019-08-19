import React, { useState } from "react";
import PromptInstall from './PromptInstall';
import axios from 'axios';
import {handleAjaxError} from '../helpers/helpers';
import { imagePath } from '../helpers/helpers';

const style = {
  width: '95px',
  height: '95px',
  border: '1px solid #E6E6E6',
  padding: '25px',
  borderRadius: '40px',
  boxShadow: '0 0 10px #E6E6E6',
}

self.addEventListener('beforeinstallprompt', (e) => {
  console.log(e)
  e.preventDefault();
});

const SetupInstall = () => (
    <div style={{textAlign:"center"}}>
      <br/>
      <h2>Install App</h2>
      <br/>
      <img style={style} src={imagePath('./bear.png')} />
      <br/>
      <br />
      <PromptInstall/>
    </div>
  )


export default SetupInstall;
