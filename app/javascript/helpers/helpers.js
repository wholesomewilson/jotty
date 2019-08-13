import { error } from './notifications'
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
