import { error, success } from './notifications'
import axios from 'axios';

export const formatDate = d => {
  const YYYY = d.getFullYear();
  const MM = `0${d.getMonth() + 1}`.slice(-2);
  const DD = `0${d.getDate()}`.slice(-2);
  return `${YYYY}-${MM}-${DD}`;
}

export const handleAjaxError = (err) => {
  const error_code = err.response.status
  switch (error_code){
    case 401:
    return error('You need to login to continue!');
    default:
    return error('Something went wrong');
  }
  //console.warn(err);
};

export const handleFormError = (err) => {
  return error(err);
};

export const timezone_offset = () => {
  var rightNow = new Date();
  var std_time_offset = rightNow.getTimezoneOffset() / 60;
  return std_time_offset;
};

export const setup = () => {
  axios
    .get(`/api/currentusers.json`)
    .then( response => {
      console.log(response.data.setup)
      return response.data.setup;
    })
    .catch(handleAjaxError);
  //return setupval;
};

export const imagePath = (name) => {
  const images = require.context('../images', true)
  return images(name, true)
};

export const API_ROOT = 'http://localhost:3000';

export const API_WS_ROOT = 'ws://localhost:3000/cable';

export const HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export const userAgentCheck = () => {
  let userAgent;
  if (/android/i.test(window.navigator.userAgent)) {
    userAgent = 'android'
  }
  if (/iPad|iPhone|iPod/.test(window.navigator.userAgent) && !window.navigator.MSStream) {
    userAgent = 'ios'
  }
  return userAgent;
};

export const completeSetup = () => {
  let userInfo = {
    user:{
      setup: true
    }
  }
  axios
    .put(`/users`, userInfo)
    .then( (msg) => {
      success('Setup Completed');
      window.location.reload()
    })
    .catch(handleAjaxError);
}
