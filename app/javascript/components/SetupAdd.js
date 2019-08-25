import React, { useState } from "react";
import {handleAjaxError} from '../helpers/helpers';
import { imagePath } from '../helpers/helpers';

const SetupInstall = () => (
    <div style={{textAlign:"center"}}>
      <br/>
      <h2>Install App</h2>
      <br/>
      <img style={{marginBottom: '10px'}} src={imagePath('./addtohomescreen.gif')} />
      <br/>
    </div>
  )

export default SetupInstall;
