import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

const Calendar = ({ dateRange, onDateRangeChange }) => {
  const [startDate, setStartDate] = useState(dateRange[0]);
  const [endDate, setEndDate] = useState(dateRange[1]);

  useEffect(() => {
    // Update the component state when dateRange prop changes
    setStartDate(dateRange[0]);
    setEndDate(dateRange[1]);
  }, [dateRange]);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    // Pass the updated date range to the parent component
    onDateRangeChange([start, end]);
  };
  return (
    <div className='ml-5'>
    <DatePicker
      className='w-[235px]'
      showIcon
      selectsRange={true}
      startDate={startDate}
      endDate={endDate}
      onChange={handleDateChange}
      minDate={new Date()}
      closeOnScroll={true}
      isClearable={true}
      placeholderText='Select select and end date'
    />
    </div>
  );
}

export default Calendar;