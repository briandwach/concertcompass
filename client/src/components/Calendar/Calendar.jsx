import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Calendar = ({ dateRange, onDateRangeChange }) => {
  const [startDate, setStartDate] = useState(dateRange[0]);
  const [endDate, setEndDate] = useState(dateRange[1]);

  // Update the state whenever the dateRange prop changes
  useEffect(() => {
    setStartDate(dateRange[0]);
    setEndDate(dateRange[1]);
  }, [dateRange]);

  // Handle the change of the selected date range
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    // Pass the updated date range to the parent component
    onDateRangeChange([start, end]);
  };

  // Prevent the mobile keyboard from appearing when the input is focused
  const handleFocus = (e) => {
    e.target.blur(); // Blurs the input field, preventing keyboard pop-up
  };

  return (
    <div className="ml-5">
      <DatePicker
        className="w-[235px]"
        showIcon
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={handleDateChange}
        minDate={new Date()}
        onFocus={handleFocus}
        onClick={handleFocus} // Prevent mobile keyboard on focus
        isClearable
        placeholderText="Select start and end date"
      />
    </div>
  );
};

export default Calendar;