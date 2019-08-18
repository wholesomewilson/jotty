import React, { useState, useEffect } from "react";
import SetupPush from './SetupPush';
import SetupTelegram from './SetupTelegram';
import SetupInstall from './SetupInstall';
import SetupAdd from './SetupAdd';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import {handleAjaxError, userAgentCheck, completeSetup} from '../helpers/helpers';

const Setup = ({ current_user }) => {
  const { t_token } = current_user;
  const { setuppush } = current_user;
  const userAgent = userAgentCheck();
  let setupPage = 0;
  const [setupCurrent, changeSetupPage] = useState(setupPage);
  return(
    <div>
      {setupCurrent == 0 ? <SetupTelegram current_user_t_token = {t_token} /> : null}
      {setupCurrent == 1 ? <SetupPush setuppush = {setuppush} /> : null}
      {setupCurrent == 2 ? userAgent == 'ios' ? <SetupInstall /> : <SetupAdd /> : null}
      <Button
      size='small'
      variant="contained"
      color="secondary"
      onClick={ () => {
        setupCurrent == 0 ? changeSetupPage(1) : setupCurrent == 1 ? changeSetupPage(2) : completeSetup()
        }
      }
      style={{float: 'right'}}>Next</Button>
    </div>
  )
}

export default Setup;
