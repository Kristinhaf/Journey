import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const julyStart = dayjs("2026-07-01");
const julyEnd = dayjs("2026-07-31");



function DateRangePicker({ fromDate, setFromDate, toDate, setToDate }) {
  
  const formatDate = (date) => date ? date.format("YYYY-MM-DD") : "null";

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        id="from-date-picker"
        label="From Date"
        value={fromDate}
        onChange={(newValue) => setFromDate(newValue)}
        minDate={julyStart}
        maxDate={toDate || julyEnd}
      />
      <DatePicker
        id="to-date-picker"
        label="To Date"
        value={toDate}
        onChange={(newValue) => setToDate(newValue)}
        minDate={fromDate || julyStart}
        maxDate={julyEnd}
      />
    </LocalizationProvider>
  );
}

export default DateRangePicker; 