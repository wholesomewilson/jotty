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
        <DateTimePicker/>
      </MuiPickersUtilsProvider>
    </Fragment>
  );
}

export default BasicDateTimePicker;
