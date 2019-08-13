import React, { Fragment, useState } from "react";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
import moment from 'moment';

function BasicDateTimePicker({ handleDate, existingDate, pickerlabel }) {
  let newDate = new Date();
  const [selectedDate, handleDateChange] = useState(newDate);
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <DateTimePicker
        value={existingDate ? existingDate : selectedDate}
        onChange={val => {
          handleDateChange(val.seconds(0).milliseconds(0));
          handleDate(val.seconds(0).milliseconds(0));
        }}
        label= {pickerlabel}
        disablePast
        minDateMessage="Date and Time is expired!"
        showTodayButton
      />
    </MuiPickersUtilsProvider>
  );
}

export default BasicDateTimePicker;
