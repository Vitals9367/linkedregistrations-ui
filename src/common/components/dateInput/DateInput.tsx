import { DateInput as BaseDateInput, DateInputProps } from 'hds-react';
import React from 'react';

import isTestEnv from '../../../utils/isTestEnv';

const DateInput: React.FC<DateInputProps> = (props) => {
  return <BaseDateInput disableDatePicker={isTestEnv} {...props} />;
};

export default DateInput;
