import React, { useState } from "react";
import PromptSubscribe from './PromptSubscribe';
import axios from 'axios';
import {handleAjaxError} from '../helpers/helpers';
import { imagePath } from '../helpers/helpers';

const SetupPush = ({setuppush}) => (
    <div style={{textAlign:"center"}}>
      <br/>
      <h2>App Notification</h2>
      <h4>(for Android)</h4>
      <br/>
      <img style={{width: '150px', height:'150px', borderRadius:'17px'}} src={imagePath('./push.jpeg')} />
      <br/>
      <br />
      <PromptSubscribe setuppush={setuppush}/>
    </div>
  )

export default SetupPush;
