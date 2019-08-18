import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { imagePath } from '../helpers/helpers';

const SetupTelegram = ({current_user_t_token}) => {
  const requestBot = `https://telegram.me/jottybot?start=${current_user_t_token}`
  const initbutton = {
    color: 'secondary',
    disabled: false,
    name: 'Activate'
  }
  const changedbutton = {
    color: 'default',
    disabled: true,
    name: 'Activated'
  }
  const [buttonName, changeButton] = useState(initbutton);
  return(
    <div style={{textAlign: 'center'}}>
      <br/>
      <h2>Telegram Notification</h2>
      <br />
      <img style={{width: '150px', height:'150px'}} src={imagePath('./telegram.png')} />
      <br />
      <br />
      <Button size='small' variant="contained" color={buttonName.color} disable={buttonName.disabled} href={requestBot} target="_blank" onClick= {() => changeButton(changedbutton)}>{buttonName.name}</Button>
    </div>
  );
}

export default SetupTelegram;
