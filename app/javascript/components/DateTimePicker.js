import React, { Fragment, useState } from "react";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
import moment from 'moment';

function BasicDateTimePicker({ handleDate, existingDate, pickerlabel }) {
  let newDate = new Date();
  const [selectedDate, handleDateChange] = useState(newDate);
  return (
    <Fragment>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DateTimePicker
          value={existingDate ? existingDate : selectedDate}
          onChange={val => {
            handleDateChange(val.seconds(0).milliseconds(0));
            handleDate(val.seconds(0).milliseconds(0));
          }}
          label= {pickerlabel}
          disablePast
          showTodayButton
        />
      </MuiPickersUtilsProvider>
    </Fragment>
  );
}

export default BasicDateTimePicker;
