import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { imagePath } from '../helpers/helpers';

const SetupTelegram = ({current_user_t_token}) => {
  const requestBot = `https://telegram.me/jottybot?start=${current_user_t_token}`
  let initbutton = false
  const [showNextButton, changeNextButton] = useState(initbutton);
  return(
    <div style={{textAlign: 'center'}}>
      <br/>
      <h2>Telegram Notification</h2>
      <br />
      <img style={{width: '150px', height:'150px'}} src={imagePath('./telegram.png')} />
      <br />
      <br />
      <Button size='small' variant="contained" color='secondary' href={requestBot} target="_blank" onClick= { () => changeNextButton(true)}>Activate</Button>
    </div>
  );
}

export default SetupTelegram;
